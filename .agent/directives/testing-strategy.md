---
fitness_line_target: 380
fitness_line_limit: 450
fitness_char_limit: 33000
fitness_line_length: 100
split_strategy: "Move recipes to docs/engineering/testing-patterns.md and docs/engineering/testing-tdd-recipes.md; split by test level if needed"
---

# Testing and Development Strategy

## Tooling

- Vitest
- React Testing Library
- Supertest
- Playwright
- Stryker

## Philosophy

- ALWAYS test behaviour, NEVER test implementation
- Prefer pure functions and unit tests
- Always use TDD at ALL levels (unit, integration, E2E)
- Prefer unit tests over integration tests
- Prefer integration tests over E2E tests
- Unit and integration tests must not trigger IO. E2E and smoke tests may
  trigger IO only under their respective constraints below.
- NEVER create complex mocks, use simple mocks passed as arguments
  to the function under test. Complex mocks result in testing the
  mocks, and indicate that product code needs refactoring and
  simplification in order to be easily testable.
- ALL mocks MUST be simple fakes, passed as arguments to the function under test.
- NEVER test external functionality, that is not under our control
- NEVER add complex logic to tests - it risks testing the test code rather than the code under test
- Always ask what a test is proving - it should prove something useful about the code under test
- Each proof should happen ONCE - repeated proofs are fragile and waste resources
- NEVER manipulate global state in tests - no `process.env` reads
  or mutations, no `vi.stubGlobal`, no `vi.mock`, no `vi.doMock`.
  Product code must accept configuration as parameters. See
  [ADR-078][di].

## Rules

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests.
  Write tests **FIRST**. Red (failing _test_), Green (passing test,
  because product code is created at this point, _not before_),
  Refactor (improve the product code implementation, know that the
  _behaviour_ at the interface will remain proven by the test)
- **Test real behaviour, not implementation details** - We should
  be able to change _how_ something works without breaking the test
  that proves _that_ it works.
- **Test to interfaces, not internals** - Tests should be written
  to the interfaces, not the internals. Closely related to test
  behaviour not implementation.
- **Assert effects, not constants** - Test observable product
  behaviour through the interface, not the value of internal
  constants or configuration collections.
- **No useless tests** - Each test must prove something useful
  about the product code. If a test is only testing the test or
  mocks, delete it.
- **Do not test types** - Tests are for logic, types are explored
  through creating tests, but types cannot be tested. If test only
  tests types, delete it.
- **KISS: No complex logic in tests** - Complexity in tests is a
  signal that we need to step back and simplify, the code and the
  test.
- **KISS: No complex mocks** - Mocks should be simple and focused,
  no complex logic in mocks, or we risk testing the mocks rather
  than the code. Complex mocks are a signal that we need to step
  back and simplify the code or our approach.
- **No skipped tests** - Fix it or delete it. NEVER use `it.skip`,
  `describe.skip`, `it.skipIf`, or any other skipping mechanism.
  Skipped tests are silent failures waiting to happen. If a test
  cannot run (e.g., missing API key), the test MUST fail fast with
  a helpful error message explaining what is needed. Validation
  scripts that require external resources should be standalone
  scripts, not tests.
- **No ambient global state access** - Tests MUST NOT read or mutate
  `process.env`, use `vi.stubGlobal`, use `vi.mock`, or use
  `vi.doMock`. If a function needs configuration, refactor it to
  accept config as a parameter. See [ADR-078][di].
  Smoke composition roots — the Vitest runner config or spawn
  invocation — may read ambient env, validate it, and inject the
  result. Test files and setup files must not read or mutate
  `process.env`.

[di]: ../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md

- **No process spawning in in-process tests** - Test code MUST NOT
  spawn child processes, create test-authored workers, or
  instantiate tools that internally spawn processes (e.g.
  programmatic ESLint with TypeScript project service). This
  excludes vitest's own configured pool — the restriction is on
  what _test code_ does, not the runner. Process spawning creates
  handles that prevent clean worker exit, causes CI hangs, and
  violates the principle of using the right tool for the job. Use
  the right tool: ESLint for boundary enforcement, Playwright for
  browser testing, vitest for runtime logic.

