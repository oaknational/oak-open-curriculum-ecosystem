# Dependency Injection Architecture Consistency

**Status**: 📋 PLANNED - Not started  
**Priority**: Medium - Quality improvement, not blocking  
**Estimated Effort**: 6-8 hours  
**Created**: 2025-11-19

---

## Context

During investigation of E2E test failures, we identified broader architectural inconsistencies around configuration management and dependency injection. While the critical blocking issues (test isolation) are being resolved separately, there remain quality improvements that would benefit the codebase long-term.

**Related Work**:

- `.agent/plans/fix-e2e-test-isolation.md` - Immediate test fixes (COMPLETE when this plan starts)
- `.agent/plans/archive/resolve-di-digressions.md` - Original investigation that identified these issues

---

## Problem Statement

### Current State

The codebase has **mixed patterns** for configuration management:

1. **Product code**: Some files use DI (`loadRuntimeConfig`), others read `process.env` directly
2. **Test code**: E2E tests use helpers (good), integration tests mutate `process.env` (bad), smoke tests are inconsistent
3. **Documentation**: No clear guidance on configuration patterns
4. **Enforcement**: ESLint rule exists but many files need updating

### Issues Identified

**Smoke Tests** (55 lint violations):

- 13 files with direct `process.env` access
- Inconsistent patterns across different smoke test modes
- Hard to maintain and understand

**Integration Tests** (25 lint violations):

- Mutate `process.env` in setup/teardown
- Can interfere with each other
- Not using DI capabilities

**Documentation Gap**:

- No ADR documenting DI decisions
- No developer guide for configuration patterns
- Package purpose unclear (`@oaknational/env`)

**Tooling**:

- ESLint rule exists but currently scoped to product code only (see Phase 4)
- Test files temporarily excluded to allow phased implementation
- Proper exceptions needed in config loading files

---

## Scope

### In Scope

1. **Refactor Smoke Tests** - Apply DI pattern to all smoke tests
2. **Refactor Integration Tests** - Remove `process.env` mutations, use DI
3. **Create ADR** - Document configuration architecture decision
4. **Create Developer Guide** - How to add/use configuration
5. **Update Package Docs** - Clarify `@oaknational/env` purpose
6. **Configure ESLint Exceptions** - Proper exceptions in config loading files

### Out of Scope

- ❌ Product code fixes (handled in `fix-e2e-test-isolation.md`)
- ❌ E2E test fixes (handled in `fix-e2e-test-isolation.md`)
- ❌ Type system changes
- ❌ New features or capabilities

---

## Value Proposition

### Benefits

**Maintainability**:

- Consistent patterns across all test types
- Clear guidance for new developers
- Self-documenting configuration dependencies

**Quality**:

- All tests isolated by default
- No risk of test interference
- Architectural decisions documented

**Velocity**:

- Faster onboarding
- Easier to add new configuration
- Reduced debugging time

### Costs

**Time**: 6-8 hours of focused work  
**Risk**: Low - tests validate behavior preservation  
**Disruption**: Minimal - test infrastructure only

### Trade-offs

**Do Now**:

- ✅ Prevents accumulation of technical debt
- ✅ Improves developer experience immediately
- ✅ Small scope, manageable in one session

**Do Later**:

- ⚠️ Not blocking any current work
- ⚠️ Other priorities may be more valuable
- ⚠️ Can be done incrementally over time

---

## Implementation Plan

### Phase 1: Refactor Smoke Tests (2 hours)

**Goal**: All smoke tests use DI pattern, zero `process.env` access

#### Task 1.1: Update Smoke Test Infrastructure

**Files to modify**:

- `smoke-tests/environment.ts` - Remove `process.env` reads
- `smoke-tests/logging.ts` - Accept config via parameters
- `smoke-tests/modes/*.ts` - Use helper functions with env overrides

**Pattern**:

```typescript
// ❌ BEFORE
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3333';

// ✅ AFTER
const config = loadRuntimeConfig({ BASE_URL: 'http://localhost:3333' });
const app = createApp({ runtimeConfig: config });
```

**Validation**:

```bash
# Verify no process.env in smoke tests
grep -r "process\.env\." apps/oak-curriculum-mcp-streamable-http/smoke-tests/ | wc -l
# Expected: 0
```

