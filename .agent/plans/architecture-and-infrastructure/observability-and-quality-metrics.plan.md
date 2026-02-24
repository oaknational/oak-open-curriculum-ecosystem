---
name: Observability and Quality Metrics
overview: >
  Establish comprehensive observability (logging, monitoring, alerting) and
  quality metrics tracking as pre-beta gates for production readiness.
todos:
  - id: scope-definition
    content: "Define the full scope: logging, monitoring, alerting, quality metrics dashboards."
    status: pending
  - id: logging-standards
    content: "Establish structured logging standards and verify Sentry integration completeness."
    status: pending
  - id: quality-metrics
    content: "Implement tracking for duplication rate, complexity trends, change failure rate."
    status: pending
  - id: alerting
    content: "Define alerting thresholds and notification channels for production services."
    status: pending
---

# Observability and Quality Metrics

## Intent

Establish production-grade observability and systematic quality metrics tracking before the repository exits public alpha and enters public beta. This covers logging, monitoring, alerting, and codebase health metrics.

## Milestone Position

This plan is a **pre-beta gate** — observability and quality metrics must be operational before public beta. See the [high-level plan](../high-level-plan.md) Milestone 3.

## Why This Matters

AI-augmented development increases change volume. Without systematic metrics, the codebase can drift into "fast but fragile" without anyone noticing. Industry evidence supports tracking quality metrics alongside velocity metrics to detect this drift early.

Research: [Augmented Engineering Practices](../agentic-engineering-enhancements/augmented-engineering-practices.research.md) — Part 13 (metrics and monitoring), Part 7 (quality gates).

## Scope

### Observability (production services)

- **Logging**: Structured logging standards, log levels, redaction of sensitive data (existing work in `header-redaction.ts`), correlation IDs
- **Monitoring**: Sentry error tracking (existing), uptime monitoring, performance baselines
- **Alerting**: Error rate thresholds, latency thresholds, notification channels

### Quality Metrics (codebase health)

| Metric | Why it matters | How to track |
|---|---|---|
| Test coverage (with caution) | Baseline signal, not sufficient alone | Vitest coverage reports in CI |
| Mutation score | Measures test effectiveness | Stryker (see [mutation testing plan](../agentic-engineering-enhancements/mutation-testing-implementation.plan.md)) |
| Duplication rate | AI repetition is a long-term maintainability tax | Knip / custom analysis |
| Complexity trends | AI can accrete complexity quickly | ESLint complexity rules trending |
| Change failure rate | Catches "fast but fragile" dynamics | CI failure rate tracking |
| Security findings trend | Ensures risk doesn't silently rise | Dependency scanning trends |

### Current State

- Sentry is configured for runtime error tracking and performance monitoring
- Structured logging exists via `@oaknational/mcp-logger`
- Header redaction is implemented for sensitive HTTP headers
- No systematic quality metrics dashboards exist
- No alerting thresholds are defined

## Phases (to be detailed when promoted to active)

1. **Audit**: Catalogue existing observability capabilities, identify gaps
2. **Logging standards**: Formalise and enforce structured logging across all services
3. **Quality metrics pipeline**: Implement CI-based metrics collection and trend tracking
4. **Alerting**: Define thresholds and wire notifications
5. **Dashboard**: Create visibility into quality trends over time
