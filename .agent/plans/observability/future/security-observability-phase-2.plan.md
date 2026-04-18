---
name: "Security Observability Phase 2"
status: strategic-brief
overview: >
  Strategic brief for Phase-2 security observability building on the MVP
  security-observability.plan.md — Cloudflare integration (ingesting
  transport-layer events app-side for correlation), static-analysis
  augmentation (SonarCloud, Github Advanced Security, code decoration),
  and expanded app-level security signal. Promotion requires exploration 6
  (Cloudflare+Sentry) and/or exploration 7 (static analysis) to conclude,
  or a real app-level security incident.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "Exploration 6 conclusions (docs/explorations/2026-04-18-cloudflare-plus-sentry-security-observability.md) OR exploration 7 conclusions (docs/explorations/2026-04-18-static-analysis-augmentation.md) OR first app-level security incident."
---

# Security Observability Phase 2

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: exploration 6 OR 7 conclusions OR first app-level security incident.

---

## Problem and Intent

The MVP security observability plan (per
[`security-observability.plan.md`](../current/security-observability.plan.md))
covers the narrowest launch scope: `auth_failure` +
`rate_limit_triggered` events emitted at the app boundary. Phase 2
expands based on exploration outputs: where Cloudflare transport-layer
signal can complement app-layer telemetry, whether static analysis
integrations (SonarCloud, Github Advanced Security, code decoration)
improve the security signal, and whether additional app-level events
(privilege changes, session-lifecycle anomalies) are warranted.

## Domain Boundaries and Non-Goals

**In scope**:

- Cloudflare event ingestion and correlation with app-layer events
  (joint trace IDs, shared correlation keys).
- Static analysis tooling integration: SonarCloud configuration,
  Github Advanced Security gap closure, source-code decoration that
  improves scanner signal.
- Additional app-level security events if exploration output
  identifies valuable new categories.
- Alert-rule refinement for security axis (out of MVP scope).

**Out of scope (non-goals)**:

- Content Security Policy / Subresource Integrity rollout — separate
  plan.
- Supply-chain attack detection — separate plan.
- Vulnerability management — git-leaks + Dependabot already cover.

## Dependencies and Sequencing

**Prerequisite (any of three)**:

- `docs/explorations/2026-04-18-cloudflare-plus-sentry-security-observability.md`
  concludes with a named integration recommendation.
- `docs/explorations/2026-04-18-static-analysis-augmentation.md`
  concludes with a named tool recommendation (SonarCloud adoption,
  code-decoration pattern).
- A recorded app-level security incident (attempted exploit, auth
  pattern anomaly, data-exposure near-miss) that the MVP observability
  could not detect or attribute.

**Related**:

- `observability/current/security-observability.plan.md` — MVP
  baseline this plan builds on.
- `observability/future/feature-flag-provider-selection.plan.md` —
  if provider has security-event analytics, integrates here.
- `observability/future/second-backend-evaluation.plan.md` —
  Cloudflare ingest may naturally land in a different sink.

## Success Signals

- Cloudflare + app correlation answers "is this attacker bot traffic
  or legitimate user" from the app side.
- Static analysis integration closes a measured signal gap (tracked
  defect class lands).
- Additional security events are actionable (runbook per category).

## Risks and Unknowns

- **Cloudflare data volume may require sampling.** Mitigation: sampling
  at ingest; full data retention via Cloudflare's own product.
- **Static analysis tooling introduces its own noise.** Mitigation:
  promotion scope includes a noise-vs-signal tuning window.
- **Exploration outputs may conclude "no, not worth it".** Mitigation:
  valid outcome; plan archives with the rationale recorded.

## Promotion Trigger

**Testable events**:

- An exploration document (paths above) contains a "Recommendation"
  or "Conclusion" section with a specific named integration.
- An incident log entry flags a security observation gap.

**When triggered**: move to `current/`. Scope is determined by which
trigger fired (Cloudflare-integration scope vs static-analysis scope
vs additional-event-type scope); sub-divisions are acceptable.

## Implementation Sketch (for context, finalised at promotion)

Depending on which trigger fired:

- Cloudflare integration: webhook or batch ingest into the events
  workspace `cloudflare_event` schema; correlation on `correlation_id`.
- Static analysis: SonarCloud project + GitHub Action integration;
  baseline scan; review loop for SonarCloud findings routed through
  existing reviewer discipline.
- Additional event types: new schemas in events workspace; emission
  sites wired per type.

## References

- ADR-162 §Five Axes Security.
- ADR-158 (multi-layer security; Cloudflare is the transport layer).
- Session report §2.3 gap item 8 + §3.11.
- `observability/current/security-observability.plan.md`.
- Exploration 6 (Cloudflare + Sentry).
- Exploration 7 (static analysis augmentation).
