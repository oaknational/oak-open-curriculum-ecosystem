# ADR-195: Graph Tools Are a First-Class Tool Category

**Status**: Accepted 2026-06-11 (graduated from the 2026-05-28 graph-tooling capture in the
pending-graduations buffer; trigger fired 2026-06-04 at the EEF D4 ratification; ADR authoring
owner-approved 2026-06-11, paired with ADR-196, after the Track-G redesign executed the doctrine
in full).
**Date**: 2026-06-11
**Related**:
[ADR-173](173-graph-stack-topology.md) — graph stack topology; the substrate spine this category's
tools consume: per-view `GraphView` construction over the one-graph corpus, with a query layer that
ships real operations only;
[ADR-191](191-deterministic-data-surface-agent-reasons.md) — deterministic data surface, the agent
is the only reasoner; every graph tool inherits its reasoning boundary, and its
deterministic-projection-of-known-data principle is the serving-time half of this ADR's authority
clause (cited there, not restated here);
[ADR-196](196-graph-substrate-migration-one-unit-per-tool.md) — substrate migration doctrine (authored in the same
consolidation pass): how an existing surface moves onto the substrate this category queries;
[ADR-179](179-transport-agnostic-graph-substrate.md) — transport-agnostic graph substrate; graph
tools are the MCP consumer-side surface, and no substrate workspace ships tool code;
[ADR-193](193-system-vendor-type-boundary-membrane.md) — system–vendor type membrane; how a strict
graph envelope crosses into the vendor's `CallToolResult` (`get-eef-evidence` is the worked
instance);
[ADR-194](194-teacher-as-expert-product-boundary.md) — teacher-as-expert product boundary; the
envelopes carry facts and caveats, never recommendations;
[ADR-123](123-mcp-server-primitives-strategy.md) — MCP server primitives strategy; the tool surface
this category specialises;
[ADR-038](038-compilation-time-revolution.md) and
[ADR-153](153-constant-type-predicate-pattern.md) — fully-known `as const` corpora and
constant-type-predicate narrowing; the build-time mechanics of the authority clause;
[ADR-086](086-vocab-gen-graph-export-pattern.md) — the vocab-gen emission pattern behind the
generated one-graph curriculum corpus;
[ADR-112](112-per-request-mcp-transport.md) — per-request stateless transport; makes whole-corpus
resource removal protocol-safe.
Evidence record: the 2026-05-28 capture in
[`pending-graduations.md`](../../../.agent/memory/operational/pending-graduations.md) (§2026-05-28
captures — EEF graph-tooling rebuild); the EEF plan's Ratified Decisions in
`eef-graph-tool-completion.plan.md`;
`graph-tools-value-redesign.plan.md`
(the executed Track-G arc); the client-behaviour research
[`mcp-client-tool-result-consumption-2026-05-28.md`](../../../.agent/research/mcp-client-tool-result-consumption-2026-05-28.md).

## Context

Oak's MCP surface delivers graph-shaped curriculum and evidence data to AI agents. The first
graph-shaped tool built here (the EEF explore tool, increment F, May 2026) failed despite green
gates and three specialist reviews, because it imported **list-thinking into a graph domain**:
field-masking for budget, a runtime `capForBudget` guillotine, selection worked around un-built
graph operations, and soft `NotImplementedYet` stubs. The owner's diagnosis (2026-05-28) named the
category error: a graph is not a list. You cannot cut a graph off at N and "get the rest later" —
the tail is not a continuation, and the thing handed over was never a valid whole.

The cure was captured as a doctrine — graph tools are a distinct tool _category_ with its own
contract — and gated on proof. That proof has now executed twice over, on two different corpora:

- **`get-eef-evidence`** (the EEF rebuild, D2–D7): a bounded-query tool over the fixed `as const`
  EEF Toolkit corpus, live since 2026-06-08, with the full contract — closed corpus-derived
  inputs, complete envelopes with provenance and a navigable `frontier`, structuredContent-only
  responses, and a thin parse-and-dispatch handler over the `graph-corpus-sdk` bindings.
- **The Track-G value redesign** (complete 2026-06-11): the four whole-corpus curriculum graph
  tools — `get-prior-knowledge-graph`, `get-misconception-graph`, `get-thread-progressions`, and
  the new `get-keyword-graph` — rebuilt as anchored, bounded views over the one generated
  curriculum graph corpus (PRs 161, 163, 164, 173). The old shape returned entire corpora with no
  scoping input (a 6.0 MB / 12,858-node misconception blob; 1.8 MB of prior knowledge; all 164
  threads), flooding the calling agent with mostly-irrelevant tokens. The rebuilt tools take
  anchors, return bounded subgraphs, and leave no whole-corpus path; their four static
  `curriculum://` graph resources were removed outright. The downstream EEF value re-proof ran on
  the redesigned tools and found the value path intact (PR 177, merged 2026-06-11).

