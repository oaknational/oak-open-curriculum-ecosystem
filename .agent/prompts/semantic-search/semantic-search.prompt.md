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

## Active Authority

- Active execution plan:
  [f2-closure-and-p0-ingestion.execution.plan.md](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)
- Active findings register:
  [search-tool-prod-validation-findings-2026-03-15.md](../../plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md)
- Critical path and queue:
  [current/README.md](../../plans/semantic-search/current/README.md)
- Session bootstrap and lane-order authority: this prompt

Current lane objective:

- **Close F2 follow-ups**, then prepare the re-ingest operator command for
  P0 Phase 3 (unified versioned ingestion final phases).

Current handover state (updated 2026-03-21):

- **Error response classification**: COMPLETE (commit `f86b841a`).
  Generated invoke method preserves HTTP status via `InvokeResult`.
  Domain-aware classification: 401→AUTHENTICATION_REQUIRED,
  404→RESOURCE_NOT_FOUND, 400+blocked→CONTENT_NOT_AVAILABLE (informational),
  other 4xx→UPSTREAM_API_ERROR.
- **Codegen schema adaptation**: COMPLETE (commit `2ea997d6`).
  Cardinal Rule restored — `pnpm sdk-codegen && pnpm build && pnpm check`
  passes. Dotted component name sanitisation + cross-validator wildcard
  awareness fixed.
- **F2 categoryMap wiring**: Architecture findings COMPLETE (commit `2c6e6b51`).
  All five reviewer passes done (code-reviewer, architecture-reviewer-barney,
  test-reviewer, docs-adr-reviewer, elasticsearch-reviewer). All findings
  addressed. 1038 tests passing.
  - DI consistency: `fetchCategoryMapForSequences` added to `BulkIngestionDeps`
  - Type tightening: `CategoryFetchDeps` uses canonical `Result<unknown, unknown>`
  - ES mapping: `unit_topics.keyword` sub-field added to rollup overrides,
    facet query targets `.keyword` (prevents runtime failure on re-ingest)
  - Documentation: ADR-093 revised, adapters README updated, plan status fixed
- **F2 immediate follow-ups** (must complete before re-ingest):
  1. Extract shared `createMockClient` test helper (DRY debt across 4+ files)
  2. Migrate `fetchCategoryMapForSequences` to return `Result<CategoryMap, Error>`
     (ADR-088 compliance at public function boundary)
  3. Prepare re-ingest operator command
- **F1** (`threadSlug`): Confirmed stale index, not a code defect. Re-ingest
  resolves.
- **Upstream API bug**: PE lessons without video trigger 500 on transcript
  endpoint. Documented at `.agent/plans/external/ooc-issues/upstream-500-errors.md`.
  Oak API team concern, not something to work around downstream.

---

## Session Start Sequence

### Step 1: Ground

- [start-right-quick](../../skills/start-right-quick/shared/start-right.md)
  (or thorough for complex work)
- [AGENT.md](../../directives/AGENT.md)
- [principles.md](../../directives/principles.md)
- Check memory for `project_f2-fix-and-schema-blocker.md` for detailed
  follow-up descriptions

### Step 2: Execute the active plan

The active plan contains all execution detail — phases, tasks, commands,
expected outputs, and quality/reviewer gates:

[f2-closure-and-p0-ingestion.execution.plan.md](../../plans/semantic-search/active/f2-closure-and-p0-ingestion.execution.plan.md)

Summary of phases:

1. **Phase 1**: F2 code follow-ups (shared mock helper, Result migration)
2. **Phase 2**: Re-ingest (operator: stage, validate, promote, verify)
3. **Phase 3**: Production verification (F1/F2 retest, closure)

### Step 3: Keep authority documents in sync

When execution state changes materially, update:

- This prompt (lane ordering and current focus)
- The active plan (task status and evidence)
- The findings register (F1/F2 dispositions)
- `current/README.md` (critical path status)

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
