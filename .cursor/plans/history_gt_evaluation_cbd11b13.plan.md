---
name: History GT Evaluation
overview: Exhaustively evaluate History ground truths (primary + secondary, 8 queries total) by independently discovering the best lesson matches from curriculum data using MCP tools and bulk data BEFORE examining expected slugs or search results.
todos:
  - id: phase0
    content: "PHASE 0: Download bulk data if needed, verify MCP and benchmark tools work, extract all history lessons to /tmp"
    status: completed
  - id: p-precise-1a
    content: "PRIMARY precise-topic 1A: REFLECT on 'Boudica rebellion against Romans' - query design analysis"
    status: completed
  - id: p-precise-1b
    content: "PRIMARY precise-topic 1B: Discover candidates (10+), get MCP summaries (5-10), analyse key learning"
    status: completed
  - id: p-precise-commit
    content: "PRIMARY precise-topic 1B.5: COMMIT your top 5 rankings with scores and justifications BEFORE benchmark"
    status: completed
  - id: p-precise-1c
    content: "PRIMARY precise-topic 1C: Run benchmark, read .expected.ts, 3-way comparison, critical question"
    status: completed
  - id: p-natural-1a
    content: "PRIMARY natural-expression 1A: REFLECT on 'teach year 4 about the Romans' - vocabulary bridging test"
    status: completed
  - id: p-natural-1b
    content: "PRIMARY natural-expression 1B: Discover Year 4 Roman content, MCP summaries for Roman units"
    status: completed
  - id: p-natural-commit
    content: "PRIMARY natural-expression 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: p-natural-1c
    content: "PRIMARY natural-expression 1C: Run benchmark, 3-way comparison"
    status: completed
  - id: p-imprecise-1a
    content: "PRIMARY imprecise-input 1A: REFLECT on 'vikins and anglo saxons' - typo resilience test"
    status: completed
  - id: p-imprecise-1b
    content: "PRIMARY imprecise-input 1B: Discover Vikings + Anglo-Saxons content (semantic intent)"
    status: completed
  - id: p-imprecise-commit
    content: "PRIMARY imprecise-input 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: p-imprecise-1c
    content: "PRIMARY imprecise-input 1C: Run benchmark, 3-way comparison"
    status: completed
  - id: p-cross-1a
    content: "PRIMARY cross-topic 1A: REFLECT on 'Vikings and trade in York' - intersection test"
    status: completed
  - id: p-cross-1b
    content: "PRIMARY cross-topic 1B: Find lessons with BOTH Vikings AND trade AND York in key learning"
    status: completed
  - id: p-cross-commit
    content: "PRIMARY cross-topic 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: p-cross-1c
    content: "PRIMARY cross-topic 1C: Run benchmark, 3-way comparison"
    status: completed
  - id: s-precise-1a
    content: "SECONDARY precise-topic 1A: REFLECT on 'Holocaust Nazi persecution' - curriculum terms test"
    status: completed
  - id: s-precise-1b
    content: "SECONDARY precise-topic 1B: Discover Holocaust/Nazi persecution content across Y9-Y11"
    status: completed
  - id: s-precise-commit
    content: "SECONDARY precise-topic 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: s-precise-1c
    content: "SECONDARY precise-topic 1C: Run benchmark, 3-way comparison"
    status: completed
  - id: s-natural-1a
    content: "SECONDARY natural-expression 1A: REFLECT on 'factory age workers conditions' - vocabulary bridging"
    status: completed
  - id: s-natural-1b
    content: "SECONDARY natural-expression 1B: Discover Industrial Revolution worker conditions content"
    status: completed
  - id: s-natural-commit
    content: "SECONDARY natural-expression 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: s-natural-1c
    content: "SECONDARY natural-expression 1C: Run benchmark, 3-way comparison"
    status: completed
  - id: s-imprecise-1a
    content: "SECONDARY imprecise-input 1A: REFLECT on 'holocost and nazi germany' - typo resilience"
    status: completed
  - id: s-imprecise-1b
    content: "SECONDARY imprecise-input 1B: Discover Holocaust + Nazi Germany content (same semantic as precise)"
    status: completed
  - id: s-imprecise-commit
    content: "SECONDARY imprecise-input 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: s-imprecise-1c
    content: "SECONDARY imprecise-input 1C: Run benchmark, 3-way comparison"
    status: completed
  - id: s-cross-1a
    content: "SECONDARY cross-topic 1A: REFLECT on 'revolution and slavery abolition' - intersection test"
    status: completed
  - id: s-cross-1b
    content: "SECONDARY cross-topic 1B: Find lessons with BOTH revolution AND abolition concepts"
    status: completed
  - id: s-cross-commit
    content: "SECONDARY cross-topic 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: s-cross-1c
    content: "SECONDARY cross-topic 1C: Run benchmark, 3-way comparison"
    status: completed
  - id: phase2
    content: "PHASE 2: Run validation suite - type-check, ground-truth:validate, aggregate benchmarks"
    status: completed
  - id: phase3
    content: "PHASE 3: Update checklist with metrics, document key learnings and changes"
    status: completed
---

# History Ground Truth Evaluation

## Principle

**Independent discovery first.** Find the best possible matches using your own understanding of the curriculum data. Do NOT look at `.expected.ts` files or run benchmarks until you have COMMITTED your own rankings.

---

## Scope

