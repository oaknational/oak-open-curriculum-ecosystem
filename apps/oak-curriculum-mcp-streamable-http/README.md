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
  -X POST http://localhost:3333/mcp \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
```

Note: The server automatically adds the required `Accept: application/json, text/event-stream` header if missing, improving UX for simple curl commands and UI integrations.

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

## Request Tracing with Correlation IDs

The HTTP server automatically generates unique correlation IDs for each request to enable end-to-end request tracing and debugging.

### How it works

- Each incoming request receives a unique correlation ID in the format `req_{timestamp}_{randomHex}` (e.g., `req_1699123456789_a3f2c9`)
- If a client provides an `X-Correlation-ID` header, that ID is preserved and reused
- The correlation ID is included in the `X-Correlation-ID` response header
- All logs for a request include the correlation ID, making it easy to trace request flows

### Using correlation IDs

**Making a request:**

```bash
curl -i http://localhost:3333/healthz
# Response includes: X-Correlation-ID: req_1699123456789_a3f2c9
```

**Providing your own correlation ID:**

```bash
curl -i -H "X-Correlation-ID: my-trace-123" http://localhost:3333/healthz
# Response includes: X-Correlation-ID: my-trace-123
```

**Debugging with correlation IDs:**

1. Find the correlation ID from the response header or logs
2. Filter server logs by that correlation ID
3. See all operations for that specific request

**Example log filtering:**

```bash
# If logs are in stdout (Vercel):
grep "req_1699123456789_a3f2c9" logs.txt

# If using structured logging (JSON), filter by correlationId field
```

### Benefits

- **Distributed tracing**: Track requests across multiple services
- **Debugging**: Quickly find all logs related to a specific request
- **Error investigation**: Trace the full context of errors
- **Performance analysis**: Measure request latency by following correlation IDs

## Request Timing

All HTTP requests are automatically timed and logged with duration information. Slow requests (>2 seconds) are logged at WARN level for easy identification.

### How it works

- Every request starts a high-precision timer when received
- Duration is logged when the response completes
- Timing data includes both formatted ("1.23s") and precise (1234.56ms) values
- Slow requests are automatically flagged with `slowRequest: true`

### Example logs

**Normal request** (DEBUG level):

```json
{
  "level": "debug",
  "message": "Request completed",
  "correlationId": "req_1699123456789_a3f2c9",
  "duration": "145ms",
  "durationMs": 145.23,
  "method": "POST",
  "path": "/",
  "statusCode": 200
}
```

**Slow request** (WARN level):

```json
{
  "level": "warn",
  "message": "Request completed",
  "correlationId": "req_1699123456790_b4e3d0",
  "duration": "2.34s",
  "durationMs": 2340.12,
  "method": "POST",
  "path": "/",
  "statusCode": 200,
  "slowRequest": true
}
```

### Filtering and analyzing timing logs

**Find all slow requests:**

```bash
# Using grep
grep '"slowRequest":true' logs/server.log

# Using jq for better formatting
grep '"slowRequest":true' logs/server.log | jq .
```

**Find requests over 1 second:**

```bash
jq 'select(.durationMs > 1000)' logs/server.log
```

**Average request duration:**

```bash
jq -s 'map(.durationMs) | add/length' logs/server.log
```

**Find slowest requests:**

```bash
jq -s 'sort_by(.durationMs) | reverse | .[0:10]' logs/server.log
```

## Error Debugging

The HTTP server enriches all errors with correlation IDs, timing information, and request context for improved production debugging. Error logs include:

- **Correlation ID**: Unique identifier for tracing requests across the system
- **Timing**: Request duration when the error occurred
- **Request details**: HTTP method, path, and status code
- **Error context**: Original error message and stack trace

### Example enriched error log

```json
{
  "level": "error",
  "message": "Request error",
  "context": {
    "message": "Database connection timeout",
    "stack": "Error: Database connection timeout\n    at ...",
    "correlationId": "req_1699123456789_a3f2c9",
    "duration": "2.34s",
    "durationMs": 2340.56,
    "method": "POST",
    "path": "/mcp/v1/messages",
    "statusCode": 500
  },
  "timestamp": "2024-11-06T12:34:56.789Z"
}
```

### Filtering errors by correlation ID

When a client reports an error, use the correlation ID (returned in the `X-Correlation-ID` response header) to find all logs for that request:

```bash
# Find all logs for a specific request
grep 'req_1699123456789_a3f2c9' logs/server.log

# Pretty-print with jq
grep 'req_1699123456789_a3f2c9' logs/server.log | jq .

# Find the error and surrounding context
grep -C 5 'req_1699123456789_a3f2c9.*error' logs/server.log
```

### Example curl request with error response

```bash
curl -v https://your-server.com/mcp/v1/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"invalid": "request"}'

# Response includes X-Correlation-ID header
< HTTP/1.1 500 Internal Server Error
< X-Correlation-ID: req_1699123456789_a3f2c9
< Content-Type: application/json
{
  "error": "Internal Server Error",
  "message": "Invalid request format",
  "correlationId": "req_1699123456789_a3f2c9"
}
```

### Troubleshooting workflow for errors

1. **Client reports error** → Note the `X-Correlation-ID` from the response headers
2. **Search logs** → `grep '<correlation-id>' logs/server.log | jq .`
3. **Review request** → Check the "Request started" log for request details
4. **Find error** → Look for error log with same correlation ID
5. **Check timing** → Compare duration to identify timeout or slow operations
6. **Analyze stack trace** → Error log includes full stack trace for debugging

### Finding all errors

**All errors in logs:**

```bash
jq 'select(.level == "error")' logs/server.log
```

**Errors with timing over 2 seconds (slow request timeouts):**

```bash
jq 'select(.level == "error" and .context.durationMs > 2000)' logs/server.log
```

**Group errors by path:**

```bash
jq -s 'group_by(.context.path) | map({path: .[0].context.path, count: length})' logs/server.log
```

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

- MCP handlers are attached via `@oaknational/mcp-server-kit` `attachMcpHandlers`, using a registry of tools generated in the SDK.
- Request validation uses Zod schemas derived at compile-time from the OpenAPI spec; invalid inputs return a formatted error body (200 status, `isError: true`).
- Successful results are SSE-wrapped JSON-RPC responses formatted with `formatStandardContent`.
