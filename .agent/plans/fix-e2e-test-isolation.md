# Fix E2E Test Isolation

**Status**: 🚧 IN PROGRESS (Phases 1-3 ✅ Complete, Phase 3B Ready, Phase 4 Pending)  
**Priority**: P0 - Blocking (tests failing)  
**Estimated Effort**: 2.5 hours (revised: +30 min for generator fix)  
**Created**: 2025-11-19  
**Last Updated**: 2025-11-19 (Root Cause Analysis Complete - Generator Issue Identified)

---

## Problem Statement

E2E tests are failing due to two distinct, focused issues:

### Issue 1: Test Race Conditions (streamable-http)

E2E tests mutate global `process.env`, creating coupling between tests. This causes intermittent failures.

**Evidence**: `auth-enforcement.e2e.test.ts` expects auth enabled, but previous tests set `DANGEROUSLY_DISABLE_AUTH='true'` in `process.env`.

**Impact**: Tests pass in isolation, fail when run sequentially.

### Issue 2: Nested vs Flat Arguments (stdio)

E2E tests pass arguments in old nested format (`{ params: { path: { lesson: 'x' } } }`), but tools now expect flat format (`{ lesson: 'x' }`).

**Evidence**:

- `multi-status-handling.e2e.test.ts` - 2 failures
- `mcp-protocol.e2e.test.ts` - 2 failures

**Root Cause**: Tests not updated after P0 flat schema generator fix.

---

## Solution Strategy

### Core Insight

**The product code already provides everything we need.** We just need to use the existing DI capabilities (`loadRuntimeConfig(source)`, `createApp({ runtimeConfig })`) instead of mutating global state.

### Principle (from @rules.md)

> "Could it be simpler?"

**Answer**: YES - use what exists, don't add more.

### Approach

1. **Fix product code DI violations** (6 files, 15 min) - Blocking clean test isolation
2. **Fix test helpers** (2 files, 30 min) - Use isolated env objects
3. **Fix E2E tests** (2 files, 30 min) - Remove `process.env` mutations
4. **Fix stdio arguments** (2 files, 30 min) - Flat instead of nested
5. **Validate** (15 min) - Run tests repeatedly, verify isolation

**Total**: ~2 hours

---

## Implementation Plan

### Phase 1: Fix Product Code DI Violations (15 minutes)

**Why first**: These 6 violations prevent clean test isolation and are trivial to fix.

**Files to fix**:

1. **`src/auth-routes.ts:48`** - Pass config instead of reading `process.env.CLERK_PUBLISHABLE_KEY`
2. **`src/index.ts:16`** - Use `config.port` instead of `process.env.PORT`
3. **`src/index.ts:22`** - Use `config.dangerouslyDisableAuth` instead of `process.env`
4. **`src/logging/index.ts:42`** - Accept version via parameter instead of `process.env.npm_package_version`

#### Task 1.1: Fix auth-routes.ts

**Current**:

```typescript
const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
```

**Fixed**:

```typescript
export function createAuthRoutes(config: RuntimeConfig): Router {
  const publishableKey = config.env.CLERK_PUBLISHABLE_KEY;
  // ...
}
```

#### Task 1.2: Fix index.ts

**Current**:

```typescript
const port = Number(process.env.PORT ?? 3333);
// ...
if (process.env.DANGEROUSLY_DISABLE_AUTH === 'true') {
```

**Fixed**:

```typescript
const config = loadRuntimeConfig();
const port = config.port;
// ...
if (config.dangerouslyDisableAuth) {
```

#### Task 1.3: Fix logging/index.ts

**Current**:

```typescript
process.env.npm_package_version ?? '0.0.0';
```

**Fixed**:

```typescript
export function createHttpLogger(config: RuntimeConfig, options: { name: string }): Logger {
  // Use config.env.npm_package_version
}
```

**Validation**:

```bash
# Should find only 1 match (the ESLint exception in env.ts or runtime-config.ts)
grep -r "process\.env\." apps/oak-curriculum-mcp-streamable-http/src/ \
  --exclude="*.test.ts" \
  --exclude="env.ts" \
  -n | wc -l
# Expected: 1 (runtime-config.ts with exception comment)

pnpm type-check
pnpm lint --filter @oaknational/oak-curriculum-mcp-streamable-http
# Expected: exit 0 (ESLint rule only checks product code, not tests/smoke tests)
pnpm test
```

---

