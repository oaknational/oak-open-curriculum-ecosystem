---
title: 'Strategy — Measures'
type: strategy
status: provisional
last_updated: 2026-06-21
derives_from:
  - VISION.md
governed_by:
  - .agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md
---

# Measures (Oak-grounded)

_Part of the [Strategy corpus](README.md); derives from the [vision](../../VISION.md)._

Measures are an Oak input — defined and measured with Oak's analytics and research experts
— never invented here. So this is a **well-formed checkpoint, not a blank and not invented
numbers**: each stream carries the shape below, and the owner and Oak fill the signal.

| Stream            | Candidate signal (provisional)                                                                                                                                                                               | Who grounds it                    | Status               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- | -------------------- |
| MCP app           | _Impact_ (lagging): real-use adoption + observed positive impact for teachers / curriculum leaders (K1). _Delivery_ (leading): DORA software-delivery metrics, derived in-repo.                              | Oak (impact) + in-repo (delivery) | Owner/Oak checkpoint |
| Engineering tools | Ecosystem adoption of the SDK / search / graph                                                                                                                                                               | Oak + owner                       | Owner/Oak checkpoint |
| Agentic framework | _Delivery_ (leading): DORA-shaped delivery metrics over the Practice's own output, and the seven DORA AI-capabilities as leading indicators, derived in-repo. _Impact_: internal uplift + external adoption. | Oak (impact) + in-repo (delivery) | Owner/Oak checkpoint |

Impact is measured at Oak, not instrumented in-repo (launch keystone K1). This checkpoint
names where each signal will live; the owner and Oak's analytics and research experts
ground what is actually measurable.

## Delivery-performance metrics (DORA) — derived in-repo, for both products

DORA's software-delivery-performance metrics are a **leading delivery signal** for the two
products — the MCP app (DORA in its literal sense) and the Practice / agentic framework
(DORA-shaped: the metric shape, not DORA's calibrated bands). They are distinct from the
Oak-grounded _impact_ measures above: impact is lagging and Oak-measured (K1); delivery
performance is leading and **derived in-repo**, because vision, strategy, intent, planning,
work, and output all live in one versioned substrate. DORA's own guidance is that logs-based
delivery metrics give continuously-measured data at scale _but require sufficient observability
into the development toolchain_ — usually the hardest precondition; here it is intrinsic, so the
metrics are a query away rather than a reconstruction. The shape is settled; targets stay
Oak-grounded:

- the **five DORA metrics** (deployment frequency, change lead time, failed deployment recovery
  time, change fail rate, deployment rework rate);
- the **seven DORA AI-capabilities** as leading indicators (clear AI stance, healthy data
  ecosystems, AI-accessible internal data, strong version control, working in small batches,
  user-centric focus, quality internal platforms);
- **value-stream flow** metrics (lead time, process time, value-add-to-wait ratio).

Mechanism and derivation:
[repo intent graph plan — Delivery-performance metrics](../../.agent/plans/product-development-governance/future/repo-intent-graph.plan.md);
operational home: the [observability and quality-metrics plan](../../.agent/plans/architecture-and-infrastructure/future/observability-and-quality-metrics.plan.md).
