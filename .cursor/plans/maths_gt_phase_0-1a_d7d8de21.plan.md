---
name: Maths GT Phase 0-1A
overview: Phase 0 (prerequisites) and Phase 1A (query analysis through reflection only) for Maths primary and secondary ground truth evaluation. Three queries per category. No data exploration, no MCP tools, no benchmark — pure conceptual analysis of query design.
todos:
  - id: phase0-verify
    content: "Phase 0: Verify bulk data files exist for maths-primary and maths-secondary"
    status: completed
  - id: phase0-read-primary
    content: "Phase 0: Read PRIMARY .query.ts files (4 categories) — NOT .expected.ts"
    status: completed
  - id: phase0-read-secondary
    content: "Phase 0: Read SECONDARY .query.ts files (4 categories) — NOT .expected.ts"
    status: completed
  - id: 1a-primary-precise
    content: "1A PRIMARY precise-topic: Analyse query design, capability tested, recommendation"
    status: completed
  - id: 1a-primary-natural
    content: "1A PRIMARY natural-expression: Analyse query design, capability tested, recommendation"
    status: completed
  - id: 1a-primary-imprecise
    content: "1A PRIMARY imprecise-input: Analyse query design, capability tested, recommendation"
    status: completed
  - id: 1a-primary-cross
    content: "1A PRIMARY cross-topic: Analyse query design, capability tested, recommendation"
    status: completed
  - id: 1a-secondary-precise
    content: "1A SECONDARY precise-topic: Analyse query design, capability tested, recommendation"
    status: completed
  - id: 1a-secondary-natural
    content: "1A SECONDARY natural-expression: Analyse query design, capability tested, recommendation"
    status: completed
  - id: 1a-secondary-imprecise
    content: "1A SECONDARY imprecise-input: Analyse query design, capability tested, recommendation"
    status: completed
  - id: 1a-secondary-cross
    content: "1A SECONDARY cross-topic: Analyse query design, capability tested, recommendation"
    status: completed
  - id: gap-analysis
    content: "Gap Analysis: Identify 2 additional queries needed per category (16 total) for 3-query coverage"
    status: completed
  - id: checkpoint-1a
    content: "CHECKPOINT 1A: Verify all queries analysed, recommendations documented, additional queries proposed — NO data exploration done"
    status: completed
---

# Maths Ground Truth Evaluation — Phase 0 and 1A

## Scope

- **Subjects**: maths/primary, maths/secondary
- **Categories**: precise-topic, natural-expression, imprecise-input, cross-topic
- **Queries per category**: 3 (instead of usual 1)
- **Total queries to analyse**: 4 categories × 3 queries × 2 phases = 24 queries
- **This plan covers**: Phase 0 (prerequisites) and Phase 1A (query analysis) ONLY

---

## What This Phase Is About

Phase 1A is **experimental design review**. We are asking:

- Does each query actually test what its category claims to test?
- Is it a good test of that capability?
- Will success or failure be informative?

We are NOT yet asking:

- What are the best answers?
- What does the curriculum contain?
- What does search return?

---

## What NOT To Do (Critical)

**DO NOT**:

- Run any `jq` commands on bulk data
- Call any MCP tools (`get-lessons-summary`, `get-units-summary`, etc.)
- Run benchmark commands
- Read `.expected.ts` files (these contain current expected slugs)
- Explore the curriculum data in any way
- Form opinions about what the "right answers" are
- Let knowledge of existing ground truths influence analysis

**The only files that may be read**:

- `.query.ts` files (contain query text, category, description — NO expected slugs)
- Documentation files for reference

---

## Phase 0: Prerequisites

### 0.1 Verify Bulk Data Exists

```bash
ls apps/oak-open-curriculum-semantic-search/bulk-downloads/maths-*.json
```

Confirm both `maths-primary.json` and `maths-secondary.json` exist.

### 0.2 Note Curriculum Scale

Record the scale for context (already gathered):

- **Primary**: 125 units, 1,072 lessons
- **Secondary**: 98 units, 1,073 lessons
- **Total**: 223 units, 2,145 lessons

This is the largest subject in the curriculum.

### 0.3 Read Query Files (NOT Expected Files)

Read ONLY the `.query.ts` files to see what queries currently exist:

