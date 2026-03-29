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

See [ADR-141](../../../docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md)
for the architectural decision.

## Current State (2026-03-29)

Branch head: `308881a5`. 16 commits ahead of main.

**What was done** (summary of the 19 resolved remediation findings):

- **Type safety**: Sentry hook parameter type aliases, `typeSafeEntries`
  / `typeSafeKeys` migrations, `ServerHarness` + `FakeLogger` rewrites
  with proper Logger overloads, narrow `SentryErrorEvent` /
  `SentryBreadcrumb` / `SentryTransactionEvent` re-exports (no
  `NodeOptions` leakage through the lib boundary)
- **File splitting**: `http-observability.ts` split from 504 to 207
  lines across 4 modules; 8 other oversized files split
- **Sentry logger API**: replaced `captureMessage` with
  `Sentry.logger.*`; OTel attributes flattened with `otel.attributes.*`
  / `otel.resource.*` dot-prefixed keys for Sentry queryability
- **Safety guards**: shutdown once-guard for duplicate SIGINT/SIGTERM,
  `safeRecord` in MCP wrappers, `safeSpanOp` for span lifecycle — all
  ensure infrastructure failures never mask business logic
- **DI and test hygiene**: `stdoutSink` injected (removed
  `vi.spyOn(process.stdout)`), per-test `createTestRuntime()` factory
  (removed module-level mocks), scoped `fakeSpanCounter` closure
- **Security**: DSN removed from error messages, `Object.assign`
  metadata copy removed, `dsn` added to `FULLY_REDACTED_KEYS`
- **Smoke tests**: `UnifiedLogger` constructor updated from old
  `stdoutSink`/`fileSink` shape to new `sinks[]`/`getActiveSpanContext`;
  `createApp` now receives required `observability` option

**Gate status**: `pnpm check` green — 81/81 tasks (secrets scan, clean
rebuild, sdk-codegen, build, type-check, doc-gen, lint, test, test:e2e,
test:ui, smoke:dev:stub, subagents:check, portability:check,
markdownlint, format).

**What remains on this branch**:

- **F10**: `vi.mock()` in `check-mcp-client-auth.unit.test.ts` — out of
  scope (auth DI refactor, not observability). Track separately.
- **F18**: Span helper DRY opportunity — deferred (different concerns).
- **PR review** before merge to main.

**Operational documentation added**:

- Per-app `.env.example` files with Sentry variables (HTTP app + search
  CLI each have their own DSN placeholder)
- Vercel environment config doc updated with Sentry optional variables
- Deployment runbook at `docs/operations/sentry-deployment-runbook.md`
  covering per-app DSN provisioning, source maps, alerting, rollback,
  and a note on Vercel Log Drains as a future alternative

**What comes after merge**:

- Search CLI adoption (`apps/oak-search-cli`)
- Deployment evidence bundle (release/source maps, alerting, MCP
  Insights) — the runbook describes the steps; CI automation is not
  yet wired

## Read First

1. [sentry-otel-integration.execution.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — main execution plan (phases, contracts, scope)
2. [sentry-otel-remediation.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-remediation.plan.md) — 21 findings, resolution status
3. [ADR-141](../../../docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md) — architectural decision

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

1. Verify `pnpm check` still passes (confirms no drift since last
   session).
2. Create PR for merge to main, or continue with PR review if already
   open.
3. After merge, resume Search CLI adoption (see `search-cli-adoption`
   todo in the execution plan).
4. Track F10 and F18 as separate work items outside this branch.

## Authority Rule

1. The execution plan is authoritative for implementation facts,
   contracts, and phase definitions.
2. The remediation plan is authoritative for the 21 findings and their
   resolution status.
3. This prompt is an entry point — it summarises for orientation but
   must not contradict the plans.
