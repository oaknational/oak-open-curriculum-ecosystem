---
name: "Graph Query Layer (Foundation for Graphs and Evidence Corpora)"
overview: "A polymorphic 7-operation query layer over Oak's typed graphs (prerequisite, misconception, EEF strands), with progressive disclosure (manifest → summary → detail → edge) and mandatory projection so responses fit working context. Foundation for the EEF evidence corpus and cross-source journeys."
graph_layer: substrate
graph_portfolio_index: "../../../graph-portfolio-index.md"
parent_plan: "../active/open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "../active/graph-resource-factory.plan.md"
  - "../active/misconception-graph-mcp-surface.plan.md"
  - "../../sector-engagement/eef/current/eef-evidence-corpus.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, type-reviewer, test-reviewer, architecture-reviewer-betty"
status: current
isProject: false
todos:
  - id: t1-tracer-use-cases
    content: "Document 1 tracer use case per operation per graph (3×7 = 21 tracers minimum). Operations without ≥2-of-3 tracer support do not ship."
    status: pending
  - id: t2-graph-view-interface
    content: "Design GraphView<TNode, TEdge> interface in oak-curriculum-sdk: 7 operations + projection type."
    status: pending
  - id: t3-prereq-adapter
    content: "Implement PrerequisiteGraphView adapter over the existing prerequisite graph data."
    status: pending
  - id: t4-misconception-adapter
    content: "Implement MisconceptionGraphView adapter over the existing misconception graph data."
    status: pending
  - id: t5-eef-strands-adapter
    content: "Implement EefStrandsGraphView adapter over the EEF strands collection (used by the corpus extension downstream)."
    status: pending
  - id: t6-mcp-tools
    content: "Expose 7 MCP tools (one per operation), each domain-specific by graph; share internal SDK implementation. NOT a single polymorphic dispatcher tool."
    status: pending
  - id: t7-progressive-disclosure-tests
    content: "Tests proving response size remains bounded under projection; tests proving manifest+summary+detail tiers compose correctly. Includes T7a: a DeepKeyPath compile-time smoke-test asserting the array-stop constraint (no element-index recursion) and depth-3 path inference on EefStrand."
    status: pending
  - id: t8-telemetry-seams
    content: "Sentry spans + named metrics for every operation; ratio-of-focused-to-full-dump dashboard query documented."
    status: pending
  - id: t9-adr-update
    content: "ADR-123 update: 7 new tools, 3 graph adapters; clarify factory-vs-query-layer relationship."
    status: pending
  - id: t10-e2e
    content: "E2E assertions: each operation works against each adapter; projection bounds response size; manifest is small."
    status: pending
---

# Graph Query Layer

**Status**: CURRENT — queued; depends on owner approval of the architecture
session conclusions (2026-04-30, Iridescent Soaring Planet).
**Last Updated**: 2026-04-30
**Branch**: `feat/eef_exploration` (originating session); execution branch
TBD when promoted to ACTIVE.
**Increment**: 1 of 5 in the EEF graph-and-corpus delivery sequence.

## Summary

Today the repository exposes typed graphs as **JSON-dump tools with empty
input schemas**. An agent that wants 5 nodes from a 12,858-node misconception
graph still pays the cost of the entire graph in its working context. The
graph-resource-factory standardised the *plumbing* of resource exposure but
not the *operations* of graph interaction.

This plan adds a thin polymorphic query layer with **progressive
disclosure** as a structural property and **mandatory projection** so the
response shapes to the agent's actual need.

## User-Value Sense-Check (apply where the value is non-obvious)

```text
**User value**: [Specific user] can [do what they couldn't before]
              resulting in [observable teacher/learner outcome].
**Provability**: [How will we know it works? "Not yet provable, will be
              when X" is acceptable; hand-waving is not.]
**Architecture validation**: [What assumption does this confirm or break?]
```

A sense-check, not a ceremony — applied where it forces useful
thought, omitted where the value is inherited from a parent
capability. The same template is embedded in
[`../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../sector-engagement/eef/current/eef-evidence-corpus.plan.md)
and [`../future/cross-source-journeys.plan.md`](../future/cross-source-journeys.plan.md).

## Why This Plan Exists

### The real constraint is context size, not capability

The current pattern works at one scale (small graphs, isolated questions)
and breaks at another (large graphs combined with other context). Even
the "small" EEF graph (90 KB JSON) plus a misconception dump plus a
thread-progressions dump exhausts comfortable context windows for many
LLM clients. The agent then either drops content silently or pays
increased latency and cost per turn.

The graph layer's primary job is **focused responses that fit working
context**, not "operations the agent couldn't perform." The agent
already could perform most operations by reading the full dump and
reasoning in-LLM. The cost is the limit, not the capability.

### Three graphs in parallel as protection against single-use-case overfit

Building this layer for EEF alone would risk modelling a recommendation
engine and calling it a graph. Building it across **prerequisite +
misconception + EEF strands simultaneously** forces the abstraction to
stay graph-shaped. If any operation has only one of three graphs needing
it, that operation does not ship until a second consumer arrives.

### Composition with the evidence corpus extension downstream

The corpus extension (Increment 2, lives in
[`../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../sector-engagement/eef/current/eef-evidence-corpus.plan.md))
adds `rank | explain | compare` operations on top of the graph layer.
The boundary between graph operations and corpus operations is
load-bearing for the architecture — the graph layer must not know about
ranking, and the corpus layer must not duplicate graph mechanics.

## The Seven Operations (with Progressive Disclosure)

The disclosure tiers:

| Tier | Operation | Returns | Typical size | When to call |
|---|---|---|---|---|
| 1 | `manifest(graph)` | `{ node_count, edge_types, version, schema_hash }` | ~100-300 tokens | Session/turn start: "is this graph what I think it is?" |
| 1 | `summary(graph, group_by?)` | aggregations, distributions, top-N most-connected | ~500-2000 tokens | Orientation: "what does this graph contain?" |
| 2 | `get_node(graph, id, projection?)` | one node, full or projected | ~200-1000 tokens | Focused fetch: "the strand I just identified" |
| 2 | `enumerate_nodes(graph, filter?, projection?, page?)` | node list, projected, paginated | bounded by projection + page | "Strands matching {phase: primary, focus: reading}" |
| 2 | `neighbours(graph, node_id, edge_type?, projection?)` | 1-hop neighbours, projected | bounded by projection | "What's adjacent to this node?" |
| 3 | `subgraph(graph, root_ids, depth, projection?)` | bounded radius, projected | bounded by depth + projection | "Local cluster around this node, depth 2" |
| 3 | `find_by_tag(graph, tag, projection?)` | tag-matching nodes, projected | bounded by projection | "Strands tagged 'metacognition'" |

