# ADR-085: Ground Truth Validation Discipline

**Status**: ACCEPTED  
**Date**: 2025-12-24 (Updated: 2026-01-09)  
**Decision Makers**: Development Team  
**Related**: [ADR-082](082-fundamentals-first-search-strategy.md), [ADR-081](081-search-approach-evaluation-framework.md), [ADR-098](098-ground-truth-registry.md)

## Critical Understanding: Three-Stage Validation

Ground truths require **three distinct validation stages**:

| Stage                                 | What It Proves       | What It Does NOT Prove |
| ------------------------------------- | -------------------- | ---------------------- |
| **1. Type-Check**                     | Data integrity       | Semantic correctness   |
| **2. Runtime Validation (16 checks)** | Semantic rules       | Production readiness   |
| **3. Qualitative (manual review)**    | Production readiness | —                      |

### Stage 1: Type-Check (TypeScript Enforced)

The `GroundTruthQuery` type enforces required fields at compile time:

- `category` — REQUIRED
- `priority` — REQUIRED
- `description` — REQUIRED

Missing fields cause `pnpm type-check` to fail. This is **data integrity enforcement**.

### Stage 2: Runtime Validation (16 checks)

Semantic rules that TypeScript cannot enforce (slug existence, category coverage, etc.).

**Passing type-check AND runtime validation means ground truths meet a MINIMUM QUALITY THRESHOLD.** This makes them _worthy of investment in manual review_. It does **NOT** mean they are production-ready.

**Ground truths are NOT production-ready until ALL THREE stages are complete.**

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

**All ground truth data MUST be validated through a two-stage process: programmatic bulk data validation followed by structured agent review.**

### 1. Type Generation and Programmatic Validation

Ground truth validation uses generated types from bulk data:

```bash
# Run from apps/oak-open-curriculum-semantic-search/

# Generate types from bulk data (after bulk:download)
pnpm ground-truth:generate

# Run 17 validation checks (all must pass)
pnpm ground-truth:validate
```

**Type generation** (`ground-truths/generation/`):

- `bulk-data-parser.ts` — Parse bulk JSON with Result pattern
- `type-emitter.ts` — Generate branded `AnyLessonSlug` type + `SLUG_TO_SUBJECT_MAP`
- `schema-emitter.ts` — Generate Zod schemas for runtime validation

**TypeScript-enforced fields** (Stage 1):

| Field         | Requirement                            |
| ------------- | -------------------------------------- |
| `category`    | REQUIRED — TypeScript error if missing |
| `priority`    | REQUIRED — TypeScript error if missing |
| `description` | REQUIRED — TypeScript error if missing |

**Runtime validation checks** (Stage 2, 16 total, all blocking):

| #   | Check                | Error Category               | Description                                                   |
| --- | -------------------- | ---------------------------- | ------------------------------------------------------------- |
| 1   | Slug existence       | `invalid-slug`               | All slugs must exist in the 12,320 valid slugs from bulk data |
| 2   | Non-empty relevance  | `empty-relevance`            | expectedRelevance must have at least one slug                 |
| 3   | Valid scores         | `invalid-score`              | Relevance scores must be 1, 2, or 3                           |
| 4   | No duplicate queries | `duplicate-query`            | Each query must be unique within an entry                     |
| 5   | No duplicate slugs   | `duplicate-slug-in-query`    | No repeated slugs within a single query                       |
| 6   | Query length         | `short-query` / `long-query` | 3-10 words (single words only for imprecise-input)            |
| 7   | Slug format          | `slug-format`                | Slugs must be lowercase with hyphens                          |
| 8   | Cross-subject        | `cross-subject`              | Slugs must belong to the entry's subject                      |
| 9   | Phase consistency    | `phase-mismatch`             | keyStage must match primary/secondary phase                   |
| 10  | KS4 consistency      | `ks4-in-primary`             | KS4 queries cannot be in primary entries                      |
| 11  | Minimum slugs        | `single-slug`                | At least 2 expected results for ranking tests                 |
| 12  | Score variety        | `uniform-scores`             | 2+ slug queries must have varied scores                       |
| 13  | Highly relevant      | `no-highly-relevant`         | At least one slug must have score=3                           |
| 14  | Maximum slugs        | `too-many-slugs`             | Maximum 5 expected results (more = query too broad)           |
| 15  | Zod schema           | `schema-validation`          | Must pass Zod schema validation                               |
| 16  | Category coverage    | `category-coverage`          | Entry must have minimum queries per required category         |

