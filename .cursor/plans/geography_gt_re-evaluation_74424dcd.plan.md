---
name: Geography GT Re-evaluation
overview: Re-evaluate geography ground truths (primary + secondary, 8 categories total) using the corrected LINEAR protocol with COMMIT step. Previous Session 15 validated search results instead of doing independent discovery. This session must form independent rankings BEFORE benchmark, then create THREE-WAY comparisons. Quality over speed — there is no time pressure.
todos:
  - id: reread-foundation-docs
    content: "Re-read foundation documents: semantic-search.prompt.md, rules.md, testing-strategy.md, schema-first-execution.md — commit to the principles"
    status: completed
  - id: phase0
    content: "PHASE 0: Verify MCP server, bulk data files, benchmark command — STOP if any unavailable"
    status: completed
  - id: primary-pt-1a
    content: "geography/primary precise-topic 1A: QUERY ANALYSIS — REFLECT on query design, is it a good test of basic retrieval? NO TOOLS, IGNORE expected slugs"
    status: completed
  - id: primary-pt-1b
    content: "geography/primary precise-topic 1B: DISCOVERY — bulk search (10+ slugs), MCP summaries (5-10), unit context, analyse candidates"
    status: completed
  - id: primary-pt-commit
    content: "geography/primary precise-topic 1B.5: COMMIT — rank top 5 with scores and justifications BEFORE benchmark"
    status: completed
  - id: primary-pt-1c
    content: "geography/primary precise-topic 1C: COMPARISON — benchmark, THREE-WAY comparison table, critical question, ALL 4 metrics"
    status: completed
  - id: primary-ne-1a
    content: "geography/primary natural-expression 1A: QUERY ANALYSIS — is vocabulary genuinely informal/everyday language?"
    status: completed
  - id: primary-ne-1b
    content: "geography/primary natural-expression 1B: DISCOVERY — find vocabulary bridging candidates"
    status: completed
  - id: primary-ne-commit
    content: "geography/primary natural-expression 1B.5: COMMIT — rank BEFORE benchmark"
    status: completed
  - id: primary-ne-1c
    content: "geography/primary natural-expression 1C: COMPARISON — three-way table, critical question"
    status: completed
  - id: primary-ii-1a
    content: "geography/primary imprecise-input 1A: QUERY ANALYSIS — is the typo realistic?"
    status: completed
  - id: primary-ii-1b
    content: "geography/primary imprecise-input 1B: DISCOVERY — focus on semantic intent behind typo"
    status: completed
  - id: primary-ii-commit
    content: "geography/primary imprecise-input 1B.5: COMMIT — rank BEFORE benchmark"
    status: completed
  - id: primary-ii-1c
    content: "geography/primary imprecise-input 1C: COMPARISON — three-way table, critical question"
    status: completed
  - id: primary-ct-1a
    content: "geography/primary cross-topic 1A: QUERY ANALYSIS — are BOTH concepts genuinely distinct?"
    status: completed
  - id: primary-ct-1b
    content: "geography/primary cross-topic 1B: DISCOVERY — verify BOTH concepts in candidates' key learning"
    status: completed
  - id: primary-ct-commit
    content: "geography/primary cross-topic 1B.5: COMMIT — rank BEFORE benchmark"
    status: completed
  - id: primary-ct-1c
    content: "geography/primary cross-topic 1C: COMPARISON — three-way table, critical question"
    status: completed
  - id: secondary-pt-1a
    content: "geography/secondary precise-topic 1A: QUERY ANALYSIS — REFLECT on query design"
    status: completed
  - id: secondary-pt-1b
    content: "geography/secondary precise-topic 1B: DISCOVERY — bulk search, MCP summaries, unit context"
    status: completed
  - id: secondary-pt-commit
    content: "geography/secondary precise-topic 1B.5: COMMIT — rank BEFORE benchmark"
    status: completed
  - id: secondary-pt-1c
    content: "geography/secondary precise-topic 1C: COMPARISON — three-way table, critical question"
    status: completed
  - id: secondary-ne-1a
    content: "geography/secondary natural-expression 1A: QUERY ANALYSIS — CRITICAL: 'global warming effects' — is this testing vocabulary bridging?"
    status: completed
  - id: secondary-ne-1b
    content: "geography/secondary natural-expression 1B: DISCOVERY — categorise lessons as effects/causes/actions — only EFFECTS match query"
    status: completed
  - id: secondary-ne-commit
    content: "geography/secondary natural-expression 1B.5: COMMIT — rank only lessons about EFFECTS, not actions or causes"
    status: completed
  - id: secondary-ne-1c
    content: "geography/secondary natural-expression 1C: COMPARISON — three-way table, expect differences from Session 15"
    status: completed
  - id: secondary-ii-1a
    content: "geography/secondary imprecise-input 1A: QUERY ANALYSIS — is the typo realistic?"
    status: completed
  - id: secondary-ii-1b
    content: "geography/secondary imprecise-input 1B: DISCOVERY — focus on semantic intent"
    status: completed
  - id: secondary-ii-commit
    content: "geography/secondary imprecise-input 1B.5: COMMIT — rank BEFORE benchmark"
    status: completed
  - id: secondary-ii-1c
    content: "geography/secondary imprecise-input 1C: COMPARISON — three-way table, critical question"
    status: completed
  - id: secondary-ct-1a
    content: "geography/secondary cross-topic 1A: QUERY ANALYSIS — are BOTH concepts genuinely distinct?"
    status: completed
  - id: secondary-ct-1b
    content: "geography/secondary cross-topic 1B: DISCOVERY — verify BOTH concepts in candidates"
    status: completed
  - id: secondary-ct-commit
    content: "geography/secondary cross-topic 1B.5: COMMIT — rank BEFORE benchmark"
    status: completed
  - id: secondary-ct-1c
    content: "geography/secondary cross-topic 1C: COMPARISON — three-way table, critical question"
    status: completed
  - id: phase2
    content: "PHASE 2: Validation — type-check, ground-truth:validate, benchmark --subject geography --verbose"
    status: completed
  - id: phase3-checklist
    content: "PHASE 3: Update ground-truth-review-checklist.md with all metrics and learnings"
    status: in_progress
  - id: phase3-prompt
    content: "PHASE 3: Update semantic-search.prompt.md with status and next session target"
    status: pending
  - id: quality-gates
    content: "Quality gates: format, type-check, lint, test — all must pass before commit"
    status: completed
  - id: reread-foundation-final
    content: Re-read foundation documents again before final commit — verify approach was correct
    status: pending
