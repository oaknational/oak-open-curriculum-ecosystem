---
prompt_id: semantic-search
title: "Semantic Search Session Entry Point"
type: handover
status: active
last_updated: 2026-03-21
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

- Active execution plan:
  [f2-closure-and-p0-ingestion.execution.plan.md](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)
- Active findings register:
  [search-tool-prod-validation-findings-2026-03-15.md](../../plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md)
- Critical path and queue:
  [current/README.md](../../plans/semantic-search/current/README.md)
- Post-P0 follow-up (queued — does not block re-ingest):
  [search-contract-followup.plan.md](../../plans/semantic-search/current/search-contract-followup.plan.md)
- Session bootstrap and lane-order authority: this prompt

---

## Where We Are (2026-03-21)

**Branch**: `feat/es_index_update`
**Phase 1** (code follow-ups): ✅ COMPLETE — all gates green, 1038 tests,
six specialist reviewer passes. Commits: `dfb48b90`, `3ec1dbc6`.
**Phase 2** (re-ingest): Task 2.1 ✅ (operator runbook documented) —
**operator stage/validate/promote is the next action**.
**Phase 3** (production verification): Not started — depends on Phase 2.

### What the next session needs to do

1. **Bugs first:** Pin F1/F2 (and any follow-on) with tests that fail before the
   fix; ship the fix; confirm the full suite passes.
2. **Data-layer proof:** When a fix requires fresh Elasticsearch documents,
   run the operator stage / validate / promote path in the execution plan
   (Tasks 2.1–2.3), then record prod evidence (Task 3.1).
3. **Closure:** Update findings, archive the plan, sync authority docs (Task 3.2)
   once tests and any required ingest evidence are in place.

Commands and expected outputs for Phase 2–3 remain in the execution plan.

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
  latest bulk. Use `admin count` for true parent counts; compare bulk vintage
  to alias `targetIndex` when diagnosing gaps. Permanent reference:
  [`apps/oak-search-cli/docs/INDEXING.md`](../../../apps/oak-search-cli/docs/INDEXING.md)
  (section *Operational CLI: `validate-aliases` vs `admin count`*).
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

The active plan contains all execution detail — phases, tasks, commands,
expected outputs, and quality/reviewer gates:

[f2-closure-and-p0-ingestion.execution.plan.md](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)

Summary of phases:

1. **Phase 1**: F2 code follow-ups — ✅ COMPLETE
2. **Phase 2**: Re-ingest — Task 2.1 ✅, operator stage/validate/promote 🔴 NEXT
3. **Phase 3**: Production verification (F1/F2 retest, closure)

### Step 3: Keep authority documents in sync

When execution state changes materially, update:

- This prompt (lane ordering and current focus)
- The active plan (task status and evidence)
- The findings register (F1/F2 dispositions)
- `current/README.md` (critical path status)
- Post-P0 follow-up plan when those tasks start or complete
  ([search-contract-followup.plan.md](../../plans/semantic-search/current/search-contract-followup.plan.md))

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
