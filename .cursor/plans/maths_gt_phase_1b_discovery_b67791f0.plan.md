---
name: Maths GT Phase 1B Discovery
overview: "Phase 1B ONLY: Exhaustive independent discovery for all 24 Maths queries (12 primary + 12 secondary) using bulk data AND MCP tools. COMMIT rankings for each query BEFORE any comparison. Phase 1C is out of scope."
todos:
  - id: phase0-verify
    content: "PHASE 0: Verify MCP server (get-help, get-ontology), verify bulk data files exist"
    status: completed
  - id: phase0-primary-lessons
    content: "PHASE 0: List ALL primary lessons to /tmp/maths-primary-all.txt (~1,072 lessons)"
    status: completed
  - id: phase0-secondary-lessons
    content: "PHASE 0: List ALL secondary lessons to /tmp/maths-secondary-all.txt (~1,073 lessons)"
    status: completed
  - id: phase0-primary-units
    content: "PHASE 0: List ALL primary units to /tmp/maths-primary-units.txt (~125 units)"
    status: completed
  - id: phase0-secondary-units
    content: "PHASE 0: List ALL secondary units to /tmp/maths-secondary-units.txt (~98 units)"
    status: completed
  - id: pri-pt1
    content: "PRIMARY precise-topic-1: 'place value tens and ones' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-pt2
    content: "PRIMARY precise-topic-2: 'multiplication arrays year 3' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-pt3
    content: "PRIMARY precise-topic-3: 'equivalent fractions same value' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ne1
    content: "PRIMARY natural-expression-1: 'sharing equally into groups' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ne2
    content: "PRIMARY natural-expression-2: 'counting in groups of' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ne3
    content: "PRIMARY natural-expression-3: 'splitting numbers into parts' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ii1
    content: "PRIMARY imprecise-input-1: 'halfs and quarters' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ii2
    content: "PRIMARY imprecise-input-2: 'multiplikation timetables' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ii3
    content: "PRIMARY imprecise-input-3: 'adding frations togethr' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ct1
    content: "PRIMARY cross-topic-1: 'fractions word problems money' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ct2
    content: "PRIMARY cross-topic-2: 'shapes symmetry patterns' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: pri-ct3
    content: "PRIMARY cross-topic-3: 'multiplication area rectangles' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-pt1
    content: "SECONDARY precise-topic-1: 'solving quadratic equations by factorising' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-pt2
    content: "SECONDARY precise-topic-2: 'interior angles polygons' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-pt3
    content: "SECONDARY precise-topic-3: 'calculating mean from frequency table' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ne1
    content: "SECONDARY natural-expression-1: 'working out percentages from amounts' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ne2
    content: "SECONDARY natural-expression-2: 'finding the unknown number' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ne3
    content: "SECONDARY natural-expression-3: 'how steep is the line' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ii1
    content: "SECONDARY imprecise-input-1: 'simulatneous equasions substitution method' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ii2
    content: "SECONDARY imprecise-input-2: 'pythagorus theorum triangles' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ii3
    content: "SECONDARY imprecise-input-3: 'probablity tree diagrams' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ct1
    content: "SECONDARY cross-topic-1: 'combining algebra with graphs' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ct2
    content: "SECONDARY cross-topic-2: 'geometry proof coordinate' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: sec-ct3
    content: "SECONDARY cross-topic-3: 'ratio proportion percentage' — bulk search + MCP summaries + COMMIT"
    status: completed
  - id: final-check
    content: "FINAL: Verify all 24 COMMIT tables complete with scores, key learning quotes, and justifications"
    status: completed
---

# Maths Ground Truth Phase 1B — Discovery + COMMIT

## Scope

**IN SCOPE**: Phase 1B only — Discovery + COMMIT for all 24 queries

**OUT OF SCOPE**: Phase 1A (complete), Phase 1C onwards (future session)

## Cardinal Rules

1. **DO NOT read `.expected.ts` files** — current expectations are unknown during discovery
2. **DO NOT run benchmark** — search results are unknown during discovery
3. **Fresh analysis for EVERY query** — no copying between queries
4. **Title-only matching is NOT sufficient** — systematic ALL-units review required
5. **100% certainty required** — if not certain, keep exploring

## Phase 0: Prerequisites

### Step 0.1: Verify Tools

```bash
cd apps/oak-open-curriculum-semantic-search
```

- Verify MCP server: call `get-help` tool
- Verify bulk data exists:

  ```bash
  jq '.sequence | length' bulk-downloads/maths-primary.json   # ~125 units
  jq '.sequence | length' bulk-downloads/maths-secondary.json # ~98 units
  ```

