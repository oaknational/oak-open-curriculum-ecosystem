---
name: Maths GT Phase 1C
overview: "Phase 1C comparison for all 24 maths ground truth queries (12 primary, 12 secondary). For each query: run benchmark --review, create three-way comparison table (COMMIT vs SEARCH vs EXPECTED), answer critical question with justification, record ALL 4 metrics, update .expected.ts if needed."
todos:
  - id: phase0
    content: "PHASE 0: Verify MCP server and benchmark tool are working"
    status: completed
  - id: pri-pt1
    content: "PRIMARY precise-topic-1: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-pt2
    content: "PRIMARY precise-topic-2: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-pt3
    content: "PRIMARY precise-topic-3: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ne1
    content: "PRIMARY natural-expression-1: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ne2
    content: "PRIMARY natural-expression-2: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ne3
    content: "PRIMARY natural-expression-3: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ii1
    content: "PRIMARY imprecise-input-1: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ii2
    content: "PRIMARY imprecise-input-2: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ii3
    content: "PRIMARY imprecise-input-3: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ct1
    content: "PRIMARY cross-topic-1: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ct2
    content: "PRIMARY cross-topic-2: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: pri-ct3
    content: "PRIMARY cross-topic-3: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-pt1
    content: "SECONDARY precise-topic-1: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-pt2
    content: "SECONDARY precise-topic-2: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-pt3
    content: "SECONDARY precise-topic-3: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ne1
    content: "SECONDARY natural-expression-1: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ne2
    content: "SECONDARY natural-expression-2: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ne3
    content: "SECONDARY natural-expression-3: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ii1
    content: "SECONDARY imprecise-input-1: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ii2
    content: "SECONDARY imprecise-input-2: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ii3
    content: "SECONDARY imprecise-input-3: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ct1
    content: "SECONDARY cross-topic-1: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ct2
    content: "SECONDARY cross-topic-2: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
  - id: sec-ct3
    content: "SECONDARY cross-topic-3: benchmark --review, three-way comparison, critical question, record 4 metrics"
    status: completed
---

# Maths Ground Truth Phase 1C — Comparison

**Scope**: Phase 1C ONLY for 24 maths queries (12 primary + 12 secondary)

**Prerequisite**: Phase 1B COMMIT tables are complete — independent rankings exist for all queries

---

## Phase 0: Prerequisites

Verify tools before starting:

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local

# Verify MCP server
# Call get-help to confirm working

