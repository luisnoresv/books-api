# AGENTS.md

## Repo facts

- This repo is a Bun + Hono + Drizzle + libSQL API for books.
- App entrypoint: `src/index.ts` starts the server with `serve({ fetch: app.fetch, port })`.
- Main app wiring: `src/app.ts` mounts routes under `/api` and configures OpenAPI docs.
- Route boundary: feature routes live in `src/routes/books/*`; root route lives in `src/routes/index.route.ts`.
- Database schema is in `src/db/schema.ts`; it includes both the `books` table and Better Auth tables.
- Runtime alias: TypeScript path alias `@/*` resolves to `./src/*` via `tsconfig.json` and `vitest.config.ts`.

## Required setup

- Install deps: `bun install`
- Create a local `.env` before running the server or Drizzle commands. The required runtime config is enforced in `src/env.ts`:
  - `NODE_ENV` (default `development`)
  - `PORT` (default `3000`)
  - `LOG_LEVEL` (must be one of `fatal|error|warn|info|debug|trace|silent`)
  - `DATABASE_URL` (required; use `file:dev.db` locally)
  - `DATABASE_AUTH_TOKEN` only required when `NODE_ENV=production`
- Example env file is `.env.example`.

## Commands that matter

- Start dev server: `bun run dev`
- Run all tests: `bun test` (this script runs `LOG_LEVEL=silent vitest`)
- Run one test file: `bunx vitest run src/routes/books/books.test.ts`
- Generate migrations: `bun run db:generate`
- Apply migrations: `bun run db:migrate`
- Push schema directly: `bun run db:push`
- Full DB setup shortcut: `bun run db:setup` (this script currently calls `npm run db:push`)
- OpenAPI docs: `/api/doc` and `/api/reference` once the app is running

## Architecture notes

- `src/lib/create-app.ts` is the central app factory: it wires the favicon, logger, 404 middleware, global error handler, and auth passthrough for `/api/auth/*`.
- `src/lib/configure-open-api.ts` exposes the OpenAPI spec and Scalar reference UI.
- `src/routes/books/books.routes.ts` defines the public route contracts; `src/routes/books/books.handlers.ts` implements the actual CRUD logic.
- `src/lib/error-handler.ts` contains custom error classes and catch wrappers; keep route handlers consistent with these patterns.
- `drizzle.config.ts` points at `./src/db/schema.ts` and uses `dialect: 'turso'` with `casing: 'snake_case'`.

## Working conventions

- Prefer changes that keep the OpenAPI route schema and the handler aligned; those files are intentionally split.
- When touching routes, update the matching Zod schema in `src/db/schema.ts` and the route contract in `src/routes/books/books.routes.ts` together.
- Tests are route-level checks, not DB integration tests; they validate status codes and schema validation behavior with Hono `testClient`.
- Do not assume the project is a typical Express app; it is built on Hono and uses `@hono/zod-openapi` heavily.
- If a change affects environment loading, verify `src/env.ts` and `.env.example` together; this repo validates env at startup.
