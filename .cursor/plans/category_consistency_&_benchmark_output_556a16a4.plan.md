---
name: Category Consistency & Benchmark Output
overview: Add pedagogical-intent queries to all 29 ground truth entries missing them, then update the benchmark system to output per-category metrics for every subject-phase-category combination alongside aggregates.
todos:
  - id: part1-validation-tdd
    content: "TDD: Update validation script to require pedagogical-intent category"
    status: completed
  - id: part1-docs
    content: Update GROUND-TRUTH-PROCESS.md to mark pedagogical-intent as required
    status: completed
    dependencies:
      - part1-validation-tdd
  - id: part2-queries-primary
    content: Add pedagogical-intent queries to 14 primary entries
    status: completed
    dependencies:
      - part1-validation-tdd
  - id: part2-queries-secondary
    content: Add pedagogical-intent queries to 15 secondary entries (excl maths)
    status: completed
    dependencies:
      - part1-validation-tdd
  - id: part2-validate
    content: Run ground-truth:validate to confirm all entries pass
    status: completed
    dependencies:
      - part2-queries-primary
      - part2-queries-secondary
  - id: part3-query-result
    content: "TDD: Add category field to QueryResult and RunQueryInput"
    status: completed
    dependencies:
      - part2-validate
  - id: part3-category-stats
    content: "TDD: Create CategoryResult type and aggregateByCategory function"
    status: completed
    dependencies:
      - part3-query-result
  - id: part3-entry-runner
    content: "TDD: Update EntryBenchmarkResult with perCategory array"
    status: completed
    dependencies:
      - part3-category-stats
  - id: part3-output
    content: "TDD: Update printSummary to output per-category grid"
    status: completed
    dependencies:
      - part3-entry-runner
  - id: part3-verbose-docs
    content: Update --verbose TSDoc to clarify it only enables logger.debug
    status: completed
    dependencies:
      - part3-output
  - id: part4-adr
    content: Update ADR-085 with pedagogical-intent as required category
    status: completed
  - id: part4-prompt
    content: Update semantic-search.prompt.md status
    status: completed
    dependencies:
      - part3-output
      - part2-validate
  - id: part4-quality-gates
    content: Run all 11 quality gates and fix any issues
    status: completed
    dependencies:
      - part4-adr
      - part4-prompt
---

# Category Consistency + Per-Category Benchmark Output

## Impact Statement

**Users affected**: Developers maintaining and improving semantic search quality.

**Impact**: Enables meaningful cross-subject comparison of search quality, and visibility into category-specific performance gaps that aggregate metrics hide.

---

## Foundation Documents (Re-read at Each Phase)