#### Task 1.2: Test Smoke Test Suite

Run each smoke test mode to verify no behavioral changes:

```bash
cd apps/oak-curriculum-mcp-streamable-http
pnpm smoke:local-stub
pnpm smoke:local-live
# etc.
```

---

### Phase 2: Refactor Integration Tests (1 hour)

**Goal**: Integration tests use isolated config, no global mutations

#### Task 2.1: Update Integration Test Pattern

**Files to modify**:

- `src/clerk-auth-middleware.integration.test.ts`
- `src/auth-routes.integration.test.ts`
- `src/auth-www-authenticate.integration.test.ts`

**Pattern**:

```typescript
// ❌ BEFORE
beforeEach(() => {
  process.env.OAK_API_KEY = 'test-key';
  process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_...';
});

// ✅ AFTER
const testConfig = loadRuntimeConfig({
  OAK_API_KEY: 'test-key',
  CLERK_PUBLISHABLE_KEY: 'pk_test_...',
});
const app = createApp({ runtimeConfig: testConfig });
```

**Validation**:

```bash
# Run integration tests
pnpm test -- "*.integration.test.ts"
# Expected: All pass
```

---

### Phase 3: Documentation (3 hours)

#### Task 3.1: Create ADR (1 hour)

**File**: `docs/architecture/architectural-decisions/0054-dependency-injection-for-configuration.md`

**Sections**:

1. Context and Problem Statement
2. Decision (DI for all config)
3. Consequences (pros/cons)
4. Alternatives Considered
5. Implementation Status
6. Compliance Statement

**Template**: Use standard ADR format from existing ADRs

#### Task 3.2: Create Developer Guide (1.5 hours)

**File**: `docs/development/dependency-injection-guide.md`

**Sections**:

1. Core Principle (DI for config)
2. Pattern Examples (good vs bad)
3. How to Add New Configuration
4. Common Patterns (composition root, partial interfaces)
5. Troubleshooting
6. Testing Patterns

**Include**:

- Code examples for each pattern
- Links to ADR and other docs
- Common pitfalls and solutions

#### Task 3.3: Update Package Documentation (30 min)

**File**: `packages/libs/env/README.md`

**Add Section**: "Package Scope and Configuration Patterns"

**Content**:

- Clarify package is utilities, not shared config
- Document layered config architecture pattern
- Link to DI guide and ADR
- Note on potential future renaming

---

### Phase 4: Tooling (1 hour)

**Current State**: ESLint rule exists but is scoped to product code only (`src/**/*.ts` excluding tests, smoke-tests, e2e-tests). This was done during `fix-e2e-test-isolation.md` to allow phased implementation.

#### Task 4.1: Expand ESLint Rule Scope

**Action**: Remove temporary ignores from ESLint configuration

**Before**:

```typescript
{
  files: ['**/*.ts'],
  ignores: ['**/*.test.ts', '**/*.spec.ts', 'smoke-tests/**', 'e2e-tests/**'],
  rules: { /* no-restricted-syntax for process.env */ }
}
```

**After** (Phase 1 & 2 complete):

```typescript
{
  files: ['**/*.ts'],
  ignores: ['**/*.test.ts', '**/*.spec.ts'], // Keep unit/integration test exclusion for now
  rules: { /* no-restricted-syntax for process.env */ }
}
```

**After** (All phases complete):

```typescript
{
  files: ['**/*.ts'],
  // No ignores - rule applies to all TypeScript files
  rules: { /* no-restricted-syntax for process.env */ }
}
```

#### Task 4.2: Configure ESLint Exceptions

**Files to update**:

- `apps/oak-curriculum-mcp-streamable-http/src/env.ts` - Verify exception exists
- `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts` - Add exception if needed

**Exception format**:

```typescript
/* eslint-disable-next-line no-restricted-syntax -- This is the ONLY file that reads process.env */
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
```

#### Task 4.3: Verify Linting

```bash
pnpm lint --filter @oaknational/oak-curriculum-mcp-streamable-http
# Expected: 0 violations (or only expected exceptions)
```

---

### Phase 5: Validation (1 hour)