**Mandatory projection**: every operation that returns nodes accepts a
`projection` parameter — an array of field paths. The default projection
is *minimal* (id + display name + at most one numeric metric). Full
detail is opt-in. This inverts the current default ("send everything")
to ("send what was asked for").

**Pagination**: `enumerate_nodes` supports `{ page: number, page_size: number }`
with a server-side cap (e.g. 50). Other operations are size-bounded by
projection + depth, not pagination.

**No router tool**: do *not* implement these as a single polymorphic
`query-graph(graph, operation, params)` MCP tool. LLMs discover specific
verbs better than generic dispatchers. Implement seven specific tools
that share an internal SDK implementation:

```text
graph-manifest-prerequisite      graph-summary-prerequisite
graph-manifest-misconception     graph-summary-misconception
graph-manifest-eef-strands       graph-summary-eef-strands
get-prerequisite-node            ... etc
```

7 operations × 3 graphs = 21 MCP tools. This is fine — they share code
and the agent surface is direct.

## User Value (template applied)

**Increment 1 user value (overall)**:

- **User value**: An AI client serving teachers can ask focused questions
  ("what comes after fractions in KS3?") and receive ≤500-token
  responses instead of full-graph dumps, freeing context for downstream
  reasoning and reducing per-turn latency.
- **Provability**: Sentry-derived ratio of focused-query calls to
  full-dump calls; target ≥50% by 4 weeks after release. Per-call response
  size distribution; target p95 ≤2000 tokens for non-`subgraph` operations.
- **Architecture validation**: confirms (or breaks) the polymorphic
  `GraphView<TNode, TEdge>` abstraction. Special-casing for any of the
  three graphs invalidates the abstraction and triggers redesign.

## Implementation

### Phase 1: Tracer use cases first (T1)

**T1: Tracer use cases** — for each of 7 operations × 3 graphs (21
tracers), name the concrete teacher question and the expected response
shape. Operations without ≥2-of-3 tracers are dropped from this
increment, not added speculatively.

Per-operation user-value lines:

#### `manifest`

- **User value**: An agent at session-start can probe a graph's identity
  (version, node count, edge types) in <300 tokens before deciding
  whether to load anything heavier.
- **Provability**: count of `manifest` calls preceding heavier
  operations; target manifest-first ratio ≥30% within 4 weeks.
- **Architecture validation**: confirms version-and-shape signalling
  belongs at the graph boundary, not in every consumer.

#### `summary`

- **User value**: A teacher's "what kinds of misconceptions exist in KS3
  maths?" gets a typed digest (counts by topic, top-N most-connected
  misconceptions) instead of the full graph.
- **Provability**: summary-call-to-detail-call funnel rate; target
  summary→detail ≥40% (i.e. summary actually narrows the next call).
- **Architecture validation**: confirms aggregation operations belong
  in the graph layer, not in the corpus extension. Pure graph
  aggregations (counts, distributions) must not require corpus knowledge.

#### `get_node`

- **User value**: An agent that has identified a strand by ID can fetch
  its full record without dumping the whole strands collection.
- **Provability**: post-`get_node` next-action analysis; target ≥70% of
  `get_node` calls precede a downstream user-facing answer (i.e. it's
  on a value path, not a debugging path).
- **Architecture validation**: confirms node IDs are stable, durable,
  and citation-grade across the three graphs.

#### `enumerate_nodes(filter, projection, page)`

- **User value**: A teacher's "show me secondary-phase strands focused
  on reading" gets the projected list without the strands they didn't
  ask about.
- **Provability**: response-size distribution under projection vs
  without; target p95 ≤2000 tokens with default projection.
- **Architecture validation**: confirms the filter + projection +
  pagination design supports the dominant access pattern across all
  three graphs.

#### `neighbours(node, edge_type)`

- **User value**: A teacher exploring "what comes immediately after
  Year 5 fractions?" gets the 1-hop forward prerequisite edges, not
  the entire chain.
- **Provability**: ratio of `neighbours`-then-`subgraph` (deepening)
  vs `neighbours`-then-stop; both are valid; we want the data to know
  which dominates.
- **Architecture validation**: confirms typed edges are first-class
  across all three graphs — not just one.

#### `subgraph(roots, depth)`

- **User value**: An agent assembling a 3-lesson sequence can request
  a 2-deep subgraph rooted at a starting concept and get the local
  neighbourhood without traversal complexity at the agent layer.
- **Provability**: subgraph-call frequency on prerequisite graph
  specifically; target ≥10 calls/day post-launch (this is the
  operation that buys most for prereq).
- **Architecture validation**: confirms depth-bounded traversal is
  cheap to compute server-side. If it isn't, surface in design.

#### `find_by_tag(tag)`

- **User value**: A teacher asking "what evidence-backed approaches
  involve metacognition?" reaches the EEF strands tagged
  `metacognition` directly, without enumerating all 30 strands.
- **Provability**: tag-search hit rate on EEF; target ≥1
  `find_by_tag` call per recommendation flow.
- **Architecture validation**: confirms tag indexing is worthwhile at
  graph-layer level rather than per-graph custom code.

#### T1 Tracer Matrix (7 operations × 3 graphs, verified against real data)

Each tracer entry below was drafted with the actual generator-source or
data-file open. The shape:

```text
**{operation} × {graph}**
- Teacher question: [concrete]
- Expected response shape: [against real data]
- Token budget: ≤ N tokens at default projection
- Drops to graph mechanics? [yes/no — boundary check vs corpus layer]
- Verified against: [file + node id or field path]
```

Two cells are explicitly **NO TRACER** under the ≥2-of-3 rule (see
Phase B findings below the matrix). Operations with NO TRACER cells
ship for the supported graphs and are explicitly carved out for the
unsupported ones; they are not silently dropped.

##### `manifest`

**manifest × prerequisite**

- Teacher question: "What's the version and scale of the prior-knowledge graph my AI tutor is using right now?"
- Expected response shape: `{ node_count, edge_types: ['prerequisiteFor'], edge_count: stats.totalEdges, version, generatedAt, sourceVersion, schema_hash }`
- Token budget: ≤300 tokens (small fixed-shape header)
- Drops to graph mechanics? yes — pure metadata read from `PriorKnowledgeGraph` root
- Verified against: `packages/sdks/oak-sdk-codegen/src/bulk/generators/prior-knowledge-graph-generator.ts` § `PriorKnowledgeGraph` + `PriorKnowledgeGraphStats { unitsWithPrerequisites, totalEdges, subjectsCovered }`

