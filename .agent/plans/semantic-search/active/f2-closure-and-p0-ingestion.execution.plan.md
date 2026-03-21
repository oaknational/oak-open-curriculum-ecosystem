---
name: "F2 Closure and P0 Ingestion"
overview: >
  Complete F2 follow-up items, execute the versioned re-ingest, verify
  F1/F2 findings with production evidence, and close the semantic search
  P0 lane.
todos:
  - id: f2-shared-mock-helper
    content: "Extract shared createMockClient test helper (DRY debt across 4+ files)."
    status: done
  - id: f2-result-migration
    content: "Migrate fetchCategoryMapForSequences to return Result<CategoryMap, Error> (ADR-088)."
    status: pending
  - id: prepare-reingest-command
    content: "Prepare re-ingest operator command with pre-checks and expected output."
    status: pending
  - id: operator-reingest
    content: "Operator executes admin stage, agent validates output."
    status: pending
  - id: validate-staged-indexes
    content: "Validate staged indexes: admin count, field-readback-audit (Task 2.3 evidence)."
    status: pending
  - id: promote-and-verify
    content: "Promote versioned indexes, verify aliases, run search smoke tests."
    status: pending
  - id: production-retest-f1-f2
    content: "Production retest F1 (threadSlug) and F2 (category) with before/after evidence."
    status: pending
  - id: close-findings-and-archive
    content: "Close findings register, archive this plan, update all authority docs."
    status: pending
---

# F2 Closure and P0 Ingestion

**Status**: 📋 PENDING
**Scope**: Complete F2 code follow-ups, execute versioned re-ingest (P0 Phase 3),
verify F1/F2 with production evidence, close the semantic search P0 lane.
**Branch**: `feat/es_index_update`

## Context

The semantic search pipeline is proven correct by 1038 tests and 35
field-integrity integration tests. Two production findings (F1: `threadSlug`,
F2: `category`) have root causes identified and code fixes complete. Both
require a re-ingest to populate the correct data in production indexes.

This plan consolidates the remaining work from three sources:

- F2 follow-up items identified by code-reviewer (2026-03-21)
- Unified versioned ingestion Phase 3 (stage/validate/promote/verify)
- Field-integrity plan Phase 3 items 5–6 (operator evidence, F1/F2 closure)

### Prerequisites (all met)

- Error response classification: ✅ (commit `f86b841a`)
- Codegen schema adaptation: ✅ (commit `2ea997d6`)
- F2 categoryMap wiring + architecture findings: ✅ (commit `2c6e6b51`)
- Five specialist reviewer passes: ✅ (2026-03-21)
- ES mapping: `unit_topics.keyword` sub-field added: ✅ (commit `2c6e6b51`)
- All quality gates green, 1038 tests passing

### Supporting documents

- Findings register:
  [search-tool-prod-validation-findings-2026-03-15.md](./search-tool-prod-validation-findings-2026-03-15.md)
- Versioned ingestion reference (Phases 0–2 complete, Phase 3 operational):
  [unified-versioned-ingestion.plan.md](../current/unified-versioned-ingestion.plan.md)
- Field-integrity tests (archived, complete):
  [comprehensive-field-integrity-integration-tests.execution.plan.md](../archive/completed/comprehensive-field-integrity-integration-tests.execution.plan.md)

---

## Phase 1: F2 Code Follow-ups

### Task 1.1: Extract shared `createMockClient` test helper

The full `OakClient` mock factory is duplicated across 4+ test files. Extract
to a shared test helper and update all consumers.

Files to consolidate:

- `apps/oak-search-cli/src/lib/indexing/bulk-ingestion.integration.test.ts`
- `apps/oak-search-cli/src/lib/indexing/category-wiring.integration.test.ts`
- `apps/oak-search-cli/src/adapters/hybrid-data-source.integration.test.ts`
- `apps/oak-search-cli/src/adapters/api-supplementation.unit.test.ts`
- Any others found during extraction

**Why**: DRY violation; when `OakClient` gains new methods, all copies must be
updated independently. Pre-existing debt now load-bearing after F2 changes.

**Done when**: Single shared helper, all consumers updated, full gates pass.

### Task 1.2: Migrate `fetchCategoryMapForSequences` to Result

Change return type from `Promise<CategoryMap>` (throws on failure) to
`Promise<Result<CategoryMap, Error>>` per ADR-088.

