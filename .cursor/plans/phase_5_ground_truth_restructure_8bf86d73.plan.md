---
name: "Phase 5: Ground Truth Restructure"
overview: Restructure ground truths by phase (primary/secondary) to align with curriculum structure and eliminate measurement artefacts. Split into 5a (infrastructure) and 5b (content creation for maths/primary/).
todos:
  - id: foundation-reread
    content: Re-read rules.md, testing-strategy.md, schema-first-execution.md
    status: completed
  - id: 5a-maths-structure
    content: Create maths/ directory structure, move existing secondary files
    status: completed
    dependencies:
      - foundation-reread
  - id: 5a-english-merge
    content: Merge english/ks3/ and english/ks4/ into english/secondary/
    status: completed
    dependencies:
      - 5a-maths-structure
  - id: 5a-rename-ks-dirs
    content: Rename all ks3/ directories to secondary/, ks2/ to primary/
    status: completed
    dependencies:
      - 5a-english-merge
  - id: 5a-fix-corrupted
    content: Fix corrupted UNIT_* export names from failed sed command
    status: pending
    dependencies:
      - 5a-rename-ks-dirs
  - id: 5a-update-analyze
    content: Update analyze-cross-curriculum.ts for phase-based loading
    status: completed
    dependencies:
      - 5a-fix-corrupted
  - id: 5a-update-consumers
    content: Update remaining consumer files to use new export names
    status: pending
    dependencies:
      - 5a-fix-corrupted
  - id: 5a-quality-gates
    content: Run full quality gate suite for Phase 5a
    status: pending
    dependencies:
      - 5a-update-consumers
  - id: 5b-discover-content
    content: Use MCP tools to discover KS1+KS2 maths units and lessons
    status: pending
    dependencies:
      - 5a-quality-gates
  - id: 5b-create-queries
    content: Create maths/primary/ ground truth files (30+ queries)
    status: pending
    dependencies:
      - 5b-discover-content
  - id: 5b-validate-slugs
    content: Validate all new slugs via MCP get-lessons-summary
    status: pending
    dependencies:
      - 5b-create-queries
  - id: 5b-quality-gates
    content: Run full quality gate suite for Phase 5b
    status: pending
    dependencies:
      - 5b-validate-slugs
  - id: phase6-reindex
    content: Add phase_slug to ES documents via update-by-query
    status: pending
    dependencies:
      - 5b-quality-gates
  - id: phase7-baselines
    content: Run comprehensive phase-based baselines for all subjects
    status: pending
    dependencies:
      - phase6-reindex
  - id: documentation
    content: Update semantic-search.prompt.md, current-state.md, create ADR if needed
    status: completed
    dependencies:
      - phase7-baselines
---

# Phase 5: Ground Truth Restructure - Phase-Aligned Architecture

## 🚨 Current State (2026-01-03): Needs Recovery

**Phase 5a is ~80% complete but has corrupted files from a timed-out sed command.**

### What Was Done

- ✅ All `ks3/` directories renamed to `secondary/`
- ✅ All `ks2/` directories renamed to `primary/`
- ✅ English `ks3/` + `ks4/` merged into `english/secondary/`
- ✅ Maths files moved to `maths/secondary/`
- ✅ Export names updated from `KS3_` to `SECONDARY_`
- ✅ Root `index.ts` cleaned up (no deprecated aliases)
- ✅ `analyze-cross-curriculum.ts` updated

### What Went Wrong

A `sed` command timed out mid-execution, corrupting some export names:

- `UNIT_GROUND_TRUTH_QUERIES` → `UNIT_MATHS_SECONDARY_STANDARD_QUERIES` (WRONG)
- `UNIT_HARD_GROUND_TRUTH_QUERIES` → `UNIT_HARD_MATHS_SECONDARY_STANDARD_QUERIES` (WRONG)

### Fix Required

```bash
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp

# Fix corrupted UNIT names
find apps/oak-open-curriculum-semantic-search -name "*.ts" -exec sed -i '' 's/UNIT_MATHS_SECONDARY_STANDARD_QUERIES/UNIT_GROUND_TRUTH_QUERIES/g' {} \;
find apps/oak-open-curriculum-semantic-search -name "*.ts" -exec sed -i '' 's/UNIT_HARD_MATHS_SECONDARY_STANDARD_QUERIES/UNIT_HARD_GROUND_TRUTH_QUERIES/g' {} \;
find apps/oak-open-curriculum-semantic-search -name "*.ts" -exec sed -i '' 's/UNIT_ALL_MATHS_SECONDARY_STANDARD_QUERIES/UNIT_ALL_GROUND_TRUTH_QUERIES/g' {} \;

# Verify
grep -r "UNIT_.*MATHS_SECONDARY_STANDARD" apps/oak-open-curriculum-semantic-search/

# Then run quality gates
pnpm type-check
pnpm lint:fix
pnpm test
```

---

## Impact Statement

