---
name: "Statuspage Integration"
status: strategic-brief
overview: >
  Strategic brief for integrating Oak's existing Atlassian Statuspage with
  the owner-managed uptime signal and Sentry alert suite, so incidents become
  visible to external users. Deferred for MVP per owner direction —
  operational-state publication not needed for public beta.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "Owner signals readiness to publish operational state to external users (typically post-beta when usage volume makes outage transparency a product concern)."
---

# Statuspage Integration

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-23
**Promotion trigger**: owner signals readiness to publish operational state externally.

---

## Problem and Intent

Oak uses Atlassian Statuspage for incident communication at the
organisational level. For this project's MVP beta, publishing
operational state externally is not required (per direction-setting
session §3.4). When beta matures into a posture where outage
transparency is user-visible product surface, this plan owns the
wiring.

## Domain Boundaries and Non-Goals

**In scope**:

- Automated status-component publication from owner-managed uptime
  monitor results.
- Incident lifecycle automation (open on probe failure, update on
  alert fire, close on resolution).
- Component hierarchy (per axis? per capability? per environment?).
- Manual override for planned maintenance windows.

**Out of scope (non-goals)**:

- Customer-facing status UI beyond Statuspage — owned by
  `customer-facing-status-page.plan.md`.
- Non-Statuspage providers — Statuspage is already adopted at Oak.
- Post-incident-review tooling — separate practice.

## Dependencies and Sequencing

**Prerequisite**: owner decides the beta audience is large or public
enough that outage transparency is a product concern. This is a
product-state signal, not a technical one.

**Related**:

- Owner-managed uptime-monitor signal against the deployed `/healthz`
  endpoint — supplies the probe signal that drives automated incident
  creation.
- `observability/future/slo-and-error-budget.plan.md` — burn-rate
  alerts may feed "degraded performance" states.
- `observability/future/customer-facing-status-page.plan.md` — builds
  on top of this plan's integration.

## Success Signals

- Probe failure within N minutes creates a Statuspage incident.
- Incident resolution auto-closes the Statuspage incident.
- Planned maintenance communicates without manual ops toil.

## Risks and Unknowns

- **Public incident visibility has reputation cost if over-triggered.**
  Mitigation: conservative threshold (two consecutive probe failures
  over 10 minutes rather than one); manual-override escape.
- **Statuspage API rate limits.** Mitigation: batch / debounce in the
  integration layer.
- **Multi-region probe disagreement.** Mitigation: deferred until
  multi-region probes exist in the owner-managed uptime layer.

## Promotion Trigger

**Testable event**: owner posts a message (Slack, email, session
notes) declaring "we're ready to publish operational state externally"
OR a product decision lands that explicitly requires it (e.g. a B2B
customer asks for SLAs).

**When triggered**: move to `current/`. Author integration shape,
component taxonomy, rollout plan.

## Implementation Sketch (for context, finalised at promotion)

- Statuspage API client in a new library workspace or existing
  integration surface.
- Wire owner-managed uptime-monitor result → Statuspage component state.
- Wire Sentry alert fire → Statuspage incident creation for specific
  alert categories (not all alerts become public incidents).
- Runbook: planned maintenance workflow.

## References

- ADR-162 §Five Axes Operational.
- Session report §2.3 gap item 5 + §3.4.
- Owner-managed uptime monitoring against `/healthz`.
