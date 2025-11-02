import { createRouter } from '@/lib/create-app';
import { booksHandlers } from './books.handlers';
import { booksRoutes } from './books.routes';

export const booksRouter = createRouter()
	.openapi(booksRoutes.list, booksHandlers.list)
	.openapi(booksRoutes.create, booksHandlers.create)
	.openapi(booksRoutes.getOne, booksHandlers.getOne)
	.openapi(booksRoutes.patch, booksHandlers.patch)
	.openapi(booksRoutes.remove, booksHandlers.remove);
