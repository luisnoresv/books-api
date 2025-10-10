import type {
	OpenAPIHono,
	RouteConfig,
	RouteHandler,
	z,
} from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';

export type ZodSchema =
	| z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]>
	| z.ZodObject<any>
	| z.ZodArray<z.ZodObject<any>>;

export interface AppBindings {
	Variables: {
		logger: PinoLogger;
	};
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;
