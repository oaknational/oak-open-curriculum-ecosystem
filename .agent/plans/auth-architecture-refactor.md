# Auth Architecture Refactoring Plan

**Status**: 🚨 BLOCKING ISSUE DISCOVERED  
**Date**: 2025-10-30  
**Priority**: P0 (blocks Phase 3 deployment)

## Problem Statement

The current architecture has **module-level side effects** that make environment-based configuration impossible to test reliably:

### Current Issues

1. **Side Effect at Module Import Time**
   - `src/index.ts` line 218: `export default createApp()`
   - Creates an Express app as a side effect when the module is imported
   - App creation reads `process.env.DANGEROUSLY_DISABLE_AUTH` at import time
   - Tests cannot set env vars AFTER import but BEFORE app creation

2. **Environment Variable Loading Conflicts**
   - Multiple calls to `loadRootEnv()` at different points
   - `.env` file values can overwrite programmatically-set values
   - Timing: smoke tests set env var → `loadRootEnv()` loads `.env` → overwrites test value

3. **Unreliable NODE_ENV**
   - Cannot depend on `NODE_ENV` value (test runners/pnpm may override)
   - Complex 3-condition bypass logic was fragile
   - Replaced with `DANGEROUSLY_DISABLE_AUTH` but still has timing issues

4. **Multiple Server Entry Points**
   - `dev-server.ts` (deleted)
   - `dev.ts` (created, then deleted)
   - `server.ts` (created)
   - Confusion about which entry point to use when

### Symptoms

