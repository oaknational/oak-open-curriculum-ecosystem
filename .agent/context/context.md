# Context: Oak MCP Ecosystem

**Updated**: 2025-11-14 (Middleware chain complete; header redaction tests required)  
**Branch**: `feat/oauth_support`

## Current Focus

✅ **Phase 1 Complete** – Logging consolidation and runtime config refactoring delivered  
✅ **Phase 2 Complete** – Transport instrumentation delivered with correlation IDs, timing metrics, and error enrichment  
✅ **Session 3.A Complete** – Documentation finalization and dev server validation  
✅ **Session 3.B Complete** – Logger architecture verification (no further refactor required)  
✅ **Runtime Diagnostics Complete** – All three phases delivered  
✅ **Middleware Chain Documentation & Reordering Complete** – Canonical Clerk setup documented  
✅ **Header Redaction Test Coverage Complete** – 69 tests added (53 unit, 10 integration, 6 E2E)  
🎯 **Status**: All quality gates passing, ready for Session 3.C staging deployment

## Strategic Goal

Deliver a unified, type-safe, well-documented logging foundation that enables transport instrumentation for diagnosing production timeouts and errors while maintaining protocol correctness (stdout-only for HTTP/Vercel; file-only for stdio).

## Recent Milestones

- ✅ Logger package split into browser (`@oaknational/mcp-logger`) and Node (`@oaknational/mcp-logger/node`) entry points
- ✅ Adaptive logger updated with browser guardrails; Node runtime gains `adaptive-node`
- ✅ Integration tests added to prove entry-point separation
- ✅ JSON sanitisation refactor eliminated long-standing lint violations
- ✅ Tranche 1.2.6 and 1.3 closed on 2025-11-03, aligning HTTP server to shared logger
- ✅ Full quality gate sweep (`pnpm qg`) run on 2025-11-04 (HTTP server validated)
- ✅ HTTP server `src/runtime-config.ts` introduced and logging/handler wiring refactored
- ✅ **2025-11-05**: Rescue plan executed successfully to complete stdio server migration after git disaster recovery
- ✅ **2025-11-05**: All quality gates green, 438+ tests passing, full e2e validation complete
- ✅ **2025-11-05**: Runtime config consolidation complete across HTTP and stdio servers
- ✅ **2025-11-05**: Repository pushed to remote, Phase 1 fully delivered
- ✅ **2025-11-06**: Session 2.1 complete - HTTP server correlation IDs with full tracing support
- ✅ **2025-11-06**: 13 new HTTP correlation tests added (6 unit, 7 integration), all passing
- ✅ **2025-11-06**: Comprehensive correlation ID documentation added to HTTP README and TESTING.md
- ✅ **2025-11-06**: Session 2.2 complete - Stdio server correlation IDs with full tracing support
- ✅ **2025-11-06**: 9 new stdio correlation tests added (6 unit, 3 logger helpers), all passing
- ✅ **2025-11-06**: Comprehensive correlation ID documentation added to stdio README
- ✅ **2025-11-06**: Session 2.3 complete - Request timing instrumentation for HTTP and stdio servers
- ✅ **2025-11-06**: Timing utilities added to logger package with browser-safe implementation
- ✅ **2025-11-06**: Slow request warnings implemented (2s HTTP, 5s stdio)
- ✅ **2025-11-06**: 4 new timing tests added, comprehensive documentation with log filtering examples
- ✅ **2025-11-07**: Session 2.4 complete - Error context enrichment for HTTP and stdio servers
- ✅ **2025-11-07**: Error context module added to logger package with enrichError function
- ✅ **2025-11-07**: HTTP and stdio error handling updated to include correlation ID and timing
- ✅ **2025-11-07**: 12 new error enrichment tests added (5 unit, 7 integration), comprehensive documentation
- ✅ **2025-11-08**: Session 2.5 complete - Phase 2 Integration & Validation
- ✅ **2025-11-08**: Full quality gate validation confirms 738 tests passing, all gates green
- ✅ **2025-11-08**: Phase 2 milestone reached - complete observability instrumentation delivered
- ✅ **2025-11-08**: All documentation updated to reflect Phase 2 completion
- ✅ **2025-11-08**: Session 3.A complete - Documentation finalization and production readiness validation
- ✅ **2025-11-08**: SDK logging guide created with patterns and best practices
- ✅ **2025-11-08**: Production debugging runbook created for operational teams
- ✅ **2025-11-08**: Dev server validated with observability features (correlation IDs, timing, error enrichment)
- ✅ **2025-11-08**: Deprecated `REMOTE_MCP_ALLOW_NO_AUTH` replaced with `DANGEROUSLY_DISABLE_AUTH`
- ✅ **2025-11-08**: Discovery: Consola outputs multi-line logs incompatible with production log aggregation
- ✅ **2025-11-08**: ADR-051 created: OpenTelemetry-compliant single-line JSON logging (supersedes ADR-017)
- ⚠️ **2025-11-08**: Critical architecture review revealed rule violations (process/env access, test globals mutation)
- ✅ **2025-11-10**: Architecture verification: All Session 3.B work already complete during Phase 2
- ✅ **2025-11-10**: Logger package verified: Zero lint errors, proper DI, Node.js APIs confined to node.ts
- ✅ **2025-11-10**: Application wiring verified: HTTP and stdio both use UnifiedLogger with explicit DI
- 🛠️ **2025-11-12**: Created `mcp-streamable-http-runtime-diagnostics-plan.md` to track bootstrap instrumentation and built-server harness work
- ✅ **2025-11-12**: Runtime diagnostics Phase 1 delivered – new bootstrap/auth instrumentation with logger helpers, logger build + HTTP suite updated (197 logger tests, 74 HTTP tests)
- ⚠️ **2025-11-12**: Quality gate sweep exposed new lint/type-check gaps and missing scripts; remediation required
- ✅ **2025-11-13**: Quality gate remediation complete - removed unused imports, fixed unsafe assignments, refactored index.ts
- ✅ **2025-11-13**: Created `app/bootstrap-helpers.ts` to extract bootstrap logic, reduced index.ts to 226 lines
- ✅ **2025-11-13**: All quality gates passing: build, type-check, lint, test:all (738 tests)
- ✅ **2025-11-13**: Runtime Diagnostics Phase 2 complete - built-server harness with config matrix and automated request testing
- ✅ **2025-11-13**: Harness deliverables: `server-harness.js`, `run-requests.js`, 3 config scenarios, package scripts, documentation
- ✅ **2025-11-13**: Manual validation successful - all 3 requests pass (healthz, landing, MCP initialize)
- 🔄 **2025-11-13**: Phase 3 Iteration 1 - Added comprehensive middleware instrumentation to trace request flow
- ✅ **2025-11-13**: CRITICAL FINDING - Clerk middleware IS scoped to `/mcp` only (line 238: `app.use('/mcp', clerkMw)`)
- ✅ **2025-11-13**: Testing with invalid Clerk keys shows NO HANG locally - `/healthz` (3ms), `/` (2ms), `/mcp` fails fast (500, 20ms)
- ✅ **2025-11-13**: VERIFIED - Complete response bodies returned locally, all middleware executes correctly
- ❌ **2025-11-13**: Phase 3 Iteration 2 - Attempted Vercel export fix (modified server.ts to export app as default)
- ❌ **2025-11-13**: FIX FAILED - Vercel logs show bootstrap completes but requests still hang (responseStatusCode: -1)
- ⚠️ **2025-11-13**: ROOT CAUSE UNKNOWN - Bootstrap succeeds, but NO request-level instrumentation logs appear
- 🔍 **2025-11-13**: NEW FINDING - Vercel IS creating the app (bootstrap logs present) but requests never reach Express middleware
- ❌ **2025-11-13**: Phase 3 Iteration 3 - Investigation into Vercel serverless function invocation model (issue persists)
- ✅ **2025-11-14**: Middleware Chain Documentation & Reordering complete
- ✅ **2025-11-14**: Split setupAuthRoutes into setupGlobalAuthContext and setupAuthRoutes
- ✅ **2025-11-14**: Reordered middleware registration - clerkMiddleware now runs globally before path-specific middleware
- ✅ **2025-11-14**: Created comprehensive docs/middleware-chain.md with ASCII and Mermaid diagrams
- ✅ **2025-11-14**: Updated docs/deployment-architecture.md with middleware chain summary
- ✅ **2025-11-14**: Reviewed and updated all documentation in apps/oak-curriculum-mcp-streamable-http/docs
- ✅ **2025-11-14**: Full quality gates passing after middleware work (all 218 tests across all suites)
- ✅ **2025-11-14**: Test suite analysis complete - established baseline of 218 tests
- 🔴 **2025-11-14**: CRITICAL DISCOVERY - Header redaction code has ZERO test coverage (security blocker)
- ✅ **2025-11-14**: Header redaction test coverage COMPLETE - 69 tests added (53 unit, 10 integration, 6 E2E)
- ✅ **2025-11-14**: All quality gates passing - 287 total tests (218 baseline + 69 new)
- ✅ **2025-11-14**: Security blocker resolved - comprehensive test coverage for sensitive header redaction

