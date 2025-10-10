import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z, ZodError } from 'zod';

expand(config());

const EnvSchema = z
	.object({
		NODE_ENV: z.string().default('development'),
		PORT: z.coerce.number().default(3000),
		LOG_LEVEL: z
			.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
			.default('info'),
		DATABASE_URL: z.string().url(),
		DATABASE_AUTH_TOKEN: z.string().optional(),
	})
	.superRefine((input, ctx) => {
		if (input.NODE_ENV === 'production' && !input.DATABASE_AUTH_TOKEN) {
			ctx.addIssue({
				code: 'invalid_type',
				expected: 'string',
				received: 'undefined',
				path: ['DATABASE_AUTH_TOKEN'],
				message: "Must be set when NODE_ENV is 'production'",
			});
		}
	});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
	env = EnvSchema.parse(process.env);
} catch (e) {
	const error = e as ZodError;
	console.error('❌ Invalida env:');
	console.error(z.prettifyError(error));
	process.exit(1);
}

export default env;
