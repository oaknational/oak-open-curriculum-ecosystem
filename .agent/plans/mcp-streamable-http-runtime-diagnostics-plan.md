# MCP Streamable HTTP Runtime Diagnostics Plan

**Status:** Draft  
**Owner:** Observability  
**Last Updated:** 2025-11-12  
**Related Branch:** `feat/oauth_support`

---

## Purpose

Add deeper runtime instrumentation to the Vercel-hosted MCP HTTP server and establish a fast feedback loop by running the _built_ production bundle locally under multiple configuration scenarios. This plan focuses on illuminating the remaining deployment hang by extending logging ahead of Clerk/OAuth middleware and validating behaviour in conditions that mimic Vercel’s invocation model.

---

## Goals

1. **Instrumentation Expansion**
   - Emit precise lifecycle logs before and after every latency-prone step of app bootstrap (Clerk middleware, OAuth metadata registration, MCP handler wiring, transport connection).
   - Capture timings for middleware initialisation in addition to per-request timings already in place.
   - Ensure instrumentation honours existing logging standards (OpenTelemetry single-line JSON, correlation IDs).

2. **Built-Artifact Runtime Harness**
   - Produce the production build locally (`pnpm build`) and execute the emitted `dist/src/index.js` with a minimal bootstrap harness that mirrors Vercel’s invocation pattern.
   - Support swapping environment configurations (Clerk keys, auth disable flag, LOG_LEVEL) without editing source.
   - Automate request scenarios (health check, landing page, `/mcp` POST) against the built server to confirm behaviour changes immediately.

3. **Debugging Workflow**
   - Document repeatable steps for toggling configs, replaying failing conditions, and interpreting the new logs.
   - Add smoke/e2e coverage where feasible to guard against regressions uncovered during investigation.

---

## Definition of Done

- All planned instrumentation is merged behind the existing logger, producing structured entries for:
  - App creation start/finish with elapsed time.
  - Clerk middleware initialisation start, first await boundary, success/error.
  - OAuth metadata registration timing.
  - MCP handler registration timing.
- Local harness executes the built server and can replay the failing scenario (request hangs) with the new instrumentation visible.
- Documentation (plan-owned section + README updates) explains how to run the harness, switch configs, and analyse logs.
- Quality gates (format, type-check, lint, test, build) remain green.

---

## Status Update (2025-11-13)

- ✅ Phase 1 instrumentation merged (bootstrap/auth timers + integration coverage aligned with OpenTelemetry logging).
- ✅ Quality gate remediation complete (2025-11-13):
  - Removed unused `LoggedEntry` import from `bootstrap.instrumentation.integration.test.ts`
  - Fixed unsafe `any` assignments in diagnostics tests by eliminating intermediate variables
  - Refactored `src/index.ts`: extracted bootstrap helpers to `app/bootstrap-helpers.ts`, reducing file to 226 lines (under 250 limit)
  - Fixed max-statements violation in bootstrap test by extracting helper functions
  - All quality gates now passing: build ✅, type-check ✅, lint ✅, test:all ✅
- ✅ Phase 2 (built-server harness) complete (2025-11-13):
  - Server harness script (`scripts/server-harness.js`) loads built dist/ with configurable env
  - Request runner script (`scripts/run-requests.js`) automates test sequence with timing/exit codes
  - Config matrix (3 scenarios: auth-enabled, auth-disabled, missing-clerk) with sample .env files
  - Package scripts added: `prod:harness`, `prod:requests`, `prod:diagnostics`
  - README and production-debugging-runbook documentation updated
  - Manual validation complete: all 3 requests succeed (healthz, landing, MCP initialize)
  - All quality gates passing after implementation