**manifest × misconception**

- Teacher question: "Is the misconception graph fresh and complete enough for a year-end review?"
- Expected response shape: `{ node_count: stats.totalMisconceptions, edge_types: [], edge_count: 0, version, generatedAt, sourceVersion, schema_hash }`
- Token budget: ≤300 tokens
- Drops to graph mechanics? yes — pure metadata; honest about `edge_types: []`
- Verified against: `misconception-graph-generator.ts` § `MisconceptionGraph` + `MisconceptionGraphStats { totalMisconceptions, bySubject, byKeyStage, subjectsCovered }`. The current generator emits no edges; manifest reports this honestly.

**manifest × eef-strands**

- Teacher question: "Which version of the EEF Toolkit am I querying, when was it last refreshed, and which strands have no relations to traverse?"
- Expected response shape: `{ node_count: 30, edge_types: ['related_strand', 'related_guidance_report'], edge_count, version: meta.data_version, last_updated: meta.last_updated, schema_hash, strands_without_relations: readonly string[] }`. The `strands_without_relations` field is the list of strand IDs whose `related_strands` field is absent (per Phase B finding 5 and T5 sparse-relations surface) — front-loaded so agents avoid pointless `subgraph`/`neighbours` calls.
- Token budget: ≤500 tokens (slightly larger than other manifests because of the 13-string list)
- Drops to graph mechanics? yes — manifest reads `meta` block plus precomputed sparse-relations list
- Verified against: `.agent/plans/sector-engagement/eef/reference/eef-toolkit.json` § `meta.data_version='0.2.0'`, `meta.last_updated='2026-04-02'`, `strands.length === 30`. Empirical check (`python3 -c "..."` against the reference data): 13 of 30 strands have `related_strands` absent (named in Phase B finding 5); the manifest list mirrors that count exactly.

##### `summary`

**summary × prerequisite**

- Teacher question: "Which subjects and key stages have the densest prerequisite chains?"
- Expected response shape: `{ totals: {nodes, edges}, bySubject: Record<subject, count>, byKeyStage: Record<keyStage, count>, topConnected: readonly [{unitSlug, inDegree, outDegree}, ...] }`
- Token budget: ≤2000 tokens default; ≤500 tokens with `groupBy: 'subject'`
- Drops to graph mechanics? yes — aggregation only, no scoring
- Verified against: `PriorKnowledgeGraphStats { unitsWithPrerequisites, totalEdges, subjectsCovered }`. Note: `topConnected` is computed SDK-side from `edges[]` (not pre-aggregated in stats today); the adapter does the in/out degree count.

**summary × misconception**

- Teacher question: "What kinds of misconceptions exist in KS3 maths?"
- Expected response shape: `{ totals: {nodes}, bySubject, byKeyStage, topByLesson }` reading precomputed `stats.bySubject` and `stats.byKeyStage`
- Token budget: ≤1500 tokens default
- Drops to graph mechanics? yes — pure aggregation, reads precomputed `stats`
- Verified against: `misconception-graph-generator.ts § calculateStats` (`bySubject` + `byKeyStage` already present on stats)

**summary × eef-strands**

- Teacher question: "What's the distribution of impact and cost across the EEF strands at a glance?"
- Expected response shape: `{ totals: {strands: 30}, byImpactBand, byCostBand, byEvidenceStrength, topImpact: readonly [...top-5] }`
- Token budget: ≤1500 tokens
- Drops to graph mechanics? yes — structural histogram. **NOT** ranking or recommendation; ranking carries user-context (school_context_relevance) and lives at corpus layer.
- Verified against: eef-toolkit.json § `strands[].headline.{impact_months, cost_rating, evidence_strength_rating}` — derivable for all 30 strands; `null` impact handled per F5.

##### `get_node`

**get_node × prerequisite**

- Teacher question: "What does Year-5 Fractions actually require students to know coming in?"
- Expected response shape: `PriorKnowledgeNode` with default projection `['unitSlug', 'unitTitle']`; full includes `priorKnowledge[]`, `threadSlugs[]`.
- Token budget: ≤300 tokens default; ≤1000 tokens full
- Drops to graph mechanics? yes — single-node fetch by stable id (`unitSlug`)
- Verified against: `PriorKnowledgeNode` interface (unitSlug as primary key)

**get_node × misconception**

- Teacher question: "Show me the full record for the 'students think 0.5 < 0.45 because more digits' misconception."
- Expected response shape: `MisconceptionNode` with default projection `['lessonSlug', 'subject', 'keyStage']`; full adds `misconception` and `response` text.
- Token budget: ≤500 tokens default; ≤1500 tokens full
- Drops to graph mechanics? yes — single-record fetch
- Verified against: `misconception-graph-generator.ts § MisconceptionNode`. **Adapter design point surfaced**: `MisconceptionNode` has no explicit ID field; the adapter must mint stable IDs. **Recommended scheme**: SHA-1 of `${lessonSlug}::${misconception}` truncated to 12 hex characters. The `misconception` field is the full natural-language sentence describing the incorrect belief, which makes the hash regeneration-stable as long as the source text is stable. **Index-based alternatives like `${lessonSlug}#${index}` are NOT viable** because the upstream extractor's ordering is not guaranteed to be deterministic across regenerations; the index would silently shift if the extractor's input order changed. This is a real Increment 1 work item, not deferred — recorded in Phase B findings.

**get_node × eef-strands**

- Teacher question: "Give me the metacognition-and-self-regulation strand."
- Expected response shape: `EefStrand` with default projection `['id', 'name', 'slug', 'headline.impact_months']`; full includes `definition`, `key_findings`, `effectiveness`, `behind_the_average`.
- Token budget: ≤400 tokens default; full projection ~3000 tokens (strands are large)
- Drops to graph mechanics? yes — single-strand fetch by `id`
- Verified against: eef-toolkit.json § `strands[].id` (e.g. `eef-tl-metacognition-and-self-regulation`). **Citation translation point surfaced**: data field is `id`; the Citation contract uses `strand_id`. The corpus-layer loader (Increment 2 § T2) maps `id → strand_id` at the corpus boundary; the graph layer treats `id` as the canonical node ID.

