# M3: Comprehensive Ground Truths & Phase-Aligned Search Quality

**Status**: ✅ **Phases 1-7 Complete** | 📋 **Phase 8 Ready**
**Priority**: HIGH — Foundation for all future search work
**Parent**: [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03
**Last Updated**: 2026-01-06

---

## Executive Summary

**Goal**: Create comprehensive ground truths covering ALL subjects × ALL phases, then establish universal benchmarks that enable meaningful like-for-like comparison when index structure or retriever configuration changes.

**Impact**: Teachers and AI agents searching for any subject at any phase get measurably good results. We can prove improvements and detect regressions across the full curriculum.

**Key Insight**: Ground truths must NOT be transcript-dependent. MFL subjects have minimal transcripts but rich structural content (`lesson_structure`, `lesson_structure_semantic`). If our ground truths only work for transcript-rich subjects, that's a design flaw, not a reason to ignore MFL.

---

## Progress Summary

### Completed ✅

| Phase | Description | Date |
|-------|-------------|------|
| **Phase 1** | SDK Schema Enhancement — `phase_slug` added to index document schemas | 2026-01-03 |
| **Phase 2** | Indexing Pipeline — `derivePhaseFromKeyStage()` populates `phase_slug` in all document builders | 2026-01-03 |
| **Phase 3** | Search Filter Architecture — Array support for `phases[]`, `keyStages[]`, `years[]`, `examBoards[]` | 2026-01-03 |
| **Phase 4** | Analysis Script Enhancement — CLI supports `--phase`, `--keyStages`, `--years`, `--examBoards` | 2026-01-03 |
| **Phase 5a** | Ground truth restructure — directory rename, export standardisation, consumer file updates | 2026-01-05 |
| **Phase 5b** | Create ALL primary ground truths (14 subjects) | 2026-01-06 |
| **Phase 5c** | Create missing secondary ground truths | 2026-01-06 |
| **Phase 5d** | Create KS4-specific ground truths (maths tiers, science subjects, english set texts, etc.) | 2026-01-06 |
| **Phase 6** | ⏸️ Cancelled — phase model changed, `phase_slug` not needed in ES | — |
| **Phase 7a** | Create `GROUND_TRUTH_REGISTRY` (ADR-098) | 2026-01-06 |
| **Phase 7b-c** | Unified `benchmark.ts` evaluation tool | 2026-01-06 |
| **Phase 7d-e** | Cleanup — delete fragmented scripts and performance-measuring smoke tests | 2026-01-06 |

### Next Up 📋

| Phase | Description | Effort |
|-------|-------------|--------|
| **Phase 8** | Baselines — Run comprehensive phase-based baselines for ALL subjects | HIGH |

---

## Unified Evaluation Architecture

### Current State (Fragmented)

**Problem**: The evaluation infrastructure violates several foundation principles:

| Issue | Foundation Rule Violated | Current State |
|-------|-------------------------|---------------|
| Multiple analysis scripts doing same thing | KISS, First Question | 6 scripts with overlapping functionality |
| Hardcoded mappings | DRY, Single Source of Truth | `GROUND_TRUTHS_BY_SUBJECT_AND_KS` manually maintained |
| Validation covers subset only | Comprehensive, Single Source | Only maths + diagnostics + units validated |
| `--keyStage` backwards compat | "NEVER create compatibility layers" | Legacy param still supported |
| Smoke tests hardcoded | Configurable over hardcoded | Each test fixed to maths KS4 |

### Target State (Unified)

**Principle**: Two distinct categories of tools, each with a single implementation.

| Category | Purpose | Question Answered | Output |
|----------|---------|-------------------|--------|
| **Evaluations** | Measure effect of changes | "Did this improve/regress quality?" | Metrics to compare |
| **Smoke Tests** | Verify service is working | "Is search meeting baseline?" | Pass/fail |

```
ground-truth/
├── index.ts                     ← SINGLE registry of ALL ground truths
│                                  Exports: GROUND_TRUTH_REGISTRY
│
├── {subject}/                   ← Individual subject files
│   ├── primary/
│   ├── secondary/
│   └── index.ts                 ← Re-exports for registry

evaluation/
├── validation/
│   └── validate-all.ts          ← Validates ALL slugs from registry
│
├── analysis/
│   └── benchmark.ts             ← EVALUATION: Measure MRR for any scope
│                                  Flexible, for before/after comparison

smoke-tests/
└── search-baseline.smoke.test.ts  ← SMOKE TEST: Assert ALL baselines
                                     Uses GROUND_TRUTH_REGISTRY
                                     Fails if ANY combination regresses
```

**Key Distinction**:
- **Evaluations** are tools you run manually to measure effects of changes
- **Smoke tests** are automated pass/fail checks that run in CI/CD

### Ground Truth Registry Design

The registry must be the **single source of truth** for what ground truths exist:

```typescript
/**
 * Complete registry of all ground truths.
 * 
 * This is the SINGLE source of truth for what ground truths exist.
 * All validation and benchmarking tools iterate over this registry.
 * 
 * @remarks
 * Adding a new ground truth? Add it here and it will automatically
 * be validated and benchmarked.
 */
export const GROUND_TRUTH_REGISTRY = {
  art: {
    primary: ART_PRIMARY_QUERIES,       // null if not yet created
    secondary: ART_SECONDARY_QUERIES,
    ks4: null,                          // null if no KS4-specific
  },
  // ... all 16 subjects
} as const;

/**
 * Type-safe accessor for ground truths.
 * Returns null if the subject/phase combination doesn't exist.
 */
export function getGroundTruths(
  subject: SearchSubjectSlug,
  phase: 'primary' | 'secondary' | 'ks4'
): readonly GroundTruthQuery[] | null {
  return GROUND_TRUTH_REGISTRY[subject]?.[phase] ?? null;
}

/**
 * Get all subject/phase combinations that have ground truths.
 * Used by validation and benchmark runners.
 */
export function getAllGroundTruthEntries(): readonly GroundTruthEntry[] {
  // Derive from GROUND_TRUTH_REGISTRY
}
```

### Unified Benchmark Runner Design

Replace fragmented scripts with single configurable runner:

```typescript
/**
 * Universal benchmark runner.
 * 
 * Usage:
 *   pnpm benchmark --all                    # Run all subjects/phases
 *   pnpm benchmark --subject maths          # One subject, all phases
 *   pnpm benchmark --phase primary          # One phase, all subjects
 *   pnpm benchmark --subject maths --phase secondary
 */
interface BenchmarkConfig {
  /** Subjects to benchmark. Empty = all. */
  subjects: readonly SearchSubjectSlug[];
  /** Phases to benchmark. Empty = all. */
  phases: readonly ('primary' | 'secondary' | 'ks4')[];
  /** Output format */
  format: 'console' | 'json' | 'markdown';
  /** Verbose per-query output */
  verbose: boolean;
}

/**
 * Benchmark output includes ALL standard IR metrics.
 */
interface BenchmarkResult {
  subject: SearchSubjectSlug;
  phase: 'primary' | 'secondary' | 'ks4';
  metrics: {
    mrr: number;              // Mean Reciprocal Rank
    ndcg10: number;           // NDCG@10
    precision10: number;      // Precision@10 — proportion of top 10 that are relevant
    recall10: number;         // Recall@10 — proportion of relevant found in top 10
    zeroHitRate: number;      // Queries returning nothing
    p95LatencyMs: number;     // 95th percentile latency
  };
  perCategory: Record<string, CategoryMetrics>;
  queryCount: number;
}
```

**Why Precision and Recall**: These are industry-standard IR metrics that ML engineers expect. They provide complementary insights:
- **Precision@10**: Are we showing too much noise? (high = clean results)
- **Recall@10**: Are we missing relevant content? (high = complete results)

### Migration Path

| Phase | Action | Files Affected |
|-------|--------|----------------|
| **Phase 7a** | Create `GROUND_TRUTH_REGISTRY` in `ground-truth/index.ts` | `ground-truth/index.ts` |
| **Phase 7b** | Update `validate-ground-truth.ts` to iterate registry | `validation/validate-ground-truth.ts` |
| **Phase 7c** | Create unified `benchmark.ts` | `evaluation/analysis/benchmark.ts` |
| **Phase 7d** | Delete fragmented scripts | `analyze-per-category.ts`, etc. |
| **Phase 7e** | Remove `--keyStage` legacy param | `analyze-cross-curriculum.ts` |

### Alignment with Foundation Documents

| Foundation Rule | How We Align |
|-----------------|--------------|
| **Single Source of Truth** | `GROUND_TRUTH_REGISTRY` is THE registry |
| **KISS** | One benchmark runner, one validation script |
| **DRY** | No hardcoded mappings duplicating registry |
| **No Compatibility Layers** | Remove legacy `--keyStage` param |
| **Fail Fast** | Validation fails on ANY missing/invalid slug |
| **TDD** | Tests for registry, validation, benchmark |

---

## Coverage Matrix (Current State)

Based on bulk data availability and existing ground truths:

| Subject | Primary Bulk | Primary GT | Secondary Bulk | Secondary GT | KS4 Complexity |
|---------|--------------|------------|----------------|--------------|----------------|
| **art** | ✅ | ❌ | ✅ | ✅ | UnitOptions |
| **citizenship** | ❌ | ❌ | ✅ | ✅ | Pathways |
| **computing** | ✅ | ❌ | ✅ | ✅ | Pathways |
| **cooking-nutrition** | ✅ | ✅ | ✅ | ❌ | — |
| **design-technology** | ✅ | ❌ | ✅ | ✅ | UnitOptions |
| **english** | ✅ | ✅ | ✅ | ✅ | UnitOptions (set texts) |
| **french** | ✅ | ❌ | ✅ | ✅ | ExamBoards |
| **geography** | ✅ | ❌ | ✅ | ✅ | UnitOptions |
| **german** | ❌ | ❌ | ✅ | ✅ | ExamBoards |
| **history** | ✅ | ✅ | ✅ | ✅ | UnitOptions |
| **maths** | ✅ | ❌ | ✅ | ✅ | Tiers (Foundation/Higher) |
| **music** | ✅ | ❌ | ✅ | ✅ | — |
| **physical-education** | ✅ | ❌ | ✅ | ✅ | Pathways |
| **religious-education** | ✅ | ❌ | ✅ | ✅ | UnitOptions |
| **science** | ✅ | ✅ | ✅ | ✅ | ExamSubject+Tiers |
| **spanish** | ✅ | ❌ | ✅ | ✅ | ExamBoards |

### Gaps to Fill

**Primary (10 subjects)**: art, computing, design-technology, french, geography, maths, music, physical-education, religious-education, spanish

**Secondary (1 subject)**: cooking-nutrition

**KS4-specific**: All subjects with KS4 complexity need `secondary/ks4/` ground truths

---

## Current Evaluation Infrastructure (Post-Cleanup)

### Analysis Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| `benchmark.ts` | **Unified benchmark tool** — all subjects, all phases | ✅ Active |

### Smoke Tests

| Test | Purpose | Status |
|------|---------|--------|
| Behavior-focused smoke tests | Verify search service works | ✅ Active |

**Deleted** (replaced by unified approach):
- `analyze-per-category.ts`, `analyze-diagnostic-queries.ts`, `full-metrics-breakdown.ts`, etc.
- `search-quality.smoke.test.ts`, `hard-query-baseline.smoke.test.ts`, etc.

### Key Achievement

**Universal benchmarking now available.** Single `benchmark.ts` covers all 28 subject/phase entries from the registry.

---

## Directory Structure

### Current (Phase-Aligned)

```
ground-truth/
├── {subject}/
│   ├── primary/              # Years 1-6 (KS1+KS2)
│   │   ├── {topic}.ts
│   │   ├── hard-queries.ts
│   │   └── index.ts
│   ├── secondary/            # Years 7-11 (KS3+KS4)
│   │   ├── {topic}.ts
│   │   ├── hard-queries.ts
│   │   └── index.ts
│   └── index.ts
```

### Proposed (With KS4 Subdirectories)

For subjects with significant KS4 complexity:

```
ground-truth/
├── {subject}/
│   ├── primary/              # Years 1-6
│   ├── secondary/            # Years 7-11
│   │   ├── {topic}.ts
│   │   ├── hard-queries.ts
│   │   ├── ks4/              # KS4-specific complexity (GCSE)
│   │   │   ├── {ks4-topic}.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
```

**KS4 subdirectory contents by subject**:

| Subject | KS4 Complexity | `secondary/ks4/` files |
|---------|----------------|------------------------|
| maths | Tiers | `tier-variants.ts` |
| science | ExamSubj+Tiers | `biology.ts`, `chemistry.ts`, `physics.ts` |
| english | UnitOpts | `set-texts.ts` |
| geography | UnitOpts | `fieldwork-options.ts` |
| history | UnitOpts | `historic-environments.ts` |
| art | UnitOpts | `specialisms.ts` |
| design-tech | UnitOpts | `materials.ts` |
| religious-ed | UnitOpts | `faith-comparisons.ts` |
| french/spanish/german | ExamBoards | `exam-skills.ts` |
| computing/citizenship/PE | Pathways | `core-vs-gcse.ts` |

---

## Implementation Phases

### Phase 5b: Create ALL Missing Primary Ground Truths

**Goal**: Complete primary coverage for all 10 subjects that have bulk data but no ground truths.

**Implementation Order** (breadth-first — complete all primary first):

| Priority | Subject | Units | Data Source | Notes |
|----------|---------|-------|-------------|-------|
| 1 | maths | 125 | Bulk + MCP | Largest, most important |
| 2 | physical-education | 65 | Bulk | Large but simpler |
| 3 | art | 42 | Bulk | Creative subjects |
| 4 | geography | 37 | Bulk | Physical/human geography |
| 5 | music | 36 | Bulk | Performance/composition |
| 6 | religious-education | 36 | Bulk | World religions |
| 7 | computing | 30 | Bulk | Programming/data |
| 8 | spanish | 21 | Bulk | **MFL - structure-only** |
| 9 | design-technology | 18 | Bulk | Materials/making |
| 10 | french | 15 | Bulk | **MFL - structure-only** |

**MFL Note**: French, Spanish (and German secondary) are Modern Foreign Languages with minimal transcripts. Ground truths for MFL MUST test structural search fields (`lesson_structure`, `lesson_structure_semantic`), not just content fields. This is critical for validating our four-retriever hybrid architecture.

**Methodology**:

1. **Extract from bulk data**: `apps/oak-open-curriculum-semantic-search/bulk-downloads/{subject}-primary.json`
2. **Validate via MCP**: Use `get-lessons-summary` to confirm slugs exist
3. **Create queries**: Mix of curriculum-concept and content-discovery queries
4. **Document**: Comprehensive TSDoc on all files

**Target per subject**:
- Minimum 15 queries
- Mix of categories: naturalistic, misspelling, synonym, multi-concept
- At least 3 hard queries

**Acceptance Criteria**:

| Criterion | Measurement |
|-----------|-------------|
| All 10 subjects have `primary/` directories | Directory check |
| Each has ≥15 queries | Query count |
| All slugs validated | MCP validation |
| Quality gates pass | Full gate run |

### Phase 5c: Create Missing Secondary Ground Truths

**Goal**: Complete secondary coverage for cooking-nutrition.

**Scope**: Small — only 12 units in `cooking-nutrition-secondary.json`

**Acceptance Criteria**:

| Criterion | Measurement |
|-----------|-------------|
| `cooking-nutrition/secondary/` exists | Directory check |
| ≥10 queries created | Query count |
| All slugs validated | MCP validation |

### Phase 5d: Create KS4-Specific Ground Truths

**Goal**: Create `secondary/ks4/` subdirectories for subjects with significant KS4 complexity.

**Subjects** (in order):

1. **science** — ExamSubject split (Biology/Chemistry/Physics) + Tiers
2. **maths** — Tiers (Foundation/Higher)
3. **english** — Set texts (An Inspector Calls, Macbeth, etc.)
4. **geography** — Fieldwork options
5. **history** — Historic environments
6. **MFL** (french/spanish/german) — Exam board skills

**Acceptance Criteria**:

| Criterion | Measurement |
|-----------|-------------|
| KS4 directories exist for complex subjects | Directory check |
| Each has ≥10 queries testing KS4 features | Query count |
| Tier queries test Foundation vs Higher | Coverage review |
| Set text queries test specific works | Coverage review |

### Phase 6: ES Re-index

**Goal**: Add `phase_slug` to existing ES documents.

**Method**: Update-by-query (faster than full re-ingest):

```bash
# Run from Kibana Dev Tools
POST oak_lessons/_update_by_query
{
  "script": {
    "source": "ctx._source.phase_slug = (ctx._source.key_stage == 'ks1' || ctx._source.key_stage == 'ks2') ? 'primary' : 'secondary'"
  }
}

POST oak_units/_update_by_query
{ ... same script ... }

POST oak_unit_rollup/_update_by_query
{ ... same script ... }
```

**Acceptance Criteria**:

| Criterion | Measurement |
|-----------|-------------|
| All documents have `phase_slug` | ES query verification |
| Phase filter queries work | Manual test |

### Phase 7: Unified Evaluation Infrastructure

**Goal**: Replace fragmented evaluation tools with unified, registry-driven infrastructure.

#### Phase 7a: Create Ground Truth Registry

**File**: `src/lib/search-quality/ground-truth/index.ts`

Create `GROUND_TRUTH_REGISTRY` as the single source of truth:

```typescript
export const GROUND_TRUTH_REGISTRY = {
  art: { primary: null, secondary: ART_SECONDARY_QUERIES, ks4: null },
  citizenship: { primary: null, secondary: CITIZENSHIP_SECONDARY_QUERIES, ks4: null },
  // ... all 16 subjects with actual exports or null
} as const;
```

**Acceptance Criteria**:
- Registry exports all existing ground truths
- `null` for missing subject/phase combinations
- Type-safe accessors: `getGroundTruths()`, `getAllGroundTruthEntries()`

#### Phase 7b: Update Validation Script

**File**: `evaluation/validation/validate-ground-truth.ts`

Replace hardcoded imports with registry iteration:

```typescript
// BEFORE (hardcoded)
import { MATHS_SECONDARY_STANDARD_QUERIES, ... } from '...';

// AFTER (registry-driven)
import { getAllGroundTruthEntries } from '...';

for (const entry of getAllGroundTruthEntries()) {
  await validateEntry(entry, apiKey);
}
```

**Acceptance Criteria**:
- Validates ALL subjects that have ground truths
- Validates both primary and secondary where applicable
- Validates KS4-specific queries where applicable
- All slugs pass → exit code 0
- Any invalid → fail fast with details

#### Phase 7c: Create Unified Evaluation Tool

**File**: `evaluation/analysis/benchmark.ts`

**Purpose**: Measure search quality for any scope. Used for before/after comparison when making changes.

```bash
# Usage examples
pnpm benchmark --all                              # All subjects, all phases
pnpm benchmark --subject maths                    # One subject, all phases
pnpm benchmark --phase primary                    # One phase, all subjects
pnpm benchmark --subject english --phase secondary --verbose
pnpm benchmark --all --format markdown > RESULTS.md
```

**Acceptance Criteria**:
- Configurable scope (all/subject/phase)
- Output formats: console, json, markdown
- Per-category MRR breakdown
- Uses `GROUND_TRUTH_REGISTRY` as source

#### Phase 7d: Create Unified Smoke Test

**File**: `smoke-tests/search-baseline.smoke.test.ts`

**Purpose**: Assert search service is meeting baseline for ALL subjects × ALL phases. Runs in CI/CD.

```typescript
/**
 * Universal Search Baseline Smoke Test
 * 
 * Iterates GROUND_TRUTH_REGISTRY and asserts MRR >= baseline for each
 * subject/phase combination that has ground truths.
 * 
 * Fails if ANY combination regresses below documented baseline.
 */
describe('Search Baseline', () => {
  for (const entry of getAllGroundTruthEntries()) {
    describe(`${entry.subject} ${entry.phase}`, () => {
      it(`meets MRR baseline (>= ${entry.baseline})`, async () => {
        const mrr = await measureMRR(entry.queries, entry.subject, entry.phase);
        expect(mrr).toBeGreaterThanOrEqual(entry.baseline * 0.95); // 5% regression tolerance
      });
    });
  }
});
```

**Acceptance Criteria**:
- Tests ALL subject/phase combinations from registry
- Each has documented baseline MRR
- 5% regression tolerance
- Single pass/fail for "is search working?"

**Replaces**: Multiple hardcoded smoke tests
- `search-quality.smoke.test.ts` → merged
- `hard-query-baseline.smoke.test.ts` → merged
- `unit-search-quality.smoke.test.ts` → merged

#### Phase 7e: Delete Fragmented Tools

**Evaluation scripts to delete** (replaced by `benchmark.ts`):
- `analyze-per-category.ts`
- `analyze-diagnostic-queries.ts`
- `analyze-colloquial.ts`
- `analyze-intent-queries.ts`
- `full-metrics-breakdown.ts`

**Keep**: `analyze-cross-curriculum.ts` — but remove legacy `--keyStage` param

**Smoke tests to delete** (replaced by `search-baseline.smoke.test.ts`):
- `search-quality.smoke.test.ts`
- `hard-query-baseline.smoke.test.ts`

**Keep**: Smoke tests for specific concerns (synonyms, KS4 filtering, etc.)

#### Phase 7f: Remove Legacy Parameters

**File**: `evaluation/analysis/analyze-cross-curriculum.ts`

Remove backwards-compatible `--keyStage` single param:

```typescript
// BEFORE
keyStage: { type: 'string', short: 'k' },      // Legacy, single
keyStages: { type: 'string' },                  // NEW: comma-separated

// AFTER
keyStages: { type: 'string', short: 'k' },     // Only this, no legacy
```

Per foundation rule: "NEVER create compatibility layers"

**Acceptance Criteria**:
- Only `--keyStages` (plural) or `--phase` accepted
- Legacy `--keyStage` removed
- Documentation updated

### Phase 8: Comprehensive Baselines

**Goal**: Run phase-based baselines for ALL subjects and establish universal benchmark configuration.

**Commands**:

```bash
cd apps/oak-open-curriculum-semantic-search

# Core subjects - both phases
for subject in english maths science history; do
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase primary --verbose
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase secondary --verbose
done

# Geography (both phases once primary exists)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject geography --phase primary --verbose
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject geography --phase secondary --verbose

# MFL (both phases once primary exists)
for subject in french spanish german; do
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase primary --verbose
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase secondary --verbose
done

# Creative subjects
for subject in art music design-technology computing; do
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase primary --verbose
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase secondary --verbose
done

# Other subjects
for subject in religious-education citizenship physical-education; do
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase primary --verbose
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase secondary --verbose
done

# Cooking (special: primary only for now, then secondary)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject cooking-nutrition --phase primary --verbose
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject cooking-nutrition --phase secondary --verbose
```

**Recording Results**:

All results recorded in [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md) following the template:

```markdown
### YYYY-MM-DD: {Subject} {Phase} Baseline

**Context**: M3 Phase 8 — comprehensive baseline

**Method**: `analyze-cross-curriculum.ts --subject {subject} --phase {phase}`

**Results**:

| Category | Queries | MRR | Status |
|----------|---------|-----|--------|
| naturalistic | N | X.XXX | ✅/⚠️/❌ |
| misspelling | N | X.XXX | ✅/⚠️/❌ |
| ... | ... | ... | ... |
| **Overall** | **N** | **X.XXX** | **Status** |

**Key Findings**:
1. ...

**Decision**: ✅ BASELINE ESTABLISHED
```

**Acceptance Criteria**:

| Criterion | Measurement |
|-----------|-------------|
| All subjects with primary content baselined | EXPERIMENT-LOG entries |
| All subjects with secondary content baselined | EXPERIMENT-LOG entries |
| Per-category MRR breakdown for each | EXPERIMENT-LOG entries |
| current-state.md updated | File updated |

---

## Ground Truth Creation Methodology

### Data Sources

1. **Bulk Download Data** (preferred for discovery):
   - Location: `apps/oak-open-curriculum-semantic-search/bulk-downloads/`
   - Files: `{subject}-{primary|secondary}.json`
   - Contains: Complete lesson data including slugs, titles, units

2. **Oak Curriculum MCP Tools** (for validation and exploration):
   - `get-key-stages-subject-units` — List units for a subject/key-stage
   - `get-key-stages-subject-lessons` — List lessons for a subject/key-stage
   - `get-lessons-summary` — Validate lesson slugs exist
   - `search` — Find lessons by topic query

### Query Categories

| Category | Description | Priority | Example |
|----------|-------------|----------|---------|
| naturalistic | Teacher/student language | HIGH | "teaching fractions to year 4" |
| misspelling | Typos, mobile errors | CRITICAL | "fotosynthesis" |
| synonym | Alternative terminology | HIGH | "times tables" vs "multiplication facts" |
| multi-concept | Topic intersections | MEDIUM | "ratio in cooking" |
| colloquial | Informal language | MEDIUM | "SOHCAHTOA" |
| intent-based | Pedagogical purpose | EXPLORATORY | "introduction lesson for algebra" |

### Query Types

**Two types of queries** (from 2026-01-03 insight):

| Type | Example | Tests | Coupling |
|------|---------|-------|----------|
| **Curriculum concept** | "teaching fractions to year 4" | Semantic understanding | Low - stable |
| **Content discovery** | "Macbeth Lady Macbeth guilt" | Specific content findability | High - content-dependent |

Both types are essential:
- Curriculum concept queries test search intelligence (stable across content changes)
- Content discovery queries validate real content is findable (may break if content changes)

### MFL Ground Truths (Special Consideration)

Modern Foreign Languages (French, Spanish, German) have minimal transcripts but rich structural content. Ground truths for MFL must:

1. **Test structural fields**: `lesson_structure`, `lesson_structure_semantic`
2. **Use vocabulary/grammar topics**: These appear in structural metadata
3. **NOT assume transcript content**: Don't use queries that would only match transcripts
4. **Validate all 4 retrievers**: BM25/ELSER × content/structure

Example MFL queries:
- "French vocabulary food" (structural)
- "German grammar modal verbs" (structural)
- "Spanish phonics pronunciation" (structural)

---

## Quality Gates

Run after each phase (from repo root):

```bash
pnpm type-gen      # Makes changes
pnpm build         # Makes changes
pnpm type-check
pnpm lint:fix      # Makes changes
pnpm format:root   # Makes changes
pnpm markdownlint:root  # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Foundation Document Re-Read Schedule

| Checkpoint | Re-read |
|------------|---------|
| Before Phase 5b | rules.md, testing-strategy.md |
| Before Phase 6 | schema-first-execution.md |
| Before Phase 7 | testing-strategy.md |
| Before Phase 8 | All three |
| Before sign-off | All three |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| MFL ground truths fail due to transcript dependency | Use structural field queries only |
| Bulk data stale | Cross-validate with MCP API calls |
| Ground truth slugs become invalid | Periodic validation runs |
| Query count insufficient for meaningful comparison | Minimum 15 queries per subject/phase |
| Scope creep | Breadth-first: complete one phase across all subjects before next |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/search-quality/ground-truth/` | Ground truth directory |
| `evaluation/analysis/analyze-cross-curriculum.ts` | Phase-based analysis CLI |
| `evaluation/validation/validate-ground-truth.ts` | Slug validation script |
| `bulk-downloads/` | Source data for ground truth creation |
| `src/lib/hybrid-search/phase-filter-utils.ts` | Phase expansion utilities |

---

## Related Documents

### Planning

| Document | Purpose |
|----------|---------|
| [../roadmap.md](../roadmap.md) | Master roadmap |
| [../current-state.md](../current-state.md) | Current metrics |
| [../search-acceptance-criteria.md](../search-acceptance-criteria.md) | Acceptance criteria |

### Evaluation Framework

| Document | Purpose |
|----------|---------|
| [../../evaluations/EXPERIMENTAL-PROTOCOL.md](../../../evaluations/EXPERIMENTAL-PROTOCOL.md) | How to run experiments |
| [../../evaluations/EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md) | Record all baselines |

### Technical Documentation

| Document | Purpose |
|----------|---------|
| [../../../../docs/data/DATA-VARIANCES.md](../../../../docs/data/DATA-VARIANCES.md) | Curriculum data differences |
| [IR-METRICS.md](../../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | MRR, NDCG definitions |

### Foundation Documents

| Document | Purpose |
|----------|---------|
| [rules.md](../../../directives-and-memory/rules.md) | First Question, TDD, no shortcuts |
| [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) | TDD at ALL levels |
| [schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md) | Generator is source of truth |
