# E2E Test Isolation via Dependency Injection

**Last Updated**: 2025-11-17  
**Status**: 🟡 PLANNED - Ready for implementation  
**Scope**: Eliminate global state mutation in E2E tests to fix race conditions

---

## Context

E2E tests currently mutate global `process.env`, creating coupling between tests when run sequentially in `singleFork: true` mode. This causes intermittent test failures due to race conditions.

**Evidence**: `auth-enforcement.e2e.test.ts` fails intermittently because previous tests set `DANGEROUSLY_DISABLE_AUTH='true'` in `process.env`, and the cleanup is not perfect.

**Root Cause**: Tests manipulating global state instead of using dependency injection.

**Existing Capabilities**: Product code already supports DI via:

- `loadRuntimeConfig(source: NodeJS.ProcessEnv)` - accepts isolated env object
- `createApp({ runtimeConfig })` - accepts pre-configured runtime config

---

## Problem Statement

### Current Architecture Issues

1. **Global State Mutation**: Tests directly modify `process.env`

   ```typescript
   // BAD: Mutates global state
   process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
   ```

2. **Test Coupling**: Sequential test execution in single fork means env pollution persists

   ```typescript
   // vitest.e2e.config.ts
   test: { pool: 'forks', poolOptions: { forks: { singleFork: true } } }
   ```

3. **Cleanup Complexity**: Attempting to restore `process.env` is brittle and error-prone

### Manifestation

- `auth-enforcement.e2e.test.ts` expects `DANGEROUSLY_DISABLE_AUTH` to be unset
- Previous tests (`auth-bypass.e2e.test.ts`, `create-stubbed-http-app.ts`) set it to `'true'`
- Test execution order determines pass/fail (race condition)
- Tests pass in isolation, fail when run in sequence

---

## Solution Architecture

### Principle (from @rules.md and @testing-strategy.md)

> "Tests should not have complex setup/teardown - that's a signal to simplify"
> "Mutating global state creates coupling"
> "Use dependency injection with pure functions"

### Strategy

**Replace global state mutation with isolated env objects passed via DI.**

---

## Resolution Plan

### Phase 1: Update Test Helpers (2 hours)

#### Task 1.1: Refactor `create-stubbed-http-app.ts`

**Current Implementation** (line 39):

```typescript
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
```

**Target Implementation**:

```typescript
export function createStubbedHttpApp(envOverrides: Partial<NodeJS.ProcessEnv> = {}): Express {
  // Create isolated env - NO global mutation
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    DANGEROUSLY_DISABLE_AUTH: 'true',
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
    CLERK_PUBLISHABLE_KEY: 'pk_test_...',
    CLERK_SECRET_KEY: 'sk_test_...',
    ...envOverrides,
  };

  // Use DI - pass isolated env
  const runtimeConfig = loadRuntimeConfig(testEnv);
  return createApp({ runtimeConfig });
}
```

**Changes**:

- Accept `envOverrides` parameter for test-specific config
- Create isolated `testEnv` object (not mutating `process.env`)
- Use `loadRuntimeConfig(testEnv)` instead of `loadRuntimeConfig()` (default)
- Pass `runtimeConfig` to `createApp()`

**Testing**:

- Run smoke tests to verify stubbed app still works
- Verify no `process.env` mutations occur

---

#### Task 1.2: Refactor `create-live-http-app.ts`

**Current Implementation** (line 8):

```typescript
export function createLiveHttpApp(): Express {
  return createApp();
}
```

**Target Implementation**:

```typescript
export function createLiveHttpApp(envOverrides: Partial<NodeJS.ProcessEnv> = {}): Express {
  // Create isolated env with live credentials
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    // Copy all required env vars from process.env
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ?? '',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? '',
    OAK_CURRICULUM_API_KEY: process.env.OAK_CURRICULUM_API_KEY ?? '',
    // Explicitly do NOT set DANGEROUSLY_DISABLE_AUTH or USE_STUB_TOOLS
    ...envOverrides,
  };

  // Use DI - pass isolated env
  const runtimeConfig = loadRuntimeConfig(testEnv);
  return createApp({ runtimeConfig });
}
```

**Changes**:

- Accept `envOverrides` parameter
- Create isolated `testEnv` with explicit credential copying
- Use DI for config creation
- Default behavior: auth ENABLED, live tools

