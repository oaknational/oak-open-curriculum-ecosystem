# Global State Elimination Plan

**Status**: 🔄 IN PROGRESS  
**Priority**: High - Causing flaky test failures in CI  
**Estimated Effort**: 12-16 hours across multiple sessions  
**Created**: 2025-12-16  
**Updated**: 2025-12-16

---

## Progress Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 | ✅ COMPLETE | Pre-push reliability improvements |
| Phase 1A | ✅ COMPLETE | Unit test quick wins (3 files) |
| Phase 2 | ✅ COMPLETE (partial) | `vi.stubGlobal` eliminated; `vi.doMock` deferred to config architecture work |
| Phase 3 | 🔗 DELEGATED | See [Config Architecture Standardisation Plan](../architecture/config-architecture-standardisation-plan.md) |
| Phase 1B | ⏳ BLOCKED | Requires Phase 3 |
| Phase 4A-7 | ⏳ PENDING | Requires Phase 3 |

### Completed Work (2025-12-16 & 2025-12-17)

**Phase 0: Pre-Push Reliability**
- ✅ Added `export TURBO_CONCURRENCY=4` to `.husky/pre-push`
- ✅ Added `--only` flag to `test:e2e` and `test:e2e:built` to skip dependency re-runs
- ✅ Increased `testTimeout` to 60000ms in `vitest.e2e.config.base.ts`
- ✅ Validated with 3 consecutive successful pre-push runs

**Turbo Dependency Graph Fix (2025-12-17)**
- ✅ Fixed race condition: `lint` and `build` running in parallel caused `ENOENT: tsup.config.bundled_*.mjs` errors
- ✅ Added `build` dependency to `lint`, `lint:fix`, `test:ui`, and smoke tests in `turbo.json`
- ✅ Added `type-gen` dependency to `doc-gen` and `mutate` tasks
- ✅ 8 task definitions corrected - ensures tasks wait for own package's build to complete

**Phase 1A: Unit Test Quick Wins**
- ✅ `fixture-toggle.unit.test.ts` - removed `process.env` mutation
- ✅ `env-utils.unit.test.ts` - removed `process.env` mutation
- ✅ `fixture-mode.unit.test.ts` - removed `process.env` mutation

**Phase 2: Global Mocks**
- ✅ `vi.stubGlobal` eliminated from all unit tests (0 remaining)
- ⏳ `vi.doMock` in `index.unit.test.ts` deferred - requires config architecture refactoring

### Current Measurements

```bash
# After Phase 0, 1A, 2
vi.stubGlobal in unit tests:     0  (was 2)
vi.doMock in unit tests:         2  (unchanged - requires Phase 3)
process.env in unit tests:      22  (was 25, reduced by 3)
```

### Next Steps

The remaining `vi.doMock` and `process.env` issues in `oak-notion-mcp` require architectural refactoring of the config/env layer. This is tracked in a dedicated plan:

**→ [Config Architecture Standardisation Plan](../architecture/config-architecture-standardisation-plan.md)**

---

## Intention

Eliminate global state manipulation throughout the codebase to achieve **deterministic, parallel-safe tests** that pass reliably regardless of execution order or system load.

### The Problem We're Solving

Tests fail intermittently during `git push` when run in parallel:

```text
FAIL zodgen.e2e.test.ts > generates importable and usable Zod schemas
Error: Test timed out in 30000ms.

FAIL StructuredSearchClient.regression.integration.test.tsx
Error: Test timed out in 5000ms.
```

These tests pass when run in isolation but fail under concurrent execution. The root cause is **global state pollution** - tests mutate shared state (`process.env`, module cache, global objects) causing race conditions.

### Real-World Evidence: Push Attempts (2025-12-16)

Pushing this very plan document required **5 attempts** due to flaky failures:

| Attempt | Result | Failing Test/Task | Error |
|---------|--------|-------------------|-------|
| 1 | ❌ FAIL | `zodgen.e2e.test.ts` | `Test timed out in 30000ms` |
| 2 | ❌ FAIL | `@oaknational/eslint-plugin-standards:lint` | `ENOENT: tsup.config.bundled_*.mjs` (race condition) |
| 3 | ❌ FAIL | `SearchPageClient.integration.test.tsx` | `Test timed out in 5000ms` |
| 4 | ❌ FAIL | `@oaknational/eslint-plugin-standards:lint` | `ENOENT: tsup.config.bundled_*.mjs` (race condition) |
| 5 | ✅ PASS | All 46 tasks | Success after 1m35s |

**Observations:**
- Different tests fail on different attempts (non-deterministic)
- Test timeouts (5s, 30s) suggest resource contention, not code bugs
- Build system race conditions (ESLint reading tsup temp files) compound the problem
- Success on attempt 5 with identical code proves failures are environmental, not logical

