# Cost-of-Collaboration Flaky-Test Investigation List

Last updated: 2026-05-12.

## Suspected flaky tests

| Priority | Test | Evidence | Next verification |
| --- | --- | --- | --- |
| P1 | `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/oauth-rate-limit.integration.test.ts:103` | Full `pnpm check:profile` run that wrote `.logs/check-profiles/check-profile-2026-05-12T06-55-17-199Z.json` failed in `@oaknational/oak-curriculum-mcp-streamable-http#test`: expected second `GET /oauth/authorize` request to return `429`, observed `302`. Immediate focused rerun passed with `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http exec vitest run src/rate-limiting/oauth-rate-limit.integration.test.ts` (2 tests passed). Later full profile passed. | Run the file repeatedly and under full-suite adjacency. Check whether rate-limit state is process-global, order-dependent, clock-dependent, or shared between parallel Vitest workers. |
| P1 | `apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.integration.test.ts:203` | Earlier profiling note records a full-profile failure expecting Sentry correlation-id scope tagging but observing no calls; owner later reported green full checks, so this is historical flaky evidence rather than current deterministic breakage. See `.logs/check-profiles/check-profile-analysis-2026-05-12.md`. | Re-run the file in isolation and with adjacent observability/correlation suites. Check mock reset order, Sentry singleton/module cache state, and parallel worker isolation. |

## Environmental instability, not a flaky test

| Surface | Evidence | Handling |
| --- | --- | --- |
| Playwright/Chromium under sandboxed profile runs | Sandboxed `pnpm check:profile` attempts failed browser launch with macOS permission/Mach-port errors before rerunning successfully outside the sandbox. | Keep separate from product flaky-test work. Profile artifacts should eventually record browser/sandbox readiness so this does not masquerade as test flakiness. |
