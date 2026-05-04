---
name: "Graph Stack — Topology and Foundation Increment"
overview: "Establish a layered, standards-based graph capability for Oak — eight active workspaces plus one deferred — with the foundation increment ingesting the NC knowledge taxonomy end-to-end as the first attached corpus. Reserves space for every layer in `.agent/research/graph-iibrary.md` and provides the spine that subsequent graph-shaped work attaches to."
status: current
parent_plan: "../active/open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "graph-query-layer.plan.md"
  - "../active/nc-knowledge-taxonomy-surface.plan.md"
  - "../active/graph-resource-factory.plan.md"
  - "../active/misconception-graph-mcp-surface.plan.md"
  - "../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md"
  - "../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md"
specialist_reviewer: "architecture-reviewer-betty, architecture-reviewer-fred, architecture-reviewer-barney, mcp-reviewer, type-reviewer, code-reviewer, test-reviewer, docs-adr-reviewer, assumptions-reviewer"
isProject: true
todos:
  - id: ws0-topology-adr
    content: "WS0: Author ADR for the Graph Stack topology decision; record supersession/coordination map for adjacent plans"
    status: pending
  - id: ws1-graph-core-scaffold
    content: "WS1.1: Scaffold packages/core/graph-core workspace (TS, esbuild, vitest, README, exports skeleton). One commit, tree green."
    status: pending
  - id: ws1-rdf-term-quad
    content: "WS1.2: RDF Term hierarchy (NamedNode/BlankNode/Literal/DefaultGraph) + Quad type; type tests + equality. One commit, tree green."
    status: pending
    depends_on: [ws1-graph-core-scaffold]
  - id: ws1-dataset-core
    content: "WS1.3: DatasetCore-compatible interface (RDF/JS aligned); add/has/match unit tests. One commit, tree green."
    status: pending
    depends_on: [ws1-rdf-term-quad]
  - id: ws1-jsonld-expand
    content: "WS1.4: JSON-LD 1.1 expand wrapper (versioned adapter); test against a known SKOS document fixture."
    status: pending
    depends_on: [ws1-dataset-core]
  - id: ws1-jsonld-compact-frame
    content: "WS1.5: JSON-LD 1.1 compact + frame wrappers; round-trip test."
    status: pending
    depends_on: [ws1-jsonld-expand]
  - id: ws1-canon
    content: "WS1.6: RDF dataset canonicalisation; deterministic output for equivalent datasets."
    status: pending
    depends_on: [ws1-dataset-core]
  - id: ws1-vocab-registry
    content: "WS1.7: Vocabulary registry data tables (schema.org, RDFS, SKOS, PROV-O, DCMI, OWL, SHACL, Oak Curriculum Ontology, EEF custom IRIs); lookup + reverse-lookup tests."
    status: pending
    depends_on: [ws1-graph-core-scaffold]
  - id: ws1-graph-document
    content: "WS1.8: GraphDocument + GraphNode + GraphEdge ergonomic surface over Dataset; unit tests against a fixture dataset."
    status: pending
    depends_on: [ws1-dataset-core, ws1-vocab-registry]
  - id: ws2-ingest-scaffold
    content: "WS2.1: Scaffold packages/libs/graph-ingest workspace."
    status: pending
    depends_on: [ws1-graph-document]
  - id: ws2-jsonld-compatible
    content: "WS2.2: jsonld-compatible ingestion mode (JSON with @context/@id/@type or inferable LD shape); test against SKOS taxonomy fixture."
    status: pending
    depends_on: [ws2-ingest-scaffold]
  - id: ws2-source-mapping
    content: "WS2.3: SourceMapping primitives (JSON Pointer + JSONPath); source path preserved end-to-end."
    status: pending
    depends_on: [ws2-jsonld-compatible]
  - id: ws3-project-scaffold
    content: "WS3.1: Scaffold packages/libs/graph-project workspace."
    status: pending
    depends_on: [ws1-graph-document]
  - id: ws3-property-graph
    content: "WS3.2: toPropertyGraph projection (nodes/edges with labels/properties); round-trip test."
    status: pending
    depends_on: [ws3-project-scaffold]
  - id: ws3-adjacency
    content: "WS3.3: adjacency primitives — incoming/outgoing/neighbours/match; tests against fixture."
    status: pending
    depends_on: [ws3-property-graph]
  - id: ws4-skos-extractor
    content: "WS4.1: NC knowledge taxonomy SKOS extractor (Turtle → dataset via graph-core); deterministic extraction test against pinned ontology revision."
    status: pending
    depends_on: [ws1-jsonld-compact-frame, ws1-vocab-registry]
  - id: ws4-graph-corpus-sdk-scaffold
    content: "WS4.2: Scaffold packages/sdks/graph-corpus-sdk workspace; NC taxonomy adapter as first GraphView."
    status: pending
    depends_on: [ws3-adjacency, ws4-skos-extractor]
  - id: ws4-query-proof
    content: "WS4.3: Prove the NC taxonomy adapter end-to-end via graph-corpus-sdk's typed query surface (no MCP wiring in this cycle — surfacing is a consumer decision, see §Surfacing)."
    status: pending
    depends_on: [ws4-graph-corpus-sdk-scaffold]
  - id: ws5-coordination-amendments
    content: "WS5: Amend graph-query-layer.plan.md, nc-knowledge-taxonomy-surface.plan.md, practice-graph-payoff-peak-pilot.plan.md, and the parent open-education-knowledge-surfaces.plan.md to reference this spine."
    status: pending
    depends_on: [ws4-mcp-wiring]
  - id: ws6-docs-propagation
    content: "WS6: README updates (collection, monorepo, contributing); ADR-123 amendment; LICENCE-DATA.md ontology section update; Mark Hodierne author addition."
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

