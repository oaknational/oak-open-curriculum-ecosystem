---
plan_id: graph-mvp-arc
name: "Graph MVP Arc — Three-Slice Vertical Delivery Spine"
overview: "Cross-collection coordination spine sequencing three vertical slices through the graph stack: (1) EEF evidence corpus MCP surface; (2) Oak ontology Threads MCP surface; (3) Misconception graph sub-graph queries + cross-corpus EEF×misconceptions composition. MVP discipline: reduce scope, ship soon at full quality, name explicit follow-ups for everything cut."
type: cross-collection-coordination-spine
status: current
graph_layer: cross-cutting
graph_portfolio_index: "graph-portfolio-index.md"
last_updated: 2026-05-07
related_indices:
  - "high-level-plan.md"
  - "graph-portfolio-index.md"
adr_amendments_required:
  - "ADR-157 amendment: add `oak-misconceptions-*` prefix; record explicit-source-attribution-on-every-tool discipline; document that the unprefixed default is retained for already-shipped API-derived tools but new tools must carry a prefix"
  - "ADR-168 (proposed) cross-reference: name MVP arc as the first vertical-slice consumer of the graph stack topology"
plan_amendments_required:
  - "sector-engagement/eef/current/eef-evidence-corpus.plan.md: rename tool todos to `eef-*` prefix per ADR-157 (todos t6, t7, t8 + t18 ADR-123 update); add MVP-arc cross-reference"
  - "connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md: WS5 coordination amendments add MVP-arc cross-reference; Increment 2 acceptance criteria explicitly include misconception-graph replatform as gate for slice 3b"
  - "graph-portfolio-index.md: add MVP-arc reference and a `## Vertical-slice arc` section pointing here"
  - "high-level-plan.md: cross-link MVP arc from Cross-cutting Threads section"
specialist_reviewers:
  - mcp-reviewer
  - elasticsearch-reviewer
  - clerk-reviewer
  - test-reviewer
  - assumptions-reviewer
  - architecture-reviewer-betty
foundation_alignment:
  - .agent/directives/principles.md
  - .agent/directives/testing-strategy.md
  - .agent/directives/schema-first-execution.md
isProject: false
todos:
  - id: gate-0-substrate-floor
    content: "Substrate floor for slice 1 is in place: graph-query-layer 7-op surface available (matches the EEF plan's actual KG-independent substrate dependency). Acceptance: substrate quality gates green; no surfacing required at this gate. Follow-up (post-arc): migrate the EEF strand corpus onto graph-corpus-sdk when graph-stack Inc.3 ships; not a slice-1 gate."
    status: pending
    depends_on: []
  - id: gate-1-eef-ships
    content: "Slice 1 ships: all 20 todos in eef-evidence-corpus.plan.md complete; tools/resources named per ADR-157 with `eef-*` prefix; ADR-123 + ADR-157 updated; freshness CI gate active; Sentry telemetry live; caveat-presence rate sampled."
    status: pending
    depends_on: [gate-0-substrate-floor]
  - id: gate-2-threads-ships
    content: "Slice 2 ships: oak-kg-threads resource + oak-kg-get-thread-content tool complete via graph-corpus-sdk Oak Curriculum Ontology adapter; inverse-edge query (Unit→Thread) verified; ADR-123 updated. STRICT GATE — slice 2 starts only after slice 1 ships per owner direction."
    status: pending
    depends_on: [gate-1-eef-ships]
  - id: gate-3a-mcg-subgraph-ships
    content: "Slice 3a ships: oak-misconceptions-subgraph-for-{thread|unit} tool(s) complete on legacy graph factory data; bounded sub-graph extraction primitive verified for context-window fit; ADR-123 + ADR-157 updated. PARALLEL-SAFE with slice 2 (different substrate path)."
    status: pending
    depends_on: [gate-1-eef-ships]
  - id: gate-3b-cross-corpus-ships
    content: "Slice 3b ships: oak-misconceptions-eef-recommend-for-thread (or equivalent) cross-corpus tool complete on substrate; both EEF and misconception graph routed through graph-corpus-sdk + cross-corpus join primitive (graph-stack Inc.3); ADR-123 updated."
    status: pending
    depends_on: [gate-1-eef-ships, gate-3a-mcg-subgraph-ships, "graph-stack Inc.2/3 misconception replatform"]
  - id: amend-eef-plan
    content: "Amend sector-engagement/eef/current/eef-evidence-corpus.plan.md tool todos to apply `eef-*` prefix; update t18 (ADR-123) entry to record renamed tool names. Coordination amendment, no behaviour change."
    status: completed
    depends_on: []
  - id: amend-adr-157
    content: "Amend ADR-157: add oak-misconceptions-* row to the namespace prefix table; record explicit-source-attribution-on-every-tool discipline (with the unprefixed-default exception preserved for already-shipped API-derived tools). Spine-plan-driven; one-paragraph addendum."
    status: completed
    depends_on: []
  - id: amend-portfolio-index
    content: "Amend graph-portfolio-index.md: add a `## Vertical-slice arc` section pointing to this plan; add MVP-arc reference to the relevant goal tables."
    status: completed
    depends_on: []
  - id: amend-high-level-plan
    content: "Amend high-level-plan.md: cross-link MVP arc from the Cross-cutting Threads section (Knowledge Graph thread + EEF Evidence thread both reference the spine)."
    status: completed
    depends_on: []
  - id: author-slice-2-plan
    content: "Author the slice-2 executable plan in connecting-oak-resources/knowledge-graph-integration/current/ (proposed name: oak-kg-threads-surface.plan.md). Strategic shape: oak-kg-threads resource + oak-kg-get-thread-content tool via graph-corpus-sdk Oak Curriculum Ontology adapter. Must land before gate-2 can be assessed. Owner: knowledge-graph-integration thread."
    status: pending
    depends_on: []
  - id: author-slice-3a-plan
    content: "Author the slice-3a executable plan (proposed name: oak-misconceptions-subgraph-mcp-surface.plan.md or extension to existing misconception-graph-mcp-surface.plan.md). Strategic shape: bounded sub-graph extraction tool(s) on legacy graph factory; ADR-123 + ADR-157 updates. Must land before gate-3a can be assessed. Parallel-safe with author-slice-2-plan. Owner: knowledge-graph-integration thread."
    status: pending
    depends_on: []
  - id: author-slice-3b-plan
    content: "Author the slice-3b executable plan (proposed name: oak-misconceptions-eef-cross-corpus-surface.plan.md). Strategic shape: cross-corpus tool composing graph-corpus-sdk EEF + misconception adapters via graph-stack Inc.3 cross-corpus join primitive. Must land before gate-3b can be assessed. Owner: knowledge-graph-integration thread (with sector-engagement/eef coordination). Authoring blocked by author-slice-2-plan + author-slice-3a-plan landing first (so cross-corpus shape can reference both upstream tools by name)."
    status: pending
    depends_on: [author-slice-2-plan, author-slice-3a-plan]
  - id: learning-loop
    content: "After each gate, run /jc-consolidate-docs to surface graduation candidates and update permanent docs. After gate-3b ships, run consolidation pass and consider archiving this spine plan with key outcomes mined to permanent docs per ADR-117."
    status: pending
    depends_on: [gate-3b-cross-corpus-ships]
