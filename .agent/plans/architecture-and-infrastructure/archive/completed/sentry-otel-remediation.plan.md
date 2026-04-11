---
name: "Sentry + OTel Branch Remediation"
overview: >
  Remediation plan for the feat/full-sentry-otel-support branch. Captures
  ground-truth gate failures, all 6 specialist reviewer findings (21 items),
  and a prioritised 5-phase execution sequence to bring the branch to
  merge-ready state. Companion to the main execution plan.
status: completed
last_updated: 2026-04-11
completed: 2026-03-31
parent_plan: ../../active/sentry-otel-integration.execution.plan.md
---

# Remediation Plan: `feat/full-sentry-otel-support` Branch

## Context

The `feat/full-sentry-otel-support` branch adds Sentry + OpenTelemetry observability
foundation across the monorepo (270 files changed, ~13.6k insertions). The work was
implemented without invoking specialist reviewers or running quality gates to green.
This plan captures the ground-truth gate failures and all reviewer findings, then
defines a prioritised remediation sequence to bring the branch to merge-ready state.

**Branch**: `feat/full-sentry-otel-support` (4 commits ahead of `main`)
**Date**: 2026-03-28

## Session Progress

### 2026-03-29 remediation session (continuation)

All phases completed and committed (5 commits). Specialist reviewers
invoked at each phase gate: code-reviewer (Phase A, B), sentry-reviewer,
architecture-reviewer-fred, test-reviewer (all on Phase B fixes).

**19 of 21 findings resolved.** Remaining:

- **F10**: Reverted — out-of-scope (auth DI refactor, not observability)
- **F18**: Deferred — span DRY, different concerns

### 2026-03-28 remediation session (initial)

Ran 6 specialist reviewers, identified 21 findings, began Phase A.

---

## Quality Gate Status (Ground Truth)

| Gate | Status | Detail |
|------|--------|--------|
| build | PASS | All packages build |
| type-check | **FAIL** | `sentry-node` (missing type aliases), HTTP app (broken test harness types) |
| lint | **FAIL** | `sentry-node` (3 errors), HTTP app (42 errors, 126 warnings) |
| test | **FAIL** | 1 failing test in `server-runtime.unit.test.ts` |
| test:e2e | PASS | All 201 E2E tests pass |
| test:ui | Not run yet | Needs verification |
| smoke:dev:stub | Not run yet | Needs verification |

---

## Reviewer Summary

| Reviewer | Verdict | Critical | Important | Info |
|----------|---------|----------|-----------|------|
| code-reviewer | CHANGES REQUESTED | 6 | 8 | 1 |
| test-reviewer | CRITICAL VIOLATIONS | 3 | 5 | - |
| architecture-reviewer-fred | ISSUES FOUND | 1 | 2 | - |
| architecture-reviewer-wilma | CRITICAL ISSUES | 3 | 1 | 1 |
| security-reviewer | LOW RISK | 0 | 2 | 4 |
| sentry-reviewer | ISSUES FOUND | 1 | 4 | 5 |

---

## Deduplicated Findings (Priority Order)

### P0 — Gate Blockers (must fix to pass CI)

**F1. Missing type aliases in `sentry-node/src/runtime.unit.test.ts`**
- `SentryErrorEvent` and `SentryBreadcrumb` are used but never imported/defined
- Causes type-check failure in `@oaknational/sentry-node`
- **Fix**: Add local type aliases derived from `NodeOptions` parameters:
  ```typescript
  type SentryErrorEvent = Parameters<NonNullable<NodeOptions['beforeSend']>>[0];
  type SentryBreadcrumb = Parameters<NonNullable<NodeOptions['beforeBreadcrumb']>>[0];
  ```
- **File**: `packages/libs/sentry-node/src/runtime.unit.test.ts:125,135,436,440`
- **Source**: code-reviewer, test-reviewer