#### Task 5.1: Full Quality Gate

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
```

**Expected**: All pass, zero regressions

#### Task 5.2: Verify Architectural Compliance

**Checklist**:

- [ ] Zero `process.env` mutations in any test code
- [ ] All smoke tests use DI pattern
- [ ] All integration tests use isolated config
- [ ] ADR created and reviewed
- [ ] Developer guide created with examples
- [ ] Package docs updated
- [ ] ESLint exceptions properly configured
- [ ] All quality gates pass

---

## Success Criteria

### Must Have

- ✅ Zero `process.env` access in smoke tests (0 of 55 violations remain)
- ✅ Zero `process.env` mutations in integration tests (0 of 25 violations remain)
- ✅ ADR created documenting DI decision
- ✅ Developer guide created with clear examples
- ✅ All tests pass (no behavioral changes)
- ✅ All quality gates pass

### Nice to Have

- ✅ Package documentation clarified
- ✅ Code examples in all docs
- ✅ Troubleshooting guide sections

---

## Dependencies

**Blocking**:

- ✅ `fix-e2e-test-isolation.md` must be complete first
- ✅ Product code already fixed (DI capabilities exist)

**Related**:

- May inform future work on stdio app configuration
- May influence other workspace configuration patterns

---

## Risks & Mitigations

### Risk 1: Test Behavior Changes

**Likelihood**: Low  
**Impact**: Medium (tests fail)

**Mitigation**:

- Run tests after each phase
- Make minimal changes to test logic
- Use existing helper patterns

### Risk 2: Documentation Out of Date

**Likelihood**: Medium  
**Impact**: Low (can update)

**Mitigation**:

- Link docs to code examples
- Review during implementation
- Include in quality gate

### Risk 3: Incomplete Refactoring

**Likelihood**: Low  
**Impact**: Medium (mixed patterns)

**Mitigation**:

- Clear acceptance criteria per phase
- Lint validation catches missed cases
- Manual review of changes

---

## Notes

### ESLint Configuration State

**Current** (after `fix-e2e-test-isolation.md`):

- Rule applies to: `src/**/*.ts` excluding tests
- Ignored: `**/*.test.ts`, `**/*.spec.ts`, `smoke-tests/**`, `e2e-tests/**`
- Purpose: Allow product code fixes (Phase 1 of fix-e2e-test-isolation) without lint failures from tests

**Target** (after this plan completes):

- Rule applies to: All TypeScript files
- Ignored: None (all code follows DI pattern)
- Purpose: Enforce DI architecture across entire codebase

### Why This Matters

**Immediate**:

- Prevents regression to old patterns
- Makes adding config easier
- Improves test reliability

**Long-term**:

- Establishes clear architectural patterns
- Reduces onboarding time
- Improves code maintainability

### Alignment with Foundation Documents

**From principles.md**:

- ✅ "No global state" - DI eliminates global state mutation
- ✅ "Single source of truth" - Config flows from one place
- ✅ "Inline docs everywhere" - ADR and guide provide context

**From testing-strategy.md**:

- ✅ "Simple mocks" - DI uses simple config objects
- ✅ "No complex setup" - Isolated config removes cleanup need
- ✅ "Test behavior" - Tests remain behavior-focused

---

## Future Considerations

### Potential Follow-ups

1. **Apply pattern to stdio app** - Similar refactoring needed
2. **Shared test helpers** - Extract common config patterns
3. **Config validation** - Add runtime validation beyond TypeScript
4. **Package renaming** - Consider renaming `@oaknational/env`

### Out of Scope for This Plan

- Creating new configuration capabilities
- Changing how configuration works at runtime
- Performance optimization
- Adding new env vars

---

## Checklist Before Starting

- [ ] `fix-e2e-test-isolation.md` is complete
- [ ] All E2E tests passing
- [ ] Product code violations fixed
- [ ] Team agreement this is next priority
- [ ] Time allocated (6-8 hours)

---

## References

- Investigation: `.agent/plans/archive/resolve-di-digressions.md`
- Immediate fixes: `.agent/plans/fix-e2e-test-isolation.md`
- Foundation: `.agent/directives/principles.md`
- Testing: `.agent/directives/testing-strategy.md`