- Update `CategoryFetchDeps` and `BulkIngestionDeps` types
  (`BulkIngestionDeps` uses `typeof fetchCategoryMapForSequences`, so the type
  updates automatically when the function signature changes)
- Update call site in `prepareBulkIngestion` to unwrap the Result
  (unwrap at the orchestrator level, not the CLI entry point — `prepareBulkIngestion`
  is the natural error boundary for ingestion operations)
- Update tests: `fetch-category-map.integration.test.ts` `rejects.toThrow` becomes
  `resolves` with `Result.err` check (Red phase anchor);
  `bulk-ingestion.integration.test.ts` mock must return `ok(fakeCategoryMap)`
- Run full gates + code-reviewer pass + test-reviewer + type-reviewer

**Why**: ADR-088 violation at public function boundary. Calling code cannot
handle partial failure programmatically.

**Done when**: No `@throws` on public function boundary, Result unwrapped at
`prepareBulkIngestion` orchestrator level, all tests pass.

---

## Phase 2: Re-Ingest (Operator)

### Task 2.1: Prepare re-ingest command

Document the exact command, pre-checks, and expected output for the operator.

Pre-checks:

```bash
pnpm tsx apps/oak-search-cli/src/bin/oaksearch.ts admin validate-aliases
pnpm tsx apps/oak-search-cli/src/bin/oaksearch.ts admin count
```

Stage command:

```bash
cd apps/oak-search-cli
pnpm tsx src/bin/oaksearch.ts admin stage --bulk-dir ./bulk-downloads -v
```

Expected: 6 versioned indexes created and populated. True parent counts:
~12,746 lessons, ~1,671 units, ~1,671 rollups, ~164 threads, ~30 sequences,
~57 facets.

### Task 2.2: Validate staged indexes

```bash
pnpm tsx apps/oak-search-cli/src/bin/oaksearch.ts admin count
```

Then run field-readback-audit for Task 2.3 evidence:

```bash
pnpm tsx apps/oak-search-cli/operations/ingestion/field-readback-audit.ts \
  --ledger .agent/plans/semantic-search/archive/completed/field-gap-ledger.json \
  --attempts 6 --interval-ms 5000 --emit-json
```

**Done when**: All 6 indexes show expected counts; `thread_slugs` and
`category_titles` are populated (non-zero exists counts).

**If validation fails**: Do NOT promote. Investigate the staging output for
errors, check field-readback-audit results, and identify whether the issue is
data-level (re-stage with corrected bulk data) or code-level (fix code, re-run
Phase 1 gates, then re-stage). The staged indexes are disposable — a fresh
`admin stage` replaces them.

### Task 2.3: Promote and verify

```bash
pnpm tsx apps/oak-search-cli/src/bin/oaksearch.ts admin promote --target-version <version>
pnpm tsx apps/oak-search-cli/src/bin/oaksearch.ts admin validate-aliases
pnpm tsx apps/oak-search-cli/src/bin/oaksearch.ts search lessons "photosynthesis"
```

**Done when**: All aliases healthy, search returns current results.

---

## Phase 3: Production Verification and Closure

### Task 3.1: Production retest F1 and F2

Re-run the exact reproduction queries from the findings register against
production and record before/after evidence:

**F1 (threadSlug)**:

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

**Expected**: `total > 0` (was `0` before re-ingest).

**F2 (category)**:

```json
{
  "scope": "sequences",
  "query": "maths",
  "category": "nonexistentzzz",
  "size": 10
}
```

**Expected**: `total = 0` (was `2` before, category filter was no-op).

### Task 3.2: Close findings and archive

1. Update findings register with production retest evidence and final
   dispositions (closed with evidence).
2. Update session prompt — mark P0 lane as complete.
3. Update `current/README.md` — mark P0 complete.
4. Archive this plan to `archive/completed/`.
5. Update `active/README.md` — clear active items.

---

## Quality Gates

After each code change (Phase 1):

```bash
pnpm type-check
pnpm lint:fix
pnpm test
```

After Phase 1 completion (full suite):

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

## Reviewer Gates

After Phase 1 code changes:

- `code-reviewer` (gateway)
- `test-reviewer` (mock extraction, Result migration tests)
- `architecture-reviewer-barney` (if boundary implications)
