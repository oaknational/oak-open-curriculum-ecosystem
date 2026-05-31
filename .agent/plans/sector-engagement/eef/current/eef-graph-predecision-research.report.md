# EEF graph pre-decision research report

> **Status: `pre-decision research`.** Nothing here ratifies graph structure,
> graph-core operations, the graph-native EEF view shape, MCP tool/resource
> names, or node/edge policy. Those are owned by D1 (value), D3 (MCP surface),
> and D4 (graph capability) of
> [`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md). This
> report maps the decision space so those deliverables start with more
> information; every suggested action below is a criterion or an option, not a
> decision.

**Authored**: 2026-05-31 (Vining Ripening Fern, session `870a40`) against the
research instruction set in
[`eef-graph-predecision-research.codex-brief.md`](eef-graph-predecision-research.codex-brief.md).
**Method**: direct read of the four code surfaces the brief names, grounded in
the controlling plan's Ratified Decisions. Code observations carry `file:line`
references verified this session against `HEAD` (`90af56ef`; D0 committed at
`ce9745c7`).

**Follow-up provenance note**: 2026-05-31 review found this report useful but
unsafe as handoff material until its evidence references and inherited-code
wording were tightened. This revision applies those reviewer findings without
adding a new decision; it keeps the report as pre-decision research for D1/D3/D4.

---

## 1. Executive summary

The most important graph-design implications for D3/D4:

1. **The clean foundation already exists; the graph layer does not yet consume
   it.** D0 landed the exact `as const`-derived foundation in
   `strand-lookup.ts` (`Strand`, `StrandByStrandId`, `strandById`,
   `EefToolkitData`, `lastUpdated` — `packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts:16-109`).
   But every current graph surface (`eef-graph-model.ts`, `graph-view.ts`)
   still types its nodes as the **Zod-inferred** `EefStrand` from
   `strand-schema.ts` and keys them by **broad `string`**
   (`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:46-56`).
   The current breadth-first traversal
   (`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:141-190`)
   is diagnostic evidence for one possible traversal shape, not a preservation
   target. D5 may independently re-derive breadth-first semantics if D4/D5
   ratify them from the graph contract.

2. **Type erasure is concentrated at two named seams**, both in code the plan
   already targets: (a) `graph-core`'s query inputs and public result/error
   types use broad `string` for ids — `getNode.nodeId`, `neighbours.nodeId`,
   and `subgraph.rootIds`
   (`packages/core/graph-core/src/graph-view/interface.ts:82-105`),
   `SubgraphResult.edges[].source/target`
   (`packages/core/graph-core/src/graph-view/types.ts:119-126`),
   `SubgraphError.rootId`
   (`packages/core/graph-core/src/graph-view/types.ts:157-163`),
   `NodeNotFoundError.nodeId`
   (`packages/core/graph-core/src/graph-view/types.ts:165-169`); and (b) the
   EEF adapter's node index is `ReadonlyMap<string, EefStrand>` over the widened
   Zod type
   (`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:46-56`).
   D4's "`TNodeId` carries through inputs, results, and errors" requirement is
   the cure for (a); D5's "construct from the typed foundation" is the cure for
   (b).

3. **The graph-native view's hardest open question is payload policy, and it is
   a D1 value question, not a graph question.** What the teacher sees per strand
   (full `StrandByStrandId[Id]` vs a named projection; whether `last_updated`
   surfaces; whether `key_findings` is included) determines the output-schema
   subset D3/D6 derive their single Zod call from. The current list tool answers
   this with a token-budget-driven projection
   (`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/projection.ts:60-76`)
   that **drops** `key_findings`, `definition.full`, `effectiveness`, and other
   major fields while putting key identifiers and prose fields into a
   hand-authored parallel shape. That answer was driven by the response cap the
   plan deletes (Decision 7), so it cannot be carried forward. **D3 cannot
   finalise its output schema until D1 ratifies the teacher-facing evidence field
   set.**

4. **The MCP registration path drops `outputSchema` today — a concrete blocker
   the plan anticipated.** The registration config at
   `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:185-196` carries
   `title`, `description`, `inputSchema`, `annotations` — **no `outputSchema`**.
   The current EEF tool also declares no output schema at all (only a
   hand-authored input `z.ZodRawShape`,
   `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/tool-definition.ts:87-113`).
   D6's
   "the configured `outputSchema` reaches `registerTool`/`registerAppTool`"
   acceptance requires **extending the registration config and the
   `listUniversalTools` projection it is built from**, not merely declaring a
   schema locally.

5. **The speculative corpus surface to delete is type-only and barrel-exported,
   so its removal is low-risk but must be co-ordinated.** `rank`/`explain`/`compare`
   (`packages/sdks/graph-corpus-sdk/src/eef-strands/types.ts:67-202`) are pure
   type declarations with no runtime
   implementation; they are re-exported from the `eef-strands` barrel
   (`packages/sdks/graph-corpus-sdk/src/eef-strands/index.ts:66-79`). Deleting
   them touches the corpus barrel and any type tests. Separately, the graph-core
   query-contract reshape updates the `graph-view/index.unit.test.ts` 7-op
   contract test
   (`packages/core/graph-core/src/graph-view/index.unit.test.ts:115-136`).
   The plan's "zero external blast radius" finding is corroborated (see §6).

---

## 2. Known constraints (settled — graph design must obey)

These are plan-settled constraints, with current-code observations where noted;
they are **not** open for D3/D4 to re-litigate.

- **C1 — The raw corpus type is `as const`-derived and is the type authority,
  not the graph contract.** `Strand = (typeof EEF_TOOLKIT_DATA.strands)[number]`
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts:30`);
  `StrandByStrandId` is the per-id exact lookup
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts:57-59`). The
  graph-native view is a typed projection *from* this; it never re-establishes the
  shape and never widens ids to `string`. (Plan Decision 4.)
- **C2 — No Zod over the corpus.** The sole permitted Zod calls are the MCP tool
  input and output schemas, each a *single* call over a named graph-native
  subset (Plan Decision 2). Every current corpus-side Zod is slated for
  deletion: `strand-schema.ts`, the `school-context.ts` schemas + `superRefine`
  drift guard (`packages/sdks/graph-corpus-sdk/src/eef-strands/school-context.ts:97-153`),
  the loader `safeParse`
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/loader.ts:101`), and the
  MCP-side hand-authored schemas
  (`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/tool-definition.ts:87-113`,
  `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/citation-shape.ts:28-68`).
