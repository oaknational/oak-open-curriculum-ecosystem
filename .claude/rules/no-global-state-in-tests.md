---
paths:
  - '**/*.test.ts'
---

# No Global State Manipulation in Tests

Tests MUST NOT mutate global state. No `process.env.X = ...`, no `vi.stubGlobal`, no `vi.doMock`.
Pass configuration as explicit function parameters. Simple fakes, not complex mocks.

See `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md` for the full ADR.
