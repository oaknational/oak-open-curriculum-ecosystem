# Knowledge Graph Integration

Internal engineering hub for Oak-owned knowledge graph work: integrating the
Oak Curriculum Ontology and Oak-derived graphs into the MCP server, semantic
search service, QA workflows, and any future graph-serving layer.

The wider goal is to unlock impact from Oak's knowledge graphs as reusable
curriculum primitives. Internally, this means better MCP orientation, search
projections, QA, and graph traversal. Externally, it means sector-facing
support for organisations that want to understand or build on Oak's ontology,
graph exports, SDKs, MCP resources, and search projections.

This collection is deliberately not the home for every graph-shaped idea:
sector-facing adoption and external knowledge/data-source ingestion now live
under [sector-engagement/](../sector-engagement/).

**Active Plans**: [active/](active/)
**Current Queue**: [current/](current/)
**Later Plans**: [future/](future/)
**Archive**: [archive/](archive/)

## Active Execution

| File | Description |
|------|-------------|
| [active/open-education-knowledge-surfaces.plan.md](active/open-education-knowledge-surfaces.plan.md) | Historical umbrella plan: multi-source knowledge surfaces, now split across internal KG and sector-engagement lanes |
| [active/graph-resource-factory.plan.md](active/graph-resource-factory.plan.md) | WS-1: Shared graph resource factory (DONE) |
| [active/misconception-graph-mcp-surface.plan.md](active/misconception-graph-mcp-surface.plan.md) | WS-2: Misconception graph MCP surface (DONE) |
| [active/nc-knowledge-taxonomy-surface.plan.md](active/nc-knowledge-taxonomy-surface.plan.md) | WS-4: Oak KG knowledge taxonomy from ontology |
| [active/agent-guidance-consolidation.plan.md](active/agent-guidance-consolidation.plan.md) | WS-5: Agent guidance consolidation |

## Current Queue

