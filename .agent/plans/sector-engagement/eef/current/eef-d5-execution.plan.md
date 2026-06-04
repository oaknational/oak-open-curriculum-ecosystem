---
title: "EEF D5 execution — graph-core generic query layer + graph-native EEF view (TDD cycles)"
status: current
lane: current
type: executable
thread: eef
date: 2026-06-04
owner_scope: >-
  Executable, cycle-level elaboration of the D5 deliverable in
  eef-graph-tool-completion.plan.md, authored for next-session execution.
  D5 builds the new domain-generic graph-core query layer
  (GraphView<TNode, TNodeId, TEdgeType>, subgraph-only) and the graph-native
  EEF view (single strand node kind, related_strand edges, inline guidance
  reports, provenance envelope), per the owner-ratified D4 contract
  (eef-d4-graph-capability-contract.md). This plan does NOT re-open D4: the
  names, types, node/edge policy, operation set, and consumer-impact finding
  are settled. It adds the one layer the deliverable spec leaves open — the
  ordered TDD cycle decomposition with per-cycle files, acceptance, and
  deterministic validation. Authored by Windward Gliding Squall (claude/Opus
  4.8); reviewed 2026-06-04 by Iridescent Drifting Star (pair-reviewer) plus
  type-expert / assumptions-expert / architecture-expert-fred — all conditions
  incorporated (see Review disposition).
