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

### Step 2: Address F2 immediate follow-ups

Three items, in order:

1. **Extract shared `createMockClient` test helper** — duplicated OakClient
   mock factory exists in `bulk-ingestion.integration.test.ts`,
   `category-wiring.integration.test.ts`, `hybrid-data-source.integration.test.ts`,
   `api-supplementation.unit.test.ts`, and possibly others. Extract to a shared
   `test-helpers/mock-oak-client.ts` and update all consumers. Run full gates.

2. **Migrate `fetchCategoryMapForSequences` to Result** — currently throws on
   fetch failure. Change return type to `Promise<Result<CategoryMap, Error>>`,
   update `BulkIngestionDeps` type, update call site in `prepareBulkIngestion`
   to unwrap. The fail-fast throw should happen only at the CLI entry point,
   not inside a function called through a `deps` surface.

3. **Prepare re-ingest operator command** — the exact CLI command, pre-checks,
   and expected output for the operator to run the re-ingest. See versioned
   ingestion progress tracker in memory for Phase 3 Task 3.1 details.

### Step 3: Run reviewer cycle on follow-up changes

Invoke `code-reviewer` + relevant specialists after completing each follow-up.
Address all findings before proceeding.

### Step 4: Update authority documents

When execution state changes, update both:

1. `semantic-search.prompt.md` (this file — lane ordering and current focus)
2. `search-tool-prod-validation-findings-2026-03-15.md` (finding status,
   evidence, dispositions)
3. `current/README.md` (critical path status)

### Step 5: Prepare for P0 Phase 3

Once F2 follow-ups are complete, the re-ingest can proceed:

```bash
cd apps/oak-search-cli
pnpm tsx src/bin/oaksearch.ts admin stage --bulk-dir ./bulk-downloads -v
```

Then: validate → promote → verify.

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
