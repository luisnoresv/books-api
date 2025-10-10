import { INTERNAL_SERVER_ERROR } from '@/openapi/http-status-codes.js';
import { OK } from '@/openapi/http-status-phrases.js';
import type { ErrorHandler } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

export const onError: ErrorHandler = (err, c) => {
	const currentStatus =
		'status' in err ? err.status : c.newResponse(null).status;
	const statusCode =
		currentStatus !== OK
			? (currentStatus as StatusCode)
			: INTERNAL_SERVER_ERROR;

	const env = c.env?.NODE_ENV || process.env?.NODE_ENV;
	return c.json({
		message: err.message,
		stack: env === 'production' ? undefined : err.stack,
		status: statusCode,
	});
};
