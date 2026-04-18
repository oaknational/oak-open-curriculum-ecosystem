---
name: "Customer-Facing Status Page"
status: strategic-brief
overview: >
  Strategic brief for a user-facing status page (status.oak…) that reflects
  Oak Open Curriculum Ecosystem operational state to external users.
  Depends on Statuspage integration completing first — this plan is the
  public-facing UX layer over that backend.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "statuspage-integration.plan.md completes (promoted → active → closed)."
---

# Customer-Facing Status Page

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: `statuspage-integration.plan.md` completes.

---

## Problem and Intent

Statuspage integration (see
[`statuspage-integration.plan.md`](./statuspage-integration.plan.md))
closes the automation loop: probes and alerts drive Statuspage
incidents. This plan is the **product-side** layer: an external-facing
status page branded for this project's users, driven from the same
Statuspage data.

The intent: when Statuspage integration is complete and stable, the
next step is making the external view something users can find, trust,
and subscribe to.

## Domain Boundaries and Non-Goals

**In scope**:

- Public URL for the status page.
- Component hierarchy as user-visible categories.
- Subscription mechanics (email / webhook) if not covered by
  Statuspage default.
- Historical uptime SLO display (ties to
  `slo-and-error-budget.plan.md`).

**Out of scope (non-goals)**:

- Re-implementing Statuspage UI — use Statuspage's hosted UX.
- Data-breach transparency — governance / legal concern.
- Status-page branding decisions — product, not observability.

## Dependencies and Sequencing

**Prerequisite**:
[`statuspage-integration.plan.md`](./statuspage-integration.plan.md)
complete (in `archive/completed/` or equivalent).

**Related**:

- `observability/future/slo-and-error-budget.plan.md` — supplies the
  historical uptime SLO data this page displays.
- `observability/current/synthetic-monitoring.plan.md` — supplies the
  current-state probe signal.

## Success Signals

- Users can find and subscribe to the status page without engineering
  intervention.
- Historical uptime data matches internal observability (no skew).
- External-visibility doesn't introduce noise (false incidents).

## Risks and Unknowns

- **Visibility creates reputational sensitivity.** Mitigation:
  Statuspage integration plan's conservative triggers (two-of-three
  probe failures) carry forward; add a manual-confirmation gate
  before external incidents publish.
- **Subscription mechanics may not match Oak's broader user comms.**
  Mitigation: align with owner on subscriber-list ownership.

## Promotion Trigger

**Testable event**: `statuspage-integration.plan.md` moves to
`archive/completed/` with all its acceptance criteria met.

**When triggered**: move to `current/`. Author public-facing
component tree, subscription strategy, branding.

## Implementation Sketch (for context, finalised at promotion)

- Leverage Statuspage's hosted public status page.
- Configure public components aligned with five-axis user-visible
  categories (auth / search / tool-invocation / widget).
- Integrate subscription signup into user-facing product surfaces
  where relevant.

## References

- ADR-162 §Five Axes Operational (customer-facing transparency is
  an operational concern).
- Session report §2.3 gap item 10.
- `observability/future/statuspage-integration.plan.md`.
