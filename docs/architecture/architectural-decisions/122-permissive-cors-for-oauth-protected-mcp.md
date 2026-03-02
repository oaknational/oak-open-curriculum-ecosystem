# ADR-122: Permissive CORS for OAuth-Protected MCP Servers

## Status

Accepted (2026-02-28)

**Related**: [ADR-052 (OAuth 2.1)](052-oauth-2.1-for-mcp-http-authentication.md), [ADR-053 (Clerk)](053-clerk-as-identity-provider.md), [ADR-116 (resolveEnv pipeline)](116-resolve-env-pipeline-architecture.md)

## Context

The HTTP MCP server previously offered a three-mode CORS system (`dangerously_allow_all`, `explicit`, `automatic`) controlled by `CORS_MODE` and `ALLOWED_ORIGINS` environment variables. The `automatic` mode restricted origins to Vercel deployment URLs in production.

This caused two problems:

1. **Operational**: A stale `CORS_MODE` value on Vercel (`allow_all` instead of the renamed `dangerously_allow_all`) crashed deployments on startup. The error message was misleading because `buildEnvResolutionError` reported all absent-but-optional env vars as "missing keys", making operators think 8+ variables needed configuring when only one had an invalid value.

2. **Architectural**: CORS origin restrictions actively blocked legitimate browser-based MCP clients. An OAuth-protected MCP server should be callable from any origin — security is enforced by Bearer token authentication, not by browser same-origin policy.

## Decision

CORS is unconditionally permissive: all origins are allowed. The `CORS_MODE`, `ALLOWED_ORIGINS`, `BASE_URL`, and `MCP_CANONICAL_URI` environment variables are removed. DNS rebinding protection on the landing page is unchanged.

## Rationale

### CORS adds no security for Bearer-token authentication

CORS is a browser-enforced mechanism that controls which origins may receive responses. It is meaningful for cookie-based authentication where the browser automatically attaches credentials cross-origin. The MCP server uses OAuth 2.1 with Bearer tokens:

- `credentials: false` is set in the CORS configuration
- Browsers do not auto-send `Authorization: Bearer <token>` headers cross-origin
- An attacker cannot steal or replay a Bearer token through a CORS bypass

Restricting origins therefore adds configuration surface without any security benefit.

### Permissive CORS enables interoperability

- **Non-browser MCP clients** (Claude Desktop, Cursor, VS Code) ignore CORS entirely
- **Browser-based MCP clients** (ChatGPT web) need permissive CORS to connect to any MCP server
- **Future MCP Apps** (OpenAI Apps SDK, MCP-ext-apps) render in iframes on different origins and require cross-origin access
- The previous `automatic` mode restricted to Vercel deployment URLs, actively blocking all browser-based MCP clients in production

### DNS rebinding protection remains as the browser security measure

The landing page (`/`) serves HTML and is the only route vulnerable to DNS rebinding attacks. DNS rebinding protection validates the `Host` header against an allowlist derived from Vercel deployment URLs or explicit `ALLOWED_HOSTS`. This is orthogonal to CORS and remains unchanged.

### Dead code removal

`BASE_URL` and `MCP_CANONICAL_URI` were declared in the env schema but never consumed by any production code path. The `readEnv()` function that derived them was only called in tests, not in the `loadRuntimeConfig` → `resolveEnv` production startup path. These are removed alongside the CORS simplification.

## Consequences

- **Positive**: Fewer env vars to configure; no CORS-related deployment failures; browser-based MCP clients can connect; simpler codebase
- **Positive**: Error messages from `buildEnvResolutionError` now distinguish failing keys from absent-but-optional keys
- **Neutral**: Any MCP client from any origin can attempt requests, but all protected endpoints still require a valid OAuth token
- **Risk**: Low — this makes the server more permissive, not less. The security boundary is OAuth authentication, not origin policy
