---
plan_id: graph-portfolio-index
title: "Graph Portfolio — Index"
type: cross-collection-index
status: active
last_updated: 2026-05-21
indexed_collections:
  - "connecting-oak-resources/knowledge-graph-integration/"
  - "agent-tooling/"
  - "agentic-engineering-enhancements/"
  - "sector-engagement/eef/"
  - "sector-engagement/knowledge-graph-adoption/"
  - "exploring-open-education-resources/external-knowledge-sources/"
sibling_index: "high-level-plan.md"
---

# Graph Portfolio — Index

Single index for **every plan and research artefact related to graphs**,
spanning all six collections that touch graph work. Designed to make
consolidation cheap when the time comes.

If a graph-related artefact is not listed here, that is a bug — open a follow-on
to add it.

The portfolio is organised into **three goals** + an **EEF cross-cutting
thread**:

1. **Substrate** — a general graph-handling layer (JSON-LD 1.1 on the wire,
   **RDF 1.2-native internals** with TripleTerm as a first-class Term
   member, schema.org / RDFS / SKOS / PROV-O / SHACL vocabularies,
   property-graph projection, tripwire-driven adapter upgrades).
2. **Oak graph surfaces** — Oak's own graphs and ontology, ingested through
   the substrate (misconception, pre-requisite, Oak ontology Threads, full Oak
   ontology, EEF strands, derived Practice graph, external KG intake).
   Practice-facing graph tooling is housed under `agent-graphs/`, adjacent to
   `agent-tools/`, rather than under substrate package workspaces.
3. **Features** — what we build on top for search and MCP, plus external
   adoption of Oak's KG assets.

Plans across the portfolio carry a `graph_layer:` YAML field with one of
**`substrate`**, **`oak-graph-surface`**, or **`feature`** so this index is
recoverable mechanically.

The portfolio's first committed delivery commitment across all three goals
is captured in two sequential arcs:

- **MVP arc**
  ([`graph-mvp-arc.plan.md`](graph-mvp-arc.plan.md)) — three-slice spine
  establishing substrate, shape-understanding, and MCP surface for each
  of the three MVP corpora (EEF, Oak ontology Threads, Oak
  misconceptions), under MVP discipline (ship soon at full quality,
  explicit follow-up for everything cut).
- **Combinatorial arc** ([`graph-combinatorial-arc.plan.md`](graph-combinatorial-arc.plan.md))
  — follow-on arc owning substrate-layer cross-corpus composition.
  Activates when MVP arc gate-1a + gate-3a ship and graph-stack Inc.3
  cross-corpus join primitive is design-stable (per the 2026-05-21
  gate-split amendment: combinatorial-arc precursors resolve at
  gate-1a because that is where the EEF naming, citation envelope,
  response shape, and ADR-175 freshness governance lock in;
  gate-1b's additional recommend/explain/compare surface is not a
  precursor for cross-corpus composition).

---

## Goal 1 — Substrate (general graph layer)

The shape of a layered, standards-based graph capability for Oak: JSON-LD
ingestion, RDF-compatible internal model, vocabulary registry, validation,
projection, ergonomic property-graph API.

**Standards stance (Option B, captured by proposed ADR-173)**: **RDF 1.2-native
internals, JSON-LD 1.1 / RDF 1.1-compatible wire**. Triple terms are
first-class members of the `Term` union from day one. The wire constraint
closes as the ecosystem catches up — see the tripwire map below.

| Type | Path | Role |
|---|---|---|
| Research direction | [`.agent/research/graph-library.research.md`](../research/graph-library.research.md) | Authoritative direction. **§4** RDF 1.2-native internal model (TripleTerm first-class). **§8** RelationshipRecord as JSON-LD 1.1 emit projection. **§12** wire-format migration seam. **§18** Oak first-wave ingestion scope. **§19** canonical Standards-evolution tripwires map (7 named tripwires). |
| Plan (current) | [`connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md) | **Topology spine.** Seven active graph workspaces plus one deferred; foundation increment ingests the Oak Curriculum Ontology Threads graph end-to-end. Design Principle #1 names the Option B stance. WS0 is the topology ADR (see ADR-173 below). |
| Plan (current) | [`connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md) | 7-operation polymorphic query layer with progressive disclosure. Substrate folds into `graph-stack`; MCP exposure stays a separate consumer-side decision. |
| ADR (proposed) | [`docs/architecture/architectural-decisions/173-graph-stack-topology.md`](../../docs/architecture/architectural-decisions/173-graph-stack-topology.md) | **WS0 deliverable** of `graph-stack.plan.md`. Proposes the topology, the **Option B standards stance**, the first-wave ingestion scope, and the seven tripwires pending owner approval. Skeleton drafted 2026-05-07; Option B amendment 2026-05-07. |

