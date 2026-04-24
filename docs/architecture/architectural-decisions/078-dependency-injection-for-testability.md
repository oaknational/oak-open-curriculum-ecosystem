# ADR-078: Dependency Injection for Testability

**Status**: Accepted  
**Date**: 2025-12-14  
**Deciders**: Engineering Team  
**Related**: [Testing Strategy](../../../.agent/directives/testing-strategy.md), [Rules](../../../.agent/directives/principles.md)

## Context

Tests that manipulate global state (`process.env`, `globalThis`, module cache via `vi.doMock`) cause race conditions when run in parallel, leading to flaky failures. This pattern violates our testing strategy:

> **Unit test**: A test that verifies the behaviour of a single PURE function in isolation. Unit tests DO NOT trigger IO, have **NO side effects**, and contain **NO MOCKS**.

Current mitigation uses `isolate: true` and `pool: 'forks'` in vitest configs to force process isolation. This is a **workaround, not a fix**.

## Decision

**All product code MUST accept configuration as explicit parameters rather than reading from `process.env` directly.**

Environment variables should be read **once at the entry point** and passed as configuration through the call stack.

### Pattern: Before (Anti-Pattern)

```typescript
// ❌ BAD: Product code reads global state directly
export function resolveIndexVersion(): string {
  return process.env.SEARCH_INDEX_VERSION ?? 'v1';
}

export function createApp() {
  const apiKey = process.env.OAK_API_KEY;
  // ... uses apiKey internally
}
```

```typescript
// ❌ BAD: Test mutates global state
describe('my function', () => {
  beforeEach(() => {
    process.env.MY_CONFIG = 'test-value';
  });

  it('uses config', () => {
    const result = myFunction(); // reads from process.env internally
    expect(result).toBe('expected');
  });
});
```

### Pattern: After (Correct)

```typescript
// ✅ GOOD: Product code accepts configuration as parameter
export function resolveIndexVersion(config: { indexVersion?: string }): string {
  return config.indexVersion ?? 'v1';
}

export function createApp(config: AppConfig) {
  const apiKey = config.oakApiKey;
  // ... uses apiKey from explicit config
}

// Entry point reads from env ONCE and passes config down
const config = loadConfigFromEnv(); // single place that reads process.env
const app = createApp(config);
```

```typescript
// ✅ GOOD: Test uses pure function with explicit dependencies
describe('my function', () => {
  it('uses config', () => {
    const config = { myConfig: 'test-value' };
    const result = myFunction(config); // explicit parameter
    expect(result).toBe('expected');
  });
});
```

### Configuration Flow Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Entry Point (index.ts / main.ts / bin/*.ts)                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  const config = loadConfigFromEnv();  // ONLY HERE  │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  createApp(config)    // config passed explicitly   │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  createRouter(config) // config passed explicitly   │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  handler(request, config) // pure functions         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Consequences

### Positive

1. **All functions become pure and testable** without global state access
2. **Dependencies are explicit and discoverable** through function signatures
3. **Eliminates race conditions** in parallel test execution
4. **Follows "fail fast" principle** - missing config fails at startup, not deep in a call stack
5. **Enables removal of test isolation workarounds** (`isolate: true`, `pool: 'forks'`)
6. **Improves code readability** - clear what each function needs

### Negative

1. **Requires refactoring existing code** that reads `process.env` directly
2. **More parameters to pass** through function signatures
3. **Slightly more boilerplate** at entry points

### Neutral

1. Entry points (`bin/*.ts`, `index.ts`) remain the single place to read `process.env`
2. Smoke composition roots may pass env to the system under test — child-process smoke tests use spawn `env`, while Vitest smoke suites may read ambient env in the runner config and inject the validated object
3. In-process E2E tests that use `createApp()` directly must use DI with explicit runtime-config objects or hermetic test helpers — they share the test process and are subject to the same prohibition as unit/integration tests

## Prohibited Patterns

The following patterns are **prohibited** in all tests (unit, integration, and in-process E2E):

| Pattern                       | Why Prohibited                                   | Alternative                           |
| ----------------------------- | ------------------------------------------------ | ------------------------------------- |
| `process.env.X`               | Reads ambient global state, hiding DI seams      | Pass config as parameter              |
| `process.env.X = 'value'`     | Mutates global state, causes race conditions     | Pass config as parameter              |
| `vi.stubGlobal('fetch', ...)` | Mutates global object                            | Inject fetch as dependency            |
| `vi.mock('module', ...)`      | Manipulates module cache, subtle race conditions | Inject module exports as dependencies |
| `vi.doMock('module', ...)`    | Manipulates module cache, subtle race conditions | Inject module exports as dependencies |
| `globalThis.X = 'value'`      | Mutates global state                             | Pass as parameter                     |

**In-process E2E pattern**: Tests that create the app in-process (e.g. `createApp()` + supertest) must build an explicit runtime config and pass it through DI:

```typescript
import { createApp } from '../src/application.js';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';

const runtimeConfig = createMockRuntimeConfig({
  dangerouslyDisableAuth: true,
  env: { OAK_API_KEY: 'test-key' },
});
const app = await createApp({
  runtimeConfig,
  observability: createMockObservability(runtimeConfig),
});
```

**Exception**: Smoke composition roots may provide environment variables to the system under test. Subprocess smoke tests use spawn `env`; Vitest smoke suites may load ambient env in the runner config and pass the validated object with `test.provide` / `inject`. Test files and setup files still must not read or mutate `process.env`. Any other claimed exception is a violation, not an accepted trade-off — untracked exceptions undermine the gate for all future code.

## Acceptance Criteria for Compliance

### Product Code

- Functions that need configuration receive it as an explicit parameter
- Entry points (`bin/*.ts`, `index.ts`) are the ONLY places that read `process.env`
- Configuration objects are typed with specific interfaces (not `Record<string, unknown>`)

### Tests

- All unit tests pass without `isolate: true` in vitest config
- All integration tests pass without `pool: 'forks'` in vitest config
- No `process.env` reads or mutations in any test (unit, integration, or in-process E2E)
- No `vi.mock` in any test
- No `vi.doMock` in any test
- No `vi.stubGlobal` in any test
- Simple fakes passed as constructor arguments, not complex mocks
- In-process E2E tests use explicit runtime-config objects and pass observability into `createApp`

## Implementation Status

**Current**: Vitest configs use `isolate: true` + `pool: 'forks'` as workaround

**Target**: Remove workarounds after product code refactoring is complete

See `.agent/plans/architecture-and-infrastructure/config-architecture-standardisation-plan.md` for the remaining config DI standardisation work.
