---
name: "Cross-System Correlated Tracing"
status: strategic-brief
overview: >
  Strategic brief for correlating traces across the Search CLI + HTTP MCP
  server + upstream Oak curriculum API + Elasticsearch + downstream
  analytics. Each system today captures its own traces; cross-system
  correlation currently requires manual trace-id stitching or entirely
  separate investigations.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "A debug session shows the gap explicitly (incident or triage where cross-system trace continuity would have shortened time-to-resolve) OR Search CLI observability merged AND a cross-system incident occurs."
---

# Cross-System Correlated Tracing

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: debug session exposes cross-system trace-continuity gap OR Search CLI observability merged AND a cross-system incident occurs.

---

## Problem and Intent

Oak's observability today has good intra-system tracing (MCP server
`wrapMcpServerWithSentry`; Search CLI Sentry runtime; ES `took`
capture). Cross-system trace continuity — a single trace ID flowing
from an MCP tool call through the curriculum SDK, the Oak API, and
Elasticsearch, with spans correlated in one timeline — is not wired.

The intent: when a debug session surfaces the gap, open this plan as
the decision lane for whether to propagate trace context across every
boundary (including security-sensitive ones per
`docs/explorations/2026-04-18-trust-boundary-trace-propagation-risk-analysis.md`)
and how to wire it.

## Domain Boundaries and Non-Goals

**In scope**:

- Trace propagation over HTTP boundaries (MCP ↔ curriculum API ↔ ES).
- Correlation-ID contract (trace_id format, parent-span header shape).
- Trust-boundary allow/deny list per host (cross-ref exploration 5).
- Cross-system trace stitching in Sentry's UI (if Sentry-native) or
  in an ad-hoc tool (if multi-backend).

**Out of scope (non-goals)**:

- Propagation into third-party services we do not control.
- Distributed tracing backend selection — owned by
  `second-backend-evaluation.plan.md`.
- Performance optimisation based on cross-system traces — downstream
  consequence, separate lane.

## Dependencies and Sequencing

**Prerequisite (either)**:

- An incident or debug session where cross-system trace continuity
  would have shortened time-to-resolve. The incident is the evidence.
- Search CLI observability merged (gives us two observed systems
  operating on the same Elasticsearch cluster; the shared backend
  creates the first natural trace-stitching use case).

**Related**:

- `sentry-observability-maximisation-mcp.plan.md § L-14` — trust-
  boundary trace propagation decision (currently decision-only per
  A.3; wiring is post-MVP → this plan owns the wiring).
- `docs/explorations/2026-04-18-trust-boundary-trace-propagation-risk-analysis.md` — informs allow/deny list.

## Success Signals

- Engineer can click through from an MCP error in Sentry to the
  upstream curriculum API span that caused it, in one UI.
- Search latency regressions attributed to ES vs SDK vs handler in
  a single dashboard view.
- Incident mean-time-to-resolve measurably shorter for cross-system
  issues after promotion.

## Risks and Unknowns

- **Trace propagation across trust boundaries may leak context.**
  Mitigation: exploration 5 produces the allow/deny list with
  security review; wiring respects it.
- **Propagation to the curriculum API requires upstream cooperation.**
  Mitigation: OTel-compliant W3C traceparent header is the standard;
  if the upstream does not propagate, we capture the boundary and
  continue trace in our system only.
- **ES propagation may not survive the Oak-vs-generic ES client split.**
  Mitigation: test coverage at the SDK boundary; regression fails
  loud.

## Promotion Trigger

**Testable events**:

- A recorded incident (in the ops log or in an issue) where "trace
  continuity would have shortened resolution time" is explicitly
  called out by the responder.
- Alternative: Search CLI observability plan lands AND an incident
  occurs that spans both systems.

**When triggered**: move to `current/`; author decisions on
propagation scope, allow/deny list, and wiring path.

## Implementation Sketch (for context, finalised at promotion)

- W3C `traceparent` header propagation from MCP server outbound.
- Curriculum SDK decorated to forward active span.
- ES client decorated for dependency-span capture.
- Trust-boundary policy drives which hosts receive propagation
  headers.

## References

- ADR-162 §Five Axes Engineering axis.
- Session report §2.3 gap item 13.
- `sentry-observability-maximisation-mcp.plan.md § L-14`.
- Exploration 5 (trust-boundary trace propagation).
