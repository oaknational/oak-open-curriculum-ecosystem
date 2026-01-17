---
name: Ground Truth Review
overview: Systematically review and fix ground truth queries for 1-3 subject-phases, ensuring each query has differentiation power when filters are applied. This session will complete art/primary and potentially art/secondary, following the linear checklist.
todos:
  - id: reread-foundations
    content: Re-read rules.md, testing-strategy.md, schema-first-execution.md
    status: completed
  - id: art-primary-precise
    content: "Review art/primary precise-topic: evaluate differentiation, run gt-review, explore via MCP, fix if needed"
    status: completed
  - id: art-primary-natural
    content: "Review art/primary natural-expression: evaluate differentiation, run gt-review, explore via MCP, fix if needed"
    status: completed
  - id: art-primary-imprecise
    content: "Review art/primary imprecise-input: FIX 'painting techneeques primary' redundancy"
    status: completed
  - id: art-primary-cross
    content: "Review art/primary cross-topic: evaluate differentiation, run gt-review, explore via MCP, fix if needed"
    status: completed
  - id: validate-art-primary
    content: Run type-check, ground-truth:validate, benchmark for art/primary
    status: completed
  - id: quality-gates
    content: Run full quality gate suite one at a time, analyse all before fixing
    status: completed
  - id: update-checklist
    content: Update ground-truth-review-checklist.md to mark art/primary complete
    status: completed
---

# Ground Truth Review: Session 1

## Objective

Fix ground truths that lack differentiation power when filters (subject + phase) are already applied. Complete 1-3 subject-phases with full validation.

## The Core Problem

Queries like `"fench vocabulary primary"` or `"painting techneeques primary"` are meaningless tests because:

- We're already filtering to the subject (French/Art)
- We're already filtering to the phase (primary)
- The words "vocabulary primary" or "techneeques primary" add no differentiation

**The Test**: For each query, ask: "What does matching specific results for this query tell us, given we're already filtering to [subject] + [phase]?"

## Foundation Documents (Re-read Before Each Subject-Phase)

Before starting work, re-read:

- [rules.md](.agent/directives-and-memory/rules.md) - TDD, fail fast, no shortcuts
- [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md) - Test real behaviour
- [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

## Process Per Ground Truth

### Step 1: Evaluate Query Usefulness

Ask: "What does this query differentiate within [subject] + [phase]?"

**Good differentiation** (query adds value):

- `"drawing marks Year 1"` - "Year 1" narrows within Art Primary
- `"rainforest colour texture"` - specific theme intersection

**Bad differentiation** (redundant with filters):

- `"painting techneeques primary"` - "primary" already filtered
- `"fench vocabulary"` - when already in French

### Step 2: Run Query via gt-review

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm gt-review --subject art --phase primary --category precise-topic
```

### Step 3: Explore with MCP Tools

Use `get-lessons-summary` to understand what lessons contain, and `search` to find potentially better matches.

### Step 4: Update Ground Truth File

Based on evidence from steps 2-3:

- Fix redundant queries (remove filter-duplicating terms)
- Update expectedRelevance with verified best results
- Update description to reflect what the test actually proves

### Step 5: Validate (After Each Subject-Phase)

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject art --phase primary --verbose
```

## Session 1 Target: art/primary

Files to review:

- [precise-topic.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/primary/precise-topic.ts)
- [natural-expression.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/primary/natural-expression.ts)
- [imprecise-input.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/primary/imprecise-input.ts) - **Known issue**: "primary" is redundant
- [cross-topic.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/primary/cross-topic.ts)

### Identified Issues (Pre-Review)

| File | Current Query | Issue | Suggested Fix |

|------|--------------|-------|---------------|

| imprecise-input.ts | `"painting techneeques primary"` | "primary" redundant | `"painting techneeques"` or `"techneeques for portraits"` |

## Quality Gates (After Each Subject-Phase)

Run one at a time, analyse all results before fixing:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
# Note: E2E tests not required for ground truth content changes
```

## Documentation Requirements

- Update TSDoc comments with curation date and rationale
- Update checklist progress in [ground-truth-review-checklist.md](.agent/plans/semantic-search/active/ground-truth-review-checklist.md)
- Document any architectural insights as ADRs if appropriate

## If MCP Server Unavailable

**STOP immediately**. The review process requires examining lesson content via MCP tools to determine if expected slugs are appropriate. Do not proceed with guesswork.

## Success Criteria

After completing art/primary:

- All 4 categories have queries with genuine differentiation power
- All queries pass `pnpm ground-truth:validate`
- Benchmark shows meaningful results (not all 0.000 or all 1.000)
- Checklist updated to show art/primary complete
