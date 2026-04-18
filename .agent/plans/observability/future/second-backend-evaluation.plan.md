---
name: "Second Backend Evaluation"
status: strategic-brief
overview: >
  Strategic brief for evaluating a second observability backend (dual-export
  to Datadog, Honeycomb, NewRelic, Grafana, or a self-hosted OpenTelemetry
  stack) once a specific Sentry gap is named in the exploration output and
  that gap outweighs the operational cost of a second surface. Reframed from
  "dual-export decision" per session report §3.1 clarification — the
  question is not "should we dual-export" but "what specific Sentry
  limitation requires a second backend".
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "Specific Sentry-capability gap named in docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md output OR in docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md output, with evidence that the gap blocks a concrete observability goal."
---

# Second Backend Evaluation

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: specific Sentry gap named (with evidence) in exploration 1 or 2 output.

---

## Problem and Intent

ADR-162's vendor-independence clause structurally supports any number
of sinks. The question this plan addresses is **whether we should
actually wire a second backend**, and if so, **for what specific
gap**. The session report (§3.1) reframes this from "dual-export
decision" (implies the premise) to "where does Sentry fall short"
(makes the premise an explicit exploration output).

The exploration outputs feed this plan; the plan opens when an
exploration names a gap that outweighs operational cost.

## Domain Boundaries and Non-Goals

**In scope**:

- Candidate backend evaluation (Datadog, Honeycomb, NewRelic,
  Grafana+Loki+Tempo, self-hosted OTel collector → DIY).
- Scope selection: which emissions fan out to the second backend
  (all, or just the ones addressing the named gap).
- Cost / operational overhead assessment.
- Migration path if the second backend becomes primary.

**Out of scope (non-goals)**:

- Evaluating every backend — only those with plausible fit for the
  named gap.
- Replacing Sentry — unless the exploration concludes Sentry is the
  wrong primary (separate promotion).

## Dependencies and Sequencing

**Prerequisite**: one of:

- `docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md`
  output names a concrete gap with evidence (e.g. "Sentry logs cap
  at N/day; our projected volume is 5×N; logs go elsewhere").
- `docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md`
  output names a gap that PostHog addresses AND that the events-
  workspace alone can't bridge.

**Related**:

- ADR-162 (vendor-independence clause makes this lane viable).
- `observability/current/multi-sink-vendor-independence-conformance.plan.md`
  — the conformance test validates a second sink works without
  breaking the vendor-independence property.
- `observability/future/cost-and-capacity-telemetry.plan.md` —
  second backend adds cost.

## Success Signals

- The named Sentry gap is measurably closed by the chosen second
  backend (before/after metric).
- Operational overhead of the second backend is < the cost of the
  gap it closes.
- Vendor-independence conformance test still passes with multi-sink
  fan-out.

## Risks and Unknowns

- **Two-backend operational complexity.** Mitigation: promotion
  scope includes a concrete operational SLA for the second backend
  (who owns it, who responds to its alerts).
- **Redaction policy drift between backends.** Mitigation: ADR-160
  barrier applies upstream of all sinks; re-test at promotion.
- **Gap definition drifts during plan authorship.** Mitigation:
  promotion cites the specific exploration output paragraph that
  defines the gap; scope stays tied to that gap.

## Promotion Trigger

**Testable event**: an exploration document at
`docs/explorations/2026-04-18-how-far-does-sentry-go-as-paas.md` or
`docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md`
contains a named, evidence-backed gap in a paragraph that would be
quotable in the promotion's scope section.

**When triggered**: move to `current/`. Quote the gap; select
candidates; evaluate; decide.

## Implementation Sketch (for context, finalised at promotion)

- OTel-collector pattern as the sink-agnostic exporter.
- Second-sink adapter in `packages/libs/<vendor>-node/`.
- Events workspace emissions fan out; redaction barrier unchanged.
- Alert rules split per-backend where applicable.

## References

- ADR-162 (vendor-independence clause).
- Session report §3.1 + §3.3 (reframed framing).
- Exploration 1 (Sentry vs PostHog matrix).
- Exploration 2 (how far does Sentry go as PaaS).
- `sentry-observability-maximisation-mcp.plan.md § L-15` (project-
  thesis research output).
