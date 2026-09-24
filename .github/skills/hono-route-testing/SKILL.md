---
name: hono-route-testing
description: 'Use when adding or updating route-level tests in this books-api project, especially Hono testClient coverage for feature routers mounted under /api.'
---

# Hono Route Testing

## When to Use

- Adding a `*.test.ts` file for a feature router
- Updating route-level assertions after changing request validation or route registration
- Debugging why a Hono `testClient` path does not match the mounted API path

## Current Repo Pattern

Tests in this repo are **route-level checks**, not DB integration tests. They exercise the feature router through the real app factory and assert:

- the router is mounted under `/api`
- `testClient` paths include `.api`
- invalid params/body payloads return `400 Bad Request`
- happy-path responses match the route contract shape

Reference implementation: `src/routes/books/books.test.ts`

## App + Client Setup

Mount the router the same way the application does: under `/api`, not `/`.

```typescript
import { createApp } from '@/lib/create-app';
import { testClient } from 'hono/testing';
import { featureRouter } from './feature.index';

const app = createApp().route('/api', featureRouter);
const client = testClient(app);
```

Use the `app.request()` form when you want to assert the literal HTTP path, and use `testClient(app)` when you want typed client calls.

```typescript
const response = await app.request('/api/feature');
expect(response.status).toBe(200);

const typedResponse = await client.api.feature.$get();
expect(typedResponse.status).toBe(200);
```

## Validation Response Convention

This repo currently returns `400 Bad Request` for OpenAPI/Zod validation failures.

That behavior comes from `src/openapi/default-hook.ts`, so route tests should assert `400`, not `422`.

```typescript
const response = await client.api.feature[':id'].$get({
	param: { id: 'wat' },
});

expect(response.status).toBe(400);
```

Do the same for invalid JSON bodies:

```typescript
const response = await app.request('/api/feature', {
	method: 'POST',
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify({ incomplete: true }),
});

expect(response.status).toBe(400);
```

## Test Checklist

1. Build the test app with `createApp().route('/api', featureRouter)`.
2. Use `client.api...` paths for `testClient` calls.
3. Keep at least one happy-path assertion for the mounted `/api/...` route.
4. Assert `400 Bad Request` for invalid params and invalid request bodies.
5. Keep assertions focused on route behavior and contract shape, not database internals.

## Common Pitfalls

- Mounting the router at `/` in tests, which hides the repo's real `/api` prefix.
- Using `client.feature...` instead of `client.api.feature...`.
- Expecting `422 Unprocessable Entity` when the repo currently standardizes on `400 Bad Request`.
- Turning route tests into DB-behavior tests instead of request/response contract checks.
