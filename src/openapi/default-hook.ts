import type { Hook } from '@hono/zod-openapi';
import { BAD_REQUEST } from './http-status-codes';

export const defaultHook: Hook<any, any, any, any> = (result, c) => {
	if (!result.success) {
		return c.json(
			{
				success: result.success,
				error: result.error,
			},
			BAD_REQUEST
		);
	}
};
