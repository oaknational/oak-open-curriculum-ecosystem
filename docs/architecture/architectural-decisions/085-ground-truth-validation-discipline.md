# ADR-085: Ground Truth Validation Discipline

**Status**: ACCEPTED  
**Date**: 2025-12-24  
**Decision Makers**: Development Team  
**Related**: [ADR-082](082-fundamentals-first-search-strategy.md), [ADR-081](081-search-approach-evaluation-framework.md)

## Context

On 2025-12-23, a comprehensive audit of the semantic search ground truth data revealed **63 missing slugs** (15% of ground truth data) — lesson references that don't exist in the Oak Curriculum API. This caused false negatives in MRR calculations, making search quality appear worse than it actually was.

### Impact of Invalid Ground Truth

| Metric                 | Measured (Invalid GT) | Measured (Corrected GT) | Error |
| ---------------------- | --------------------- | ----------------------- | ----- |
| Lesson Hard MRR        | 0.369                 | **0.614**               | +66%  |
| Synonym category       | 0.167                 | **0.611**               | +266% |
| Multi-concept category | 0.083                 | **0.625**               | +653% |

The corrupted data led to:

1. **Incorrect experiment decisions** — Semantic reranking was rejected (-16.8% regression) based on invalid measurements
2. **Wasted optimisation effort** — Attempting to fix "failures" that were actually invalid test cases
3. **Incorrect tier status** — Tier 1 appeared incomplete when it was actually exceeded

### Root Cause

The ground truth was created using:

1. **Assumed slug naming** — Slugs guessed from lesson titles without API verification
2. **Outdated curriculum data** — Some lessons were renamed or removed
3. **Inconsistent verification** — Some slugs verified, others assumed

## Problem Statement

How do we ensure ground truth data is valid and prevent future experiments from being corrupted by invalid test data?

## Decision

**All ground truth data MUST be validated against the live Oak Curriculum API before use, with a dedicated validation script preventing invalid slugs from entering the codebase.**

### 1. Mandatory Validation Script

Every ground truth file must be covered by `evaluation/validation/validate-ground-truth.ts`:

```bash
# Run from apps/oak-open-curriculum-semantic-search/
pnpm tsx evaluation/validation/validate-ground-truth.ts
```

The validation script:

- Loads environment variables from `.env` and `.env.local` directly
- **Fails fast** if `OAK_API_KEY` is missing (no silent skipping)
- Uses Zod schemas for proper type discipline when validating API responses
- Validates lessons, units, and sequences against the live Oak API

### 2. Ground Truth Creation Process

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GROUND TRUTH CREATION PROCESS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 1: IDENTIFY QUERY SCENARIOS                                            │
│  ────────────────────────────────                                            │
│  • Define query text and category (synonym, misspelling, etc.)               │
│  • Document expected user intent                                             │
│                                                                              │
│  STEP 2: SEARCH LIVE API FOR CANDIDATE SLUGS                                 │
│  ───────────────────────────────────────────                                 │
│  • NEVER guess slugs based on expected naming conventions                    │
│  • Use Oak Curriculum API or bulk download to find actual slugs              │
│  • Verify each slug exists: GET /api/v1/lessons/{slug}                       │
│                                                                              │
│  STEP 3: ASSIGN RELEVANCE SCORES                                             │
│  ───────────────────────────────                                             │
│  • Score 3 (highly relevant): Perfect match for query intent                 │
│  • Score 2 (relevant): Good match, acceptable result                         │
│  • Score 1 (marginally relevant): Acceptable but not ideal                   │
│                                                                              │
│  STEP 4: ADD TO GROUND TRUTH FILE                                            │
│  ───────────────────────────────                                             │
│  • Add query to appropriate file (hard-queries.ts, etc.)                     │
│  • Include category, priority, and description                               │
│                                                                              │
│  STEP 5: RUN VALIDATION SCRIPT                                               │
│  ──────────────────────────────                                              │
│  • pnpm tsx evaluation/validation/validate-ground-truth.ts                   │
│  • Script MUST pass before merge                                             │
│  • CI rejects PRs with invalid slugs                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3. Validation Requirements

| Requirement                  | Implementation           | Enforcement             |
| ---------------------------- | ------------------------ | ----------------------- |
| All slugs exist in API       | Validation script        | CI blocks invalid slugs |
| No duplicate queries         | TypeScript type checking | Compile-time            |
| Valid relevance scores (1-3) | Zod schema               | Runtime validation      |
| Category and priority set    | TypeScript types         | Compile-time            |

### 4. When to Re-Validate

Ground truth must be re-validated when:

1. **Curriculum changes** — Oak updates lesson content or naming
2. **Index rebuilds** — After re-ingestion from upstream API
3. **Before major experiments** — Any experiment that will inform architectural decisions
4. **Quarterly audit** — Proactive check for curriculum drift

### 5. Audit Capability

The `evaluation/audit/audit-ground-truth.ts` script provides:

- Full semantic audit (slug existence AND content relevance)
- Detailed reports identifying invalid or outdated slugs
- Suggestions for corrections based on API search

## Rationale

### Why Automated Validation?

1. **Human error is inevitable** — 63 slugs were invalid despite careful review
2. **Curriculum changes** — Oak updates lesson content regularly
3. **Experiment integrity** — Invalid ground truth corrupts all downstream decisions
4. **Cost of errors** — The semantic reranking rejection may have been wrong

### Why a Validation Script (Not a Test)?

Ground truth validation requires network access to the Oak API:

- Unit tests cannot verify slug existence
- Mocking would defeat the purpose (testing against fake data)
- Using `it.skipIf` for missing API keys led to silent failures (see "No Skipped Tests" rule)

A dedicated validation script:

- Loads `.env` directly (tests don't load environment variables)
- **Fails fast** with helpful error messages if `OAK_API_KEY` is missing
- Never silently skips — if it runs, it validates everything
- Takes ~10-30 seconds (acceptable for validation)

## Consequences

### Positive

1. **Experiment integrity** — All future MRR measurements will be valid
2. **Early detection** — Invalid slugs caught before experiments run
3. **Curriculum tracking** — Forced awareness of upstream changes
4. **Confidence in decisions** — Tier advancement and AI decisions based on real data

### Negative

1. **CI dependency on Oak API** — Requires API key in CI environment
2. **Slower validation** — Validation script takes longer than unit tests
3. **Maintenance burden** — Must update ground truth when curriculum changes

### Mitigations

- API key securely stored in CI secrets
- Validation script run only on PR merge, not every commit
- Quarterly audit schedule prevents drift accumulation

## Implementation

### Files Created

| File                                             | Purpose                                        |
| ------------------------------------------------ | ---------------------------------------------- |
| `evaluation/validation/validate-ground-truth.ts` | Validates all slugs exist                      |
| `evaluation/validation/lib/`                     | Validation helpers (Zod schemas, API checkers) |
| `evaluation/audit/audit-ground-truth.ts`         | Full semantic audit script                     |
| `ground-truth-corrections.md`                    | Documents the 63 corrections                   |

### Files Updated

| File                                  | Changes            |
| ------------------------------------- | ------------------ |
| `hard-queries.ts`                     | 15 slugs corrected |
| `diagnostic-synonym-queries.ts`       | 9 slugs corrected  |
| `diagnostic-multi-concept-queries.ts` | 9 slugs corrected  |

### CI Configuration

```yaml
# In CI workflow (example)
- name: Validate Ground Truth
  env:
    OAK_API_KEY: ${{ secrets.OAK_API_KEY }}
  working-directory: apps/oak-open-curriculum-semantic-search
  run: pnpm tsx evaluation/validation/validate-ground-truth.ts
```

## Historical Context

### The 63-Slug Incident (2025-12-23)

| Category      | Queries Affected | Invalid Slugs |
| ------------- | ---------------- | ------------- |
| synonym       | 9                | 29            |
| multi-concept | 9                | 24            |
| naturalistic  | 3                | 3             |
| colloquial    | 2                | 2             |
| intent-based  | 1                | 3             |
| misspelling   | 2                | 2             |

Common patterns of invalid slugs:

1. **Fabricated** — `finding-the-gradient-of-a-line` (never existed)
2. **Wrong naming convention** — `solving-simultaneous-equations-graphically` (missing "linear")
3. **Outdated** — Lessons that were renamed or restructured

### Lessons Learned

1. **Never assume slug naming** — Always verify against live API
2. **Ground truth is critical infrastructure** — Treat it with same rigour as production code
3. **Invalid data corrupts decisions** — One experiment rejection may have been wrong
4. **Automated validation is essential** — Human review is insufficient

## Related Documents

- [ADR-082: Fundamentals-First Search Strategy](082-fundamentals-first-search-strategy.md) — Strategy this validates
- [ADR-081: Search Approach Evaluation Framework](081-search-approach-evaluation-framework.md) — Metrics framework
- [ground-truth-corrections.md](../../.agent/evaluations/ground-truth-corrections.md) — Full correction details
- [EXPERIMENT-LOG.md](../../.agent/evaluations/EXPERIMENT-LOG.md) — Experiment history

## References

- Oak Curriculum API documentation
- [Elasticsearch Search Relevance Testing](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-testing.html)