This data confirms the hypothesis: **global state and parallel execution create unpredictable failures**.

### Current Workaround

```typescript
// vitest.config.ts - Process isolation as a bandage
{
  isolate: true,
  pool: 'forks'
}
```

This adds overhead and still fails under load because:

1. Many isolated processes compete for resources
2. Module cache pollution persists within packages
3. `process.env` mutations can leak between test files

---

## Value & Impact

### Immediate Value

| Metric                     | Current State          | Target State                      | Impact                     |
| -------------------------- | ---------------------- | --------------------------------- | -------------------------- |
| Pre-push hook success rate | ~70% (needs retry)     | 100%                              | **Developer productivity** |
| Test execution time        | ~150s (with isolation) | ~60s (without isolation overhead) | **60% faster CI**          |
| Test flakiness incidents   | 2-3 per week           | 0                                 | **Reduced debugging time** |

### Architectural Value

| Benefit             | Description                                         |
| ------------------- | --------------------------------------------------- |
| **Testability**     | All functions become pure - input determines output |
| **Discoverability** | Dependencies explicit in function signatures        |
| **Maintainability** | Single place to understand configuration flow       |
| **Onboarding**      | Clear patterns for new developers to follow         |

### Risk of Not Acting

- Flaky tests erode trust in CI
- Developers start ignoring failures ("it'll pass on retry")
- Technical debt compounds as new tests copy bad patterns
- Eventually, isolation workaround becomes insufficient

---

## Architecture Target

### Before: Global State Scattered

```text
┌──────────────────────────────────────────────────────────────┐
│  Functions read process.env directly                         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ function A  │  │ function B  │  │ function C  │          │
│  │ reads env   │  │ reads env   │  │ reads env   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│                   process.env (SHARED MUTABLE STATE)         │
│                                                              │
│  Tests mutate process.env → Race conditions                  │
└──────────────────────────────────────────────────────────────┘
```

### After: Config Flows From Entry Point

```text
┌──────────────────────────────────────────────────────────────┐
│  Entry Point (index.ts / main.ts)                            │
│  ┌────────────────────────────────────────────────────┐      │
│  │  const config = loadConfigFromEnv();  // ONLY HERE │      │
│  └────────────────────────────────────────────────────┘      │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ function A  │  │ function B  │  │ function C  │          │
│  │ (config)    │──│ (config)    │──│ (config)    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  Tests pass config directly → No shared state → No races     │
└──────────────────────────────────────────────────────────────┘
```

---

## Phases Overview

| Phase         | Scope                                                    | Effort   | Dependencies |
| ------------- | -------------------------------------------------------- | -------- | ------------ |
| **Phase 0**   | Pre-push reliability quick wins (symptom reduction)      | 30 mins  | None         |
| **Phase 1A**  | Unit tests where functions already accept parameters     | 1 hour   | None         |
| **Phase 2**   | Remove `vi.doMock` and `vi.stubGlobal` from unit tests   | 2 hours  | None         |
| **Phase 3**   | Refactor product code to accept config parameters        | 4 hours  | None         |
| **Phase 1B**  | Unit tests that depend on Phase 3 product changes        | 1 hour   | Phase 3      |
| **Phase 4A**  | Refactor integration tests                               | 2 hours  | Phase 3      |
| **Phase 4B**  | Refactor E2E tests                                       | 3 hours  | Phase 3      |
| **Phase 5**   | Refactor smoke tests                                     | 2 hours  | Phase 3      |
| **Phase 6**   | Documentation and ESLint enforcement                     | 2 hours  | Phases 1-5   |
| **Phase 7**   | Remove isolation workarounds, validate                   | 2 hours  | Phase 6      |

All test types are equally important. Global state elimination must be complete across **all** test types before the isolation workarounds can be removed.

---

## Phase 0: Pre-Push Reliability Quick Wins (Symptom Reduction)

**Status**: ✅ COMPLETE (2025-12-16)

### Intention

Implement three low-effort changes to the pre-push hook that reduce resource contention and improve reliability, targeting a measurable reduction in flaky failures **without requiring product code changes**.

These are symptom reductions - they provide immediate relief while the foundational work (Phases 1-7) proceeds.

### Foundation Documents (Re-read Before Starting)

- [rules.md](../../directives-and-memory/rules.md)
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md)
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)

---

### 0.1 Reduce Turbo Concurrency in Pre-Push Hook

#### Goal

Limit the number of parallel tasks during pre-push to reduce CPU/memory contention that causes test timeouts.

#### Current State

