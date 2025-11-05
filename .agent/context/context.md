# Context: Oak MCP Ecosystem

**Updated**: 2025-11-05  
**Branch**: `feat/oauth_support`

## Current Focus

🚨 **RESCUE MODE ACTIVE** – Git disaster recovery left stdio server in broken state. Executing rescue plan (`.agent/plans/rescue-plan-2025-11-05.md`) to restore working baseline before resuming Phase 2 work. The stdio logging migration was partially complete (new modules exist) but critical `runtime-config.ts` is missing and old logger still in use.

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
- 🚨 **2025-11-05**: Git disaster recovery revealed stdio Tranche 1.4 was incomplete - new logging modules exist but `runtime-config.ts` missing and old logger still active
- 🔧 **2025-11-05**: Rescue plan created to complete stdio migration and restore working baseline

## Architectural Guardrails (Still Enforced)

1. **Tree-shakeable design**: browser entry stays free of Node built-ins; Node-only features live under `/node`
2. **Runtime typing discipline**: no `any`, `as`, `Record<string, unknown>`, non-specific guards, or other type eroders
3. **Public API only**: consumers import via package exports, never `src/`
4. **Validated data**: all runtime data originates from validated schemas; no type broadening after validation
5. **TDD + fail fast**: keep Red → Green → Refactor loop, prefer `parse` with crisp errors, handle `safeParse` results immediately when used

## Next Steps (Execute in Order)

### 1. 🚨 ACTIVE: Execute Rescue Plan (2025-11-05)

Follow `.agent/plans/rescue-plan-2025-11-05.md` to:

- Create missing `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts`
- Complete stdio logger migration (update `wiring.ts` to use shared logger)
- Clean build and validate stdio server
- Run full quality gates to restore green baseline
- Update planning documents
- Hand off back to main plan

**Exit Criteria**: All tranches R.1 through R.6 complete, `pnpm qg` passes

### 2. Phase 2 – Transport Instrumentation (Queued, resumes after rescue)

- Define tracing/span model leveraging the consolidated logger outputs
- Instrument priority transports (stdio, HTTP) with structured correlation IDs
- Validation: targeted package builds/tests plus bespoke transport diagnostics (see plan)

### 3. Phase 3 – Rollout & Monitoring (Queued)

- Prepare production rollout plan for instrumentation
- Establish dashboards/alerts consuming new telemetry
- Validation: full `pnpm qg` + environment-specific smoke checks

## State Snapshot

| Tranche     | Description                  | Status / Notes                     |
| ----------- | ---------------------------- | ---------------------------------- |
| 1.1         | Legacy trace system removal  | ✅ Complete                        |
| 1.2         | Shared logger enhancements   | ✅ Complete                        |
| 1.2.5       | Logger package restructure   | ✅ Complete (2025-11-03)           |
| 1.2.6       | Logger consumer audit & docs | ✅ Complete (2025-11-03)           |
| 1.3         | HTTP server clean-up         | ✅ Complete (2025-11-03)           |
| 1.4         | Stdio server migration       | 🚨 INCOMPLETE (rescue in progress) |
| 1.5         | Integration & quality gates  | ⏸️ Blocked (pending rescue)        |
| **R.1-R.6** | **Rescue tranches**          | 🔧 **ACTIVE (2025-11-05)**         |

## Quality Gate Status

🚨 **Current state**: BROKEN (stdio server has missing dependencies)

Latest successful run (2025-11-04, HTTP server only):

```bash
pnpm format-check:root
pnpm markdownlint-check:root
pnpm build
pnpm type-check
pnpm lint
pnpm doc-gen
pnpm test
pnpm test:e2e
pnpm smoke:dev:stub
pnpm smoke:dev:live
pnpm qg
```

Re-run the full suite after rescue completion and before every hand-off.

## Reference Rules & Documents

- 🚨 **`.agent/plans/rescue-plan-2025-11-05.md`** – **ACTIVE rescue plan (execute first)**
- `.agent/plans/mcp-oauth-implementation-plan.md` – authoritative roadmap (resume after rescue)
- `.agent/context/continuation.prompt.md` – quick-start hand-off prompt (kept in sync with this file)
- `.agent/directives-and-memory/rules.md` – cardinal rules (must follow)
- `docs/agent-guidance/testing-strategy.md` – mandated TDD approach
- `packages/libs/logger/README.md` – logger usage, entry points, sink configuration
- `apps/oak-curriculum-mcp-streamable-http/TESTING.md` – HTTP testing guidance
