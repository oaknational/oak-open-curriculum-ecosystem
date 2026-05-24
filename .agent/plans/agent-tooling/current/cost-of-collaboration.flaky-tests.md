# Cost-of-Collaboration Flaky-Test Investigation List

Last updated: 2026-05-12.

## Suspected flaky tests

| Priority | Test | Evidence | Next verification |
| --- | --- | --- | --- |
| Disposed | `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/oauth-rate-limit.integration.test.ts:103` | Full `pnpm check:profile` run that wrote `.logs/check-profiles/check-profile-2026-05-12T06-55-17-199Z.json` failed in `@oaknational/oak-curriculum-mcp-streamable-http#test`: expected second `GET /oauth/authorize` request to return `429`, observed `302`. Hushed Shrouding Mist reran the file 10 times in isolation and 10 times with adjacent rate-limiting suites; all 20 runs exited 0. Full HTTP MCP package test also exited 0. Later busy-checkout `pnpm check:profile` baselines passed. | Not reproduced. Keep as historical profile evidence only unless it recurs. |
| Disposed | `apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.integration.test.ts:203` | Earlier profiling note records a full-profile failure expecting Sentry correlation-id scope tagging but observing no calls; owner later reported green full checks. Hushed Shrouding Mist reran the file 10 times in isolation and 10 times with adjacent observability/correlation suites; all 20 runs exited 0. Full HTTP MCP package test also exited 0. Later busy-checkout `pnpm check:profile` baselines passed. | Not reproduced. Keep as historical profile evidence only unless it recurs. |

## Busy-checkout profile observations

| Surface | Evidence | Disposition |
| --- | --- | --- |
| `public-resource-auth-bypass.e2e.test.ts` under full profile | One escalated `pnpm check:profile` failed in `@oaknational/oak-curriculum-mcp-streamable-http#test:e2e` on `Public Resource Authentication Bypass (E2E) > returns HTTP 401 for resources/read without uri param` with `Parse Error: Expected HTTP/, RTSP/ or ICE/`. The exact file then passed 10 repeated focused E2E runs and the full HTTP MCP `test:e2e` task passed 3 repeated runs. A subsequent busy-checkout full profile passed. | Not reproduced. Treat as aggregate-profile historical evidence, not a current deterministic blocker. |
| Busy-checkout cold and warm profiles | `pnpm check:profile` passed outside the sandbox at `.logs/check-profiles/check-profile-2026-05-12T07-33-57-773Z.json` (exit 0, 147613 ms, 88/88 Turbo tasks) and `.logs/check-profiles/check-profile-2026-05-12T07-36-18-375Z.json` (exit 0, 131695 ms). | Use these as representative P0.QG baselines for the current multi-agent checkout rather than waiting for an artificially pristine tree. |

## Environmental instability, not a flaky test

| Surface | Evidence | Handling |
| --- | --- | --- |
| Playwright/Chromium under sandboxed profile runs | Sandboxed `pnpm check:profile` attempts failed browser launch with macOS permission/Mach-port errors before rerunning successfully outside the sandbox. The 2026-05-12T07:24 sandboxed run failed this way before the escalated reruns passed. | Keep separate from product flaky-test work. Profile artifacts should eventually record browser/sandbox readiness so this does not masquerade as test flakiness. |
| Moving-tree Markdownlint race | One escalated profile ran all 88 Turbo tasks successfully, including browser/UI/a11y tasks, then failed at post-Turbo `markdownlint-check:root` with `ENOENT` while a peer skill-pruning lane deleted `.agent/skills/finishing-branch/SKILL-CANONICAL.md`. Immediate standalone `pnpm markdownlint-check:root` passed after the tree settled. | Representative of busy multi-agent pressure, but not a Markdown defect. Do not repair peer-owned skill deletion from the P0.QG lane. |
