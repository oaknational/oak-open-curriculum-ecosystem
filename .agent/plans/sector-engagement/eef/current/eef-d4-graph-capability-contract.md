# EEF D4 graph capability contract — graph-native view, query surface, node/edge/provenance policy

The D4 artefact of
[`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md): the
ratified graph capability shape derived from the owner-ratified D3 MCP surface
([`eef-d3-mcp-contract.md`](eef-d3-mcp-contract.md)) and the D2 raw-data
foundation ([`eef-d2-source-path-table.md`](eef-d2-source-path-table.md)).
**Status: RATIFIED (owner, 2026-06-04)** — the value → MCP → graph derivation is
accepted (plan D4 acceptance), with `type-expert` + architecture review run that
session. This is a **non-code**
deliverable: it ratifies names, types, and policy. D5 builds the new graph-core
layer fresh as TDD cycles; D6 implements the two Zod calls. No source code
changes here.

Grounding rule ([`eef-corpus-grounding`](../../../../rules/eef-corpus-grounding.md)):
every corpus claim below cites an `EEF_TOOLKIT_DATA` source path (the
[D2 source-path table](eef-d2-source-path-table.md) is the canonical citation
surface); concepts that are the invoking agent's reasoning are tagged
**agent-side**; names this contract introduces (type names, edge-type literals,
node kinds) are tagged **contract-defined**. The contract derives **solely** from
the D3 consumer requirements and the D2 raw foundation (plan D4 Do).

## What D4 ratifies (the handoff scope)

D4 ratifies, as the handed-off set D3 named:

1. The **new domain-generic graph-core query surface** that replaces the live
   `GraphView` contract (parameterised over `TNode`, `TNodeId`, `TEdgeType`).
2. The **graph-native EEF view** in `graph-corpus-sdk`: node id/kind policy
   (a single `strand` node kind — decision B below), edge types, frontier/payload
   policy, and the provenance-envelope policy.
3. The **eight named schema-subset/schema-builder values** D3 handed off (the
   ninth, `eefGuidanceReportNodeSubset`, is retired by decision B — guidance
   reports travel inline in the member payload).
4. The **consumer-impact finding** (zero external blast radius + the in-package
   edit sites) as a named, reviewer-signed artefact.

D4 is complete when these are ratified by the owner, `type-expert`, and an
architecture reviewer (plan D4 Proof).

## EEF v1 is a homogeneous strand graph — guidance reports inline (decision B, owner-directed 2026-06-04)

EEF's graph is a **single node kind** (`strand`) with a **single edge type**
(`related_strand`): `TNodeId = EefStrandId` — homogeneous, no union, no second id
type. `related_guidance_reports` (7/30 strands; bare `{ title, url }` leaves, with
exactly one report shared corpus-wide) travel **inline in the strand member
payload**, **not** as a separate `guidance_report` node kind.

**Why (owner decision B, 2026-06-04):** the node-kind model bought negligible
token saving — it deduplicates exactly **one** shared report, and reports are
`{ title, url }` leaves with no body and no outgoing edges — and no v1 teacher
value beyond inline attribution, while carrying the entire heterogeneous-graph
machinery (a union `TNodeId`, a second id type, a second edge type, a second node
kind). Inline is token-equivalent and value-equivalent for v1 and keeps EEF a
clean homogeneous strand graph. **EEF is still a real graph** — `related_strand`
edges + frontier remain; only the report-node complication is removed.

**Deferred, and HOMED — this must not be dropped.** The **fundamental
heterogeneous node/edge model** (multiple node kinds, a node-id policy across
kinds, typed inter-kind edges) is therefore **not** defined by EEF D4. It is
deferred to, and explicitly owned by, the graph-tools substrate migration —
[`graph-tools-value-redesign.plan.md`](../../../connecting-oak-resources/knowledge-graph-integration/future/graph-tools-value-redesign.plan.md)
§"Heterogeneous node/edge model (scoped deliverable; core now, reconciliation at promotion)" (todo `define-heterogeneous-node-edge-model`, which carries the must-not-drop obligation).
That plan is the first point a multi-entity / value-driven graph is built; the
model MUST be defined there and MUST NOT be assumed-inherited from EEF (which
deliberately lacks it). The owner-directed enablement that the graph data objects
are built from bulk data and may be **reshaped for value** (bounded relevant
retrieval) is recorded there as the framing for that work.

## The new domain-generic graph-core query surface

D5 builds this fresh in `packages/core/graph-core/src/graph-view/`, replacing the
live contract (`interface.ts`, `types.ts`, `index.ts`). The contract MUST stay
domain-generic: parameterised over `TNode`, an associated `TNodeId extends
string`, and `TEdgeType extends string`; **no EEF- or MCP-specific type names in
the substrate** (ADR-041 / ADR-179).

**Why a polymorphic substrate contract is earned (not premature):** graph-core is
the designated domain-generic multi-corpus substrate (ADR-179), which forbids EEF-
or MCP-specific type names inside it. EEF needs its node ids and edge types to flow
to the boundary as `EefStrandId` / `'related_strand'`, but the live string-typed
contract (`interface.ts:62` `rootIds: readonly string[]`; `types.ts:86-88` edge
`source`/`type`/`target: string`) widens them to `string` and loses that type
information. Parameterising graph-core over `TNodeId`/`TEdgeType` is therefore the
**minimal closed shape** that gives EEF typed-id flow *without* putting an EEF name
in the substrate (ADR-179): the generality is forced by one real consumer plus the
substrate boundary, not opened speculatively. PDR-058 §Surface 2 (design
optionality) tests whether a concrete second instantiation is nameable in scope —
it is: the **prerequisite / prior-knowledge graph** (`get-prior-knowledge-graph`:
1,607 `unitSlug`-keyed unit nodes + 3,452 typed `prerequisiteFor` edges — a DAG,
verified this session) binds the same generic with distinct `TNodeId`/`TEdgeType`
(owner-confirmed 2026-06-04: the redesigned prerequisite **and** misconception
tools will be graph-based — genuine future `subgraph` consumers of this substrate —
sequenced *after* EEF's first delivery, which uses the current whole-graph tools
as-is; prior-knowledge is thus a confirmed-and-sequenced consumer, not yet wired). Two concrete instantiations with different type arguments
is the opposite of the Surface 2 anti-pattern (a generic where every call site
instantiates the same concrete type). D4 still adds **no** surface beyond what
these consumers use (Decision 6). `consolidate-at-third-consumer` governs
*extracting* shared mechanics across corpora and has **not** fired here (it
triggers at the third consumer); it is not the basis for this contract, and
primitive-consolidation across corpora stays a later, third-consumer decision.

**The substrate's value is bounded, relevant, token-efficient retrieval** — return
the subset the agent needs, never a whole corpus. The existing tools today return
their *entire* graph (misconception ~6MB, prior-knowledge ~1.8MB) — the token
problem the substrate exists to solve. `subgraph(rootIds, depth)` bounds by graph
locality; axis/attribute filtering bounds by selector; EEF's `evidenceForMove`
uses both (axis selectors resolve the relevant strand roots; the subgraph bounds
the neighbourhood).

**A simple graph is still a graph — form follows the bounding need, not a binary.**
A single-lane prerequisite chain is a valid `subgraph` consumer. The misconception
corpus is *currently* flat (`{ misconception, response, subject, keyStage,
lessonSlug, lessonTitle }` × 12,858, no ids/edges — verified this session), but
that is a **modelling choice, not an essential property**: it has latent
lesson/subject/key-stage structure that could be edged so `subgraph` bounds it, or
it can take a filter/select primitive — the migration decides per corpus by what
returns *relevant, token-bounded* results. The contract's guard is therefore not
"exclude non-graphs" but: **the substrate must not assume every corpus is a
`subgraph` consumer, and must not exclude a corpus for being a simple graph** —
the bounding mechanism is chosen from the retrieval value, per corpus.

Every operation is a real primitive D5 implements with logic + tests, or it is
absent (single invariant, plan Decision 6).

Preserved from the existing contract (not changed by D4): the ADR-041 placement
rationale, the `Result<T, E>` discipline (`subgraph` is fallible; `manifest` is a
plain value produced at construction time), the infallible-or-throw construction
contract. (The `DeepKeyPath`/`NodeProjection` projection types the old contract
carried were removed at execution together with the `projection?` parameter they
typed — see the Projection-deferred amendment below.)

**Generification — every node-id and edge-type field carries the new parameters**
(grounded against the live files this session):

| Surface (live file:line) | Field | Today | New contract |
| --- | --- | --- | --- |
| `interface.ts:62` | `subgraph` `rootIds` | `readonly string[]` | `readonly TNodeId[]` |
| `types.ts:86` | `SubgraphResult.edges[].source` | `string` | `TNodeId` |
| `types.ts:87` | `SubgraphResult.edges[].type` | `string` | `TEdgeType` |
| `types.ts:88` | `SubgraphResult.edges[].target` | `string` | `TNodeId` |
| `types.ts:94` | `SubgraphError` `SubgraphRootNotFound.rootId` | `string` | `TNodeId` |
| `types.ts:79` | `GraphManifest.sparseRelationsByNodeId` | `readonly string[]` | `readonly TNodeId[]` |
| `types.ts:74` | `GraphManifest.edgeTypes` | `readonly string[]` | `readonly TEdgeType[]` |

The last two are the **manifest** — node-id- and edge-type-bearing; they would
generify as shown **when** the migration re-adds `manifest()` for its consumers.
D5's fresh contract does not carry them (no EEF consumer — see the operations note
below). `SubgraphError.SubgraphDepthExceeded`
(`depth`/`limit`, both `number`) is unaffected. The EEF-consumed result/error
types carry `TNodeId`/`TEdgeType` all the way out — no `string` widening at the boundary.

**Operations (the minimal set EEF consumes, plan Decision 7 — no response cap):**

- `subgraph({ rootIds, depth }): Result<SubgraphResult<TNode,
  TNodeId, TEdgeType>, SubgraphError<TNodeId>>` — bounded BFS from roots:
  complete member nodes + all member edges; depth-bounded; root-not-found and
  depth-exceeded as `Result` errors at the external boundary. **This is the one
  graph-core primitive EEF consumes.**

> **Projection deferred (owner decision, 2026-06-05).** D5 execution dropped the
> runtime `projection?: NodeProjection<TNode>` parameter from `subgraph`. A
> field-narrowing projection that returns `SubgraphResult<TNode>` (`nodes:
> readonly TNode[]`) cannot be made type-honest under `no-type-shortcuts` — a
> trimmed node is statically a deep-`Partial`, so returning it as `TNode` needs a
> forbidden `as`/`Object.*`/`Record`, and a per-call projected return type would
> change this ratified signature. EEF consumes no projection (the binding exposes
> none, below), so per Decision 6 the operation is **absent** rather than
> dishonestly implemented. The `NodeProjection` / `DeepKeyPath` type utilities —
> which existed only to type that dropped parameter — were **removed** with it
> (2026-06-05 review): the named future consumer (the prior-knowledge DAG, owned
> by `graph-tools-value-redesign.plan.md`) uses bounded subgraph retrieval, not
> field projection, and `extending-graph-support-tooling.plan.md` records that a
> graph-core field-projection is not needed for EEF and only becomes live for a
> future corpus too large to return full nodes. A type-honest projection (and
> these utilities) can be reintroduced when such a consumer is built. See the D5
> plan's superseding note on condition C1.

`manifest()` / `GraphManifest` carry **no EEF consumer** (verified this session:
no D3 surface reads them — the resource's strand index is projected directly from
the corpus, not from a manifest). Per Decision 6 they are **out of the EEF (D5)
operation set** and D5 does not build them. Their plausible consumers are the
sequenced migration tools, which return a whole graph + `stats` (the existing
`MisconceptionGraphStats` / `PriorKnowledgeGraphStats`) — a manifest/full-listing
shape, not a subgraph query. Because D5 rebuilds the contract fresh and EEF does
not consume `manifest()`, the new `GraphView` does **not** include it and D5
carries no dormant `GraphManifest` type; the migration plan re-adds and owns both
when its first consumer is built (homed there, not left open here).

No `rank`/`explain`/`compare` primitives exist (the speculative `EvidenceCorpus`
op types + `NotImplementedYet` were removed in D2; `eef-strands/types.ts` is
deleted — confirmed gone from HEAD this session). No primitive is added that the
EEF consumer does not use.

### Export-disposition table (`graph-view`)

Every current export of `graph-core/src/graph-view/` (grounded against the live
barrel `index.ts:10-17` this session), with its D4 disposition. A surviving old
name is justified from the new contract alone (replace-don't-bridge — no
compatibility shim, no wrapper).

| Export | Today | D4 disposition |
| --- | --- | --- |
| `GraphView<TNode>` | `interface.ts:58` | **Deleted and re-defined** as `GraphView<TNode, TNodeId, TEdgeType>` carrying the threaded ids |
| `SubgraphResult<TNode>` | `types.ts:83` | **Deleted and re-defined** as `SubgraphResult<TNode, TNodeId, TEdgeType>` (edge `source`/`target` → `TNodeId`, `type` → `TEdgeType`) |
| `SubgraphError` | `types.ts:93` | **Deleted and re-defined** as `SubgraphError<TNodeId>` (`rootId` → `TNodeId`) |
| `GraphManifest` | `types.ts:72` | **Absent from the D5 fresh contract** — no EEF consumer (Decision 6 / PDR-058 §Surface 2). The migration plan re-adds and owns `manifest()`/`GraphManifest` (generified as `GraphManifest<TNodeId, TEdgeType>`: `sparseRelationsByNodeId` → `TNodeId[]`, `edgeTypes` → `TEdgeType[]`) when its first consumer is built; D5 carries no dormant manifest surface |
| `NodeProjection<TNode, Depth>` | `types.ts` (removed) | **Removed (2026-06-05)** — existed only to type the dropped `projection?` parameter; no consumer (Projection-deferred amendment) |
| `DeepKeyPath<T, D>` | `types.ts` (removed) | **Removed (2026-06-05)** — same reason |

The barrel re-export list (`graph-view/index.ts` and the root barrel
`index.ts`) drops `GraphManifest` and the now-removed `DeepKeyPath` /
`NodeProjection` utilities; the surviving `GraphView` / `SubgraphResult` /
`SubgraphError` signatures change as tabled. D5 rebuilds the contract test
(`graph-view/index.unit.test.ts`) to instantiate the new generic parameters (its
`GraphView<FixtureNode>` binding and the `SubgraphResult`/`GraphManifest` stub
break under the new arity). D5's fresh rebuild of the contract files themselves
(`interface.ts`, `types.ts`, `index.ts`) carries their TSDoc with it — the
`interface.ts` `@example` and the `types.ts` header comment currently carry the
pre-generification signature; they are part of the rebuilt contract, not separate
consumer sites.

**Projection and the EEF `TNode`:** with the `projection?` parameter and the
`DeepKeyPath`/`NodeProjection` utilities removed (above), the union-distribution
concern (a deep path valid for only one kind of a heterogeneous `TNode`) is moot
for EEF v1; it becomes relevant only if a future heterogeneous model reintroduces
projection (flagged in the migration plan's node/edge-model section). The EEF
binding operations expose no caller-facing `projection` parameter.

## The graph-native EEF view contract (`graph-corpus-sdk`)

Owner package: `graph-corpus-sdk` (never the substrate — ADR-179 / ADR-041 keep
MCP- and EEF-specific shapes downstream of graph-core). The view is a
**deterministic typed projection** over `EefStrand`, `EefStrandById`,
`EefStrandId`, and the derived edge facts — never broad `string` ids, generic
node payloads, or JSON-like records (plan D5 Do; enforced there, named here).

### Node id/kind policy (single kind)

One node kind: `strand`. `TNodeId = EefStrandId` (`strands[number].id`, 30/30 →
the existing `EefStrandId`). The node payload is the strand's V1 field set (below),
which now carries `related_guidance_reports` inline. There is **no** second node
kind and **no** second id type (decision B). The heterogeneous node-kind model is
deferred and homed in the migration plan (see the decision-B section above).

### Edge types (contract-defined `TEdgeType` literal)

`TEdgeType = 'related_strand'` — a single edge type; EEF binds graph-core's generic
`TEdgeType` to this one value.

| Edge type | source → target | corpus source | cardinality |
| --- | --- | --- | --- |
| `related_strand` | `EefStrandId → EefStrandId` | `strands[number].related_strands` → `relatedStrandEdges` (`RelatedStrandEdge`) | 17/30 strands carry relations |

`relatedStrandEdges` already exists in D2 (`raw-domains.ts`, `RelatedStrandEdge {
source: EefStrandId; target: EefStrandId }`). Guidance reports are **not** edges
(decision B); they travel inline in the strand payload.

### Member payload / reference / frontier policy

- **Strand node payload** = the owner-ratified **V1 set** (D3 output contract,
  2026-05-31 extended 2026-06-03), preserved as `EefStrandById[Id]` or a named
  derived projection of it — never re-narrowed to a loose record:
  - Floor (30/30): `id`, `name`, `slug`, `eef_url`, `headline` (the six universal
    fields — `impact_months` incl. `null` on 4/30, `cost_rating`, `cost_label`,
    `evidence_strength_rating`, `evidence_strength_label`, `headline_summary` —
    plus `headline.number_of_studies` where the corpus carries it, 2/30; a distinct
    `school_context_relevance.number_of_studies` on 2 other strands travels whole
    inside that field, not here), `definition`, `key_findings`, `tags`.
  - Sparse (optional, presence per corpus): `effectiveness` (7/30; `summary`,
    `mechanisms`), `implementation` (4/30; `key_considerations` 4/30,
    `common_pitfalls` 2/30, `digital_technology_application` 1/30),
    `school_context_relevance` (17/30, travels whole; incl.
    `behind_the_average_by_phase` 4/30, `applications` 2/30), `behind_the_average`
    (6/30), `closing_the_disadvantage_gap` (2/30), `related_guidance_reports`
    (7/30; `{ title, url }[]` — **inline per decision B**, deduped within a
    strand, not a separate node kind).
  - **Optionality is dictated by the graph-native view type** — a field optional
    in the view (because the corpus carries it on a subset) is optional in the
    schema via the `satisfies` tie (D6), derived at the point of use, never
    counted or classified (D2 table preamble). Honest absence: a floor-only
    strand returns the floor with richer fields omitted, never fabricated.
- **Subgraph membership** = complete member nodes + all member edges (plan D4
  Do); **no response cap** (plan Decision 7).
- **Frontier refs** = refs to related strands **outside** the members, carrying
  `EefStrandId` (`strands[number].related_strands`); **derived by the EEF
  binding** as the `related_strand` edge targets not present in the returned
  member set (D5 traversal tests, per the D3 output table).
- **The evidence envelope is a binding-layer type** (`graph-corpus-sdk`,
  `eefEvidenceEnvelopeSubset`), **distinct from graph-core's generic
  `SubgraphResult`**. It carries `members` (from `SubgraphResult.nodes` — strand
  nodes, payload incl. inline `related_guidance_reports`), `edges` (from
  `SubgraphResult.edges` — `related_strand`), the
  binding-derived `frontier`, and `provenance`. **graph-core's `SubgraphResult`
  is NOT extended with a `frontier` or `provenance` field** — both are EEF
  concerns and live in the binding, so the substrate stays domain-generic
  (ADR-179 / ADR-041). This is the one place the generic result type and the EEF
  output shape are explicitly reconciled.

### Provenance-envelope policy

Once per envelope (additive teacher value, not a freshness obligation): source
attribution + corpus caveats, nothing else.

| Envelope field | corpus source | D2 projection |
| --- | --- | --- |
| source attribution | `meta.source`, `meta.licence` | `corpusMeta` field access |
| caveats | `meta.caveats` | `corpusCaveats` |

`data_version` / `last_updated` are **excluded** — internal debugging/logging
metadata per the ratified D1 V2 decision; they carry no governance or freshness
semantics and do not enter `structuredContent` (D6's telemetry wiring is their
home). Per-strand `eef_url` + envelope source attribution satisfy the corpus
licence obligation (`meta.licence.attribution_note`).

## The eight bound names

Each name D3 handed off, bound to its graph-native meaning and D2 source. Decision
B **retires the ninth** (`eefGuidanceReportNodeSubset`) — guidance reports are
inline in the member payload, so they fold into `eefEvidenceEnvelopeSubset` (name
5). These are the schema-subset/schema-builder values D3/D6 consume; D6 implements
the two Zod calls over them.

| # | Name (contract-defined) | Graph-native meaning | D2 source / cardinality |
| --- | --- | --- | --- |
| 1 | `eefStrandIdSubset` | the strand-key domain (subgraph roots, lookup inputs) | `EefStrandId` ← `strands[number].id` (30/30) |
| 2 | `eefObservedPhaseSubset` | observed phase filter domain | `ObservedPhase` ← `…school_context_relevance.most_relevant_phases` (17/30) |
| 3 | `eefObservedKeyStageSubset` | observed key-stage filter domain | `ObservedKeyStage` ← `…most_relevant_key_stages` (17/30) |
| 4 | `eefObservedPrioritySubset` | observed priority filter domain | `ObservedPriority` ← `…most_relevant_priorities` (17/30) |
| 5 | `eefEvidenceEnvelopeSubset` | the envelope shape: member payload (incl. inline `related_guidance_reports`, 7/30) + `related_strand` edge set + frontier refs | the strand V1 payload + `related_strand` edges + frontier (rows above) |
| 6 | `eefProvenanceSubset` | source attribution + corpus caveats | `meta.source` / `meta.licence` / `meta.caveats` |
| 7 | `eefToolInputSchemaSource` | typed source for the single input Zod call — the strand-key + observed-domain types | names 1–4 |
| 8 | `eefToolOutputSchemaSource` | typed source for the single output Zod call — the envelope type | names 5–6 |

(**Retired by decision B:** `eefGuidanceReportNodeSubset` — `related_guidance_reports` is now part of the member payload in name 5, not a separate node subset.)

Schema-builder rule (D3 Decision 2, restated): `inputSchema` and `outputSchema`
each derive from their source by **one** Zod call, `satisfies`-tied to the
payload type; each root serialises to `type: object`; these two declarations are
the only Zod in the EEF graph stack; they live in the curriculum MCP consumer
layer, never in the substrate (ADR-179). Named D6 hazard preserved:
`members[].headline.impact_months` carries the corpus value `null` (4/30) **and**
the negative literal `-2` (1/30 — `eef-tl-repeating-a-year`), so its **value** type
is `z.nullable(z.number())` with **no** lower bound — never `z.optional(...)`, and
never `z.number().min(0)` / `.nonnegative()` (either would reject the `-2`).
Value-nullability and field-optionality are orthogonal, never collapsed into one call.

## The minimal operation set (serves every D3 surface)

Each operation is a real primitive D5 implements with logic + tests, or it is
absent (single invariant, plan Decision 6). The **tool** is the only D3 primitive
that calls graph operations; the **resource** is static text + the corpus-cited
strand index, and the **prompt** is a template — neither calls a graph operation.

| Layer | Operation | Serves | Derivation |
| --- | --- | --- | --- |
| graph-core | `subgraph({ rootIds, depth })` | both tool functions | the generic bounded-BFS primitive (the one graph-core primitive EEF consumes; `manifest()` is not EEF-consumed — see above; `projection?` deferred 2026-06-05, see the operations note) |
| EEF binding | `inspectStrand(strandId: EefStrandId)` | tool `inspect-strand` | single-root subgraph over the strand id (the view's own node index resolves the root; no separate `strandById` call needed) → members + edges + frontier |
| EEF binding | `evidenceForMove(selectors)` | tool `evidence-for-move` | resolve `{ strandIds?, phase?, keyStage?, priority? }` to an `EefStrandId` root set, then subgraph-around-roots |
| EEF binding | axis resolution (internal) | `evidence-for-move` selectors | match observed-axis values to `EefStrandId` via `school_context_relevance` (agent-side move→strand selection is **not** performed — Decision 10) |

`inspectStrand(id)` and `evidenceForMove({ strandIds: [id] })` return the same
envelope at cardinality one — the two exist because they are D3's two named
operations (total by-id lookup; axis evidence query); the overlap is stated, not
hidden (D3 contract). **agent-side**: naming the pedagogical move and choosing
which strands it maps to is the invoking agent's reasoning (Decision 10) — no
operation performs it.

## Consumer-impact finding (reviewer-signed; hard gate)

The interface change in D5 has **zero external-consumer blast radius** and a
**bounded, fully-enumerated** in-package edit set. Grounded by repo-wide grep
this session.

**Zero external blast radius:** `graph-ingest` and `graph-project` import only the
RDF substrate (`graph-core/term`, `/dataset`, `/data-factory`, `/jsonld`) — never
the query contract. No file under `apps/` references any query-contract type. No
other package consumes `GraphView`/`SubgraphResult`/`SubgraphError`/`NodeProjection`/
`DeepKeyPath`/`GraphManifest`.

**Three in-package / cross-package edit sites** (the plan's "Done when" named only
the first two; the third is added here):

1. `packages/core/graph-core/src/index.ts:60-67` (six symbols today on lines
   61-66) — root-barrel re-export of the query types: `GraphManifest` is dropped
   (a deletion, not a signature change), leaving five names whose signatures
   change.
2. `packages/core/graph-core/src/graph-view/index.unit.test.ts` — the
   contract test (`DeepKeyPath` array-stop discipline + the `GraphView<FixtureNode>`
   implementation-contract test, whose `SubgraphResult`/`GraphManifest` stubs
   break under the new generic arity). D5 rebuilds it.
3. `packages/sdks/graph-corpus-sdk/src/index.ts:14` — `export type { GraphView }
   from '@oaknational/graph-core/graph-view'`. **The site the plan omits.** The
   re-export survives by name; its TSDoc (`index.ts:1-12`) describes `GraphView`
   as a foundational type and may need a light touch when the signature changes.

**No fourth site:** the `T7a-b` / WS4.5 instantiation-contract test against the
real `EefStrand` `TNode` referenced by the contract-test TSDoc **does not exist**
(grep-confirmed — graph-corpus-sdk carries only the raw-data tests + the barrel
re-export); it is future D5 work, not a current consumer.

## Handoff to D5 (what D4 hands forward)

D5 (TDD cycles) builds: the new generic graph-core query layer (the table above);
the graph-native EEF view (single `strand` node kind, `related_strand` edges,
payload incl. inline `related_guidance_reports`, provenance) as a direct typed
projection over `EefStrand`/`EefStrandById`/`EefStrandId`; the EEF binding
operations; the envelope constructor; the compile-time tests proving
`TNodeId = EefStrandId` / `TEdgeType = 'related_strand'` flow (graph-core fixtures
over `TNodeId = string` via a fresh generic `makeNode`; EEF tests over the real
corpus only). D6 implements the two Zod calls (`eefToolInputSchemaSource`,
`eefToolOutputSchemaSource`) and the MCP composition module.

## Non-claims (restated as contract)

No server-side or plan-authored mapping from Oak signal category, pedagogical
move, misconception, prerequisite, quiz, text, subject, or topic to `EefStrandId`
exists anywhere in this surface. The graph returns exactly what the corpus holds
for the finite keys it is given; relevance judgement, ranking, and move→strand
selection are the invoking agent's reasoning (Decision 10). `rank`/`explain`/
`compare` are not primitives. No stub or placeholder surface exists — every
exported graph-core operation and EEF binding operation is backed by real
graph-derived logic and tests, or it is absent (single invariant, Decision 6).
