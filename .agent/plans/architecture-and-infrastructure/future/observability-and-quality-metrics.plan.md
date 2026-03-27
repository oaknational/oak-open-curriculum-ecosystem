---
name: Observability and Quality Metrics
overview: >
  Establish Oak's production-grade observability and quality-metrics posture.
  The first required slice is the Sentry and OpenTelemetry foundation for the
  HTTP MCP server and Search CLI; later slices extend this into alerting,
  quality dashboards, and longer-horizon operational metrics.
todos:
  - id: sentry-foundation
    content: "Deliver the Sentry and OpenTelemetry foundation through the active child execution plan for the HTTP MCP server and Search CLI"
    status: pending
  - id: logging-standards
    content: "Converge on enforced structured logging, redaction, and trace-correlation standards"
    status: pending
  - id: quality-metrics
    content: "Implement tracking for duplication rate, complexity trends, and change failure rate"
    status: pending
  - id: alerting
    content: "Define alerting thresholds and notification channels for production services"
    status: pending
---

# Observability and Quality Metrics

## Role

This is the strategic umbrella plan for observability in the
`architecture-and-infrastructure` collection. It lives in `future/` because it
describes later-phase sequencing and ownership boundaries; live execution
belongs in the active child plan.

## Intent

Establish production-grade observability and systematic quality metrics tracking
as a supportability foundation for Oak's public alpha and as an operational
hardening layer for public beta.

## Milestone Position

This plan now spans two milestone responsibilities:

1. **Milestone 2 (Open Public Alpha)** — the Sentry and OpenTelemetry
   foundation is a blocker
2. **Milestone 3 (Public Beta)** — broader alerting, operational metrics, and
   quality-trend surfaces remain pre-beta hardening work

## Why This Matters

AI-augmented development increases change volume. Without systematic
observability and quality metrics, the codebase can drift into "fast but
fragile" without anyone noticing.

The immediate risk is operational blindness in public alpha. The longer-term
risk is losing visibility into maintainability trends as change volume rises.

## Scope

### Foundation Observability (M2 blocker)

- coherent structured logging
- telemetry redaction
- handled-error capture
- trace/log correlation
- Sentry runtime integration
- MCP Insights wrapping and capture policy
- release/source-map verification

Authoritative execution source:
[sentry-otel-integration.execution.plan.md](../active/sentry-otel-integration.execution.plan.md)

Status note:
the foundation slice has been promoted into the active child plan and is the
immediate execution focus, but it must stay `pending` here until runtime
implementation, evidence, and deployment verification are actually complete.

### Extended Observability and Quality Metrics (M3 hardening)

- alerting thresholds and notification channels
- uptime and baseline operational monitoring
- change-failure and complexity trend tracking
- duplication and quality-regression signals
- quality and support dashboards

## Current State (verified 2026-03-27)

- Structured OpenTelemetry JSON logging exists via `@oaknational/logger`
  (ADR-051)
- The logger foundation now requires a deeper rewrite than the previous
  `stdoutSink` / `fileSink` model can support cleanly
- No shared Sentry runtime integration is yet complete
- Header redaction exists, but shared telemetry redaction does not
- Quality metrics dashboards are not yet implemented
- The active Sentry + OTel foundation workstream now has a dedicated prompt and
  active execution lane to survive session compression cleanly
- The umbrella observability plan now lives in `future/` as the strategic
  parent plan; the live execution work is isolated in the active child plan

## Phase Order

1. **Sentry and OpenTelemetry foundation** — blocker for M2
2. **Logging standards convergence** — shared policy, usage, and enforcement
3. **Alerting baseline** — service health and abuse/supportability signals
4. **Quality metrics pipeline** — maintainability trends and code-health
   visibility
5. **Dashboards and reporting** — sustained operational and engineering
   visibility
