# ADR-113: MCP Spec-Compliant Auth for All Methods

**Status**: Accepted
**Date**: 2026-02-19
**Supersedes**: [ADR-056 (Conditional Clerk Middleware for Discovery)](056-conditional-clerk-middleware-for-discovery.md)
**Related**: [ADR-052 (OAuth 2.1)](052-oauth-2.1-for-mcp-http-authentication.md), [ADR-053 (Clerk)](053-clerk-as-identity-provider.md), [ADR-054 (Tool-Level Auth)](054-tool-level-auth-error-interception.md), [ADR-057 (Selective Auth for Public Resources)](057-selective-auth-public-resources.md)

## Context

ADR-056 introduced conditional Clerk middleware that skipped authentication for MCP discovery methods (`initialize`, `tools/list`, `resources/list`, etc.) to reduce latency. At the time, the MCP specification was ambiguous about whether discovery methods required auth.

Two problems emerged:

### 1. MCP 2025-11-25 Specification Clarity

The MCP authorisation specification now states:

> "Authorization MUST be included in every HTTP request from client to server (other than to the OAuth metadata endpoints)."

Our discovery method bypass violated this requirement. All MCP methods -- including `initialize` and `tools/list` -- must return HTTP 401 when no valid token is present.

### 2. OAuth Bootstrap Failure

MCP clients (Cursor, Claude Desktop) trigger OAuth bootstrap when they receive an initial HTTP 401 with a `WWW-Authenticate` header containing `resource_metadata`. By bypassing auth for discovery methods:

- Cursor never received a 401
- Cursor never triggered the OAuth flow
- Users saw "Needs login" perpetually instead of being prompted to authenticate

Additionally, the `mcp-router.ts` conflated "noauth tool" (tool with no scope requirements) with "no HTTP auth needed", allowing tools like `get-changelog` and `get-rate-limit` to be called without any authentication token.

## Decision

**Enforce HTTP-level authentication for ALL MCP methods.** The only exception is public resource reads (widget HTML, documentation) which contain no user-specific data.

### What Changed

1. **`mcp-router.ts`**: `shouldSkipAuth()` now only checks for public resource reads. All other MCP methods go through `options.auth()`.

2. **`conditional-clerk-middleware.ts`**: Removed `CLERK_SKIP_METHODS` set and `isDiscoveryMethod()` check. Only path-based skips (`.well-known`, health checks) and public resource reads remain.

3. **Deleted**: `mcp-method-classifier.ts`, its unit test, and `discovery-methods-sync.unit.test.ts` -- all dead code with no remaining consumers.

### What Did NOT Change

- **`DANGEROUSLY_DISABLE_AUTH`**: Development auth bypass is unaffected (bypasses the entire auth stack at app startup).
- **Tool-level scope checking** (`check-mcp-client-auth.ts`): `toolRequiresAuth()` still determines whether deeper scope verification is needed AFTER base HTTP auth is enforced.
- **Public resource reads** (ADR-057): Widget HTML and documentation skip auth.
- **OAuth metadata endpoints**: `/.well-known/*` routes remain public per RFC 9728.

## Rationale

### Spec Compliance Over Latency Optimisation

ADR-056 optimised for latency (~170ms saved per discovery request). This optimisation is correct from a performance perspective but violates the MCP specification. Spec compliance takes priority because:

1. It enables the OAuth bootstrap flow that MCP clients depend on
2. It prevents semantic confusion between "no scope required" and "no auth required"
3. It aligns with the security principle that all requests should be authenticated

### Latency Trade-Off

| Scenario                        | ADR-056 | ADR-113 | Impact    |
| ------------------------------- | ------- | ------- | --------- |
| Single discovery request        | ~5ms    | ~175ms  | +170ms    |
| 28 discovery requests (refresh) | ~140ms  | ~4.9s   | +4.7s     |
| Tool execution                  | ~175ms  | ~175ms  | No change |

If Clerk latency becomes a concern, the correct mitigation is JWKS caching or Clerk SDK configuration -- not skipping auth. The latency optimisation in ADR-056 was architecturally correct but protocol-incorrect.

### Disambiguation: "noauth" Means "No Scope Check"

Tools with `securitySchemes: [{ type: 'noauth' }]` (e.g., `get-changelog`) still need HTTP-level authentication. The `noauth` designation means the tool does not require specific OAuth scopes -- not that it can be called without any authentication token. This distinction is enforced by:

- **HTTP layer** (`mcp-router.ts`): All requests go through auth middleware
- **Tool layer** (`check-mcp-client-auth.ts`): Only tools with `oauth2` security schemes trigger scope verification

## Consequences

### Positive

1. **MCP spec compliance**: All HTTP requests are authenticated per the specification
2. **OAuth bootstrap works**: Clients receive 401 on first request, triggering the login flow
3. **Simpler code**: `mcp-router.ts` is dramatically simplified -- `shouldSkipAuth` only checks for public resource reads
4. **Clearer semantics**: No confusion between "no scope" and "no auth"
5. **3 files deleted**: `mcp-method-classifier.ts` and related tests are dead code

### Negative

1. **Higher latency for discovery**: ~170ms overhead per discovery request
   - **Mitigation**: JWKS caching, Clerk SDK optimisation
   - **Acceptable**: Spec compliance is more important than latency optimisation

## Amendment: Authorization Server Metadata Endpoint Restored (2026-02-20)

After implementing ADR-113, the Cursor OAuth flow was observed to fail: Cursor obtained an authorization code from Clerk but never sent an authenticated request to the server. Server logs showed Cursor fetching `/.well-known/oauth-authorization-server` and receiving 404. Without this endpoint, Cursor could not discover `token_endpoint` and could not exchange the authorization code for an access token.

**Root cause**: Cursor v2.5.17 implements the older MCP spec (2025-03-26) which expects the resource server to serve Authorization Server metadata. The current spec (2025-11-25) says clients should fetch AS metadata directly from the authorization server, but Cursor has not yet adopted this change.

**Fix**: `/.well-known/oauth-authorization-server` was restored in `registerPublicOAuthMetadataEndpoints()`. The endpoint derives AS metadata locally from the Clerk publishable key (same approach as the PRM endpoint) -- no runtime network call to Clerk. This serves standard OAuth fields (`authorization_endpoint`, `token_endpoint`, `registration_endpoint`, etc.) that backward-compatible clients need to complete the token exchange.

This endpoint is harmless -- spec-compliant clients that fetch AS metadata directly from Clerk will simply not use it. It is only served when auth is enabled (not registered in `DANGEROUSLY_DISABLE_AUTH` mode).

## References

- **MCP Specification (2025-11-25)**: [Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- **OpenAI Apps Auth**: [Authentication](https://developers.openai.com/apps-sdk/build/auth)
- **Implementation**:
  - `apps/oak-curriculum-mcp-streamable-http/src/mcp-router.ts`
  - `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts`

## Related ADRs

- [ADR-052: OAuth 2.1 for MCP HTTP Server Authentication](052-oauth-2.1-for-mcp-http-authentication.md)
- [ADR-053: Clerk as Identity Provider](053-clerk-as-identity-provider.md)
- [ADR-054: Tool-Level Auth Error Interception](054-tool-level-auth-error-interception.md)
- [ADR-056: Conditional Clerk Middleware for Discovery](056-conditional-clerk-middleware-for-discovery.md) (SUPERSEDED by this ADR)
- [ADR-057: Selective Authentication for Public Resources](057-selective-auth-public-resources.md)
