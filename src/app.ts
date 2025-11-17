import { configureOpenAPI } from '@/lib/configure-open-api';
import { API_PATH } from '@/lib/constants';

import { createApp } from '@/lib/create-app';
import { booksRouter } from '@/routes/books/books.index';
import { index } from '@/routes/index.route';

export const app = createApp();

const routes = [index, booksRouter];

configureOpenAPI(app);

routes.forEach((route) => {
	app.route(API_PATH, route);
});
