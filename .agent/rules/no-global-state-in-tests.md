# No Global State Manipulation in Tests

Tests MUST NOT mutate global state. Prohibited in ALL tests (unit, integration, AND E2E):

- `process.env.X = 'value'` — mutates global state, causes race conditions
- `vi.stubGlobal('fetch', ...)` — mutates global objects
- `vi.mock('module', ...)` — manipulates module cache, leaks between files
- `vi.doMock('module', ...)` — manipulates module cache, subtle race conditions

Pass configuration as explicit function parameters. Simple fakes injected as constructor arguments, not complex mocks.

See `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md` for the full ADR.