##### `enumerate_nodes`

**enumerate_nodes × prerequisite**

- Teacher question: "List Year-6 mathematics units that have prior-knowledge requirements, paged."
- Expected response shape: `{ items: PriorKnowledgeNode[], page: {number, size, total} }` filtered by `{subject: {equals: 'mathematics'}, keyStage: {equals: 'KS2'}, year: {equals: 6}}`, default projection.
- Token budget: ≤2000 tokens at p95 (page_size 50, default projection)
- Drops to graph mechanics? yes — typed filter + projection + pagination
- Verified against: `PriorKnowledgeNode { subject, keyStage, year }` + `NodeFilter` shape (FieldPredicate equality covers all three)

**enumerate_nodes × misconception**

- Teacher question: "Show me secondary maths misconceptions."
- Expected response shape: `{ items, page }` filtered by `{subject: {equals: 'mathematics'}, keyStage: {equals: 'KS3'}}`, default projection.
- Token budget: ≤2000 tokens at p95
- Drops to graph mechanics? yes
- Verified against: `MisconceptionNode { subject, keyStage }`

**enumerate_nodes × eef-strands**

- Teacher question: "List EEF strands tagged 'primary' with at-least-moderate impact."
- Expected response shape: filtered by `{ tags: { contains: 'primary' }, headline: { impact_months: { gte: 2 } } }`, default projection `['id', 'name', 'headline.impact_months']`.
- Token budget: ≤1500 tokens (30-strand cap)
- Drops to graph mechanics? yes — structural filter; no scoring
- Verified against: eef-toolkit.json § `strands[].tags` (110 unique tags across 30 strands) + `strands[].headline.impact_months`. **NodeFilter extension surfaced**: the current `FieldPredicate` spec (T2) supports `equals`/`oneOf` and string `contains`/`startsWith` and number `gte`/`lte`, but does **not** define array-element-membership for fields whose type is `readonly string[]`. The `tags: { contains: 'primary' }` form requires a new `FieldPredicate` arm: `TFieldValue extends readonly (infer U)[] ? { readonly contains: U } : never`. Recorded as a Phase B finding for T2 update.

##### `neighbours`

**neighbours × prerequisite**

- Teacher question: "What units come immediately after Year-5 Fractions in the prerequisite ordering?"
- Expected response shape: `{ outgoing: readonly [{nodeId, edgeRel: 'prerequisiteFor', source}], incoming: readonly [...] }` with `direction: 'in' | 'out' | 'both'`, projected.
- Token budget: ≤1000 tokens for typical 1-hop fanout
- Drops to graph mechanics? yes — adjacency lookup
- Verified against: `PriorKnowledgeEdge { from, to, rel: 'prerequisiteFor', source }`. Both directions traversable.

**neighbours × misconception**

- **NO TRACER** — reason: `MisconceptionGraph` has no edges. The current generator (`misconception-graph-generator.ts`) emits nodes only (no `edges` field on `MisconceptionGraph`). Adjacency would require either (a) synthesising edges from `lessonSlug` co-occurrence, or (b) extending the generator to emit explicit relations. Both are out of scope for Increment 1.
- ≥2-of-3 rule applied: `neighbours` ships for **prerequisite ✓ + eef-strands ✓ = 2-of-3**. Misconception is **explicitly carved out** in MCP tool registration (no `neighbours-misconception` tool until misconception edges exist in the source data).

**neighbours × eef-strands**

- Teacher question: "Which strands are flagged as related to metacognition-and-self-regulation, and which guidance reports does it link to?"
- Expected response shape: `{ outgoing: readonly [{nodeId, edgeRel: 'related_strand' | 'related_guidance_report', target}], ... }` derived from the `related_strands[]` and `related_guidance_reports[]` arrays on the strand. **Returns an empty result for strands where both fields are absent — see optionality below.**
- Token budget: ≤500 tokens (related arrays are small)
- Drops to graph mechanics? yes — derives edges from typed array fields on each strand
- Verified against: eef-toolkit.json § `strands[].related_strands` — **17 of 30 strands have a non-empty array; 13 have the field absent entirely (no empty arrays in the data)**. Mean 1.2 and max 4 statistics treat absent as zero. `related_guidance_reports` present on **7 of 30 strands**; each entry is a `{title, url}` object, not a bare URL. Adapter behaviour for absent fields: treat as empty array, return empty edge set; this is well-defined, not a fault condition.

##### `subgraph`

**subgraph × prerequisite**

- Teacher question: "Give me the depth-2 prerequisite neighbourhood around Year-5 Fractions for sequence-planning."
- Expected response shape: `{ nodes: readonly [...], edges: readonly [...] }` bounded by `depth: 2` from `rootIds`, projected.
- Token budget: ≤3000 tokens at depth 2 with default projection (bounded growth)
- Drops to graph mechanics? yes — bounded BFS traversal
- Verified against: `PriorKnowledgeGraph { nodes, edges }`. Prerequisite graph is the operation's strongest case; matches Risk #4's targeting of subgraph as "operation that buys most for prereq".

**subgraph × misconception**

- **NO TRACER** — reason: same as `neighbours × misconception`. No edges → no traversable subgraph.
- ≥2-of-3 rule applied: `subgraph` ships for **prerequisite ✓ + eef-strands ✓ = 2-of-3**. Misconception is **explicitly carved out**.

**subgraph × eef-strands**

- Teacher question: "Show me the strand cluster around metacognition: itself, its related strands, and their related strands one hop further."
- Expected response shape: bounded subgraph at `depth: 2` from one strand id; default `edgeType: 'related_strand'` (excludes `related_guidance_report` unless opt-in). **Subgraph rooted at a strand whose `related_strands` field is absent (13 of 30 strands) immediately terminates with `{ nodes: [root], edges: [] }`.**
- Token budget: ≤2000 tokens at depth 2 with default projection (typical fanout for strands with related_strands: mean ≈2.1 — restated below)
- Drops to graph mechanics? yes — bounded traversal over `related_strands[]`
- Verified against: eef-toolkit.json § `strands[].related_strands` — 17 of 30 strands have non-empty `related_strands` (mean among those 17 is ≈2.1, max 4); 13 strands have no relations at all and produce a single-node subgraph at any depth. Behaviour is deterministic for both cases.

##### `find_by_tag`

**find_by_tag × prerequisite**

