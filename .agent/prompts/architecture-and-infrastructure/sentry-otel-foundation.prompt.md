---
prompt_id: architecture-sentry-otel-foundation
title: "Sentry + OpenTelemetry Foundation Session Entry Point"
type: handover
status: active
last_updated: 2026-03-27
---

# Sentry + OpenTelemetry Foundation — Session Entry Point

This is the operational handover for the active observability foundation work.
Keep it thin. The active plan owns the facts; this prompt only tells a fresh
session where to start.

---

## Read First

1. [sentry-otel-integration.execution.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md)
2. [sentry-otel-foundation.review-checkpoint-2026-03-27.md](../../plans/architecture-and-infrastructure/active/sentry-otel-foundation.review-checkpoint-2026-03-27.md)
3. [observability-and-quality-metrics.plan.md](../../plans/architecture-and-infrastructure/future/observability-and-quality-metrics.plan.md)
4. [ADR-141](../../../docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md)
5. [sentry-specialist-capability.plan.md](../../plans/agentic-engineering-enhancements/current/sentry-specialist-capability.plan.md)
6. [testing-strategy.md](../../directives/testing-strategy.md)
7. [schema-first-execution.md](../../directives/schema-first-execution.md)
8. [AGENT.md](../../directives/AGENT.md)
9. [principles.md](../../directives/principles.md)

Primary code surfaces:

- `packages/libs/logger/src/unified-logger.ts`
- `packages/libs/logger/src/types.ts`
- `packages/libs/logger/src/otel-format.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/application.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts`
- `apps/oak-search-cli/src/runtime-config.ts`
- `apps/oak-search-cli/src/lib/logger.ts`
- `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest.ts`

---

## Restart Sequence

1. Open the review checkpoint first and confirm that the bundle is cleared for
   restart.
2. Re-read the active plan sections:
   - `Current Execution Snapshot`
   - `Execution Phases`
   - `Shared Contracts`
   - `Runtime Acceptance Matrix`
   - `Success Measures`
   - `Restart Bundle`
3. Begin with `logger-foundation`.
4. Move next to `shared-observability-packages`.
5. Keep the deprecated standalone stdio MCP workspace out of scope except for
   unavoidable compile-preserving compatibility edits.
6. If the active plan or this prompt changed materially after the checkpoint
   was written, rerun the full reviewer matrix and update the checkpoint.

---

## Authority Rule

1. The active execution plan is the authority for implementation facts.
2. The review checkpoint is the authority for handover review status.
3. This prompt should be updated only when the restart sequence, pointer docs,
   or entry-point framing changes.
4. The napkin records session learnings; it must not become a duplicate plan.
