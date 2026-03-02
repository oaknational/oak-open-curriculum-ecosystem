# ADR-078: Dependency Injection for Testability

**Status**: Accepted  
**Date**: 2025-12-14  
**Deciders**: Engineering Team  
**Related**: [Testing Strategy](../../../.agent/directives/testing-strategy.md), [Rules](../../../.agent/directives/rules.md)

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

1. **All functions become pure and testable** without global state manipulation
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
2. Subprocess-spawned tests (e.g. smoke tests) may pass env via spawn options — process isolation makes this safe
3. In-process E2E tests that use `createApp()` directly must use DI via `loadRuntimeConfig(isolatedEnv)` — they share the test process and are subject to the same prohibition as unit/integration tests

## Prohibited Patterns

The following patterns are **prohibited** in all tests (unit, integration, and in-process E2E):

| Pattern                       | Why Prohibited                                   | Alternative                           |
| ----------------------------- | ------------------------------------------------ | ------------------------------------- |
| `process.env.X = 'value'`     | Mutates global state, causes race conditions     | Pass config as parameter              |
| `vi.stubGlobal('fetch', ...)` | Mutates global object                            | Inject fetch as dependency            |
| `vi.doMock('module', ...)`    | Manipulates module cache, subtle race conditions | Inject module exports as dependencies |
| `globalThis.X = 'value'`      | Mutates global state                             | Pass as parameter                     |

**In-process E2E pattern**: Tests that create the app in-process (e.g. `createApp()` + supertest) must build an isolated env object and pass it through DI:

```typescript
const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_API_KEY: 'test-key',
  // ... other required keys
};
const runtimeConfig = loadRuntimeConfig(testEnv);
const app = createApp({ runtimeConfig });
```

**Exception**: Subprocess-spawned tests (smoke tests) may pass environment variables via spawn options because the child process has its own isolated environment.

## Acceptance Criteria for Compliance

### Product Code

- Functions that need configuration receive it as an explicit parameter
- Entry points (`bin/*.ts`, `index.ts`) are the ONLY places that read `process.env`
- Configuration objects are typed with specific interfaces (not `Record<string, unknown>`)

### Tests

- All unit tests pass without `isolate: true` in vitest config
- All integration tests pass without `pool: 'forks'` in vitest config
- No `process.env` mutations in any test (unit, integration, or in-process E2E)
- No `vi.doMock` in any test
- No `vi.stubGlobal` in any test
- Simple fakes passed as constructor arguments, not complex mocks
- In-process E2E tests use `loadRuntimeConfig(isolatedEnv)` + `createApp({ runtimeConfig })`

## Implementation Status

**Current**: Vitest configs use `isolate: true` + `pool: 'forks'` as workaround

**Target**: Remove workarounds after product code refactoring is complete

See `.agent/plans/architecture-and-infrastructure/config-architecture-standardisation-plan.md` for the remaining config DI standardisation work.