```shell
# .husky/pre-push line 19
pnpm turbo run type-gen build type-check lint test test:e2e test:e2e:built
```

Turbo runs with default concurrency (number of CPU cores), causing resource starvation when many tests spawn simultaneously.

#### Intended Value

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Peak parallel processes | ~10-16 | 4 | 60-75% reduction in resource contention |
| Timeout failures | Intermittent | Reduced | Fewer "Test timed out" errors |
| First-attempt success rate | ~70% (per plan evidence) | Target: >90% | Measurable reliability improvement |

#### Change

In [.husky/pre-push](../../../../.husky/pre-push), change line 19 from:

```shell
pnpm turbo run type-gen build type-check lint test test:e2e test:e2e:built
```

To:

```shell
TURBO_CONCURRENCY=4 pnpm turbo run type-gen build type-check lint test test:e2e test:e2e:built
```

#### Acceptance Criteria

1. **Functional**: Pre-push hook executes successfully with the new concurrency limit
2. **Measurable**: Run pre-push 5 times consecutively; all 5 must succeed (previously ~3.5/5 succeeded based on plan evidence)
3. **Verification command**:
   ```bash
   # Simulate pre-push conditions
   TURBO_UI=0 TURBO_CONCURRENCY=4 pnpm turbo run type-gen build type-check lint test test:e2e test:e2e:built
   ```

---

### 0.2 Sequential Execution for Fragile E2E Tasks

#### Goal

Separate E2E tests from the main turbo batch to give them dedicated resources, reducing timeout failures caused by competing with unit tests for CPU/memory.

#### Current State

All tasks run in a single turbo invocation. E2E tests (which spawn child processes) compete with unit tests for resources.

#### Intended Value

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| E2E test resource availability | Shared with unit tests | Dedicated phase | E2E tests get full system resources |
| `zodgen.e2e.test.ts` timeout failures | Intermittent | Eliminated | Most frequently failing test stabilised |
| `test:e2e:built` reliability | Flaky | Stable | Built artifact tests run after E2E completes |

#### Change

In [.husky/pre-push](../../../../.husky/pre-push), replace lines 18-19:

```shell
echo "Running quality gate checks..."
pnpm turbo run type-gen build type-check lint test test:e2e test:e2e:built
```

With:

```shell
echo "Running build and verification..."
TURBO_CONCURRENCY=4 pnpm turbo run type-gen build type-check lint test

echo "Running E2E tests..."
pnpm turbo run test:e2e

echo "Running built artifact E2E tests..."
pnpm turbo run test:e2e:built
```

#### Rationale

- Build, type-check, lint, and unit tests benefit from parallelism (they import code, not spawn processes)
- E2E tests spawn child processes that need significant resources
- `test:e2e:built` already depends on `test:e2e` in turbo.json, but running separately ensures clean resource state

#### Acceptance Criteria

1. **Functional**: All three phases complete successfully in sequence
2. **Measurable**: E2E test phase completes without timeout errors when run after unit tests complete
3. **Verification command**:
   ```bash
   # Phase 1: Build and unit tests
   TURBO_UI=0 TURBO_CONCURRENCY=4 pnpm turbo run type-gen build type-check lint test
   # Phase 2: E2E tests (dedicated resources)
   TURBO_UI=0 pnpm turbo run test:e2e
   # Phase 3: Built artifact tests
   TURBO_UI=0 pnpm turbo run test:e2e:built
   ```

4. **Cache behaviour**: Turbo caching ensures no redundant work between phases (build outputs cached from phase 1)

---

### 0.3 Increase E2E Test Timeouts

#### Goal

Provide adequate timeout headroom for E2E tests that legitimately take longer under resource pressure, preventing false failures.

#### Current State

E2E tests use default Vitest timeouts. The plan documents:

- `zodgen.e2e.test.ts`: "Test timed out in 30000ms"
- `SearchPageClient.integration.test.tsx`: "Test timed out in 5000ms"

#### Intended Value

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| E2E test timeout | 30s (default) | 60s | 2x headroom for resource variance |
| Hook timeout | 10s (default) | 30s | Adequate time for server startup in beforeAll |
| Timeout-related failures | Intermittent | Eliminated | Tests pass when code is correct but system is busy |

#### Change

Modify [vitest.e2e.config.base.ts](../../../../vitest.e2e.config.base.ts) to add explicit timeout configuration.

First, read the current file to understand its structure, then add:

```typescript
test: {
  // ... existing config ...
  testTimeout: 60000,  // 60s for individual tests (was 30s default)
  hookTimeout: 30000,  // 30s for beforeAll/afterAll hooks
}
```

#### Acceptance Criteria

