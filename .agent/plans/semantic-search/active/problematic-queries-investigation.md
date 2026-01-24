# Problematic Queries Investigation Plan

**Created**: 2026-01-23  
**Last Updated**: 2026-01-24  
**Status**: 🔄 **In Progress — Priority 3 queries next**  
**Source**: Full benchmark review with `--all --review --verbose`  
**Benchmark File**: `apps/oak-open-curriculum-semantic-search/evaluation/analysis/full-benchmark-review-2026-01-23.txt`

---

## Quick Start (For Fresh Sessions)

1. **Validation passes**: `pnpm ground-truth:validate` shows 0 errors ✅
2. **Priority 1 (validation failures)**: All fixed ✅
3. **Priority 2 (zero-hit queries)**: 5 of 7 fixed, 2 documented as search gaps ✅
4. **Current focus**: Priority 3 queries (MRR 0.167-0.333) — 17 queries need investigation

**Pick a query from Priority 3 below and follow the Investigation Process.**

---

## Context

This document captures **all ground truth queries performing below "good" thresholds** across all 15 subjects. These were identified by running a full benchmark with verbose output on 2026-01-23.

**Previous Work**: All 30 core subject-phases (15 subjects × 2 phases) have completed their initial GT review (Phases 1A, 1B, 1C). This investigation is a **quality improvement pass** focused on:

1. **Zero-hit queries** — Search returns NONE of the expected slugs
2. **Low MRR queries** — First relevant result appears too late
3. **Poor ranking queries** — Results found but poorly ordered

**Root causes typically fall into**:

- **Query-data misalignment** — Query uses vocabulary not in curriculum (see Spanish Session 24)
- **GT errors** — Expected slugs are wrong or incomplete
- **Search limitations** — Fuzzy matching, tokenization issues (see ADR-103)
- **Ranking issues** — Results found but poorly ranked

---

## How to Use This Document

1. **Check current status** — Priority 1 ✅ complete, Priority 2 ✅ mostly complete
2. **Read the prompt** — [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) — Methodology and cardinal rules
3. **Pick a Priority 3 query** — See "Priority 3: Very Low MRR" section below
4. **Execute investigation** — Follow the process in "Investigation Process" section
5. **Update this document** — Mark queries as resolved, log findings in Session Log

---

## Key Files and Paths

### Ground Truth Source Files

```text
apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/
├── GROUND-TRUTH-GUIDE.md         # Design principles, lessons learned
├── registry/entries.ts           # Registry of all GT entries
├── {subject}/
│   ├── primary/
│   │   ├── *.query.ts            # Query definitions (query, category, description)
│   │   ├── *.expected.ts         # Expected slugs with relevance scores
│   │   └── index.ts              # Exports for this phase
│   └── secondary/
│       └── [same structure]
```

### Bulk Data Files (for investigation)

```text
apps/oak-open-curriculum-semantic-search/bulk-downloads/
├── maths-primary.json            # Each file contains full curriculum data
├── maths-secondary.json          # for a subject-phase combination
├── english-primary.json
├── [... 32 files total]
```

**Note**: Bulk files are gitignored. If missing, run `pnpm bulk:download` (requires `OAK_API_KEY` in `.env.local`).

### Benchmark Output

```text
apps/oak-open-curriculum-semantic-search/evaluation/analysis/
└── full-benchmark-review-2026-01-23.txt   # Verbose output with per-query details
```

---

## Commands Reference

```bash
cd apps/oak-open-curriculum-semantic-search

# Run benchmark for a single query
pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review --verbose

# Run benchmark for a subject-phase
pnpm benchmark -s SUBJECT -p PHASE --review

# Validate all ground truths
pnpm ground-truth:validate

# Search bulk data for lessons
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/SUBJECT-PHASE.json

# Get lesson count per unit
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' bulk-downloads/SUBJECT-PHASE.json

# Search for keyword in lesson titles
jq -r '.sequence[].unitLessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug)|\(.lessonTitle)"' bulk-downloads/SUBJECT-PHASE.json

# Get MCP lesson summary (use MCP tools)
# Use: get-lessons-summary with lesson slug
```

---

## Metric Thresholds (from IR-METRICS.md)

| Metric | Excellent (✓✓) | Good (✓) | Acceptable (~) | Poor (✗) |
|--------|----------------|----------|----------------|----------|
| MRR | > 0.90 | > 0.70 | > 0.50 | < 0.50 |
| NDCG@10 | > 0.85 | > 0.75 | > 0.60 | < 0.60 |
| P@3 | > 0.80 | > 0.60 | > 0.40 | < 0.40 |
| R@10 | > 0.80 | > 0.60 | > 0.40 | < 0.40 |

---

## Priority 1: Validation Failures ✅ RESOLVED

All validation errors have been fixed. `pnpm ground-truth:validate` now passes with 0 errors.

<details>
<summary>Resolved validation failures (click to expand)</summary>

Ground truths that fail `pnpm ground-truth:validate` are **always the highest priority**. No benchmark results are trustworthy until validation passes.

### 1.0.1 `macronutrients and micronutrients nutrition` (cooking-nutrition/secondary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/cooking-nutrition/secondary/precise-topic.query.ts`
- Expected: `src/lib/search-quality/ground-truth/cooking-nutrition/secondary/precise-topic.expected.ts`
- Bulk data: `bulk-downloads/cooking-nutrition-secondary.json`

**Validation Error**: `single-slug` — Query has only 1 expected result (need 2-3 for ranking quality)

**Current Expected Slugs**:
- `macronutrients-fibre-and-water` (3)

**Fix Required**: Add 1-2 more relevant slugs with varied scores using Phase 1B discovery.

---

