import { z } from '@hono/zod-openapi';

export const IdParamsSchema = z.object({
	id: z.coerce.number().openapi({
		param: {
			name: 'id',
			in: 'path',
			required: true,
		},
		required: ['id'],
		example: 42,
	}),
});
