# Semantic Search — Ground Truth Review Protocol

**Status**: Ground Truth Review — 20/30 complete  
**Next Session**: music/primary + music/secondary  
**Last Updated**: 2026-01-20 (maths complete, Music next)

---

## 🎯 NEXT SESSION: Music Ground Truth Evaluation

**Scope**: music/primary + music/secondary (2 subject-phases, 8 queries total)

**Session Structure** (phases are SEPARATE processes — no jumping ahead):

1. **Phase 0 + 1A** (first process): Prerequisites + Query Analysis for ALL 8 queries
2. **Phase 1B** (second process): Discovery + COMMIT for ALL 8 queries
3. **Phase 1C** (third process): Comparison for ALL 8 queries

### Music Context

- Music has **moderate content coverage** (check with bulk data)
- Likely has specialised vocabulary (e.g., tempo, rhythm, dynamics)
- May have MFL-like structure issues (activity-based lesson titles)

### Commands to Start

```bash
cd apps/oak-open-curriculum-semantic-search

# Verify bulk data exists
ls bulk-downloads/music-*.json

# Count lessons
jq '.sequence | length' bulk-downloads/music-primary.json
jq '.sequence | length' bulk-downloads/music-secondary.json

# Read query files (Phase 0)
cat src/lib/search-quality/ground-truth/music/primary/precise-topic.query.ts
cat src/lib/search-quality/ground-truth/music/primary/natural-expression.query.ts
cat src/lib/search-quality/ground-truth/music/primary/imprecise-input.query.ts
cat src/lib/search-quality/ground-truth/music/primary/cross-topic.query.ts

cat src/lib/search-quality/ground-truth/music/secondary/precise-topic.query.ts
cat src/lib/search-quality/ground-truth/music/secondary/natural-expression.query.ts
cat src/lib/search-quality/ground-truth/music/secondary/imprecise-input.query.ts
cat src/lib/search-quality/ground-truth/music/secondary/cross-topic.query.ts
```

### Ground Truth Files

```
src/lib/search-quality/ground-truth/music/primary/
  - precise-topic.query.ts, precise-topic.expected.ts
  - natural-expression.query.ts, natural-expression.expected.ts
  - imprecise-input.query.ts, imprecise-input.expected.ts
  - cross-topic.query.ts, cross-topic.expected.ts
  - index.ts

src/lib/search-quality/ground-truth/music/secondary/
  [same structure]
```

---

## ✅ MATHS COMPLETE — Key Learnings from Phase 1C

### Aggregate Results (after GT corrections)

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.675 | 0.607 | 0.500 | 0.683 |
| SECONDARY | 0.861 | 0.749 | 0.667 | 0.828 |

### Critical Findings

1. **Query register must match content level**: "Finding the unknown number" (informal) maps to LINEAR equations, not advanced quadratics. GT corrected — search was RIGHT.

2. **Tokenization ≠ fuzzy matching**: "timetables" vs "times table" is a word boundary issue, not a character edit. Fuzzy matching can't bridge this. Synonym added: `times-table => timetables, timestables, time tables`.

3. **Cross-topic curriculum gaps**: If "fractions + money" intersection doesn't exist in curriculum, GT can't specify it. GT replaced with "area and perimeter problems together" which has verified cross-topic content.

4. **Secondary > Primary structurally**: Standardised terminology in secondary vs child-friendly vocabulary fragmentation in primary. This is curriculum design, not search quality.

5. **Three-way comparison works**: Revealed cases where search outperformed COMMIT (natural-expression-2) and cases where GT was correct but search failed (natural-expression-3).

### GT Changes Made

- `maths/secondary/natural-expression-2.expected.ts`: Changed from quadratic equations to linear equations
- `maths/primary/cross-topic.query.ts` + `.expected.ts`: Changed from "fractions word problems money" to "area and perimeter problems together"
- `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/maths.ts`: Added `times-table` synonyms

---

## Quality Over Speed

> **There is no time pressure. Going slowly and doing an excellent job provides lasting, significant value to this project. Going fast and compromising causes _damage_.**

