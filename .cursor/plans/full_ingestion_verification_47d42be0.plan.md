---
name: Full Ingestion Verification
overview: Verify the two-tier ELSER retry system achieves 100% ingestion success by running a full reset, validating the reset, executing bulk ingestion with verbose logging, and verifying expected document counts.
todos:
  - id: reset-es
    content: Reset Elasticsearch with pnpm es:setup --reset
    status: completed
  - id: validate-reset
    content: Validate reset cleared all indices (all must show 0 docs)
    status: completed
    dependencies:
      - reset-es
  - id: run-ingestion
    content: Run full bulk ingestion with verbose logging
    status: completed
    dependencies:
      - validate-reset
  - id: verify-results
    content: Verify document counts match expected values (~12,320 lessons)
    status: completed
    dependencies:
      - run-ingestion
  - id: update-docs
    content: Update current-state.md and roadmap.md with verified results
    status: completed
    dependencies:
      - verify-results
---

# Full Ingestion Verification Plan

## Goal

Verify that the two-tier retry system (ADR-096) achieves **0% document failures** during bulk ingestion, enabling teachers and students to search **all ~12,320 lessons**.

## Prerequisites

- [x] Environment ready with ES credentials in `.env.local`
- [x] ELSER model deployed
- [x] Bulk data fresh (downloaded 2025-12-30)
- [x] Two-tier retry implementation complete (817 tests passing)

## Execution Steps

### Step 1: Reset Elasticsearch

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
```

**Expected**: All indices cleared, mappings recreated.

### Step 2: Validate Reset (Critical Gate)

```bash
pnpm es:status
```

**Acceptance Criteria** — ALL indices must show exactly 0 documents:| Index | Expected ||-------|----------|| `oak_lessons` | 0 || `oak_units` | 0 || `oak_unit_rollup` | 0 || `oak_threads` | 0 || `oak_sequences` | 0 || `oak_sequence_facets` | 0 || `oak_meta` | 0 |**If any index shows non-zero counts**: STOP — investigate reset failure before proceeding.

### Step 3: Run Full Ingestion

```bash
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --verbose
```

**Monitor for**:

- Tier 1 HTTP retries (transport errors)
- Tier 2 document retries (429 ELSER queue overflow)
- Progressive chunk delay increases
- Final success/failure counts

### Step 4: Verify Results

```bash
pnpm es:status
```

**Acceptance Criteria** — expected counts (within ~5%):| Index | Expected | Has semantic_text ||-------|----------|-------------------|| `oak_lessons` | ~12,320 | Yes || `oak_units` | ~1,665 | No || `oak_unit_rollup` | ~1,665 | Yes || `oak_threads` | ~164 | No || `oak_sequences` | 0 | (Known gap) || `oak_sequence_facets` | 0 | (Known gap) |

### Step 5: Analyse Results

**If 100% success**:

- Document the run metrics
- Update [current-state.md](/.agent/plans/semantic-search/current-state.md) with verified counts

**If any failures**:

1. Check `./bulk-downloads/failed-documents-*.json` for failed document IDs
2. Analyse failure patterns (are they 429s that should have been retried?)
3. Consider increasing `--max-retries` or `--retry-delay`
4. If persistent failures indicate a systemic issue, escalate for architectural review

## Known Gap: Sequences Index

**Finding**: The bulk download files contain sequence data (`sequenceSlug`, `sequence` array), but the bulk-first ingestion path ([bulk-ingestion.ts](/apps/oak-open-curriculum-semantic-search/src/lib/indexing/bulk-ingestion.ts)) does not call `buildSequenceOps` or `buildSequenceFacetOps`.**Impact**: `oak_sequences` and `oak_sequence_facets` will remain at 0 documents. This does not affect lesson/unit search but limits sequence discovery features.**Follow-up**: Wire sequence document building into bulk-first pipeline. The builders already exist in [sequence-bulk-helpers.ts](/apps/oak-open-curriculum-semantic-search/src/lib/indexing/sequence-bulk-helpers.ts).

## Foundation Documents (Re-read Before Each Step)

- [rules.md](/.agent/directives-and-memory/rules.md) — First Question, TDD, quality gates
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) — TDD at all levels
- [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md) — Generator is source of truth

## Documentation Updates (Post-Verification)

If successful, update: