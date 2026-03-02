# Context: Oak MCP Ecosystem

**Updated**: 2025-10-31  
**Branch**: `feat/oauth_support`  
**Current Focus**: Unblock the headless OAuth helper so it can complete the Clerk redirect without manual intervention, then capture the updated docs/prompts.

## Latest Signals

- ✅ All quality gates (format, markdownlint, type-gen, build, type-check, lint, test) are green after the latest fixes (`pnpm qg`).
- ✅ `smoke:dev:stub`, `smoke:dev:live`, and `smoke:remote` now pass consistently; port conflicts are blocked up front.
- ⚠️ Headless Playwright helper (`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http headless:oauth`) provisions its own Clerk handshake and launches Chromium, but Clerk still redirects to the hosted sign-in page and never reaches the callback without entering provider credentials.
- ❌ Clerk M2M tokens are unsuitable for our use case (intended for service-to-service calls into Clerk APIs, not for `mcpAuthClerk` access tokens).
- ✅ Automated `trace:oauth` runs captured HAR + Playwright traces and handshake snapshots in `apps/oak-curriculum-mcp-streamable-http/temp-secrets/`, verifying state/code integrity end-to-end.
- ⚠️ Documentation mentions the headless path, but we still need to record the outstanding login requirement and document the options (inject provider creds vs connect to Chrome).

## Near-Term Priorities

1. Decide which automated login strategy to adopt:
   - provide dedicated provider credentials (e.g. Google test account) and teach the helper to submit the form, **or**
   - connect Playwright to an existing Chrome session (`--connect-chrome`) for CI, **or**
   - discover a Clerk backend call that finalises the dev-browser handshake without UI.
2. Once a strategy is chosen, update `headless-oauth-token.ts` to complete the redirect, then rerun `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http headless:oauth` and `pnpm smoke:dev:live:auth` with `SMOKE_USE_HEADLESS_OAUTH=true`.
3. Refresh docs/prompts to spell out the chosen approach, prerequisites, CI env vars, and manual fallback instructions.

## Reference Notes

- `startSmokeServer` enforces loopback binding and surfaces active listeners via `lsof`.
- Stub runs seed synthetic Clerk keys to avoid contaminating real credentials.
- Debug scripts (`exact-smoke-replication`, `path-debug`, etc.) are lint-clean and available if deeper trace work is needed.
