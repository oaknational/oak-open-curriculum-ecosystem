---
name: English GT Review Session
overview: "Session 9: DEEP ground truth review for english/primary (1517 lessons) and english/secondary (1072 lessons). 8 ground truths total across 2 phases. Uses Deep Exploration Standard: 5-10 MCP summaries per category, comparison tables, unit exploration. Goal: discover BEST possible matches, not validate AI-curated defaults."
todos:
  - id: prereq
    content: "Prerequisites: Verify MCP server, ES access, bulk data availability"
    status: completed
  - id: primary-precise-bulk
    content: "english/primary precise-topic: Search bulk data for ALL BFG lessons"
    status: completed
  - id: primary-precise-mcp
    content: "english/primary precise-topic: Get MCP summaries for 5-10 BFG candidates"
    status: completed
  - id: primary-precise-compare
    content: "english/primary precise-topic: Create comparison table, select BEST matches"
    status: completed
  - id: primary-natural-bulk
    content: "english/primary natural-expression: Search bulk data, consider DIFFERENT topic than precise-topic"
    status: completed
  - id: primary-natural-mcp
    content: "english/primary natural-expression: Get MCP summaries for 5-10 candidates"
    status: completed
  - id: primary-natural-compare
    content: "english/primary natural-expression: Create comparison table, address same-slug issue"
    status: completed
  - id: primary-imprecise-bulk
    content: "english/primary imprecise-input: Search bulk data for ALL Iron Man lessons"
    status: completed
  - id: primary-imprecise-mcp
    content: "english/primary imprecise-input: Get MCP summaries for 5-10 candidates"
    status: completed
  - id: primary-imprecise-compare
    content: "english/primary imprecise-input: Create comparison table, investigate low MRR"
    status: completed
  - id: primary-cross-bulk
    content: "english/primary cross-topic: Search for writing+grammar lessons"
    status: completed
  - id: primary-cross-mcp
    content: "english/primary cross-topic: Get MCP summaries, verify BOTH concepts in key learning"
    status: completed
  - id: primary-cross-compare
    content: "english/primary cross-topic: Create comparison table, select BEST intersection matches"
    status: completed
  - id: secondary-precise-bulk
    content: "english/secondary precise-topic: Search bulk data for ALL Lord of the Flies lessons"
    status: completed
  - id: secondary-precise-mcp
    content: "english/secondary precise-topic: Get MCP summaries for 5-10 candidates"
    status: completed
  - id: secondary-precise-compare
    content: "english/secondary precise-topic: Create comparison table, verify symbolism focus"
    status: completed
  - id: secondary-natural-bulk
    content: "english/secondary natural-expression: Search bulk data for ALL Gothic lessons"
    status: completed
  - id: secondary-natural-mcp
    content: "english/secondary natural-expression: Get MCP summaries for 5-10 candidates"
    status: completed
  - id: secondary-natural-compare
    content: "english/secondary natural-expression: Create comparison table, verify Year 8 appropriateness"
    status: completed
  - id: secondary-imprecise-bulk
    content: "english/secondary imprecise-input: Search bulk data for ALL Frankenstein lessons"
    status: completed
  - id: secondary-imprecise-mcp
    content: "english/secondary imprecise-input: Get MCP summaries for 5-10 candidates"
    status: completed
  - id: secondary-imprecise-compare
    content: "english/secondary imprecise-input: Create comparison table, focus on creation theme"
    status: completed
  - id: secondary-cross-bulk
    content: "english/secondary cross-topic: Search for grammar+essay lessons"
    status: completed
  - id: secondary-cross-mcp
    content: "english/secondary cross-topic: Get MCP summaries, investigate MRR 0.100"
    status: completed
  - id: secondary-cross-compare
    content: "english/secondary cross-topic: Create comparison table, verify intersection exists"
    status: completed
  - id: validate
    content: "Validation: type-check, ground-truth:validate, benchmark --subject english --verbose"
    status: completed
  - id: docs
    content: "Documentation: Update checklist, prompt, current-state with session findings"
    status: completed
---

# Ground Truth Review Session 9: English (Primary + Secondary)

## Foundation Documents Commitment

Before and during this session, re-read and apply:

- [rules.md](/.agent/directives-and-memory/rules.md) — First Question, TDD, no shortcuts
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) — Test behaviour, not implementation
- [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md) — Generator is source of truth

**Question before starting**: Are we solving the right problem at the right layer? Ground truth review is about specification correctness (the answer key), not optimising scores.

---

## Scope

| Subject-Phase | Lessons | Categories | Current Status |

|---------------|---------|------------|----------------|

| english/primary | 1517 | 4 | AI-curated 2026-01-11, not yet human-reviewed |

| english/secondary | 1072 | 4 | AI-curated 2026-01-11, not yet human-reviewed |

**Total**: 8 ground truths to review

---

## Initial Observations (Potential Issues)

1. **Primary natural-expression uses SAME expected slugs as precise-topic** — Both use BFG lessons. This doesn't test vocabulary bridging properly.
2. **Secondary cross-topic MRR is 0.100** — Very low, needs investigation of whether expected slugs actually combine grammar AND essay writing.
3. **All ground truths were AI-curated** — No deep exploration with MCP tools yet performed.

---

## Deep Exploration Standard (Mandatory)

| Requirement | Minimum | Why |

|-------------|---------|-----|

| MCP summaries per category | **5-10** | Reveals non-obvious candidates via key learning points |

| Comparison tables | **Every category** | Prevents "good enough" thinking |

| Unit exploration | **Every relevant unit** | Finds hidden gems not visible in titles |

| Confidence check | **Before finalising** | Ensures thoroughness |

---

## Prerequisites