**F2. `bootstrapAppCalls` captured by value, not getter**
- Primitive captured at construction time; getter needed for live reads
- Causes the 1 failing test
- **Fix**: Replace plain property with `get bootstrapAppCalls() { return bootstrapAppCalls; }`
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts:109`
- **Source**: test-reviewer, code-reviewer

**F3. `ServerHarness` interface incomplete + `as` cast**
- `createServerRuntime` not on interface; `as ServerHarness & {...}` cast hides mismatch
- `FakeLogger` signature incompatible with `Logger` overloads
- `readonly` type modifier misuse on non-array/tuple
- Causes multiple type-check errors
- **Fix**: Add `createServerRuntime` to `ServerHarness` interface; fix `FakeLogger` to match
  `Logger` signature; remove `as` cast; replace `as never` returns with typed fakes
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts:19-29,61-83,141,143,151`
- **Source**: code-reviewer, test-reviewer

**F4. `for...in` loops causing unsafe-assignment lint errors in `sentry-node`**
- Two `for (const key in ...)` loops produce `no-unsafe-assignment` violations
- Also `max-statements` violation (22 vs 20)
- **Fix**: Replace with `typeSafeEntries()` from `@oaknational/type-helpers`; split long function
- **File**: `packages/libs/sentry-node/src/runtime-redaction.ts:147,190`
- **Source**: code-reviewer

**F5. HTTP app lint errors — max-lines, max-lines-per-function, complexity**
- `http-observability.ts`: 505 lines (limit 250), `createHttpObservability` 108 lines (limit 50)
- `oauth-and-caching-setup.ts`: `setupOAuthAndCaching` 84 lines (limit 50), file 311 lines
- `application.ts`: `createApp` 69 lines (limit 50), file 276 lines
- `asset-download-route.ts`: `proxyUpstreamAsset` 65 lines (limit 50), file 318 lines
- `logging/index.ts`: complexity 10 (limit 8) in 2 functions, file 271 lines
- `runtime-config.unit.test.ts`: arrow function 241 lines (limit 220)
- `observability-fakes.ts`: `createFakeHttpObservability` 51 lines (limit 50)
- **Fix**: Split files by responsibility; extract pure functions; reduce complexity
- **Source**: lint gate, code-reviewer, architecture-reviewer-fred

**F6. `no-unsafe-assignment` errors in HTTP app test files**
- Multiple instances across e2e helpers and integration tests
- **Fix**: Add proper typing to catch blocks and mock return values
- **Source**: lint gate

**F7. `Object.keys` usage violating `no-restricted-properties`**
- **Fix**: Replace with `typeSafeKeys()` from `@oaknational/type-helpers`
- **Source**: lint gate

### P1 — Architectural Issues (must fix before merge)

**F8. Live log sink uses `captureMessage` instead of `Sentry.logger.*` API**
- `captureMessage` creates Sentry issues (error-class events), not structured logs
- Each log event counts against issue quota, generates noise, and bypasses `beforeSendLog`
- `enableLogs` and `beforeSendLog` config are wired but never exercised
- **Fix**: Replace `captureMessage` with appropriate `Sentry.logger.*` calls; extend
  `SentryNodeSdk` interface to expose the logger API for DI
- **File**: `packages/libs/sentry-node/src/runtime-sinks.ts:110`
- **Source**: sentry-reviewer

**F9. Undeclared transitive `@sentry/node` dependency in app**
- App imports `type { NodeOptions } from '@sentry/node'` without declaring the dependency
- **Fix**: Re-export needed types from `@oaknational/sentry-node` so app doesn't reach through
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:29`
- **Source**: architecture-reviewer-fred

**F10. `vi.mock()` usage in `check-mcp-client-auth.unit.test.ts` — ADR-078 violation**
- 5 `vi.mock()` calls at module level; prohibited by ADR-078
- Root cause: product code uses ambient imports (`getRequestContext`, `getAuth`) rather than DI
- **Fix**: Refactor `checkMcpClientAuth` to accept dependencies as parameters; replace
  `vi.mock()` with injected fakes
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.unit.test.ts:17-21`
- **Source**: test-reviewer, code-reviewer

