---
name: Maths GT Phase 1B
overview: Exhaustive Phase 1B discovery for all 24 maths ground truth queries (12 primary + 12 secondary). Each query receives independent bulk data exploration, MCP summary analysis, and committed rankings - with NO shortcuts, NO reference to expected files, and NO consideration of search results.
todos:
  - id: phase0-prereq
    content: "PHASE 0: Verify bulk data exists, MCP server works, create working files, record lesson/unit counts"
    status: completed
  - id: p1-place-value
    content: "P1: precise-topic 'place value tens and ones' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p2-arrays
    content: "P2: precise-topic-2 'multiplication arrays year 3' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p3-equivalent-fractions
    content: "P3: precise-topic-3 'equivalent fractions same value' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p4-sharing-equally
    content: "P4: natural-expression 'sharing equally into groups' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p5-counting-groups
    content: "P5: natural-expression-2 'counting in groups of' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p6-splitting-numbers
    content: "P6: natural-expression-3 'splitting numbers into parts' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p7-halfs-quarters
    content: "P7: imprecise-input 'halfs and quarters' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p8-multiplikation
    content: "P8: imprecise-input-2 'multiplikation timetables' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p9-adding-frations
    content: "P9: imprecise-input-3 'adding frations togethr' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p10-fractions-money
    content: "P10: cross-topic 'fractions word problems money' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p11-shapes-symmetry
    content: "P11: cross-topic-2 'shapes symmetry patterns' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: p12-multiplication-area
    content: "P12: cross-topic-3 'multiplication area rectangles' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s1-quadratic-factorising
    content: "S1: precise-topic 'solving quadratic equations by factorising' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s2-interior-angles
    content: "S2: precise-topic-2 'interior angles polygons' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s3-mean-frequency
    content: "S3: precise-topic-3 'calculating mean from frequency table' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s4-percentages
    content: "S4: natural-expression 'working out percentages from amounts' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s5-unknown-number
    content: "S5: natural-expression-2 'finding the unknown number' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s6-steep-line
    content: "S6: natural-expression-3 'how steep is the line' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s7-simultaneous
    content: "S7: imprecise-input 'simulatneous equasions substitution method' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s8-pythagoras
    content: "S8: imprecise-input-2 'pythagorus theorum triangles' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s9-probability-tree
    content: "S9: imprecise-input-3 'probablity tree diagrams' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s10-algebra-graphs
    content: "S10: cross-topic 'combining algebra with graphs' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s11-geometry-proof
    content: "S11: cross-topic-2 'geometry proof coordinate' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: s12-ratio-proportion
    content: "S12: cross-topic-3 'ratio proportion percentage' - holistic exploration, MCP summaries, COMMIT rankings"
    status: completed
  - id: phase2-expected-files
    content: "PHASE 2: Create all expected.ts files based on committed rankings, update index.ts files"
    status: completed
  - id: phase3-comparison
    content: "PHASE 3 (1C): Run benchmarks, create three-way comparison tables, document discrepancies"
    status: completed
  - id: phase4-validation
    content: "PHASE 4: Run type-check, ground-truth:validate, full benchmarks"
    status: completed
  - id: phase5-documentation
    content: "PHASE 5: Update checklist with metrics, learnings, and changes"
    status: completed
---

# Maths Ground Truth Phase 1B - Exhaustive Discovery

This plan covers Phase 1B (Discovery + COMMIT) for all 24 maths queries. Each query is independent and receives the full protocol.

**Foundation Documents (re-read before and during execution)**:

- [rules.md](.agent/directives-and-memory/rules.md) - First Question, TDD, quality principles
- [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md) - TDD at all levels
- [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md) - Schema-first principle

**Cardinal Rules**:

1. Form YOUR OWN opinion - do NOT consult `.expected.ts` files
2. COMMIT rankings BEFORE any benchmark runs
3. EVERY query gets FRESH exploration - no copying between queries
4. Discovery must be HOLISTIC - review ALL units, not just title matches

---

## Phase 0: Prerequisites

### 0.1 Verify Bulk Data Exists

```bash
cd apps/oak-open-curriculum-semantic-search
ls -la bulk-downloads/*.json | wc -l  # Should show maths-primary.json and maths-secondary.json
```

If missing, run `pnpm bulk:download` (requires `OAK_API_KEY` in `.env.local`).

### 0.2 Verify MCP Server

Call `get-help` or `get-ontology` to verify the Oak MCP server is responding.

### 0.3 Create Working Files

```bash
# Extract all lessons for holistic review
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/maths-primary.json > /tmp/maths-primary-all.txt

jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/maths-secondary.json > /tmp/maths-secondary-all.txt

# Extract all units for systematic review
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/maths-primary.json > /tmp/maths-primary-units.txt

jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/maths-secondary.json > /tmp/maths-secondary-units.txt

# Record counts
wc -l /tmp/maths-primary-all.txt   # Expected ~1072 lessons
wc -l /tmp/maths-secondary-all.txt  # Expected ~1073 lessons
```