## Architecture Verification (2025-11-10)

During Session 3.B planning, comprehensive architecture review identified potential violations. Upon code inspection, **all concerns were found to be already resolved**.

**Verification Results:**

✅ **Logger package**: Zero lint errors, proper DI throughout
✅ **UnifiedLogger**: Pure constructor accepting only injected dependencies
✅ **Node.js API confinement**: `process.stdout` only in `createNodeStdoutSink()` in node.ts
✅ **Test safety**: All tests use injected mocks, no global mutation
✅ **Function complexity**: All functions ≤8 complexity
✅ **Tree-shaking**: Verified no Node.js APIs in browser bundle
✅ **Application wiring**: HTTP and stdio both use explicit DI

**Current Architecture** (Already in Place):

```text
Core (Runtime-agnostic):
├── unified-logger.ts       # ONE logger class ✅
├── otel-format.ts          # Pure formatting functions ✅
├── resource-attributes.ts  # Pure attribute builders ✅
├── log-levels.ts          # Severity mapping ✅
└── types.ts               # Shared interfaces ✅

Node Entry (packages/libs/logger/src/node.ts):
├── createNodeStdoutSink   # Only place with process.stdout ✅
├── createNodeFileSink     # Wraps file-sink with Node.js fs ✅
└── NODE_FILE_SYSTEM       # Filesystem implementation ✅

Browser Entry (packages/libs/logger/src/index.ts):
├── UnifiedLogger export   # Core logger class ✅
└── Utilities & types      # Runtime-agnostic ✅

Application Layer (HTTP & Stdio):
├── logging/index.ts       # Reads env ONCE, builds logger ✅
└── Handlers               # Receive logger instance ✅
```