- **NO TRACER** — reason: `PriorKnowledgeNode` has no `tags` field and the source data has no tag taxonomy. The synthetic-compound `${subject}-${keyStage}` initially drafted here was, in the plan body's own words, "architecturally equivalent to `enumerate_nodes` with a fixed-shape filter" — i.e., a different operation wearing the tag-search surface. Per the *stop inventing optionality* doctrine (assumptions-reviewer round, 2026-04-30): an agent that wants subject+keyStage filtering uses `enumerate_nodes` with `{subject: {equals: ...}, keyStage: {equals: ...}}` — that path already exists, ships, and is honest about what it does. Inventing a synthetic-tag wrapper is the surface-cohesion anti-pattern.
- ≥2-of-3 rule applied: `find_by_tag` ships for **eef-strands ✓ only = 1-of-3** under this revised reading. Below the threshold; the operation does NOT ship for prerequisite or misconception.

**find_by_tag × misconception**

- **NO TRACER** — reason: same as `find_by_tag × prerequisite`. `MisconceptionNode` has no `tags` field; the synthetic compound was an enumerate_nodes-with-filter wearing the tag-search surface. The honest path is `enumerate_nodes`.
- ≥2-of-3 rule applied: see above. `find_by_tag` ships for **eef-strands only**.

**find_by_tag × eef-strands**

- Teacher question: "What evidence-backed approaches involve metacognition?"
- Expected response shape: strands where `'metacognition' ∈ tags`, default projection `['id', 'name', 'headline.impact_months']`.
- Token budget: ≤1500 tokens (30-strand cap)
- Drops to graph mechanics? yes — true tag-membership lookup against curated taxonomy (the only graph with one)
- Verified against: eef-toolkit.json § `strands[].tags` (110 unique tags; `eef-tl-metacognition-and-self-regulation` carries `'metacognition'` among 12 tags).

##### Phase B findings (first-principles check against real data)

The following design points surfaced while verifying tracer shapes
against the actual generator output and data files. They are recorded
here because each is a real Increment 1 work item, not a punt.

1. **MisconceptionNode lacks an explicit ID field.** The current
   generator emits nodes keyed by the `(lessonSlug, misconception)`
   pair. The `MisconceptionGraphView` adapter (T4) must mint a stable
   ID. Recommended scheme: SHA-1 of `${lessonSlug}::${misconception}`
   truncated to 12 hex characters. Index-based alternatives like
   `${lessonSlug}#${index}` are NOT viable because the upstream
   extractor's ordering is not guaranteed to be deterministic across
   regenerations.
2. **Citation contract uses `strand_id`; data field is `id`.** The
   corpus-layer loader (Increment 2 § T2) is the natural place to map
   `data.strands[].id → Citation.strand_id`. The graph layer treats
   `id` as the canonical node ID; the rename happens at the
   evidence-corpus boundary, not inside the graph adapter. Recorded
   so Increment 2 implementation does not silently drift the field
   name.
3. **`NodeFilter.FieldPredicate` does not yet cover array-element
   membership.** The EEF tracers require `{ tags: { contains: 'primary' } }`
   over a `readonly string[]` field. The current T2 spec covers
   string and number predicates but stops at the array boundary. The
   T2 update (applied alongside T1 sign-off) adds an array-arm:
   `TFieldValue extends readonly (infer U)[] ? { readonly contains: U } : never`.
   Note: this arm shares the structural shape `{ contains }` with
   the string-arm; semantic disambiguation lives in the predicate
   dispatcher, not in the type system. See the "Semantic collision
   note" alongside the FieldPredicate spec in Phase 2 § T2.
4. **MisconceptionGraph has no edges.** Confirmed by reading the
   generator. Two operations (`neighbours`, `subgraph`) are
   explicitly carved out for misconception; the remaining five ship
   for all three graphs. The carve-out is the structural enforcement
   of the ≥2-of-3 rule and is named in the MCP tool registration.
5. **`related_strands` is absent on 13 of 30 EEF strands.** The field
   is missing entirely (not empty array) on `eef-tl-aspiration-interventions`,
   `eef-tl-extending-school-time`, `eef-tl-homework`, `eef-tl-individualised-instruction`,
   `eef-tl-learning-styles`, `eef-tl-mentoring`, `eef-tl-outdoor-adventure-learning`,
   `eef-tl-parental-engagement`, `eef-tl-performance-pay`,
   `eef-tl-physical-activity`, `eef-tl-reducing-class-size`,
   `eef-tl-repeating-a-year`, `eef-tl-school-uniform`. The T5
   adapter treats absent as empty and the `neighbours`/`subgraph`
   operations return well-defined empty/single-node results for
   these strands. The Zod loader at the corpus boundary
   (Increment 2 § T2) must accept `related_strands` as optional with
   a default of `[]` — it must NOT fail validation on the 13 strands
   without the field.
6. **`related_guidance_reports` data structure is `{title, url}` objects,
   not bare URL strings.** Field is present on only 7 of 30 strands;
   each entry is an object. The T5 adapter extracts `url` as the
   edge target ID and preserves `title` in the edge metadata for
   citation display. The Zod loader must validate as
   `z.array(z.object({title: z.string(), url: z.string().url()})).optional()`
   — not `z.array(z.string()).optional()`.

##### T1 Tracer Matrix Summary

- 21 cells = 7 operations × 3 graphs.
- 17 tracer entries drafted with verification footnotes.
- **4 NO TRACER cells** (`neighbours × misconception`, `subgraph × misconception`, `find_by_tag × prerequisite`, `find_by_tag × misconception`).
- **17 MCP tools** register at runtime (not 21).
  Carve-outs: `neighbours-misconception` (no edges), `subgraph-misconception` (no edges), `find-by-tag-prerequisite` (no tag taxonomy in source data), `find-by-tag-misconception` (no tag taxonomy in source data).
  Per-graph: prerequisite 6 + misconception 4 + eef-strands 7 = 17.
- 6 Phase B findings (above) feed forward into T2, T4, T5, and Increment 2 § T2 (loader must validate the optionality of `related_strands` and the object shape of `related_guidance_reports`).
- The four carve-outs are the structural enforcement of the
  ≥2-of-3 rule. Two were caught by the round-1 first-principles
  check (`MisconceptionGraph` has no edges); two were caught by the
  round-2 assumptions-reviewer check (no tag taxonomy in
  prerequisite or misconception source data; the synthetic-compound
  proxy was the *invented optionality* anti-pattern). Both rounds
  found gaps the prior round had missed. Doctrine candidate
  surfaced: first-principles checks must enumerate optionality
  empirically, not sample.

