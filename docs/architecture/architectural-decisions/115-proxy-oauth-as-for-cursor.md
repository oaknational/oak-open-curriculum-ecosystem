# ADR-115: Proxy OAuth Authorisation Server for Cursor Compatibility

## Status

Accepted (2026-02-21)

**Related**: [ADR-052 (OAuth 2.1)](052-oauth-2.1-for-mcp-http-authentication.md), [ADR-053 (Clerk)](053-clerk-as-identity-provider.md), [ADR-113 (Spec-Compliant Auth)](113-mcp-spec-compliant-auth-for-all-methods.md)

## Context

Cursor (v2.5.20 and later) cannot complete the MCP OAuth flow when the resource server (RS) and authorisation server (AS) are on different origins. This is a [confirmed Cursor bug](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331) where the `resource_metadata` URL from the initial 401 `WWW-Authenticate` header is not persisted across the browser redirect. After the user authorises at Clerk, Cursor cannot re-discover the AS token endpoint, and the token exchange fails silently.

This affects all configurations where the RS and AS are on different origins:

- `http://localhost:3333` (RS) vs `https://native-hippo-15.clerk.accounts.dev` (AS)
- `https://curriculum-mcp.oaknational.dev` (RS) vs `https://native-hippo-15.clerk.accounts.dev` (AS)

MCP Inspector and programmatic clients (e.g. `pnpm smoke:oauth:spec`) are unaffected — the bug is specific to Cursor's `resource_metadata` persistence.

### Options Considered

| Option                      | Description                                 | Verdict                                  |
| --------------------------- | ------------------------------------------- | ---------------------------------------- |
| **A: Proxy OAuth AS**       | Server acts as its own AS, proxies to Clerk | **Accepted**                             |
| B: Wait for Cursor fix      | Bug is reported, fix is straightforward     | Rejected — unpredictable release cadence |
| C: Dedicated `/cursor` path | Cursor-specific metadata                    | Rejected — does not fix root cause       |

## Decision

Act as a **proxy OAuth Authorisation Server** by serving three proxy endpoints that transparently forward all OAuth operations to Clerk. This makes the RS and AS the same origin, bypassing the Cursor bug.

### Proxy Endpoints

| Route                  | Proxy behaviour                                                                 |
| ---------------------- | ------------------------------------------------------------------------------- |
| `POST /oauth/register` | Forwards JSON body to Clerk's DCR endpoint, returns response verbatim           |
| `GET /oauth/authorize` | Constructs redirect URL to Clerk's authorise endpoint with all query params     |
| `POST /oauth/token`    | Forwards raw `application/x-www-form-urlencoded` body to Clerk's token endpoint |

### Metadata Rewriting

- **PRM** (`/.well-known/oauth-protected-resource` and path-qualified `/mcp` variant per RFC 9728 Section 3.1): `authorization_servers` points to self-origin.
- **AS Metadata** (`/.well-known/oauth-authorization-server`): Fetched from Clerk at startup, cached for process lifetime. `issuer`, `authorization_endpoint`, `token_endpoint`, `registration_endpoint` rewritten to self-origin per-request. All capability fields (`scopes_supported`, `grant_types_supported`, etc.) pass through unchanged.

### Architecture

```text
                    ┌─────────────────────────────────────────┐
                    │           Our MCP Server                │
                    │                                         │
                    │  ┌──────────────────────────────────┐   │
                    │  │  OAuth Proxy Layer                │   │
                    │  │  /oauth/authorize  → Clerk        │   │
                    │  │  /oauth/token      → Clerk        │   │
                    │  │  /oauth/register   → Clerk        │   │
                    │  └──────────────────────────────────┘   │
                    │                                         │
                    │  ┌──────────────────────────────────┐   │
                    │  │  OAuth Metadata                   │   │
                    │  │  /.well-known/oauth-protected-    │   │
                    │  │    resource → AS points to self   │   │
                    │  │  /.well-known/oauth-authorization-│   │
                    │  │    server → rewritten from Clerk  │   │
                    │  └──────────────────────────────────┘   │
                    │                                         │
                    │  ┌──────────────────────────────────┐   │
                    │  │  MCP Endpoint (UNCHANGED)         │   │
                    │  │  /mcp → Clerk token verification  │   │
                    │  └──────────────────────────────────┘   │
                    └─────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────────┐
                    │           Clerk (Upstream AS)           │
                    │  /oauth/authorize                       │
                    │  /oauth/token                           │
                    │  /oauth/register                        │
                    │  Token introspection / JWKS             │
                    └─────────────────────────────────────────┘
```

