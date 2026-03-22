---
name: Search Tool Prod Validation Findings
date: 2026-03-15
status: active
owner: ai-agent
---

# Search Tool Prod Validation Findings (2026-03-15)

## Scope

This document captures end-to-end validation findings for the `search` MCP tool on `oak-prod`, after successful blue/green ingest and cutover.

- MCP server: `project-0-oak-mcp-ecosystem-oak-prod`
- Tool: `search`
- Environment under test: production

## Summary

The search infrastructure is mostly healthy across scopes and major filters.
**Root causes are documented** for the two production filter findings (F1/F2),
and **code fixes are complete** for F2; F1 is explained as **stale index data**
for `thread_slugs`, not a retrieval defect. **Production verification** that
filters behave as expected in live indexes is **still pending**: it requires the
versioned re-ingest, promote, and Phase 3 retest captured in the active
execution plan — until then, we do not have **closed** evidence for “all search
filters verified in production”.

See per-finding status lines and **Current execution state** below.

### Current execution state (2026-03-21)

- Previous ingest (`v2026-03-15-134856`) predates pipeline fixes — stale data.
- Phase 1 code follow-ups complete (2026-03-21): all fixes committed, all
  quality gates green, six specialist reviewer passes.
- Phase 2 re-ingest operator runbook documented in execution plan (Task 2.1).
- **Next**: operator runs `admin stage` to create new versioned indexes with
  corrected data, then validate, promote, and retest F1/F2.

### Code trace and regression tests (2026-03-21)

**MCP is not dropping `threadSlug` or `category`.** The curriculum SDK maps
MCP args into Search SDK params (`packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`);
`execution.integration.test.ts` asserts `searchLessons` receives `threadSlug` and
`searchSequences` receives `category`.

**Search SDK builds the expected ES filters and attaches them to every RRF
sub-retriever** (lessons: four-way `buildFourWayRetriever` in
`rrf-query-builders.ts`; sequences: two-way `buildSequenceRetriever` in
`retrieval-search-helpers.ts`). Lesson filters use `term` on `thread_slugs`;
sequence category uses `match_phrase` on `category_titles`
(`rrf-query-helpers.ts`).

**Regression tests (pin wiring, not prod index quality):**

- `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.unit.test.ts` —
  all four lesson RRF retrievers share the same `filter` when
  `buildLessonFilters` includes `threadSlug` (and other filters).
- `packages/sdks/oak-search-sdk/src/retrieval/search-sequences.integration.test.ts` —
  both sequence RRF `standard` retrievers share the same `filter` when
  `category` is set.

**Active (pre-reingest remediation S4/S5):** a lessons field-integrity test that
pins `threadSlug` to `SEARCH_FIELD_INVENTORY` (`thread_slugs`), mirroring the
sequence category test; plus a documented optional prod smoke procedure outside
default CI — see
[pre-reingest-remediation.execution.plan.md](./pre-reingest-remediation.execution.plan.md)
(Tasks 1.3, 3.2).

**Prod MCP spot-check (2026-03-21):** For lessons, baseline vs
`threadSlug: "number-fractions"` returned the same hit **count** (10); returned
lessons included that thread in `thread_slugs`, so this matrix does not prove
the filter ineffective — use a baseline that includes lessons **without** the
target thread, or diff result IDs. For sequences, responses showed
`category_titles: []` while invalid `category` still returned the same two maths
sequences — consistent with **empty / missing index data** for
`category_titles` until `categoryMap` is wired through ingest and indexes are
rebuilt (see F2 root-cause), not with MCP parameter stripping.

**Response `total` caveat:** `searchLessons` / `searchSequences` currently set
`total` to the length of the returned result set (post score filter), not
Elasticsearch `hits.total`. Treat `total` as **page cardinality**, not “matches
in the index”, when comparing prod runs.

---

## Coverage Executed

Validated scope and option coverage:

- Scopes: `lessons`, `units`, `threads`, `sequences`, `suggest`
- Filters/options: `subject`, `keyStage`, `size`, `from`, `unitSlug`, `tier`, `examBoard`, `year`, `threadSlug`, `highlight`, `minLessons`, `phaseSlug`, `category`, `limit`
- Validation behaviour:
  - missing/invalid required args
  - queryless `threads` behaviour
  - `suggest` context requirement behaviour

---

## Findings Register

## F1 - `threadSlug` filter on `lessons` returns empty unexpectedly

- Severity: high
- Status: stale_index_confirmed_pending_reingest
- Area: `search` filter semantics (`lessons` scope)

