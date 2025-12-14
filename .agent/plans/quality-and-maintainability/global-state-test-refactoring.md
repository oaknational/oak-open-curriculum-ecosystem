# Global State Test Refactoring Plan

## Problem

Many tests manipulate global state (`process.env`, `globalThis`, module cache via `vi.doMock`) instead of using dependency injection. This violates the testing strategy:

> **Unit test**: A test that verifies the behaviour of a single PURE function in isolation. Unit tests DO NOT trigger IO, have **NO side effects**, and contain **NO MOCKS**.

> **KISS: No complex mocks** - Mocks should be simple and focused, no complex logic in mocks, or we risk testing the mocks rather than the code. Complex mocks are a signal that we need to step back and simplify the code or our approach.

Global state manipulation causes race conditions when tests run in parallel, leading to flaky failures.

## Current Mitigation

Added `isolate: true` and `pool: 'forks'` to vitest configs to force process isolation. This is a workaround, not a fix.

## Instances to Refactor

### Category 1: `process.env` Mutations in Unit Tests

These are the most problematic - unit tests should have NO side effects.

| File                                                                                   | Variables Mutated                   | Refactor Target                                                           |
| -------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------- |
| `apps/oak-open-curriculum-semantic-search/src/lib/suggestions/index.unit.test.ts:101`  | `SEARCH_INDEX_VERSION`              | Pass index version as parameter to function under test                    |
| `apps/oak-open-curriculum-semantic-search/src/lib/search-index-target.unit.test.ts:47` | `AI_PROVIDER`                       | Pass AI provider config as parameter                                      |
| `apps/oak-open-curriculum-semantic-search/app/lib/fixture-mode.unit.test.ts:66-72`     | `SEMANTIC_SEARCH_USE_FIXTURES`      | Pass fixture mode as parameter to `resolveFixtureModeFromEnv`             |
| `apps/oak-open-curriculum-semantic-search/app/lib/fixture-toggle.unit.test.ts:30-32`   | `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE` | Already has optional env parameter - use it                               |
| `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.unit.test.ts:26,49,61`           | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass stub mode as parameter to `resolveToolExecutors`                     |
| `apps/oak-notion-mcp/src/config/notion-config/env-utils.unit.test.ts:23,29`            | `LOG_LEVEL`                         | Already testing `parseLogLevel` with explicit input - remove env mutation |
| `apps/oak-notion-mcp/src/app/index.unit.test.ts:19,30`                                 | `NOTION_API_KEY`                    | Pass config object to app factory                                         |

### Category 2: `process.env` Mutations in Integration Tests

Integration tests can have simple mocks injected as arguments, but should not mutate global state.

| File                                                                                           | Variables Mutated        | Refactor Target                      |
| ---------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------ |
| `apps/oak-open-curriculum-semantic-search/app/api/search/suggest/route.integration.test.ts:27` | `SEARCH_INDEX_VERSION`   | Pass config to route handler factory |
| `apps/oak-open-curriculum-semantic-search/app/api/search/route.integration.test.ts:40`         | `SEARCH_INDEX_VERSION`   | Pass config to route handler factory |
| `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.integration.test.ts:9-11`             | `OAK_API_KEY`, `CLERK_*` | Pass config object to `createApp`    |

### Category 3: `process.env` Mutations in E2E Tests

E2E tests spawn separate processes, so env mutation is more acceptable but still not ideal.