| File | Description |
|------|-------------|
| [current/kg-alignment-audit.execution.plan.md](current/kg-alignment-audit.execution.plan.md) | First canonical overlap audit between ontology graph and search-facing records |
| [current/kg-integration-quick-wins.plan.md](current/kg-integration-quick-wins.plan.md) | Safe projection-first graph integration opportunities |
| [current/graph-query-layer.plan.md](current/graph-query-layer.plan.md) | Increment 1 of EEF graph-and-corpus delivery: 7-operation polymorphic query layer over prerequisite + misconception + EEF strands, with progressive disclosure (manifest → summary → detail → edge) and mandatory projection. Foundation for [`../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../sector-engagement/eef/current/eef-evidence-corpus.plan.md). |

## Strategy and Research

| File | Type | Description |
|------|------|-------------|
| [oak-ontology-graph-opportunities.strategy.md](oak-ontology-graph-opportunities.strategy.md) | Strategy | Search-adjacent graph opportunity assessment |
| [research/elasticsearch-neo4j-oak-ontology-synthesis.research.md](research/elasticsearch-neo4j-oak-ontology-synthesis.research.md) | Research | Elasticsearch + Neo4j synthesis for Oak ontology |

## Documents

| File | Type | Description |
|------|------|-------------|
| [future/ontology-integration-strategy.md](future/ontology-integration-strategy.md) | Strategic brief | Moving from static ontology copies to dynamic integration (published package or workspace) |
| [future/oak-curriculum-ontology-workspace-reassessment.plan.md](future/oak-curriculum-ontology-workspace-reassessment.plan.md) | Strategic brief | Re-open the previous no-monorepo decision now that MCP, KGs, and API convergence is an organisational priority |
| [future/ontology-repo-fresh-perspective-review.plan.md](future/ontology-repo-fresh-perspective-review.plan.md) | Short future plan | Re-read the official ontology repo from an upstream-first starting point and write up what that fresh pass changes |
| [future/direct-ontology-use-and-graph-serving-prototypes.plan.md](future/direct-ontology-use-and-graph-serving-prototypes.plan.md) | Strategic future plan | Start with direct ontology use as the control case, then compare bounded Neo4j and Stardog serving prototypes against the same Oak use cases |
| [../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md) | Formal report | Cross-boundary synthesis tying the official ontology to MCP orientation, direct ontology resources, search projections, and governance/update needs |
| [../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md](../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md) | Research note | Direct-use baseline plus Neo4j/Stardog serving-platform comparison for external user-facing graph features |

## Read Order

1. **Current formal synthesis**:
   [../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md)
2. **Direct-use versus platform comparison**:
   [future/direct-ontology-use-and-graph-serving-prototypes.plan.md](future/direct-ontology-use-and-graph-serving-prototypes.plan.md)
3. **Ontology workspace reassessment**:
   [future/oak-curriculum-ontology-workspace-reassessment.plan.md](future/oak-curriculum-ontology-workspace-reassessment.plan.md)
4. **Ontology source strategy**:
   [future/ontology-integration-strategy.md](future/ontology-integration-strategy.md)
5. **Fresh-perspective follow-on**:
   [future/ontology-repo-fresh-perspective-review.plan.md](future/ontology-repo-fresh-perspective-review.plan.md)
6. **Search-adjacent graph strategy**:
   [oak-ontology-graph-opportunities.strategy.md](oak-ontology-graph-opportunities.strategy.md)
7. **Platform research note**:
   [../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md](../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md)
8. **External knowledge sources**:
   [../sector-engagement/external-knowledge-sources/README.md](../sector-engagement/external-knowledge-sources/README.md)

## Document Roles (DRY)

- **Ontology and platform strategy**: intent, impact requirements,
  integration levels, platform-decision framing, workspace-integration
  questions, and strategic questions. The authoritative document for *why* and
  *what*.
- **Formal report**: promoted synthesis tying the official ontology to
  current MCP orientation, direct ontology surfaces, search projections,
  QA, and governance/update implications.
- **Research note**: evidence-backed platform comparison and workload framing
  for direct ontology use versus Neo4j and Stardog downstream serving.
- **Prototype comparison plan**: strategic brief for testing the same use
  cases through direct use, Neo4j, and Stardog before any platform
  commitment is promoted into executable work.
- **Fresh-perspective review plan**: short follow-on plan for re-reading
  the official ontology repo upstream-first so local assumptions can be
  tested rather than inherited.

## The Core Threads

The knowledge-graph programme is split into four connected but distinct
threads:

1. **Internal Oak KG integration** (this collection): treat the official Oak
   ontology and Oak-derived graphs as first-class assets for MCP orientation,
   standalone `oak-kg-*` surfaces, search projections, QA, and later
   serving-platform evaluation.
2. **Ontology repo / workspace integration** (this collection): decide whether
   the sibling `oak-curriculum-ontology` repo remains a separate Python repo,
   becomes a published artefact dependency, or is brought into this monorepo
   with explicit developer-experience safeguards.
3. **External organisation use of Oak KGs**:
   [sector-engagement/knowledge-graph-adoption/](../sector-engagement/knowledge-graph-adoption/)
   owns how MATs, edtechs, researchers, and other organisations can use Oak's
   ontology, graph exports, SDKs, MCP resources, and search projections.
4. **External knowledge/data sources**:
   [sector-engagement/external-knowledge-sources/](../sector-engagement/external-knowledge-sources/)
   owns EEF, education skills, external curriculum APIs, and future third-party
   knowledge graphs used as data sources for Oak applications.

The governing baseline is:

1. use pinned ontology artefacts directly where they already create value
2. evaluate `neither`, `Neo4j`, `Stardog`, or `both` only after the direct-use
   baseline is explicit
3. route sector-facing and external-source questions to sector-engagement
   rather than hiding them in internal KG plans

## Promotion Triggers

**Direct ontology work** (report follow-on, audit, direct-use baseline,
platform comparison): can promote independently whenever ontology-serving,
QA, or search-projection questions need execution.

**Ontology workspace reassessment**: promote when the owner wants an
architecture decision about whether the separate Python ontology repo should
remain separate, become a generated/published dependency, or enter this
monorepo.

**External source/adoption work**: promote through the sector-engagement
subthreads when the next action is a partner-facing playbook, external
data-source feasibility spike, or adoption support plan.

## Terminology Note

This repo contains simple JSON derivations from bulk API data (ADR-059's
curriculum concept map, the misconception graph, the prior knowledge graph).
The Oak Curriculum Ontology is a formally modelled W3C-compliant
knowledge graph — a different order of thing. Levels 1-3 work with
bulk data. Levels 4/4b work with the formal ontology.

## Credits and Attribution

- **Oak Curriculum Ontology**: Mark Hodierne (MH)
  `<mark@markhodierne.com>` (primary author, 170 commits)

**Author-addition requirement**: When any aspect of the KG is integrated
functionally into the oak-mcp-ecosystem repo, add MH to the authors list.
External-source attribution requirements live with the sector-engagement
source thread.

## Dependencies

| System | Status | Role |
|---|---|---|
| Oak MCP ecosystem | Production | Tool surface, deployment, and discovery surfaces |
| Oak Curriculum Ontology | v0.1.0, stable | Structural source for direct ontology use and later serving evaluation |

Use the owner-provided sibling `oak-curriculum-ontology` checkout for local
planning/review when available.

## Foundation Documents (Mandatory Re-read)

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question: Could it be simpler without compromising quality?