**The script**:

- Validates all slugs against generated `ALL_LESSON_SLUGS` Set
- Checks cross-subject contamination via `SLUG_TO_SUBJECT_MAP`
- Fails fast with specific error messages
- Returns non-zero exit code on any validation failure
- **Must pass before any benchmark run or merge**

### 2. Ground Truth Creation Process

See `GROUND-TRUTH-PROCESS.md` for the complete step-by-step process. Summary:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GROUND TRUTH CREATION PROCESS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 1-4: QUERY DESIGN                                                      │
│  ──────────────────────                                                      │
│  • Identify subject/phase                                                    │
│  • Download bulk data                                                        │
│  • Explore available lessons                                                 │
│  • Create realistic query                                                    │
│                                                                              │
│  STEP 5-9: ENTRY CREATION                                                    │
│  ────────────────────────                                                    │
│  • Choose query category (precise-topic, natural-expression, etc.)           │
│  • Assign relevance scores (3/2/1)                                           │
│  • Write entry with all recommended fields                                   │
│  • Add to index and registry                                                 │
│                                                                              │
│  STEP 10: PROGRAMMATIC VALIDATION                                            │
│  ─────────────────────────────────                                           │
│  • pnpm ground-truth:validate                                                │
│  • Script MUST pass before proceeding                                        │
│                                                                              │
│  STEP 11: AGENT REVIEW (STRUCTURED)                                          │
│  ───────────────────────────────────                                         │
│  • Query realism check                                                       │
│  • Relevance score verification via MCP                                      │
│  • Completeness check for missed lessons                                     │
│  • Category and priority validation                                          │
│  • Sign-off with documentation                                               │
│                                                                              │
│  STEP 12-13: BENCHMARK AND COMMIT                                            │
│  ────────────────────────────────                                            │
│  • Run benchmark to measure metrics                                          │
│  • Update baselines.json                                                     │
│  • Commit changes                                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3. Agent Review Checklist

After programmatic validation passes, the agent MUST verify each query:

| Check              | Description                    | Method                        |
| ------------------ | ------------------------------ | ----------------------------- |
| Query realism      | Would a teacher type this?     | Human judgment                |
| Relevance accuracy | Do scores match content?       | `get-lessons-summary` via MCP |
| Completeness       | Any missed relevant lessons?   | Search bulk data              |
| Category accuracy  | Is the category correct?       | Compare to definitions        |
| Priority accuracy  | Is importance rated correctly? | Compare to usage patterns     |

### 4. Validation Requirements

All checks are **blocking errors** — validation fails if any check fails.

| Requirement                  | Implementation         | Enforcement        |
| ---------------------------- | ---------------------- | ------------------ |
| All slugs exist in bulk data | `ALL_LESSON_SLUGS` Set | Runtime validation |
| Cross-subject contamination  | `SLUG_TO_SUBJECT_MAP`  | Runtime validation |
| No duplicate queries         | Validation script      | Runtime validation |
| Valid relevance scores (1-3) | Zod schema             | Runtime validation |
| Non-empty expectedRelevance  | Validation script      | Runtime validation |
| Query length (3-10 words)    | Validation script      | Runtime validation |
| Category required            | Validation script      | Runtime validation |
| **Priority required**        | Validation script      | Runtime validation |
| **Score variety (2+ slugs)** | Validation script      | Runtime validation |
| At least one score=3         | Validation script      | Runtime validation |
| At least 2 expected results  | Validation script      | Runtime validation |

### 5. When to Re-Validate

Ground truth must be re-validated when:

1. **Bulk data updated** — After downloading fresh bulk data
2. **Index rebuilds** — After re-ingestion from upstream API
3. **Before major experiments** — Any experiment informing architectural decisions
4. **Quarterly audit** — Proactive check for curriculum drift

### 6. Ground Truth Design Rules

These rules ensure ground truths test **ranking quality**, not just topic presence.

#### Query Design

| Rule        | Requirement                       | Rationale                                                |
| ----------- | --------------------------------- | -------------------------------------------------------- |
| Length      | 3-7 words                         | Short enough to be realistic, long enough to be specific |
| Specificity | Only 2-4 lessons highly relevant  | Tests ranking, not topic matching                        |
| Realism     | Would a teacher type this?        | Ground truths must reflect real usage                    |
| Single-word | Only for imprecise-input category | Single words are too ambiguous for ranking tests         |

#### Expected Results

