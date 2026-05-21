---
name: "Search-CLI Ingestion Pipeline Consolidation"
overview: "Strategic brief — collapse the search-cli dual-pipeline ingestion architecture (live-API path and bulk-data path) into one canonical schema-derived flow so identical (subject, sequence, key_stage) docs cannot diverge between paths."
status: future
lane: future
collection: architecture-and-infrastructure
related:
  - "../../semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md"
  - "../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md"
---

# Search-CLI Ingestion Pipeline Consolidation

**Last Updated**: 2026-05-21
**Status**: Strategic brief — not yet executable
**Lane**: `future/`
**Authors**: Opalescent Twinkling Supernova (initial draft post `5613eee4`)

> Strategic note: this `future/` plan keeps implementation-shape detail for transfer accuracy. Treat the specific code sites and proposed boundaries as load-bearing analysis, but execution decisions are finalised only when the plan is promoted to `current/`/`active/`.

---

## Problem and Intent

`apps/oak-search-cli` runs two distinct ingestion pipelines that both write to the same Elasticsearch indices (`oak_lessons`, `oak_units`, `oak_unit_rollup`, `oak_sequences`, `oak_sequence_facets`):

1. **Bulk pipeline** — `bulk-ingestion-phases.ts` → `bulk-sequence-transformer.ts` / `bulk-lesson-transformer.ts` / `bulk-rollup-builder.ts`. Reads pre-downloaded bulk JSON files (`bulk-downloads/*.json`) against the bulk schema (`bulk-downloads/schema.json` → `packages/sdks/oak-sdk-codegen/src/types/generated/bulk/bulk-schemas.ts`). Documented as "the bulk-first pipeline produces the full rich semantic" (see `sequence-bulk-helpers.ts:73`). Owner's direction (2026-05-21): "bulk data is used for almost all of the search index construction, possibly all of it."
2. **Live-API pipeline** — `yield-curriculum-batches` → `buildOpsForPair` → `buildPairDocuments`. Fetches the Open Curriculum API directly and emits the same ES document classes. Until commit `5613eee4` this path also emitted `oak_sequence_facets` documents with a hardcoded `hasKs4Options: false` that contradicted the bulk-known truth.

Both paths emit documents under the same canonical doc-ids. Because they go through structurally separate code with structurally separate data inputs, they can — and have — produced contradicting documents for the same source data. This is a DRY / single-source-of-truth violation by construction.

`5613eee4` collapsed the immediate `oak_sequence_facets` contradiction by removing the live-API path's facet emission. The dual-pipeline architecture itself remains: the same divergence shape can re-emerge on `oak_lessons`, `oak_units`, `oak_unit_rollup`, and `oak_sequences` whenever the two pipelines disagree about field-level content.

The intent of this plan is to reduce the architecture to one canonical schema-derived ingestion flow so that *any* document written to a search index is produced by exactly one path, against exactly one schema-derived source of truth.

---

## End Goal, Mechanism, Means

**End goal**: Search index construction routes through a single canonical ingestion pipeline whose output is a deterministic function of the bulk schema (and any other schemas that contribute), with no parallel emission paths that can disagree.

