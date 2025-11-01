# Oak Curriculum MCP – Streamable HTTP (Vercel-ready)

This application exposes the Curriculum MCP server over Streamable HTTP using the official MCP SDK. It defaults to stateless responses (no SSE streaming) and targets Vercel’s Node runtime.

## Quick Start (Local)

### Auth enforced – recommended default

1. Create `.env` in the repository root:

   ```bash
   OAK_API_KEY=your_oak_api_key
   CLERK_PUBLISHABLE_KEY=pk_test_your_key
   CLERK_SECRET_KEY=sk_test_your_key
   ALLOWED_HOSTS=localhost,127.0.0.1,::1
   ```

2. Run the development server (auth enforcement on by default):

   ```bash
   pnpm -C apps/oak-curriculum-mcp-streamable-http dev
   ```

3. Call the MCP endpoint with the required accept header:

   ```bash
   curl -sS \
     -H 'Accept: application/json, text/event-stream' \
     -H 'Content-Type: application/json' \
     -X POST http://localhost:3333/mcp \
     -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
   ```

### Local bypass – tool development only

Set `DANGEROUSLY_DISABLE_AUTH=true` when starting the server if the scenario is not proving auth enforcement:

```bash
DANGEROUSLY_DISABLE_AUTH=true pnpm -C apps/oak-curriculum-mcp-streamable-http dev
```

Only use this flag for protocol-level or tool-behaviour testing. All auth-focused suites must run with auth enabled.

## Authentication Flow

- OAuth 2.1 enforcement is provided by Clerk. Unauthenticated `/mcp` requests receive `401` with a `WWW-Authenticate` header pointing to Clerk metadata.
- MCP clients fetch `/.well-known/oauth-protected-resource`, complete the Clerk authorisation flow, and replay requests with `Authorization: Bearer <token>`.
- The server exposes `/.well-known/oauth-authorization-server` for legacy clients.
- Manual validation: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth` captures HAR + Playwright traces for once-off Clerk checks (artefacts saved to `temp-secrets/`).

## Two-Tier Auth Testing

- **Tier 1 – Manual**: `pnpm trace:oauth` (run after Clerk configuration changes).
- **Tier 2 – Automated**: Mock-driven suites backed by fixtures in `src/test-fixtures/`:
  - `auth-scenarios.ts` + `auth-scenarios.unit.test.ts`
  - `mock-clerk-middleware.ts` + `mock-clerk-middleware.integration.test.ts`
  - `auth-enforcement.e2e.test.ts`
  - `smoke-tests/smoke-dev-auth.ts` via `pnpm smoke:dev:auth`
- See [TESTING.md](./TESTING.md) for the complete testing strategy.

### DANGEROUSLY_DISABLE_AUTH guidance

- Leave unset/`false` when verifying auth enforcement (integration, E2E, smoke auth modes).
- Set to `true` only when auth is explicitly out of scope (protocol verification, stubbed tool flows, DX harnesses).
- Every bypassed test includes an inline comment explaining the rationale and naming the complementary auth-covered suite.

## Configuration Overview

| Variable                            | Required? | Default Behaviour                                                                                                        | Notes                                                                                                       |
| ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `OAK_API_KEY`                       | ✅        | None – must be provided                                                                                                  | Used when executing curriculum tools against the live API.                                                  |
| `CLERK_PUBLISHABLE_KEY`             | ✅        | None – must be provided                                                                                                  | Read implicitly by `@clerk/express`; not referenced directly in app code.                                   |
| `CLERK_SECRET_KEY`                  | ✅        | None – must be provided                                                                                                  | Required by Clerk middleware for JWT validation and metadata routes.                                        |
| `ALLOWED_HOSTS`                     | ❌        | `['localhost','127.0.0.1','::1']`, or `VERCEL_URL` + locals when `VERCEL_URL` is present                                 | Drives DNS-rebinding protection in `security.ts`.                                                           |
| `ALLOWED_ORIGINS`                   | ❌        | `['http://localhost:3000','http://localhost:3333']`, or `https://${VERCEL_URL}` plus locals when `VERCEL_URL` is present | Configures the CORS allow-list.                                                                             |
| `REMOTE_MCP_MODE`                   | ❌        | `stateless`                                                                                                              | Switching to `session` enables session headers in CORS responses.                                           |
| `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` | ❌        | `false`                                                                                                                  | When `true`, tool handlers return schema-driven stubs (used by smoke/e2e harnesses).                        |
| `DANGEROUSLY_DISABLE_AUTH`          | ❌        | `false`                                                                                                                  | Only set to `true` in local development to bypass Clerk authentication.                                     |
| `TRACE_MCP_FLOW`                    | ❌        | `false`                                                                                                                  | Enables verbose HTTP tracing middleware for debugging.                                                      |
| `LOG_LEVEL`                         | ❌        | `info` (when consumed)                                                                                                   | Currently respected by the smoke-test logger; the server still uses a bespoke logger (see tidy-up backlog). |
| `MCP_STREAMABLE_HTTP_LOG_FILE`      | ❌        | `apps/oak-curriculum-mcp-streamable-http/.logs/dev-server.log`                                                           | Overrides the file sink used by the in-process logger.                                                      |
| `SMOKE_REMOTE_BASE_URL`             | ❌        | None                                                                                                                     | Convenience for `pnpm smoke:remote`.                                                                        |

