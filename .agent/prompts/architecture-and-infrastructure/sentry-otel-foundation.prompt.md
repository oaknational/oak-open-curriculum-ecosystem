---
prompt_id: architecture-sentry-otel-foundation
title: "Sentry + OpenTelemetry Foundation Session Entry Point"
type: handover
status: active
last_updated: 2026-03-28
---

# Sentry + OpenTelemetry Foundation — Session Entry Point

This is the operational handover for the active observability foundation work.
Keep it thin. The active plan owns the facts; this prompt only tells a fresh
session where to start.

Stop here first: Phase 1 blocker clearance now exists locally on
`feat/full-sentry-otel-support` on top of the pushed checkpoint `ffff1867`.
The next session should record the clean owner-requested handover confirmation
rerun from the active plan before resuming runtime adoption. The known
first-rerun remediation is already landed locally. Do not re-open
`logger-foundation`, and do not treat the bundle as restart-cleared until the
checkpoint says so. This slice is still local worktree state above `ffff1867`;
a fresh clone of `origin/feat/full-sentry-otel-support` will not contain it
until it is committed or otherwise checkpointed.

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

- `packages/core/oak-eslint/src/rules/boundary.ts`
- `packages/core/oak-eslint/src/rules/lib-boundary.unit.test.ts`
- `packages/core/observability/src/redaction.ts`
- `packages/libs/logger/README.md`
- `docs/governance/logging-guidance.md`
- `packages/libs/sentry-node/src/config.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts`
- `apps/oak-search-cli/src/lib/logger.ts`

---

## Restart Sequence

1. Open the review checkpoint first and confirm whether the bundle is already
   restart-cleared or still awaiting clean handover confirmation.
2. Re-read the active plan sections:
   - `Current Execution Snapshot`
   - `Phase 1 blocker bundle status (2026-03-28)`
   - `Implementation reality after the initial Phase 1 pass`
   - `Execution Phases`
   - `Shared Contracts`
   - `Runtime Acceptance Matrix`
   - `Success Measures`
   - `Restart Bundle`
3. Resume from the current `feat/full-sentry-otel-support` worktree. The
   latest pushed ancestor is `ffff1867`, and the local descendant state above
   it contains the blocker-clearance slice. Treat that as local worktree state,
   not branch state from a fresh clone.
4. If the checkpoint is still not restart-cleared, run the clean
   owner-requested handover confirmation rerun from the current worktree and
   record the result there.
5. Treat the Phase 1 blocker bundle as closed unless a new finding reopens the
   focused gates.
6. Only once the checkpoint is restart-cleared, start with Phase 3 HTTP
   adoption in
   `apps/oak-curriculum-mcp-streamable-http`.
7. Continue with Search CLI adoption once the HTTP slice is ready or the
   execution order is deliberately revised in the active plan.
8. Keep the deprecated standalone stdio MCP workspace out of scope except for
   unavoidable compile-preserving compatibility edits.
9. If shared-package edits reopen any focused Phase 1 gate, stop and re-green
   the foundation surface before continuing.
   - if the change touched `packages/core/oak-eslint`, rebuild
     `@oaknational/eslint-plugin-standards` before rerunning consumer lint
     commands
10. The `ffff1867` Search CLI env-loading fix remains branch hygiene, not
   adoption evidence.
11. A same-day rerun attempt after the latest documentation refresh shut down
    without substantive reviewer output; do not count it as a clean pass.
12. If the active plan, this prompt, or the restart sequence changes materially
    again after this refresh, rerun the owner-requested handover reviewer pass
    recorded in the checkpoint and expand it if the new scope touches more
    specialist domains.

---

## Authority Rule

1. The active execution plan is the authority for implementation facts.
2. The review checkpoint is the authority for handover review status.
3. This prompt should be updated only when the restart sequence, pointer docs,
   or entry-point framing changes.
4. The napkin records session learnings; it must not become a duplicate plan.