- **history/primary**: 4 categories (precise-topic, natural-expression, imprecise-input, cross-topic)
- **history/secondary**: 4 categories (same)
- **Total**: 8 queries requiring exhaustive independent evaluation

---

## Query Summary (from .query.ts files - SAFE to read)

### Primary (KS1-KS2)

| Category | Query | Semantic Intent |

|----------|-------|-----------------|

| precise-topic | "Boudica rebellion against Romans" | Iceni queen's revolt, ~60 AD |

| natural-expression | "teach year 4 about the Romans" | Year 4 = KS2, informal teacher request |

| imprecise-input | "vikins and anglo saxons" | Vikings (typo) + Anglo-Saxons |

| cross-topic | "Vikings and trade in York" | Vikings + trade + York intersection |

### Secondary (KS3-KS4)

| Category | Query | Semantic Intent |

|----------|-------|-----------------|

| precise-topic | "Holocaust Nazi persecution" | WWII genocide, Nazi regime |

| natural-expression | "factory age workers conditions" | "factory age" = Industrial Revolution |

| imprecise-input | "holocost and nazi germany" | Holocaust (typo) + Nazi Germany |

| cross-topic | "revolution and slavery abolition" | Revolution + abolition intersection |

---

## Phase 0: Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search

# Verify bulk data exists
ls bulk-downloads/*.json | wc -l  # Should be ~32 files

# If missing, download (requires OAK_API_KEY in .env.local)
pnpm bulk:download

# Extract ALL history lessons to /tmp for reference
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/history-primary.json > /tmp/history-primary-all.txt

jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/history-secondary.json > /tmp/history-secondary-all.txt

wc -l /tmp/history-primary-all.txt /tmp/history-secondary-all.txt
```

---

## Phase 1: Per-Category Evaluation (Repeat for all 8)

### Phase 1A: Query Analysis (REFLECT - no tools)

For each query, THINK about:

1. What capability is being tested?
2. Is this a good test of that capability?
3. Any design issues?

### Phase 1B: Independent Discovery (BEFORE benchmark/expected)

**Bulk Data Exploration** (10+ candidates per query):

- Search with multiple related terms
- Scan ALL units - don't rely only on obvious title matches
- History content often hidden in thematic lessons

**MCP Summaries** (5-10 per query):

- Call `get-lessons-summary` for each candidate
- Record keywords and key learning quotes
- Identify which lessons DIRECTLY address the query vs tangentially related

**Unit Context**:

- Call `get-units-summary` for relevant units
- Understand lesson ordering (foundational vs capstone)

**COMMIT Rankings**:

- Rank top 5 with scores (3=highly relevant, 2=moderately relevant)
- Quote key learning text that justifies each ranking
- This is YOUR ground truth assessment

### Phase 1C: Comparison (AFTER commitment)

1. Run benchmark: `pnpm benchmark -s history -p primary -c precise-topic --review`
2. NOW read `.expected.ts` to see current expected slugs
3. Create 3-way comparison: YOUR rankings vs SEARCH results vs EXPECTED
4. Answer: Which source has the BEST slugs?

---

## Key History Content Areas (from MCP exploration)

### Primary - Relevant Units

| Year | Unit | Lessons | Relevant To |

|------|------|---------|-------------|

| Y4 | The Romans: what impact did the Romans have on Britain? | 6 | Boudica, Romans queries |

| Y4 | The Romans: what did it mean to be a Roman? | 6 | Romans queries |

| Y5 | Britain's settlement by Anglo-Saxons | 6 | Anglo-Saxons queries |

| Y5 | The Vikings: why did they come to the British Isles? | 6 | Vikings queries |

| Y6 | The Vikings: how did Viking settlement change Britain? | 6 | Vikings queries |

| Y6 | The Vikings: how do we know so much about Viking York? | 6 | Vikings + York + trade |

### Secondary - Relevant Units

| Year | Unit | Lessons | Relevant To |

|------|------|---------|-------------|

| Y9 | The Holocaust: what was the Holocaust? | ~6 | Holocaust queries |

| Y9 | The Industrial Revolution | ~6 | Factory age query |

| Y9 | The Haitian Revolution | ~6 | Revolution + abolition |

| Y8 | Transatlantic Slavery | ~6 | Abolition query |

| Y11 | Weimar and Nazi Germany, 1918-39 | ~20+ | Nazi Germany queries |

---

## Critical Reminders

1. **Title-only matching is NOT sufficient** - A lesson titled "daily life in Viking York" might teach trade concepts without "trade" in the title

2. **Every query needs FRESH MCP analysis** - Do NOT copy slugs from similar queries (e.g., precise-topic to imprecise-input)

3. **COMMIT before benchmark** - Your rankings must exist before you see search results or expected slugs

4. **MCP summaries reveal hidden content** - Key learning often contains concepts not visible in titles

---

## Files

- Query files (SAFE): `src/lib/search-quality/ground-truth/history/*/CATEGORY.query.ts`
- Expected files (PHASE 1C ONLY): `src/lib/search-quality/ground-truth/history/*/CATEGORY.expected.ts`
- Bulk data: `bulk-downloads/history-primary.json`, `bulk-downloads/history-secondary.json`

---

## Success Criteria

For each of 8 queries:

- 10+ candidates discovered from bulk data
- 5-10 MCP summaries with key learning quotes
- Rankings COMMITTED before benchmark
- 3-way comparison table created
- Critical question answered with justification
- All 4 metrics recorded (MRR, NDCG@10, P@3, R@10)