---

# Graph MVP Arc — Three-Slice Vertical Delivery Spine

**Status**: CURRENT — committed-to-now; queued behind substrate floor.
**Last Updated**: 2026-05-07
**Type**: Cross-collection coordination spine. Sequences existing plans;
does not write code itself.

## Why This Plan Exists

The graph portfolio defines a **substrate** layer
([`graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md)),
multiple **Oak graph surfaces**, and several **features built on those
graphs** — but no plan threads a single vertical slice from substrate
through surface to user-visible feature. The substrate plan's foundation
increment is explicit on this point: *"The foundation increment surfaces
nothing through MCP, HTTP, or CLI. Surfacing is a consumer-side decision
tracked separately."* That is a horizontal substrate slab, not a vertical
slice.

This plan supplies the missing vertical commitment. It picks **three
slices** that, taken together, demonstrate the substrate earning its
keep, surface a high-value Oak-owned graph that exists nowhere else, and
deliver the cross-corpus join that the EEF cross-cutting thread has
always pointed towards.

It does **not** duplicate the existing surface plans, attempt to track
plans outside the MVP arc, or claim authority over scope it doesn't own.
It sequences existing plans, records gates and dependencies between
them, and applies the namespace discipline ADR-157 already calls for.

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
   MVP arc. Plans not in the MVP (NC SKOS taxonomy, EEF prerequisite
   graph integration, etc.) carry their own promotion triggers in
   their own frontmatter and bodies, not in this spine. Owner doctrine
   2026-05-07: *"we never mark anything as deferred; we sequence
   things properly or we admit we are not going to do them.
   Sequencing can include 'when these specific tripwires fire'."* —
   applied on each plan's home, not as out-of-arc tracking.

## Top-Line User Value (per slice)

Each slice carries a user-value triplet (per the
[`eef-evidence-corpus`](sector-engagement/eef/current/eef-evidence-corpus.plan.md)
sense-check pattern):

### Slice 1 — EEF Evidence Corpus

- **User value**: A teacher (or AI client serving a teacher) asks *"what
  evidence-backed approach works for {phase, subject, focus}?"* and
  receives a ranked list of approaches with structural citations
  (strand id + data version + caveat).
- **Provability**: caveat-presence rate ≥95% across N=50 sampled
  responses; distinct contexts queried per week (Sentry).
- **Architecture validation**: confirms `EvidenceCorpus = GraphView +
  ScoringEngine` composition; confirms structural citations survive
  LLM paraphrasing better than prose-requested caveats.

### Slice 2 — Oak Ontology Threads

- **User value**: An AI agent (or teacher via an agent surface) can ask
  *"what's in this curriculum thread?"* — list all Oak threads, then
  traverse one to see all units that include it across subjects and key
  stages, with `rdfs:label` and unit metadata.
- **Provability**: all `curric:Thread` instances enumerable from the
  ontology; for each Thread, complete inverse-edge resolution (Units
  with `curric:includesThread`) with no missing edges versus a control
  SPARQL count.
- **Architecture validation**: confirms direct-ontology-use baseline
  (no Neo4j, no Stardog) is sufficient for Oak-graph MCP surfaces;
  validates the graph-corpus-sdk Turtle ingestion path end-to-end.

### Slice 3a — Misconception Sub-Graph Query

- **User value**: An AI agent asks *"what misconceptions are relevant to
  {topic, thread, unit}?"* and receives a bounded sub-graph small enough
  to fit in normal context windows. The full misconception graph is too
  large to use without an impractical amount of context — sub-graph
  extraction is the blocking problem this slice unblocks.
- **Provability**: sampled sub-graph responses fit within a stated
  context budget across N representative queries; sub-graph completeness
  versus full-graph control on reachable misconceptions.
- **Architecture validation**: confirms the legacy graph factory carries
  enough scaffolding to support topical sub-graph queries while the
  substrate replatform completes (graph-stack Inc.2/3); sets the contract
  the substrate-side migration must preserve.

### Slice 3b — EEF × Misconceptions Cross-Corpus Sequencing

- **User value**: A teacher (or AI client serving a teacher) sequencing
  lessons asks *"for {thread or unit}, what evidence-based approaches
  AND common misconceptions should I plan for?"* and receives both
  ranked EEF strands and a relevant misconception sub-graph in one
  structured response.
- **Provability**: per-call response carries non-empty EEF strand list
  AND non-empty misconception sub-graph for a curated set of N
  thread/unit contexts where both are known to exist.
- **Architecture validation**: confirms cross-corpus join primitive
  (graph-stack Inc.3) earns its keep; confirms the cross-cutting EEF
  thread the portfolio names as strategically important is technically
  delivered, not just promised.

## Slice 1 — EEF Evidence Corpus MCP Surface

**Status**: pending substrate floor.
**Namespace**: `eef-*` (per ADR-157).
**Substrate floor**: graph-query-layer 7-op surface — matches the
substrate dependency the EEF plan itself names (`KG-Independent`
section: thin in-process operations layer over typed JSON; promotion
trigger requires only graph-query-layer ACTIVE). Migration of the EEF
strand corpus onto `graph-corpus-sdk` (graph-stack Inc.3) is a named
follow-up, **not** a slice-1 gate, per the owner-decided `spine-full`
shape (existing plan ships in full).
**Consumes**:
[`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md)
(20 todos, drafted, current/).

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

The renames apply ADR-157's existing `eef-*` namespace convention. The
existing plan's behaviour, telemetry, citation discipline, and freshness
gate are unchanged.

### Acceptance — Slice 1

1. All 20 todos in `eef-evidence-corpus.plan.md` are complete (status:
   completed) — including E2E shape conditions (t19), freshness CI gate
   (t13), telemetry (t14), and credits (t20).
2. All tool/prompt names carry the `eef-*` prefix.
3. ADR-123 records the renamed primitives.
4. ADR-157 reflects the explicit-source-attribution discipline (see
   [`§ ADR-157 Amendment`](#adr-157-amendment)).
5. Caveat-presence rate sampled at ≥95% across N=50 sampled responses.

### Cut scope and follow-ups for slice 1

**None.** Owner chose `spine-full` — the existing plan ships in full
under the namespace fix. No scope cut at slice 1.

## Slice 2 — Oak Ontology Threads MCP Surface

**Status**: pending slice 1.
**Namespace**: `oak-kg-*` (per ADR-157).
**Substrate floor**: graph-stack Inc.1 + Inc.2 (Turtle ingestion mode in
Inc.2 covers `.ttl` parsing); graph-corpus-sdk Oak Curriculum Ontology
adapter (lands in Inc.2 or early Inc.3).
**Sequencing**: STRICT after slice 1 ships, per owner direction
(*"once that is complete an Oak ontology slice"*).

### What ships — Slice 2

| Primitive | Name | Notes |
|---|---|---|
| Resource | `curriculum://oak-kg-threads` | List of `curric:Thread` instances with `rdfs:label` |
| Tool | `oak-kg-get-thread-content` | Thread IRI → all Units with `curric:includesThread` edge to it, grouped by subject + key-stage; uses inverse-edge resolution |

### Why Threads is the right slice 2

- **Unique to Oak.** Threads are pedagogically rich cross-unit narrative
  spines (e.g. *"Empire, persecution and resistance"*, *"How can
  substances be made and changed"*). Not surfaced anywhere else in the
  Oak MCP estate or the API.
- **Bounded.** `threads.ttl` is small; total Thread instance count is
  modest. Inverse-edge resolution (Unit→Thread) returns a bounded list
  per Thread — no context-budget concerns.
- **Demonstrates the substrate.** Surfaces require Turtle ingestion,
  inverse-edge query, and graph-corpus-sdk Oak ontology adapter — all
  the substrate-floor capabilities for further Oak-graph surfaces.

### Acceptance — Slice 2

1. All `curric:Thread` instances enumerable from
   `oak-curriculum-ontology/data/threads.ttl` via the resource.
2. For each Thread, `oak-kg-get-thread-content` returns the full set of
   Units with `curric:includesThread` to it, grouped by subject + KS,
   with `rdfs:label`, `rdfs:comment`, and `curric:whyThisWhyNow`.
3. Inverse-edge query primitive in graph-query-layer verified
   (Thread is a forward edge from Unit; resolution requires inverse).
4. ADR-123 records the renamed primitives.
5. Specialist review by `mcp-reviewer`.

### Cut scope and follow-ups for slice 2

| Cut | Follow-up |
|---|---|
| Lesson-graph projection | New plan: `oak-kg-lesson-graph-surface.plan.md` (future/) |
| Programme/Unit navigator | New plan: `oak-kg-programme-navigator.plan.md` (future/) |
| Generic IRI traverser | New plan: `oak-kg-iri-traverser.plan.md` (future/) |
| Schema/class browser | New plan: `oak-kg-schema-browser.plan.md` (future/) |
| SPARQL endpoint | Existing plan: [`direct-ontology-use-and-graph-serving-prototypes.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md) (future/) |

## Slice 3a — Misconception Sub-Graph Query

**Status**: pending slice 1; PARALLEL-SAFE with slice 2.
**Namespace**: `oak-misconceptions-*` (new prefix; ADR-157 amendment).
**Substrate path**: legacy graph factory (interim). Explicit follow-up
to migrate to substrate when graph-stack Inc.2/3 misconception replatform
lands.

### What ships — Slice 3a

| Primitive | Name | Notes |
|---|---|---|
| Tool | `oak-misconceptions-subgraph-for-thread` | Thread IRI → bounded misconception sub-graph for misconceptions associated with units in that thread |
| Tool (optional) | `oak-misconceptions-subgraph-for-unit` | Unit IRI → bounded misconception sub-graph for misconceptions on that unit's content |

The tools return **bounded** sub-graphs sized to fit a stated context
budget. Bound is a parameter; default chosen so 95th-percentile responses
fit standard context windows.

### Why this is the slice 3 priority

Owner direction, 2026-05-07: *"slice 3 the misconception graph, but it
requires the ability to query sub-graphs as the misconception graph is
too large to use without using an impractical amount of context."* The
sub-graph query primitive is the BLOCKING problem to fix; cross-corpus
composition (slice 3b) is the user-value framing on top.

### Acceptance — Slice 3a

1. Sub-graph extraction by topic/thread/unit context returns bounded
   results that fit stated context budgets across N representative
   queries.
2. Sub-graph completeness verified versus full-graph control: for each
   sample query, all reachable misconceptions within the bound are
   present.
3. The legacy-factory interim path is explicit in the plan body, in tool
   `_meta`, and in ADR-123 — every consumer can see this is a contract
   the substrate must preserve.
4. ADR-157 records the new `oak-misconceptions-*` prefix.

### Cut scope and follow-ups for slice 3a

| Cut | Follow-up |
|---|---|
| Substrate-based implementation | New plan: `oak-misconceptions-substrate-migration.plan.md` (future/) — migrates slice 3a tools onto graph-corpus-sdk + GraphView when graph-stack Inc.3 misconception adapter ships |
| Per-IRI lookup (single-misconception detail) | Tracked todo on existing `misconception-graph-mcp-surface.plan.md` (already DONE) — file as a follow-up enhancement |
| Topic-string sub-graph (without IRI) | Future plan: `oak-misconceptions-topic-extraction.plan.md` (future/) |

## Slice 3b — EEF × Misconceptions Cross-Corpus Sequencing

**Status**: blocked by gate-1-eef-ships AND gate-3a-mcg-subgraph-ships
AND graph-stack Inc.3 (cross-corpus join primitive + misconception
adapter on graph-corpus-sdk). **Not** blocked by gate-2 — slice 3b
composes EEF (slice 1) and misconceptions (slice 3a); the Oak Threads
MCP surface is not in the cross-corpus payload.
**Namespace**: `oak-misconceptions-eef-*` (compound prefix; ADR-157
amendment).
**Substrate floor**: full slice 1 substrate + slice 3a tools available
(via either path) + graph-stack Inc.3 cross-corpus joins.

### What ships — Slice 3b

| Primitive | Name | Notes |
|---|---|---|
| Tool | `oak-misconceptions-eef-recommend-for-thread` | Thread IRI (or Unit IRI) → structured `{evidence: [...EEF strands ranked], misconceptions: {...bounded sub-graph}}` payload |

The compound prefix names both source corpora explicitly so source
attribution is trivially clear during assessment, observability, and
debugging — the namespacing discipline owner stated explicitly.

### Why slice 3b matters

Closes the cross-corpus EEF thread the portfolio names as a sector-cohesion
demonstration. Teachers sequencing lessons need both *what works*
(evidence-backed approaches) and *what to plan for* (common
misconceptions) in one structured response, not two separate calls.

### Acceptance — Slice 3b

1. Per-call response carries non-empty EEF strand list AND non-empty
   misconception sub-graph for a curated set of N thread/unit contexts
   where both are known to exist.
2. Both corpora flow through graph-corpus-sdk + GraphView (no legacy
   factory).
3. Cross-corpus join primitive verified end-to-end.
4. ADR-123 records the compound-prefix tool.

### Cut scope and follow-ups for slice 3b

| Cut | Follow-up |
|---|---|
| Three-corpus joins (EEF + misconceptions + threads simultaneously, or with the prerequisite graph) | Existing plan: [`cross-source-journeys.plan.md`](connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md) (future/) |
| Open-ended sequencing recommendations beyond thread/unit context (e.g. by lesson, by content descriptor) | New plan: `oak-misconceptions-eef-extended-contexts.plan.md` (future/) |
| LLM-graded outcome verification | Tracked as out-of-scope per `eef-evidence-corpus.plan.md` t19 (*"Outcome verification (LLM-paraphrasing) is honestly out of scope until evaluation infrastructure exists"*); existing position holds |

## Sequencing and Gates

```text
graph-stack Inc.1 (foundation)
  ↓
graph-stack Inc.2 (build-pipeline completion; rewrites legacy)
  ↓
graph-stack Inc.3 (corpus adapters + cross-corpus joins)
  ↓
graph-query-layer 7-op surface lands within Inc.2/3
  ↓
gate-0: substrate floor for slice 1 ✓
  ↓
gate-1: SLICE 1 SHIPS (EEF evidence corpus, eef-* namespace)
  ↓
  ├── gate-2: SLICE 2 SHIPS (Oak Threads, oak-kg-* namespace) [STRICT after slice 1]
  └── gate-3a: SLICE 3a SHIPS (mcg sub-graph, oak-misconceptions-*) [PARALLEL with slice 2; legacy factory path]
       ↓
       (graph-stack Inc.3 misconception replatform ships separately)
       ↓
gate-3b: SLICE 3b SHIPS (cross-corpus, oak-misconceptions-eef-*)
  ↓
gate-learning-loop: /jc-consolidate-docs after each gate; archive after gate-3b
```

**Strict gates** (cannot be reordered):

- gate-1 → gate-2 (owner direction)
- gate-1 → gate-3a (owner-sequenced: slice 1 first establishes the MVP-arc spine pattern + namespace discipline; slice 3a follows once that pattern is proven — ADR-157 amendment + the `eef-*` prefix landed in Phase 0, so this gate is now sequencing discipline rather than an artefact dependency)
- gate-1 + gate-3a → gate-3b (cross-corpus composes EEF [slice 1] + misconceptions [slice 3a]; Threads [slice 2] is not part of the cross-corpus payload)
- graph-stack Inc.3 → gate-3b (cross-corpus join primitive)

**Parallel-safe**: gate-2 and gate-3a may run concurrently after gate-1.
They share no file scope and have independent substrate paths.

## Sequencing of Spine-Owned Todos

The gate dependency graph above shows when each *delivery gate* lands.
This section sequences the *spine-owned coordination todos* — the work
the spine itself drives, distinct from the underlying plans' delivery
work. The spine has four phases.

### Phase 0 — Coordination amendments (spine authoring window, 2026-05-07)

Doc-only amendments with empty `depends_on`. They land alongside the
spine plan being authored. Once landed, the spine's gate acceptance
criteria are unambiguous and the namespace discipline is checkable.

| Todo | Status (2026-05-07) |
|---|---|
| `amend-eef-plan` | **Completed** — 19 tool/prompt name occurrences renamed `eef-*`; t18 ADR-123 entry updated; amendment note + MVP-arc cross-reference added to plan body |
| `amend-adr-157` | **Completed** — namespace table extended with `oak-misconceptions-*` row + compound-prefix row; explicit-source-attribution discipline addendum recorded; ADR-168 cross-reference added |
| `amend-portfolio-index` | **Completed** — Vertical-slice arc section + spine cross-reference (landed 2026-05-07 alongside spine authoring) |
| `amend-high-level-plan` | **Completed** — Cross-cutting Threads section cross-references the spine (landed 2026-05-07) |

Phase 0 is **closed** — all four amendments landed.

The NC SKOS taxonomy plan was briefly amended during this session in
error to carry out-of-arc framing — the NC plan is **not** part of the
MVP arc and the spine should not carry framing for it. Both attempts
reverted same-day per owner correction. The NC plan now carries its own
promotion trigger (demand-tripwire on SKOS-specific consumer demand) in
its own frontmatter, owned by its own thread.

### Phase 1 — Surface-plan authoring (between spine landing and slice promotions)

Slices 2, 3a, and 3b need executable plans authored in `current/` before
their gates can be assessed. The spine names what each plan must
contain; the authoring landing the actual file is its own piece of
work, owned by the relevant collection thread (knowledge-graph-integration
for all three; with sector-engagement/eef coordination for slice 3b).

| Todo | When | Owner |
|---|---|---|
| `author-slice-2-plan` | After Phase 0; before gate-1 begins so reviewer dispatch can plan ahead. Authoring is parallel-safe with slice 1's delivery work. | knowledge-graph-integration thread |
| `author-slice-3a-plan` | After Phase 0; parallel-safe with `author-slice-2-plan`. Both can land in the same authoring session. | knowledge-graph-integration thread |
| `author-slice-3b-plan` | After both upstream slice plans exist (so the cross-corpus tool can reference both upstream tools by name) **AND** before graph-stack Inc.3 ships (so the cross-corpus join primitive design has a downstream consumer's shape requirements visible). | knowledge-graph-integration thread (with sector-engagement/eef coordination) |

These are the three spine gaps surfaced 2026-05-07 — the original spine
draft pre-supposed these plans existed but they don't. Authoring them
is part of the spine's coordination commitment, not a delivery gate.

### Phase 2 — Delivery gates (sequenced by substrate floor)

The gate-class todos land per the dependency graph in `## Sequencing
and Gates`. The spine **observes** these gates; the work happens in the
underlying plans. Calendar timing depends on substrate progress and is
not the spine's to commit to.

### Phase 3 — Learning loop (continuous, then closeout)

`learning-loop` runs after **every** gate (continuous) and a final pass
after `gate-3b-cross-corpus-ships` (closeout). The continuous runs
update permanent docs incrementally; the closeout run mines MVP-arc
outcomes into ADRs and archives this spine plan per ADR-117.

### When does the next thing happen?

Reading the phases in order:

1. **Now → today/this week:** Phase 0 closed (4 amendments landed).
2. **Next session(s) on the knowledge-graph-integration thread:**
   author the slice 2 + slice 3a executable plans (parallel-safe).
3. **In parallel with substrate work:** graph-stack Inc.1 + Inc.2 +
   Inc.3 progress in their own plan; spine watches.
4. **When substrate floor lands:** gate-1 via eef-evidence-corpus
   promotion + execution.
5. **After gate-1:** gate-2 and gate-3a in parallel.
6. **After gate-2 + gate-3a + Inc.3 misconception replatform:** gate-3b.
7. **After every gate:** learning-loop continuous run.
8. **After gate-3b:** learning-loop closeout + spine archive.

## ADR-157 Amendment

**Status (2026-05-07): LANDED.** Captured in the ADR itself; this
section retained as the authoritative record of what was amended.

ADR-157's existing namespace prefix table:

| Prefix | Source | Examples |
|---|---|---|
| *(none)* | Oak Open Curriculum API (bulk data) | `prior-knowledge-graph` |
| `oak-kg-*` | Oak Curriculum Ontology | `oak-kg-knowledge-taxonomy` |
| `eef-*` | EEF Teaching and Learning Toolkit | `eef-methodology`, `eef-strands` |

Spine-driven amendment adds:

| Prefix | Source | Examples |
|---|---|---|
| `oak-misconceptions-*` | Oak misconception graph (Oak-derived from API; graph-shaped) | `oak-misconceptions-subgraph-for-thread` |
| Compound (`oak-misconceptions-eef-*`) | Cross-corpus tool composing two named sources | `oak-misconceptions-eef-recommend-for-thread` |

Plus a discipline statement (verbatim addendum):

> **Explicit source attribution on every NEW tool.** New tools and
> resources must carry a source-identifying prefix (or compound prefix
> for cross-corpus tools). The unprefixed default is retained for
> already-shipped API-derived tools (`prior-knowledge-graph`,
> `thread-progressions`, `model`, the existing misconception graph
> resource, etc.) to avoid breaking consumers, but new primitives must
> conform. This ensures source attribution is trivially clear during
> assessment, observability, debugging, and licensing audit.

The amendment is owner-driven (2026-05-07) and lands as part of the
spine plan's coordination amendments. ADR-157's status remains
**Proposed** until the multi-source integration ships enough surface
to confirm the convention.

## Plan Amendments Required

| Plan | Amendment | Status (2026-05-07) |
|---|---|---|
| [`eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md) | Tool todos t6/t7/t8 renamed to `eef-*` prefix; t10/t11 prompt names renamed; t18 ADR-123 entry updated to record renamed primitives. Cross-reference to this spine. | **Landed** |
| [`graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md) | WS5 coordination amendments add MVP-arc cross-reference; Inc.2 acceptance criteria explicitly include misconception-graph replatform as gate for slice 3b. | Pending — lands when graph-stack promotes (next session on that plan's thread) |
| [`graph-portfolio-index.md`](graph-portfolio-index.md) | Add `## Vertical-slice arc` section pointing to this plan; add row to relevant goal tables. | **Landed** |
| [`high-level-plan.md`](high-level-plan.md) | Cross-link MVP arc from Cross-cutting Threads section. | **Landed** |
| `ADR-157` | Amendment per [`§ ADR-157 Amendment`](#adr-157-amendment). | **Landed** |

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Substrate floor (graph-stack Inc.1+2+3) takes longer than expected; slice 1 ships later than "soon" feels | Medium | The MVP framing accepts honest substrate cost; "soon" means earliest substrate-allows, not artificial deadline. Visible progress through gate-0 substrate increments. |
| EEF tool rename breaks downstream consumers | Low | Tool surface is not yet shipped under any name (eef-evidence-corpus is in `current/`, not `active/`); rename costs zero. Document in ADR-123. |
| Slice 3a's legacy-factory tech debt grows during Inc.2/3 wait | Medium | The substrate-migration follow-up plan is named up-front; ADR-123 records the legacy path explicitly so the contract for migration is visible. |
| Cross-corpus join primitive (graph-stack Inc.3) lands in a shape that complicates `oak-misconceptions-eef-*` semantics | Medium | Slice 3b waits for Inc.3 by design; spine doesn't lock the join API early. |
| ADR-157 amendment to require explicit-source-attribution is contested by reviewers | Low | Discipline applies to NEW tools only; unprefixed default for already-shipped API-derived tools is preserved. Backwards-compatible. |
| Specialist reviewer load (mcp-reviewer × 4 slices, elasticsearch-reviewer × cross-corpus, test-reviewer × everything) becomes serial bottleneck | Medium | Slices are sequential by design (gate gates); reviewer dispatch happens at each gate, not all at once. Parallel-safe slices (2 + 3a) can dispatch independent reviewer sessions. |

## Foundation Alignment

This spine commits to:

1. **[`principles.md`](../directives/principles.md)** — TDD as design,
   schema-first, fail loud, no manual API data (ADR-029), namespace
   discipline (ADR-157), cardinal rules.
2. **[`testing-strategy.md`](../directives/testing-strategy.md)** —
   atomic test+product-code landing per cycle, no skipped tests, no
   audit-shaped tests. Each underlying plan inherits this commitment;
   the spine adds nothing.
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
  && pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

Plus per-slice gates:

- **gate-1**: `pnpm test` exercises eef-evidence-corpus E2E shape
  conditions (t19); freshness CI gate active (t13); Sentry telemetry
  visible (t14).
- **gate-2**: E2E test verifies all `curric:Thread` enumeration and
  inverse-edge resolution returns expected unit lists.
- **gate-3a**: E2E test verifies sub-graph extraction stays within
  context budget across N=20 representative queries.
- **gate-3b**: E2E test verifies non-empty cross-corpus payload across
  curated thread/unit contexts.

## Specialist Reviewers

| Reviewer | Triggered at |
|---|---|
| `mcp-reviewer` | Every slice (gates 1, 2, 3a, 3b) — every slice ships MCP primitives |
| `test-reviewer` | Every gate, post-implementation |
| `elasticsearch-reviewer` | gate-3b if cross-corpus composition routes through Elasticsearch projections |
| `clerk-reviewer` | Any gate that touches auth on MCP surfaces (none expected, but if discovered) |
| `assumptions-reviewer` | Plan promotion (current → active); validates blocking relationships |
| `architecture-reviewer-betty` | gate-3b — cross-corpus is the architectural validation moment |
| `code-reviewer` | Every gate, standard discipline |

## Lifecycle Triggers

Reference
[`lifecycle-triggers.md`](templates/components/lifecycle-triggers.md):

- **Session entry**: read this plan + `napkin.md` + `distilled.md` +
  `graph-portfolio-index.md`.
- **Simple-plan declaration**: not applicable — this is a coordination
  spine spanning multiple existing plans.
- **Collaboration claim registration**: required when promoting any of
  the underlying plans (eef-evidence-corpus, graph-stack, etc.) from
  `current/` to `active/`.
- **Mid-arc checkpoints**: at gate-1, gate-2, gate-3a, gate-3b — run
  `/jc-consolidate-docs` graduation scan; surface any pattern candidates.
- **Handoff closure**: every session ends with `next-session.md` updated
  for the relevant thread (`connecting-oak-resources` or
  `sector-engagement/eef`).
- **Consolidation touch points**: after each gate; full pass after
  gate-3b.

## Learning Loop

After **every** gate ships:

1. Run `/jc-consolidate-docs` graduation scan.
2. Mine settled outcomes into permanent docs (ADRs, directives,
   READMEs, reference docs).
3. Update `napkin.md` with patterns learned at the gate.
4. Update `graph-portfolio-index.md` to reflect the slice's status.

After **gate-3b** ships:

1. Full `/jc-consolidate-docs` pass.
2. Mine MVP-arc outcomes into permanent docs:
   - Update ADR-157 if discipline addendum proved sufficient or
     needs revision.
   - Add ADR if cross-corpus composition shape stabilised.
   - Update graph-portfolio-index.md to mark goals 1/2/3 progressed.
3. Archive this plan to `archive/completed/` per ADR-117.
4. Update `completed-plans.md`.

## Non-Goals (YAGNI)

Spine-level non-goals — spine does **not**:

- Write any product code itself. Underlying plans do.
- Replace any existing plan. It sequences and amends; plans stay where
  they are.
- Specify TDD cycles for the underlying plans. Each plan owns its
  cycles.
- Lock graph-stack increment scope. graph-stack owns its increments;
  the spine names dependencies on increments by reference.
- Pre-decide cross-corpus tool internal API shape. That's a slice 3b
  design decision after slice 3a + Inc.3 land.
- Pre-decide cut-scope follow-up plan internals. Each follow-up is
  named here; its strategic content lives in its own plan when
  promoted to `current/`.

## Owner Decisions Log

| Date | Decision | Captured in |
|---|---|---|
| 2026-05-07 | MVP arc shape: spine-only (existing plans stand; spine sequences) | `slice-1-shape: spine-full` |
| 2026-05-07 | Slice 2 shape: Threads-first surface | `slice2-shape: B-threads` |
| 2026-05-07 | Slice 3 shape: misconception graph + cross-corpus with EEF; sub-graph query is the blocking problem | Three-slice user message 2026-05-07 |
| 2026-05-07 | Namespacing: `oak-misconceptions-*` for misconception tools; compound prefixes for cross-corpus | `ns-mcg: oak-misconceptions` |
| 2026-05-07 | Slice 3 substrate path: Hybrid (3a fast on legacy, 3b on substrate) | Owner skipped question; spine commits to Hybrid based on stated principles |
| 2026-05-07 | MVP discipline: ship soon + full quality + explicit follow-ups | Owner direct quote, recorded in `§ MVP Discipline` |
| 2026-05-07 | **Doctrine** — never use "deferred" as bare status; sequence (gate-relative or tripwire) or admit not-doing. Applied per-plan, not as out-of-arc tracking. | Owner correction, applied to `§ MVP Discipline`; spine should NOT carry framing for plans outside the MVP arc |
| 2026-05-07 | **Boundary correction** — the MVP-arc spine tracks only what's IN the MVP. Plans outside the MVP (NC SKOS taxonomy, etc.) carry their own promotion triggers in their own home, not as spine cuts. | Owner correction, applied by removing `§ Out-of-MVP-Arc Items` section, `amend-nc-surface-plan` todo, and `out-of-arc-items-resolved-slice-N` todos |
| 2026-05-07 | **Boundary correction drift remediated** — three residual `mvp_arc_status: deferred` references removed from the spine (slice-2 cut-scope row; narrative paragraph; risks row). | Phase 0 of single-session planning closure (Breezy Navigating Sail, commit `d740baa0`) |
| 2026-05-07 | **MVP-arc surface review** — Phase 1 dispatch of `code-reviewer` + `assumptions-reviewer` over the five MVP-arc artefacts; `architecture-reviewer-betty` over ADR-168 + `graph-stack.plan.md` topology in parallel. All readonly. Reduced reviewer set per owner direction (vs the four-reviewer commitment in the prior thread next-session record); rationale = single-session planning closure. | Phase 1 of single-session planning closure |
| 2026-05-07 | **Slice 1 substrate floor corrected (assumption-reviewer BLOCKER #1)** — the spine over-asserted slice 1's substrate floor as `Inc.1 + Inc.2 + Inc.3 + graph-query-layer`; the EEF plan itself only depends on the graph-query-layer foundation (KG-independent thin in-process layer over typed JSON). Spine slice 1 substrate floor now matches the consumer plan; migration onto graph-corpus-sdk is named as a follow-up, not a slice-1 gate. Aligns with the owner-decided `spine-full` shape (existing plan ships in full). | Phase 2 remediation; spine `§ Slice 1` + `gate-0-substrate-floor` todo |
| 2026-05-07 | **gate-3b dependency corrected (assumption-reviewer FINDING #4)** — spine previously listed slice 3b as blocked by `gate-2 + gate-3a + Inc.3`. Slice 3b composes EEF (slice 1) and misconceptions (slice 3a); the Oak Threads MCP surface is not part of the cross-corpus payload. Strict-gates list and `gate-3b-cross-corpus-ships.depends_on` corrected to `gate-1 + gate-3a + Inc.3`. The gate diagram already showed the correct shape; only the wording was wrong. | Phase 2 remediation; spine `§ Slice 3b` + strict-gates list + frontmatter |
| 2026-05-07 | **gate-3a dependency reason corrected (assumption-reviewer FINDING #3)** — the cited reason "mcg sub-graph needs slice 1's namespace amendment + ADR-157 in place" was moot after Phase 0 closed those amendments. The strict gate is preserved (owner sequencing — slice 1 first establishes the MVP-arc spine pattern + namespace discipline) but the reason is updated to reflect what the gate actually carries. Minimum-change interpretation; if owner intends to remove the gate entirely, single-line edit in next session. | Phase 2 remediation; spine `§ Sequencing and Gates` strict-gates list |
| 2026-05-07 | **Slice 2 cut-scope table cleaned (assumption-reviewer FINDING #2)** — NC SKOS taxonomy MCP surface row deleted from the slice-2 cut-scope table. The NC plan was never IN slice 2 to be cut from; including it as cut-scope contradicted the boundary correction. | Phase 2 remediation; spine `§ Slice 2 / Cut scope and follow-ups` |
| 2026-05-07 | **Topology findings deferred to next session per owner scope direction** — `architecture-reviewer-betty` surfaced a BLOCKER (`graph-stack.plan.md` WS4 sequences `ws4-skos-extractor` before `ws4-graph-corpus-sdk-scaffold`, forcing Oak-specific extraction logic into substrate workspaces) and a FINDING (`practice-graph` placed in `packages/libs/` instead of `sdks/` or `apps/` mixes a domain consumer with public infrastructure) on the topology surface. Both must land before `graph-stack.plan.md` ACTIVE promotion / ADR-168 ratification (next session). Captured in next-session thread record so execution-prep absorbs them as blockers, not surprises. | Phase 2 capture; topology surface itself out of scope this session per owner direction |
| 2026-05-07 | **EEF plan internal contradiction surfaced (code-reviewer + assumptions-reviewer concurring FINDING)** — `eef-evidence-corpus.plan.md` t19 declares LLM/outcome verification out-of-scope until evaluation infrastructure exists, while §`Promotion Trigger from CURRENT to ACTIVE` and the closing acceptance lines treat outcome conditions as load-bearing. Slice 1 IS the EEF plan; the contradiction is internal to slice-1 execution. Not amended this session — owner-decided whether to harmonise here or in slice-1 execution prep. Captured for next session. | Phase 2 capture; EEF plan body untouched this session |
