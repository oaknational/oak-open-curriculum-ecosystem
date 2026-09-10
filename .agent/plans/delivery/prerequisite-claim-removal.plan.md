---
id: prerequisite-claim-removal
node_type: delivery
name: "Prerequisite claim removal"
overview: >-
  Remove the fabricated prerequisite structure from the graph corpus and
  every served surface that asserts it, with a recurrence guard.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: honest-curriculum-structure
impact_areas:
  - served-surface
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-31
---

# Prerequisite claim removal

## Goal

The service stops claiming to have unit-to-unit prerequisite data. Today
(verified first-hand 2026-08-31) the corpus generator mints
`prerequisiteFor` edges from consecutive thread-membership pairs sorted
by year with a stated-arbitrary within-year tie-break
(`packages/sdks/oak-sdk-codegen/src/bulk/generators/graph-corpus-edges.ts`),
and the published `get-prior-knowledge-graph` tool
(`packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`)
describes those edges to assistants as "the units that are …
prerequisites of X". The authoritative bulk schema
(`additionalProperties: false`) publishes no unit-to-unit prerequisite
data in any form: `priorKnowledgeRequirements` is an array of plain
prose statements with no reference fields. The served claim is
unsupported prerequisite semantics asserted over disclosed thread
adjacency — fabricated structure wearing Oak's name. When this lands,
that claim is gone from every published surface, in code and in prose,
and a recomputable guard prevents its recurrence.

## User groups and value

Consumers of the served surface (teachers via assistants, assistants,
agent developers) stop being misled. No new value is claimed by this
plan; removal of misleading content requires no user story (owner
ruling, 2026-08-31, this lane's session). The value routes to the
trustworthiness of every surface that remains.

## Mechanism

Pure removal — no renaming, no repointing, no compatibility layer
(principles §Strict and Complete: a disproven design is removed, never
kept alive as an option). Replacement views are separate deliveries
under the same strategic node; this plan only takes the lie out.

- **Generator**: stop minting `prerequisiteFor`; remove the member from
  the closed `GraphCorpusEdgeType` union, the edge-type counts shape,
  and the prerequisite-specific stats field
  (`GraphCorpusStats.collapsedIdenticalPrerequisiteEdges`) with its
  generator and generated-data references (`graph-corpus-types.ts`),
  and delete the thread-ordering pair derivation that exists only to
  feed it (`graph-corpus-sequences.ts` usage). The narrowed union turns every downstream reference into a
  compile error — the red-first signal, the same pattern
  `mcp-served-surface-truth` used deliberately.
- **Serving chain**: delete `prior-knowledge-view.ts` (its only meaning
  is traversal of the removed edges), the `get-prior-knowledge-graph`
  tool, and their tests; regenerate the emitted corpus.
- **Prose claim surfaces** (the same claim published in words —
  completion is false without them). Verified inventory at authoring
  (2026-08-31): `tool-guidance-data.ts` entries directing assistants to
  the prerequisite subgraph; `tool-guidance-workflows.ts` steps invoking
  the tool; the `learning-progression`, `curriculum-mapping`,
  `continue-progression`, and `adapt-lesson` guidance resources;
  cross-references in `aggregated-misconception-graph.ts`,
  `aggregated-thread-progressions.ts`, and
  `aggregated-search/tool-definition.ts` descriptions;
  `curriculum-model-resource.ts`; `agent-support-tool-metadata.ts`;
  `served-tool-table.md`; the root `README.md` and the app README;
  `docs/manual-uat-guide.md`. Prose strings do not become compile
  errors, so this inventory is completed at execution by the repo-wide
  claim-vocabulary sweep that acceptance criterion 2 requires — the
  list above is the starting set, never the boundary.
- **Recurrence guard**, in two halves with an honest claim boundary.
  The mechanical half: every emitted corpus edge type carries the
  bulk-schema source field it derives from, checked by a validator that
  recomputes membership (validators-must-recompute), proven
  behaviourally red-first — supply an edge type without a valid
  source-field citation and observe rejection — never by pinning the
  absence of `prerequisiteFor` (testing-strategy: pinning an absence
  proves configuration, not behaviour). This half guarantees
  provenance legibility only: it cannot judge whether a cited field
  supports an edge's asserted meaning (the original defect cited real
  thread data); what it guarantees is that every edge's derivation is
  a visible, reviewable claim rather than silent fabrication. The
  semantic half — no edge asserts meaning its source field does not
  carry — is a content-quality invariant, so its enforcement is
  construction plus human review (the estate's check kind for that
  class, never a false-positive-prone mechanical test): it lands as a
  dated amendment on ADR-086 (the corpus extraction methodology
  record) in the same change, binding every future edge-type review.

