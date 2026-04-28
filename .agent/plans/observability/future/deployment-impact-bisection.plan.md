---
name: "Deployment Impact Bisection"
status: strategic-brief
overview: >
  Strategic brief for automated release-over-release regression detection.
  Compares post-deploy error rate, latency distribution, and outcome-class
  distribution against baseline to flag regressions attributable to a
  specific commit. Depends on release linkage being stable
  (sentry-observability-maximisation-mcp.plan.md § L-7 post-close) and a
  manually-detected regression surfacing the need.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "L-7 release linkage stable (100 deploys logged) AND a regression attributed manually surfaces the need (a real incident where bisection would have saved time)."
---

# Deployment Impact Bisection

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: L-7 release linkage stable AND manual-regression-attribution event.

---

## Problem and Intent

Release linkage (per
[`sentry-observability-maximisation-mcp.plan.md § L-7`](../active/sentry-observability-maximisation-mcp.plan.md))
gives every event a `release` tag. That enables **manual** regression
attribution today — an engineer can filter events by release to find
"when did this error first appear". Automated bisection — "the
deploy at release X caused a 20% latency regression in tool Y" —
requires per-release distribution baselines and automated comparison.

The intent: open when release linkage is stable AND a real incident
shows that manual attribution was too slow.

## Domain Boundaries and Non-Goals

**In scope**:

- Per-release baseline capture (error rate, p50/p95/p99 latency per
  tool, outcome-class distribution).
- Automated release-over-release comparison.
- Regression alert shape (threshold, window, confidence).
- Canary-deploy integration (if Vercel deploys gain canary support).

**Out of scope (non-goals)**:

- Root-cause analysis (we flag regressions; human investigates).
- Automatic rollback — Sentry's release-rollback feature is a
  separate product decision.
- Code-level bisection (`git bisect`) — this plan operates at release
  granularity.

## Dependencies and Sequencing

**Prerequisite (both)**:

- L-7 release linkage closed and stable for ≥100 production deploys.
  Rationale: fewer than 100 deploys means baseline distributions are
  too noisy for bisection comparison.
- A real incident where manual release-attribution was slow enough
  that the responder flagged it as a time-sink.

**Related**:

- `sentry-observability-maximisation-mcp.plan.md § L-7` — release
  linkage foundation.
- `observability/future/slo-and-error-budget.plan.md` — burn-rate
  alerts complement bisection (SLO says "something's wrong"; bisection
  says "it started at this deploy").
- `observability/future/cost-and-capacity-telemetry.plan.md` — may
  consume per-release cost delta.

## Success Signals

- Regression-attributable incident time-to-resolution shortens
  measurably (baseline captured at promotion).
- False-positive regression alerts < 10% of total.
- Engineers trust the bisection signal enough to act on it without
  cross-referencing.

## Risks and Unknowns

- **Noisy baselines.** Mitigation: require minimum sample size per
  tool before including it in bisection; bounded-distribution
  thresholds.
- **Bisection alerts become noise if deploys are too frequent.**
  Mitigation: multi-release window (smoke, then 24h steady-state).
- **Multiple releases in one day complicate attribution.** Mitigation:
  promotion scope includes a decision on release-frequency caps or
  grouping.

## Promotion Trigger

**Testable events (both)**:

- L-7's release-count metric (in Sentry project settings) reaches
  100 production deploys.
- An incident log entry records "manual release attribution was the
  slowest step" (recorded in ops channel or issue).

**When triggered**: move to `current/`. Author comparison algorithm,
alert rules, integration tests.

## Implementation Sketch (for context, finalised at promotion)

- Sentry release-comparison query for per-release metrics.
- Alert rule: regression when rel[n] metric deviates >X% from rel[n-1]
  over rolling baseline.
- Integration test: synthetic regressions in CI fire the alert.

## References

- ADR-162 §Five Axes Engineering.
- Session report §2.3 gap item 12.
- `sentry-observability-maximisation-mcp.plan.md § L-7`.
