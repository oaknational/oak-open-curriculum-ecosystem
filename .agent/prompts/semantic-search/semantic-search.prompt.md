---
prompt_id: semantic-search
title: "Semantic Search Session Entry Point"
type: handover
status: active
last_updated: 2026-03-22
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

- **Immediate execution plan (BLOCKS re-ingest)**:
  [pre-reingest-remediation.execution.plan.md](../../plans/semantic-search/active/pre-reingest-remediation.execution.plan.md)
- Active P0 lane (blocked until remediation completes):
  [f2-closure-and-p0-ingestion.execution.plan.md](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)
- Active parallel plan (not on remediation critical path; starts after F2 promote):
  [bulk-canonical-merge-api-parity-and-validation.execution.plan.md](../../plans/semantic-search/active/bulk-canonical-merge-api-parity-and-validation.execution.plan.md)
- Active findings register:
  [search-tool-prod-validation-findings-2026-03-15.md](../../plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md)
- Critical path and queue:
  [current/README.md](../../plans/semantic-search/current/README.md)
- Permanent sequence semantic contract:
  [ADR-139](../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md)
- Locked execution recipe (referenced by remediation plan):
  [sequence-retrieval-architecture-followup.plan.md](../../plans/semantic-search/current/sequence-retrieval-architecture-followup.plan.md)
- Contract test + prod smoke source (referenced by remediation plan):
  [search-contract-followup.plan.md](../../plans/semantic-search/current/search-contract-followup.plan.md)
- Session bootstrap and lane-order authority: this prompt

---

## Where We Are (2026-03-22)

**Branch**: `feat/es_index_update`

### F2/P0 lane (paused — blocked by remediation)

**Phase 1** (code follow-ups): ✅ COMPLETE — readiness gate closed, code fixes
landed, and the latest lane-alignment commit is `3630405b`. Core commits:
`dfb48b90`, `3ec1dbc6`, `3630405b`.
**Phase 2** (re-ingest): Task 2.1 ✅ (operator runbook documented) —
**BLOCKED until pre-reingest remediation completes**.
**Phase 3** (production verification): Not started — depends on Phase 2.

### Pre-reingest remediation (ACTIVE — immediate next action)

All known code issues must be resolved before re-indexing. Five issues are
outstanding (S1–S5); see the
[remediation plan](../../plans/semantic-search/active/pre-reingest-remediation.execution.plan.md)
for the full inventory, TDD phase model, and completion criteria.

### What the next session needs to do

Follow the **pre-reingest remediation plan** for step-by-step instructions.
In summary:

1. **Phase 1 (RED):** Write failing tests for `sequence_semantic` construction,
   SDK 2-way RRF retrieval shape, and lessons `threadSlug` field-integrity.
2. **Phase 2 (GREEN):** Implement `generateSequenceSemanticSummary`, wire through
   builder/transformer/pipeline, upgrade `buildSequenceRetriever` to 2-way RRF.
3. **Phase 3 (REFACTOR):** Collapse CLI duplicate sequence retriever, update
   docs, add `sequence_semantic` to field-gap ledger, document optional prod
   smoke in `INDEXING.md`.
4. **Phase 4 (GATES/REVIEWS):** Full quality gates + all required reviewer
   passes (architecture, Elasticsearch, test, code, docs-ADR).
5. **Then resume F2/P0:** Operator stage / validate / promote (Phase 2 of
   the F2 closure plan), followed by production verification (Phase 3).

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
- **Sequence retrieval**: Sequences are currently lexical-only because
  `sequence_semantic` is mapped but unpopulated. This is now **actively being
  remediated** — see the
  [pre-reingest remediation plan](../../plans/semantic-search/active/pre-reingest-remediation.execution.plan.md)
  for the full issue inventory (S1–S5) and TDD execution recipe.
  [ADR-139](../../../docs/architecture/architectural-decisions/139-sequence-semantic-contract-and-ownership.md)
  is the permanent contract;
  [sequence-retrieval-architecture-followup.plan.md](../../plans/semantic-search/current/sequence-retrieval-architecture-followup.plan.md)
  carries the locked execution recipe referenced by the remediation plan.
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

**Immediate**: The pre-reingest remediation plan contains all execution detail
for the five outstanding code/doc issues that block re-indexing:

[pre-reingest-remediation.execution.plan.md](../../plans/semantic-search/active/pre-reingest-remediation.execution.plan.md)

Summary of remediation phases:

1. **Phase 1 (RED)**: Failing tests for S1–S4 🔴 NEXT
2. **Phase 2 (GREEN)**: Implementation (sequence_semantic, 2-way RRF)
3. **Phase 3 (REFACTOR)**: CLI collapse, docs, field-gap ledger, prod smoke
4. **Phase 4 (GATES/REVIEWS)**: Full gates + all required reviewer passes

**After remediation**: Resume the F2/P0 lane (operator stage/validate/promote):

[f2-closure-and-p0-ingestion.execution.plan.md](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)

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
