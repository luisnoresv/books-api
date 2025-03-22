import { customLogger } from '@/middlewares/custom-logger.js';
import { notFound } from '@/middlewares/not-found.js';
import { onError } from '@/middlewares/on-error.js';
import { serveEmojiFavicon } from '@/middlewares/server-emoji-favicon.js';
import { defaultHook } from '@/openapi/default-hook.js';
import { OpenAPIHono } from '@hono/zod-openapi';
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
	app.onError(onError);

	return app;
}

export function createTestApp(router: AppOpenAPI) {
	const app = createApp();
	app.route('/', router);

	return app;
}