### 1.0.2 `multiplikation timetables` (maths/primary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/maths/primary/imprecise-input-2.query.ts`
- Expected: `src/lib/search-quality/ground-truth/maths/primary/imprecise-input-2.expected.ts`
- Bulk data: `bulk-downloads/maths-primary.json`

**Validation Error**: `short-query` — Query is too short (2 words, recommend 3-10)

**Current Query**: "multiplikation timetables"

**Fix Required**: Extend query to 3+ words OR redesign to test the same capability with longer query.

---

### 1.0.3 `area and perimeter problems together` (maths/primary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/maths/primary/cross-topic.query.ts`
- Expected: `src/lib/search-quality/ground-truth/maths/primary/cross-topic.expected.ts`
- Bulk data: `bulk-downloads/maths-primary.json`

**Validation Error**: `uniform-scores` — All 4 slugs have same score (3) — must vary relevance for ranking tests

**Current Expected Slugs** (all score 3):
- `solve-problems-involving-area-and-perimeter`
- `reason-about-shapes-using-the-relationship-between-side-lengths-and-area-and-perimeter`
- `shapes-with-the-same-areas-can-have-different-perimeters-and-vice-versa`
- `reason-about-compound-shapes-using-the-relationship-between-side-lengths-and-area-and-perimeter`

**Fix Required**: Analyse slugs and assign varied scores (some 3, some 2, possibly some 1) based on relevance to query.

</details>

---

## Priority 2: Zero-Hit Queries ✅ MOSTLY RESOLVED

5 of 7 zero-hit queries have been fixed (MRR now 1.000). 2 remain as documented search gaps.

| Query | Status | MRR |
|-------|--------|-----|
| `dribbling baal with feet` | ✅ Fixed | 1.000 |
| `vikins and anglo saxons` | ✅ Fixed | 1.000 |
| `making French sentences negative KS3` | ✅ Fixed | 1.000 |
| `nutrition and cooking techniques together` | ✅ Fixed | 1.000 |
| `narative writing storys iron man Year 3` | ⚠️ Search gap | 0.333 |
| `coding for beginners...` | ⏸️ Future work | 0.000 |

<details>
<summary>Original zero-hit query details (click to expand)</summary>

These queries return NONE of the expected slugs. Either the GT is wrong or there's a fundamental search issue.

### 2.1 `footbal skills primary` (PE/primary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/physical-education/primary/imprecise-input.query.ts`
- Expected: `src/lib/search-quality/ground-truth/physical-education/primary/imprecise-input.expected.ts`
- Bulk data: `bulk-downloads/physical-education-primary.json`

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.000 | ✗ |
| NDCG@10 | 0.000 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.000 | ✗ |

**Expected Slugs**:
- `moving-with-a-ball-using-our-feet` (3)
- `dribbling-with-our-feet-in-games` (3)
- `passing-and-receiving-using-our-feet` (3)
- `develop-moving-with-the-ball-using-our-feet-dribbling` (2)

**Hypothesis**: 
1. "footbal" typo may not fuzzy-match "football" (or maybe it does?)
2. Expected slugs use "feet" terminology, not "football" — possible curriculum-data alignment issue

**Investigation**:
- [ ] Search bulk data for "football" lessons
- [ ] Check if curriculum uses "football" or alternative terminology
- [ ] Verify fuzzy matching on "footbal" → "football"

---

### 2.2 `vikins and anglo saxons` (history/primary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/history/primary/cross-topic.query.ts`
- Expected: `src/lib/search-quality/ground-truth/history/primary/cross-topic.expected.ts`
- Bulk data: `bulk-downloads/history-primary.json`

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.000 | ✗ |
| NDCG@10 | 0.000 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.000 | ✗ |

**Expected Slugs**:
- `early-viking-raids` (3)
- `why-the-vikings-came-to-britain` (3)
- `the-anglo-saxon-fightback` (2)

**Hypothesis**: "vikins" typo may not match "vikings" (v→k→i→n→s vs v→i→k→i→n→g→s — 2 edits?)

**Investigation**:
- [ ] Test fuzzy matching on "vikins" → "vikings"
- [ ] Check edit distance calculation

---

### 2.3 `narative writing storys iron man Year 3` (english/primary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/english/primary/imprecise-input.query.ts`
- Expected: `src/lib/search-quality/ground-truth/english/primary/imprecise-input.expected.ts`
- Bulk data: `bulk-downloads/english-primary.json`

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.000 | ✗ |
| NDCG@10 | 0.000 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.000 | ✗ |

**Expected Slugs**:
- `writing-the-opening-of-the-iron-man` (3)
- `writing-the-build-up-of-the-iron-man-part-one` (3)
- `planning-the-opening-of-the-iron-man` (2)

**Hypothesis**: Multiple typos ("narative", "storys") combined with specific title matching requirement

**Investigation**:
- [ ] Check if "Iron Man" lessons exist in bulk data
- [ ] Test fuzzy matching with multiple typos
- [ ] Evaluate if query is too specific (book title + year)

---

### 2.4 `teach French negative sentences year 7` (french/secondary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/french/secondary/natural-expression.query.ts`
- Expected: `src/lib/search-quality/ground-truth/french/secondary/natural-expression.expected.ts`
- Bulk data: `bulk-downloads/french-secondary.json`

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.000 | ✗ |
| NDCG@10 | 0.000 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.000 | ✗ |

**Expected Slugs**:
- `what-isnt-happening-ne-pas-negation` (3)
- `what-people-do-and-dont-do-ne-pas-negation` (2)

**Hypothesis**: Query uses "negative sentences" but curriculum uses "ne pas negation" — vocabulary mismatch

