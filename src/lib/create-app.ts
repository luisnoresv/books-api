import { customLogger } from '@/middlewares/custom-logger.js';
import { notFound } from '@/middlewares/not-found.js';
import { serveEmojiFavicon } from '@/middlewares/server-emoji-favicon.js';
import { defaultHook } from '@/openapi/default-hook.js';
import { OpenAPIHono } from '@hono/zod-openapi';
import { auth } from './auth.js';
import { errorHandlerMiddleware } from './error-handler.js';
import type { AppBindings, AppOpenAPI } from './types.js';

export function createRouter() {
	return new OpenAPIHono<AppBindings>({
		strict: false,
	});
}

export function createApp() {
	const app = new OpenAPIHono<AppBindings>({
		strict: false,
		defaultHook,
	});
	app.use(serveEmojiFavicon('🚀'));
	app.use(customLogger());

	app.notFound(notFound);
	app.onError(errorHandlerMiddleware);

	// Auth routes
	app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

	return app;
}

export function createTestApp(router: AppOpenAPI) {
	const app = createApp();
	app.route('/api', router);

	return app;
}
