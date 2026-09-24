---
name: route-contract-alignment
description: 'Use when changing a REST route in this books-api project to keep schema, OpenAPI contract, handlers, router registration, tests, and docs aligned.'
---

# Route Contract Alignment

## When to Use

- Adding a new resource route
- Changing request or response fields for an existing route
- Updating validation behavior, status codes, or route registration
- Reviewing whether a route change is fully wired through the repo

## Core Rule

This repo is **OpenAPI-first**:

1. Drizzle + Zod schemas define the data shape in `src/db/schema.ts`
2. `*.routes.ts` defines the public request/response contract with `createRoute`
3. `*.handlers.ts` implements the behavior against `c.req.valid(...)`
4. `*.index.ts` binds contracts to handlers through `.openapi(...)`
5. `src/app.ts` mounts feature routers under `/api`
6. `*.test.ts` verifies the mounted route behavior and validation responses

If one layer changes, check the adjacent layers in the same pass.

## Alignment Checklist

### 1. Schema layer

Update the relevant Zod-backed exports in `src/db/schema.ts`:

- `select...Schema`
- `insert...Schema`
- `patch...Schema`

These schemas are the source for route request/response shapes.

### 2. Route contract layer

Update `src/routes/[feature]/[feature].routes.ts`:

- keep route `path` values **feature-relative** (for example, `/books`, not `/api/books`)
- define request params/body from the matching schema exports
- keep status codes aligned with actual runtime behavior
- document validation failures as `400 Bad Request` where request validation applies

The `/api` prefix belongs to app mounting in `src/app.ts`, not the route contract path.

### 3. Handler layer

Update `src/routes/[feature]/[feature].handlers.ts`:

- read validated input from `c.req.valid('json')` and `c.req.valid('param')`
- return the same success status and payload shape described in `*.routes.ts`
- preserve repo error patterns such as `NotFoundError` and `catchErrors`

### 4. Router assembly layer

Update `src/routes/[feature]/[feature].index.ts`:

- register every contract/handler pair with `.openapi(route, handler)`
- keep names aligned so a missing route is obvious during review

### 5. App registration layer

When adding a new feature router, register it in `src/app.ts` so it is mounted under `/api`.

### 6. Test layer

Update `src/routes/[feature]/[feature].test.ts`:

- build the test app with the router mounted under `/api`
- verify happy paths against `/api/...`
- verify invalid params/body payloads return `400`
- use `testClient(app).api...` for typed client coverage

### 7. Docs surface

If the public API surface changed, update the user-facing route docs too:

- README endpoint examples or path tables, when they mention the affected route
- OpenAPI descriptions in `*.routes.ts`
- remember that the generated docs stay available at `/api/doc` and `/api/reference`

## Quick Review Questions

Before finishing a route change, verify:

- Does `src/db/schema.ts` still match what `*.routes.ts` accepts and returns?
- Do handler responses still match the documented success and error codes?
- Is the router registered in both `*.index.ts` and `src/app.ts` when needed?
- Do tests exercise the mounted `/api` path instead of an unmounted router path?
- If docs mention the route, do they still use the correct `/api/...` URL?
