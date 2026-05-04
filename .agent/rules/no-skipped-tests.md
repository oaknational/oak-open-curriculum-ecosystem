# No Skipped Tests

Operationalises [ADR-011 (Use Vitest for Testing)](../../docs/architecture/architectural-decisions/011-vitest-for-testing.md) and [ADR-121 (Quality Gate Surfaces)](../../docs/architecture/architectural-decisions/121-quality-gate-surfaces.md). See `.agent/directives/testing-strategy.md` for the full TDD discipline.

NEVER use `it.skip`, `describe.skip`, `test.todo`, `it.todo`, `xit`, `xdescribe`, or any other skipping or pending mechanism. Fix it or delete it. External-resource tests must fail fast with a helpful error, never skip.

Conditional execution is governed separately. See `.agent/rules/no-conditional-tests.md` for the prohibition on `skipIf`, `runIf`, runtime branching, and conditional assertions.

See `.agent/directives/principles.md` §Code Quality for the full policy.
