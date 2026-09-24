# Quality gates

## Goal
Add basic repository quality gates so test and typecheck run consistently locally and in CI.

## Tasks
- [x] Add a `typecheck` script to `package.json`.
- [x] Add a minimal GitHub Actions workflow to run install, typecheck, and tests.
- [x] Fix the existing TypeScript issues surfaced by the new `typecheck` gate.
- [x] Verify the local commands match the CI workflow and finish green.

## Notes
- Branch: `fix/first-batch-sanity`
- Scope: `package.json`, `.github/workflows/ci.yml`, `src/routes/books/books.test.ts`
- Verification: `bun run typecheck`, `bun test`
- Commit: `4d6c196` — `ci(api): add bun quality gates`
- Result: local and CI quality gates now align on install -> db prepare -> typecheck -> test, and the books test typing no longer blocks `tsc`.
- Keep scope minimal; do not introduce lint/format tooling unless already present.
- Avoid touching unrelated user changes such as the existing `.gitignore` modification.
