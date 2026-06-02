---
name: "Graph-tool output schemas via the EEF projection pattern"
overview: "Give the misconception and prior-knowledge graph MCP tools a required, object-rooted outputSchema produced by the SAME pattern the EEF tool uses — static data as sole source of truth, a deterministic type-strict projection of it, and a SINGLE Zod call tied by `satisfies` to the structuredContent type — emitted as part of code generation. This is the graph-first slice of the output-schema work (this plan owns S0) and is co-designed with the EEF plan's D4–D6 so there is ONE shared projection→single-Zod-call mechanism, not two."
status: "DESIGN — pending owner review and EEF co-design; NOT yet executable"
source_research:
  - "../../../reports/output-schema-mcp-plan-audit-2026-06-02.md"
  - "./output-schemas-for-mcp-tools.plan.md"
  - "../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md"
todos:
  - id: co-design-mechanism
    content: "Co-design (with EEF D4–D6) the single shared projection→single-Zod-call mechanism: where the schema-builder util lives, the typed-projection shape, and the `satisfies` tie. Non-code ratification before any graph cycle."
    status: pending
  - id: resolve-open-questions
    content: "Resolve the open questions in this plan (as-const scope, output-only simplification, 2-vs-3 graph scope, codegen emission shape) with the owner before promotion to executable."
    status: pending
---

# Graph-tool output schemas via the EEF projection pattern

**Last Updated**: 2026-06-02
**Status**: 🟠 DESIGN — pending owner review + EEF co-design. Not executable until the shared mechanism and the open questions below are ratified.

> **Supersedes** the hand-authored-Zod approach in the scratch plan and in
> `output-schemas-for-mcp-tools.plan.md` §W2 for the graph tools. Per owner
> direction (2026-06-02): we do **not** construct Zod; we **project** the
> static data and feed the projection to a **single Zod call**.

## Context

Owner direction resolved two things:

1. **This plan owns S0** (the shared `outputSchema` registration seam).
2. **Sequencing is per tool TYPE, graph first** — apply the required
   `outputSchema` at each tool type's own definition one type at a time;
   promote it to the root `UniversalToolListEntry` only once every type
   carries it. Order: **graph tools → broader universal tools → revisit
   API/search**.

And the governing doctrine for *how* the schema is produced (owner, 2026-06-02):

> The static data is the ONLY source of truth. Determine the shape by a
> deterministic, type-strict **projection** of the appropriate part of the
> data, then feed that to a **SINGLE Zod call** to generate the input and
> output schemas. Do not *construct* a parallel Zod shape. Use the same
> pattern as EEF, but emitted as part of code generation.

### The EEF pattern this mirrors (verified)

- EEF data is a fixed **`as const`** literal (`EEF_TOOLKIT_DATA`); all types are
  `typeof` + indexed-access projections of it
  (`graph-corpus-sdk/.../strand-lookup.ts`). The `as const` is **mandatory** —
  `strand-lookup.ts:25`: without it, per-member precision collapses.
- EEF D6 (`eef-graph-tool-completion.plan.md:1294-1308`): "one Zod-call-derived
  object input schema over the appropriate graph-native EEF view subset, one
  Zod-call-derived object output schema … (each root `type: object`) … the
  subset/schema-builder value consumed by each Zod call must itself be typed
  from the graph-native view, with `satisfies` or an equivalent compile-time
  proof tying the declared schema to the corresponding `structuredContent` type.
  These two declarations are the only Zod in the system."
- **The mechanism is not yet built** — EEF D5 (graph-native view) and D6 (the
  single-Zod-call + `satisfies`) are pending (`eef-strands/index.ts:9`). So this
  is **co-definition**, not copying.

### Why drift is impossible under this pattern (vs the rejected approach)

A hand-written `z.object({...})` mirroring the data is a parallel that can drift,
caught only by a runtime test. The projection pattern makes the schema a
function of the data, and `satisfies` makes any divergence between the schema's
inferred type and the data-derived `structuredContent` type a **compile error**.
Structural cure, not a test guard.

## The shared mechanism (to ratify with EEF)

```text
static `as const` data
  → deterministic type-strict projection (typeof / indexed-access)  [the "view"]
  → named subset / schema-builder value (typed from the view)
  → SINGLE Zod call  → input schema  (root type: object)
  → SINGLE Zod call  → output schema (root type: object), `satisfies`-tied to structuredContent
```

