---
title: How Far Does Sentry Go As PaaS — Cross-Cutting Observability Capability Across the Five Axes
date: 2026-04-18
status: active
---

# How Far Does Sentry Go As PaaS

**Status**: Stub. This is one of the project's named **core research
theses** per the
[direction-setting session §3.3](./2026-04-18-observability-strategy-and-restructure.md#33-sentry-as-paas-exploration-is-a-core-thesis):

> We are also partly here to explore how far we can push Sentry in
> terms of providing cross-cutting observability for engineering,
> behaviour, product, security etc… this project is, in part, an
> exploration of a more integrated PaaS approach to full observability.

The research output is co-equal with production code. Full authorship
lands when the promotion trigger fires.

---

## 1. Problem statement

Observability stacks typically compose multiple specialist vendors
(error tracking, product analytics, session replay, feature flags,
SLO monitoring). The operational overhead is real: schema drift across
sinks, billing sprawl, on-call rotation confusion, inconsistent
correlation semantics.

Sentry has expanded substantially beyond its original error-tracking
brief. The hypothesis under test: **Sentry alone, configured
thoroughly, covers enough of the five-axis observability surface
([ADR-162](../architecture/architectural-decisions/162-observability-first.md))
that running a second specialist vendor is a deliberate marginal
addition rather than table stakes.**

If the hypothesis holds, the operational-simplicity win is
significant. If it does not hold, this exploration names precisely
which axes the second vendor must cover, turning a vague "we need
more tooling" into a surgical decision.

---

## 2. Scope (for full analysis when authored)

- Sentry capability coverage across each of the five axes at current
  product-tier feature set (as of authoring).
- Named gaps per axis: what Sentry does not do, cannot do at Oak's
  scale, or does but at unacceptable cost/complexity.
- Integration depth with Oak's existing estate (Cloudflare, GCP
  Logging, Vercel, Statuspage) — what Sentry's marketplace
  integrations cover cleanly and what requires custom adapter work.
- The "PaaS seam" analysis: which capabilities belong in the Sentry
  surface vs. which require a genuinely separate tool.

---

## 3. Research questions

1. For each of the five ADR-162 axes, does Sentry's current product
   surface cover the MVP question set named in the
   [high-level observability plan](../../.agent/plans/observability/high-level-observability-plan.md)?
2. Where Sentry covers an axis, is the coverage **native** (designed
   for the workload, efficient, well-documented) or **incidental**
   (technically possible, but awkward)?
3. Which of Oak's existing vendors (PostHog, Cloudflare, GCP Logging,
   Vercel, Statuspage) could Sentry displace cost-effectively, and
   which are load-bearing in a way Sentry cannot match?
4. What is the capability growth rate of Sentry's product over the
   last 24 months in each axis — is the hypothesis "Sentry is
   becoming the PaaS" observable in their shipping cadence?
5. Where does Sentry's cost model break down at Oak's expected
   emission volume (tool_invoked + search_query + widget_session_outcome
   combined)?
6. What does the vendor-independence adapter layer cost if we commit
   to Sentry primary but keep the option open?

---

## 4. Informs

- [ADR-162](../architecture/architectural-decisions/162-observability-first.md)
  — the principle this thesis is testing; findings inform whether
  the vendor-independence clause remains load-bearing long-term or
  becomes a historical artefact.
- [`future/second-backend-evaluation.plan.md`](../../.agent/plans/observability/future/second-backend-evaluation.plan.md)
  — a gap named here is a named-Sentry-gap that triggers that plan.
- Multiple
  [`future/`](../../.agent/plans/observability/future/) plans'
  promotion triggers — "first data-science request requiring X" is
  a weaker trigger than "this exploration identified X as Sentry-out-
  of-scope."
- [Exploration 1](./2026-04-18-sentry-vs-posthog-capability-matrix.md)
  — the PostHog comparison informs and is informed by this thesis.

---

## 5. Promotion trigger for full authorship

The exploration is authored in full **after at least L-1 through L-4b
of the maximisation plan have landed**, so the exploration can reference
Sentry capabilities exercised in production rather than Sentry
capabilities described on the marketing site. Earlier authorship risks
the exploration becoming a Sentry-docs rehash rather than a
capability-tested report.

Secondary trigger: **any post-launch observability decision that
requires a yes/no on a named Sentry capability** (e.g. "should we add
session replay?" — the answer depends on the Sentry session-replay
assessment this exploration will include).

---

## 6. References

- [Exploration 1](./2026-04-18-sentry-vs-posthog-capability-matrix.md) —
  side-by-side comparison.
- [Direction-setting session §3.3](./2026-04-18-observability-strategy-and-restructure.md#33-sentry-as-paas-exploration-is-a-core-thesis) —
  thesis framing.
- [ADR-162](../architecture/architectural-decisions/162-observability-first.md) —
  the principle this thesis tests.
- Sentry product documentation — to be cited at authoring time
  against the then-current product surface.