### Phase 2: Fix Test Helpers (30 minutes)

#### Task 2.1: Fix create-stubbed-http-app.ts

**Current** (mutates global state):

```typescript
export function createStubbedHttpApp(): Express {
  process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  return createApp();
}
```

**Fixed** (isolated env):

```typescript
export function createStubbedHttpApp(envOverrides: Partial<NodeJS.ProcessEnv> = {}): Express {
  // Create isolated env - NO global mutation
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    DANGEROUSLY_DISABLE_AUTH: 'true',
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ?? 'pk_test_stub',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? 'sk_test_stub',
    OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-key',
    ...envOverrides,
  };

  // Use DI - pass isolated env
  const runtimeConfig = loadRuntimeConfig(testEnv);
  return createApp({ runtimeConfig });
}
```

#### Task 2.2: Fix create-live-http-app.ts

**Current**:

```typescript
export function createLiveHttpApp(): Express {
  return createApp();
}
```

**Fixed**:

```typescript
export function createLiveHttpApp(envOverrides: Partial<NodeJS.ProcessEnv> = {}): Express {
  // Create isolated env with live credentials
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ?? '',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? '',
    OAK_API_KEY: process.env.OAK_API_KEY ?? '',
    // Explicitly do NOT set DANGEROUSLY_DISABLE_AUTH or USE_STUB_TOOLS
    // This means auth ENABLED, live tools by default
    ...envOverrides,
  };

  const runtimeConfig = loadRuntimeConfig(testEnv);
  return createApp({ runtimeConfig });
}
```

**Validation**:

```bash
# Verify no process.env mutations in helpers
grep "process\.env\.[A-Z_]* =" apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/*.ts
# Expected: NO MATCHES (exit code 1)

pnpm type-check
pnpm lint --filter @oaknational/oak-curriculum-mcp-streamable-http
pnpm test
```

---

### Phase 3: Fix E2E Tests ✅ COMPLETE (45 minutes)

### Phase 3B: Fix Generator JSON Schema (30 minutes) 🎯 NEXT

**Discovery**: Initial plan identified 2 files, but quality gate analysis revealed **5 total E2E test files** use the refactored helpers and need updating.

**Post-Phase 3 Discovery**: 6 failing tests in `sdk-client-stub.e2e.test.ts` are caused by generator emitting nested JSON schemas instead of flat ones. This is NOT a test issue - tests are correct. Root cause: `buildInputSchemaObject()` in generator wraps parameters in `{ params: {...} }` structure, but MCP clients send flat arguments.

#### Task 3.1: Fix auth-enforcement.e2e.test.ts ✅ COMPLETE

**Current**:

```typescript
beforeAll(() => {
  app = createLiveHttpApp();
});
```

**Fixed**:

```typescript
beforeAll(() => {
  // Create isolated env with auth ENABLED (production equivalent)
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    CLERK_PUBLISHABLE_KEY: 'pk_test_...',
    CLERK_SECRET_KEY: 'sk_test_dummy_for_testing',
    OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-api-key',
    // Explicitly do NOT set DANGEROUSLY_DISABLE_AUTH
  };
  const runtimeConfig = loadRuntimeConfig(testEnv);
  app = createApp({ runtimeConfig });
});
```

#### Task 3.2: Fix auth-bypass.e2e.test.ts ✅ COMPLETE

**Current** (line 26):

```typescript
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
app = createLiveHttpApp();
```

**Fixed**:

```typescript
beforeAll(() => {
  // Create isolated env with auth DISABLED (DX helper validation)
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    DANGEROUSLY_DISABLE_AUTH: 'true',
    CLERK_PUBLISHABLE_KEY: 'pk_test_...',
    CLERK_SECRET_KEY: 'sk_test_dummy_for_testing',
    OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-api-key',
    ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  };
  const runtimeConfig = loadRuntimeConfig(testEnv);
  app = createApp({ runtimeConfig });
});
```

#### Task 3.3: Fix live-mode.e2e.test.ts ⚠️ INCOMPLETE

**Issue**: Test calls `createLiveHttpApp({ overrides: ... })` but new signature is:

```typescript
export interface CreateLiveHttpAppOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly envOverrides?: Partial<NodeJS.ProcessEnv>;
}
export function createLiveHttpApp(options?: CreateLiveHttpAppOptions): LiveHttpApp;
```

**Current** (lines 66, 95):

```typescript
const { app } = createLiveHttpApp({ overrides: createOverrides(captured) });
```