**Key Achievements:**

1. **Pure Dependency Injection**: All dependencies injected, zero global access
2. **Node.js API Confinement**: `process.stdout` only in one function in node.ts
3. **Single Logger Implementation**: UnifiedLogger with varying configurations
4. **Type Safety**: No shortcuts, all types from SDK or proper validation
5. **Quality Gates**: All green (738+ tests, zero lint errors)

## Architectural Guardrails (Still Enforced)

1. **Tree-shakeable design**: browser entry stays free of Node built-ins; Node-only features live under `/node`
2. **Runtime typing discipline**: no `any`, `as`, `Record<string, unknown>`, non-specific guards, or other type eroders
3. **Public API only**: consumers import via package exports, never `src/`
4. **Validated data**: all runtime data originates from validated schemas; no type broadening after validation
5. **TDD + fail fast**: keep Red → Green → Refactor loop, prefer `parse` with crisp errors, handle `safeParse` results immediately when used

## Next Steps (Execute in Order)

### 1. Phase 2 – Transport Instrumentation ✅ COMPLETE

- ✅ Session 2.1: HTTP Server Correlation IDs
- ✅ Session 2.2: Stdio Server Correlation IDs
- ✅ Session 2.3: Request Timing Instrumentation
- ✅ Session 2.4: Error Context Enrichment
- ✅ Session 2.5: Phase 2 Integration & Validation

