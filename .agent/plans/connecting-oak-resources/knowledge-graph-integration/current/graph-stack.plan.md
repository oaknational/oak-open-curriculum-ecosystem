---
name: "Graph Stack — Topology and Foundation Increment"
overview: "Establish a layered, standards-based graph capability for Oak — seven active graph workspaces plus one deferred — with the foundation increment ingesting the Oak Curriculum Ontology Threads graph end-to-end as the first attached corpus. Reserves space for every layer in `.agent/research/graph-library.research.md` and provides the spine that subsequent graph-shaped work attaches to."
status: current
graph_layer: substrate
graph_portfolio_index: "../../../graph-portfolio-index.md"
parent_plan: "../active/open-education-knowledge-surfaces.plan.md"
first_graph_work: "Oak Ontology Threads proof in graph-corpus-sdk: enumerate curric:Thread and resolve inverse curric:includesThread Unit lookup with a tiny fixture-backed test."
sibling_plans:
  - "graph-query-layer.plan.md"
  - "oak-kg-threads-surface.plan.md"
  - "../active/graph-resource-factory.plan.md"
  - "../active/misconception-graph-mcp-surface.plan.md"
  - "../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md"
  - "../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md"
specialist_reviewer: "architecture-expert-betty, architecture-expert-fred, architecture-expert-barney, type-expert, code-expert, test-expert, docs-adr-expert, assumptions-expert"
isProject: true
todos:
  - id: ws0-topology-adr
    content: "WS0: Author ADR for the Graph Stack topology decision; record supersession/coordination map for adjacent plans"
    status: pending
  - id: ws1-graph-core-scaffold
    content: "WS1.1: Scaffold packages/core/graph-core workspace (TS, esbuild, vitest, README, exports skeleton). One commit, tree green."
    status: pending
    sub_increment: 1a
  - id: ws1-rdf-term-quad
    content: "WS1.2: RDF Term hierarchy (NamedNode/BlankNode/Literal/DefaultGraph) + Quad type; type tests + equality. One commit, tree green."
    status: pending
    depends_on: [ws1-graph-core-scaffold]
    sub_increment: 1a
  - id: ws1-dataset-core
    content: "WS1.3: DatasetCore-compatible interface (RDF/JS aligned); add/has/match unit tests. One commit, tree green."
    status: pending
    depends_on: [ws1-rdf-term-quad]
    sub_increment: 1a
  - id: ws1-jsonld-expand
    content: "WS1.4: JSON-LD 1.1 expand wrapper (versioned adapter); test against a known SKOS document fixture."
    status: pending
    depends_on: [ws1-dataset-core]
    sub_increment: 1a
  - id: ws1-jsonld-compact-frame
    content: "WS1.5: JSON-LD 1.1 compact + frame wrappers; round-trip test."
    status: pending
    depends_on: [ws1-jsonld-expand]
    sub_increment: 1a
  - id: ws1-canon
    content: "WS1.6: RDF dataset canonicalisation; deterministic output for equivalent datasets."
    status: pending
    depends_on: [ws1-dataset-core]
    sub_increment: 1a
  - id: ws1-vocab-registry
    content: "WS1.7: Vocabulary registry data tables (schema.org, RDFS, SKOS, PROV-O, DCMI, OWL, SHACL, Oak Curriculum Ontology, EEF custom IRIs); lookup + reverse-lookup tests."
    status: pending
    depends_on: [ws1-graph-core-scaffold]
    sub_increment: 1a
  - id: ws1-graph-document
    content: "WS1.8: GraphDocument + GraphNode + GraphEdge ergonomic surface over Dataset; unit tests against a fixture dataset."
    status: pending
    depends_on: [ws1-dataset-core, ws1-vocab-registry]
    sub_increment: 1a
  - id: ws2-ingest-scaffold
    content: "WS2.1: Scaffold packages/libs/graph-ingest workspace."
    status: pending
    depends_on: [ws1-graph-document]
    sub_increment: 1a
  - id: ws2-jsonld-compatible
    content: "WS2.2: jsonld-compatible ingestion mode (JSON with @context/@id/@type or inferable LD shape) plus generic Turtle/SKOS parse-to-dataset support; test against a generic SKOS fixture."
    status: pending
    depends_on: [ws2-ingest-scaffold]
    sub_increment: 1a
  - id: ws2-source-mapping
    content: "WS2.3: SourceMapping primitives (JSON Pointer + JSONPath); source path preserved end-to-end."
    status: pending
    depends_on: [ws2-jsonld-compatible]
    sub_increment: 1a
  - id: ws3-project-scaffold
    content: "WS3.1: Scaffold packages/libs/graph-project workspace."
    status: pending
    depends_on: [ws1-graph-document]
    sub_increment: 1a
  - id: ws3-property-graph
    content: "WS3.2: toPropertyGraph projection (nodes/edges with labels/properties); round-trip test."
    status: pending
    depends_on: [ws3-project-scaffold]
    sub_increment: 1a
  - id: ws3-adjacency
    content: "WS3.3: adjacency primitives — incoming/outgoing/neighbours/match; tests against fixture."
    status: pending
    depends_on: [ws3-property-graph]
    sub_increment: 1a
  - id: ws4-graph-corpus-sdk-scaffold
    content: "WS4.1: Scaffold packages/sdks/graph-corpus-sdk workspace with a typed corpus-adapter boundary; no Oak-specific ontology mapping before the SDK boundary exists."
    status: pending
    depends_on: [ws3-adjacency, ws2-source-mapping]
    sub_increment: 1b
  - id: ws4-oak-ontology-thread-adapter
    content: "WS4.2: Oak Curriculum Ontology Threads adapter inside graph-corpus-sdk (generic Turtle/RDF/SKOS parsing via graph-ingest; curric:Thread enumeration and curric:includesThread inverse-edge mapping here); deterministic extraction test against the pinned straight-copy ontology raw import."
    status: pending
    depends_on: [ws4-graph-corpus-sdk-scaffold, ws1-vocab-registry]
    sub_increment: 1b
  - id: ws4-query-proof
    content: "WS4.3: Prove the Oak Curriculum Ontology Threads adapter end-to-end via graph-corpus-sdk's typed query surface (Thread enumeration plus Unit->Thread inverse-edge lookup; no MCP wiring in this cycle — surfacing is a consumer decision, see §Surfacing)."
    status: pending
    depends_on: [ws4-oak-ontology-thread-adapter]
    sub_increment: 1c
  - id: ws5-coordination-amendments
    content: "WS5: Amend graph-query-layer.plan.md, oak-kg-threads-surface.plan.md, practice-graph-payoff-peak-pilot.plan.md, and the parent open-education-knowledge-surfaces.plan.md to reference this spine."
    status: pending
    depends_on: [ws4-query-proof]
  - id: ws6-docs-propagation
    content: "WS6: README updates (collection, monorepo, contributing); LICENCE-DATA.md ontology section update; Mark Hodierne author addition. ADR-123 is not amended because this increment ships no MCP primitives."
    status: pending
    depends_on: [ws5-coordination-amendments]
  - id: ws7-quality-gates
    content: "WS7: Full quality gate chain on the integrated foundation increment."
    status: pending
    depends_on: [ws6-docs-propagation]
  - id: ws8-adversarial-review
    content: "WS8: Specialist reviewer dispatch (assumptions, betty, fred, barney, type, mcp, docs-adr); document findings; create follow-on if BLOCKER."
    status: pending
    depends_on: [ws7-quality-gates]
