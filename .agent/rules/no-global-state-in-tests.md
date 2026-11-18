---
classification: situational
description: Keep tests isolated from global-state mutation
trigger: surface:test-authoring — tests, smokes, test helpers, fixtures and setup files
globs:
  - "**/*.test.*"
  - jcdotnet/e2e/**/*
  - agent-tools/e2e-tests/**/*
  - "**/smoke-tests/**/*"
  - "**/test-helpers/**/*"
  - "**/*setup.ts"
  - "**/tests/**/*"
  - "**/*fixture*.ts"
---

# No Global State Manipulation in Tests

Tests MUST NOT read or mutate global state. Prohibited in ALL tests
(unit and integration), and in the check files and setup files of an E2E
or smoke check (its composition root, below, is where ambient state enters):

- `process.env.X` reads — inherit ambient shell state and hide missing DI seams
- `process.env.X = 'value'` — mutates global state, causes race conditions
- `vi.stubGlobal('fetch', ...)` — mutates global objects
- `vi.mock('module', ...)` — manipulates module cache, leaks between files
- `vi.doMock('module', ...)` — manipulates module cache, subtle race conditions
- `vi.useFakeTimers()` and `vi.setSystemTime(...)` — replace the global clock and
  timers; a unit that reads the time or schedules work takes an injected
  clock or scheduler

Tests also must not touch ambient `.env` files or `process.cwd()`.
Pass configuration as explicit function parameters. Simple fakes are injected
as constructor arguments, not complex mocks.

A validation check's composition root — a smoke or E2E check's runner
config, global setup or entry script — may read ambient env, validate it,
and inject the result. Test files and a check's other setup files must not
read or mutate `process.env`.

Operationalises `.agent/directives/testing-strategy.md` §Rules (No ambient global state
access); the dependency-injection pattern is in `docs/engineering/testing-patterns.md`
§In-Process Tests with Dependency Injection.