| Rule             | Requirement            | Rationale                                        |
| ---------------- | ---------------------- | ------------------------------------------------ |
| Maximum slugs    | 5 per query            | More indicates query is too broad                |
| Score=3 required | At least one           | Ensures we're testing for a clear "right answer" |
| Graded relevance | Mix of 3s, 2s, and 1s  | Tests ranking quality, not just presence         |
| Verified slugs   | Each against bulk data | Prevents invalid ground truth                    |

#### Anti-Patterns to Avoid

| Anti-Pattern    | Example                        | Problem                              |
| --------------- | ------------------------------ | ------------------------------------ |
| Topic matching  | "trigonometry" with 17 results | Tests presence, not ranking          |
| All same score  | 5 slugs all score=3            | Cannot test ranking quality          |
| Too broad       | "maths"                        | Every maths lesson is "relevant"     |
| No clear answer | All score=2                    | No target to measure success against |

#### Review Checklist

Before committing any ground truth:

- [ ] Would a teacher actually type this query?
- [ ] Does at least one lesson directly answer the query (score=3)?
- [ ] Are other lessons appropriately scored (2 for related, 1 for tangential)?
- [ ] Is the query specific enough to test ranking, not just topic presence?
- [ ] Does the query have 3-7 words (or is imprecise-input category)?
- [ ] Are there 5 or fewer expected slugs?

### 7. Canonical Scenario Categories (MANDATORY)

Ground truths form a **subject × phase × category matrix** that must have consistent coverage.

#### The Validation Matrix

```text
Subject (16) × Phase (2) × Category (5) = Consistent Coverage
```

**Outcome-Oriented Framework (2026-01-09)**

Categories are structured around **user outcomes** rather than technical challenges:

| Category             | User Scenario                  | Behavior Proved             | Priority | Required | Min |
| -------------------- | ------------------------------ | --------------------------- | -------- | -------- | --- |
| `precise-topic`      | Teacher knows curriculum terms | Basic retrieval works       | Critical | **YES**  | 4+  |
| `natural-expression` | Teacher uses everyday language | System bridges vocabulary   | High     | **YES**  | 2+  |
| `imprecise-input`    | Teacher makes typing errors    | System recovers from errors | Critical | **YES**  | 1+  |
| `cross-topic`        | Teacher wants intersection     | System finds overlaps       | Medium   | **YES**  | 1+  |
| `pedagogical-intent` | Teacher describes goal         | System understands purpose  | High     | **YES**  | 1+  |

**Minimum per entry**: 9-11 queries covering all 5 required categories.

**Enforcement**: Validation check 16 (`category-coverage`) enforces these minimums programmatically. Entries failing this check cannot pass Stage 2 validation.

#### Category Migration (2026-01-09)

Legacy categories have been migrated to outcome-oriented categories:

| Legacy                    | New Category         | Notes        |
| ------------------------- | -------------------- | ------------ |
| `naturalistic` (formal)   | `precise-topic`      | ~313 queries |
| `naturalistic` (informal) | `natural-expression` | ~28 queries  |
| `synonym`                 | `natural-expression` | 31 queries   |
| `colloquial`              | `natural-expression` | 24 queries   |
| `misspelling`             | `imprecise-input`    | 34 queries   |
| `multi-concept`           | `cross-topic`        | 16 queries   |
| `intent-based`            | `pedagogical-intent` | 2 queries    |

Legacy categories are still accepted for backward compatibility but deprecated.

#### Consistency Requirement

**ALL subject-phase pairings must have the SAME category coverage.** No entry may omit a required category.

This ensures:

- Benchmarks are comparable across subjects and phases
- Category-level MRR analysis is meaningful
- Gaps in search capability are detectable across the full curriculum

#### Category Coverage Checklist

For **EACH** subject-phase entry, verify:

- [ ] Contains 4+ `precise-topic` queries
- [ ] Contains 2+ `natural-expression` queries
- [ ] Contains 1+ `imprecise-input` query
- [ ] Contains 1+ `cross-topic` query
- [ ] Contains 1+ `pedagogical-intent` query

**ALL 5 categories are REQUIRED. If any category is missing → Add queries before the entry is considered complete.**

## Rationale

### Why Bulk Data Validation (Not Live API)?

1. **Speed** — Bulk data validation is instant; API calls take 10-30 seconds
2. **Offline capability** — Can validate without network access
3. **Consistency** — Validates against same data as ES index
4. **No rate limits** — Can validate hundreds of slugs instantly

### Why Agent Review After Programmatic Validation?

