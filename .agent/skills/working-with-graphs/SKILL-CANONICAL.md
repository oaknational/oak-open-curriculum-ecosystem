---
name: working-with-graphs
classification: passive
description: >-
  Doctrine for any work that builds, serves, or consumes a graph surface. A
  graph is not a list: subgraphs are complete within their declared bound or
  they are wrong; list operations (pagination, truncation, top-N sampling of
  nodes or edges) never touch a subgraph; responses carry the anchors that
  navigate to the next bounded response; graph tools are thin deterministic
  formatters over a smart corpus; a degraded list-shaped answer is never an
  acceptable substitute for a typed refusal or a well-formed empty result.
---

# Working with Graphs

**Governance**: This skill operationalises the bounded-retrieval graph contract built in
`packages/core/graph-core` (the `GraphView` query layer) and `packages/sdks/graph-corpus-sdk`
(the per-view constructions over the EEF and curriculum corpora), under
[ADR-191](../../../docs/architecture/architectural-decisions/191-deterministic-data-surface-agent-reasons.md)
(deterministic data surface; the consuming agent is the only reasoner) and
[ADR-195](../../../docs/architecture/architectural-decisions/195-graph-tools-first-class-tool-category.md)
(graph-tool category doctrine). The value redesign that produced the contract is
[`graph-tools-value-redesign.plan.md`](../../plans-backlog-2026-07/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md).

## Use When

Apply this skill whenever you are:

- designing, implementing, or reviewing a tool, resource, view, or projection over graph data
- emitting or reshaping a graph corpus (nodes, typed edges, identity model)
- consuming a graph response in an agent workflow and deciding what to fetch next
- tempted to make a graph response smaller by treating it as a list

## Graph ≠ List

A list is independent items; cutting it anywhere leaves a valid smaller list. A graph is nodes
**plus edges that reference them** (`SubgraphResult.edges` carry `source`/`target` node ids —
`graph-core/src/graph-view/types.ts`). Cutting the node set strands edges; cutting the edge set
silently severs real relationships. The substrate treats a dangling endpoint as corruption:
`createGraphView` **throws at construction** on any edge whose endpoint is not a known node.

Therefore these list operations never touch the node or edge sets of a subgraph:

- **Pagination** of a subgraph's nodes or edges. No page of a neighbourhood exists.
- **Truncation** of a result to fit a size or token budget. A truncated subgraph asserts
  relationships that are missing and absences that are false.
- **Top-N sampling** of nodes or edges. A sampled neighbourhood is not a smaller neighbourhood;
  it is a different, wrong graph.

The correct way to make a graph response smaller is to **shrink the declared bound** — fewer
anchors, smaller depth, a narrower anchor granularity (thread → unit → lesson) — and return the
complete subgraph inside that bound. Bounds are structural (anchors + depth + node kinds + edge
types), never counts applied after traversal.

## Completeness Is Integrity

**A subgraph is complete within its declared bound, or it is wrong.** The built contract enforces
this at every layer:

- `GraphView.subgraph({ rootIds, depth })` returns every node reachable within `depth` hops of
  the roots and **every corpus edge whose both endpoints are members**
  (`create-graph-view.ts` — the `memberEdges` filter). Nothing inside the bound is omitted.
- Construction is the failure boundary: a duplicate node id, a dangling edge endpoint, or an
  invalid `maxDepth` throws at construction rather than ever serving from a partial view. The
  implementor contract (`graph-view/interface.ts`) requires an adapter to fail before exposing a
  partially-constructed view.
- Corpus emission guarantees the invariant upstream: the generator resolves every dangling
  endpoint (emit the node or drop the edge with provenance) and tests assert the emitted corpus
  constructs in `createGraphView` without throwing.

Where the contract does carry a window, the window falls on **whole structural members** and is
**declared as data**, never a silent cut: the misconception thread anchor pages unit-granularly
(`unitOffset`/`unitLimit`/`totalUnits`/`hasMore` — each returned unit complete with all its
lessons and their misconceptions); the keyword view returns ranked whole entries with honest
totals (`totalMatchingKeywords`, `hasMore`) and a declared per-entry lesson decoration window
(`hasMoreLessons`). Every window is itself complete-within-itself; edges and within-member
content are never paged.

## Contiguous and Sparse Subgraphs

Two legitimate subgraph shapes exist, and both obey the completeness rule:

- **Contiguous** — an anchored traversal neighbourhood: everything reachable from the anchors
  within the depth bound, with all internal edges. The EEF strand graph (`maxDepth = 1`) is this
  shape. (So was the prior-knowledge _tool_, until MCP-671 moved it to a field projection on
  2026-09-03 — see ADR-195's amendment. The synthesised `prerequisiteFor`
  edges remain in the corpus, but the depth-bounded SDK view that read them was deleted.)