## Acceptance criteria (each with a proof — required)

1. No generated corpus artefact contains a `prerequisiteFor` edge or
   edge type. Proof: `repo-safe` — the narrowed closed union
   type-checks estate-wide and the regenerated corpus passes its
   existing integrity gates (the compile error on the removed member
   is the red-first signal; no absence pin is added).
2. No served tool, resource, or guidance entry, and no current
   normative repository doc, claims prerequisite data or directs
   consumers to it. Dated historical records that accurately describe
   past behaviour (UAT reports, dated spike and research notes) are
   out of this criterion's scope — history is never rewritten. Proof:
   `repo-safe` — the served-surface tests pass with the tool absent,
   and a repo-wide search for the retired claim vocabulary in served
   content and current normative docs is clean at review
   (content-quality half: construction plus review, never a grep
   gate).
3. Every emitted edge type cites its bulk-schema source field,
   recomputed by validator, and the validator rejects an edge type
   without a valid citation. The validator's claim is provenance
   legibility; the valid-citation/false-semantics case is criterion
   4's invariant, enforced at review. Proof: `repo-safe` — the
   behavioural red-first run: an uncited edge type supplied to the
   validator is rejected; the emitted corpus passes.
4. ADR-086 carries the dated invariant amendment. Proof: `repo-safe` —
   the amendment text in the same PR.

## Todos

Sliced as a safe ordered stack of independently green slices
(design-work-for-small-prs: the sizing bands bind at plan time; the
items below fix the order, further slicing happens at pickup, and no
PR count is asserted):

1. **Prose claim removal** — the guidance, metadata, and doc surfaces
   above stop directing consumers to prerequisite structure while the
   tool still functions. Green intermediate: nothing oversells; the
   technical surface is unchanged. The inventory spans more authored
   files than the ten-file band, and every prose surface is
   independently removable (no compile coupling), so this sweep is
   itself sliced at pickup into independently green PRs within the
   bands — served guidance content and repository docs as separate
   slices at minimum; the inventory is the checklist the slices draw
   from, never one PR's scope.
2. **Serving-chain removal** — the callers come out while the corpus
   still carries the edges. The chain spans several independently
   removable surfaces (the HTTP served-surface rows and E2E tests, the
   SDK tool and its registry entries, the graph view and its tests),
   so this step is itself sliced at pickup into independently green
   PRs within the sizing bands; this plan fixes the ORDER — every
   caller gone before the generator narrows — and asserts no PR
   count. Green intermediate after each slice: whatever remains still
   compiles and serves; after the last, the corpus emits edges nothing
   reads.
3. **Generator narrowing and guard** — with every caller gone, the
   final slice is the generator files alone: stop minting, narrow the
   closed union and stats shape, regenerate the corpus, land the
   source-citation validator red-first, and carry the ADR-086
   amendment. The union narrowing compiles cleanly because slice 2
   removed its readers; generated corpus artefacts are excluded from
   the band count. The validator lands here, not earlier — landing it
   while `prerequisiteFor` still exists would require granting the
   fabricated edge a passing citation (its derivation fields are
   real; its defect is semantic), briefly certifying the defect as
   provenance-legible.

## Out of scope

- Any replacement view or tool (sequence order, thread views, prior
  knowledge statement serving) — `curriculum-structure-true-views`.
- Upstream exposure requests — `upstream-curriculum-data-exposure`.
- The `prior-knowledge-extractor.ts` prose extraction and the
  `priorKnowledge` node content field — genuine published data, kept.