**Fixed**:

```typescript
const { app } = createLiveHttpApp({
  overrides: createOverrides(captured),
  // envOverrides can be omitted - defaults to auth disabled for testing
});
```

**Status**: Causes 2 TypeScript errors + 2 test failures

#### Task 3.4: Fix sdk-client-stub.e2e.test.ts ⚠️ INCOMPLETE

**Issue**: Test helper `withStubbedHttpApp` doesn't pass through the return value correctly after refactor.

**Current**:

```typescript
async function withStubbedHttpApp<T>(callback: (app: Express) => Promise<T>): Promise<T> {
  const { app } = createStubbedHttpApp();
  return await callback(app);
}
```

**Status**: Works correctly - just needs validation. Causes 6 test failures due to undefined results.

#### Task 3.5: Fix stub-mode.e2e.test.ts ⚠️ INCOMPLETE

**Issue**: Similar to sdk-client-stub - tests expecting data but getting undefined.

**Current**: Tests call `createStubbedHttpApp()` directly.

**Status**: Causes 1 test failure.

**Validation**:

```bash
# Verify no process.env mutations in E2E tests
grep "process\.env\.[A-Z_]* =" apps/oak-curriculum-mcp-streamable-http/e2e-tests/*.e2e.test.ts
# Expected: NO MATCHES (exit code 1)

# Run E2E tests
cd apps/oak-curriculum-mcp-streamable-http
pnpm test:e2e
# Expected: All tests pass (75 total)

# Test isolation - run auth-enforcement 10 times
for i in {1..10}; do
  echo "Run $i/10"
  pnpm test:e2e auth-enforcement.e2e.test.ts || break
done
# Expected: 10/10 passes (no race conditions)
```

#### Task 3B.1: Replace buildInputSchemaObject with Flat Version

**Current** (lines 20-84 in `emit-input-schema.ts`):

```typescript
export function buildInputSchemaObject(
  pathParams: ParamMetadataMap,
  queryParams: ParamMetadataMap,
): JsonSchemaObject {
  // ... builds nested structure ...
  return {
    type: 'object',
    properties: { params: paramsSchema }, // ← NESTED
    required: ['params'],
    additionalProperties: false,
  };
}
```

**Fixed** (flat version):

```typescript
export function buildInputSchemaObject(
  pathParams: ParamMetadataMap,
  queryParams: ParamMetadataMap,
): JsonSchemaObject {
  // Merge path and query parameters - path first for consistency
  const allEntries = [...Object.entries(pathParams), ...Object.entries(queryParams)];

  const properties: Record<string, JsonSchemaProperty> = {};
  const required: string[] = [];

  for (const [name, meta] of allEntries) {
    properties[name] = jsonSchemaFromPrimitive(meta);
    if (meta.required) {
      required.push(name);
    }
  }

  return {
    type: 'object',
    properties, // ← FLAT
    additionalProperties: false,
    ...(required.length > 0 ? { required } : {}),
  };
}
```

**Rationale**:

- Mirrors existing `buildFlatMcpZodObject()` logic (lines 147-167)
- Nested structure was never needed - architectural mistake
- MCP clients expect flat arguments
- Simplifies system - removes duplicate schema representations

**Validation**:

```bash
cd packages/sdks/oak-curriculum-sdk

# Regenerate all tool descriptors
pnpm type-gen

# Verify generated tools now have flat schemas
grep -A 2 "toolInputJsonSchema" src/types/generated/api-schema/mcp-tools/generated/data/tools/get-subject-detail.ts
# Expected: Should show { subject: { type: 'string' } } NOT { params: { ... } }

# Rebuild SDK
pnpm build

# Run SDK tests
pnpm test
# Expected: All pass (may need to update any tests that expected nested format)

# Run streamable-http E2E tests
cd ../../../apps/oak-curriculum-mcp-streamable-http
pnpm test:e2e
# Expected: 75/75 passing (6 previously failing tests should now pass)
```

---

### Phase 4: Fix stdio Flat Arguments (30 minutes)

**Note**: This phase may no longer be needed if stdio tools already use flat schemas after generator fix. Verify before implementing.

#### Task 4.1: Fix multi-status-handling.e2e.test.ts

**Current** (lines 110-116):

```typescript
arguments: {
  params: {
    path: {
      lesson: 'add-and-subtract-two-numbers-that-bridge-through-10',
    },
  },
},
```

**Fixed**:

