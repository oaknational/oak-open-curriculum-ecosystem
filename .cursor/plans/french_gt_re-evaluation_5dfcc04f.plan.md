---
name: French GT Re-evaluation
overview: Re-evaluate French (primary + secondary) ground truths using the updated Discovery Gate protocol, ensuring ground truths test structure-based retrieval appropriately given that MFL lessons have metadata but not transcripts.
todos:
  - id: phase0
    content: "PHASE 0: Verify MCP server, bulk data (105 primary, 417 secondary), benchmark tool"
    status: completed
  - id: primary-precise-1a
    content: "french/primary precise-topic: Discovery (1A) - bulk search, MCP summaries, unit context, identify best candidates"
    status: completed
  - id: primary-precise-1b
    content: "french/primary precise-topic: Comparison (1B) - benchmark --review, comparison table, critical question, ALL 4 metrics"
    status: completed
  - id: primary-natural-1a
    content: "french/primary natural-expression: Discovery (1A) - verify greetings correction through deep exploration"
    status: completed
  - id: primary-natural-1b
    content: "french/primary natural-expression: Comparison (1B) - benchmark --review, ALL 4 metrics"
    status: completed
  - id: primary-imprecise-1a
    content: "french/primary imprecise-input: Discovery (1A) - verify vocabulary correction through deep exploration"
    status: completed
  - id: primary-imprecise-1b
    content: "french/primary imprecise-input: Comparison (1B) - benchmark --review, ALL 4 metrics"
    status: completed
  - id: primary-cross-1a
    content: "french/primary cross-topic: Discovery (1A) - verify BOTH concepts in key learning"
    status: completed
  - id: primary-cross-1b
    content: "french/primary cross-topic: Comparison (1B) - benchmark --review, ALL 4 metrics"
    status: completed
  - id: secondary-precise-1a
    content: "french/secondary precise-topic: Discovery (1A) - bulk search, MCP summaries, unit context"
    status: completed
  - id: secondary-precise-1b
    content: "french/secondary precise-topic: Comparison (1B) - benchmark --review, ALL 4 metrics"
    status: completed
  - id: secondary-natural-1a
    content: "french/secondary natural-expression: Discovery (1A) - verify Year 7 appropriateness"
    status: completed
  - id: secondary-natural-1b
    content: "french/secondary natural-expression: Comparison (1B) - benchmark --review, ALL 4 metrics"
    status: completed
  - id: secondary-imprecise-1a
    content: "french/secondary imprecise-input: Discovery (1A) - verify avoir/etre correction through deep exploration"
    status: completed
  - id: secondary-imprecise-1b
    content: "french/secondary imprecise-input: Comparison (1B) - benchmark --review, ALL 4 metrics"
    status: completed
  - id: secondary-cross-1a
    content: "french/secondary cross-topic: Discovery (1A) - verify verbs+adjectives through deep exploration"
    status: completed
  - id: secondary-cross-1b
    content: "french/secondary cross-topic: Comparison (1B) - benchmark --review, ALL 4 metrics"
    status: completed
  - id: phase2
    content: "PHASE 2: Run type-check, ground-truth:validate, benchmark --verbose for both phases, record aggregate metrics"
    status: completed
  - id: phase3
    content: "PHASE 3: Update checklist with metrics, key learnings, changes made"
    status: completed
  - id: doc-fix
    content: Fix documentation that incorrectly frames structure-only retrieval as a limitation
    status: completed
  - id: quality-gates
    content: "Run full quality gates: type-gen, build, type-check, lint:fix, format, test, e2e"
    status: completed
---

# French Ground Truth Re-evaluation

## Foundation Commitment

Re-read and recommit to these documents at session start:

- [rules.md](/.agent/directives-and-memory/rules.md)
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md)
- [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md)

---

## Architectural Fact: Structure vs Content

French lessons have:

- **Structure** (100%): title, unit, keywords, key learning points
- **Content** (~0%): transcripts are not available for MFL subjects

This is not a failure or limitation. It is the architecture:

- Structure BM25 + Structure ELSER serve all French lessons
- Ground truths must test structure-based retrieval
- Queries that would require transcript content are inappropriately designed