**F11. Signal race condition in server shutdown**
- Multiple SIGINT/SIGTERM handlers invoke flush concurrently
- **Fix**: Add once-guard (e.g. `let shuttingDown = false`) to prevent concurrent flush
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts:78-92`
- **Source**: architecture-reviewer-wilma

**F12. MCP wrapper error recording decoupling**
- If `recorder.record()` throws, original handler error is lost
- **Fix**: Wrap recorder call in try/catch; always re-throw original error
- **File**: `packages/libs/sentry-mcp/src/wrappers.ts:9-57`
- **Source**: architecture-reviewer-wilma

**F13. Span operation error suppression in critical paths**
- OTel errors during `recordException`/`setStatus`/`end` can mask business logic errors
- **Fix**: Guard all span lifecycle calls with try/catch; never let span errors propagate
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:206-250`
- **Source**: architecture-reviewer-wilma

**F14. `vi.spyOn(process.stdout, 'write')` in observability tests**
- Global state mutation; equivalent to `vi.stubGlobal` (prohibited)
- **Fix**: Inject logger output stream as a dependency
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts:92`
- **Source**: test-reviewer

### P2 — Security Hardening (should fix)

**F15. DSN value leaked in error message**
- `describeHttpObservabilityError` includes raw DSN (contains auth key) in error string
- **Fix**: Replace with `'Invalid SENTRY_DSN value'` (no interpolation)
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:384-394`
- **Source**: security-reviewer

**F16. `toNativeError` copies metadata via `Object.assign` — fragile ordering**
- Creates coupling assumption: metadata must be redacted before `toNativeError` is called
- **Fix**: Pass metadata via `captureException`'s `extra` field only; remove `Object.assign`
- **File**: `packages/libs/sentry-node/src/runtime-error.ts:30`
- **Source**: security-reviewer

### P3 — Improvements (should address)

**F17. Module-level `vi.fn()` in `wrappers.unit.test.ts`**
- Shared mutable state across tests
- **Fix**: Move to per-test factory function
- **File**: `packages/libs/sentry-mcp/src/wrappers.unit.test.ts:8-9`
- **Source**: test-reviewer

**F18. Span logic duplication between `core/observability` and app**
- `withActiveSpan` in core and `runWithLiveSpan` in app implement same pattern
- **Fix**: Evaluate whether core function can be extended to cover app's needs
- **Source**: architecture-reviewer-fred

**F19. `toProxyLogger` is dead code**
- Function does nothing — returns its argument unchanged
- **Fix**: Delete function; pass logger directly
- **File**: `apps/oak-curriculum-mcp-streamable-http/src/app/oauth-and-caching-setup.ts:53-55`
- **Source**: code-reviewer

**F20. Fixture mode unbounded memory growth**
- Fixture store accumulates observations without limit
- **Fix**: Add `clear()` method; document cleanup expectations for test suites
- **File**: `packages/libs/sentry-node/src/fixture.ts`
- **Source**: architecture-reviewer-wilma

**F21. Add `dsn` to `FULLY_REDACTED_KEYS`**
- Cheap defence-in-depth measure
- **File**: `packages/core/observability/src/redaction.ts:17-37`
- **Source**: security-reviewer

---

## Execution Sequence

### Phase A: Fix Gate Blockers (F1–F7)
Goal: All quality gates green. Work in order:

1. **F1**: Add type aliases to `sentry-node/runtime.unit.test.ts`
2. **F4**: Replace `for...in` with `typeSafeEntries` in `runtime-redaction.ts`; split long function
3. **F2**: Fix `bootstrapAppCalls` getter in `server-runtime.unit.test.ts`
4. **F3**: Fix `ServerHarness` interface, `FakeLogger` types, remove `as` casts
5. **F5**: Split oversized files/functions in HTTP app:
   - Split `http-observability.ts` into 3 modules (sanitisation, span helpers, compositor)
   - Extract helpers from `oauth-and-caching-setup.ts`, `application.ts`, `asset-download-route.ts`
   - Reduce complexity in `logging/index.ts`
   - Split `observability-fakes.ts` helper
6. **F6**: Fix `no-unsafe-assignment` in test files
7. **F7**: Replace `Object.keys` with `typeSafeKeys`