---

# Graph Stack — Topology and Foundation Increment

**Last Updated**: 2026-05-11 — Schedule-not-trigger doctrine sweep applied to §Increments table (Inc.2–7 trigger framings converted to scheduled positions or named open decisions), Status block (D-4a strike), Promotion Trigger intro, Surfacing prose, Layer Map row §6, Coordination map graph-query-layer cell; new §Genuine Open Decisions section added (O-1 topology ADR approval; O-2 increment promotion ownership); combinatorial-arc cross-plan "design stability" trigger removed (relocated to `graph-combinatorial-arc.plan.md`'s own Promotion Trigger). Prior 2026-05-11 update: Inc.1 decomposed into sub-increments 1a (substrate scaffolding) / 1b (Threads adapter) / 1c (query proof) plus closure, with file-scope-non-overlapping boundaries and explicit parallel-safety annotations; D-4 BLOCKERs verified closed.
**Status**: 🟡 PLANNING — opens to ACTIVE when the gates listed in §Promotion Trigger close. D-4a (ADR-041 workspace-tiers amendment) was closed 2026-05-11 by the graduation-candidates-drain session and is no longer a blocker; the remaining gate is owner approval of the WS0 topology ADR (see §Genuine Open Decisions).
**Scope**: Establish a layered, standards-based graph capability for Oak as a backbone of seven active graph workspaces plus one deferred, then ship the foundation increment ingesting the Oak Curriculum Ontology Threads graph end-to-end as the first attached corpus.

---

## Strategic Priority

Graphs are now a first-class concern of this repository. The single coherent capability is:

> **Oak ships a layered, standards-based graph capability that knits curriculum content, curriculum structure, and pedagogical evidence into a navigable, citation-grade, AI-accessible graph; demonstrates the same primitive on Oak's own engineering practice; and positions the stack as open-education infrastructure.**

This plan establishes the topology that capability lives in, and ships the smallest end-to-end slice that proves it.

The plan reserves explicit workspace homes for every layer in
[`.agent/research/graph-library.research.md`](../../../../research/graph-library.research.md).
No layer is foreclosed; every layer either ships in this increment or is
sequenced into a named follow-on increment.

---

## Context

### Today's State

The repository has *no graph infrastructure* in the substrate sense — what exists is graph-shaped MCP exposure inside `oak-curriculum-sdk` (the resource factory plus the prerequisite, misconception, and thread-progressions adapters) and the queued `GraphView` query-layer plan. Each is a property graph by construction, derived deterministically from typed bulk data; none rests on a canonical RDF-compatible model, none uses ontology IRIs as identity, none can compose across corpora without bespoke alignment.

The Oak Curriculum Ontology already publishes RDF/OWL/SKOS/SHACL with stable IRIs and SHACL CI validation, but is consumed only as an *idea* — no current code path ingests its triples directly.

### What Changes

The foundation increment introduces a layered substrate. The Oak Curriculum Ontology Threads graph becomes the first corpus attached to that substrate, giving the MVP's `oak-kg-*` Thread surface a real ontology-backed foundation.
Every subsequent graph-shaped artefact — including the work queued in
[`graph-query-layer.plan.md`](graph-query-layer.plan.md), the eventual
EEF and misconception graph rewrites, the cross-source journeys, and the
Practice graph pilot — attaches to this spine.

The NC knowledge taxonomy is not part of this MVP foundation increment. It remains owned by its own plan and can attach to the substrate later only if the owner promotes that work separately.

### Corpus source authority

Different graph corpora enter the stack through different source-authority
paths:

- Oak Curriculum Ontology data comes from the source-of-truth
  `oaknational/oak-curriculum-ontology` GitHub repository as pinned,
  straight-copy Turtle/SHACL raw material.
- EEF strand data comes from the repository-held EEF Toolkit JSON snapshot,
  which is canonical for implementation until EEF clarifies whether future
  refreshes should come from a public download/API endpoint or direct supply.
- Oak misconception data is constructed inside this repository from Oak bulk
  data as part of bulk-data processing. The misconception graph is generated
  bulk-derived material, not an external raw corpus.

---

## Design Principles

1. **Stable-wire, RDF 1.2-native internals.** The canonical internal data model is RDF 1.2 (triple terms first-class in `graph-core`'s `Term` union; see [`graph-library.research.md` §4](../../../../research/graph-library.research.md)). Wire emission uses stable W3C standards (JSON-LD 1.1, RDF 1.1-compatible quads, SHACL 1.0); triple-term annotations *project* to `RelationshipRecord` on JSON-LD 1.1 emit (research §8). Emerging standards (JSON-LD 1.2, SPARQL 1.2, SHACL 1.2) become adapter upgrades inside `graph-future` driven by named tripwires ([research §19](../../../../research/graph-library.research.md#19-standards-evolution-tripwires) and ADR-173). No tripwire is silently skipped; each becomes a named follow-on plan when triggered.
2. **Ontology identity as the spine.** Adapters in `graph-corpus-sdk` mint or honour Oak Curriculum Ontology IRIs as canonical node identity. Cross-corpus joins are structurally cheap because the join key is shared.
3. **Property-graph as projection, not canon.** The canonical internal model is an RDF-compatible quad dataset. Property-graph nodes/edges are *projections* (per research §11). This preserves migration headroom while keeping the developer-facing API ergonomic.
4. **Enhancement is explicit and inspectable.** Every derived claim — stable ID, predicate mapping, type inference, link detection, relationship record, provenance attribution — is recorded as an `EnhancementRecord` (research §7) with optional confidence. Silent semantic corruption is structurally prevented.
5. **Validation distinguishes structure from meaning.** JSON Schema validates raw input shape; SHACL validates graph semantics. Both live in `graph-validate`; neither replaces the other (research §9).
6. **Framework-vs-consumer separation, strictly.** Per ADR-154: `graph-core`, `graph-jsonld`-equivalent modules, `graph-canon`, and `graph-vocab` carry no consumer knowledge. `graph-ingest`, `graph-enhance`, `graph-validate`, `graph-project` carry general-purpose policy. `graph-corpus-sdk` is the curriculum corpus-specific consumer; `agent-graphs/practice-graph` is the practice-facing consumer outside substrate package tiers.
7. **Public-asset discipline.** Every workspace below `graph-corpus-sdk` is publishable as open-education infrastructure. No Oak-specific identifiers leak into the substrate.

**Non-Goals (YAGNI)**:

- A live serving layer (Neo4j, Stardog, GraphDB). Direct ontology use is the baseline (per `oak-ontology-graph-opportunities.strategy.md`); serving platforms are evaluated only after the direct-use path proves value.
- LLM-derived semantic edges or embedding-based relationships in the substrate. The research's enhancement model permits explicit confidence-tagged inferences; the foundation increment ships only deterministic mappings.
- A new MCP server. The curriculum MCP server consumes `graph-corpus-sdk`; Practice may eventually grow its own internal MCP/CLI surface, but not in this plan.
- SPARQL endpoint exposure. `graph-future` will host a SPARQL adapter when a consumer needs it.
- Whole-repo graphing for Practice. The Practice pilot's curated allow-list discipline is preserved.

---

## Build-vs-Buy Attestation

The substrate depends on three external libraries; each is a deliberate buy.

| Concern | First-party option surveyed | Decision |
|---|---|---|
| JSON-LD 1.1 processing | [`jsonld.js`](https://github.com/digitalbazaar/jsonld.js) (W3C reference, MIT) | **Adopt as default processor inside `graph-core`'s versioned adapter.** Bespoke JSON-LD is not warranted; the spec is large and the reference implementation is canonical. The adapter shape (research §12) lets a leaner alternative slot in later. |
| RDF dataset canonicalisation | [`rdf-canonize`](https://github.com/digitalbazaar/rdf-canonize) (BSD-3) | **Adopt inside `graph-core/canon` module.** Canonicalisation is a precise spec; bespoke is high-risk for a substrate primitive. |
| SHACL validation | [`rdf-validate-shacl`](https://github.com/zazuko/rdf-validate-shacl) (Comunica family) | **Adopt inside `graph-validate` behind the `ShapeValidator` adapter (research §12 SHACL seam).** Bespoke SHACL is forbidden. |

No bespoke wrappers. The adapter-shape discipline (research §12) keeps every dependency replaceable behind a versioned interface.

**RDF/JS data-model alignment risk (tracked under tripwire #2)**: our internal `TripleTerm` shape (research §4) is authored ahead of an RDF/JS WG formalisation of RDF 1.2 data-model types. If the eventual published spec differs from ours, `graph-core`'s `Term` union migrates to match — a typed refactor confined to a single workspace, with no cross-workspace blast radius by design. Mitigation today: keep `TripleTerm` minimal (matches the RDF 1.2 abstract syntax exactly, no extras) so divergence is structurally impossible to amplify. See [research §19 — tripwire #2](../../../../research/graph-library.research.md#tripwire-2--rdfjs-wg-formalises-an-rdf-12-data-model-extension).

`assumptions-expert` runs against this attestation pre-ExitPlanMode (see Reviewer Scheduling).

---

## Topology Decision

The graph stack is **seven active graph workspaces plus one deferred**:

| # | Workspace | Tier | Carries (research §13) | Role |
|---|---|---|---|---|
| 1 | `packages/core/graph-core/` | core | `graph-core` + `graph-jsonld` + `graph-canon` + `graph-vocab` | Substrate. Term / Quad / Dataset (RDF/JS-aligned), JSON-LD 1.1 expansion+compaction+framing, RDF dataset canonicalisation, vocabulary registry. Pure, no I/O. |
| 2 | `packages/libs/graph-ingest/` | lib | `graph-ingest` | Six ingestion modes (research §6): `strict-jsonld`, `jsonld-compatible`, `plain-json-tree`, `records`, `node-edge-list`, `custom-mapping`; generic Turtle/SKOS parse-to-dataset support. Source mapping via JSON Pointer + JSONPath. No Oak-specific corpus mapping. |
| 3 | `packages/libs/graph-enhance/` | lib | `graph-enhance` | Stable IRI minting, predicate mapping, type inference, link detection. `EnhancementRecord` discipline (research §7). `RelationshipRecord` migration bridge (research §8). |
| 4 | `packages/libs/graph-validate/` | lib | `graph-validate` | JSON Schema (raw shape) + SHACL (graph meaning) wrappers. Validation report shape stable across SHACL versions (research §9). |
| 5 | `packages/libs/graph-project/` | lib | `graph-project` | Property-graph projection, adjacency-list, neighbours/match/traverse primitives, visualisation/export hooks (research §10, §11). |
| 6 | `packages/sdks/graph-corpus-sdk/` | sdk | (Oak-specific consumer) | Oak's typed corpus adapters: Oak Curriculum Ontology Threads graph, prerequisite, misconception, EEF strands, plus future corpora. **Cross-corpus join primitives.** Uses ontology IRIs as canonical identity. |
| 7 | `agent-graphs/practice-graph/` | agent graph | (Practice-specific consumer) | Markdown-corpus graph for Oak's engineering practice. Built on the same stack, owned adjacent to agent tooling, and wired by the future `agent-graphs/` organisation plan. |
| 8 | (deferred) `packages/libs/graph-future/` | lib | `graph-future` | RDF 1.2 / JSON-LD 1.2/1.3 / SPARQL 1.2 / SHACL 1.2 adapters. **Workspace not created until a consumer needs one of these specs**; the adapter seams (research §12) live inside `graph-core`, `graph-validate`, and `graph-project` from day one. |

This is the topology in full. No layer is missing; no layer is collapsed in a way that forecloses its later activation.

`agent-graphs/practice-graph/` is deliberately adjacent to `agent-tools/`
rather than under `packages/libs/`. It is the seventh active graph workspace: a
practice-facing consumer that proves the substrate over repository memory,
owned by the agent-tooling/practice plan estate. The future organisation/wiring
plan is
[`../../../agent-tooling/future/agent-graphs-workspace-organisation.plan.md`](../../../agent-tooling/future/agent-graphs-workspace-organisation.plan.md).

**Every graph workspace in the topology is MCP-agnostic.** None of the graph substrate workspaces ship MCP tool definitions, MCP resource constants, or MCP-server registration code. Surfacing graph capability through MCP — if Oak chooses to do so — is a *consumer-side* concern handled by the existing curriculum SDK MCP module plus the curriculum MCP HTTP app, or by a future consumer workspace that imports `graph-corpus-sdk`. See §Surfacing.

---

## Surfacing — MCP and Other Surfaces

The graph stack is infrastructure. How (or whether) graph capability is surfaced to humans, agents, or other systems is a separate decision tracked outside this plan.

Possible surfaces, none privileged by the topology:

- **In-process library imports** — application code imports `graph-corpus-sdk` directly. Always available; the default for any same-runtime consumer.
- **CLI** — the existing `agent-tools/` workspace exposes commands over `agent-graphs/practice-graph` (per the Practice pilot's existing plan). A future curriculum-side CLI could do the same over `graph-corpus-sdk`.
- **MCP** — at most one consumer surface owns each graph MCP primitive. If Oak chooses MCP exposure, it lives in the existing curriculum SDK MCP module plus the curriculum MCP HTTP app, or in a new sibling that imports `graph-corpus-sdk`. The graph workspaces themselves stay MCP-clean.
- **HTTP/JSON-LD export** — `graph-project` emits JSON-LD profiles for cross-organisation consumption as part of Inc.5 (see §Increments).
- **Search-augmentation** — Oak's Elasticsearch integration may consume `graph-corpus-sdk` to project graph-derived signals into search indices. If the search team requests this, the owner authors a new plan at that point; this plan does not schedule the work.

**Discipline**: no graph workspace ships MCP-shaped code. Tool definitions, resource constants, and registration helpers live with the existing curriculum MCP consumer surface (the SDK MCP module plus HTTP app) or a future app-facing adapter, not with the graph SDK that produces the data. If a graph workspace starts wanting an MCP type or factory, that is the signal to extract a thin consumer adapter workspace — not to leak MCP into the substrate.

The foundation increment ships zero MCP exposure. Oak Curriculum Ontology Threads availability through `graph-corpus-sdk`'s typed query surface is the proof that the substrate works end-to-end. Whether to surface it through the curriculum MCP server is a follow-on decision handled by the MVP slice plan, with or without this spine in flight.

---

## Layer Map (research → workspace)

The mapping is exhaustive against [`.agent/research/graph-library.research.md`](../../../../research/graph-library.research.md):

| Research section | Workspace | Notes |
|---|---|---|
| §1 stable foundation | `graph-core` (vocab + jsonld + canon modules), `graph-validate` (SHACL wrapper) | Every standard in §1 has a home. |
| §2 active state of newer standards | `graph-future` (deferred) + adapter seams across `graph-core`/`graph-validate`/`graph-project` | The seams ship; the workspace is created on first consumer demand. |
| §3 core design position | Plan-level: encoded in §Design Principles above. | Every workspace inherits the stable-first commitment. |
| §4 canonical internal model (Term/Quad/Dataset; GraphNode/GraphEdge/GraphDocument) | `graph-core` | The core types are foundation-increment WS1 deliverables. |
| §5 vocabulary layer | `graph-core/vocab` module | Default registries + Oak Curriculum Ontology + EEF + extension API. |
| §6 ingestion modes | `graph-ingest` | All six modes are supported; the foundation increment ships `jsonld-compatible` plus generic Turtle/SKOS parsing and schedules the other modes into Increment 2 (see §Increments). Oak ontology Thread mapping remains in `graph-corpus-sdk`. |
| §7 enhancement model | `graph-enhance` | `EnhancementRecord` is first-class; `id → strand_id`-style transformations carry provenance. |
| §8 relationship records as migration bridge | `graph-enhance` | `RelationshipRecord` is first-class today; RDF 1.2 triple-term annotation is a `graph-future` adapter target. |
| §9 validation model | `graph-validate` | JSON Schema + SHACL, distinct concerns, both supported. |
| §10 interaction API | `graph-project` (developer-facing surface) + `graph-core` (canonical-model-backed match/traverse) | The fluent API in §10 is the `graph-project` public surface. |
| §11 property-graph projection | `graph-project` | `toPropertyGraph()`, adjacency, Cytoscape/Graphology-friendly export hooks. |
| §12 future migration strategy | `graph-future` (deferred) + adapter seams | Versioned `JsonLdProcessor`, `ShapeValidator`, SPARQL adapter shapes ship from day one. |
| §13 suggested package structure | This topology table | Every package in §13 has a workspace home. |
| §14 design invariants | Test discipline across all workspaces | Every invariant is testable; the foundation increment ships compile-time and runtime tests for the load-bearing ones. |

---

## Increments — Sequenced Across the Topology

The full topology activates over seven increments. This plan ships **Increment 1** (foundation). Subsequent increments are sketched here and promoted to their own plans when their predecessors land.

| # | Increment | Activates | Status |
|---|---|---|---|
| 1 | **Foundation** (this plan) | `graph-core`, minimal `graph-ingest` (jsonld-compatible mode + generic Turtle/SKOS parsing), minimal `graph-project` (property-graph + adjacency), `graph-corpus-sdk` scaffold + Oak Curriculum Ontology Threads graph as first attached corpus | **CURRENT** — pending owner approval of topology |
| 2 | **Build-pipeline completion** | `graph-ingest` (remaining five modes), `graph-enhance` (full EnhancementRecord + RelationshipRecord), `graph-validate` (JSON Schema + SHACL); rewrites of existing `oak-curriculum-sdk` graph code onto the new stack | opens by owner promotion after Inc.1 closes |
| 3 | **Oak corpus backbone** | `graph-corpus-sdk` adapters for prerequisite, misconception, and the EEF strand adapter required for cross-corpus joins; misconception adapter consumes the bulk-derived graph generated by this repository; EEF adapter consumes the repository-held canonical snapshot until EEF clarifies refresh mechanics; cross-corpus join primitives; sunsets the bespoke factory in `oak-curriculum-sdk`. **Downstream consumer**: [`graph-combinatorial-arc.plan.md`](../../../graph-combinatorial-arc.plan.md) — the cross-corpus join primitive's first concrete consumer is the EEF × Oak misconceptions tool migrated there from the (former) MVP slice 3b. The cross-plan scheduling relationship is owned by `graph-combinatorial-arc.plan.md`'s own Promotion Trigger (no "design stability" intermediate state); this row records the consumer pointer only. | opens by owner promotion after Inc.2 closes (subsumes the work currently in [`graph-query-layer.plan.md`](graph-query-layer.plan.md)) |
| 4 | **Practice proof point** | `agent-graphs/practice-graph` workspace as the second consumer; markdown-corpus ingestion; CLI/report surface through `agent-tools` | opens by owner promotion after **both** Inc.2 closes **and** the `agent-graphs/` workspace organisation plan lands; the later of the two predecessors is the schedule signal (consumes [`practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md)) |
| 5 | **Projection + export** | Full `graph-project` surface — visualisation export hooks, JSON-LD export profiles, GQL-friendly property-graph shapes; cross-corpus journey tooling | opens by owner promotion after Inc.3 closes |
| 6 | **Public-asset positioning** | Publishing discipline, external-org adoption documentation, ontology IRI alignment guarantees, contribution model | opens by owner promotion after Inc.4 closes (hard predecessor per §Risk Assessment) |
| 7 | **Future-standards adapters** | `graph-future` workspace activated; first concrete adapter (likely RDF 1.2 statement-annotation export, or SPARQL 1.2 query) | opens when a consumer workspace opens a PR that requires one of {RDF 1.2, JSON-LD 1.2/1.3, SPARQL 1.2, SHACL 1.2} and the existing adapter seam in `graph-core`/`graph-validate`/`graph-project` is insufficient. The consumer PR is the concrete observable signal; monitoring responsibility sits with the owner at PR-review time. |

Each increment is a separate plan when promoted. The foundation increment is the only executable plan today.

---

## Genuine Open Decisions

Per the schedule-not-trigger doctrine (owner direction 2026-05-11: *"schedule it, sequence it, no imaginary flows, simple and definite is the only way anything happens"*), the items below are genuine open decisions that block scheduling. They are not deferred triggers; they are choices waiting on a named decision-holder.

| # | Decision | Decision-holder | Effect on scheduling | Status |
|---|---|---|---|---|
| O-1 | **WS0 topology ADR approval.** Does the owner approve the seven-active-plus-one-deferred graph topology as proposed? | Owner | Blocks Inc.1 promotion from CURRENT → ACTIVE; gates 1 + 2 of §Promotion Trigger cannot close without it. | **Approved in principle 2026-05-11** pending reviewer input on the WS0 ADR draft. Next sequence is definite: author ADR as `Proposed`; dispatch architecture-expert-betty + architecture-expert-fred + assumptions-expert in parallel; absorb findings; surface refined ADR for final approval; on final approval gates 1 + 2 close and graph-stack promotes to ACTIVE. |
| O-2 | **Increment promotion ownership.** Who promotes each subsequent Inc.N from "scheduled after predecessor closes" to an active plan, at the moment the predecessor closes? | Owner (default) | Schedule positions in §Increments name "owner promotion" as the trigger; this names the actor. If a delegate or review checkpoint is preferred over case-by-case owner promotion, this changes the trigger wording. | Open assumption: owner promotes at each predecessor-close review. Confirm or amend. |

Two prior open items are now closed and recorded here for audit:

- **D-4a (ADR-041 workspace-tiers amendment)** — closed 2026-05-11 by the graduation-candidates-drain session (`Fronded Flowering Seed`); `agent-graphs/` regularised + `agent-tools/` formalised in the 8×8 dependency-direction matrix.
- **D-4 (graph-stack topology BLOCKERs)** — closed 2026-05-11 by the graph-execution-prep session (`Dusky Masking Cloak`).

The combinatorial-arc cross-plan scheduling relationship (previously phrased here as "Inc.3 design stability fires the combinatorial arc's promotion trigger") is owned by [`graph-combinatorial-arc.plan.md`](../../../graph-combinatorial-arc.plan.md)'s own Promotion Trigger and is not an open decision in this plan.

---

## Increment 1 — Foundation (this plan)

**First graph work**: the first executable graph task is the
`graph-corpus-sdk` Oak Curriculum Ontology Threads proof: enumerate
`curric:Thread` and resolve inverse `curric:includesThread` Unit lookup through
the substrate with a tiny fixture-backed test. Do this before any NC work, EEF
adapter migration, misconception replatform, cross-corpus join, serving-layer
prototype, or broader query-layer migration.

### Slice value

After landing, Oak has:

- A working RDF-compatible substrate with JSON-LD 1.1 ingestion, vocabulary registry, and canonicalisation.
- The Oak Curriculum Ontology Threads graph (`curric:Thread` nodes and inverse `curric:includesThread` Unit lookup) extracted from the pinned straight-copy ontology raw import into a typed dataset, queryable through `graph-corpus-sdk`'s typed surface.
- The first proof that ontology IRIs flow end-to-end as canonical identity.
- Workspace homes for every layer in the research, with the foundation tier proven.

The foundation increment surfaces nothing through MCP, HTTP, or CLI. Surfacing is a consumer-side decision tracked separately (see §Surfacing). The increment is complete when graph capability is present and queryable in-process.

### Raw ontology import mechanics

ADR-173 records the decision: the GitHub repository
`oaknational/oak-curriculum-ontology` is the source of truth for ontology
definitions and ontology source data. This plan owns the implementation detail
for importing those source files into the graph stack.

The refresh/import command downloads source files from the canonical raw URL
form:

```text
https://raw.githubusercontent.com/oaknational/oak-curriculum-ontology/<revision>/<path>
```

`<revision>` is an immutable commit SHA or release tag recorded in the import
manifest. `main` is allowed only for discovery while preparing an update. The
discovery revision identified on 2026-05-10 was
`c308419f44eff1ef89a67a381221b193bc26feab`; the implementer must re-confirm
and pin the intended revision before WS4.2 lands.

The first-wave raw source set is a full straight-copy import of the ontology
Turtle / SHACL source corpus used by the ontology graph, not a reduced subset:

- `ontology/oak-curriculum-ontology.ttl`
- `ontology/oak-curriculum-constraints.ttl`
- `data/programme-structure.ttl`
- `data/temporal-structure.ttl`
- `data/threads.ttl`
- `data/subjects/**/*.ttl`

The importer resolves globs against the pinned GitHub tree and writes an
explicit manifest entry for every copied file. The raw import is byte-for-byte
source material: no formatting, filtering, canonicalisation, enrichment, or
path-local hand editing happens in the raw layer.

The manifest records at least:

- upstream repository;
- pinned revision and any discovery branch/tag;
- upstream path and resolved raw URL for each source file;
- generated raw output path for each copied file;
- byte length and content hash for each copied file;
- licence and attribution text/source;
- generation timestamp and importer version or command identifier.

Derived graph artefacts are generated separately from the raw copy. That
includes cleanup, indexes, join records, `EnhancementRecord` data, JSON-LD
projections, property-graph projections, and typed SDK surfaces. Small literal
Turtle fixtures remain valid for parser unit tests, but the adapter's
deterministic extraction proof runs against the pinned raw import.

### Slice non-scope (deferred to Increment 2 and beyond)

- The other five ingestion modes (`strict-jsonld`, `plain-json-tree`, `records`, `node-edge-list`, `custom-mapping`).
- Full `graph-enhance` (only the bare IRI-honouring path ships; no inference, no relationship-record minting beyond what the Thread adapter needs).
- Full `graph-validate` (no SHACL execution in this increment; SHACL validation happens upstream in the ontology repo's CI).
- Adapters for prerequisite, misconception, EEF strands (Increment 3).
- NC knowledge taxonomy adapter/enhancement/surfacing work. The raw source
  files may be present in the straight-copy import, but interpreting or
  surfacing that corpus is outside the MVP and remains in its own plan unless
  separately promoted by the owner.
- The `practice-graph` workspace (Increment 4).
- Sunset of the existing graph-resource-factory (Increment 2).

### Workstream decomposition

The cycle-by-cycle TDD breakdown is the YAML `todos` block at the head of this plan. Inc.1 is decomposed into three sub-increments (1a / 1b / 1c) plus a closure phase, by file-scope-non-overlapping boundaries; the `sub_increment` field on each todo records the assignment.

#### Inc.1a — Substrate scaffolding (file scope: `packages/core/graph-core/`, `packages/libs/graph-ingest/`, `packages/libs/graph-project/`)

- **WS1 — `graph-core`** (8 cycles): scaffold; RDF Term + Quad; DatasetCore; JSON-LD expand; JSON-LD compact + frame; canonicalisation; vocabulary registry; GraphDocument ergonomic surface.
- **WS2 — minimal `graph-ingest`** (3 cycles): scaffold; `jsonld-compatible` mode + generic Turtle/SKOS parsing; SourceMapping primitives.
- **WS3 — minimal `graph-project`** (3 cycles): scaffold; `toPropertyGraph` projection; adjacency primitives.

**Inc.1a exit**: WS1 + WS2 + WS3 cycles land green; `graph-core`, `graph-ingest`, `graph-project` expose stable public surfaces; `graph-corpus-sdk` can compile against them.

#### Inc.1b — Threads adapter (file scope: `packages/sdks/graph-corpus-sdk/`)

- **WS4.1 — `graph-corpus-sdk` scaffold**: typed corpus-adapter boundary; no Oak-specific ontology mapping before the SDK boundary exists.
- **WS4.2 — Oak Ontology Threads adapter**: GitHub raw-import fixture/manifest against the pinned `oaknational/oak-curriculum-ontology` revision; Thread adapter inside the SDK (generic Turtle/SKOS parse via `graph-ingest`; `curric:Thread` and inverse `curric:includesThread` mapping); deterministic extraction test against the pinned straight-copy ontology raw import.

**Inc.1b exit**: Threads adapter extracts `curric:Thread` from pinned ontology raw import; deterministic extraction test passes.

#### Inc.1c — Thread→Unit query proof (file scope: `packages/sdks/graph-corpus-sdk/`)

- **WS4.3 — typed query proof**: end-to-end query through `graph-corpus-sdk`'s typed surface (Thread enumeration + inverse Unit lookup); in-process only; no MCP wiring.

**Inc.1c exit**: Thread→Unit inverse-edge lookup is queryable in-process via the typed surface; ontology IRIs are canonical identity end-to-end.

#### Inc.1 closure (file scope: cross-plan + repo-wide docs + gates)

- **WS0 — Topology ADR**: author the proposed ADR that records the intended topology decision and supersession/coordination map for owner review (see §Coordination with Existing Plans). May land at the head of Inc.1a alongside WS1.1.
- **WS5 — Coordination amendments** (1 batch): amend `graph-query-layer.plan.md`, `oak-kg-threads-surface.plan.md`, `practice-graph-payoff-peak-pilot.plan.md`, and the parent `open-education-knowledge-surfaces.plan.md`.
- **WS6 — Documentation propagation** (1 batch): collection README, monorepo README, CONTRIBUTING, `LICENCE-DATA.md` ontology section, Mark Hodierne author addition, research filename typo fix. ADR-123 is not amended by this increment because no MCP primitives are added or changed.
- **WS7 — Quality gates** (1 batch): full chain (`pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && pnpm test && pnpm test:ui && pnpm test:e2e`).
- **WS8 — Adversarial review** (1 batch): assumptions-expert, architecture-expert-betty/fred/barney, type-expert, docs-adr-expert.

### Cycle dependencies and parallelisation

`graph-core` cycles are mostly sequential (WS1.1 → WS1.2 → WS1.3 → ...). Within the lib tier, `graph-ingest` (WS2) and `graph-project` (WS3) are *parallel-safe after WS1.8 lands*; both depend only on `graph-core`'s public surface. WS4 depends on both WS2's `jsonld-compatible` mode and WS3's adjacency primitives.

The parallel-safe pairs are **`WS2.2+WS3.2` and `WS2.3+WS3.3` only** — they touch disjoint workspace source trees after both scaffolds exist. The scaffold pair **`WS2.1+WS3.1` is NOT parallel-safe**: both write to repo-root monorepo registration files (`pnpm-workspace.yaml`, root `tsconfig.json` project references, root `package.json`), which have no merge-friendly concurrent-write story. Serialise WS2.1 and WS3.1 (either order; or batch their root-file edits into one preparatory commit). The later pairs may then be dispatched concurrently *if* worktree isolation is verified per the [worktree-isolation-unreliable](../../../../memory/active/distilled.md) guidance — in practice, sequential dispatch is preferred unless the orchestrator confirms isolation.

**WS4.2 earliest-start refinement**: WS4.2 (`ws4-oak-ontology-thread-adapter`) declares `depends_on: [ws4-graph-corpus-sdk-scaffold, ws1-vocab-registry]`. Its earliest possible start is therefore *after WS1.7 + WS4.1*, not after all of Inc.1a. The Inc.1a-then-Inc.1b sub-increment framing is correct for the explicitly preferred single-agent shape; this note is for any future brief that revisits finer-granularity parallelism.

**Sub-increment dependency direction**:

- Inc.1a → Inc.1b: Inc.1b cannot begin until Inc.1a complete (WS4.1 `depends_on: [ws3-adjacency, ws2-source-mapping]`).
- Inc.1b → Inc.1c: Inc.1c cannot begin until Inc.1b complete (WS4.3 `depends_on: [ws4-oak-ontology-thread-adapter]`).
- Inc.1c → Inc.1 closure: WS5+ require Inc.1c green.

**Multi-agent parallelism within Inc.1**:

- Two agents can share Inc.1 only at the Inc.1a substrate level — one agent on `graph-ingest` (WS2), one on `graph-project` (WS3), after `graph-core`'s public surface (WS1.8) is on `main`. Their file scopes are disjoint workspace trees.
- Inc.1b is single-workspace by design (`packages/sdks/graph-corpus-sdk/`); single-agent.
- Inc.1c is single-workspace and single-cycle; single-agent.
- Inc.1 closure is sequential coordination work; single-agent.

### Test discipline

The foundation increment lands tests for the load-bearing invariants from research §14:

1. **Stable IRI**: `graph-core/vocab` lookups + `graph-corpus-sdk` adapter honour stable ontology IRIs deterministically.
2. **Predicate IRI**: every emitted edge carries a `NamedNode` predicate, never a bare string.
3. **Source path preserved**: every node and edge produced by `graph-ingest` carries a `sourcePath` referenceable through JSON Pointer.
4. **Enhancement traceable**: every derived attribute carries an `EnhancementRecord` (even where the foundation increment only emits one or two enhancement kinds).
5. **JSON-LD 1.1 only at the public surface**: no draft-only syntax leaks (compile-time check on the `JsonLdProcessor` adapter; runtime check on emitted `@context`).
6. **Property-graph projection is derived, not canonical**: a smoke test asserts that `dataset.toPropertyGraph()` is reconstructable from the canonical dataset.

### Acceptance

The foundation increment is done when:

1. **Inc.1a** — substrate scaffolding cycles (WS1 + WS2 + WS3) land green.
2. **Inc.1b** — `graph-corpus-sdk` scaffold and Oak Ontology Threads adapter (WS4.1 + WS4.2) land green.
3. **Inc.1c** — Oak Curriculum Ontology Threads are queryable in-process via `graph-corpus-sdk`'s typed surface, including Unit-to-Thread inverse-edge lookup; ontology IRIs are canonical identity end-to-end (WS4.3). No surfacing (MCP, CLI, HTTP) is required for completeness.
4. **Inc.1 closure** — the full quality-gate chain passes (WS7); ADR for the topology decision is merged (WS0); coordination amendments are applied to the named plans (WS5); Mark Hodierne is in the authors list (WS6).

---

## Coordination with Existing Plans

This plan does **not** wholesale supersede adjacent plans; it provides the spine they attach to. The coordination map:

| Plan | Coordination |
|---|---|
| [`../active/nc-knowledge-taxonomy-surface.plan.md`](../active/nc-knowledge-taxonomy-surface.plan.md) | **Outside this MVP foundation increment.** The NC taxonomy plan is not amended or subsumed here. If the owner later promotes NC taxonomy work, it can attach to the substrate as a separate corpus adapter and consumer surface. |
| [`graph-query-layer.plan.md`](graph-query-layer.plan.md) | **Substrate subsumed into Increment 3.** The `GraphView<TNode, TEdgeType>` interface, the seven operations, projection discipline, and the tracer-matrix work all migrate into `graph-corpus-sdk` over the new substrate. MCP exposure of those operations is a consumer-side decision, tracked outside this plan; the 17-MCP-tool count and per-operation tool definitions are owned by the consumer surface (curriculum SDK MCP module + HTTP app) at the point of exposure. `graph-query-layer.plan.md` is amended at WS5 to record this boundary. |
| [`../active/graph-resource-factory.plan.md`](../active/graph-resource-factory.plan.md) | **Status remains DONE.** The factory currently lives in the curriculum MCP app's surface layer; it stays where it is and continues to work. If MCP exposure of new graph capabilities is later chosen, the factory may be revisited then. No retroactive amendment needed. |
| [`../active/misconception-graph-mcp-surface.plan.md`](../active/misconception-graph-mcp-surface.plan.md) | **Status remains DONE.** The current misconception MCP tool stays live and unchanged. If the misconception adapter is later rewritten onto `graph-corpus-sdk`, the MCP tool is a thin re-wrapping the owner can do at any point — independent of the substrate. |
| [`../active/open-education-knowledge-surfaces.plan.md`](../active/open-education-knowledge-surfaces.plan.md) | **WS5 amendment target.** The graph substrate and Oak Ontology Threads foundation will be referenced through this spine plan. The parent retains its multi-source narrative role; this spine becomes a named child plan. |
| [`../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md) | **WS5 amendment target.** Its required graph-core workspace should be the one this plan lands, and its practice-facing graph home should remain `agent-graphs/practice-graph/`. The Practice plan becomes an adjacent practice-facing consumer of the spine (Increment 4 in the topology sequencing), after the future `agent-graphs/` organisation plan wires the top-level area. |
| [`../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`](../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md) | **Strategic brief; no amendment needed.** Practice-graph attribution discipline (Graphify / Safi Shamsi) carries forward through the Practice plan and into the eventual `practice-graph` workspace README. |

WS5 in the cycle list executes these amendments.

---

## Public-Asset Positioning

The substrate is publishable. Each workspace below `graph-corpus-sdk` carries:

1. No Oak-specific identifiers in code.
2. No coupling to Oak's bulk-data shape.
3. Standards-only dependency surface (W3C standards + `jsonld.js` / `rdf-canonize` / `rdf-validate-shacl`).
4. Documentation written for arbitrary education-domain consumers, not Oak-internal contributors.

`graph-corpus-sdk` is Oak-specific by design and signals that explicitly in name and README. `agent-graphs/practice-graph` is practice-specific by design and is documented in the agent-tooling/practice estate, not as a substrate workspace.

The eventual public-asset move (Increment 6) is to publish `graph-core`, `graph-ingest`, `graph-enhance`, `graph-validate`, `graph-project` under a neutral scope (or unscoped) so other education organisations can:

- Use the substrate to model their own corpora.
- Attach to Oak's ontology IRIs through `graph-corpus-sdk` for cross-organisation joins.
- Contribute back vocabulary mappings for the Oak ontology Thread graph and EEF strands.

This is named here so the substrate is built for that future from day one — no Oak-specific shortcuts in the layered packages.

---

## Reviewer Scheduling

### Plan-phase (PRE-ExitPlanMode)

- `assumptions-expert` — proportionality check (does the seven-active-plus-one-deferred graph topology fit the value claim?), build-vs-buy attestation, blocking legitimacy of the foundation-first sequencing
- `architecture-expert-betty` — cohesion and change-cost trade-offs of the seven-active-plus-one-deferred graph shape; long-term evolution path
- `architecture-expert-fred` — ADR-154 framework-vs-consumer compliance across the layer boundaries; dependency direction
- `architecture-expert-barney` — boundary simplification; whether any workspace can be safely collapsed without losing layer discipline

(`mcp-expert` is deliberately not engaged for the foundation increment because no MCP code is produced. It runs only when a consumer chooses MCP surfacing.)

### Mid-cycle (DURING execution)

- `test-expert` — after each RED/GREEN cycle in WS1–WS4
- `type-expert` — after `graph-core`'s RDF Term + Quad + Dataset types land; after `graph-corpus-sdk` GraphView lands
- `code-expert` — gateway after each WS lands; routes to specialists
- `architecture-expert-betty` — re-engaged after WS1.8 (GraphDocument surface) and after WS4.2 (graph-corpus-sdk scaffold); explicit check that no MCP-shaped types or surfaces have leaked into the graph workspaces

### Close (POST-execution)

- `docs-adr-expert` — ADR-vs-implementation alignment; coordination amendments coherent
- `release-readiness-expert` — GO / GO-WITH-CONDITIONS / NO-GO before Increment 2 promotion

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Seven-active-plus-one-deferred topology proves over-decomposed; some workspaces have insufficient surface to justify their boundary | Medium | Medium | Per-workspace creation gate in WS1–WS3: each workspace lands only when its first cycle has green tests proving the boundary carries weight. If a layer's cycles all collapse into another workspace, fold it. |
| The substrate is built ahead of consumer demand and accumulates speculative API | Medium | High | The foundation increment ships only what the Oak Ontology Threads adapter needs end-to-end. Every method on `graph-core`/`graph-ingest`/`graph-project` has a Thread-adapter-driven justification or it does not ship. Subsequent increments justify their additions with their own consumer slices. |
| `jsonld.js` / `rdf-canonize` / `rdf-validate-shacl` create maintenance burden disproportionate to value | Low | Medium | The adapter shapes (research §12) keep them replaceable. Each is W3C-spec-aligned and widely used; bespoke alternatives are higher-risk. |
| Ontology IRIs are not as stable as the strategy assumes; rewrite cost is hidden | Medium | High | The strategy doc (`oak-ontology-graph-opportunities.strategy.md`) names this risk. The vocabulary registry's pin-by-version model lets corpus adapters declare a specific ontology revision; alignment audit (separate plan) measures actual stability. |
| Foundation increment lands without a Practice consumer; the substrate's cross-corpus claim is unproven | Medium | Medium | The increment's success criterion is end-to-end Oak Ontology Threads ingestion *plus* the second-consumer commitment in Increment 4. Increment 4 is a hard predecessor for Increment 6 (public-asset positioning). |
| Existing graph-shaped code in `oak-curriculum-sdk` and the queued `graph-query-layer.plan.md` drifts from the spine during Increment 1 | Medium | Low | Coordination amendments (WS5) explicitly point those plans at this spine. The proposed ADR records the intended topology so future plans cannot silently re-fork while ratification remains an owner gate. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../../templates/components/foundation-alignment.md)

- **principles.md**: strict, complete, schema-first, separate framework from consumer. The seven-active-plus-one-deferred graph topology is the framework-vs-consumer separation made structural.
- **testing-strategy.md**: TDD at all levels. Every cycle in WS1–WS4 lands one failing test plus the product code that greens it, in one commit.
- **schema-first-execution.md**: types flow from schema. The vocabulary registry is the schema; `graph-core`'s types flow from RDF/JSON-LD spec; `graph-corpus-sdk`'s adapters flow from the ontology IRIs.

First question: **Could it be simpler without compromising quality?** The seven-active-plus-one-deferred graph shape collapses ten research-named layers into seven active graph packages (folding `graph-jsonld`, `graph-canon`, `graph-vocab` into `graph-core` because their surfaces are small and tightly coupled, and moving the practice consumer to `agent-graphs/`). Going below seven active graph workspaces forecloses the layer discipline; going above seven without a consumer is speculative. Seven active graph workspaces plus one deferred future-standards workspace is the floor.

---

## Documentation Propagation

> See [Documentation Propagation component](../../../templates/components/documentation-propagation.md)

Required handling before close:

1. New proposed ADR records the topology and supersession map (WS0). The ADR includes the MCP-agnostic principle as an intended topology constraint pending owner ratification.
2. ADR-154 (framework-vs-consumer) reference: the topology is a worked application of the rule.
3. ADR-157 (multi-source open education) amendment: the spine is now the structural carrier of multi-source integration.
4. Collection README ([`../README.md`](../README.md)) — add this plan to Current Queue, update Read Order.
5. Monorepo root `README.md` — Data Sources section to mention the graph stack as the structural integration layer.
6. `LICENCE-DATA.md` — confirm ontology section reflects direct ingestion.
7. `package.json` contributors — add Mark Hodierne (per existing parent-plan attribution requirement).
8. Per-workspace READMEs (seven active graph workspace files, plus one deferred `graph-future` README when activated) — each names its layer, its public surface, its non-goals, its adapter seams, and its MCP-agnostic posture.
9. ~~Filename typo correction: `.agent/research/graph-iibrary.md` → `.agent/research/graph-library.md`.~~ **DONE 2026-05-07** — file renamed to `.agent/research/graph-library.research.md` with the `.research.md` suffix to mark it as one researched direction rather than a plan; references in this plan, the collection README, and operational memory updated.
10. First-wave ingestion scope amendment: confirm the foundation ships generic Turtle/SKOS parsing plus the Oak Curriculum Ontology Threads adapter as the first attached corpus. Prerequisite, misconception, and EEF strand adapters are sequenced into Increment 3. NC taxonomy adapter/surface work and other Oak Ontology projection formats (PG-JSONL, Neo4j export, SQL) remain out of scope until a downstream consumer requires them and the owner promotes that work separately.

ADR-123 (MCP server tool catalogue) is *not* amended by this increment because no MCP tools are added or changed. Any future increment that surfaces graph capability via MCP would amend ADR-123 at that point.

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content (notably: any new patterns around layered
graph substrates), extract reusable patterns, rotate the napkin, manage
fitness, and update the practice exchange. Candidate graduations:

- **Pattern**: layered standards-based substrate with adapter seams for emerging specs.
- **Pattern**: ontology-IRI-as-spine for cross-corpus joins.
- **Pattern**: enhancement-record-as-derivation-trace.

---

## Dependencies

**Blocking**:

- Owner approval of the topology decision (WS0 ADR is the artefact).
- Pinned `oak-curriculum-ontology` revision for Oak Ontology Threads extraction (foundation-increment WS4 dependency).

**Related Plans**:

- [`../active/open-education-knowledge-surfaces.plan.md`](../active/open-education-knowledge-surfaces.plan.md) — parent narrative; this plan executes its WS-4 via the spine.
- [`graph-query-layer.plan.md`](graph-query-layer.plan.md) — subsumed into Increment 3.
- [`../active/nc-knowledge-taxonomy-surface.plan.md`](../active/nc-knowledge-taxonomy-surface.plan.md) — outside this MVP; not subsumed by Increment 1.
- [`../active/graph-resource-factory.plan.md`](../active/graph-resource-factory.plan.md) — DONE; refactored during Increment 2.
- [`../active/misconception-graph-mcp-surface.plan.md`](../active/misconception-graph-mcp-surface.plan.md) — DONE; rewritten during Increment 3.
- [`../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md) — Increment 4 consumer.
- [`../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`](../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md) — strategic context for the Practice consumer.
- [`../oak-ontology-graph-opportunities.strategy.md`](../oak-ontology-graph-opportunities.strategy.md) — strategic baseline; this spine is consistent with its search-first, graph-augmented stance and with direct ontology use as the baseline.

**Authoritative research**:

- [`.agent/research/graph-library.research.md`](../../../../research/graph-library.research.md) — comprehensive layer inventory and Oak first-wave ingestion scope; this plan's topology is its monorepo realisation.

---

## Promotion Trigger from CURRENT to ACTIVE

This plan moves to ACTIVE at a named session when all four gates below are closed, in the order listed:

1. Owner has approved the topology decision (the §Genuine Open Decision below).
2. WS0 ADR is drafted and reviewers have returned findings (not necessarily merged).
3. The pinned `oak-curriculum-ontology` revision is identified for the Oak Ontology Threads adapter.
4. `assumptions-expert`, `architecture-expert-betty`, `architecture-expert-fred`, and `architecture-expert-barney` have run against this plan body and findings are addressed.
