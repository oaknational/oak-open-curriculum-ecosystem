---
title: 'Strategy — Measures'
type: strategy
status: provisional
last_updated: 2026-08-30
derives_from:
  - VISION.md
governed_by:
  - docs/strategy/README.md
---

# Measures (Oak-grounded)

_Part of the [Strategy corpus](README.md); derives from the [vision](../../VISION.md)._

Measures are an Oak input — defined and measured with Oak's analytics and research experts
— never invented here. So this is a **well-formed checkpoint, not a blank and not invented
numbers**: each stream carries the shape below, and the owner and Oak fill the signal.

| Stream             | Candidate signal (provisional)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Who grounds it                    | Status               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------------------- |
| MCP app            | _Impact_ (lagging): real-use adoption + observed positive impact for teachers / curriculum leaders (K1). _Delivery_ (leading): DORA software-delivery metrics, designed as an in-repo projection under ADR-207.                                                                                                                                                                                                                                                                                                                  | Oak (impact) + in-repo (delivery) | Owner/Oak checkpoint |
| Engineering tools  | Ecosystem adoption of the SDK / search / graph                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Oak + owner                       | Owner/Oak checkpoint |
| Agentic framework  | _Delivery_ (leading): DORA-shaped delivery metrics over the Practice's own output, and the seven DORA AI-capabilities as leading indicators, designed as an in-repo projection under ADR-207. _Impact_: internal uplift + external adoption.                                                                                                                                                                                                                                                                                     | Oak (impact) + in-repo (delivery) | Owner/Oak checkpoint |
| Oak Innovation Kit | _KIT-1 possibility_: reception, accurate comprehension, generativity, and separately activation. _KIT-2 evidence economics_: total effort per decision-relevant uncertainty resolved, including assurance and retirement. _KIT-3 demo-portfolio learning_: distinct propositions and evidence-linked dispositions, including confirmation and no change. _KIT-4 exercised commonality_: unlike reuse and legitimate non-use, independent consumption where claimed, bespoke forks, semantic drift, and changing marginal effort. | Oak + owner + in-repo evidence    | Owner/Oak checkpoint |

Impact is measured at Oak, not instrumented in-repo (launch keystone K1). This checkpoint
names where each signal will live; the owner and Oak's analytics and research experts
ground what is actually measurable.

For the Innovation Kit, raw demo count, applause, traffic, visual polish, or shared-code
percentage alone are not success measures. A possibility showcase may legitimately measure
changed understanding and inspiration; those signals must not be promoted into evidence of
task utility, adoption, teacher impact, or pupil outcomes.

Possibility signals remain separated: reception and attention; accurate comprehension of the
real mechanism and its limits; materially new questions or ideas; activation through a mutually
agreed next action; and consequential use or an evidence-linked decision. A showpiece need not
traverse the whole chain to succeed, but evidence from one state cannot be promoted into the
next. An idea, request, or introduction is not yet collaboration evidence.

Every Innovation Kit signal is interpreted against a named audience or population, baseline or
comparator, exposure and non-use, collection method, decision owner, review point, and losing
condition. Evidence-linked dispositions include advance, confirm, narrow, reshape, stop, retire,
defer, and preserve as unresolved; “decision changed” is not privileged over a warranted
no-change result. False mental models, abandonment, delayed effects, verification burden, harms,
and exclusions are retained alongside successes.

Where a public-capability or stewardship claim is pursued, provenance and authority retention,
export and provider exit, independent-consumer success, challenge hand-off, and—only where a
real institutional service is exercised—correction closure are examined separately. A complete
causal bridge is readiness to test public value, not evidence that public value has occurred.

## Delivery-performance metrics (DORA) — designed as an in-repo projection

DORA's software-delivery-performance metrics are a **leading delivery signal** for the two
products — the MCP app (DORA in its literal sense) and the Practice / agentic framework
(DORA-shaped: the metric shape, not DORA's calibrated bands). They are distinct from the
Oak-grounded _impact_ measures above: impact is lagging and Oak-measured (K1); delivery
performance is leading. We've given vision, strategy, intent, planning, work, and output a
canonical, versioned home so we can derive these metrics in the repo. ADR-207 gates the automated
projection on the intent graph and on GitHub, Linear, deployment, and Sentry evidence governed by
proposed ADR-201. The
[TAU collection index](../../.agent/plans-backlog-2026-07/telemetry-and-understanding/README.md#current-status)
carries current delivery status. The metrics become queryable only after those projectors and
connectors exist. The shape is settled; targets stay Oak-grounded:

- the **five DORA metrics** (deployment frequency, change lead time, failed deployment recovery
  time, change fail rate, deployment rework rate);
- the **seven DORA AI-capabilities** as leading indicators (clear AI stance, healthy data
  ecosystems, AI-accessible internal data, strong version control, working in small batches,
  user-centric focus, quality internal platforms);
- **value-stream flow** metrics (lead time, process time, value-add-to-wait ratio).

Mechanism and derivation:
[ADR-207 — DORA delivery metrics as a structural property of the intent graph](../architecture/architectural-decisions/207-dora-delivery-metrics-as-a-structural-property.md);
operational home: the [observability and quality-metrics plan](../../.agent/plans-backlog-2026-07/architecture-and-infrastructure/future/observability-and-quality-metrics.plan.md).
