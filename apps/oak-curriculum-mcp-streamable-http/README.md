# Oak Curriculum MCP – Streamable HTTP (Vercel-ready)

This app exposes the Curriculum MCP server over Streamable HTTP using the official TypeScript SDK transport and the MCP `McpServer` for the `/mcp` endpoint. It defaults to stateless mode (no SSE) and is designed for Vercel’s Node runtime.

## Quick start (local)

1. Set env vars (minimal):

```bash
export OAK_API_KEY=your_api_key
export REMOTE_MCP_DEV_TOKEN=dev-token
export ALLOWED_HOSTS=localhost,127.0.0.1,::1
```

2. Run dev server:

```bash
pnpm -C apps/oak-curriculum-mcp-streamable-http dev
```

3. List tools (dev token):

```bash
curl -sS \
  -H "Authorization: Bearer $REMOTE_MCP_DEV_TOKEN" \
  -H 'Content-Type: application/json' \
  -X POST http://localhost:3333/mcp \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
```

Note: Requests must explicitly include `Accept: application/json, text/event-stream`. The server now rejects calls missing the SSE media type with `406 Not Acceptable`.

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
- Minimal env:
  - `OAK_API_KEY`
  - `ALLOWED_HOSTS` (comma-separated, must include your primary hostname; supports `*` wildcards)
  - `BASE_URL` (recommended; if omitted we derive from request host)
  - `MCP_CANONICAL_URI` (recommended; defaults to `${BASE_URL}/mcp` if `BASE_URL` is set)
- Optional:
  - `ALLOWED_ORIGINS` for browser CORS
  - `LOG_LEVEL` (default `info`)
  - `ENABLE_LOCAL_AS` for demo JWKS endpoints

### Health endpoints

- `/mcp`: `HEAD`, `GET`, and `OPTIONS` respond for health and metadata checks

### Smoke-test checklist (post-deploy)

- Confirm Node runtime (not Edge) in project settings
- Verify envs set: `OAK_API_KEY`, `ALLOWED_HOSTS` (+ optionally `BASE_URL`, `MCP_CANONICAL_URI`)
- Curl `/.well-known/oauth-protected-resource` returns resource + auth servers
- POST `/mcp` without auth returns 401 with `WWW-Authenticate` containing `resource` and `authorization_uri`
- POST `/mcp` with a valid Bearer token returns 200 and SSE-wrapped JSON-RPC

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

## Authentication status and next steps

- Production OAuth is MANDATORY next step. The server already validates RFC 9068 JWTs against a co‑hosted demo AS when `ENABLE_LOCAL_AS=true`, but there is no production Authorization Server yet. Implement:
  - Authorization Code + PKCE for UI users (Google OIDC restricted to `*.thenational.academy`).
  - Device Authorization Grant for headless/MCP clients. AS mints short‑lived JWT access tokens (`iss=BASE_URL`, `aud=MCP_CANONICAL_URI`).
- Until production OAuth exists, Vercel deploys will return 401 unless you provide a valid JWT minted by the demo AS. Dev tokens are intentionally ignored on Vercel.

Temporary validation bypass (for smoke only):

- **Dangerous override**: set `DANGEROUSLY_DISABLE_AUTH=true` to bypass all authentication (works everywhere, including production - use with extreme caution)
- Preview/CI only: set `CI=true` and `REMOTE_MCP_CI_TOKEN=<secret>` and call with `Authorization: Bearer <secret>`. Remove after validation.
- Local only: set `REMOTE_MCP_ALLOW_NO_AUTH=true` (ignored on Vercel) or use `REMOTE_MCP_DEV_TOKEN`.

## Troubleshooting

- 500 on `/.well-known/oauth-protected-resource` or `/mcp`:
  - Ensure Vercel framework is Express and the app default‑exports an Express instance (this repo does in `src/index.ts`).
  - Verify `ALLOWED_HOSTS` includes your alias host (e.g. `curriculum-mcp-alpha.oaknational.dev`).
  - If using local demo AS, ensure `ENABLE_LOCAL_AS=true` and `LOCAL_AS_JWK` is present or allow the app to generate it.
- 401 without `Authorization`: client must send a Bearer token; see OAuth metadata endpoint. For demo: enable `ENABLE_LOCAL_AS=true` and mint a short‑lived JWT.
- CORS blocked: set `ALLOWED_ORIGINS` to include your origin
- Host blocked: add host to `ALLOWED_HOSTS`
- Dev local AS: set `ENABLE_LOCAL_AS=true` and provide `LOCAL_AS_JWK` or let the app generate one

## How it works

- `/mcp` is implemented with MCP `McpServer`; tools are registered directly from SDK‑generated metadata.
- Request validation uses Zod schemas derived at compile-time from the OpenAPI spec. Unknown tool and argument validation failures are returned as JSON‑RPC errors; execution and output‑validation failures are returned as a single text content item with a compact JSON error payload.
- Successful results are SSE-wrapped JSON-RPC responses (Streamable HTTP).
- Aggregated OpenAI-compatible tools (`search`, `fetch`) are registered alongside curriculum tools via the generated universal executor, so `/mcp` returns the complete catalogue from a single endpoint.

## Testing

- Stub-mode and live-mode E2E coverage runs via Vitest: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`.
- The suite relies on helpers that configure `OAK_CURRICULUM_MCP_USE_STUB_TOOLS` for stub scenarios and injectable overrides for live parity; no manual env preparation is required.

## Smoke testing

- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub` – launches a local server in stub mode, forces `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`, and seeds the deterministic `REMOTE_MCP_DEV_TOKEN=stub-smoke-dev-token`. All responses are generated from schema-driven stubs, so the run is completely offline.
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live` – starts the same local server in live mode. `loadRootEnv` searches the repo root for `.env.local`/`.env`, requires `OAK_API_KEY`, and logs which file was used. The harness fails fast with a clear message if the key is missing.
- `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote [https://curriculum-mcp-alpha.oaknational.dev/mcp]` – targets a deployed instance without starting a local server. A base URL is required; the harness resolves it in the order CLI argument → `SMOKE_REMOTE_BASE_URL` → `OAK_MCP_URL` and fails fast if none is available. The remote deployment currently runs without bearer authentication, so the smoke logs capture status codes and payloads for reference instead of asserting on them. Preview deployments (for example, `https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp`) update roughly five minutes after each push.

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
