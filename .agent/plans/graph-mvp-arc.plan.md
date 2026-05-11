---
plan_id: graph-mvp-arc
name: "Graph MVP Arc — Three-Slice Substrate-And-Surface Spine"
overview: "Cross-collection coordination spine sequencing three vertical slices that establish independent substrate, shape understanding, and MCP surfaces for the three corpora the MVP touches: EEF strands (slice 1), Oak ontology Threads (slice 2), Oak misconceptions (slice 3a). Each slice is co-primary in value: it ships substrate, learns the corpus's shape through surfacing it, and yields surfacing-design lessons that propagate. Combinatorial value across corpora is the next arc, owned by `graph-combinatorial-arc.plan.md`. Teacher value is downstream of AI-client adoption."
type: cross-collection-coordination-spine
status: current
graph_layer: cross-cutting
graph_portfolio_index: "graph-portfolio-index.md"
follow_on_arc: "graph-combinatorial-arc.plan.md"
last_updated: 2026-05-11
related_indices:
  - "high-level-plan.md"
  - "graph-portfolio-index.md"
adr_amendments_required:
  - "ADR-157 amendment: add `oak-misconceptions-*` prefix; record explicit-source-attribution-on-every-tool discipline; document that the unprefixed default is retained for already-shipped API-derived tools but new tools must carry a prefix"
  - "ADR-173 (proposed) cross-reference: name MVP arc as the first vertical-slice consumer of the graph stack topology"
plan_amendments_required:
  - "sector-engagement/eef/current/eef-evidence-corpus.plan.md: rename tool todos to `eef-*` prefix per ADR-157 (todos t6, t7, t8 + t18 ADR-123 update); add MVP-arc cross-reference"
  - "connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md: Inc.1 provides the Oak Ontology Threads adapter for slice 2; Inc.3 EEF + misconception adapters + cross-corpus join primitive carry their downstream-consumer cross-reference to graph-combinatorial-arc.plan.md (replaces the cross-reference the MVP arc previously held via slice 3b)"
  - "graph-portfolio-index.md: 3-slice MVP table; add row for follow-on combinatorial arc"
  - "high-level-plan.md: cross-link 3-slice MVP arc + follow-on combinatorial arc from Cross-cutting Threads section"
specialist_reviewers:
  - mcp-expert
  - elasticsearch-expert
  - clerk-expert
  - test-expert
  - assumptions-expert
  - architecture-expert-betty
  - docs-adr-expert
  - code-expert
foundation_alignment:
  - .agent/directives/principles.md
  - .agent/directives/testing-strategy.md
  - .agent/directives/schema-first-execution.md
isProject: false
todos:
  - id: gate-0-substrate-floor
    content: "Substrate floor for slice 1 is in place: graph-query-layer 7-op surface available (matches the EEF plan's KG-independent substrate dependency). Acceptance: substrate quality gates green; no surfacing required at this gate. Follow-up (post-arc): migrate the EEF strand corpus onto graph-corpus-sdk when graph-stack Inc.3 ships; not a slice-1 gate."
    status: pending
    depends_on: []
  - id: gate-1-eef-ships
    content: "Slice 1 ships: all 20 todos in eef-evidence-corpus.plan.md complete against the repository-held EEF Toolkit JSON snapshot as the canonical implementation source pending EEF provenance/refresh clarification; tools/resources named per ADR-157 with `eef-*` prefix; ADR-123 + ADR-157 updated; freshness CI gate active without reconstructing data from scraped EEF pages; Sentry telemetry live; caveat-presence rate sampled. Shape-understanding answered at gate close: what did surfacing the EEF Toolkit as an MCP graph teach us about its structure, citation discipline, freshness, and partnership-readiness?"
    status: pending
    depends_on: [gate-0-substrate-floor]
  - id: gate-2-threads-ships
    content: "Slice 2 ships: oak-kg-threads resource + oak-kg-get-thread-content tool complete via graph-corpus-sdk Oak Curriculum Ontology Threads adapter; inverse-edge query (Unit->Thread) verified; ADR-123 updated. Substrate floor: graph-stack Inc.1 Oak Ontology Threads foundation. PARALLEL-SAFE with gate-3a once Inc.1 is up; sequencing relative to gate-1 is the substrate-floor ordering only. Shape-understanding answered at gate close: what did surfacing the Oak ontology as a graph teach us about its semantic affordances, IRI design, and the value Oak's KG unlocks in user-facing tooling?"
    status: pending
    depends_on: [gate-0-substrate-floor, "graph-stack Inc.1 Oak Ontology Threads foundation"]
  - id: gate-3a-mcg-subgraph-ships
    content: "Slice 3a ships: oak-misconceptions-subgraph-for-thread (and optional -for-unit only if authorised) tool(s) complete on the bulk-derived legacy misconception graph factory data plus graph-stack Inc.1 Thread->Unit lookup; bounded sub-graph extraction primitive verified against maxResponseTokens = 16000 across the committed 20-context fixture manifest; ADR-123 + ADR-157 updated. PARALLEL-SAFE with gate-2 once Inc.1 is up. Shape-understanding answered at gate close: what did building the misconception graph from Oak bulk data teach us about graph-from-bulk-data design, and what did surfacing it teach us about token-sensitive sub-graph extraction?"
    status: pending
    depends_on: [gate-0-substrate-floor, "graph-stack Inc.1 Oak Ontology Threads foundation"]
  - id: amend-eef-plan
    content: "Amend sector-engagement/eef/current/eef-evidence-corpus.plan.md tool todos to apply `eef-*` prefix; update t18 (ADR-123) entry to record renamed tool names. Coordination amendment, no behaviour change."
    status: completed
    depends_on: []
  - id: amend-adr-157
    content: "Amend ADR-157: add oak-misconceptions-* row to the namespace prefix table; record explicit-source-attribution-on-every-tool discipline (with the unprefixed-default exception preserved for already-shipped API-derived tools). Spine-plan-driven; one-paragraph addendum."
    status: completed
    depends_on: []
  - id: amend-portfolio-index
    content: "Amend graph-portfolio-index.md: 3-slice MVP arc table; new row for graph-combinatorial-arc.plan.md (follow-on)."
    status: pending
    depends_on: []
  - id: amend-high-level-plan
    content: "Amend high-level-plan.md: cross-link 3-slice MVP arc + follow-on combinatorial arc from the Cross-cutting Threads section."
    status: pending
    depends_on: []
  - id: amend-graph-stack-inc-3-consumer-ref
    content: "Amend graph-stack.plan.md Inc.3 to carry the cross-reference to graph-combinatorial-arc.plan.md as its named downstream consumer (replacing the consumer-shape signal slice 3b previously provided to the MVP arc)."
    status: pending
    depends_on: []
  - id: author-slice-2-plan
    content: "Slice-2 executable plan in connecting-oak-resources/knowledge-graph-integration/current/oak-kg-threads-surface.plan.md authored 2026-05-07 (Phase 3, commit 776df6b7); BLOCKER on spine-lock principle wording remediated 2026-05-07 (Phase 4, commit 0899ba93)."
    status: completed
    depends_on: []
  - id: author-slice-3a-plan
    content: "Slice-3a executable plan in connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-subgraph-mcp-surface.plan.md authored 2026-05-07; BLOCKER on slice-3b composition framing remediated 2026-05-07; source-authority clarification applied 2026-05-10."
    status: completed
    depends_on: []
  - id: migrate-slice-3b-plan
    content: "Slice-3b plan (oak-misconceptions-eef-cross-corpus-surface) migrated from current/ to future/ during the 2026-05-11 MVP-arc reshape; its spine pointer repointed from graph-mvp-arc.plan.md to graph-combinatorial-arc.plan.md. Executable detail intact; it becomes the first concrete combinatorial-arc exploration when that arc's promotion trigger fires."
    status: completed
    depends_on: []
  - id: learning-loop
    content: "After each gate, run /jc-consolidate-docs to surface graduation candidates and update permanent docs. After gate-3a ships, run consolidation pass and consider archiving this spine plan with key outcomes mined to permanent docs per ADR-117."
    status: pending
    depends_on: [gate-3a-mcg-subgraph-ships]
