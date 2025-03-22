import type { AppOpenAPI } from './types.js';

import { apiReference } from '@scalar/hono-api-reference';
import packageJSON from '../../package.json';

export function configureOpenAPI(app: AppOpenAPI) {
	app.doc('/doc', {
		openapi: '3.0.0',
		info: {
			version: packageJSON.version,
			title: 'Books API',
		},
	});

	app.get(
		'/reference',
		apiReference({
			theme: 'fastify',
			defaultHttpClient: {
				targetKey: 'javascript',
				clientKey: 'fetch',
			},
			spec: {
				url: '/doc',
			},
		})
	);
}