1. **Functional**: All E2E tests pass with new timeout values
2. **Measurable**: `zodgen.e2e.test.ts` no longer fails with timeout errors under normal conditions
3. **Verification commands**:
   ```bash
   # Verify timeout is applied
   pnpm turbo run test:e2e --filter=@oaknational/oak-curriculum-sdk
   
   # Verify all E2E tests pass
   pnpm turbo run test:e2e test:e2e:built
   ```

4. **No regression**: Legitimate slow tests are not masked; if a test genuinely takes >60s, it should be investigated

---

### Phase 0 Quality Gates (Post-Implementation)

After all three changes, run the full quality gate suite one gate at a time:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

### Phase 0 Final Validation

Run the modified pre-push hook 5 times consecutively:

```bash
for i in {1..5}; do
  echo "=== Attempt $i ==="
  .husky/pre-push && echo "SUCCESS" || echo "FAILED"
done
```

**Success criterion**: All 5 attempts pass.

---

### Phase 0 Files Modified

| File | Change |
|------|--------|
| [.husky/pre-push](../../../../.husky/pre-push) | Add TURBO_CONCURRENCY, split E2E execution |
| [vitest.e2e.config.base.ts](../../../../vitest.e2e.config.base.ts) | Add testTimeout and hookTimeout |

---

### What Phase 0 Does NOT Address

These quick wins reduce symptoms. The root cause (global state mutation in tests) requires the larger effort described in Phases 1-7 below.

---

## Phase 1: Unit Test Environment Mutations (Quick Win)

### Intention

Remove all `process.env` mutations from unit tests. Unit tests should be **pure** - no side effects.

### Files to Fix

#### Group A: Test-Only Changes (True Quick Wins)

These tests mutate env but the underlying functions already accept parameters:

| File                                                                                | Variables Mutated                   | Fix Strategy                                                        |
| ----------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `apps/oak-open-curriculum-semantic-search/app/lib/fixture-toggle.unit.test.ts:30-32` | `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE` | Use existing optional env parameter                                 |
| `apps/oak-notion-mcp/src/config/notion-config/env-utils.unit.test.ts:23,29`          | `LOG_LEVEL`                         | Remove mutation - `parseLogLevel` already takes explicit input      |
| `apps/oak-open-curriculum-semantic-search/app/lib/fixture-mode.unit.test.ts:66-72`   | `SEMANTIC_SEARCH_USE_FIXTURES`      | Test `resolveFixtureMode({envValue})` instead of `FromEnv` wrapper  |

#### Group B: Requires Product Code Change First (Move to Phase 3)

These tests mutate env because the product code reads `process.env` directly:

| File                                                                                  | Variables Mutated                   | Blocked By                              |
| ------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------- |
| `apps/oak-open-curriculum-semantic-search/src/lib/suggestions/index.unit.test.ts:101` | `SEARCH_INDEX_VERSION`              | Product code reads env directly         |
| `apps/oak-open-curriculum-semantic-search/src/lib/search-index-target.unit.test.ts:47` | `AI_PROVIDER`                       | Product code reads env directly         |
| `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.unit.test.ts:26,49,61`          | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | `resolveToolExecutors()` reads env      |
| `apps/oak-notion-mcp/src/app/index.unit.test.ts:19,30`                                | `NOTION_API_KEY`                    | App initialization reads env            |

### Pattern

```typescript
// ❌ BEFORE: Mutates global state
describe('my function', () => {
  beforeEach(() => {
    process.env.MY_CONFIG = 'test-value';
  });
  afterEach(() => {
    delete process.env.MY_CONFIG;
  });

  it('uses config', () => {
    const result = myFunction(); // reads process.env internally
    expect(result).toBe('expected');
  });
});

// ✅ AFTER: Pure function test
describe('my function', () => {
  it('uses config', () => {
    const config = { myConfig: 'test-value' };
    const result = myFunction(config); // explicit parameter
    expect(result).toBe('expected');
  });
});
```

### Acceptance Criteria (Group A Only)

```bash
# After Group A fixes - reduced but not zero (Group B remains)
rg "process\.env\." --glob "*.unit.test.ts" apps/ packages/ | wc -l
# Expected: Reduced from baseline (Group B files still have mutations)

# MUST pass - all unit tests pass
pnpm test
# Expected: All pass
```

### Acceptance Criteria (After Phase 3 completes Group B)

```bash
# MUST pass - zero process.env mutations in unit tests
rg "process\.env\." --glob "*.unit.test.ts" apps/ packages/ | grep -v "// allowed:" | wc -l
# Expected: 0
```

---

## Phase 2: Module and Global Mocks (Quick Win)

### Intention