Run `pnpm type-check && pnpm lint:fix && pnpm test` after each step to confirm progress.

### Phase B: Fix Architectural Issues (F8–F14)
Goal: All reviewer findings addressed. Work in order:

1. **F8**: Replace `captureMessage` with `Sentry.logger.*` in live log sink
2. **F9**: Re-export Sentry types from `@oaknational/sentry-node`; remove transitive import
3. **F11**: Add shutdown once-guard in `server-runtime.ts`
4. **F12**: Guard recorder in MCP wrappers; preserve original errors
5. **F13**: Guard all span lifecycle calls with try/catch
6. **F14**: Inject logger output stream; remove `vi.spyOn(process.stdout)`
7. **F10**: Refactor `checkMcpClientAuth` for DI; remove `vi.mock()` — this is the largest single remediation item

### Phase C: Security Hardening (F15–F16)

1. **F15**: Remove DSN from error messages
2. **F16**: Remove `Object.assign` metadata copy in `toNativeError`

### Phase D: Improvements (F17–F21)

1. **F17**: Per-test factory in `wrappers.unit.test.ts`
2. **F18**: Evaluate span helper DRY opportunity (may defer)
3. **F19**: Delete `toProxyLogger`
4. **F20**: Add `clear()` to fixture store
5. **F21**: Add `dsn` to `FULLY_REDACTED_KEYS`

### Phase E: Final Verification
1. Run full `pnpm qg` (all quality gates)
2. Run `pnpm check` (clean rebuild + full verification)
3. Re-invoke reviewers on the remediated code:
   - code-reviewer (gateway)
   - sentry-reviewer (Sentry/OTel specifics)
   - test-reviewer (TDD compliance)
   - architecture-reviewer-fred (boundary compliance)
4. Confirm all findings addressed
5. Update plan status and handover documentation

---

## Verification

After each phase, run the appropriate gates:
- Phase A: `pnpm type-check && pnpm lint:fix && pnpm test`
- Phase B: `pnpm type-check && pnpm lint:fix && pnpm test && pnpm test:e2e`
- Phase C: `pnpm test` (security-relevant tests)
- Phase D: `pnpm test`
- Phase E: `pnpm qg` (full gate suite)

---

## Critical Files

### Must Modify
- `packages/libs/sentry-node/src/runtime.unit.test.ts` — F1
- `packages/libs/sentry-node/src/runtime-redaction.ts` — F4
- `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts` — F2, F3
- `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts` — F5, F8, F12, F14
- `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts` — F10
- `packages/libs/sentry-mcp/src/wrappers.ts` — F11
- `packages/libs/sentry-node/src/runtime-sinks.ts` — F8
- `packages/libs/sentry-node/src/types.ts` — F8 (extend SentryNodeSdk interface)
- `packages/libs/sentry-node/src/runtime-error.ts` — F16
- `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.ts` — F10
- `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.unit.test.ts` — F10

### Must Split (new files from existing)
- `apps/oak-curriculum-mcp-streamable-http/src/observability/sanitise-mcp-events.ts` — from http-observability.ts
- `apps/oak-curriculum-mcp-streamable-http/src/observability/span-helpers.ts` — from http-observability.ts

### Reuse (existing utilities)
- `@oaknational/type-helpers` — `typeSafeEntries()`, `typeSafeKeys()` for F4, F7
- `apps/oak-curriculum-mcp-streamable-http/src/app/test-helpers/create-test-logger.ts` — pattern for F3 `FakeLogger` fix

---

## Notes

- All 6 specialist reviewers have completed. All findings are incorporated.
- F10 (`checkMcpClientAuth` DI refactor) is the largest single item and may warrant its own
  sub-plan if complexity is high. The product code needs to accept Clerk's `getAuth` and
  other ambient dependencies as parameters.
- The 126 type assertion warnings in test files are predominantly at external SDK boundaries
  (Clerk, MCP SDK, Express). Many are pre-existing. Address new ones introduced by this
  branch; existing ones can be tracked separately.
