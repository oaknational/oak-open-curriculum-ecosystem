---
title: 'Strategy'
type: strategy
doc_role: index
status: active
last_updated: 2026-08-30
audience: 'Oak leadership (decide) and the delivery team (build)'
derives_from:
  - VISION.md
---

# Strategy

> **A living strategy (PDR-018).** The diagnosis and first three streams' choices and
> won't-do boundaries are **settled** (owner, 2026-06-20). The owner declared the Oak
> Innovation Kit the fourth value stream (2026-08-30); its initial choices are published
> here for living-strategy refinement. Measures remain Oak's to ground. This README is the
> stable index and summary; the detail lives in the files it links.

## In one line

**Deliver Oak's rigour at reach and at pace.** Oak's curriculum is rigorous, and that rigour
is the value. Becoming a product means keeping it intact (**rigour**) while meeting teachers
and the ecosystem where they increasingly work (**reach**, AI assistants),
fast enough to matter (**pace**) — and the three pull apart unless we choose well.
That's the [diagnosis](diagnosis.md), and it's the spine the rest hangs from.

## How to read this

The vision has two parts — serving Oak's mission, and the agent-first transformation. The
strategy's first organising principle is the **four value streams** — the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) (MCP) [app](https://modelcontextprotocol.io/extensions/apps/overview), the
engineering tools, the agentic framework, and the Oak Innovation Kit — held together at a
portfolio tier. The two-part vision and the four-stream strategy are the same picture at two
zooms: the app and the tools serve the mission; the framework is both the engine that builds
them and a value stream in its own right; and the Innovation Kit exists to turn their latent capability
into excellent working experiences that expand understanding, generate trustworthy evidence,
and compound what real use proves reusable.

| Read                                                                           | For                                                                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| [Diagnosis](diagnosis.md)                                                      | the central challenge, and the edge each stream faces                                                              |
| [How we align with Oak, and the streams as a system](alignment-and-streams.md) | stream → Oak goal, the schools non-goal, the four pillars as constraints, and how the streams reinforce each other |
| [Stream — the MCP app](stream-mcp-app.md)                                      | teachers; the two channels; the K1–K3 launch keystones; release-readiness hand-offs                                |
| [Stream — the engineering tools](stream-engineering-tools.md)                  | the ecosystem; SDK, search, graph, and the EEF evidence-convenor exemplar                                          |
| [Stream — the agentic framework](stream-agentic-framework.md)                  | the ecosystem and our own transformation; the amplifier ethic; the inward Practice                                 |
| [Stream — the Oak Innovation Kit](stream-innovation-kit.md)                    | responsible imagination; excellent demonstrations, trustworthy evidence, and exercised reuse                       |
| [Measures](measures.md)                                                        | how we'll know it's working (Oak-grounded)                                                                         |

## Building capabilities

Across the four streams, we're building capabilities that outlast any single product.
Representing knowledge as graphs is one — applied across Oak's curriculum, the sector evidence we
bring in, AI-enhanced development, and our own processes.

The **Oak Innovation Kit** began here as another such capability (owner-named, 2026-07-02):
the tools and knowledge to create an Oak experience to production standards at pace. The owner
declared it the **fourth value stream** and a **first-class strategic node** on 2026-08-30. Those
are distinct structures: the [value stream](stream-innovation-kit.md) publishes the durable
`KIT-*` choices; `innovation-kit` is the stable identity of one first-class outcome in the
plan estate. The plan corpus owns the node's current shape, ratification state, and typed
parent edge; the node does not contain the value stream. The Curriculum Hub programme is a
historical worked instance. The stream now carries an open-ended portfolio of independently
scoped demonstrations and the evidence discipline that lets their learning compound.

## Strategic choices (the traceability spine)

Every plan in the estate traces to a **strategic choice** here: each strategic node serves
exactly one published choice, and each delivery plan serves one strategic node, inheriting
its upward trace. Every choice traces to a vision element, and every vision element to one
of Oak's goals — so the choices are an enumerable, stable set with IDs, and the spine reads
upward for coherence.

**Granularity: per-stream choices** (owner-set). Each stream names a small set of durable
strategic choices (`APP-1`, `TOOLS-1`, `FRAME-1`, `KIT-1`, …; the ecosystem may decompose to SDK /
search / graph / EEF). A strategic node resolves to exactly one choice, which rolls up to its
stream and Oak goal; a delivery plan resolves to exactly one strategic node. Threads collect
plans and serve goals selectively, so the map is a graph, not a strict tree.

