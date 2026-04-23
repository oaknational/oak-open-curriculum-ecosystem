---
title: Cloudflare Plus Sentry Security Observability — What the App Layer Adds Above the Edge
date: 2026-04-18
status: active
---

# Cloudflare Plus Sentry Security Observability

**Status**: Stub. Informs the MVP scope of
[`current/security-observability.plan.md`](../../.agent/plans/observability/current/security-observability.plan.md)
and the promotion trigger of
[`future/security-observability-phase-2.plan.md`](../../.agent/plans/observability/future/security-observability-phase-2.plan.md).
Full analysis authored when the promotion trigger fires.

---

## 1. Problem statement

Per the [direction-setting session §3.11](./2026-04-18-observability-strategy-and-restructure.md#311-security-observability-lightly-scoped):

> Security observability can be lightly scoped, and largely this will
> be handled at the Cloudflare level rather than the application or
> hosting level, at least for traffic/bots/attacks.

The MVP security-axis scope is therefore application-layer only
(`auth_failure`, `rate_limit_triggered` events). Transport / bot /
DDoS observability is explicitly Cloudflare's responsibility.

The research question: **where does Cloudflare's edge-layer signal end
and where does the app layer need to supplement?** A well-designed
security-observability posture needs both layers aware of each other;
duplicating effort is waste, leaving gaps is risk.

Secondary research question: **what Sentry ↔ Cloudflare integrations
exist** (shared context, co-triage, trace propagation from edge to app)
that Oak should adopt or decline?

---

## 2. Scope (for full analysis when authored)

- Cloudflare's edge-observable signal set (WAF events, bot challenge
  outcomes, rate-limit-at-edge triggers, TLS / certificate events,
  geographic access patterns).
- Oak's application-observable signal set (`auth_failure`,
  `rate_limit_triggered` post-edge, API errors with security semantics,
  anomalous access patterns only detectable after auth).
- Signal overlap and gap matrix.
- Available Cloudflare ↔ Sentry integrations (context sharing, trace
  propagation, alert correlation).
- Recommendations for the app-layer security-observability scope.

---

## 3. Research questions

1. For each of the [CWE Top 25](https://cwe.mitre.org/top25/) relevant
   to Oak's MCP surface, which layer (Cloudflare, app, neither)
   provides the primary signal?
2. Does Cloudflare expose per-rate-limit events (the edge-level
   events) to Sentry or another app-accessible surface, and if so,
   does Oak need to re-emit them from the app layer or simply join
   them in post-analysis?
3. Is there a Cloudflare-provided trace-context mechanism that
   propagates into application telemetry (so an edge-blocked request
   can be correlated with Oak's app-layer view when the request makes
   it through)?
4. What app-layer anomaly-detection patterns are complementary to
   Cloudflare's (e.g. credential-stuffing patterns visible only
   post-auth; session-anomaly detection requiring authenticated
   context)?
5. Does the adoption of `@cloudflare/sentry-cli` (or equivalent) for
   edge-log forwarding to Sentry add meaningful signal or duplicate
   Cloudflare's own dashboard surface at cost?
6. Where does the redaction barrier ([ADR-160](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md))
   need extending to cover fields Cloudflare-originated telemetry
   surfaces (e.g. Cloudflare's own request IDs are non-Oak-controlled
   identifiers)?

---

## 4. Informs

- [`current/security-observability.plan.md`](../../.agent/plans/observability/current/security-observability.plan.md)
  — MVP scope is app-layer only; this exploration confirms or
  narrows the boundary.
- [`future/security-observability-phase-2.plan.md`](../../.agent/plans/observability/future/security-observability-phase-2.plan.md)
  — promotion trigger is "exploration 6 or 7 conclusions"; this is
  exploration 6.
- [Exploration 7](./2026-04-18-static-analysis-augmentation.md) —
  complementary layer; together they define the post-MVP security
  posture.

---

## 5. Promotion trigger for full authorship

The exploration is authored in full **when any one of** the following
fires:

- First app-level security incident where the layer-responsibility
  question is material to the post-incident review.
- A Cloudflare configuration change that alters the edge-observable
  signal set materially.
- A Sentry + Cloudflare integration product announcement that makes
  the capability matrix substantively different from the current
  assessment.

Until then, the exploration remains a focused brief.

---

## 6. References

- [Direction-setting session §3.11](./2026-04-18-observability-strategy-and-restructure.md#311-security-observability-lightly-scoped)
  — owner framing.
- [`current/security-observability.plan.md`](../../.agent/plans/observability/current/security-observability.plan.md)
  — the plan this exploration scopes.
- [Exploration 7](./2026-04-18-static-analysis-augmentation.md) —
  static-analysis complement.
- Cloudflare + Sentry integration documentation — cited at authoring
  time.
- [ADR-160](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md) —
  redaction constraints that extend to Cloudflare-sourced telemetry.

(External Cloudflare and Sentry integration URLs are un-verified at
brief-authoring time; authoring-time verification required.)
