# Oak Curriculum MCP – Streamable HTTP (Vercel-ready)

This app exposes the Curriculum MCP server over Streamable HTTP using the official TypeScript SDK transport and the MCP `McpServer` for the `/mcp` endpoint. It defaults to stateless mode (no SSE) and is designed for Vercel’s Node runtime.

## Quick start (local)

### Option 1: With Auth Bypass (Fastest for Development)

1. Create `.env` file in repository root:

```bash
OAK_API_KEY=your_api_key
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
REMOTE_MCP_ALLOW_NO_AUTH=true
NODE_ENV=development
ALLOWED_HOSTS=localhost,127.0.0.1,::1
```

2. Run dev server:

```bash
pnpm -C apps/oak-curriculum-mcp-streamable-http dev
```

3. Call MCP endpoint (no auth required when bypass enabled):

```bash
curl -sS \
  -H "Accept: application/json, text/event-stream" \
  -H 'Content-Type: application/json' \
  -X POST http://localhost:3333/mcp \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
```

### Option 2: With Real Clerk OAuth (Production-Equivalent)

Follow Option 1 but **omit** `REMOTE_MCP_ALLOW_NO_AUTH` and set `NODE_ENV=test`. Server will enforce Clerk OAuth. Use an MCP client like Claude Desktop to complete the OAuth flow.

**Note**: All requests must include `Accept: application/json, text/event-stream`. The server rejects calls missing the SSE media type with `406 Not Acceptable`.

### Example payloads

- `/mcp` success (SSE-wrapped JSON-RPC):

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "tools": [
      {
        "name": "get-key-stages",
        "description": "GET /key-stages",
        "inputSchema": { "type": "object", "properties": {} }
      }
    ]
  }
}
```

- `/mcp` error (unknown tool or invalid args → JSON-RPC error):

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "error": { "code": -32601, "message": "Tool non-existent-tool not found" }
}
```

### `/openai_connector` decommissioning

The historical `/openai_connector` alias has been removed. All clients must target `/mcp`, which now exposes the complete curriculum and OpenAI-compatible toolset (`search`, `fetch`, etc.). Update any remaining scripts, integrations, or documentation references to call `/mcp` directly.

## Vercel deployment

- Use Node runtime (not Edge)
- **Required environment variables**:
  - `CLERK_PUBLISHABLE_KEY` - Clerk public key from Clerk Dashboard
  - `CLERK_SECRET_KEY` - Clerk secret key from Clerk Dashboard
  - `OAK_API_KEY` - Oak Curriculum API key
  - `ALLOWED_HOSTS` (comma-separated, must include your primary hostname; supports `*` wildcards)
  - `BASE_URL` (e.g., `https://open-api.thenational.academy`)
  - `MCP_CANONICAL_URI` (e.g., `https://open-api.thenational.academy/mcp`)
- **Optional**:
  - `ALLOWED_ORIGINS` for browser CORS
  - `LOG_LEVEL` (default `info`)

### Health endpoints

- `/mcp`: `HEAD`, `GET`, and `OPTIONS` respond for health and metadata checks

### Smoke-test checklist (post-deploy)

