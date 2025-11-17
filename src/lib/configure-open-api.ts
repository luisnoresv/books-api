import type { AppOpenAPI } from './types.js';

import { Scalar } from '@scalar/hono-api-reference';
import packageJSON from '../../package.json';
import { API_PATH } from './constants.js';

const OPEN_API_PATH = `${API_PATH}/doc`;

export function configureOpenAPI(app: AppOpenAPI) {
	app.doc(OPEN_API_PATH, {
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
			url: OPEN_API_PATH,
		},
	} as any) as unknown as import('hono').MiddlewareHandler;

	app.get(`${API_PATH}/reference`, reference);
}
