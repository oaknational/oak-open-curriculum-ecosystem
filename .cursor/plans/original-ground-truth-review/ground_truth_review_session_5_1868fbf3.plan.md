---
name: Ground Truth Review Session 5
overview: Review and validate computing/secondary ground truth queries (4 categories) to ensure each has differentiation power within the Computing + Secondary context. Fix current-state.md which is outdated, then complete validation and quality gates.
todos:
  - id: fix-current-state
    content: "Update current-state.md: fix progress (4/30) and next session (computing/secondary)"
    status: completed
  - id: verify-mcp-server
    content: Verify MCP server (oak-local) is available for exploration during review
    status: completed
  - id: computing-secondary-precise
    content: "Review computing/secondary precise-topic: run gt-review, explore via MCP, verify expected slugs cover query intent"
    status: completed
  - id: computing-secondary-natural
    content: "Review computing/secondary natural-expression: verify query and expected slugs are sensible for future LLM support"
    status: completed
  - id: computing-secondary-imprecise
    content: "Review computing/secondary imprecise-input: run ES diagnostics to verify typo is essential (not bypassable by fundamentals/basics)"
    status: completed
  - id: computing-secondary-cross
    content: "Review computing/secondary cross-topic: verify expected slugs cover both programming and data structures concepts"
    status: completed
  - id: validate-computing-secondary
    content: Run type-check, ground-truth:validate, benchmark for computing/secondary after all categories complete
    status: completed
  - id: quality-gates-session5
    content: Run full quality gate suite one at a time, analyse all before fixing
    status: completed
  - id: update-progress-tracking
    content: "Update checklist and prompt to mark computing/secondary complete (progress: 5/30 subject-phases, 20/120 ground truths)"
    status: completed
---

# Ground Truth Review: Session 5 - Computing/Secondary

## Objective

Review all 4 ground truth categories for computing/secondary, ensuring each query has genuine differentiation power when filters (subject=Computing, phase=Secondary) are already applied. Update outdated documentation.

## Pre-Session: Fix Outdated Documentation

The [`current-state.md`](.agent/plans/semantic-search/current-state.md) file is outdated:

- Shows "3/30 subject-phases complete" (should be 4/30)
- Shows "Next Session: computing/primary" (should be computing/secondary)

Update this file first to maintain consistency.

## Current Queries and Review Focus

| Category | Query | MRR | Review Focus |

|----------|-------|-----|--------------|

| precise-topic | "Python programming lists data structures projects" | 1.000 | Verify expected slugs cover query intent |

| natural-expression | "coding for beginners programming basics introduction" | 0.500 | Verify query/slugs sensible for future LLM |

| imprecise-input | "how the internat works fundamentals basics" | 0.333 | **Critical**: "fundamentals basics" may bypass typo |

| cross-topic | "programming with data structures loops" | 1.000 | Verify intersection coverage |

## Files to Review

- [`precise-topic.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/secondary/precise-topic.ts)
- [`natural-expression.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/secondary/natural-expression.ts)
- [`imprecise-input.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/secondary/imprecise-input.ts)
- [`cross-topic.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/secondary/cross-topic.ts)

## Review Process

### Step 1: Verify MCP Server Availability

Test that `oak-local` MCP server is available. **If unavailable, STOP and wait.**

### Step 2: Review Each Category

For each category:

1. **Evaluate Query Differentiation**: Ask "What does matching specific results for this query tell us, given we're already filtering to Computing + Secondary?"
2. **Run gt-review CLI**: `pnpm gt-review --subject computing --phase secondary --category [category]`
3. **Explore Curriculum via MCP Tools**: Use `get-search-lessons`, `get-key-stages-subject-lessons`, `get-lessons-summary`
4. **For imprecise-input: Run ES Diagnostics** (see below)

### Step 2d: ES Diagnostics for imprecise-input

**Critical concern**: Query "how the internat works fundamentals basics" has additional terms that may bypass the typo.

Verify typo is essential:

1. Test "internat" with fuzziness → should return internet-related results
2. Test "internat" without fuzziness → should return 0 results
3. Test "how works fundamentals basics" (without typo term) → if expected slugs found, typo is bypassable and query needs redesign

### Step 3: Update Ground Truth Files

Based on evidence:

- Fix queries lacking differentiation power (especially imprecise-input if bypassable)
- Update `expectedRelevance` with qualitatively best matches from curriculum exploration
- Update `description` to explain what test proves
- Update TSDoc comment with review date (2026-01-14)

### Step 4: Validate

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject computing --phase secondary --verbose
```

### Step 5: Quality Gates

Run one at a time from repo root:

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

### Step 6: Update Progress Tracking

Update [`ground-truth-review-checklist.md`](.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

- Mark computing/secondary complete with all 4 categories checked
- Update progress: "5/30 subject-phases complete (20/120 ground truths)"
- Set next session to cooking-nutrition/primary

Update [`semantic-search.prompt.md`](.agent/prompts/semantic-search/semantic-search.prompt.md):

- Update progress and next session

## Key Learnings to Apply

From Sessions 1-4:

1. **Differentiation**: Query must add value beyond subject+phase filter
2. **Imprecise-input**: Typo MUST be essential - verify via ES diagnostics
3. **Expected slugs must match query intent**: Replace slugs that don't cover the query topic
4. **Curriculum exploration**: Find qualitatively best matches, not just top results
5. **MCP dependency**: Do not proceed without MCP server availability

## Success Criteria

- All 4 categories have queries with genuine differentiation power within Computing + Secondary context
- imprecise-input typo verified as essential (or redesigned if bypassable)
- All validation passes
- Meaningful benchmark results
- All quality gates pass
- Checklist updated (5/30 subject-phases, 20/120 ground truths)
- `current-state.md` updated to reflect accurate progress