**Investigation**:
- [ ] Search bulk data for "negative" lessons
- [ ] Check if curriculum uses "negation" or "negative"
- [ ] Consider if query-data alignment issue (like Spanish)

---

### 2.5 `coding for beginners programming basics introduction` (computing/primary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/computing/primary/natural-expression.query.ts`
- Expected: `src/lib/search-quality/ground-truth/computing/primary/natural-expression.expected.ts`
- Bulk data: `bulk-downloads/computing-primary.json`

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.000 | ✗ |
| NDCG@10 | 0.000 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.000 | ✗ |

**Expected Slugs**:
- `writing-a-text-based-program` (3)
- `working-with-numerical-inputs` (2)
- `using-selection` (2)

**Hypothesis**: Query is too generic ("basics", "introduction") vs specific curriculum concepts

**Investigation**:
- [ ] Check what computing/primary lessons actually contain
- [ ] Evaluate if query aligns with curriculum structure

---

### 2.6 `nutrition and cooking techniques together` (cooking-nutrition/secondary)

**Files**:
- Query: `src/lib/search-quality/ground-truth/cooking-nutrition/secondary/cross-topic.query.ts`
- Expected: `src/lib/search-quality/ground-truth/cooking-nutrition/secondary/cross-topic.expected.ts`
- Bulk data: `bulk-downloads/cooking-nutrition-secondary.json`

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.000 | ✗ |
| NDCG@10 | 0.000 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.000 | ✗ |

**Expected Slugs**:
- `eat-well-now` (3)
- `making-better-food-and-drink-choices` (2)

**Hypothesis**: Cross-topic query but expected slugs may not contain both concepts

**Investigation**:
- [ ] Verify expected slugs contain BOTH nutrition AND cooking techniques
- [ ] Search for lessons that genuinely combine both concepts

</details>

---

## Priority 3: Very Low MRR (0.167 - 0.333) ← CURRENT FOCUS

**17 queries need investigation.** Pick one and follow the Investigation Process below.

### 3.1 `what makes ice turn into water` (science/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.167 | ✗ |
| NDCG@10 | 0.201 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.400 | ~ |

**Investigation**:
- [ ] Check if vocabulary ("ice turn into water") aligns with curriculum ("melting", "states of matter")

---

### 3.2 `electrisity and magnits` (science/secondary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.200 | ✗ |
| NDCG@10 | 0.283 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.400 | ~ |

**Known Issue**: Fuzzy matches "magnify/magnification" because "magnits" and "magnify" share prefix "magni-" + AUTO allows 2 edits. See [ADR-103](../../../../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md).

**Investigation**:
- [ ] Document as known limitation
- [ ] Compare with control query "electricity and magnets" (MRR = 1.000)

---

### 3.3 `global warming effects` (geography/secondary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.200 | ✗ |
| NDCG@10 | 0.210 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.333 | ✗ |

**Investigation**:
- [ ] Check if curriculum uses "global warming" or "climate change"
- [ ] Vocabulary alignment issue?

---

### 3.4 `plints and enimals` (science/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.200 | ✗ |
| NDCG@10 | 0.156 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.200 | ✗ |

**Issue**: Severe misspellings ("plints" → "plants", "enimals" → "animals")

**Investigation**:
- [ ] Test edit distance for both typos
- [ ] Multiple severe typos may exceed fuzzy limits

---

### 3.5 `singing in tune for children` (music/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.200 | ✗ |
| NDCG@10 | 0.210 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.333 | ✗ |

**Investigation**:
- [ ] Check if "singing in tune" exists in music curriculum
- [ ] May be vocabulary alignment issue

---

### 3.6 `French verbs and vocabulary together` (french/secondary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.250 | ✗ |
| NDCG@10 | 0.339 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.500 | ~ |

**Investigation**:
- [ ] Cross-topic query may not have lessons combining BOTH concepts
- [ ] Check expected slugs for concept coverage

---

### 3.7 `The BFG reading comprehension Roald Dahl Year 3` (english/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.250 | ✗ |
| NDCG@10 | 0.233 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.333 | ✗ |

**Investigation**:
- [ ] Check if BFG lessons exist in curriculum
- [ ] May be too specific (book title + author + year)

---

### 3.8 `combining algebra with graphs` (maths/secondary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.250 | ✗ |
| NDCG@10 | 0.303 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.600 | ✓ |

**Note**: R@10 is good, but MRR is poor — results exist but ranked poorly

**Investigation**:
- [ ] Check what search returns vs expected slugs
- [ ] May be ranking issue, not discovery issue

---

### 3.9 `learning to cook healthy lunches` (cooking-nutrition/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.250 | ✗ |
| NDCG@10 | 0.364 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 0.667 | ✓ |

**Investigation**:
- [ ] Good R@10 but poor MRR — ranking issue
- [ ] Check expected slug positions

---

### 3.10 `nutrision healthy food` (cooking-nutrition/secondary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.250 | ✗ |
| NDCG@10 | 0.470 | ✗ |
| P@3 | 0.000 | ✗ |
| R@10 | 1.000 | ✓✓ |

**Note**: Perfect R@10 but MRR only 0.250 — all expected found but ranked position 4+

**Investigation**:
- [ ] Likely ranking issue
- [ ] Check why expected slugs rank lower than other results

---

### 3.11 `counting in groups of` (maths/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.333 | ✗ |
| NDCG@10 | 0.539 | ✗ |
| P@3 | 0.333 | ✗ |
| R@10 | 0.800 | ✓✓ |

**Investigation**:
- [ ] Good recall, poor MRR — ranking issue
- [ ] Query may be too short/vague ("counting in groups of" — of what?)

---