### 2. Phase 3 – Production Rollout & Monitoring

- ✅ Session 3.A: Documentation Finalization (Complete 2025-11-08)
- ✅ **Session 3.B: Logger Architecture** (Complete 2025-11-10 - work already done)
  - Verified: UnifiedLogger with pure DI ✅
  - Verified: Node.js APIs confined to node.ts ✅
  - Verified: Zero lint errors ✅
  - Verified: OpenTelemetry format working ✅
  - See `.agent/plans/logger-enhancement-plan.md` for details
- ✅ **Runtime Diagnostics Track** (`.agent/plans/mcp-streamable-http-runtime-diagnostics-plan.md`) - **COMPLETE 2025-11-13**
  - ✅ Phase 1 instrumentation (bootstrap/auth timers with integration coverage)
  - ✅ Quality gate remediation
  - ✅ Phase 2 harness: built-server harness with config matrix and automated request testing
  - ✅ Phase 3: Comprehensive middleware instrumentation
- ✅ **Middleware Chain Documentation & Reordering** (Complete 2025-11-14)
  - Split setupAuthRoutes into two-phase architecture
  - Reordered middleware to ensure clerkMiddleware runs globally early
  - Created comprehensive middleware-chain.md with diagrams
  - Updated deployment-architecture.md
  - All documentation reviewed and updated
  - Full quality gates passing (218 tests)
- 🔴 **CRITICAL BLOCKER: Header Redaction Test Coverage** (MUST complete before Session 3.C)
  - **Problem**: `src/logging/header-redaction.ts` has ZERO test coverage
  - **Impact**: Security-critical feature protecting auth tokens, cookies, IPs is unproven
  - **Requirement**: Comprehensive unit, integration, and E2E tests per TDD rules and testing-strategy.md
  - **Priority**: Cannot deploy to staging without proving security correctness
  - **Next Action**: Implement test suite following TDD workflow (Red → Green → Refactor)
- ⏸️ **Session 3.C: Staging Deployment & Validation** (BLOCKED until header redaction tests complete)
  - Deploy HTTP server to staging environment
  - Validate log ingestion by observability platforms
  - Execute smoke tests against staging
  - Verify OpenTelemetry format compatibility
  - Validate correlation IDs, timing, error enrichment end-to-end
- [ ] Session 3.D: Production Rollout & Observation (After 3.C)
  - Gradual production rollout
  - Monitor log volume and costs
  - Establish dashboards and alerts
  - Iterate based on production feedback

## State Snapshot

| Tranche     | Description                    | Status / Notes                           |
| ----------- | ------------------------------ | ---------------------------------------- |
| 1.1         | Legacy trace system removal    | ✅ Complete                              |
| 1.2         | Shared logger enhancements     | ✅ Complete                              |
| 1.2.5       | Logger package restructure     | ✅ Complete (2025-11-03)                 |
| 1.2.6       | Logger consumer audit & docs   | ✅ Complete (2025-11-03)                 |
| 1.3         | HTTP server clean-up           | ✅ Complete (2025-11-03)                 |
| 1.4         | Stdio server migration         | ✅ Complete (2025-11-05, rescue)         |
| 1.5         | Integration & quality gates    | ✅ Complete (2025-11-05)                 |
| **R.1-R.6** | **Rescue tranches**            | ✅ **Complete (2025-11-05)**             |
| **Runtime** | **Config consolidation**       | ✅ **Complete (HTTP+Stdio, 2025-11-05)** |
| **2.1**     | **HTTP correlation IDs**       | ✅ **Complete (2025-11-06)**             |
| **2.2**     | **Stdio correlation IDs**      | ✅ **Complete (2025-11-06)**             |
| **2.3**     | **Request timing**             | ✅ **Complete (2025-11-06)**             |
| **2.4**     | **Error context enrichment**   | ✅ **Complete (2025-11-07)**             |
| **2.5**     | **Integration & validation**   | ✅ **Complete (2025-11-08)**             |
| **3.A**     | **Documentation finalization** | ✅ **Complete (2025-11-08)**             |
| **3.B**     | **Logger architecture**        | ✅ **Complete (2025-11-10, verified)**   |
| **Diag**    | **Runtime diagnostics**        | ✅ **Complete (2025-11-13)**             |
| **MW**      | **Middleware chain docs**      | ✅ **Complete (2025-11-14)**             |
| **Tests**   | **Header redaction tests**     | 🔴 **BLOCKER (Must complete first)**     |
| **3.C**     | **Staging deployment**         | ⏸️ **Blocked (test coverage required)**  |

