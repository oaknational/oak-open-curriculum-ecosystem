# ADR-126: HMAC-Signed Asset Download Proxy

## Status

Accepted (2026-03-06)

**Related**: [ADR-024 (Dependency Injection)](024-dependency-injection-pattern.md), [ADR-029 (No Manual API Data)](029-no-manual-api-data.md), [ADR-030 (SDK Single Source of Truth)](030-sdk-single-source-truth.md), [ADR-050 (MCP Tool Layering DAG)](050-mcp-tool-layering-dag.md), [ADR-054 (Auth Error Interception)](054-tool-level-auth-error-interception.md), [ADR-078 (DI for Testability)](078-dependency-injection-for-testability.md), [ADR-113 (MCP Spec-Compliant Auth)](113-mcp-spec-compliant-auth-for-all-methods.md)

## Context

MCP clients (ChatGPT, Claude, Cursor) execute tools that return text and structured data. When a teacher asks to download a lesson worksheet, slide deck, or other asset, the MCP server needs to return a clickable URL. However:

1. **The Oak API requires a Bearer token** — the MCP server holds the `OAK_API_KEY`, but it cannot be exposed to the client.
2. **MCP has no binary streaming primitive** — tool results are JSON text; there is no mechanism to return file bytes.
3. **URLs must be short-lived** — permanent download links would allow indefinite asset access without re-authentication.

## Decision

Implement an HMAC-signed download proxy on the HTTP MCP server:

1. The `download-asset` aggregated tool generates a **signed, short-lived URL** pointing to the MCP server's own `/assets/download/:lesson/:type` route.
2. The download route **validates the HMAC signature**, then **proxies the request** to the Oak API with the server-held Bearer token.
3. The HMAC signing secret is **derived from the Oak API key** using HMAC-SHA256 key separation — never using the API key directly as the signing key.

### Architecture

```
MCP Client ──tool call──▶ MCP Server ──generates──▶ Signed URL
Browser    ──clicks URL──▶ MCP Server /assets/download/:lesson/:type
                              │  1. Validate HMAC signature + expiry
                              │  2. Proxy to Oak API with Bearer token
                              │  3. Stream binary response to browser
                              ▼
                           Oak API (upstream)
```

### Signature Scheme

- **Algorithm**: HMAC-SHA256 with key separation (`deriveSigningSecret`)
- **Payload**: `JSON.stringify([lesson, type, expiresAt])` — JSON canonical form prevents delimiter-injection
- **Comparison**: `timingSafeEqual` with length pre-check — constant-time to prevent timing attacks
- **TTL**: 5 minutes (`DOWNLOAD_TTL_MS = 300_000`)
- **Validation**: Strict `>=` comparison on expiry boundary

### Key Separation

The signing secret is derived, not reused:

```typescript
function deriveSigningSecret(oakApiKey: string): string {
  return createHmac('sha256', oakApiKey).update('asset-download-signing').digest('hex');
}
```

This ensures:

- The API key is never used directly as an HMAC key
- If upstream API logs capture the Bearer header, the signing secret remains safe
- The two keys serve different purposes and cannot be confused

### Authentication Layers

| Layer              | Mechanism                               | Purpose                                              |
| ------------------ | --------------------------------------- | ---------------------------------------------------- |
| MCP tool execution | Clerk OAuth 2.1 (via `securitySchemes`) | Only authenticated users can invoke `download-asset` |
| Download URL       | HMAC-SHA256 signature + expiry          | Time-limited, resource-specific access               |
| Upstream API       | Bearer token (`OAK_API_KEY`)            | Server-to-server authentication                      |
| Network            | Cloudflare + Vercel                     | DDoS protection, bot mitigation, rate limiting       |

The `/assets/download/` route **bypasses Clerk middleware** — the HMAC signature IS the authentication for this route. This is correct because:

- The signed URL was only generated after Clerk OAuth validation
- The HMAC binds the URL to a specific lesson + type + time window
- Adding Clerk validation would prevent browser-click downloads (no OAuth token in browser navigation)

