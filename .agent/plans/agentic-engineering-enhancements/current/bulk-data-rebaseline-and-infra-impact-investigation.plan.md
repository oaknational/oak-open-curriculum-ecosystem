---
plan_id: bulk-data-rebaseline-and-infra-impact-investigation
status: DRAFT — pending owner approval to open
shape: investigation — not a fix plan
follows: upstream-oak-api-multi-unit-lesson-adoption (resolved 2026-05-15)
program: token-remediation-p8-parallel-program.plan.md (linked from §Current Snapshot bulk-data follow-on note)
---

# Bulk Data Rebaseline + Search Infrastructure Impact Investigation

## Purpose

Re-download upstream Oak Open Curriculum bulk data, re-run it through the
existing ingestion pipeline, and observe whether anything breaks in:

1. Bulk-typed SDK consumers (`@oaknational/sdk-codegen/bulk` `Lesson`,
   `Unit`, etc., consumed by `apps/oak-search-cli/src/adapters/bulk-data-adapter.ts`,
   `bulk-rollup-builder.ts`, `bulk-lesson-transformer.ts`, and the indexing
   path under `apps/oak-search-cli/src/lib/indexing/`).
2. Search infrastructure (ES indexer document shape, RRF retrieval, sequence
   facets, query helpers under `packages/sdks/oak-search-sdk/src/retrieval/`).

This is an **investigation plan, not a fix plan**. If breakage is observed,
each breakage opens a separately-named follow-on plan. *If not currently
broken, do not fix; just find out.*

## Why This Plan

The upstream Oak API schema changed at commit `c80d15f2` (lesson resource
multi-unit shape; KS4 programme-variant filters; image filter on three
question endpoints). The
`upstream-oak-api-multi-unit-lesson-adoption.plan.md` covered API-sourced
consumer adoption but explicitly held bulk-sourced consumers and the ES
infrastructure surface out of scope. The bulk surface has not been
re-downloaded yet, so bulk-typed consumers continue to compile against the
pre-change `Lesson`/`Unit` types — they may break (or may not) once a fresh
bulk regen lands. The ES doc shape (parallel `tiers[]` / `exam_boards[]` /
`unit_slugs[]`) was kept stable in the API-adoption plan; whether the ES
indexer or retrieval needs adjustment in response to the upstream change
remains observation territory.

## Constraints

- **No production reindex.** Elastic Serverless supports zero-downtime
  alias-swapped reindex (per ADR-130), but the actual reindex of
  `oak_lessons` is owner-directed and lives in a separately-named plan,
  not in this investigation.
- **No mapping changes.** This plan observes; mapping changes belong in a
  search-infrastructure plan.
- **No fix-on-discovery.** When breakage is observed, the investigation
  plan records the finding and exits. Fix planning is a fresh session.

## Workstreams

### WS-A — Bulk schema diff

- Regenerate `@oaknational/sdk-codegen/bulk` types against the current
  upstream bulk source (whatever path the bulk-codegen pipeline reads from).
- Diff the regenerated `Lesson` (and related) types against the previous
  regen, focusing on the unit-shape fields.
- Report shape changes in a working-tree document under `/tmp` (not
  committed); the WS-D acceptance report cites the diff.

### WS-B — Bulk-typed consumer breakage scan

- With the bulk regen in place locally, run `pnpm type-check` and
  `pnpm test` against the workspaces that consume the bulk surface:
  - `apps/oak-search-cli` (adapter files in `src/adapters/bulk-*.ts`,
    indexing files in `src/lib/indexing/lesson-aggregation.ts` and
    `document-transforms.ts`, ingestion tests in
    `src/lib/indexing/ingest-harness.unit.test.ts`).
- Enumerate every type/test failure with `file:line` and the failing
  expression. Classify each:
  - **No-op** (test still describes correct behaviour after rename).
  - **Minor-fixable** (one-line/-fixture change).
  - **Substantive** (architectural decision required; opens follow-on
    plan).
