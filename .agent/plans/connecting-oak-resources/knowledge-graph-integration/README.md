# Knowledge Graph Integration

> **Graph hub**: this README indexes Oak-owned knowledge-graph work — substrate,
> Oak graph surfaces, and features. The EEF evidence tool (the live first proper
> graph tool) is owned under
> [`sector-engagement/eef/`](../../sector-engagement/eef/README.md). Estate
> clean-up is owned by
> [`graph-estate-consolidation.plan.md`](current/graph-estate-consolidation.plan.md).

Internal engineering hub for Oak-owned knowledge graph work: integrating the
Oak Curriculum Ontology and Oak-derived graphs into the MCP server, semantic
search service, QA workflows, and any future graph-serving layer.

The wider goal is to unlock impact from Oak's knowledge graphs as reusable
curriculum primitives — better MCP orientation, search projections, QA, and
graph traversal internally; sector-facing support externally. This collection
is not the home for every graph-shaped idea: sector-facing adoption and external
knowledge-source ingestion live under
[sector-engagement/](../../sector-engagement/) and
[exploring-open-education-resources/](../../exploring-open-education-resources/).

**Active**: [active/](active/) · **Current**: [current/](current/) ·
**Later**: [future/](future/) · **Archive**: [archive/](archive/)

## Current synthesis and ratified decisions (2026-06-04)

The authoritative current synthesis is the deep-review report
[`oak-kg-ontology-deep-review-2026-06-04.md`](../../../reports/oak-kg-ontology-deep-review-2026-06-04.md);
thread state is in
[`oak-kg-ontology-planning-review.next-session.md`](../../../memory/operational/threads/oak-kg-ontology-planning-review.next-session.md).
Owner-ratified decisions now governing this estate:

1. **Threads first** — build the ontology thread surface (`onto-threads`), a tool
   distinct from the bulk-derived thread tooling (`bulk-threads`); not forced to
   match; combine later.
2. **Serving = TTL → substrate** — ingest canonical Turtle via the live
   `graph-ingest` path (ADR-173 Accepted; derived formats are not first-wave).
3. **Cross-source lesson/unit work is deferred** — verified: no shared identity
   key exists between the ontology (numeric `curric:id`) and the public Oak data
   (slug-only in both the bulk export and the API). Only the **thread** join
   works (content-slug both sides). A future bridge is an upstream ask to the
   ontology team (add a `curric:slug` property) — out of our hands, not gating.
4. **Bulk and ontology stay separate / complementary.**
5. **Integration = pinned release-download** of the ontology TTL.

## Live Work

| File | Description |
|------|-------------|
| [current/graph-estate-consolidation.plan.md](current/graph-estate-consolidation.plan.md) | **Master estate plan**: consolidation, decontamination, and the archival record of retired surfaces |
| [active/graph-stack.plan.md](active/graph-stack.plan.md) | Substrate plan: the graph workspaces (`graph-core`, `graph-ingest`, `graph-project`, `graph-corpus-sdk`), sequenced by consumer-readiness (ADR-173). WS4.2 builds the Oak Curriculum Ontology Threads adapter — the dependency for `onto-threads`. Graph workspaces are transport-agnostic (ADR-179) |
| [active/agent-guidance-consolidation.plan.md](active/agent-guidance-consolidation.plan.md) | The scattered, partly-stale tool/resource/prompt guidance for the existing MCP surface becomes one generated catalogue — EEF-independent MCP-DX debt |
| [current/graph-tools-value-redesign.plan.md](current/graph-tools-value-redesign.plan.md) | Value-driven redesign of the existing bulk-derived graph tools onto `graph-corpus-sdk`; bounded retrieval. **PROMOTED 2026-06-09** (EEF D6 + D7 trigger fired); not yet decision-complete — mechanism-settling + executable cycles remain (see its §Remaining promotion work) |

## Parked Surfaces

Wider graph work is sequenced behind the EEF tool
([`eef-graph-tool-completion.plan.md`](../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md))
where it depends on the substrate; each parked plan states its own block
condition. (`graph-tools-value-redesign` was promoted to Live Work on 2026-06-09
when its EEF D6 + D7 trigger fired.)

| File | Description |
|------|-------------|
| [future/oak-kg-threads-surface.plan.md](future/oak-kg-threads-surface.plan.md) | **Lead candidate** (ratified threads-first): Oak KG Threads resource + thread-content tool over the ontology Threads adapter; inverse-edge query primitive |
| [future/nc-knowledge-taxonomy-surface.plan.md](future/nc-knowledge-taxonomy-surface.plan.md) | NC-aligned SKOS knowledge-taxonomy surface (ontology-only; demand-tripwire promotion) |
| [future/cross-source-journeys.plan.md](future/cross-source-journeys.plan.md) | Feature-layer journey orchestration (playbook-vs-prompt question; two reference journeys) — gated on unbuilt substrate adapters |
| [future/oak-misconceptions-graph-features.plan.md](future/oak-misconceptions-graph-features.plan.md) | Bulk-derived misconception feature directions (sub-graph extraction, EEF cross-corpus, topic extraction, extended contexts) |

