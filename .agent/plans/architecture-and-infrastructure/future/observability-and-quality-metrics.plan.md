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
    status: in_progress
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

## Value Target

The immediate value is practical, not ornamental:

1. operators should be able to diagnose failures in the HTTP MCP server and
   Search CLI quickly,
2. releases should carry enough redacted evidence to support confident public
   alpha operation, and
3. observability must improve supportability without creating a new privacy or
   payload-capture risk.

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

The immediate risk is operational blindness in public alpha: failures become
hard to triage, support load compounds, and release confidence falls. The
longer-term risk is losing visibility into maintainability trends as change
volume rises.

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

## Current State (verified 2026-03-28)

- Structured OpenTelemetry JSON logging exists via `@oaknational/logger`
  (ADR-051)
- The logger foundation rewrite is complete in the active child plan; the
  previous `stdoutSink` / `fileSink` model has been replaced by the coherent
  `readonly LogSink[]` fan-out contract
- The active child plan now reflects the pushed Phase 1 foundation state on
  `feat/full-sentry-otel-support` through `44d8d74d`. Runtime adoption is the
  active execution step now that the clean handover confirmation rerun is
  recorded in the checkpoint
- No runtime adoption is complete yet in the HTTP MCP server or Search CLI,
  so the public-alpha supportability value has not been realised yet
- Shared telemetry redaction now exists in `@oaknational/observability`; live
  runtime adoption and evidence collection remain the unfinished steps
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
