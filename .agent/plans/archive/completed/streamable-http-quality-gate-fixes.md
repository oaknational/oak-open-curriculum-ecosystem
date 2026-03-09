# Streamable HTTP Quality Gate Fixes

**Last Updated**: 2025-11-16  
**Status**: 🔴 BLOCKED - Awaiting Architecture Decision  
**Scope**: Fix linting violations and align E2E tests with production requirements

---

## Context

Quality gate analysis (2025-11-16) revealed:

- **3 linting errors** (code structure/complexity)
- **5 E2E test failures** (outdated test expectations)

**Critical Finding**: Working production code contradicts E2E test expectations, suggesting tests encode outdated architectural assumptions rather than current requirements.

---

## Issues Summary

### Category 1: Linting Violations (Code Quality)

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/`

| Issue                          | File                 | Line | Severity   |
| ------------------------------ | -------------------- | ---- | ---------- |
| Function exceeds 50 lines      | `application.ts`     | 53   | Structural |
| Function exceeds 20 statements | `application.ts`     | 53   | Structural |
| Function complexity > 8        | `security-config.ts` | 64   | Complexity |

**Classification**: ✅ LEGITIMATE CODE ISSUES  
**Impact**: Reduces testability, maintainability, understandability  
**Resolution**: TDD-based refactoring with pure function extraction

---

### Category 2: E2E Test Failures (Architecture Mismatch)

**Location**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`

#### Issue 2.1: OAuth Scopes Mismatch

**Test**: `auth-enforcement.e2e.test.ts:161-162`

```javascript
// Test expects: ['openid', 'email', 'mcp:invoke', 'mcp:read']
// Code returns: ['openid', 'email']
```

The test is wrong, the code is correct.

**Production Code**: `auth-routes.ts:223`

```typescript
scopes_supported: ['openid', 'email'];
```

---

#### Issue 2.2-2.5: CORS Headers on Protocol Routes

**Tests**: `web-security-selective.e2e.test.ts:97, 106, 117, 183`

```javascript
// Tests expect: CORS headers UNDEFINED on /healthz, /.well-known/*, etc
// Code provides: CORS headers PRESENT on all routes
```

**Production Code**: `application.ts:71, 90`

```typescript
// Line 71 comment: "CORS: Applied globally to ALL routes (protocol routes need it for browser clients)"
// Line 90 code:   app.use(corsMiddleware);  // Global application
```

CORS headers are present on all routes, this is correct, the tests are wrong.

---

## Resolution Plan

### Phase 1: Architecture Decisions (BLOCKING)

**Owner**: Architecture / Product  
**Duration**: 1 decision meeting

**Tasks**:

1. ✅ Document current state (this plan)
2. Record the architectural choices in ADRs

---

### Phase 2: Code Quality Fixes (Linting)

**Owner**: Development  
**Duration**: 1-2 hours  
**Approach**: TDD with pure function extraction

#### Task 2.1: Refactor `createApp` (application.ts:53)

**Current**: 54 lines, 22 statements  
**Target**: ≤50 lines, ≤20 statements

**Strategy**:

1. Write unit tests for bootstrap logic FIRST
2. Extract pure helper functions:
   - `createSecurityMiddleware(config)` → returns `{ cors, dnsRebinding }`
   - `registerCoreRoutes(app, transport, ready, log)` → void
   - `finalizeBootstrap(app, bootstrapTimer, appCounter, log)` → void
3. RED → GREEN → REFACTOR
4. Verify linting passes

**Acceptance**:

- Function ≤50 lines, ≤20 statements
- All extracted functions have unit tests
- No behavioral changes (E2E tests unchanged)

---

#### Task 2.2: Simplify `resolveAllowedOrigins` (security-config.ts:64)

**Current**: Complexity 9  
**Target**: Complexity ≤8

**Strategy**:

1. Write unit tests for each mode (allow_all, explicit, automatic) FIRST
2. Extract mode-specific pure functions:
   - `resolveAllowAll()` → undefined
   - `resolveExplicit(configured)` → string[] | undefined
   - `resolveAutomatic(configured, vercelHost, isProduction)` → string[] | undefined
3. Main function delegates to mode-specific functions
4. RED → GREEN → REFACTOR
5. Verify linting passes

**Acceptance**:

- Complexity ≤8
- Each mode has dedicated unit tests
- No behavioral changes

---

### Phase 3: Test Updates (E2E Alignment)

**Owner**: Development  
**Duration**: 30 minutes  
**Dependencies**: Phase 1 decisions

