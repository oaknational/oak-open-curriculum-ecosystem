## Session 2026-03-31 — Napkin rotation (distillation)

Archived `napkin-2026-03-31.md` covering sessions 2026-03-24 to 2026-03-31.

Key new insight not yet in distilled.md (distilled at ceiling):

- **RED specs belong in E2E, not unit tests**: The pre-commit hook runs
  `pnpm turbo run type-check lint test` (in-process only). E2E tests run
  separately via `pnpm test:e2e`. RED specs that specify future behaviour
  should be `*.e2e.test.ts` so they don't block commits during the RED phase.
- **Assert effects, not constants**: Test `WIDGET_TOOL_NAMES.size > 0` asserts
  a constant value. Test "at least one tool in tools/list has
  `_meta.ui.resourceUri`" asserts product behaviour through the protocol. The
  latter survives refactoring; the former is fragile and tests configuration.