```typescript
arguments: {
  lesson: 'add-and-subtract-two-numbers-that-bridge-through-10',
},
```

#### Task 4.2: Fix mcp-protocol.e2e.test.ts

**Current** (lines 122-128):

```typescript
arguments: {
  params: {
    query: {
      q: 'fractions',
    },
  },
},
```

**Fixed**:

```typescript
arguments: {
  q: 'fractions',
},
```

**Validation**:

```bash
# Verify no nested params structure
grep "params:" apps/oak-curriculum-mcp-stdio/e2e-tests/*.e2e.test.ts
# Expected: NO MATCHES (exit code 1)

# Run stdio E2E tests
cd apps/oak-curriculum-mcp-stdio
pnpm test:e2e
# Expected: All 12 tests pass
```

---

### Phase 5: Validation (15 minutes)

#### Task 5.1: Run All E2E Tests

```bash
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp

# Run all E2E tests
pnpm test:e2e
# Expected: All pass (12 stdio + 75 streamable-http = 87 total)
```

#### Task 5.2: Test Stability

```bash
# Run auth-enforcement 10 times to verify no race conditions
for i in {1..10}; do
  echo "Run $i/10"
  cd apps/oak-curriculum-mcp-streamable-http
  pnpm test:e2e auth-enforcement.e2e.test.ts || break
  cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
done
# Expected: 10/10 passes
```

#### Task 5.3: Full Quality Gate

```bash
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
pnpm test        # Expected: exit 0
pnpm test:e2e    # Expected: exit 0
```

---

## Success Criteria

### Must Have

- ✅ All 6 product code violations fixed
- ✅ Test helpers use isolated env (no `process.env` mutations)
- ✅ E2E tests use isolated env (no `process.env` mutations)
- ✅ stdio tests use flat arguments
- ✅ All E2E tests pass (87 total)
- ✅ Auth-enforcement test passes 10 consecutive times
- ✅ All quality gates pass

### Verification

- ✅ `pnpm lint --filter @oaknational/oak-curriculum-mcp-streamable-http` passes (exit 0)
- ✅ ESLint rule scoped to product code only (`src/**/*.ts` excluding tests)
- ✅ Smoke tests and E2E tests temporarily excluded from rule (deferred to quality plan)
- ✅ Zero `process.env` mutations in E2E test files (manual verification)
- ✅ Zero nested argument structures in stdio tests

---

## Files Changed

**Product Code** (4 files): ✅ ALL COMPLETE

1. `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`
2. `apps/oak-curriculum-mcp-streamable-http/src/index.ts`
3. `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts`
4. `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`

**Generator** (1 file): 🎯 NEXT

1. `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`
   - Replace `buildInputSchemaObject()` function to emit flat schemas
   - Affects 27 generated tool files (regenerated automatically)

**Test Helpers** (2 files):

1. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-stubbed-http-app.ts`
2. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/create-live-http-app.ts`

**E2E Tests** (5 files):

1. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts` ✅
2. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-bypass.e2e.test.ts` ✅
3. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/live-mode.e2e.test.ts` ⚠️
4. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/sdk-client-stub.e2e.test.ts` ⚠️
5. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/stub-mode.e2e.test.ts` ⚠️

**Stdio Tests** (2 files):

1. `apps/oak-curriculum-mcp-stdio/e2e-tests/multi-status-handling.e2e.test.ts`
2. `apps/oak-curriculum-mcp-stdio/e2e-tests/mcp-protocol.e2e.test.ts`

**Total**: 14 files modified (6 product + 1 generator + 2 helpers + 5 E2E tests)
**Generated Files**: 27 tool descriptors (auto-regenerated by `pnpm type-gen`)

---

## Dependencies

**Blocking**: None - can start immediately

**Enables**: `.agent/plans/quality-and-maintainability/di-architecture-consistency.md` can proceed after this is complete

---

## Risks & Mitigations

### Risk 1: Helper Function Changes Break Tests

**Likelihood**: Low  
**Impact**: Medium (tests fail)

**Mitigation**:

- Test helpers immediately after changes
- Run full E2E suite after each phase
- Isolated changes make rollback easy

### Risk 2: Missing Env Vars in Test Env

**Likelihood**: Low  
**Impact**: Low (tests fail with clear error)

**Mitigation**:

- Copy all required vars to isolated env
- Test failures will be obvious and specific
- Easy to add missing vars

---

## Notes

### Why This Matters

**Immediate**:

- ✅ E2E tests become reliable
- ✅ No more race conditions
- ✅ Tests can run in any order
- ✅ Clear test expectations

**System-Level**:

- ✅ Developer velocity improves (trustworthy tests)
- ✅ CI/CD becomes reliable
- ✅ Architectural consistency improves
- ✅ Sets pattern for future test work

### Alignment with Foundation Documents

**From rules.md**:

- ✅ "Could it be simpler?" - YES, use existing DI
- ✅ "No global state" - Isolated env objects
- ✅ "Use pure functions with DI" - Exactly what we're doing

**From testing-strategy.md**:

- ✅ "E2E tests validate running systems" - Still true
- ✅ "No complex setup/teardown" - Isolated config removes need
- ✅ "Simple mocks" - Config objects are simple

**From schema-first-execution.md**:

- ✅ "Types flow from schema" - Flat arguments align with generated types
- ✅ "Generator is source of truth" - We're fixing tests to match

---

## What's NOT in This Plan

**Deferred to Quality Plan**:

- ❌ Smoke tests refactoring (55 violations)
- ❌ Integration tests refactoring (25 violations)
- ❌ Expanding ESLint rule to cover smoke tests and e2e-tests directories
- ❌ ADR creation
- ❌ Developer guide creation
- ❌ Package documentation updates

**Reason**: Those are quality improvements, not blocking issues. This plan focuses on making E2E tests work reliably NOW.

**Note on ESLint**: The `no-restricted-syntax` rule for `process.env` is currently scoped to `src/**/*.ts` (excluding tests). Smoke tests (`smoke-tests/**`) and E2E test helpers (`e2e-tests/**`) are temporarily excluded from the rule to allow phased implementation. These will be brought under the rule during the quality plan.

---

## Execution Progress & Quality Gate Analysis

### Phase 1: Product Code DI Violations ✅ COMPLETE

**Changes Made**:

1. **`src/auth-routes.ts`**: Modified `registerPublicOAuthMetadataEndpoints` to accept `runtimeConfig` parameter, changed `process.env.CLERK_PUBLISHABLE_KEY` to `runtimeConfig.env.CLERK_PUBLISHABLE_KEY`
2. **`src/index.ts`**: Changed `process.env.PORT` to `config.env.PORT` with fallback, changed `process.env.DANGEROUSLY_DISABLE_AUTH` to `config.dangerouslyDisableAuth`
3. **`src/logging/index.ts`**: Modified `createHttpLogger` to use `config.version` instead of `process.env.npm_package_version`
4. **`src/runtime-config.ts`**: Added `readonly version: string` field to `RuntimeConfig` interface, populated from `source.npm_package_version ?? '0.0.0'`
5. **`src/env.ts`**: Added `PORT: z.string().optional()` to `EnvSchema`, added ESLint disable comment for `readEnv` function
6. **`playwright.config.ts`**: Added ESLint disable comment for legitimate `process.env.PLAYWRIGHT_BASE_URL` access

**Validation Results**:

- type-check: ✅ PASSING
- lint: ✅ PASSING
- test (unit/integration): ✅ PASSING (288/288)

### Phase 2: Test Helpers ✅ COMPLETE

**Changes Made**:

1. **`e2e-tests/helpers/create-stubbed-http-app.ts`**:
   - Changed signature to accept `envOverrides: Partial<NodeJS.ProcessEnv> = {}`
   - Removed `restoreEnvironment` function and return value
   - Created isolated `testEnv` object instead of mutating `process.env`
   - Pass `testEnv` to `loadRuntimeConfig(testEnv)` and `createApp({ runtimeConfig })`
2. **`e2e-tests/helpers/create-live-http-app.ts`**:
   - Added `CreateLiveHttpAppOptions` interface with `overrides` and `envOverrides` properties
   - Changed signature to accept `options?: CreateLiveHttpAppOptions`
   - Removed `restoreEnvironment` function and return value
   - Created isolated `testEnv` object with auth disabled for testing
   - Pass `testEnv` to `loadRuntimeConfig(testEnv)` and `createApp({ runtimeConfig, toolHandlerOverrides: options?.overrides })`

**Decision**: Use options object pattern for `createLiveHttpApp` to support both tool handler overrides and environment overrides.

**Validation Results**:

- No `process.env` mutations in helper files
- type-check: ✅ PASSING
- test: ✅ PASSING

### Phase 3: E2E Tests ✅ MOSTLY COMPLETE (5/5 files addressed)

**Changes Made**:

1. **`auth-enforcement.e2e.test.ts`** ✅:
   - Refactored `beforeAll` to create isolated `testEnv` with auth ENABLED
   - Removed global `process.env` mutation
   - Directly call `loadRuntimeConfig(testEnv)` and `createApp({ runtimeConfig })`

2. **`auth-bypass.e2e.test.ts`** ✅:
   - Refactored `beforeAll` to create isolated `testEnv` with `DANGEROUSLY_DISABLE_AUTH: 'true'`
   - Removed global `process.env` mutation
   - Directly call `loadRuntimeConfig(testEnv)` and `createApp({ runtimeConfig })`

3. **`live-mode.e2e.test.ts`** ✅:
   - **Issue Found**: Helper functions `createOverrides()` and `createErrorOverrides()` already return `CreateLiveHttpAppOptions`, but tests were wrapping them again with `{ overrides: ... }`
   - **Fix Applied**: Changed `createLiveHttpApp({ overrides: createOverrides(captured) })` to `createLiveHttpApp(createOverrides(captured))`
   - **Result**: 2 tests now passing

4. **`stub-mode.e2e.test.ts`** ✅:
   - **Issue Found**: Line 84 called stub executor with nested args: `{ params: { path: { lesson: lessonSlug } } }`
   - **Fix Applied**: Changed to flat args: `{ lesson: lessonSlug }`
   - **Result**: All 4 tests now passing

5. **`sdk-client-stub.e2e.test.ts`** ⚠️:
   - **Issue Found**: 6/7 tests failing with `expected undefined to be defined` error
   - Tests call `callTool()` which returns `{ result?, envelope, text }`
   - `result` is undefined, meaning `parseJsonRpcResult(envelope)` throws in catch block (line 90-94)
   - **No Changes Made**: Helper function signature is correct, tests pass flat arguments correctly
   - **Remaining Failures**:
     - "returns key stages via get-key-stages"
     - "returns subject detail for a known slug"
     - "returns lesson summary payload"
     - "returns search results for lessons"
     - "returns search transcript results"
     - "returns rate limit status from stub tool"

**Validation Results**:

- Streamable HTTP E2E: **69/75 passing (92%)**
- Up from initial 66/75 (88%)
- Fixed 3 previously failing tests
- 6 tests in `sdk-client-stub.e2e.test.ts` remain failing

### Current Quality Gate Status (Post-Phase 3)

**type-check**: ✅ PASSING (Exit Code: 0)

- All TypeScript errors resolved
- 10 workspaces pass

**lint**: ✅ PASSING (Exit Code: 0)

- User fixed formatting issues
- All 10 workspaces pass

**test** (unit & integration): ✅ PASSING (Exit Code: 0)

- 288/288 tests passing
- All 10 workspaces pass

**test:e2e**: ⚠️ PARTIAL PASSING (Exit Code: 1)

- **Streamable HTTP**: 69/75 passing (6 failing)
  - All failures in `sdk-client-stub.e2e.test.ts`
  - Error pattern: `result` is undefined in `expectSuccessfulPayload(result)`
- **Stdio**: Not yet tested (Phase 4 pending)

### Files Modified Summary

**Product Code** (6 files): ✅ ALL COMPLETE

- `src/auth-routes.ts`
- `src/index.ts`
- `src/logging/index.ts`
- `src/runtime-config.ts`
- `src/env.ts`
- `playwright.config.ts`

**Test Helpers** (2 files): ✅ ALL COMPLETE

- `e2e-tests/helpers/create-stubbed-http-app.ts`
- `e2e-tests/helpers/create-live-http-app.ts`

**E2E Tests** (5 files): ⚠️ 4/5 FULLY WORKING

- ✅ `auth-enforcement.e2e.test.ts` (all tests passing)
- ✅ `auth-bypass.e2e.test.ts` (all tests passing)
- ✅ `live-mode.e2e.test.ts` (all tests passing)
- ✅ `stub-mode.e2e.test.ts` (all tests passing)
- ⚠️ `sdk-client-stub.e2e.test.ts` (1/7 passing, 6/7 failing)

### Outstanding Issues

**Issue 1: sdk-client-stub.e2e.test.ts - 6 Failing Tests** ✅ ROOT CAUSE IDENTIFIED

**Observed Behavior**:

- Tests call `callTool(app, toolName, args)` which posts to `/mcp` endpoint with FLAT arguments
- Response status is 200
- SSE envelope parsing succeeds
- `parseJsonRpcResult(envelope)` throws exception (caught on line 92)
- `result` variable is undefined
- `expectSuccessfulPayload(result)` fails with "expected undefined to be defined"
- Underlying error: `"path: ["params"], message: "Required"` - validation expects nested `{ params: {...} }` structure

**Root Cause Analysis** (Deep Dive Completed 2025-11-19):

**Multiple Source of Truth Problem - Generator Issue, NOT Test Issue**

The generator creates THREE schemas for tool arguments:

1. `toolInputJsonSchema` (NESTED): `{ params: { path: {...}, query: {...} } }` - for SDK `invoke()`
2. `toolMcpFlatInputSchema` (FLAT ZOD): `{ subject: string, ... }` - for MCP clients
3. `tool.inputSchema` (Currently points to #1, should point to flat JSON equivalent of #2)

**The Problem Flow**:

1. Generator emits `toolInputJsonSchema` with nested structure (line 80 in `emit-input-schema.ts`)
2. Tool descriptor sets `inputSchema: toolInputJsonSchema` (line 111 in `emit-index.ts`)
3. `listUniversalTools()` returns tools with this nested schema
4. `handlers.ts:48` extracts top-level properties: `zodRawShapeFromToolInputJsonSchema(tool.inputSchema)`
5. This creates `{ params: z.object({...}) }` expecting arguments with `params` wrapper
6. MCP clients send FLAT arguments: `{ subject: 'maths' }`
7. Validation fails: "Required: params"

**The Simple Fix**:

Replace `buildInputSchemaObject()` function (lines 20-84 in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`) with flat version that merges path and query parameters at the top level, matching `buildFlatMcpZodObject()` logic.

**Why Simple**:

- Nested JSON schema (`toolInputJsonSchema`) is NOT used anywhere else
- Only appears in: tool export, tool descriptor, passed through to registration
- Just generate it flat from the start - no need for two parallel schemas
- Mirrors existing `buildFlatMcpZodObject()` logic (lines 147-167)

**Failing Tests** (lines in sdk-client-stub.e2e.test.ts):

1. Line 208-215: "returns key stages via get-key-stages"
2. Line 217-241: "returns subject detail for a known slug"
3. Line 243-264: "returns lesson summary payload"
4. Line 266-279: "returns search results for lessons"
5. Line 281-293: "returns search transcript results"
6. Line 308-314: "returns rate limit status from stub tool"

**Passing Test**:

- Line 295-306: "returns lesson coverage and quiz downloads info" (mystery why this one works)

**Fix Location**: Generator, not tests
**Files to Change**: 1 file, 1 function (~65 lines)
**Estimated Time**: 10 minutes + rebuild + retest

### Architectural Success Validation

✅ **Product Code DI**: All `process.env` access now goes through `RuntimeConfig`
✅ **Test Helpers**: Create isolated environments, zero global mutations
✅ **Test Isolation**: 69/75 tests demonstrate isolated execution works
✅ **Type Safety**: All TypeScript compilation succeeds
✅ **Linting**: All ESLint rules pass with documented exceptions

### Next Steps

**Immediate**:

1. ✅ **COMPLETE** - Root cause identified for `sdk-client-stub.e2e.test.ts` failures
2. **NEW Phase 3B**: Fix generator to emit flat JSON schemas (10 min)
   - File: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-input-schema.ts`
   - Replace `buildInputSchemaObject()` function (lines 20-84) with flat version
   - Run `pnpm type-gen` to regenerate all tool descriptors
   - Run `pnpm build` to compile
   - Rerun streamable-http E2E tests - expect 75/75 passing
3. Phase 4: Fix stdio nested argument structures (2 files) - may also be fixed by generator change
4. Phase 5: Full validation and stability testing

**Note**: This is a **generator fix**, not a test fix. The tests are correct - they send flat arguments as MCP clients should. The generator was producing the wrong schema format.

---

## References

- Investigation: `.agent/plans/archive/resolve-di-digressions.md`
- Future work: `.agent/plans/quality-and-maintainability/di-architecture-consistency.md`
- Foundation: `.agent/directives-and-memory/rules.md`
- Testing: `.agent/directives-and-memory/testing-strategy.md`
- Schema-first: `.agent/directives-and-memory/schema-first-execution.md`
