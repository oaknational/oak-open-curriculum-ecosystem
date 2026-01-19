# Ground Truth Review — Linear Execution Protocol

**This is a PROTOCOL, not a reference document. Execute it step by step.**

**Last Updated**: 2026-01-19 (added COMMIT step to prevent search validation bias)

---

## Quality Over Speed

> **There is no time pressure. Going slowly and doing an excellent job provides lasting, significant value to this project. Going fast and compromising causes _damage_.**

This protocol exists because rushing leads to a specific failure mode: validating search results instead of independently discovering ground truth. This failure mode has occurred repeatedly despite clear documentation.

**Take your time.** Read each step carefully. Complete each step fully before moving on. If something feels unclear, stop and think. If you're unsure whether you've done independent discovery, you probably haven't.

The goal is not to finish quickly. The goal is to establish correct ground truth that will guide search improvement for months to come.

---

## ⛔ CARDINAL RULE ⛔

> **The search might be RIGHT. Your expected slugs might be WRONG.**

Session 9 proved this: MRR 0.000 was not a search issue — it was WRONG expected slugs.  
After correction: MRR 0.000 → 1.000, P@3 0.000 → 1.000.

**The Key Question**: Are ACTUAL results BETTER or WORSE than expected slugs?

---

## ⛔ SECOND CARDINAL RULE ⛔

> **You must form YOUR OWN ground truth assessment BEFORE seeing search results.**

The purpose of this protocol is to prevent "search validation bias" — the failure mode where you:
1. Run benchmark
2. See what search returned
3. Retroactively justify those results as "good"
4. Claim you did "independent discovery"

**This is not independent discovery. This is validation.**

True independent discovery means: you identify the best lessons from curriculum content, COMMIT to your rankings, and ONLY THEN compare against what search returned. Your rankings and search results may differ — that's the whole point.

---

## Protocol Structure

This protocol has **5 phases** with **hard checkpoints**. You CANNOT proceed past a checkpoint until ALL requirements are met.

| Phase | Purpose | Checkpoint |
|-------|---------|------------|
| **PHASE 0** | Prerequisites | All tools working |
| **PHASE 1A** | **Query Analysis** (REFLECT on the test) | Query validated |
| **PHASE 1B** | **Discovery + COMMIT** (BEFORE seeing search) | Rankings committed |
| **PHASE 1C** | Comparison (AFTER commitment) | Three-way comparison complete |
| **PHASE 2** | Validation | Aggregate metrics collected |
| **PHASE 3** | Documentation | Checklist updated |

**⚠️ CRITICAL**: 
- Phase 1A catches poorly-designed queries through REFLECTION — no tools, just thinking.
- Phase 1B requires you to COMMIT to rankings BEFORE running benchmark. This is the key safeguard.
- Phase 1C compares THREE things: YOUR committed rankings, SEARCH results, and EXPECTED slugs.

---

## PHASE 0: Prerequisites

### Step 0.1: Verify Tools

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local
```

| Tool | Verification | Status |
|------|--------------|--------|
| MCP server | Call `get-help` | ☐ Working / ☐ STOP |
| Bulk data | `jq '.sequence \| length' bulk-downloads/SUBJECT-PHASE.json` | ☐ Present / ☐ STOP |
| Benchmark | `pnpm benchmark --help` | ☐ Working / ☐ STOP |

**CHECKPOINT 0**: If ANY tool is unavailable → **STOP. Do not proceed.**

### Step 0.2: List ALL Lessons

```bash
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/SUBJECT-PHASE.json | sort > /tmp/all-lessons.txt

