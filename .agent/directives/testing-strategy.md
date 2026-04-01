---
fitness_line_target: 410
fitness_line_limit: 550
fitness_char_limit: 33000
fitness_line_length: 100
split_strategy: "Extract examples to a companion examples file; split by test level (unit/integration/E2E) if needed"
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
- ALL IO MUST BE MOCKED, except in E2E tests
- NEVER create complex mocks, use simple mocks passed as arguments to the function under test. Complex mocks result in testing the mocks, and indicate that product code needs refactoring and simplification in order to be easily testable.
- ALL mocks MUST be simple fakes, passed as arguments to the function under test.
- NEVER test external functionality, that is not under our control
- NEVER add complex logic to tests - it risks testing the test code rather than the code under test
- Always ask what a test is proving - it should prove something useful about the code under test
- Each proof should happen ONCE - repeated proofs are fragile and waste resources
- NEVER manipulate global state in tests - no `process.env` mutations, no `vi.stubGlobal`, no `vi.mock`, no `vi.doMock`. Product code must accept configuration as parameters. See [ADR-078](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md).

## Rules

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (failing _test_), Green (passing test, because product code is created at this point, _not before_), Refactor (improve the product code implementation, know that the _behaviour_ at the interface will remain proven by the test)
- **Test real behaviour, not implementation details** - We should be able to change _how_ something works without breaking the test that proves _that_ it works.
- **Test to interfaces, not internals** - Tests should be written to the interfaces, not the internals. Closely related to test behaviour not implementation.
- **No useless tests** - Each test must prove something useful about the product code. If a test is only testing the test or mocks, delete it.
- **Do not test types** - Tests are for logic, types are explored through creating tests, but types cannot be tested. If test only tests types, delete it.
- **KISS: No complex logic in tests** - Complexity in tests is a signal that we need to step back and simplify, the code and the test.
- **KISS: No complex mocks** - Mocks should be simple and focused, no complex logic in mocks, or we risk testing the mocks rather than the code. Complex mocks are a signal that we need to step back and simplify the code or our approach.
- **No skipped tests** - Fix it or delete it. NEVER use `it.skip`, `describe.skip`, `it.skipIf`, or any other skipping mechanism. Skipped tests are silent failures waiting to happen. If a test cannot run (e.g., missing API key), the test MUST fail fast with a helpful error message explaining what is needed. Validation scripts that require external resources should be standalone scripts, not tests.
- **No global state manipulation** - Tests MUST NOT mutate `process.env`, use `vi.stubGlobal`, use `vi.mock`, or use `vi.doMock`. If a function needs configuration, refactor it to accept config as a parameter. See [ADR-078](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md).
- **No process spawning in in-process tests** - Test code MUST NOT spawn child processes, create test-authored workers, or instantiate tools that internally spawn processes (e.g. programmatic ESLint with TypeScript project service). This excludes vitest's own configured pool — the restriction is on what *test code* does, not the runner. Process spawning creates handles that prevent clean worker exit, causes CI hangs, and violates the principle of using the right tool for the job. Use the right tool: ESLint for boundary enforcement, Playwright for browser testing, vitest for runtime logic.

## Definitions

### System Architecture Components

- Pure function: A function that has no side effects and returns the same result for the same input. Pure functions are the building blocks of all code. Pure functions have unit tests. Naming convention: `*.unit.test.ts`.
- Integration point: A point in the code where multiple units are brought together to effect change in the larger system. Typically this is where IO interfaces are injected as arguments to functions, and where other configuration occurs. Integration points define boundaries of responsibility. Integration points have integration tests. Naming convention: `*.integration.test.ts`.
- System: The complete MCP server exposed via stdio transport. Systems have E2E tests. Naming convention: `*.e2e.test.ts`.

### Test Types

#### In-process tests

In-process tests are tests that validate **code imported into the test process**. The code under test runs in the same process as the test runner. They are fast, specific, and do not produce side effects. These tests are about testing CODE, not testing RUNNING SYSTEMS.