Previous sessions have repeatedly fallen into the "search validation" failure mode despite clear documentation. This happens when there's perceived pressure to complete quickly.

**Take your time.** Read each step. Complete each step fully. If something feels unclear, stop and think. The goal is not to finish quickly — it's to establish correct ground truth that will guide search improvement for months.

---

## Note: Bulk Data Files

The `bulk-downloads/` folder contains JSON files that are **gitignored** (not missing). Use `ls` to verify:

```bash
ls apps/oak-open-curriculum-semantic-search/bulk-downloads/*.json | wc -l  # Should be ~32 files
```

If missing, download with: `pnpm bulk:download` (requires `OAK_API_KEY` in `.env.local`)

---

## ⛔ CARDINAL RULES — READ FIRST ⛔

### Rule 1: The search might be RIGHT. Your expected slugs might be WRONG.

Session 9 (english) proved this. Previous session claimed MRR 0.000 was a "search quality issue". After **deep exploration**, we discovered:

- The query said "how characters **feel**"
- The expected slugs used "**emotions**" in key learning
- The search correctly prioritised lessons with "**feel/feelings**" in key learning
- **The search was RIGHT. The ground truth was WRONG.**

After correction: MRR 0.000 → 1.000, P@3 0.000 → 1.000

### Rule 2: You must form YOUR OWN assessment BEFORE seeing search results OR expected slugs.

This is the critical safeguard. The protocol requires you to:

1. **Read query metadata from `.query.ts` files** (these contain query, category, description — NOT expected slugs)
2. Discover candidates from bulk data (10+ slugs)
3. Analyse them with MCP summaries (5-10 candidates)
4. **COMMIT to your rankings** with scores and justifications
5. **ONLY THEN** run benchmark and read `.expected.ts` files to see expected slugs

### Rule 3: Title-only matching is NOT sufficient for discovery.

**Session 17 (German) proved this**: `das-leben-mit-behinderung-stem-changes-in-present-tense-weak-verbs` was missed initially because its unit title is "meine Welt" (not obviously about grammar). But MCP summary revealed it teaches **advanced stem variation rules** for present tense weak verbs — a highly relevant match for "German grammar present tense".

**Discovery MUST include:**

- ✅ Systematic review of ALL units (not just those with obvious titles)
- ✅ MCP summaries for lessons with ANY potential relevance
- ✅ Key learning analysis (grammar content often hidden in activity-focused lessons)
- ⛔ NOT just `grep` for title keywords
- ⛔ NOT assuming unit titles reflect lesson content

**Split File Architecture (2026-01-19)**: Ground truths are split into two files:

- `*.query.ts` — Contains query, category, description (SAFE to read in Phase 1A/1B)
- `*.expected.ts` — Contains expectedRelevance (ONLY read in Phase 1C)

**⛔ DO NOT READ `.expected.ts` FILES until Phase 1C.** If you read them earlier, you will see expected slugs and bias your discovery.

If you run benchmark first and then "discover" candidates that match what search returned, you have not done independent discovery. You have validated search results.

If you read the GT file first and then "discover" candidates that match expected slugs, you have not done independent discovery. You have validated expected slugs.

**The Key Question is NOT**: "Do expected slugs appear in results?"  
**The Key Question IS**: "What are the BEST slugs for this query, based on curriculum content?"

---

## How to Use This Document

1. **Read this prompt** — Understand the cardinal rules and quality expectations
2. **Go to checklist** — [ground-truth-review-checklist.md](../../plans/semantic-search/active/ground-truth-review-checklist.md) — Find your target subject-phase
3. **Execute the template** — [ground-truth-session-template.md](../../plans/semantic-search/templates/ground-truth-session-template.md) — LINEAR execution with **COMMIT step**

**If MCP server is unavailable: STOP and wait. Do not proceed.**

---

## Execution Protocol Overview

The protocol has three phases per category:

### Phase 1A: Query Analysis (REFLECT ONLY — no searches, no tools)

**⚠️ No jq. No MCP. No benchmark. No data exploration. Just THINKING.**

**⚠️ IGNORE EXPECTED SLUGS. They are irrelevant in Phase 1A.**