- **C3 — The only unknown is the key.** The D2 target predicate
  `isValidStrandKey(value): value is EefStrandId` (ADR-153 predicate) is the
  single narrowing; downstream of a known key everything is exact (Plan Decision
  5). This predicate is **planned D2 work, not current D0 code**. D3 must still
  classify *every* externally supplied field — the current tool also takes
  free-text `subject`, `key_stage`, `topic`
  (`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/tool-definition.ts:39-44`),
  so "only the key" is not yet true of the surface.
- **C4 — No response cap; graph scope is the bound.** `response-budget.ts`
  (`MAX_RESPONSE_STRANDS = 12`, `capForBudget`,
  `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/response-budget.ts:17-41`)
  and the budget-driven `projection.ts` are removed (Plan Decision 7). An
  oversized result is a scoping bug, fixed by scope, never by truncation.
- **C5 — No freshness apparatus.** `freshness.ts`, `checkFreshness`,
  `DEFAULT_THRESHOLD_DAYS`, and the loader's 180-day gate
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/loader.ts:106-113`) are
  withdrawn; ADR-175 is deleted (Plan Decision 9). `last_updated` is internal
  metadata; whether it is *surfaced* is a D1 value call, with no freshness
  semantics.
- **C6 — `graph-core` substrate stays; its query contract is reshaped.** The RDF
  substrate (`term`/`dataset`/`jsonld`/`canon`/`data-factory`) is genuinely
  multi-consumer and out of scope. Only `graph-view/` (the `GraphView` query
  contract) is reshaped (Plan Decision 6).
- **C7 — Dependency direction is permanent (ADR-041/179).** `graph-core` cannot
  import from `packages/sdks/`, so the generic contract lives in `graph-core`
  and EEF specifics live in `graph-corpus-sdk`; substrate packages import no MCP
  types. The `GraphView` placement rationale is already documented at
  `packages/core/graph-core/src/graph-view/interface.ts:9-12`.
- **C8 — Structured-content-only results are the D6 target, not current code.**
  The plan settles `structuredContent` with empty `content` as the EEF graph
  surface target, but current shared formatting still emits a two-item
  `content` array plus `structuredContent`
  (`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts:196-220`).
  D6 owns replacing, bypassing, or deleting that dual-content path for the EEF
  graph surface; this report does not ratify the final MCP shape. D3/D6 must
  also re-check the live MCP tools specification before landing an empty-content
  result shape, because current structured-content guidance says tools should
  include serialized JSON text content for backwards compatibility.
- **C9 — The old list implementation is evidence only for what to delete.** No
  preserving, repairing, wrapping, consulting, or targeting its outputs. Any
  overlap with old output is acceptable only as an incidental re-derivation.

---

## 3. Open questions for D1/D3/D4

Separated by owner, so each lands with the right deliverable. **None is answered
here.**

### 3a. Owner / value (D1) — and the value detail D3 is blocked on

- **V1 — Teacher-facing evidence field set.** Which strand fields appear in the
  assistant-facing payload? The corpus carries far more than the list tool
  surfaced: `headline.{impact_months, cost_label, evidence_strength_label,
  headline_summary}`, `definition.{short, full}`, `effectiveness`,
  `behind_the_average`, `implementation`, `key_findings`, `tags`,
  `school_context_relevance`, `related_strands`, `related_guidance_reports`,
  `update_history` (corpus literal). The list tool's projection
  (`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/projection.ts:35-76`)
  is **not** a valid answer — it was sized by the deleted cap.
- **V2 — Does `last_updated` / `data_version` surface to the teacher?** Plan
  says internal-only by default; D1 must confirm the teacher-facing value call
  (Plan §Value And Impact).
- **V3 — No teacher-replacing selection contract.** D1 should record that the graph
  surface does not choose a single approach, explain winners, or compare options
  for the teacher. The stale `rank`/`explain`/`compare` ops are deletion targets,
  not candidate functionality.
- **V4 — Verbatim-preservation set for D7.** At minimum a known strand's caveat
  text, attribution, evidence strength, cost, impact (Plan D1/D7).

> **These four are the missing D1 value questions that block a clean D3 answer.**
> D3's output schema is a typed subset of the graph-native view; the view's
> payload policy is V1; so **D3's output schema cannot be finalised before V1.**
> (Per the brief's closing instruction to name missing value detail directly.)

### 3b. MCP surface (D3)

- **M1 — Tool/resource suite.** Ratified practical-small D3 direction: one
  preferred function-dispatched EEF MCP tool for lesson-context evidence and
  strand inspection, plus corpus metadata; a graph-forward MCP collection is a
  follow-on plan, not this D3-D6 target (controlling plan §MCP Surface). D3 still
  decides the exact tool/resource boundary and verifies whether the preferred
  single-tool shape holds under schema clarity, host UX, and output-schema
  validation.
- **M2 — Field classification.** Every externally supplied field classified as
  strand-key predicate, finite-vocabulary predicate, Oak-derived vocabulary, or
  ratified free text (Plan D3). Today: `focus` is finite-vocabulary
  (`EEF_PRIORITIES`,
  `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/tool-definition.ts:100-113`);
  `subject`/`key_stage`/`topic` are free text feeding fuzzy `selection.ts`
  matching — D3 must decide whether that free-text intake survives or is replaced
  by key/vocabulary predicates.
- **M3 — Output-schema subset.** The single Zod call's source subset, typed from
  the graph-native view, root `type: object`, `satisfies`-tied to
  `structuredContent` (Plan Decision 2). Depends on V1 and the view shape (§4).
- **M4 — Registration path.** Verified: the path drops `outputSchema`
  (`apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:185-196`);
  `listUniversalTools` exposes `title/description/inputSchema`
  (`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts:62-93`,
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts:121-142`).
  D3 specifies how `outputSchema` reaches `registerTool`/`registerAppTool`.

