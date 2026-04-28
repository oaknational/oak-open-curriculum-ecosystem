---
name: "Cost and Capacity Telemetry"
status: strategic-brief
overview: >
  Strategic brief for observability of operational economics — function-level
  cost attribution, cold-boot frequency, capacity risk. Not MVP: costs are
  bounded pre-launch and post-launch baseline data does not yet exist. Opens
  when cost pressure or capacity risk surfaces.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "First instance of cost pressure (Vercel bill delta, Sentry quota near-miss, LLM provider spend alert) OR capacity-risk event (request queueing, rate-limit-triggered spike sustained, cold-boot latency regression)."
---

# Cost and Capacity Telemetry

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: first cost-pressure OR capacity-risk event.

---

## Problem and Intent

Operational economics is not currently observable: per-function cost
on Vercel, cold-boot frequency and duration, Sentry quota consumption
rate, and future LLM provider spend all live in separate vendor
dashboards. For MVP beta this is acceptable — traffic is bounded and
bills are reviewable manually. The plan opens when an event surfaces
that the manual review cadence can't catch.

## Domain Boundaries and Non-Goals

**In scope**:

- Vercel function-level cost attribution (ties to deploy, function
  name, invocation count).
- Cold-boot frequency and latency observability.
- Sentry quota consumption rate alerting.
- LLM provider spend (when AI-telemetry-wiring promotes).
- Elasticsearch storage / query-cost trends.

**Out of scope (non-goals)**:

- Cost optimisation decisions — this plan provides visibility; the
  optimisation lanes open separately based on what the visibility
  reveals.
- FinOps process work — organisational, not this plan.

## Dependencies and Sequencing

**Prerequisite (either)**:

- A recorded cost-pressure event: a Vercel bill line that surprised
  someone; a Sentry quota alert hitting 80%; an LLM spend alert.
- A recorded capacity-risk event: sustained rate-limit trigger spike;
  user-visible request queueing; cold-boot latency regression flagged
  in the synthetic probe.

**Related**:

- `sentry-observability-maximisation-mcp.plan.md § L-7` — release
  linkage enables cost-delta-per-deploy correlation.
- `observability/future/deployment-impact-bisection.plan.md` —
  consumer of cost-per-deploy data.
- `observability/future/ai-telemetry-wiring.plan.md` — supplies
  LLM-spend-per-tool attribution.

## Success Signals

- Cost delta after a deploy is attributable to specific code paths
  (function, tool) rather than "the bill went up".
- Cold-boot cadence and duration trends visible.
- Capacity risk (rate-limit saturation, queue depth) produces
  proactive alert before user impact.

## Risks and Unknowns

- **Provider-specific billing export formats vary and change.**
  Mitigation: adapter layer per vendor; plan body treats provider
  shapes as configuration.
- **Attribution requires correlating deploy IDs with billing line
  items.** Mitigation: L-7 release tagging gives the deploy correlation
  key.
- **Observability itself has a cost (Sentry events, dashboard
  storage).** Mitigation: self-observing — track cost-telemetry's
  own cost within this plan.

## Promotion Trigger

**Testable events**:

- A bill line increases by a named threshold that the reviewer flags
  as surprising.
- Sentry quota monitoring surfaces 80%+ consumption with >7 days to
  cycle end.
- Rate-limit triggers sustained for >5 minutes without corresponding
  attack signal (legitimate saturation).

**When triggered**: move to `current/`. Scope opens by which trigger
fired (cost vs capacity); both may be sub-divided into separate plan
promotions if both hit.

## Implementation Sketch (for context, finalised at promotion)

- Vercel cost export → events workspace `function_cost_observed` schema.
- Sentry quota webhook → alert when approaching limit.
- Cold-boot: span attribute + metric from the composition root.
- LLM spend: extends ai-telemetry-wiring emissions with cost-per-call
  attribution.

## References

- ADR-162 §Five Axes Operational (cost is an operational concern).
- Session report §2.3 gap items 7 + 11.
- ADR-161 (pipeline boundary — cost-export collectors run in deploy
  pipeline, not PR check).