Phase 1A is about **experimental design** — does this query prove what it claims to prove?

| Step | Action | Evidence Required |
|------|--------|-------------------|
| 1A.1 | State capability being tested | What search behaviour does this category prove? |
| 1A.2 | Evaluate query as test | Is this a good test of that capability? |
| 1A.3 | Assess experimental design | Will success/failure be informative? |
| 1A.4 | Identify design issues | Is query miscategorised, trivial, or impossible? |
| 1A.5 | Make recommendation | Proceed, revise, or change category |

**⛔ QUERY GATE**: Cannot search for candidates until query is validated.

### Phase 1B: Discovery + COMMIT (BEFORE seeing search results)

| Step | Action | Evidence Required |
|------|--------|-------------------|
| 1B.1 | Search bulk data | 10+ candidate slugs from multiple search terms |
| 1B.2 | Get MCP summaries | 5-10 summaries with key learning quotes |
| 1B.3 | Get unit context | Unit structure and lesson ordering |
| 1B.4 | Analyse candidates | Reasoning for each candidate's relevance |
| 1B.5 | **COMMIT rankings** | Your top 5 with scores and justifications |

**⛔ DISCOVERY GATE**: Cannot run benchmark until rankings are COMMITTED.

### Phase 1C: Comparison (AFTER commitment)

| Step | Action | Evidence Required |
|------|--------|-------------------|
| 1C.0 | Pre-comparison verification | Confirm rankings committed before benchmark |
| 1C.1 | Run benchmark --review | Output with ALL 4 metrics |
| 1C.2 | Create three-way comparison | YOUR rankings vs SEARCH results vs EXPECTED slugs |
| 1C.3 | Answer critical question | Decision with justification |
| 1C.4 | Record ALL 4 metrics | MRR, NDCG@10, P@3, R@10 |

**Why the COMMIT step?** It forces you to form an independent judgment BEFORE seeing search results. Without it, agents repeatedly fall into the trap of validating whatever search returns.

---

## Anti-Pattern: Search Validation

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

1. Search bulk data → find candidates X, Y, Z, A, B, W...
2. Get MCP summaries → analyse each against query
3. Realise X and Y directly match query; A and B are tangential
4. COMMIT: X=#1, Y=#2, W=#3 (before seeing search)
5. Run benchmark → see search returns A, B, C
6. Three-way comparison shows differences
7. Conclude: "X and Y are better than A and B because..."

**Why correct**: Independent judgment formed first. Meaningful comparison made.

---

## Required Metrics (ALL 4, EVERY Category)

| Metric | Target | What It Reveals |
|--------|--------|-----------------|
| **MRR** | > 0.70 | Position of first relevant result |
| **NDCG@10** | > 0.75 | Overall ranking quality |
| **P@3** | > 0.50 | Are top 3 results useful? |
| **R@10** | > 0.70 | Are expected slugs found at all? |

**Diagnostic**: High R@10 + Low MRR = results found but poorly ranked (search issue)  
**Diagnostic**: Low R@10 = expected slugs may be wrong (GT issue)

---

## Search Architecture (Quick Reference)

| Source | Field | Coverage | Description |
|--------|-------|----------|-------------|
| **Structure** | `lesson_structure` | 100% | Keywords, key learning (ALL lessons) |
| **Content** | `lesson_content` | ~81% | Transcript (SOME lessons) |

**Four Retrievers**: Structure BM25, Structure ELSER, Content BM25, Content ELSER — combined via RRF.

**Ground truths should test Structure retrieval** (works for all lessons).

**Note**: MFL subjects (French, German, Spanish) and PE have ~0% content coverage (no transcripts).

---

## Category Definitions

| Category | Capability Tested | Example |
|----------|-------------------|---------|
| `precise-topic` | Basic retrieval with curriculum terms | "cam mechanisms" |
| `natural-expression` | Vocabulary bridging (informal → curriculum) | "making things move" |
| `imprecise-input` | Resilience to typos | "narative writng" |
| `cross-topic` | Finding concept intersections | "writing + grammar" |

---