- **Sparse** — an anchored projection whose members are selected by the anchor's scope rather
  than mutual reachability: one thread's year-ordered unit sequence, a unit's lessons with their
  misconceptions, the keywords of every lesson matching subject + key stage. Members may be
  scattered across the wider graph; completeness still means every member matching the scope is
  present (or honestly windowed with totals) — sparse never means sampled.

A third shape is not a subgraph at all, and saying so keeps the two above meaningful:

- **Field projection** — anchor resolution plus a projection of fields the anchor nodes already
  carry: no member selection, no edges, nothing scattered across the graph. The prior-knowledge
  statements (`priorKnowledgeStatements`) are this shape. Completeness is trivially satisfied —
  every anchor's every statement is present — and so is the warning: a field projection served
  from a tool named `*-graph` will be read as a graph unless the tool description says otherwise.

A projection whose meaning cannot ride `subgraph()` edges (sequence order, frequency ranking) is
its **own real operation** in the view layer, with its own logic and tests — never a fake edge or
a post-hoc sort smuggled onto a traversal result.

## Navigable Links Between Responses

Bounded retrieval works because responses **link**: each response carries the corpus keys that
anchor the next call, so the agent walks the graph across calls instead of needing it whole.

- Discovery → detail: `progressionsForSubjectKeyStage` returns thread **descriptors** (no
  sequences) so the caller finds the `threadSlug` to anchor `progressionForThread` with.
- Windows carry their continuation: `hasMore` + `unitOffset`/`unitLimit` name the next window;
  `hasMoreLessons` signals that lesson anchors will retrieve the rest.
- Every node carries its kind-qualified id (`unit:<slug>`, `lesson:<slug>`, ...), and results
  echo `resolvedAnchors`/`unknownAnchors`, so what was retrieved — and what to anchor next — is
  always first-class data.

When designing a new graph response, ask: from this response alone, can the consuming agent
construct its next bounded call? If not, the response dead-ends and the design is incomplete.

## Graph Tools Are a Category: Thin Formatter Over a Smart Corpus

The intelligence lives below the tool. Corpus emission mints deterministic kind-qualified
identities, types every edge, and resolves integrity at generation time; the view layer does the
real bounded retrieval (per-view `createGraphView` construction, projections, anchor
resolution). The tool layer is a **thin formatter**: it validates input, calls the view, and
formats the result (`structuredContent` plus serialised `TextContent`).

Per ADR-191, no layer of a graph tool judges relevance, ranks by opinion, or recommends.
Deterministic ordering by recorded data — placement count descending with an id tie-break,
teaching year — is projection, not reasoning: the same inputs always return the same facts, and
the consuming agent does all relevance judgement over them. A graph tool that starts reasoning
has left the category.

## The Soft-Stub Failure Mode

The named anti-pattern: when the graph answer is unavailable or over-bound, returning a
**degraded list-shaped answer** instead — a flat node list without edges, a sample that fits a
budget, a partial traversal passed off as the neighbourhood. A soft stub looks helpful and is
worse than refusal: it asserts a wrong graph, and the consumer cannot tell.

The built contract refuses instead, in exactly three honest shapes:

- **Typed refusal** — `Result` errors for caller-driven violations: `SubgraphDepthExceeded`,
  `SubgraphRootNotFound`, `KeywordLimitInvalid`, `ThreadWindowInvalid`. No whole-corpus or
  over-depth path is offered at all.
- **Well-formed empty result** — an unknown or unmatched anchor is reported in `unknownAnchors`
  and returns a structurally valid empty result on the same projection path. Empty is honest;
  partial is not.
- **Fail-fast construction** — bad backing data throws before any view is exposed, so a degraded
  view can never serve.

The `GraphView` contract states the rule for every operation: it is implemented with real
graph-derived logic and tests, or it is absent. Never stubbed, never approximated.

## Checklist

1. Is every size constraint a structural bound (anchors, depth, kinds, granularity) declared in
   the contract — never a count cut applied to a subgraph's nodes or edges?
2. Is the result complete within its declared bound, with every internal edge present?
3. If windowed, does the window fall on whole structural members and carry honest metadata
   (`totalUnits`/`totalMatchingKeywords`, `hasMore`, offset/limit echoes)?
4. Can the consuming agent build its next bounded call from this response's own keys?
5. Does the tool layer only validate, retrieve, and format — no relevance, ranking, or
   recommendation anywhere server-side (ADR-191)?
6. On failure or absence: typed refusal or well-formed empty — never a soft stub?