**Streams and threads are different axes.** A _stream_ is an end-to-end flow of value governed
by a durable strategic front (the organising principle of this strategy); a _thread_ is a
continuity unit — a named line of work
that persists across sessions. They relate through plans, many-to-many: a plan follows one
typed `serves` edge upward (delivery → strategic node → choice → stream → Oak goal), while a
thread collects whatever plans advance its line of work and so may touch several streams;
equally, one stream is advanced by several threads. Neither contains the other.

The first three streams' strategic choices were **signed off** by the owner (2026-06-20).
The owner declared the Innovation Kit the fourth stream on 2026-08-30; its `KIT-*` choices are
the repository's initial articulation of that direction and remain subject to the living-strategy
discipline. The ID **contract** — how IDs behave (stable, additive, resolvable), the typed
`serves` field, and the validator — is governance machinery defined by the current
[plan-node schema](../../.agent/plans/plan-node-schema.md). This strategy lists the choices and
is the current governing index for its detail pages; the plan estate owns plan-node
conformance rather than strategy content.

| Stream             | Choice IDs                                                            | Status                                                |
| ------------------ | --------------------------------------------------------------------- | ----------------------------------------------------- |
| MCP app            | `APP-*`                                                               | Signed off (4 bets) — owner 2026-06-20                |
| Engineering tools  | `TOOLS-*` (may decompose: `SDK-*` / `SEARCH-*` / `GRAPH-*` / `EEF-*`) | Signed off (4 bets) — owner 2026-06-20                |
| Agentic framework  | `FRAME-*`                                                             | Signed off (4 bets) — owner 2026-06-20                |
| Oak Innovation Kit | `KIT-*`                                                               | Owner-declared stream; 4 choices published 2026-08-30 |

## Open decisions

| Decision                                          | Owner                                          | Status / note                                                                                                                                                                                    |
| ------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The diagnosis                                     | Owner                                          | **Settled** — "deliver Oak's rigour at reach and at pace" ([diagnosis](diagnosis.md))                                                                                                            |
| Strategic-choice granularity                      | Owner                                          | **Settled** — per-stream choices                                                                                                                                                                 |
| How we win, per stream                            | Owner ("the advantages" — a larger discussion) | First three **signed off** — owner 2026-06-20; initial `KIT-*` articulation published 2026-08-30 under the owner-declared fourth stream                                                          |
| What we won't do, per stream                      | Owner                                          | First three **signed off** — owner 2026-06-20; Innovation Kit boundaries initially articulated 2026-08-30                                                                                        |
| Measures                                          | Owner + Oak analytics/research                 | Open — [measures](measures.md)                                                                                                                                                                   |
| Search / graph / EEF — external vs internal-reuse | Owner                                          | **Settled** 2026-06-20 — general reuse, both faces; layered architecture, no trade-off ([engineering tools](stream-engineering-tools.md))                                                        |
| Internal-transformation alignment rationale       | Owner                                          | **Settled** 2026-06-20 — internal improvement maps to the external goals ([agentic framework](stream-agentic-framework.md))                                                                      |
| Oak Innovation Kit — fourth stream or capability? | Owner                                          | **Settled 2026-08-30** — fourth value stream and first-class strategic node; the stream and node remain distinct structures ([stream](stream-innovation-kit.md), node identity `innovation-kit`) |

## Related

- [Vision](../../VISION.md) — the change and the two parts.
- **Strategic node identity:** `innovation-kit` — one plan-estate outcome; its plan record
  owns current shape, ratification state, and typed parent edge.
- [Innovation Kit research and proposed definition](../../.agent/research/innovation-kit/README.md) —
  reader-routed product-creation-system definition, dated evidence, scenarios and historical
  sources; not strategy authority or an implementation selection.
- [Eve + MCP agentic-chat research](../../.agent/research/innovation-kit/eve-mcp-agentic-chat-experience-2026-08-30.md) —
  one bounded research input to the stream, not strategy authority or implementation proof.
- [Dynamic, interactive graph-experience research](../../.agent/research/innovation-kit/dynamic-interactive-graph-experience-landscape-2026-08-30.md) —
  one bounded evidence landscape for a peer demonstration, not strategy authority or an
  implementation choice.
- [Plan-node schema](../../.agent/plans/plan-node-schema.md) — the current typed
  plan-edge contract; it does not replace this strategy's authority over published choices.
- [Launch-readiness framework](../../.agent/plans-backlog-2026-07/curriculum-mcp-path-to-ga/launch-readiness-framework.md)
  — the app's K1–K3 and Groups A–D readiness catalogue.
- [Compliance roadmap](../../.agent/plans-backlog-2026-07/compliance/roadmap.md) — the production-blocking
  statutory set.
- [Editorial tone](../../.agent/directives/editorial-tone.md) — the voice this corpus is
  written in.
