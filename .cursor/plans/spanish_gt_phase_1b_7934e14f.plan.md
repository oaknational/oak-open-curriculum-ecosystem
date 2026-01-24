---
name: Spanish GT Phase 1B
overview: Execute Phase 1B (Discovery + COMMIT) for all 8 Spanish ground truth queries (4 primary + 4 secondary). Phase 1A was completed in a previous session. This phase requires independent curriculum discovery using bulk data and MCP summaries, culminating in COMMIT tables for each query BEFORE any benchmark execution. Phase 1C will be a separate future session.
todos:
  - id: foundation-commit
    content: Re-read and commit to rules.md, testing-strategy.md, semantic-search.prompt.md before starting
    status: completed
  - id: primary-units-list
    content: List all PRIMARY units with jq for systematic review reference
    status: completed
  - id: primary-precise-topic
    content: "PRIMARY precise-topic: 1B.1-1B.5 for 'Spanish verb ser' — 10+ candidates, 5-10 MCP summaries, COMMIT table"
    status: completed
  - id: primary-natural-expression
    content: "PRIMARY natural-expression: 1B.1-1B.5 for 'teach spanish greetings to children' — FRESH discovery, COMMIT table"
    status: completed
  - id: primary-imprecise-input
    content: "PRIMARY imprecise-input: 1B.1-1B.5 for 'spansh vocabulary primary' — semantic intent despite typo, COMMIT table"
    status: completed
  - id: primary-cross-topic
    content: "PRIMARY cross-topic: 1B.1-1B.5 for 'Spanish verbs ser and estar together' — verify BOTH concepts in candidates, COMMIT table"
    status: completed
  - id: secondary-units-list
    content: List all SECONDARY units with jq for systematic review reference
    status: completed
  - id: secondary-precise-topic
    content: "SECONDARY precise-topic: 1B.1-1B.5 for 'Spanish AR verbs present tense' — 10+ candidates, 5-10 MCP summaries, COMMIT table"
    status: completed
  - id: secondary-natural-expression
    content: "SECONDARY natural-expression: 1B.1-1B.5 for 'teach Spanish verb endings year 7' — FRESH discovery, COMMIT table"
    status: completed
  - id: secondary-imprecise-input
    content: "SECONDARY imprecise-input: 1B.1-1B.5 for 'spanish grammer conjugating verbs' — semantic intent despite typo, COMMIT table"
    status: completed
  - id: secondary-cross-topic
    content: "SECONDARY cross-topic: 1B.1-1B.5 for 'Spanish adjectives and noun agreement' — verify BOTH concepts, COMMIT table"
    status: completed
  - id: update-checklist
    content: Update ground-truth-review-checklist.md to mark Phase 1B complete for all 8 Spanish queries
    status: completed
---

# Spanish GT Phase 1B: Discovery + COMMIT

## Scope and Boundaries

**IN SCOPE**: Phase 1B only — Discovery + COMMIT for 8 queries

**OUT OF SCOPE**: Phase 1C (benchmark, comparison, metrics) — this is a FUTURE session

**PROHIBITED**: Running benchmark, reading `.expected.ts` files

## Pre-Execution Foundation Commitment

Before starting any query, re-read and re-commit to:

- [rules.md](/.agent/directives-and-memory/rules.md) — First Question, quality gates
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) — TDD principles apply to GT design
- [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) — Cardinal rules, anti-patterns

## The 8 Queries

| Phase | Category | Query |

|-------|----------|-------|

| PRIMARY | precise-topic | "Spanish verb ser" |

| PRIMARY | natural-expression | "teach spanish greetings to children" |

| PRIMARY | imprecise-input | "spansh vocabulary primary" |

| PRIMARY | cross-topic | "Spanish verbs ser and estar together" |

| SECONDARY | precise-topic | "Spanish AR verbs present tense" |

| SECONDARY | natural-expression | "teach Spanish verb endings year 7" |

| SECONDARY | imprecise-input | "spanish grammer conjugating verbs" |

| SECONDARY | cross-topic | "Spanish adjectives and noun agreement" |

## MFL-Specific Considerations

Spanish has ~0% content coverage (no transcripts). Search relies entirely on **structure retrieval**:

- Lesson titles
- Keywords
- Key learning

**Key learnings from French/German sessions to apply:**

- "Greetings" and "Introductions" are DISTINCT concepts in MFL
- Cross-topic requires BOTH concepts in keywords (not just in key learning)
- Title matching is heavily weighted
- Systematic unit review required — grammar content often hidden in activity-focused lessons

## Phase 1B Protocol (per query)

For each of the 8 queries:

1. **1B.1 — Search bulk data**: Use `jq` to find 10+ candidate slugs from multiple search terms
2. **1B.2 — Get MCP summaries**: Call `get-lessons-summary` for 5-10 candidates, record key learning quotes
3. **1B.3 — Get unit context**: Call `get-units-summary` to understand lesson ordering
4. **1B.4 — Analyse candidates**: Document reasoning for each candidate's relevance against the query
5. **1B.5 — COMMIT rankings**: Document top 5 with scores (3=highly relevant, 2=relevant, 1=marginally relevant) and justifications

## Execution Structure

### Block 1: PRIMARY queries (4)

Working directory: `apps/oak-open-curriculum-semantic-search`

Bulk data: `bulk-downloads/spanish-primary.json`

```bash
# List all units for systematic review
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/spanish-primary.json > /tmp/spanish-primary-units.txt
```

Execute 1B.1-1B.5 for each:

1. precise-topic: "Spanish verb ser"
2. natural-expression: "teach spanish greetings to children"
3. imprecise-input: "spansh vocabulary primary"
4. cross-topic: "Spanish verbs ser and estar together"

### Block 2: SECONDARY queries (4)

Bulk data: `bulk-downloads/spanish-secondary.json`

```bash
# List all units for systematic review
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/spanish-secondary.json > /tmp/spanish-secondary-units.txt
```

Execute 1B.1-1B.5 for each:

1. precise-topic: "Spanish AR verbs present tense"
2. natural-expression: "teach Spanish verb endings year 7"
3. imprecise-input: "spanish grammer conjugating verbs"
4. cross-topic: "Spanish adjectives and noun agreement"

## COMMIT Table Template

For each query, produce:

| Rank | Slug | Score | Key Learning Quote | Justification |

|------|------|-------|-------------------|---------------|

| 1 | slug-1 | 3 | "..." | Why this is #1 |

| 2 | slug-2 | 3 | "..." | Why this is #2 |

| 3 | slug-3 | 2 | "..." | Why this is #3 |

| 4 | slug-4 | 2 | "..." | Why this is #4 |

| 5 | slug-5 | 1 | "..." | Why this is #5 |

## Session Completion Criteria

Phase 1B is complete when:

- [ ] All 8 COMMIT tables are documented with scores and justifications
- [ ] Each table has 5 ranked slugs based on independent curriculum analysis
- [ ] No benchmark has been run
- [ ] No `.expected.ts` files have been read
- [ ] Checklist updated to mark Phase 1B complete for all 8 queries

## Anti-Pattern Reminders

- **Title-only discovery is NOT sufficient** — systematically review ALL units
- **No shortcuts between queries** — each query requires FRESH jq + FRESH MCP summaries
- **COMMIT BEFORE benchmark** — rankings must be based on curriculum content, not search results
- **Do NOT read `.expected.ts` files** — you don't know expected slugs until Phase 1C
