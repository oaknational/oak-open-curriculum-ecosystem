---
prompt_id: semantic-search
title: "Semantic Search Session Entry Point"
type: handover
status: active
last_updated: 2026-03-12
---

# Semantic Search — Session Entry Point

**Last Updated**: 2026-03-12 (post-review remediation pass)

This prompt is intentionally short and operational. Long-lived architecture,
history, and completed phase detail lives in ADRs, roadmap, and archived plans.

---

## Immediate Context

**Branch context**: use current checkout and verify explicitly; do not assume a branch name.

Current priorities:

1. [cli-robustness.plan.md](../../plans/semantic-search/active/cli-robustness.plan.md) (active incident lane)
2. [search-cli-sdk-boundary-migration.execution.plan.md](../../plans/semantic-search/active/search-cli-sdk-boundary-migration.execution.plan.md) (boundary execution lane)

Boundary doctrine is now anchored in
[ADR-134](../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md).

---

## Current Standalone Start Path

Treat this prompt plus
[cli-robustness.plan.md](../../plans/semantic-search/active/cli-robustness.plan.md) and
[search-cli-sdk-boundary-migration.execution.plan.md](../../plans/semantic-search/active/search-cli-sdk-boundary-migration.execution.plan.md)
as the standalone entrypoint for the next session.

Run this first:

```bash
cd apps/oak-search-cli
pnpm tsx bin/oaksearch.ts admin validate-aliases
```

Then follow the plan re-entry branch:

- If initial `validate-aliases` fails, classify failure cause first
  (connectivity/auth/cluster health vs metadata mapping contract). Execute
  metadata schema/mapping remediation only for confirmed contract failures.
- If `versioned-ingest` fails with metadata contract evidence
  (`strict_dynamic_mapping_exception` path), execute the metadata
  schema/mapping remediation checkpoint.
- If post-ingest `validate-aliases` fails, treat this as active incident
  remediation and re-run validation after fix before entering Phase 4.
- If aliases are healthy and `versioned-ingest` passes, complete remaining
  Phase 5 REFACTOR and Task 5.6 boundary-guardrail checks first; enter formal
  Phase 4 closeout only after those acceptance criteria pass.

Record outcome by appending a dated bullet under
**Next Session Bootstrap (Standalone Entry Point)** in
`cli-robustness.plan.md` before moving to any other semantic-search lane.

---

## Standalone Session Bootstrap

Run this checklist at the start of the next session:

1. Re-ground via:
   - [start-right-thorough.md](../../skills/start-right-thorough/shared/start-right-thorough.md)
   - [AGENT.md](../../directives/AGENT.md)
   - [principles.md](../../directives/principles.md)
   - [testing-strategy.md](../../directives/testing-strategy.md)
   - [schema-first-execution.md](../../directives/schema-first-execution.md)
2. Verify current state before planning or coding:

   ```bash
   git status --short
   git branch --show-current
   ls -1 .agent/plans/semantic-search/active
   ```

3. If the session touches historical SDK workspace separation concerns, use the
   archived plan and baseline files directly rather than replaying the old split
   verification by default.

4. Read boundary-critical ADRs:
   - [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) — two-pipeline architecture, consumer model, boundary invariants, 4-workspace vision
   - [ADR-134](../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md) — Search SDK read/admin boundary doctrine
   - [ADR-065](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md) — turbo task dependencies and caching
   - [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) — vocab pipeline ownership
5. Read the active execution plan you are working from:
   - [cli-robustness.plan.md](../../plans/semantic-search/active/cli-robustness.plan.md) — current active lane; execute the metadata remediation checkpoint first
   - [search-cli-sdk-boundary-migration.execution.plan.md](../../plans/semantic-search/active/search-cli-sdk-boundary-migration.execution.plan.md) — executable plan for strict CLI/SDK capability boundary migration and lint fitness enforcement
6. Use lane indexes for everything else:
   - [Active Plans](../../plans/semantic-search/active/README.md)
   - [Current Queue](../../plans/semantic-search/current/README.md)
   - [Roadmap](../../plans/semantic-search/roadmap.md)

---

## Execution Ordering Note

Run the `cli-robustness` re-entry checkpoint first; it is authoritative for
incident-state capture and metadata remediation. Boundary migration is
authoritative for ADR-134 capability-boundary changes and enforcement.

If both lanes are active concurrently, use separate branches/worktrees and
rebase boundary migration frequently on incident-lane changes to shared files.
Formal incident-lane closeout remains blocked on Phase 5 REFACTOR plus ADR-134
boundary proof.

Queue and archive references live in:

- [Current Queue](../../plans/semantic-search/current/README.md)
- [Archive Completed](../../plans/semantic-search/archive/completed/)
