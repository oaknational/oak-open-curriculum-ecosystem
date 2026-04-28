---
title: Trust-Boundary Trace Propagation Risk Analysis — Per-Host Allow/Deny Decisions
date: 2026-04-18
status: active
---

# Trust-Boundary Trace Propagation Risk Analysis

**Status**: Stub. Informs L-14 of the maximisation plan; full analysis
authored when the L-14 lane opens or earlier if a propagation incident
surfaces.

---

## 1. Problem statement

OpenTelemetry trace propagation forwards `traceparent` and `tracestate`
headers across service boundaries so distributed tracing can reconstruct
a request's full path. The default Oak posture is
**deny-by-default propagation**: headers are only forwarded to explicitly
allowed hosts. This prevents internal trace IDs from leaking into
third-party logs and prevents upstream systems from injecting trace IDs
back into Oak's flow.

L-14 of the
[maximisation plan](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
is the decision lane for trace propagation. The design question:
**for each outbound-request host the MCP server or Search CLI talks to,
is trace propagation allowed, denied, or conditional?**

Host categories in scope:

- **Oak's own API** (`open-api.thenational.academy` via the SDK).
- **Clerk** (authentication / token introspection).
- **Elasticsearch** (search retrieval — CLI and HTTP).
- **Cloudflare** (edge — not directly called; transit only).
- **Sentry** (telemetry destination — different concern; the Sentry
  SDK handles its own transport).
- **MCP client hosts** (Claude Code, ChatGPT, other — inbound, not
  outbound; separate concern).

---

## 2. Scope (for full analysis when authored)

Per-host analysis with the following structure:

- **Trust posture**. Is the host Oak-controlled, Oak-tenant (vendor but
  Oak's instance), or third-party?
- **Data-flow direction**. Inbound, outbound, bidirectional.
- **Information leakage risk**. Can the `traceparent` ID be correlated
  with Oak-internal telemetry by a sufficiently motivated attacker with
  access to the host's logs?
- **Debugging value**. Does end-to-end propagation to this host enable
  diagnostic scenarios we cannot diagnose otherwise?
- **Recommendation**. Allow, deny, or conditional (e.g. allow only in
  non-production environments).

---

## 3. Research questions

1. Does Sentry's own cross-service trace stitching require
   `traceparent` forwarding to non-Sentry hosts, or does Sentry
   reconstruct chains from its own SDK telemetry at each hop
   independently?
2. Is Clerk's token-introspection endpoint a trace-propagation
   allow-case (we want to see Clerk's internal latency in our traces)
   or a deny-case (Clerk's internal IDs should not surface in Oak
   logs)?
3. For Elasticsearch (Oak-controlled tenant), does propagation
   meaningfully improve diagnosis of slow queries, or is the
   ES-side `took` field sufficient?
4. What is the actual mechanism by which `SENTRY_MODE=off` (the
   vendor-independence clause) interacts with propagation — do the
   headers still emit, or does the absence of `@sentry/node/preload`
   disable propagation entirely?
5. If propagation is enabled for Oak API, what response-time-
   sensitive consequences should we expect (measurable latency
   added, log volume at the API side)?
6. Does Cross-Site Scripting Inclusion (XSLeak) via trace-header
   inspection apply here, and if so, does deny-by-default sufficiently
   mitigate?

---

## 4. Informs

- [`active/sentry-observability-maximisation-mcp.plan.md § L-14`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — decision-lane output.
- [`future/cross-system-correlated-tracing.plan.md`](../../.agent/plans/observability/future/cross-system-correlated-tracing.plan.md)
  — if the exploration's recommendations enable end-to-end tracing,
  this plan is the operational follow-on.
- [ADR-161](../architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)
  — test-environment propagation invariants; explorations must not
  require network calls in CI.

---

## 5. Promotion trigger for full authorship

The exploration is authored in full when **L-14 opens** (per the
maximisation plan's lane sequencing), or **sooner if**:

- A cross-system incident surfaces where end-to-end tracing would
  have materially sped diagnosis.
- A compliance question arises about `traceparent` IDs in third-party
  logs.

---

## 6. References

- [OpenTelemetry W3C Trace Context specification](https://www.w3.org/TR/trace-context/) —
  cited at authoring time against current spec version.
- [Sentry tracing + propagation documentation](https://docs.sentry.io/platforms/javascript/tracing/) —
  cited at authoring time against current SDK docs.
- [ADR-143](../architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md) —
  the fan-out context for propagation decisions.
- [ADR-161](../architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md) —
  CI-boundary constraint.

(External URLs cited here are un-verified at brief-authoring time;
authoring-time verification required.)
