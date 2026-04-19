# Knowledge Graph Integration

Ontology and knowledge-graph hub for Oak's formal curriculum model,
direct ontology-backed surfaces, search projections, QA/governance
work, downstream graph-serving evaluation, and adjacent evidence or
pedagogy integrations.

The EEF and pedagogy work is an important sibling lane here, but it is
not the identity of the collection.

**Later Plans**: [future/](future/)

## Documents

| File | Type | Description |
|------|------|-------------|
| [future/evidence-integration-strategy.md](future/evidence-integration-strategy.md) | Strategic brief | Impact requirements, three-layer architecture, integration levels, crosswalk design |
| [future/oak-eef-technical-comparison.md](future/oak-eef-technical-comparison.md) | Technical reference | Implementation-level comparison of EEF and Oak MCP stacks |
| [future/eef-toolkit.json](future/eef-toolkit.json) | Data reference | Full EEF Toolkit dataset (30 strands, v0.2.0, April 2026) |
| [future/ontology-integration-strategy.md](future/ontology-integration-strategy.md) | Strategic brief | Moving from static ontology copies to dynamic integration (published package or workspace) |
| [future/ontology-repo-fresh-perspective-review.plan.md](future/ontology-repo-fresh-perspective-review.plan.md) | Short future plan | Re-read the official ontology repo from an upstream-first starting point and write up what that fresh pass changes |
| [future/direct-ontology-use-and-graph-serving-prototypes.plan.md](future/direct-ontology-use-and-graph-serving-prototypes.plan.md) | Strategic future plan | Start with direct ontology use as the control case, then compare bounded Neo4j and Stardog serving prototypes against the same Oak use cases |
| [../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md) | Formal report | Cross-boundary synthesis tying the official ontology to MCP orientation, direct ontology resources, search projections, and governance/update needs |
| [../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md](../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md) | Research note | Direct-use baseline plus Neo4j/Stardog serving-platform comparison for external user-facing graph features |

## Read Order

1. **Current formal synthesis**:
   [../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md)
2. **Direct-use versus platform comparison**:
   [future/direct-ontology-use-and-graph-serving-prototypes.plan.md](future/direct-ontology-use-and-graph-serving-prototypes.plan.md)
3. **Ontology source strategy**:
   [future/ontology-integration-strategy.md](future/ontology-integration-strategy.md)
4. **Fresh-perspective follow-on**:
   [future/ontology-repo-fresh-perspective-review.plan.md](future/ontology-repo-fresh-perspective-review.plan.md)
5. **Search-adjacent graph strategy**:
   [oak-ontology-graph-opportunities.strategy.md](oak-ontology-graph-opportunities.strategy.md)
6. **Platform research note**:
   [../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md](../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md)
7. **Evidence integration strategy**:
   [future/evidence-integration-strategy.md](future/evidence-integration-strategy.md)
8. **Technical detail**: [future/oak-eef-technical-comparison.md](future/oak-eef-technical-comparison.md)
9. **Data reference**: [future/eef-toolkit.json](future/eef-toolkit.json) (when needed)

## Document Roles (DRY)

- **Ontology and platform strategy**: intent, impact requirements,
  integration levels, platform-decision framing, and strategic
  questions. The authoritative document for *why* and *what*.
- **Technical comparison**: implementation detail, scoring algorithm,
  data model, evidence map. The authoritative document for *how* the
  prototype works.
- **Data file**: the actual EEF dataset. Authoritative for strand
  content, metrics, and coverage.
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

This collection now carries two connected but distinct threads:

1. **Ontology and knowledge-graph work**: treat the official Oak
   ontology as a first-class structural asset for MCP orientation,
   standalone `oak-kg-*` surfaces, search projections, QA, and later
   serving-platform evaluation.
2. **Evidence and pedagogy integration**: compose EEF and related
   pedagogical sources with Oak's curriculum surfaces once the
   structural ontology boundary is clear.

The governing baseline is:

1. use pinned ontology artefacts directly where they already create value
2. evaluate `neither`, `Neo4j`, `Stardog`, or `both` only after the direct-use
   baseline is explicit
3. let EEF and pedagogy work enrich the lane without redefining it as an
   EEF-only programme

## Promotion Triggers

**Direct ontology work** (report follow-on, audit, direct-use baseline,
platform comparison): can promote independently whenever ontology-serving,
QA, or search-projection questions need execution.

**Levels 1-3** (EEF resources, recommendation tool, prompts): ready
to promote to `current/` now. These use EEF JSON data directly and
do not depend on the ontology or KG alignment audit.

**Levels 4/4b** (ontology extension, graph queries): promote when
the KG alignment audit completes, or the EEF project reaches v0.5.

## Terminology Note

This repo contains simple JSON derivations from bulk API data (ADR-059's
curriculum concept map, the misconception graph, the prior knowledge graph).
The Oak Curriculum Ontology is a formally modelled W3C-compliant
knowledge graph — a different order of thing. Levels 1-3 work with
bulk data. Levels 4/4b work with the formal ontology.

## Credits and Attribution

- **EEF Toolkit data**: Education Endowment Foundation
- **EEF MCP server prototype**: John Roberts (JR)
  `<john.roberts@thenational.academy>`
- **Oak Curriculum Ontology**: Mark Hodierne (MH)
  `<mark@markhodierne.com>` (primary author, 170 commits)

**Author-addition requirement**: When any aspect of the EEF work or
the KG is integrated functionally into the oak-mcp-ecosystem repo,
add JR and/or MH to the authors list.

## Dependencies

| System | Status | Role |
|---|---|---|
| Oak MCP ecosystem | Production | Tool surface, deployment, and discovery surfaces |
| Oak Curriculum Ontology | v0.1.0, stable | Structural source for direct ontology use and later serving evaluation |
| EEF Toolkit data | v0.2.0, 30 strands | Evidence source for the sibling pedagogy lane |

## Foundation Documents (Mandatory Re-read)

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question: Could it be simpler without compromising quality?