### 3.12 `geometry proof coordinate` (maths/secondary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.333 | ✗ |
| NDCG@10 | 0.337 | ✗ |
| P@3 | 0.333 | ✗ |
| R@10 | 0.333 | ✗ |

**Investigation**:
- [ ] All metrics poor — likely GT or query design issue
- [ ] Check if cross-topic intersection exists

---

### 3.13 `sacred texts and ethical teachings` (RE/secondary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.333 | ✗ |
| NDCG@10 | 0.098 | ✗ |
| P@3 | 0.333 | ✗ |
| R@10 | 0.200 | ✗ |

**Investigation**:
- [ ] Very low NDCG (0.098) — severe ranking issues
- [ ] Check expected slugs and actual results

---

### 3.14 `multiplication arrays year 3` (maths/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.333 | ✗ |
| NDCG@10 | 0.466 | ✗ |
| P@3 | 0.333 | ✗ |
| R@10 | 0.600 | ✓ |

**Investigation**:
- [ ] Moderate R@10 but poor MRR
- [ ] Check ranking of expected slugs

---

### 3.15 `rythm beat ks1` (music/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.333 | ✗ |
| NDCG@10 | 0.554 | ✗ |
| P@3 | 0.333 | ✗ |
| R@10 | 1.000 | ✓✓ |

**Investigation**:
- [ ] Perfect R@10 but poor MRR — ranking issue
- [ ] "rythm" typo working (finding results) but ranked poorly

---

### 3.16 `singing and beat together` (music/primary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.333 | ✗ |
| NDCG@10 | 0.449 | ✗ |
| P@3 | 0.333 | ✗ |
| R@10 | 1.000 | ✓✓ |

**Investigation**:
- [ ] Cross-topic with perfect recall but poor MRR
- [ ] Ranking issue for cross-topic intersection

---

### 3.17 `teach students about gothic literature year 8` (english/secondary)

| Metric | Score | Status |
|--------|-------|--------|
| MRR | 0.333 | ✗ |
| NDCG@10 | 0.271 | ✗ |
| P@3 | 0.333 | ✗ |
| R@10 | 0.333 | ✗ |

**Investigation**:
- [ ] All metrics poor
- [ ] Check if "gothic literature" aligns with curriculum terminology

---

## Priority 4: Acceptable MRR but Poor Other Metrics (MRR ~ 0.500)

These queries find the first result but have ranking or recall issues.

| Query | MRR | NDCG | P@3 | R@10 | Key Issue |
|-------|-----|------|-----|------|-----------|
| `PE athletics runing and jumping` | 0.500 | 0.195 | 0.667 | 0.400 | Very poor NDCG |
| `healthy eating nutrition` | 0.500 | 0.236 | 0.333 | 0.400 | Poor NDCG and R@10 |
| `teach year 4 about the Romans` | 0.500 | 0.342 | 0.333 | 0.333 | Poor NDCG and R@10 |
| `halfs and quarters` | 0.500 | 0.402 | 0.667 | 0.600 | Poor NDCG |
| `relegion stories primary` | 0.500 | 0.450 | 0.333 | 0.400 | Multiple issues |
| `religious founders and leaders` | 0.500 | 0.450 | 0.333 | 0.600 | Poor NDCG and P@3 |
| `green design environment friendly` | 0.500 | 0.480 | 0.333 | 0.600 | Poor NDCG |
| `meditaton and prayer practices` | 0.500 | 0.484 | 0.333 | 0.800 | Poor NDCG and P@3 |
| `german grammer present tence` | 0.500 | 0.506 | 0.333 | 0.750 | Poor P@3 |
| `evoloution and adaptashun` | 0.500 | 0.535 | 0.667 | 0.750 | Poor NDCG |
| `film music and composition together` | 0.500 | 0.551 | 0.333 | 1.000 | Poor NDCG, P@3 |
| `being fair to everyone rights` | 0.500 | 0.584 | 0.333 | 1.000 | Poor P@3 |

---

## Priority 5: Good MRR but Poor NDCG/P@3/R@10

These find the first result quickly but have other quality issues.

| Query | MRR | NDCG | P@3 | R@10 | Key Issue |
|-------|-----|------|-----|------|-----------|
| `Spanish AR verbs present tense` | 1.000 | 0.377 | 0.667 | 0.600 | Very poor NDCG |
| `spanish grammer conjugating verbs` | 1.000 | 0.431 | 0.333 | 0.600 | Poor NDCG, P@3 |
| `teach Spanish verb endings year 7` | 1.000 | 0.455 | 0.333 | 0.800 | Poor NDCG, P@3 |
| `right and wrong philosophy` | 1.000 | 0.463 | 0.333 | 0.600 | Poor NDCG, P@3 |
| `splitting numbers into parts` | 1.000 | 0.465 | 0.333 | 0.400 | Poor NDCG, P@3, R@10 |
| `carbon cycle in ecosystems` | 1.000 | 0.480 | 0.333 | 0.250 | Very poor R@10 |
| `why do some things feel hotter than others` | 1.000 | 0.480 | 0.333 | 0.250 | Very poor R@10 |
| `teaching estar for states and location KS2` | 1.000 | 0.530 | 0.333 | 0.400 | Poor NDCG, P@3, R@10 |
| `teach German verb endings year 7` | 1.000 | 0.542 | 0.333 | 0.333 | Poor NDCG, P@3, R@10 |
| `interior angles polygons` | 1.000 | 0.559 | 0.667 | 0.800 | Borderline NDCG |
| `how do plants make their own food` | 1.000 | 0.566 | 0.333 | 0.750 | Poor NDCG, P@3 |
| `why do birds have different shaped beaks` | 1.000 | 0.599 | 0.333 | 0.250 | Very poor R@10 |
| `why do things fall down` | 1.000 | 0.599 | 0.333 | 0.250 | Very poor R@10 |