- **Unit test**: A test that verifies the behaviour of a single PURE function in isolation. Unit tests DO NOT trigger IO, have NO side effects, and contain NO MOCKS. Unit tests are automatically run in CI/CD.
- **Integration test**: A test that verifies the behaviour of a collection of units **working together as code**, NOT a running system. Integration tests still import and test code directly within the test process. They DO NOT trigger IO, have NO side effects and can contain SIMPLE mocks which must be injected as arguments to the function under test. Integration tests are automatically run in CI/CD and include MCP protocol compliance testing. **Important**: Integration tests are NOT about testing a deployed or running system - they test how multiple code units integrate when imported and called directly.

#### Out-of-process tests

Out-of-process tests are tests that validate a running _system_, the tests and the system run in _separate processes_. They are slower, are less specific in the causes of issues but cast a wider net, and may produce side effects locally and in external systems.

- **E2E test**: A test that verifies the behaviour of a running system. E2E tests CAN trigger STDIO IO but NOT filesystem or network IO, CAN have side effects, and contain minimal mocks, largely around network IO. These constrains are to allow the E2E tests to be safely run in CI/CD.

- **Smoke test**: A test that verifies the behaviour of a running system, locally or deployed. Smoke tests CAN trigger all IO types, DO have side effects, and DO NOT contain mocks.

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

The key distinction: Integration tests import and test code directly. They never spawn processes, make network calls, or test deployed systems.

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

- Test Driven Development (TDD): Write tests before writing code at ALL levels. Tests PROVE correctness and specify desired behaviour.
- Behaviour Driven Development (BDD): Write integration and E2E tests before writing code. These tests PROVE we are creating the **desired behaviour and impact** at the integration point and system level.

## TDD at All Levels

### TDD is Not Just for Unit Tests

**Critical Rule**: TDD applies to unit, integration, AND E2E tests. Each level of tests MUST be written to specify the desired behaviour, BEFORE the implementation is created or changed.

### Unit Test TDD (Micro-level)

**Cycle**: Red → Green → Refactor

1. **RED**: Write a unit test for a pure function that doesn't exist yet. Run the test. It MUST fail.
2. **GREEN**: Write the minimal implementation to make the test pass. Run the test. It MUST pass.
3. **REFACTOR**: Improve the implementation without changing behaviour. Tests MUST remain green.

**Example**:

```typescript
// 1. RED - Write test first
describe('calculateTotal', () => {
  it('sums array of numbers', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});
// Run test → FAILS (function doesn't exist)

// 2. GREEN - Minimal implementation
function calculateTotal(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0);
}
// Run test → PASSES

// 3. REFACTOR - Improve (if needed)
// Tests remain green
```

### Integration Test TDD (Component-level)

**Cycle**: Red → Green → Refactor

1. **RED**: Write integration test specifying how units work together. Run test. It MUST fail.
2. **GREEN**: Implement units and wire them together. Run test. It MUST pass.
3. **REFACTOR**: Improve integration without changing behaviour. Tests MUST remain green.

**Example**:

```typescript
// 1. RED - Write integration test first
describe('createMcpRouter', () => {
  it('should skip auth for discovery methods', async () => {
    const mockAuth = vi.fn();
    const router = createMcpRouter({ auth: mockAuth });
    const { req, res, next } = createMocks({
      body: { method: 'tools/list' },
    });

    await router(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(mockAuth).not.toHaveBeenCalled();
  });
});
// Run test → FAILS (createMcpRouter doesn't exist)

// 2. GREEN - Implement router
export function createMcpRouter(options: McpRouterOptions): RequestHandler {
  return (req, res, next) => {
    const method = getMethodFromBody(req.body);
    if (method && isDiscoveryMethod(method)) {
      next();
      return;
    }
    options.auth(req, res, next);
  };
}
// Run test → PASSES

// 3. REFACTOR - Extract helper functions, improve clarity
// Tests remain green
```

### E2E Test TDD (System-level)

**Cycle**: Red → Green → Refactor

**CRITICAL**: E2E tests are SPECIFICATIONS of system behaviour. When changing system behaviour, update E2E tests FIRST.

1. **RED**: Write E2E test specifying desired system behaviour. Run test against existing system. It MUST fail (old behaviour).
2. **GREEN**: Modify system implementation (often involving multiple units/integrations). Run test. It MUST pass (new behaviour).
3. **REFACTOR**: Improve system internals without changing external behaviour. E2E tests MUST remain green.

**Example - Correct TDD Sequence**:

