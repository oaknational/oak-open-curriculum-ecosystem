# ADR-122: Permissive CORS for OAuth-Protected MCP Servers

## Status

Accepted (2026-02-28). Amended 2026-05-10 (permissive CORS versus Origin/Host
validation) and 2026-06-23 to record the actual `/mcp` posture: Host validation
is enforced in the auth layer, Origin is deliberately permissive, and the OAuth
Bearer token is the security boundary. See ADR-158 for the layer topology.

**Related**: [ADR-052 (OAuth 2.1)](052-oauth-2.1-for-mcp-http-authentication.md), [ADR-053 (Clerk)](053-clerk-as-identity-provider.md), [ADR-113 (MCP spec-compliant auth for all methods)](113-mcp-spec-compliant-auth-for-all-methods.md), [ADR-116 (resolveEnv pipeline)](116-resolve-env-pipeline-architecture.md), [ADR-158 (multi-layer security)](158-multi-layer-security-and-rate-limiting.md), [ADR-219 (rate limiting is an edge concern)](219-rate-limiting-is-an-edge-concern.md)

## Context

The HTTP MCP server previously offered a three-mode CORS system (`dangerously_allow_all`, `explicit`, `automatic`) controlled by `CORS_MODE` and `ALLOWED_ORIGINS` environment variables. The `automatic` mode restricted origins to Vercel deployment URLs in production.

This caused two problems:

1. **Operational**: A stale `CORS_MODE` value on Vercel (`allow_all` instead of the renamed `dangerously_allow_all`) crashed deployments on startup. The error message was misleading because `buildEnvResolutionError` reported all absent-but-optional env vars as "missing keys", making operators think 8+ variables needed configuring when only one had an invalid value.

2. **Architectural**: CORS origin restrictions actively blocked legitimate browser-based MCP clients. An OAuth-protected MCP server should be callable from any origin — security is enforced by Bearer token authentication, not by browser same-origin policy.

## Decision

CORS is unconditionally permissive: all origins are allowed. The `CORS_MODE`,
`ALLOWED_ORIGINS`, `BASE_URL`, and `MCP_CANONICAL_URI` environment variables
are removed.

CORS is an interoperability policy, not a security control. The security
boundary for the authenticated `/mcp` endpoint is the OAuth 2.1 Bearer token.
Host validation is enforced on `/mcp` within the auth layer — the
`getPRMUrl`/`getMcpResourceUrl` host-allowlist check rejects a disallowed Host
with `403` before authentication — while Origin is deliberately not validated,
because a header-borne Bearer token with `credentials: false` gives a
cross-origin page nothing to attach or replay. The standalone DNS-rebinding
middleware guards the unauthenticated browser-reachable surfaces (the landing
page and Host-sensitive metadata derivation). See ADR-158 for the layer topology.

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

### Origin/Host validation is scoped to where it adds security

A hostile website can drive a browser to reach a private MCP server, so
Origin/Host validation matters on surfaces that have no other boundary: the
unauthenticated landing page and Host-sensitive metadata derivation, where the
standalone DNS-rebinding middleware applies it. The authenticated `/mcp`
endpoint is Host-validated in the auth layer (a disallowed Host is rejected with
`403` before authentication) and bounded by the Bearer token, which a
cross-origin browser cannot attach or replay (see "CORS adds no security for
Bearer-token authentication" above). Explicit Origin validation on `/mcp` would
add configuration surface and risk breaking legitimate browser and iframe MCP
clients for no security gain. ADR-158 records the full layer topology.

### Dead code removal

`BASE_URL` and `MCP_CANONICAL_URI` were declared in the env schema but never consumed by any production code path. The `readEnv()` function that derived them was only called in tests, not in the `loadRuntimeConfig` → `resolveEnv` production startup path. These are removed alongside the CORS simplification.

## Consequences

- **Positive**: Fewer env vars to configure; no CORS-related deployment failures; browser-based MCP clients can connect; simpler codebase
- **Positive**: Error messages from `buildEnvResolutionError` now distinguish failing keys from absent-but-optional keys
- **Neutral**: Any MCP client from any origin can attempt requests, but all protected endpoints still require a valid OAuth token
- **Risk**: The development-only no-auth variant (`DANGEROUSLY_DISABLE_AUTH=true`)
  removes the auth layer from `/mcp`, and with it the Host-allowlist check,
  leaving an endpoint with neither authentication nor Host/Origin validation.
  This variant is for local development only and is rejected by env validation
  in production; treat any deployment that sets it as a configuration defect.
  The residual exposure — DNS rebinding against a developer's local server — is
  bounded by the read-only blast radius (no state mutation; worst case is
  consuming the developer's upstream Oak API quota).