# Verify benchmark
pnpm benchmark --help
```

---

## Phase 1C Protocol (Per Query)

For EACH query, execute these 5 steps:

### Step 1C.0: Pre-comparison verification

- Confirm COMMIT rankings exist from Phase 1B
- Confirm rankings were made BEFORE benchmark and BEFORE seeing expected slugs

### Step 1C.1: Run benchmark --review

```bash
pnpm benchmark -s maths -p [primary|secondary] -c [category] --review
```

- Record ALL 4 metrics: MRR, NDCG@10, P@3, R@10
- This is the first time seeing expected slugs and search results

### Step 1C.2: Three-way comparison table

| Slug | COMMIT Rank | SEARCH Rank | EXPECTED Score | Key Learning | Verdict |

|------|-------------|-------------|----------------|--------------|---------|

### Step 1C.3: Critical question

"What are the BEST slugs for this query — and where did they come from?"

- Decision: GT correct / Search better / COMMIT better / Mix is best
- Justification referencing key learning

### Step 1C.4: Record metrics

| Metric | Value | Target | Status |

|--------|-------|--------|--------|

| MRR | ___ | > 0.70 | |

| NDCG@10 | ___ | > 0.75 | |

| P@3 | ___ | > 0.50 | |

| R@10 | ___ | > 0.70 | |

### Step 1C.5: Update .expected.ts if needed

If COMMIT rankings differ from existing expected slugs, update the file.

---

## PRIMARY Queries (12)

### precise-topic-1

- **Query**: "place value tens and ones"
- **COMMIT top slug**: `introducing-tens-and-ones` (score 3)
- **File**: `maths/primary/precise-topic.expected.ts`

### precise-topic-2

- **Query**: "multiplication arrays year 3"
- **COMMIT top slug**: `linking-multiplication-and-repeated-addition-using-arrays` (score 3)
- **File**: `maths/primary/precise-topic-2.expected.ts`

### precise-topic-3

- **Query**: "equivalent fractions same value"
- **COMMIT top slug**: `equivalent-fractions-unit-fractions` (score 3)
- **File**: `maths/primary/precise-topic-3.expected.ts`

### natural-expression-1

- **Query**: "sharing equally into groups"
- **COMMIT top slug**: `sharing-equally-between-groups` (score 3)
- **File**: `maths/primary/natural-expression.expected.ts`

### natural-expression-2

- **Query**: "counting in groups of"
- **COMMIT top slug**: `counting-in-groups-of-2` (score 3)
- **File**: `maths/primary/natural-expression-2.expected.ts`

### natural-expression-3

- **Query**: "splitting numbers into parts"
- **COMMIT top slug**: `representing-the-part-whole-model` (score 3)
- **File**: `maths/primary/natural-expression-3.expected.ts`

### imprecise-input-1

- **Query**: "halfs and quarters"
- **COMMIT top slug**: `equal-and-unequal-parts-halves-and-quarters` (score 3)
- **File**: `maths/primary/imprecise-input.expected.ts`

### imprecise-input-2

- **Query**: "multiplikation timetables"
- **COMMIT top slug**: `2-times-table` (score 3)
- **File**: `maths/primary/imprecise-input-2.expected.ts`

### imprecise-input-3

- **Query**: "adding frations togethr"
- **COMMIT top slug**: `adding-2-or-more-fractions-within-a-whole` (score 3)
- **File**: `maths/primary/imprecise-input-3.expected.ts`

### cross-topic-1

- **Query**: "fractions word problems money"
- **COMMIT top slug**: `applying-money-understanding-to-fraction-problems-of-an-amount` (score 3)
- **File**: `maths/primary/cross-topic.expected.ts`

### cross-topic-2

- **Query**: "shapes symmetry patterns"
- **COMMIT top slug**: `vertical-lines-of-symmetry-within-shapes` (score 3)
- **File**: `maths/primary/cross-topic-2.expected.ts`

### cross-topic-3

- **Query**: "multiplication area rectangles"
- **COMMIT top slug**: `multiplying-2-digit-by-1-digit-area-models` (score 3)
- **File**: `maths/primary/cross-topic-3.expected.ts`

---

## SECONDARY Queries (12)

### precise-topic-1

- **Query**: "solving quadratic equations by factorising"
- **COMMIT top slug**: `solving-quadratics-by-factorising` (score 3)
- **File**: `maths/secondary/precise-topic.expected.ts`

### precise-topic-2

- **Query**: "interior angles polygons"
- **COMMIT top slug**: `interior-angles-of-polygons` (score 3)
- **File**: `maths/secondary/precise-topic-2.expected.ts`

### precise-topic-3

- **Query**: "calculating mean from frequency table"
- **COMMIT top slug**: `calculating-the-mean-from-a-frequency-table` (score 3)
- **File**: `maths/secondary/precise-topic-3.expected.ts`

### natural-expression-1

- **Query**: "working out percentages from amounts"
- **COMMIT top slug**: `checking-and-securing-understanding-of-finding-a-percentage` (score 3)
- **File**: `maths/secondary/natural-expression.expected.ts`

### natural-expression-2

- **Query**: "finding the unknown number"
- **COMMIT top slug**: `finding-the-unknown` (score 3)
- **File**: `maths/secondary/natural-expression-2.expected.ts`

### natural-expression-3

- **Query**: "how steep is the line"
- **COMMIT top slug**: `understanding-gradient` (score 3)
- **File**: `maths/secondary/natural-expression-3.expected.ts`

### imprecise-input-1

- **Query**: "simulatneous equasions substitution method"
- **COMMIT top slug**: `solving-simultaneous-linear-equations-by-substitution` (score 3)
- **File**: `maths/secondary/imprecise-input.expected.ts`

### imprecise-input-2

- **Query**: "pythagorus theorum triangles"
- **COMMIT top slug**: `demonstrating-pythagoras-theorem` (score 3)
- **File**: `maths/secondary/imprecise-input-2.expected.ts`

### imprecise-input-3

- **Query**: "probablity tree diagrams"
- **COMMIT top slug**: `calculating-theoretical-probabilities-from-probability-tree-diagrams-one-event` (score 3)
- **File**: `maths/secondary/imprecise-input-3.expected.ts`

### cross-topic-1

- **Query**: "combining algebra with graphs"
- **COMMIT top slug**: `equations-and-their-graphs` (score 3)
- **File**: `maths/secondary/cross-topic.expected.ts`

### cross-topic-2

- **Query**: "geometry proof coordinate"
- **COMMIT top slug**: `rate-of-change-from-a-coordinate-pair` (score 2)
- **File**: `maths/secondary/cross-topic-2.expected.ts`

### cross-topic-3

- **Query**: "ratio proportion percentage"
- **COMMIT top slug**: `problem-solving-with-percentages-and-proportionality` (score 3)
- **File**: `maths/secondary/cross-topic-3.expected.ts`

---

## File Paths

**Query files** (read for context):

- `src/lib/search-quality/ground-truth/maths/primary/*.query.ts`
- `src/lib/search-quality/ground-truth/maths/secondary/*.query.ts`

**Expected files** (read in Phase 1C, potentially update):

- `src/lib/search-quality/ground-truth/maths/primary/*.expected.ts`
- `src/lib/search-quality/ground-truth/maths/secondary/*.expected.ts`

---

## Execution Order

Execute queries in this order to maintain focus:

1. PRIMARY precise-topic (3 queries)
2. PRIMARY natural-expression (3 queries)
3. PRIMARY imprecise-input (3 queries)
4. PRIMARY cross-topic (3 queries)
5. SECONDARY precise-topic (3 queries)
6. SECONDARY natural-expression (3 queries)
7. SECONDARY imprecise-input (3 queries)
8. SECONDARY cross-topic (3 queries)

---

## Cardinal Rules

1. **Three-way comparison is mandatory** — COMMIT vs SEARCH vs EXPECTED must all be distinct columns
2. **ALL 4 metrics for EVERY query** — MRR, NDCG@10, P@3, R@10
3. **Justify decisions with key learning quotes** — Not just "seems relevant"
4. **Update .expected.ts if COMMIT differs** — The COMMIT rankings represent exhaustive Phase 1B discovery
5. **No shortcuts between queries** — Each query gets its own benchmark run and comparison

---

## Quality Reminder

There is no time pressure. The goal is correct ground truth, not fast completion. Maths is the critical subject — these ground truths must be absolutely correct.
