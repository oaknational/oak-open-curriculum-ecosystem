---
name: Startup Boundary Phase1
overview: "Plan the next execution slice for the active MCP local startup release-boundary plan: Phase 1 RED tests first, then the smallest GREEN seams needed to satisfy those tests without touching the parallel WS3 lane."
todos:
  - id: sentry-red
    content: Add paired Sentry config RED tests for off-mode missing release metadata versus live-mode strictness.
    status: completed
  - id: http-observability-red
    content: Add HTTP observability RED test for off-mode RuntimeConfig without deploy release metadata.
    status: completed
  - id: runtime-seam-red
    content: Design and test the pure runtime-config composition seam without env-file IO.
    status: completed
  - id: smoke-contract-red
    content: Add smoke/local-gate env contract RED around prepared env data rather than process.env mutation.
    status: completed
  - id: review-and-gates
    content: Run required reviewer gates and focused validation before GREEN implementation proceeds.
    status: completed
isProject: false
---

# MCP Startup Boundary Next Steps

## Scope
Continue [`mcp-local-startup-release-boundary.plan.md`](.agent/plans/observability/active/mcp-local-startup-release-boundary.plan.md) from Phase 1. Use the completed [`Phase 0 evidence`](.agent/plans/observability/active/mcp-local-startup-release-boundary.phase-0-evidence.md) as the source of truth.

Do not touch the release-identifier WS3 lane; a parallel session owns that work.

## RED Sequence
1. Add the primary Sentry mode-boundary RED in [`packages/libs/sentry-node/src/config.unit.test.ts`](packages/libs/sentry-node/src/config.unit.test.ts): the same missing-release input should succeed for `SENTRY_MODE=off` and fail with `missing_git_sha` for `SENTRY_MODE=sentry`.
2. Add the HTTP observability wiring RED in [`apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts`](apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts): off-mode `RuntimeConfig` can omit `VERCEL_GIT_COMMIT_SHA`, `VERCEL_BRANCH_URL`, and `SENTRY_RELEASE_OVERRIDE`.
3. Add a runtime-config composition RED only after choosing the pure seam shape: prefer an exported validated-env-to-`RuntimeConfig` builder in [`apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`](apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts) so in-process tests do not call env-file IO.
4. Add a smoke/local-gate contract RED around an extracted env-preparation function, not around current `process.env` mutation in [`apps/oak-curriculum-mcp-streamable-http/smoke-tests/environment.ts`](apps/oak-curriculum-mcp-streamable-http/smoke-tests/environment.ts) or [`apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub.ts`](apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub.ts).

## GREEN Direction
- In `@oaknational/sentry-node`, move or split release resolution so off mode is constructed without Sentry release identity. Keep live `sentry` mode strict.
- Adjust `SentryOffConfig` if needed so its type does not imply a release identity is always present.
- Introduce a production-owned pure runtime-config seam, then route `loadRuntimeConfig` and smoke setup through it.
- Replace smoke env mutation with explicit prepared env data; do not bridge or preserve the mutation path.

## Validation And Review
- Run focused tests one gate at a time after each slice:
  `pnpm --filter @oaknational/sentry-node test`, then `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`.
- Before implementation beyond RED tests, invoke `sentry-reviewer` and `test-reviewer` as required by the active plan.
- After GREEN, run the targeted standards search from the active plan and classify every hit before broader gates.

## Checkpoint
Stop after the RED tests are proven failing for the intended reasons. The first implementation step should not start until the failing evidence confirms the boundary bug rather than fixture or setup mistakes.