```typescript
// SCENARIO: We want ALL MCP methods to require auth (per MCP 2025-11-25)

// 1. RED - Write E2E test FIRST specifying NEW behaviour
describe('MCP Server E2E', () => {
  it('returns 401 for tools/list without authentication', async () => {
    const response = await request(server).post('/mcp').send({ method: 'tools/list' });

    expect(response.status).toBe(401); // NEW expected behaviour
  });

  it('returns 401 for tools/call without authentication', async () => {
    const response = await request(server)
      .post('/mcp')
      .send({ method: 'tools/call', params: { name: 'get-key-stages' } });

    expect(response.status).toBe(401); // Was already 401, still 401
  });
});
// Run E2E test → FAILS (current system allows discovery without auth)

// 2. GREEN - Now implement changes
// - Update integration tests for createMcpRouter() (RED → GREEN)
// - Update unit tests for shouldSkipClerkMiddleware (RED → GREEN)
// - Remove auth bypasses from router and middleware
// Run E2E test → PASSES (system now requires auth for all methods)

// 3. REFACTOR - Delete dead code, update TSDoc
// E2E tests remain green
```

**Example - WRONG Sequence**:

```typescript
// ❌ VIOLATION: Updated implementation first, E2E tests after

// 1. Wrote new integration tests for router (good!)
// 2. Implemented router (implementation-first, not test-first at E2E level)
// 3. Discovered E2E tests now fail (they specified OLD behaviour)
// 4. Need to update E2E tests (should have been step 1!)

// This is NOT TDD at the E2E level
```

### TDD Rule Summary

| Test Level      | What It Specifies       | When to Write                   | RED Phase                    |
| --------------- | ----------------------- | ------------------------------- | ---------------------------- |
| **Unit**        | Pure function behaviour | Before function exists          | No function → test fails     |
| **Integration** | How units work together | Before integration exists       | Units not wired → test fails |
| **E2E**         | System behaviour        | Before system behaviour changes | Old behaviour → test fails   |

**Key Insight**: If tests lag behind code at ANY level, TDD was not followed at that level.

**File-naming for RED specs**: Write RED-phase specs that
specify not-yet-implemented behaviour in `*.e2e.test.ts`
files, not `*.unit.test.ts`. The pre-commit hook runs only
unit tests; a RED unit test blocks every commit until it
goes green. E2E specs are gated at CI, so they can stay RED
across multiple commits during the implementation phase.

## Common TDD Violations and Fixes

### Violation 1: Writing Code Before Tests

❌ **Wrong**:

```typescript
// Write implementation first
function add(a: number, b: number) {
  return a + b;
}

// Then write test
it('adds numbers', () => expect(add(1, 2)).toBe(3));
```

✅ **Correct**:

```typescript
// Write test FIRST
it('adds numbers', () => expect(add(1, 2)).toBe(3));
// Run → FAILS (add doesn't exist)

// Then write implementation
function add(a: number, b: number) {
  return a + b;
}
// Run → PASSES
```

### Violation 2: Updating E2E Tests After Implementation

❌ **Wrong**:

```typescript
// 1. Implement new feature in code
// 2. Run E2E tests → they fail (old spec)
// 3. Update E2E tests to match new implementation
```

✅ **Correct**:

```typescript
// 1. Update E2E tests to specify new behaviour FIRST
// 2. Run E2E tests → they fail (feature not implemented)
// 3. Implement feature
// 4. Run E2E tests → they pass
```

### Violation 3: Tests That Only Pass With Current Implementation

❌ **Wrong**:

```typescript
// Test that knows too much about implementation
it('calls internal method', () => {
  const spy = vi.spyOn(service, '_privateMethod');
  service.doThing();
  expect(spy).toHaveBeenCalled(); // Breaks if we refactor
});
```

✅ **Correct**:

```typescript
// Test that specifies behaviour
it('produces correct result', () => {
  const result = service.doThing();
  expect(result).toBe(expectedValue); // Survives refactoring
});
```

## Development Workflow