### Future oak-kg surfaces (backlog)

Candidate ontology surfaces to scope **after `onto-threads` proves the adapter
pattern** — held as a backlog rather than per-surface stubs:

- **Schema browser** — expose ontology classes/properties. Ontology-only; no
  cross-source blocker.
- **IRI traverser** — generic bounded IRI traversal; build only once named
  surfaces prove a generic traverser is needed.
- **Lesson graph surface** — *blocked*: lesson cross-source needs the
  disjoint-identity bridge (decision 3). Ontology-only lesson projection is
  feasible; bulk enrichment is not until an upstream slug bridge exists.
- **Programme navigator** — programme/unit navigation; same disjoint-identity
  blocker as lesson if bulk enrichment is required; ontology-only is feasible.

## Strategy, research, and reports

| File | Type | Description |
|------|------|-------------|
| [../../../reports/oak-kg-ontology-deep-review-2026-06-04.md](../../../reports/oak-kg-ontology-deep-review-2026-06-04.md) | Report (current) | Deep-review synthesis: join-key reality, substrate + ADR constraints, v0.1 coupling constraints, estate verdicts, ratified decisions |
| [../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md) | Report (dated base) | Earlier cross-boundary synthesis; superseded by the 2026-06-04 review but retained as the grounded base |
| [future/extending-graph-support-tooling.plan.md](future/extending-graph-support-tooling.plan.md) | Candidate buffer | Graph-delivery enhancement candidates — each an explicit owner decision |
| [research/elasticsearch-neo4j-oak-ontology-synthesis.research.md](research/elasticsearch-neo4j-oak-ontology-synthesis.research.md) | Research | Elasticsearch + Neo4j synthesis for Oak ontology |

## Read Order

1. **Current synthesis (read first)**:
   [`oak-kg-ontology-deep-review-2026-06-04.md`](../../../reports/oak-kg-ontology-deep-review-2026-06-04.md)
2. **Estate state**:
   [current/graph-estate-consolidation.plan.md](current/graph-estate-consolidation.plan.md)
3. **Substrate plan (read if touching graph code)**:
   [active/graph-stack.plan.md](active/graph-stack.plan.md)
4. **Dated base synthesis**:
   [`oak-ontology-mcp-search-integration-report-2026-04-19.md`](../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md)
5. **External knowledge sources**:
   [../../exploring-open-education-resources/external-knowledge-sources/README.md](../../exploring-open-education-resources/external-knowledge-sources/README.md)

## The Core Threads

1. **Internal Oak KG integration** (this collection): treat the Oak ontology and
   Oak-derived graphs as first-class assets for MCP orientation, `oak-kg-*`
   surfaces, search projections, and QA.
2. **Ontology source integration** (decided): the sibling `oak-curriculum-ontology`
   repo stays a separate upstream; we consume a **pinned TTL release**, never fork
   or curate (ADR-173; ratified decision 5).
3. **External organisation use of Oak KGs**:
   [sector-engagement/knowledge-graph-adoption/](../../sector-engagement/knowledge-graph-adoption/).
4. **External knowledge/data sources**:
   [exploring-open-education-resources/external-knowledge-sources/](../../exploring-open-education-resources/external-knowledge-sources/).

## Promotion Triggers

- **Direct ontology work** (onto-threads adapter, taxonomy surface): promote when
  the substrate Threads adapter (graph-stack WS4.2) is ready.
- **Parked graph surfaces**: revisit when the EEF tool finishes (finishing-plan D7).
- **Cross-source lesson/unit work**: gated on an upstream ontology `curric:slug`
  bridge — promote only if/when that lands.

## Terminology Note

This repo contains simple JSON derivations from bulk API data (the misconception
graph, the prior-knowledge graph, thread progressions). The Oak Curriculum
Ontology is a formally modelled W3C-compliant knowledge graph — a different order
of thing. Bulk-derived graphs and ontology graphs are separate concerns sharing
the `graph-core` / `graph-corpus-sdk` substrate.

## Credits and Attribution

- **Oak Curriculum Ontology**: Mark Hodierne (MH)
  (primary author).

**Author-addition requirement**: when any aspect of the ontology is integrated
functionally into this repo, add MH to the authors list.

## Dependencies

| System | Status | Role |
|---|---|---|
| Oak MCP ecosystem | Production | Tool surface, deployment, discovery |
| Oak Curriculum Ontology | v0.1.0 (unstable; design for change) | Structural source, consumed as a pinned TTL release |

Use the owner-provided sibling `oak-curriculum-ontology` checkout for local
planning/review when available.

## Foundation Documents (Mandatory Re-read)

1. [principles.md](../../../directives/principles.md)
2. [testing-strategy.md](../../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../../directives/schema-first-execution.md)

First question: Could it be simpler without compromising quality?
