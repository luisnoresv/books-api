import { db } from '@/db';
import { books } from '@/db/schema';
import { catchErrors, NotFoundError } from '@/lib/error-handler';
import type { AppRouteHandler } from '@/lib/types';
import * as HttpStatusCodes from '@/openapi/http-status-codes';
import { eq } from 'drizzle-orm';
import type { BooksRoutes } from './books.routes';

const list: AppRouteHandler<BooksRoutes['list']> = catchErrors(async (c) => {
	const books = await db.query.books.findMany();
	return c.json(books, HttpStatusCodes.OK);
});

const create: AppRouteHandler<BooksRoutes['create']> = catchErrors(
	async (c) => {
		const book = c.req.valid('json');
		const [inserted] = await db.insert(books).values(book).returning();
		return c.json(inserted, HttpStatusCodes.OK);
	}
);

const getOne: AppRouteHandler<BooksRoutes['getOne']> = catchErrors(
	async (c) => {
		const { id } = c.req.valid('param');
		const book = await db.query.books.findFirst({
			where(fields, operators) {
				return operators.eq(fields.id, id);
			},
		});

		if (!book) {
			throw new NotFoundError('Book not found');
		}

		return c.json(book, HttpStatusCodes.OK);
	}
);

const patch: AppRouteHandler<BooksRoutes['patch']> = catchErrors(async (c) => {
	const { id } = c.req.valid('param');
	const updates = c.req.valid('json');
	const [book] = await db
		.update(books)
		.set(updates)
		.where(eq(books.id, id))
		.returning();

	if (!book) {
		throw new NotFoundError('Book not found');
	}

	return c.json(book, HttpStatusCodes.OK);
});

const remove: AppRouteHandler<BooksRoutes['remove']> = catchErrors(
	async (c) => {
		const { id } = c.req.valid('param');
		const result = await db.delete(books).where(eq(books.id, id));

		if (result.rowsAffected === 0) {
			throw new NotFoundError('Book not found');
		}

		return c.body(null, HttpStatusCodes.NO_CONTENT);
	}
);

export const booksHandlers = {
	list,
	create,
	getOne,
	patch,
	remove,
};