readiness: "READY FOR EXECUTION — reviewer conditions incorporated 2026-06-04; landing-discipline reconciled to the parent plan (D5 lands in ONE green commit)."
todos:
  - id: ws1-1-generify-graph-core-contract
    content: "graph-core: delete and re-define the graph-view query contract carrying the new generic parameters. interface.ts -> GraphView<TNode, TNodeId extends string, TEdgeType extends string> with subgraph() only (manifest() removed). types.ts -> SubgraphResult<TNode, TNodeId, TEdgeType> (edges source/target -> TNodeId, type -> TEdgeType), SubgraphError<TNodeId> (rootId -> TNodeId; SubgraphDepthExceeded unchanged, depth/limit stay number); GraphManifest deleted; DeepKeyPath and NodeProjection retained unchanged; stale `GraphView<TNode, TEdgeType>` header comment fixed. Barrels: graph-view/index.ts drops GraphManifest, AND the graph-core root barrel graph-core/src/index.ts:61-66 drops its `type GraphManifest` re-export line (a deletion, not a signature change); graph-corpus-sdk/src/index.ts:14 TSDoc light touch. index.unit.test.ts REBUILT to the new arity: keep the DeepKeyPath array-stop and NodeProjection blocks (TNode-only, unaffected); rewrite the GraphView implementation-contract block to bind a stub GraphView<FixtureNode, string, string> with subgraph ONLY (no manifest, no GraphManifest stub); refresh the file TSDoc and ALL describe/it labels to describe the rebuilt subgraph-only contract (drop the manifest / T7a / WS4.4 / graph-stack.plan.md provenance language — replace-don't-bridge applies to the file's own documentation, not just its code). No compatibility shim; no old name retained without fresh D4 justification."
    status: pending
    depends_on: []
  - id: ws1-2-generic-bfs-machinery
    content: "graph-core: build the domain-generic bounded-BFS machinery backing the subgraph primitive as a generic factory createGraphView<TNode, TNodeId extends string, TEdgeType extends string>(input) -> GraphView<TNode, TNodeId, TEdgeType>. Input: a node set, an edge set whose element type is { readonly source: TNodeId; readonly type: TEdgeType; readonly target: TNodeId }, and an id-accessor typed (node: TNode) => TNodeId (NEVER => string — a string return widens the whole id-flow). subgraph only; no list/manifest/stats/filter (factory stays no bigger than the ratified operation set). Keep the per-call subgraph error surface to EXACTLY D4's two variants (SubgraphRootNotFound, SubgraphDepthExceeded) — add no new subgraph error kind (D4 not re-opened). CONSTRUCTION-time input validation (per the construction contract — fail/throw before exposing the view): duplicate node ids FAIL construction; an edge whose source or target is absent from the node id set FAILS construction (protects the graph-native view from silent corpus drift). Reconciles with Decision 9: construction is infallible for the VALID fixed corpus (the WS2.1 construction test proves no dupes/dangling), so the guard fires only on malformed input/drift. CALL-time subgraph semantics: depth 0 = roots only plus member edges whose endpoints are both in the returned member set; depth 1 = roots plus one outgoing-hop target layer plus all member edges among returned members; a root absent from the node set = SubgraphRootNotFound (Result err); an isolated root (present, no outgoing edges) = ok with the single member node, NOT an error; depth outside [0, MAX] (negative OR above max) = SubgraphDepthExceeded (Result err — reuse the ratified variant, no new kind). Co-land structural tests over a synthetic node via a fresh generic makeNode (TNodeId = string): one per call-time semantic above, plus construction-validation tests (duplicate id fails; dangling edge fails) and cycle / sparse-root. No EEF/MCP names (ADR-179). Every operation real-with-tests or absent (Decision 6). The factory signature is CONFIRMED by type-expert + Iridescent (2026-06-04, see Review disposition) — this gate is satisfied."
    status: pending
    depends_on: [ws1-1-generify-graph-core-contract]
  - id: ws2-1-graph-native-eef-view
    content: "graph-corpus-sdk: build the graph-native EEF view as a deterministic typed projection over EefStrand / EefStrandById / EefStrandId + relatedStrandEdges, instantiating createGraphView<EefStrand, EefStrandId, 'related_strand'>. The edge input MUST inject the literal edge type the D2 RelatedStrandEdge lacks: relatedStrandEdges.map((e) => ({ ...e, type: 'related_strand' as const })) — RelatedStrandEdge carries only source/target, and the `as const` keeps TEdgeType inferring as the literal, not widening to string. Node payload = the ratified V1 field set (full EefStrandById[Id] or a named derived projection; related_guidance_reports inline per Decision B). Construction infallible for data shape; only an unknown root id fails at the request boundary. Tests over REAL corpus members only: a graph-constructor test over the whole corpus; a subgraph over pinned literal roots returns complete member nodes + all member edges as literal id sets (e.g. roots ['eef-tl-feedback'] depth 1 -> members {eef-tl-feedback, eef-tl-metacognition-and-self-regulation, eef-tl-mastery-learning}). Compile-time proof names the SPECIFIC expectTypeOf assertions (compilation alone does NOT prove non-widening — SubgraphResult<EefStrand, string, string> also compiles): (1) expectTypeOf(result.value.edges[0].type).toEqualTypeOf<'related_strand'>(); (2) expectTypeOf(result.value.edges[0].source).toEqualTypeOf<EefStrandId>(); (3) an assertion on the SubgraphError SubgraphRootNotFound rootId being EefStrandId."
    status: pending
    depends_on: [ws1-2-generic-bfs-machinery]
  - id: ws3-1-inspect-strand-and-envelope
    content: "graph-corpus-sdk: build inspectStrand(strandId: EefStrandId) -> single-root subgraph, plus the binding-layer evidence-envelope constructor (eefEvidenceEnvelopeSubset): members (from SubgraphResult.nodes) + edges (related_strand) + binding-derived frontier (related_strand targets outside the member set, carrying EefStrandId) + provenance (corpusMeta source/licence + corpusCaveats, once per envelope; data_version/last_updated EXCLUDED). graph-core SubgraphResult is NOT extended with frontier/provenance (ADR-179). Tests over real corpus: a rich strand (eef-tl-feedback) and a floor-only strand (eef-tl-repeating-a-year, headline impact_months -2, no school_context_relevance, no related_strands) returning the floor with richer fields omitted, never fabricated; a frontier test pinned to roots ['eef-tl-setting-and-streaming'] depth 0 -> members {eef-tl-setting-and-streaming}, frontier {eef-tl-within-class-attainment-grouping} (its sole related strand, outside the member set — a definition-robust non-empty frontier); a provenance-on-envelope test asserting source/licence/caveats present and data_version/last_updated absent."
    status: pending
    depends_on: [ws2-1-graph-native-eef-view]
  - id: ws3-2-evidence-for-move-axis-resolution
    content: "graph-corpus-sdk: build evidenceForMove(selectors: { strandIds?, phase?, keyStage?, priority? }) -> resolve axis selectors to an EefStrandId root set via school_context_relevance.most_relevant_phases / most_relevant_key_stages / most_relevant_priorities, then subgraph-around-roots, returning the WS3.1 envelope. No server-side move->strand mapping (Decision 10). Tests over real corpus pin literal id sets for worked axis queries, and assert the reachable-by-axis property BY DERIVATION not a hard-coded count: the set of EefStrandIds reachable by any axis selector equals the set of strands where school_context_relevance is present (filter over EEF_TOOLKIT_DATA.strands at test time; happens to be 17/30) — so floor-only strands such as eef-tl-repeating-a-year are reachable only by inspectStrand / strandIds. inspectStrand(id) and evidenceForMove({ strandIds: [id] }) return the same envelope at cardinality one (overlap stated, not hidden)."
    status: pending
    depends_on: [ws3-1-inspect-strand-and-envelope]
