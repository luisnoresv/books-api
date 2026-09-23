---
name: better-auth-integration
description: 'Use when working on authentication in this books-api project — Better Auth config in src/lib/auth.ts, protecting routes, session/token handling, or auth-related tables in src/db/schema.ts.'
---

# Better Auth Integration

## Current State

Better Auth **is already wired up** (not just planned):

- `src/lib/auth.ts` configures `betterAuth()` with the Drizzle SQLite adapter and the `openAPI()` plugin.
- `src/lib/create-app.ts` mounts the handler for all methods on `/api/auth/*`: `app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))`.
- `src/db/schema.ts` contains the Better Auth tables (`user` and related), generated/expected by the `better-auth` adapter.

## When to Use

- Adding session/token checks to a route
- Modifying Better Auth config or plugins
- Debugging `/api/auth/*` behavior
- Understanding why auth tables in `src/db/schema.ts` use raw SQL defaults instead of `$defaultFn`

## Protecting a Route

Add auth middleware to the route chain **before** the handler, not inside the handler body:

```typescript
// [feature].index.ts
export const featureRouter = createRouter()
	.use('/protected-path', requireAuthMiddleware) // validate session/token here
	.openapi(featureRoutes.create, featureHandlers.create);
```

Follow the existing Hono middleware conventions in `src/middlewares/` (e.g. `not-found.ts`, `custom-logger.ts`) for structure and error propagation via `src/lib/error-handler.ts`.

## Auth Table Convention Exception

Unlike the `books` table, Better Auth's `user`/session tables in `src/db/schema.ts` use:

```typescript
createdAt: integer('created_at', { mode: 'timestamp_ms' })
	.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
	.notNull(),
```

This deviates from the `$defaultFn(() => new Date())` convention used elsewhere — keep it as-is since it matches what the `better-auth` Drizzle adapter expects; do not "fix" it to match the books table pattern.

## Migration Note

Changes to auth tables still follow the [drizzle-migrations skill](../drizzle-migrations/SKILL.md) workflow (`db:push` in dev, `db:generate`/`db:migrate` in production).
