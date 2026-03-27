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

Stop here first: Phase 1 code already exists locally. The next session must
begin with the blocker bundle recorded in the active plan, not by re-starting
`logger-foundation` from scratch.

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

- `packages/core/oak-eslint/package.json`
- `packages/libs/logger/src/pure-functions.ts`
- `packages/libs/logger/src/index.ts`
- `packages/libs/logger/src/stdout-sink.ts`
- `packages/libs/sentry-node/src/config.ts`
- `packages/libs/observability/src/redaction.ts`
- `packages/libs/logger/src/unified-logger.unit.test.ts`
- `packages/libs/logger/src/otel-format.unit.test.ts`
- `packages/libs/sentry-mcp/src/wrappers.unit.test.ts`

---

## Restart Sequence

1. Open the review checkpoint first and confirm that the bundle is cleared for
   restart.
2. Re-read the active plan sections:
   - `Current Execution Snapshot`
   - `Phase 1 blocker bundle (2026-03-27 reviewer pass)`
   - `Implementation reality after the initial Phase 1 pass`
   - `Execution Phases`
   - `Shared Contracts`
   - `Runtime Acceptance Matrix`
   - `Success Measures`
   - `Restart Bundle`
3. Start with the lint/export-map blocker in
   `packages/core/oak-eslint/package.json`.
4. Remove the remaining clean-break violations in `@oaknational/logger`.
5. Fix `@oaknational/sentry-node` config semantics so `off`/`fixture` are real
   kill switches and invalid booleans fail closed.
6. Apply the chosen architectural resolution before touching adoption work:
   move `@oaknational/observability` into `packages/core/`, restore
   `@oaknational/logger` to depending only on `core`, and replace the current
   sibling-lib allow-lists with an explicit foundation-lib vs adapter-lib rule.
7. Remove `vi.mock(...)` from the new test harnesses and close the
   URL-credential redaction gap.
8. Only after the blocker bundle is green should work move into HTTP and Search
   CLI adoption.
9. Keep the deprecated standalone stdio MCP workspace out of scope except for
   unavoidable compile-preserving compatibility edits.
10. If the active plan, this prompt, or the restart sequence changes materially
    again after this refresh, rerun the full reviewer matrix and update the
    checkpoint.

---

## Authority Rule

1. The active execution plan is the authority for implementation facts.
2. The review checkpoint is the authority for handover review status.
3. This prompt should be updated only when the restart sequence, pointer docs,
   or entry-point framing changes.
4. The napkin records session learnings; it must not become a duplicate plan.
