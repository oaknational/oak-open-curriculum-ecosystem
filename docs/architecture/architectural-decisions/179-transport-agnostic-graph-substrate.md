# ADR-179: Transport-Agnostic Graph Substrate — Surfacing Is A Consumer-Side Concern

**Status**: Accepted 2026-05-11 (Sparking Charring Ash session, owner
final-approval; extracted from ADR-173 per owner direction during the
reviewer cycle).
**Date**: 2026-05-11
**Related**:
[ADR-123](123-mcp-server-primitives-strategy.md) — MCP server primitives
strategy; this ADR establishes that future graph-derived MCP primitives
amend ADR-123 at the point a consumer surfaces them, not as part of the
graph substrate;
[ADR-154](154-separate-framework-from-consumer.md) — framework/consumer
separation; this ADR is the transport-discipline corollary of ADR-154
applied across HTTP, MCP, CLI, and JSON-LD export;
[ADR-173](173-graph-stack-topology.md) — graph stack topology; this ADR
extracts the transport-agnostic principle previously recorded inline
inside ADR-173 so transport-discipline doctrine and topology
doctrine can evolve independently.

## Context

ADR-173 records a seven-active-plus-one-deferred graph topology. The
draft of ADR-173 included an "MCP-agnostic principle" subsection
stating that no graph workspace ships MCP-shaped code; tool
definitions, resource constants, and registration helpers live with
the existing curriculum MCP consumer surface or a future app-facing
adapter, not with the graph SDK that produces the data.

architecture-expert-fred's 2026-05-11 review of ADR-173 raised an
advisory amendment: the principle is a cross-cutting transport-
discipline rule (HTTP, CLI, and JSON-LD export are explicitly
bundled with the MCP rule in ADR-173 §Surfacing), and embedding a
transport-discipline rule inside a topology ADR risks misaligned-
citation drift as future transport doctrine has to amend a topology
ADR for reasons unrelated to topology.

The owner directed extraction (2026-05-11). This ADR is the
extraction. ADR-173 is amended to remove the inline principle and
reference this ADR.

The rule itself is unchanged. Only its home moves.

## Decision

The graph substrate is transport-agnostic. Surfacing graph capability
through any transport (MCP, HTTP, CLI, JSON-LD export, search-
augmentation, or future surfaces) is a consumer-side concern with at
most one home per transport per graph domain.

### Substrate discipline

No graph substrate workspace ships transport-shaped code:

- No MCP tool definitions, resource constants, or MCP-server
  registration helpers inside any of `graph-core`, `graph-ingest`,
  `graph-enhance`, `graph-validate`, `graph-project`, or
  `graph-corpus-sdk`.
- No HTTP route handlers, no HTTP request/response types, no
  Express/Hono/Vercel-route specifics inside the substrate.
- No CLI argument parsers, command runners, or `process.stdout`/
  `process.stderr` writes inside the substrate. The substrate
  exports data and functions; consumers compose those into CLI
  outputs.
- No transport-specific export profiles inside the substrate beyond
  JSON-LD 1.1 as a standards-defined wire format. JSON-LD export
  profiles tuned for a specific consumer (Cytoscape, Neo4j import,
  SPARQL CONSTRUCT result frames) live in consumer-side adapter
  workspaces.

### Surfacing discipline

When Oak chooses to surface graph capability through a transport, the
surface lives in:

- **MCP**: the existing curriculum SDK MCP module plus the curriculum
  MCP HTTP app, or a future sibling app that imports
  `graph-corpus-sdk`. ADR-123 (MCP server primitives strategy) is the
  authority on tool definitions.
- **HTTP**: a curriculum HTTP app or sibling app; not a substrate
  workspace.
- **CLI**: the `agent-tools/` workspace exposes commands when the
  consumer is a practice-graph or agent-side consumer. Curriculum-side
  CLIs sit in a curriculum-side app workspace, not in a substrate
  workspace.
- **JSON-LD export profiles**: in `graph-project` as the developer-
  facing surface for consumer-side profiles, but consumer-specific
  shaping (Cytoscape colour palettes, Neo4j label conventions) lives
  in the consumer adapter.
- **Search-augmentation**: in a search-side workspace that imports
  `graph-corpus-sdk`; not in a substrate workspace.

### At-most-one-home-per-transport rule

For each (graph domain, transport) pair, there is at most one
surfacing workspace. The curriculum graph surfaced through MCP has
exactly one MCP home (the curriculum MCP module). The practice graph
surfaced through CLI has exactly one CLI home (the `agent-tools/`
workspace).

If a graph substrate workspace starts wanting a transport type or
factory, that is the signal to extract a thin consumer adapter
workspace — not to leak transport concerns into the substrate.

### Cross-ADR boundary

This ADR does not amend ADR-123. Future graph-derived MCP primitives
amend ADR-123 at the consumer point when a tool is surfaced. ADR-123
remains authoritative for MCP primitive strategy; this ADR is
authoritative for _where_ a transport surface is allowed to live.

## Consequences

**Positive**:

- Topology decisions in ADR-173 evolve independently of transport-
  discipline decisions here. Future transport-rule refinements amend
  ADR-179, not ADR-173.
- ADR-123 stays authoritative for MCP primitive strategy. ADR-179
  governs _home assignment_, not primitive design.
- The substrate stays publishable as open-education infrastructure
  (a stated goal of ADR-173 §Public-Asset Positioning): no transport
  coupling means external organisations can adopt the substrate and
  attach their own transport surfaces without forking.
- Each transport home is named at the point of surfacing decision,
  preventing fragmentation across parallel surfaces for the same
  graph domain.

**Negative / cost accepted**:

- Two ADRs (173 + 179) now need to be read together to understand
  the full graph-stack architectural surface. This is the standard
  cost of separating topology from cross-cutting transport
  discipline; the documentation cost is bounded and citation-stable.
- Consumers wanting to ship a new transport surface must locate the
  one allowed home (or author the one allowed home if none exists),
  not surface ad hoc. This is the intended discipline, not a cost,
  but it is named here so the rule is not silently absorbed as
  ceremony.

## Alternatives considered

- **Keep the principle inside ADR-173**. Rejected per
  architecture-expert-fred's 2026-05-11 review: a cross-cutting
  transport-discipline rule embedded inside a topology ADR creates
  misaligned-citation drift; any future transport-rule amendment
  would have to amend a topology ADR for reasons unrelated to
  topology.
- **Fold the principle into ADR-123**. Rejected: ADR-123 governs MCP
  primitive design; this ADR governs _home assignment across all
  transports_, not just MCP. Folding would either expand ADR-123
  beyond MCP or under-cover the non-MCP transports (HTTP, CLI,
  export, search-augmentation).
- **Fold into ADR-154**. Rejected: ADR-154 is the
  framework-vs-consumer separation rule; this ADR is its applied
  corollary for transport surfaces. ADR-154 stays at the principle
  level; ADR-179 is the operational discipline.

## Open questions

None. The rule's substance is unchanged from its previous home in
ADR-173 drafts; only the home moves. If transport-discipline
refinements emerge in future, they amend this ADR.

## Notes for future revision

The same at-most-one-home-per-transport discipline is a candidate
for generalisation beyond the graph stack. If a second substrate
emerges in the repository with the same transport-agnostic
positioning (e.g., a future event-bus substrate), this ADR may be
generalised into a substrate-transport-discipline ADR rather than a
graph-specific one. The current scope is the graph substrate; do
not pre-generalise.