Any documentation that frames this as a "problem" or "limitation" requiring a fix must be corrected to reflect this architectural fact.

---

## Previous Session State

The previous French session (plan `french_gt_review_c5633edf`) made corrections:

- `french/primary/natural-expression.ts`: Changed from introductions to greetings lessons
- `french/primary/imprecise-input.ts`: Changed to vocabulary-matching lessons  
- `french/secondary/imprecise-input.ts`: Changed from negation to avoir/etre lessons
- `french/secondary/cross-topic.ts`: Changed from verbs+questions to verbs+adjectives

**Incomplete phases**:

- Phase 2 (validation/benchmark): `in_progress` - not completed
- Phase 3 (documentation): `pending`

---

## Scope of This Session

1. **Verify previous corrections** using full Discovery Gate protocol
2. **Complete validation** (Phase 2)
3. **Update documentation** (Phase 3)
4. **Fix any documentation** that incorrectly frames structure-only search as a problem

---

## Phase 0: Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search
```

Verify:

- MCP server working (call `get-help`)
- Bulk data present: 105 primary lessons, 417 secondary lessons
- Benchmark tool working: `pnpm benchmark --help`

**STOP if any tool unavailable.**

---

## Phase 1: Discovery Gate Protocol (8 categories)

For each category, execute the full protocol from [ground-truth-session-template.md](/.agent/plans/semantic-search/templates/ground-truth-session-template.md):

### Phase 1A: Discovery (BEFORE benchmark)

1. Search bulk data with 3+ terms (10+ candidates)
2. Get 5-10 MCP summaries with key learning quotes
3. Get unit context via `get-units-summary`
4. Identify best candidates with reasoning

**Discovery Gate**: All 4 steps complete before proceeding.

### Phase 1B: Comparison (AFTER Discovery Gate)

1. Run `pnpm benchmark -s french -p [phase] -c [category] --review`
2. Create comparison table: your candidates vs search results vs expected
3. Answer critical question: Are actual results BETTER or WORSE than expected?
4. Record ALL 4 metrics: MRR, NDCG@10, P@3, R@10

---

## Categories to Review

### French Primary (4 categories)

| Category | Query | Current Status |

|----------|-------|----------------|

| precise-topic | "French ER verbs singular" | Verify still optimal |

| natural-expression | "teach french greetings to children" | Verify correction |

| imprecise-input | "fench vocabulary primary" | Verify correction |

| cross-topic | "French verbs and vocabulary together" | Verify still optimal |

### French Secondary (4 categories)

| Category | Query | Current Status |

|----------|-------|----------------|

| precise-topic | "French negation ne pas" | Verify still optimal |

| natural-expression | "teach French negative sentences year 7" | Verify still optimal |

| imprecise-input | "french grammer avoir etre" | Verify correction |

| cross-topic | "verbs and adjectives in French grammar" | Verify correction |

---

## Phase 2: Validation

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject french --phase primary --verbose
pnpm benchmark --subject french --phase secondary --verbose
```

Record aggregate metrics for both phases.

---

## Phase 3: Documentation

Update [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

- Mark french/primary and french/secondary complete
- Record all 4 metrics for each category
- Document key learnings and changes

---

## Documentation Fixes Required

Review and correct any language in these files that frames structure-only retrieval as a "limitation" or "failure":

- [current-state.md](/.agent/plans/semantic-search/current-state.md) line 148 uses "search limitations"
- Ensure framing is: "MFL subjects use structure retrieval (metadata). Ground truths must be designed for structure retrieval."

---

## Quality Gates (Final)

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm test:e2e:built && pnpm test:ui && pnpm smoke:dev:stub
```

---

## Key Files

- Primary GT: [french/primary/](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/french/primary/)
- Secondary GT: [french/secondary/](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/french/secondary/)
- Bulk data: `apps/oak-open-curriculum-semantic-search/bulk-downloads/french-*.json`
- Template: [ground-truth-session-template.md](/.agent/plans/semantic-search/templates/ground-truth-session-template.md)

---

## Cardinal Rule

> **The search might be RIGHT. Your expected slugs might be WRONG.**

The question is not "do expected slugs appear in results?" but "are ACTUAL results BETTER or WORSE than expected slugs?"
