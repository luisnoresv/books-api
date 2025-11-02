import type { AppOpenAPI } from './types.js';

import { Scalar } from '@scalar/hono-api-reference';
import packageJSON from '../../package.json';

export function configureOpenAPI(app: AppOpenAPI) {
	app.doc('/doc', {
		openapi: '3.0.0',
		info: {
			version: packageJSON.version,
			title: 'Books API',
		},
	});

	const reference = Scalar({
		theme: 'fastify',
		defaultHttpClient: {
			targetKey: 'js',
			clientKey: 'fetch',
		},
		spec: {
			url: '/doc',
		},
	} as any) as unknown as import('hono').MiddlewareHandler;

	app.get('/reference', reference);
}