**Last Updated**: 2026-05-04
**Status**: 🟡 PLANNING — queued; depends on owner approval of the topology decision (WS0 ADR).
**Scope**: Establish a layered, standards-based graph capability for Oak as a backbone of eight active workspaces plus one deferred, then ship the foundation increment ingesting the NC knowledge taxonomy end-to-end as the first attached corpus.

---

## Strategic Priority

Graphs are now a first-class concern of this repository. The single coherent capability is:

> **Oak ships a layered, standards-based graph capability that knits curriculum content, curriculum structure, and pedagogical evidence into a navigable, citation-grade, AI-accessible graph; demonstrates the same primitive on Oak's own engineering practice; and positions the stack as open-education infrastructure.**

This plan establishes the topology that capability lives in, and ships the smallest end-to-end slice that proves it.

The plan reserves explicit workspace homes for every layer in
[`.agent/research/graph-iibrary.md`](../../../../research/graph-iibrary.md)
(filename typo to be corrected during WS6). No layer is foreclosed; every
layer either ships in this increment or is sequenced into a named
follow-on increment.

---

## Context

### Today's State

The repository has *no graph infrastructure* in the substrate sense — what exists is graph-shaped MCP exposure inside `oak-curriculum-sdk` (the resource factory plus the prerequisite, misconception, and thread-progressions adapters) and the queued `GraphView` query-layer plan. Each is a property graph by construction, derived deterministically from typed bulk data; none rests on a canonical RDF-compatible model, none uses ontology IRIs as identity, none can compose across corpora without bespoke alignment.

The Oak Curriculum Ontology already publishes RDF/OWL/SKOS/SHACL with stable IRIs and SHACL CI validation, but is consumed only as an *idea* — no current code path ingests its triples directly.

### What Changes

The foundation increment introduces a layered substrate. The NC knowledge taxonomy becomes the first corpus attached to that substrate, replacing the planned JSON-extraction approach in
[`../active/nc-knowledge-taxonomy-surface.plan.md`](../active/nc-knowledge-taxonomy-surface.plan.md).
Every subsequent graph-shaped artefact — including the work queued in
[`graph-query-layer.plan.md`](graph-query-layer.plan.md), the eventual
EEF and misconception graph rewrites, the cross-source journeys, and the
Practice graph pilot — attaches to this spine.

---

## Design Principles

