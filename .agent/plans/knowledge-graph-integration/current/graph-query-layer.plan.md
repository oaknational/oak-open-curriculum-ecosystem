---
name: "Graph Query Layer (Foundation for Graphs and Evidence Corpora)"
overview: "A polymorphic 7-operation query layer over Oak's typed graphs (prerequisite, misconception, EEF strands), with progressive disclosure (manifest → summary → detail → edge) and mandatory projection so responses fit working context. Foundation for the EEF evidence corpus and cross-source journeys."
parent_plan: "../active/open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "../active/graph-resource-factory.plan.md"
  - "../active/misconception-graph-mcp-surface.plan.md"
  - "../../sector-engagement/eef/current/eef-evidence-corpus.plan.md"
  - "../active/nc-knowledge-taxonomy-surface.plan.md"
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
    content: "Tests proving response size remains bounded under projection; tests proving manifest+summary+detail tiers compose correctly."
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

### Phase 2: SDK shape (T2)

**T2: GraphView interface** — `oak-curriculum-sdk/src/mcp/graph-views/`

```typescript
export interface GraphView<TNode, TEdgeType extends string> {
  manifest(): GraphManifest;
  summary(opts?: { groupBy?: keyof TNode | TEdgeType }): GraphSummary;
  getNode(id: string, projection?: NodeProjection<TNode>): TNode | null;
  enumerateNodes(opts?: {
    filter?: NodeFilter<TNode>;
    projection?: NodeProjection<TNode>;
    page?: { number: number; size: number };
  }): EnumerateNodesResult<TNode>;
  neighbours(opts: {
    nodeId: string;
    edgeType?: TEdgeType;
    direction?: 'in' | 'out' | 'both';
    projection?: NodeProjection<TNode>;
  }): NeighbourResult<TNode>;
  subgraph(opts: {
    rootIds: readonly string[];
    depth: number;
    projection?: NodeProjection<TNode>;
  }): SubgraphResult<TNode>;
  findByTag(tag: string, projection?: NodeProjection<TNode>): readonly TNode[];
}
```

`NodeProjection<TNode>` is a recursive deep-path type bounded to a
declared maximum depth (default 4 levels — covers `headline.impact_months`,
`effectiveness.mechanisms`, and similar two-level paths plus headroom).
The shape is:

```typescript
type NodeProjection<TNode, Depth extends number = 4> =
  ReadonlyArray<DeepKeyPath<TNode, Depth>>;

// DeepKeyPath produces literal-string path unions:
//   'id' | 'name' | 'headline.impact_months' | 'headline.cost_rating' | ...
```

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

**T3: PrerequisiteGraphView** — over the prior-knowledge-graph data.
Edge types: `prerequisite_of`, `succeeds`. Tags: subject + key stage.

**T4: MisconceptionGraphView** — over the misconception-graph data.
Edge types: `related_misconception`, `addressed_by_lesson`. Tags:
subject + KS + misconception type.

**T5: EefStrandsGraphView** — over the EEF strands data. Edge types:
`related_strand` (from the `related_strands` field on each strand),
`related_guidance_report` (from each entry of `related_guidance_reports`,
preserving the data field name; edge target ID is the report URL). Tags:
from the `tags` array on each strand.

### Phase 4: MCP tools (T6)

**T6: 7 × 3 = 21 MCP tools** — one tool per operation per graph. Each
tool's input schema is generated from the operation type. The internal
implementation routes to the correct adapter. Tools follow the
established naming convention: `{operation}-{graph}` (e.g.
`enumerate-nodes-eef-strands`).

### Phase 5: Tests (T7)

**T7: Progressive-disclosure tests** —

- Each operation respects its declared response-size bound.
- `manifest` < 300 tokens for every graph.
- `enumerate_nodes` with default projection < 2000 tokens at p95.
- `subgraph` with depth=2 has bounded growth (≤50 nodes).
- Default projection on EEF strands does NOT include `definition.full`,
  `key_findings`, `behind_the_average`, etc. (those are opt-in).

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
| GraphView interface + projection types | ~200 |
| 3 adapters (~150 each) | ~450 |
| 21 MCP tool definitions (mostly generated/derived) | ~250 |
| Internal implementation (operation dispatchers, projection logic) | ~300 |
| Tests | ~400 |
| Documentation (ADR-123 update + TSDoc) | ~80 |
| **Total new code** | **~1680 lines** |

No new dependencies. Reuses the SDK's existing typed-graph data files.
Coexists with the existing factory and dump tools — does not replace them.

## Exit Criteria

**Shape conditions** (necessary):

1. 7 × 3 = 21 MCP tools registered and visible in `tools/list`.
2. Each operation works against each adapter.
3. Default projection bounds default response size.
4. ADR-123 updated.
5. `pnpm check` passes.

**Outcome conditions** (also required):

6. After 4 weeks of release, at least one of: ratio of focused-query
   calls to full-dump calls ≥50%, OR a documented analysis explaining
   why adoption is lower than expected and what to do.
7. At least one downstream consumer (the EEF corpus plan) successfully
   uses the GraphView interface without special-casing.

The outcome conditions are deliberately load-bearing. A plan that ships
all 21 tools but where no agent ever uses them did not achieve the
user value the plan exists for.

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

5. **Tag-search semantics drift across graphs**: EEF tags are
   curator-curated; misconception tags may be more ad hoc. Mitigation:
   `find_by_tag` documents per-graph tag semantics; tests assert that
   each graph's tags are stable over a sample of source-data versions.

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