## Tools Reference

| Tool | Command | Purpose |
|------|---------|---------|
| **Bulk data** | `jq` queries on bulk-downloads/*.json | Find ALL candidates (10+ per category) |
| **MCP** | `get-lessons-summary` | Keywords, key learning (5-10 per category) |
| **MCP** | `get-units-summary` | Lesson ordering in units |
| **Benchmark (review)** | `pnpm benchmark -s X -p Y -c Z --review` | Per-query details with ALL 4 metrics |
| **Benchmark (aggregate)** | `pnpm benchmark -s X -p Y` | Aggregate metrics after all categories |

---

## Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# FIRST: Read query metadata from .query.ts files (SAFE — no expected slugs)
cat src/lib/search-quality/ground-truth/SUBJECT/PHASE/CATEGORY.query.ts
# e.g.: cat src/lib/search-quality/ground-truth/geography/primary/precise-topic.query.ts
# This shows: query, category, description — NOT expectedRelevance

# Phase 1A: Query Analysis — NO COMMANDS, just REFLECT on the query

# Phase 1B: Discovery (bulk data exploration - BEFORE benchmark, BEFORE reading .expected.ts)
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/SUBJECT-PHASE.json

# Phase 1B.5: COMMIT rankings — BEFORE benchmark, BEFORE reading .expected.ts
# (Document your rankings in the template — you don't know expected slugs yet!)

# Phase 1C: Comparison (AFTER COMMIT — NOW you may read .expected.ts)
pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review
# Benchmark output shows expected slugs — first time you see them!
# Or read directly: cat src/lib/search-quality/ground-truth/SUBJECT/PHASE/CATEGORY.expected.ts

# Phase 2: Validation
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark -s SUBJECT -p PHASE --verbose
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [Checklist](../../plans/semantic-search/active/ground-truth-review-checklist.md) | Progress tracking, next target |
| [Template](../../plans/semantic-search/templates/ground-truth-session-template.md) | **LINEAR execution with COMMIT step** |
| [IR Metrics](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | Metric definitions |
| [GT Guide](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles |

---

## Key Learnings from Past Sessions

**Session 9 (English)**:

1. **"emotions" ≠ "feel"** — Vocabulary matters. Search matched query terms correctly.
2. **Low MRR can mean WRONG ground truth** — Not always a search issue.
3. **ALL 4 metrics together** — MRR alone can mislead.

**Session 12 (French cross-topic)**:
4. **Query/slug term mismatch** — Query used "verbs" but expected slugs had "avoir" without "verb" in keywords.
5. **REFLECT before searching** — This mismatch was detectable by thinking, not by running searches.

**Session 15 (Geography — flawed methodology)**:
6. **Search validation is not discovery** — Running benchmark first and justifying results is not independent discovery.
7. **COMMIT before benchmark** — Must form independent judgment before seeing search results.
8. **"actions" ≠ "effects"** — Query asking for "effects" should not expect slugs about "actions to tackle".

**Session 17 (German — exhaustive vs title-only discovery)**:
9. **Title-only matching misses excellent content** — `das-leben-mit-behinderung...` teaches advanced grammar but unit title "meine Welt" doesn't suggest this.
10. **Systematic unit review required** — Review ALL units, not just those with obvious title matches.
11. **MCP summaries reveal hidden gems** — Key learning often contains highly relevant content not visible in titles.

**Session 18 (History — discovery gaps)**:
12. **Check ALL units, not just obvious ones** — `improvements-in-public-health-in-the-19th-century` (in Medicine unit) was relevant to "factory age workers conditions" but was missed because only the Industrial Revolution unit was checked.
13. **Search can be MORE comprehensive than manual discovery** — For one query, search found relevant content that manual discovery missed. This is a signal that discovery was incomplete.
14. **100% certainty standard** — For critical subjects like maths, "good enough" is not acceptable. Every unit must be checked systematically.

---

## Remember

> **There is no time pressure. Quality is what matters.**
>
> Slow and thoughtful work creates lasting value.
> Fast and careless work causes damage that takes even longer to fix.

Take your time. Do it right.