- If zero breaks: bulk shape is unchanged at this revision. Record and
  close at WS-D.

### WS-C — Search infrastructure run-through

- With the bulk regen and indexer (un)changes, run the existing ingestion
  pipeline against a representative sample of lessons (the sandbox
  fixtures under `apps/oak-search-cli/fixtures/sandbox/` are a starting
  point; a small live-bulk slice via the existing CLI is the deeper
  check). Confirm the indexer still emits the expected `SearchLessonsIndexDoc`
  shape — parallel `unit_slugs[]`, `unit_titles[]`, `tiers[]`,
  `exam_boards[]`, etc.
- Run a sample of RRF queries via `packages/sdks/oak-search-sdk/src/retrieval/`
  helpers and confirm result shapes stay stable.
- Run a sample of sequence-facets queries and confirm `sequence-facets.ts`
  output is unchanged.
- Observe; do not fix. Record findings.

### WS-D — Report and route

- If WS-A/B/C surface zero breakage: write a short note (ADR-080 §"ES Shape
  vs API Shape Are Independent" addendum, or a runbook entry under
  `docs/operations/`) recording that the bulk re-baseline produced no
  breakage. Close the plan.
- If breakage surfaces: each distinct breakage opens its own follow-on
  plan (e.g., `bulk-schema-realignment-<name>`, `search-mapping-update-<name>`,
  `indexer-fix-<name>`). This investigation plan archives with pointers
  to each follow-on.

## Acceptance

A single report document describing:

1. The bulk-shape diff (verbatim shape excerpts before/after).
2. The consumer-breakage surface (file:line list with classification).
3. The search-infrastructure observation (indexer + retrieval + sequence
   facets — all named explicitly, even where unchanged).
4. A named verdict for each lane: clean / minor-fixable / requires-
   substantive-plan.

The plan archives to `archive/completed/` once the report lands.

## Critical Files (read-only and write surfaces)

Read-only (source of truth):

- `packages/sdks/oak-sdk-codegen/...` bulk-codegen pipeline (the generator
  that produces `@oaknational/sdk-codegen/bulk`).
- `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-helpers.ts`
  (filter and field-name expectations).
- `packages/sdks/oak-search-sdk/src/retrieval/sequence-facets.ts`
  (sequence-facets doc shape).
- `apps/oak-search-cli/src/adapters/bulk-data-adapter.ts`,
  `bulk-rollup-builder.ts`, `bulk-lesson-transformer.ts`.

Write surfaces (only if WS-D verdict opens follow-ons):

- New plan files under `.agent/plans/<thread>/current/` per breakage
  surface.
- Documentation updates (this plan does not pre-name them).

## Risk Assessment

- **R1 — Bulk regen scope creep**. The bulk-codegen pipeline may have
  changed alongside the API regen. The investigation must not "fix" bulk
  generator code under any circumstance; that is a separately-planned
  follow-on.
- **R2 — Indexer-test environment**. WS-C requires a representative
  sample. The sandbox fixtures may not exercise programme-variant edge
  cases. Document any sample limitations in the WS-D report.
- **R3 — Time pressure**. The investigation is bounded by observation
  scope. If WS-A surfaces a substantive bulk-shape change, WS-B and WS-C
  can be deferred to the breakage-specific follow-ons; the investigation
  does not need to enumerate every consequence.

## Reviewer Disposition

- `assumptions-expert`: confirm the investigation scope is proportional
  and not slipping into fix territory.
- `elasticsearch-expert`: WS-C invocation — confirm the indexer/retrieval
  observation is sufficient as a smoke test, and name any additional
  query patterns worth probing.

Reviewer dispatch happens once owner approves this plan to open.

## Non-Goals

- Not a fix plan. Findings go to follow-ons.
- Not a feature plan. No new capability is delivered here.
- Not a reindex plan. ES doc shape change is owner-directed if/when
  needed.
- Not a codegen-pipeline plan. The bulk generator itself is treated as a
  black box at this layer.
