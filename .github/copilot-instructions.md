# Books API - AI Coding Agent Instructions

## Architecture Overview

This is an **OpenAPI-first REST API** built with Hono, Drizzle ORM, and Turso (libSQL). The architecture prioritizes **end-to-end type safety** from database schema → API routes → OpenAPI documentation.

### Key Design Pattern: Schema-Driven Development

1. **Database schemas** (`src/db/schema.ts`) define tables using Drizzle ORM
2. **Zod validators** are auto-generated from schemas via `drizzle-zod`
3. **OpenAPI routes** (`*.routes.ts`) declare endpoints with Zod schemas
4. **Handlers** (`*.handlers.ts`) implement business logic with full type inference
5. **Routers** (`*.index.ts`) wire routes to handlers using `.openapi()` method

## Project Structure Conventions

```
src/routes/[feature]/
  ├── [feature].routes.ts    # OpenAPI route definitions (createRoute)
  ├── [feature].handlers.ts  # Route handler implementations
  ├── [feature].index.ts     # Router assembly (routes + handlers)
  └── [feature].test.ts      # Vitest unit tests
```

**Example**: Books feature demonstrates the complete pattern in `src/routes/books/`

## Critical Workflows

### Development Commands

- `bun run dev` - Start with hot-reload (uses tsx, NOT native Bun)
- `bun test` - Run Vitest tests (sets `LOG_LEVEL=silent` automatically)
- `bun run db:push` - Push schema changes to database (primary workflow)
- `bun run db:studio` - Visual database browser

### Database Workflow (Drizzle)

See the `drizzle-migrations` skill for the full dev/production workflow, timestamp conventions, and schema examples.

## Code Patterns & Conventions

### Import Aliases

- Use `@/` for all imports from `src/`: `import { db } from '@/db'`
- Omit the `.js` extension in import paths (e.g., `import { db } from '@/db'`)

### Environment Variables

- Validated via Zod in `src/env.ts` with custom refinements
- Access via `import env from '@/env'` - fails fast on startup if invalid
- `DATABASE_AUTH_TOKEN` required in production, optional in development

### OpenAPI Route Definition Pattern

```typescript
// *.routes.ts
export const create = createRoute({
	path: '/books',
	method: 'post',
	request: {
		body: jsonContentRequired(insertBooksSchema, 'Description'),
	},
	tags: ['Books'],
	responses: {
		[HttpStatusCodes.OK]: jsonContent(selectBooksSchema, 'Success'),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(insertBooksSchema),
			'Validation errors',
		),
	},
});
```

### Handler Type Safety Pattern

```typescript
// *.handlers.ts
const create: AppRouteHandler<BooksRoutes['create']> = async (c) => {
	const book = c.req.valid('json'); // Type-safe validated input
	const [inserted] = await db.insert(books).values(book).returning();
	return c.json(inserted, HttpStatusCodes.OK);
};
```

### Router Assembly Pattern

```typescript
// *.index.ts
export const booksRouter = createRouter()
	.openapi(booksRoutes.list, booksHandlers.list)
	.openapi(booksRoutes.create, booksHandlers.create);
// Chain all routes
```

### Testing Pattern

Use `testClient` from `hono/testing` for type-safe API testing:

```typescript
const client = testClient(createApp().route('/', booksRouter));
const response = await client.books.$post({
	json: { name: 'Book', isbn: '123', author: 'Author' },
});
```

## Key Files to Reference

- `src/lib/create-app.ts` - App factory with middleware pipeline
- `src/openapi/default-hook.ts` - Global validation error handler (returns 422)
- `src/openapi/helpers/` - Reusable OpenAPI response builders
- `src/middlewares/on-error.ts` - Global error handler (hides stack in production)

## Error Handling Conventions

### Global Error Handler

- Located in `src/middlewares/on-error.ts`
- Returns JSON with `message`, `status`, and `stack` (dev only)
- Stack traces hidden in production for security
- Custom status codes preserved from thrown errors

### Validation Errors

- Handled by `defaultHook` in `src/openapi/default-hook.ts`
- Returns 422 (UNPROCESSABLE_ENTITY) for schema validation failures
- Response format: `{ success: false, error: ZodError }`
- Applied globally via `defaultHook` in `createApp()`

### Not Found Errors

- Use `jsonContent(notFoundSchema, 'Not found')` from `@/lib/constants`
- Return 404 with `{ message: HttpStatusPhrases.NOT_FOUND }`
- Check database query results before responding

**Handler Pattern:**

```typescript
const getOne: AppRouteHandler<BooksRoutes['getOne']> = async (c) => {
	const { id } = c.req.valid('param');
	const book = await db.query.books.findFirst({
		where: (fields, operators) => operators.eq(fields.id, id),
	});

	if (!book) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(book, HttpStatusCodes.OK);
};
```

## Authentication & Authorization

Better Auth is already wired up (`src/lib/auth.ts`, mounted at `/api/auth/*`). See the `better-auth-integration` skill for protecting routes and auth table conventions.

## Important Notes

- **Runtime**: Uses Bun as package manager but tsx for dev server (not `bun --watch`)
- **Strict mode**: TypeScript strict mode enabled, prefer explicit types
- **No path params in Drizzle**: Use `.where(eq(table.id, id))` for updates/deletes
- **Status codes**: Import from `@/openapi/http-status-codes` and `http-status-phrases`
- **404 responses**: Use `jsonContent(notFoundSchema, 'Not found')` from `@/lib/constants`

## When Adding New Features

See the `new-feature-scaffold` skill for the full schema → routes → handlers → router → tests procedure.
