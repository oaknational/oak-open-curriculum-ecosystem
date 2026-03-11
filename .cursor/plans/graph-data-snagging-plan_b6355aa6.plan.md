---
name: graph-data-snagging-plan
overview: Investigate and document prerequisite/thread graph anomalies end-to-end, classify each issue by source layer, and define a queued executable snagging plan for fixing data-integrity defects at the correct boundary.
todos:
  - id: collect-evidence
    content: Capture deterministic evidence for each anomaly across bulk data, extractor assumptions, generator outputs, and MCP pass-through behaviour.
    status: completed
  - id: author-plan-file
    content: Author queued executable snagging plan in sdk-and-mcp-enhancements/current using RED/GREEN/REFACTOR structure and explicit acceptance criteria.
    status: completed
  - id: review-plan-barney
    content: Run architecture-reviewer-barney on draft plan and integrate simplification and boundary feedback.
    status: completed
  - id: review-plan-docs
    content: Run docs-adr-reviewer on draft plan and integrate evidence/ADR/documentation propagation feedback.
    status: completed
  - id: finalise-plan
    content: Produce final plan content with issue taxonomy, deterministic validations, risk controls, and quality-gate sequence.
    status: completed
isProject: false
---

# Graph Data Snagging Plan (Queued)

## Goal

Create a new queued snagging plan for `sdk-and-mcp-enhancements` that classifies each confirmed graph anomaly as **bulk data defect**, **extraction/generation defect**, or **MCP presentation defect**, with deterministic evidence and fix-ready execution phases.

## Plan Location and Lifecycle

- Collection: `.agent/plans/sdk-and-mcp-enhancements/`
- Lifecycle lane: `current/` (queued executable)
- Proposed file: `.agent/plans/sdk-and-mcp-enhancements/current/graph-data-integrity-snagging.execution.plan.md`
- Relationship to existing work: sibling follow-on to `.agent/plans/sdk-and-mcp-enhancements/active/oak-preview-mcp-snagging.execution.plan.md` (this plan covers newly evidenced graph-integrity defects in generated vocab outputs)

## Verified Findings (Evidence-Backed)

### Issue A — Duplicate unit records in bulk data (Data Layer)

- Source file: `apps/oak-search-cli/bulk-downloads/maths-secondary.json`
- Evidence: this is the only bulk file with duplicated `sequence[].unitSlug` entries; 30 extra duplicate unit records were detected.
- Direct examples include repeated `algebraic-fractions`, `algebraic-manipulation`, and `simultaneous-equations-2-variables`.
- Classification: **bulk data defect** (upstream/exported payload shape).

### Issue B — Thread ordering signal misuse in extractor (Extraction Layer)

- Source code: `packages/sdks/oak-sdk-codegen/src/bulk/extractors/thread-extractor.ts` and `packages/sdks/oak-sdk-codegen/vocab-gen/extractors/thread-extractor.ts`
- Current behaviour: thread units are sorted by `unit.threads[].order`.
- Evidence from dataset: many threads have a single tied order value for all entries; therefore this field is not a reliable progression ordering signal.
- Classification: **extraction logic defect** (assumption mismatch between extractor logic and real payload characteristics).

### Issue C — Duplicate/self-loop propagation in generated graphs (Generation Layer)

- Source code: `packages/sdks/oak-sdk-codegen/src/bulk/generators/thread-progression-generator.ts`, `packages/sdks/oak-sdk-codegen/src/bulk/generators/prerequisite-graph-generator.ts`, and matching `vocab-gen/` counterparts.
- Generated evidence:
  - `packages/sdks/oak-sdk-codegen/src/generated/vocab/thread-progression-data.ts` includes duplicate units in thread arrays (e.g. `algebra`).
  - `packages/sdks/oak-sdk-codegen/src/generated/vocab/prerequisite-graph-data.ts` includes self-loops (`from === to`), back-edges induced by duplicates, and repeated edges.
  - `packages/sdks/oak-sdk-codegen/src/generated/vocab/prerequisite-graph-data.ts` node payloads include repeated `priorKnowledge` and duplicate `threadSlugs`.
  - `packages/sdks/oak-sdk-codegen/src/generated/vocab/nc-coverage-graph-data.ts` also shows repeated unit-derived entries, so blast radius is broader than two graphs.