---

# Geography Ground Truth Re-evaluation

## ⚠️ SESSION STATUS: INCOMPLETE — METHODOLOGY VIOLATION

This session (2026-01-19) also failed to follow the protocol correctly:

1. Read GT files in Phase 1A/1B — saw expectedRelevance before independent discovery
2. Did not use `pnpm gt:queries` to extract query metadata safely
3. "Discovery" was influenced by knowing expected slugs

**A fresh session must restart from Phase 0 using the updated protocol (with `pnpm gt:queries`).**

---

## Why This Re-evaluation is Required

Session 15 failed to follow the protocol correctly:

1. Ran benchmark early and saw what search returned
2. Got MCP summaries for those results
3. Retroactively justified the search results as "correct"
4. Filled in "discovery" steps after the fact

**Specific failure example**: For "global warming effects", the ground truth kept `actions-to-tackle-climate-change` (a lesson about mitigation/adaptation) even though the query asks for "effects", not "actions". The analysis validated what search returned instead of independently asking "what lessons are actually about effects?"

---

## Foundation Documents (Re-read Regularly)

These documents define the protocol and must be re-read at the start of each phase:

- [Semantic Search Prompt](../.agent/prompts/semantic-search/semantic-search.prompt.md) — Cardinal rules, anti-patterns
- [Ground Truth Review Checklist](../.agent/plans/semantic-search/active/ground-truth-review-checklist.md) — Progress tracking, why re-evaluation needed
- [Ground Truth Session Template](../.agent/plans/semantic-search/templates/ground-truth-session-template.md) — LINEAR execution protocol with COMMIT step
- [rules.md](../.agent/directives-and-memory/rules.md) — Core development rules
- [testing-strategy.md](../.agent/directives-and-memory/testing-strategy.md) — TDD principles
- [schema-first-execution.md](../.agent/directives-and-memory/schema-first-execution.md) — Schema-first principles

---

## Cardinal Rules

### Rule 1: The search might be RIGHT. Your expected slugs might be WRONG

Session 9 proved this: MRR 0.000 was WRONG expected slugs, not a search issue. After correction: MRR 0.000 to 1.000.

### Rule 2: You must COMMIT to your rankings BEFORE seeing search results

The COMMIT step (1B.5) forces independent judgment. Without it, agents repeatedly validate search results instead of discovering ground truth.

---

## Scope

- **Subject**: geography
- **Phases**: primary (4 categories) + secondary (4 categories) = 8 total
- **Categories per phase**: precise-topic, natural-expression, imprecise-input, cross-topic

### Ground Truth Files

- `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/geography/primary/`
  - `precise-topic.ts`, `natural-expression.ts`, `imprecise-input.ts`, `cross-topic.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/geography/secondary/`
  - `precise-topic.ts`, `natural-expression.ts`, `imprecise-input.ts`, `cross-topic.ts`

