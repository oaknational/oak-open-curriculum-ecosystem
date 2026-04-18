---
title: Sentry vs PostHog Capability Matrix — Where Each Wins, Where Each Falls Short Across the Five Axes
date: 2026-04-18
status: active
---

# Sentry vs PostHog Capability Matrix

**Status**: Stub. Problem statement and research questions authored in
Phase 3 of the
[observability strategy restructure](../../.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md).
Full analysis authored when the promotion trigger fires
(see below).

---

## 1. Problem statement

Oak's observability stack is currently fragmented across multiple
vendors ([direction-setting session §1](./2026-04-18-observability-strategy-and-restructure.md#related-infrastructure-at-oak-session-confirmed)):
Sentry for engineering observability on this project; PostHog as the
primary product-analytics tool for the principal Oak product; Cloudflare,
GCP Logging, Vercel observability, and Atlassian Statuspage covering
adjacent concerns.

The direction-setting session
[§3.3](./2026-04-18-observability-strategy-and-restructure.md#33-sentry-as-paas-exploration-is-a-core-thesis)
and [§3.6](./2026-04-18-observability-strategy-and-restructure.md#36-posthog-vs-sentry-research)
name the research question: what does Sentry do well, what does
PostHog do well, where does each fall short, and where does the
five-axis MVP land each vendor.

This exploration is the evidence base that will inform
[`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
and the L-15 reframe in
[`active/sentry-observability-maximisation-mcp.plan.md`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md).

---

## 2. Scope (for full analysis when authored)

- Side-by-side feature matrix across the five ADR-162 axes
  (engineering, product, usability, accessibility, security).
- Per-axis verdict: Sentry, PostHog, both, or neither.
- Integration cost of adding PostHog as a second sink via the
  vendor-independence adapter (see exploration 8).
- Cost/complexity implications of running both.
- Oak-specific constraints (PostHog is already live for the principal
  product; adoption path matters).

---

## 3. Research questions

1. Which product-axis questions from the MVP set
   ([exploration 4 §4.3](./2026-04-18-structured-event-schemas-for-curriculum-analytics.md#43-categorical-axis-vocabulary--which-curriculum-axes-matter))
   does Sentry's product-analytics surface answer well, and which
   require PostHog-shaped capability?
2. Does Sentry's session-replay capability cover the usability-axis
   needs, or is PostHog's session-replay materially different?
3. How do the feature-flag / experimentation surfaces compare for
   Oak's expected A/B experiment volume
   ([`future/feature-flag-provider-selection.plan.md`](../../.agent/plans/observability/future/feature-flag-provider-selection.plan.md))?
4. What is the minimal additional field set the event-schema workspace
   would need to produce PostHog-native `capture()` payloads without
   Sentry-specific coupling (see exploration 8)?
5. Which vendor's alerting + anomaly-detection capability is stronger
   for Oak's expected signal volume?
6. What are the licence-cost and data-residency implications of
   emitting identical structured events to both?

---

## 4. Informs

- [`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
  — promotion trigger is "specific Sentry gap requires it (named in
  the exploration output)."
- [`active/sentry-observability-maximisation-mcp.plan.md § L-15`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — reframes from vendor-count decision to named-capability
  research output.
- [ADR-162](../architecture/architectural-decisions/162-observability-first.md)
  — vendor-independence clause presumes a concrete second-vendor
  sanity check; this exploration is it.

---

## 5. Promotion trigger for full authorship

The exploration is authored in full when **any one of** the following
fires:

- A data-scientist-named question cannot be answered from the MVP
  event schemas as ingested by Sentry alone, and PostHog is the
  candidate second sink.
- A specific Sentry limitation (feature missing, licence tier
  prohibitive, capability gap named by exploration 2 on Sentry-as-PaaS)
  is identified.
- The multi-sink vendor-independence conformance test
  (exploration 8) uncovers a mapping gap that would be trivially
  closed by naming the second vendor.

Until a trigger fires, the exploration is held open at stub status.

---

## 6. References

- [Exploration 2](./2026-04-18-how-far-does-sentry-go-as-paas.md) —
  Sentry-as-PaaS thesis research.
- [Exploration 8](./2026-04-18-vendor-independence-conformance-test-shape.md) —
  conformance test that proves the adapter shape.
- [Direction-setting session §3.6](./2026-04-18-observability-strategy-and-restructure.md#36-posthog-vs-sentry-research) —
  research question framing.