**Testing**:

- Run auth enforcement tests to verify security works
- Verify credentials are properly loaded

---

### Phase 2: Update E2E Tests (1 hour)

#### Task 2.1: Update `auth-enforcement.e2e.test.ts`

**Current Implementation** (before line 8):

```typescript
describe('Auth Enforcement (E2E - Production Equivalent)', () => {
  let app: Express;

  beforeAll(() => {
    app = createLiveHttpApp();
  });
  // ...
});
```

**Target Implementation**:

```typescript
describe('Auth Enforcement (E2E - Production Equivalent)', () => {
  let app: Express;

  beforeAll(() => {
    // Explicitly pass env with auth ENABLED
    app = createLiveHttpApp({
      // Ensure DANGEROUSLY_DISABLE_AUTH is NOT set
      DANGEROUSLY_DISABLE_AUTH: undefined,
    });
  });
  // ...
});
```

**Changes**:

- Explicitly pass `envOverrides` to ensure test isolation
- Make test expectations clear in code
- No `process.env` mutation anywhere

---

#### Task 2.2: Update `auth-bypass.e2e.test.ts`

**Current Implementation** (line 26):

```typescript
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
```

**Target Implementation**:

```typescript
// Remove global mutation entirely - handled by createLiveHttpApp
app = createLiveHttpApp({
  DANGEROUSLY_DISABLE_AUTH: 'true',
});
```

**Changes**:

- Remove `process.env` mutation
- Pass auth bypass config via DI

---

#### Task 2.3: Update Other E2E Tests Using Helpers

All tests using `createStubbedHttpApp()` should continue working without changes, since:

- Stub helper already sets `DANGEROUSLY_DISABLE_AUTH: 'true'` in isolated env
- No global state mutation occurs
- Tests remain isolated

**Verification**:

```bash
grep -r "createStubbedHttpApp\|createLiveHttpApp" e2e-tests/
```

Review each usage and confirm no `process.env` mutations occur in test files.

---

### Phase 3: Validation (30 minutes)

#### Task 3.1: Run E2E Tests Sequentially

```bash
pnpm test:e2e
```

**Success Criteria**:

- All E2E tests pass
- `auth-enforcement.e2e.test.ts` passes consistently (run 10 times)
- No test failures due to env pollution

---

#### Task 3.2: Verify No Global State Mutation

**Add Static Analysis Check**:

Create `e2e-tests/.eslintrc.cjs`:

```javascript
module.exports = {
  rules: {
    'no-process-env-mutation': [
      'error',
      {
        message: 'E2E tests must not mutate process.env - use DI instead',
      },
    ],
  },
};
```

**Manual Verification**:

```bash
# Should find ZERO occurrences
grep -r "process.env\." e2e-tests/ --exclude="*.md"
```

---

#### Task 3.3: Full Quality Gate

Run complete quality gate sequence:

```bash
pnpm i
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm -F @oaknational/oak-curriculum-sdk docs:all
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
```

All steps must pass with zero failures.

---

## Testing Strategy

### Unit Tests

No new unit tests required - existing unit tests for `loadRuntimeConfig` already cover DI behavior.

**Existing Coverage**:

- `runtime-config.unit.test.ts` - tests config loading with various env inputs
- `security-config.unit.test.ts` - tests security config resolution

---

### Integration Tests

**Minimal Integration Testing**:

Add integration test in `application.integration.test.ts`:

```typescript
describe('createApp with custom runtime config', () => {
  it('should accept runtime config via DI', () => {
    const customEnv = {
      NODE_ENV: 'test',
      DANGEROUSLY_DISABLE_AUTH: 'true',
    };
    const runtimeConfig = loadRuntimeConfig(customEnv);
    const app = createApp({ runtimeConfig });

    expect(app).toBeDefined();
    expect(runtimeConfig.dangerouslyDisableAuth).toBe(true);
  });
});
```

**Purpose**: Verify DI pathway works end-to-end without mutation.

---

### E2E Tests

**Modified Tests**:

- `auth-enforcement.e2e.test.ts` - updated to use DI
- `auth-bypass.e2e.test.ts` - updated to use DI
- All other E2E tests - continue using helpers (no changes needed)

**Validation**:

- Run tests 10 times consecutively: `for i in {1..10}; do pnpm test:e2e || break; done`
- All runs must pass (no race conditions)

---

## Success Criteria

### Phase 1 (Test Helpers)

- ✅ `create-stubbed-http-app.ts` uses isolated env, no global mutation
- ✅ `create-live-http-app.ts` uses isolated env, no global mutation
- ✅ Both helpers accept `envOverrides` parameter
- ✅ Smoke tests pass with refactored helpers

### Phase 2 (E2E Tests)

- ✅ `auth-enforcement.e2e.test.ts` uses DI, no global mutation
- ✅ `auth-bypass.e2e.test.ts` uses DI, no global mutation
- ✅ Zero `process.env` mutations in any E2E test file
- ✅ All E2E tests pass

### Phase 3 (Validation)

- ✅ E2E tests pass consistently (10 consecutive runs)
- ✅ No race conditions detected
- ✅ Full quality gate passes
- ✅ Static analysis confirms no `process.env` mutations

### Overall

- ✅ Test isolation achieved
- ✅ Race conditions eliminated
- ✅ No behavioral changes to product code
- ✅ Test architecture improved (simpler, more maintainable)

---

## Dependencies

**Blocking**: None - can implement immediately

**Related Plans**:

- `streamable-http-quality-gate-fixes.md` - complementary code quality work

**Prerequisites**:

- ✅ Product code already supports DI (`loadRuntimeConfig`, `createApp`)
- ✅ Race condition identified and root cause understood

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: "Why are we doing this, and why does that matter?"

**Immediate Value**:

- **Reliability**: Tests pass consistently, no intermittent failures
- **Debuggability**: Test failures indicate real bugs, not env pollution
- **Simplicity**: No complex setup/teardown logic needed

**System-Level Impact**:

- **Velocity**: Developers trust tests, run them frequently
- **Maintainability**: Tests are simple, easy to understand and modify
- **Architecture**: Forces good design (DI, pure functions, no global state)
- **CI/CD**: Reliable tests enable confident automated deployment

**Risk of Not Doing**:

- **False positives**: Tests fail for wrong reasons (env pollution, not bugs)
- **False negatives**: Tests pass but leave env pollution that breaks later tests
- **Developer friction**: Flaky tests reduce trust, slow development
- **Hidden bugs**: Race conditions mask real issues

### Alignment with @rules.md and @testing-strategy.md

**From testing-strategy.md**:

> "Unit tests: no I/O, no mocks, test pure functions in isolation"
> "Integration tests: simple injected mocks, no actual I/O"
> "E2E tests: full stack, but isolated test data"

**From rules.md**:

> "Avoid complex setup/teardown - signal to simplify"
> "Use pure functions with dependency injection"
> "Type safety and validation at boundaries"

**This Plan**:

- ✅ Eliminates complex env cleanup (setup/teardown)
- ✅ Uses DI for test isolation
- ✅ Maintains type safety (uses existing typed interfaces)
- ✅ No new mocks or test complexity

---

## References

- Product code DI: `src/runtime-config.ts:loadRuntimeConfig()`
- App bootstrap: `src/application.ts:createApp()`
- Test helpers: `e2e-tests/helpers/create-*-http-app.ts`
- Failing test: `e2e-tests/auth-enforcement.e2e.test.ts`
- Testing strategy: `.agent/directives-and-memory/testing-strategy.md`
- Rules: `.agent/directives-and-memory/rules.md`
- Vitest config: `apps/oak-curriculum-mcp-streamable-http/vitest.e2e.config.ts`

---

## Implementation Notes

### Key Insight

The product code **already supports DI perfectly** - we just need to **use it in tests** instead of fighting against it with global state mutation.

### Migration Path

1. **Phase 1**: Fix helpers (central point of control)
2. **Phase 2**: Fix tests that directly mutate env
3. **Phase 3**: Validate isolation with repeated runs

### Minimal Risk

- No product code changes required
- Test behavior unchanged (same logic, different isolation mechanism)
- Can implement incrementally (one test file at a time)
- Easy to verify (run tests repeatedly, check for consistency)

---

## Future Enhancements (Out of Scope)

- Add ESLint rule to prevent future `process.env` mutations in tests
- Consider extracting common env configurations to test fixtures
- Document DI pattern in testing guide
- Apply same pattern to unit/integration tests if needed