| File                                                                                                 | Variables Mutated                   | Notes                                         |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------- |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/header-redaction.e2e.test.ts:18-20,27-28`         | Auth env vars                       | Consider passing via spawn env                |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-metadata.e2e.test.ts:29-31,99-100`         | Auth env vars                       | Consider passing via spawn env                |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts:16-18,58-59`                   | Auth env vars                       | Consider passing via spawn env                |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/tool-examples-metadata.e2e.test.ts:32-34,113-114` | Auth env vars                       | Consider passing via spawn env                |
| `apps/oak-curriculum-mcp-streamable-http/src/index.e2e.test.ts:9`                                    | `OAK_API_KEY`                       | Pass config to `createApp`                    |
| `apps/oak-curriculum-mcp-stdio/e2e-tests/tool-list-parity.e2e.test.ts:6`                             | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass via spawn env instead of global mutation |
| `apps/oak-curriculum-mcp-stdio/e2e-tests/mcp-protocol.e2e.test.ts:10`                                | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass via spawn env instead of global mutation |
| `apps/oak-curriculum-mcp-stdio/e2e-tests/mcp-logging.e2e.test.ts:8`                                  | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass via spawn env instead of global mutation |
| `apps/oak-curriculum-mcp-stdio/e2e-tests/mcp-dev-runner.e2e.test.ts:5`                               | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass via spawn env instead of global mutation |
| `apps/oak-curriculum-mcp-stdio/smoke-tests/multi-status-handling.smoke.test.ts:7`                    | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Smoke tests may use real env                  |

### Category 4: `vi.stubGlobal` (Global Object Mutation)

| File                                                                                        | Global Stubbed | Refactor Target                       |
| ------------------------------------------------------------------------------------------- | -------------- | ------------------------------------- |
| `apps/oak-open-curriculum-semantic-search/app/api/search/search-service.unit.test.ts:47-63` | `fetch`        | Inject fetch as dependency            |
| `apps/oak-open-curriculum-semantic-search/app/api/search/nl/route.integration.test.ts:84`   | `fetch`        | Inject fetch as dependency            |
| `apps/oak-open-curriculum-semantic-search/src/lib/observability/zero-hit.unit.test.ts:44`   | `fetch`        | Inject fetch as dependency            |
| `apps/oak-open-curriculum-semantic-search/app/lib/useStream.unit.test.ts:17`                | `fetch`        | Inject fetch as dependency or use msw |

### Category 5: `vi.doMock` (Module Cache Manipulation)

These cause the most subtle race conditions because module cache is shared.

| File                                                                                              | Module Mocked              | Refactor Target                        |
| ------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------------- |
| `apps/oak-open-curriculum-semantic-search/app/api/search/search-service.unit.test.ts:27-36,66-75` | `structured-search.shared` | Inject schema as dependency            |
| `apps/oak-notion-mcp/src/app/index.unit.test.ts:33-38,42-48`                                      | `env-utils`, `mcp-logger`  | Pass config/logger as constructor args |

### Category 6: Reference Docs (Not Active Code)

These are in `.agent/reference-docs/` - historical reference, not active tests.

| File                                                                                             | Variables Mutated |
| ------------------------------------------------------------------------------------------------ | ----------------- |
| `.agent/reference-docs/replaced-http-auth-model/clerk-auth-middleware.integration.test.ts:24-28` | Auth env vars     |
| `.agent/reference-docs/replaced-http-auth-model/auth-www-authenticate.integration.test.ts:11-14` | Auth env vars     |

## Refactoring Pattern

This is not just test refactoring - it requires **architectural changes to product code** to accept configuration as parameters instead of reading from `process.env` directly.

### Product Code: Before

```typescript
// ❌ BAD: Reads from global state directly
export function resolveIndexVersion(): string {
  return process.env.SEARCH_INDEX_VERSION ?? 'v1';
}

export function createApp() {
  const apiKey = process.env.OAK_API_KEY;
  // ... uses apiKey internally
}
```

### Product Code: After

```typescript
// ✅ GOOD: Accepts configuration as parameter
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

### Test: Before

```typescript
// ❌ BAD: Mutates global state
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

### Test: After

```typescript
// ✅ GOOD: Pure function with explicit dependencies
describe('my function', () => {
  it('uses config', () => {
    const config = { myConfig: 'test-value' };
    const result = myFunction(config); // explicit parameter
    expect(result).toBe('expected');
  });
});
```

## Architectural Principle

**Environment should be read once at the entry point**, then passed as configuration through the call stack:

