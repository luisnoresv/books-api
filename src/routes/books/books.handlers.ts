import { db } from '@/db';
import { books } from '@/db/schema';
import type { AppRouteHandler } from '@/lib/types';
import * as HttpStatusCodes from '@/openapi/http-status-codes';
import * as HttpStatusPhrases from '@/openapi/http-status-phrases';
import { eq } from 'drizzle-orm';
import type {
	CreateRoute,
	GetOneRoute,
	ListRoute,
	PatchRoute,
	RemoveRoute,
} from './books.routes';

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const books = await db.query.books.findMany();
	return c.json(books);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
	const book = c.req.valid('json');
	const [inserted] = await db.insert(books).values(book).returning();
	return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
	const { id } = c.req.valid('param');
	const book = await db.query.books.findFirst({
		where(fields, operators) {
			return operators.eq(fields.id, id);
		},
	});

	if (!book) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND
		);
	}

	return c.json(book, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
	const { id } = c.req.valid('param');
	const updates = c.req.valid('json');
	const [book] = await db
		.update(books)
		.set(updates)
		.where(eq(books.id, id))
		.returning();

	if (!book) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND
		);
	}

	return c.json(book, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
	const { id } = c.req.valid('param');

	const result = await db.delete(books).where(eq(books.id, id));

	if (result.rowsAffected === 0) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND
		);
	}

	return c.body(null, HttpStatusCodes.NO_CONTENT);
};
