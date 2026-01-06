# ADR-098: Ground Truth Registry as Single Source of Truth

**Status**: Accepted  
**Date**: 2026-01-05  
**Decision Makers**: Engineering Team  
**Context**: M3 Phase 7a — Unified Evaluation Infrastructure

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

2. **Baseline MRR for smoke tests**: Each entry stores its baseline MRR for automated regression detection. Smoke tests assert `actualMrr >= baselineMrr * 0.95`.

3. **Single source of truth**: All tools that need ground truths import from the registry. No hardcoded mappings elsewhere.

### Registry Structure

```typescript
interface GroundTruthEntry {
  readonly subject: Subject;
  readonly phase: 'primary' | 'secondary' | 'ks4';
  readonly queries: readonly GroundTruthQuery[];
  readonly baselineMrr: number;
}

export const GROUND_TRUTH_ENTRIES: readonly GroundTruthEntry[] = [
  { subject: 'art', phase: 'secondary', queries: ART_SECONDARY_ALL_QUERIES, baselineMrr: 0.741 },
  {
    subject: 'maths',
    phase: 'secondary',
    queries: MATHS_SECONDARY_ALL_QUERIES,
    baselineMrr: 0.894,
  },
  // ... only entries that exist
] as const;
```

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
- **Smoke test integration**: Baseline MRR enables automated regression detection

### Negative

- **Baseline MRR maintenance**: Must update baselineMrr after running benchmarks
- **Manual registry updates**: Adding new ground truths requires adding entry to registry

### Neutral

- **No coverage tracking**: Registry doesn't track what's missing. Coverage is checked by comparing against curriculum data from DATA-VARIANCES.md or SDK ontology.

## Implementation

**File**: `src/lib/search-quality/ground-truth/registry.ts`

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

## Related

- [ADR-081: Search Approach Evaluation Framework](081-search-approach-evaluation-framework.md) — Metrics definitions
- [ADR-082: Fundamentals-First Search Strategy](082-fundamentals-first-search-strategy.md) — Tier system
- [ADR-085: Ground Truth Validation Discipline](085-ground-truth-validation-discipline.md) — Validation requirements
- [M3: Comprehensive Ground Truths](../../.agent/plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md) — Implementation plan