- Classification: **generation hardening defect** (lack of dedupe/invariant enforcement).

### Issue D — MCP layer behaviour (Presentation Layer)

- Source code: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts` and `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts`
- Behaviour: these tools directly return generated vocab data; no additional dedupe/rewrite logic.
- Classification: **not an MCP defect**; MCP is pass-through by design and simply surfaces upstream/generated artefacts.

## Deterministic Validation Baseline (to include in the executable plan)

- Bulk duplicate-unit audit: prove duplicate `sequence[].unitSlug` records in `maths-secondary.json`.
- Thread progression integrity audit: count threads containing duplicate unit slugs.
- Prerequisite edge integrity audit: count self-loops (`from === to`) and duplicate edges.
- Node payload integrity audit: detect duplicate `priorKnowledge` and `threadSlugs` values per unit.
- Scope audit: confirm affected graph outputs (`thread-progression`, `prerequisite-graph`, `nc-coverage`).

## Executable Workstream Shape (RED/GREEN/REFACTOR)

### Phase 0 — Verify and lock taxonomy (RED)

- Add failing tests proving each defect at the correct layer.
- Add blast-radius tests for all affected generators, not only one output file.
- Acceptance criteria:
  - Tests fail on current behaviour for duplicates/self-loops/order misuse.
  - Each failing test maps to one issue classification above.

### Phase 1 — Fix extraction ordering contract (GREEN)

- Replace unreliable progression ordering assumption with a deterministic, documented ordering source.
- Ensure determinism does not depend on incidental file-system order.
- Apply changes in both duplicated trees (`src/bulk/`**and `vocab-gen/`**) in lockstep.
- Acceptance criteria:
  - Thread progression tests pass with stable ordering under tied thread-order data.
  - No divergence between duplicated generator/extractor surfaces.

### Phase 2 — Enforce graph integrity invariants (GREEN)

- Dedupe unit membership within thread outputs.
- Prevent self-loop and duplicate edge emission in prerequisite graph generation.
- Dedupe node payload arrays derived from duplicate records.
- Include `nc-coverage` integrity handling in scope (or explicit documented defer decision with rationale).
- Acceptance criteria:
  - No thread contains repeated `unitSlug`.
  - No prerequisite edge has `from === to`.
  - Duplicate prerequisite edges are eliminated.
  - Node arrays (`priorKnowledge`, `threadSlugs`) contain unique values.

### Phase 3 — Refactor and propagate docs (REFACTOR)

- Update documentation surfaces with the final issue taxonomy and decisions.
- Update `apps/oak-search-cli/bulk-downloads/DATA-VARIANCES.md` to distinguish lesson-level known variances vs newly confirmed unit-level duplication effects.
- Record ADR touchpoint decision (likely ADR-110 review for ordering semantics; update only if behaviour contract changes).
- Acceptance criteria:
  - Documentation changes clearly separate data defect vs extraction defect vs presentation non-defect.
  - Deterministic validation commands and expected outcomes are documented.

## Quality Gates (for eventual execution)

- `pnpm vocab-gen`
- `pnpm build`
- `pnpm type-check`
- `pnpm lint:fix`
- `pnpm test`
- targeted MCP verification for pass-through behaviour after regeneration

## Risks and Mitigations

- Risk: fixing only one generator tree causes drift.
  - Mitigation: mandatory lockstep updates/tests for `src/bulk/**` and `vocab-gen/**`.
- Risk: over-correcting in MCP layer violates boundary.
  - Mitigation: keep all data repair in `oak-sdk-codegen`; MCP remains pass-through.
- Risk: unresolved ordering contract yields hidden nondeterminism.
  - Mitigation: add determinism tests with reordered inputs and tied-order data.

## Reviewer Feedback Integrated

- Barney: expanded blast radius to include node payload duplication and `nc-coverage`, enforced lockstep dual-tree updates, and tightened ordering-contract acceptance criteria.
- Docs/ADR reviewer: added explicit issue taxonomy wording, deterministic evidence requirements, ADR/document propagation points, and clarified MCP as scope boundary rather than defect locus.