### Phase 2: SDK shape (T2)

**T2: GraphView interface** — `oak-curriculum-sdk/src/mcp/graph-views/`

```typescript
import type { Result } from '@oaknational/result';

export interface GraphView<TNode, TEdgeType extends string> {
  manifest(): GraphManifest;
  summary(
    opts?: { groupBy?: keyof TNode | TEdgeType },
  ): Result<GraphSummary, GraphSummaryError>;
  getNode(
    id: string,
    projection?: NodeProjection<TNode>,
  ): Result<TNode, NodeNotFoundError>;
  enumerateNodes(opts?: {
    filter?: NodeFilter<TNode>;
    projection?: NodeProjection<TNode>;
    page?: { number: number; size: number };
  }): Result<EnumerateNodesResult<TNode>, EnumerateNodesError>;
  neighbours(opts: {
    nodeId: string;
    edgeType?: TEdgeType;
    direction?: 'in' | 'out' | 'both';
    projection?: NodeProjection<TNode>;
  }): Result<NeighbourResult<TNode>, NodeNotFoundError>;
  subgraph(opts: {
    rootIds: readonly string[];
    depth: number;
    projection?: NodeProjection<TNode>;
  }): Result<SubgraphResult<TNode>, SubgraphError>;
  findByTag(tag: string, projection?: NodeProjection<TNode>): readonly TNode[];
}
```

`Result<T, E>` is the canonical error-handling shape from
[`@oaknational/result`](../../../../packages/core/result/src/index.ts) per
`principles.md` §Code Design ("Don't throw, use the result pattern
`Result<T, E>`, handle all cases explicitly"). `manifest()` and
`findByTag()` return plain values: manifest is metadata that always
exists; an empty tag-match list is a valid result, not a failure.

**`NodeFilter<TNode>` shape** — preventing implementor drift toward
`Partial<TNode>` (introduces unwanted optionality) or
`Record<string, unknown>` (type destruction):

```typescript
type FieldPredicate<TFieldValue> =
  | { readonly equals: TFieldValue }
  | { readonly oneOf: readonly TFieldValue[] }
  | (TFieldValue extends string
      ? { readonly contains: string } | { readonly startsWith: string }
      : never)
  | (TFieldValue extends number
      ? { readonly gte: number } | { readonly lte: number }
      : never)
  | (TFieldValue extends readonly (infer U)[]
      ? { readonly contains: U }
      : never);

type NodeFilter<TNode> = {
  readonly [K in keyof TNode]?: FieldPredicate<TNode[K]>;
};
```

The array-element `contains` arm is required by `enumerate_nodes ×
eef-strands` (the `tags: { contains: 'primary' }` tracer). Without it
the EEF tracer is forced to use `enumerate_nodes` and post-filter
client-side, which contradicts the "filter at the graph layer" boundary
that summary/find_by_tag rely on. Phase B verification surfaced this as
a real gap; the arm is part of T2's signed-off shape.

**Semantic collision note** — when `TFieldValue` is `string`, the
string-arm produces `{ readonly contains: string }` meaning "substring
match"; when `TFieldValue` is `readonly string[]`, the array-arm
produces the same structural type `{ readonly contains: string }`
meaning "element membership". The two arms do not fire simultaneously
for any single `TFieldValue` (a value cannot be both `string` and
`readonly string[]`), so there is no type-system ambiguity at any
specific call site. However, the structural type is identical across
the two semantics, which means a generic `FieldPredicate`-handling
function cannot dispatch on predicate shape alone — it must also
inspect the field's runtime value (array? then membership; string?
then substring). Implementors of the adapter must encode this
decision once, in the predicate dispatcher, and document it. If a
future node type carries a field whose type is itself
`string | readonly string[]`, a distinct predicate key
(e.g. `includesElement`) will be required to disambiguate; until
that need arises, the structural identity is acceptable.

The implementation may extend this with combinator predicates (`and`,
`or`, `not`) when a tracer use case demands it. Default is field-level
predicates only; combinators ship when ≥2 of 3 tracer adapters need
them.

`NodeProjection<TNode>` is a recursive deep-path type bounded to a
declared maximum depth (default 4 levels — covers `headline.impact_months`,
`headline.cost_rating`, `school_context_relevance.implementation_requirements.cpd_intensity`,
and similar paths up to depth 3 plus one level of headroom). The
deepest real path on `EefStrand` is depth 3
(`school_context_relevance.implementation_requirements.cpd_intensity`),
so depth 4 sits one level beyond the deepest real path without producing
empty path unions. The shape is:

```typescript
type NodeProjection<TNode, Depth extends number = 4> =
  ReadonlyArray<DeepKeyPath<TNode, Depth>>;

// DeepKeyPath produces literal-string path unions:
//   'id' | 'name' | 'headline.impact_months' | 'headline.cost_rating' | ...
```

**Implementation constraint — `DeepKeyPath` MUST stop at array
boundaries.** Arrays are projection leaves: the path
`'effectiveness.mechanisms'` selects the array as a whole; element-index
paths like `'effectiveness.mechanisms.0'` or
`'effectiveness.mechanisms[number]'` MUST NOT appear in the union.
Recursing into array element types would produce nonsense projection
keys for this domain. Concretely, the implementation must short-circuit
when it encounters `ReadonlyArray<X>` or `Array<X>`, preserving the
field path that names the array and stopping there. This constraint is
testable at compile time (see T7 smoke-test).

Default: `['id', 'displayName']` plus one numeric metric if the node
type has one. This makes projection a *type-system* property, not a
runtime convention. Strict, everywhere, always — full type discipline
on the projection contract is non-negotiable.

**On the depth bound**: a node type whose path-set produces an
instantiation that hits TypeScript's recursion limit at depth 4 is a
*signal* that the underlying type is too deep to be a useful
projection target — at that point the agent wants `get_node` with a
narrower projection or `explain` (in the corpus extension) for full
detail. Compile-time failure on instantiation depth is a load-bearing
drift signal, not a workaround target.

### Phase 3: Three adapters (T3-T5)

Each adapter is small (~150 LOC), implementing `GraphView` over the
existing typed graph data. The adapters do not modify the underlying
data; they read it and project it.