- [`rules.md`](.agent/directives-and-memory/rules.md) - First Question, TDD, no shortcuts
- [`testing-strategy.md`](.agent/directives-and-memory/testing-strategy.md) - Test behaviour at all levels
- [`schema-first-execution.md`](.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

---

## Part 1: Make `pedagogical-intent` a Required Category

### 1.1 Update Validation Script (TDD)

**File**: [`evaluation/validation/validate-ground-truth.ts`](apps/oak-open-curriculum-semantic-search/evaluation/validation/validate-ground-truth.ts)

**Test first**: Write test proving validation fails when `pedagogical-intent` is missing.

**Changes**:

```typescript
const REQUIRED_CATEGORIES = [
  'precise-topic',
  'natural-expression',
  'imprecise-input',
  'cross-topic',
  'pedagogical-intent',  // ADD
] as const;

const CATEGORY_MINIMUMS: Readonly<Record<string, number>> = {
  'precise-topic': 4,
  'natural-expression': 2,
  'imprecise-input': 1,
  'cross-topic': 1,
  'pedagogical-intent': 1,  // ADD
};
```

**Documentation**: Update TSDoc for `REQUIRED_CATEGORIES` and `checkCategoryCoverage()`.

### 1.2 Update GROUND-TRUTH-PROCESS.md

**File**: [`GROUND-TRUTH-PROCESS.md`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md)

Update checklist from "0-1 (optional)" to "1+ (required)" for `pedagogical-intent`.

### Acceptance Criteria - Part 1

- [ ] Unit test exists proving validation fails when `pedagogical-intent` count is 0
- [ ] `REQUIRED_CATEGORIES` includes `'pedagogical-intent'`
- [ ] `CATEGORY_MINIMUMS['pedagogical-intent']` equals 1
- [ ] TSDoc updated on `REQUIRED_CATEGORIES` and `checkCategoryCoverage()`
- [ ] `GROUND-TRUTH-PROCESS.md` updated
- [ ] `pnpm ground-truth:validate` fails with clear error about missing `pedagogical-intent` (expected - not yet added)

---

## Part 2: Add Pedagogical-Intent Queries to All 29 Entries

### Query Design Principles

From a **teacher's perspective**, treating the system as a black box:

| Pattern | Example | What It Tests |

|---------|---------|---------------|

| Teaching goal | "starter activity to hook year 7" | Purpose-based selection |

| Audience context | "visual resources for reluctant readers" | Differentiation |

| Lesson type | "consolidation activity after unit" | Sequence position |

| Teaching approach | "hands-on practical for kinaesthetic learners" | Learning style |

### Files to Modify (29 entries)

Primary (14):

- `art/primary`, `computing/primary`, `cooking-nutrition/primary`, `design-technology/primary`
- `english/primary`, `french/primary`, `geography/primary`, `history/primary`
- `maths/primary`, `music/primary`, `physical-education/primary`, `religious-education/primary`
- `science/primary`, `spanish/primary`

Secondary (15):

- `art/secondary`, `citizenship/secondary`, `computing/secondary`, `cooking-nutrition/secondary`
- `design-technology/secondary`, `english/secondary`, `french/secondary`, `geography/secondary`
- `german/secondary`, `history/secondary`, `music/secondary`, `physical-education/secondary`
- `religious-education/secondary`, `science/secondary`, `spanish/secondary`

Note: `maths/secondary` already has 5 `pedagogical-intent` queries.

### Query Template

```typescript
{
  query: '[teaching goal] [context]',
  expectedRelevance: {
    'lesson-slug-1': 3,
    'lesson-slug-2': 2,
  },
  category: 'pedagogical-intent',
  description: 'Tests [specific teacher scenario being validated].',
  priority: 'exploratory',
}
```

### Subject-Specific Examples

| Subject | Query | Reasoning |

|---------|-------|-----------|

| Science | "hands-on experiment for reluctant learners" | Engagement-focused |

| English | "creative writing warm-up activity" | Lesson type intent |

| History | "starter activity to hook year 8" | Year-group + purpose |

| Geography | "consolidation activity after fieldwork" | Sequence position |

| PE | "indoor alternative for wet weather" | Context adaptation |

| MFL | "confidence building speaking practice" | Skill development |

| Music | "introduction for non-musicians" | Audience differentiation |

| Art | "observational drawing for beginners" | Skill level |

| Computing | "unplugged activity without computers" | Resource constraint |

| RE | "discussion starter for sensitive topic" | Pedagogical approach |

| DT | "design brief for mixed ability class" | Differentiation |

| Cooking | "quick practical for 30 minute lesson" | Time constraint |

| Citizenship | "debate preparation resources" | Activity type |

### Validation of Slugs

Each query's `expectedRelevance` slugs must:

1. Exist in bulk data (checked by validation script)
2. Match the entry's subject (checked by cross-subject validation)
3. Have graded relevance (at least one score=3, varied scores)

### Acceptance Criteria - Part 2

- [ ] All 30 entries have at least 1 `pedagogical-intent` query
- [ ] Each query has 2-5 slugs with varied relevance scores (3, 2, 1)
- [ ] Each query is 3-10 words
- [ ] Each query has a description explaining the teacher scenario
- [ ] `pnpm ground-truth:validate` passes with 0 errors
- [ ] `pnpm type-check` passes

---

## Part 3: Per-Category Benchmark Output

### 3.1 Extend QueryResult with Category (TDD)

**File**: [`benchmark-query-runner.ts`](apps/oak-open-curriculum-semantic-search/evaluation/analysis/benchmark-query-runner.ts)

```typescript
export interface QueryResult {
  readonly category: QueryCategory;  // ADD
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision10: number;
  readonly recall10: number;
  readonly latencyMs: number;
  readonly hasHit: boolean;
}
```

Update `RunQueryInput` to include category:

```typescript
export interface RunQueryInput {
  readonly category: QueryCategory;  // ADD
  // ... existing fields
}
```

### 3.2 Add CategoryResult Type and Aggregation (TDD)

**File**: [`benchmark-stats.ts`](apps/oak-open-curriculum-semantic-search/evaluation/analysis/benchmark-stats.ts)

```typescript
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth/types.js';

export interface CategoryResult {
  readonly category: QueryCategory;
  readonly queryCount: number;
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision10: number;
  readonly recall10: number;
  readonly zeroHitRate: number;
  readonly p95LatencyMs: number;
}

/** Group query results by category and calculate aggregate metrics. */
export function aggregateByCategory(
  results: readonly QueryResult[]
): readonly CategoryResult[];
```

### 3.3 Update EntryBenchmarkResult (TDD)

**File**: [`benchmark-entry-runner.ts`](apps/oak-open-curriculum-semantic-search/evaluation/analysis/benchmark-entry-runner.ts)

```typescript
export interface EntryBenchmarkResult {
  // ... existing fields
  readonly perCategory: readonly CategoryResult[];  // ADD
}
```

Update `aggregateResults()` to call `aggregateByCategory()`.

### 3.4 Update Benchmark Output (TDD)

**File**: [`benchmark-main.ts`](apps/oak-open-curriculum-semantic-search/evaluation/analysis/benchmark-main.ts)

Add `printDetailedResults()` function that outputs the full grid:

```
Subject       | Phase     | Category           | #Q | MRR   | NDCG  | P@10  | R@10  | Zero% | p95ms
--------------+-----------+--------------------+----+-------+-------+-------+-------+-------+-------
art           | primary   | precise-topic      | 5  | 0.920 | 0.810 | 0.170 | 0.830 | 0.0%  | 234
art           | primary   | natural-expression | 2  | 0.750 | 0.680 | 0.150 | 0.710 | 5.0%  | 198
art           | primary   | imprecise-input    | 1  | 1.000 | 0.900 | 0.200 | 0.900 | 0.0%  | 312
art           | primary   | cross-topic        | 1  | 0.500 | 0.450 | 0.100 | 0.500 | 10.0% | 287
art           | primary   | pedagogical-intent | 1  | 0.333 | 0.300 | 0.080 | 0.400 | 20.0% | 445
art           | primary   | AGGREGATE          | 10 | 0.778 | 0.700 | 0.150 | 0.720 | 4.0%  | 312
--------------+-----------+--------------------+----+-------+-------+-------+-------+-------+-------
```

This replaces the current aggregate-only output. The detailed grid is ALWAYS shown (not a verbose option).

### 3.5 Clarify --verbose Flag Semantics

**File**: [`benchmark-main.ts`](apps/oak-open-curriculum-semantic-search/evaluation/analysis/benchmark-main.ts)

Update TSDoc:

```typescript
/**
 * CLI options parsed from command line arguments.
 *
 * @remarks
 * The `verbose` flag ONLY enables `logger.debug()` calls for diagnostic output.
 * It does NOT change the output granularity - per-category metrics are always shown.
 */
export interface CliOptions {
  // ...
  /** Enable logger.debug() diagnostic output. Does NOT change result granularity. */
  readonly verbose: boolean;
}
```

Update help text to match.

### Acceptance Criteria - Part 3

- [ ] `QueryResult` includes `category` field
- [ ] `CategoryResult` type defined with all 6 metrics
- [ ] `aggregateByCategory()` pure function with unit tests
- [ ] `EntryBenchmarkResult` includes `perCategory` array
- [ ] `pnpm benchmark --all` outputs full per-category grid for every entry
- [ ] Aggregate row shown after each entry's category breakdown
- [ ] `--verbose` TSDoc clarifies it only enables logger.debug()
- [ ] All existing benchmark tests pass

---

## Part 4: Documentation and Quality Gates

### 4.1 Update ADR-085

**File**: [`085-ground-truth-validation-discipline.md`](docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)

Add `pedagogical-intent` to required categories list.

### 4.2 Update semantic-search.prompt.md

**File**: [`.agent/prompts/semantic-search/semantic-search.prompt.md`](.agent/prompts/semantic-search/semantic-search.prompt.md)

Update status from "Two Critical Improvements Required" to reflect completion.

### 4.3 Run Full Quality Gate Suite

```bash
# From repo root, one at a time
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

### Acceptance Criteria - Part 4

- [ ] ADR-085 updated with `pedagogical-intent` as required
- [ ] semantic-search.prompt.md updated
- [ ] All 11 quality gates pass
- [ ] No new lint warnings or type errors

---

## Implementation Order

1. **Part 1.1**: TDD validation script update (test first, then code)
2. **Part 1.2**: Documentation update
3. **Part 2**: Add queries (batch by subject type: STEM, Humanities, MFL, Creative)
4. **Part 3.1-3.3**: TDD benchmark types and aggregation
5. **Part 3.4**: TDD output formatting
6. **Part 3.5**: Clarify verbose semantics
7. **Part 4**: Documentation and quality gates

---

## Success Criteria (Overall)

| Criterion | Measurement |

|-----------|-------------|

| All 30 entries have `pedagogical-intent` | `pnpm ground-truth:validate` passes |

| Per-category output works | `pnpm benchmark --all` shows grid |

| No regressions | All quality gates pass |

| Documentation current | ADR-085, prompt, process doc updated |
