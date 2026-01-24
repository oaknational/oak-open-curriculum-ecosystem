---
name: Science GT Phase 0-1A
overview: Phase 0 verifies prerequisites exist without examining content. Phase 1A is pure reflection on what GOOD Science ground truth queries should be, based on curriculum knowledge — no tools, no data, no assumptions.
todos:
  - id: phase0-mcp
    content: "Task 0.1: Verify MCP server availability"
    status: completed
  - id: phase0-bulk
    content: "Task 0.2: Verify bulk data files exist (count only, not content)"
    status: completed
  - id: phase0-query-files
    content: "Task 0.3: Check if .query.ts files exist (do NOT read .expected.ts)"
    status: completed
  - id: phase1a-mental-model
    content: "Task 1A.1: Document Science curriculum mental model (primary vs secondary, three disciplines)"
    status: completed
  - id: phase1a-categories
    content: "Task 1A.2: Define what each category should test for Science specifically"
    status: completed
  - id: phase1a-evaluate
    content: "Task 1A.3: Evaluate existing queries (if any) using 1A.1-1A.5 template — reflection only"
    status: completed
  - id: phase1a-design
    content: "Task 1A.4: Design new/revised queries if needed — based on curriculum knowledge, not data"
    status: completed
  - id: phase1a-review
    content: "Task 1A.5: Critical self-assessment of all 24 query designs"
    status: completed
  - id: foundation-reread
    content: "Throughout: Re-read foundation documents (rules.md, testing-strategy.md, semantic-search.prompt.md)"
    status: completed
---

# Science Ground Truth: Phase 0 + 1A — Prerequisites and Query Analysis

**Last Updated**: 2026-01-21

**Status**: PLANNING

**Scope**: Verify prerequisites and critically evaluate Science query design through pure reflection — NO data exploration, NO expected slugs, NO search results

---

## Context

### The Task

Science is a **critical subject** requiring 24 ground truth queries (3 per category x 4 categories x 2 phases). Before any discovery work, we must:

1. Verify tools and data exist (Phase 0)
2. Critically evaluate what GOOD queries should be, based solely on curriculum knowledge (Phase 1A)

### The Critical Insight

Previous sessions have repeatedly fallen into "search validation" or "expected slug validation" bias — working backwards from results to justify them. The ONLY way to produce genuine value is to form independent judgments BEFORE seeing any results.

**Phase 1A is pure THINKING** — no tools, no searches, no jq, no MCP, no benchmark. Just curriculum knowledge applied to experimental design.

### Why This Matters

From [rules.md](/.agent/directives-and-memory/rules.md):

> "Always apply the first question; **Ask: could it be simpler without compromising quality?**"

From [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md):

> "The Key Question is NOT: 'Do expected slugs appear in results?' The Key Question IS: 'What are the BEST slugs for this query, based on curriculum content?'"

Phase 1A asks an even earlier question: **"What should we even be testing, and why?"**

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** [rules.md](/.agent/directives-and-memory/rules.md) — Core principles, First Question
2. **Re-read** [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) — Test behaviour, not implementation
3. **Re-read** [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) — Cardinal rules, anti-patterns
4. **Ask**: "Are we solving the right problem at the right layer?"
5. **Verify**: No assumptions imported from existing data or expectations

---

## Problem Statement

### What Science Covers

Science in the UK curriculum spans three disciplines across five key stages:

**Primary (KS1-KS2)**:

- Biology: Living things, habitats, life cycles, human body, plants
- Chemistry: Materials, states of matter, changes
- Physics: Forces, magnets, light, sound, electricity

**Secondary (KS3-KS4)**:

- Biology: Cells, organisms, genetics, evolution, ecology
- Chemistry: Atoms, elements, reactions, materials
- Physics: Energy, forces, waves, electricity, magnetism, space

### The Challenge for Ground Truths

1. **Three disciplines** — queries may be biology-specific, chemistry-specific, physics-specific, or cross-discipline
2. **Practical focus** — Science has experiments, investigations, practical skills
3. **Vocabulary spectrum** — from informal ("stuff that floats") to precise ("density and buoyancy")
4. **Level-appropriate language** — KS1 vs KS4 vocabulary differs dramatically

