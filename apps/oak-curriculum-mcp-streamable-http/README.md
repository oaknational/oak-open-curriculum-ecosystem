# Oak Curriculum MCP – Streamable HTTP (Vercel-ready)

This app exposes the Curriculum MCP server over Streamable HTTP using the official TypeScript SDK transport. It defaults to stateless mode (no SSE) and is designed for Vercel’s Node runtime.

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
  -H 'Accept: application/json, text/event-stream' \
  -X POST http://localhost:3333/mcp \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
```

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
