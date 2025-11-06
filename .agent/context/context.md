# Context: Oak MCP Ecosystem

**Updated**: 2025-11-06 (Session 2.3 Complete)  
**Branch**: `feat/oauth_support`

## Current Focus

✅ **Phase 1 Complete** – Logging consolidation and runtime config refactoring delivered  
✅ **Phase 2 Session 2.1 Complete** – HTTP server correlation IDs implemented with full request tracing support  
✅ **Phase 2 Session 2.2 Complete** – Stdio server correlation IDs implemented with full request tracing support  
✅ **Phase 2 Session 2.3 Complete** – Request timing instrumentation implemented for both HTTP and stdio servers  
🚀 **Next: Phase 2 Session 2.4** – Error context enrichment. All quality gates green.

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

## Architectural Guardrails (Still Enforced)

1. **Tree-shakeable design**: browser entry stays free of Node built-ins; Node-only features live under `/node`
2. **Runtime typing discipline**: no `any`, `as`, `Record<string, unknown>`, non-specific guards, or other type eroders
3. **Public API only**: consumers import via package exports, never `src/`
4. **Validated data**: all runtime data originates from validated schemas; no type broadening after validation
5. **TDD + fail fast**: keep Red → Green → Refactor loop, prefer `parse` with crisp errors, handle `safeParse` results immediately when used

## Next Steps (Execute in Order)

### 1. Phase 2 – Transport Instrumentation (In Progress)

- ✅ Session 2.1: HTTP Server Correlation IDs (Complete)
- ✅ Session 2.2: Stdio Server Correlation IDs (Complete)
- ✅ Session 2.3: Request Timing Instrumentation (Complete)
- 🔄 Session 2.4: Error Context Enrichment (Next)
- ⏳ Session 2.5: Final Integration & Smoke Tests

### 2. Phase 3 – Rollout & Monitoring (Queued)

- Prepare production rollout plan for instrumentation
- Establish dashboards/alerts consuming new telemetry
- Validation: full `pnpm qg` + environment-specific smoke checks

## State Snapshot

| Tranche     | Description                  | Status / Notes                           |
| ----------- | ---------------------------- | ---------------------------------------- |
| 1.1         | Legacy trace system removal  | ✅ Complete                              |
| 1.2         | Shared logger enhancements   | ✅ Complete                              |
| 1.2.5       | Logger package restructure   | ✅ Complete (2025-11-03)                 |
| 1.2.6       | Logger consumer audit & docs | ✅ Complete (2025-11-03)                 |
| 1.3         | HTTP server clean-up         | ✅ Complete (2025-11-03)                 |
| 1.4         | Stdio server migration       | ✅ Complete (2025-11-05, rescue)         |
| 1.5         | Integration & quality gates  | ✅ Complete (2025-11-05)                 |
| **R.1-R.6** | **Rescue tranches**          | ✅ **Complete (2025-11-05)**             |
| **Runtime** | **Config consolidation**     | ✅ **Complete (HTTP+Stdio, 2025-11-05)** |
| **2.1**     | **HTTP correlation IDs**     | ✅ **Complete (2025-11-06)**             |
| **2.2**     | **Stdio correlation IDs**    | ✅ **Complete (2025-11-06)**             |
| **2.3**     | **Request timing**           | ✅ **Complete (2025-11-06)**             |

## Quality Gate Status

✅ **Current state**: ALL GREEN (2025-11-06, Session 2.3 complete)

Latest successful run (2025-11-06, post Session 2.3):

```bash
pnpm format-check:root    ✅
pnpm markdownlint-check:root ✅
pnpm build                ✅ (10 packages)
pnpm type-check           ✅ (10 workspaces)
pnpm lint                 ✅ (10 workspaces)
pnpm doc-gen              ✅
pnpm test                 ✅ (726 tests, +26 timing/correlation tests total)
pnpm test:e2e             ✅ (68 tests, 3 workspaces)
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

Re-run the full suite before every hand-off and after significant changes.

## Reference Rules & Documents

- `.agent/plans/mcp-oauth-implementation-plan.md` – authoritative roadmap
- `.agent/context/continuation.prompt.md` – quick-start hand-off prompt (kept in sync with this file)
- `.agent/directives-and-memory/rules.md` – cardinal rules (must follow)
- `docs/agent-guidance/testing-strategy.md` – mandated TDD approach
- `packages/libs/logger/README.md` – logger usage, entry points, sink configuration
- `apps/oak-curriculum-mcp-streamable-http/TESTING.md` – HTTP testing guidance
- 📜 `.agent/plans/rescue-plan-2025-11-05.md` – Completed rescue plan (historical reference)