### What Good Queries Should Test

| Category | Science-Specific Consideration |

|----------|------------------------------|

| precise-topic | Uses correct scientific terminology for the level (e.g., "photosynthesis" not "how plants eat") |

| natural-expression | Uses informal language that teachers or students actually use (e.g., "why things fall down") |

| imprecise-input | Contains realistic typos in scientific terms (e.g., "photosythesis", "evapration") |

| cross-topic | Combines concepts from different disciplines or sub-topics (e.g., "energy and food chains") |

---

## Solution Architecture

### Principle

From [ground-truth-session-template.md](/.agent/plans/semantic-search/templates/ground-truth-session-template.md):

> "Phase 1A is about **experimental design** — does this query prove what it claims to prove?"

### Key Insight

Before we can discover the BEST answers, we must first ensure we are asking the RIGHT questions. Query design determines whether the ground truth will be meaningful.

**Bad query design examples** (from past sessions):

- "finding the unknown number" → sounds basic but was mapped to quadratics (Session 20, maths)
- "emotions" vs "feel" — vocabulary mismatch invalidated the test (Session 9, english)
- Queries testing capability X but categorised as Y

### Strategy

**For Phase 0**: Verify prerequisites exist — tools work, bulk data is present. Do NOT examine content.

**For Phase 1A**: For each of 24 queries, REFLECT on:

1. What capability is being tested?
2. Is this query a good test of that capability for Science specifically?
3. Does the query's register match the expected content level?
4. Are there experimental design issues?

**Non-Goals** (explicitly out of scope):

- Reading `.expected.ts` files
- Running benchmark
- Using MCP tools to explore lessons
- Using jq to search bulk data
- Making any file changes

---

## Resolution Plan

### Phase 0: Verify Prerequisites

**Foundation Check-In**: Re-read [rules.md](/.agent/directives-and-memory/rules.md) — "Fail fast with helpful error messages"

**Key Principle**: Prerequisites must be verified before any analysis. If tools don't work, STOP.

#### Task 0.1: Verify MCP Server Availability

**Acceptance Criteria**:

1. MCP server responds to `get-help` call
2. Server is not rate-limited
3. If unavailable, document and STOP

**Deterministic Validation**:

```bash
# Call MCP get-help tool
# Expected: Valid response with tool guidance
```

**Task Complete When**: MCP server confirmed available OR documented as unavailable and work stopped.

---

#### Task 0.2: Verify Bulk Data Exists

**Acceptance Criteria**:

1. `bulk-downloads/science-primary.json` exists
2. `bulk-downloads/science-secondary.json` exists
3. Both files have non-zero unit counts
4. Do NOT examine content — only verify existence

**Deterministic Validation**:

```bash
cd apps/oak-open-curriculum-semantic-search

# Verify files exist and have units (count only, not content)
jq '.sequence | length' bulk-downloads/science-primary.json
# Expected: Non-zero number (units exist)

jq '.sequence | length' bulk-downloads/science-secondary.json
# Expected: Non-zero number (units exist)
```

**If Missing**: Run `pnpm bulk:download` (requires `OAK_API_KEY` in `.env.local`)

**Task Complete When**: Both bulk data files exist with non-zero unit counts.

---

#### Task 0.3: Verify Query Files Exist (Existence Check Only)

**Acceptance Criteria**:

1. Check whether `.query.ts` files exist in science directories
2. Document what exists vs what needs to be created
3. Do NOT read the content of `.expected.ts` files

**Deterministic Validation**:

```bash
cd apps/oak-open-curriculum-semantic-search

# List query files (existence only)
ls src/lib/search-quality/ground-truth/science/primary/*.query.ts 2>/dev/null || echo "No primary query files"
ls src/lib/search-quality/ground-truth/science/secondary/*.query.ts 2>/dev/null || echo "No secondary query files"
```

**Task Complete When**: Existence/non-existence of query files documented.

---

**Phase 0 Complete When**: All 3 tasks complete. Tools verified. Bulk data verified. Query file existence documented.

---

### Phase 1A: Query Analysis — Pure Reflection

**Foundation Check-In**: Re-read [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) — "Test behaviour, not implementation"

