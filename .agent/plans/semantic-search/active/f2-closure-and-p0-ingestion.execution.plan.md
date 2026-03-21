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
    status: done
  - id: f2-type-violation-fix
    content: "Fix blocking unknown type violation: tighten GetSequenceUnitsFn to generated SDK type, remove Array.isArray coercion."
    status: done
  - id: prepare-reingest-command
    content: "Prepare re-ingest operator command with pre-checks and expected output."
    status: done
  - id: operator-reingest
    content: "Operator executes admin stage, agent validates output."
    status: pending
  - id: validate-staged-indexes
    content: "Validate staged indexes from stage output plus field-readback-audit --target-version (Task 2.3 evidence)."
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
  - id: post-p0-search-contract-followup
    content: "After P0 closure: lessons threadSlug field-integrity test + optional prod smoke doc (see ../current/search-contract-followup.plan.md)."
    status: pending
  - id: post-p0-sequence-retrieval-architecture
    content: "After P0 closure: resolve the strict sequence semantic contract via ../current/sequence-retrieval-architecture-followup.plan.md — `sequence_semantic` stays, must be populated for every sequence by iterating ordered unit sub-content, and must fail fast on missing/empty semantic output."
    status: pending
---

# F2 Closure and P0 Ingestion

**Status**: 🟡 IN PROGRESS (Phase 1 ✅ — Phase 2: Task 2.1 ✅, operator stage next)
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
- Post-P0 contract + smoke (queued — does not block re-ingest):
  [search-contract-followup.plan.md](../current/search-contract-followup.plan.md)
- Post-P0 sequence retrieval architecture follow-up (queued — does not block re-ingest):
  [sequence-retrieval-architecture-followup.plan.md](../current/sequence-retrieval-architecture-followup.plan.md)

---

## Phase 1: F2 Code Follow-ups — ✅ COMPLETE (2026-03-21)

All code follow-ups done. 1038 tests, full-suite gates green, six specialist
reviewer passes. Phase 1 readiness gate **CLOSED**.

| Task | Summary | Commit |
|---|---|---|
| 1.1 | Shared `createMockClient` helper, test split | `dfb48b90` |
| 1.2 | `fetchCategoryMapForSequences` → `Result<CategoryMap, Error>` | (same session) |
| 1.2b | `GetSequenceUnitsFn` → `Result<SequenceUnitsResponse, SdkFetchError>`, hand-rolled types replaced with schema-derived | `3ec1dbc6` |

Phase 1 gate evidence: sdk-codegen ✅, build 17/17 ✅, type-check 28/28 ✅,
doc-gen ✅, lint 0 errors ✅, format ✅, markdownlint ✅, test 1038/1038 ✅,
test:e2e (search-cli 15/15, streamable-http 176/176) ✅, test:ui 20/20 ✅,
smoke:dev:stub ✅.

---

## Phase 2: Re-Ingest (Operator)

### Task 2.1: Prepare re-ingest command — ✅ DONE (2026-03-21)

Operator runbook prepared. All commands run from **repo root**. The CLI
entry point is `bin/oaksearch.ts` (not `src/bin/`).

#### Step 1 — Pre-checks (read-only, safe)

Run these first to capture baseline state before staging:

```bash
# Verify current alias health — all 6 aliases should resolve
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin validate-aliases

# True parent doc counts (excludes ELSER chunk inflation)
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin count
```

**Expected baseline**: Counts should show the existing (stale) index data.
If `validate-aliases` reports missing or broken aliases, investigate before
proceeding — staging will create new indexes but promotion swaps aliases.

**Interpreting results**: `validate-aliases` only proves **structural** health
(alias → physical index). It does **not** prove that document counts match the
current `bulk-downloads/` snapshot. Compare the version embedded in each
`targetIndex` (e.g. `*_v2026-03-15-…`) to `bulk-downloads/manifest.json`
`downloadedAt` when explaining gaps between `admin count` and the expected
**post-stage** table below. Permanent documentation:
[`apps/oak-search-cli/docs/INDEXING.md`](../../../../apps/oak-search-cli/docs/INDEXING.md)
(*Operational CLI: `validate-aliases` vs `admin count`*).

