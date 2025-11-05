# Continuation Prompt: Oak MCP Observability Implementation

**Last Updated**: 2025-11-05  
**Status**: 🚨 RESCUE MODE – Stdio server broken after git disaster · Follow rescue plan before resuming Phase 2

Use this prompt to rehydrate quickly when resuming the MCP observability effort.

## 🚨 CRITICAL: Repository in Rescue Mode

The repository is currently in a **broken state** following a git disaster and partial recovery. **DO NOT** proceed with Phase 2 work. Instead:

1. **Read the rescue plan**: `.agent/plans/rescue-plan-2025-11-05.md`
2. **Execute tranches R.1 through R.6** in order
3. **Validate** that `pnpm qg` passes
4. **Only then** return to normal Phase 2 work

## What Happened

- Git disaster lost ~48 hours of work
- Recovery from dangling blobs restored an inconsistent state
- Stdio server has new logging modules but missing `runtime-config.ts`
- Old logger still active in `wiring.ts`, new logger orphaned
- Planning docs incorrectly marked Tranche 1.4 complete
- Type system broken, builds will fail

## Startup Checklist (Once Rescue Complete)

- Read (in order):
  1. `@.agent/context/context.md` – authoritative state snapshot
  2. `.agent/plans/mcp-oauth-implementation-plan.md` – detailed roadmap & validation steps
  3. `.agent/directives-and-memory/rules.md` – cardinal rules (must follow)
  4. `docs/agent-guidance/testing-strategy.md` – mandated Red → Green → Refactor loop
- Confirm understanding of the logger entry-point split (main vs `/node`)
- Keep every quality gate green; never disable or skip checks

## Current State (2025-11-05)

- ✅ HTTP server: Correctly migrated to shared logger with runtime config
- ✅ Logger package: Working correctly with browser/node entry points
- 🚨 Stdio server: BROKEN - missing runtime-config.ts, old logger still in use
- 🚨 Quality gates: Will fail due to stdio type errors

## Rescue Plan Summary

Execute in order:

1. **Tranche R.1**: Create missing `runtime-config.ts` for stdio server
2. **Tranche R.2**: Complete stdio logger migration (update `wiring.ts`)
3. **Tranche R.3**: Clean build and unit tests
4. **Tranche R.4**: Integration and e2e validation
5. **Tranche R.5**: Repository-wide quality gates
6. **Tranche R.6**: Documentation updates and handoff

**Exit Criteria**: All acceptance criteria met, `pnpm qg` passes, planning docs updated.

## After Rescue: Immediate Plan (Follow in Order)

1. **Phase 2 – Transport Instrumentation**
   - Finalise tracing/span design leveraging consolidated logger outputs
   - Instrument priority transports (stdio, HTTP) with structured correlation identifiers
   - Validation: package-specific build/type-check/lint/test runs plus transport diagnostics
2. **Phase 3 – Rollout & Monitoring**
   - Prepare production rollout sequencing and environment configuration
   - Stand up dashboards/alerts that consume new telemetry streams
   - Validation: full `pnpm qg` alongside environment smoke tests before cutover
3. **Ongoing – Quality Gate Maintenance**
   - Keep `pnpm qg` green after Phase 2/3 changes
   - Update context/continuation prompts after every significant milestone

## Guardrails & Non-Negotiables

- No `any`, `as`, `Record<string, unknown>`, `Object.*`, `Reflect.*`, or similar shortcuts
- Treat incoming data as `unknown`, validate immediately, and never widen afterwards
- Public API only: no deep imports from `@oaknational/mcp-logger/src/...`
- Continue using tsdoc/Typedoc-ready comments for every export
- Prefer `parse` with clear error messages; if `safeParse` is used, handle failures immediately
- Quality gates: `format → type-check → lint → test → build` must stay green; no disabling checks ever

## Quality Gate Baseline (Target Post-Rescue)

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

## Quick Reference

- **RESCUE PLAN**: `.agent/plans/rescue-plan-2025-11-05.md` ← START HERE
- Plan: `.agent/plans/mcp-oauth-implementation-plan.md`
- Context snapshot: `.agent/context/context.md`
- Rules: `.agent/directives-and-memory/rules.md`
- Testing strategy: `docs/agent-guidance/testing-strategy.md`
- Logger docs: `packages/libs/logger/README.md`

## Hand-off Notes

- Repo is BROKEN as of 2025-11-05 following git disaster recovery
- Stdio server has missing dependencies and dual logger implementations
- HTTP server is intact and working correctly
- Execute rescue plan before attempting any Phase 2 work
- Auth smoke (`smoke:dev:live:auth`) remains manual-only; log results in evidence docs when run

---

**Next Review**: After rescue completion (or immediately if you are starting a new session)
