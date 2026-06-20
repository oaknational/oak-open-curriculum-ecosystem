---
title: 'Strategy — Stream: the engineering tools (ecosystem)'
type: strategy
status: active
last_updated: 2026-06-20
derives_from:
  - VISION.md
governed_by:
  - .agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md
---

# Stream — the engineering tools (ecosystem)

_Part of the [Strategy corpus](README.md); derives from the [vision](../../VISION.md).
Serves Oak's **ecosystem** goal._

The typed SDK (TypeScript now, Python to follow), the semantic search service, the
curriculum graph tools, and the evidence surfaces — open tools for building with open
educational data, Oak's and beyond.

The evidence surfaces are where we **bring open resources together**: alongside Oak's data
we integrate openly licensed material from other organisations in the sector — notably the
**Education Endowment Foundation (EEF)**, an independent, external education-evidence
organisation whose
[Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit)
is openly available under attribution. Integrating an external partner's open materials is
a concrete instance of the ecosystem-convenor posture (vision Part 1, and the "bringing
open resources together" exemplar) — which is why each source stays attributed to whoever
created it.

## How we win

The bets, grounded in the diagnosis (Oak's rigour made something others can build on,
openly) — owner-signed-off (2026-06-20); the strategy iterates as a living document
(PDR-018). The ecosystem may decompose to SDK / search / graph / EEF.

- **TOOLS-1 — Schema-first, typed contracts.** The SDK is generated from the API spec, so
  consumers build on guarantees, not guesses. _Advantage:_ our engineering rigour
  (schema-first) is itself the product — contracts others can trust.
- **TOOLS-2 — Open by default.** Openly licensed code over open data; no lock-in (the Free
  pillar). _Advantage:_ a public-good posture a body like Oak can credibly hold.
- **TOOLS-3 — Convene open evidence.** Bring Oak's data together with external open
  evidence (the EEF Toolkit, and others) — the ecosystem-convenor posture. _Advantage:_
  Oak's trust and neutrality make it a credible convenor of the wider evidence base.
- **TOOLS-4 — Differentiated capability.** Semantic search and the curriculum graph as
  surfaces the ecosystem can't easily build alone. _Advantage:_ Oak's data depth plus the
  search and graph engineering.

## What we won't do

- Won't build closed or proprietary tooling — the value is in the open surface. Public money paying for public goods.
- Won't own or gate curriculum content in this repo; the tools are a delivery and build mechanism, not the curriculum, the broader organisation owns the curriculum.
- Won't compete with the ecosystem we exist to enable.

## Measures — proposed candidate (Oak grounds)

Ecosystem adoption of the SDK / search / graph — the candidate signal is ours to propose,
the target Oak's to ground. See the [measures checkpoint](measures.md).

> **Open decision for the owner:** how much of the **search and graph tooling** is an
> _external_ ecosystem deliverable versus an _internal-reuse_ module (e.g. the semantic
> search engine re-pointed at a different data source)? They appeared in the strategy
> inputs mostly as internal-reuse; their outward role needs settling. (The EEF integration
> is settled: external open material we bring together — an ecosystem-facing exemplar, not
> an internal-reuse question.)