**Who benefits**: Teachers searching "all primary maths", AI agents needing accurate curriculum context, our team measuring search quality accurately.**The core problem**: Ground truths for Primary span KS1+KS2, but the test harness only supported single key stage filters. English KS1 (0.131 MRR) and KS2 (0.107 MRR) baselines are test artefacts, not search quality issues.**The solution**: Organise ground truths by phase (primary/secondary) so they align with how the curriculum is structured and how filters are applied.---

## Pre-Work: Re-read Foundation Documents

Before starting, re-read and commit to:

- [rules.md](.agent/directives-and-memory/rules.md) - First Question, TDD, no type shortcuts
- [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md) - TDD at ALL levels
- [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

---

## Phase 5a: Infrastructure Restructure (Mechanical)

### Current State Analysis

| Subject | Current Structure | Target Structure | Action ||---------|------------------|------------------|--------|| **Maths** | Root-level files + `units/` | `maths/secondary/` | Move and reorganise || **English** | `primary/`, `ks3/`, `ks4/` | `primary/`, `secondary/` | Merge ks3+ks4 || **Science** | `primary/`, `ks3/` | `primary/`, `secondary/` | Rename ks3 || **History** | `primary/`, `ks3/` | `primary/`, `secondary/` | Rename ks3 || **Cooking** | `ks2/` | `primary/` | Rename ks2 || **All others** | `ks3/` only | `secondary/` | Rename ks3 |

### Step 1: Create Maths Directory Structure

Create `maths/` directory and move existing secondary content:

```javascript
ground-truth/
├── maths/                    # NEW directory
│   ├── secondary/            # Move from root
│   │   ├── algebra.ts        # From ./algebra.ts
│   │   ├── geometry.ts       # From ./geometry.ts
│   │   ├── number.ts         # From ./number.ts
│   │   ├── graphs.ts         # From ./graphs.ts
│   │   ├── statistics.ts     # From ./statistics.ts
│   │   ├── hard-queries.ts   # From ./hard-queries.ts
│   │   ├── units/            # From ./units/
│   │   └── index.ts          # NEW: exports
│   └── index.ts              # NEW: aggregates primary + secondary
```

**Files to move**:

- `algebra.ts` -> `maths/secondary/algebra.ts`
- `geometry.ts` -> `maths/secondary/geometry.ts`
- `number.ts` -> `maths/secondary/number.ts`
- `graphs.ts` -> `maths/secondary/graphs.ts`
- `statistics.ts` -> `maths/secondary/statistics.ts`
- `hard-queries.ts` -> `maths/secondary/hard-queries.ts`
- `edge-cases.ts` -> `maths/secondary/edge-cases.ts`
- `units/` -> `maths/secondary/units/`

**Files to update**:

- [index.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/index.ts) - Update imports

### Step 2: Restructure English (Merge KS3 + KS4)

Create `english/secondary/` by merging content:

```javascript
ground-truth/english/
├── primary/                  # Keep as-is
├── secondary/                # NEW: merge ks3/ + ks4/
│   ├── fiction.ts            # From ks3/
│   ├── poetry.ts             # Merge ks3/ + ks4/
│   ├── shakespeare.ts        # Merge ks3/ + ks4/
│   ├── modern-texts.ts       # From ks4/
│   ├── nineteenth-century.ts # From ks4/
│   ├── non-fiction.ts        # From ks4/
│   ├── hard-queries.ts       # Merge ks3/ + ks4/
│   └── index.ts              # NEW
├── ks3/                      # DELETE after merge
├── ks4/                      # DELETE after merge
└── index.ts                  # Update exports
```



### Step 3: Rename KS Directories to Phase Directories

| Subject | From | To ||---------|------|-----|| Science | `ks3/` | `secondary/` || History | `ks3/` | `secondary/` || Geography | `ks3/` | `secondary/` || French | `ks3/` | `secondary/` || Spanish | `ks3/` | `secondary/` || German | `ks3/` | `secondary/` || Computing | `ks3/` | `secondary/` || Art | `ks3/` | `secondary/` || Music | `ks3/` | `secondary/` || D&T | `ks3/` | `secondary/` || PE | `ks3/` | `secondary/` || RE | `ks3/` | `secondary/` || Citizenship | `ks3/` | `secondary/` || Cooking | `ks2/` | `primary/` |

### Step 4: Update analyze-cross-curriculum.ts

Update the `GROUND_TRUTHS_BY_SUBJECT_AND_KS` mapping in [analyze-cross-curriculum.ts](apps/oak-open-curriculum-semantic-search/evaluation/analysis/analyze-cross-curriculum.ts) to support phase-based loading:

```typescript
// Current: loads by key stage
const GROUND_TRUTHS_BY_SUBJECT_AND_KS = {
  maths: { ks4: ALL_MATHS_GROUND_TRUTH_QUERIES },
  english: { ks1: ENGLISH_PRIMARY_ALL_QUERIES, ks2: ENGLISH_PRIMARY_ALL_QUERIES, ... },
  ...
};

// Target: add phase-based loading
const GROUND_TRUTHS_BY_SUBJECT_AND_PHASE = {
  maths: { secondary: MATHS_SECONDARY_ALL_QUERIES },
  english: { primary: ENGLISH_PRIMARY_ALL_QUERIES, secondary: ENGLISH_SECONDARY_ALL_QUERIES },
  ...
};
```



### Step 5: Update Root index.ts Exports

Update [ground-truth/index.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/index.ts) to:

- Import from new `maths/` directory
- Export phase-based aggregations
- Maintain backwards compatibility for existing `ALL_MATHS_GROUND_TRUTH_QUERIES`

### Step 6: Verify Query Counts

Before and after counts must match:

- **Total queries**: 263
- **Maths KS4**: 55 (40 standard + 15 hard)
- **English**: 66 (across all phases)
- Other subjects as documented in index.ts

### 5a Acceptance Criteria

| Criterion | Verification ||-----------|-------------|| All subjects have phase-based directories | Directory structure check || No ks1/, ks2/, ks3/, ks4/ directories remain | Directory structure check || Total query count unchanged (263) | Count comparison || All existing exports still work | TypeScript compilation || analyze-cross-curriculum.ts works with --phase | Manual test || Quality gates pass | Full gate run |---

## Phase 5b: Create Maths Primary Ground Truths

### Methodology

This is systematic extraction work using:

1. **MCP tools** to discover KS1+KS2 maths content
2. **Bulk download data** for validation
3. **Existing ground truth patterns** for query structure

### MCP Commands for Discovery

```bash
# List KS1 maths units
get-key-stages-subject-units --keyStage ks1 --subject maths

# List KS2 maths units  
get-key-stages-subject-units --keyStage ks2 --subject maths

# List lessons per unit
get-key-stages-subject-lessons --keyStage ks1 --subject maths
get-key-stages-subject-lessons --keyStage ks2 --subject maths

# Validate slugs exist
get-lessons-summary --lesson <slug>
```



### Target Topics (Based on Primary Maths Curriculum)

| Topic Area | Example Queries | KS Coverage ||------------|----------------|-------------|| Number: Place Value | "tens and ones", "place value" | KS1+KS2 || Number: Addition/Subtraction | "adding two digit numbers", "column addition" | KS1+KS2 || Number: Multiplication/Division | "times tables", "long division" | KS1+KS2 || Number: Fractions | "equivalent fractions", "adding fractions" | KS2 || Shape: 2D/3D | "properties of shapes", "2D shapes" | KS1+KS2 || Measurement | "measuring length", "time telling" | KS1+KS2 || Statistics | "pictograms", "bar charts" | KS1+KS2 |

### Ground Truth Structure

```typescript
// maths/primary/number.ts
export const NUMBER_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'adding two digit numbers',
    expectedRelevance: {
      'adding-two-digit-numbers-crossing-ten': 3,
      'adding-two-digit-numbers': 3,
    },
    category: 'naturalistic',
  },
  // ... more queries
] as const;
```



### Category Distribution Target

| Category | Target Count | Purpose ||----------|-------------|---------|| naturalistic | ~15 | Teacher language queries || misspelling | ~5 | Common typos || synonym | ~5 | Alternative terminology || multi-concept | ~3 | Topic intersections || colloquial | ~2 | Informal language |**Total target: 30+ queries**

### 5b Acceptance Criteria

| Criterion | Verification ||-----------|-------------|| `maths/primary/` directory exists | Directory check || 30+ queries created | Query count || All slugs validated via MCP | Validation script || Coverage across all primary maths topics | Topic review || Categories distributed appropriately | Category count || Quality gates pass | Full gate run |---

## Phase 6: ES Re-index (Follows Phase 5)

Add `phase_slug` to existing ES documents via update-by-query:

```bash
# From Kibana Dev Tools
POST oak_lessons/_update_by_query
{
  "script": {
    "source": "ctx._source.phase_slug = (ctx._source.key_stage == 'ks1' || ctx._source.key_stage == 'ks2') ? 'primary' : 'secondary'"
  }
}
```

Repeat for `oak_units` and `oak_unit_rollup` indices.---

## Phase 7: Run Phase-Based Baselines

After restructure, run comprehensive baselines:

```bash
cd apps/oak-open-curriculum-semantic-search

# Core subjects - both phases
for subject in english maths science; do
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase primary
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase secondary
done

# Secondary-only subjects
for subject in french spanish german computing art music design-technology citizenship religious-education physical-education geography; do
  pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject $subject --phase secondary
done
```

Record all results in [EXPERIMENT-LOG.md](.agent/evaluations/EXPERIMENT-LOG.md).---

## Documentation Requirements

1. **TSDoc**: All new files, index exports, and query arrays
2. **Update semantic-search.prompt.md**: Reflect phase-based structure
3. **Update current-state.md**: Phase-based baseline matrix
4. **ADR-XXX**: "Phase-Aligned Ground Truth Architecture" (if significant architectural decision)

---

## Quality Gates

Run after each step (from repo root):

```bash
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

**All gates must pass before proceeding to next step.**---