### Step 0.2: List ALL Lessons (Reference Files)

**Primary** (~1,072 lessons):

```bash
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/maths-primary.json > /tmp/maths-primary-all.txt
wc -l /tmp/maths-primary-all.txt
```

**Secondary** (~1,073 lessons):

```bash
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/maths-secondary.json > /tmp/maths-secondary-all.txt
wc -l /tmp/maths-secondary-all.txt
```

### Step 0.3: List ALL Units (Must Review ALL for Each Query)

**Primary**:

```bash
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/maths-primary.json > /tmp/maths-primary-units.txt
```

**Secondary**:

```bash
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/maths-secondary.json > /tmp/maths-secondary-units.txt
```

---

## Phase 1B: Discovery + COMMIT

### Protocol Per Query

For EACH query, execute these steps in order:

1. **Read query** from `.query.ts` file (NOT `.expected.ts`)
2. **Search bulk data** with 3+ search terms (10+ candidates)
3. **Review ALL units** list for non-obvious matches
4. **Get MCP summaries** for 5-10 candidates (use `get-lessons-summary`)
5. **Get unit context** for relevant units (use `get-units-summary`)
6. **Analyse candidates** with key learning quotes
7. **COMMIT rankings** — top 5 with scores and justifications

---

## PRIMARY Queries (12 total)

### Query Files Location

```
src/lib/search-quality/ground-truth/maths/primary/
```

### precise-topic-1: "place value tens and ones"

- File: [precise-topic.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/precise-topic.query.ts)
- Capability: Basic retrieval with curriculum terminology
- Search terms: "place value", "tens and ones", "two-digit", "partition"

### precise-topic-2: "multiplication arrays year 3"

- File: [precise-topic-2.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/precise-topic-2.query.ts)
- Capability: Basic retrieval with curriculum terminology
- Search terms: "multiplication", "arrays", "year 3", "groups of"

### precise-topic-3: "equivalent fractions same value"

- File: [precise-topic-3.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/precise-topic-3.query.ts)
- Capability: Basic retrieval with curriculum terminology
- Search terms: "equivalent fractions", "same value", "equal fractions"

### natural-expression-1: "sharing equally into groups"

- File: [natural-expression.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/natural-expression.query.ts)
- Capability: Vocabulary bridging (informal to curriculum)
- Search terms: "sharing", "equal groups", "divide", "division"

### natural-expression-2: "counting in groups of"

- File: [natural-expression-2.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/natural-expression-2.query.ts)
- Capability: Vocabulary bridging
- Search terms: "counting", "groups", "skip counting", "multiples"

### natural-expression-3: "splitting numbers into parts"

- File: [natural-expression-3.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/natural-expression-3.query.ts)
- Capability: Vocabulary bridging
- Search terms: "splitting", "parts", "partition", "place value"

### imprecise-input-1: "halfs and quarters"

- File: [imprecise-input.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/imprecise-input.query.ts)
- Capability: Resilience to typos ("halfs" should be "halves")
- Semantic intent: fractions - halves and quarters
- Search terms: "halves", "quarters", "fractions", "half"

### imprecise-input-2: "multiplikation timetables"

- File: [imprecise-input-2.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/imprecise-input-2.query.ts)
- Capability: Resilience to typos ("multiplikation" + "timetables")
- Semantic intent: multiplication times tables
- Search terms: "multiplication", "times tables", "multiples"

### imprecise-input-3: "adding frations togethr"

- File: [imprecise-input-3.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/imprecise-input-3.query.ts)
- Capability: Resilience to typos ("frations", "togethr")
- Semantic intent: adding fractions together
- Search terms: "adding fractions", "add fractions", "fractions"

### cross-topic-1: "fractions word problems money"

- File: [cross-topic.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/cross-topic.query.ts)
- Capability: Finding concept intersections (fractions + word problems + money)
- Search terms: "fractions", "word problems", "money", "pounds", "pence"

### cross-topic-2: "shapes symmetry patterns"

- File: [cross-topic-2.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/cross-topic-2.query.ts)
- Capability: Finding concept intersections (shapes + symmetry + patterns)
- Search terms: "shapes", "symmetry", "patterns", "geometry"

### cross-topic-3: "multiplication area rectangles"

- File: [cross-topic-3.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/primary/cross-topic-3.query.ts)
- Capability: Finding concept intersections (multiplication + area + rectangles)
- Search terms: "multiplication", "area", "rectangles", "arrays"

---

## SECONDARY Queries (12 total)