- Confirm Node runtime (not Edge) in Vercel project settings
- Verify required environment variables set in Vercel:
  - `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (from Clerk Dashboard)
  - `OAK_API_KEY` (Oak Curriculum API key)
  - `ALLOWED_HOSTS` (must include deployment hostname)
  - `BASE_URL` and `MCP_CANONICAL_URI` (recommended)
- Run: `pnpm smoke:remote` to test deployed instance
- Manual verification:
  - `curl <deployment-url>/.well-known/oauth-protected-resource` returns Clerk AS URLs (not localhost!)
  - `POST <deployment-url>/mcp` without auth returns 401 with `WWW-Authenticate` header
  - OAuth flow works in Claude Desktop (user can authenticate and call tools)

### OAuth discovery

- `GET /.well-known/oauth-protected-resource` returns the canonical resource and authorisation servers
- 401 responses include a `WWW-Authenticate` header with `resource` and `authorization_uri` to guide clients

## Cursor (local STDIO) configuration

- The local STDIO server is configured via `.mcp.json` / `.cursor/mcp.json`. Ensure the command path points to:

```json
{
  "command": "pnpm",
  "args": ["exec", "tsx", "apps/oak-curriculum-mcp-stdio/bin/oak-curriculum-mcp.ts"]
}
```

If tools do not appear, check `.logs/oak-curriculum-mcp-startup/startup.log` for diagnostics.

## Authentication

**Status**: ✅ **Production OAuth 2.1 via Clerk**

The server uses [Clerk](https://clerk.com/) as the OAuth 2.1 Authorization Server, providing secure, production-ready authentication for MCP clients.

### How it Works

1. MCP client (e.g., Claude Desktop) attempts to call `/mcp`
2. Server returns `401` with `WWW-Authenticate` header pointing to Clerk
3. Client fetches OAuth metadata from `/.well-known/oauth-protected-resource`
4. Client initiates OAuth flow with Clerk (opens browser for user auth)
5. User authenticates via Google SSO (restricted to `@thenational.academy` only)
6. Clerk issues JWT access token to client
7. Client includes token in subsequent `/mcp` requests: `Authorization: Bearer <token>`

### Required Environment Variables

**Production/Vercel**:

- `CLERK_PUBLISHABLE_KEY` - Clerk public key (starts with `pk_test_` or `pk_live_`)
- `CLERK_SECRET_KEY` - Clerk secret key (starts with `sk_test_` or `sk_live_`)
- `BASE_URL` - Server base URL (e.g., `https://open-api.thenational.academy`)
- `MCP_CANONICAL_URI` - MCP endpoint URL (e.g., `https://open-api.thenational.academy/mcp`)
- `OAK_API_KEY` - Oak Curriculum API key
- `ALLOWED_HOSTS` - DNS rebinding protection

**Local Development Bypass** (optional):

- `REMOTE_MCP_ALLOW_NO_AUTH=true` - Bypass OAuth for local testing (only works when `NODE_ENV=development` and not on Vercel)
- `DANGEROUSLY_DISABLE_AUTH=true` - Bypass ALL auth **everywhere** (use with extreme caution, never in production)

## Troubleshooting

### Authentication Issues

- **401 Unauthorized on `/mcp` requests**:
  - **Expected behavior**: Without a valid Clerk OAuth token, all `/mcp` requests return 401
  - **For local dev**: Set `REMOTE_MCP_ALLOW_NO_AUTH=true` and `NODE_ENV=development` to bypass auth
  - **For MCP clients**: Client must complete OAuth flow via Clerk (see OAuth discovery section)
  - **Check Clerk status**: <https://status.clerk.com/>