```
┌─────────────────────────────────────────────────────────────┐
│  Entry Point (index.ts / main.ts)                           │
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

This pattern:

1. Makes all functions pure and testable without global state manipulation
2. Makes dependencies explicit and discoverable
3. Eliminates race conditions in parallel test execution
4. Follows the "fail fast" principle - missing config fails at startup, not deep in a call stack

## Product Code Changes Required

These are the source files that read `process.env` directly and need to be refactored to accept configuration as parameters.

### Semantic Search App

| File                                                                         | Current Pattern                            | Refactor To                                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| `apps/oak-open-curriculum-semantic-search/src/lib/suggestions/index.ts:253`  | `process.env.SEARCH_INDEX_VERSION`         | Accept `indexVersion` as parameter                                       |
| `apps/oak-open-curriculum-semantic-search/app/api/search/route.ts:21`        | `process.env.SEARCH_INDEX_VERSION`         | Accept via route config/context                                          |
| `apps/oak-open-curriculum-semantic-search/app/lib/fixture-mode.ts:74,79,103` | `process.env.SEMANTIC_SEARCH_USE_FIXTURES` | Already accepts `envValue` param - ensure callers pass it                |
| `apps/oak-open-curriculum-semantic-search/src/lib/env.ts:61-66`              | Aggregates env vars                        | This is the entry point - keep but ensure downstream uses config objects |

### MCP STDIO App

| File                                                            | Current Pattern                                 | Refactor To                                             |
| --------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.ts:8`     | `process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Accept `useStubTools: boolean` as parameter             |
| `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts:48`            | `process.env.OAK_API_KEY`                       | Already building config - ensure all consumers use this |
| `apps/oak-curriculum-mcp-stdio/src/app/server.ts:96`            | `process.env.OAK_API_KEY`                       | Accept via config parameter                             |
| `apps/oak-curriculum-mcp-stdio/bin/oak-curriculum-mcp.ts:44,87` | `process.env.OAK_API_KEY`                       | Entry point - OK to read here, pass to createServer     |

### MCP Streamable HTTP App

| File                                                                       | Current Pattern         | Refactor To                                  |
| -------------------------------------------------------------------------- | ----------------------- | -------------------------------------------- |
| `apps/oak-curriculum-mcp-streamable-http/smoke-tests/environment.ts:62-64` | Reads multiple env vars | Smoke test entry point - OK                  |
| `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/*.ts`           | Mutates `process.env`   | Pass env to spawn instead of mutating global |

### SDK

| File                                                          | Current Pattern           | Refactor To                    |
| ------------------------------------------------------------- | ------------------------- | ------------------------------ |
| `packages/sdks/oak-curriculum-sdk/type-gen/typegen.ts:46,133` | `process.env.OAK_API_KEY` | Build script - OK to read here |

## Priority

1. **High**: Product code reading `process.env` in library functions (not entry points)
2. **High**: Unit tests with `vi.doMock` - these cause the most race conditions
3. **High**: Unit tests with `process.env` mutation - violates "no side effects" rule
4. **Medium**: Integration tests with `process.env` mutation
5. **Low**: E2E tests - process isolation makes this less critical

## Acceptance Criteria

### Product Code

- [ ] `resolveToolExecutors()` accepts `useStubTools` parameter
- [ ] `indexVersion()` in suggestions accepts version as parameter
- [ ] Search route handlers receive config from context, not `process.env`
- [ ] `createServer()` receives full config, doesn't read `process.env` internally
- [ ] Entry points (`bin/*.ts`, `index.ts`) are the ONLY places that read `process.env`

### Tests

- [ ] All unit tests pass without `isolate: true`
- [ ] All integration tests pass without `pool: 'forks'`
- [ ] No `process.env` mutations in unit tests
- [ ] No `vi.doMock` in unit tests
- [ ] No `vi.stubGlobal` in unit tests
- [ ] Functions accept configuration as parameters, not reading from `process.env` directly