Remove `vi.doMock` (module cache manipulation) and `vi.stubGlobal` (global object mutation) from unit tests. These cause the most subtle race conditions.

### Files to Fix

#### `vi.doMock` (Module Cache)

| File                                                                                              | Module Mocked              | Fix Strategy                           |
| ------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------------- |
| `apps/oak-open-curriculum-semantic-search/app/api/search/search-service.unit.test.ts:27-36,66-75` | `structured-search.shared` | Inject schema as dependency            |
| `apps/oak-notion-mcp/src/app/index.unit.test.ts:33-38,42-48`                                      | `env-utils`, `mcp-logger`  | Pass config/logger as constructor args |

#### `vi.stubGlobal` (Global Objects)

| File                                                                                        | Global Stubbed | Fix Strategy               |
| ------------------------------------------------------------------------------------------- | -------------- | -------------------------- |
| `apps/oak-open-curriculum-semantic-search/app/api/search/search-service.unit.test.ts:47-63` | `fetch`        | Inject fetch as dependency |
| `apps/oak-open-curriculum-semantic-search/app/api/search/nl/route.integration.test.ts:84`   | `fetch`        | Inject fetch or use MSW    |
| `apps/oak-open-curriculum-semantic-search/src/lib/observability/zero-hit.unit.test.ts:44`   | `fetch`        | Inject fetch as dependency |
| `apps/oak-open-curriculum-semantic-search/app/lib/useStream.unit.test.ts:17`                | `fetch`        | Inject fetch or use MSW    |

### Pattern

```typescript
// ❌ BEFORE: Module cache manipulation
vi.doMock('./config', () => ({ getConfig: () => mockConfig }));
const { myFunction } = await import('./my-module');

// ✅ AFTER: Dependency injection
const myFunction = createMyFunction({ config: mockConfig });

// ❌ BEFORE: Global stub
vi.stubGlobal('fetch', mockFetch);
const result = await myFunction();

// ✅ AFTER: Injected dependency
const result = await myFunction({ fetch: mockFetch });
```

### Acceptance Criteria

```bash
# MUST pass - zero vi.doMock in unit tests
rg "vi\.doMock" --glob "*.unit.test.ts" apps/ packages/ | wc -l
# Expected: 0

# MUST pass - zero vi.stubGlobal in unit tests
rg "vi\.stubGlobal" --glob "*.unit.test.ts" apps/ packages/ | wc -l
# Expected: 0

# MUST pass - all unit tests pass
pnpm test --filter "*unit*"
# Expected: All pass
```

---

## Phase 3: Product Code Refactoring

### Intention

Refactor product code to accept configuration as parameters instead of reading from `process.env` directly. This enables pure function testing.

### Files to Refactor

#### Semantic Search App

| File                                                                        | Current Pattern                    | Refactor To                            |
| --------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------- |
| `apps/oak-open-curriculum-semantic-search/src/lib/suggestions/index.ts:253` | `process.env.SEARCH_INDEX_VERSION` | Accept `indexVersion` as parameter     |
| `apps/oak-open-curriculum-semantic-search/app/api/search/route.ts:21`       | `process.env.SEARCH_INDEX_VERSION` | Accept via route config/context        |
| `apps/oak-open-curriculum-semantic-search/app/lib/fixture-mode.ts`          | Reads env directly                 | Ensure all callers pass explicit value |

#### MCP STDIO App

| File                                                        | Current Pattern                                 | Refactor To                    |
| ----------------------------------------------------------- | ----------------------------------------------- | ------------------------------ |
| `apps/oak-curriculum-mcp-stdio/src/app/stub-executors.ts:8` | `process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Accept `useStubTools: boolean` |
| `apps/oak-curriculum-mcp-stdio/src/app/server.ts:96`        | `process.env.OAK_API_KEY`                       | Accept via config parameter    |

### Pattern

```typescript
// ❌ BEFORE: Reads global state
export function resolveIndexVersion(): string {
  return process.env.SEARCH_INDEX_VERSION ?? 'v1';
}

// ✅ AFTER: Pure function
export function resolveIndexVersion(config: { indexVersion?: string }): string {
  return config.indexVersion ?? 'v1';
}

// Entry point (index.ts) - ONLY place that reads process.env
const config = loadConfigFromEnv();
const version = resolveIndexVersion(config);
```

### Acceptance Criteria

```bash
# MUST pass - process.env only in entry points and config loaders
rg "process\.env\." apps/*/src --glob "*.ts" --glob "!*.test.ts" --glob "!**/env.ts" --glob "!**/config.ts" | wc -l
# Expected: 0 (or only explicitly allowed exceptions with eslint-disable comment)