For the graph tools this chain is **emitted as part of code generation**: the
graph data is the codegen output, so the projection + single-Zod-call schema is
owned by / emitted from the codegen pipeline, keeping schema and data in lockstep
(Cardinal Rule). For EEF the same chain runs in the SDK/MCP module over the
hand-curated static corpus. **Same pattern, two data origins.**

## Open questions (resolve before this plan is executable)

1. **`as const` emission + scale.** The typed projection requires the graph data
   as a fixed `as const` literal; today `vocab-gen` emits loose `data.json` + a
   hand-written `interface`. Misconception/prior-knowledge graphs are large.
   **Q:** do we emit the full dataset as `as const` (compile/size cost), or only
   the projected **shape** the schema needs?
2. **Output-only simplification.** The existing graph tools are output-only
   (`createGraphToolExecutor` is `() => CallToolResult`). If there is no finite
   input vocabulary, the projection is purely **structural** (the node/graph
   shape), so the schema may need the shape as a typed projection — not every
   value as a literal — likely sidestepping the large-`as const` cost. **Q:**
   confirm the graph tools take no finite-vocabulary input.
3. **Where the shared mechanism lives.** EEF D4 defines domain-generic graph-core
   primitives. **Q:** does the projection→single-Zod-call schema-builder live in
   graph-core (shared by EEF + graphs), or a dedicated codegen util the graph
   path emits? It must be ONE mechanism.
4. **Scope: 2 or 3 graphs.** Owner named misconception + "prerequisite" (=
   `get-prior-knowledge-graph`). `get-thread-progressions` also uses the graph
   factory but has an ordered-sequence shape, not node/edge. **Q:** include it in
   this slice, or treat separately?
5. **Codegen emission shape.** Does `vocab-gen` emit (a) the `as const` data + a
   generated schema module that performs the projection + single-Zod-call at the
   generated package's compile, or (b) a fully pre-rendered schema? (a) preserves
   the projection-from-data property; (b) risks re-introducing a serialized
   parallel.

## Intended workstreams (shape only — pending ratification)

- **W-mech (non-code, co-design):** ratify the shared projection→single-Zod-call
  mechanism and its home jointly with EEF D4–D6. Output: the schema-builder
  contract + the `satisfies` tie pattern.
- **W-codegen:** make `vocab-gen` emit the graph data in the form the projection
  requires (per Q1/Q2/Q5) and emit the projected, single-Zod-call schema per
  graph. TDD: the emitted schema's inferred type `satisfies` the data-derived
  `structuredContent` type (compile proof) + a conformance test over the real
  generated data.
- **W-graph-def (per-type required):** the graph tool definition
  (`graph-resource-factory.ts` `GraphSurfaceConfig`/`createGraphToolDef`) carries
  a **required** `outputSchema` composed as `{ ...projectedGraphShape, summary,
  status, oakContextHint }` (the real `formatToolResponse` envelope,
  `graph-resource-factory.ts:177-189`). Required at the graph tool type only.
- **W-seam (S0, graph-scoped):** thread `outputSchema` from the def through
  `listUniversalTools()` to the `registerTool`/`registerAppTool` config; the root
  `UniversalToolListEntry` required-promotion is deferred to after the broader
  universal step. This is the **same seam** EEF D6 names — co-settle.
- **W-proof:** e2e — `tools/list` exposes the graph tools' `outputSchema`; real
  `structuredContent` validates; `isError` skips.

## Coordination with EEF (critical)

The EEF tool is a graph universal tool; EEF D6 names the identical seam and the
identical single-Zod-call rule. EEF D5/D6 are **active** and pending. This plan
and EEF must land **one** shared mechanism. Register active claims on
`graph-corpus-sdk`, the `vocab-gen` graph generators, and `universal-tools/`;
coordinate the seam and the schema-builder util with the EEF agent before any
code cycle.

## Non-goals

- Constructing/hand-authoring Zod parallels (the rejected approach).
- The new EEF graph tool itself (owned by the EEF plan).
- The broader universal tools, API/generated, and search tools (later steps).
- The root `UniversalToolListEntry` required-promotion (after the broader
  universal step).

## Foundation alignment

- **principles.md** §Cardinal Rule (schema emitted from data at codegen);
  §Strict and Complete (required, object-rooted, no constructed optionality);
  the data-as-source-of-truth doctrine.
- **EEF Decision 2** (`eef-graph-tool-completion.plan.md:196-213`): single Zod
  call, root `type: object`, schema is a projection not a transform/parallel.
- **metacognition.md** §"Structural, not doc-patch": the projection is the
  structural cure; a test-guarded hand-authored schema is the once-cure this
  plan rejects.