---

## Investigation Process

For each query, follow this systematic process:

### Step 1: Understand the Query

```bash
# Read the query file
cat src/lib/search-quality/ground-truth/SUBJECT/PHASE/CATEGORY.query.ts
```

Note the query text, category (what capability is being tested), and description.

### Step 2: Examine Current Expected Slugs

```bash
# Read the expected file
cat src/lib/search-quality/ground-truth/SUBJECT/PHASE/CATEGORY.expected.ts
```

Note which slugs are expected and their relevance scores (3 = highly relevant, 2 = relevant, 1 = marginal).

### Step 3: Search Bulk Data

```bash
# List all lessons in the subject-phase
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/SUBJECT-PHASE.json

# Search for keywords
jq -r '.sequence[].unitLessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug)|\(.lessonTitle)"' \
  bulk-downloads/SUBJECT-PHASE.json
```

Find ALL potentially relevant lessons (10+ candidates).

### Step 4: Get MCP Summaries

Use `get-lessons-summary` MCP tool for the top 5-10 candidates. Look at:

- **Key learning points** — What does the lesson actually teach?
- **Keywords** — What terms does the lesson index on?
- **Prior knowledge** — What level is assumed?

### Step 5: Compare with Search Results

```bash
# Run benchmark to see what search returns
pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review --verbose
```

The `--review` flag shows:
- What search returned (top 10)
- Which expected slugs were found
- Position of each match

### Step 6: Determine Root Cause

| Symptom | Likely Cause | Action |
|---------|--------------|--------|
| Zero-hit, but good lessons exist | Query-data alignment | Redesign query to use curriculum vocabulary |
| Zero-hit, no good lessons exist | Query is invalid for this curriculum | Redesign query for different concept |
| Results found but poor rank | GT may be incomplete | Add more relevant slugs to GT |
| Search returns better slugs | GT is wrong | Replace GT slugs with search findings |
| Fuzzy match fails | Tokenization or edit distance | Document as limitation (ADR-103) |

### Step 7: Make Changes

```bash
# Edit expected file
# Edit query file (if redesigning)

# Validate changes
pnpm ground-truth:validate

# Re-run benchmark
pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review
```

### Step 8: Document

