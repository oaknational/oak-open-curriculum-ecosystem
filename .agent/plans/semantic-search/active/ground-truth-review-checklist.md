# Ground Truth Review Checklist

**Status**: In Progress  
**Progress**: 14/30 subject-phases complete (geography needs re-evaluation)  
**Next**: geography/primary, geography/secondary (re-evaluation with proper methodology)  
**Last Updated**: 2026-01-19 (added COMMIT step to prevent search validation bias)

---

## Quality Over Speed

> **There is no time pressure. Going slowly and doing an excellent job provides lasting, significant value to this project. Going fast and compromising causes _damage_.**

Previous sessions have repeatedly fallen into the "search validation" failure mode. This happens when there's perceived pressure to complete quickly.

**Take your time.** Read each step. Complete each step fully. If something feels unclear, stop and think. The goal is correct ground truth, not fast ground truth.

---

## ⛔ CARDINAL RULES — READ FIRST ⛔

### Rule 1: The search might be RIGHT. Your expected slugs might be WRONG.

**Session 9 proved this**: Previous session claimed MRR 0.000 was a "search quality issue". After deep exploration: the expected slugs used "emotions" but the query said "feel". The search correctly prioritised "feel/feelings" lessons. After correction: MRR 0.000 → 1.000.

### Rule 2: You must COMMIT to your rankings BEFORE seeing search results.

**Session 15 (geography) proved this is critical**: Without explicit commitment before benchmark, agents repeatedly validate search results instead of doing independent discovery. The COMMIT step forces you to form an independent judgment first.

**The Key Question is NOT**: "Do expected slugs appear in results?"  
**The Key Question IS**: "What are the BEST slugs for this query, based on curriculum content?"

---

## Linear Execution Protocol with COMMIT Step

**EVERY session MUST use the [Linear Execution Protocol](../templates/ground-truth-session-template.md).**

This is not optional. Sessions that skip the COMMIT step or read expected slugs early produce flawed results.

### Phase 0: Read Query Metadata (MANDATORY FIRST STEP)

**Split File Architecture (2026-01-19)**:
- `*.query.ts` — Contains query, category, description (SAFE to read)
- `*.expected.ts` — Contains expectedRelevance (ONLY read in Phase 1C)

```bash
# Read query metadata WITHOUT expected slugs
cat src/lib/search-quality/ground-truth/SUBJECT/PHASE/CATEGORY.query.ts
# e.g.: cat src/lib/search-quality/ground-truth/geography/primary/precise-topic.query.ts
```

**⛔ DO NOT READ `.expected.ts` FILES until Phase 1C.** They contain expected slugs.

### Phase 1A: Query Analysis (REFLECT ONLY — no searches, no tools)

**⚠️ No jq. No MCP. No benchmark. No data exploration. Just THINKING.**

**⛔ DO NOT READ `.expected.ts` FILES. Use the query from `.query.ts` file.**

| Requirement | Evidence Required | Why |
|-------------|-------------------|-----|
| State capability being tested | Which search behaviour is this category proving? | Clarity on purpose |
| Evaluate query as test | Is this a good test of that capability? | Catch bad experimental design |
| Assess experimental design | Will success/failure be informative? | Ensure meaningful results |
| Identify design issues | Is query miscategorised, trivial, or impossible? | Catch problems early |

**⛔ QUERY GATE**: Cannot search for candidates until query is validated.

### Phase 1B: Discovery + COMMIT (BEFORE benchmark, BEFORE reading GT file)

**⛔ DO NOT READ THE GT FILE. You do not know the expected slugs yet.**

| Requirement | Evidence Required | Why |
|-------------|-------------------|-----|
| Search bulk data | 10+ candidate slugs | Find ALL candidates |
| Get 5-10 MCP summaries | Key learning quotes | Reveals non-obvious matches |
| Get unit context | Lesson ordering | Finds hidden gems |
| Analyse candidates | Reasoning for each | Independent assessment |
| **COMMIT rankings** | Top 5 with scores and justifications | **BEFORE seeing search OR expected slugs** |

