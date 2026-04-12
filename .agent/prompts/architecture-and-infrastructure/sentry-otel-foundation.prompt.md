---
prompt_id: architecture-sentry-otel-foundation
title: "Sentry + OpenTelemetry Foundation Session Entry Point"
type: handover
status: active
last_updated: 2026-04-12
---

# Sentry + OpenTelemetry Foundation — Session Entry Point

## What this branch does

Branch `feat/otel_sentry_enhancements` continues the production
observability foundation so the HTTP MCP server and Search CLI are
diagnosable during open public alpha. It is a **Milestone 2 blocker**.
The original branch `feat/full-sentry-otel-support` merged as PR #73.

The branch rewrites the logger around a coherent `LogSink[]` fan-out
model, adds three shared packages (`@oaknational/sentry-node`,
`@oaknational/sentry-mcp`, `@oaknational/observability`), and wires the
HTTP MCP server for Sentry-backed error capture, structured logging via
the `Sentry.logger.*` API, metadata-only MCP observations, targeted
manual spans, and a three-mode kill switch (`off`/`fixture`/`sentry`).
All telemetry passes through a shared redaction barrier before leaving
the process.

See [ADR-143](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
for the architectural decision.

## Current State (2026-04-12)

PR #73 **MERGED** to main (2026-03-31). Rate limiting **COMPLETE**
(ADR-158). Continuation branch: `feat/otel_sentry_enhancements`.

### Completed

- Phase 3 HTTP adoption (PR #73) — all 21 findings, C1/C2 regex,
  ADR-143, cleanup resilience, multi-layer security architecture
- Rate limiting (ADR-158) — `express-rate-limit` on 6 routes, 3
  profiles, `trust proxy` configured
- **Search CLI adoption** (2026-04-12) — 10-step TDD implementation,
  22 new tests (999 total), 7 reviewer passes, all findings addressed.
  `pnpm check` 88/88 green. All 6 critical gaps closed.

- **Sentry credential provisioning** (2026-04-12b) — local `.env.local`
  configured for both apps. Vercel dashboard credentials pending.
  Org: `oak-national-academy`, region: `de.sentry.io`.

### What comes next

1. **Vercel credential provisioning** — set `SENTRY_MODE`, `SENTRY_DSN`,
   `SENTRY_TRACES_SAMPLE_RATE` on the Vercel dashboard for the HTTP
   server. `SENTRY_RELEASE` and `SENTRY_ENVIRONMENT` auto-resolve.
2. **Deployment evidence bundle** — verify release/source maps,
   alerting baseline, MCP Insights. Depends on Vercel credentials.
3. **Sentry canonical alignment** — 6 gaps between our adapter layer
   and canonical Sentry practices. Detailed plan at
   `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`.
   10 todos, shaped by 5 specialist reviewers.

### Deferred

- **F18**: Span helper DRY between core and app (YAGNI)

### Operational documentation (complete)

- Per-app `.env.example` files with Sentry variables
- Deployment runbook at `docs/operations/sentry-deployment-runbook.md`
- Multi-layer security architecture in `docs/governance/safety-and-security.md`
- ADR-158: multi-layer rate limiting and security

## Read First

1. [sentry-otel-integration.execution.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — main execution plan (phases, contracts, scope)
2. [sentry-canonical-alignment.plan.md](../../plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md) — canonical alignment (6 gaps, 10 todos)
3. [ADR-143](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md) — observability architectural decision
4. [ADR-158](../../../docs/architecture/architectural-decisions/158-multi-layer-security-and-rate-limiting.md) — multi-layer security and rate limiting

Primary code surfaces:

- `packages/libs/sentry-node/src/` — Sentry config, runtime, sinks,
  redaction, fixture, types
- `packages/libs/sentry-mcp/src/` — MCP observation wrappers
- `packages/core/observability/src/` — shared redaction, span context
- `apps/oak-curriculum-mcp-streamable-http/src/observability/` — 4
  modules (http-observability, span-helpers, sanitise-mcp-events,
  http-observability-error)
- `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts` —
  server lifecycle with shutdown guard
- `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts` —
  HTTP logger factory with injectable `stdoutSink`
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/` — recently
  fixed; fragile to constructor changes in logger or observability

## Restart Sequence

1. **Merge main (PR #80)** — merge plan ready at
   `.agent/plans/architecture-and-infrastructure/active/merge-main-pr80.plan.md`.
   7 conflicts, reviewed by 2 specialists, protocol-checked. Execute
   first in the next session.
2. **Search CLI adoption** — **COMPLETE** (2026-04-12).
3. **Local credentials** — **COMPLETE** (2026-04-12b). Both apps.
4. **Vercel credentials** — set on Vercel dashboard. Then deploy.
5. **Deployment evidence** — depends on Vercel credentials being live.
6. **Canonical alignment** — 6-gap plan (12 todos) ready for
   implementation. Includes metrics (Gap 3.5), preload (Gap 1),
   Express error handler (Gap 2), profiling, source maps.
   `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`.

## Authority Rule

1. The execution plan is authoritative for implementation facts,
   contracts, and phase definitions.
2. The remediation plan is authoritative for the 21 findings and their
   resolution status.
3. This prompt is an entry point — it summarises for orientation but
   must not contradict the plans.