wc -l /tmp/all-lessons.txt  # Record count: ___
```

**Paste total lesson count here**: `___`

Scan this list for lessons that might be relevant but have non-obvious titles.

---

## PHASE 1: Category Exploration

**For EACH of the 4 categories**, execute Phase 1A, then Phase 1B, then Phase 1C.

---

### Step 0.3: Read Query Definition Files (BEFORE Starting Phase 1)

**Split File Architecture (2026-01-19)**: Ground truths are split into two files:
- `*.query.ts` — Contains query, category, description (SAFE to read)
- `*.expected.ts` — Contains expectedRelevance (ONLY read in Phase 1C)

**⛔ DO NOT READ `.expected.ts` FILES until Phase 1C. They contain expected slugs.**

Read the query definition file directly:

```bash
# Read query metadata WITHOUT expected slugs
cat src/lib/search-quality/ground-truth/SUBJECT/PHASE/CATEGORY.query.ts
# e.g.: cat src/lib/search-quality/ground-truth/geography/primary/precise-topic.query.ts
```

**⬇️ RECORD QUERY METADATA HERE (MANDATORY) ⬇️**

```typescript
// From *.query.ts file:
query: "___"
category: "___"
description: "___"
// NOTE: expectedFile points to .expected.ts — DO NOT READ IT YET
```

☐ Step 0.3 complete — **Query metadata read from .query.ts file (NO expected slugs visible)**

---

### Category Template

**Category**: `[precise-topic | natural-expression | imprecise-input | cross-topic]`  
**Query**: "___" (from Step 0.3 output)  
**Capability being tested**: ___

---

## PHASE 1A: Query Analysis (REFLECT — No Tools, No Searches)

**⚠️ This is pure THINKING. No searches. No tools. No data exploration. No jq. No MCP. No benchmark.**

**⛔ DO NOT READ THE GROUND TRUTH FILES. Use the query from Step 0.3 output only.**

The purpose is to critically analyse whether the query is a **good test of the category's claimed capability**.
You are evaluating EXPERIMENTAL DESIGN — does this query prove what it claims to prove?

---

### Step 1A.1: What Capability Does This Category Test?

Each category proves a specific **search behaviour**:

| Category | Capability Being Tested | Success Means |
|----------|------------------------|---------------|
| `precise-topic` | Basic retrieval with curriculum terminology | Search returns relevant results when teachers use standard terms |
| `natural-expression` | Vocabulary bridging from everyday to curriculum language | Search understands informal phrasing and maps to curriculum content |
| `imprecise-input` | Resilience to typos and messy input | Search still works despite imperfect typing |
| `cross-topic` | Finding concept intersections | Search identifies lessons that combine multiple topics |

**For your query, state the capability being tested**: ___

---

### Step 1A.2: Is This Query a Good Test of That Capability?

| Question | Your Analysis |
|----------|---------------|
| What does this query literally say? | |
| Is this query representative of real teacher behaviour for this category? | |
| If search succeeds, does that demonstrate the capability works? | |
| If search fails, does that reveal a real limitation? | |

---

### Step 1A.3: Will This Query Actually Prove What It Claims?

**For precise-topic**:
- Is this actually precise curriculum terminology that teachers would use?
- Is this a fair test of "basic retrieval works"?

**For natural-expression**:
- Is this genuinely informal/everyday language (not curriculum terms)?
- Does this test vocabulary bridging, or is it already using curriculum vocabulary?

**For imprecise-input**:
- Is the error realistic (typo a real person might make)?
- Does this test search resilience, or is the error too severe/unrealistic?

**For cross-topic**:
- Are there genuinely TWO distinct concepts in this query?
- Is finding their intersection a meaningful capability to test?

**Your analysis**: ___

---

### Step 1A.4: Potential Experimental Design Issues

| Issue Type | Risk? |
|------------|-------|
| Query doesn't actually test the claimed capability | ☐ Risk ☐ OK |
| Query is miscategorised (belongs in different category) | ☐ Risk ☐ OK |
| Query success/failure won't be informative | ☐ Risk ☐ OK |
| Query is too easy (trivial match) or too hard (impossible) | ☐ Risk ☐ OK |

**Issues identified**: ___

---

### Step 1A.5: Recommendation

- ☐ **Query is a good test** — proceed to Phase 1B Discovery
- ☐ **Query has design risks** — note them, watch for them during Discovery
- ☐ **Query should be revised** — propose revision: "___"
- ☐ **Category should change** — from ___ to ___

**If revising**: Update the ground truth file BEFORE proceeding to Phase 1B.

---

### ⛔ CHECKPOINT 1A — QUERY GATE ⛔

**STOP. Before searching for candidates, verify:**

- ☐ Capability being tested is clearly stated (Step 1A.1)
- ☐ Query evaluated as test of that capability (Step 1A.2)
- ☐ Experimental design quality assessed (Step 1A.3)
- ☐ Potential design issues identified (Step 1A.4)
- ☐ Recommendation made (Step 1A.5)
- ☐ **NO searches were run** — Phase 1A is reflection only
- ☐ **Expected slugs were IGNORED** — they are irrelevant in Phase 1A

**If query needs revision → update GT file before proceeding to Phase 1B.**

---

## PHASE 1B: Discovery and COMMIT (BEFORE Benchmark)

**⚠️ DO NOT run benchmark until ALL Phase 1B steps are complete, including the COMMIT step.**

**⛔ DO NOT READ THE GROUND TRUTH FILES. Use bulk data and MCP for discovery.**

The purpose is to discover the BEST POSSIBLE answers from curriculum content,
form YOUR OWN ground truth assessment, and COMMIT to your rankings —
all BEFORE seeing what search returns OR what the current expected slugs are.

This is the critical safeguard against "validate search results" bias AND "validate expected slugs" bias.

---

### Step 1B.1: Search Bulk Data (Multiple Terms)

Search with 3+ different terms related to the query. Cast a wide net.

```bash
# Example searches - adapt terms for your query
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | select(.lessonTitle | test("TERM1|TERM2"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/SUBJECT-PHASE.json

# Also search unit titles
jq -r '.sequence[] | select(.unitTitle | test("TERM"; "i")) | 
  "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' bulk-downloads/SUBJECT-PHASE.json
```

**⬇️ PASTE EVIDENCE HERE (MANDATORY) ⬇️**

```
Search term 1 "___": ___ lessons found
  - candidate-slug-1
  - candidate-slug-2

Search term 2 "___": ___ lessons found
  - candidate-slug-3
  - candidate-slug-4

Search term 3 "___": ___ lessons found
  - candidate-slug-5
```

**Candidate list (minimum 10 slugs)**:

```
1. ___
2. ___
3. ___
4. ___
5. ___
6. ___
7. ___
8. ___
9. ___
10. ___
```

☐ Step 1B.1 complete — **Candidate list has 10+ slugs**

---

### Step 1B.2: Get MCP Summaries (5-10 candidates)

**⛔ DO NOT look at expected slugs. Select candidates from your bulk data search ONLY.**

Call `get-lessons-summary` for 5-10 candidates from your Step 1B.1 candidate list:

- Candidates from bulk data search (Step 1B.1)
- Any with non-obvious titles that might be relevant
- DO NOT look at expected slugs — you don't know them yet

**⬇️ PASTE MCP SUMMARIES HERE (MANDATORY — minimum 5) ⬇️**

```
1. SLUG: ___
   Keywords: ___
   Key Learning: "___"
   
2. SLUG: ___
   Keywords: ___
   Key Learning: "___"
   
3. SLUG: ___
   Keywords: ___
   Key Learning: "___"
   
4. SLUG: ___
   Keywords: ___
   Key Learning: "___"
   
5. SLUG: ___
   Keywords: ___
   Key Learning: "___"

[Continue to 10 if available]
```

**MCP summary count**: ___ (must be ≥5)

☐ Step 1B.2 complete — **5-10 MCP summaries recorded with key learning quotes**

---

### Step 1B.3: Get Unit Context

Call `get-units-summary` for relevant units to understand lesson ordering.

**⬇️ PASTE UNIT CONTEXT HERE (MANDATORY) ⬇️**

```
Unit: ___
Lessons in order:
  1. ___ (foundational)
  2. ___
  3. ___
  ...
  N. ___ (capstone)
```

For natural-expression with skill-level queries: Note which lessons are FIRST (beginner) vs END (capstone).

☐ Step 1B.3 complete — **Unit structure documented**

---

### Step 1B.4: Analyse and Rank Candidates

Based on MCP summaries and unit context (NOT search results), analyse each candidate:

**⬇️ RECORD YOUR ANALYSIS HERE (MANDATORY) ⬇️**

For each candidate from your 10+ list, assess:
- Does the key learning directly address the query?
- Is this lesson about what the query asks, or only tangentially related?
- Quote the specific key learning text that matches (or doesn't match) the query

```
Analysis of candidates:

1. SLUG: ___
   Key Learning: "___"
   Query match: [STRONG / MODERATE / WEAK / NONE]
   Reasoning: ___

2. SLUG: ___
   Key Learning: "___"
   Query match: [STRONG / MODERATE / WEAK / NONE]
   Reasoning: ___

[Continue for all candidates you have MCP summaries for]
```

☐ Step 1B.4 complete — **All candidates analysed with key learning quotes**

---

### Step 1B.5: COMMIT Your Rankings (MANDATORY — Before Benchmark)

**⛔ BENCHMARK IS FORBIDDEN UNTIL THIS TABLE IS COMPLETE.**

**⛔ DO NOT READ THE GROUND TRUTH FILE. You do not know the expected slugs yet.**

Based ONLY on your curriculum analysis (Steps 1B.1-1B.4), commit to your top candidates with relevance scores:

| Rank | Slug | Score (1-3) | Key Learning Quote | Why This Ranking |
|------|------|-------------|-------------------|------------------|
| 1 | ___ | ___ | "..." | ___ |
| 2 | ___ | ___ | "..." | ___ |
| 3 | ___ | ___ | "..." | ___ |
| 4 | ___ | ___ | "..." | ___ |
| 5 | ___ | ___ | "..." | ___ |

**This ranking represents YOUR independent ground truth assessment.** You have NOT seen the current expected slugs. You have NOT seen what search returns. Your rankings are based purely on curriculum content analysis.

☐ Step 1B.5 complete — **Rankings committed based on curriculum content, WITHOUT seeing expected slugs or search results**

---

### ⛔ CHECKPOINT 1B — DISCOVERY GATE ⛔

**STOP. Before running benchmark, verify ALL evidence is recorded:**

- ☐ Candidate list has 10+ slugs (Step 1B.1)
- ☐ 5-10 MCP summaries recorded with key learning quotes (Step 1B.2)
- ☐ Unit context documented (Step 1B.3)
- ☐ All candidates analysed with reasoning (Step 1B.4)
- ☐ **YOUR RANKINGS ARE COMMITTED** with scores and justifications (Step 1B.5)
- ☐ **YOU HAVE NOT READ THE GROUND TRUTH FILE** — expected slugs are unknown to you

**If ANY checkbox is empty → GO BACK. Do not run benchmark.**

---

## PHASE 1C: Comparison (AFTER Discovery Gate Passed)

**Only proceed after CHECKPOINT 1B is complete, including your committed rankings.**

**✅ NOW you may read the ground truth file to see expected slugs.**

This is the first time you see what the current expected slugs are. You will compare:
1. Your committed rankings (from Step 1B.5)
2. Search results (from benchmark)
3. Current expected slugs (from GT file — first time seeing them!)

---

### Step 1C.0: Pre-Comparison Verification

**Before analysing benchmark output, answer honestly:**

| Question | Answer |
|----------|--------|
| Did you complete Step 1B.5 (COMMIT rankings) BEFORE running benchmark? | ☐ Yes ☐ No — if No, go back |
| Can you justify your rankings WITHOUT any reference to search results OR expected slugs? | ☐ Yes ☐ No |
| Are your committed rankings based solely on curriculum content analysis? | ☐ Yes ☐ No |
| Did you avoid reading the GT file until now? | ☐ Yes ☐ No — if No, your discovery was biased |

**If you answered "No" to any question, you have not done independent discovery. Go back to Phase 1B.**

☐ Step 1C.0 complete — **Verified rankings were committed before benchmark AND before seeing expected slugs**

---

### Step 1C.1: Run Benchmark Review Mode

```bash
pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review
```

This shows:
- Expected slugs with relevance scores
- Actual search results (top 10)
- Which expected slugs were found and at what position
- **ALL 4 metrics**: MRR, NDCG@10, P@3, R@10

**⬇️ PASTE BENCHMARK OUTPUT HERE (MANDATORY) ⬇️**

```
[Paste the key section of benchmark --review output]

METRICS:
  MRR:      ___
  NDCG@10:  ___
  P@3:      ___
  R@10:     ___
```

☐ Step 1C.1 complete — **Benchmark output recorded with ALL 4 metrics**

---

### Step 1C.2: Three-Way Comparison Table

**This table is MANDATORY. It compares THREE distinct sources.**

The three sources are:
1. **YOUR committed rankings** (from Step 1B.5)
2. **SEARCH results** (from Step 1C.1)
3. **EXPECTED slugs** (current ground truth file)

**⬇️ CREATE COMPARISON TABLE (MANDATORY) ⬇️**

| Slug | YOUR Rank (1B.5) | SEARCH Rank | EXPECTED Score | Key Learning | Verdict |
|------|------------------|-------------|----------------|--------------|---------|
| ___ | #1 (score 3) | #? | score ? | "..." | ___ |
| ___ | #2 (score 3) | #? | score ? | "..." | ___ |
| ___ | #3 (score 2) | #? | not expected | "..." | ___ |
| ___ | not in top 5 | #1 | score 3 | "..." | ___ |
| ___ | not in top 5 | #2 | not expected | "..." | ___ |

**Verdict options**:
- **Agreement**: All three sources agree this is relevant
- **Search found better**: Search ranked something higher that is actually better than expected
- **Your discovery found better**: Your analysis found something better than both search and expected
- **Search under-ranked**: Your analysis and expected agree, but search ranked it lower
- **Expected was wrong**: Your analysis and search agree the expected slug is not optimal

**Analysis questions**:

1. Are your committed rankings (1B.5) identical to search results? ☐ Yes ☐ No
   - If Yes: Is this because they genuinely are the best matches, or did you unconsciously validate search?
   - Explain: ___

2. Are your committed rankings (1B.5) identical to expected slugs? ☐ Yes ☐ No
   - If Yes: Did you critically evaluate them, or assume they were correct?
   - Explain: ___

3. Did search find any lessons that are BETTER than your committed rankings?
   - ☐ Yes — Which ones and why are they better? ___
   - ☐ No — Your discovery was comprehensive

☐ Step 1C.2 complete — **Three-way comparison table created with analysis**

---

### Step 1C.3: Critical Question

> **"What are the BEST slugs for this query — and where did they come from?"**

Consider all three sources:
1. Your committed rankings from curriculum analysis (1B.5)
2. Actual search results (1C.1)
3. Current expected slugs

Answer (one of):

- ☐ **Current GT is CORRECT** — Expected slugs are the best matches (explain why your analysis agrees)
- ☐ **Search found BETTER results** — Search returned lessons that are genuinely better than expected
- ☐ **My candidates are BETTER** — My independent analysis found better lessons than both search and expected
- ☐ **Mix is best** — Best ground truth combines lessons from multiple sources

**Decision**: ___

**Justification (required — must reference key learning text)**: ___

**If updating ground truth**: Which slugs are changing and why?

☐ Step 1C.3 complete — **Critical question answered with justification**

---

### Step 1C.4: Record All 4 Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| MRR | ___ | > 0.70 | ☐ Pass ☐ Fail |
| NDCG@10 | ___ | > 0.75 | ☐ Pass ☐ Fail |
| P@3 | ___ | > 0.50 | ☐ Pass ☐ Fail |
| R@10 | ___ | > 0.70 | ☐ Pass ☐ Fail |

**Interpretation**: ___

**Diagnostic Guide**:
- High R@10 + Low MRR = results found but poorly ranked (search issue)
- Low R@10 = expected slugs may be wrong (GT issue)

☐ Step 1C.4 complete — **All 4 metrics recorded with interpretation**

---

### CHECKPOINT 1C (Per Category)

Before proceeding to next category, verify:

- ☐ Pre-comparison verification passed (1C.0)
- ☐ Benchmark output recorded with ALL 4 metrics (Step 1C.1)
- ☐ **Three-way comparison table created** (Step 1C.2)
- ☐ Critical question answered with justification (Step 1C.3)
- ☐ All 4 metrics recorded with interpretation (Step 1C.4)

**If any checkbox is empty → go back and complete it.**

---

## Category-Specific Guidance

### precise-topic

- **Capability**: Does basic retrieval work when teachers use curriculum terminology?
- **Phase 1A focus**: Is this query actually using precise curriculum terms?
- **Phase 1B/1C focus**: What are the best lessons for this precise topic?

### natural-expression

- **Capability**: Does search bridge from everyday language to curriculum terms?
- **Phase 1A focus**: Is this genuinely informal language, not already curriculum vocabulary?
- **Phase 1B/1C focus**: Does search understand the informal phrasing?
- Session 9 lesson: "feel" ≠ "emotions" — search correctly prioritised query vocabulary

### imprecise-input

- **Capability**: Is search resilient to typos and messy input?
- **Phase 1A focus**: Is the error realistic? Would a real teacher make this mistake?
- **Phase 1B/1C focus**: Does search recover semantic intent despite the error?

### cross-topic

- **Capability**: Can search find lessons that combine multiple concepts?
- **Phase 1A focus**: Are there genuinely TWO distinct concepts being combined?
- **Phase 1B/1C focus**: Do any lessons actually combine both concepts?
- Document if no perfect intersection exists in curriculum

---

## PHASE 2: Validation

### Step 2.1: Run Validation Suite

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject SUBJECT --phase PHASE --verbose
```

### Step 2.2: Record Aggregate Metrics

| Category | MRR | NDCG | P@3 | R@10 | Changes Made |
|----------|-----|------|-----|------|--------------|
| precise-topic | ___ | ___ | ___ | ___ | ☐ Yes ☐ No |
| natural-expression | ___ | ___ | ___ | ___ | ☐ Yes ☐ No |
| imprecise-input | ___ | ___ | ___ | ___ | ☐ Yes ☐ No |
| cross-topic | ___ | ___ | ___ | ___ | ☐ Yes ☐ No |
| **AGGREGATE** | ___ | ___ | ___ | ___ | |

### CHECKPOINT 2

- ☐ type-check passed
- ☐ ground-truth:validate passed
- ☐ benchmark completed
- ☐ All 4 categories have all 4 metrics recorded

---

## PHASE 3: Documentation

### Step 3.1: Update Checklist

Update `.agent/plans/semantic-search/active/ground-truth-review-checklist.md`:

- Mark all 4 categories complete with metrics
- Record key learnings
- Record changes made

### Step 3.2: Update Prompt (if applicable)

If this session revealed new insights, update `.agent/prompts/semantic-search/semantic-search.prompt.md`:

- Update "Next Session" target
- Add key learnings if significant

### CHECKPOINT 3

- ☐ Checklist updated with all metrics
- ☐ Key learnings documented
- ☐ Changes documented

---

## Session Summary Template

Copy this to the checklist entry:

```markdown
### N. SUBJECT/PHASE **← REVIEWED YYYY-MM-DD**

- [x] precise-topic — MRR X.XXX, NDCG X.XXX, P@3 X.XXX, R@10 X.XXX. [Description]
- [x] natural-expression — MRR X.XXX, NDCG X.XXX, P@3 X.XXX, R@10 X.XXX. [Description]
- [x] imprecise-input — MRR X.XXX, NDCG X.XXX, P@3 X.XXX, R@10 X.XXX. [Description]
- [x] cross-topic — MRR X.XXX, NDCG X.XXX, P@3 X.XXX, R@10 X.XXX. [Description]

**Aggregate**: MRR X.XXX | NDCG X.XXX | P@3 X.XXX | R@10 X.XXX

**Key Learnings**:
1. ...
2. ...

**Changes Made**:
1. Category: What changed and why
```

---

## Cursor Plan Frontmatter

When creating a plan file, use this structure:

```yaml
---
name: Ground Truth Session N - SUBJECT/PHASE
overview: "LINEAR PROTOCOL with COMMIT step. Goal: discover BEST matches from curriculum content, COMMIT to rankings BEFORE seeing search, then compare three sources. Quality over speed."
todos:
  - id: phase0
    content: "PHASE 0: Verify MCP, bulk data, benchmark — STOP if unavailable"
    status: pending
  - id: cat1-query
    content: "precise-topic 1A: QUERY ANALYSIS — REFLECT on query design, category fit"
    status: pending
  - id: cat1-discovery
    content: "precise-topic 1B: DISCOVERY — bulk search (10+), MCP summaries (5-10), unit context, analyse candidates"
    status: pending
  - id: cat1-commit
    content: "precise-topic 1B.5: COMMIT — rank top 5 with scores and justifications BEFORE benchmark"
    status: pending
  - id: cat1-comparison
    content: "precise-topic 1C: COMPARISON — benchmark, THREE-WAY comparison table, critical question"
    status: pending
  - id: cat2-query
    content: "natural-expression 1A: QUERY ANALYSIS — is vocabulary natural?"
    status: pending
  - id: cat2-discovery
    content: "natural-expression 1B: DISCOVERY — find vocabulary bridging candidates"
    status: pending
  - id: cat2-commit
    content: "natural-expression 1B.5: COMMIT — rank BEFORE benchmark"
    status: pending
  - id: cat2-comparison
    content: "natural-expression 1C: COMPARISON — three-way table"
    status: pending
  - id: cat3-query
    content: "imprecise-input 1A: QUERY ANALYSIS — is typo realistic?"
    status: pending
  - id: cat3-discovery
    content: "imprecise-input 1B: DISCOVERY — focus on semantic intent"
    status: pending
  - id: cat3-commit
    content: "imprecise-input 1B.5: COMMIT — rank BEFORE benchmark"
    status: pending
  - id: cat3-comparison
    content: "imprecise-input 1C: COMPARISON — three-way table"
    status: pending
  - id: cat4-query
    content: "cross-topic 1A: QUERY ANALYSIS — are BOTH concepts present?"
    status: pending
  - id: cat4-discovery
    content: "cross-topic 1B: DISCOVERY — verify BOTH concepts in candidates"
    status: pending
  - id: cat4-commit
    content: "cross-topic 1B.5: COMMIT — rank BEFORE benchmark"
    status: pending
  - id: cat4-comparison
    content: "cross-topic 1C: COMPARISON — three-way table"
    status: pending
  - id: phase2
    content: "PHASE 2: Validation — type-check, validate, benchmark"
    status: pending
  - id: phase3
    content: "PHASE 3: Documentation — update checklist with metrics and learnings"
    status: pending
---
```

---

## Anti-Pattern: "Discovery" That Validates Search

This is the failure mode that keeps recurring. Learn to recognise it.

### ❌ WRONG Process (Search Validation)

1. Run benchmark
2. See search returns slugs A, B, C at positions #1, #2, #3
3. Get MCP summaries for A, B, C
4. Note that A, B, C have relevant key learning
5. Conclude "A, B, C are good matches"
6. Fill Step 1B.5 with A, B, C
7. Create comparison table where all three columns match
8. Claim "independent discovery confirmed search results"

**Why this is wrong**: You never formed an independent judgment. You saw what search returned and justified it post-hoc. The comparison table is meaningless because all three sources are actually one source.

### ✅ CORRECT Process (Independent Discovery)

1. Search bulk data with multiple terms (climate, warming, effects, impacts, consequences...)
2. Find candidates X, Y, Z, A, B, W, V... (10+ slugs)
3. Get MCP summaries for top candidates
4. Analyse: X has "effects of climate change" in key learning, Y has "impacts on environment", A has "causes of climate change", B has "actions to tackle climate change"
5. Realise: Query asks for "effects" — A is about causes (wrong), B is about actions (wrong)
6. COMMIT: X=#1 (score 3), Y=#2 (score 3), W=#3 (score 2)
7. Note: Current expected slugs include A and B which are NOT about effects
8. Run benchmark — see search returns A at #1, B at #2, X at #9
9. Three-way comparison shows: YOUR rankings differ from SEARCH results differ from EXPECTED slugs
10. Critical question: "My candidates (X, Y) are BETTER because they're actually about effects, not causes or actions"
11. Update ground truth to use X, Y instead of A, B

**Why this is correct**: You formed an independent judgment based on curriculum content. When the three sources differed, you had a meaningful comparison to make. You discovered that both the current expected slugs AND the search results were suboptimal.

---

## Failure Modes (What Goes Wrong)

| Failure | Symptom | Detection | Prevention |
|---------|---------|-----------|------------|
| **Read .expected.ts early** | Discovery influenced by expected slugs | Ask: "Did I read .expected.ts before Phase 1C?" | Read only `.query.ts` files |
| Validated search results | 1B.5 rankings identical to search results | Ask: "Can I justify this WITHOUT reference to benchmark?" | COMMIT step forces early commitment |
| Validated expected slugs | 1B.5 rankings identical to expected slugs | Ask: "Did I know expected slugs when I committed?" | Don't read GT until Phase 1C |
| Retroactive discovery | 1B.5 completed AFTER benchmark | Check execution order | 1C.0 verification step |
| Analysed slugs in Phase 1A | Focused on slug matching, not capability testing | Phase 1A must IGNORE expected slugs | Explicit instruction |
| Query doesn't test capability | Query is miscategorised or trivial | 1A.1 asks "what capability is being tested?" | Query Gate |
| Skipped Discovery | Only validated search results | No 10+ candidate list | Discovery Gate with minimums |
| Too few MCP summaries | Missing non-obvious candidates | Count < 5 | Enforce count at checkpoint |
| No three-way comparison | "Good enough" accepted | Comparison table missing or trivial | Table is mandatory |
| Only MRR reported | Misleading conclusions | Missing 3 metrics | All 4 required |
| Assumed GT correct | Wrong conclusions | No assessment of expected slugs | 1B.5 requires assessment |
| All three sources identical | No real comparison made | Table columns are same | 1C.2 asks "are they identical?" |

---

## Quick Reference: Evidence Checklist

For each category, you must have recorded:

**Phase 0 (Prerequisites):**
1. ☐ Query metadata read from `.query.ts` file (NOT `.expected.ts`)
2. ☐ **Confirmed: `.expected.ts` files have NOT been read yet**

**Phase 1A (Query Analysis — REFLECT ONLY, no searches, no tools):**
3. ☐ Query taken from `.query.ts` file (NOT `.expected.ts`)
4. ☐ Capability being tested clearly stated
5. ☐ Query evaluated as test of that capability
6. ☐ Experimental design quality assessed
7. ☐ Potential design issues identified
8. ☐ Recommendation made (proceed, revise, or change category)
9. ☐ **Confirmed: NO searches were run in this phase**
10. ☐ **Confirmed: GT files have NOT been read yet**

**Phase 1B (Discovery + COMMIT):**
11. ☐ Candidate list with 10+ slugs from bulk data
12. ☐ 5-10 MCP summaries with key learning quotes
13. ☐ Unit structure (lesson ordering)
14. ☐ All candidates analysed with reasoning
15. ☐ **YOUR RANKINGS COMMITTED** with scores and justifications
16. ☐ **Confirmed: GT files have NOT been read yet — you don't know expected slugs**

**Phase 1C (Comparison — NOW you may read GT files):**
17. ☐ Pre-comparison verification passed (rankings committed before benchmark AND before seeing expected slugs)
18. ☐ Benchmark output with ALL 4 metrics (this shows expected slugs for first time)
19. ☐ **Three-way comparison table** (your rankings vs search vs expected)
20. ☐ Analysis of whether sources are identical
21. ☐ Critical question answer with justification
22. ☐ All 4 metrics recorded (MRR, NDCG, P@3, R@10)

**If any item is missing → the category is NOT complete.**

---

## Tool Reference

| Tool | Command | Purpose |
|------|---------|---------|
| **Query files** | `cat src/.../CATEGORY.query.ts` | **SAFE** — read query metadata (no expected slugs) |
| **Expected files** | `cat src/.../CATEGORY.expected.ts` | **PHASE 1C ONLY** — contains expected slugs |
| Benchmark (review) | `pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review` | Per-query details with ALL 4 metrics (Phase 1C only) |
| Benchmark (aggregate) | `pnpm benchmark -s SUBJECT -p PHASE` | Aggregate metrics |
| Validation | `pnpm ground-truth:validate` | Verify slugs exist |
| MCP | `get-lessons-summary`, `get-units-summary` | Curriculum content (Phase 1B) |

---

## Remember

> **There is no time pressure. Quality is what matters. Slow and thoughtful work creates lasting value. Fast and careless work causes damage that takes even longer to fix.**

Take your time. Do it right.