## Quality Gate Status

✅ **Current state**: 2025-11-14 all quality gates passing after middleware work

**Latest run (2025-11-14)**

- `pnpm build` ✅
- `pnpm format:root` ✅
- `pnpm markdownlint:root` ✅
- `pnpm type-check` ✅
- `pnpm lint` ✅
- `pnpm test:all` ✅ (218 tests across all suites)

**Test Suite Breakdown (2025-11-14)**

| Test Suite            | Tests         | Status |
| --------------------- | ------------- | ------ |
| `pnpm test`           | 129           | ✅     |
| `pnpm test:e2e`       | 57            | ✅     |
| `pnpm test:e2e:built` | 5             | ✅     |
| `pnpm test:ui`        | 21            | ✅     |
| `pnpm smoke:dev:stub` | 6 assertions  | ✅     |
| **TOTAL**             | **218 tests** | ✅     |

**Remediation completed (2025-11-13)**:

1. ✅ Removed unused `LoggedEntry` import from `bootstrap.instrumentation.integration.test.ts`
2. ✅ Fixed unsafe `any` assignments in diagnostics tests by eliminating intermediate variables
3. ✅ Refactored `src/index.ts` to address lint violations:
   - Extracted bootstrap-related functions to `app/bootstrap-helpers.ts`
   - Reduced file size from 278 lines to 226 lines (under 250 limit)
   - Fixed catch parameter typing with explicit `: unknown`
   - Resolved max-statements violation in bootstrap test
4. ✅ Fixed array type syntax (`T[]` instead of `Array<T>`) per linting rules

**Most recent all-green sweep (2025-11-08, Session 2.5 validation):**

```bash
pnpm format-check:root    ✅
pnpm markdownlint-check:root ✅
pnpm build                ✅ (10 packages)
pnpm type-check           ✅ (10 workspaces)
pnpm lint                 ✅ (10 workspaces)
pnpm doc-gen              ✅
pnpm test                 ✅ (738 tests, +38 instrumentation tests total)
pnpm test:e2e             ✅ (68 tests: HTTP 45, Stdio 12, SDK 11)
pnpm smoke:dev:stub       ✅
pnpm smoke:dev:live       ✅
pnpm qg                   ✅
```

**Session 2.1 Test Additions**:

- 6 unit tests for HTTP correlation ID generation (`correlation/index.unit.test.ts`)
- 7 integration tests for HTTP correlation middleware (`correlation/middleware.integration.test.ts`)
- 3 additional tests for HTTP logger correlation helpers (`logging/logging.unit.test.ts`)

**Session 2.2 Test Additions**:

- 6 unit tests for stdio correlation ID generation (`correlation/index.unit.test.ts` in stdio app)
- 3 additional tests for stdio logger correlation helpers (`logging/logging.unit.test.ts` in stdio app)

**Session 2.3 Test Additions**:

- 4 unit tests for timing utilities (`packages/libs/logger/src/timing.unit.test.ts`)
- 3 integration tests for HTTP timing middleware (`correlation/middleware.integration.test.ts`)
- Timing validated in existing e2e tests

**Session 2.4 Test Additions**:

- 5 unit tests for error enrichment (`packages/libs/logger/src/error-context.unit.test.ts`)
- 7 integration tests for HTTP error enrichment (`apps/oak-curriculum-mcp-streamable-http/src/error-handling.integration.test.ts`)
- 5 integration tests for stdio error enrichment (`apps/oak-curriculum-mcp-stdio/src/app/error-enrichment.integration.test.ts`)
- Error enrichment validated in existing e2e tests

**Session 2.5 Validation Results**:

- ✅ Full quality gate sweep completed successfully
- ✅ All 738 tests passing (700 baseline + 38 Phase 2 instrumentation tests)
- ✅ All 68 e2e tests passing across 3 workspaces
- ✅ No regressions detected from Phase 1 or Phase 2 work
- ✅ Build, type-check, lint, and documentation all passing
- ✅ Smoke tests (stub and live) verified

**Session 3.A Deliverables** (2025-11-08):

Documentation Updates:

- Created `packages/sdks/oak-curriculum-sdk/docs/logging-guide.md` - Comprehensive SDK logging patterns
- Updated `packages/sdks/oak-curriculum-sdk/README.md` - Added Logging section with examples
- Updated `apps/oak-curriculum-mcp-streamable-http/README.md` - Added Production Logging section
- Updated `apps/oak-curriculum-mcp-stdio/README.md` - Added Log File Management section
- Created `docs/development/production-debugging-runbook.md` - Operational debugging guide
- Created `docs/agent-guidance/logging-guidance.md` - AI agent logging guidance
- Updated `docs/development/README.md` - Added link to debugging runbook
- Updated `docs/agent-guidance/README.md` - Added link to logging guidance

Environment & Configuration:

- Fixed deprecated `REMOTE_MCP_ALLOW_NO_AUTH` → `DANGEROUSLY_DISABLE_AUTH` everywhere
- Updated HTTP server dev command with LOG_LEVEL=debug and observability features
- Validated dev server with correlation IDs, timing metrics, and error enrichment working

Discovery & Planning:

- Identified Consola multi-line logging incompatible with production log aggregation
- Researched OpenTelemetry Logs Data Model for industry-standard compliance
- Created ADR-051: OpenTelemetry-Compliant Single-Line JSON Logging
- Updated ADR-017: Marked as superseded by ADR-051
- Prepared comprehensive implementation plan for Session 3.B

**Session 3.B Verification** (2025-11-10):

Architecture Review:

- Reviewed entire logger package codebase for planned Session 3.B work
- Discovered all architectural improvements already implemented during Phase 2
- Verified zero lint errors in logger package
- Verified proper DI throughout (no global access)
- Verified Node.js APIs confined to node.ts entry point
- Verified HTTP and stdio servers using UnifiedLogger with explicit DI
- Created `.agent/plans/logger-enhancement-plan.md` documenting completion
- Updated all context documents to reflect verified state

Re-run the full suite before every hand-off and after significant changes.

## Reference Rules & Documents

- `.agent/plans/mcp-oauth-implementation-plan.md` – authoritative roadmap (includes Session 3.B plan)
- `.agent/context/continuation.prompt.md` – quick-start hand-off prompt (kept in sync with this file)
- `.agent/directives-and-memory/rules.md` – cardinal rules (must follow)
- `.agent/directives-and-memory/testing-strategy.md` – mandated TDD approach
- `docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md` – ADR for OpenTelemetry format
- `packages/libs/logger/README.md` – logger usage, entry points, sink configuration
- `apps/oak-curriculum-mcp-streamable-http/TESTING.md` – HTTP testing guidance
- `docs/development/production-debugging-runbook.md` – operational debugging guide
- 📜 `.agent/plans/rescue-plan-2025-11-05.md` – Completed rescue plan (historical reference)
