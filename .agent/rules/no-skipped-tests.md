# No Skipped Tests

Operationalises [ADR-011 (Use Vitest for Testing)](../../docs/architecture/architectural-decisions/011-vitest-for-testing.md) and [ADR-121 (Quality Gate Surfaces)](../../docs/architecture/architectural-decisions/121-quality-gate-surfaces.md). See `.agent/directives/testing-strategy.md` for the full TDD discipline.

NEVER use `it.skip`, `describe.skip`, `it.skipIf`, or any other skipping mechanism. Fix it or delete it. External resource tests should fail fast with a helpful error, not skip.

See `.agent/directives/principles.md` §Code Quality for the full policy.
