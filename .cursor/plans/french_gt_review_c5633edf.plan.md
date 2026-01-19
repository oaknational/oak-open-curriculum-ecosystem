---
name: French GT Review
overview: Execute the Linear Protocol for French primary (105 lessons) and secondary (417 lessons) ground truth review. 8 categories total, 7 steps each with evidence requirements. Preliminary analysis identified 3 potential issues requiring deep investigation.
todos:
  - id: phase0
    content: "PHASE 0: Verify MCP server, bulk data (105 primary, 417 secondary), gt-review tool - STOP if any unavailable"
    status: completed
  - id: primary-precise
    content: "french/primary precise-topic: 7-step protocol for 'French ER verbs singular' - verify current slugs are optimal"
    status: completed
  - id: primary-natural
    content: "french/primary natural-expression [FLAGGED]: 7-step protocol for 'teach french greetings to children' - compare greetings-je-suis vs introductions-voici"
    status: completed
  - id: primary-imprecise
    content: "french/primary imprecise-input: 7-step protocol for 'fench vocabulary primary' - verify typo handling"
    status: completed
  - id: primary-cross
    content: "french/primary cross-topic: 7-step protocol for 'French verbs and vocabulary together' - verify BOTH concepts in key learning"
    status: completed
  - id: secondary-precise
    content: "french/secondary precise-topic: 7-step protocol for 'French negation ne pas' - verify negation unit lessons"
    status: completed
  - id: secondary-natural
    content: "french/secondary natural-expression: 7-step protocol for 'teach French negative sentences year 7' - verify Year 7 appropriateness"
    status: completed
  - id: secondary-imprecise
    content: "french/secondary imprecise-input [FLAGGED]: 7-step protocol for 'french grammer avoir etre' - query is about avoir/etre grammar NOT negation"
    status: completed
  - id: secondary-cross
    content: "french/secondary cross-topic [FLAGGED]: 7-step protocol for 'verbs and adjectives' - dieppe is verbs+questions, need verbs+adjectives"
    status: completed
  - id: phase2
    content: "PHASE 2: Run type-check, ground-truth:validate, benchmark for both phases with ALL 4 metrics"
    status: in_progress
  - id: phase3
    content: "PHASE 3: Update checklist with metrics, key learnings, and changes made"
    status: pending
  - id: quality-gates
    content: "Run full quality gates: type-gen, build, type-check, lint:fix, format:root, markdownlint:root, test, test:e2e, test:e2e:built, test:ui, smoke:dev:stub"
    status: completed
---

# French Ground Truth Review Session

## Foundation Commitment

Before and during execution, re-read and recommit to:

- [rules.md](/.agent/directives-and-memory/rules.md) - First Question, TDD principles
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) - Test behaviour not implementation
- [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

**System-level impact**: Ground truths are specifications. Wrong specifications lead to optimising for wrong outcomes. The goal is discovering BEST matches, not validating existing choices.

---

## Cardinal Rule

> **The search might be RIGHT. Your expected slugs might be WRONG.**

The Key Question: Are ACTUAL results BETTER or WORSE than expected slugs?

---

## Preliminary Analysis Summary

### Issues Identified (Require Deep Investigation)

**French Primary - natural-expression**: "teach french greetings to children"

- Current expected: `introductions-voici-je-suis-and-il-elle-est`, `new-friends-mon-ma-ton-ta`
- Found: `greetings-je-suis-and-il-elle-est` explicitly about greetings with key learning mentioning "bonjour" and "salut"
- **Question**: Is a lesson titled "Greetings" better than lessons titled "Introductions" for a query about "greetings"?

**French Secondary - imprecise-input**: "french grammer avoir etre"

- Current expected slugs are about NEGATION, not avoir/être grammar
- Query intent appears to be "grammar with avoir and être" (with typo)
- Better candidates may include: `my-everyday-avoir-and-etre-for-feelings-and-states`, `jobs-singular-avoir-or-etre-questions-with-est-ce-que`

**French Secondary - cross-topic**: "verbs and adjectives in French grammar"

- Current score=2 slug `dieppe-festival-plural-er-verbs-est-ce-que-questions` is about verbs + QUESTIONS, not adjectives
- Better candidate: `rock-en-seine-plural-etre-plural-adjectives` (être + plural adjectives)

---

## Phase 0: Prerequisites

Verify before proceeding:

- MCP server: Call `get-help` to confirm
- Bulk data: `jq '.lessons | length' bulk-downloads/french-primary.json` (expect 105)
- Bulk data: `jq '.lessons | length' bulk-downloads/french-secondary.json` (expect 417)
- gt-review: `pnpm gt-review --help`

**CHECKPOINT 0**: If ANY tool unavailable → STOP

---

## Phase 1: Category Exploration

Execute 7 steps for each of 8 categories.

### French Primary Categories

**1. precise-topic**: "French ER verbs singular"

- Current expected: `at-school-singular-er-verbs` (3), `family-activities-singular-regular-er-verbs` (3), `at-school-er-verbs-i-and-you` (2)
- Candidates to verify: `my-friend-singular-er-verbs`, `a-birthday-er-verbs-she-he`

**2. natural-expression**: "teach french greetings to children" [FLAGGED]

- Current expected: `introductions-voici-je-suis-and-il-elle-est` (3), `new-friends-mon-ma-ton-ta` (2)
- Key candidates: `greetings-je-suis-and-il-elle-est`, `is-it-going-ok-ca-va`
- **Critical**: Compare key learning for "greetings" vocabulary match

**3. imprecise-input**: "fench vocabulary primary"

- Current expected: `introductions-voici-je-suis-and-il-elle-est` (3), `my-birthday-quand` (2)
- Verify semantic intent behind "fench" typo for "French vocabulary"

**4. cross-topic**: "French verbs and vocabulary together"

- Current expected: `age-avoir-meaning-be` (3), `my-monster-il-y-a-and-il-a` (2)
- Verify both concepts (verbs AND vocabulary) in key learning

### French Secondary Categories

**5. precise-topic**: "French negation ne pas"

- Current expected: 4 slugs from negation unit
- Verify these are the foundational negation lessons

**6. natural-expression**: "teach French negative sentences year 7"

- Current expected: `what-isnt-happening-ne-pas-negation` (3), `what-people-do-and-dont-do-ne-pas-negation` (2)
- Verify these are appropriate Year 7 lessons

**7. imprecise-input**: "french grammer avoir etre" [FLAGGED]

- Current expected: Negation lessons
- **Critical**: Query asks for avoir/être grammar, not negation
- Key candidates: `my-everyday-avoir-and-etre-for-feelings-and-states`, `jobs-singular-avoir-or-etre-questions-with-est-ce-que`, `me-and-you-etre-1st-and-2nd-persons-singular`

**8. cross-topic**: "verbs and adjectives in French grammar" [FLAGGED]

- Current expected: `two-musicians-singular-etre-singular-adjectives` (3), `dieppe-festival-plural-er-verbs-est-ce-que-questions` (2)
- **Critical**: Dieppe lesson is verbs + QUESTIONS, not adjectives
- Key candidates: `rock-en-seine-plural-etre-plural-adjectives`, `clean-up-re-verbs-adjectives`

---

## Per-Category Protocol (7 Steps)

For each category:

1. **Search bulk data** - Multiple search terms, record counts and candidates
2. **Get 5-10 MCP summaries** - Include current expected + new candidates + actual search results
3. **Get unit context** - `get-units-summary` for lesson ordering
4. **Run gt-review** - Record actual top 10 results
5. **Create comparison table** - Actual vs Expected with key learning quotes
6. **Answer critical question** - Are actual results BETTER than expected?
7. **Record ALL 4 metrics** - MRR, NDCG@10, P@3, R@10

---

## Phase 2: Validation

After all categories complete:

```bash
pnpm type-check
pnpm ground-truth:validate  
pnpm benchmark --subject french --phase primary --verbose
pnpm benchmark --subject french --phase secondary --verbose
```

Record aggregate metrics table.

---

## Phase 3: Documentation

Update [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

- Mark all 8 categories complete with all 4 metrics
- Record key learnings
- Record changes made

---

## Key Files

- Primary GT: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/french/primary/`
- Secondary GT: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/french/secondary/`
- Bulk data: `apps/oak-open-curriculum-semantic-search/bulk-downloads/french-*.json`

---

## Quality Gates (After All Changes)

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```
