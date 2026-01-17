---
name: Ground Truth Review Session 2
overview: Review and validate art/secondary ground truth queries (4 categories) to ensure each has differentiation power within the Art + Secondary context. Complete validation and quality gates, then update progress tracking.
todos:
  - id: verify-mcp-server
    content: Verify MCP server (oak-local) is available for exploration during review
    status: completed
  - id: art-secondary-precise
    content: "Review art/secondary precise-topic: evaluate differentiation within Art+Secondary context, run gt-review, explore via MCP, fix if needed"
    status: completed
  - id: art-secondary-natural
    content: "Review art/secondary natural-expression: evaluate differentiation within Art+Secondary context, run gt-review, explore via MCP, fix if needed"
    status: completed
  - id: art-secondary-imprecise
    content: "Review art/secondary imprecise-input: evaluate differentiation within Art+Secondary context, run gt-review, explore via MCP, fix if needed"
    status: completed
  - id: art-secondary-cross
    content: "Review art/secondary cross-topic: evaluate differentiation within Art+Secondary context, run gt-review, explore via MCP, fix if needed"
    status: completed
  - id: validate-art-secondary
    content: Run type-check, ground-truth:validate, benchmark for art/secondary after all categories complete
    status: completed
  - id: quality-gates-session2
    content: Run full quality gate suite one at a time, analyse all before fixing
    status: completed
  - id: update-checklist-art-secondary
    content: "Update ground-truth-review-checklist.md to mark art/secondary complete (progress: 2/30 subject-phases, 8/120 ground truths)"
    status: completed
---

# Ground Truth Review: Session 2 - Art/Secondary

## Objective

Review all 4 ground truth categories for art/secondary, ensuring each query has genuine differentiation power when filters (subject=Art, phase=Secondary) are already applied. Complete validation and quality gates.

## Current State

- **Progress**: 1/30 subject-phases complete (art/primary done)
- **Next**: art/secondary (4 queries across 4 categories)
- **Files to review**:
  - [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/precise-topic.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/precise-topic.ts)
  - [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/natural-expression.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/natural-expression.ts)
  - [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/imprecise-input.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/imprecise-input.ts)
  - [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/cross-topic.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/cross-topic.ts)

## Foundation Documents

Before starting, ensure compliance with:

- [`.agent/directives-and-memory/rules.md`](.agent/directives-and-memory/rules.md) - TDD, fail fast, no type shortcuts
- [`.agent/directives-and-memory/testing-strategy.md`](.agent/directives-and-memory/testing-strategy.md) - TDD at all levels
- [`.agent/directives-and-memory/schema-first-execution.md`](.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

## Review Process (Per Category)

### Step 1: Evaluate Query Differentiation

Ask: **"What does matching specific results for this query tell us, given we're already filtering to Art + Secondary?"**

**Current queries to evaluate**:

- `precise-topic`: "abstract painting techniques" - Verify this differentiates within Art Secondary
- `natural-expression`: "feelings in pictures" - Verify natural language bridging
- `imprecise-input`: "teach drawing skills beginers" - Verify typo recovery ("beginers" → "beginners")
- `cross-topic`: "portraits and colour expression" - Verify multi-concept intersection

**Red flags**:

- Queries that duplicate filter context (e.g., "art secondary techniques")
- Queries too broad to differentiate (e.g., "art lessons")
- Queries that don't test the category's purpose

### Step 2: Run Query via gt-review CLI

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm gt-review --subject art --phase secondary --category precise-topic
pnpm gt-review --subject art --phase secondary --category natural-expression
pnpm gt-review --subject art --phase secondary --category imprecise-input
pnpm gt-review --subject art --phase secondary --category cross-topic
```

**Critical**: If MCP server (`oak-local`) is unavailable, **STOP immediately**. Review requires examining lesson content via MCP tools.

### Step 3: Explore TOP RESULTS AND CURRICULUM DATA

**CRITICAL**: Do not just accept top-ranked results. We must explore BOTH:

1. **Top search results** (from Step 2):

   - Review what the current system returns
   - Understand why these lessons ranked highly
   - Note which expected slugs appear and which don't

2. **Curriculum data exploration** (via MCP tools):

   - Use `get-search-lessons` to search the curriculum with different query variations
   - Use `get-key-stages-subject-lessons` to explore entire units related to the query topic
   - Use `get-lessons-summary` to read lesson content and understand what each lesson actually covers
   - Find lessons that are **qualitatively better matches** for what the query is testing, even if they don't rank in the top results

**Goal**: Find the lessons that best match what the query should return, not just what currently ranks highest. This ensures benchmarks push the system to improve rather than just tuning tests to current performance.

### Step 4: Update Ground Truth Files

Based on evidence from steps 2-3:

- **Fix queries** if they lack differentiation power (remove redundant terms, improve specificity)
- **Update `expectedRelevance`** with **qualitatively best matches** from curriculum exploration, not just top-ranked results (ensure relevance scores 1-3 are appropriate)
- **Update `description`** to accurately reflect what the test proves
- **Update TSDoc comment** with review date and rationale

### Step 5: Validate After All Categories Complete

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject art --phase secondary --verbose
```

## Quality Gates (After Validation)

Run from repo root, one at a time, analyze all results before fixing:

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

## Progress Tracking

After successful completion:

1. Update [`.agent/plans/semantic-search/active/ground-truth-review-checklist.md`](.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

   - Mark art/secondary section complete with all 4 categories checked
   - Update progress counter: "2/30 subject-phases complete (8/120 ground truths)"
   - Update "Next Session" to citizenship/secondary

2. Update [`.agent/prompts/semantic-search/semantic-search.prompt.md`](.agent/prompts/semantic-search/semantic-search.prompt.md) if needed:

   - Update progress: "2/30 subject-phases complete (8/120 ground truths)"
   - Update "Next Session" to citizenship/secondary

## Success Criteria

After completing art/secondary:

- All 4 categories have queries with genuine differentiation power within Art + Secondary context
- All queries pass `pnpm ground-truth:validate`
- Benchmark shows meaningful results (not all 0.000 or all 1.000)
- All quality gates pass
- Checklist updated to show art/secondary complete
- Progress tracking updated (2/30 subject-phases, 8/120 ground truths)

## Notes

- **Dual exploration requirement**: Must explore BOTH top search results AND curriculum data via MCP tools. Do not just accept top-ranked results—find qualitatively better matches to ensure benchmarks push the system to improve.
- **natural-expression** category: These queries require LLM interpretation we don't support yet. Review anyway to ensure query and expected results are sensible for future LLM support.
- **MCP dependency**: Review process requires MCP server availability. Do not proceed with guesswork if MCP is unavailable.
- **Evidence-based updates**: All changes must be based on evidence from gt-review output AND curriculum data exploration via MCP tools, not assumptions or just top-ranked results.