1. **Stable-first, future-ready.** Persisted data, public APIs, and default exports use only stable W3C standards (RDF 1.1, JSON-LD 1.1, SKOS, SHACL 1.0). Emerging standards (RDF 1.2, JSON-LD 1.2/1.3, SPARQL 1.2, SHACL 1.2) become adapter upgrades inside `graph-future`, not architectural rewrites.
2. **Ontology identity as the spine.** Adapters in `graph-corpus-sdk` mint or honour Oak Curriculum Ontology IRIs as canonical node identity. Cross-corpus joins are structurally cheap because the join key is shared.
3. **Property-graph as projection, not canon.** The canonical internal model is an RDF-compatible quad dataset. Property-graph nodes/edges are *projections* (per research §11). This preserves migration headroom while keeping the developer-facing API ergonomic.
4. **Enhancement is explicit and inspectable.** Every derived claim — stable ID, predicate mapping, type inference, link detection, relationship record, provenance attribution — is recorded as an `EnhancementRecord` (research §7) with optional confidence. Silent semantic corruption is structurally prevented.
5. **Validation distinguishes structure from meaning.** JSON Schema validates raw input shape; SHACL validates graph semantics. Both live in `graph-validate`; neither replaces the other (research §9).
6. **Framework-vs-consumer separation, strictly.** Per ADR-154: `graph-core`, `graph-jsonld`-equivalent modules, `graph-canon`, and `graph-vocab` carry no consumer knowledge. `graph-ingest`, `graph-enhance`, `graph-validate`, `graph-project` carry general-purpose policy. `graph-corpus-sdk` and `practice-graph` are the corpus-specific consumers.
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

`assumptions-reviewer` runs against this attestation pre-ExitPlanMode (see Reviewer Scheduling).

---

## Topology Decision

The stack is **eight active workspaces plus one deferred**:

| # | Workspace | Tier | Carries (research §13) | Role |
|---|---|---|---|---|
| 1 | `packages/core/graph-core/` | core | `graph-core` + `graph-jsonld` + `graph-canon` + `graph-vocab` | Substrate. Term / Quad / Dataset (RDF/JS-aligned), JSON-LD 1.1 expansion+compaction+framing, RDF dataset canonicalisation, vocabulary registry. Pure, no I/O. |
| 2 | `packages/libs/graph-ingest/` | lib | `graph-ingest` | Six ingestion modes (research §6): `strict-jsonld`, `jsonld-compatible`, `plain-json-tree`, `records`, `node-edge-list`, `custom-mapping`. Source mapping via JSON Pointer + JSONPath. |
| 3 | `packages/libs/graph-enhance/` | lib | `graph-enhance` | Stable IRI minting, predicate mapping, type inference, link detection. `EnhancementRecord` discipline (research §7). `RelationshipRecord` migration bridge (research §8). |
| 4 | `packages/libs/graph-validate/` | lib | `graph-validate` | JSON Schema (raw shape) + SHACL (graph meaning) wrappers. Validation report shape stable across SHACL versions (research §9). |
| 5 | `packages/libs/graph-project/` | lib | `graph-project` | Property-graph projection, adjacency-list, neighbours/match/traverse primitives, visualisation/export hooks (research §10, §11). |
| 6 | `packages/sdks/graph-corpus-sdk/` | sdk | (Oak-specific consumer) | Oak's typed corpus adapters: NC knowledge taxonomy, prerequisite, misconception, EEF strands, plus future corpora. **Cross-corpus join primitives.** Uses ontology IRIs as canonical identity. |
| 7 | `packages/libs/practice-graph/` | lib | (Practice-specific consumer) | Markdown-corpus graph for Oak's engineering practice. Built on the same stack — proves the substrate works for non-curriculum data. |
| 8 | (deferred) `packages/libs/graph-future/` | lib | `graph-future` | RDF 1.2 / JSON-LD 1.2/1.3 / SPARQL 1.2 / SHACL 1.2 adapters. **Workspace not created until a consumer needs one of these specs**; the adapter seams (research §12) live inside `graph-core`, `graph-validate`, and `graph-project` from day one. |

This is the topology in full. No layer is missing; no layer is collapsed in a way that forecloses its later activation.

**Every workspace in the topology is MCP-agnostic.** None of the graph workspaces ship MCP tool definitions, MCP resource constants, or MCP-server registration code. Surfacing graph capability through MCP — if Oak chooses to do so — is a *consumer-side* concern handled by an existing or future app workspace that imports `graph-corpus-sdk`. See §Surfacing.

---