- 🔄 Phase 3 (iterative diagnosis) in progress:
  - **Phase 3 Iteration 1 Results (2025-11-13)**:
    - ✅ Added comprehensive request-level instrumentation to trace middleware execution
    - ✅ VERIFIED: Clerk middleware IS scoped to `/mcp` only (line 238: `app.use('/mcp', clerkMw)`)
    - ✅ Tested with invalid Clerk keys (missing-clerk scenario):
      - `/healthz`: SUCCESS (200, 3ms, full JSON response) - all middleware executes correctly
      - `/`: SUCCESS (200, 2ms, full 3159-byte HTML response) - complete landing page
      - `/mcp`: FAILS FAST (500, 20ms) - errors but does NOT hang
    - ✅ VERIFIED: Full response bodies returned, not just status codes
    - **KEY FINDING**: No hang with invalid keys locally! All routes return complete responses.
  - **Phase 3 Iteration 2 Results (2025-11-13)**:
    - ❌ HYPOTHESIS TESTED: Modified `server.ts` to export Express app as default (per Vercel docs)
    - ❌ FIX FAILED: Vercel logs show bootstrap still completes but requests still hang
    - ⚠️ CRITICAL FINDING: Bootstrap logs appear ("Creating app", auth setup complete), but **ZERO request-level logs**
    - 🔍 NEW INSIGHT: No "→→→ REQUEST ENTRY" or "✓✓✓ BASE MIDDLEWARE COMPLETE" logs in Vercel
    - **ROOT CAUSE NARROWED**: Vercel IS creating the Express app (bootstrap succeeds), but somehow requests never reach the middleware chain
    - **HYPOTHESIS DISPROVEN**: Issue is NOT about Express app export format
    - **NEW THEORY**: There may be a mismatch between how Vercel invokes the exported function and what we're exporting
    - **Next**: Investigate Vercel's serverless function invocation model more deeply

---

## Work Breakdown

### Phase 1 – Instrumentation Foundations

1. **Bootstrap Timer Utilities**
   - Reuse/extend existing timing helpers to support long-lived async tasks (start → await → finish).
   - Unit-test helper to ensure consistent formatting.
   - [x] Completed 2025-11-12 – Added `createPhasedTimer` with exhaustive unit coverage in `packages/libs/logger`.

2. **App Creation Instrumentation**
   - Add scoped child logger for `createApp` lifecycle.
   - Log before/after `setupBaseMiddleware`, `applySecurity`, `initializeCoreEndpoints`, `setupAuthRoutes`.
   - Capture duration for each step.
   - Tests: integration/unit verifying log emission hooks (via injected sink/mocks).
   - [x] Completed 2025-11-12 – Added `bootstrap.phase.*` / `bootstrap.complete` logs with integration tests using stub logger.

3. **Clerk & OAuth Instrumentation**
   - Insert before/after logs around `clerkMiddleware()` construction and first invocation.
   - Add timers for OAuth metadata registration handlers.
   - Tests: confirm logs fire even when middleware throws or rejects.
   - [x] Completed 2025-11-12 – Added `auth.bootstrap.step.*` metrics plus unit test covering error path.

### Phase 2 – Built Server Harness

1. **Build Invocation Script**
   - Script (`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build:prod-run`) that runs `pnpm build` then executes `node dist/server-harness.js` (new entry).
   - Harness loads `dist/src/index.js` default export, invokes per-request, configures env from `.env.local`.

2. **Config Matrix**
   - Provide sample `.env` files for:
     - Auth enabled (Clerk keys stubbed/mocked).
     - Auth disabled (`DANGEROUSLY_DISABLE_AUTH=true`).
     - Missing Clerk config (to reproduce hang).
   - Document how to switch using `ENV_FILE` variable or copy command.

3. **Request Runner**
   - Add script to send sequence: `/healthz`, `/`, `/mcp` (initialize payload) using `node` + `undici` or `supertest` against started harness server.
   - Record durations and exit codes.

### Phase 3 – Iterative Root Cause Diagnosis

**Objective**: Use the built-server harness with enhanced instrumentation to identify and fix the request hang through iterative measurement-analysis cycles.

**Vercel Log Analysis (Starting Point)**:

- ✅ Bootstrap succeeds (all "Creating app #X" logs present)
- ✅ Auth setup completes (Clerk middleware registered)
- ❌ **All requests hang** - never return a response (`responseStatusCode: -1`, `durationMs: -1`)
- ❌ Affects ALL routes: `/`, `/healthz`, `/mcp`, favicons
- **Hypothesis**: Hang is in Express middleware chain or route handler, NOT in bootstrap