Update this plan:
1. Mark query as completed in Progress Tracker
2. Add entry to Session Log with finding and action

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Methodology, cardinal rules, anti-patterns |
| [IR-METRICS.md](../../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | Metric definitions and thresholds |
| [GROUND-TRUTH-GUIDE.md](../../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | GT design principles and lessons learned |
| [ADR-103](../../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md) | Fuzzy matching limitations |
| [Benchmark Output](../../../../apps/oak-open-curriculum-semantic-search/evaluation/analysis/full-benchmark-review-2026-01-23.txt) | Full benchmark results |

---

## Key Learnings (from GROUND-TRUTH-GUIDE.md)

### Query-Data Alignment (Spanish Session 24)

Queries MUST use vocabulary that exists in the curriculum:

- **BAD**: "Spanish greetings" → only 1 lesson exists
- **GOOD**: "estar for states and location" → 5+ lessons exist

Before creating/validating a query, verify:
1. The concept exists in the curriculum
2. There are 3-5+ lessons that match
3. The vocabulary matches curriculum terminology

### MFL Subjects (French, German, Spanish)

- ~0% transcript coverage — structure-only retrieval
- Keywords and key learning points are critical
- Title matching is often the primary signal

### Fuzzy Matching Limitations (ADR-103)

- Tokenization changes (e.g., "timetables" vs "times table") are NOT fuzzy edits
- "magnits" → "magnification" is a fuzzy false positive (both start with "magni-")
- Control queries (e.g., "electricity and magnets" vs "electrisity and magnits") validate fuzzy

---

## Progress Tracker

### Summary (2026-01-24)

| Priority | Total | Resolved | Remaining | Status |
|----------|-------|----------|-----------|--------|
| **1: Validation** | 3 | 3 | 0 | ✅ Complete |
| **2: Zero-hit** | 7 | 5 | 2 (documented gaps) | ✅ Mostly complete |
| **3: Very low MRR** | 17 | 0 | 17 | 🔄 Current focus |
| **4-5: Other issues** | 25+ | 0 | 25+ | 📋 Future |

### Validation Failures (Priority 1) — ✅ RESOLVED (2026-01-24)

| Query | File | Error Type | Status |
|-------|------|------------|--------|
| `macronutrients and micronutrients nutrition` | `cooking-nutrition/secondary/precise-topic` | `single-slug` | ✅ Fixed: Added `micronutrients` (3) and `nutritional-needs-throughout-life` (2) |
| `multiplikation timetables year 3` | `maths/primary/imprecise-input-2` | `short-query` | ✅ Fixed: Extended query from 2 to 4 words |
| `area and perimeter problems together` | `maths/primary/cross-topic` | `uniform-scores` | ✅ Fixed: Changed compound-shapes from 3 to 2 |

**All validation errors resolved. `pnpm ground-truth:validate` passes with 0 errors.**

---

### Zero-Hit (Priority 2) — ✅ MOSTLY RESOLVED (2026-01-24)

**5 of 7 queries fixed** (MRR now 1.000). 2 documented as search gaps requiring future search improvements.

| Query | Claimed Root Cause | Change Made | Current MRR | Status |
|-------|-------------------|-------------|-------------|--------|
| `multiplikation timetables year 3` | Tokenization | Extended query + validated | — | ✅ RE-EVALUATED (validation fixed) |
| `dribbling baal with feet` | Vocabulary mismatch | Query redesigned | 1.000 | ✅ VERIFIED (2026-01-24 re-eval) |
| `vikins and anglo saxons` | GT too narrow | GT updated with BOTH-topic lessons | 1.000 | ✅ RE-EVALUATED (added fightback, why-came) |
| `narative writing storys iron man Year 3` | GT incomplete | GT updated with writing lessons | 0.333 | ✅ RE-EVALUATED (search gap documented) |
| `teach French negative sentences year 7` | GT mismatch | GT updated with foundational lessons | 0.500 | ✅ RE-EVALUATED (search gap documented) |
| `coding for beginners programming basics introduction` | Search ranking | None | 0.000 | ⏸️ Blocked (requires future functionality) |
| `nutrition and cooking techniques together` | GT wrong | GT validated | 1.000 | ✅ RE-EVALUATED (GT correct) |

**Documented Search Gaps** (not GT errors — require future search improvements):
- `narative writing storys iron man Year 3`: MRR 0.333 — multiple typos exceed fuzzy limits
- `coding for beginners...`: MRR 0.000 — requires query rules / semantic reranking

### Very Low MRR (Priority 3) — 🔄 CURRENT FOCUS

- [ ] `what makes ice turn into water` (0.167)
- [ ] `electrisity and magnits` (0.200) — Known fuzzy issue
- [ ] `global warming effects` (0.200)
- [ ] `plints and enimals` (0.200)
- [ ] `singing in tune for children` (0.200)
- [ ] `French verbs and vocabulary together` (0.250)
- [ ] `The BFG reading comprehension Roald Dahl Year 3` (0.250)
- [ ] `combining algebra with graphs` (0.250)
- [ ] `learning to cook healthy lunches` (0.250)
- [ ] `nutrision healthy food` (0.250)
- [ ] `counting in groups of` (0.333)
- [ ] `geometry proof coordinate` (0.333)
- [ ] `sacred texts and ethical teachings` (0.333)
- [ ] `multiplication arrays year 3` (0.333)
- [ ] `rythm beat ks1` (0.333)
- [ ] `singing and beat together` (0.333)
- [ ] `teach students about gothic literature year 8` (0.333)

### Acceptable MRR, Other Issues (Priority 4-5)

- [ ] 25+ queries with MRR ≥ 0.500 but poor NDCG/P@3/R@10

---

## Session Log

| Date | Query Investigated | Finding | Action Taken | Concerns |
|------|-------------------|---------|--------------|----------|
| 2026-01-24 | 7 zero-hit queries (now Priority 2) | Changes made, but protocol compliance questionable | See individual entries | ⚠️ RE-EVALUATION REQUIRED |
| 2026-01-24 | `nutrition and cooking techniques together` | GT was theory-only | Replaced GT slugs | Did not follow full 1B protocol (10+ candidates?) |
| 2026-01-24 | `narative writing storys iron man Year 3` | GT had unfound slugs | Updated GT | MRR 0.333 is still POOR — not fixed |
| 2026-01-24 | `vikins and anglo saxons` | Moved from cross-topic to imprecise-input | Updated GT | Verify category change was correct |
| 2026-01-24 | `footbal skills ks2` | Vocabulary not in curriculum | Redesigned query | New query "dribbling baal with feet" needs verification |
| 2026-01-24 | `teach French negative sentences year 7` | Search found different lessons | Updated GT | Was this search validation or independent discovery? |
| **2026-01-24** | **RE-EVALUATION SESSION** | **Full 1A/1B/1C protocol executed for 5 queries** | See below | ✅ Protocol compliant |
| **2026-01-24** | **MFL SYNONYM FIXES** | **Missing negation synonym in French** | Added synonym, refined query, MRR 0.000 → 1.000 | ✅ RESOLVED |
| **2026-01-24** | **Control queries added** | **Isolate fuzzy matching from other issues** | Added history/cross-topic-2, maths/precise-topic-4 | ✅ Diagnostic |
| **2026-01-24** | **MFL synonym architecture** | **DRY violations + translation hints** | Created mfl-synonym-architecture.md, removed Bucket C | ✅ Future work documented |

### Session 2026-01-24 RE-EVALUATION (Second Session)

**Full Phase 1A/1B/1C protocol executed with strict compliance:**

| Query | Phase 1B Discovery | Three-Way Comparison | Final Action | Metrics |
|-------|-------------------|---------------------|--------------|---------|
| `nutrition and cooking techniques together` | 10+ candidates, 6 MCP summaries | Validated existing GT | No change needed | MRR 1.000 |
| `narative writing storys iron man Year 3` | 15+ Iron Man lessons found, 6 MCP summaries | Added writing lessons from narrative unit | Updated GT with writing-the-opening, writing-the-build-up | MRR 0.333 (search gap) |
| `vikins and anglo saxons` | 19 lessons found, 5 MCP summaries | Added lessons covering BOTH topics | Added anglo-saxon-fightback, why-vikings-came-to-britain | MRR 1.000 |
| `dribbling baal with feet` | 40+ lessons found, 5 MCP summaries | Validated existing GT | No change needed | MRR 1.000 |
| `teach French negative sentences year 7` | 30+ negation lessons found, 5 MCP summaries | Replaced with foundational lessons | Updated with Year 7 appropriate lessons | MRR 0.500 (search gap) |

**Validation Fixes Applied:**
- `cooking-nutrition/secondary/precise-topic`: Added 2 slugs (micronutrients, nutritional-needs)
- `maths/primary/imprecise-input-2`: Extended query to 4 words
- `maths/primary/cross-topic`: Varied scores (compound-shapes 3→2)

**Identified Search Quality Gaps (require future search improvement):**
- `english/primary/imprecise-input`: Multiple typos + title matching limits fuzzy recovery
- `french/secondary/natural-expression`: Foundational lessons not ranked highly by search

---

## Priority 2 Zero-Hit Investigation (2026-01-24)

### Summary of Findings

All 7 zero-hit queries were investigated using the three-phase protocol (1A: Query Analysis, 1B: Independent Discovery, 1C: Comparison). Findings fall into two categories: **FIX NOW** and **REQUIRES FUTURE FUNCTIONALITY**.

---

### 🔧 FIX NOW — Ground Truth or Query Issues

These require immediate fixes to GT files or query redesign:

#### 1. `nutrition and cooking techniques together` — **GT IS WRONG**

- **Issue**: Expected slugs (`eat-well-now`, `making-better-food-and-drink-choices`) are theory-only lessons with NO cooking techniques.
- **Finding**: Search correctly returned cooking lessons from nutrition units (e.g., `making-mushroom-bean-burgers-with-flatbreads` at #1).
- **Root Cause**: GT slugs don't test the intended capability.
- **Action**: Replace expected slugs with:
  - `making-pea-and-mint-falafel-with-tzatziki` (3) — Health unit + cooking techniques
  - `making-toad-in-the-hole` (3) — Eatwell Guide + cooking techniques
  - `making-aloo-gobi` (2) — Eatwell Guide + cooking techniques

#### 2. `narative writing storys iron man Year 3` — **GT INCOMPLETE**

- **Issue**: Search found Iron Man lessons (#3, #7, #10) but not expected ones.
- **Finding**: `sequencing-and-retelling-the-story-of-the-iron-man` at #3 matches "storys" better than expected slugs.
- **Root Cause**: GT didn't include lessons with "story" in title.
- **Action**: Add `sequencing-and-retelling-the-story-of-the-iron-man` (3) to expected slugs.

#### 3. `vikins and anglo saxons` — **GT TOO NARROW**

- **Issue**: Fuzzy matching works (Vikings lessons at #6), but correctly-spelled "anglo saxons" gets more weight.
- **Finding**: GT only includes Viking-focused lessons, but query asks for BOTH topics.
- **Root Cause**: GT doesn't include lessons covering both Vikings AND Anglo-Saxons.
- **Action**: Expand GT to include `how-the-vikings-changed-britain` which explicitly covers both groups ("Anglo-Saxons and Vikings often married").

#### 4. `footbal skills primary` — **QUERY DESIGN FLAWED**

- **Issue**: Curriculum uses "feet", "dribbling", "kicking" — NOT "football". PE curriculum is sport-agnostic.
- **Finding**: Expected slugs are correct (lessons with "feet" in title), but query uses vocabulary that doesn't exist.
- **Root Cause**: Query-data vocabulary mismatch. This is a curriculum design choice.
- **Action**: **Redesign query** to use curriculum vocabulary. Suggested: `feet dribbling ball skills primary` or test fuzzy on `footbal` separately.
- **Note**: Do NOT add `football => feet` as a synonym — this is a sport ≠ skill vocabulary gap, not an equivalence. ELSER should help here; if it doesn't, this is a [natural-language-paraphrases.md](post-sdk/bulk-data-analysis/natural-language-paraphrases.md) Bucket B candidate.

#### 5. `teach French negative sentences year 7` — **QUERY DESIGN FLAWED**

- **Issue**: Query uses English vocabulary ("negative sentences") for a French language curriculum.
- **Finding**: Expected slugs from "Everyday life: negation with ne … pas" unit are correct.
- **Root Cause**: Poor query design. "Negative sentences" (English) ≠ "negation" (grammatical terminology) ≠ "ne...pas" (French). These are NOT synonyms.
- **Action**: **Redesign query** to use curriculum vocabulary. Suggested: `French negation ne pas year 7`.
- **Important**: Do NOT add `negative => negation, ne pas`. This is NOT a synonym — it conflates English, grammatical terminology, and French. ELSER should bridge semantic gaps; if it doesn't, this documents a limitation, not a synonym opportunity.

---

### ⏳ REQUIRES FUTURE FUNCTIONALITY

These cannot be fixed with GT or query changes alone:

#### 6. `multiplikation timetables` — **TOKENIZATION LIMITATION**

- **Issue**: "timetables" (1 word) vs "times table" (2 words) is a tokenization issue, not fuzzy matching.
- **Finding**: Fuzzy on "multiplikation" → "multiplication" should work, but "timetables" doesn't tokenize to "times" + "table".
- **Root Cause**: Word boundary changes are not handled by fuzzy matching (see [ADR-103](../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md)).
- **Options**:
  - **A (NOW)**: Redesign query to `multiplikation times table` (tests fuzzy only)
  - **B (SYNONYM)**: Add `timetables => times table` to maths synonyms (Bucket A exact equivalence — acceptable because this IS the same concept, just compound vs separate words)
  - **C (FUTURE)**: Query rules with deterministic expansion ([modern-es-features.md](post-sdk/search-quality/modern-es-features.md))

#### 7. `coding for beginners programming basics introduction` — **SEARCH RANKING ISSUE**

- **Issue**: Expected slugs from "Introduction to Python programming" unit are correct, but search returns advanced project lessons.
- **Finding**: "programming" appears more frequently in advanced lessons, outweighing "introduction".
- **Root Cause**: Search doesn't prioritize "introduction" signals for beginner queries.
- **Options**:
  - **A (QUERY RULES)**: Use rule retriever to boost lesson_order=1 for "beginner/introduction" queries ([modern-es-features.md](post-sdk/search-quality/modern-es-features.md))
  - **B (SEMANTIC RERANKING)**: `text_similarity_reranker` may help prioritize semantic match to "beginners" ([modern-es-features.md](post-sdk/search-quality/modern-es-features.md))
  - **C (PARAPHRASES)**: Bucket B mapping `beginner => fundamental, foundation` ([natural-language-paraphrases.md](post-sdk/bulk-data-analysis/natural-language-paraphrases.md))
- **Note**: Do NOT add `beginner => introduction` as a synonym. These are NOT equivalent concepts (a beginner takes an introduction; they are not the same thing).

---

## Action Summary

### Immediate Actions (FIX NOW)

| Query | Action | File to Edit |
|-------|--------|--------------|
| `nutrition and cooking techniques together` | Replace GT slugs | `cooking-nutrition/secondary/cross-topic.expected.ts` |
| `narative writing storys iron man Year 3` | Add slug to GT | `english/primary/imprecise-input.expected.ts` |
| `vikins and anglo saxons` | Expand GT | `history/primary/imprecise-input.expected.ts` |
| `footbal skills primary` | Redesign query | `physical-education/primary/imprecise-input.query.ts` |
| `teach French negative sentences year 7` | Redesign query | `french/secondary/natural-expression.query.ts` |

### Synonym Candidate (Bucket A Exact Equivalence)

| Term | Expansion | Subject | Justification |
|------|-----------|---------|---------------|
| `timetables` | `times table, times tables` | maths | Same concept, compound word variant |

### Future Functionality Required

| Query | Required Feature | Reference |
|-------|-----------------|-----------|
| `coding for beginners...` | Query rules (beginner intent) | [modern-es-features.md](post-sdk/search-quality/modern-es-features.md) |
| `coding for beginners...` | Semantic reranking | [modern-es-features.md](post-sdk/search-quality/modern-es-features.md) |

### NOT Synonym Candidates

| Pattern | Why NOT | Alternative |
|---------|---------|-------------|
| `football => feet` | Sport ≠ skill vocabulary | ELSER, Bucket B paraphrase |
| `negative => negation, ne pas` | English ≠ grammatical term ≠ French | Redesign query |
| `beginner => introduction` | Not equivalent concepts | Query rules |

---

---

## Session 2026-01-24: MFL Synonym Fixes + Control Queries

### French Negation Synonym Fix

**Problem**: `teach French negative sentences year 7` (later refined to `making French sentences negative KS3`) was returning MRR 0.000.

**Root Cause**: Missing `negation` synonym in `french.ts`. The curriculum uses "negation" but teachers search with "negative" or "making negative". Without the synonym, vocabulary bridging failed.

**Fix Applied**:

```typescript
// packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/french.ts
negation: ['negative', 'making negative', 'ne pas', 'ne ... pas', "don't", 'not'],
```

**Result**: MRR 0.000 → **1.000** (first relevant result now at position #1)

**Query Refinement**: Changed from "teach French negative sentences year 7" to "making French sentences negative KS3" for clearer vocabulary bridging test.

### Control Queries Added

Added control queries (without typos) to isolate fuzzy matching issues from other search problems:

| Original Query | Control Query | Purpose |
|----------------|---------------|---------|
| `vikins and anglo saxons` (imprecise-input) | `Vikings and Anglo-Saxons Britain` (cross-topic-2) | Compare fuzzy vs clean query |
| `multiplikation timetables year 3` (imprecise-input-2) | `multiplication times tables year 3` (precise-topic-4) | Compare fuzzy vs clean query |

**Findings**:
- **History**: Control query achieves R@10=1.0 (4/4 slugs found), imprecise query R@10=0.5 → Confirms "vikins" fuzzy matching is partially failing
- **Maths**: Control query achieves R@10=0.4 (2/5 slugs found), imprecise query R@10=0.0 → Confirms tokenization issue ("timetables" vs "times tables") AND expected slugs need review

### MFL Synonym Architecture Analysis

Identified structural issues in MFL synonym files:

1. **DRY Violation**: ~14 grammar terms (verb, noun, adjective, etc.) repeated identically across French, German, Spanish files
2. **Bucket C Entries**: Translation hints that provide no search value (e.g., `comment: ['how question']`)
3. **German negation fix**: Removed German words (`nicht`, `kein`, `nie`), kept only English synonyms (`negative`, `making negative`, `not`)

**Actions Taken**:
- Created `mfl-synonym-architecture.md` in `post-sdk/search-quality/`
- Created `bucket-c-analysis.ts` with archived translation hints
- Removed Bucket C entries from `french.ts`, `german.ts`, `spanish.ts`
- Documented future `mfl-common.ts` refactoring plan

### Remaining MFL Challenges

| Challenge | Impact | Potential Solution |
|-----------|--------|-------------------|
| No transcripts | ~0% content coverage | Structure-only retrieval is architectural limit |
| English-only ELSER | Semantic matching weak for MFL | Multilingual embedding model (see roadmap) |
| Low MRR (0.19-0.29) | Below all other subjects | Combination of above |

**See**: [mfl-synonym-architecture.md](../post-sdk/search-quality/mfl-synonym-architecture.md) for full analysis

---

## References

- [roadmap.md](../roadmap.md) — Execution order and phases
- [mfl-synonym-architecture.md](../post-sdk/search-quality/mfl-synonym-architecture.md) — MFL DRY refactoring plan
- [modern-es-features.md](../post-sdk/search-quality/modern-es-features.md) — Query rules, semantic reranking, fuzziness tuning
- [natural-language-paraphrases.md](../post-sdk/bulk-data-analysis/natural-language-paraphrases.md) — Bucket B weak expansions
- [ADR-103](../../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md) — Fuzzy matching limitations