#### Step 2 — Stage (creates new versioned indexes, does NOT promote)

```bash
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin stage \
  --bulk-dir ./bulk-downloads -v
```

This reads all 33 bulk JSON files from `apps/oak-search-cli/bulk-downloads/`
(including `manifest.json`) and populates 6 new versioned indexes. The `-v`
flag enables verbose progress logging.

**Expected stage output** — 6 versioned indexes, true parent counts:

| Index kind | Expected count |
|---|---|
| lessons | ~12,746 |
| units | ~1,671 |
| rollups | ~1,671 |
| threads | ~164 |
| sequences | ~30 |
| facets | ~57 |
| **TOTAL** | **~16,339** |

The stage command will print the version string (e.g. `v2026-03-21-143022`)
needed for promotion in Task 2.3.

**If stage fails**: The staged indexes are disposable. Diagnose the error,
fix if needed, and re-run `admin stage` — it replaces any previous staged
indexes for the same version.

#### Step 3 — Record stage output

Save the version string and per-index counts from stage output. These are
needed for Task 2.2 validation and Task 2.3 promotion.

### Task 2.2: Validate staged indexes

Do **not** use `admin count` here; it only reads the live aliases and cannot
prove a newly staged version.

Use the version string recorded from `admin stage` as the staged count authority,
then run field-readback-audit against that concrete version:

```bash
pnpm tsx apps/oak-search-cli/operations/ingestion/field-readback-audit.ts \
  --ledger .agent/plans/semantic-search/archive/completed/field-gap-ledger.json \
  --attempts 6 --interval-ms 5000 \
  --target-version <version> \
  --emit-json
```

**Done when**: The stage output counts match the expected staged totals; the
readback audit against `<version>` shows `thread_slugs` and `category_titles`
populated (non-zero exists counts); no validation evidence depends on live alias
counts before promotion.

**If validation fails**: Do NOT promote. Investigate the staging output for
errors, check field-readback-audit results, and identify whether the issue is
data-level (re-stage with corrected bulk data) or code-level (fix code, re-run
Phase 1 gates, then re-stage). The staged indexes are disposable — a fresh
`admin stage` replaces them.

### Task 2.3: Promote and verify

```bash
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin promote --target-version <version>
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts admin validate-aliases
pnpm tsx apps/oak-search-cli/bin/oaksearch.ts search lessons "photosynthesis"
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

### Task 3.3: Post-P0 — contract test symmetry and optional prod smoke (deferred)

Not blocking Phase 2–3 or operator promote. After findings are closed, execute
[search-contract-followup.plan.md](../current/search-contract-followup.plan.md):

- **Lessons field-integrity**: add a `threadSlug` ↔ `thread_slugs` ↔
  `SEARCH_FIELD_INVENTORY` test mirroring the existing sequence `category`
  field-integrity test (`search-field-integrity.integration.test.ts`).
- **Optional prod smoke**: document a repeatable prod query matrix (MCP JSON or
  CLI path) and an **optional** package script; keep it **out of** default CI
  (`pnpm test` / required GitHub jobs).

### Task 3.4: Post-P0 — sequence retrieval architecture consistency (deferred)

Not blocking Phase 2–3 or operator promote. After findings are closed, execute
[sequence-retrieval-architecture-followup.plan.md](../current/sequence-retrieval-architecture-followup.plan.md):

- resolve the strict contract drift by populating `sequence_semantic` for every
  sequence in the same change
- construct it deterministically by iterating the units in sequence order and
  concatenating/normalising their summaries into a non-empty semantic surface
- fail fast on missing or empty required semantic source content; no dormant or
  best-effort field
- keep SDK retrieval helpers as the canonical owner of sequence retrieval
  semantics and collapse duplicate CLI/SDK logic accordingly

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