### Query Files Location

```
src/lib/search-quality/ground-truth/maths/secondary/
```

### precise-topic-1: "solving quadratic equations by factorising"

- File: [precise-topic.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/precise-topic.query.ts)
- Capability: Basic retrieval with curriculum terminology
- Search terms: "quadratic equations", "factorising", "solving quadratics"

### precise-topic-2: "interior angles polygons"

- File: [precise-topic-2.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/precise-topic-2.query.ts)
- Capability: Basic retrieval with curriculum terminology
- Search terms: "interior angles", "polygons", "angles in polygons"

### precise-topic-3: "calculating mean from frequency table"

- File: [precise-topic-3.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/precise-topic-3.query.ts)
- Capability: Basic retrieval with curriculum terminology
- Search terms: "mean", "frequency table", "average", "statistics"

### natural-expression-1: "working out percentages from amounts"

- File: [natural-expression.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/natural-expression.query.ts)
- Capability: Vocabulary bridging
- Search terms: "percentages", "percentage of", "finding percentages"

### natural-expression-2: "finding the unknown number"

- File: [natural-expression-2.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/natural-expression-2.query.ts)
- Capability: Vocabulary bridging
- Search terms: "unknown", "solving", "equations", "algebra"

### natural-expression-3: "how steep is the line"

- File: [natural-expression-3.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/natural-expression-3.query.ts)
- Capability: Vocabulary bridging ("steep" = gradient/slope)
- Search terms: "gradient", "slope", "linear", "straight line"

### imprecise-input-1: "simulatneous equasions substitution method"

- File: [imprecise-input.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/imprecise-input.query.ts)
- Capability: Resilience to typos ("simulatneous", "equasions")
- Semantic intent: simultaneous equations substitution method
- Search terms: "simultaneous equations", "substitution"

### imprecise-input-2: "pythagorus theorum triangles"

- File: [imprecise-input-2.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/imprecise-input-2.query.ts)
- Capability: Resilience to typos ("pythagorus", "theorum")
- Semantic intent: Pythagoras theorem triangles
- Search terms: "pythagoras", "theorem", "right-angled triangles"

### imprecise-input-3: "probablity tree diagrams"

- File: [imprecise-input-3.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/imprecise-input-3.query.ts)
- Capability: Resilience to typos ("probablity")
- Semantic intent: probability tree diagrams
- Search terms: "probability", "tree diagrams", "combined events"

### cross-topic-1: "combining algebra with graphs"

- File: [cross-topic.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/cross-topic.query.ts)
- Capability: Finding concept intersections (algebra + graphs)
- Search terms: "algebra", "graphs", "linear graphs", "plotting equations"

### cross-topic-2: "geometry proof coordinate"

- File: [cross-topic-2.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/cross-topic-2.query.ts)
- Capability: Finding concept intersections (geometry + proof + coordinate)
- Search terms: "geometry", "proof", "coordinate", "reasoning"

### cross-topic-3: "ratio proportion percentage"

- File: [cross-topic-3.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/maths/secondary/cross-topic-3.query.ts)
- Capability: Finding concept intersections (ratio + proportion + percentage)
- Search terms: "ratio", "proportion", "percentage", "scaling"

---

## MCP Tools to Use

| Tool | Purpose | When |

|------|---------|------|

| `get-help` | Verify MCP server | Phase 0 |

| `get-ontology` | Understand curriculum structure | Phase 0 |

| `get-lessons-summary` | Keywords, key learning for candidates | Every query (5-10 per query) |

| `get-units-summary` | Lesson ordering in units | Every query with unit context |

| `get-key-stages-subject-lessons` | Browse all lessons by key stage | Discovery exploration |

| `get-key-stages-subject-units` | Unit structure | Discovery exploration |

| `search` | Find lessons by topic | Discovery exploration |

---

## COMMIT Table Template

For each query, complete this table BEFORE Phase 1C:

| Rank | Slug | Score (1-3) | Key Learning Quote | Why This Ranking |

|------|------|-------------|-------------------|------------------|

| 1 | ***|*** | "..." | ___ |

| 2 | ***|*** | "..." | ___ |

| 3 | ***|*** | "..." | ___ |

| 4 | ***|*** | "..." | ___ |

| 5 | ***|*** | "..." | ___ |

---

## Session Deliverable

24 COMMIT tables (one per query) containing:

- Top 5 ranked slugs with relevance scores (1-3)
- Key learning quotes for each slug
- Justification for each ranking

These will be used in Phase 1C (future session) for three-way comparison against search results and existing expectations.
