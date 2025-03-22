import { NOT_FOUND } from '@/openapi/http-status-codes.js';
import { NOT_FOUND as NOT_FOUND_MESSAGE } from '@/openapi/http-status-phrases.js';
import type { NotFoundHandler } from 'hono';

export const notFound: NotFoundHandler = (c) => {
	return c.json(
		{
			message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
		},
		NOT_FOUND
	);
};
