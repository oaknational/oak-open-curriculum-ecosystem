---
name: "Feature-Flag Provider Selection"
status: strategic-brief
overview: >
  Strategic brief for selecting and wiring a feature-flag provider (Sentry
  feature-flag integration, LaunchDarkly, GrowthBook, OpenFeature + adapter)
  when the first actual use case (A/B experiment or feature gate) arrives.
  Today's feature-flag scaffolding in L-10 is TSDoc-stub-only per A.3
  decisions; no real flag is wired.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "First A/B experiment proposed OR first feature-flag-using feature lands."
---

# Feature-Flag Provider Selection

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: first A/B experiment proposed OR first feature-flag-using feature lands.

---

## Problem and Intent

Feature-flag integration is scaffolded in
[`sentry-observability-maximisation-mcp.plan.md § L-10`](../active/sentry-observability-maximisation-mcp.plan.md)
at TSDoc-stub level per Appendix A.3 decisions. The stub exists so the
extension point is documented; no real flag is wired because there is
no use case. This plan sits in wait.

The intent is: when a real use case emerges, this plan becomes the
decision lane for which provider to adopt, how emissions and analytics
integrate, and what the observability surface looks like.

## Domain Boundaries and Non-Goals

**In scope**:

- Provider evaluation (Sentry feature-flag integration vs LaunchDarkly
  vs GrowthBook vs OpenFeature + adapter).
- Flag-evaluation emission wiring (flag-evaluated event: flag name,
  variant, evaluation context categorical axes).
- Integration with Sentry's feature-flag product for crash-linked
  flag context.
- A/B test cohort attribution for the product-axis events
  (`tool_invoked`, `search_query`, etc.).

**Out of scope (non-goals)**:

- Business decisions about what to experiment on.
- Flag-naming governance — separate discipline when volume grows.

## Dependencies and Sequencing

**Prerequisite**: one of two events occurs — (a) owner or product
proposes an A/B experiment with a concrete hypothesis and control/treatment
definition, or (b) a feature lands that requires a flag (e.g.
progressive rollout, canary).

**Related**:

- `observability-events-workspace.plan.md` — adds
  `flag_evaluated` schema when this plan promotes.
- `sentry-observability-maximisation-mcp.plan.md § L-10` — current
  scaffolding; replaced when this plan promotes.
- `docs/explorations/2026-04-18-sentry-vs-posthog-capability-matrix.md`
  — informs provider choice.

## Success Signals

- Product owner can gate a feature release behind a flag without
  needing engineering support for each flip.
- A/B test outcomes are attributable to product-axis events via the
  cohort tag.
- Flag-evaluation volume and latency are observable.

## Risks and Unknowns

- **Vendor lock-in risk contradicts ADR-162 vendor-independence.**
  Mitigation: OpenFeature abstraction as adapter surface; provider is
  a configuration detail per ADR-154.
- **Flag-attribution state may leak across requests if stored in
  module-level singletons.** Mitigation: per-request DI per ADR-078.
- **Provider-specific billing shapes vary.** Mitigation: out of scope
  for this plan; owner decision at promotion.

## Promotion Trigger

**Testable event (either)**:

- A product-owner-authored design doc proposes an A/B experiment with
  concrete hypothesis, control, and treatment.
- A PR lands that introduces a config path requiring feature-flag
  evaluation at runtime.

**When triggered**: this plan moves to `current/`. Author a trade-off
table (Sentry integration vs LaunchDarkly vs GrowthBook vs OpenFeature);
decide with owner; wire the flag-evaluation emission.

## Implementation Sketch (for context, finalised at promotion)

- OpenFeature SDK as the boundary; provider implementation behind
  adapter per ADR-154.
- Events workspace extended with `flag_evaluated` schema.
- Sentry feature-flag integration wired for crash-context linkage
  (regardless of provider chosen above).

## References

- ADR-162 §Five Axes (product + usability axes consume flag cohort).
- Session report §2.3 gap item 3.
- `sentry-observability-maximisation-mcp.plan.md § L-10` (current
  scaffolding).
- ADR-154 (framework/consumer separation — the abstraction discipline).