**⛔ DISCOVERY GATE**: Cannot run benchmark until rankings are COMMITTED and you have NOT read the GT file.

### Phase 1C: Comparison (AFTER commitment — NOW read GT file)

**✅ NOW you may read the GT file to see expected slugs for the first time.**

| Requirement | Evidence Required | Why |
|-------------|-------------------|-----|
| Pre-comparison verification | Confirm rankings committed before benchmark AND before seeing expected slugs | Prevent validation bias |
| Run benchmark --review | ALL 4 metrics output | Single tool, all metrics — shows expected slugs |
| Create three-way comparison | YOUR rankings vs SEARCH vs EXPECTED | Must be three distinct sources |
| Answer critical question | Justify: which source is BEST? | May be YOUR rankings! |
| Record ALL 4 metrics | MRR, NDCG, P@3, R@10 | All visible in benchmark |

**If any requirement is missing → the category is NOT complete.**

---

## Anti-Pattern: Search Validation (NOT Independent Discovery)

This failure mode has occurred repeatedly. Learn to recognise it.

### ❌ WRONG (Validates Search)

1. Run benchmark → see search returns A, B, C
2. Get MCP summaries for A, B, C
3. Note they have relevant content
4. Conclude "A, B, C are good"
5. Fill COMMIT table with A, B, C
6. Comparison table has identical columns

**Why wrong**: No independent judgment formed. Just justified what search returned.

### ✅ CORRECT (Independent Discovery)

1. Search bulk data → find candidates X, Y, Z, A, B, W... (10+ slugs)
2. Get MCP summaries → analyse each against query
3. Realise X and Y directly match query; A and B are tangential
4. COMMIT: X=#1, Y=#2, W=#3 (BEFORE seeing search)
5. Run benchmark → see search returns A, B, C
6. Three-way comparison shows differences
7. Conclude: "X and Y are better than A and B because..."

**Why correct**: Independent judgment formed first. Meaningful comparison made.

---

## ✅ Synonym Coverage Complete (2026-01-17)

All 17 subjects have domain-specific synonym files (~580 total). See: [ADR-100](../../../../docs/architecture/architectural-decisions/100-complete-subject-synonym-coverage.md)

---

## 🎯 NEXT SESSION: geography (RE-EVALUATION)

**Scope**: 2 subject-phases, 8 ground truths total (geography/primary + geography/secondary)

**Why re-evaluation?**: Session 15 validated search results instead of doing independent discovery. The COMMIT step was missing. Changes made to ground truths were based on what search returned, not on independent curriculum analysis.

**This session must**:
1. Follow the updated protocol with explicit COMMIT step (1B.5)
2. Form independent rankings BEFORE running benchmark
3. Create meaningful three-way comparison tables

**USE THE UPDATED PROTOCOL**: [ground-truth-session-template.md](../templates/ground-truth-session-template.md)

```bash
cd apps/oak-open-curriculum-semantic-search

# PHASE 0: Prerequisites
jq '.sequence | length' bulk-downloads/geography-primary.json
jq '.sequence | length' bulk-downloads/geography-secondary.json

# List ALL lessons (scan for non-obvious candidates)
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/geography-primary.json | sort

jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/geography-secondary.json | sort

# After completing all categories
pnpm benchmark --subject geography --verbose
```

**Ground truth files**:

- `src/lib/search-quality/ground-truth/geography/primary/`
- `src/lib/search-quality/ground-truth/geography/secondary/`

**Remember**: Quality over speed. There is no time pressure. Take your time. Do it right.

---

## Metrics Reference