### Reproduction

Baseline query returns results:

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "size": 10
}
```

Observed: `total = 10` (multiple lessons found).

Apply `threadSlug` filter using known thread values:

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "threadSlug": "number-fractions",
  "size": 10
}
```

Observed: `total = 0`.

Also tested:

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "threadSlug": "number",
  "size": 10
}
```

Observed: `total = 0`.

And:

```json
{
  "scope": "lessons",
  "query": "energy",
  "subject": "science",
  "keyStage": "ks4",
  "threadSlug": "bq11-physics-how-do-forces-make-things-happen",
  "size": 5
}
```

Observed: `total = 0`, despite baseline query returning multiple lessons.

### Expected

`threadSlug` should narrow the baseline set, not collapse it to zero when matching thread metadata exists.

### Root-cause assessment (confirmed 2026-03-19)

- **Root cause: stale index.** The production index `v2026-03-15-134856` was
  ingested before pipeline fixes for `thread_slugs` landed.
- Code pipeline is proven correct at every stage:
  - Source data fully populated (verified against `maths-primary.json`:
    1072/1072 lessons match units, all 125 units have threads).
  - Adapter correctly maps `unit.threads` → `threadSlugs`
    (`bulk-data-adapter.ts:107`).
  - Builder maps `threadSlugs` → `thread_slugs`
    (`lesson-document-core.ts:206`, `document-transforms.ts:303`).
  - Retrieval uses correct `term` query on `keyword` field.
  - 35 field-integrity tests prove every stage.
- Query wiring is present in SDK (`threadSlug` -> `thread_slugs` lesson filter).
- **No code fix needed. Re-ingest will resolve this finding.**

### Historical stale-version evidence (pre-fix ingest v2026-03-15-134856)

Evidence below was captured against the stale production index, before pipeline
fixes landed. It demonstrates the bug, not closure.

- Baseline:

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "size": 10
}
```

Observed: `total = 10`.