---

# Graph MVP Arc — Three-Slice Substrate-And-Surface Spine

## Executive Summary

**Today's commitment**: ship substrate, shape understanding, and MCP
surfaces for the three corpora the MVP touches — EEF strands, Oak
ontology Threads, Oak misconceptions — as three independently-navigable
slices. Each slice closes when its substrate is proven, its shape is
understood, and its surfacing-design lessons are recorded. Slice 1
additionally opens the EEF partnership conversation.

**Out of scope here**: cross-corpus composition. The first concrete
combinatorial tool (formerly slice 3b) lives in
[`graph-combinatorial-arc.plan.md`](graph-combinatorial-arc.plan.md), the
follow-on arc, which activates when this arc's gate-1 and gate-3a ship
and graph-stack Inc.3 is design-stable.

**Status**: gate-0 substrate floor in place (graph-query-layer 7-op
surface available); the three substrate streams are co-primary in value
and gates 2 and 3a are parallel-safe once graph-stack Inc.1 (Oak
Ontology Threads foundation) is up.

**Dependency named honestly**: teacher value is downstream of AI-client
adoption. AI clients (Claude, ChatGPT, Oak's own clients) must adopt
these MCP tools and put them in front of teachers for downstream user
value to materialise. AI-client adoption is **not** a spine deliverable;
it is currently **not tracked** anywhere in the repo — establishing a
tracking surface (which AI clients have adopted which tools, with what
usage signal) is itself an open todo on the `connecting-oak-resources`
thread, surfaced for owner direction. Naming this dependency without
naming a tracking owner is itself a hidden assumption; the next-session
record carries the gap. This arc commits only to substrate +
shape-understanding + surfacing-exploration + (slice 1)
partnership-opening; downstream teacher impact is named, not delivered.

**What changed in the 2026-05-11 reshape** (vs. earlier 4-slice shape):

| Before | After |
|---|---|
| 4 slices (1, 2, 3a, 3b) | 3 slices (1, 2, 3a) |
| Slice 3b inside MVP | Slice 3b moved to `graph-combinatorial-arc.plan.md` (its executable plan moved from `current/` to `future/`) |
| Per-slice "user value triplet" framed as teacher-asks-X | Portfolio-level Value Streams + 1-to-many per-slice mapping; teacher value named as downstream of AI-client adoption |
| gate-1 -> gate-3a strict | gate-2 and gate-3a parallel-safe after gate-0 + Inc.1 (substrate streams are co-primary) |
| 24-row Owner Decisions Log inline | Owner Decisions Log preserved at end with archive marker; recent reshape decisions at top of the log |

## Why This Plan Exists

The graph portfolio defines a **substrate** layer
([`graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md)),
multiple **Oak graph surfaces**, and several **features built on those
graphs** — but no plan threads vertical slices from substrate through
surface for each of the three corpora the MVP commits to. The substrate
plan's foundation increment surfaces nothing through MCP, HTTP, or CLI;
surfacing is a consumer-side decision tracked separately. That is a
horizontal substrate slab, not a vertical slice.

This plan supplies the missing vertical commitment for each of the three
corpora independently. Combinatorial composition is the next arc, not
this one — see `graph-combinatorial-arc.plan.md`.

## Value Streams (Portfolio Level)

The graph portfolio carries four value streams. This MVP arc commits
to the first three at slice level, opens the fourth at slice 1, and
hands the combinatorial stream to the follow-on arc.

| # | Stream | What the MVP arc commits to |
|---|---|---|
| 1 | **Substrate** — graph infrastructure built and proven | Each slice ships substrate against its corpus. Substrate proof is the primary acceptance criterion. |
| 2 | **Shape-understanding** — learning each corpus's structure, semantic affordances, and design choices through the act of surfacing it | Each gate close answers: *what did this slice tell us about the shape of this corpus that we did not know before it shipped?* Answer recorded in gate-close evidence; mined into permanent docs by the learning loop. |
| 3 | **Surfacing-exploration** — design lessons about MCP surface shape, citation discipline, token sensitivity, _meta disclosure | Each gate close records the surfacing-design lessons specific to the slice (citation transmission for slice 1; semantic-graph traversal for slice 2; token-sensitive sub-graph extraction for slice 3a). |
| 4a | **Partnership** (EEF) | Slice 1 ships the EEF surface and **opens** the partnership conversation with EEF. The case **strengthens** in the combinatorial arc when cross-corpus joint value lands; closure of the partnership case is not this arc's deliverable. |
| 4b | **Combinatorial** (cross-corpus value) | Not in MVP scope. Owned by `graph-combinatorial-arc.plan.md`. |

**Teacher value** is named separately as downstream of stream 3's
surfaces being adopted by AI clients. This arc does not commit to
teacher-outcome measurement; that is follow-on evaluation infrastructure.

### Per-slice stream mapping

| Slice | Streams served |
|---|---|
| 1 — EEF evidence corpus | Substrate (graph-query-layer KG-independent); shape-understanding (EEF Toolkit structure + citation discipline + freshness); surfacing-exploration (caveat/data/citation preservation, freshness CI gate, telemetry); partnership-opening (EEF conversation entry) |
| 2 — Oak ontology Threads | Substrate (Turtle/SHACL ingestion + inverse-edge resolution); shape-understanding (Oak ontology's semantic affordances, IRI design, value-unlock framing); surfacing-exploration (semantic-graph traversal as an MCP surface) |
| 3a — Misconception sub-graph | Substrate (bulk-data-to-graph construction); shape-understanding (graph-from-bulk-data design pattern, reusable for future bulk-built graphs); surfacing-exploration (token-sensitive sub-graph extraction, bounded-traversal completeness as MCP surface discipline) |

## MVP Discipline — Three Commitments

Owner direction 2026-05-07:

> *"the intent behind the MVP framing is to ship something useful soon.
> Not with any rushing, all the normal quality requirements stand,
> always, but by reducing scope, with an explicit follow up once
> something has shipped."*

Three commitments, none negotiable:

1. **Ship something useful soon** — the arc commits to a sequenced first
   vertical (slice 1). Substrate dependencies are honest, but the slice
   ships at the earliest moment substrate allows.
2. **All normal quality requirements stand** — TDD cycles, quality gates,
   specialist reviews, type discipline, telemetry, citation discipline.
   No shortcuts. The MVP framing reduces *scope*, never *quality*.
3. **Anything not in the MVP lives outside the spine, with its own
   sequencing on its own plan.** This spine tracks only what's IN the
   MVP arc. The combinatorial-arc seed plan
   (`graph-combinatorial-arc.plan.md`) carries its own promotion
   trigger. Plans not in the MVP (NC SKOS taxonomy, prerequisite graph
   integration, etc.) carry their own promotion triggers in their own
   frontmatter and bodies, not in this spine. Owner doctrine
   2026-05-07: *"we never mark anything as deferred; we sequence things
   properly or we admit we are not going to do them."*

## Source Authority Model

The MVP arc composes three different source-authority modes. They must stay
distinct in implementation, tests, citations, and provenance metadata:

| Corpus | Current authority | MVP handling |
|---|---|---|
| EEF strands | Repository-held EEF Toolkit JSON snapshot | Treat the checked-in snapshot as the canonical implementation source until EEF clarifies whether the refresh path is public download/API or direct supply. Do not reconstruct the corpus from scraped EEF pages. |
| Oak ontology | `oaknational/oak-curriculum-ontology` GitHub repository | Fetch straight-copy Turtle/SHACL source files from a pinned upstream GitHub revision; derived graph artefacts retain provenance to that revision. |
| Oak misconceptions | Oak bulk data/API, processed in this repository | Construct the misconception graph here as part of bulk-data processing; downstream graph surfaces consume the generated bulk-derived graph rather than treating misconceptions as an external raw corpus. |

## Slice 1 — EEF Evidence Corpus MCP Surface

**Status**: pending substrate floor.
**Namespace**: `eef-*` (per ADR-157).
**Substrate floor**: graph-query-layer 7-op surface — matches the
substrate dependency the EEF plan itself names (`KG-Independent`
section: thin in-process operations layer over typed JSON). Migration
of the EEF strand corpus onto `graph-corpus-sdk` (graph-stack Inc.3)
is a named follow-up, **not** a slice-1 gate.
**Consumes**:
[`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md)
(20 todos, drafted, current/).

### Value streams served by slice 1

- **Substrate**: graph-query-layer KG-independent thin-layer over typed
  JSON; proven by the slice landing.
- **Shape-understanding**: EEF Toolkit's strand structure, citation
  discipline, caveat semantics, freshness model, refresh path
  affordances. Recorded as gate-close evidence; mined to permanent docs
  by the learning loop.
- **Surfacing-exploration**: structural caveat-and-citation preservation
  as MCP-tool boundary discipline; freshness CI gate as
  surface-protection pattern; telemetry shape for sampled-recommendation
  responses.
- **Partnership-opening**: shipping the surface enables the conversation
  with EEF about provenance, refresh-path, and downstream-adoption
  surfaces. The case strengthens in the follow-on combinatorial arc.

### What ships (with applied namespace)

| Primitive | Name | Owning todo in eef-evidence-corpus |
|---|---|---|
| Resource | `curriculum://eef-methodology` | t3 |
| Resource | `curriculum://eef-strands` | t4 |
| Tool | `eef-recommend-evidence-for-context` | t6 (rename) |
| Tool | `eef-explain-evidence-strand` | t7 (rename) |
| Tool | `eef-compare-evidence-strands` | t8 (rename) |
| Prompt | `eef-evidence-grounded-lesson-plan` | t10 (rename) |
| Prompt | `eef-pupil-premium-strategy-review` | t11 (rename) |

### Acceptance — Slice 1

1. All 20 todos in `eef-evidence-corpus.plan.md` are complete — including
   E2E shape conditions (t19), freshness CI gate (t13), telemetry (t14),
   credits (t20).
2. All tool/prompt names carry the `eef-*` prefix.
3. ADR-123 records the renamed primitives.
4. ADR-157 reflects the explicit-source-attribution discipline.
5. Structural caveat/data/citation presence sampled at ≥95% across N=50
   recommendation responses (this is structural transmission, not
   outcome — outcome evaluation is named as downstream).
6. **Shape-understanding gate-close evidence**: one-paragraph written
   answer to *"what did this slice tell us about EEF's shape that we
   did not know before it shipped?"* Recorded with gate-close evidence;
   mined to permanent docs by the learning loop.

### Cut scope and follow-ups for slice 1

**None.** The existing EEF plan ships in full under the namespace fix.
LLM/outcome evaluation is sequenced behind the follow-on
[`eef-outcome-evaluation-infrastructure.plan.md`](sector-engagement/eef/future/eef-outcome-evaluation-infrastructure.plan.md);
this is the named downstream surface for measured teacher impact.

## Slice 2 — Oak Ontology Threads MCP Surface

**Status**: pending substrate floor (graph-stack Inc.1).
**Namespace**: `oak-kg-*` (per ADR-157).
**Substrate floor**: graph-stack Inc.1 Oak Curriculum Ontology Threads
foundation. That increment lands the `graph-corpus-sdk` API for
`curric:Thread` enumeration and inverse `curric:includesThread`
resolution over the `graph-project` adjacency primitives.
**Sequencing**: PARALLEL-SAFE with gate-3a once gate-0 + Inc.1 are in
place. The previous strict gate-1 -> gate-2 ordering is relaxed in the
2026-05-11 reshape: the three substrate streams are co-primary; slice 2
and slice 3a need not wait on slice 1 once their own substrate floors
exist.

### Value streams served by slice 2

- **Substrate**: Turtle/SHACL ingestion + inverse-edge query over
  `graph-corpus-sdk` Oak Curriculum Ontology adapter; proven by the
  slice landing.
- **Shape-understanding**: Oak ontology's semantic affordances, IRI
  design, the value Oak's KG unlocks when surfaced as a graph (as
  opposed to as bulk-data records). Recorded at gate close.
- **Surfacing-exploration**: semantic-graph traversal as an MCP surface
  shape (bounded result lists, label-and-comment payload, inverse-edge
  resolution as a tool-body responsibility).

### What ships — Slice 2

| Primitive | Name | Notes |
|---|---|---|
| Resource | `curriculum://oak-kg-threads` | List of `curric:Thread` instances with `rdfs:label` |
| Tool | `oak-kg-get-thread-content` | Thread IRI -> all Units with `curric:includesThread` edge to it, grouped by subject + key-stage; uses inverse-edge resolution |

### Why Threads is the right slice 2

- **Unique to Oak.** Threads are pedagogically rich cross-unit narrative
  spines. Not surfaced anywhere else in the Oak MCP estate or the API.
- **Bounded surface, full raw source.** The Thread list is modest; the
  graph-stack foundation imports the pinned Oak Curriculum Ontology
  Turtle / SHACL source corpus as straight-copy raw material. Inverse-edge
  resolution returns a bounded list per Thread — no context-budget
  concerns.
- **Demonstrates the substrate.** Surfaces require Turtle ingestion,
  inverse-edge query, and graph-corpus-sdk Oak ontology adapter — all
  substrate capabilities for further Oak-graph surfaces.

### Acceptance — Slice 2

1. All `curric:Thread` instances enumerable from the pinned
   straight-copy Oak Curriculum Ontology raw import via the resource.
2. For each Thread, `oak-kg-get-thread-content` returns the full set of
   Units with `curric:includesThread` to it, grouped by subject + KS,
   with `rdfs:label`, `rdfs:comment`, and `curric:whyThisWhyNow`.
3. Inverse-edge query primitive in `graph-corpus-sdk`/`graph-project`
   verified.
4. ADR-123 records the new primitives.
5. Specialist review by `mcp-expert`.
6. **Shape-understanding gate-close evidence**: one-paragraph written
   answer to *"what did surfacing the Oak ontology as a graph teach us
   about its semantic affordances and the value it unlocks?"*

### Cut scope and follow-ups for slice 2

| Cut | Follow-up |
|---|---|
| Lesson-graph projection | Future plan: [`oak-kg-lesson-graph-surface.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-kg-lesson-graph-surface.plan.md) |
| Programme/Unit navigator | Future plan: [`oak-kg-programme-navigator.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-kg-programme-navigator.plan.md) |
| Generic IRI traverser | Future plan: [`oak-kg-iri-traverser.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-kg-iri-traverser.plan.md) |
| Schema/class browser | Future plan: [`oak-kg-schema-browser.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-kg-schema-browser.plan.md) |
| SPARQL endpoint | Existing plan: [`direct-ontology-use-and-graph-serving-prototypes.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md) (future/) |

## Slice 3a — Misconception Sub-Graph Query

**Status**: pending substrate floor (graph-stack Inc.1); PARALLEL-SAFE
with slice 2 once Inc.1 is up.
**Namespace**: `oak-misconceptions-*` (new prefix; ADR-157 amendment).
**Substrate path**: bulk-derived legacy graph factory (interim) + Inc.1
Thread->Unit lookup. Explicit follow-up to migrate to substrate when
graph-stack Inc.2/3 misconception replatform lands.

### Value streams served by slice 3a

- **Substrate**: bulk-data-to-graph construction, proven by the slice
  landing. The misconception graph is the worked example of the
  graph-from-bulk-data pattern.
- **Shape-understanding**: design lessons about constructing graphs from
  Oak bulk data (node identity, edge derivation, density, traversal
  bounds, schema choices). Reusable for every future bulk-built graph.
  Recorded at gate close.
- **Surfacing-exploration**: token-sensitive sub-graph extraction as an
  MCP-tool boundary; bounded-traversal completeness as test discipline;
  `_meta` legacy-substrate disclosure as transparency pattern.

### What ships — Slice 3a

| Primitive | Name | Notes |
|---|---|---|
| Tool | `oak-misconceptions-subgraph-for-thread` | Thread IRI -> bounded misconception sub-graph for misconceptions associated with units in that thread |
| Tool (optional) | `oak-misconceptions-subgraph-for-unit` | Unit IRI -> bounded misconception sub-graph for misconceptions on that unit's content |

The tools return **bounded** sub-graphs sized to fit
`maxResponseTokens = 16000`. Bound is a parameter; the default is justified
against the committed `20`-context fixture manifest.

### Why this is the slice 3 priority

Owner direction, 2026-05-07: *"the misconception graph, but it requires
the ability to query sub-graphs as the misconception graph is too large
to use without using an impractical amount of context."* The sub-graph
query primitive is the blocking problem to fix; how the surface
internally bounds traversal is the surfacing-design lesson this slice
produces.

### Acceptance — Slice 3a

1. Sub-graph extraction by Thread IRI context returns bounded results that
   fit `maxResponseTokens = 16000` across the committed `20`-context
   fixture manifest. Unit IRI context is accepted only if the optional
   unit variant is explicitly authorised at slice opening.
2. Bounded-traversal completeness is verified with small literal graph
   tests: for each sample query, all reachable misconceptions within the
   bound are present, without a second full traversal implementation in
   the test.
3. The legacy-factory interim path is explicit in the plan body, in tool
   `_meta`, and in ADR-123 — every consumer can see this is a contract
   the substrate must preserve.
4. ADR-157 records the new `oak-misconceptions-*` prefix.
5. **Shape-understanding gate-close evidence**: one-paragraph written
   answer to *"what did building the misconception graph from Oak bulk
   data teach us about graph-from-bulk-data design, and what did
   surfacing it teach us about token-sensitive sub-graph extraction?"*

### Cut scope and follow-ups for slice 3a

| Cut | Follow-up |
|---|---|
| Substrate-based implementation | Future plan: [`oak-misconceptions-substrate-migration.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-substrate-migration.plan.md) — migrates slice 3a tools onto graph-corpus-sdk + GraphView when graph-stack Inc.3 misconception adapter ships |
| Per-IRI lookup (single-misconception detail) | Tracked todo on existing `misconception-graph-mcp-surface.plan.md` (already DONE) — file as a follow-up enhancement |
| Topic-string sub-graph (without IRI) | Future plan: [`oak-misconceptions-topic-extraction.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/oak-misconceptions-topic-extraction.plan.md) |

## Sequencing and Gates

```text
graph-query-layer 7-op surface (slice-1 substrate floor)
  ↓
gate-0: substrate floor for slice 1
  ↓
gate-1: SLICE 1 SHIPS (EEF evidence corpus, eef-* namespace)
       graph-stack Inc.1 (Oak Ontology Threads foundation)
       ↓
gate-2: SLICE 2 SHIPS (Oak Threads, oak-kg-* namespace) [PARALLEL-SAFE with gate-3a after gate-0 + Inc.1]
gate-3a: SLICE 3a SHIPS (mcg sub-graph, oak-misconceptions-*) [PARALLEL-SAFE with gate-2 after gate-0 + Inc.1; legacy factory path]
  ↓ (all three gates closed → MVP arc complete)
gate-learning-loop: /jc-consolidate-docs after each gate; archive after gate-3a
  ↓
[follow-on combinatorial arc activates — see graph-combinatorial-arc.plan.md]
```

**Strict gates** (cannot be reordered):

- gate-0 -> gate-1 (substrate floor in place)
- graph-stack Inc.1 -> gate-2 (Oak Ontology Threads adapter + inverse-edge
  lookup)
- graph-stack Inc.1 -> gate-3a (Thread IRI input requires Thread->Unit
  lookup; misconception traversal remains on the legacy factory)

**Parallel-safe**: gate-1, gate-2, and gate-3a may run concurrently once
their substrate floors are in place. The three substrate streams are
co-primary; no single slice's surfacing blocks another's.

## Sequencing of Spine-Owned Todos

The gate dependency graph above shows when each *delivery gate* lands.
This section sequences the *spine-owned coordination todos* — the work
the spine itself drives, distinct from the underlying plans' delivery
work. The spine has three phases.

### Phase 0 — Coordination amendments

Doc-only amendments. Once landed, the spine's gate acceptance criteria
are unambiguous and the namespace discipline is checkable.

| Todo | Status |
|---|---|
| `amend-eef-plan` | **Completed** — 19 tool/prompt name occurrences renamed `eef-*`; t18 ADR-123 entry updated; amendment note + MVP-arc cross-reference added to plan body |
| `amend-adr-157` | **Completed** — namespace table extended with `oak-misconceptions-*` row + compound-prefix row; explicit-source-attribution discipline addendum recorded; ADR-173 cross-reference added |
| `amend-portfolio-index` | Pending — 3-slice MVP arc table + new row for graph-combinatorial-arc (2026-05-11 reshape) |
| `amend-high-level-plan` | Pending — cross-link 3-slice MVP + follow-on combinatorial arc (2026-05-11 reshape) |
| `amend-graph-stack-inc-3-consumer-ref` | Pending — Inc.3 carries downstream-consumer cross-reference to graph-combinatorial-arc.plan.md (2026-05-11 reshape) |

### Phase 1 — Surface-plan authoring + reshape migration

Slices 2 and 3a have executable plans authored in `current/`. The
slice-3b plan (now `oak-misconceptions-eef-cross-corpus-surface`) was
migrated from `current/` to `future/` during the 2026-05-11 reshape and
its spine pointer was repointed to `graph-combinatorial-arc.plan.md`.

| Todo | Status |
|---|---|
| `author-slice-2-plan` | **Completed** 2026-05-07 (commit 776df6b7); spine-lock principle wording remediated 2026-05-07 (Phase 4) |
| `author-slice-3a-plan` | **Completed** 2026-05-07; slice-3b composition framing remediated 2026-05-07; source-authority clarification 2026-05-10 |
| `migrate-slice-3b-plan` | **Completed** 2026-05-11 (reshape) — plan moved to future/; spine pointer repointed to graph-combinatorial-arc |

### Phase 2 — Delivery gates (sequenced by substrate floor)

The gate-class todos land per the dependency graph above. The spine
**observes** these gates; the work happens in the underlying plans.
Calendar timing depends on substrate progress.

### Phase 3 — Learning loop (continuous, then closeout)

`learning-loop` runs after **every** gate (continuous) and a final pass
after `gate-3a-mcg-subgraph-ships` (closeout). The continuous runs
update permanent docs incrementally; the closeout run mines MVP-arc
outcomes into ADRs and archives this spine plan per ADR-117.

## ADR-157 Amendment

**Status (2026-05-07): LANDED.** Captured in the ADR itself; this
section retained as the authoritative record of what was amended.

ADR-157's existing namespace prefix table:

| Prefix | Source | Examples |
|---|---|---|
| *(none)* | Oak Open Curriculum API (bulk data) | `prior-knowledge-graph` |
| `oak-kg-*` | Oak Curriculum Ontology | `oak-kg-threads` |
| `eef-*` | EEF Teaching and Learning Toolkit | `eef-methodology`, `eef-strands` |

Spine-driven amendment adds:

| Prefix | Source | Examples |
|---|---|---|
| `oak-misconceptions-*` | Oak misconception graph (bulk-derived; constructed in-repo from Oak bulk data) | `oak-misconceptions-subgraph-for-thread` |
| Compound (`oak-misconceptions-eef-*`) | Cross-corpus tool composing two named sources | `oak-misconceptions-eef-recommend-for-thread` (lives in the follow-on combinatorial arc, not this MVP) |

Plus a discipline statement (verbatim addendum):

> **Explicit source attribution on every NEW tool.** New tools and
> resources must carry a source-identifying prefix (or compound prefix
> for cross-corpus tools). The unprefixed default is retained for
> already-shipped API-derived tools (`prior-knowledge-graph`,
> `thread-progressions`, `model`, the existing misconception graph
> resource, etc.) to avoid breaking consumers, but new primitives must
> conform. This ensures source attribution is trivially clear during
> assessment, observability, debugging, and licensing audit.

## Plan Amendments Required

| Plan | Amendment | Status |
|---|---|---|
| [`eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md) | Tool todos t6/t7/t8 renamed to `eef-*` prefix; t10/t11 prompt names renamed; t18 ADR-123 entry updated. Cross-reference to this spine. | **Landed** |
| [`graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md) | Foundation corpus corrected to Oak Ontology Threads; Inc.1 provides the Thread adapter for slice 2; Inc.3 carries downstream-consumer cross-reference to graph-combinatorial-arc.plan.md (2026-05-11 reshape). NC graph work is outside the MVP. | **Amended 2026-05-10**; Inc.3 cross-ref pending 2026-05-11 reshape |
| [`graph-portfolio-index.md`](graph-portfolio-index.md) | 3-slice MVP arc table; new row for graph-combinatorial-arc (2026-05-11 reshape). | Pending |
| [`high-level-plan.md`](high-level-plan.md) | Cross-link 3-slice MVP + follow-on combinatorial arc. | Pending |
| `ADR-157` | Amendment per [`§ ADR-157 Amendment`](#adr-157-amendment). | **Landed** |

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Substrate floor for slice 1 (`graph-query-layer`) takes longer than expected; slice 1 ships later than "soon" feels | Medium | The MVP framing accepts honest substrate cost; "soon" means earliest substrate-allows, not artificial deadline. Visible progress through gate-0 substrate increments. |
| EEF tool rename breaks downstream consumers | Low | Tool surface is not yet shipped under any name; rename costs zero. Document in ADR-123. |
| Slice 3a's legacy-factory tech debt grows during Inc.2/3 wait | Medium | The substrate-migration follow-up plan is named up-front; ADR-123 records the legacy path explicitly so the contract for migration is visible. |
| AI-client adoption stalls; teacher value never materialises | Medium | Named honestly in the executive summary. AI-client adoption is tracked elsewhere (or, currently, **not tracked** — flagged for owner). This arc cannot solve adoption; it can only ship surfaces that AI clients can adopt. |
| Combinatorial arc loses Inc.3 forcing-function after slice 3b moves out | Medium | `amend-graph-stack-inc-3-consumer-ref` todo lands the cross-reference from graph-stack Inc.3 to graph-combinatorial-arc.plan.md. Inc.3 retains a named downstream consumer; the combinatorial arc is `current/`, not deferred. |
| Specialist reviewer load becomes serial bottleneck | Medium | Slices 2 and 3a are parallel-safe; reviewer dispatch happens at each gate, not all at once. |

## Foundation Alignment

This spine commits to:

1. **[`principles.md`](../directives/principles.md)** — TDD as design,
   schema-first, fail loud, no manual API data (ADR-029), namespace
   discipline (ADR-157), cardinal rules.
2. **[`testing-strategy.md`](../directives/testing-strategy.md)** —
   atomic test+product-code landing per cycle, no skipped tests, no
   audit-shaped tests. Each underlying plan inherits this commitment.
3. **[`schema-first-execution.md`](../directives/schema-first-execution.md)** —
   Zod-validated boundaries (eef-toolkit.json loader t2; future EEF and
   misconception ingestion).

Spine-specific alignment:

- **Plan placement by ownership** (PDR-018) — spine sits at
  `.agent/plans/` top-level because it spans collections; collection-owned
  plans stay where they are.
- **No moving targets** — the spine's frontmatter is stable; gate
  contents reference todos in named plans rather than restating them.
- **Replace, don't bridge** — no spine-only adapter code; the spine
  amends existing plans rather than creating bridge layers.

## Quality Gates

The spine inherits the
[`quality-gates.md`](templates/components/quality-gates.md)
component sequencing from each underlying plan. At each gate:

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check \
  && pnpm format:root && pnpm markdownlint:root && pnpm lint:fix \
  && pnpm test && pnpm test:ui && pnpm test:e2e
```

Plus per-slice gates:

- **gate-1**: `pnpm test` exercises eef-evidence-corpus E2E shape
  conditions (t19); freshness CI gate active (t13); Sentry telemetry
  visible (t14); shape-understanding evidence recorded.
- **gate-2**: E2E test verifies all `curric:Thread` enumeration and
  inverse-edge resolution returns expected unit lists;
  shape-understanding evidence recorded.
- **gate-3a**: E2E test verifies sub-graph extraction stays within
  `maxResponseTokens = 16000` across the committed `20`-context fixture
  manifest selected deterministically from reachable-misconception
  counts. The budget is measured against the serialized model-visible
  `content` text payload, including citations/caveats and duplicated
  JSON required for MCP compatibility. Shape-understanding evidence
  recorded.

## Specialist Reviewers

| Reviewer | Triggered at |
|---|---|
| `mcp-expert` | Every slice (gates 1, 2, 3a) — every slice ships MCP primitives |
| `test-expert` | Every gate, post-implementation |
| `clerk-expert` | Any gate that touches auth on MCP surfaces (none expected, but if discovered) |
| `assumptions-expert` | Plan promotion (current → active); validates blocking relationships |
| `architecture-expert-betty` | Gates 2 and 3a — substrate boundary and bulk-data-to-graph design review |
| `docs-adr-expert` | Each gate close — record shape-understanding evidence into permanent docs |
| `code-expert` | Every gate, standard discipline |

## Lifecycle Triggers

Reference
[`lifecycle-triggers.md`](templates/components/lifecycle-triggers.md):

- **Session entry**: read this plan + `napkin.md` + `distilled.md` +
  `graph-portfolio-index.md`.
- **Collaboration claim registration**: required when promoting any of
  the underlying plans (eef-evidence-corpus, graph-stack, etc.) from
  `current/` to `active/`.
- **Mid-arc checkpoints**: at gate-1, gate-2, gate-3a — run
  `/jc-consolidate-docs` graduation scan; surface any pattern candidates;
  capture shape-understanding evidence to permanent docs.
- **Handoff closure**: every session ends with `next-session.md` updated
  for the relevant thread (`connecting-oak-resources` or
  `sector-engagement/eef`).

## Learning Loop

After **every** gate ships:

1. Run `/jc-consolidate-docs` graduation scan.
2. Mine settled outcomes into permanent docs (ADRs, directives,
   READMEs, reference docs). Each gate's shape-understanding evidence
   is the primary input to this mining.
3. Update `napkin.md` with patterns learned at the gate.
4. Update `graph-portfolio-index.md` to reflect the slice's status.

After **gate-3a** ships (MVP arc closeout):

1. Full `/jc-consolidate-docs` pass.
2. Mine MVP-arc outcomes into permanent docs:
   - Update ADR-157 if discipline addendum proved sufficient.
   - Add ADR if a substrate or surfacing pattern stabilised across slices.
   - Update graph-portfolio-index.md to mark goals 1/2 progressed.
3. Hand off to `graph-combinatorial-arc.plan.md` (its promotion trigger
   activates on gate-1 + gate-3a shipped + Inc.3 design-stable).
4. Archive this plan to `archive/completed/` per ADR-117.
5. Update `completed-plans.md`.

## Team-of-Agents Execution

Findings from the 2026-05-11 reshape session on how this arc can be
worked by a team of agents in parallel. Recorded here for use at each
gate's promotion-to-active moment; treat as a planning input, not a
delivery commitment.

### Cross-slice parallelism (post-reshape)

| Phase | Concurrent agents | What each owns |
|---|---|---|
| **Pre-Inc.1** | **2** | (a) Slice 1 EEF — entire `eef-evidence-corpus.plan.md` (no Inc.1 dependency); (b) graph-stack Inc.1 Oak Ontology Threads foundation + the two 2026-05-07 topology BLOCKERs (D-4) |
| **Post-Inc.1** | **3–4** | (a) Slice 1 EEF (if still in flight); (b) Slice 2 Threads (gate-2); (c) Slice 3a misconception sub-graph (gate-3a); optional (d) graph-stack Inc.2 to unblock combinatorial-arc earlier |
| **Combinatorial-arc activation** | **+1** | First combinatorial tool (the migrated slice-3b plan) once graph-stack Inc.3 design-stable |

The gate-1 → gate-3a relaxation to parallel-safe (this reshape) unlocks
slices 2 and 3a running concurrently once gate-0 + Inc.1 are in place.

### Within-slice parallelism

Each slice plan is a chain of TDD-pair atomic commits — the foundational
TDD doctrine forces test + product code to land together in one commit,
so within a cycle there is no parallelism. **Across cycles within a
slice**, two agents can work in parallel only when file scopes don't
overlap (typical for slice 2 WS1+WS2 cycle 1; slice 3a cycles 1.1, 1.3,
1.4). Realistic intra-slice ceiling: **2 agents per slice**, with a
natural serialisation point at the integration-wiring workstream.

### What would raise the ceiling

The MVP arc's parallelism ceiling is set by three structural facts. The
remediations below would lift each one; each remediation is itself a
scoped planning session.

1. **Decompose Inc.1 into sub-streams.** Inc.1 is currently a single
   "foundation" increment; the topology BLOCKERs surface that it is
   substrate scaffolding + Threads adapter + Thread→Unit lookup as
   distinct concerns. With file-scope-non-overlapping sub-increments,
   two agents could share Inc.1 instead of one bottlenecking the
   post-Inc.1 ramp.
2. **Restructure the EEF plan's 20 flat todos into workstream
   groupings.** It is currently the only slice without explicit WS
   structure. Grouping (corpus loading, recommend tool, explain tool,
   compare tool, prompt-A, prompt-B, freshness gate, telemetry,
   credits) would expose intra-slice parallelism cleanly.
3. **Author shape-understanding evidence templates.** The new
   gate-close acceptance criterion (a written paragraph naming what
   each slice taught us about its corpus's shape) is free-form;
   templating it speeds the gate-close agent work and prevents the
   deliverable from dissolving under delivery pressure.

### The real ceiling — collaboration protocol maturity

The honest constraint is **not the MVP plan's structure**. The
multi-agent collaboration protocol's current state — foreign-stage
incidents in the comms-log, claim overlaps, fitness-gate orchestrator
not staged-set-aware, the B-01 `comms send` bug — already shows friction
at 1–2 concurrent agents. Scaling to 4–5 will stress those protocols
hard.

The leverage for safe N-agent work on this arc lives in
[`agent-tooling/current/primary-agent-tooling-enhancements.plan.md`](agent-tooling/current/primary-agent-tooling-enhancements.plan.md)
Workstreams 2–5 (collaboration read APIs, comms render resilience,
commit-queue safety, identity/build isolation) and in the standing
[`agent-tooling/current/multi-agent-collaboration-protocol.plan.md`](agent-tooling/current/multi-agent-collaboration-protocol.plan.md).
**Until those mature, the MVP arc's effective parallelism ceiling stays
near the lower bound of each phase's range above.**

### Open decisions (resolve before next graph session)

These named decisions affect MVP arc execution and were surfaced during
the reshape session. They are tracked here for discoverability; the
authoritative resolution surface is the
[`connecting-oak-resources`](../memory/operational/threads/connecting-oak-resources.next-session.md)
thread record.

| ID | Decision | Resolution needed by |
|---|---|---|
| **D-1** | **AI-client adoption tracking owner.** AI-client adoption is currently un-tracked anywhere in the repo; the executive summary names it as a load-bearing downstream dependency for teacher value. Tracking owner needs naming. | Before any MVP-arc gate ships |
| **D-2** | **Per-unit misconception variant (`oak-misconceptions-subgraph-for-unit`)**. Default is skip per slice 3a plan WS2 cycle 1; gate at owner direction or T0 check. | At slice 3a opening (current → active) |
| **D-3** | **`oak-misconceptions-substrate-migration.plan.md` promotion trigger** — currently implicit ("when Inc.3 ships"); owner confirmation needed to convert implication into sequenced commitment vs admit-not-doing per the no-deferral doctrine. | Before gate-3a ships |
| **D-4** | **Topology BLOCKERs from 2026-05-07 architecture-expert-betty review** — Resolved 2026-05-11. Both BLOCKERs (WS4 sequencing leak; `practice-graph` tier placement) verified CLOSED in `graph-stack.plan.md` (last-updated 2026-05-10) and ADR-173: WS4.1 `graph-corpus-sdk-scaffold` is sequenced first with Oak extraction confined inside the SDK boundary (graph-stack.plan.md:77-88; ADR-173:89); `practice-graph` is placed under `agent-graphs/` outside substrate package tiers (graph-stack.plan.md:215, 220-225, Design Principle 6 line 172; ADR-173:93-95). Reviewer attestations: `architecture-expert-betty` (both CLOSED, 2026-05-11) and `assumptions-expert` (verified). **Sub-task D-4a (open)**: ADR-041 needs an amendment to add `agent-graphs/` (and regularise the already-shipped `agent-tools/`) as top-level workspace tiers in the dependency-direction matrix before ADR-173 can move from Proposed to Accepted — surfaced by `assumptions-expert` 2026-05-11; an ADR-041 amendment (no new ADR number) is the indicated shape. | D-4 closed; D-4a routes to ADR-041 amendment before ADR-173 ratification |
| **D-5** | **Phase 4 FINDINGS** deferred for execution-prep absorption (slice 2 adapter timing; slice 3a topic-context wording; slice 3a budget/fixture concretisation; (former) slice-3b implementation-audit test shape). | Slice-by-slice at promotion to active |
| **D-6** | **gate-cross-corpus-1 design-stability evaluator event** — `architecture-expert-betty` is named as the evaluator at Inc.3 design close; "design close" needs operational definition (a specific Inc.3 todo, or a separate graph-stack lifecycle event). | At Inc.3 design phase |
| **D-7** | **`future-compositions-exploration` decision deliverable** — bounded to "within one consolidation cycle of gate-cross-corpus-1 close"; could harden to a concrete forcing function. | At gate-cross-corpus-1 close |

D-1 (AI-client adoption tracking) is the most urgent open decision; it
affects the entire teacher-value chain. D-4 is resolved; its open sub-task
D-4a (ADR-041 amendment) routes to a dedicated ADR-amendment session and
blocks ADR-173 ratification rather than Inc.1 implementation.

## Non-Goals (YAGNI)

Spine-level non-goals — spine does **not**:

- Write any product code itself. Underlying plans do.
- Replace any existing plan. It sequences and amends; plans stay where
  they are.
- Specify TDD cycles for the underlying plans. Each plan owns its
  cycles.
- Lock graph-stack increment scope. graph-stack owns its increments;
  the spine names dependencies on increments by reference.
- Pre-decide combinatorial composition shapes. Combinatorial work is
  owned by `graph-combinatorial-arc.plan.md`.
- Commit to teacher-outcome measurement. Outcome eval is downstream
  evaluation-infrastructure work.

<!-- ARCHIVED OWNER DECISIONS — preserve chronological audit trail; do not retro-edit. Search anchor: "Owner Decisions Archive". -->

## Owner Decisions Archive

Recent reshape decisions appear first, followed by chronological history.

### 2026-05-11 — MVP arc reshape (this revision)

| Date | Decision | Captured in |
|---|---|---|
| 2026-05-11 | **Four value streams confirmed** — substrate, shape-understanding, surfacing-exploration, partnership (slice 1) + combinatorial (follow-on arc). Per-slice 1-to-many mapping replaces the per-slice "user value triplet"; teacher value named as downstream of AI-client adoption. | Owner direction; `§ Value Streams (Portfolio Level)` |
| 2026-05-11 | **Slice 3b moves out of MVP arc** — substrate-for-three-sources establishes before combinatorial exploration. `graph-combinatorial-arc.plan.md` authored to `current/` with promotion trigger keyed to MVP-arc gates + graph-stack Inc.3 design stability. Slice-3b executable plan migrated from `current/` to `future/` with spine pointer repointed. | Owner direction; `§ Executive Summary` reshape table |
| 2026-05-11 | **Partnership dimension placement** — opens with slice 1 (EEF surface ships, conversation enabled); strengthens in combinatorial arc when cross-corpus joint value lands. Both surfaces carry partnership framing at different intensities. | Owner direction |
| 2026-05-11 | **gate-1 → gate-3a strict gate relaxed** to parallel-safe with gate-2 after gate-0 + Inc.1. Three substrate streams as co-primary supports parallel work. | Owner direction; assumptions-expert finding |
| 2026-05-11 | **Plan body restructured for decision-clarity** — sharp executive summary at top; per-slice value streams replace user-value triplets; historical 24-row Owner Decisions Log moved to in-file archive section with archive marker; recent reshape entries promoted to top of archive. | Reviewer findings; docs-adr-expert |
| 2026-05-11 | **graph-stack Inc.3 carries downstream-consumer cross-reference to graph-combinatorial-arc.plan.md** — Inc.3 retains a named consumer signal even though slice 3b no longer lives in this arc. | architecture-expert-betty Condition 2 |
| 2026-05-11 | **AI-client adoption named as load-bearing downstream dependency** — surfaced in executive summary rather than left implicit. | assumptions-expert Important Finding 2 |

### 2026-05-07 → 2026-05-10 — pre-reshape (chronological)

| Date | Decision | Captured in |
|---|---|---|
| 2026-05-07 | MVP arc shape: spine-only (existing plans stand; spine sequences) | `slice-1-shape: spine-full` |
| 2026-05-07 | Slice 2 shape: Threads-first surface | `slice2-shape: B-threads` |
| 2026-05-07 | Slice 3 shape: misconception graph + cross-corpus with EEF; sub-graph query is the blocking problem | Three-slice user message 2026-05-07 |
| 2026-05-07 | Namespacing: `oak-misconceptions-*` for misconception tools; compound prefixes for cross-corpus | `ns-mcg: oak-misconceptions` |
| 2026-05-07 | Slice 3 substrate path: Hybrid (3a fast on legacy, 3b on substrate) | Owner skipped question; spine commits to Hybrid based on stated principles |
| 2026-05-07 | MVP discipline: ship soon + full quality + explicit follow-ups | Owner direct quote, recorded in `§ MVP Discipline` |
| 2026-05-07 | **Doctrine** — never use "deferred" as bare status; sequence (gate-relative or tripwire) or admit not-doing. Applied per-plan, not as out-of-arc tracking. | Owner correction |
| 2026-05-07 | **Boundary correction** — the MVP-arc spine tracks only what's IN the MVP. Plans outside the MVP (NC SKOS taxonomy, etc.) carry their own promotion triggers in their own home, not as spine cuts. | Owner correction |
| 2026-05-07 | **Boundary correction drift remediated** — three residual `mvp_arc_status: deferred` references removed from the spine. | Phase 0 of single-session planning closure (Breezy Navigating Sail, commit `d740baa0`) |
| 2026-05-07 | **MVP-arc surface review** — Phase 1 dispatch of `code-expert` + `assumptions-expert` over the five MVP-arc artefacts; `architecture-expert-betty` over ADR-173 + `graph-stack.plan.md` topology in parallel. | Phase 1 of single-session planning closure |
| 2026-05-07 | **Slice 1 substrate floor corrected (assumption-expert BLOCKER #1)** — spine slice 1 substrate floor now matches the consumer plan; migration onto graph-corpus-sdk is named as a follow-up, not a slice-1 gate. | Phase 2 remediation |
| 2026-05-07 | **(former) gate-3b dependency corrected** — slice 3b is now in graph-combinatorial-arc; this entry is historical context for the dependency-correction story. | Phase 2 remediation |
| 2026-05-07 | **gate-3a dependency reason corrected (assumption-expert FINDING #3)** — strict gate preserved at the time as sequencing discipline; **superseded by 2026-05-11 relaxation to parallel-safe** with gate-2 after gate-0 + Inc.1. | Phase 2 remediation; superseded 2026-05-11 |
| 2026-05-07 | **Slice 2 cut-scope table cleaned (assumption-expert FINDING #2)** — NC SKOS taxonomy MCP surface row deleted. | Phase 2 remediation |
| 2026-05-07 | **Topology findings deferred to next session per owner scope direction** — `architecture-expert-betty` surfaced a BLOCKER (`graph-stack.plan.md` WS4 sequence) and a FINDING (`practice-graph` placement). | Phase 2 capture |
| 2026-05-07 | **EEF plan internal contradiction surfaced** — superseded by 2026-05-08 structural-only evaluation decision. | Phase 2 capture; superseded |
| 2026-05-08 | **EEF evaluation stance clarified** — structural citation/data/caveat preservation is load-bearing for slice 1; LLM paraphrase/outcome evaluation, teacher-trust measurement, and SENCO workflow-time measurement are follow-on evaluation-infrastructure work outside Vitest. | PR #102 decision-complete closeout |
| 2026-05-08 | **Practice graph location clarified** — practice-facing graph tooling belongs under the new top-level `agent-graphs/` area. | PR #102 decision-complete closeout |
| 2026-05-10 | **MVP NC boundary reconfirmed** — the MVP plan must not do anything with the NC graph or NC taxonomy. EEF and misconception graph work remain core MVP scope. NC work remains outside the MVP and requires separate owner promotion. | Owner correction |
| 2026-05-10 | **Corpus source authority clarified** — EEF uses the repository-held JSON snapshot; Oak ontology from `oaknational/oak-curriculum-ontology`; misconception graph constructed in-repo from Oak bulk data. | Owner clarification; `§ Source Authority Model` |
| 2026-05-07 | **Three slice plans authored** — slice-2 + slice-3a + (former) slice-3b plans created. (former) slice-3b plan migrated to future/ during 2026-05-11 reshape. | Phase 3, commit `776df6b7` |
| 2026-05-07 | **Slice-plan composition model corrected** — slices 1 and 3a are sources of naming conventions and response shape compatibility for the (now-migrated) slice-3b plan; not runtime MCP dependencies. | Phase 4 BLOCKER remediation, commit `0899ba93` |
| 2026-05-07 | **Phase 4 FINDINGS captured** — four substantive findings remain for execution-prep absorption: slice 2 adapter timing; slice 3a topic-context wording; slice 3a budget/fixture concretisation; (former-slice-3b) implementation-audit test shape. | Phase 4 capture |
| 2026-05-07 | **Single-session planning closure achieved** — pre-flight + Phase 0–4 landed in one session. | Closure verdict, Breezy Navigating Sail |
