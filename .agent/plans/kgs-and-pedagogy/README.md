# Knowledge Graphs and Pedagogy

Evidence-grounded curriculum discovery: integrating Oak's curriculum
infrastructure with pedagogical evidence from the EEF Teaching and
Learning Toolkit, bridged by the Oak Curriculum Ontology.

**Later Plans**: [future/](future/)

## Documents

| File | Type | Description |
|------|------|-------------|
| `future/evidence-integration-strategy.md` | Strategic brief | Impact requirements, three-layer architecture, integration levels, crosswalk design |
| `future/oak-eef-technical-comparison.md` | Technical reference | Implementation-level comparison of EEF and Oak MCP stacks |
| `future/eef-toolkit.json` | Data reference | Full EEF Toolkit dataset (30 strands, v0.2.0, April 2026) |
| `future/ontology-integration-strategy.md` | Strategic brief | Moving from static ontology copies to dynamic integration (published package or workspace) |

## Read Order

1. **Strategy first**: `future/evidence-integration-strategy.md`
2. **Ontology integration**: `future/ontology-integration-strategy.md`
3. **Technical detail**: `future/oak-eef-technical-comparison.md`
4. **Data reference**: `future/eef-toolkit.json` (when needed)

## Document Roles (DRY)

- **Strategy**: intent, impact requirements, integration levels, goals
  comparison, strategic questions. The authoritative document for *why*
  and *what*.
- **Technical comparison**: implementation detail, scoring algorithm,
  data model, evidence map. The authoritative document for *how* the
  prototype works.
- **Data file**: the actual EEF dataset. Authoritative for strand
  content, metrics, and coverage.

## The Core Thesis

Oak answers "what curriculum content exists?" EEF answers "what does
evidence say about effective teaching?" Neither alone delivers what
teachers need. The composition — evidence-grounded curriculum
discovery — enables a new class of AI-assisted teaching support:

1. **What** content exists for this topic/phase
2. **How** it should be taught, based on evidence
3. **Why** those approaches (transparent scoring, evidence strength)
4. **What caveats** apply (honest confidence calibration)
5. **Where** teacher professional judgement must override the model

The Oak Curriculum Ontology provides the structural bridge: formal
vocabulary (Discipline → Strand → SubStrand → ContentDescriptor) for
mapping evidence to curriculum content.

## Promotion Triggers

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
| Oak MCP ecosystem (Layer 1) | Production | Tool surface and deployment |
| Oak Curriculum Ontology (Layer 2) | v0.1.0, stable | Structural bridge vocabulary |
| EEF Toolkit data (Layer 3) | v0.2.0, 30 strands | Evidence source |

## Foundation Documents (Mandatory Re-read)

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question: Could it be simpler without compromising quality?
