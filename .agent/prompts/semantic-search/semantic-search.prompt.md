# Semantic Search — Ground Truth Review Protocol

**Status**: 🔄 **Ground Truth Review — Quality Improvement Pass**  
**This Session**: **Continue Priority 3+ queries, MFL refinement**  
**Last Updated**: 2026-01-24

---

## ✅ Current State: Validation Passing

### 1. Validation Status

```bash
pnpm ground-truth:validate  # PASSES (0 errors)
```

All validation errors from previous sessions have been fixed.

### 2. Session 2026-01-24 Progress Summary

**Completed Work**:

| Issue | Resolution | Result |
|-------|------------|--------|
| French negation synonym missing | Added to `french.ts` | MRR 0.000 → **1.000** |
| Control queries for fuzzy diagnosis | Added history/cross-topic-2, maths/precise-topic-4 | Diagnostic capability |
| MFL synonym DRY violations | Documented in `mfl-synonym-architecture.md` | Future refactoring planned |
| Bucket C translation hints | Removed from MFL files, archived | Cleaner synonym sets |
| German negation German words | Removed `nicht`, `kein`, `nie` | English synonyms only |
| 3 validation errors | Fixed all three | Validation passing |

**Remaining Search Quality Gaps** (document, don't fix with GT changes):

| Query | MRR | Issue | Future Solution |
|-------|-----|-------|-----------------|
| `narative writing storys iron man Year 3` | 0.333 | Multiple typos exceed fuzzy limits | Query rules, domain boosting |
| `electrisity and magnits` | 0.200 | Fuzzy false positive (magnits → magnify) | Domain term boosting |
| MFL subjects overall | 0.19-0.29 | No transcripts, English-only ELSER | Multilingual embeddings |

### 3. Priority Ordering (ALWAYS)

| Priority | Category | Rationale |
|----------|----------|-----------|
| **1** | Validation failures | No benchmark is trustworthy until validation passes |
| **2** | Zero-hit queries (MRR = 0.000) | Complete failure to find expected results |
| **3** | Very low MRR (< 0.333) | Severe ranking issues |
| **4** | Acceptable MRR, poor other metrics | Ranking or recall issues |
| **5** | Good MRR, poor other metrics | Fine-tuning needed |

**Validation failures are ALWAYS Priority 1.** This is not negotiable.

### 4. Recommended Actions for This Session

1. **Continue Priority 3 queries** — Very low MRR queries (0.001-0.333) in [problematic-queries-investigation.md](../../plans/semantic-search/active/problematic-queries-investigation.md)
2. **MFL quality improvement** — Consider multilingual embedding investigation
3. **Document search gaps honestly** — Some queries expose search limitations, not GT errors

See: [problematic-queries-investigation.md](../../plans/semantic-search/active/problematic-queries-investigation.md) for full context

---

## 🎯 THIS SESSION: Continue Priority 3+ Queries

### Entry Point

**Read the investigation plan** for the full list of queries needing work:

[problematic-queries-investigation.md](../../plans/semantic-search/active/problematic-queries-investigation.md)

### Current Focus: Priority 3 Queries (Very Low MRR)

17 queries have MRR between 0.167 and 0.333. These need investigation.

**Pick one query from the Priority 3 list and follow the investigation process.**

### Quick Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# Verify validation passes
pnpm ground-truth:validate  # Should show 0 errors

# Run benchmark for a specific query
pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review --verbose

# Search bulk data (for independent discovery)
jq -r '.sequence[].unitLessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug)|\(.lessonTitle)"' \
  bulk-downloads/SUBJECT-PHASE.json

# List all lessons in a subject-phase
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/SUBJECT-PHASE.json
```

### Key Anti-Pattern: Search Validation Bias

**Do NOT**:
1. Run benchmark first
2. See what search returns
3. Update GT to match search results

**DO**:
1. Discover candidates independently from bulk data
2. Get MCP summaries BEFORE running benchmark
3. COMMIT rankings BEFORE seeing search results
4. Create three-way comparison table (YOUR rankings vs SEARCH vs EXPECTED)

---

## Previous Work

### Session 2026-01-24: MFL Fixes + Control Queries (COMPLETE)

**Key Accomplishments**:

| Query | Before | After | Action |
|-------|--------|-------|--------|
| `making French sentences negative KS3` | MRR 0.000 | **MRR 1.000** | Added `negation` synonym |
| `Vikings and Anglo-Saxons Britain` | — | Control | Isolate fuzzy matching |
| `multiplication times tables year 3` | — | Control | Isolate fuzzy matching |

**MFL Synonym Architecture**:
- Removed 9 "Bucket C" translation hints (no search value)
- Fixed German `negation` (removed German words, kept English)
- Documented DRY refactoring in `mfl-synonym-architecture.md`

**All 3 validation errors fixed.** Quality gate passing.

### Session 2026-01-24: Zero-Hit Investigation (Earlier)

| Query | Outcome | Status |
|-------|---------|--------|
| `dribbling baal with feet` | Query redesigned | ✅ MRR 1.000 |
| `vikins and anglo saxons` | GT + control query | ✅ MRR 1.000 |
| `making French sentences negative KS3` | Synonym + query refined | ✅ MRR 1.000 |
| `nutrition and cooking techniques together` | GT validated | ✅ MRR 1.000 |
| `narative writing storys iron man Year 3` | GT updated | ⚠️ MRR 0.333 (search gap) |
| `coding for beginners...` | Blocked | ⏸️ Future functionality |

### Session 2026-01-23: Spanish Complete

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 1.000 | 0.800 | 0.750 | 0.750 |
| SECONDARY | 1.000 | 0.549 | 0.583 | 0.700 |

### Session 2026-01-23: Science Complete

| Phase | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| PRIMARY | 0.836 | 0.737 | 0.641 | 0.723 |
| SECONDARY | 0.932 | 0.731 | 0.561 | 0.741 |

### All 30 Subject-Phases Initial Review Complete

Initial review complete, but quality improvement pass revealed issues that need addressing.

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
| [GT Guide](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | **THE single source of truth** for design, troubleshooting, lessons learned |

---

## Key Learnings from Past Sessions

**See [GROUND-TRUTH-GUIDE.md Part 6: Lessons Learned](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md#part-6-lessons-learned) for the complete, authoritative list of learnings from all sessions.**

### Quick Reference: Most Critical Learnings

| Category | Key Insight |
|----------|-------------|
| **Cardinal Rule** | The search might be RIGHT. Your expected slugs might be WRONG. (Session 9) |
| **Methodology** | COMMIT before benchmark — form independent judgment first (Session 15) |
| **Discovery** | Title-only matching is insufficient; systematic unit review required (Session 17) |
| **Architecture** | Subject hierarchy must flow to index — see [ADR-101](../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md) (Science) |
| **Fuzzy Matching** | Tokenization ≠ character edits — see [ADR-103](../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md) (Maths/Science) |
| **Query Tuning** | `minimum_should_match: '2<65%'` — see [ADR-102](../../../docs/architecture/architectural-decisions/102-conditional-minimum-should-match.md) (Science) |

### Relevant ADRs

| ADR | Decision |
|-----|----------|
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Three-stage validation model |
| [ADR-098](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) | Split file architecture |
| [ADR-101](../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md) | `subject_parent` for Science KS4 |
| [ADR-102](../../../docs/architecture/architectural-decisions/102-conditional-minimum-should-match.md) | Conditional minimum_should_match |
| [ADR-103](../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md) | Fuzzy matching limitations |
| [ADR-104](../../../docs/architecture/architectural-decisions/104-domain-term-boosting.md) | Domain term boosting (proposed) |

---

## Completed Sessions Summary (30/30 core subjects)

All 30 subject-phases have completed initial GT review. Now in quality improvement phase.

| Subject | Phase | MRR | NDCG@10 | Key Finding |
|---------|-------|-----|---------|-------------|
| spanish | primary | **1.000** | **0.800** | Query-data alignment critical; redesigned queries |
| spanish | secondary | **1.000** | **0.549** | MFL structure-only retrieval |
| science | primary | **0.836** | **0.737** | Fuzzy limits in short queries; control queries added |
| science | secondary | **0.932** | **0.731** | "magnits"→"magnification" fuzzy false positive identified |
| music | primary | 0.781 | 0.567 | "In tune" = pitch, not timing |
| music | secondary | 0.813 | 0.854 | Film composition, not analysis |
| maths | primary | 0.675 | 0.607 | Query register must match level |
| maths | secondary | 0.861 | 0.749 | Tokenization ≠ fuzzy matching |
| physical-education | primary | 0.833 | 0.797 | Original GT was completely wrong |
| physical-education | secondary | 0.813 | 0.725 | Typo recovery poor ("runing") |
| religious-education | primary | 0.875 | 0.677 | Original GT wrong (Sikh-specific for generic queries) |
| religious-education | secondary | 0.640 | 0.526 | Bulk API returns incomplete paired units |

**Current Focus**: [Problematic Queries Investigation](../../plans/semantic-search/active/problematic-queries-investigation.md)

**Full details**: [current-state.md](../../plans/semantic-search/current-state.md)

---

## Remember

> **There is no time pressure. Quality is what matters.**
>
> Slow and thoughtful work creates lasting value.
> Fast and careless work causes damage that takes even longer to fix.

Take your time. Do it right.
