import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const books = sqliteTable('books', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	isbn: text('isbn').notNull(),
	createdAt: text('created_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	updateAt: integer('updated_at', { mode: 'timestamp' })
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => new Date()),
});

export const selectBooksSchema = createSelectSchema(books);

export const insertBooksSchema = createInsertSchema(books, {
	name: (schema) => schema.min(1).max(255),
	isbn: (schema) => schema.min(1).max(20),
}).omit({
	id: true,
	createdAt: true,
	updateAt: true,
});

export const patchBooksSchema = insertBooksSchema.partial();