---

# EEF D5 execution — graph-core generic query layer + graph-native EEF view

## Context

D0–D4 of the EEF graph tool are complete and owner-ratified. D4
([`eef-d4-graph-capability-contract.md`](eef-d4-graph-capability-contract.md),
RATIFIED 2026-06-04) settled the graph capability shape as a **non-code**
contract: names, types, node/edge/provenance policy, the minimal operation
set, and the consumer-impact finding. D5 is the **build** — it constructs that
contract fresh as TDD cycles. The master plan
([`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md) §D5)
carries the deliverable spec (Do / Done-when / Proof); this plan adds the one
layer it leaves open: the **ordered, atomic TDD cycle decomposition** an
executor follows next session, with per-cycle files, acceptance, and
deterministic validation.

This plan is **read-grounded, not relayed**: the author read the D4 contract,
the D5 spec, the live `graph-core/src/graph-view` files, the
`graph-corpus-sdk/src/eef-strands` D2 foundation, `@oaknational/result`, and the
EEF corpus first-hand, and verified every corpus cardinality the contract
asserts against the data (see §Grounded facts inherited). It was then reviewed
2026-06-04 by Iridescent Drifting Star (pair-reviewer), type-expert,
assumptions-expert, and architecture-expert-fred; all conditions are
incorporated (see §Review disposition).

**This plan does NOT re-open D4.** The generic parameterisation, the
homogeneous-strand-graph (Decision B), the `subgraph`-only / no-`manifest`
decision (Decision 6), the eight bound names, and the three-site / zero-external
consumer-impact finding are settled.

## Landing discipline (one green commit)

Per the parent plan's §Risk Assessment
([`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md):1737-1738):
**"D5 is a large atomic replacement, so it must land in one green commit rather
than a sequence that leaves the tree broken between commits."** This plan honours
that ratified discipline: the five TDD cycles below are the **authoring
structure and internal red→green checkpoints** (each authored test-first and
brought green during development), but **D5 lands as ONE green commit** — the
delete-and-redefine of the graph-core contract and its first consumer travel
together so history carries no intermediate "green-but-unconsumed-new-contract"
state. This stays TDD-correct (test and product code co-land in the one commit;
no lag-shape), and satisfies the atomic-landing invariant (the landed commit is
green). The cycle-level "Proof" commands below are the developer's per-checkpoint
gates, not separate commit boundaries.

## End goal, mechanism, means

- **End goal.** A teacher-facing assistant can be served bounded, relevant EEF
  evidence (a focused subgraph, not the whole corpus) on a pedagogical move —
  the value root D1 ratified. D5 builds the graph layer that makes that
  possible; D6 composes it onto the MCP surface; D7 proves the value.
- **Mechanism.** A domain-generic `GraphView<TNode, TNodeId, TEdgeType>`
  query layer in `graph-core` (the ADR-179 multi-corpus substrate) gives EEF
  typed `EefStrandId` / `related_strand` flow to the boundary without putting an
  EEF name in the substrate; the EEF binding in `graph-corpus-sdk` projects the
  fixed corpus into that view and wraps results in the evidence envelope.
- **Means.** Five serial TDD cycles (below): generify the graph-core contract,
  build the generic BFS machinery, build the graph-native EEF view, then the two
  EEF binding operations + envelope — landed as one green commit.

## Authoritative references (read before executing; do not duplicate here)

- [`eef-d4-graph-capability-contract.md`](eef-d4-graph-capability-contract.md) —
  the ratified contract. Authoritative for names, types, the generification
  table, node/edge/provenance policy, the operation set, and the
  consumer-impact finding.
