# Next-Session Record — `oak-kg-ontology-planning-review` thread

> **THREAD OPENED 2026-06-04 (Twilit Cascading Supernova / `bb53a9`, claude / Opus 4.8,
> owner-directed) — brief only; the deep review is the FRESH session's work, NOT done here.**
> Owner directed a new thread to plan the `oak-kg` / ontology work, **starting with a deep
> review of the current Oak Curriculum Ontology repo**. This record is the cold-start brief.

## Lane state

- **Owning plan(s)**: none yet — the deep review is the first activity and will *shape* the
  plan. Author the planning artefact(s) from the review's findings; do not pre-author a plan
  before the review (premature crystallisation).
- **Current objective**: deeply review the current Oak Curriculum Ontology, then scope the
  `oak-kg` / ontology planning work (which already-parked `oak-kg-*` surfaces revive, in what
  order, on which serving model, and how it relates to — but stays separate from — the
  bulk-derived graph redesign).
- **Current state**: not started. Setup only.

## Next safe step (the fresh session's first move)

1. **Start-right**, then read the grounding inputs below before touching the ontology.
2. **Deep-review the ontology repo** — it is checked out locally (faster + fuller than GitHub):
   - Local checkout: `/Users/jim/code/oak/oak-curriculum-ontology`
   - GitHub: `https://github.com/oaknational/oak-curriculum-ontology`
   Read the schema (`ontology/oak-curriculum-ontology.ttl`), the SHACL constraints
   (`ontology/oak-curriculum-constraints.ttl`), a representative slice of `data/**` (temporal,
   programme-structure, threads, a subject's taxonomy + a key-stage file), the Neo4j export
   config/architecture (`scripts/export_to_neo4j*`), and the README. Produce an assessment under
   `.agent/reports/` (per `feedback_reports_live_in_agent_reports`).
3. From the assessment, propose the `oak-kg` / ontology planning shape for owner ratification —
   naming decisions, not making them (`feedback_research_outputs_name_not_make_decisions`).

## Grounding inputs (read FIRST — much is already established; do not re-derive)

- **The two-source map + named decisions**:
  [`graph-kg-estate-and-two-source-survey-2026-06-04.md`](../../../reports/graph-kg-estate-and-two-source-survey-2026-06-04.md)
  — §4 names the still-open decisions this thread inherits (one-graph-or-two-joined; anchor
  doctrine; positioning; EEF sequencing); §6 records the owner decisions already made.
- **The separate-concern boundary** (owner-directed): the bulk-derived curriculum graphs
  (`graph-tools-value-redesign.plan.md`, parked on EEF D6 + D7) and the **ontology graphs** are
  **distinct concerns sharing the `graph-core`/`graph-corpus-sdk` substrate**. This thread owns
  the ontology side. Concepts live in the ontology (its SKOS taxonomy), not the bulk source; any
  cross-source (concept) capability is gated on a **bulk↔ontology alignment audit**.
- **Existing parked estate to revive/reconcile** (the survey maps these): the `oak-kg-*` surface
  plans (`oak-kg-threads-surface` + siblings lesson/programme/schema-browser/iri-traverser),
  `cross-source-journeys`, `ontology-integration-strategy`,
  `direct-ontology-use-and-graph-serving-prototypes`,
  `oak-curriculum-ontology-workspace-reassessment`, the elasticsearch-neo4j-ontology synthesis
  research. ADRs: **ADR-157** (multi-source integration; `oak-kg-*` namespace; source-authority
  split), **ADR-173** (graph-stack topology), ADR-179 (transport-agnostic substrate).
- **Ontology facts already established 2026-06-04** (verify, don't re-derive): formal
  RDF/OWL/SKOS/SHACL; stable `w3id.org` IRIs; **v0.1 early release "subject to change"**; 8
  subjects (English, Maths, Science[Bio/Chem/Phys], History, Geography, Citizenship — NOT yet
  Computing/Art/Music/PE/Languages); models `Programme → UnitVariantInclusion → UnitVariant →
  LessonInclusion → Lesson`, SKOS `Discipline → Strand → SubStrand → ContentDescriptor`, threads,
  NC alignment; **sequencing/optionality via Inclusion nodes** (which correctly represents a
  lesson placed in multiple contexts — the identity lesson the bulk side lacks); Neo4j export +
  SPARQL + multi-format distributions; OGL-3.0 data / MIT code.

## Blockers / low-confidence areas

- The ontology is **v0.1 and explicitly unstable** (URIs/structure/data subject to change) —
  design any integration for change, not as a fixed dependency.
- The **alignment audit** (bulk slugs ↔ ontology IRIs; overlap/mismatch) is the named technical
  precursor for any cross-source work and has not run.
- Serving model is open (the prototypes plan's Lane A direct-use baseline vs Neo4j vs Stardog).

## Scope guardrails

- This is a **review + planning** thread, not implementation; do not build.
- It is **separate from** the bulk-derived `graph-tools-value-redesign` (which stays parked on
  EEF D6 + D7) — do not expand that plan or fold the two concerns together.
- Timing is owner-scheduled; this thread is opened, not started.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Twilit Cascading Supernova` | `claude` | `Opus 4.8` | `bb53a9` | `thread-opener-brief-only` | 2026-06-04 | 2026-06-04 |