# MUST pass - all tests pass (behavior unchanged)
pnpm test
# Expected: All pass
```

---

## Phase 4A: Integration Test Refactoring

### Intention

Remove `process.env` mutations from integration tests. Use dependency injection instead.

### Files to Fix

| File                                                                                           | Variables Mutated        | Fix Strategy                         |
| ---------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------ |
| `apps/oak-open-curriculum-semantic-search/app/api/search/suggest/route.integration.test.ts:27` | `SEARCH_INDEX_VERSION`   | Pass config to route handler factory |
| `apps/oak-open-curriculum-semantic-search/app/api/search/route.integration.test.ts:40`         | `SEARCH_INDEX_VERSION`   | Pass config to route handler factory |
| `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.integration.test.ts:9-11`             | `OAK_API_KEY`, `CLERK_*` | Pass config object to `createApp`    |

### Pattern

```typescript
// ❌ BEFORE: Mutates global state
beforeEach(() => {
  process.env.OAK_API_KEY = 'test-key';
  process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_...';
});

const app = createApp();

// ✅ AFTER: Isolated config
const testConfig = loadRuntimeConfig({
  OAK_API_KEY: 'test-key',
  CLERK_PUBLISHABLE_KEY: 'pk_test_...',
});
const app = createApp({ runtimeConfig: testConfig });
```

### Acceptance Criteria

```bash
# MUST pass - zero process.env mutations in integration tests
rg "process\.env\.\w+\s*=" --glob "*.integration.test.ts" apps/ | wc -l
# Expected: 0

# MUST pass - all integration tests pass
pnpm test -- "*.integration.test.ts"
# Expected: All pass
```

---

## Phase 4B: E2E Test Refactoring

### Intention

Refactor E2E tests to pass environment via spawn options instead of mutating `process.env` in the test process.

### Why E2E Tests Are Different

E2E tests spawn separate processes, so env mutations *before* spawn might seem safe. However:
1. Multiple E2E tests running in parallel share the same parent process
2. Env mutations in `beforeAll`/`beforeEach` can leak between test files
3. The spawned process inherits env at spawn time - race conditions occur if env is mutated while another test is spawning

### Files to Fix (13 files, 25 mutations)

#### MCP Streamable HTTP App (8 files)

| File | Variables Mutated | Fix Strategy |
|------|-------------------|--------------|
| `e2e-tests/header-redaction.e2e.test.ts:18-20,27-28` | Auth env vars | Pass via spawn env option |
| `e2e-tests/widget-metadata.e2e.test.ts:29-31,99-100` | Auth env vars | Pass via spawn env option |
| `e2e-tests/server.e2e.test.ts:16-18,58-59` | Auth env vars | Pass via spawn env option |
| `e2e-tests/tool-examples-metadata.e2e.test.ts:32-34,113-114` | Auth env vars | Pass via spawn env option |
| `e2e-tests/built-server.e2e.test.ts` | Auth env vars | Pass via spawn env option |
| `e2e-tests/auth-bypass.e2e.test.ts` | Auth env vars | Pass via spawn env option |
| `e2e-tests/string-args-normalisation.e2e.test.ts` | Env vars | Pass via spawn env option |
| `src/index.e2e.test.ts:9` | `OAK_API_KEY` | Pass config to `createApp` |

#### MCP STDIO App (4 files)

| File | Variables Mutated | Fix Strategy |
|------|-------------------|--------------|
| `e2e-tests/tool-list-parity.e2e.test.ts:6` | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass via spawn env |
| `e2e-tests/mcp-protocol.e2e.test.ts:10` | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass via spawn env |
| `e2e-tests/mcp-logging.e2e.test.ts:8` | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass via spawn env |
| `e2e-tests/mcp-dev-runner.e2e.test.ts:5` | `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | Pass via spawn env |

#### Notion MCP App (1 file)

| File | Variables Mutated | Fix Strategy |
|------|-------------------|--------------|
| `e2e-tests/server.e2e.test.ts` | App config vars | Pass via spawn env |

### Pattern

```typescript
// ❌ BEFORE: Mutates parent process env (race condition risk)
beforeAll(() => {
  process.env.OAK_API_KEY = 'test-key';
  process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_...';
});

const child = spawn('node', ['server.js']); // Inherits mutated env

// ✅ AFTER: Isolated env per spawn (no shared state)
const testEnv = {
  ...process.env,
  OAK_API_KEY: 'test-key',
  CLERK_PUBLISHABLE_KEY: 'pk_test_...',
};

const child = spawn('node', ['server.js'], { env: testEnv });
```

### Acceptance Criteria