The category contract had no durable home — it lived in a graduation buffer entry and two plans.
This ADR is that home.

## Decision

**Graph tools are a first-class MCP tool category.** They inherit every base-tool constraint
(strict types, deterministic projection, real logic with tests or absent) and add the
category-specific requirements below. A tool that surfaces graph-shaped data and does not meet
them is the wrong shape, whatever its gates say.

### 1. Anchored and bounded queries on the one-graph corpus

Every call is anchored to corpus keys the caller names — unit/lesson/thread slugs, strand ids,
subject + key stage — and returns only the bounded relevant subgraph. There is no whole-corpus
path. The agent selects the anchors before the tool boundary (ADR-191); anchors are corpus keys,
never free text. The bound is **graph scope** — membership, traversal depth, windows — and an
oversized result is a scoping bug fixed by correcting the scope. Anchor arity differs per tool
only where the corpus justifies it, and each tool's description records its anchor contract.
Curriculum tools share one graph with a single identity model (kind-qualified ids, placement as
edges), surfaced through per-view construction (ADR-173).

### 2. Complete-within-itself subgraphs, contiguous or sparse

Completeness is **integrity plus traceability, not maximalism**: relationships are always
represented (edges are the value, so they are never the thing dropped); no claim travels without
its caveats; nothing is silently lost. A subgraph is a chosen node-set plus its edges — it need
not be a connected region, so a sparse selection scattered across the graph is as legitimate as a
contiguous neighbourhood. The token budget is never met by slicing nodes from their evidence or
evidence from its uncertainty.

### 3. Navigable links

Every reference that leaves the returned subgraph is itself a usable corpus key, reachable by a
further bounded call: the EEF envelope reports its out-of-member `frontier` of strand ids; the
curriculum envelopes carry slugs and ids that re-anchor the same tools. Gaps are reported as
information in the envelope, never silently — unknown anchor slugs come back in `unknownAnchors`,
and known coverage limits (for example thread-unreachable units) are stated in the tool contract.

### 4. structuredContent is the response; no context hint

The bounded subgraph travels as `structuredContent` — the canonical, complete payload the calling
agent reasons over. No context-hint object rides the payload: model-facing guidance lives in the
tool description (`tools/list`), never inside the response and never in `_meta` (which the model
does not see). For this agent-facing regime the owner-settled shape is structuredContent-only
(`content: []`), validated against the target clients by first-hand client research (2026-05-28);
`get-eef-evidence` is the executed instance. The redesigned curriculum tools additionally keep the
MCP spec's backwards-compatibility SHOULD — a summary plus the serialised JSON as `TextContent`
alongside the identical `structuredContent` — per the redesign plan's recorded protocol note. Both
shapes carry the same structured payload; the context hint belongs in neither (see §Open
questions for the convergence item).