**T3: PrerequisiteGraphView** — over the `priorKnowledgeGraph` data
(generated by `prior-knowledge-graph-generator.ts`). Edge type:
`prerequisiteFor` (one type, with `source: 'thread' | 'priorKnowledge'`
preserved on the edge — direction-of-flow query handled by the
`direction` parameter on `neighbours`/`subgraph`). **No tag
taxonomy**: `PriorKnowledgeNode` has no `tags` field and `find_by_tag`
is therefore not implemented for this graph. Subject+keyStage
filtering is available via `enumerate_nodes`. Implements **6 of 7
operations**: `manifest`, `summary`, `get_node`, `enumerate_nodes`,
`neighbours`, `subgraph`.

**T4: MisconceptionGraphView** — over the `misconceptionGraph` data.
**Edge types: none in the current generator output.** The
`MisconceptionGraph` interface has `nodes` only, no `edges` field.
**No tag taxonomy**: `MisconceptionNode` has no `tags` field and
`find_by_tag` is not implemented; subject+keyStage filtering uses
`enumerate_nodes`. Consequently, this adapter implements **4 of 7
operations**: `manifest`, `summary`, `get_node`, `enumerate_nodes`.
The `neighbours`, `subgraph`, and `find_by_tag` operations are
explicitly carved out under the ≥2-of-3 rule — none of the three
will register as MCP tools for misconception until the source data
gains edges (for `neighbours`/`subgraph`) or a tag taxonomy (for
`find_by_tag`). ID discipline: misconception nodes have no explicit
ID field; the adapter mints stable IDs via SHA-1 hash of
`${lessonSlug}::${misconception}` truncated to 12 hex characters
(see Phase B finding 1; index-based forms ruled out as not
regeneration-stable).

**T5: EefStrandsGraphView** — over the EEF strands data. Edge types:
`related_strand` (from the `related_strands` field on each strand;
**field is absent on 13 of 30 strands**, treated as empty edge set —
`neighbours`/`subgraph` from those strands return single-node results),
`related_guidance_report` (from each entry of `related_guidance_reports`,
**field is absent on 23 of 30 strands**, treated as empty; each entry
is a `{title, url}` object — the adapter extracts `url` as the edge
target ID, preserving the title in edge metadata for citation
display). Edge type names are deliberately singular by designer
choice; the data field names are plural — implementors must not
derive edge type names by removing the trailing `s`. Tags: from the
`tags` array on each strand (curated taxonomy, 110 unique tags across
30 strands as of `meta.data_version='0.2.0'`). Node ID: `strands[].id`
(e.g. `eef-tl-metacognition-and-self-regulation`); the `id →
strand_id` rename happens at the corpus boundary, not here.

**Sparse-relations surface** (per assumptions-reviewer round,
2026-04-30): the `manifest()` and `summary()` operations on this
adapter MUST surface `strands_without_relations: readonly string[]` —
the list of strand IDs whose `related_strands` field is absent
(currently the 13 strands enumerated in Phase B finding 5). This
front-loads the empty-edge knowledge so an agent can avoid pointless
`subgraph`/`neighbours` calls on isolated strands. The list is
data-version-stable (changes only when the upstream EEF data
changes), so it has no per-call computation cost beyond a
build-time precompute. Implements **all 7 operations** (the
sparse-relations surface is additional manifest content, not a new
operation).

### Phase 4: MCP tools (T6)

**T6: 17 MCP tools** — one tool per operation per graph, **minus the
four NO-TRACER carve-outs surfaced by the T1 first-principles check
(rounds 1 and 2)**:

- `neighbours-misconception` — not registered (no edges in the
  misconception graph).
- `subgraph-misconception` — not registered (same).
- `find-by-tag-prerequisite` — not registered (no tag taxonomy in
  source data; agents wanting subject+keyStage filtering use
  `enumerate-nodes-prerequisite`).
- `find-by-tag-misconception` — not registered (same).

Final count: prerequisite 6 + misconception 4 + eef-strands 7 = 17.
Each tool's input schema is generated from the operation type;
internal implementation routes to the correct adapter. Tools follow
the established naming convention: `{operation}-{graph}` (e.g.
`enumerate-nodes-eef-strands`).

The four carve-outs are explicit — the registration code names
each and links to the corresponding T1 tracer-matrix NO TRACER cell,
so a future contributor reading the registration sees why the tools
are absent rather than wondering whether to add them.

### Phase 5: Tests (T7)

**T7: Progressive-disclosure tests** —

- Each operation respects its declared response-size bound.
- `manifest` < 300 tokens for every graph.
- `enumerate_nodes` with default projection < 2000 tokens at p95.
- `subgraph` with depth=2 has bounded growth (≤50 nodes).
- Default projection on EEF strands does NOT include `definition.full`,
  `key_findings`, `behind_the_average`, etc. (those are opt-in).

**T7a: `DeepKeyPath` compile-time smoke-test** — a unit test (or a
`*.test-d.ts` type-test file using `expectTypeOf`) that instantiates
`NodeProjection<EefStrand>` and asserts:

- `'headline.impact_months'` is a valid member.
- `'school_context_relevance.implementation_requirements.cpd_intensity'`
  is a valid member (depth 3, the deepest real path).
- `'effectiveness.mechanisms'` is a valid member (array path, leaf).
- `'tags.0'` is NOT a valid member (no element-index recursion).
- `'tags[number]'` is NOT a valid member (no element-index recursion).

This is the load-bearing test that proves the array-stop constraint
named in T2 holds at compile time. If the test compiles and the
forbidden members are absent from the union, the constraint is
satisfied. If the implementation regresses to recursing into array
element types, the test breaks loudly.

### Phase 6: Observability (T8)

**T8: Telemetry seams** —

- Sentry span per operation, with attributes `{graph, operation,
  projection_size, result_size, page_index}`.
- Named metric: `graph.query.{operation}.{graph}.count`.
- Dashboard query: ratio of focused-query calls to full-dump calls
  (the legacy `get-{graph}` JSON-dump tools remain registered for
  backward compatibility; the metric tells us when adoption is real).

### Phase 7: Documentation (T9)

**T9: ADR-123 update** — clarify the factory-vs-query-layer split:

- `graph-resource-factory.ts` is **plumbing replication** — it
  generates the boilerplate to expose a graph as a resource and a
  zero-arg dump tool.
- `graph-query-layer/*.ts` is **the interaction abstraction** — it
  provides operations against typed graph data with progressive
  disclosure.

Existing `get-{graph}` zero-arg dump tools remain registered (they
serve agents that genuinely want the whole graph, e.g. for offline
analysis). The query-layer tools are the recommended path for live
agent interaction.

### Phase 8: E2E (T10)

**T10: E2E assertions** —

