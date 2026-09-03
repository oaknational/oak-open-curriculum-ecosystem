---
title: 'Strategy — Stream: the agentic framework (ecosystem, and our own transformation)'
type: strategy
status: active
last_updated: 2026-08-30
derives_from:
  - VISION.md
governed_by:
  - docs/strategy/README.md
---

# Stream — the agentic framework (ecosystem, and our own transformation)

_Part of the [Strategy corpus](README.md); derives from the [vision](../../VISION.md).
Serves Oak's **ecosystem** goal — and, inward, our own delivery capability._

The framework has two faces. **Outward:** an openly documented, freely available framework
for agent-first delivery that other teams adopt — a value stream serving the ecosystem, and
the exemplar/thought-leadership posture. **Inward:** how Oak itself learns to build and
curate digital products and services agent-first, across the whole lifecycle.

**The amplifier ethic is load-bearing here.** Agent-first amplifies our people; it doesn't
replace them. The human expert leads — judgement, taste, accountability — and agents carry
toil and scale. It's the same human-expert principle the product holds for teachers,
applied to ourselves. The strictness this framework demands isn't friction; it's the
foundation that makes it possible to work fast with agents, without trading away rigour or excellence.

## The inward transformation

This is the edge of the diagnosis this stream owns: **pace without trading rigour away.**
It's carried by an explicit engineering Practice — captured, versioned, and improved as we
use it
([ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md);
[How the Agentic Engineering System Works](../foundation/agentic-engineering-system.md)).
A few load-bearing shapes the strategy builds on:

- **The Practice is a meta-learning loop.** What we learn building one product is captured
  and compounds into how we build the next — the framework improves itself through use.
- **Internal reuse.** The engineering tools we offer the ecosystem (the SDK, search, the
  curriculum graph) are also what our own products stand on; building the tool well and
  using it ourselves are the same act.
- **The team learns, then disperses the capability.** How agent-first capability spreads
  across Oak — who learns it first, and how it propagates — is named as a proposed bet
  below (FRAME-4); the rollout/adoption model is yours to shape.
- **We're designing the system to measure its own delivery.** Vision, strategy, intent, work,
  and output have a canonical, versioned home, so we can derive the industry-standard DORA
  delivery metrics from the structure instead of reconstructing them manually. ADR-207 gates that
  projection on the idea graph, Linear projection, and external evidence joins under ADR-200 and
  proposed ADR-201. Those inputs become one automated graph only after the gates close; the
  [TAU collection index](../../.agent/plans-backlog-2026-07/telemetry-and-understanding/README.md#current-status)
  carries current delivery status. A framework that can _prove_ it delivers value, not just claim
  it, remains part of this stream's core value — not a side-benefit. (The substrate that makes this
  possible — the idea knowledge-graph — and the value it delivers are recorded canonically in
  [ADR-200 §Value](../architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md).)

## How we win

The bets, grounded in the diagnosis (pace without trading rigour away) — owner-signed-off
(2026-06-20); the strategy iterates as a living document (PDR-018).

- **FRAME-1 — The Practice as a meta-learning loop.** Capture what we learn building one
  product; compound it into how we build the next. _Advantage:_ we run it for real, at
  scale, on live products — the proof is in the dogfooding.
- **FRAME-2 — Openly documented, freely available.** The framework is a value stream
  others adopt, and our exemplar/thought-leadership posture. _Advantage:_ credibility — we
  ship real products with it, not slideware.
- **FRAME-3 — Internal reuse.** The tools we offer the ecosystem are what our own products
  stand on; building the tool well and using it ourselves are one act.
- **FRAME-4 — A rollout that spreads the capability.** A core team learns agent-first
  delivery, then disperses it across Oak.

## What we won't do

- Won't sacrifice rigour for speed — the strictness is the foundation that makes
  fast-with-agents possible, not a friction to cut.
- Won't keep the framework proprietary — its value to the ecosystem is in being open.
- Won't swap people for agents — agent-first product development is entirely about amplifying what our people are already doing.

## Measures — proposed candidate (Oak grounds)

Internal delivery uplift and external adoption of the framework — the candidate signals are
ours to propose, the targets Oak's to ground. Delivery performance (the DORA metrics) is a
_leading_ signal ADR-207 designs as an in-repo derivation; impact on Oak's goals is the _lagging_
signal Oak grounds. Current delivery status lives in the
[TAU collection index](../../.agent/plans-backlog-2026-07/telemetry-and-understanding/README.md#current-status).
See the [measures checkpoint](measures.md).

> **Settled (owner, 2026-06-20):** the internal transformation's alignment is direct — **Oak
> getting better at delivering Oak's goals.** Internal improvement in how we build and curate
> maps straight onto the external goals it amplifies (better, faster delivery of the teacher and
> ecosystem streams), and the outward framework serves the ecosystem goal in its own right. No
> separate rationale is needed; the vision already carries it — the transformation is "how we
> deliver the mission work" and "worth sharing in its own right".
