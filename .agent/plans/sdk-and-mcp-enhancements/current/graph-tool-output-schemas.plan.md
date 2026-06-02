---
name: "Graph-tool output schemas via the EEF projection pattern"
overview: "Give the misconception and prior-knowledge graph MCP tools a required, object-rooted outputSchema produced by the SAME pattern the EEF tool uses — static data as sole source of truth, a deterministic type-strict projection of it, and a SINGLE Zod call tied by `satisfies` to the structuredContent type. The shared mechanism is co-designed with the EEF plan's D4–D6 and lands its FIRST instance in the EEF tool alone (EEF D6); the application to the existing graph tools is part of their substrate migration (graph-estate-consolidation Judgement call 4 — per tool: data/type re-emission + rewrite + outputSchema, one replacement unit), into whose unified plan this design content folds when that plan is authored."
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
    content: "Resolve the remaining open questions (as-const scope Q1, mechanism home Q3, codegen emission shape Q5) in the co-design and the unified substrate-migration plan. Q2 (output-only — verified in code) and Q4 (thread-progressions excluded, not graph-forced) were owner-resolved 2026-06-02."
    status: pending
---

# Graph-tool output schemas via the EEF projection pattern

**Last Updated**: 2026-06-02
**Status**: 🟠 DESIGN — mechanism input to the unified substrate-migration plan (graph-estate-consolidation Judgement call 4); the shared mechanism is co-designed with EEF D4–D6 and its first instance lands in the EEF tool alone (EEF D6). The existing graph tools are untouched until their migration. Q2 and Q4 below are owner-resolved (2026-06-02); Q1/Q3/Q5 are resolved in the co-design and the migration plan.

> **Supersedes** the hand-authored-Zod approach in the scratch plan and in
> `output-schemas-for-mcp-tools.plan.md` §W2 for the graph tools. Per owner
> direction (2026-06-02): we do **not** construct Zod; we **project** the
> static data and feed the projection to a **single Zod call**.

## Context

Owner direction (refined 2026-06-02) resolved the seam and the order:

1. **The general S0 seam is owned by
   [`output-schemas-for-mcp-tools.plan.md`](./output-schemas-for-mcp-tools.plan.md)**
   (its §Resolved Sequencing); **EEF D6 lands the seam's first use** for the
   one flag-gated EEF tool.
2. **Sequencing is per tool TYPE, and the EEF graph tool is the first
   graph-type instance** — its `outputSchema` lands first and alone, through
   EEF D6, so the EEF-dependent value ships with no delay from work on
   existing tools. The existing graph tools receive their schemas **with
   their substrate migration** (one replacement unit per tool: data/type
   re-emission + rewrite + `outputSchema`); the remaining tool types follow,
   and the required-field promotion to the root `UniversalToolListEntry`
   comes last, once every type carries it. The rule in one line: **a tool's
   schema arrives when the tool is built or rebuilt, never before.**

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
- EEF D6 (`eef-graph-tool-completion.plan.md`, deliverable D6): "one Zod-call-derived
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

## Open questions (Q1/Q3/Q5 resolve in the co-design and the migration plan)

1. **`as const` emission + scale.** The typed projection requires the graph data
   as a fixed `as const` literal; today `vocab-gen` emits loose `data.json` + a
   hand-written `interface`. Misconception/prior-knowledge graphs are large.
   **Q:** do we emit the full dataset as `as const` (compile/size cost), or only
   the projected **shape** the schema needs?
2. **Output-only simplification — RESOLVED (verified in code, 2026-06-02).**
   The existing graph tools take no input: the input schema is an empty raw
   shape (`GET_MISCONCEPTION_GRAPH_INPUT_SCHEMA: Record<string, never>`,
   `aggregated-misconception-graph.ts:33`) and `createGraphToolExecutor` is
   `() => CallToolResult`, returning `config.sourceData` wholesale
   (`graph-resource-factory.ts:177-189`). With no finite input vocabulary the
   projection is purely **structural** (the node/graph shape) — the shape as a
   typed projection, not every value as a literal — which sidesteps the
   large-`as const` cost.
3. **Where the shared mechanism lives.** EEF D4 defines domain-generic graph-core
   primitives. **Q:** does the projection→single-Zod-call schema-builder live in
   graph-core (shared by EEF + graphs), or a dedicated codegen util the graph
   path emits? It must be ONE mechanism.
4. **Scope: 2 or 3 graphs — RESOLVED (owner, 2026-06-02).** The graph-schema
   slice covers misconception + prior-knowledge. `get-thread-progressions`
   uses the same factory but its data is sequence-shaped (ordered unit
   sequences per thread; a latent thread↔unit bipartite structure exists in
   the bulk source) and is **not forced into node/edge graph form**; the
   unified substrate-migration plan decides its substrate shape, and its
   schema lands with its own migration slice under the same
   projection-from-data doctrine.
5. **Codegen emission shape.** Does `vocab-gen` emit (a) the `as const` data + a
   generated schema module that performs the projection + single-Zod-call at the
   generated package's compile, or (b) a fully pre-rendered schema? (a) preserves
   the projection-from-data property; (b) risks re-introducing a serialized
   parallel.

## Intended workstreams (shape only — pending ratification)

Ownership (2026-06-02): **W-mech** rides the EEF D4–D6 co-design, and the
mechanism's first instance lands in the EEF tool (EEF D6). **W-codegen,
W-graph-def, W-seam, and W-proof** execute inside the unified
substrate-migration plan, one replacement unit per migrated tool.

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
- **EEF Decision 2** (`eef-graph-tool-completion.plan.md` §Ratified Decisions): single Zod
  call, root `type: object`, schema is a projection not a transform/parallel.
- **metacognition.md** §"Structural, not doc-patch": the projection is the
  structural cure; a test-guarded hand-authored schema is the once-cure this
  plan rejects.