## Rationale

### Transparent Passthrough

The proxy is a transparent pipe. It does NOT validate, filter, rate-limit, or alter any request or response. Clerk is the real authorisation server and handles all security. The proxy adds nothing of its own.

- `/oauth/authorize`: All query parameters forwarded via `buildAuthorizeRedirectUrl()`.
- `/oauth/token`: Raw body forwarded as-is (parsed by `express.text()`, not `express.urlencoded()`).
- `/oauth/register`: JSON body forwarded via `JSON.stringify(req.body)`.

This makes the proxy resilient to upstream changes (e.g. Clerk adding new parameters or grant types).

### Always-On

One code path for all clients, all environments. No client detection, no conditional enablement. MCP Inspector, Claude, and programmatic clients all go through the proxy — the tokens are identical. If Cursor fixes the bug, the proxy can be removed without urgency.

### Open Redirect Prevention

`/oauth/authorize` redirects to a URL derived at startup from `CLERK_PUBLISHABLE_KEY` via `deriveUpstreamOAuthBaseUrl()`. The redirect target is an immutable value set once at process start. Client requests append query parameters to this known-good base URL — they cannot control the redirect hostname.

### Critical Assumption: Opaque Tokens

The proxy works because Clerk issues opaque tokens (`oat_...`), not JWTs. There is no `iss` claim to validate against the AS metadata `issuer`. Token verification happens via Clerk's API (`getAuth()`), which does not check where the client found the AS metadata.

**Risk**: If Clerk offers JWT access tokens in the future, the issuer mismatch (`issuer: "http://localhost:3333"` vs Clerk's actual issuer) will break clients that validate `iss` claims against AS metadata.

### Error Handling

All upstream HTTP calls use `fetchWithTimeout()` with a 10-second timeout (configurable via `OAuthProxyConfig.timeoutMs`). `fetchUpstream` returns `Result<T, ProxyFetchError>` with a discriminated union (`timeout` | `network`).

| Failure                | Proxy Response                                      |
| ---------------------- | --------------------------------------------------- |
| Clerk returns 4xx/5xx  | Pass through Clerk's status + body verbatim         |
| Clerk times out (>10s) | HTTP 504 + `{ "error": "temporarily_unavailable" }` |
| Network error          | HTTP 502 + `{ "error": "temporarily_unavailable" }` |

### Deployment Preconditions

1. **Host header trust**: The server derives self-origin from the request `Host` header via `deriveSelfOrigin()`. All OAuth metadata (`authorization_servers`, `issuer`, endpoint URLs) uses this value. Ingress (Vercel, reverse proxy) must enforce a canonical host/protocol — otherwise, a malicious `Host` header could cause metadata to advertise incorrect endpoints. Locally, `isLoopbackHost()` forces `http://` for `localhost`; in production, Vercel enforces the canonical domain.

2. **Rate limiting**: The proxy endpoints (`/oauth/register`, `/oauth/authorize`, `/oauth/token`) are unauthenticated and not rate-limited at the application layer. Clerk protects its own endpoints, but the proxy's CPU and egress are exposed to flood patterns. Edge/WAF rate limiting (Vercel's built-in, or Cloudflare if fronted) provides the compensating control.

### Precedent