## Definitions

### System Architecture Components

- Pure function: A function that has no side effects and returns
  the same result for the same input. Pure functions are the
  building blocks of all code. Pure functions have unit tests.
  Naming convention: `*.unit.test.ts`.
- Integration point: A point in the code where multiple units are
  brought together to effect change in the larger system. Typically
  this is where IO interfaces are injected as arguments to
  functions, and where other configuration occurs. Integration
  points define boundaries of responsibility. Integration points
  have integration tests. Naming convention:
  `*.integration.test.ts`.
- System: The complete MCP server exposed via stdio transport.
  Systems have E2E tests. Naming convention: `*.e2e.test.ts`.

### Test Types

#### In-process tests

In-process tests are tests that validate **code imported into the
test process**. The code under test runs in the same process as
the test runner. They are fast, specific, and do not produce side
effects. These tests are about testing CODE, not testing RUNNING
SYSTEMS.

- **Unit test**: A test that verifies the behaviour of a single
  PURE function in isolation. Unit tests DO NOT trigger IO, have
  NO side effects, and contain NO MOCKS. Unit tests are
  automatically run in CI/CD.
- **Integration test**: A test that verifies the behaviour of a
  collection of units **working together as code**, NOT a running
  system. Integration tests still import and test code directly
  within the test process. They DO NOT trigger IO, have NO side
  effects and can contain SIMPLE mocks which must be injected as
  arguments to the function under test. Integration tests are
  automatically run in CI/CD and include MCP protocol compliance
  testing. **Important**: Integration tests are NOT about testing
  a deployed or running system - they test how multiple code units
  integrate when imported and called directly.

#### Out-of-process tests

Out-of-process tests are tests that validate a running _system_,
the tests and the system run in _separate processes_. They are
slower, are less specific in the causes of issues but cast a wider
net, and may produce side effects locally and in external systems.

- **E2E test**: A test that verifies the behaviour of a running
  system. E2E tests CAN exchange STDIO with the running system —
  this is the protocol channel that defines what an E2E test IS for
  stdio-transport systems (MCP stdio). E2E tests MUST NOT trigger
  filesystem IO, network IO, or any other side-effecting IO; the
  test's job is to drive the system over its protocol channel and
  assert on the response, not to manipulate the surrounding
  environment. E2E tests CAN have side effects strictly attributable
  to the running system itself, contain minimal mocks (largely around
  network IO inside the system), and MUST NOT spawn additional
  processes — only the runner harness boots the system. Naming
  alone (a `.e2e.test.ts` filename) does NOT exempt a test from
  in-process restrictions; classification is by **behaviour shape**
  (does the test exchange protocol with a separate running system?),
  not by filename suffix. A test that imports product code into the
  test process is an integration test even if named `.e2e.test.ts`.
  These constraints are to allow E2E tests to be safely run in CI/CD.

- **Smoke test**: A test that verifies the behaviour of a running
  system, locally or deployed. Smoke tests CAN trigger all IO
  types, DO have side effects, and DO NOT contain mocks.

#### Common Misconception: Integration Tests

**WRONG Understanding (Common but Incorrect):**

```typescript
// ❌ This is NOT an integration test - it's an E2E test
describe('API Integration Test', () => {
  it('should call the deployed API', async () => {
    const response = await fetch('http://localhost:3000/api/users');
    // Testing a RUNNING SYSTEM over HTTP
  });
});
```

**CORRECT Understanding (Our Definition):**