- Smoke tests see `authDisabled: true` in logs but get **401** responses
- Route handlers never reached (debug logs don't fire)
- 401 comes from "between" middleware and route handler
- Auth bypass detected but not working

## Architectural Solution

### Core Principle

**No side effects in module scope. Pure functions only. Lazy evaluation of environment.**

### Design

```typescript
// src/index.ts - NO side effects, NO module-level app creation
export function createApp(options?: CreateAppOptions): express.Express {
  // Read env vars HERE (runtime), not at import time
  const authDisabled = process.env.DANGEROUSLY_DISABLE_AUTH === 'true';

  const app = express();
  // ... setup middleware

  if (authDisabled) {
    // Register routes WITHOUT auth
  } else {
    // Register routes WITH auth
  }

  return app;
}

// NO DEFAULT EXPORT with side effects
// Vercel can import { createApp } and call it
```

```typescript
// server.ts - Single entry point for local dev/testing
import { loadRootEnv } from '@oaknational/mcp-env';
import { createApp } from './src/index.js';

// Load env ONCE, at startup, before creating app
if (!process.env.OAK_API_KEY) {
  loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir: process.cwd(), env: process.env });
}

// NOW create the app (env vars are stable)
const app = createApp();
app.listen(port, () => {
  /* ... */
});
```

### Environment Variable Strategy

**Single Switch**: `DANGEROUSLY_DISABLE_AUTH=true`

- **Default**: `undefined` → Auth enforced via Clerk OAuth
- **Explicit disable**: `'true'` → Auth completely disabled (testing/dev only)
- **No complex logic**: No checking NODE_ENV, VERCEL, or multiple conditions
- **Clear semantics**: Name makes danger obvious

### Entry Points

1. **Production (Vercel)**: Import and use `dist/index.js` (serverless, no server needed)
2. **Local Dev**: `tsx server.ts` with env vars
3. **Tests**: Import `{ createApp }` after setting env vars, no `.env` loading

## Implementation Tasks

### Task 1: Remove Module-Level Side Effects

**File**: `src/index.ts`

**Change**:

```typescript
// BEFORE (WRONG - side effect):
export default createApp();

// AFTER (CORRECT - pure export):
export { createApp };
```

**Reason**: Allows tests to control when app is created

### Task 2: Simplify Auth Logic

**File**: `src/index.ts` (in `createApp()`)

**Change**:

```typescript
// BEFORE (complex):
const shouldBypassAuth =
  process.env.REMOTE_MCP_ALLOW_NO_AUTH === 'true' &&
  process.env.NODE_ENV === 'development' &&
  !process.env.VERCEL;

// AFTER (simple):
const authDisabled = process.env.DANGEROUSLY_DISABLE_AUTH === 'true';
```

**Reason**: Single source of truth, no fragile conditions

### Task 3: Fix Vercel Integration

**File**: Vercel needs to call `createApp()`, not use default export

**Option A**: Add `vercel.ts` entry point:

```typescript
import { createApp } from './src/index.js';
export default createApp();
```

**Option B**: Update `vercel.json` to specify entry:

```json
{
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs22.x"
    }
  }
}
```

**Recommendation**: Research Vercel Express integration to determine best approach

### Task 4: Update Smoke Test Environment Setup

**Files**: `smoke-tests/modes/*.ts`

**Change**: Remove `loadRootEnv()` calls, let tests set env directly

```typescript
// BEFORE:
const envLoad = loadEnvironment({ envFileOrder: [] });
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';

// AFTER:
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
process.env.OAK_API_KEY = STUB_API_KEY;
// NO loadRootEnv call that might overwrite
```

### Task 5: Update E2E Tests

**Files**: `e2e-tests/auth-bypass.e2e.test.ts`, etc.

**Change**: Use `DANGEROUSLY_DISABLE_AUTH` instead of 3-condition logic

```typescript
// BEFORE:
process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';
process.env.NODE_ENV = 'development';
delete process.env.VERCEL;

// AFTER:
process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
```

### Task 6: Update Environment Schema

**File**: `src/env.ts`

**Add**:

```typescript
DANGEROUSLY_DISABLE_AUTH: z.enum(['true', 'false']).optional(),
```

**Remove**:

```typescript
REMOTE_MCP_ALLOW_NO_AUTH: z.enum(['true', 'false']).optional(), // DELETE
```

### Task 7: Update Documentation

**Files**: `README.md`, `TESTING.md`

**Changes**:

- Document `DANGEROUSLY_DISABLE_AUTH` as the ONLY auth bypass mechanism
- Remove all references to `REMOTE_MCP_ALLOW_NO_AUTH`
- Remove references to NODE_ENV-based bypass
- Add clear warnings about production use

### Task 8: Update Server Entry Points

**File**: `server.ts`

**Ensure**:

```typescript
// Load env BEFORE importing createApp
if (!process.env.OAK_API_KEY) {
  loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir: process.cwd(), env: process.env });
}

import { createApp } from './src/index.js';
const app = createApp(); // Env is stable at this point
```

### Task 9: Remove Unused Dev Scripts

**File**: `package.json`

**Changes**:

- `dev` script should use `tsx server.ts` (development mode)
- `qa:oauth` script should use `node dist/server.js` (production simulation)
- All local smoke tests use programmatic env setup (no script dependencies)

## Testing Strategy

### Before Changes

- [ ] Document current failing state
- [ ] Capture specific 401 error

### After Each Task

- [ ] Run affected unit/integration tests
- [ ] Run affected E2E tests
- [ ] Run affected smoke tests

### Final Validation

- [ ] All quality gates pass
- [ ] Smoke tests work with auth disabled
- [ ] Smoke tests work with auth enabled (local-live-auth)
- [ ] `qa:oauth` starts server with OAuth enforced
- [ ] `dev` starts server with auth disabled
- [ ] Can manually test with Cursor as MCP client

## Success Criteria

1. ✅ `src/index.ts` has NO module-level side effects
2. ✅ `export default createApp()` removed
3. ✅ Single auth switch: `DANGEROUSLY_DISABLE_AUTH`
4. ✅ All smoke tests pass (stub, live, live-auth)
5. ✅ All E2E tests pass
6. ✅ All quality gates pass
7. ✅ `qa:oauth` works correctly (OAuth enforced, returns 401)
8. ✅ `dev` works correctly (auth disabled, returns 200)
9. ✅ Documentation accurate and up-to-date

## Risk Mitigation

### Vercel Compatibility Risk

**Risk**: Removing `export default createApp()` might break Vercel deployment

**Mitigation**:

- Research Vercel Express.js integration patterns
- Create dedicated Vercel entry point if needed
- Test deployment to preview environment before production

### Backward Compatibility Risk

**Risk**: N/A - This is a new feature, no backward compatibility needed

**Mitigation**: Follow workspace rule: "NEVER create compatibility layers"

## Timeline

**Estimated**: 2-3 hours (including testing and documentation)

1. Research Vercel integration: 30 min
2. Implement core changes: 1 hour
3. Update all tests: 1 hour
4. Update documentation: 30 min
5. Quality gate validation: 30 min

## Dependencies

- None (self-contained refactoring)

## Open Questions

1. Does Vercel require `export default` or can it use named exports?
2. Should we build `server.ts` to `dist/server.js` or keep it as `tsx server.ts` only?
3. Should smoke tests load `.env` at all, or purely use programmatic env setup?

## Investigation Findings

### Why Auth Bypass Isn't Working

**Evidence from smoke test logs**:

```
[DEBUG] Auth decision { DANGEROUSLY_DISABLE_AUTH: 'true', authDisabled: true }
[WARN] ⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true
✅ POST /mcp without streaming Accept header rejected with 406
❌ POST /mcp with proper headers → 401 (NOT 200)
```

**The smoking gun**: Debug log "POST /mcp hit (auth disabled path)" **never appears**, meaning the route handler is never reached.

**Current execution order**:

1. `smoke-tests/environment.ts` calls `loadRootEnv()` → loads `.env` from repo root
2. `prepareLocalStubEnvironment()` sets `DANGEROUSLY_DISABLE_AUTH=true`
3. `startSmokeServer()` imports `src/index.js`
4. Module import triggers `export default createApp()` side effect
5. `createApp()` reads `DANGEROUSLY_DISABLE_AUTH` → correctly sees `'true'`
6. Routes registered correctly
7. **BUT**: Something returns 401 before route handler runs

**Hypothesis**: The problem might be that `export default createApp()` creates a SECOND app instance (the default export) that's never used but might interfere, OR there's a Clerk middleware being registered globally that we're not seeing.

### Module Import Side Effects Discovered

**File**: `src/index.ts`  
**Line**: 218  
**Code**: `export default createApp();`

This is an anti-pattern because:

1. Creates app instance when module is imported (not when needed)
2. For Vercel (serverless), this instance is created once and reused
3. For tests, a new instance is created but can't control environment

**Better pattern**:

```typescript
// Instead of:
export default createApp();

// Use:
export { createApp };

// And create entry point:
// server.ts
import { createApp } from './src/index.js';
const app = createApp();
app.listen(3333);
```

## Vercel Integration Analysis

### How Vercel Works

From `vercel.json`:

```json
{
  "framework": "express",
  "rewrites": []
}
```

From `package.json`:

```json
{
  "main": "dist/index.js"
}
```

**Vercel's Express Framework Support**:

- Vercel imports the file specified in `"main"`
- Expects to find an Express app (default export)
- Runs app in serverless environment (one instance per request in theory, cached in practice)
- Environment variables are set by Vercel platform BEFORE import

### Why Current Pattern Works for Vercel (But Not Tests)

**Current**: `export default createApp();`

**For Vercel** ✅:

1. Vercel sets environment variables (CLERK\_\*, OAK_API_KEY, etc.)
2. Vercel imports `dist/index.js`
3. Module runs `export default createApp()` - reads env vars
4. App instance created with correct configuration
5. Works perfectly

**For Tests** ❌:

1. Test sets `process.env.DANGEROUSLY_DISABLE_AUTH = 'true'`
2. Test calls `startSmokeServer()`
3. `startSmokeServer` runs: `const { createApp } = await import('../src/index.js');`
4. **Module import triggers `export default createApp()` side effect** (creates app WITHOUT auth disabled)
5. Then smoke test calls `createApp()` again (creates app WITH auth disabled)
6. Smoke test's app instance listens on port 3333
7. **BUT**: The default export app might have also registered routes globally somehow?
8. OR: The smoke test is somehow using the WRONG app instance
9. Tests fail with 401

**Key insight**: `createApp()` is called TWICE per smoke test run:

```
[DEBUG] Auth decision { DANGEROUSLY_DISABLE_AUTH: 'true', authDisabled: true }
[DEBUG] Auth decision { DANGEROUSLY_DISABLE_AUTH: 'true', authDisabled: true }
```

First call: `export default createApp()` at module import time  
Second call: Smoke test's `const app = createApp();`

**Both** see `authDisabled: true`, yet requests get 401.

**Remaining mystery**: If BOTH app instances have auth disabled, and logs confirm the decision is correct, where is the 401 coming from?

**Possibilities**:

1. The `default` export app instance is somehow being used instead of the test's instance
2. There's a global Clerk middleware being applied somewhere we're not seeing
3. The route isn't being registered properly (maybe Express routing issue with conditional if-else?)
4. There's a race condition between route registration and the test making the request

**Next investigation step**: Add more granular logging to trace exactly which app instance handles the request

### The Solution (Revised After Investigation)

**Problem**: The side effect `export default createApp()` creates an app instance that's never used but might interfere.

**Solution**: Remove the side effect, make Vercel use a dedicated entry point.

#### Approach: Separate Entry Points

**For Vercel (serverless)**:

- Vercel imports `dist/index.js` expecting an Express app
- We keep the pattern Vercel expects: `export default createApp();`
- OR: Create `api/index.ts` that Vercel routes to (Vercel serverless pattern)

**For Local Dev**:

- Use `server.ts` (already created)
- Calls `createApp()` and `listen()`
- Full control over when app is created

**For Tests**:

- Import `{ createApp }` named export (already exists!)
- Set env vars FIRST
- Call `createApp()` SECOND
- Get fresh instance with correct env

#### Simplified Implementation

**Step 1**: Remove the problematic default export side effect:

```typescript
// src/index.ts
export function createApp(options?: CreateAppOptions): express.Express {
  // ... implementation
}

// REMOVE THIS LINE:
// export default createApp();

// REPLACE WITH:
export default createApp; // Export the FUNCTION, not a CALL
```

**Step 2**: Update Vercel to use a dedicated entry:

Option A - Create `api/index.ts`:

```typescript
import { createApp } from '../src/index.js';
export default createApp();
```

Option B - Keep current structure but export function:

```typescript
// dist/index.js exports createApp function
// Vercel calls it when handling requests
```

**Step 3**: Tests already work correctly:

```typescript
// Already using named export
const { createApp } = await import('../src/index.js');
const app = createApp();
```

This approach:

- ✅ Removes problematic side effect
- ✅ Preserves Vercel compatibility (with small adjustment)
- ✅ Allows tests full control
- ✅ Simple and clear
- ✅ Follows "no side effects in module scope" principle

## Recommended Implementation Order

Given the mystery of why 401 is returned even when both app instances have auth disabled, we should:

### Phase 1: Simplest Possible Fix (Test hypothesis)

1. Change `export default createApp()` to `export default createApp`
2. Create `api/index.ts` or update Vercel config
3. Run smoke tests
4. If it works → great, move forward
5. If it still fails → deeper investigation needed

### Phase 2: If Phase 1 Fails

1. Add request tracing to identify which middleware returns 401
2. Check if Clerk is doing something at import time
3. Consider completely removing default export
4. Create dedicated Vercel entry point

### Phase 3: Cleanup

1. Remove all `REMOTE_MCP_ALLOW_NO_AUTH` references
2. Update all documentation
3. Update all E2E/smoke tests to use `DANGEROUSLY_DISABLE_AUTH`
4. Run full quality gate

## Decision Log

**2025-10-30**:

- Identified module-level side effects as potential root cause
- Discovered `export default createApp()` creates unnecessary app instance
- Found that `createApp()` is called twice (once as side effect, once by test)
- Both instances see correct env var (`authDisabled: true`)
- Yet 401 still returned (mystery remains)
- **Decision**: Remove side effect as first step, observe results
- Created comprehensive investigation plan with multiple phases
- Documented findings for future reference

**2025-10-30 Late**:

- Realized we don't fully understand WHY the 401 happens
- Proposed pragmatic approach: simplest fix first, observe, iterate
- Follows scientific method: hypothesis → test → observe → refine

## Handoff to Main OAuth Plan

**This plan is a DETOUR to fix a blocking architectural issue.**

Once this refactoring is complete and verified working, **IMMEDIATELY RETURN** to the main OAuth implementation plan:

### Verification Criteria (All Must Pass)

1. ✅ All smoke tests pass:
   - `smoke:dev:stub` ✅
   - `smoke:dev:live` ✅
   - `smoke:dev:live:auth` ✅ (requires real Clerk keys)
2. ✅ All E2E tests pass (44/44)
3. ✅ All unit/integration tests pass (16/16)
4. ✅ `qa:oauth` starts server with OAuth enforced (returns 401 for unauth requests)
5. ✅ `dev` starts server with auth disabled (returns 200 for requests)
6. ✅ Environment variables work reliably (no timing issues)
7. ✅ Complete quality gate passes (`pnpm qg`)

### Upon Verification Complete

**→ RETURN TO**: `.agent/plans/mcp-oauth-implementation-plan.md`

**→ RESUME AT**: Phase 3 - Deployment & Monitoring

**→ SPECIFIC TASK**: Phase 3, Task 3.1: Configure Vercel Environment Variables

### Why This Matters

The auth architecture refactor is **NOT** the OAuth implementation - it's fixing the foundation so the implementation can work. The main plan contains:

- Complete deployment checklist
- Monitoring framework
- Rollback procedures
- Health check automation
- Documentation updates
- User communication strategy

**Do not get distracted by this refactoring.** Fix it, verify it works, return to the main plan immediately.

### Pre-Return Checklist

Before returning to main OAuth plan, ensure:

- [ ] All references to `REMOTE_MCP_ALLOW_NO_AUTH` removed from codebase
- [ ] All documentation updated to use `DANGEROUSLY_DISABLE_AUTH`
- [ ] All tests updated to use `DANGEROUSLY_DISABLE_AUTH`
- [ ] `README.md` accurate
- [ ] `TESTING.md` accurate
- [ ] No module-level side effects remain
- [ ] `.env.example` updated
- [ ] All quality gates green
- [ ] This refactoring documented in main plan's "Deviations" section

**Then**: Close this plan, archive it, and execute Phase 3 of the main OAuth plan.
