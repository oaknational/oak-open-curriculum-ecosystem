---
name: ground-truth-session-1
overview: Review and correct the first subject/phase ground truths (art/primary) using the established three‑method evidence process, then validate and document outcomes so the current-state measurement is trustworthy.
todos:
  - id: recommit-foundations
    content: Re-read foundation docs at start and mid-session
    status: completed
  - id: art-primary-review
    content: Review art/primary ground truths with 3-method evidence
    status: completed
  - id: update-docs-tsdoc
    content: Update TSDoc, checklist, and guide as warranted
    status: completed
  - id: validate-benchmark
    content: Run validation and benchmark for art/primary
    status: completed
---

# Session 1 Ground Truth Review Plan

## Important distinction

**Ground truth review** (this task) is about **specification correctness** — ensuring ground truths accurately represent what search SHOULD return. This is fixing the answer key.

**Search optimisation** (a separate, later task) is about improving system behaviour to achieve better scores against the correct specification. That is tuning the student.

We do not conflate these. Ground truths must be correct before metrics are meaningful.

## Context and commitments

- Re‑read and explicitly re‑commit to the foundation docs at the start and mid‑session: [rules.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/directives-and-memory/rules.md), [testing-strategy.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/directives-and-memory/testing-strategy.md), and [schema-first-execution.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/directives-and-memory/schema-first-execution.md).
- Anchor the session in the current state and entry prompt: [semantic-search.prompt.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/prompts/semantic-search/semantic-search.prompt.md) and [current-state.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/plans/semantic-search/current-state.md).
- Use the operational checklist as the execution script, carry out all steps, do not skip any: [ground-truth-review-checklist.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/plans/semantic-search/active/ground-truth-review-checklist.md).
- Treat [GROUND-TRUTH-GUIDE.md](/Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) as the single source of truth; [GROUND-TRUTH-PROCESS.md](/Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) is superseded.

## Session scope and prerequisites

- Scope the first session to `art/primary` (four categories) under [ground-truth-review-checklist.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/plans/semantic-search/active/ground-truth-review-checklist.md).
- Confirm all three exploration methods are available before proceeding: search service (`pnpm gt-review`), direct Elasticsearch access via `.env.local`, and MCP server (`oak-local`). If any are unavailable, stop and report.
- Ensure bulk data is present for verification; use it to validate slugs and lesson content relevance.

## Review and correction workflow (art/primary)

For each category file in [ground-truth/art/primary/](/Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/primary/):

1. Apply the differentiation question and structure‑coverage requirement (queries must work without transcripts).
2. Run `pnpm gt-review --subject art --phase primary --category <category>` and record observed rankings.
3. Use direct ES diagnostics for relevance ambiguity (BM25 with fuzziness; structure field queries).
4. Use MCP tools and bulk data to identify qualitatively best matches — the lessons that SHOULD rank highly for this query.
5. Update query text, `expectedRelevance`, and description when better matches exist; update the TSDoc review note with date and rationale.
6. If any generated files are implicated (e.g., slug maps or schemas), inspect the generator sources under `ground-truths/generation/` before changing outputs.

### Category-specific guidance

- **precise-topic**: Tests basic retrieval with exact curriculum terms.
- **natural-expression**: Tests vocabulary bridging (may fail without LLM — still measure current state).
- **imprecise-input**: Tests **search resilience** — that typos, truncation, and messy input don't break search. The combined system (BM25 fuzziness + ELSER semantics + RRF) should still return relevant results despite imperfect input.
- **cross-topic**: Tests multi-concept intersection.

## Documentation and architectural records

- Maintain comprehensive TSDoc in each edited ground truth file, including review date and rationale; expand examples on any public interfaces touched.
- Update session documentation as needed, checklist progress in [ground-truth-review-checklist.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/plans/semantic-search/active/ground-truth-review-checklist.md) and, general updates in [prompt](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/prompts/semantic-search/semantic-search.prompt.md) if warranted, [GROUND-TRUTH-GUIDE.md](/Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md).
- If the review surfaces a systemic or architectural decision, draft an ADR in `docs/architecture/architectural-decisions/` (reference [ADR-085](/Users/jim/code/oak/oak-mcp-ecosystem/docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)).

## Validation and reporting

- Run validation for this subject/phase: `pnpm type-check`, `pnpm ground-truth:validate`, then `pnpm benchmark --subject art --phase primary --verbose`.
- Update baseline or reporting notes if required, always including the measurement-scope disclaimer from [ADR-085](/Users/jim/code/oak/oak-mcp-ecosystem/docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md).

---

## Session 1 Completed: 2026-01-14

### Results

| Category | MRR | Outcome |
|----------|-----|---------|
| precise-topic | 1.000 | Both expected slugs found. "Year 1" differentiates within Art Primary. |
| natural-expression | 1.000 | **FIXED**: Replaced `profile-portraits-in-art` with `analyse-a-facial-expression-through-drawing` (better match for "how to draw faces"). |
| imprecise-input | 0.500 | Typo doesn't break search. Both expected slugs found (#2, #8). System is resilient. |
| cross-topic | 1.000 | Rainforest + colour + texture intersection works perfectly. |

### Changes made

- `natural-expression.ts`: Updated score=2 slug from `profile-portraits-in-art` to `analyse-a-facial-expression-through-drawing`

### Key learning

Ground truths must represent what search SHOULD return (specification correctness), not what it currently returns. If better matches exist, the ground truth is wrong and must be corrected — regardless of MRR impact.

### Next session

**Target**: art/secondary (4 queries)
**Entry point**: [semantic-search.prompt.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/prompts/semantic-search/semantic-search.prompt.md)