- [`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md) §D5 +
  §Risk Assessment — the deliverable spec (Do / Done-when / Proof), the ten
  Ratified Decisions, and the one-green-commit landing discipline.
- [`eef-d2-source-path-table.md`](eef-d2-source-path-table.md) — every corpus
  field's source path, cardinality, and proof test.
- [`eef-d3-mcp-contract.md`](eef-d3-mcp-contract.md) — the MCP surface D6 builds
  on top of D5 (boundary context only; D5 builds no MCP surface).

## Grounded facts inherited (verified first-hand this session)

- **Live graph-core contract** (`packages/core/graph-core/src/graph-view/`):
  `GraphView<TNode>` is single-parameter, with `manifest()` + `subgraph()`.
  `SubgraphResult<TNode>` edges are `{ source, type, target }: string`;
  `SubgraphError.rootId: string`; `GraphManifest` present and re-exported by the
  graph-core root barrel (`src/index.ts:61-66`); `DeepKeyPath` / `NodeProjection`
  are `TNode`-only. `@oaknational/result` is `{ ok, value } | { ok, error }` with
  `ok` / `err` constructors. The contract test (`index.unit.test.ts`) has three
  blocks; the GraphView-implementation block stubs `manifest()` + `subgraph()`
  and its TSDoc/labels reference the prior `T7a` / `WS4.4` / `graph-stack`
  provenance — all rebuilt under the new arity in WS1.1.
- **Zero external blast radius**, three in-package edit sites: the graph-core
  root barrel, the contract test, and `graph-corpus-sdk/src/index.ts:14`
  (`export type { GraphView }`). `graph-ingest` / `graph-project` consume only
  the RDF substrate; no `apps/` file references the query contract;
  the `oak-curriculum-sdk` workspace (package name `@oaknational/curriculum-sdk`
  — directory ≠ package name) has no graph-core/graph-corpus-sdk dependency.
- **D2 foundation present and green** (`graph-corpus-sdk/src/eef-strands/`):
  `EefStrand = (typeof EEF_TOOLKIT_DATA.strands)[number]`, `EefStrandId`,
  `EefStrandById`, `isValidStrandKey`, `strandById`; `RelatedStrandEdge
  { source: EefStrandId; target: EefStrandId }` — **no `type` field** (WS2.1
  injects `'related_strand'`) — and `relatedStrandEdges`; observed/declared
  domains + `declaredVsObservedDivergence`; `corpusMeta`, `corpusCaveats`,
  `corpusMethodology`, `lastUpdated`.
- **Corpus cardinalities (grep-verified against the `as const` data)**: 30
  strands; `related_strands` 17/30; `school_context_relevance` 17/30;
  `effectiveness` 7/30; `implementation` 4/30 (`common_pitfalls` 2/30,
  `digital_technology_application` 1/30); `behind_the_average` 6/30;
  `behind_the_average_by_phase` 4/30; `applications` 2/30;
  `closing_the_disadvantage_gap` 2/30; `related_guidance_reports` 7/30;
  `impact_months: null` 4/30; `impact_months: -2` exactly 1/30
  (`eef-tl-repeating-a-year`). `number_of_studies` 4× total = 2 `headline` + 2
  `school_context_relevance` (consistent with the contract's split).
- **Worked anchors for pinned tests**: `eef-tl-feedback` (rich; edges to
  `eef-tl-metacognition-and-self-regulation` + `eef-tl-mastery-learning`),
  `eef-tl-repeating-a-year` (floor-only), and the reciprocal
  `eef-tl-setting-and-streaming` ↔ `eef-tl-within-class-attainment-grouping`
  pair (used for the WS3.1 frontier anchor).

## Key design decision (D5-owned; CONFIRMED 2026-06-04)

The D4 contract ratifies `subgraph` as "the generic bounded-BFS primitive...
the one graph-core primitive EEF consumes," and the master plan sites the
structural-traversal tests "with the domain-generic machinery in graph-core...
over `TNodeId = string` via a generic `makeNode`." That implies graph-core owns
a **reusable generic BFS implementation**, exercised generically by the
`makeNode` tests and instantiated by the EEF binding. The shape (WS1.2) is a
generic factory `createGraphView<TNode, TNodeId extends string, TEdgeType
extends string>(input): GraphView<TNode, TNodeId, TEdgeType>`, taking the node
set, the typed edge set (element `{ source: TNodeId; type: TEdgeType; target:
TNodeId }`), and an id-accessor `(node: TNode) => TNodeId`. It is the minimal
closed shape for the two named consumers (EEF now; the prerequisite/prior-
knowledge DAG next, PDR-058 §Surface 2) and adds no operation beyond `subgraph`
(Decision 6).

**CONFIRMED 2026-06-04** — Iridescent (pair-reviewer) and type-expert both
endorsed this factory over an EEF-local interface-only implementation: the
structural tests are graph-core-owned, so interface-only would strand the BFS
machinery outside the place D4 assigns it and make the graph-core tests
artificial. Reviewer-confirmed caveats (all enforced as WS1.2 acceptance):
graph-core-only, no EEF/MCP names; edge endpoints `TNodeId` + `type` `TEdgeType`
(never broad `string`); minimal — `subgraph` only, no list/manifest/stats/
filter; the D6 "do not extract a generic corpus-tool factory until a second
consumer exists" warning is about MCP composition, **not** the D5 graph-core
traversal constructor. The WS1.2 factory-signature gate is therefore satisfied.

## Workstreams and cycles

Each cycle is authored test-first and brought green as an internal checkpoint;
all five land together in **one green commit** (see §Landing discipline). The
chain is **serial by genuine dependency** (the EEF binding consumes the
graph-core generic, which must exist first); there is no invented parallelism.
Files a cycle must not touch: any `graph-ingest` / `graph-project` RDF-substrate
file, any MCP/`apps/` surface (D6), and `eef-toolkit.external-data.ts` (pure
data, logic-free by inspection).

### WS1 — graph-core: generic query contract + BFS machinery

**Cycle 1.1 — generify the contract surface.** Delete-and-redefine the
`graph-view` types per the D4 generification table; rebuild the contract test to
the new arity (stub `subgraph`, no `manifest`).

- Files: `packages/core/graph-core/src/graph-view/{interface,types,index}.ts`,
  `packages/core/graph-core/src/index.ts` (delete the `type GraphManifest`
  re-export line at 61-66), `packages/sdks/graph-corpus-sdk/src/index.ts` (TSDoc
  touch), `packages/core/graph-core/src/graph-view/index.unit.test.ts`.
- Done when: graph-core type-checks; the contract test compiles and passes
  against `GraphView<TNode, TNodeId, TEdgeType>`; **`GraphManifest` / `manifest`
  appear nowhere in `graph-view/` AND nowhere in the graph-core root barrel
  (`src/index.ts`)**; the rebuilt test file's TSDoc and all describe/it labels
  describe the subgraph-only contract (no manifest / T7a / WS4.4 / graph-stack
  language); `DeepKeyPath` / `NodeProjection` unchanged; no compatibility shim.
- Proof (`unit`, internal checkpoint): `pnpm --filter @oaknational/graph-core
  type-check` + `test`, plus `pnpm --filter @oaknational/graph-corpus-sdk
  type-check` + `lint` (the cross-package TSDoc touch).

**Cycle 1.2 — generic bounded-BFS machinery** (depends on 1.1). Build the
confirmed `createGraphView` factory (§Key design decision) and its structural
tests over `makeNode`, with the traversal/error semantics pinned in the
frontmatter todo.

- Files: a new `graph-view` implementation module + its `*.unit.test.ts`; barrel
  export added.
- Done when: construction-time validation (duplicate id fails; dangling edge
  fails) AND every call-time semantic (depth 0 / depth 1 membership + the
  member-edge rule, root-not-found = err, isolated root = ok single member,
  depth outside [0, MAX] = SubgraphDepthExceeded) plus cycle / sparse-root are
  proven over synthetic `makeNode` (`TNodeId = string`); the per-call subgraph
  error surface is EXACTLY D4's two variants (no new kind); the edge element
  type and id-accessor return type are as specified (no widening); every
  operation is real-with-tests (Decision 6); no EEF/MCP name (ADR-179).
- Proof (`unit`, internal checkpoint): `pnpm --filter @oaknational/graph-core
  test` + `type-check`.

### WS2 — graph-corpus-sdk: graph-native EEF view

**Cycle 2.1 — graph-native EEF view** (depends on 1.2). Project the D2 raw
foundation into the node/edge representation (injecting `type: 'related_strand'
as const` on the edges) and instantiate
`createGraphView<EefStrand, EefStrandId, 'related_strand'>`.

- Files: a new `eef-strands` view module + its `*.unit.test.ts`; `index.ts`
  export + barrel TSDoc updated for the new public surface.
- Done when: a graph-constructor test over the real corpus passes; a subgraph
  over pinned literal roots returns complete members + all member edges as
  literal id sets; the node payload preserves the V1 field set with
  `related_guidance_reports` inline; the **named** id-flow `expectTypeOf`
  assertions (WS2.1 todo (1)–(3)) pass. Tests use real corpus members only — a
  synthetic `EefStrand` is a category error.
- Proof (`unit` over the real corpus, internal checkpoint):
  `pnpm --filter @oaknational/graph-corpus-sdk test` + `type-check`.

### WS3 — graph-corpus-sdk: EEF binding operations + envelope

**Cycle 3.1 — inspectStrand + evidence envelope** (depends on 2.1).

- Done when: `inspectStrand(strandId: EefStrandId)` returns the envelope
  (members + `related_strand` edges + binding-derived frontier + provenance);
  the floor-only strand returns its floor with richer fields omitted; the pinned
  frontier test (`['eef-tl-setting-and-streaming']` depth 0 → frontier
  `{eef-tl-within-class-attainment-grouping}`) passes non-vacuously; the
  provenance test confirms `corpusMeta` source/licence + `corpusCaveats` once per
  envelope and `data_version` / `last_updated` absent; `graph-core`
  `SubgraphResult` is not extended with frontier/provenance.
- Proof (`unit`, internal checkpoint): `pnpm --filter
  @oaknational/graph-corpus-sdk test`.

**Cycle 3.2 — evidenceForMove + axis resolution** (depends on 3.1).

- Done when: `evidenceForMove({ strandIds?, phase?, keyStage?, priority? })`
  resolves axis selectors to an `EefStrandId` root set via
  `school_context_relevance.most_relevant_*` then subgraphs around them; pinned
  worked axis queries return literal id sets; the reachable-by-axis property is
  asserted **by derivation** (the reachable set equals the
  `school_context_relevance`-present set, filtered over `EEF_TOOLKIT_DATA` at
  test time — not a hard-coded 17); no server-side move→strand mapping exists
  (Decision 10); `inspectStrand(id)` and `evidenceForMove({ strandIds: [id] })`
  agree at cardinality one.
- Proof (`unit` over the real corpus, internal checkpoint): `pnpm --filter
  @oaknational/graph-corpus-sdk test`.

## Quality gates

Per [`quality-gates`](../../../templates/components/quality-gates.md): during
authoring, each cycle's internal checkpoint runs its focused workspace test plus
`pnpm --filter <workspace> type-check` and `pnpm --filter <workspace> lint`
(WS1.1 also runs the graph-corpus-sdk `type-check` + `lint` for its TSDoc
touch). Before the single D5 commit, run the canonical aggregate `pnpm check`
(and before any push). Every gate must pass; there is no acceptable failure.

## Acceptance / proof contract

D5 is done when all five cycles' acceptance holds in the one green commit AND the
D5 Done-when ids in the master plan are proven. Proof levels: WS1.1/1.2 and
WS2.1's id-flow proof are `unit` (incl. compile-time `expectTypeOf`);
WS2.1/3.1/3.2 corpus behaviour is `unit` over real corpus members — where
"integration" appears it means real-corpus `*.integration.test.ts` cases that
run **within the single `pnpm --filter @oaknational/graph-corpus-sdk test` run**
(the repo has no separate integration runner; no undeclared prerequisite). Final
acceptance command:
`pnpm --filter @oaknational/graph-core test` +
`pnpm --filter @oaknational/graph-corpus-sdk test` +
`pnpm --filter @oaknational/curriculum-sdk test` + `pnpm type-check`
(graph-core added per review — WS1 changes it most; the curriculum-sdk run is
defensive — its package name is `@oaknational/curriculum-sdk`, NOT
`@oaknational/oak-curriculum-sdk`, which matches no project: directory ≠ package
name, verified by `pnpm --filter`. The D4 consumer-impact finding establishes
zero query-contract consumption there, so any failure is a signal). TDD evidence is test-first per
cycle; retrospective coverage is not D5 TDD evidence.

## Prerequisite classification

- **Blocking**: D2 (typed raw foundation) and D4 (ratified contract) — both
  `completed`. The WS1.2 `createGraphView` factory signature is a **blocking
  prerequisite for WS1.2** (not the whole plan) — getting it wrong after WS2+
  build on it forces partial re-work of WS2/WS3, breaking the single-commit
  green chain, so it is not a trivial revisit. **SATISFIED 2026-06-04**:
  type-expert + Iridescent confirmed the shape.
- **Beneficial**: none outstanding.

## Non-goals (YAGNI)

D6 (MCP composition, the two Zod calls, registration behind
`OAK_CURRICULUM_MCP_EEF_ENABLED`); D7 (round-trip proof); `manifest()` /
`GraphManifest` (no EEF consumer — re-added by the graph-tools redesign plan
when its first consumer is built); the heterogeneous node/edge model (owned by
the redesign plan's `define-heterogeneous-node-edge-model` todo); exact-value
metric filters (`eef-tool-metric-filter-inputs.plan.md`, after D7); any change to
the live `get-prior-knowledge-graph` / `get-misconception-graph` tools; `rank` /
`explain` / `compare` primitives.

## Risk assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| The graph-core machinery shape was wrong | Resolved | `createGraphView` confirmed by type-expert + Iridescent 2026-06-04 |
| `TEdgeType` widens to `string` (D2 edges carry no `type`) | Med | WS2.1 injects `type: 'related_strand' as const`; the named `expectTypeOf` assertion on `edges[0].type` proves non-widening |
| Id-flow proof passes vacuously ("it compiles") | Med | WS2.1 names the three specific `expectTypeOf` assertions; compilation alone is explicitly insufficient |
| Axis query reaching only the 17 scr-strands read as a bug | Low | WS3.2 asserts it by derivation as an intended property; the resource (D3) carries the 30-strand index — out of D5 scope |
| Accidentally surfacing `data_version` / `last_updated` | Low | WS3.1 provenance test asserts their absence |
| Conservation reflex (preserving deleted list-era shape, re-adding `manifest`) | Med | replace-don't-bridge + Decision 6 are cycle acceptance criteria, applied to the test file's own docs too; deleted code is deletion-evidence only |
| Implementer adds a new `subgraph` error variant for dupe/dangling/negative-depth, exceeding D4 | Med | WS1.2 pins these as construction-time validation + reuse of SubgraphDepthExceeded; the per-call error surface is a Done-when assertion = exactly D4's two variants |

## Foundation alignment

- [`principles.md`](../../../../directives/principles.md): replace-don't-bridge,
  no fallbacks/compat layers, architectural correctness over expediency.
- [`testing-strategy.md`](../../../../directives/testing-strategy.md) +
  [`tdd-as-design.md`](../../../../directives/tdd-as-design.md): TDD cycle is the
  authoring unit; tests describe system states; structural tests use synthetic
  fixtures, corpus-grounded tests use real members only; no global state, no
  skipped/conditional tests.
- [`schema-first-execution.md`](../../../../directives/schema-first-execution.md):
  the `as const` corpus is the schema; types derive by `typeof` / indexed access;
  the only runtime narrowing is `isValidStrandKey`.
- Governing rules: ADR-179 (no MCP/EEF names in graph-core), ADR-041 (dependency
  direction), PDR-058 §Surface 2 (earned generic), `use-result-pattern`,
  `no-type-shortcuts` (no `as`/`any`; `as const` is the sanctioned const
  assertion), `lint-after-edit`, `no-skipped-tests`, `no-conditional-tests`,
  `no-global-state-in-tests`, and `eef-corpus-grounding` (cite-or-tag; derive
  counts, never hard-code).

## Plan-body first-principles check

Per [`plan-body-first-principles-check`](../../../../rules/plan-body-first-principles-check.md):
the **shape** clause fired at the WS1.2 factory-signature decision (the closed
shape is confirmed, not opened to speculative configurability). The
**landing-path** clause is honoured by the single-green-commit discipline
(authored test-first, no persistent red). The **vendor-literal** clause does not
fire (no vendor call shapes; the corpus is a local `as const`).

## Readiness reviewers (verdicts recorded)

- **Iridescent Drifting Star** (owner-assigned pair-reviewer) — verdict
  CONCERNS; all four points resolved (lifecycle contradiction, graph-core proof,
  factory-gate hardening, BFS depth semantics). Plus a factory-shape assessment
  endorsing `createGraphView`.
- **type-expert** — READY-WITH-CONDITIONS; all four conditions incorporated.
- **assumptions-expert** — READY-WITH-CONDITIONS; conditions incorporated, with
  one example corrected (see Review disposition).
- **architecture-expert-fred** — READY-WITH-CONDITIONS; all conditions
  incorporated; ADR-179 / ADR-041 / PDR-058 / Decision 6 / replace-don't-bridge
  compliance affirmed.

## Review disposition (2026-06-04; each finding critically assessed before accepting)

- **Lifecycle: D5 = one commit, not per-cycle commits** (Iridescent, BLOCKING) —
  VERIFIED TRUE against the parent plan §Risk Assessment (1737-1738). Resolved:
  §Landing discipline; cycles are internal checkpoints.
- **GraphManifest must be deleted from the graph-core ROOT barrel, not just
  graph-view** (type-expert, assumptions, fred — 3× convergent) — accepted; WS1.1
  Done-when + files extended.
- **Rebuilt contract-test TSDoc + describe/it labels must drop manifest / T7a /
  WS4.4 / graph-stack provenance** (fred; assumptions noted the prose/todo
  contradiction) — accepted; WS1.1 rebuild scope + the misleading "no behaviour
  change yet" prose corrected.
- **Factory edge-element type + `type: 'related_strand' as const` injection**
  (type-expert; reinforced by Iridescent's no-broad-string caveat) — accepted;
  WS1.2 edge element type + WS2.1 projection step specified.
- **Id-flow proof needs named `expectTypeOf` assertions ("it compiles" is
  insufficient)** (type-expert) — accepted; WS2.1 names the three assertions.
- **Id-accessor return type `(node: TNode) => TNodeId`, never `=> string`**
  (type-expert) — accepted into WS1.2.
- **Factory confirmation = hard gate, not "beneficial"** (Iridescent, assumptions,
  fred — 3× convergent) — accepted; reclassified blocking-for-WS1.2 and marked
  SATISFIED.
- **graph-core missing from final acceptance** (Iridescent) — accepted; added.
- **"integration" label has no separate runner** (assumptions, fred — convergent)
  — accepted; clarified as `*.integration.test.ts` within the single test run.
- **Pin BFS depth/error semantics** (Iridescent) — accepted; pinned in WS1.2.
- **WS3.1 frontier anchor under-specified** (assumptions) — accepted in core, but
  the cited example ("`eef-tl-feedback` depth 1 frontier is empty") is imprecise
  against the D4 frontier definition (frontier = *any member's* related targets
  outside the member set, so feedback depth 1 is non-empty). Pinned a
  definition-robust anchor instead: `eef-tl-setting-and-streaming` depth 0 →
  frontier `{eef-tl-within-class-attainment-grouping}`.
- **WS3.2 17/30 derivation-grounded not hard-coded** (assumptions) — accepted.
- **WS1.1 quality gate must include graph-corpus-sdk** (assumptions) — accepted.
- **graph-corpus-sdk barrel TSDoc fuller update by WS2/WS3** (fred) — accepted
  into WS2.1 files.
- **Duplicate-id / dangling-edge are CONSTRUCTION-time validation, not new
  `subgraph` error variants; depth-out-of-range reuses SubgraphDepthExceeded**
  (Iridescent, 2026-06-04 follow-up) — VERIFIED against the D4 contract's
  two-variant error surface and ACCEPTED; it also improved on the draft (which
  said "dangling edge excluded, does not throw") — failing construction guards
  against silent corpus drift. Reconciled with Decision 9 (infallible for valid
  data; guard fires only on malformed input). Incorporated into WS1.2 todo +
  Done-when.
- **Final-acceptance package filter `@oaknational/oak-curriculum-sdk` matches no
  project** (Iridescent, 2026-06-04 revision) — VERIFIED first-hand: the package
  name is `@oaknational/curriculum-sdk` (directory `oak-curriculum-sdk` ≠ package
  name; `pnpm --filter @oaknational/oak-curriculum-sdk` reports "No projects
  matched"). The sharpest catch of the cycle: type-expert AND fred both used the
  dir-name filter (fred claimed "confirmed in package.json"), so THREE reviewers
  converged on the wrong name — convergence is not proof; only Iridescent's
  empirical filter-run found it. Fixed in §Acceptance + §Grounded facts.
  **NOTE:** the parent plan (`eef-graph-tool-completion.plan.md`:1340) carries
  the same stale filter — flagged to the owner for a separate fix (outside this
  plan's claim scope).

## Learning loop & lifecycle triggers

Per [`lifecycle-triggers`](../../../templates/components/lifecycle-triggers.md):
session entry runs `start-right-*` and reads active claims/comms; the
work-shape declaration is this `current/` plan; pre-edit coordination is the open
`eef` plan-kind claim. On completion, mine outcomes into the master plan (flip the
`d5-graph-construction-methods` todo) and run the consolidation workflow; D5
completion unblocks D6.
