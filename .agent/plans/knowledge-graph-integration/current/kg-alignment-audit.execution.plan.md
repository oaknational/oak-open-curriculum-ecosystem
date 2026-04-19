---
name: "KG Alignment Audit (Execution)"
overview: "Measure and document the real overlap between the Oak curriculum ontology graph and this repo's search-facing entities before broader ontology-serving, search-projection, or downstream graph-platform work proceeds."
source_research:
  - "../research/elasticsearch-neo4j-oak-ontology-synthesis.research.md"
  - "../oak-ontology-graph-opportunities.strategy.md"
  - "../current/kg-integration-quick-wins.plan.md"
  - "../../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md"
todos:
  - id: phase-0-scope-lock
    content: "Phase 0: Lock the audited entity slices, source versions, operational representation, and exact report template before writing code or analysis scripts."
    status: pending
  - id: phase-1-data-basis
    content: "Phase 1: Build the repeatable audit basis: pin ontology source/export version, identify search-facing source datasets, and define the first join-key candidates."
    status: pending
  - id: phase-2-audit-implementation
    content: "Phase 2: Implement the audit scripts/queries and generate the first overlap and mismatch artefacts."
    status: pending
  - id: phase-3-reporting
    content: "Phase 3: Publish the audit outputs in canonical repo docs with explicit counts, match-state breakdowns, and recommended next actions by slice."
    status: pending
  - id: phase-4-propagation
    content: "Phase 4: Update strategy, queue, and high-level planning documents so later graph work is grounded in the audit results rather than assumptions."
    status: pending
  - id: phase-5-review-gates
    content: "Phase 5: Run quality gates, specialist review, and record whether the next promoted quick win is projection-first, explanation-first, or blocked on mismatch remediation."
    status: pending
---

# KG Alignment Audit (Execution)

**Last Updated**: 2026-03-07
**Status**: 🟢 ACTIVE
**Scope**: Produce the first canonical overlap audit between Oak's ontology graph
and this repo's search-facing curriculum records, and use that evidence to
shape all later graph-integration work.

---

## Why This Is Active Now

This plan has been promoted from
[current/kg-integration-quick-wins.plan.md](../current/kg-integration-quick-wins.plan.md)
as the safest first graph-enablement slice.

Reason for promotion:

- later direct ontology, search-projection, Neo4j, or Stardog work is high
  risk if it assumes overlap that has not been measured
- the ontology and this repo were built from similar but non-identical views of
  the curriculum domain
- the ontology source RDF model and the exported Neo4j operational graph are
  distinct contracts, and the audit needs to state which one is being compared

This plan therefore turns “partial overlap is a first-class constraint” from a
strategy statement into an explicit deliverable.

---

## Standalone Session Entry

Use this section to start a fresh session from this plan alone.

### Re-ground

Read:

1. `.agent/directives/AGENT.md`
2. `.agent/directives/principles.md`
3. `.agent/directives/testing-strategy.md`
4. `.agent/plans/semantic-search/research-index.md`
5. `.agent/plans/knowledge-graph-integration/research/elasticsearch-neo4j-oak-ontology-synthesis.research.md`
6. `.agent/plans/knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md`
7. `.agent/plans/knowledge-graph-integration/current/kg-integration-quick-wins.plan.md`
8. [oak-curriculum-ontology `README.md`](https://github.com/oaknational/oak-curriculum-ontology/blob/main/README.md)
9. [oak-curriculum-ontology `scripts/export_to_neo4j.py`](https://github.com/oaknational/oak-curriculum-ontology/blob/main/scripts/export_to_neo4j.py)
10. [oak-curriculum-ontology `scripts/export_to_neo4j_config.json`](https://github.com/oaknational/oak-curriculum-ontology/blob/main/scripts/export_to_neo4j_config.json)
11. [.agent/research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md](../../../research/kg-neo4j-stardog-product-creation/kg-neo4j-stardog-product-creation-clean.md)

### Verify Current State

Run:

```bash
git status --short
git branch --show-current
ls -1 .agent/plans/semantic-search/active
ls -1 .agent/plans/knowledge-graph-integration/active
```

Then read:

1. `.agent/plans/knowledge-graph-integration/README.md`
2. `.agent/plans/semantic-search/README.md`
3. `.agent/plans/high-level-plan.md`

### First Session Goal

Do **Phase 0 only first**:

1. lock the exact audited entity slices
2. state whether the first audit compares against RDF source shape, exported
   Neo4j shape, or both
3. lock the exact required outputs listed below
4. decide where the canonical audit report will live

Do not start projection-index, reranking, or explanation implementation until
those decisions are written down.

---

## Problem

The graph strategy now depends on a fact pattern that is plausible but not yet
measured:

- ontology records and search-facing records overlap considerably
- they do not overlap perfectly
- the mismatch is important enough to shape architecture

At the moment, those statements are strategically useful but operationally too
soft.

Without a canonical alignment audit:

- join logic will drift into ad hoc heuristics
- later Neo4j work may optimise the wrong graph representation
- Elasticsearch projections may be built on low-confidence mappings
- product-facing graph augmentation may mislead users by overstating alignment

---

## Desired Outcome

At the end of this plan:

- Oak has a pinned, reproducible audit basis for ontology versus search-facing
  overlap
- the audit output names the exact compared representations and source versions
- each audited slice has explicit counts for match and mismatch states
- follow-on graph work knows which slices are safe for projection,
  explanation-first augmentation, or internal-only QA use
- strategy and queue documents are updated to reflect measured reality

---

## Audit Boundary

This plan must explicitly state which representation each result refers to:

- `source ontology` — RDF/OWL/SKOS/SHACL artefacts and canonical triples
- `operational graph` — the ontology repo's transformed Neo4j export shape
- `search-facing data` — the records and identifiers used in this repo's search,
  bulk-processing, and retrieval surfaces

The first audit may compare either:

1. search-facing data against the exported Neo4j operational graph, or
2. search-facing data against both the RDF source and the exported graph

If only one comparison is done first, the report must say that plainly.

---

## Required Outputs

This plan is complete only when all of the following exist.

### 1. Canonical audit report

Create a durable report in the knowledge-graph-integration collection, then
link it from semantic-search and any other consumer navigation surfaces. The
report must include:

- audited date
- ontology repo commit or release reference
- export configuration reference if the Neo4j operational graph is used
- search data snapshot or build reference
- audited entity slices
- compared representations
- join-key candidates considered
- methodology summary
- known limitations

### 2. Match-state matrix

For each audited slice, publish counts for at least these states:

- exact match
- transformed or normalised match
- candidate match requiring heuristic or review
- ontology-only
- search-only
- not yet assessed

This must be published as a human-readable table, not only raw script output.

### 3. Join-key inventory

Publish a canonical list of join keys attempted, with outcome notes.

Minimum expected candidates to assess where available:

- `programmeSlug`
- `unitSlug`
- `lessonSlug`
- `threadSlug`
- `contentDescriptorSlug`
- transformed title fields
- explicit IDs where present in either system
- any repo-local canonical identifiers already in search or bulk outputs

For each join key, record:

- source system
- normalisation required
- confidence level
- known failure modes

### 4. Mismatch taxonomy

Publish a short taxonomy of why mismatches happen.

Minimum categories:

- identifier mismatch
- naming or slug mismatch
- granularity mismatch
- missing record in ontology
- missing record in search-facing data
- representation mismatch between RDF source and exported Neo4j graph
- ambiguous one-to-many or many-to-one mapping

### 5. Slice-by-slice recommendation summary

For each audited slice, explicitly recommend one of:

- safe for Elasticsearch projection
- safe for bounded explanation-first graph augmentation
- useful for internal QA only for now
- blocked pending data-quality or mapping work

### 6. Reproducible audit implementation

The audit must not live only in prose.

Create or record:

- the script, query, notebook, or command sequence used
- required inputs
- output locations
- rerun instructions

### 7. Follow-on update checklist

The audit report must end with a checklist naming which docs and plans now need
updating and why.

---

## What Must Be Updated Afterwards

Once the first canonical audit outputs exist, update these documents.

### Required updates

1. [oak-ontology-graph-opportunities.strategy.md](../oak-ontology-graph-opportunities.strategy.md)
   - replace assumption-led language with measured overlap findings
   - mark which slices are now safe, risky, or blocked
2. [current/kg-integration-quick-wins.plan.md](../current/kg-integration-quick-wins.plan.md)
   - reflect that the alignment audit has been executed or partially completed
   - narrow the remaining quick wins based on real match quality
3. [README.md](../README.md)
   - update hub navigation so later graph work references the audit outputs
4. [semantic-search/README.md](../../semantic-search/README.md)
   - update search-adjacent guidance from strategy-only to
     strategy-plus-evidence
5. [high-level-plan.md](../../high-level-plan.md)
   - update the immediate-next-intentions wording if the audit changes the next
     graph promotion target

### Likely updates if findings are strong enough

1. new projection or explanation execution plans under `active/` or `current/`
2. the semantic-search roadmap, if the audit materially changes sequence or risk
3. any ground-truth or evaluation notes if graph-backed explanation becomes a
   validated retrieval surface

---

## Candidate Audit Slices

Start with the slices most likely to have overlap and early value:

- programme
- unit
- lesson
- thread
- National Curriculum content descriptor alignment
- taxonomy concepts such as discipline, strand, and substrand

Do not assume all slices must be audited at the same depth in the first pass.

---

## Phase Model

### Phase 0: Scope Lock

Before implementation, explicitly lock:

1. audited slices
2. compared representations
3. ontology version reference
4. search data snapshot reference
5. initial join-key set
6. output document paths

Acceptance criteria:

- no ambiguity remains about what is being compared
- all required outputs have an owner and destination

### Phase 1: Audit Basis

Build the reproducible input basis.

Deliverables:

- pinned ontology reference
- pinned export configuration reference if applicable
- pinned search-data basis
- first join-key inventory draft

### Phase 2: Audit Implementation

Implement the repeatable audit logic.

Deliverables:

- reproducible scripts or queries
- machine-readable outputs
- first pass of match-state counts by slice

### Phase 3: Canonical Reporting

Turn the raw audit into a canonical repo artefact.

Acceptance criteria:

- required outputs section above is fully satisfied
- conclusions are evidence-led, not aspirational
- uncertainty remains visible where overlap is weak or ambiguous

### Phase 4: Propagation

Update dependent planning and strategy artefacts.

Acceptance criteria:

- every required follow-on update listed above is completed
- later graph plans no longer rely on unmeasured overlap assumptions

### Phase 5: Gates And Review

Minimum reviewers:

- `docs-adr-reviewer`
- `architecture-reviewer-betty`
- `architecture-reviewer-wilma`
- `elasticsearch-reviewer`

---

## Guardrails

- Do not blur RDF source semantics with the exported Neo4j operational graph.
- Do not claim confidence beyond the measured join quality.
- Prefer explicit “unknown” or “not yet assessed” states over optimistic joins.
- Keep the first audit small enough to finish, but broad enough to guide the
  next promotion decision.
- If a slice has poor overlap, record that clearly rather than forcing it into a
  premature projection plan.

---

## Non-Goals

- Full Neo4j provisioning and load automation
- Shipping product-facing graph augmentation in the same plan
- Final Elasticsearch projection index design
- Solving every mismatch discovered by the audit
- Replacing existing retrieval evaluation with graph evaluation wholesale

---

## Validation

Run the relevant quality gates for any code or scripts added, and ensure the
canonical report is linked from the knowledge-graph-integration navigation docs
and the semantic-search consumer docs.

Success criteria:

- another contributor can rerun the audit from the written instructions
- the audit report can be read without opening raw output files
- strategy and queue docs are updated before this plan is considered complete

---

## Related

- Parent quick-win source:
  [current/kg-integration-quick-wins.plan.md](../current/kg-integration-quick-wins.plan.md)
- Research synthesis:
  [elasticsearch-neo4j-oak-ontology-synthesis.research.md](../research/elasticsearch-neo4j-oak-ontology-synthesis.research.md)
- Strategy:
  [oak-ontology-graph-opportunities.strategy.md](../oak-ontology-graph-opportunities.strategy.md)
- Cross-collection sequencing:
  [high-level-plan.md](../../high-level-plan.md)
