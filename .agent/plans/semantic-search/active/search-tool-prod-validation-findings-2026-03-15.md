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

The search infrastructure is mostly healthy across scopes and major filters. However, two filters remain unresolved in production after reingest and retest:

1. **F1**: `threadSlug` filter on `lessons` likely broken (returns zero in scenarios where baseline query returns multiple hits).
2. **F2**: `category` filter on `sequences` remains ignored/no-op in the production runtime under test; remediation deployment state still needs explicit verification.

These findings should be treated as release blockers for "all search features working properly".

### Current execution state (2026-03-15)

- Fresh versioned ingest completed successfully: `v2026-03-15-134856`.
- Post-ingest readbacks are healthy (`validate-aliases`, `meta get`, `count`).
- Live `oak_meta` mapping contract check passed (`ensureIndexMetaMappingContract`).
- `F1`/`F2` production retests were re-run and both findings still reproduce.

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
- Status: open_confirmed_post_reingest
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

### Post-ingest production retest evidence (2026-03-15)

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
- Status: open_confirmed_post_reingest
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
- **Code fix required: wire `buildCategoryMap()` into the ingestion pipeline,
  then re-ingest.**

### Post-ingest production retest evidence (2026-03-15)

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

Disposition: finding remains open. Production behaviour is still ineffective for invalid category values; first confirm remediated query path is live, then continue mapping/identity remediation if behaviour remains unchanged.

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

1. For `F1`, sample `thread_slugs` directly from baseline lesson hits (live
   documents), then verify filter application against those exact values at the
   query-builder and indexed-document levels.
2. For `F2`, first prove the remediated request path is deployed in
   `oak-prod` (build/request evidence), then move to explicit category identity
   semantics (keyword/slug-backed field) and reject ambiguous analysed-text
   matching.
3. Re-run the production validation matrix for `F1` and `F2` after remediation,
   appending before/after evidence and final disposition here.
4. Keep this file linked from prompt + recovery-plan closeout until `F1` and
   `F2` are either closed with evidence or explicitly owner-triaged.
5. Do not close `F1` or `F2` on code-only evidence; closure requires production
   retest evidence in this register or explicit owner triage rationale.

---

## Operator Note

Blue/green ingest and alias promotion are healthy and complete for this run. These findings are search-filter correctness issues, not deployment lifecycle failures.
