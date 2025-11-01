# Testing Strategy: Oak Curriculum MCP Streamable HTTP

## Overview

- Authentication is proven through two complementary paths: a manual Clerk verification flow for configuration changes, and deterministic mock-driven suites for everyday development.
- All tests follow TDD discipline: write the failing test first, keep arrangements simple, and favour pure functions at unit scale.
- IO appears only in E2E and smoke suites; unit and integration tests import code directly and inject tiny fakes where required.

## Two-Tier Authentication Testing

### Tier 1 – Manual Clerk verification

- **Command**: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth`
- Run when wiring Clerk for the first time, rotating OAuth credentials, or investigating real sign-in issues.
- Outputs Playwright traces, HAR files, and handshake snapshots into `apps/oak-curriculum-mcp-streamable-http/temp-secrets/`.
- Not part of CI; only rerun after Clerk configuration changes.

### Tier 2 – Automated mock coverage

- Fixtures live in `src/test-fixtures/`:
  - `auth-scenarios.ts` captures canonical requests, responses, and enforcement expectations.
  - `mock-clerk-middleware.ts` exposes deterministic middleware helpers.
- Tests consuming these fixtures:
  - `auth-scenarios.unit.test.ts`
  - `mock-clerk-middleware.integration.test.ts`
  - `clerk-auth-middleware.integration.test.ts`
  - `auth-enforcement.e2e.test.ts`
  - `smoke-tests/smoke-dev-auth.ts` via `pnpm smoke:dev:auth`
- These suites keep `DANGEROUSLY_DISABLE_AUTH` unset so real middleware paths execute; only bypass-specific scenarios set the flag deliberately.

## Test Layers

### Unit tests (`*.unit.test.ts`)

- Purpose: prove pure functions with no IO.
- Run: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` (Vitest auto-detects `*.unit.test.ts`).
- Examples: `env.unit.test.ts`, `handlers.unit.test.ts`, `test-fixtures/auth-scenarios.unit.test.ts`.

### Integration tests (`*.integration.test.ts`)

- Purpose: exercise multiple units as imported code with tiny injected fakes.
- Run: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` (Vitest groups these by filename).
- Examples: `mock-clerk-middleware.integration.test.ts`, `clerk-auth-middleware.integration.test.ts`, `oauth-metadata-clerk.integration.test.ts`.

### E2E tests (`*.e2e.test.ts`)

- Purpose: exercise a running server in-process spawned by the Vitest harness.
- Run: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`.
- Key files: `auth-enforcement.e2e.test.ts`, `auth-bypass.e2e.test.ts`, `tool-call-envelope.e2e.test.ts`, `server.e2e.test.ts`.

### Smoke tests (`smoke-tests/`)

- Purpose: quickest regression sweep over a running server with production-like wiring.
- Commands:
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub` – protocol checks with stub tools and auth bypass.
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live` – live Oak API with bypass enabled.
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth` – stub tools with auth enforced (uses `local-stub-auth` mode and hard-coded fake Clerk keys to keep the run network-free).
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live:auth` – full production equivalent; run manually after Clerk changes.
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote` – target deployed instance.

## Fixture Catalogue

- `src/test-fixtures/auth-scenarios.ts` – immutable map of valid/invalid tokens, headers, and enforcement expectations. Update via TDD alongside schema changes.
- `src/test-fixtures/mock-clerk-middleware.ts` – deterministic middleware wiring used by integration tests and the smoke harness.
- `smoke-tests/smoke-suite.ts` – shared runner for smoke modes; ensures auth assertions execute even when tools are stubbed.
- Whenever fixtures evolve, extend the unit and integration suites first, then layer in corresponding E2E or smoke assertions if behaviour changes at system scale.

## Using `DANGEROUSLY_DISABLE_AUTH`

- Leave the flag unset (or explicitly `false`) for any test that is meant to prove auth enforcement.
- Set the flag **only** when the scenario’s purpose is unrelated to auth (tool execution flows, protocol validation, Oak API integration, DX fixtures).
- Every remaining usage must carry an inline comment explaining why auth is intentionally bypassed and which auth-focused test exercises the behaviour instead.
- The smoke harness defaults to auth enabled in `smoke:dev:auth` and `smoke:dev:live:auth`. Other modes enable the flag to prioritise non-auth assertions, and they document the rationale inline.
- `smoke:dev:auth` intentionally injects the fake Clerk keys defined in `smoke-tests/modes/local-stub-auth.ts` so the stub run never leaves the process. Use `smoke:dev:live:auth` (or enable `SMOKE_CLERK_PROGRAMMATIC_AUTH` while running live modes) when you need to exercise the real PKCE flow with valid credentials.

## Command Reference

| Goal                      | Command                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Unit + integration suites | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`                |
| System suites             | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`            |
| Auth smoke (stub tools)   | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth`      |
| Auth smoke (live tools)   | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live:auth` |
| Stub smoke                | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub`      |
| Live smoke (bypass)       | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`      |
| Deployed smoke            | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote`        |
| Manual Clerk validation   | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth`         |

## Quality Gates

- Run `pnpm qg` at the workspace root after documentation or code changes.
- After auth-related changes, also run `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth` to confirm the stub-auth harness.
- Before shipping, repeat `pnpm qg` at the repo root to ensure no other workspaces regressed.
- Manual Clerk validation (`trace:oauth`) is required after rotating credentials or adjusting redirect URIs; store artefacts in `temp-secrets/` for audit history.

## Troubleshooting

- **Auth test failing with bypass enabled** – confirm `DANGEROUSLY_DISABLE_AUTH` is explicitly set to `'false'` (string) in the test harness, or removed entirely.
- **Smoke harness choking on Clerk config** – re-run `pnpm smoke:dev:auth` after exporting fresh Clerk environment variables; the stub mode still uses real middleware.
- **Fixture drift** – update `auth-scenarios.ts` and its unit test first, then propagate to integration/E2E/smoke suites so expectations stay aligned.