**Key Principle**: Phase 1A is REFLECTION ONLY. No tools. No searches. No data exploration. The goal is to evaluate experimental design based on curriculum knowledge.

---

#### Task 1A.1: Science Curriculum Mental Model

Before evaluating specific queries, establish a clear mental model of Science curriculum.

**Reflect and Document**:

1. **What topics does PRIMARY Science cover?**

   - List the major topics by discipline (biology, chemistry, physics)
   - What vocabulary do KS1-KS2 students use?
   - What are common teacher search patterns for primary science?

2. **What topics does SECONDARY Science cover?**

   - List the major topics by discipline
   - What vocabulary do KS3-KS4 students use?
   - How does terminology differ from primary?

3. **What makes Science queries distinct from other subjects?**

   - Three disciplines with different vocabularies
   - Practical/experimental dimension
   - Cross-discipline connections (energy appears in all three)

**Acceptance Criteria**:

1. Primary science topics documented by discipline
2. Secondary science topics documented by discipline
3. Key vocabulary differences identified between primary and secondary
4. Science-specific query considerations documented

**Task Complete When**: Mental model documented in plan execution notes.

---

#### Task 1A.2: Category Capability Definitions for Science

For each category, define what it SHOULD test in the Science context.

**Reflect and Document**:

| Category | Capability Being Tested | Science-Specific Requirements |

|----------|------------------------|------------------------------|

| precise-topic | Basic retrieval with curriculum terminology | Must use actual scientific terms (not simplified), appropriate to key stage |

| natural-expression | Vocabulary bridging from everyday to scientific | Must use genuinely informal language that maps to scientific concepts |

| imprecise-input | Resilience to typos in scientific terms | Must be realistic typos in science vocabulary |

| cross-topic | Finding concept intersections | Must combine distinct scientific concepts (ideally cross-discipline) |

**For each category, answer**:

- What would a GOOD query look like for PRIMARY science?
- What would a GOOD query look like for SECONDARY science?
- What pitfalls should we avoid?

**Acceptance Criteria**:

1. All 4 categories have Science-specific definitions
2. Example good queries sketched for primary and secondary
3. Pitfalls documented for each category

**Task Complete When**: Category definitions documented with Science-specific guidance.

---

#### Task 1A.3: Evaluate Existing Queries (If They Exist) — Reflection Only

If Phase 0 determined query files exist, read ONLY the `.query.ts` files (NOT `.expected.ts`) and evaluate each query.

**For each query, answer (without tools)**:

1. **1A.1**: What capability is being tested?
2. **1A.2**: Is this query a good test of that capability?
3. **1A.3**: Does this query actually prove what it claims?
4. **1A.4**: Are there experimental design issues?
5. **1A.5**: Recommendation — proceed, revise, or change category

**Template for Each Query**:

```
Query: "[text]"
Category: [claimed category]
Phase: [primary/secondary]

1A.1 Capability: [what is being tested]
1A.2 Good test?: [yes/no — why]
1A.3 Actually proves?: [analysis]
1A.4 Design issues?: [list any]
1A.5 Recommendation: [proceed / revise to X / change to category Y]
```

**Acceptance Criteria**:

1. All existing queries have been evaluated using the 1A.1-1A.5 template
2. Each evaluation is based ONLY on curriculum knowledge, NOT on data exploration
3. Recommendations documented for any queries needing revision

**Task Complete When**: All existing queries evaluated OR documented that no queries exist yet.

---

#### Task 1A.4: Design New Queries (If Needed) — Reflection Only

If queries don't exist, or if Task 1A.3 identified queries needing revision, design new queries.

**For each of 24 queries, draft**:

- Query text
- Category
- Description (what this tests)
- Rationale (why this is a good test)

**Science-Specific Considerations**:

- PRIMARY precise-topic: Use terms like "food chains", "forces", "materials", "habitats"
- SECONDARY precise-topic: Use terms like "photosynthesis", "chemical reactions", "electromagnetic spectrum"
- PRIMARY natural-expression: "Why do things fall down?", "What makes things float?"
- SECONDARY natural-expression: "How do plants make food?", "Why does metal rust?"
- PRIMARY imprecise-input: "magnits", "electrisity", "habatats"
- SECONDARY imprecise-input: "photosythesis", "chemicle reactions", "electromagnatic"
- PRIMARY cross-topic: "light and plants", "forces and materials"
- SECONDARY cross-topic: "energy and chemical reactions", "electricity and magnetism"

