---
name: drizzle-migrations
description: 'Use when modifying src/db/schema.ts, running Drizzle/Turso migration commands (db:push, db:generate, db:migrate), or asked about database schema conventions in this books-api project.'
---

# Drizzle Migrations (Turso/libSQL)

## When to Use

- Adding/changing tables or columns in `src/db/schema.ts`
- Deciding between `db:push` and `db:generate`/`db:migrate`
- Questions about timestamp column conventions in this repo

## Workflow

**Development (fast iteration):**

1. Edit table definitions in `src/db/schema.ts`
2. Run `bun run db:push` — applies changes directly, no migration file generated
3. Inspect with `bun run db:studio`

**Production (required, versioned):**

1. Edit `src/db/schema.ts`
2. Run `bun run db:generate` — creates a timestamped SQL file in `src/db/migrations/`
3. Run `bun run db:migrate` — applies pending migrations
4. Never run `db:push` against production; it bypasses migration history

## Critical Convention: Timestamps

Use Drizzle-side defaults, not raw SQL, so Drizzle Studio can render values correctly:

```typescript
createdAt: integer({ mode: 'timestamp' })
	.$defaultFn(() => new Date())
	.notNull(),
updatedAt: integer({ mode: 'timestamp' })
	.$defaultFn(() => new Date())
	.$onUpdate(() => new Date()),
```

Avoid `default(sql'...')` for new tables — only the existing Better Auth tables in `src/db/schema.ts` use the `unixepoch` SQL form, kept for compatibility with the `better-auth` adapter's expectations.

## Zod Validators

Every table should export matching Zod schemas via `drizzle-zod`:

```typescript
export const selectBooksSchema = createSelectSchema(books);
export const insertBooksSchema = createInsertSchema(books, {
	name: (schema) => schema.min(1).max(255),
}).omit({ id: true, createdAt: true, updateAt: true });
export const patchBooksSchema = insertBooksSchema.partial();
```

These feed directly into route request/response schemas in `*.routes.ts` files.

## Config Reference

`drizzle.config.ts` points at `./src/db/schema.ts`, uses `dialect: 'turso'`, and `casing: 'snake_case'`.