### 0.4 Record Unit Counts

Document the total number of units and lessons for both phases. These totals represent the scope that MUST be reviewed holistically for each query.

---

## PRIMARY PHASE: 12 Queries

---

## Query P1: precise-topic - "place value tens and ones"

**Query**: `place value tens and ones`

**Category**: precise-topic

**Semantic Intent**: Lessons teaching place value concept specifically with tens and ones (Year 1-2 level content)

### P1.1 Holistic Bulk Data Exploration

1. Review ALL units in `/tmp/maths-primary-units.txt`
2. For EACH unit, consider: could this unit contain place value content?
3. Search bulk data with multiple terms:

   - `place value`
   - `tens and ones`
   - `tens ones`
   - `two-digit`
   - `partition`

```bash
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | select(.lessonTitle | test("place|value|tens|ones|partition|two-digit"; "i")) | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/maths-primary.json
```

1. Record ALL candidates (target: 10+ slugs)

### P1.2 MCP Summary Analysis

1. Call `get-lessons-summary` for 5-10 candidates
2. For each: record keywords and key learning points
3. Quote the specific text that relates to place value with tens and ones

### P1.3 Unit Context

Call `get-units-summary` for units containing candidates to understand lesson ordering and progression.

### P1.4 Analysis and Ranking

For each candidate:

- Does key learning DIRECTLY address place value with tens and ones?
- Is this foundational teaching or application/extension?
- Quote specific evidence

### P1.5 COMMIT Rankings

| Rank | Slug | Score (1-3) | Key Learning Quote | Justification |

|------|------|-------------|-------------------|---------------|

| 1 | | | | |

| 2 | | | | |

| 3 | | | | |

| 4 | | | | |

| 5 | | | | |

---

## Query P2: precise-topic-2 - "multiplication arrays year 3"

**Query**: `multiplication arrays year 3`

**Category**: precise-topic

**Semantic Intent**: Lessons using array representation for multiplication (Year 3 curriculum content)

### P2.1 Holistic Bulk Data Exploration

1. Review ALL units - arrays may appear in multiplication units, but also in other contexts
2. Search with terms:

   - `array`
   - `multiplication`
   - `rows`
   - `columns`
   - `groups of`

### P2.2-P2.5 [Same structure as P1]

---

## Query P3: precise-topic-3 - "equivalent fractions same value"

**Query**: `equivalent fractions same value`

**Category**: precise-topic

**Semantic Intent**: Lessons teaching that equivalent fractions represent the same value

### P3.1 Holistic Bulk Data Exploration

1. Review ALL units - equivalent fractions is a fundamental concept
2. Search with terms:

   - `equivalent`
   - `same value`
   - `equal fractions`
   - `simplify`
   - `common denominator`

### P3.2-P3.5 [Same structure as P1]

---

## Query P4: natural-expression - "sharing equally into groups"

**Query**: `sharing equally into groups`

**Category**: natural-expression

**Semantic Intent**: Informal language for division (partition model)

### P4.1 Holistic Bulk Data Exploration

1. Review ALL units - "sharing" might appear in division units, but also measurement, fractions, etc.
2. Search with terms:

   - `sharing`
   - `equally`
   - `groups`
   - `division`
   - `partition`
   - `distribute`

### P4.2-P4.5 [Same structure as P1]

---

## Query P5: natural-expression-2 - "counting in groups of"

**Query**: `counting in groups of`

**Category**: natural-expression

**Semantic Intent**: Natural teacher language mapping to multiplication (grouping model)

### P5.1-P5.5 [Same structure]

---

## Query P6: natural-expression-3 - "splitting numbers into parts"

**Query**: `splitting numbers into parts`

**Category**: natural-expression

**Semantic Intent**: Informal language mapping to partitioning and number bonds

### P6.1-P6.5 [Same structure]

---

## Query P7: imprecise-input - "halfs and quarters"

**Query**: `halfs and quarters` (misspelling of "halves")

**Category**: imprecise-input

**Semantic Intent**: Fractions lessons about halves and quarters, despite typo

### P7.1 Holistic Bulk Data Exploration