- **OAuth flow doesn't start in MCP client**:
  - Verify `/.well-known/oauth-protected-resource` returns Clerk URLs (not localhost)
  - Check `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set in environment
  - Verify Dynamic Client Registration is enabled in Clerk Dashboard

- **User can't sign in** ("Email not allowed" error):
  - Only `@thenational.academy` emails are allowed
  - Verify user's email domain is correct
  - Check Clerk Dashboard → Configure → Restrictions → Allowlist

### Server Issues

- **500 errors on `/mcp` or `/.well-known/*`**:
  - Check Vercel logs for specific error details
  - Verify all required environment variables are set (see Authentication section)
  - Ensure Clerk keys are valid (check Clerk Dashboard → API Keys)

- **CORS blocked**: Set `ALLOWED_ORIGINS` to include your origin
- **Host blocked**: Add host to `ALLOWED_HOSTS` (comma-separated list)

### Local Development

- **Server won't start**:
  - Verify `.env` file exists in repository root with `OAK_API_KEY`
  - For Clerk auth testing: Add `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
  - For no-auth testing: Add `REMOTE_MCP_ALLOW_NO_AUTH=true` and `NODE_ENV=development`

## How it works

- `/mcp` is implemented with MCP `McpServer`; tools are registered directly from SDK‑generated metadata.
- Request validation uses Zod schemas derived at compile-time from the OpenAPI spec. Unknown tool and argument validation failures are returned as JSON‑RPC errors; execution and output‑validation failures are returned as a single text content item with a compact JSON error payload.
- Successful results are SSE-wrapped JSON-RPC responses (Streamable HTTP).
- Aggregated OpenAI-compatible tools (`search`, `fetch`) are registered alongside curriculum tools via the generated universal executor, so `/mcp` returns the complete catalogue from a single endpoint.

## Testing

For comprehensive testing documentation, see [TESTING.md](./TESTING.md).

**Quick Overview**:

- **Unit Tests** - Pure functions, no I/O: `pnpm test`
- **Integration Tests** - Integrated components, imported code: `pnpm test`
- **E2E Tests** - Running server, real I/O: `pnpm test:e2e`
- **Smoke Tests** - Critical path validation: `pnpm smoke:dev:stub`

**Test Philosophy**: This project uses deterministic, idempotent tests with NO conditional logic. Each test file has ONE clear setup and ONE clear set of expectations, ensuring instant, complete information flow from test results.

**Auth Testing**: We test both auth enforcement (production-equivalent) and auth bypass (local DX) in separate, deterministic test files to prove both behaviors work correctly.

See [TESTING.md](./TESTING.md) for detailed documentation on:

- Testing philosophy and strategy
- Test layers (unit, integration, E2E, smoke)
- Running and debugging tests
- Test scenario matrix
- Adding new tests

## Smoke testing

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub` – Launches local server in stub mode with auth bypass enabled. Forces `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true` and `REMOTE_MCP_ALLOW_NO_AUTH=true`. All responses are generated from schema-driven stubs, so the run is completely offline (no network calls to Oak API or Clerk).
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live` – Starts local server in live mode with auth bypass enabled. Requires `OAK_API_KEY` from `.env` file. Makes real API calls to Oak Curriculum API but bypasses Clerk OAuth for testing convenience.

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote [https://open-api.thenational.academy/mcp]` – Tests deployed instance (Vercel) with real Clerk OAuth enforcement. Requires base URL as CLI argument, `SMOKE_REMOTE_BASE_URL`, or `OAK_MCP_URL`. Fails fast if none provided. Remote runs validate production configuration including auth enforcement.

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live:auth` - **Manual test only** (not in automated quality gate). Requires REAL Clerk production keys to test auth enforcement locally. Dummy test credentials don't enforce authentication. Use before production deployment to validate auth works.

`runSmokeSuite` calls `loadRootEnv({ startDir: process.cwd() })` exactly once per run so the logs always show which `.env` file (if any) was applied. Remember to set `Accept: application/json, text/event-stream` when replaying the HTTP calls manually; the smoke harness enforces the header and expects matching behaviour remotely. Remote runs surface drift in downstream deployments, so failures there are often due to an older release rather than the harness itself.

### Structured logging, snapshots, and diffing

- Logging honours `LOG_LEVEL` (defaults to `info`). Set `LOG_LEVEL=debug` to see request/response metadata, payload excerpts, and remote diagnostic warnings.
- Enable file capture with `SMOKE_LOG_TO_FILE=true`. Each invocation writes JSON envelopes to `apps/oak-curriculum-mcp-streamable-http/tmp/smoke-logs/{mode}-{tool}.json`; the directory is ignored by git.
- Add `SMOKE_CAPTURE_ANALYSIS=true` to mirror SSE envelopes into `tmp/smoke-logs/analysis/`, tagged by mode (e.g. `get-key-stages-local-live.sse.json`). Pair with `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:capture:rest` to snapshot the upstream REST payloads (`*-rest.json`) for side-by-side comparison.
- Suggested diff loop:

  ```bash
  LOG_LEVEL=debug SMOKE_LOG_TO_FILE=true SMOKE_CAPTURE_ANALYSIS=true pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub
  LOG_LEVEL=debug SMOKE_LOG_TO_FILE=true SMOKE_CAPTURE_ANALYSIS=true pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:capture:rest
  jq . tmp/smoke-logs/analysis/get-key-stages-local-stub.sse.json > /tmp/stub.json
  jq . tmp/smoke-logs/analysis/get-key-stages-local-live.sse.json > /tmp/live.json
  jq . tmp/smoke-logs/analysis/get-key-stages-rest.json > /tmp/rest.json
  diff -u /tmp/stub.json /tmp/live.json
  diff -u /tmp/live.json /tmp/rest.json
  ```

  Repeat for `get-key-stages-subject-lessons` (or any additional tools) to understand live/stub divergences before patching the formatter or schema.

- Remote runs may receive 401/404 responses when credentials are missing or the deployment is stale. The harness now logs these status codes but keeps running so you can collect context instead of failing the entire script.