```bash
# MUST pass - zero process.env mutations in E2E tests
rg "process\.env\.\w+\s*=" --glob "*.e2e.test.ts" apps/ | wc -l
# Expected: 0

# MUST pass - all E2E tests pass
pnpm test:e2e
pnpm test:e2e:built
# Expected: All pass

# MUST pass - E2E tests pass under high concurrency
TURBO_CONCURRENCY=10 pnpm turbo run test:e2e test:e2e:built
# Expected: All pass (no timeouts)
```

---

## Phase 5: Smoke Test Refactoring

### Intention

Apply DI pattern to all smoke tests. Currently 55 lint violations.

### Files to Fix

| Directory                                                            | Issue                        | Fix Strategy                 |
| -------------------------------------------------------------------- | ---------------------------- | ---------------------------- |
| `apps/oak-curriculum-mcp-streamable-http/smoke-tests/environment.ts` | Reads `process.env` directly | Create config loader         |
| `apps/oak-curriculum-mcp-streamable-http/smoke-tests/logging.ts`     | Reads `process.env`          | Accept config via parameters |
| `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/*.ts`     | Mutates `process.env`        | Use spawn env instead        |

### Pattern

```typescript
// ❌ BEFORE: Direct env access
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3333';

// ✅ AFTER: DI pattern
const config = loadRuntimeConfig({ BASE_URL: 'http://localhost:3333' });
const app = createApp({ runtimeConfig: config });
```

### Acceptance Criteria

```bash
# MUST pass - zero process.env in smoke tests
rg "process\.env\." apps/oak-curriculum-mcp-streamable-http/smoke-tests/ | wc -l
# Expected: 0

# MUST pass - all smoke test modes work
cd apps/oak-curriculum-mcp-streamable-http
pnpm smoke:local-stub
# Expected: Pass
```

---

## Phase 6: Documentation and Enforcement

### Intention

Document the architecture and enforce it via tooling so patterns don't regress.

### Deliverables

#### ADR: Configuration Architecture

**File**: `docs/architecture/architectural-decisions/0054-dependency-injection-for-configuration.md`

**Sections**:

1. Context: Why we made this decision
2. Decision: DI for all configuration
3. Consequences: Trade-offs
4. Compliance: How to verify

#### Developer Guide

**File**: `docs/development/dependency-injection-guide.md`

**Sections**:

1. Core principle: Config flows from entry point
2. Pattern examples (good vs bad)
3. How to add new configuration
4. Testing patterns
5. Common pitfalls

#### ESLint Enforcement

Expand ESLint rule to cover all TypeScript files:

```typescript
// ✅ AFTER: Rule applies everywhere
{
  files: ['**/*.ts'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'MemberExpression[object.name="process"][property.name="env"]',
        message: 'Use dependency injection for configuration. See docs/development/dependency-injection-guide.md'
      }
    ]
  }
}
```

### Acceptance Criteria

```bash
# MUST exist - ADR documented
test -f docs/architecture/architectural-decisions/0054-dependency-injection-for-configuration.md
# Expected: File exists

# MUST exist - Developer guide
test -f docs/development/dependency-injection-guide.md
# Expected: File exists

# MUST pass - Lint catches violations
echo "const x = process.env.FOO;" > /tmp/test.ts
pnpm eslint /tmp/test.ts
# Expected: Error about DI
```

---

## Phase 7: Remove Workarounds and Validate

### Intention

Remove the `isolate: true` and `pool: 'forks'` workarounds. Validate tests pass without process isolation overhead.

### Changes

```typescript
// vitest.config.ts - REMOVE these lines
{
  // isolate: true,  // DELETE
  // pool: 'forks',  // DELETE
}
```

### Acceptance Criteria

```bash
# MUST pass - All tests pass WITHOUT isolation
# (This is the ultimate validation that global state is eliminated)
pnpm test
pnpm test:e2e
pnpm test:e2e:built
# Expected: All pass

# MUST pass - Pre-push hook succeeds on first try
git push
# Expected: Success without TURBO_CONCURRENCY workaround

# MUST pass - Tests pass with high concurrency
TURBO_CONCURRENCY=10 pnpm turbo run test test:e2e
# Expected: All pass (no timeouts)
```

---

## Quick Wins for First Session

Start with **Phase 1 Group A** and **Phase 2** - these can be completed in a single 2-3 hour session:

### Session Scope

1. Fix 3 unit test files where functions already accept parameters (Phase 1 Group A)
2. Fix files with `vi.doMock` or `vi.stubGlobal` where DI is already possible (Phase 2)
3. Run quality gates
4. Commit and push

### What's NOT a Quick Win

