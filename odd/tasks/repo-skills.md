# Repo skills

## Goal
Add project-local skills that prevent route/test/contract drift in this books-api repository.

## Tasks
- [x] Define a `hono-route-testing` skill for route test setup, path mounting, and validation assertions.
- [x] Define a `route-contract-alignment` skill for keeping schema, route contracts, handlers, tests, and docs synchronized.
- [x] Verify the new skills are consistent with existing project conventions and current repo behavior.

## Notes
- Branch: `fix/first-batch-sanity`
- Scope: `.github/skills/hono-route-testing/SKILL.md`, `.github/skills/route-contract-alignment/SKILL.md`, `.github/skills/new-feature-scaffold/SKILL.md`
- Verification: readback against current repo behavior and existing skill style
- Commit: `7e31a28` — `docs(skills): add route testing alignment guidance`
- Result: the new skills encode `/api` route mounting, `400 Bad Request` validation behavior, and the OpenAPI-first sync checklist; `new-feature-scaffold` was narrowly corrected to stop teaching outdated patterns.
- Keep technical artifacts in English.
- Avoid touching unrelated user changes such as the existing `.gitignore` modification.
