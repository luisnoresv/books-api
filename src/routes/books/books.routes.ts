import {
	insertBooksSchema,
	patchBooksSchema,
	selectBooksSchema,
} from '@/db/schema';
import { notFoundSchema } from '@/lib/constants';
import jsonContent from '@/openapi/helpers/json-content';
import jsonContentOneOf from '@/openapi/helpers/json-content-one-of';
import jsonContentRequired from '@/openapi/helpers/json-content-required';
import * as HttpStatusCodes from '@/openapi/http-status-codes';
import { createErrorSchema } from '@/openapi/schemas/create-error-schema';
import { IdParamsSchema } from '@/openapi/schemas/id-params';
import { createRoute, z } from '@hono/zod-openapi';

const tags = ['Books'];

export const list = createRoute({
	path: '/books',
	method: 'get',
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.array(selectBooksSchema),
			'The list of books'
		),
	},
});

export const create = createRoute({
	path: '/books',
	method: 'post',
	request: {
		body: jsonContentRequired(insertBooksSchema, 'The book to create'),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(selectBooksSchema, 'The created books'),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(insertBooksSchema),
			'The validation error(s)'
		),
	},
});

export const getOne = createRoute({
	path: '/books/{id}',
	method: 'get',
	request: {
		params: IdParamsSchema,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(selectBooksSchema, 'The requested book'),
		// [HttpStatusCodes.NOT_FOUND]: jsonContent(
		// 	z
		// 		.object({
		// 			message: z.string(),
		// 		})
		// 		.openapi({
		// 			example: { message: 'Book not found' },
		// 		}),
		// 	'The requested book'
		// ),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Book not found'),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			'Invalid id error'
		),
	},
});

export const patch = createRoute({
	path: '/books/{id}',
	method: 'patch',
	request: {
		params: IdParamsSchema,
		body: jsonContentRequired(patchBooksSchema, 'The book updates'),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(selectBooksSchema, 'The updated books'),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Book not found'),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			'Invalid id error'
		),
	},
});

export const remove = createRoute({
	path: '/books/{id}',
	method: 'delete',
	request: {
		params: IdParamsSchema,
	},
	tags,
	responses: {
		[HttpStatusCodes.NO_CONTENT]: { description: 'The book was deleted' },
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Book not found'),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
			[createErrorSchema(patchBooksSchema), createErrorSchema(IdParamsSchema)],
			'The validation error(s)'
		),
	},
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
