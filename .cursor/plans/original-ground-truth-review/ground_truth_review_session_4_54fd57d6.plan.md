---
name: Ground Truth Review Session 4
overview: Review and validate computing/primary ground truth queries (4 categories) to ensure each has differentiation power within the Computing + Primary context. Complete validation and quality gates, then update progress tracking.
todos:
  - id: verify-mcp-server
    content: Verify MCP server (oak-local) is available for exploration during review
    status: completed
  - id: computing-primary-precise
    content: "Review computing/primary precise-topic: evaluate if 'Year 1' is redundant with primary filter, run gt-review, explore via MCP, fix if needed"
    status: completed
  - id: computing-primary-natural
    content: "Review computing/primary natural-expression: verify query and expected slugs are sensible for future LLM support"
    status: completed
  - id: computing-primary-imprecise
    content: "Review computing/primary imprecise-input: run ES diagnostics to verify typo 'internat' is essential (not bypassable by other terms)"
    status: completed
  - id: computing-primary-cross
    content: "Review computing/primary cross-topic: explore curriculum for qualitatively best matches for programming+sequences intersection"
    status: completed
  - id: validate-computing-primary
    content: Run type-check, ground-truth:validate, benchmark for computing/primary after all categories complete
    status: completed
  - id: quality-gates-session4
    content: Run full quality gate suite one at a time, analyse all before fixing
    status: completed
  - id: update-checklist-computing-primary
    content: "Update checklist to mark computing/primary complete (progress: 4/30 subject-phases, 16/120 ground truths)"
    status: completed
---

# Ground Truth Review: Session 4 - Computing/Primary

## Objective

Review all 4 ground truth categories for computing/primary, ensuring each query has genuine differentiation power when filters (subject=Computing, phase=Primary) are already applied. Complete validation and quality gates.

## Current State

- **Progress**: 3/30 subject-phases complete (art/primary, art/secondary, citizenship/secondary)
- **Target**: computing/primary (4 queries across 4 categories)
- **Files to review**:
  - [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/precise-topic.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/precise-topic.ts)
  - [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/natural-expression.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/natural-expression.ts)
  - [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/imprecise-input.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/imprecise-input.ts)
  - [`apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/cross-topic.ts`](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/cross-topic.ts)

## Current Queries and Concerns

| Category | Query | MRR | Review Focus |

|----------|-------|-----|--------------|

| precise-topic | "digital painting Year 1" | 1.000 | "Year 1" may be redundant with primary filter |

| natural-expression | "staying safe on computers" | 0.167 | Expected low (no LLM) - verify query/slugs sensible |

| imprecise-input | "how does the internat work" | 0.333 | Verify typo "internat" is essential, not bypassable |

| cross-topic | "programming and code sequences" | 0.333 | Explore curriculum for better matches |

## Review Process

### Step 1: Verify MCP Server Availability

Test that `oak-local` MCP server is available. If unavailable, STOP and wait.

### Step 2: Review Each Category

For each category, follow this process:

#### 2a. Evaluate Query Differentiation

Ask: **"What does matching specific results for this query tell us, given we're already filtering to Computing + Primary?"**

Red flags:

- "Year 1" in precise-topic duplicates phase filter context
- Other terms in imprecise-input that could bypass the typo

#### 2b. Run gt-review CLI

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm gt-review --subject computing --phase primary --category [category]
```

#### 2c. Explore Curriculum via MCP Tools

Use `get-search-lessons`, `get-key-stages-subject-lessons`, `get-lessons-summary` to:

- Find qualitatively best matches (not just top-ranked results)
- Verify expected slugs exist and are appropriate
- Discover better alternatives if current slugs are suboptimal

#### 2d. For imprecise-input: Run ES Diagnostics

Based on Session 3 learnings, verify typo is essential:

1. Test "internat" with fuzziness - should return results
2. Test "internat" without fuzziness - should return 0
3. Test "how does the... work" without typo term - if results found, typo is bypassable

### Step 3: Update Ground Truth Files

Based on evidence:

- Fix queries lacking differentiation power
- Update `expectedRelevance` with qualitatively best matches
- Update `description` to explain what test proves
- Update TSDoc comment with review date

### Step 4: Validate

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject computing --phase primary --verbose
```

### Step 5: Quality Gates (from repo root)

Run one at a time, analyse all before fixing:

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

- Mark computing/primary complete with all 4 categories checked
- Update progress: "4/30 subject-phases complete (16/120 ground truths)"
- Set next session to computing/secondary

Update [`semantic-search.prompt.md`](.agent/prompts/semantic-search/semantic-search.prompt.md):

- Update progress and next session

## Success Criteria

- All 4 categories have queries with genuine differentiation power within Computing + Primary context
- imprecise-input typo verified as essential (not bypassable)
- All validation passes
- Meaningful benchmark results (not all 0.000 or all 1.000)
- All quality gates pass
- Checklist updated (4/30 subject-phases, 16/120 ground truths)

## Key Learnings to Apply

From Sessions 1-3:

1. **Differentiation**: Query must add value beyond subject+phase filter
2. **Imprecise-input**: Typo MUST be essential - verify via ES diagnostics
3. **Curriculum exploration**: Find qualitatively best matches, not just top results
4. **MCP dependency**: Do not proceed without MCP server availability