A community member published a [working solution using this exact pattern with Microsoft Entra ID](https://forum.cursor.com/t/working-solution-mcp-server-oauth-with-microsoft-entra-id-on-azure-container-apps/151813). The MCP SDK provides `ProxyOAuthServerProvider` as an official pattern.

## Consequences

### Positive

1. **Cursor works**: Full OAuth flow completes (DCR → authorize → sign-in → token exchange → authenticated MCP calls).
2. **Other clients unaffected**: MCP Inspector, programmatic clients follow the same path transparently.
3. **Simple**: ~200 lines of pure functions + ~100 lines of route handlers. No state, no sessions, no token storage.
4. **Resilient**: Object-spread metadata rewriting automatically picks up new Clerk capability fields.
5. **Removable**: If Cursor fixes the `resource_metadata` persistence bug, the proxy can be removed. The proxy adds no coupling.

### Negative

1. **Additional latency**: Token exchange and DCR go through the proxy before reaching Clerk. Measured at <50ms additional per call — negligible for an operation that happens once per session.
2. **Opaque token dependency**: If Clerk switches to JWT access tokens, the issuer mismatch will need addressing.
3. **Token refresh blocked by Cursor**: Cursor does not send `grant_type=refresh_token` ([forum #149511](https://forum.cursor.com/t/cursor-does-not-refresh-oauth-tokens-for-mcp-servers/149511)). Access tokens expire after ~15 minutes and users must reconnect. The proxy is architecturally ready for refresh — no server-side fix is possible for this Cursor bug.

## Implementation

| File                                                     | Role                                                                                      |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/oauth-proxy/oauth-proxy-upstream.ts`                | Pure functions: URL derivation, redirect construction, metadata rewriting, Zod type guard |
| `src/oauth-proxy/oauth-proxy-routes.ts`                  | Express route handlers (register, authorize, token)                                       |
| `src/oauth-proxy/oauth-proxy-upstream.unit.test.ts`      | 22 unit tests                                                                             |
| `src/oauth-proxy/oauth-proxy-routes.integration.test.ts` | 10 integration tests (fake upstream via DI `fetch`)                                       |
| `src/oauth-proxy/index.ts`                               | Barrel export                                                                             |
| `src/auth-routes.ts`                                     | PRM + AS metadata endpoints; accepts `upstreamMetadata` via DI                            |
| `src/conditional-clerk-middleware.ts`                    | Proxy paths in `CLERK_SKIP_PATHS`                                                         |
| `src/app/oauth-and-caching-setup.ts`                     | Wires metadata + proxy into async bootstrap                                               |
| `src/application.ts`                                     | `createApp` is async; `upstreamMetadata` injectable via `CreateAppOptions`                |
| `e2e-tests/auth-enforcement.e2e.test.ts`                 | 16 E2E tests asserting self-origin metadata                                               |

All files within `apps/oak-curriculum-mcp-streamable-http/`.

## Deployment Preconditions

**Rate limiting must be in place before production rollout.** The proxy
OAuth flow exposes publicly reachable `/register` and `/token` endpoints.
Without edge/WAF rate limiting, these are vulnerable to credential-stuffing
and denial-of-service attacks. Configure rate limiting at the CDN/reverse
proxy layer (e.g. Vercel Edge Middleware, Cloudflare WAF, or AWS WAF)
before deploying to production.

## Related ADRs

- [ADR-052: OAuth 2.1 for MCP HTTP Authentication](052-oauth-2.1-for-mcp-http-authentication.md)
- [ADR-053: Clerk as Identity Provider](053-clerk-as-identity-provider.md) (amended to reflect proxy role)
- [ADR-113: MCP Spec-Compliant Auth](113-mcp-spec-compliant-auth-for-all-methods.md) (troubleshooting: `openid` scope)
- [ADR-112: Per-Request MCP Transport](112-per-request-mcp-transport.md)

## References

- [Cursor Forum #151331: resource_metadata URL loss](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331)
- [Cursor Forum #149511: Token refresh not working](https://forum.cursor.com/t/cursor-does-not-refresh-oauth-tokens-for-mcp-servers/149511)
- [RFC 9728: OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728)
- [RFC 8414: OAuth 2.0 Authorisation Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414)
- [MCP Authorisation Spec (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [Working Solution: Entra ID Proxy](https://forum.cursor.com/t/working-solution-mcp-server-oauth-with-microsoft-entra-id-on-azure-container-apps/151813)
