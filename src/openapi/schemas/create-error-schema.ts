import { z } from '@hono/zod-openapi';

import type { ZodSchema } from '@/lib/types';

export const createErrorSchema = <T extends ZodSchema>(schema: T) => {
	const { error } = schema.safeParse(schema instanceof z.ZodArray ? [] : {});
	return z.object({
		success: z.boolean().openapi({
			example: false,
		}),
		error: z
			.object({
				issues: z.array(
					z.object({
						code: z.string(),
						path: z.array(z.union([z.string(), z.number()])),
						message: z.string().optional(),
					})
				),
				name: z.string(),
			})
			.openapi({
				example: error,
			}),
	});
};
