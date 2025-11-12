import * as HttpStatusCodes from '@/openapi/http-status-codes';
import * as HttpStatusPhrases from '@/openapi/http-status-phrases';
import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import type { AppBindings } from './types';

// Custom Error Classes
export class NotFoundError extends Error {
	status = HttpStatusCodes.NOT_FOUND;
	constructor(message = HttpStatusPhrases.NOT_FOUND) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class ValidationError extends Error {
	status = HttpStatusCodes.BAD_REQUEST;
	constructor(message = 'Validation Error') {
		super(message);
		this.name = 'ValidationError';
	}
}

export class BadRequestError extends Error {
	status = HttpStatusCodes.BAD_REQUEST;
	constructor(message = HttpStatusPhrases.BAD_REQUEST) {
		super(message);
		this.name = 'BadRequestError';
	}
}

// Handler Wrapper Function with full type preservation
export function catchErrors<R extends RouteConfig>(
	handler: RouteHandler<R, AppBindings>
): RouteHandler<R, AppBindings> {
	return (async (c, next) => {
		try {
			return await handler(c, next);
		} catch (error) {
			console.error('Handler error:', error);

			// Handle custom errors with status codes
			if (error instanceof Error && 'status' in error) {
				return c.json({ message: error.message }, (error as any).status) as any;
			}

			// Handle Zod validation errors
			if (error instanceof ZodError) {
				return c.json(
					{
						message: 'Validation error',
						errors: error.issues,
					},
					HttpStatusCodes.BAD_REQUEST
				) as any;
			}

			// Default 500 error
			return c.json(
				{
					message:
						error instanceof Error
							? error.message
							: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR
			) as any;
		}
	}) as RouteHandler<R, AppBindings>;
}

// Global Error Handler Middleware
export const errorHandlerMiddleware: ErrorHandler = (err, c) => {
	console.error('Global error:', err);

	// Handle Zod validation errors (400)
	if (err instanceof ZodError) {
		return c.json(
			{
				message: 'Validation error',
				errors: err.issues,
				status: HttpStatusCodes.BAD_REQUEST,
			},
			HttpStatusCodes.BAD_REQUEST
		);
	}

	// Determine status code: prefer error.status; otherwise fall back to a sensible default
	const currentStatus =
		'status' in err && typeof (err as any).status === 'number'
			? ((err as any).status as number)
			: c.newResponse(null).status; // defaults to 200

	const statusCode =
		currentStatus !== HttpStatusCodes.OK
			? (currentStatus as number)
			: HttpStatusCodes.INTERNAL_SERVER_ERROR;

	const env = c.env?.NODE_ENV || process.env?.NODE_ENV;

	return c.json(
		{
			message:
				err instanceof Error && err.message
					? err.message
					: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
			stack: env === 'production' ? undefined : (err as any)?.stack,
			status: statusCode as any,
		},
		statusCode as any
	);
};