```bash
cd /Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-open-curriculum-semantic-search
source .env.local

# Verify MCP server available (call get-help via MCP)
# Verify ES access
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_count" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" | jq '.count'

# Verify bulk data (already confirmed: 1517 primary, 1072 secondary)
```

---

## Phase 1: english/primary (4 categories)

### Ground Truth Files

[src/lib/search-quality/ground-truth/english/primary/](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/english/primary/)

### Category 1: precise-topic

**Current query**: "The BFG reading comprehension Roald Dahl Year 3"

**Current expected**: `engaging-with-the-bfg` (3), `engaging-with-the-opening-chapter-of-the-bfg` (3), `writing-the-opening-of-the-bfg-part-one` (2)

**Review focus**:

- Query uses curriculum terminology — appropriate for precise-topic
- Explore ALL BFG lessons in the pool (not just these 3)
- Check if there are better score=3 candidates based on key learning points

### Category 2: natural-expression

**Current query**: "that Roald Dahl book with the giant BFG reading"

**Current expected**: SAME as precise-topic (problematic)

**Review focus**:

- **CRITICAL**: Same expected slugs as precise-topic — this doesn't test vocabulary bridging
- Consider: Should this query test informal language bridging to DIFFERENT content?
- Alternative approach: Test colloquial phrasing for different topic (e.g., "stories about being brave" → not directly mentioning courage/bravery curriculum terms)

### Category 3: imprecise-input

**Current query**: "narative writing storys iron man Year 3"

**Current expected**: Iron Man writing lessons

**Current MRR**: 0.167 (low)

**Review focus**:

- Typos: "narative" (narrative), "storys" (stories)
- Are these the BEST Iron Man narrative writing lessons?
- Use MCP to find all Iron Man lessons and compare key learning points

### Category 4: cross-topic

**Current query**: "writing and grammar tenses together"

**Current expected**: `writing-sentences-in-the-simple-present-past-and-future-tense` (3), `writing-sentences-in-the-progressive-present-past-and-future-tense` (2)

**Review focus**:

- Query combines writing + grammar/tenses
- Verify expected slugs actually teach BOTH writing AND grammar (not just grammar)
- Search for other lessons that combine these concepts

---

## Phase 2: english/secondary (4 categories)

### Ground Truth Files

[src/lib/search-quality/ground-truth/english/secondary/](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/english/secondary/)

### Category 1: precise-topic

**Current query**: "Lord of the Flies symbolism"

**Current expected**: `goldings-use-of-symbolism-in-lord-of-the-flies` (3), `allusions-in-lord-of-the-flies` (3), `goldings-message-about-human-behaviour` (2)

**Review focus**:

- Explore ALL Lord of the Flies lessons
- Verify score=3 assignments via key learning points
- "allusions" vs "symbolism" — are allusions the same as symbolism? Check key learning

### Category 2: natural-expression

**Current query**: "teach students about gothic literature year 8"

**Current expected**: `diving-deeper-into-the-gothic-genre` (3), `frankenstein-and-the-gothic-context` (3), `gothic-vocabulary-in-jane-eyre` (2)

**Review focus**:

- "teach students about" is informal teacher phrasing
- Explore ALL Gothic-related units and lessons
- Use MCP to verify these are the BEST Gothic intro lessons for Year 8

### Category 3: imprecise-input

**Current query**: "frankenstien monster creation"

**Current expected**: Frankenstein creation lessons

**Current MRR**: 0.500

**Review focus**:

- Typo: "frankenstien" (Frankenstein)
- Explore ALL Frankenstein lessons
- Are these the BEST lessons about the monster's creation specifically?

### Category 4: cross-topic

**Current query**: "grammar and punctuation in essay writing"

**Current expected**: `persuasive-opinion-pieces` (3), `annotating-essay-questions...` (2), `developing-comparative-essay-writing-skills` (2)

**Current MRR**: 0.100 (very low)

**Review focus**:

- **CRITICAL**: MRR 0.100 suggests expected slugs may be wrong
- Do these lessons actually teach grammar/punctuation IN essay context?
- Look for lessons that explicitly combine technical grammar with essay composition
- If no perfect intersection exists, document this

---

## Process Per Category

1. **Search bulk data** with multiple terms using jq
2. **List ALL lessons** in relevant units
3. **Get MCP summaries** (`get-lessons-summary`) for **5-10 candidates**
4. **Get unit context** (`get-units-summary`) for relevant units
5. **Create comparison table** with key learning points
6. **Run gt-review** to see current search results
7. **Ask "Am I confident?"** — if no, explore more
8. **Select BEST matches** based on evidence

---

## Validation (After All Categories)

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject english --verbose
```

---

## Documentation Updates

1. Update checklist: [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md)
2. Update prompt next session: [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md)
3. Update progress in: [current-state.md](/.agent/plans/semantic-search/current-state.md)

---

## Session Completion Summary Template

| Category | Phase | MRR | NDCG | P@3 | R@10 | Key Finding |

|----------|-------|-----|------|-----|------|-------------|

| precise-topic | primary | | | | | |

| natural-expression | primary | | | | | |

| imprecise-input | primary | | | | | |

| cross-topic | primary | | | | | |

| precise-topic | secondary | | | | | |

| natural-expression | secondary | | | | | |

| imprecise-input | secondary | | | | | |

| cross-topic | secondary | | | | | |

---

## Key Questions to Answer

1. **Primary natural-expression**: Should we change this to test vocabulary bridging for DIFFERENT content than precise-topic?
2. **Secondary cross-topic**: Why is MRR 0.100? Are expected slugs semantically correct?
3. **All categories**: Have I found the BEST matches through deep exploration, not just validated AI-curated defaults?
