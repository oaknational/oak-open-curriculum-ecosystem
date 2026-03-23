---
prompt_id: semantic-search
title: "Semantic Search Session Entry Point"
type: handover
status: active
last_updated: 2026-03-23
---

# Semantic Search — Session Entry Point

This is a working handover document. Keep it concise and operational.

---

## Absolute priority

**Fix the bugs.** That is the only top priority. For each defect you work in a tight
loop: **identify** it from evidence (findings register, failing behaviour, code
trace), **write automated tests** that fail until the bug is fixed, **apply the
smallest fix** that makes those tests pass, and **stop only when the tests are
green** — that is how you know you are finished. Documentation updates, plan
hygiene, and operator re-ingest are **secondary**; they support or **prove**
fixes (for example when the bug is missing index data), but they do not replace
test-backed correctness in code and transforms.

---

## Active Authority

- **Active P0 lane (operator re-ingest next)**:
  [f2-closure-and-p0-ingestion.execution.plan.md](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)
- Active parallel plan (starts after F2 promote):
  [bulk-canonical-merge-api-parity-and-validation.execution.plan.md](../../plans/semantic-search/active/bulk-canonical-merge-api-parity-and-validation.execution.plan.md)
- Active findings register:
  [search-tool-prod-validation-findings-2026-03-15.md](../../plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md)
- Critical path and queue:
  [current/README.md](../../plans/semantic-search/current/README.md)
- Permanent contracts:
  [ADR-134](../../../docs/architecture/architectural-decisions/134-search-sdk-capability-surface-boundary.md) (CLI-SDK boundary),
  [ADR-139](../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md) (sequence semantic)
- Completed remediation (archived):
  [pre-reingest-remediation.execution.plan.md](../../plans/semantic-search/archive/completed/pre-reingest-remediation.execution.plan.md)
- Session bootstrap and lane-order authority: this prompt

---

## Where We Are (2026-03-23)

**Branch**: `feat/es_index_update`

### F2/P0 lane (UNBLOCKED — operator re-ingest next)

**Phase 1** (code follow-ups): ✅ COMPLETE — readiness gate closed, code fixes
landed, and the latest lane-alignment commit is `3630405b`. Core commits:
`dfb48b90`, `3ec1dbc6`, `3630405b`.
**Phase 2** (re-ingest): Task 2.1 ✅ (operator runbook documented) —
**UNBLOCKED** (pre-reingest remediation complete 2026-03-23).
**Phase 3** (production verification): Not started — depends on Phase 2.

### Pre-reingest remediation + CLI-SDK boundary enforcement (COMPLETE)

All five code/doc issues (S1–S5) resolved. Architecture reviewers then
identified CLI-SDK boundary confusion (7 duplicated capability families with
fuzziness drift). Full boundary separation, clarification, and enforcement
completed 2026-03-23:

- All retriever shapes delegated to SDK across all 4 scopes
- ~500 lines of duplicated CLI code deleted (12 files removed)
- Experiment/ablation builders migrated to SDK building blocks
- ADR-134 amended with capability family matrix
- "Layer Role Topology" principle added to Practice Core
- Quality gates green (997 tests, 0 lint errors)

### What the next session needs to do

All code work is committed (`6adafaff`, `745719a6`). The next session is
operational, not coding:

1. **Operator re-ingest (Phase 2 of F2 closure):** Run `admin stage` with
   the corrected pipeline. Validate staged indexes with
   `field-readback-audit --target-version <version>`. Promote when clean.
   See the [F2 closure plan](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)
   for exact commands and pre-checks.
2. **Production verification (Phase 3):** Retest F1 (threadSlug) and F2
   (category) with the queries in the findings register. Both must pass.
3. **Close out:** Update findings register dispositions. Archive F2 plan.
   Consolidate docs.

### Key facts for context

- **F1** (`threadSlug`): Stale index, not a code defect. Re-ingest resolves.
- **F2** (`category`): Code fix complete (commit `2c6e6b51`). Re-ingest
  populates the corrected data.
- **SDK `total` in search responses**: For lessons/sequences, `total` reflects
  the returned page length (post scoring filters), not Elasticsearch
  `hits.total` — do not use it alone to compare “how many matched in the index”
  in Phase 3 prod checks; see findings register *Response `total` caveat*.
- **`validate-aliases` vs freshness**: Green alias health means each read alias
  exists and points at a physical index — **not** that live docs match the
  latest bulk. Use `admin count` only for live alias counts; for staged
  validation use the `admin stage` output plus
  `field-readback-audit --target-version <version>`. Compare bulk vintage to
  alias `targetIndex` when diagnosing live gaps. Permanent reference:
  [`apps/oak-search-cli/docs/INDEXING.md`](../../../apps/oak-search-cli/docs/INDEXING.md)
  (section *Operational CLI: `validate-aliases` vs `admin count`*).
- **Sequence retrieval**: Code now uses SDK-owned 2-way RRF (BM25 + ELSER
  semantic on `sequence_semantic`). `sequence_semantic` is populated during
  bulk ingestion via `generateSequenceSemanticSummary`. Live data will reflect
  this after the next re-ingest (Phase 2 of F2 closure).
  [ADR-139](../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md)
  is the permanent contract.
- **CLI entry point**: `apps/oak-search-cli/bin/oaksearch.ts` (not `src/bin/`).
- **Bulk data**: 33 files in `apps/oak-search-cli/bulk-downloads/` ready.
- **Upstream API bug**: PE lessons without video trigger 500 on transcript
  endpoint. Documented at `.agent/plans/external/ooc-issues/upstream-500-errors.md`.
  Oak API team concern, not ours.

---

## Session Start Sequence

### Step 1: Ground

- [start-right-quick](../../skills/start-right-quick/shared/start-right.md)
  (or thorough for complex work)
- [AGENT.md](../../directives/AGENT.md)
- [principles.md](../../directives/principles.md)

### Step 2: Execute the active plan

**Immediate**: Resume the F2/P0 lane — operator stage/validate/promote/verify.
All code is committed. Active plan:

[f2-closure-and-p0-ingestion.execution.plan.md](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)

The pre-reingest remediation is ✅ COMPLETE (all 4 phases done, 2026-03-23).
Archived reference:
[pre-reingest-remediation.execution.plan.md](../../plans/semantic-search/archive/completed/pre-reingest-remediation.execution.plan.md)

### Step 3: Keep authority documents in sync

When execution state changes materially, update:

- This prompt (lane ordering and current focus)
- The active plan (task status and evidence)
- The findings register (F1/F2 dispositions)
- `current/README.md` (critical path status)
- Reference plans when their work items complete via the remediation plan
  ([search-contract-followup.plan.md](../../plans/semantic-search/current/search-contract-followup.plan.md),
  [sequence-retrieval-architecture-followup.plan.md](../../plans/semantic-search/current/sequence-retrieval-architecture-followup.plan.md))

---

## Ingest Safety Policy

- Do not run ingest/promote commands until the execution plan records explicit
  readiness-gate closure.
- For operator-run ingest:
  1. agent prepares exact command and pre-check context;
  2. operator runs command independently;
  3. agent monitors output and proposes remediation.
- Agent does not start ingest commands unless explicitly requested in-session.

---

## Lane Indexes

- [Active Plans](../../plans/semantic-search/active/README.md)
- [Current Queue](../../plans/semantic-search/current/README.md)
- [Roadmap](../../plans/semantic-search/roadmap.md)
- [Archive](../../plans/semantic-search/archive/completed/README.md)
