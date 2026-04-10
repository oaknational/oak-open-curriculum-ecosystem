---
name: "Open Education Knowledge Surfaces"
overview: "Coordinate the integration of three open education data sources (Oak API, Oak Ontology, EEF Toolkit) into the MCP server as graph resources, tools, and prompts — and declare this multi-source integration prominently in documentation."
status: active
child_plans:
  - "graph-resource-factory.plan.md"
  - "misconception-graph-mcp-surface.plan.md"
  - "eef-evidence-mcp-surface.plan.md"
  - "nc-knowledge-taxonomy-surface.plan.md"
  - "agent-guidance-consolidation.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, docs-adr-reviewer, architecture-reviewer-betty"
todos:
  - id: ws-0-narrative
    content: "WS-0: Write ADR for multi-source open education integration and update root README"
    status: pending
  - id: ws-1-factory
    content: "WS-1: Extract graph resource factory, refactor existing graphs (prerequisite plan)"
    status: pending
  - id: ws-2-misconceptions
    content: "WS-2: Misconception graph MCP surface (first consumer of factory)"
    status: pending
  - id: ws-3-eef
    content: "WS-3: EEF evidence MCP surface (recommendation tool + resources + prompt)"
    status: pending
  - id: ws-4-nc-taxonomy
    content: "WS-4: NC knowledge taxonomy from ontology (smallest KG integration)"
    status: pending
  - id: ws-5-guidance
    content: "WS-5: Agent guidance consolidation (after all new surfaces exist)"
    status: pending
  - id: ws-6-docs-propagation
    content: "WS-6: Final documentation propagation — update root README data source counts, ADR-123, VISION.md"
    status: pending
---

# Open Education Knowledge Surfaces

**Status**: ACTIVE
**Last Updated**: 2026-04-10
**Branch**: TBD (new branch from `main`)

## Why This Plan Exists

