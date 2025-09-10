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
  - `BASE_URL` (e.g. `https://<project>.vercel.app`)
  - `MCP_CANONICAL_URI` (e.g. `${BASE_URL}/mcp`)
  - `ALLOWED_HOSTS` (comma-separated)
- Optional:
  - `ALLOWED_ORIGINS` for browser CORS
  - `LOG_LEVEL` (default `info`)
  - `ENABLE_LOCAL_AS` for demo JWKS endpoints

### Smoke-test checklist (post-deploy)

- Confirm Node runtime (not Edge) in project settings
- Verify envs set: `OAK_API_KEY`, `BASE_URL`, `MCP_CANONICAL_URI`, `ALLOWED_HOSTS`
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

## Troubleshooting

- 401 without `Authorization`: client must send a Bearer token; see OAuth metadata endpoint
- CORS blocked: set `ALLOWED_ORIGINS` to include your origin
- Host blocked: add host to `ALLOWED_HOSTS`
- Dev local AS: set `ENABLE_LOCAL_AS=true` and provide `LOCAL_AS_JWK` or let the app generate one
