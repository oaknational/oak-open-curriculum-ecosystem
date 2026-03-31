---
prompt_id: architecture-sentry-otel-foundation
title: "Sentry + OpenTelemetry Foundation Session Entry Point"
type: handover
status: active
last_updated: 2026-03-29
---

# Sentry + OpenTelemetry Foundation — Session Entry Point

## What this branch does

Branch `feat/full-sentry-otel-support` adds a production observability
foundation so the HTTP MCP server and Search CLI are diagnosable during
open public alpha. It is a **Milestone 2 blocker**.

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

## Current State (2026-03-31)

PR #73 **MERGED** to main (squash commit `54309a6a`). Continuation
branch: `feat/otel_sentry_enhancements`.

**Phase 3 HTTP adoption: COMPLETE.** All 21 specialist findings
resolved, C1/C2 CodeQL regex fixed, merged with main (PR #70), ADR-141
renumbered to ADR-143, cleanup resilience hardened (Wilma review),
multi-layer security architecture documented.

**What comes next**:

1. ~~**Rate limiting**~~ — **COMPLETE** (2026-03-31). ADR-144 documents
   multi-layer security architecture. `express-rate-limit` v8 on 6
   routes across 3 profiles (MCP 120/min, OAuth 30/15min, Asset 60/min).
   `trust proxy` configured. All quality gates green, 6 reviewers invoked.
2. **Search CLI adoption** (`apps/oak-search-cli`) — wire observability
   foundation, runtime-config-driven logger, command init spans,
   shutdown flush, Sentry DSN provisioning.
3. **Deployment evidence bundle** — release/source maps, alerting
   baseline, MCP Insights verification.

**Deferred (track separately)**:

- **F18**: Span helper DRY between core and app (YAGNI)

**Operational documentation (complete)**:

- Per-app `.env.example` files with Sentry variables
- Vercel environment config doc updated
- Deployment runbook at `docs/operations/sentry-deployment-runbook.md`
- Multi-layer security architecture in `docs/governance/safety-and-security.md`

## Read First

1. [sentry-otel-integration.execution.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — main execution plan (phases, contracts, scope)
2. [sentry-otel-remediation.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-remediation.plan.md) — 21 findings, resolution status
3. [ADR-143](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md) — architectural decision

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

1. Verify `pnpm check` still passes (confirms no drift since last session).
2. Choose the next work item:
   - ~~**Rate limiting**~~: **COMPLETE** (2026-03-31). ADR-144, all gates green.
   - **Search CLI adoption**: wire observability into `apps/oak-search-cli`.
     See `search-cli-adoption` todo in the execution plan.
   - **Deployment evidence**: release/source maps, alerting, MCP Insights.
3. Track F18 (span helper DRY) as a separate work item.

## Authority Rule

1. The execution plan is authoritative for implementation facts,
   contracts, and phase definitions.
2. The remediation plan is authoritative for the 21 findings and their
   resolution status.
3. This prompt is an entry point — it summarises for orientation but
   must not contradict the plans.