- With `threadSlug: "number-fractions"`:

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "threadSlug": "number-fractions",
  "size": 10
}
```

Observed: `total = 0`.

- With `threadSlug: "number"`:

```json
{
  "scope": "lessons",
  "query": "fraction",
  "subject": "maths",
  "keyStage": "ks2",
  "threadSlug": "number",
  "size": 10
}
```

Observed: `total = 0`.

- Secondary confirmation:

```json
{
  "scope": "lessons",
  "query": "energy",
  "subject": "science",
  "keyStage": "ks4",
  "size": 5
}
```

Observed baseline: `total = 5`.

```json
{
  "scope": "lessons",
  "query": "energy",
  "subject": "science",
  "keyStage": "ks4",
  "threadSlug": "bq11-physics-how-do-forces-make-things-happen",
  "size": 5
}
```

Observed with filter: `total = 0`.

---

## F2 - `category` filter on `sequences` appears non-functional

- Severity: medium
- Status: code_fix_complete_and_hardened_pending_reingest
- Area: `search` filter semantics (`sequences` scope)

### Reproduction

Baseline:

```json
{
  "scope": "sequences",
  "query": "maths",
  "size": 10
}
```

Observed: 2 results (`maths-primary`, `maths-secondary`).

With obviously invalid category:

```json
{
  "scope": "sequences",
  "query": "maths",
  "category": "nonexistentzzz",
  "size": 10
}
```

Observed: same 2 results.

### Expected

Either:

- category is applied (invalid category returns zero), or
- tool rejects unknown category value with explicit validation error.

### Root-cause assessment (confirmed 2026-03-19)

- **Root cause: `categoryMap` is never wired into the ingestion pipeline.**
- `buildCategoryMap()` exists and is tested
  (`category-supplementation.ts:143`), and `buildSequenceBulkOperations()`
  accepts `categoryMap?` as 4th parameter
  (`bulk-sequence-transformer.ts:236`).
- But `extractAndBuildSequenceOperations()` in `bulk-ingestion-phases.ts:141-145`
  only passes 3 arguments — `categoryMap` is never passed.
- `collectCategoryTitles()` returns `[]` when `categoryMap` is `undefined`
  (`bulk-sequence-transformer.ts:83-84`), so `category_titles` is always
  empty in indexed sequence documents.
- Query-side remediation exists in local codebase:
  - `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-helpers.ts`
  - Structural integration/unit tests for sequence and lesson filter builders.
- Remaining semantic caveat: current sequence mapping stores
  `category_titles` as analysed text. Exact category semantics may still require
  a dedicated keyword/slug field after the wiring fix.
- **Code fix implemented (2026-03-19 session 2).** `categoryMap` wired through
  full pipeline (both sequence and unit paths). `fetchCategoryMapForSequences()`
  added. TDD evidence: `category-wiring.integration.test.ts`,
  `fetch-category-map.integration.test.ts`. **Re-ingest required to populate
  `category_titles` in indexed documents.**

### Code fix evidence (2026-03-19)

Files changed:

- `apps/oak-search-cli/src/adapters/category-supplementation.ts` — added
  `fetchCategoryMapForSequences()`, `CategoryFetchDeps` interface
- `apps/oak-search-cli/src/lib/indexing/bulk-ingestion-phases.ts` — wired
  `categoryMap` through `collectPhaseResults`, `extractAndBuildSequenceOperations`,
  `processAllBulkFiles`, `processSingleBulkFile`
- `apps/oak-search-cli/src/lib/indexing/bulk-ingestion.ts` — builds categoryMap
  before phase dispatch
- `apps/oak-search-cli/src/adapters/hybrid-data-source.ts` — wired `categoryMap`
  through `createHybridDataSource`
- `apps/oak-search-cli/src/adapters/bulk-data-adapter.ts` — wired `categoryMap`
  through `createBulkDataAdapter`, `createUnitTransformer`

Test evidence: all 1038 search-cli tests pass (as of 2026-03-21). Integration
tests prove `category_titles` populated in sequence docs and `unit_topics`
populated in unit docs when categoryMap is provided.

### Historical stale-version evidence (pre-fix ingest v2026-03-15-134856)

Evidence below was captured against the stale production index, before
`categoryMap` was wired through the pipeline. It demonstrates the bug, not closure.

- Baseline:

```json
{
  "scope": "sequences",
  "query": "maths",
  "size": 10
}
```

Observed: `total = 2` (`maths-primary`, `maths-secondary`).

- With invalid category:

```json
{
  "scope": "sequences",
  "query": "maths",
  "category": "nonexistentzzz",
  "size": 10
}
```

Observed: `total = 2` (unchanged from baseline).

Disposition: code fix complete and hardened (2026-03-21, commit `2c6e6b51`).
All architecture findings resolved, five specialist reviewer passes complete,
`unit_topics.keyword` sub-field added for terms aggregation. Cardinal Rule
breach resolved (commit `2ea997d6`). Production behaviour will remain unchanged
until re-ingest populates `category_titles` and `unit_topics` in indexed
documents. Post-reingest retest required for final closure.

**F2 closure evidence requirement**: `total = 0` **and** an empty hits array
for the `category: "nonexistentzzz"` query. Both conditions are required — a
non-empty hits array with `total = 0` would be a separate bug. This closes
the no-op regression only; full category-filter semantic correctness (analysed
text behaviour, positive controls) is follow-up scope.

---

## Confirmed Healthy Behaviours

- Queryless `threads` works when `subject` or `keyStage` is supplied.
- `threads` rejects requests without query and without `subject`/`keyStage`.
- `suggest` enforces context requirement (`subject` or `keyStage`).
- Pagination via `from` works (verified on lessons, units, threads).
- `tier` filter on KS4 lessons affects candidate set as expected.
- `examBoard` accepted and returns matching KS4 science lessons.
- `phaseSlug` on sequences constrains results (`primary` vs `secondary`).
- `subject` on sequences constrains results (for example, `science` vs `maths`).

---

## Suggested Next Actions

1. ~~For `F1`, sample `thread_slugs` directly from baseline lesson hits~~ —
   **DONE** (2026-03-19). Code pipeline proven correct at every stage. 35
   field-integrity tests prove all stages. No code fix needed — re-ingest
   resolves.
2. ~~For `F2`, prove remediated request path~~ — **DONE** (2026-03-21). Code
   fix hardened with DI consistency, Result type tightening, `unit_topics.keyword`
   sub-field for facet aggregation, five specialist reviewer passes complete.
3. Re-run the production validation matrix for `F1` and `F2` **after re-ingest**,
   appending before/after evidence and final disposition here.
4. Keep this file linked from prompt + active plan closeout until `F1` and
   `F2` are either closed with evidence or explicitly owner-triaged.
5. Do not close `F1` or `F2` on code-only evidence; closure requires production
   retest evidence in this register or explicit owner triage rationale.

---

## Operator Note

Blue/green ingest and alias promotion are healthy and complete for this run. These findings are search-filter correctness issues, not deployment lifecycle failures.
