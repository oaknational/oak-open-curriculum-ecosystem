---
prompt_id: architecture-sentry-otel-foundation
title: "Sentry + OpenTelemetry Foundation Session Entry Point"
type: handover
status: active
last_updated: 2026-04-11
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

## Current State (2026-04-11)

PR #73 **MERGED** to main (2026-03-31). Rate limiting **COMPLETE**
(ADR-158). Continuation branch: `feat/otel_sentry_enhancements`.

### Completed

- Phase 3 HTTP adoption (PR #73) — all 21 findings, C1/C2 regex,
  ADR-143, cleanup resilience, multi-layer security architecture
- Rate limiting (ADR-158) — `express-rate-limit` on 6 routes, 3
  profiles, `trust proxy` configured

### Merge from main — COMPLETE (2026-04-11)

Main merged (commits `da26c4bf`, `9e6ed327`). PR #76 (React MCP App,
977 files), PR #78 (open education, ADR-157), releases 1.3.0-1.5.0
integrated. ADR-144 renumbered to ADR-158. Rate limiting re-applied
with extracted `CoreEndpointOptions`. 6 specialist reviewers passed.
`pnpm check` green. `registerWidgetResource` confirmed using
`wrapResourceHandler` (observability intact). Integration sweep
verified no main work lost.

### What comes next

1. **Search CLI adoption** (`apps/oak-search-cli`) — 6 critical gaps:
   no Sentry init, no sinks, no env config, no command spans, no
   flush, no error capture. Reference: HTTP server implementation.
4. **Sentry credential provisioning** (owner action) — once all code
   foundations are in place, the owner will configure real Sentry DSN
   credentials in `.env.local` and the Vercel dashboard per
   `docs/operations/sentry-deployment-runbook.md`. No `.env.local`
   currently has Sentry variables — the code defaults to
   `SENTRY_MODE=off` (fail-closed, safe).
5. **Deployment evidence bundle** — verify release/source maps,
   alerting baseline, MCP Insights. Depends on real credentials.

### Deferred

- **F18**: Span helper DRY between core and app (YAGNI)

### Operational documentation (complete)

- Per-app `.env.example` files with Sentry variables
- Deployment runbook at `docs/operations/sentry-deployment-runbook.md`
- Multi-layer security architecture in `docs/governance/safety-and-security.md`
- ADR-158: multi-layer rate limiting and security

## Read First

1. [sentry-otel-integration.execution.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — main execution plan (phases, contracts, scope)
2. [ADR-143](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md) — observability architectural decision
3. [ADR-158](../../../docs/architecture/architectural-decisions/158-multi-layer-security-and-rate-limiting.md) — multi-layer security and rate limiting

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

1. **Search CLI adoption** — 6 critical gaps (see execution plan and
   the session plan at `~/.claude/plans/effervescent-hatching-goose.md`
   Part 2). TDD throughout.
2. **Sentry credentials** — owner configures real DSN after code is ready.
3. **Deployment evidence** — depends on real credentials being live.

## Authority Rule

1. The execution plan is authoritative for implementation facts,
   contracts, and phase definitions.
2. The remediation plan is authoritative for the 21 findings and their
   resolution status.
3. This prompt is an entry point — it summarises for orientation but
   must not contradict the plans.
