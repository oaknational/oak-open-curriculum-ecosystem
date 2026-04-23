---
name: "SLO and Error Budget"
status: strategic-brief
overview: >
  Strategic brief for codifying Service Level Objectives and error budgets
  on top of the MVP observability foundation. Needs ≥30 days of baseline
  data post-launch to set realistic targets. Burn-rate alerts complement
  the MVP alert suite (ADR-162 §Five Axes Engineering).
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "≥30 days of baseline data collected post-launch (owner-managed uptime-monitor history + tool_invoked outcome distribution)."
---

# SLO and Error Budget

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-23
**Promotion trigger**: ≥30 days baseline data collected post-launch.

---

## Problem and Intent

Setting SLOs before real traffic exists is guesswork. Launch posture
per the direction-setting session report (§3.1) is "public beta, long-
lived, important" — SLOs are appropriate for the production window,
but realistic targets require baseline data. The intent is to codify
SLOs based on what the system actually does post-launch, not
pre-launch speculation.

## Domain Boundaries and Non-Goals

**In scope**:

- SLO definitions per critical user journey (tool invocation success
  rate, search latency, auth success rate, widget outcome success
  rate).
- Error-budget math (30-day rolling vs calendar-month choice).
- Burn-rate alert rules (multi-window: 2%/5% fast burn, 10% slow
  burn).
- Runbook linkage on alert fire.

**Out of scope (non-goals)**:

- External-facing status communication — owned by
  `customer-facing-status-page.plan.md`.
- SLA contractual commitments — business decision, different artefact.

## Dependencies and Sequencing

**Prerequisite**: 30 days of production data covering:

- Owner-managed uptime-monitor history against the deployed
  `/healthz` endpoint.
- `tool_invoked` outcome-class distribution (per events workspace).
- Auth-failure baseline (per security-observability).
- Widget-session-outcome baseline (per accessibility + usability axes).

**Related**:

- `sentry-observability-maximisation-mcp.plan.md § L-13` — alert
  infrastructure (SLO burn-rate alerts are new rules in the existing
  alerting surface).
- `observability/future/deployment-impact-bisection.plan.md` — budget
  consumption by deploy.

## Success Signals

- Every critical user journey has a named SLO with a target, a window,
  and a burn-rate alert.
- Error budget is visible in an ops dashboard.
- SLO violations produce actionable alerts, not noise.

## Risks and Unknowns

- **Baseline may be unrepresentative of steady-state traffic.**
  Mitigation: initial SLOs are explicit "pre-steady-state, will
  recalibrate at 90 days"; runbook includes recalibration trigger.
- **Alert noise if burn-rate windows are too tight.** Mitigation:
  multi-window design (fast + slow burn); weekly review of alert
  outcomes in first 60 days post-promotion.
- **SLO codification becomes theatrical if no one owns burn responses.**
  Mitigation: each SLO has a named runbook and owner in this plan's
  promotion authoring.

## Promotion Trigger

**Testable event**: 30 consecutive days of owner-managed
uptime-monitor history plus `tool_invoked` emissions exist
post-launch, queryable from the backend. The promotion author runs a
baseline distribution analysis as the first step.

**When triggered**: move to `current/`. Author per-journey SLOs with
owners; configure burn-rate alerts; runbook entries; dashboard.

## Implementation Sketch (for context, finalised at promotion)

- SLO storage: Sentry alert rules with burn-rate windows + a
  code-tracked SLO document.
- Critical journeys: tool invocation (user-visible), search (user-
  visible), auth (security impact), widget-session-outcome (UX).
- Error-budget refresh: 30-day rolling window.
- Alert channels: existing `#sentry-alert-testing` initially; split
  to per-severity channels once volume justifies.

## References

- ADR-162 §Five Axes (all axes have SLOs applicable).
- Session report §2.3 gap item 4.
- `sentry-observability-maximisation-mcp.plan.md § L-13`.
