---
name: Geography GT Re-evaluation
overview: "Re-evaluate geography/primary and geography/secondary ground truths (8 total) using the LINEAR EXECUTION PROTOCOL with explicit COMMIT step. Quality over speed: form independent rankings BEFORE seeing search results OR expected slugs, then create meaningful three-way comparisons."
todos:
  - id: foundation-read
    content: "FOUNDATION: Re-read rules.md, testing-strategy.md, schema-first-execution.md before starting"
    status: completed
  - id: phase0-prereq
    content: "PHASE 0: Verify MCP server, bulk data files, benchmark CLI - STOP if any unavailable"
    status: completed
  - id: phase0-list
    content: "PHASE 0: List ALL geography lessons (primary + secondary) to /tmp files for scanning"
    status: completed
  - id: pri-precise-1a
    content: "PRIMARY precise-topic 1A: REFLECT on 'UK countries capitals' - is this good test of precise retrieval?"
    status: completed
  - id: pri-precise-1b
    content: "PRIMARY precise-topic 1B: DISCOVERY - bulk search (10+), MCP summaries (5-10), unit context, analyse"
    status: completed
  - id: pri-precise-commit
    content: "PRIMARY precise-topic 1B.5: COMMIT top 5 rankings BEFORE benchmark, BEFORE .expected.ts"
    status: completed
  - id: pri-precise-1c
    content: "PRIMARY precise-topic 1C: COMPARISON - benchmark, read .expected.ts, three-way table, critical question"
    status: completed
  - id: pri-natural-1a
    content: "PRIMARY natural-expression 1A: REFLECT on 'where is our school ks1' - is vocabulary informal?"
    status: completed
  - id: pri-natural-1b
    content: "PRIMARY natural-expression 1B: DISCOVERY - find vocabulary bridging candidates"
    status: completed
  - id: pri-natural-commit
    content: "PRIMARY natural-expression 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: pri-natural-1c
    content: "PRIMARY natural-expression 1C: COMPARISON - three-way table"
    status: completed
  - id: pri-imprecise-1a
    content: "PRIMARY imprecise-input 1A: REFLECT on 'british ilands map' - is typo realistic?"
    status: completed
  - id: pri-imprecise-1b
    content: "PRIMARY imprecise-input 1B: DISCOVERY - focus on semantic intent (British Isles maps)"
    status: completed
  - id: pri-imprecise-commit
    content: "PRIMARY imprecise-input 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: pri-imprecise-1c
    content: "PRIMARY imprecise-input 1C: COMPARISON - three-way table"
    status: completed
  - id: pri-cross-1a
    content: "PRIMARY cross-topic 1A: REFLECT on 'maps and forests together' - are BOTH concepts testable?"
    status: completed
  - id: pri-cross-1b
    content: "PRIMARY cross-topic 1B: DISCOVERY - verify BOTH concepts in candidates"
    status: completed
  - id: pri-cross-commit
    content: "PRIMARY cross-topic 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: pri-cross-1c
    content: "PRIMARY cross-topic 1C: COMPARISON - three-way table"
    status: completed
  - id: foundation-reread-mid
    content: "FOUNDATION: Re-read rules.md at phase transition (after primary, before secondary)"
    status: completed
  - id: sec-precise-1a
    content: "SECONDARY precise-topic 1A: REFLECT on 'earthquakes tectonic plates'"
    status: completed
  - id: sec-precise-1b
    content: "SECONDARY precise-topic 1B: DISCOVERY - earthquake/tectonic candidates"
    status: completed
  - id: sec-precise-commit
    content: "SECONDARY precise-topic 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: sec-precise-1c
    content: "SECONDARY precise-topic 1C: COMPARISON - three-way table"
    status: completed
  - id: sec-natural-1a
    content: "SECONDARY natural-expression 1A: REFLECT on 'global warming effects' - NOTE: query asks for EFFECTS"
    status: completed
  - id: sec-natural-1b
    content: "SECONDARY natural-expression 1B: DISCOVERY - find EFFECTS lessons, NOT actions/mitigation"
    status: completed
  - id: sec-natural-commit
    content: "SECONDARY natural-expression 1B.5: COMMIT rankings - EFFECTS vocabulary must match"
    status: completed
  - id: sec-natural-1c
    content: "SECONDARY natural-expression 1C: COMPARISON - watch for actions vs effects mismatch"
    status: completed
  - id: sec-imprecise-1a
    content: "SECONDARY imprecise-input 1A: REFLECT on 'tectonic plaits and earthqakes' typos"
    status: completed
  - id: sec-imprecise-1b
    content: "SECONDARY imprecise-input 1B: DISCOVERY - semantic intent despite typos"
    status: completed
  - id: sec-imprecise-commit
    content: "SECONDARY imprecise-input 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: sec-imprecise-1c
    content: "SECONDARY imprecise-input 1C: COMPARISON - three-way table"
    status: completed
  - id: sec-cross-1a
    content: "SECONDARY cross-topic 1A: REFLECT on 'river erosion and deposition landforms'"
    status: completed
  - id: sec-cross-1b
    content: "SECONDARY cross-topic 1B: DISCOVERY - verify ALL THREE concepts in candidates"
    status: completed
  - id: sec-cross-commit
    content: "SECONDARY cross-topic 1B.5: COMMIT rankings BEFORE benchmark"
    status: completed
  - id: sec-cross-1c
    content: "SECONDARY cross-topic 1C: COMPARISON - three-way table"
    status: completed
  - id: phase2-validation
    content: "PHASE 2: type-check, ground-truth:validate, benchmark --subject geography --verbose"
    status: completed
  - id: phase3-checklist
    content: "PHASE 3: Update checklist with all metrics, learnings, changes"
    status: completed
  - id: foundation-reread-end
    content: "FOUNDATION: Re-read rules.md after completion to verify alignment"
    status: completed