Programmatic validation confirms slugs exist but cannot verify:

- Query is realistic (subjective)
- Relevance scores are accurate (requires content understanding)
- All relevant lessons are included (requires curriculum knowledge)
- Category matches query characteristics (semantic judgment)

The two-stage process combines:

- **Programmatic**: Fast, deterministic, catches obvious errors
- **Agent review**: Thorough, semantic, catches subtle issues

## Consequences

### Positive

1. **Experiment integrity** — All future MRR measurements will be valid
2. **Early detection** — Invalid slugs caught before experiments run
3. **Curriculum tracking** — Forced awareness of upstream changes
4. **Confidence in decisions** — Tier advancement and AI decisions based on real data
5. **Fast validation** — Bulk data validation is instant

### Negative

1. **Bulk data dependency** — Must keep bulk data files updated
2. **Agent review time** — Structured review takes 5-10 minutes per subject/phase
3. **Maintenance burden** — Must update ground truth when curriculum changes

### Mitigations

- Bulk data download automated in process
- Agent review checklist is structured and efficient
- Quarterly audit schedule prevents drift accumulation

## Implementation

### Files

| File                                                          | Purpose                                        |
| ------------------------------------------------------------- | ---------------------------------------------- |
| `ground-truths/generation/bulk-data-parser.ts`                | Parse bulk JSON with Result pattern            |
| `ground-truths/generation/type-emitter.ts`                    | Generate branded slug types + subject map      |
| `ground-truths/generation/schema-emitter.ts`                  | Generate Zod validation schemas                |
| `ground-truths/generation/generate-ground-truth-types.ts`     | Orchestrates generation                        |
| `ground-truths/generated/lesson-slugs-by-subject.ts`          | Generated: 12,320 slugs + subject map          |
| `ground-truths/generated/ground-truth-schemas.ts`             | Generated: Zod schemas                         |
| `evaluation/validation/validate-ground-truth.ts`              | 17 validation checks (all blocking)            |
| `src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md` | Complete creation process                      |
| `evaluation/baselines/baselines.json`                         | Baseline metrics (separate from ground truths) |

### Commands

```bash
# Download bulk data (all subjects at once)
pnpm bulk:download

# Generate types from bulk data
pnpm ground-truth:generate

# Validate all ground truths (17 checks, all must pass)
pnpm ground-truth:validate

# Run benchmark
pnpm benchmark --subject {subject} --phase {phase} --verbose
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

1. **Never assume slug naming** — Always verify against bulk data
2. **Ground truth is critical infrastructure** — Treat it with same rigour as production code
3. **Invalid data corrupts decisions** — One experiment rejection may have been wrong
4. **Two-stage validation is essential** — Programmatic + semantic review

## Stage 3 Completion Record

### Stage 3 Qualitative Review (2026-01-09)

The Stage 3 qualitative review was completed 2026-01-09, validating all 474 ground truth queries across 30 subject/phase entries.

**Review Summary:**

| Metric                 | Value                                                   |
| ---------------------- | ------------------------------------------------------- |
| Total queries reviewed | 474                                                     |
| Total slugs validated  | 1,290                                                   |
| Subject/phase entries  | 30 (citizenship-primary and german-primary don't exist) |
| Issues found           | 1                                                       |
| Issues fixed           | 1                                                       |

**Category coverage verified:** All entries meet minimum requirements (4+ precise-topic, 2+ natural-expression, 1+ imprecise-input, 1+ cross-topic).

**Cross-entry consistency verified:** 0 duplicate queries, 0 cross-subject slug conflicts.

**Issue fixed:** `times tables year 3` in maths/primary was incorrectly categorized as `cross-topic` and corrected to `precise-topic` (year filter does not constitute topic intersection).

**Review documentation:** `.agent/reviews/stage-3-review-progress.md`

**Conclusion:** Ground truths are now **production-ready** following completion of all three validation stages.

## Related Documents

- [ADR-082: Fundamentals-First Search Strategy](082-fundamentals-first-search-strategy.md) — Strategy this validates
- [ADR-081: Search Approach Evaluation Framework](081-search-approach-evaluation-framework.md) — Metrics framework
- [ADR-098: Ground Truth Registry](098-ground-truth-registry.md) — Registry structure
- [GROUND-TRUTH-PROCESS.md](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) — Step-by-step process
- [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) — Metric definitions

## References

- Oak Curriculum API documentation
- [Elasticsearch Search Relevance Testing](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-testing.html)
