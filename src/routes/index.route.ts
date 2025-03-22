import { createRouter } from '@/lib/create-app';
import jsonContent from '@/openapi/helpers/json-content';
import * as HttpStatusCodes from '@/openapi/http-status-codes';
import { createMessageObjectSchema } from '@/openapi/schemas/create-message-object';
import { createRoute } from '@hono/zod-openapi';

export const index = createRouter().openapi(
	createRoute({
		tags: ['Index'],
		method: 'get',
		path: '/',
		responses: {
			[HttpStatusCodes.OK]: jsonContent(
				createMessageObjectSchema('Books API'),
				'Books API Index'
			),
		},
	}),
	(c) => {
		return c.json({ message: 'Books API' }, HttpStatusCodes.OK);
	}
);