## Smoke and Quality Gates

| Scenario                  | Command                                                                                                | Notes                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Stub tools, bypass        | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub`                         | Offline, fastest protocol checks                                                |
| Live tools, bypass        | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`                         | Hits live Oak API, skips auth                                                   |
| Stub tools, auth enforced | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth`                         | Exercises Clerk middleware with stub tools using fake Clerk keys (network-free) |
| Live tools, auth enforced | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live:auth`                    | Manual run; use after Clerk changes                                             |
| Remote deployment         | `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote [--remote-base-url <url>]` | Validates Vercel deployment                                                     |

Quality gate reminder:

1. `pnpm qg` (workspace root)
2. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:auth`
3. `pnpm qg` (repo root)

Stub auth deliberately keeps the hard-coded Clerk keys shown in `smoke-tests/modes/local-stub-auth.ts`, so the harness can verify enforcement without ever talking to Clerk. Switch to `smoke:dev:live:auth` (or set `SMOKE_CLERK_PROGRAMMATIC_AUTH=true` in live modes) when you need to exercise the real PKCE helper with valid credentials.

## Vercel Deployment

- Detailed environment guidance lives in [`docs/vercel-environment-config.md`](./docs/vercel-environment-config.md).
- Target the Node runtime (not Edge).
- Required environment variables:
  - `CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `OAK_API_KEY`
- Optional:
  - `ALLOWED_HOSTS` / `ALLOWED_ORIGINS` (defaults cover localhost or `VERCEL_URL` automatically)
  - `LOG_LEVEL` (diagnostic logging for smoke harness)
  - `MCP_STREAMABLE_HTTP_LOG_FILE` (override default log file path)
- Post-deploy checklist:
  - `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url https://<host>/mcp`
  - Ensure `curl https://<host>/.well-known/oauth-protected-resource` resolves to Clerk endpoints.
  - Confirm unauthenticated `POST` to `/mcp` returns `401` with `WWW-Authenticate`.
  - Complete the OAuth flow via Claude Desktop or an MCP client.

## Troubleshooting

- **Missing `Accept` header** → `/mcp` replies `406`. Always send `Accept: application/json, text/event-stream`.
- **Unexpected bypass in tests** → check for stray `DANGEROUSLY_DISABLE_AUTH=true` and remove unless the scenario documents the reason.
- **Clerk sign-in fails** → verify keys, domain allow-list, and rerun `pnpm trace:oauth` to capture the failing flow.
- **Remote smoke failures** → confirm the deployment runs the latest build and that required environment variables are present on Vercel.

## Further Reading

- [TESTING.md](./TESTING.md) – full testing strategy, fixture catalogue, and quality gate process.
- [`docs/clerk-oauth-trace-instructions.md`](./docs/clerk-oauth-trace-instructions.md) – manual OAuth trace workflow.
- `.agent/context/context.md` – programme context and current priorities.
