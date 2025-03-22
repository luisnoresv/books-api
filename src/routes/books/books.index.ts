import { createRouter } from '@/lib/create-app';

import * as handlers from './books.handlers';
import * as routes from './books.routes';

export const booksRouter = createRouter()
	.openapi(routes.list, handlers.list)
	.openapi(routes.create, handlers.create)
	.openapi(routes.getOne, handlers.getOne)
	.openapi(routes.patch, handlers.patch)
	.openapi(routes.remove, handlers.remove);
