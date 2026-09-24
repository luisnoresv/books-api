# First batch sanity

## Goal
Fix the immediate project sanity issues found during review: failing route test, validation status-code mismatch, and README/API path drift.

## Tasks
- [x] Align route tests with mounted `/api` paths and verify the books test suite passes.
- [x] Unify validation/error status expectations between runtime behavior, OpenAPI hook behavior, route contracts, and tests.
- [x] Sync README endpoint and documentation paths with the actual app behavior.

## Notes
- Branch: `fix/first-batch-sanity`
- Scope: `src/routes/books/books.test.ts`, `src/openapi/default-hook.ts`, `src/routes/books/books.routes.ts`, `src/lib/error-handler.ts`, `README.md`
- Verification: `bunx vitest run src/routes/books/books.test.ts`, `bun test`
- Commit: `736d37c` — `fix(api): align mounted route validation and docs`
- Result: route tests now use `/api`, validation failures are documented and declared as `400 Bad Request`, and README paths match the app.
- Avoid touching unrelated user changes such as the existing `.gitignore` modification.
