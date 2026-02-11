# ADR-098: Ground Truth Registry as Single Source of Truth

**Status**: Accepted  
**Date**: 2026-01-05 (Updated: 2026-01-19)  
**Decision Makers**: Engineering Team  
**Context**: M3 Phase 7a — Unified Evaluation Infrastructure

## Critical Understanding: What Ground Truths Measure (2026-01-11)

### Current Scope: Educator Lesson Search (2026-01-24)

| Dimension         | Current Scope                       | Future (Not Today)         |
| ----------------- | ----------------------------------- | -------------------------- |
| **Content Type**  | Lessons only                        | Units, sequences, threads  |
| **User Persona**  | Professional educators (teachers)   | Pupils, students, learners |
| **Search Intent** | Finding curriculum content to teach | Self-directed learning     |

**All current ground truths assume the user is a professional teacher searching for lessons.**

A future learner-focused search may use different RRF weightings, different retrievers, and different preprocessing. Ground truths for that persona will be developed separately.

### Measurement Scope

| What We Thought                                  | What We're Actually Measuring                                  |
| ------------------------------------------------ | -------------------------------------------------------------- |
| "Does search help teachers find useful content?" | "Did search return the exact slugs we arbitrarily wrote down?" |

**Ground truths test expected slug position, NOT user satisfaction.**

### Target Structure (Post-Restructure)

| Dimension             | Value   |
| --------------------- | ------- |
| Subject-phase entries | 30      |
| Categories per entry  | 4       |
| Queries per category  | **1**   |
| **Total queries**     | **120** |

### Measurement Scope Disclaimer (MANDATORY)

**All reporting must include:**

> **Measurement Scope**: Ground truth metrics measure expected slug position, not user satisfaction. A query may receive low MRR while search returns useful results.

## Critical Understanding: Three-Stage Validation

Ground truths require **three distinct validation stages**:

| Stage                                 | What It Proves       | What It Does NOT Prove |
| ------------------------------------- | -------------------- | ---------------------- |
| **1. Type-Check**                     | Data integrity       | Semantic correctness   |
| **2. Runtime Validation (16 checks)** | Semantic rules       | Production readiness   |
| **3. Qualitative (manual review)**    | Production readiness | —                      |

**Stage 1** enforces required fields (`category`, `description`) at compile time.

**Stage 2** enforces semantic rules TypeScript cannot check (slug existence, category coverage, etc.).

**Passing type-check AND runtime validation means ground truths meet a MINIMUM QUALITY THRESHOLD.** This makes them _worthy of investment in manual review_. It does **NOT** mean they are production-ready.

**Ground truths are NOT production-ready until ALL THREE stages are complete.**

## Context

The search quality evaluation infrastructure was fragmented:

| Issue                     | Problem                                               |
| ------------------------- | ----------------------------------------------------- |
| Multiple analysis scripts | 6 scripts with overlapping functionality              |
| Hardcoded mappings        | `GROUND_TRUTHS_BY_SUBJECT_AND_KS` manually maintained |
| Validation covers subset  | Only maths + diagnostics validated                    |
| Inconsistent iteration    | Each tool imports ground truths differently           |

This fragmentation violated foundation principles:

- **Single Source of Truth**: Multiple places defined what ground truths exist
- **DRY**: Duplicate mappings in different files
- **KISS**: Unnecessary complexity in understanding where ground truths come from

## Decision

Create a **Ground Truth Registry** (`GROUND_TRUTH_ENTRIES`) as THE single source of truth for all ground truth entries.

### Design Principles

1. **Only entries that exist**: No nulls, no placeholders. If a subject/phase combination has ground truths, it's in the registry. Otherwise, it isn't.

2. **Baselines stored separately**: Baseline metrics are stored in `evaluation/baselines/baselines.json`, not in the ground truth entries. This separates test data from results.

3. **Single source of truth**: All tools that need ground truths import from the registry. No hardcoded mappings elsewhere.

