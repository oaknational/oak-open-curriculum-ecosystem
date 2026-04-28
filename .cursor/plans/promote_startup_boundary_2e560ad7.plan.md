---
name: Promote Startup Boundary
overview: Promote the existing MCP local startup release-boundary plan into active execution and run only its Phase 0 inventory first. The intent is to verify ownership and standards failures before writing RED tests or changing runtime behaviour.
todos:
  - id: promote-active
    content: Promote the existing current plan to active only when execution starts, preserving the plan as the source of truth.
    status: completed
  - id: phase0-inventory
    content: Inventory Sentry release/config and HTTP MCP local startup ownership, including gate launcher preconditions.
    status: completed
  - id: classify-tests
    content: Classify named tests and smoke helpers by proof value and standards compliance before adding RED tests.
    status: completed
  - id: checkpoint
    content: Stop after Phase 0 with an ADR/contract decision and a minimal Phase 1 RED-test target list.
    status: completed
isProject: false
---

# Promote MCP Local Startup Release Boundary

## Recommendation
Promote [`mcp-local-startup-release-boundary.plan.md`](.agent/plans/observability/current/mcp-local-startup-release-boundary.plan.md) to the active observability lane and begin with Phase 0 only.

Metacognition result: the inherited plan still fits the actual failure. The risk is not under-planning; it is expanding the plan body or absorbing adjacent observability work. Keep the first execution slice to inventory, ownership, and the go/no-go decision before RED tests.

## Phase 0 Execution Shape
- Register this session on the `observability-sentry-otel` thread before repo edits, per the additive identity rule in [`observability-sentry-otel.next-session.md`](.agent/memory/operational/threads/observability-sentry-otel.next-session.md).
- Move the plan from `current/` to `active/` only when implementation actually starts; update frontmatter status for `phase-0-boundary-inventory` to `in_progress` in the same markdown-only step.
- Inventory the two confirmed ownership areas:
  - Sentry config/release flow in [`packages/libs/sentry-node/src/config.ts`](packages/libs/sentry-node/src/config.ts), [`packages/libs/sentry-node/src/config-resolution.ts`](packages/libs/sentry-node/src/config-resolution.ts), and [`packages/core/build-metadata/src/release.ts`](packages/core/build-metadata/src/release.ts).
  - HTTP MCP startup/gate flow in [`apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`](apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts), [`apps/oak-curriculum-mcp-streamable-http/src/index.ts`](apps/oak-curriculum-mcp-streamable-http/src/index.ts), [`apps/oak-curriculum-mcp-streamable-http/src/server.ts`](apps/oak-curriculum-mcp-streamable-http/src/server.ts), and [`apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-server.ts`](apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-server.ts).
- Classify the named tests and helpers by proof value and standards compliance. Known Phase 0 focus points are the structural `readFileSync` test in [`packages/core/build-metadata/tests/git-sha.unit.test.ts`](packages/core/build-metadata/tests/git-sha.unit.test.ts) and ambient env/IO in the streamable HTTP smoke helpers.
- Produce a short ownership matrix in execution notes or the active plan evidence area, then stop for the ADR/contract decision before Phase 1 RED tests.

## Boundaries
- Do not add fake `VERCEL_GIT_COMMIT_SHA`, `VERCEL_BRANCH_URL`, or `SENTRY_RELEASE_OVERRIDE` values to local gates as the fix.
- Do not broaden into the future MCP HTTP runtime canonicalisation plan.
- Do not change production/preview release semantics unless Phase 0 proves ADR-163 must be amended first.
- Do not dispatch extra reviewers during Phase 0 unless a real blocking assumption appears. Before Phase 1/2 implementation, use the plan’s mandatory `sentry-reviewer` and `test-reviewer` gates.

## Validation For This Slice
- Phase 0 is primarily read-only plus markdown state/evidence. No runtime gate is expected yet.
- Validate the inventory with targeted searches and direct file reads, not with source-string tests.
- At the checkpoint, the executor must be able to state: one source of truth for app runtime metadata, one source of truth for Sentry release identity, each local gate’s precondition set, and whether ADR-163 needs amendment before RED tests.