**Iteration Cycle** (repeat until root cause found):

1. **Measure**: Run harness with current instrumentation

   ```bash
   ENV_FILE=.env.harness.auth-enabled pnpm prod:harness
   # In another terminal:
   pnpm prod:requests
   ```

2. **Analyze**: Examine logs for:
   - Last log entry before hang
   - Missing "request finished" logs
   - Middleware execution order
   - Async operations that never complete

3. **Theorize**: Form hypothesis about hang location:
   - Clerk middleware blocking?
   - Express middleware not calling `next()`?
   - Route handler async operation deadlock?
   - Event loop blocked by synchronous operation?

4. **Instrument**: Add targeted logging to test theory:
   - Add `req.start` / `req.finish` logs in suspected middleware
   - Log before/after each `await` in route handlers
   - Add timeout detection for slow operations

5. **Test**: Re-run harness with new instrumentation
   - Validate theory: did logs confirm/refute hypothesis?
   - If confirmed: implement fix
   - If refuted: form new theory and iterate

**Exit Criteria**:

- Request hang reproduced locally with harness
- Root cause identified through logs
- Fix implemented and validated
- All harness scenarios pass (auth-enabled, auth-disabled, missing-clerk)
- Quality gates remain green

---

## Acceptance Criteria & Validation

| Deliverable                      | Acceptance Criteria                                                                  | Validation Steps                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Instrumented bootstrap logs      | Logs emitted for each major step with duration, scope `bootstrap`                    | ✅ Unit tests on timing helper; integration test capturing log output |
| Clerk middleware instrumentation | Logs include `clerkMiddleware start/pending/next/error` entries in production format | ✅ Type safety verified by unit test; all quality gates passing       |
| Built-server harness             | `pnpm build && pnpm run prod:diagnostics` starts server, handles configurable env    | Manual run; documentation instructions followed successfully          |
| Request runner                   | Script exits with non-zero when requests hang; prints durations                      | `node scripts/run-built-requests.js` executed with stable output      |
| Documentation                    | README & runbook updated, linted                                                     | `markdownlint`, peer review; instructions followable                  |

---

## Risks & Mitigations

- **Risk:** Additional logging could introduce overhead.  
  **Mitigation:** Keep instrumentation scoped to bootstrap, use DEBUG level to allow filtering.

- **Risk:** Built harness diverges from Vercel behaviour.  
  **Mitigation:** Use Express handler invocation pattern that mirrors Vercel’s runtime (no persistent server, simulate per-request invocation where feasible).

- **Risk:** Mocked Clerk keys still allow middleware to block.  
  **Mitigation:** Provide option to stub `clerkMiddleware` via env flag for isolation testing.

---

## References

- `.agent/context/HANDOFF.md`
- `.agent/context/continuation.prompt.md`
- `.agent/context/context.md`
- `apps/oak-curriculum-mcp-streamable-http/README.md`
- `docs/development/production-debugging-runbook.md`

---

## Tracking

- [x] Phase 1 – Instrumentation Foundations (complete 2025-11-13)
- [x] Phase 2 – Built Server Harness (complete 2025-11-13)
- [ ] Phase 3 – Iterative Root Cause Diagnosis (in progress)
  - [x] Vercel logs analyzed - hang is in request handling, not bootstrap
  - [x] Add request-level instrumentation (comprehensive middleware tracing)
  - [x] Iteration 1: Test with invalid Clerk keys - NO HANG (all routes respond fast with full responses)
  - [x] Iteration 2: Attempted Vercel export fix - FIX FAILED (bootstrap works but requests still don't reach middleware)
  - [ ] Iteration 3: Investigate Vercel serverless function invocation model
    - Bootstrap succeeds (app is created)
    - Request instrumentation never fires (requests don't reach middleware)
    - Need to understand how Vercel wraps/invokes Express apps
  - [ ] Iteration 4: Implement and validate correct fix
  - [ ] Iteration 5: Final validation on Vercel