### 3c. graph-core primitives (D4)

- **G1 — Minimal generic op set.** Candidate floor from the likely surface:
  `getNode`, `subgraph`, `manifest` (3). Drop `summary`, `enumerateNodes`,
  `neighbours`, `findByTag` unless an M1 surface needs them. (Current: 7 ops, 5
  stubbed — `packages/core/graph-core/src/graph-view/interface.ts:77-111`.)
- **G2 — Where does construction-integrity error live?** `eef-graph-model.ts`
  construction is *fallible* (`DuplicateStrandId`, `DanglingRelatedStrand`,
  `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:37-43`).
  The current D0 typed foundation does not by itself prove duplicate raw IDs or
  dangling `related_strands` impossible. D2/D5 should derive and prove the
  relevant uniqueness and edge-integrity facts; once those proofs land, the EEF
  binding may become infallible for data-shape purposes. Open: are integrity
  error variants a generic `graph-core` concern for genuinely unknown future
  adapters while the EEF binding proves them away, or are they deleted outright?
  This is a D4 split question.
- **G3 — `TNodeId` threading.** Reshape query inputs, `SubgraphResult`,
  `SubgraphError`, `NodeNotFoundError`, and `NeighbourResult` to carry
  `TNodeId extends string`. Today `getNode.nodeId`, `neighbours.nodeId`, and
  `subgraph.rootIds` are broad `string`
  (`packages/core/graph-core/src/graph-view/interface.ts:82-105`), as are result
  and error ids
  (`packages/core/graph-core/src/graph-view/types.ts:119-169`). EEF binding sets
  `TNodeId = EefStrandId`.

