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
    status: done
  - id: ws-1-factory
    content: "WS-1: Extract graph resource factory, refactor existing graphs (prerequisite plan)"
    status: done
  - id: ws-2-misconceptions
    content: "WS-2: Misconception graph MCP surface (first consumer of factory)"
    status: done
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

**Status**: ACTIVE — WS-0, WS-1, WS-2 complete; WS-3 next
**Last Updated**: 2026-04-10
**Branch**: `planning/kg_eef_integration`

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

## Session Progress (2026-04-10)

### WS-0: DONE

- ADR-157 written and indexed
- Root README updated with Data Sources table, Credits and Attribution
- LICENCE-DATA.md updated with ontology + EEF sections
- package.json contributors added (Hodierne, Roberts)
- ADR count updated to 155+
- `docs-adr-reviewer` passed — COMPLIANT

### WS-1 + WS-2 (merged into WS-A): DONE

- `graph-resource-factory.ts` — generic `<T extends { readonly version: string }>`,
  4 composable factory functions, SDK-internal (not publicly exported)
- Prerequisite graph and thread progressions refactored to use factory
- Misconception graph surface implemented as first factory consumer
  (resource + tool + guidance, 12,858 misconceptions)
- App-layer `registerGraphResource` helper replaces per-resource functions
- Documentation resource annotations added (priority, audience)
- Curriculum model TSDoc exception documented
- ADR-123 updated (tool count 35, resource count 4+widget)

### Key Design Decisions Made

- **Factory generic**: `<T extends { readonly version: string }>` (not `unknown`)
- **No prerequisite guidance on graph tools**: Only `get-curriculum-model`
  is a prerequisite. All graph tools are supplementary, loaded as needed.
- **Factory SDK-internal**: Not exported from `public/mcp-tools.ts`
- **Registration in app layer**: `registerGraphResource` needs observability
- **URI scheme**: All `curriculum://` with source-identifying path segments
- **EEF data placement** (for WS-3): Lives in SDK, not codegen — fully
  typed with Zod validation at load time

### Reviewer Findings Applied

4 pre-implementation reviewers (betty, barney, mcp, code) + 5 post-
implementation reviewers (code, type, test, fred, docs-adr). All findings
addressed:

- `[...SCOPES_SUPPORTED]` → `SCOPES_SUPPORTED` (tuple preservation)
- Explicit return type on `createGraphToolDef`
- Removed redundant `as const` assertions
- Module-level executor constants (no per-call closure recreation)
- Priority type narrowed to `0.5 | 1.0` in app registration
- WorkflowStep type alias inlined
- Missing `aggregated-misconception-graph.unit.test.ts` created
- Weak length-threshold test assertions replaced with domain checks
- ADR-123 tool count updated to 35 (11 aggregated)

### Next Session: Pre-commit fixes then WS-3

**Pre-commit tasks** (do before committing WS-0/1/2):

1. **Rename prior knowledge graph**: "prior knowledge graph" is ambiguous.
   Rename to make clear it's about student prior-knowledge
   prerequisites for curriculum sequencing (not tool prerequisites).
   Rename-everywhere: URI, tool name, file names, ADR-123, all
   references.
2. **Delete fragile idempotency tests**: The `is idempotent — returns
   identical data on repeated calls` tests on graph tools prove
   nothing (pure function over module constant). Delete them.
3. **Delete weak constant-assertion tests**: Tests asserting string
   length or checking `typeof` prove nothing about behaviour.
4. **Run `/jc-consolidate-docs`**: Napkin has new entries, plans were
   updated substantially. Also triage 5 overlooked items from archived
   napkins: server branding (S5), generated tool titles (S3), synonym
   builder codegen migration, `static-content.ts` process.cwd() bug,
   E2E test flakiness.

**Then WS-3: EEF Evidence Surface**

**Blocking EEF plan findings from pre-implementation review** (must
resolve in next session before coding):

1. EEF data lives in `oak-curriculum-sdk/src/mcp/data/` (not codegen)
2. All `EefToolkitData` fields fully typed — no `Record<string, unknown>`
3. `as const satisfies` incompatible with `createRequire` — use direct
   type annotation
4. Null-impact guard for scoring (4 strands have `impact_months: null`)
5. URI scheme: `curriculum://eef-methodology`, `curriculum://eef-strands`
6. Build-time Zod validation for EEF JSON schema drift
7. Prompt step 3 clarification + KS-to-phase mapping in prompt text

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
   links, descriptions, and licence information:
   - Oak Open Curriculum API — OGL
     ([open-api.thenational.academy](https://open-api.thenational.academy/))
   - Oak Curriculum Ontology — OGL (data) + MIT (code)
     ([oak-curriculum-ontology](https://github.com/oaknational/oak-curriculum-ontology))
   - EEF Teaching and Learning Toolkit — attribution required
     ([EEF](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit))
3. Update the capabilities table to include ontology-derived and
   evidence-derived surfaces
4. Add a **Credits and Attribution** section with:
   - Education Endowment Foundation (data source, citation required)
   - John Roberts (EEF MCP prototype)
   - Mark Hodierne (Oak Curriculum Ontology, primary author)
   - Link to `LICENCE-DATA.md` for upstream data licence terms
5. Reference `LICENCE-DATA.md` from the data sources section so
   licence obligations are clear to all consumers

The README update should make it clear within 30 seconds of reading
that this repository brings together three major open education assets.

## WS-1: Graph Resource Factory

**Child plan**: `graph-resource-factory.plan.md`

Extract shared infrastructure from the 3 existing graph surfaces
(prior knowledge graph, thread progressions, curriculum model):

- `createGraphResource()` — resource constant from config
- `createGraphJsonGetter()` — JSON serialisation
- `createGraphToolDef()` — tool definition with annotations
- `createGraphToolExecutor()` — executor returning `formatToolResponse`
- `createGraphResourceRegistrar()` — registration function

Then refactor the 3 existing surfaces to use the factory. Verify with
existing tests — no behavioural change, just DRY extraction.

## WS-2: Misconception Graph Surface

**Existing plan**: `misconception-graph-mcp-surface.plan.md`

Uses the graph factory. 12,858 misconceptions from bulk data. Resource and
tool following prior-knowledge-graph pattern. ~200 lines reduced to ~50 lines
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