### Standards-evolution tripwires (captured by proposed ADR-173)

Each tripwire has its own subsection in
[`graph-library.research.md` §19](../research/graph-library.research.md#19-standards-evolution-tripwires).
ADR-173 proposes them for ratification. Intended discipline: no tripwire is
silently skipped; each becomes a named follow-on plan when triggered.

| # | Tripwire | Activates |
|---|---|---|
| 1 | JSON-LD 1.2 reaches W3C Recommendation | JSON-LD 1.2 emit/parse adapter; RelationshipRecord becomes one wire profile rather than canonical |
| 2 | RDF/JS WG formalises RDF 1.2 data-model extension | `graph-core` `Term` union migration if our `TripleTerm` shape differs from the published spec |
| 3 | SHACL 1.2 reaches W3C Recommendation | `shacl-1.2` profile in `graph-validate` ShapeValidator |
| 4 | SPARQL 1.2 reaches W3C Recommendation | `graph-future` workspace activates; SPARQL 1.2 export adapter |
| 5 | RDF 1.2 itself reaches W3C Recommendation | Documentation and package-metadata version bumps; pre-Recommendation risk window closes |
| 6 | First triple-term-using corpus enters ingestion | Contract-test verification of ingestion / validation / provenance for triple terms |
| 7 | Adapter implementation diverges from targeted spec | Pin, upstream issue, alternative evaluation; intervention through version/profile discriminator only |

### Foundation and sequenced ingestion scope (from graph-stack + ADR-173)

| # | Corpus | Source format | Notes |
|---|---|---|---|
| 1 | **Oak Curriculum Ontology Threads graph** | Turtle/SKOS + SHACL source, ingested directly from sibling `oak-curriculum-ontology` repo | Foundation attached corpus for the MVP. `graph-ingest` owns generic Turtle/SKOS parsing; `graph-corpus-sdk` owns `curric:Thread` enumeration and inverse `curric:includesThread` Unit lookup. PG-JSONL, Neo4j export, SQL projections, WIDOCO docs, and NC taxonomy work are out of foundation scope. |
| 2 | **Pre-requisite graph** | Oak-controlled (recommend JSON-LD 1.1 with stable Oak context) | Sequenced into graph-stack Increment 3. |
| 3 | **Misconception graph** | Oak-controlled (recommend JSON-LD 1.1 with stable Oak context) | Sequenced into graph-stack Increment 3; required before the combinatorial arc's first cross-corpus tool. |
| 4 | **EEF Toolkit corpus** | EEF-controlled (currently structured JSON) | External; EEF strand adapter is a **concurrent first-wave attached corpus alongside Threads** per 2026-05-21 amendment (graph-stack Inc.1d WS4.5 ships `subgraph` + `manifest`; remaining 5 operations + cross-corpus joins land at Inc.3). Disjoint ingestion path: no `graph-ingest` participation; corpus-local Zod loader inside `graph-corpus-sdk`. |

---

## Goal 2 — Oak graph surfaces (specific graphs)

Each surface is a concrete graph (or ontology) made available through the
substrate. Status reflects YAML and plan-body claims as of 2026-05-08 for
surfaces touched by PR #102 closeout; a broader portfolio status refresh is a
follow-on consolidation task.

| Surface | Plan | Status |
|---|---|---|
| **Misconception graph** | [`connecting-oak-resources/.../active/misconception-graph-mcp-surface.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/misconception-graph-mcp-surface.plan.md) | DONE (1eb302e8) |
| **Pre-requisite graph** | (lives inside `graph-resource-factory.plan.md` — `prior-knowledge-graph-resource.ts` already shipping) | DONE |
| **Graph resource factory** (shared infrastructure) | [`connecting-oak-resources/.../active/graph-resource-factory.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/graph-resource-factory.plan.md) | DONE (1eb302e8) — to be rewritten on the substrate during graph-stack Increment 2 |
| **NC knowledge taxonomy** (Oak Curriculum Ontology slice) | [`connecting-oak-resources/.../active/nc-knowledge-taxonomy-surface.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/nc-knowledge-taxonomy-surface.plan.md) | Outside the MVP. Not subsumed by `graph-stack.plan.md`; any substrate or surfacing work requires separate owner promotion. |
| **Full Oak Curriculum Ontology** (TTL + SHACL) | [`connecting-oak-resources/.../current/kg-alignment-audit.execution.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/kg-alignment-audit.execution.plan.md) | ACTIVE — first canonical overlap audit |
| **Oak Curriculum Ontology repo intake** (workspace decision) | [`connecting-oak-resources/.../future/oak-curriculum-ontology-workspace-reassessment.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-curriculum-ontology-workspace-reassessment.plan.md) | future |
| **Oak Curriculum Ontology — fresh-perspective re-read** | [`connecting-oak-resources/.../future/ontology-repo-fresh-perspective-review.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md) | complete (per YAML) |
| **Direct ontology use vs Neo4j vs Stardog prototypes** | [`connecting-oak-resources/.../future/direct-ontology-use-and-graph-serving-prototypes.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md) | future |
| **Oak KG lesson graph surface** | [`connecting-oak-resources/.../future/oak-kg-lesson-graph-surface.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-kg-lesson-graph-surface.plan.md) | future — slice 2 cut scope |
| **Oak KG programme navigator** | [`connecting-oak-resources/.../future/oak-kg-programme-navigator.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-kg-programme-navigator.plan.md) | future — slice 2 cut scope |
| **Oak KG IRI traverser** | [`connecting-oak-resources/.../future/oak-kg-iri-traverser.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-kg-iri-traverser.plan.md) | future — slice 2 cut scope |
| **Oak KG schema browser** | [`connecting-oak-resources/.../future/oak-kg-schema-browser.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-kg-schema-browser.plan.md) | future — slice 2 cut scope |
| **Oak misconceptions substrate migration** | [`connecting-oak-resources/.../future/oak-misconceptions-substrate-migration.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-substrate-migration.plan.md) | future — slice 3a substrate follow-on |
| **Oak misconceptions topic extraction** | [`connecting-oak-resources/.../future/oak-misconceptions-topic-extraction.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-topic-extraction.plan.md) | future — slice 3a topic-string follow-on |
| **EEF evidence strands corpus** | [`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md) | CURRENT — 21 todos pending (20 original + t6a-explore-tool added 2026-05-21 for the gate-1a first-feature surface). Cross-cutting thread (see below). |
| **Derived Practice graph** (memory estate) | [`agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md`](agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md) | NOT STARTED — first graph-memory pilot |
| **Agent graph workspace organisation** | [`agent-tooling/future/agent-graphs-workspace-organisation.plan.md`](agent-tooling/future/agent-graphs-workspace-organisation.plan.md) | future — creates `agent-graphs/` and workspace wiring for `agent-graphs/practice-graph/` when the Practice pilot promotes |
| **External knowledge graph intake** (third-party KGs as Oak data) | [`exploring-open-education-resources/external-knowledge-sources/future/external-knowledge-graph-data-source-integration.plan.md`](exploring-open-education-resources/external-knowledge-sources/future/external-knowledge-graph-data-source-integration.plan.md) | future |

---

## Goal 3 — Features built on graphs (search, MCP, journeys, adoption)

| Feature | Plan | Status |
|---|---|---|
| **Search × graph quick wins** (Elasticsearch projections, bounded graph augmentation) | [`connecting-oak-resources/.../current/kg-integration-quick-wins.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/kg-integration-quick-wins.plan.md) | READY (current) — depends on alignment audit |
| **Multi-source umbrella** (coordinates Oak API + Oak Ontology + EEF as MCP surfaces) | [`connecting-oak-resources/.../active/open-education-knowledge-surfaces.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) | ACTIVE — WS-0/1/2 done; WS-3+ pending |
| **Agent guidance over graph surfaces** | [`connecting-oak-resources/.../active/agent-guidance-consolidation.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/agent-guidance-consolidation.plan.md) | active — runs after surfaces ship |
| **Cross-source journeys** (search × misconception × EEF; prerequisite traces) | [`connecting-oak-resources/.../future/cross-source-journeys.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md) | future |
| **Oak misconceptions × EEF cross-corpus (first concrete combinatorial-arc exploration)** | [`connecting-oak-resources/.../future/oak-misconceptions-eef-cross-corpus-surface.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-eef-cross-corpus-surface.plan.md) | future — combinatorial arc, formerly MVP slice 3b; awaits combinatorial-arc promotion trigger |
| **Oak misconceptions × EEF extended contexts** | [`connecting-oak-resources/.../future/oak-misconceptions-eef-extended-contexts.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-eef-extended-contexts.plan.md) | future — combinatorial-arc non-Thread context follow-on |
| **Graphify-style memory navigation** (Practice memory layer) | [`agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md`](agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md) | future — strategic parent of the Practice graph pilot |
| **External adoption of Oak KG assets** | [`sector-engagement/knowledge-graph-adoption/future/oak-knowledge-graph-external-adoption.plan.md`](sector-engagement/knowledge-graph-adoption/future/oak-knowledge-graph-external-adoption.plan.md) | future |

---

## EEF Evidence — cross-cutting sector-cohesion thread

The integration of EEF Teaching and Learning Toolkit evidence is part of the
graph portfolio (it appears as an Oak graph surface + a feature) **and** is
also a separately important sector-impact thread. It is the clearest concrete
demonstration of the wider education sector coming together: Oak's openly
licensed curriculum on one side, EEF's openly licensed evidence corpus on the
other, with Oak users (and external partners building on Oak) able to compose
both in a single working context.

| Type | Path | Role |
|---|---|---|
| Plan (current) | [`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md) | Canonical executable plan for the EEF graph surface, ranking engine, two prompts, structural citation/data/caveat discipline, telemetry, freshness gate. LLM/outcome evaluation is a follow-on evaluation-infrastructure concern, not a slice-1 gate. |
| Plan (future) | [`connecting-oak-resources/.../future/cross-source-journeys.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md) | Journeys that compose EEF with the misconception graph and search. |
| External-source intake | [`exploring-open-education-resources/external-knowledge-sources/future/external-knowledge-graph-data-source-integration.plan.md`](exploring-open-education-resources/external-knowledge-sources/future/external-knowledge-graph-data-source-integration.plan.md) | Generalised intake model for future third-party knowledge graphs (sector partners beyond EEF). |

The EEF corpus plan's `cross_cutting_thread:` YAML field marks it as part of
this thread.

---

## Naming-scheme overlap notes (consolidation hints)

These are concerns whose ownership is split across more than one collection
because of how the plan tree grew. None is broken; each is a candidate to
fold or cross-link when consolidation runs.

| Concern | Where it appears | Suggested consolidation |
|---|---|---|
| **Knowledge graph for external organisations** | `sector-engagement/knowledge-graph-adoption/` (adoption playbook) and `connecting-oak-resources/knowledge-graph-integration/` (the assets being adopted) | Cross-link only; collections are deliberately separated by audience (sector-facing vs internal). |
| **Knowledge graphs as data sources** | `exploring-open-education-resources/external-knowledge-sources/` (intake model) and `connecting-oak-resources/knowledge-graph-integration/` (Oak-owned graphs) | Cross-link only; same separation rule. |
| **NC taxonomy substrate vs surfacing** | NC taxonomy is outside the MVP; `nc-knowledge-taxonomy-surface.plan.md` remains the owner if it is separately promoted | Cross-link only. `graph-stack.plan.md` must not take NC taxonomy substrate ownership in the MVP foundation. |
| **Query layer substrate vs MCP exposure** | Same split: `graph-stack.plan.md` (substrate) and `graph-query-layer.plan.md` (MCP-side decisions) | Same as above. |
| **Practice graph vs curriculum graphs** | `agentic-engineering-enhancements/` owns the Practice memory graph; `agent-tooling/` owns the top-level `agent-graphs/` organisation; `connecting-oak-resources/knowledge-graph-integration/` owns curriculum graphs | Both consume the same substrate packages (`graph-core`, `graph-ingest`, `graph-project`); `graph-corpus-sdk` and `agent-graphs/practice-graph` are consumer workspaces. Cross-link only. |

---

## How to use this index

- **Adding a new graph plan**: add the `graph_layer:` YAML field, link to this
  index via `graph_portfolio_index:`, and add a row to the relevant goal table
  here. The index is hand-maintained; we accept that for cheaper consolidation.
- **Looking for a specific concern**: scan the three goal tables; if the
  concern crosses goals (most do), cross-references appear in each table.
- **Consolidating later**: the naming-scheme overlap notes section is the
  starting point. Update there as overlaps are folded.

## Vertical-slice arcs

The graph portfolio's first vertical commitment ships across two sequential
arcs.

### MVP arc — substrate, shape-understanding, and surface for each of three corpora

[`graph-mvp-arc.plan.md`](graph-mvp-arc.plan.md). Three slices, each
co-primary in value: substrate built and proven, corpus shape understood
through surfacing it, surfacing-design lessons recorded. Slice 1 also
opens the EEF partnership conversation. Combinatorial composition is the
follow-on arc, not this one. Teacher value is downstream of AI-client
adoption.

| Slice | Goal | Namespace | Status |
|---|---|---|---|
| 1a — EEF first user-facing feature (gate-0a substrate floor + gate-1a feature ship) | 2 (Oak graph surface) + 3 (feature) | `eef-*` | gate-0a pending (graph-stack Inc.1d: WS4.4 GraphView interface in graph-core + WS4.5 EEF subgraph+manifest adapter); gate-1a pending (first user-facing EEF MCP feature: `eef-explore-evidence-for-context` tool + `eef-evidence-grounded-lesson-plan` prompt + corpus envelope + ADR-175 freshness CI gate). Gate-1a delivery owned by [`sector-engagement/eef/current/eef-first-feature.plan.md`](sector-engagement/eef/current/eef-first-feature.plan.md). Cross-ref: [`graph-mvp-arc.plan.md`](graph-mvp-arc.plan.md) gate-0a/gate-1a definitions; [`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md) §Gate grouping table. |
| 1b — EEF slice-1 completion (gate-0b substrate residual + gate-1b surface completion) | 2 (Oak graph surface) + 3 (feature) | `eef-*` | gate-0b pending (substrate residual after Inc.1d closes); gate-1b pending (recommend/explain/compare tools, second prompt — `eef-pupil-premium-strategy-review` — full telemetry, registration, E2E). Gate-1b delivery owned by [`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md) (residual surface after gate-1a extraction). Cross-ref: [`graph-mvp-arc.plan.md`](graph-mvp-arc.plan.md) gate-0b/gate-1b definitions. |
| 2 — Oak ontology Threads MCP surface | 2 (Oak graph surface) | `oak-kg-*` | pending graph-stack Inc.1b; parallel-safe with gate-1a + gate-3a |
| 3a — Misconception sub-graph query | 2 (Oak graph surface) + 3 (feature) | `oak-misconceptions-*` | pending graph-stack Inc.1b; parallel-safe with gate-1a + gate-2 |

### Combinatorial arc — substrate-layer cross-corpus composition

[`graph-combinatorial-arc.plan.md`](graph-combinatorial-arc.plan.md).
Authored to `current/` 2026-05-11; activates when MVP arc gate-1a +
gate-3a ship and graph-stack Inc.3 cross-corpus join primitive is
design-stable (per the 2026-05-21 gate-split amendment). First concrete exploration: cross-corpus tool composing
EEF strands and bounded misconception sub-graph for a Thread IRI
(formerly MVP slice 3b; executable plan migrated from
`current/` to `future/` during the 2026-05-11 reshape). Subsequent
compositions decided after the first tool ships.

| Composition | Namespace | Status |
|---|---|---|
| EEF × Misconceptions (first concrete exploration) | `oak-misconceptions-eef-*` | pending combinatorial arc promotion trigger (MVP gate-1a + gate-3a + Inc.3 design-stable per 2026-05-21 gate-split amendment) |

This arc is distinct from [`cross-source-journeys.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md):
combinatorial-arc ships substrate-layer cross-corpus *primitives* (MCP
tools whose body composes corpora through `graph-corpus-sdk`);
cross-source-journeys is feature-layer *journey orchestration* (playbook
primitive or rich prompts) consuming those primitives. Two layers, two
plans.

## Related strategic indices

- [`high-level-plan.md`](high-level-plan.md) — repository strategic index;
  links to this portfolio index from the Cross-cutting Threads section.
- [`graph-mvp-arc.plan.md`](graph-mvp-arc.plan.md) — MVP vertical-slice
  delivery spine; consumes this portfolio's plans.
- [`graph-combinatorial-arc.plan.md`](graph-combinatorial-arc.plan.md) —
  follow-on arc; substrate-layer cross-corpus composition.
- [`connecting-oak-resources/knowledge-graph-integration/README.md`](connecting-oak-resources/knowledge-graph-integration/README.md)
  — the knowledge-graph-integration collection README, which covers a subset
  of this index in more depth.