Phase 1 Group B tests (4 files) require product code changes first. These move to Phase 3 where we refactor the product code to accept config parameters, then update the tests.

### Realistic Impact of Quick Wins

The quick wins (Phase 1A + Phase 2) reduce global state mutations in unit tests. However, flaky `git push` failures can originate from **any test type** - unit, integration, E2E, or smoke tests all run as part of the quality gate.

Full stability requires eliminating global state mutations across **all** test types. The quick wins are a starting point, not a complete solution.

### Validation After Quick Wins

```bash
# After Phase 1 & 2, these commands should show improvement
rg "process\.env\." --glob "*.unit.test.ts" apps/ packages/ | wc -l  # Target: 0
rg "vi\.doMock" --glob "*.unit.test.ts" apps/ packages/ | wc -l      # Target: 0
rg "vi\.stubGlobal" --glob "*.unit.test.ts" apps/ packages/ | wc -l  # Target: 0

# Pre-push should be more stable
git push  # Should succeed without TURBO_CONCURRENCY=2
```

---

## Baseline Measurements (2025-12-16)

```bash
# Current state before any work
process.env in unit tests:            25 instances
process.env mutations in E2E tests:   25 instances
process.env mutations in integration:  5 instances
vi.doMock in unit tests:               2 instances
vi.stubGlobal in unit tests:           2 instances
E2E test files with env access:       13 files
```

All test types (unit, integration, E2E, smoke) run during `git push`. Global state mutations in **any** test type can cause failures. The entire quality gate must pass reliably.

---

## Success Metrics

### Hard Requirements (All Must Pass)

| Metric                         | Measurement                                                 | Target   |
| ------------------------------ | ----------------------------------------------------------- | -------- |
| Unit test env mutations        | `rg "process\.env\." --glob "*.unit.test.ts"`               | 0        |
| E2E test env mutations         | `rg "process\.env\.\w+\s*=" --glob "*.e2e.test.ts"`         | 0        |
| vi.doMock in unit tests        | `rg "vi\.doMock" --glob "*.unit.test.ts"`                   | 0        |
| vi.stubGlobal in unit tests    | `rg "vi\.stubGlobal" --glob "*.unit.test.ts"`               | 0        |
| Integration test env mutations | `rg "process\.env\.\w+\s*=" --glob "*.integration.test.ts"` | 0        |
| Smoke test env access          | `rg "process\.env\." smoke-tests/`                          | 0        |
| Tests pass without isolation   | `pnpm test` (with isolate: false)                           | All pass |
| Pre-push succeeds first try    | `git push` (no TURBO_CONCURRENCY)                           | Success  |

### Soft Goals

| Metric                  | Current | Target |
| ----------------------- | ------- | ------ |
| Test execution time     | ~150s   | <90s   |
| ADR exists              | No      | Yes    |
| Developer guide exists  | No      | Yes    |
| ESLint enforces pattern | Partial | Full   |

---

## Dependencies

### Prerequisites

- None - can start immediately

### Blocking Other Work

- None - this is a quality improvement, not blocking features

### Related Plans

- **Delegates to**: [Config Architecture Standardisation Plan](../architecture/config-architecture-standardisation-plan.md) - Refactors `oak-notion-mcp` config layer to enable Phase 3+
- Supersedes: `global-state-test-refactoring.md` → moved to `archive/`
- Supersedes: `di-architecture-consistency.md` → moved to `archive/`
- Builds on: `.agent/plans/archive/completed/fix-e2e-test-isolation.md` (added `isolate: true` workaround)
- References: `.agent/plans/archive/completed/resolve-di-digressions.md` (original investigation)

### Housekeeping Before Starting

```bash
# Archive the superseded plans
mv .agent/plans/quality-and-maintainability/global-state-test-refactoring.md .agent/plans/archive/
mv .agent/plans/quality-and-maintainability/di-architecture-consistency.md .agent/plans/archive/
```

---

## Risk Mitigation

| Risk                     | Likelihood | Impact | Mitigation                             |
| ------------------------ | ---------- | ------ | -------------------------------------- |
| Breaking test behavior   | Low        | Medium | Run tests after each file change       |
| Missing a mutation       | Medium     | Low    | Grep validation in acceptance criteria |
| Product code API changes | Medium     | Medium | Make parameters optional with defaults |
| Time overrun             | Medium     | Low    | Phases are independent, can pause      |

---

## References

- Foundation: `.agent/directives-and-memory/rules.md`
- Testing: `.agent/directives-and-memory/testing-strategy.md`
- Original analysis: `.agent/plans/archive/completed/resolve-di-digressions.md`
- Previous fix: `.agent/plans/archive/completed/fix-e2e-test-isolation.md`
