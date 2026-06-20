---
title: 'Strategy'
type: strategy
doc_role: index
status: active
last_updated: 2026-06-20
audience: 'Oak leadership (decide) and the delivery team (build)'
governed_by:
  - .agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md
derives_from:
  - VISION.md
---

# Strategy

> **A living strategy (PDR-018).** The diagnosis, the shape, the per-stream choices, and what
> we won't do are **settled** — the owner signed off the stream definitions (2026-06-20); the
> measures remain Oak's to ground. We've adopted what's settled and we'll iterate as practice
> teaches us. This README is the stable index and summary; the detail lives in the files it links.

## In one line

**Deliver Oak's rigour at reach and at pace.** Oak's curriculum is rigorous, and that rigour
is the value. Becoming a product means keeping it intact (**rigour**) while meeting teachers
and the ecosystem where they now work (**reach**), fast enough to matter (**pace**) — and the
three pull apart unless we choose well. That's the [diagnosis](diagnosis.md), and it's the
spine the rest hangs from.

## How to read this

The vision has two parts — serving Oak's mission, and the agent-first transformation. The
strategy's first organising principle is the **three value streams** — the app, the
engineering tools, and the agentic framework — held together at a portfolio tier. The
two-part vision and the three-stream strategy are the same picture at two zooms: the app and
the tools serve the mission, and the framework is both the engine that builds them and a
value stream in its own right.

| Read                                                                           | For                                                                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| [Diagnosis](diagnosis.md)                                                      | the central challenge, and the edge each stream faces                                                              |
| [How we align with Oak, and the streams as a system](alignment-and-streams.md) | stream → Oak goal, the schools non-goal, the four pillars as constraints, and how the streams reinforce each other |
| [Stream — the MCP app](stream-mcp-app.md)                                      | teachers; the two channels; the K1–K3 launch keystones; release-readiness hand-offs                                |
| [Stream — the engineering tools](stream-engineering-tools.md)                  | the ecosystem; SDK, search, graph, and the EEF evidence-convenor exemplar                                          |
| [Stream — the agentic framework](stream-agentic-framework.md)                  | the ecosystem and our own transformation; the amplifier ethic; the inward Practice                                 |
| [Measures](measures.md)                                                        | how we'll know it's working (Oak-grounded)                                                                         |

## Strategic choices (the traceability spine)

Every plan in the estate traces to a **strategic choice** here, every choice to a vision
element, every vision element to one of Oak's goals — so the choices are an enumerable,
stable set with IDs, and the spine reads upward for coherence.

**Granularity: per-stream choices** (owner-set). Each stream names a small set of durable
strategic choices (`APP-1`, `TOOLS-1`, `FRAME-1`, …; the ecosystem may decompose to SDK /
search / graph / EEF). A plan resolves to exactly one choice, which rolls up to its stream
and Oak goal. Threads collect plans and serve goals selectively, so the map is a graph, not a
strict tree.

Each stream's strategic choices are **signed off** by the owner (2026-06-20) in its "how we
win" section; the registry below reflects them. The ID **contract** — how IDs
behave (stable, additive, resolvable), the `serves_strategic_choice` field, and the validator
— is governance machinery, owned by **Body 3** of the
[controlling plan](../../.agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md).
The strategy lists the choices; governance owns the contract.

| Stream            | Choice IDs                                                            | Status                                 |
| ----------------- | --------------------------------------------------------------------- | -------------------------------------- |
| MCP app           | `APP-*`                                                               | Signed off (4 bets) — owner 2026-06-20 |
| Engineering tools | `TOOLS-*` (may decompose: `SDK-*` / `SEARCH-*` / `GRAPH-*` / `EEF-*`) | Signed off (4 bets) — owner 2026-06-20 |
| Agentic framework | `FRAME-*`                                                             | Signed off (4 bets) — owner 2026-06-20 |

## Open decisions

| Decision                                          | Owner                                          | Status / note                                                                         |
| ------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| The diagnosis                                     | Owner                                          | **Settled** — "deliver Oak's rigour at reach and at pace" ([diagnosis](diagnosis.md)) |
| Strategic-choice granularity                      | Owner                                          | **Settled** — per-stream choices                                                      |
| How we win, per stream                            | Owner ("the advantages" — a larger discussion) | **Signed off** — owner 2026-06-20 (each stream)                                       |
| What we won't do, per stream                      | Owner                                          | **Signed off** — owner 2026-06-20 (each stream)                                       |
| Measures                                          | Owner + Oak analytics/research                 | Open — [measures](measures.md)                                                        |
| Search / graph / EEF — external vs internal-reuse | Owner                                          | Open — [engineering tools](stream-engineering-tools.md)                               |
| Internal-transformation alignment rationale       | Owner                                          | Open — [agentic framework](stream-agentic-framework.md)                               |

## Related

- [Vision](../../VISION.md) — the change and the two parts.
- [Controlling plan](../../.agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md) —
  scope, sequencing, and acceptance for this corpus (Body 2).
- [Launch-readiness framework](../../.agent/plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md)
  — the app's K1–K3 and Groups A–D readiness catalogue.
- [Compliance roadmap](../../.agent/plans/compliance/roadmap.md) — the production-blocking
  statutory set.
- [Editorial tone](../../.agent/directives/editorial-tone.md) — the voice this corpus is
  written in.