This repository currently integrates a single data source: the
[Oak Open Curriculum API](https://open-api.thenational.academy/).

This plan coordinates the integration of **two additional open
education data sources** into the MCP server:

1. **Oak Curriculum Ontology**
   ([oak-curriculum-ontology](https://github.com/oaknational/oak-curriculum-ontology))
   — a W3C-compliant formal knowledge graph (RDF, OWL, SKOS, SHACL)
   modelling the UK National Curriculum and Oak's teaching programmes.
   Primary author: Mark Hodierne.

2. **EEF Teaching and Learning Toolkit**
   ([EEF](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit))
   — 30 evidence-synthesised teaching approaches with quantified
   impact, cost, and evidence strength. EEF MCP server prototype by
   John Roberts `<john.roberts@thenational.academy>`.

Together these three sources answer three questions that teachers ask:

| Question | Source | What It Provides |
|---|---|---|
| **What content exists?** | Oak Open Curriculum API | Lessons, units, threads, sequences, quizzes, transcripts |
| **How is the curriculum structured?** | Oak Curriculum Ontology | Formal NC knowledge taxonomy, progressions, concept relationships |
| **What teaching approaches work?** | EEF Teaching and Learning Toolkit | Evidence-backed pedagogical recommendations with transparent scoring |

**This is a strategic inflection point.** The repository moves from
"typed API wrapper with search" to "multi-source open education
knowledge infrastructure." The documentation must reflect this
prominently — in the root README, in a dedicated ADR, and in the
vision document.

## Strategic Context

- **Evidence integration strategy**:
  `.agent/plans/kgs-and-pedagogy/future/evidence-integration-strategy.md`
  (R1-R8 impact-preserving requirements)
- **KG alignment audit**: `.agent/plans/semantic-search/current/kg-alignment-audit.execution.plan.md`
  (ACTIVE — measures ontology-search overlap for deeper integration later)
- **M2 milestone**: `.agent/milestones/m2-extension-surfaces.md`
  (KG alignment is an M2 gate)

This plan implements Levels 1-3 of the evidence integration strategy
(EEF JSON + bulk data — no ontology dependency) plus the smallest
meaningful KG integration (NC knowledge taxonomy — static extraction,
no Neo4j). The deeper ontology integration (Levels 4/4b) follows the
KG alignment audit and is tracked separately.

## Next Session Protocol

The next session (WS-0, WS-1, WS-2) MUST begin with an **iterative
plan review** before any code is written. Launch these specialist
reviewers against the full plan family:

- `architecture-reviewer-betty` — cohesion, coupling, change-cost
- `architecture-reviewer-barney` — boundary simplification
- `mcp-reviewer` — MCP protocol compliance and patterns
- `code-reviewer` — gateway quality, correctness

Fix all findings before starting WS-0 implementation.

## Execution Order

```text
WS-0: Narrative (ADR + README + Authors) ← sets the frame
  ↓
WS-1: Graph resource factory             ← shared infrastructure
  ↓ (refactors existing graphs)
  ↓
WS-2: Misconception graph surface        ← first factory consumer
WS-3: EEF evidence surface               ← recommendation tool + R1-R8
WS-4: NC knowledge taxonomy surface      ← smallest KG integration
  ↓ (WS-2, WS-3, WS-4 can partially overlap)
  ↓
WS-5: Agent guidance consolidation       ← after all new surfaces exist
  ↓
WS-6: Documentation propagation          ← final counts and cross-refs
```

## WS-0: Narrative (ADR + README + Authors)

**Do this first.** The strategic narrative frames everything that follows.

### Authors

As soon as WS-0 begins, add both contributors to `package.json`
(or the repo's authors list), sorted alphabetically by last name:

- Jim Cresswell (existing)
- Mark Hodierne `<mark@markhodierne.com>` (ontology)
- John Roberts `<john.roberts@thenational.academy>` (EEF prototype)

### ADR: Multi-Source Open Education Knowledge Integration

Write a new ADR covering:

- **Context**: Oak currently wraps a single API. The open education
  landscape includes the formal ontology and EEF evidence. Bringing
  them together creates capabilities none provides alone.
- **Decision**: Integrate the Oak Curriculum Ontology and the EEF
  Teaching and Learning Toolkit as data sources alongside the Oak
  Open Curriculum API, exposed through MCP resources, tools, and
  prompts.
- **Data sources**:
  - [Oak Open Curriculum API](https://open-api.thenational.academy/)
    — OpenAPI-generated types, validators, tools
  - [Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology)
    — W3C RDF/OWL/SKOS/SHACL, NC knowledge taxonomy
  - [EEF Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit)
    — 30 evidence strands, impact/cost/evidence metrics
- **Benefits**: curriculum content + curriculum structure + pedagogical
  evidence = evidence-grounded curriculum discovery
- **Early days, growing impact**: this is the beginning of a
  multi-source integration that will deepen as the ontology matures,
  EEF data expands, and Oak's knowledge graph work progresses. The
  value of these collaborations compounds over time.
- **Licensing**: Oak API data under OGL, ontology under OGL + MIT
  code, EEF data requires attribution.
- **Attribution**: EEF, John Roberts (EEF prototype), Mark Hodierne
  (ontology).

### Root README Update

Update the root README to:

1. Change "Three capabilities, all generated from the Oak Open
   Curriculum API" to acknowledge three data sources
2. Add a prominent **Data Sources** section listing all three with
   links and descriptions
3. Update the capabilities table to include ontology-derived and
   evidence-derived surfaces
4. Add attribution for EEF and the ontology project

The README update should make it clear within 30 seconds of reading
that this repository brings together three major open education assets.

## WS-1: Graph Resource Factory

**Child plan**: `graph-resource-factory.plan.md`

Extract shared infrastructure from the 3 existing graph surfaces
(prerequisite graph, thread progressions, curriculum model):

- `createGraphResource()` — resource constant from config
- `createGraphJsonGetter()` — JSON serialisation
- `createGraphToolDef()` — tool definition with annotations
- `createGraphToolExecutor()` — executor returning `formatToolResponse`
- `createGraphResourceRegistrar()` — registration function

Then refactor the 3 existing surfaces to use the factory. Verify with
existing tests — no behavioural change, just DRY extraction.

## WS-2: Misconception Graph Surface

**Existing plan**: `misconception-graph-mcp-surface.plan.md`

Uses the graph factory. 12,858 misconceptions from bulk data. Resource
+ tool following prerequisite-graph pattern. ~200 lines → ~50 lines
with factory.

## WS-3: EEF Evidence Surface

**Existing plan**: `eef-evidence-mcp-surface.plan.md`

2 resources (methodology+caveats, strands overview), 1 recommendation
tool (`recommend-evidence-for-context` with 40/30/20/10 scoring),
1 prompt (`evidence-grounded-lesson-plan`). Satisfies R1-R8.

The resources use the graph factory. The recommendation tool is custom
(has parameters and scoring logic).

## WS-4: NC Knowledge Taxonomy Surface

**New plan needed**: `nc-knowledge-taxonomy-surface.plan.md`

The smallest meaningful integration of the Oak Curriculum Ontology.

Extract the SKOS knowledge taxonomy
(Discipline → Strand → SubStrand → ContentDescriptor) from the
ontology's `.ttl` files into a JSON data file at build time. Expose
as `curriculum://nc-knowledge-taxonomy` resource + `get-nc-knowledge-taxonomy`
tool using the graph factory.

This is genuine ontology-derived data that does NOT exist in the bulk
data. It provides structured NC content that teachers can use to verify
curriculum coverage.

**Data source**: `oak-curriculum-ontology/data/subjects/*/` knowledge
taxonomy `.ttl` files.

**Extraction**: A build-time script that parses Turtle SKOS triples
and outputs structured JSON. Runs as part of `pnpm sdk-codegen` or
as a standalone build step.

**Attribution**: Mark Hodierne must be added to the authors list when
this ships.

## WS-5: Agent Guidance Consolidation

**Existing plan**: `agent-guidance-consolidation.plan.md`

Runs after WS-2, WS-3, WS-4 so it can consolidate the full tool
surface. Single tool catalogue, generated prerequisite guidance,
updated workflows, validation tests.

## WS-6: Documentation Propagation

After all surfaces ship:

1. Update root README tool/resource counts
2. Update ADR-123 with all new resources and tools
3. Update VISION.md capability status table
4. Update the M2 milestone if this work changes gate status
5. Run `pnpm practice:fitness:informational`

## Attribution Requirements

| Source | Attribution | When |
|---|---|---|
| Education Endowment Foundation | Always attribute when citing data | All EEF surfaces |
| John Roberts `<john.roberts@thenational.academy>` | Add to authors list | When EEF surface ships (WS-3) |
| Mark Hodierne `<mark@markhodierne.com>` | Add to authors list | When NC taxonomy ships (WS-4) |

## Exit Criteria (Parent Plan)

1. ADR for multi-source integration exists and is indexed
2. Root README prominently declares three data sources
3. Graph factory exists and is used by all graph surfaces
4. All 4 new MCP surfaces are live (misconceptions, EEF resources +
   tool + prompt, NC taxonomy)
5. Agent guidance consolidated for the full tool surface
6. ADR-123, VISION.md, and root README updated with final counts
7. `pnpm check` passes
8. Attribution requirements met

## Foundation Alignment

- [principles.md](../../directives/principles.md) — strict, complete,
  schema-first, separate framework from consumer
- [testing-strategy.md](../../directives/testing-strategy.md) — TDD
  at all levels
- [schema-first-execution.md](../../directives/schema-first-execution.md)
  — types flow from schema (EEF data gets typed at ingestion)

First question: Could it be simpler without compromising quality?
