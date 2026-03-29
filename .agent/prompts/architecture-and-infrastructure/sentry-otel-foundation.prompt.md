---
prompt_id: architecture-sentry-otel-foundation
title: "Sentry + OpenTelemetry Foundation Session Entry Point"
type: handover
status: active
last_updated: 2026-03-29
---

# Sentry + OpenTelemetry Foundation — Session Entry Point

This is the operational handover for the active observability foundation work.
Keep it thin. The active plan owns the facts; this prompt only tells a fresh
session where to start.

## Current State (2026-03-29)

Branch: `feat/full-sentry-otel-support`. Head: `1aeb7290`.
13 commits ahead of main (333 files, ~19k insertions).

Two remediation sessions (2026-03-28 and 2026-03-29) ran 6+3 specialist
reviewers, identified 21 findings, and fixed 19 of them. Smoke tests
fixed and `pnpm check` passes (81/81 tasks including clean rebuild).

**Gate status**: `pnpm check` green — 81/81 tasks (secrets scan, clean
rebuild, sdk-codegen, build, type-check, doc-gen, lint, test, test:e2e,
test:ui, smoke:dev:stub, subagents:check, portability:check, markdownlint,
format).

**What remains**:

- **F10**: `vi.mock()` in `check-mcp-client-auth.unit.test.ts` — reverted as
  out-of-scope (auth DI refactor, not observability). Track separately.
- **F18**: Span helper DRY opportunity — deferred (different concerns).
- Final PR review before merge to main.

## Read First

1. **[sentry-otel-remediation.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-remediation.plan.md)** — 21 findings, 5 phases.
2. [sentry-otel-integration.execution.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — Main execution plan.
3. [ADR-141](../../../docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md)

Primary code surfaces:

- `packages/libs/sentry-node/src/` — all files
- `packages/libs/sentry-mcp/src/` — wrappers and types
- `packages/core/observability/src/` — redaction and span context
- `apps/oak-curriculum-mcp-streamable-http/src/observability/` — 4 modules
- `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts` — lifecycle

## Restart Sequence

1. Review PR for merge readiness.
2. Track F10 (auth DI refactor) and F18 (span DRY) separately.
3. Continue with Search CLI adoption after the HTTP slice is merged.

## Authority Rule

1. The remediation plan is the authority for what to fix and in what order.
2. The main execution plan is the authority for full implementation context.
3. This prompt is an entry point only — it must not restate plan facts.