## Surfacing — MCP and Other Surfaces

The graph stack is infrastructure. How (or whether) graph capability is surfaced to humans, agents, or other systems is a separate decision tracked outside this plan.

Possible surfaces, none privileged by the topology:

- **In-process library imports** — application code imports `graph-corpus-sdk` directly. Always available; the default for any same-runtime consumer.
- **CLI** — the existing `agent-tools/` workspace exposes commands over `practice-graph` (per the Practice pilot's existing plan). A future curriculum-side CLI could do the same over `graph-corpus-sdk`.
- **MCP** — at most one workspace surfaces graph tools via MCP. If Oak chooses MCP exposure, it lives in an existing app workspace (e.g. the curriculum MCP server) or a new sibling that imports `graph-corpus-sdk`. The graph workspaces themselves stay MCP-clean.
- **HTTP/JSON-LD export** — `graph-project` will eventually emit JSON-LD profiles for cross-organisation consumption (Increment 5).
- **Search-augmentation** — Oak's Elasticsearch integration may consume `graph-corpus-sdk` to project graph-derived signals into search indices (a future plan, not committed here).

**Discipline**: no graph workspace ships MCP-shaped code. Tool definitions, resource constants, and registration helpers live with the app that surfaces them, not with the graph SDK that produces them. If a graph workspace starts wanting an MCP type or factory, that is the signal to extract a thin sibling adapter workspace — not to leak MCP into the substrate.

The foundation increment ships zero MCP exposure. NC taxonomy availability through `graph-corpus-sdk`'s typed query surface is the proof that the substrate works end-to-end. Whether to surface it through the curriculum MCP server is a follow-on decision the owner can make at any time, with or without this spine in flight.

---

## Layer Map (research → workspace)

The mapping is exhaustive against [`.agent/research/graph-iibrary.md`](../../../../research/graph-iibrary.md):

| Research section | Workspace | Notes |
|---|---|---|
| §1 stable foundation | `graph-core` (vocab + jsonld + canon modules), `graph-validate` (SHACL wrapper) | Every standard in §1 has a home. |
| §2 active state of newer standards | `graph-future` (deferred) + adapter seams across `graph-core`/`graph-validate`/`graph-project` | The seams ship; the workspace is created on first consumer demand. |
| §3 core design position | Plan-level: encoded in §Design Principles above. | Every workspace inherits the stable-first commitment. |
| §4 canonical internal model (Term/Quad/Dataset; GraphNode/GraphEdge/GraphDocument) | `graph-core` | The core types are foundation-increment WS1 deliverables. |
| §5 vocabulary layer | `graph-core/vocab` module | Default registries + Oak Curriculum Ontology + EEF + extension API. |
| §6 ingestion modes | `graph-ingest` | All six modes are supported; the foundation increment ships `jsonld-compatible` and reserves the others for Increment 2. |
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
| 1 | **Foundation** (this plan) | `graph-core`, minimal `graph-ingest` (jsonld-compatible mode), minimal `graph-project` (property-graph + adjacency), `graph-corpus-sdk` scaffold + NC taxonomy as first attached corpus, MCP wiring | **CURRENT** — pending owner approval of topology |
| 2 | **Build-pipeline completion** | `graph-ingest` (remaining five modes), `graph-enhance` (full EnhancementRecord + RelationshipRecord), `graph-validate` (JSON Schema + SHACL); rewrites of existing `oak-curriculum-sdk` graph code onto the new stack | future |
| 3 | **Oak corpus backbone** | `graph-corpus-sdk` adapters for prerequisite, misconception, EEF strands; cross-corpus join primitives; sunsets the bespoke factory in `oak-curriculum-sdk` | future (depends on Increment 2; subsumes the work currently in [`graph-query-layer.plan.md`](graph-query-layer.plan.md)) |
| 4 | **Practice proof point** | `practice-graph` workspace as the second consumer; markdown-corpus ingestion; CLI/report surface through `agent-tools` | future (depends on Increment 2; consumes [`practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md)) |
| 5 | **Projection + export** | Full `graph-project` surface — visualisation export hooks, JSON-LD export profiles, GQL-friendly property-graph shapes; cross-corpus journey tooling | future |
| 6 | **Public-asset positioning** | Publishing discipline, external-org adoption documentation, ontology IRI alignment guarantees, contribution model | future |
| 7 | **Future-standards adapters** | `graph-future` workspace activated; first concrete adapter (likely RDF 1.2 statement-annotation export, or SPARQL 1.1 query) | future (consumer-driven) |

Each increment is a separate plan when promoted. The foundation increment is the only executable plan today.

---

## Increment 1 — Foundation (this plan)

### Slice value

After landing, Oak has:

- A working RDF-compatible substrate with JSON-LD 1.1 ingestion, vocabulary registry, and canonicalisation.
- The NC knowledge taxonomy (Discipline → Strand → SubStrand → ContentDescriptor) extracted from `oak-curriculum-ontology` `.ttl` files into a typed dataset, queryable through `graph-corpus-sdk`'s typed surface.
- The first proof that ontology IRIs flow end-to-end as canonical identity.
- Workspace homes for every layer in the research, with the foundation tier proven.

The foundation increment surfaces nothing through MCP, HTTP, or CLI. Surfacing is a consumer-side decision tracked separately (see §Surfacing). The increment is complete when graph capability is present and queryable in-process.

### Slice non-scope (deferred to Increment 2 and beyond)

- The other five ingestion modes (`strict-jsonld`, `plain-json-tree`, `records`, `node-edge-list`, `custom-mapping`).
- Full `graph-enhance` (only the bare IRI-honouring path ships; no inference, no relationship-record minting beyond what NC taxonomy needs).
- Full `graph-validate` (no SHACL execution in this increment; SHACL validation happens upstream in the ontology repo's CI).
- Adapters for prerequisite, misconception, EEF strands (Increment 3).
- The `practice-graph` workspace (Increment 4).
- Sunset of the existing graph-resource-factory (Increment 2).

### Workstream decomposition

The cycle-by-cycle TDD breakdown is the YAML `todos` block at the head of this plan. The summary:

- **WS0 — Topology ADR**: author the ADR that ratifies the topology decision and records the supersession/coordination map (see §Coordination with Existing Plans).
- **WS1 — `graph-core`** (8 cycles): scaffold; RDF Term + Quad; DatasetCore; JSON-LD expand; JSON-LD compact + frame; canonicalisation; vocabulary registry; GraphDocument ergonomic surface.
- **WS2 — minimal `graph-ingest`** (3 cycles): scaffold; `jsonld-compatible` mode; SourceMapping primitives.
- **WS3 — minimal `graph-project`** (3 cycles): scaffold; `toPropertyGraph` projection; adjacency primitives.
- **WS4 — NC taxonomy as first attached corpus** (3 cycles): SKOS extractor (TTL → dataset); `graph-corpus-sdk` scaffold + NC taxonomy adapter; typed query proof (in-process; no surfacing).
- **WS5 — Coordination amendments** (1 batch): amend `graph-query-layer.plan.md`, `nc-knowledge-taxonomy-surface.plan.md`, `practice-graph-payoff-peak-pilot.plan.md`, and the parent `open-education-knowledge-surfaces.plan.md`.
- **WS6 — Documentation propagation** (1 batch): collection README, monorepo README, CONTRIBUTING, ADR-123 amendment, `LICENCE-DATA.md` ontology section, Mark Hodierne author addition, research filename typo fix.
- **WS7 — Quality gates** (1 batch): full chain (`pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub`).
- **WS8 — Adversarial review** (1 batch): assumptions-reviewer, architecture-reviewer-betty/fred/barney, type-reviewer, mcp-reviewer, docs-adr-reviewer.

### Cycle dependencies and parallelisation

`graph-core` cycles are mostly sequential (WS1.1 → WS1.2 → WS1.3 → ...). Within the lib tier, `graph-ingest` (WS2) and `graph-project` (WS3) are *parallel-safe after WS1.8 lands*; both depend only on `graph-core`'s public surface. WS4 depends on both WS2's `jsonld-compatible` mode and WS3's adjacency primitives.

The parallel-safe pairs (`WS2.1+WS3.1`, `WS2.2+WS3.2`, `WS2.3+WS3.3`) can be dispatched concurrently *if* worktree isolation is verified per the [worktree-isolation-unreliable](../../../../memory/active/distilled.md) guidance — in practice, sequential dispatch is preferred unless the orchestrator confirms isolation.

### Test discipline

The foundation increment lands tests for the load-bearing invariants from research §14:

1. **Stable IRI**: `graph-core/vocab` lookups + `graph-corpus-sdk` adapter mint stable IRIs deterministically.
2. **Predicate IRI**: every emitted edge carries a `NamedNode` predicate, never a bare string.
3. **Source path preserved**: every node and edge produced by `graph-ingest` carries a `sourcePath` referenceable through JSON Pointer.
4. **Enhancement traceable**: every derived attribute carries an `EnhancementRecord` (even where the foundation increment only emits one or two enhancement kinds).
5. **JSON-LD 1.1 only at the public surface**: no draft-only syntax leaks (compile-time check on the `JsonLdProcessor` adapter; runtime check on emitted `@context`).
6. **Property-graph projection is derived, not canonical**: a smoke test asserts that `dataset.toPropertyGraph()` is reconstructable from the canonical dataset.

### Acceptance

The foundation increment is done when:

1. The eight foundation-tier cycles land green.
2. NC taxonomy is queryable in-process via `graph-corpus-sdk`'s typed surface; ontology IRIs are canonical identity end-to-end. No surfacing (MCP, CLI, HTTP) is required for completeness.
3. The full quality-gate chain passes.
4. ADR for the topology decision is merged.
5. Coordination amendments are applied to the named plans.
6. Mark Hodierne is in the authors list.

---

## Coordination with Existing Plans

This plan does **not** wholesale supersede adjacent plans; it provides the spine they attach to. The coordination map:

| Plan | Coordination |
|---|---|
| [`../active/nc-knowledge-taxonomy-surface.plan.md`](../active/nc-knowledge-taxonomy-surface.plan.md) | **Structural part subsumed by Increment 1 WS4.** The SKOS-on-`graph-core` ingestion replaces the JSON-extraction approach. The plan's MCP-surfacing concerns (resource constant, aggregated tool, registration) are *not* part of the foundation increment — they remain in the original plan as a follow-on consumer slice the owner can choose to land separately. The original plan is amended to declare the structural split and to point here for the substrate path. |
| [`graph-query-layer.plan.md`](graph-query-layer.plan.md) | **Substrate subsumed into Increment 3.** The `GraphView<TNode, TEdgeType>` interface, the seven operations, projection discipline, and the tracer-matrix work all migrate into `graph-corpus-sdk` over the new substrate. **Whether and how those operations are exposed via MCP is no longer this plan's concern**; the 17-MCP-tool count and per-operation tool definitions become a separate consumer-side decision. The plan file is amended to declare the substrate home and to mark MCP exposure as an independent follow-on. |
| [`../active/graph-resource-factory.plan.md`](../active/graph-resource-factory.plan.md) | **Status remains DONE.** The factory currently lives in the curriculum MCP app's surface layer; it stays where it is and continues to work. If MCP exposure of new graph capabilities is later chosen, the factory may be revisited then. No retroactive amendment needed. |
| [`../active/misconception-graph-mcp-surface.plan.md`](../active/misconception-graph-mcp-surface.plan.md) | **Status remains DONE.** The current misconception MCP tool stays live and unchanged. If the misconception adapter is later rewritten onto `graph-corpus-sdk`, the MCP tool is a thin re-wrapping the owner can do at any point — independent of the substrate. |
| [`../active/open-education-knowledge-surfaces.plan.md`](../active/open-education-knowledge-surfaces.plan.md) | **Amended.** WS-4 (NC taxonomy) is now executed via this spine plan. The parent retains its multi-source narrative role; this spine becomes a named child plan. |
| [`../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md) | **Conditional `graph-core` gate is satisfied unconditionally by Increment 1.** The Practice plan is amended: its required `packages/libs/practice-graph/` workspace remains, but its `packages/core/graph-core/` is the one this plan lands. The Practice plan becomes a *consumer* of the spine (Increment 4 in the topology sequencing). |
| [`../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`](../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md) | **Strategic brief; no amendment needed.** Practice-graph attribution discipline (Graphify / Safi Shamsi) carries forward through the Practice plan and into the eventual `practice-graph` workspace README. |

WS5 in the cycle list executes these amendments.

---

## Public-Asset Positioning

The substrate is publishable. Each workspace below `graph-corpus-sdk` carries:

1. No Oak-specific identifiers in code.
2. No coupling to Oak's bulk-data shape.
3. Standards-only dependency surface (W3C standards + `jsonld.js` / `rdf-canonize` / `rdf-validate-shacl`).
4. Documentation written for arbitrary education-domain consumers, not Oak-internal contributors.

`graph-corpus-sdk` and `practice-graph` are Oak-specific by design and signal that explicitly in name and README.

The eventual public-asset move (Increment 6) is to publish `graph-core`, `graph-ingest`, `graph-enhance`, `graph-validate`, `graph-project` under a neutral scope (or unscoped) so other education organisations can:

- Use the substrate to model their own corpora.
- Attach to Oak's ontology IRIs through `graph-corpus-sdk` for cross-organisation joins.
- Contribute back vocabulary mappings for the EEF strands and NC taxonomy.

This is named here so the substrate is built for that future from day one — no Oak-specific shortcuts in the layered packages.

---

## Reviewer Scheduling

### Plan-phase (PRE-ExitPlanMode)

- `assumptions-reviewer` — proportionality check (does the eight-workspace topology fit the value claim?), build-vs-buy attestation, blocking legitimacy of the foundation-first sequencing
- `architecture-reviewer-betty` — cohesion and change-cost trade-offs of the eight-workspace shape; long-term evolution path
- `architecture-reviewer-fred` — ADR-154 framework-vs-consumer compliance across the layer boundaries; dependency direction
- `architecture-reviewer-barney` — boundary simplification; whether any workspace can be safely collapsed without losing layer discipline

(`mcp-reviewer` is deliberately not engaged for the foundation increment because no MCP code is produced. It runs only when a consumer chooses MCP surfacing.)

### Mid-cycle (DURING execution)

- `test-reviewer` — after each RED/GREEN cycle in WS1–WS4
- `type-reviewer` — after `graph-core`'s RDF Term + Quad + Dataset types land; after `graph-corpus-sdk` GraphView lands
- `code-reviewer` — gateway after each WS lands; routes to specialists
- `architecture-reviewer-betty` — re-engaged after WS1.8 (GraphDocument surface) and after WS4.2 (graph-corpus-sdk scaffold); explicit check that no MCP-shaped types or surfaces have leaked into the graph workspaces

### Close (POST-execution)

- `docs-adr-reviewer` — ADR-vs-implementation alignment; coordination amendments coherent
- `release-readiness-reviewer` — GO / GO-WITH-CONDITIONS / NO-GO before Increment 2 promotion

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Eight-workspace topology proves over-decomposed; some workspaces have insufficient surface to justify their boundary | Medium | Medium | Per-workspace creation gate in WS1–WS3: each workspace lands only when its first cycle has green tests proving the boundary carries weight. If a layer's cycles all collapse into another workspace, fold it. |
| The substrate is built ahead of consumer demand and accumulates speculative API | Medium | High | The foundation increment ships only what NC taxonomy needs end-to-end. Every method on `graph-core`/`graph-ingest`/`graph-project` has a NC-taxonomy-driven justification or it does not ship. Subsequent increments justify their additions with their own consumer slices. |
| `jsonld.js` / `rdf-canonize` / `rdf-validate-shacl` create maintenance burden disproportionate to value | Low | Medium | The adapter shapes (research §12) keep them replaceable. Each is W3C-spec-aligned and widely used; bespoke alternatives are higher-risk. |
| Ontology IRIs are not as stable as the strategy assumes; rewrite cost is hidden | Medium | High | The strategy doc (`oak-ontology-graph-opportunities.strategy.md`) names this risk. The vocabulary registry's pin-by-version model lets corpus adapters declare a specific ontology revision; alignment audit (separate plan) measures actual stability. |
| Foundation increment lands without a Practice consumer; the substrate's cross-corpus claim is unproven | Medium | Medium | The increment's success criterion is end-to-end NC ingestion *plus* the second-consumer commitment in Increment 4. Increment 4 is a hard predecessor for Increment 6 (public-asset positioning). |
| Existing graph-shaped code in `oak-curriculum-sdk` and the queued `graph-query-layer.plan.md` drifts from the spine during Increment 1 | Medium | Low | Coordination amendments (WS5) explicitly point those plans at this spine. ADR ratifies the topology so future plans cannot silently re-fork. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../../templates/components/foundation-alignment.md)

- **principles.md**: strict, complete, schema-first, separate framework from consumer. The eight-workspace topology is the framework-vs-consumer separation made structural.
- **testing-strategy.md**: TDD at all levels. Every cycle in WS1–WS4 lands one failing test plus the product code that greens it, in one commit.
- **schema-first-execution.md**: types flow from schema. The vocabulary registry is the schema; `graph-core`'s types flow from RDF/JSON-LD spec; `graph-corpus-sdk`'s adapters flow from the ontology IRIs.

First question: **Could it be simpler without compromising quality?** The eight-workspace shape collapses ten research-named layers into eight monorepo packages (folding `graph-jsonld`, `graph-canon`, `graph-vocab` into `graph-core` because their surfaces are small and tightly coupled). Going below eight forecloses the layer discipline; going above eight without a consumer is speculative. Eight is the floor.

---

## Documentation Propagation

> See [Documentation Propagation component](../../../templates/components/documentation-propagation.md)

Required handling before close:

1. New ADR ratifying the topology and supersession map (WS0). The ADR includes the MCP-agnostic principle as a binding constraint of the topology.
2. ADR-154 (framework-vs-consumer) reference: the topology is a worked application of the rule.
3. ADR-157 (multi-source open education) amendment: the spine is now the structural carrier of multi-source integration.
4. Collection README ([`../README.md`](../README.md)) — add this plan to Current Queue, update Read Order.
5. Monorepo root `README.md` — Data Sources section to mention the graph stack as the structural integration layer.
6. `LICENCE-DATA.md` — confirm ontology section reflects direct ingestion.
7. `package.json` contributors — add Mark Hodierne (per existing parent-plan attribution requirement).
8. Per-workspace READMEs (eight new files) — each names its layer, its public surface, its non-goals, its adapter seams, and its MCP-agnostic posture.
9. Filename typo correction: `.agent/research/graph-iibrary.md` → `.agent/research/graph-library.md` (with a redirect note in the collection README).

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
- Pinned `oak-curriculum-ontology` revision for SKOS extraction (foundation-increment WS4 dependency).

**Related Plans**:

- [`../active/open-education-knowledge-surfaces.plan.md`](../active/open-education-knowledge-surfaces.plan.md) — parent narrative; this plan executes its WS-4 via the spine.
- [`graph-query-layer.plan.md`](graph-query-layer.plan.md) — subsumed into Increment 3.
- [`../active/nc-knowledge-taxonomy-surface.plan.md`](../active/nc-knowledge-taxonomy-surface.plan.md) — subsumed into Increment 1 WS4.
- [`../active/graph-resource-factory.plan.md`](../active/graph-resource-factory.plan.md) — DONE; refactored during Increment 2.
- [`../active/misconception-graph-mcp-surface.plan.md`](../active/misconception-graph-mcp-surface.plan.md) — DONE; rewritten during Increment 3.
- [`../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md`](../../../agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md) — Increment 4 consumer.
- [`../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`](../../../agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md) — strategic context for the Practice consumer.
- [`../oak-ontology-graph-opportunities.strategy.md`](../oak-ontology-graph-opportunities.strategy.md) — strategic baseline; this spine is consistent with its search-first, graph-augmented stance and with direct ontology use as the baseline.

**Authoritative research**:

- [`.agent/research/graph-iibrary.md`](../../../../research/graph-iibrary.md) — comprehensive layer inventory; this plan's topology is its monorepo realisation. Filename typo to be corrected during WS6.

---

## Promotion Trigger from CURRENT to ACTIVE

Promote when:

1. Owner has approved the topology decision.
2. WS0 ADR is drafted and reviewed (not necessarily merged).
3. The pinned `oak-curriculum-ontology` revision is identified for the SKOS extractor.
4. `assumptions-reviewer`, `architecture-reviewer-betty`, `architecture-reviewer-fred`, and `architecture-reviewer-barney` have run against this plan body and findings are addressed.