### 3d. EEF / Oak binding (D4/D5)

- **B1 — Node kind policy.** Today one node kind (strand). `related_guidance_reports`
  are deliberately **not** graph nodes — they ride the citation envelope at the
  tool boundary (`packages/sdks/graph-corpus-sdk/src/eef-strands/graph-view.ts:24-31`).
  When the list tool's citation envelope is deleted (D6), where do guidance
  reports go: frontier nodes, a second node kind, or additive provenance?
  **Open.**
- **B2 — Edge type policy.** Today one edge type `related_strand`
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:17-23`).
  A guidance-report edge type is additive if B1 makes them nodes.
- **B3 — Oak lesson-context → EEF mapping.** Lives in the curriculum consumer
  layer / D6, never in `graph-core` and never as hidden logic in a tool body.
  The current `selectEefSeedIds` (`selection.ts`) is that mapping today, in
  list-tool shape — D3/D4 decide its replacement.

### 3e. Type / proof (D4/D5)

- **P1 — Compile-time proof** that `graph-core` query inputs and public
  result/error ids extend `TNodeId` and the EEF binding instantiates
  `EefStrandId` (e.g. type-level assertions that `subgraph` roots and result edge
  `source` are `EefStrandId`, not `string`, after the boundary predicate).
- **P2 — Runtime proof over the real corpus** of construction, complete member
  nodes + member edges, frontier refs, and the provenance envelope — with the
  typed id/payload relationship asserted, not just runtime shape presence (Plan
  D5 acceptance).

---

## 4. Candidate graph-native view options

Comparing the three forms the brief names. **All three can satisfy the type
constraints** if they key nodes by `EefStrandId` and source payloads from
`StrandByStrandId`; they differ on where the graph-native structure lives and
when it is built. The considerations bearing on the choice are in §7; the
choice itself is D4's.

| Axis | (A) Materialised | (B) Lazy view | (C) Hybrid / indexed |
|---|---|---|---|
| **Shape** | Build a concrete graph-native structure (node map keyed by `EefStrandId`, typed edge array, frontier index, provenance envelope) eagerly at construction. | Keep only the D2 foundation; compute subgraph/frontier on demand from `strandById` + derived edge facts behind a named typed surface. | Layer typed indexes (id→strand = `StrandByStrandId`; edge adjacency; sparse-relations set) over the foundation with a thin graph-native facade. |
| **Node id policy** | `EefStrandId` keys | `EefStrandId` args | `EefStrandId` keys |
| **Node kind policy** | Explicit `strand` node kind stored with each graph node; optional future `guidance_report` kind only if B1 makes guidance reports nodes. | Node kind is derived at accessor time from the resolver used; must still be exposed through a named typed view, not inferred ad hoc by callers. | `strand` kind lives in the facade/index metadata; optional guidance-report kind is another typed index only if B1 ratifies it. |
| **Edge type policy** | Store typed edge records such as `related_strand`; add guidance-report edge type only if B1/B2 ratify report nodes. | Derive `related_strand` edges on demand from the raw `related_strands`; edge type is still a literal in the view contract. | Precompute adjacency keyed by `EefStrandId` with literal `related_strand`; sparse additive edge indexes remain possible after B1/B2. |
| **Payload / reference policy** | `StrandByStrandId[Id]` or named D1-ratified projection, stored as payload or as a typed reference back to `strandById`. | Resolve payload per call from `strandById(id)`; any projection is a named graph-native subset, not the old tool projection. | Keep `StrandByStrandId` as the node index; facade returns full payload or a named subset while preserving the id→payload relationship. |
| **Frontier representation** | Store frontier refs during traversal as typed `{ id: EefStrandId; kind; edgeType; reason }` records outside `nodes`. | Compute frontier refs per traversal from omitted neighbours; must return the same typed frontier shape as the other options. | Precompute neighbour adjacency; traversal emits frontier refs from the index when scope stops before all neighbours are included. |
| **Provenance envelope shape** | Materialise corpus `meta.source` / `meta.licence` / `meta.caveats` once with graph construction, then attach the relevant envelope once per result. | Build the envelope per result from raw `EEF_TOOLKIT_DATA.meta`; no provenance lives in graph-core. | Store a lightweight provenance reference in the facade and attach the same once-per-result envelope at the EEF binding boundary. |
| **D0/D2 relationship** | derives an index from the D2 foundation | uses `strand-lookup` directly | **uses `StrandByStrandId` as the node index** |
| **Pros** | single graph-truth source; traversal, schemas, provenance all derive from one structure; provenance computed once | no second copy; raw foundation stays the single source | minimal new structure (only an edge index + frontier); exact types preserved *by construction* |
| **Risks** | a second materialised copy can drift toward a normalized node if typed loosely — must be typed as a projection over `StrandByStrandId`, not a fresh interface | **the plan's explicit Non-Goal**: "raw corpus plus scattered graph functions" is forbidden *as the contract* — a lazy view is only acceptable as a *named, typed* projection surface, never ad-hoc helpers | the facade must still be an explicit named boundary, or it collapses into (B)'s scattered-helpers failure |
| **Proof needs** | constructor test over real corpus; typed-id compile proof; provenance-on-envelope test | per-accessor tests; the harder proof that the surface is "explicit boundary" not "scattered functions" | constructor/index test; typed-id compile proof; provenance test |
| **Memory** | ~2× corpus (trivial at 30 nodes) | 1× | ~1× + small edge index |

Cross-cutting observations:

- The existing `eef-graph-model.ts` is effectively a **materialised-index** form
  (option C/A blend): `buildGraphIndex` produces `nodesById` + edge summary
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:96-113`),
  and `traverseSubgraph` walks that index breadth-first
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:165-190`).
  This is evidence that an index-backed breadth-first traversal is plausible, not
  evidence that the current implementation should be preserved. D5 must derive
  the traversal from the D4 graph contract, re-key any index on `EefStrandId`,
  and re-type edges from `{source: string,...}` to `TNodeId` endpoints.
- The type constraints (C1, P1) bind all three forms equally — ids are
  `EefStrandId`, payloads keep a type-level link to `StrandByStrandId[Id]` —
  so they do not differentiate the options. Where the forms actually differ is
  the eager-vs-lazy axis: where the graph-native structure lives and when it is
  built.
- A materialised provenance envelope (corpus `meta.source` / `meta.licence` /
  `meta.caveats`, attached **once** per subgraph result) maps cleanly onto
  option A's "computed once" property; in B/C it is computed per call from the
  foundation's `meta`.

---

## 5. Layer split map

From raw foundation up to MCP composition, with current home and target home:

| Layer | Responsibility | Current location | Target home |
|---|---|---|---|
| **Raw corpus** | the `as const` snapshot, type authority | `eef-toolkit.external-data.ts` (pure data post-D0) | unchanged |
| **Typed raw foundation** | `Strand`, `StrandByStrandId`, `strandById`, `EefStrandId`, vocab tuples, `related_strand` edge facts, `isValidStrandKey` | partial: `strand-lookup.ts` (D0) + `school-context.ts` tuples; vocab still wrapped in Zod | D2 completes in `graph-corpus-sdk/eef-strands` |
| **Graph-native EEF view** | explicit typed projection: nodes (`EefStrandId`-keyed), typed edges, frontier, provenance envelope | does not exist as a named boundary; `eef-graph-model.ts` is the nearest, over widened types | D5 constructs (form per §4); `graph-corpus-sdk` |
| **graph-core primitives** | domain-generic `GraphView<TNode, TNodeId, TEdgeType>`: `getNode`/`subgraph`/`manifest` (+ only what D3 needs); result/error carry `TNodeId` | `graph-view/{interface,types}.ts`, 7 ops broad-`string` ids | D4 reshapes; `packages/core/graph-core` |
| **EEF/Oak binding** | EEF evidence query, EEF-native ops, `TNodeId = EefStrandId`; the EEF schema-builder values D3/D6 consume | `graph-view.ts` adapter (over Zod `EefStrand`) + speculative `EvidenceCorpus` | D4/D5; `graph-corpus-sdk/eef-strands` |
| **Oak lesson-context mapping** | teacher lesson context → strand seeds | `selection.ts` (list-tool shape, free-text fuzzy match) | D3/D4 decide replacement; curriculum consumer layer |
| **MCP composition** | tool/resource defs, single-Zod input + output schemas over view subsets, `isError`/`structuredContent` formatting, telemetry, flag gating | `evidence-corpus/tools/eef-explore-evidence-for-context/*` + `eef-surface.ts` + `handlers.ts` | D6 rebuilds; `oak-curriculum-sdk` + the app |

Boundary invariants (C7): `graph-core` imports no `graph-corpus-sdk`; substrate
imports no MCP types; the Oak lesson-context mapping never lives inside
`graph-core` or hidden in a tool body.

---

## 6. Risk register

| # | Risk | Evidence | Mitigation signal for D3/D4/D5 |
|---|---|---|---|
| R1 | **Type erasure via broad-`string` ids** | `packages/core/graph-core/src/graph-view/interface.ts:82-105` (`getNode.nodeId`, `neighbours.nodeId`, `subgraph.rootIds`); `packages/core/graph-core/src/graph-view/types.ts:119-169` (edges, `SubgraphError.rootId`, `NodeNotFoundError.nodeId`); `packages/sdks/graph-corpus-sdk/src/eef-strands/graph-view.ts:158-162` (`rootIds: readonly string[]`); `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:119-123` (`rootIds: readonly string[]`); `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:46-56` `ReadonlyMap<string, EefStrand>` | D4 threads `TNodeId` through inputs, outputs, frontier refs, and errors; D5 keys on `EefStrandId`; P1 compile proof asserts broad `string` cannot cross the narrowed EEF graph boundary |
| R2 | **Normalized-node creep** | the to-delete Zod `EefStrand` (`strand-schema.ts` via `z.infer`) is widened vs the `as const` `Strand`; `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/projection.ts:35-76` drops major fields and puts identifiers/prose into a hand-authored parallel shape | the graph-native payload must be typed as a projection over `StrandByStrandId[Id]`, never a fresh interface; union-ergonomics is **not** a licence for a normalized shape (Plan §Risk) |
| R3 | **Premature generality** | `GraphView` opened to a second consumer before one existed (5 stubbed ops, `packages/core/graph-core/src/graph-view/interface.ts:77-111`); `rank`/`explain`/`compare` type-only speculation (`packages/sdks/graph-corpus-sdk/src/eef-strands/types.ts:67-202`) | D4 specifies only the ops D3 consumes; delete the rest; no generic factory until a real second consumer (Plan Decision 6, Non-Goals) |
| R4 | **Stale list-era coupling pulling execution back** | `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/execution.ts:20-43` imports `loadEefCorpus`, `selectEefSeedIds`, `capForBudget`, `projectExploreNode`, `buildCitations`, `CitationsSchema`; barrel re-exports loader/freshness/selection/`EvidenceCorpus`/`EefToolkitSchema` (`packages/sdks/graph-corpus-sdk/src/eef-strands/index.ts:50-79`) | D5/D6 co-land or delete the list tool first; prune the barrel in the same landing (Plan deletion-ordering rule) |
| R5 | **Deletion ordering → red tree** | `loader.ts` + `index.ts` import `EefToolkitSchema`/`EefStrand` from `strand-schema.ts` (`packages/sdks/graph-corpus-sdk/src/eef-strands/index.ts:25-31`); `graph-view.ts` + `eef-graph-model.ts` import the Zod `EefStrand` (`packages/sdks/graph-corpus-sdk/src/eef-strands/graph-view.ts:64`, `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:15`); `types.ts` and `selection.ts` also import the Zod type (`packages/sdks/graph-corpus-sdk/src/eef-strands/types.ts:56`, `packages/sdks/graph-corpus-sdk/src/eef-strands/selection.ts:24`); the old MCP tool consumes the public list-era barrel (`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/execution.ts:20-43`) | `strand-schema.ts` physical delete deferred D2→D5 to co-land with loader removal and any old-list deletion; every deliverable ends `type-check` green (Plan §Risk) |
| R6 | **`outputSchema` never reaches the SDK** | `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:185-196` config carries no `outputSchema`; current tool declares none | D3 specifies the path extension; D6 proves the configured schema reaches `registerTool`/`registerAppTool` and runtime-validates `structuredContent`; the tool also uses `registerAppTool` from `@modelcontextprotocol/ext-apps/server` (`apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:10-11`, `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:192-195`) — verify *both* paths carry it |
| R7 | **Under-classified external input** | `subject`/`key_stage`/`topic` free text → fuzzy `selection.ts` matching (`packages/sdks/graph-corpus-sdk/src/eef-strands/selection.ts:47-115`) | D3 classifies every field (M2); decide whether free-text intake survives or becomes key/vocabulary predicates |
| R8 | **Guidance-report modelling gap** | `related_guidance_reports` excluded from the graph, carried only by the to-be-deleted citation envelope (`packages/sdks/graph-corpus-sdk/src/eef-strands/graph-view.ts:24-31`, `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/citation-shape.ts`) | D4 ratifies B1: frontier node, second node kind, or additive provenance — they must not silently vanish with the citation envelope |
| R9 | **SDK schema registration drift (ADR-179)** | the `eef-strands` barrel describes and exports loader/freshness plus corpus-operation surfaces (`packages/sdks/graph-corpus-sdk/src/eef-strands/index.ts:1-14`, `packages/sdks/graph-corpus-sdk/src/eef-strands/index.ts:66-79`); `EvidenceCorpus` holds a `GraphView` while adding corpus ops (`packages/sdks/graph-corpus-sdk/src/eef-strands/types.ts:195-202`) | D6 keeps MCP types out of substrate (explicit acceptance check); the single Zod call lives in the composition module, not the substrate |
| R10 | **`EefPhase` derived from the wrong source** | `packages/sdks/graph-corpus-sdk/src/eef-strands/school-context.ts:23` `EEF_PHASES` is a hand-authored tuple; Plan D2 wants `EefPhase` derived from strand `by_phase` keys, not the wider `school_context_schema` phase enum | D2 derives from `by_phase`; D3/D4 schema-builder values consume the derived type, not the hand-authored tuple |

---

## 7. The D3/D4 decision agenda — decisions owned by D1/D3/D4

The items below are decisions **D1/D3/D4 own**, listed in dependency order. This
research names each decision and the considerations it surfaces; it does not
make the call. Restated plan-settled constraints are attributed to the plan;
they are not new decisions.

1. **(D1, blocks D3) The teacher-facing evidence field set (V1) and whether
   `last_updated` surfaces (V2).** Considerations the research surfaces: this is
   a value choice about what makes the cover-lesson answer honest and useful. The
   list tool's `projection.ts` field set is not a neutral starting point — it was
   sized by the response cap the plan deletes, so it carries a token-budget bias
   rather than a value rationale.
2. **(D1) Record the no teacher-replacing selection contract (V3).** Criterion:
   D1 closes the door on `rank`/`explain`/`compare` as current graph
   functionality; those list-era operations are deleted. Any later
   teacher-replacing selection behaviour would need a separate owner decision
   after the graph surface proves teacher value, not a design target for D1-D6.
3. **(D3) The field classification (M2) and practical-small MCP surface (M1).**
   Considerations the research surfaces: the controlling plan has ratified one
   preferred function-dispatched EEF MCP tool for lesson-context evidence and
   strand inspection, plus corpus metadata, with graph-forward MCP collection
   deferred; D3 still verifies the exact tool/resource boundary and fallback
   shape. The current surface takes three
   free-text fields (`subject`/`key_stage`/`topic`) feeding fuzzy matching
   (`packages/sdks/graph-corpus-sdk/src/eef-strands/selection.ts:47-115`), so
   "only the key is unknown" (C3) is not yet true of it. The decision for each
   field is free text (explicitly ratified) versus a key/finite-vocabulary
   predicate; the trade-off is intake flexibility against the boundary-narrowing
   the known-vs-unknown doctrine asks for.
4. **(D3) Specify the output-schema subset (M3) and the registration-path
   extension (M4/R6).** Criterion: one Zod call over a named graph-native subset
   typed from the view; the config at
   `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:185-196` and the
   `listUniversalTools` projection both extended to carry `outputSchema`;
   `registerTool` *and* `registerAppTool` paths verified. Current shared
   formatting emits dual `content` plus `structuredContent`
   (`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts:196-220`);
   D6 owns replacing, bypassing, or deleting that path for the EEF graph surface.
   D3/D6 should explicitly re-check the empty-`content` target against the live
   MCP structured-content compatibility guidance before landing the replacement.
5. **(D4) The minimal generic op set (G1) and `TNodeId` threading (G3).**
   Considerations the research surfaces: the current contract has 7 ops, 5
   stubbed (`packages/core/graph-core/src/graph-view/interface.ts:77-111`); only
   `manifest` + `subgraph` are exercised today, and `getNode` is a
   plausible-but-unbuilt strand-inspection primitive. Which ops survive depends
   on the M1 surface. The `TNodeId`-threading itself is a settled plan requirement
   (Decision 6 / D4), not an open choice, and covers query inputs as well as
   results and errors.
6. **(D4) The construction-error split (G2).** Considerations the research
   surfaces: the current construction variants
   (`DuplicateStrandId`/`DanglingRelatedStrand` at
   `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:37-43`)
   mark facts D2/D5 still need to derive and prove. Once those uniqueness and
   edge-integrity proofs land, the EEF binding may become infallible for
   data-shape purposes. The open decision is whether integrity-error variants
   stay generic in `graph-core` for unknown future adapters or are removed.
7. **(D4) Node-kind / edge-type policy, including guidance reports (B1/B2/R8).**
   Considerations the research surfaces: `related_guidance_reports` are not graph
   nodes today and ride the to-be-deleted citation envelope
   (`packages/sdks/graph-corpus-sdk/src/eef-strands/graph-view.ts:24-31`), so
   the decision (frontier node, second node kind, or additive provenance) must
   give them an explicit disposition or they vanish with that envelope.
8. **(D4, then D5) The graph-native view form (§4).** Considerations the research
   surfaces: §4 sets out the three forms with their pros, risks, and proof needs.
   The type constraints (C1, P1) bind all three equally, so the forms differ on
   the eager-vs-lazy axis — where the structure lives and when it is built — not
   on type safety. The current BFS traversal
   (`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts:165-190`)
   is evidence for a possible traversal family, not a target to keep; any future
   breadth-first semantics must be re-derived from the ratified graph contract.
9. **(D4) Record the consumer-impact finding (corroborated below) as the hard
   gate before the D5 interface change lands.**

### Consumer-impact corroboration (for the D4 hard gate)

This research independently corroborates the plan's "zero external blast radius"
finding for the `GraphView` query-contract reshape:

- `graph-core`'s **own** barrels re-export the query types
  (`packages/core/graph-core/src/graph-view/index.ts:10-28`,
  `packages/core/graph-core/src/index.ts:60-78`) — in-package edits.
- The `graph-view/index.unit.test.ts` contract test hard-encodes the 7-op shape
  (`packages/core/graph-core/src/graph-view/index.unit.test.ts:115-136`) — to
  update with the reshape.
- The `graph-corpus-sdk` root barrel re-exports `GraphView`
  (`packages/sdks/graph-corpus-sdk/src/index.ts:17`) — likely an export-surface
  edit, not an extra runtime consumer.
- The EEF list tool imports the list-era surface
  (`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/execution.ts:20-43`:
  `SubgraphResult`, `loadEefCorpus`, `capForBudget`, projection, citations) —
  removed in the D5/D6 co-landing.
- `rank`/`explain`/`compare` are **type-only**
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/types.ts:67-202`) with no
  runtime callers — deletion touches only the barrel
  (`packages/sdks/graph-corpus-sdk/src/eef-strands/index.ts:66-79`) and any type
  test.

No external consumer (`graph-ingest`, `graph-project`, the empty `threads` stub)
touches the query contract — they consume only the RDF substrate. **The D4
reviewer should still re-verify this against the tree at execution time**
(verify-don't-trust); this report's reads were taken at `90af56ef`.

---

## Appendix — files read (this session, at `90af56ef`)

- **graph-core**: `graph-view/interface.ts`, `graph-view/types.ts`,
  `graph-view/index.ts`, `index.ts`.
- **graph-corpus-sdk/eef-strands**: `strand-lookup.ts`, `types.ts`,
  `eef-graph-model.ts`, `graph-view.ts`, `school-context.ts`, `loader.ts`,
  `selection.ts`, `index.ts`, `eef-toolkit.external-data.ts` (meta + head).
- **oak-curriculum-sdk/.../evidence-corpus**:
  `tools/eef-explore-evidence-for-context/{tool-definition,execution,projection,response-budget}.ts`,
  `citation-shape.ts`.
- **streamable-http app**: `eef-surface.ts`, `handlers.ts` (registration path).
- **Controlling plan**: `eef-graph-tool-completion.plan.md` (full).
- **Required read-first context verified in repair pass**:
  `eef-plan-architecture-reviewers.codex-brief.md`,
  `eef-d0-decontamination-ledger.md`, `../README.md`,
  `.agent/memory/operational/threads/eef.next-session.md`, `principles.md`,
  `schema-first-execution.md`.