- ALWAYS USE TDD at ALL levels
- Use Vitest for all in-process tests (unit + integration)
- Use Supertest for HTTP-level E2E tests
- Use Playwright for UI E2E tests
- Use the MCP client SDK for MCP protocol E2E tests
- Use the canonical mocking approaches for the testing tools in use for a given test
- Tests live next to the code they test, not in a `test` directory
  - Unit tests live next to the pure function file containing the functions they test. They MUST end in `*.unit.test.ts`
  - Integration tests live next to the integration point file containing the integration points they test. They MUST end in `*.integration.test.ts`
  - E2E tests are an exception and live in the `e2e-tests` directory. This is because they test a running _system_ rather than importing code to test. They MUST end in `*.e2e.test.ts`

## When Behaviour Changes

**Rule**: Update tests at the SAME level as the behaviour change FIRST, before changing implementation.

- **Pure function behaviour changes**: Update unit tests FIRST
- **Integration behaviour changes**: Update integration tests FIRST
- **System behaviour changes**: Update E2E tests FIRST

**Example**:

- If discovery methods should work without auth (system behaviour change)
- Update E2E tests to specify this (RED phase)
- Then implement changes in code (GREEN phase)
- Then refactor internals (REFACTOR phase, tests stay green)

This ensures tests remain specifications, not just regression checks.

## Refactoring TDD

For refactoring that does not change public API (runtime behaviour unchanged), the RED phase is compiler errors from signature changes, not runtime test failures. Update test call sites first. Existing tests ARE the safety net — run them before and after the split, no new tests needed for internal restructuring.

For type-derivation fixes, use `satisfies` as a compile-time anchor: `{ flat: 'value' } satisfies MyType` fails type-check if the derivation is wrong, serving as the RED phase alongside generator string-output tests.

## Canonical Vitest Configuration

Every workspace `vitest.config.ts` MUST follow one of two patterns. Deviations cause silent test-category leaks (E2E tests running under `pnpm test`, CI timeouts that don't reproduce locally).

- **Pattern 1 (preferred)**: Import and re-export `baseTestConfig` from `vitest.config.base.ts` at the repo root. Adjust the relative path per workspace depth.
- **Pattern 2 (custom)**: Define a workspace-specific config. Non-negotiable: `exclude` MUST contain `'**/*.e2e.test.ts'`. `include` SHOULD use explicit conventions (`*.unit.test.ts`, `*.integration.test.ts`) not broad `*.test.ts` globs.

Workspaces with `*.e2e.test.ts` files MUST also have `vitest.e2e.config.ts` (extending `vitest.e2e.config.base.ts` or workspace-specific) and a `test:e2e` script in `package.json`.

## Test Assertion Placement

Keep E2E assertions on system/transport invariants; prove runtime stub semantics in SDK unit/integration tests, not by asserting server output against the same stub path.

## Test Configuration Gotchas

- `tsconfig.json` `include` patterns `**/*.test.ts` and `**/*.spec.ts` do NOT match test utility files (harness, fixture builder). Add `tests/**/*.ts` to the include array when creating non-test utilities in test directories.
- ESLint `projectService: true` uses the nearest `tsconfig.json`, not `tsconfig.lint.json`. Files must be included in both for linting to work.
- Stale vitest include globs are silent because of `passWithNoTests: true` — remove dead globs promptly after file moves.
- `resolveEnv` integration tests that need `.env` file isolation: use `'/tmp'` as `startDir` to prevent ambient `.env` files from satisfying schema requirements.
- After refactoring entry points (removing `dotenv`, changing `loadRuntimeConfig` signature), check E2E tests that launch the process directly — they break when the entry point contract changes.

## Test Data Anchoring

Tests that agree with code on the wrong contract are worse than no tests. The snagging bugs that this repo encountered were invisible because tests encoded the same wrong assumptions (e.g. `keyStageSlugs` instead of the API's `keyStages`). Anchor test fixtures to the schema or captured API responses, not to code assumptions. Use `as const satisfies SDKType` to couple test data to SDK type evolution.

## Test Isolation

- Replace Express `_router` access in tests with HTTP assertions via supertest — more resilient, tests actual behaviour.
- Repeated multi-line test setup → extract scoped helper inside `describe` block (e.g. `registerWithOverrides`, `baseEnv`).
- For large mechanical migrations (30+ files), use subagents to parallelise the work.
- Bulk operation factories should accept `startIndex` rather than mutating readonly `_id` after creation.
