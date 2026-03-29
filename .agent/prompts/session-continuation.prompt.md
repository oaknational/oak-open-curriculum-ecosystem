---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-03-29
---

# Session Continuation

## Ground First

1. Read and internalise `.agent/directives/AGENT.md` and
   `.agent/directives/principles.md` — these are authoritative and
   override any conflicting detail in this prompt.
2. Find the current active plans in
   `.agent/plans/architecture-and-infrastructure/active/`. There are two:
   - `ci-consolidation-and-gate-parity.plan.md` — near completion, only
     Phase 6 (documentation) remains
   - `eslint-disable-remediation.plan.md` — the active remediation work
3. Re-establish live branch state instead of trusting stale document
   snapshots:

```bash
git status --short
git diff --cached --stat
git log --oneline --decorate origin/feat/mcp_app..HEAD
```

## This Prompt's Role

- This file is the operational entry point only.
- The active plans are authoritative for scope, sequencing, acceptance
  criteria, and detailed validation. Consult them before marking any
  priority item complete.
- Do not duplicate volatile git facts, long file inventories, or full
  plan detail here.

## Active Work

1. **eslint-disable remediation** (~64 directives remain): generators,
   generated data, logger, test fakes, authored code, miscellaneous.
   See `eslint-disable-remediation.plan.md` for the full inventory and
   execution order.
2. **CI plan documentation** (Phase 6): update ADRs 065 and 086,
   build-system docs, and testing strategy where the implemented
   behaviour changed.

## Scope Boundaries (do NOT)

- Do not reopen the completed CI consolidation (Phases 0-2, 4-5)
  unless fresh CI evidence proves a regression.
- Do not modify widget deletion decisions (Phase 2 is settled).
- Do not open new workstreams outside the active plans' scope.
- Do not refactor `apps/oak-curriculum-mcp-stdio` — it is outside the
  current workspace graph.
- Do not rely on ephemeral git state (stashes, reflogs) as
  continuation state; use the plans and branch state instead.

## Durable Guidance

- `pnpm check` is the decisive full-repo verification (includes clean,
  build, all gates). Use package-scoped filters while iterating; `pnpm
  check` is the final gate. `pnpm qg` is the read-only variant (no
  build, no auto-fix). `pnpm fix` auto-fixes format, markdownlint, lint.
- If `pnpm check` fails, diagnose by running individual gates.
- Use sub-agents for review before completing significant changes. See
  `.agent/directives/invoke-code-reviewers.md` for the full roster.
- The vocab-gen pipeline generates types from bulk download data, not
  from the OpenAPI schema. The cardinal rule (`pnpm sdk-codegen`) governs
  OpenAPI-derived types only. Do not conflate the two pipelines.

## Quality Gates

Full verification: `pnpm check`
Read-only check: `pnpm qg`
Auto-fix: `pnpm fix`