---

# Geography Ground Truth Re-Evaluation

**Scope**: 2 subject-phases, 8 ground truths (geography/primary + geography/secondary)

**Why re-evaluation**: Session 15 validated search results instead of independent discovery. The COMMIT step was missing. This session MUST form independent rankings BEFORE running benchmark OR reading `.expected.ts` files.

---

## Foundation Documents (Re-read at checkpoints)

Before starting and at each phase transition, re-read:

- [rules.md](/.agent/directives-and-memory/rules.md) - Cardinal rule, TDD, quality gates
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) - Test behaviour not implementation
- [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

---

## Cardinal Rules (Always Visible)

1. **Search might be RIGHT. Expected slugs might be WRONG.**
2. **COMMIT rankings BEFORE seeing search results OR expected slugs.**
3. **Quality over speed. There is no time pressure.**

---

## Protocol Flow Per Category

```
Phase 1A: REFLECT on query design (no tools)
    |
    v
[QUERY GATE] - Query validated before discovery
    |
    v
Phase 1B: Bulk search → MCP summaries → Unit context → Analyse → COMMIT
    |
    v
[DISCOVERY GATE] - Rankings committed, .expected.ts NOT read
    |
    v
Phase 1C: Run benchmark → Read .expected.ts → THREE-WAY comparison
```

---

## Queries Summary (from .query.ts files - SAFE)

**Primary**:

- precise-topic: "UK countries capitals"
- natural-expression: "where is our school ks1"
- imprecise-input: "british ilands map"
- cross-topic: "maps and forests together"

**Secondary**:

- precise-topic: "earthquakes tectonic plates"
- natural-expression: "global warming effects" (NOTE: query asks for "effects")
- imprecise-input: "tectonic plaits and earthqakes"
- cross-topic: "river erosion and deposition landforms"

---

## Phase 0: Prerequisites

**Working directory**: `apps/oak-open-curriculum-semantic-search`

Verify before proceeding:

- MCP server responding (call `get-help`)
- Bulk data present: `jq '.sequence | length' bulk-downloads/geography-primary.json`
- Benchmark working: `pnpm benchmark --help`

List ALL lessons for scanning:

```bash
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/geography-primary.json | sort > /tmp/geo-primary-all.txt

jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/geography-secondary.json | sort > /tmp/geo-secondary-all.txt
```

---

## Phase 1: Category Exploration (x8)

Execute for each category in sequence:

### Phase 1A: Query Analysis (REFLECT ONLY)

No tools. No searches. No jq. No MCP. No benchmark. Just THINKING.

- State capability being tested
- Evaluate if query is a good test of that capability
- Identify potential design issues
- Make recommendation (proceed/revise/change category)

**QUERY GATE**: Cannot search until query validated.

### Phase 1B: Discovery + COMMIT

**CRITICAL**: Do NOT read `.expected.ts` files. Do NOT run benchmark.

- Search bulk data with 3+ terms (10+ candidates)
- Get MCP summaries for 5-10 candidates
- Get unit context (lesson ordering)
- Analyse each candidate against query (key learning quotes)
- **COMMIT**: Top 5 with scores (1-3) and justifications

**DISCOVERY GATE**: Rankings committed, `.expected.ts` NOT read.

### Phase 1C: Comparison (AFTER commitment)

NOW read `.expected.ts` and run benchmark:

```bash
pnpm benchmark -s geography -p primary -c precise-topic --review
```

Create THREE-WAY comparison table:

| Slug | YOUR Rank | SEARCH Rank | EXPECTED Score | Verdict |

|------|-----------|-------------|----------------|---------|

Answer: Are YOUR rankings, SEARCH results, or EXPECTED slugs the BEST?

Record ALL 4 metrics: MRR, NDCG@10, P@3, R@10

---

## Phase 2: Validation

After all 8 categories:

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject geography --verbose
```

Record aggregate metrics for both phases.

---

## Phase 3: Documentation

Update checklist with:

- All 4 metrics per category
- Key learnings
- Changes made with justifications

---

## Key Anti-Patterns to Avoid

1. **Running benchmark first** - forms no independent judgment
2. **Reading .expected.ts early** - biases discovery
3. **COMMIT table matching search results** - validation, not discovery
4. **Skipping three-way comparison** - misses meaningful analysis

---

## Specific Issues to Watch (from Session 15)

**Secondary natural-expression**: Query is "global warming effects"

- "effects" = consequences/impacts
- "actions to tackle" = mitigation/adaptation (NOT effects)
- Independent discovery must find lessons about EFFECTS, not ACTIONS

This was the known flaw in Session 15 - the wrong semantic concept was kept.

---

## Evidence Requirements Per Category

Phase 1A:

- Capability stated
- Query evaluated as test
- Design issues identified
- Recommendation made
- NO searches run

Phase 1B:

- 10+ candidate slugs from bulk data
- 5-10 MCP summaries with key learning quotes
- Unit context documented
- Analysis with reasoning for each candidate
- **COMMIT table with 5 ranked slugs, scores, justifications**
- **Confirmation: .expected.ts NOT read**

Phase 1C:

- Pre-comparison verification passed
- Benchmark output with ALL 4 metrics
- THREE-WAY comparison table
- Critical question answered with justification
- All 4 metrics recorded