```bash
# Primary queries (SAFE - no expected slugs)
cat src/lib/search-quality/ground-truth/maths/primary/precise-topic.query.ts
cat src/lib/search-quality/ground-truth/maths/primary/natural-expression.query.ts
cat src/lib/search-quality/ground-truth/maths/primary/imprecise-input.query.ts
cat src/lib/search-quality/ground-truth/maths/primary/cross-topic.query.ts

# Secondary queries (SAFE - no expected slugs)
cat src/lib/search-quality/ground-truth/maths/secondary/precise-topic.query.ts
cat src/lib/search-quality/ground-truth/maths/secondary/natural-expression.query.ts
cat src/lib/search-quality/ground-truth/maths/secondary/imprecise-input.query.ts
cat src/lib/search-quality/ground-truth/maths/secondary/cross-topic.query.ts
```

---

## Phase 1A: Query Analysis (Reflection Only)

For EACH query, complete the following analysis. This is pure thinking — no tools.

### 1A.1 State the Capability Being Tested

| Category | Capability | Success Means |

|----------|------------|---------------|

| precise-topic | Basic retrieval with curriculum terminology | Search returns relevant results when teachers use standard maths terms |

| natural-expression | Vocabulary bridging from everyday to curriculum language | Search understands informal phrasing like "sharing equally" and maps to "division" |

| imprecise-input | Resilience to typos and messy input | Search still works despite "multiplikation" or "frations" |

| cross-topic | Finding concept intersections | Search identifies lessons combining e.g. "fractions AND word problems" |

### 1A.2 Evaluate Query as Test

For each query, answer:

- What does this query literally say?
- Is this representative of what a real teacher would type?
- If search succeeds, does that demonstrate the capability works?
- If search fails, does that reveal a real limitation?

### 1A.3 Assess Experimental Design Quality

**For precise-topic**: Is this actually precise curriculum terminology? Or is it too vague/broad?

**For natural-expression**: Is this genuinely informal language? Or is it already using curriculum vocabulary (which would make it a precise-topic test)?

**For imprecise-input**: Is the error realistic? Would a real person make this typo? Is it recoverable?

**For cross-topic**: Are there genuinely TWO distinct concepts? Is finding their intersection meaningful?

### 1A.4 Identify Design Issues

Flag any of these:

- Query doesn't actually test the claimed capability
- Query is miscategorised (belongs in different category)
- Query is too easy (trivial) or too hard (impossible)
- Query success/failure won't be informative
- Query lacks differentiation power within maths

### 1A.5 Recommendation

For each query:

- **Proceed**: Query is a good test
- **Revise**: Query needs modification (propose revision)
- **Replace**: Query fundamentally unsuitable (propose replacement)
- **Recategorise**: Query belongs in different category

### 1A.6 Gap Analysis for Three-Query Requirement

After analysing existing queries, identify:

- Do we have 3 distinct queries per category?
- If not, what additional queries are needed?
- What aspects of the capability aren't yet tested?

For maths specifically, consider coverage of:

- Different year groups (Year 1-6 for primary, Year 7-11 for secondary)
- Different maths strands (number, geometry, algebra, statistics, ratio)
- Different cognitive demands (recall, application, problem-solving)

---

## Deliverables from Phase 1A

For each of the 8 category-phase combinations:

1. **Current query analysis**: Is the existing query a good test?
2. **Recommendation**: Proceed/revise/replace/recategorise
3. **Gap identification**: What 2 additional queries would provide comprehensive coverage?
4. **Proposed queries**: Draft 2 additional queries per category (text only, no expected slugs yet)

---

## What Comes Next (NOT in this plan)

Phase 1B (Discovery) and Phase 1C (Comparison) will come in a separate plan after Phase 1A is complete. Those phases involve:

- Bulk data exploration with jq
- MCP tool calls for lesson summaries
- COMMIT step for independent rankings
- Benchmark execution
- Three-way comparison

**None of that happens until Phase 1A is complete for all queries.**

---

## Critical Reminder

> **The goal of Phase 1A is to ensure we have good experimental design BEFORE we invest effort in finding answers.**

A poorly designed query will produce misleading metrics regardless of how carefully we find expected slugs. Phase 1A catches these issues early.
