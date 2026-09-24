---
name: new-feature-scaffold
description: 'Use when adding a new REST resource/feature to this books-api project (new table + routes + handlers + router + tests), following the existing Books feature pattern.'
---

# New Feature Scaffold

## When to Use

Adding a new resource end-to-end (e.g. "add an `authors` feature", "create a new API resource").

## Procedure

1. **Schema** — add the table + Zod validators in `src/db/schema.ts` (see [drizzle-migrations skill](../drizzle-migrations/SKILL.md) for conventions), then `bun run db:push`.
2. **Directory** — create `src/routes/[feature]/` with four files, mirroring `src/routes/books/`:
   - `[feature].routes.ts` — OpenAPI route contracts via `createRoute`
   - `[feature].handlers.ts` — handler implementations
   - `[feature].index.ts` — wires routes to handlers
   - `[feature].test.ts` — Vitest tests using `testClient`
3. **Register** — add the new router to the routes array in `src/app.ts`.
4. **Test** — run `bunx vitest run src/routes/[feature]/[feature].test.ts`.

## Route Definition Pattern

```typescript
// [feature].routes.ts
export const create = createRoute({
	path: '/[feature]',
	method: 'post',
	request: { body: jsonContentRequired(insertSchema, 'Description') },
	tags: ['Feature'],
	responses: {
		[HttpStatusCodes.OK]: jsonContent(selectSchema, 'Success'),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createErrorSchema(insertSchema),
			'Validation errors',
		),
	},
});
```

Validation failures in this repo currently return `400 Bad Request`, wired through `src/openapi/default-hook.ts`.

## Handler Pattern

```typescript
// [feature].handlers.ts
const create: AppRouteHandler<FeatureRoutes['create']> = async (c) => {
	const item = c.req.valid('json');
	const [inserted] = await db.insert(table).values(item).returning();
	return c.json(inserted, HttpStatusCodes.OK);
};
```

Use `.where(eq(table.id, id))` for updates/deletes — no path-param shortcuts in Drizzle.

For not-found cases, return `jsonContent(notFoundSchema, 'Not found')` and check query results before responding:

```typescript
if (!item) {
	return c.json(
		{ message: HttpStatusPhrases.NOT_FOUND },
		HttpStatusCodes.NOT_FOUND,
	);
}
```

## Router Assembly Pattern

```typescript
// [feature].index.ts
export const featureRouter = createRouter()
	.openapi(featureRoutes.list, featureHandlers.list)
	.openapi(featureRoutes.create, featureHandlers.create);
```

## Test Pattern

```typescript
const app = createApp().route('/api', featureRouter);
const client = testClient(app);
const response = await client.api.feature.$post({ json: { ... } });
```

Use `/api` in both raw request assertions and typed client expectations so tests match the real app mount path.

Reference implementation: `src/routes/books/` (routes, handlers, index, tests).