| Metric | Target | Interpretation |
|--------|--------|----------------|
| **MRR** | > 0.70 | 1.0=pos 1, 0.5=pos 2, 0.33=pos 3 |
| **NDCG@10** | > 0.75 | Overall ranking quality |
| **P@3** | > 0.50 | Are top 3 useful? |
| **R@10** | > 0.70 | Are expected slugs found at all? |

**Diagnostic**: High R@10 + Low MRR = results found but poorly ranked (search issue)  
**Diagnostic**: Low R@10 = expected slugs may be wrong (GT issue)

---

## Session Entry

1. **Read the entry prompt** — [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
2. **Execute the protocol** — [ground-truth-session-template.md](../templates/ground-truth-session-template.md) — This is the LINEAR EXECUTION PROTOCOL
3. **Find your target below** — Work through all 4 categories with evidence
4. **Update this checklist** — Record metrics and learnings when complete

**If MCP server unavailable: STOP and wait. Do not proceed.**

---

## Quick Reference

### Search Architecture

| Source | Coverage | Description |
|--------|----------|-------------|
| **Structure** | 100% | Keywords, key learning (all lessons) |
| **Content** | ~81% | Transcript (most lessons, except MFL/PE) |

Four retrievers (Structure BM25, Structure ELSER, Content BM25, Content ELSER) combined via RRF.

**Note**: MFL subjects (French, German, Spanish) and PE have ~0% content coverage (no transcripts). These subjects use **structure retrieval only**. This is an architectural fact, not a limitation. Ground truths for MFL/PE must be designed for structure-based retrieval.

### Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# FIRST: Read query metadata from .query.ts files (SAFE — no expected slugs)
cat src/lib/search-quality/ground-truth/SUBJECT/PHASE/CATEGORY.query.ts
# e.g.: cat src/lib/search-quality/ground-truth/geography/primary/precise-topic.query.ts

# Phase 1A: Query Analysis — NO TOOLS, just REFLECT on the query

# Phase 1B: Bulk data exploration (BEFORE benchmark, BEFORE reading .expected.ts)
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/SUBJECT-PHASE.json

# Phase 1C: Review with ALL 4 metrics (AFTER COMMIT — NOW you may see expected slugs)
pnpm benchmark -s X -p Y -c Z --review
# Or read directly: cat src/lib/search-quality/ground-truth/SUBJECT/PHASE/CATEGORY.expected.ts

# Phase 2: Validation
pnpm type-check && pnpm ground-truth:validate && pnpm benchmark -s X -p Y --verbose
```

### MCP Tools

| Tool | Purpose |
|------|---------|
| `get-lessons-summary` | Keywords, key learning — **5-10 per category** |
| `get-units-summary` | Lesson ordering in unit |
| `get-key-stages-subject-units` | Unit structure |

---

## Progress

### 1. art/primary **← REVIEWED 2026-01-14**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000, both expected slugs found. "Year 1" is realistic teacher input.
- [x] natural-expression — MRR 1.000. **FIXED**: Replaced `profile-portraits-in-art` (about identifying) with `analyse-a-facial-expression-through-drawing` (about drawing). Both now at #1 and #2.
- [x] imprecise-input — MRR 0.500, typo doesn't break search. Both expected slugs found (#2, #8). **System is resilient.**
- [x] cross-topic — MRR 1.000, perfect ordering. Rainforest + colour + texture intersection works.

**Changes**: natural-expression score=2 slug corrected.

File: `src/lib/search-quality/ground-truth/art/primary/`

---

### 2. art/secondary **← REVIEWED 2026-01-15**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. **FIXED**: `abstract-art-dry-materials-in-response-to-stimuli` changed from score=3 to score=2 (lesson is about dry materials like pencils, not painting).
- [x] natural-expression — MRR 1.000. Score=3 slug has "feelings" as keyword, directly about art conveying emotions.
- [x] imprecise-input — MRR 0.500. System resilient to typo "beginers". Both expected slugs found (#2, #4).
- [x] cross-topic — MRR 1.000. Score=3 slug combines portraits + colour + expression explicitly.

**Changes**: precise-topic score correction for dry-materials slug (3→2).

File: `src/lib/search-quality/ground-truth/art/secondary/`

---

### 3. citizenship/secondary **← REVIEWED 2026-01-15**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000, all 3 expected slugs found. UK democracy/elections/voting terms well-differentiated.
- [x] natural-expression — MRR 1.000, all 3 expected slugs found. "being fair" bridges correctly to fairness/equality.
- [x] imprecise-input — MRR 1.000. **FIXED**: Replaced `should-parliamentary-procedures-be-modernised` (about procedures/traditions) with `what-is-the-difference-between-the-government-and-parliament` (about roles). Expected slugs must match query semantics.
- [x] cross-topic — MRR 1.000, all 3 expected slugs found. Democracy + laws intersection has good differentiation.

**Changes**: imprecise-input score=2 slug corrected (procedures→roles).

File: `src/lib/search-quality/ground-truth/citizenship/secondary/`

---

### 4. computing/primary **← REVIEWED 2026-01-15**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. Systematically compared all 6 lessons in Digital painting unit. Added `choosing-the-right-digital-painting-tool` as 4th expected slug.
- [x] natural-expression — MRR 0.167. **FIXED**: Replaced `making-choices-when-using-information-technology` (about choices, not safety) with `benefits-of-information-technology` (mentions "safer" in key learning).
- [x] imprecise-input — MRR 0.333. **FIXED**: Swapped scores - `connecting-networks` (score=3) explains what internet IS; `the-internet-and-world-wide-web` (score=2) is about WWW services.
- [x] cross-topic — MRR 1.000. Systematically compared all 12 sequence-related lessons. Swapped scores - `programming-sequences` (score=3) is foundational; added 2 more score=2 slugs.

**Changes**: All 4 categories updated after systematic bulk data exploration. Multiple score corrections and slug additions.

File: `src/lib/search-quality/ground-truth/computing/primary/`

---

### 5. computing/secondary **← REVIEWED 2026-01-15**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. All 3 expected slugs from "Python programming with sequences of data" unit are optimal.
- [x] natural-expression — MRR 0.500, R@10 0.333. **CORRECTED**: Using TRUE beginner lessons (Lessons 1-3 in unit: `writing-a-text-based-program`, `working-with-numerical-inputs`, `using-selection`) instead of end-of-unit capstone lessons (5-6). Only 1/3 expected slugs found in top 10 — this correctly exposes that search doesn't optimally rank true beginner content.
- [x] imprecise-input — MRR 1.000. Clarified: `sql-searches` IS querying (SELECT). `sql-fundamentals` is foundational SQL (INSERT/UPDATE/DELETE) — score=2 as related foundation, not direct match.
- [x] cross-topic — MRR 1.000. Expected slugs are the ONLY two lessons combining loops + data structures.

**Changes**: natural-expression — selected TRUE beginner lessons (first 3 in unit) based on MCP unit summary showing lesson order. Previous selection (Lessons 5-6) were end-of-unit capstone content, not beginner lessons.

File: `src/lib/search-quality/ground-truth/computing/secondary/`

---

### 6. cooking-nutrition/primary **← REVIEWED 2026-01-16**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 0.500, NDCG 0.419, P@3 0.333, R@10 0.800. Updated: Added `introducing-the-eatwell-guide` (score=3), upgraded `sources-of-energy-and-nutrients` (3), downgraded `healthy-meals` (2). Now 5 expected slugs covering foundational nutrition and healthy eating. **Insight**: High R@10 but low NDCG indicates results ARE found but poorly ranked.
- [x] natural-expression — MRR 0.250, NDCG 0.385, P@3 0.000, R@10 0.667. Updated: `making-a-healthy-wrap-for-lunch` (score=3) is the ONLY lesson combining cooking + healthy + lunch. Added `making-an-international-salad` (2) which explicitly mentions "healthy meals" in key learning, and `healthy-meals` (2) for meal planning. **Insight**: P@3=0.000 means none of top 3 are relevant — search prioritises theory over practical cooking.
- [x] imprecise-input — MRR 0.500, NDCG 0.516, P@3 0.667, R@10 0.800. Updated: Added `sources-of-energy-and-nutrients`, `food-labels-for-health` (score=3), `health-and-wellbeing` (score=2). Typo "nutrision" poorly handled by fuzzy matching but ELSER semantics provide resilience.
- [x] cross-topic — MRR 1.000, NDCG 0.957, P@3 0.667, R@10 1.000. Perfect match. Updated: Upgraded `why-we-need-energy-and-nutrients` to score=3, added `making-curry-in-a-hurry` (score=2).

**Aggregate**: MRR 0.563 | NDCG 0.569 | P@3 0.417 | R@10 0.817

**Key Learnings**:

1. Search ranks "community" and "wellbeing" lessons higher than nutrition-focused lessons for healthy eating queries
2. For "learning to cook" queries, distinguish practical cooking lessons from theory — practical lessons should be preferred
3. Review ALL lessons in pool (not just title searches) — `making-an-international-salad` mentions "healthy meals" in key learning, not visible in title
4. Low MRR with high R@10 indicates correct lessons ARE found, just not ranked optimally — valuable search quality insight

File: `src/lib/search-quality/ground-truth/cooking-nutrition/primary/`

---

### 7. cooking-nutrition/secondary **← REVIEWED 2026-01-17**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. Both expected slugs (`macronutrients-fibre-and-water`, `micronutrients`) found. Scientific nutrition vocabulary correctly matches.
- [x] natural-expression — MRR 1.000. Both expected slugs (`making-herby-focaccia`, `making-chelsea-buns`) found. Bread-making lessons correctly identified for "teach students to make bread".
- [x] imprecise-input — MRR 0.333. Both expected slugs found (#3, #5). Typo "nutrision" relies on ELSER semantics since fuzzy matching struggles.
- [x] cross-topic — MRR 1.000. **CORRECTED**: Replaced nutrition-theory slugs (`eat-well-now`, `making-better-food-and-drink-choices`) with cooking+nutrition combination slugs (`making-mushroom-bean-burgers-with-flatbreads` score=3, `making-cheesy-bean-burritos` score=2, `making-toad-in-the-hole` score=2). Previous slugs were theory-only without cooking techniques.

**Changes**: cross-topic expected slugs corrected to lessons that actually combine nutrition AND cooking techniques.

**Aggregate**: MRR 0.833 | NDCG 0.764 | P@3 0.500 | R@10 1.000

File: `src/lib/search-quality/ground-truth/cooking-nutrition/secondary/`

---

### 8. design-technology/primary **← REVIEWED 2026-01-17 (DEEP REVIEW)**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. Verified correct with 8 MCP summaries. `cam-mechanisms` and `cams-in-a-product` are the foundational conceptual lessons.
- [x] natural-expression — MRR 1.000. **DEEP REVIEW**: Added `rotary-motion` (score=2), upgraded `card-slider-mechanisms` to score=3. Explored 50+ movement lessons, selected those with "mechanisms are systems that make something move" in key learning.
- [x] imprecise-input — MRR 1.000. Verified with unit structure analysis. Current selection correctly covers KS1 mechanism content from "Levers and sliders: moving cards" unit.
- [x] cross-topic — MRR 0.500. Verified best available given curriculum. No single lesson combines all three concepts (structures + materials + testing).

**Aggregate**: MRR 0.875 | NDCG 0.689 | P@3 0.417 | R@10 0.938

File: `src/lib/search-quality/ground-truth/design-technology/primary/`

---

### 9. design-technology/secondary **← REVIEWED 2026-01-17 (DEEP REVIEW)**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 0.500. **DEEP REVIEW**: Added `empathy` (score=2) which is explicitly about "understanding what users experience" - this IS human factors.
- [x] natural-expression — MRR 1.000. **DEEP REVIEW**: Added `material-sustainability` (score=2) which explicitly uses "sustainable" vocabulary bridging from "green/environment friendly".
- [x] imprecise-input — MRR 1.000. Verified with comprehensive polymer search. Only 2 polymer-specific lessons exist, current selection is correct.
- [x] cross-topic — MRR 1.000. **DEEP REVIEW**: Added `realistic-rendering-techniques` (score=3) as TRUE intersection - explicitly teaches "show material texture" through sketching. Downgraded `advanced-3d-sketching` to score=2.

**Aggregate**: MRR 0.875 | NDCG 0.675 | P@3 0.583 | R@10 0.750

File: `src/lib/search-quality/ground-truth/design-technology/secondary/`

---

### 10. english/primary **← RE-REVIEWED 2026-01-17 (DEEP EXPLORATION)**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000, NDCG 0.884, P@3 0.667, R@10 0.667. Verified with 12 MCP summaries + unit context. BFG reading comprehension lessons correct.
- [x] natural-expression — **CORRECTED** MRR 1.000, NDCG 0.951, P@3 1.000, R@10 1.000. Previous session WRONGLY claimed expected slugs were correct. Deep exploration revealed: search correctly prioritizes lessons with "feel/feelings" in key learning over lessons with "emotions". Updated expected slugs to match what search SHOULD return.
- [x] imprecise-input — MRR 0.167, NDCG 0.193, P@3 0.000, R@10 0.333. Verified with 6 MCP summaries + unit structure. Expected slugs ARE correct for "narrative writing" intent. Low MRR = search quality issue with fuzzy matching.
- [x] cross-topic — MRR 1.000, NDCG 0.884, P@3 0.667, R@10 0.667. Bulk data confirms these are the ONLY lessons combining writing+tenses.

**Aggregate**: MRR 0.792 | NDCG 0.728 | P@3 0.583 | R@10 0.667

**Key Learnings from RE-REVIEW**:

1. **DO NOT assume expected slugs are correct** — compare against ACTUAL search results
2. **The search might be RIGHT** — previous session claimed MRR 0.000 was "search quality issue" but it was WRONG expected slugs
3. **"emotions" ≠ "feel"** — query said "how characters feel", search correctly found lessons with "feel/feelings" not "emotions"
4. **ALL 4 metrics required** — MRR alone can mislead; P@3=1.000 and R@10=1.000 confirm excellent result

File: `src/lib/search-quality/ground-truth/english/primary/`

---

### 11. english/secondary **← REVIEWED 2026-01-17**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. **CORRECTED**: Allusions ≠ Symbolism. Downgraded allusions to score=2, added allegory lesson.
- [x] natural-expression — MRR 1.000. Verified correct - Gothic literature lessons appropriate for Year 8.
- [x] imprecise-input — MRR 0.500, R@10 1.000. Verified correct - all 3 expected slugs found despite "frankenstien" typo.
- [x] cross-topic — MRR 1.000. **CORRECTED**: Previous slugs didn't teach grammar/punctuation. New slugs verified via MCP to actually combine grammar+essay.

**Aggregate**: MRR 0.875 | NDCG 0.625 | P@3 0.417 | R@10 0.583

**Key Learnings**:

1. Allusions (references to other texts) is a different literary device from Symbolism (objects representing ideas)
2. Cross-topic expected slugs must be verified via MCP to actually combine BOTH concepts

File: `src/lib/search-quality/ground-truth/english/secondary/`

---

### 12. french/primary **← RE-REVIEWED 2026-01-19 (CROSS-TOPIC FIXED)**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000, NDCG 0.813, P@3 0.667, R@10 0.667. Expected ER verb lessons verified via MCP summaries. Search finds `my-friend-singular-er-verbs` which has same key learning definition — equally valid match.
- [x] natural-expression — MRR 1.000, NDCG 0.787, P@3 0.333, R@10 0.500. **VERIFIED CORRECTION**: "Greetings" (bonjour, salut, ça va) ≠ "Introductions" (voici, je m'appelle). Lessons with explicit greetings vocabulary are correct expected slugs.
- [x] imprecise-input — MRR 1.000, NDCG 1.000, P@3 0.667, R@10 1.000. **VERIFIED CORRECTION**: Both expected slugs (#1, #2) explicitly mention "vocabulary" in key learning. Typo "fench" → "French" handled correctly.
- [x] cross-topic — MRR 0.250, NDCG 0.339, P@3 0.000, R@10 0.500. **RE-REVIEWED**: Previous slugs (`packing-a-bag-singular-avoir`, `activities-at-home-questions-with-quest-ce-que`) taught verbs (avoir, faire) but didn't have "verb" as a keyword — search couldn't match them for query containing "verbs". New slugs have "verb" in keywords AND "vocabulary" in key learning: `preferences-extending-my-sentences` ("-er verb" keyword, found at #4), `who-has-what-singular-avoir-and-intonation-questions` ("singular verb forms" keyword, not found). P@3=0.000 is correct — top 3 results don't have "vocabulary" in key learning.

**Aggregate**: MRR 0.813 | NDCG 0.735 | P@3 0.417 | R@10 0.667

**Changes**:

1. cross-topic: Replaced avoir/faire lessons with lessons that have "verb" in keywords + vocabulary in key learning

**Key Learnings**:

1. **MFL structure-only retrieval**: French lessons have metadata but NO transcripts (~0% content coverage). Ground truths must test structure-based retrieval.
2. **"Greetings" ≠ "Introductions"**: Distinct concepts requiring different lessons. Greetings = bonjour/salut/ça va. Introductions = voici/je m'appelle.
3. **Cross-topic requires DISCOVERABLE intersection**: Expected slugs must have BOTH concepts in SEARCHABLE text (keywords/title), not just in key learning. If query uses "verbs", expected slugs need "verb" in keywords, not just specific verb names like "avoir".
4. **Keywords vs title matching**: Search heavily weights title matches. Lessons with "verb" in title rank higher than lessons with "verb" only in keywords.

File: `src/lib/search-quality/ground-truth/french/primary/`

---

### 13. french/secondary **← REVIEWED 2026-01-19 (DEEP EXPLORATION)**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000, NDCG 0.785, P@3 0.667, R@10 0.667. Year 7 foundational negation unit (ne...pas) verified via MCP. All 4 expected slugs from correct unit.
- [x] natural-expression — MRR 0.000, NDCG 0.000, P@3 0.000, R@10 0.000. GT CORRECT but search quality gap. Expected slugs ARE the Year 7 negation lessons for "teach French negative sentences year 7". Search returns advanced negation (perfect tense, aller+infinitive) instead of foundational.
- [x] imprecise-input — MRR 0.500, NDCG 0.598, P@3 0.333, R@10 1.000. **VERIFIED CORRECTION**: avoir/être grammar lessons correct for "french grammer avoir etre" (with typo). Correction from negation lessons was valid.
- [x] cross-topic — MRR 1.000, NDCG 0.907, P@3 0.333, R@10 1.000. **VERIFIED CORRECTION**: `clean-up-re-verbs-adjectives` and `describe-people-etre-3rd-person-plural-and-regular-plural-adjectives` both explicitly combine verbs AND adjectives in key learning. Correction from verbs+questions was valid.

**Aggregate**: MRR 0.625 | NDCG 0.573 | P@3 0.333 | R@10 0.667

**Changes**:

1. Previous session corrections verified as correct (imprecise-input and cross-topic)

**Key Learnings**:

1. **Year group matters**: "year 7" in query should weight foundational content, but search returns advanced content
2. **MFL structure-only retrieval confirmed**: Secondary French also relies solely on metadata (no transcripts)
3. **Previous corrections validated**: The avoir/être and verbs+adjectives corrections were both correct

File: `src/lib/search-quality/ground-truth/french/secondary/`

---

### 14. geography/primary **← NEEDS RE-EVALUATION**

[↑ Instructions](#instructions)

**Previous review (2026-01-19) used flawed methodology** — validated search results instead of independent discovery.

- [ ] precise-topic — NEEDS RE-EVALUATION with COMMIT step
- [ ] natural-expression — NEEDS RE-EVALUATION with COMMIT step
- [ ] imprecise-input — NEEDS RE-EVALUATION with COMMIT step
- [ ] cross-topic — NEEDS RE-EVALUATION with COMMIT step

**Why re-evaluation needed**: Session 15 did not form independent rankings before seeing search results. Changes made were based on validating what search returned, not on independent curriculum analysis. The COMMIT step (1B.5) must be used to ensure proper methodology.

File: `src/lib/search-quality/ground-truth/geography/primary/`

---

### 15. geography/secondary **← NEEDS RE-EVALUATION**

[↑ Instructions](#instructions)

**Previous review (2026-01-19) used flawed methodology** — validated search results instead of independent discovery.

- [ ] precise-topic — NEEDS RE-EVALUATION with COMMIT step
- [ ] natural-expression — NEEDS RE-EVALUATION with COMMIT step
- [ ] imprecise-input — NEEDS RE-EVALUATION with COMMIT step
- [ ] cross-topic — NEEDS RE-EVALUATION with COMMIT step

**Why re-evaluation needed**: Session 15 did not form independent rankings before seeing search results. The "correction" to natural-expression (`actions-to-tackle-climate-change` kept despite being about actions, not effects) was based on validating search results, not independent analysis. The COMMIT step (1B.5) must be used.

**Specific issues identified**:
- natural-expression: `actions-to-tackle-climate-change` is about mitigation/adaptation (actions), NOT effects — yet it remained in ground truth
- cross-topic: Changes were made based on what search returned, not independent discovery

File: `src/lib/search-quality/ground-truth/geography/secondary/`

---

### 16. german/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/german/secondary/`

---

### 17. history/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/history/primary/`

---

### 18. history/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/history/secondary/`

---

### 19. maths/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/maths/primary/`

---

### 20. maths/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/maths/secondary/`

---

### 21. music/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/music/primary/`

---

### 22. music/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/music/secondary/`

---

### 23. physical-education/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/physical-education/primary/`

---

### 24. physical-education/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/physical-education/secondary/`

---

### 25. religious-education/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/religious-education/primary/`

---

### 26. religious-education/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/religious-education/secondary/`

---

### 27. science/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/science/primary/`

---

### 28. science/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/science/secondary/`

---

### 29. spanish/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/spanish/primary/`

---

### 30. spanish/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/spanish/secondary/`

---

## Category Definitions

| Category | Tests | Key Consideration |
|----------|-------|-------------------|
| `precise-topic` | Exact terminology | Direct matches |
| `natural-expression` | Informal → curriculum terms | **Vocabulary must match query** |
| `imprecise-input` | Typos, truncation | Semantic intent behind typo |
| `cross-topic` | Multiple concepts | **BOTH concepts in key learning** |

---

## Reference

| Document | Purpose |
|----------|---------|
| [Protocol](../templates/ground-truth-session-template.md) | **LINEAR execution with checkpoints** |
| [Entry Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Overview, cardinal rule |
| [IR Metrics](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | Metric definitions |
| [GT Guide](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles |

---

## Key Principle

**Ground truth review** = Specification correctness (fixing the answer key)  
**Search optimisation** = Tuning the system (separate task)

If better matches exist → ground truth is wrong → correct it.