> **Superseded in part (owner, 2026-06-11): the structuredContent-only shape is
> reversed.** A live two-client probe falsified the 2026-05-28 research's
> sufficiency: Cursor's agent harness renders ONLY `content` blocks (a
> `content: []` success renders "(omitted)" — the EEF teacher-value path was
> dead in Cursor-class clients), while Claude Code renders ONLY
> `structuredContent`. The category shape is now the **dual response shape**
> (`formatToolResponse`: summary + serialised-JSON `content` blocks plus the
> `structuredContent` payload) — the MCP spec's backwards-compatibility SHOULD
> — for every graph tool; `get-eef-evidence` was realigned in PR-2 of the
> 2026-06-11 snagging plan
> (commit `20ad83326`). Evidence:
> [`oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md`](../../../.agent/reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md)
> and [ADR-058's client-variability note](058-context-grounding-for-ai-agents.md).
> The no-context-hint position for graph tools remains an open item (§Open
> questions); note `formatToolResponse` includes the hint by default, so the
> realigned EEF response currently carries it — its cost is now measurable by
> the outbound token health metric.

### 5. Budget is a design signal, never a runtime cap

Token-economy targets shape the _design_ of the bounded subgraph — anchor arity, empirically
grounded depth defaults (prior knowledge defaults to depth 2 on measured neighbourhood
distributions), windows and limits for heavy-tail anchors. They are never met by truncation,
field-masking, or rank-and-cut. The one runtime budget cap ever built here was deleted with the
old list surface; no successor exists.

### 6. The graph/corpus is smart; the tool is a thin formatter

Selection, traversal, projection, and ordering are **real operations in the graph layer** — the
`graph-corpus-sdk` views over `graph-core`, reusable across corpora (ADR-173's
real-operations-only rule). The tool owns only the MCP boundary: input validation (a single schema
parse) and the response envelope. Each of the five live tools is a thin parse-and-dispatch over
its view; none holds traversal logic.

### 7. Fixed canonical data is authority; durable shapes derive from the corpus

Every durable shape a graph tool rests on — node and edge types, kind-qualified ids, anchor input
domains, view types, emitted schemas — **derives from the fixed canonical corpus**: by
`typeof`/indexed-access over `as const` corpora (ADR-038) or by generation-time emission from bulk
data (ADR-086). Known-shape data is derived from, not validated: no hand-maintained shape exists
in parallel to a corpus for the corpus to be checked against. The one legitimate unknown in the
system is the externally supplied key, narrowed once by a corpus-backed predicate (ADR-153);
everything downstream of a known key is exact. The serving-time half of this clause — every
response is a deterministic projection of known data, and the consuming agent is the only
reasoner — is ADR-191's decision and applies here by citation, not restatement. Deterministic
ordering by a corpus-held fact (for example keyword frequency, a first-class node property) is a
projection under ADR-191, not relevance judgement.

## Consequences

**Positive**:

- New graph-shaped surfaces inherit a settled category contract instead of re-deriving it — the
  failure mode that produced the first EEF tool is named and closed.
- The calling agent receives bounded, complete, navigable subgraphs it can traverse and reason
  over (ADR-191/ADR-194), at a fraction of the old token cost: anchored envelopes replace
  multi-megabyte corpus blobs, with the EEF value path proven intact on the redesigned tools.
- The intelligence is reusable: the same substrate and view pattern carries the EEF strand corpus
  and the curriculum corpus, and the next corpus adapter starts from real, tested operations.
- The contract is inspectable in code: anchored input schemas, view modules in
  `packages/sdks/graph-corpus-sdk/src/curriculum/` and `src/eef-strands/`, and thin tool modules
  in `packages/sdks/oak-curriculum-sdk/src/mcp/`.

**Negative / cost accepted**:

- Anchors must be resolved before calling — agents reach the graph tools via `search`, `fetch`, or
  `browse-curriculum` first. The tool descriptions carry that contract.
- Zero-argument calls no longer work: the move to required anchors was a deliberate behaviour
  break (replace-don't-bridge), recorded in the redesign plan, with no aliasing or deprecation
  step. The per-request stateless transport (ADR-112) means no client holds a stale schema across
  connections.
- Whole-corpus reads are gone by design. A caller wanting "everything" must walk it as bounded
  queries; that is the category working as intended, not a gap.

## Alternatives considered

- **List-shaped delivery of graph data** (slice / page / truncate / field-mask / rank-and-cut).
  Rejected on the lived failure: the first EEF explore tool shipped exactly this shape, passed
  every gate and three reviews, and delivered no value — a graph cut at N is an invalid whole.
- **Whole-corpus resources kept alongside the anchored tools.** Rejected and removed: a static
  resource has no anchor input, so once a bounded tool exists the resource has no bounded form.
  The four `curriculum://` graph resources were removed, not rewritten.
- **Server-side relevance scoping** ("return what is relevant to the teacher's situation").
  Rejected per ADR-191: the agent selects anchors with the full situation in view; the server
  projects deterministically.
- **Runtime budget caps as the bound.** Rejected: budget shapes design (§5); a cap converts a
  scoping bug into silent data loss.
- **A generic corpus-tool factory from the first tool.** Not taken: each tool is a thin per-view
  formatter; shared mechanics are a consolidate-at-third-consumer decision, never presupposed.

## Open questions / future revision

- **Response-shape convergence for the four curriculum graph tools (§4).** Two recorded positions
  exist on the `TextContent` block: the owner-settled structuredContent-only shape (2026-05-28,
  executed by `get-eef-evidence`) and the redesign plan's protocol note keeping the spec's
  backwards-compat SHOULD (2026-06-09, executed by the Track-G tools). Separately — and not a
  recorded decision at all — the shared `formatToolResponse` helper still injects the legacy
  `oakContextHint` into those four tools' `structuredContent` by default, a formatter default that
  predates this doctrine. Removing the context hint from the graph-tool path, and reconciling the
  two content shapes into one recorded category shape, is the named open item; the universal
  output-schema work touches the same envelope surface and is a natural vehicle.
  _(Resolved in part 2026-06-11: the content-shape half converged — the owner reversed
  structuredContent-only and every graph tool now emits the dual shape (§4 supersession note).
  The context-hint half remains open.)_
- **Client-render evidence before ratifying a non-default response shape (general principle).**
  Beyond these four tools: ratifying any non-default MCP response shape requires first-hand evidence
  of how real agent clients _render_ it. The Cursor-vs-Claude-Code two-client matrix in §4 (Cursor
  surfaced only the decoration keys; Claude Code surfaced only `structuredContent`) is the worked
  precedent that falsified the implicit "clients surface structuredContent" assumption — the same
  client-population rendering check applies before any future non-default shape is ratified, and is
  a natural input to the output-schema / mcp-expert work.
- **The "working with graphs" skill.** Authorised in the same graduation pass, it operationalises
  this category for agent practice (graph ≠ list, the forbidden list-ops, the soft-stub failure
  mode). It teaches this contract; it does not change it.