4. **Consistent category coverage**: Every entry must contain the same set of mandatory scenario categories. See [Canonical Scenario Categories](#canonical-scenario-categories-mandatory) below.

### Registry Structure

```typescript
interface GroundTruthEntry {
  readonly subject: Subject;
  readonly phase: 'primary' | 'secondary';
  readonly queries: readonly GroundTruthQuery[];
}

interface GroundTruthQuery {
  // Required
  readonly query: string;
  readonly expectedRelevance: ExpectedRelevance;
  readonly category: QueryCategory;
  readonly description: string;

  // Optional
  readonly keyStage?: KeyStage; // Override for KS4 queries
}

export const GROUND_TRUTH_ENTRIES: readonly GroundTruthEntry[] = [
  { subject: 'art', phase: 'secondary', queries: ART_SECONDARY_ALL_QUERIES },
  { subject: 'maths', phase: 'secondary', queries: MATHS_SECONDARY_ALL_QUERIES },
  // ... only entries that exist
] as const;
```

### Split File Architecture (2026-01-19)

Ground truth data is split into separate files to support independent discovery during review:

```text
{subject}/{phase}/
├── precise-topic.query.ts      # GroundTruthQueryDefinition
├── precise-topic.expected.ts   # ExpectedRelevance
├── index.ts                    # Combines using combineGroundTruth()
```

**Types**:

```typescript
// Query metadata (safe to read during discovery)
interface GroundTruthQueryDefinition {
  readonly query: string;
  readonly category: QueryCategory;
  readonly description: string;
  readonly expectedFile: string;
  readonly keyStage?: KeyStage;
}

// Expected relevance (read only during comparison phase)
type ExpectedRelevance = Readonly<Record<string, number>>;

// Combined at runtime
function combineGroundTruth(
  queryDef: GroundTruthQueryDefinition,
  expected: ExpectedRelevance,
): GroundTruthQuery;
```

**Benefits**:

- **Independent discovery**: Review protocol reads `.query.ts` files without seeing expected slugs
- **Protocol enforcement**: `.query.ts` and `.expected.ts` are separate files, preventing accidental exposure
- **Cleaner separation**: Query design vs expected outcomes are distinct concerns

See [ADR-085](085-ground-truth-validation-discipline.md) for full architecture details.

### Baselines Structure

Baselines are stored separately in `evaluation/baselines/baselines.json`:

```json
{
  "referenceValues": {
    "mrr": { "excellent": 0.9, "good": 0.7, "target": 0.7 },
    "ndcg10": { "excellent": 0.85, "good": 0.75, "target": 0.75 },
    ...
  },
  "measuredBaselines": {
    "entries": {
      "maths/secondary": { "mrr": 0.894, "ndcg10": 0.782, ... },
      ...
    }
  }
}
```

This separation:

- Keeps test data (ground truths) separate from results (baselines)
- Enables tracking multiple metrics, not just MRR
- Prevents self-reinforcing feedback loops
- Makes baseline updates explicit

### Accessor Functions

- `getAllGroundTruthEntries()` — Iterate all entries (validation, benchmarking)
- `getGroundTruthEntry(subject, phase)` — Get specific entry
- `getEntriesForSubject(subject)` — Get all entries for a subject
- `getEntriesForPhase(phase)` — Get all entries for a phase

### Why No Nulls?

We considered using a sparse matrix with nulls for missing combinations:

```typescript
// REJECTED design
export const REGISTRY = {
  art: { primary: null, secondary: ART_QUERIES, ks4: null },
  // ...
} as const;
```

This was rejected because:

1. **Ambiguity**: Cannot distinguish "not yet created" from "doesn't exist in curriculum"
2. **Iteration complexity**: Filtering nulls adds complexity
3. **No benefit**: We only care about entries that exist

The simpler array of entries approach:

- Contains only what exists
- Simple to iterate with `for...of`
- No null handling required
- Coverage checking compares against curriculum data separately if needed

## Consequences

### Positive

- **Single import**: All tools import from one place
- **Easy iteration**: Simple `for (const entry of getAllGroundTruthEntries())`
- **Type safety**: Compile-time guarantees on entry shape
- **Self-documenting**: Registry shows exactly what ground truths exist
- **Clean separation**: Test data separate from baseline metrics

### Negative

- **Baseline maintenance**: Must update `baselines.json` after running benchmarks
- **Manual registry updates**: Adding new ground truths requires adding entry to registry

### Neutral

- **No coverage tracking**: Registry doesn't track what's missing. Coverage is checked by comparing against curriculum data from DATA-VARIANCES.md or SDK ontology.

## Implementation

**Files**:

- `src/lib/search-quality/ground-truth/registry/` — Registry implementation
- `evaluation/baselines/baselines.json` — Baseline metrics (separate)
- `src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md` — Creation process

**Exports**:

- `GroundTruthEntry` type
- `Phase` type
- `GROUND_TRUTH_ENTRIES` array
- `getAllGroundTruthEntries()` function
- `getGroundTruthEntry()` function
- `getEntriesForSubject()` function
- `getEntriesForPhase()` function

## Verification

Tests in `registry.unit.test.ts` verify:

- Registry is non-empty
- All entries have required fields
- Subject/phase combinations are unique
- Accessor functions work correctly

### Ground Truth Type Generation (2026-01-08)

The registry is validated against generated types from bulk data:

**Infrastructure** (`ground-truths/generation/`):

- `bulk-data-parser.ts` — Parse bulk JSON with Result pattern
- `type-emitter.ts` — Generate branded `AnyLessonSlug` type + `SLUG_TO_SUBJECT_MAP`
- `schema-emitter.ts` — Generate Zod schemas for runtime validation

**Generated Output** (`ground-truths/generated/`):

- `lesson-slugs-by-subject.ts` — 12,320 valid slugs across 16 subjects
- `ground-truth-schemas.ts` — Zod schemas for comprehensive validation

**Validation** (`evaluation/validation/validate-ground-truth.ts`):

- 16 comprehensive checks including cross-subject contamination, category coverage, and description presence
- All checks report as errors (no warnings)
- Validates against generated `ALL_LESSON_SLUGS` Set
- Entry-level checks ensure consistent category coverage across all entries

### Canonical Scenario Categories (MANDATORY)

Ground truths form a **subject × phase × category matrix** that must have consistent coverage.

**Outcome-Oriented Framework (2026-01-10)**

Categories are structured around **user outcomes** rather than technical challenges:

| Category             | User Scenario                  | Behavior Proved             | Priority | Required | Min |
| -------------------- | ------------------------------ | --------------------------- | -------- | -------- | --- |
| `precise-topic`      | Teacher knows curriculum terms | Basic retrieval works       | Critical | **YES**  | 4+  |
| `natural-expression` | Teacher uses everyday language | System bridges vocabulary   | High     | **YES**  | 2+  |
| `imprecise-input`    | Teacher makes typing errors    | System recovers from errors | Critical | **YES**  | 1+  |
| `cross-topic`        | Teacher wants intersection     | System finds overlaps       | Medium   | **YES**  | 1+  |

**Minimum per entry**: 8+ queries covering all 4 required categories.

**Category Migration**: Legacy categories (`naturalistic`, `misspelling`, `synonym`, `multi-concept`, `colloquial`, `intent-based`) are still accepted for backward compatibility but deprecated.

**Consistency requirement**: ALL subject-phase pairings must have the SAME category coverage. No entry may omit a required category. This ensures:

- Benchmarks are comparable across subjects and phases
- Category-level MRR analysis is meaningful
- Gaps in search capability are detectable across the full curriculum

## Related

- [ADR-081: Search Approach Evaluation Framework](081-search-approach-evaluation-framework.md) — Metrics definitions
- [ADR-082: Fundamentals-First Search Strategy](082-fundamentals-first-search-strategy.md) — Tier system
- [ADR-085: Ground Truth Validation Discipline](085-ground-truth-validation-discipline.md) — Validation requirements
- [GROUND-TRUTH-PROCESS.md](../../../apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) — Step-by-step creation process