**Mechanism**: Identify the canonical data plane (bulk, given the owner's direction and the existing "bulk-first" framing); model the live-API consumption (if any) as supplementary lookup against the bulk-loaded context, not as a parallel emitter; route every document-class emitter through one schema-derived transformer that consumes a single typed input shape.

**Means** (strategic moves; sequencing finalised at promotion):

1. Inventory every ES document class that has more than one emitter in `apps/oak-search-cli`, classify each emitter as bulk-derived / API-derived / hybrid-derived, and record the doc-id collision surface for each class.
2. Define the canonical emission path per document class, with an explicit rationale rooted in which schema carries the authoritative data for that class.
3. Remove non-canonical emitters with `replace-don't-bridge` discipline (no shims, no parallel-keep). Where a non-canonical emitter is load-bearing for a current operating mode that bulk cannot serve, surface the gap and resolve it before deletion — never bridge.
4. Route any genuinely required live-API enrichment (e.g. fields the bulk schema does not carry) through a typed enrichment seam that consumes pre-loaded bulk context, so live-API additions cannot contradict bulk-derived fields by construction.
5. Add an invariant test asserting that for any document-class doc-id, only one code path produces a writeable document. This is the runtime guard that prevents future regression of the dual-path shape.

---

## Domain Boundaries and Non-Goals

**In scope**:

- Ingestion code paths under `apps/oak-search-cli/src/`, specifically `src/lib/index-*` (live-API pipeline), `src/lib/indexing/bulk-ingestion-phases.ts` and adjacent (bulk pipeline), `src/adapters/bulk-*.ts`, `src/adapters/hybrid-data-source.ts`, `src/adapters/api-supplementation.ts`.
- The ES document classes themselves (`SearchUnitsIndexDoc`, `SearchLessonsIndexDoc`, `SearchUnitRollupIndexDoc`, `SearchSequenceIndexDoc`, `SearchSequenceFacetsIndexDoc`) only insofar as the emission topology touches them. Schema changes belong in the SDK; this plan does not redefine them.
- The relationship between the bulk schema (authoritative for content shape) and the OpenAPI schema (authoritative for response shape). Plan identifies which carries which fact and routes consumers accordingly.
- Tests that exercise the ingestion pipelines, including ingest-harness, hybrid-data-source, bulk-sequence-transformer, and the document-builder unit tests.
- ADR-080 (KS4 metadata denormalisation) updates to reflect the consolidated architecture; possibly a new ADR documenting the canonical ingestion topology.

**Out of scope**:

- Changing the ES document schemas themselves — those are schema-codegen concerns and belong in the SDK.
- Bulk schema → Zod codegen propagation of enum constraints (covered separately by [bulk-schema-driven-code-generation.md](../../semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md)).
- Search query / retrieval / facet behaviour. The retrieval SDK reads what ingestion writes; nothing changes there.
- Ingestion *into* bulk-downloads (i.e. the upstream system that produces bulk JSON files). That is owned upstream of this repo.
- Live-API consumer code paths outside the ingestion pipeline (MCP tools, search-cli read commands, etc.).
- Adding compatibility shims so the old dual-pipeline shape can coexist with the new single-pipeline shape during transition. Per `replace-don't-bridge`, this is prohibited.

---

## Dependencies and Sequencing Assumptions

| Dependency | Class | If absent |
|---|---|---|
| [bulk-schema-driven-code-generation.md](../../semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md) producing schema-derived enums on the generated bulk Zod schemas | **beneficial** | Plan can still consolidate paths against the current bulk schemas; without the enum tightening, the consolidated path still works but loses some type-level guard. Minimum shippable shape without it: consolidate against `z.string()`-typed bulk schemas; tighten when the enum-propagation plan lands. |
| Verified factual claim that bulk is the primary index-construction source (owner-stated 2026-05-21) | **blocking** | Without confirmation that bulk should be canonical, the consolidation direction is undecided. The owner's stated direction is the answer here; this dependency is satisfied at plan time. |
| ADR-140 (search-ingestion SDK boundary) — names the boundary between search-cli (CLI surface) and any extracted ingestion SDK | **beneficial** | Consolidation can happen inside `apps/oak-search-cli/` without extraction; extraction is a follow-on. Minimum shippable shape without extraction: consolidate the pipelines in-place; extract later when the boundary stabilises. |
| `5613eee4` (this commit) — removes the immediate `has_ks4_options` contradiction and the dead `Ks4Option` plumbing | **already landed** | Provides the cleanup baseline this plan builds on. |

**Sequencing**: pre-execution inventory (Means 1) is the gating step; it determines whether the consolidation is one tranche or several. Means 2–5 sequence behind it; the order among 3/4 depends on which document classes have the most coupling at the seam.

---

## Strategic Acceptance Criteria and Success Signals

**Outcome-level criteria** (measured at plan completion, not activity-level):

1. For every ES document class written by `apps/oak-search-cli/`, exactly one code path emits documents to that index. Verified by static analysis (grep for emitters; per-index emitter count = 1).
2. The chosen canonical emitter for each class is documented in code at the emitter site, with reference to the schema that carries the authoritative input.
3. No hardcoded values substitute for schema-derived fields in any emitter. Specifically: no `: false` / `: []` / `: null` literals stand in for a value that should come from data. This is the schema-first invariant the v0.7.0 work surfaced and `5613eee4` corrected for the single known site.
4. The invariant test asserting "one emitter per doc-id" passes. This is the regression guard.
5. ADR-080 is updated (or a new ADR lands) describing the consolidated topology, replacing any references to the previous dual-pipeline shape.
6. All quality gates remain green throughout the consolidation — at every commit, not only at completion.

**Success signals**:

- The class of bugs where "field X disagrees between bulk-indexed and API-indexed documents for the same source key" becomes structurally impossible, not merely currently absent.
- Future v0.x.0 upstream API alignments touch only one consumer code path, not two.
- The next agent inheriting this code can answer "which path emits docs to oak_lessons?" by reading a single emitter file plus a one-line docstring, rather than tracing two parallel pipelines.

---

## Risks and Unknowns

| Risk / Unknown | Likelihood | Impact | Mitigation strategy |
|---|---|---|---|
| The live-API ingestion mode is required for a real operating scenario that the bulk pipeline cannot serve (e.g. sandbox ingestion, partial subject re-index, delta updates). | medium | high — would invalidate "delete the API pipeline" as a move and require the enrichment-seam pattern instead. | Means 1 (inventory) must include operating-mode mapping: which mode runs which pipeline, and why. If a mode genuinely cannot be served by bulk, the consolidated architecture preserves it via the typed enrichment seam, not via parallel emission. |
| The bulk pipeline currently emits incomplete coverage for some document classes (i.e. produces fewer docs than the live-API path for the same input), and the gap was historically filled by live-API emission. | medium | medium — gap surfaces during cutover as missing docs. | Pre-cutover diff: run both pipelines against the same source data, compare emitted doc sets, characterise gaps, decide whether to extend bulk or accept the reduced coverage. Surface gaps to owner before merging. |
| `hybrid-data-source.ts` is a third pipeline shape (bulk reads + live-API supplementation). Whether it is currently used in any operating mode, and whether it survives consolidation, is not yet inventoried. | medium | medium | Means 1 inventory explicitly classifies `hybrid-data-source.ts` as live-API / bulk / hybrid; the canonical-path decision per class names whether hybrid is the canonical shape, an extension of bulk, or a deprecated mode. |
| Removing the live-API pipeline's unit/lesson/rollup emission cascades into significant test deletions; some of those tests may be the only behavioural assertions for code that legitimately survives. | medium | low–medium | TDD cycle discipline (per `tdd-as-design.md`): every test deletion is paired with a recorded justification (test was redundant with bulk-path assertions / test was assertion of behaviour that no longer exists / test was integration of removed surface). The disposition ledger from PDR-018 §"Apply all of X" applies. |
| `ks4-context-builder.ts` / `ks4-context-types.ts` (the remaining live-API supplementation surface after `5613eee4`) currently builds `UnitContext` from API responses. If the bulk path doesn't populate `UnitContext`, hybrid mode loses its enrichment plumbing. | low–medium | medium | Inventory step 1 maps every `UnitContext` producer and consumer. Decision: either bulk also produces `UnitContext`, or the consolidated path doesn't need `UnitContext` because the bulk-emitted docs are already complete. |
| `apps/oak-search-cli/ground-truths/generated/` files (visible in dirty state during the v0.7.0 work, provenance unclear at that time) may be affected by ingestion changes. | low | low | Inventory step audits ground-truth generation against the consolidated path and resolves any drift. |

---

## Promotion Trigger into `current/`

Promote when **all three** of the following hold:

1. The inventory step (Means 1) has been completed in a separate research pass (notebook / scratchpad acceptable; the inventory is a known artefact before this plan promotes).
2. The bulk-schema-driven enum-propagation plan has either landed or been classified as a `beneficial` (not blocking) prerequisite by the owner. Without that classification, this plan promotes against `z.string()` bulk schemas and accepts the type-level looseness as a known interim.
3. Owner authorisation for the consolidation direction: the bulk pipeline is canonical for the document classes covered by this plan, and parallel emission paths will be removed via `replace-don't-bridge` not bridged.

Until all three fire, this plan stays in `future/`. The trigger is not a date; it is a state.

---

## Plan-Body First-Principles Check (Pre-Promotion)

Per [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):

- **Shape clause**: The plan's shape (inventory → canonical-path decision per class → delete-not-bridge → enrichment seam where required) is mandated by `replace-don't-bridge`, `single source of truth`, and the schema-first cardinal rule. It is not a shape invented for this instance.
- **Landing-path clause**: The landing path is `apps/oak-search-cli/`. No cross-workspace surgery is required; the consolidation is contained within one workspace plus the search SDK / sdk-codegen consumers if the inventory uncovers a generator-level concern.
- **Vendor-literal clause**: The only vendor-literal touchpoint is the bulk schema (`bulk-downloads/schema.json`) and the upstream OpenAPI schema. Both already flow through `pnpm sdk-codegen`; this plan does not introduce new vendor-literal surfaces.

The check fires at promotion time: before any executable plan branches off `current/`, the inventory step must produce the per-class canonical decisions and the question *"could it be simpler?"* must be answered for each.

---

## Foundation Alignment

- [`principles.md`](../../../directives/principles.md) §"Strict and Complete" + §"Architectural Excellence" + §"Replace, don't bridge" — this plan operationalises all three.
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md) §"Cardinal Intent" — the consolidation is a direct expression of "every byte of runtime behaviour must be driven by generated artefacts that flow directly from the schema". Two paths producing the same docs from different schema reads violates that intent.
- [ADR-080](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) — describes the current denormalisation strategy; will need an update once the canonical path is decided.
- [ADR-117](../../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md) — this plan follows the strategic-brief shape mandated for `future/` lane.

---

## Non-Goals (YAGNI)

- ❌ Producing a step-by-step refactor sequence in this strategic brief. Cycle-level work belongs in the executable plan that branches off this brief at promotion.
- ❌ Choosing the consolidated direction without the inventory step. The direction is owner-stated (bulk is canonical) but the per-document-class application requires evidence the inventory will produce.
- ❌ Touching MCP-side consumers, search-quality benchmarks, or retrieval SDK code. This plan is ingestion-shape only.
- ❌ Introducing a feature flag, environment toggle, or runtime mode switch that lets the dual pipeline survive "for now". The replace-don't-bridge rule applies.
- ❌ Solving the bulk-schema enum-propagation generator concern (covered by [bulk-schema-driven-code-generation.md](../../semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md)).
- ❌ Extracting the ingestion code into a separate SDK in this work. ADR-140 covers that; if the inventory shows extraction would simplify the consolidation, the extraction plan is a sibling, not part of this one.

---

## Cross-References

- [`5613eee4` commit](.) — removes the immediate `has_ks4_options` dual-path contradiction; sets the baseline for this plan.
- [bulk-schema-driven-code-generation.md](../../semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md) — sibling future plan; closes the bulk Zod-enum generator gap.
- [oak-search-cli-command-surface-rationalisation.plan.md](./oak-search-cli-command-surface-rationalisation.plan.md) — sibling future plan; touches the same workspace at a different layer (CLI surface).
- [ADR-080](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) — current denormalisation doctrine, will need update.
- [ADR-140](../../../../docs/architecture/architectural-decisions/140-search-ingestion-sdk-boundary.md) — search-ingestion SDK boundary; classifies as beneficial dependency.
- [`principles.md`](../../../directives/principles.md), [`schema-first-execution.md`](../../../directives/schema-first-execution.md) — foundation directives.