#### Task 3.1: Update OAuth Scopes Test

**If Decision 2 = Standard Scopes Only**:

**File**: `auth-enforcement.e2e.test.ts:161-162`

```typescript
// Remove these lines:
expect(scopes).toContain('mcp:invoke');
expect(scopes).toContain('mcp:read');

// Add verification:
expect(scopes).toEqual(['openid', 'email']);
```

**If Decision 2 = Add Custom Scopes**:

**File**: `auth-routes.ts:223`

```typescript
// Update code to match test expectation:
scopes_supported: ['openid', 'email', 'mcp:invoke', 'mcp:read'];

// Document WHY custom scopes are needed
```

---

#### Task 3.2: Update CORS Tests

**If Decision 1 = Global CORS**:

**File**: `web-security-selective.e2e.test.ts`

```typescript
// Lines 97, 106, 117, 183: Change expectations
- expect(res.headers['access-control-allow-origin']).toBeUndefined();
+ expect(res.headers['access-control-allow-origin']).toBeDefined();

// Update test names/descriptions:
- describe('Protocol routes - NO web security', ...)
+ describe('Protocol routes - CORS enabled for browser clients', ...)
```

**If Decision 1 = Selective CORS**:

**File**: `application.ts:90`

```typescript
// Remove global CORS:
- app.use(corsMiddleware);

// Apply CORS only to landing page (in addRootLandingPage):
- app.get('/', dnsRebindingMw, (req, res) => {
+ app.get('/', corsMiddleware, dnsRebindingMw, (req, res) => {

// Update comment on line 71:
- // CORS: Applied globally to ALL routes (protocol routes need it for browser clients)
+ // CORS: Applied ONLY to landing page (protocol routes are not browser-accessible)
```

---

## Testing Strategy

### Unit Tests (Task 2.1, 2.2)

**Approach**: TDD - Tests written FIRST

- Test pure functions in isolation
- No I/O, no mocks
- Filename: `*.unit.test.ts`

**Coverage**:

- Each extracted helper function
- Each mode in `resolveAllowedOrigins`
- Edge cases and error conditions

---

### Integration Tests

If bootstrap logic extraction requires integration testing:

- Test bootstrap phase orchestration
- Simple injected mocks for logger
- Filename: `*.integration.test.ts`

---

### E2E Tests (Task 3.1, 3.2)

**Approach**: Update expectations to match architecture decisions

- Verify security behavior matches requirements
- Validate CORS headers presence/absence
- Validate OAuth metadata contents

**Coverage**: All modified test assertions

---

## Success Criteria

### Phase 1 (Decisions)

- ✅ CORS scope decision documented
- ✅ OAuth scopes decision documented
- ✅ Rationale captured in ADR or this plan

### Phase 2 (Code Quality)

- ✅ All linting errors resolved
- ✅ `createApp` ≤50 lines, ≤20 statements
- ✅ `resolveAllowedOrigins` complexity ≤8
- ✅ All extracted functions have unit tests
- ✅ `pnpm lint -- --fix` passes

### Phase 3 (Test Alignment)

- ✅ E2E tests match architecture decisions
- ✅ `pnpm test:e2e` passes (74/74 tests)

### Overall

- ✅ Full quality gate passes (steps 1-10)
- ✅ No behavioral regressions
- ✅ Code maintainability improved

---

## Dependencies

**Blocking**:

- Architecture decisions (Phase 1)

**Related Plans**:

- None (isolated code quality work)

**Prerequisites**:

- ✅ Quality gate analysis complete
- ✅ Issues categorized and documented

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: "Why are we doing this, and why does that matter?"

**Immediate Value**:

- Code quality: Improved testability, maintainability
- Test alignment: Tests validate actual requirements, not outdated assumptions

**System-Level Impact**:

- **Correctness**: Tests prove the RIGHT behavior, not wrong behavior
- **Velocity**: Future changes safer with proper test coverage
- **Clarity**: Architecture decisions explicitly documented
- **Trust**: Quality gates actually validate quality

**Risk of Not Doing**:

- False confidence: Passing tests that validate wrong behavior
- Tech debt: Complex functions resist refactoring
- Confusion: Production behavior contradicts test expectations
- Regressions: Changes might fix tests but break production

---

## References

- Quality gate logs: `/tmp/quality-gate-*.log`
- Test files: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`
- Production code: `apps/oak-curriculum-mcp-streamable-http/src/`
- Testing strategy: `.agent/directives/testing-strategy.md`
- Rules: `.agent/directives/principles.md`