**Acceptance Criteria**:

1. All 24 queries have draft text and category
2. Each query has documented rationale
3. Queries are based on curriculum knowledge, not data exploration

**Task Complete When**: All 24 query designs drafted with rationale.

---

#### Task 1A.5: Query Design Review — Critical Self-Assessment

Before concluding Phase 1A, critically assess the query designs.

**For each query, ask**:

1. Is this query actually testing what the category claims?
2. Could this query accidentally pass for the wrong reasons?
3. Does the vocabulary level match the key stage?
4. Would a real teacher actually search this way?

**Red Flags to Check**:

- Query uses curriculum terms but is categorised as "natural-expression"
- Query is too easy (trivial match) or too hard (impossible)
- Query tests multiple capabilities at once
- Query vocabulary doesn't match the key stage

**Acceptance Criteria**:

1. All 24 queries have passed critical self-assessment
2. Any red flags have been addressed with revisions
3. Final query list is ready for Phase 1B discovery

**Task Complete When**: All queries validated through critical self-assessment.

---

**Phase 1A Complete Validation**:

No code changes. No tool calls (except reading `.query.ts` files if they exist). Phase 1A is COMPLETE when:

1. Mental model of Science curriculum documented
2. Category definitions established for Science
3. All existing/new queries evaluated or designed
4. Critical self-assessment completed
5. Query designs are ready for Phase 1B discovery (which is OUT OF SCOPE for this plan)

---

## Success Criteria

### Phase 0 (Prerequisites)

- MCP server availability confirmed
- Bulk data files exist with non-zero unit counts
- Query file existence documented

### Phase 1A (Query Analysis)

- Science curriculum mental model documented
- Category definitions established for Science context
- All 24 queries have been critically evaluated or designed
- Each query has clear rationale based on curriculum knowledge
- No data exploration occurred — pure reflection only

### Overall

- Foundation documents re-read and principles applied
- Independent thinking maintained — no bias from existing data
- Ready to proceed to Phase 1B (out of scope) with confidence in query design

---

## Testing Strategy

**Phase 0 and 1A do not involve code changes.** No tests required.

The "test" for Phase 1A is the quality of reasoning in the query analysis — which will be validated when Phase 1B discovers whether the queries are good tests of their capabilities.

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: "Why spend time on pure reflection before exploring data?"

**Answer**: Previous sessions have repeatedly demonstrated that working backwards from data produces biased ground truths. Session 9 (english) showed expected slugs were WRONG. Session 15 (geography) showed "discovery" that validated search results wasn't real discovery.

**The only way to produce genuine value** is to form independent judgments FIRST, then compare against data. Phase 1A establishes that independent judgment.

**Risk of Skipping**: If we jump straight to data exploration, we bias our query design towards what exists rather than what SHOULD exist. This makes the ground truth a self-fulfilling prophecy rather than an independent specification.

### Alignment with Foundation Documents

**From rules.md**:

> "Always apply the first question; Ask: could it be simpler without compromising quality?"

This plan asks that question at the query design level — are we testing the right things?

**From testing-strategy.md**:

> "Test real behaviour, not implementation details"

Ground truth queries should test search CAPABILITIES, not specific slug matches.

**From semantic-search.prompt.md**:

> "Phase 1A catches poorly-designed queries through REFLECTION — no tools, just thinking."

This plan IS Phase 1A.

---

## What Happens Next (Out of Scope)

It doesn't matter, Phase 1A is self-contained, you MUST NOT take into account next steps of any kind

---

## References

- [rules.md](/.agent/directives-and-memory/rules.md) — Core principles
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) — Testing philosophy
- [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) — Cardinal rules for GT review
- [ground-truth-session-template.md](/.agent/plans/semantic-search/templates/ground-truth-session-template.md) — Linear execution protocol
- [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md) — Progress tracking