- Every operation × every graph returns a valid response.
- Default-projection responses are bounded.
- `manifest` returns version data matching the graph's source.
- Pagination works correctly across page boundaries.

## Sequencing

```text
T1 tracer use cases  ──▶  T2 GraphView interface
                                │
                          T3 prereq adapter ─┐
                          T4 misconception   ├─▶ T6 MCP tools  ──▶ T7 tests
                          T5 EEF strands    ─┘                       │
                                                              T8 telemetry
                                                              T9 ADR-123
                                                              T10 E2E
```

T1 is mandatory before T2 — the tracer use cases shape the interface.
T3-T5 are parallel. T6-T10 are mostly parallel after T5.

## Size Estimate

| Component | Lines |
|---|---|
| GraphView interface + projection types | ~210 |
| 3 adapters (prereq 6/7 ops, misconception 4/7 ops, eef-strands 7/7 + sparse-relations precompute) | ~410 |
| 17 MCP tool definitions (mostly generated/derived; 21 cells minus 4 carve-outs) | ~205 |
| Internal implementation (operation dispatchers, projection logic) | ~300 |
| Tests | ~400 |
| Documentation (ADR-123 update + TSDoc) | ~80 |
| **Total new code** | **~1605 lines** |

No new dependencies. Reuses the SDK's existing typed-graph data files.
Coexists with the existing factory and dump tools — does not replace them.

## Exit Criteria

**Shape conditions** (necessary):

1. **17 MCP tools** registered and visible in `tools/list`:
   prerequisite 6 + misconception 4 + eef-strands 7. The four
   carve-outs (`neighbours-misconception`, `subgraph-misconception`,
   `find-by-tag-prerequisite`, `find-by-tag-misconception`) are
   explicitly absent under the ≥2-of-3 rule applied during the T1
   first-principles check (rounds 1 and 2).
2. Each operation works against each adapter that registers it.
3. Default projection bounds default response size.
4. ADR-123 updated.
5. `pnpm check` passes.

**Outcome condition — adoption evidence** (required, composite —
either branch satisfies):

6. Within 4 weeks of release, at least one of:
   - **Direct evidence** — ≥10 distinct sessions invoke any
     focused-query tool (a low absolute threshold that survives
     small-N sampling noise);
   - **Composition evidence** — ≥1 downstream consumer (the EEF
     corpus plan, or any other) successfully composes against the
     `GraphView` interface without special-casing;
   - **Honest analysis** — a documented analysis explaining why
     adoption is lower than expected, naming the next move
     (instrument differently / promote differently / sunset).

The composite shape — three branches, any one satisfies — replaces
the earlier 50%-ratio gate that would have been dominated by
sampling noise at the launch traffic levels typical for an MCP
tool. The "honest analysis" branch makes the criterion non-fatal
while preserving evidence-of-thought as a real bar. A plan that
ships 17 tools and silently produces no evidence on any branch did
not achieve the user value the plan exists for.

## Risks

1. **Tracer-use-case shortcut**: skipping T1 to "just build the
   interface". Mitigation: T1 is gating; T2 cannot start without it.

2. **Polymorphism through router tool**: the urge to ship one
   `query-graph` tool with a discriminator. Resisted explicitly here;
   if the team is tempted later, surface in code review.

3. **Default projection too aggressive**: hiding fields the agent
   actually needs by default, leading to `get_node`-then-`get_node`
   cascades. Mitigation: T7 tests sample the most common downstream
   needs; iterate the default projection per graph if the data shows
   cascade behaviour.

4. **Backward-compatibility creep**: keeping the old zero-arg dump
   tools forever. Mitigation: ADR-123 names them as legacy; sunset
   trigger documented (when adoption ratio of new tools >80% sustained
   for 8 weeks, deprecate dumps).

5. **Tag-search semantics — resolved structurally**: EEF tags are
   a curator-curated taxonomy; prerequisite and misconception have
   no `tags` field and no taxonomy. Earlier drafts of this plan
   tried to bridge the gap with a synthetic-compound
   `${subject}-${keyStage}` tag and a Risk-#5 mitigation requiring
   tool descriptions to state "the parameter is not really a tag" —
   classic invented-optionality / surface-cohesion shape.
   Resolved (assumptions-reviewer round, 2026-04-30): `find_by_tag`
   does NOT register for prerequisite or misconception. Agents
   wanting subject+keyStage filtering on those graphs use
   `enumerate_nodes`, which is honest about what it does. EEF
   `find_by_tag` operates against the real curated taxonomy; tests
   assert tag stability across data versions.

## Promotion Trigger from CURRENT to ACTIVE

Promote when:

1. Owner has approved the architecture session conclusions;
2. T1 (tracer use cases) is signed off;
3. The plan-body first-principles check has been re-applied to the
   tracer shapes against the actual data files;
4. The EEF corpus plan
   ([`../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../sector-engagement/eef/current/eef-evidence-corpus.plan.md))
   is also ready for parallel start (Increment 2 depends on this layer).

## Foundation Documents

Before promoting:

1. [`principles.md`](../../../directives/principles.md)
2. [`testing-strategy.md`](../../../directives/testing-strategy.md)
3. [`schema-first-execution.md`](../../../directives/schema-first-execution.md)
4. ADR-123 (current MCP-server primitives strategy)
5. ADR-157 (multi-source open education integration)
6. The `graph-resource-factory.plan.md` retrospective (DONE — establishes
   why the factory is plumbing, not interaction).

## Cross-Plan References

- **Parent**: [`../active/open-education-knowledge-surfaces.plan.md`](../active/open-education-knowledge-surfaces.plan.md) (multi-source coordinator).
- **Sibling (factory)**: [`../active/graph-resource-factory.plan.md`](../active/graph-resource-factory.plan.md) (DONE; this plan is a layer on top).
- **Sibling (corpus)**: [`../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../sector-engagement/eef/current/eef-evidence-corpus.plan.md) (depends on this layer).
- **Sibling (journeys)**: [`../future/cross-source-journeys.plan.md`](../future/cross-source-journeys.plan.md) (Increment 3 design; depends on this layer + corpus).
- **Session insight**: [`.agent/memory/active/napkin.md` § 2026-04-30 EEF graph-and-corpus architecture session](../../../memory/active/napkin.md).
- **Doctrine candidates**: see napkin's "Doctrine candidates surfaced" subsection — graduation triggers and candidate homes for the user-value template, the outcome-criteria gap, progressive disclosure, parallel-tracer-implementations, and conservation-requires-a-mind.
