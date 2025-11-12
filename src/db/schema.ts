import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const books = sqliteTable('books', {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	isbn: text().notNull(),
	author: text().notNull(),
	// Store timestamps as integer milliseconds since epoch for better type-safety
	// Use Drizzle-side default and update functions to avoid DB-specific functions in Studio Runner
	createdAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updateAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
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