## Security Analysis

### Threat Model

| Threat                           | Mitigation                                                                 | Residual Risk                                                                                      |
| -------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| URL forgery                      | HMAC-SHA256 with derived key; `timingSafeEqual` comparison                 | None — computationally infeasible                                                                  |
| URL replay                       | 5-minute TTL with strict expiry checking                                   | Minimal — URLs are single-purpose within the window                                                |
| Bulk scraping via tool           | Clerk OAuth required for `download-asset` invocation                       | Authenticated users could script bulk generation; Cloudflare/Vercel rate limiting provides defence |
| Parameter tampering              | HMAC covers `[lesson, type, expiresAt]` — any change invalidates signature | None                                                                                               |
| Timing attack on signature       | `timingSafeEqual` with length pre-check                                    | None                                                                                               |
| SSRF via lesson slug             | `encodeURIComponent` on path segments; hardcoded base URL                  | None — cannot redirect to arbitrary hosts                                                          |
| Upstream credential exposure     | Key separation — signing secret derived from API key                       | Even if signing secret leaked, API key remains safe                                                |
| Content-type confusion           | `X-Content-Type-Options: nosniff` header on all proxy responses            | None                                                                                               |
| Upstream timeout / FD exhaustion | `AbortSignal.timeout(30_000)` combined with client-disconnect abort        | None — 30s hard limit                                                                              |
| Internal status code leakage     | All upstream errors mapped to 502                                          | None — client never sees upstream 401/403/404                                                      |

### Accepted Risks

1. **No app-level rate limiting**: Cloudflare and Vercel provide network-level DDoS protection and bot mitigation. An authenticated user with valid OAuth tokens could theoretically generate many download URLs. This is acceptable because:
   - The Oak API has its own rate limiting
   - Assets are educational content, not sensitive data
   - Adding app-level rate limiting adds complexity disproportionate to the risk

2. **Signing secret not independently rotatable**: The signing secret is derived from `OAK_API_KEY`. Rotating the API key rotates the signing secret, which invalidates all outstanding download URLs (acceptable given the 5-minute TTL). If independent rotation is needed in future, add an `ASSET_DOWNLOAD_SIGNING_SECRET` env var.

## Boundary Design

### SDK Layer (`packages/sdks/oak-curriculum-sdk`)

- `aggregated-asset-download/definition.ts` — Tool definition with `DOWNLOAD_ASSET_INPUT_SCHEMA` (enum from `ASSET_TYPES`)
- `aggregated-asset-download/execution.ts` — Argument validation and URL construction via injected factory
- `aggregated-asset-download/download-token.ts` — Pure HMAC signing/validation logic

### App Layer (`apps/oak-curriculum-mcp-streamable-http`)

- `asset-download/asset-download-route.ts` — Express route handler, streaming proxy, URL factory wiring
- Wired in `application.ts` via `mountAssetDownloadProxy`

**Dependency direction**: App → SDK → sdk-codegen (correct per ADR-030). The SDK provides the tool definition and HMAC primitives; the app provides the HTTP proxy and Clerk auth gate.

### Transport Awareness

The `download-asset` tool is registered on all transports but returns an informative error on stdio:

> "download-asset is not available in this transport (HTTP-only)"

This is preferable to hiding the tool, as it enables discoverability and clear error messaging.

## Consequences

### Positive

- Teachers can download lesson assets via clickable URLs in any MCP client
- No API key exposure to clients
- Time-limited URLs prevent credential accumulation
- Schema-driven asset types (`ASSET_TYPES` from codegen) — adding a new asset type requires only an OpenAPI schema update
- Full DI (fetch, clock, signing secret, base URL) enables comprehensive testing without global state mutation

### Negative

- Additional HTTP route to maintain
- HMAC scheme requires understanding key separation for future maintainers
- Streaming proxy adds operational complexity (error handling, timeout, client disconnect)

### Neutral

- 5-minute TTL balances security with usability — long enough for a teacher to click, short enough to limit replay window