```typescript
// ✅ This IS an integration test - testing code units working together
import { UserService } from './user-service';
import { DatabaseAdapter } from './database-adapter';

describe('UserService Integration Test', () => {
  it('should retrieve users through the adapter', () => {
    const mockDb = { query: () => [{ id: 1, name: 'Alice' }] };
    const adapter = new DatabaseAdapter(mockDb); // Simple mock injected
    const service = new UserService(adapter);

    const users = service.getAllUsers();
    // Testing how CODE UNITS integrate, not a running system
    expect(users).toHaveLength(1);
  });
});
```

The key distinction: Integration tests import and test code
directly. They never spawn processes, make network calls, or test
deployed systems.

### Stubs vs Fakes

- **Runtime stubs**: plain functions that live in the SDK and are used in
  product code stub mode (e.g. `createStubRetrievalService`). They return
  canned data and have no test framework dependency.
- **Test fakes**: `vi.fn()` wrappers that live in `test-helpers/` directories
  and are used only in tests. They enable assertions on call counts, arguments,
  and return values.

Do not conflate the two. Runtime stubs are product code; test fakes are test
infrastructure.

### Design Approaches

- Test Driven Development (TDD): Write tests before writing code
  at ALL levels. Tests PROVE correctness and specify desired
  behaviour.
- Behaviour Driven Development (BDD): Write integration and E2E
  tests before writing code. These tests PROVE we are creating the
  **desired behaviour and impact** at the integration point and
  system level.

## TDD at All Levels

TDD applies to unit, integration, and E2E tests. Each level of tests
MUST be written to specify desired behaviour before implementation at
that level is created or changed. Worked examples live in
[Testing TDD Recipes][tdd-recipes].

### Rule Summary

| Test Level      | What It Specifies       | When to Write                   | RED Phase                    |
| --------------- | ----------------------- | ------------------------------- | ---------------------------- |
| **Unit**        | Pure function behaviour | Before function exists          | No function → test fails     |
| **Integration** | How units work together | Before integration exists       | Units not wired → test fails |
| **E2E**         | System behaviour        | Before system behaviour changes | Old behaviour → test fails   |

**Key Insight**: If tests lag behind code at ANY level, TDD was not followed at that level.

**File-naming for RED specs**: Write RED-phase specs that
specify not-yet-implemented behaviour in `*.e2e.test.ts`
files, not `*.unit.test.ts`. The pre-commit hook runs
type-check, lint, and the `test` task, so RED in-process
specs block commits until they go green. E2E specs are
outside pre-commit, but pre-push and CI run `test:e2e`;
they must be green before push/merge unless the owner
explicitly authorises staged WIP.

## Development Workflow

- ALWAYS USE TDD at ALL levels
- Use Vitest for all in-process tests (unit + integration)
- Use Supertest for HTTP-level E2E tests
- Use Playwright for UI E2E tests
- Use the MCP client SDK for MCP protocol E2E tests
- Use the canonical mocking approaches for the testing tools in use for a given test
- Tests live next to the code they test, not in a `test` directory
  - Unit tests live next to the pure function file containing the
    functions they test. They MUST end in `*.unit.test.ts`
  - Integration tests live next to the integration point file
    containing the integration points they test. They MUST end in
    `*.integration.test.ts`
  - E2E tests are an exception and live in the `e2e-tests`
    directory. This is because they test a running _system_ rather
    than importing code to test. They MUST end in `*.e2e.test.ts`

## When Behaviour Changes

**Rule**: Update tests at the SAME level as the behaviour change
FIRST, before changing implementation.

- **Pure function behaviour changes**: Update unit tests FIRST
- **Integration behaviour changes**: Update integration tests FIRST
- **System behaviour changes**: Update E2E tests FIRST

**Example**:

- If a protected endpoint should return a new status for a
  system-level condition
- Update E2E tests to specify that status first (RED phase)
- Then implement changes in code (GREEN phase)
- Then refactor internals (REFACTOR phase, tests stay green)

This ensures tests remain specifications, not just regression checks.

## Refactoring TDD