---

## Phase 0: Prerequisites

**Working directory**: `apps/oak-open-curriculum-semantic-search`

### Step 0.1: Verify Tools

| Tool | Verification | Status |
|------|--------------|--------|
| MCP server | Call `get-help` | Must be working |
| Bulk data (primary) | `jq '.sequence \| length' bulk-downloads/geography-primary.json` | Must return number |
| Bulk data (secondary) | `jq '.sequence \| length' bulk-downloads/geography-secondary.json` | Must return number |
| Benchmark | `pnpm benchmark --help` | Must show help |

**If ANY tool is unavailable: STOP. Do not proceed.**

### Step 0.2: Extract Query Metadata (MANDATORY — BEFORE Phase 1)

**⛔ DO NOT READ THE GROUND TRUTH FILES DIRECTLY. You will see expectedRelevance and bias your discovery.**

```bash
pnpm gt:queries geography primary
pnpm gt:queries geography secondary
```

This outputs query, category, description WITHOUT expectedRelevance. Save this output — it's the ONLY information you have about the queries until Phase 1C.

**If you read the GT files directly before Phase 1C, your discovery is biased. Start over.**

---

## Phase 1: Category Exploration (FOR EACH of 8 categories)

**The protocol has three sub-phases per category. Execute them in order.**

### Phase 1A: Query Analysis (REFLECT ONLY)

- **No jq. No MCP. No benchmark. No data exploration. Just THINKING.**
- **IGNORE EXPECTED SLUGS. They are irrelevant in Phase 1A.**
- Evaluate whether the query is a good test of the category's capability
- Identify any experimental design issues

**QUERY GATE**: Cannot search for candidates until query is validated.

### Phase 1B: Discovery + COMMIT (BEFORE benchmark)

1. Search bulk data with 3+ terms — find 10+ candidate slugs
2. Get 5-10 MCP summaries with key learning quotes
3. Get unit context (lesson ordering)
4. Analyse each candidate's relevance
5. **COMMIT rankings (top 5) with scores and justifications**

**DISCOVERY GATE**: Cannot run benchmark until rankings are COMMITTED.

### Phase 1C: Comparison (AFTER commitment)

1. Verify rankings were committed BEFORE benchmark (Step 1C.0)
2. Run `pnpm benchmark -s geography -p PHASE -c CATEGORY --review`
3. Create THREE-WAY comparison table: YOUR rankings vs SEARCH vs EXPECTED
4. Answer critical question: What are the BEST slugs?
5. Record ALL 4 metrics: MRR, NDCG@10, P@3, R@10

---

## Special Attention Areas

### geography/secondary/natural-expression

**Query**: "global warming effects"

Previous analysis kept `actions-to-tackle-climate-change` despite:

- Query asks for "effects" (what happens as a result)
- Lesson is about "actions" (what we can do about it)
- These are categorically different

In Phase 1B, categorise ALL climate change lessons:

- **Effects/impacts**: what happens (correct for this query)
- **Causes**: why it happens (NOT what query asks)
- **Actions/responses**: what to do (NOT what query asks)

---

## Phase 2: Validation

After completing ALL 8 categories:

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject geography --verbose
```

Record aggregate metrics for both phases.

---

## Phase 3: Documentation

1. Update [ground-truth-review-checklist.md](../.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

   - Mark all 8 categories complete with metrics
   - Record key learnings
   - Record changes made

2. Update [semantic-search.prompt.md](../.agent/prompts/semantic-search/semantic-search.prompt.md):

   - Update status and next session target
   - Add significant learnings

---

## Quality Gates (Before Commit)

Run from repo root:

```bash
pnpm format:root
pnpm type-check
pnpm lint:fix
pnpm test
```

---

## Anti-Pattern: Search Validation (AVOID)

**WRONG process**:

1. Run benchmark, see search returns A, B, C
2. Get MCP summaries for A, B, C
3. Note they have relevant content
4. Fill COMMIT table with A, B, C
5. Comparison table has identical columns

**Why wrong**: No independent judgment. Just justified what search returned.

**CORRECT process**:

1. Search bulk data, find X, Y, Z, A, B, W... (10+ slugs)
2. Get MCP summaries, analyse each against query
3. Realise X and Y directly match query; A and B are tangential
4. COMMIT: X=#1, Y=#2, W=#3 (BEFORE benchmark)
5. Run benchmark, see search returns A, B, C
6. Three-way comparison shows differences
7. Conclude: "X and Y are better because..."

---

## Remember

> **There is no time pressure. Going slowly and doing an excellent job provides lasting, significant value to this project. Going fast and compromising causes *damage*.**

Take your time. Form independent judgments. COMMIT before benchmark. Do it right.
