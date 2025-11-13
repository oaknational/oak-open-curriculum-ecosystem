# Phase 3 Iteration 1: Comprehensive Findings

**Date**: 2025-11-13  
**Status**: COMPLETE  
**Outcome**: Hang NOT reproducible with invalid Clerk keys

---

## Hypothesis Tested

**Original Theory**: Clerk middleware registered globally (affecting ALL routes) causes requests to hang without calling `next()`.

**Test Approach**: Add comprehensive request-level instrumentation to trace middleware execution, then test with invalid Clerk keys (missing-clerk scenario).

---

## Instrumentation Added

### Location: `src/app/bootstrap-helpers.ts`

```typescript
// Request entry marker BEFORE all middleware
app.use((req, res, next) => {
  log.info('→→→ REQUEST ENTRY', { method, path, url, entryTime });
  next();
});

// Checkpoint after JSON parsing
app.use((req, res, next) => {
  log.debug('✓ JSON parsing complete', { method, path });
  next();
});

// Checkpoint after correlation
app.use((req, res, next) => {
  log.debug('✓ Correlation middleware complete', { correlationId, method, path });
  next();
});

// Checkpoint after base middleware complete
app.use((req, res, next) => {
  log.info('✓✓✓ BASE MIDDLEWARE COMPLETE', { correlationId, method, path });
  next();
});
```

### Location: `src/index.ts`

```typescript
// Checkpoint after DNS rebinding protection
app.use((req, res, next) => {
  console.log('✓ DNS protection complete');
  next();
});

// Checkpoint after CORS
app.use((req, res, next) => {
  console.log('✓✓✓ SECURITY MIDDLEWARE COMPLETE');
  next();
});

// Landing page handler start
app.get('/', (req, res, next) => {
  console.log('→ LANDING PAGE HANDLER START');
  next();
});

// MCP route entry
app.use('/mcp', (req, res, next) => {
  console.log('→ MCP ROUTE ENTRY');
  next();
});
```

---

## Critical Code Verification

### Clerk Middleware Scope (Line 238 of `src/auth-routes.ts`)

```typescript
// FIX: Scope Clerk middleware to /mcp routes only
// Health checks and landing page should remain publicly accessible
// OAuth metadata endpoints (/.well-known/*) don't require Clerk middleware
authLog.info('Installing Clerk middleware scoped to /mcp routes only');
app.use('/mcp', clerkMw); // ← SCOPED, NOT GLOBAL
```

**VERIFIED**: Clerk middleware is NOT global. It only applies to `/mcp` routes.

---

## Test Results (Invalid Clerk Keys)

### Environment: `missing-clerk` scenario

- `CLERK_PUBLISHABLE_KEY`: `invalid_key_for_testing`
- `CLERK_SECRET_KEY`: `placeholder_secret`
- `DANGEROUSLY_DISABLE_AUTH`: `false` (auth enabled, but keys invalid)

### Request Performance

| Route      | Method | Status | Duration | Result        |
| ---------- | ------ | ------ | -------- | ------------- |
| `/healthz` | GET    | 200    | 3ms      | ✅ SUCCESS    |
| `/`        | GET    | 200    | 4ms      | ✅ SUCCESS    |
| `/mcp`     | POST   | 500    | 20ms     | ❌ FAILS FAST |

### Middleware Execution Trace for `/healthz`

```
→→→ REQUEST ENTRY (method=GET, path=/healthz)
✓ JSON parsing complete
✓ Correlation middleware complete (correlationId=req_1763038486001_de1813)
✓✓✓ BASE MIDDLEWARE COMPLETE
✓ DNS protection complete
✓✓✓ SECURITY MIDDLEWARE COMPLETE
Request completed (statusCode=200, duration=3ms)
```

**All middleware executed successfully. No hang.**

---

## Key Findings

1. ✅ **Clerk middleware IS scoped to `/mcp` only**
   - Original hypothesis was WRONG
   - `/healthz` and `/` routes do NOT go through Clerk middleware
   - Code verification at line 238: `app.use('/mcp', clerkMw)`

2. ✅ **No hang with invalid Clerk keys**
   - All routes respond within 3-4ms
   - `/mcp` fails fast (500 error in 20ms) due to invalid auth
   - This is NORMAL error behavior, not a hang

3. ✅ **All middleware executes correctly**
   - Request entry logged
   - JSON parsing completes
   - Correlation ID generated
   - Base middleware completes
   - Security middleware (DNS + CORS) completes
   - Route handlers execute

4. ❌ **Hang NOT reproduced locally**
   - Invalid keys do NOT cause hang
   - All routes respond quickly
   - Middleware chain works correctly

---

## Updated Hypothesis

**The Vercel hang only occurs with REAL Clerk keys that make actual network calls to Clerk's API.**

### Supporting Evidence

1. **Local with invalid keys**: No hang (proven in Iteration 1)
2. **Vercel with real keys**: All routes hang with `responseStatusCode: -1`
3. **Vercel logs show**: Bootstrap completes, then ALL requests hang

### Likely Root Cause

When Clerk middleware (scoped to `/mcp`) receives a request with REAL keys:

1. Clerk makes network call to verify keys / fetch JWKS
2. Network call hangs in Vercel's serverless environment
3. Middleware never calls `next()`
4. Request times out

**BUT**: This doesn't explain why `/healthz` and `/` also hang in Vercel, since they don't use Clerk middleware.

### Alternative Theory

Something in the GLOBAL middleware chain (DNS protection, CORS, or correlation) makes a blocking operation that hangs when:

- Environment is Vercel serverless
- Real Clerk keys are present (possibly triggers environment-specific code path)

---

## Next Steps: Iteration 2

1. **Test with real Clerk keys locally**
   - Use `harness-auth-enabled.env` with real test keys
   - See if hang reproduces locally
   - Examine network calls made by Clerk

2. **If hang reproduces**:
   - Add timeout protection to Clerk middleware wrapper
   - Log exact location where execution stops
   - Implement fix (circuit breaker, timeout, etc.)

3. **If hang does NOT reproduce**:
   - Issue is Vercel-specific (cold start, network, bundling)
   - Consider disabling auth for health/landing routes
   - Add aggressive request timeouts
   - Investigate Vercel-specific Clerk behavior

---

## Artifacts

- **Instrumented files**:
  - `src/app/bootstrap-helpers.ts` (comprehensive middleware tracing)
  - `src/index.ts` (security + route instrumentation)
- **Test harness**: `ENV_FILE=.env.harness.missing-clerk pnpm prod:harness`
- **Request runner**: `pnpm prod:requests`
- **Logs**: Console output shows complete middleware trace

---

## Quality Status

- ✅ Build: Passing
- ⚠️ Type-check: Passing (instrumentation uses `void res` pattern)
- ⚠️ Lint: console.log statements present (temporary instrumentation)
- ✅ Tests: 738 passing

**Note**: Instrumentation code is temporary for diagnosis and will be removed or made conditional (LOG_LEVEL=debug) once hang is fixed.