1. Review ALL units - halves/quarters content in fractions units but also measurement, time, etc.
2. Search with CORRECT terms (we're finding the ideal answer):

   - `halves`
   - `quarters`
   - `half`
   - `quarter`
   - `fractions`

### P7.2-P7.5 [Same structure]

---

## Query P8: imprecise-input-2 - "multiplikation timetables"

**Query**: `multiplikation timetables` (misspellings)

**Category**: imprecise-input

**Semantic Intent**: Multiplication times tables lessons, despite typos

### P8.1-P8.5 [Same structure]

---

## Query P9: imprecise-input-3 - "adding frations togethr"

**Query**: `adding frations togethr` (misspellings)

**Category**: imprecise-input

**Semantic Intent**: Adding fractions lessons, despite typos

### P9.1-P9.5 [Same structure]

---

## Query P10: cross-topic - "fractions word problems money"

**Query**: `fractions word problems money`

**Category**: cross-topic

**Semantic Intent**: Lessons combining fractions with money/real-world problems

### P10.1 Holistic Bulk Data Exploration

1. Review ALL units - cross-topic content may be in fractions units, money units, or problem-solving units
2. Search with terms covering BOTH concepts:

   - `fractions` AND `money`
   - `word problems`
   - `real-world`
   - `context`
   - `pounds`
   - `pence`

### P10.2-P10.5 [Same structure]

---

## Query P11: cross-topic-2 - "shapes symmetry patterns"

**Query**: `shapes symmetry patterns`

**Category**: cross-topic

**Semantic Intent**: Lessons combining shapes, symmetry, and patterns

### P11.1-P11.5 [Same structure]

---

## Query P12: cross-topic-3 - "multiplication area rectangles"

**Query**: `multiplication area rectangles`

**Category**: cross-topic

**Semantic Intent**: Lessons connecting multiplication to area calculation (cross-strand)

### P12.1-P12.5 [Same structure]

---

## SECONDARY PHASE: 12 Queries

---

## Query S1: precise-topic - "solving quadratic equations by factorising"

**Query**: `solving quadratic equations by factorising`

**Category**: precise-topic

**Semantic Intent**: Lessons on solving quadratics through factorisation method

### S1.1-S1.5 [Same structure as PRIMARY queries]

---

## Query S2: precise-topic-2 - "interior angles polygons"

**Query**: `interior angles polygons`

**Category**: precise-topic

**Semantic Intent**: Geometry lessons on interior angles of polygons

### S2.1-S2.5 [Same structure]

---

## Query S3: precise-topic-3 - "calculating mean from frequency table"

**Query**: `calculating mean from frequency table`

**Category**: precise-topic

**Semantic Intent**: Statistics lessons on calculating mean from grouped/frequency data

### S3.1-S3.5 [Same structure]

---

## Query S4: natural-expression - "working out percentages from amounts"

**Query**: `working out percentages from amounts`

**Category**: natural-expression

**Semantic Intent**: "Working out" = calculating; percentage calculation lessons

### S4.1-S4.5 [Same structure]

---

## Query S5: natural-expression-2 - "finding the unknown number"

**Query**: `finding the unknown number`

**Category**: natural-expression

**Semantic Intent**: "Unknown number" = variable; algebra/equation solving lessons

### S5.1-S5.5 [Same structure]

---

## Query S6: natural-expression-3 - "how steep is the line"

**Query**: `how steep is the line`

**Category**: natural-expression

**Semantic Intent**: "How steep" = gradient/slope; gradient lessons

### S6.1-S6.5 [Same structure]

---

## Query S7: imprecise-input - "simulatneous equasions substitution method"

**Query**: `simulatneous equasions substitution method` (two misspellings)

**Category**: imprecise-input

**Semantic Intent**: Simultaneous equations using substitution method

### S7.1-S7.5 [Same structure]

---

## Query S8: imprecise-input-2 - "pythagorus theorum triangles"

**Query**: `pythagorus theorum triangles` (multiple misspellings)

**Category**: imprecise-input

**Semantic Intent**: Pythagoras theorem lessons

### S8.1-S8.5 [Same structure]

---

## Query S9: imprecise-input-3 - "probablity tree diagrams"

**Query**: `probablity tree diagrams` (misspelling)

**Category**: imprecise-input

**Semantic Intent**: Probability tree diagram lessons

### S9.1-S9.5 [Same structure]

---

## Query S10: cross-topic - "combining algebra with graphs"

**Query**: `combining algebra with graphs`

**Category**: cross-topic

**Semantic Intent**: Lessons combining algebraic concepts with graphing

### S10.1-S10.5 [Same structure]

---

## Query S11: cross-topic-2 - "geometry proof coordinate"

**Query**: `geometry proof coordinate`

**Category**: cross-topic

**Semantic Intent**: Lessons combining geometric proof with coordinate geometry

### S11.1-S11.5 [Same structure]

---

## Query S12: cross-topic-3 - "ratio proportion percentage"

**Query**: `ratio proportion percentage`

**Category**: cross-topic

**Semantic Intent**: Lessons combining ratio, proportion, and percentage concepts

### S12.1-S12.5 [Same structure]

---

## Phase 2: Create Expected Files

After ALL 24 queries have committed rankings:

1. For each query, create the `.expected.ts` file based on committed rankings
2. Update `index.ts` files to wire in new queries
3. Run `pnpm type-check` to verify

---

## Phase 3: Comparison (Phase 1C)

After expected files are created:

1. Run benchmark for each query: `pnpm benchmark -s maths -p primary -c CATEGORY --review`
2. Create three-way comparison tables
3. Document any discrepancies and their resolution

---

## Phase 4: Validation

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject maths --phase primary --verbose
pnpm benchmark --subject maths --phase secondary --verbose
```

---

## Phase 5: Documentation

Update checklist with:

- Metrics for all 24 queries
- Key learnings
- Changes made