For refactoring that does not change public API (runtime behaviour
unchanged), the RED phase is compiler errors from signature
changes, not runtime test failures. Update test call sites first.
Existing tests ARE the safety net — run them before and after the
split, no new tests needed for internal restructuring.

For type-derivation fixes, use `satisfies` as a compile-time
anchor: `{ flat: 'value' } satisfies MyType` fails type-check if
the derivation is wrong, serving as the RED phase alongside
generator string-output tests.

## Canonical Vitest Configuration

Every workspace `vitest.config.ts` MUST follow one of two
patterns. Deviations cause silent test-category leaks (E2E tests
running under `pnpm test`, CI timeouts that don't reproduce
locally).

- **Pattern 1 (preferred)**: Import and re-export
  `baseTestConfig` from `vitest.config.base.ts` at the repo root.
  Adjust the relative path per workspace depth.
- **Pattern 2 (custom)**: Define a workspace-specific config.
  Non-negotiable: `exclude` MUST contain `'**/*.e2e.test.ts'`.
  `include` SHOULD use explicit conventions (`*.unit.test.ts`,
  `*.integration.test.ts`) not broad `*.test.ts` globs.

Workspaces with `*.e2e.test.ts` files MUST also have
`vitest.e2e.config.ts` (extending `vitest.e2e.config.base.ts` or
workspace-specific) and a `test:e2e` script in `package.json`.

## Test Assertion Placement

Keep E2E assertions on system/transport invariants; prove runtime
stub semantics in SDK unit/integration tests, not by asserting
server output against the same stub path.

## Test Configuration Gotchas

- `tsconfig.json` `include` patterns `**/*.test.ts` and
  `**/*.spec.ts` do NOT match test utility files (harness, fixture
  builder). Add `tests/**/*.ts` to the include array when creating
  non-test utilities in test directories.
- ESLint `projectService: true` uses the nearest
  `tsconfig.json`, not `tsconfig.lint.json`. Files must be
  included in both for linting to work.
- Stale vitest include globs are silent because of
  `passWithNoTests: true` — remove dead globs promptly after file
  moves.
- `resolveEnv` integration tests that need `.env` file isolation:
  use `'/tmp'` as `startDir` to prevent ambient `.env` files from
  satisfying schema requirements.
- After refactoring entry points (removing `dotenv`, changing
  `loadRuntimeConfig` signature), check E2E tests that launch the
  process directly — they break when the entry point contract
  changes.

## Test Data Anchoring

Tests that agree with code on the wrong contract are worse than
no tests. The snagging bugs that this repo encountered were
invisible because tests encoded the same wrong assumptions (e.g.
`keyStageSlugs` instead of the API's `keyStages`). Anchor test
fixtures to the schema or captured API responses, not to code
assumptions. Use `as const satisfies SDKType` to couple test data
to SDK type evolution.

## Test Isolation

- Replace Express `_router` access in tests with HTTP assertions
  via supertest — more resilient, tests actual behaviour.
- Repeated multi-line test setup → extract scoped helper inside
  `describe` block (e.g. `registerWithOverrides`, `baseEnv`).
- For large mechanical migrations (30+ files), use subagents to
  parallelise the work.
- Bulk operation factories should accept `startIndex` rather than
  mutating readonly `_id` after creation.

## Browser Proof Surfaces

Four browser-specific proof categories for UI-shipping workspaces:

1. **Accessibility audit** — Playwright + axe-core, WCAG 2.2 AA,
   zero-tolerance, both themes. 9th quality gate (blocking).
2. **Visual regression** — screenshot comparison baselines.
3. **Responsive validation** — viewport and fluid layout coverage.
4. **Theme/mode correctness** — light, dark, high-contrast passes.

For MCP App HTML resources: serve content directly to Playwright
(resource-level a11y), then verify via basic-host (integration-level).
See ADR-147, `docs/governance/accessibility-practice.md`.

[tdd-recipes]: ../../docs/engineering/testing-tdd-recipes.md
