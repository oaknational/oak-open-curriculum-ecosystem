# ADR-113: MCP Spec-Compliant Auth for All Methods

**Status**: Accepted. Amended 2026-02-20 (AS metadata endpoint restored), 2026-02-21 (`openid` troubleshooting), 2026-09-08 (MCP-345, Troubleshooting resolution 3: the served AS metadata advertises the PRM's scopes), 2026-09-09 (MCP-345, Root Cause restated from the 2026-08-19 grant probe, imported as the Evidence subsection).
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

The public `resources/read` exception is an intentional compatibility and
content-classification carve-out, not a general weakening of MCP HTTP auth. It
applies only to resources that are deliberately public, contain no user-specific
data, and are safe to fetch during client bootstrap or UI rendering. Any future
resource that carries user, tenant, school, or operational state must go through
HTTP-level authentication even if the tool or resource has no additional scope
check.

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

Tools with `securitySchemes: [{ type: 'noauth' }]` (e.g., `get-rate-limit`) still need HTTP-level authentication. The `noauth` designation means the tool does not require specific OAuth scopes -- not that it can be called without any authentication token. This distinction is enforced by:

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

**Fix**: `/.well-known/oauth-authorization-server` was restored in `registerPublicOAuthMetadataEndpoints()`. In February 2026 the endpoint derived AS metadata locally from the Clerk publishable key with no runtime network call to Clerk; since ADR-115 (2026-02-21) the document is fetched from Clerk once at startup, cached for the process lifetime, and rewritten per request. Either way it serves the standard OAuth fields (`authorization_endpoint`, `token_endpoint`, `registration_endpoint`, etc.) that backward-compatible clients need to complete the token exchange.

This endpoint is harmless -- spec-compliant clients that fetch AS metadata directly from Clerk will simply not use it. It is only served when auth is enabled (not registered in `DANGEROUSLY_DISABLE_AUTH` mode).

## Troubleshooting: `openid` Refused When a Client's Grant Omits It (2026-02-21; mechanism corrected 2026-09-08)

### Symptom

The Cursor OAuth flow silently fails. Server logs show a perfect discovery and authorise sequence (PRM, AS metadata, DCR, 302 redirect to Clerk) but no `POST /oauth/token` ever arrives. Cursor loops between `needsAuth` and `Clearing OAuth state (manual_or_external)` with no error message.

### Root Cause

Clerk's `/oauth/authorize` returns `error=invalid_scope` when a client requests a scope outside the grant its registration carries. A dynamically registered client (RFC 7591 DCR) is granted the scopes named in its registration plus `offline_access`, or the instance default grant when it names none; a registration that omits `openid` is not granted it. Measured 2026-08-19: a registration naming `openid email` was granted `email offline_access openid`, and a registration naming no scopes was granted Oak's default, `email offline_access profile` ([Evidence: the DCR grant probe](#evidence-the-dcr-grant-probe-2026-08-19) below). Oak's default grant carries no `openid`. Cursor registered without naming scopes and then requested `openid`, so Clerk refused it:

```text
error=invalid_scope
error_description=The requested scope is invalid, unknown, or malformed.
  The OAuth 2.0 Client is not allowed to request scope 'openid'.
```

The error is returned as query parameters on the `cursor://` callback redirect -- it never reaches the MCP server.

### Evidence: the DCR grant probe (2026-08-19)

The Root Cause above rests on one measurement, imported here so this ADR carries its own evidence. It was made on 2026-08-19 by the Implementer seat on `mcp-submission-drive` for the MCP-636 submission gap report (probe run against repo HEAD `05cca303f`), and carried into this ADR on 2026-09-09 (MCP-345).

**Method.** Three throwaway OAuth clients were registered through Oak's own public RFC 7591 DCR endpoint (`POST /oauth/register` on the proxy; client names `Oak MCP-636 readiness probe`, `… probe B`, `… probe C`; redirect URI `http://localhost:8765/callback`), each with a different `scope` field, and each was then sent to Clerk's authorisation endpoint requesting `openid`. No sign-in was completed and no authorisation code or token was issued. The literal requests were not preserved; the report records the method, the registration responses and the authorisation outcomes. The three client records remain in the production Clerk instance until deleted from its dashboard.

| Client | Registered with                       | Granted (registration response `scope`) | `openid` at authorisation |
| ------ | ------------------------------------- | --------------------------------------- | ------------------------- |
| A      | `openid email`                        | `email offline_access openid`           | accepted                  |
| B      | `openid email profile offline_access` | all four                                | accepted                  |
| C      | _(no `scope` field)_                  | `email offline_access profile`          | refused                   |

**Reading the table.** The `Granted` column is the `scope` value in each registration's response body, which states what the client holds; registration returns HTTP 201 whatever the grant, and reading the status rather than the body is how the earlier "accepts `openid` at registration" wording arose. Client A carries the mechanism: it received `offline_access` without naming it, and was refused `profile`, `public_metadata`, `private_metadata` and `user:org:read`, every other advertised scope it had not named. Client C received Oak's instance default grant, which carries no `openid`, so its `openid` request fell outside its grant.

**Control.** Clerk's `/oauth/authorize` forwards even an impossible scope onward unchanged, so acceptance there measures nothing; the refusal is emitted one hop later, at `/oauth/authorize/continue`. A deliberately fake scope produced the same error string recorded in Root Cause, on demand:

```text
error=invalid_scope
error_description=The requested scope is invalid, unknown, or malformed.
  The OAuth 2.0 Client is not allowed to request scope 'definitely_not_a_real_scope_636'.
```

`openid` did not fire it for clients A and B. The control validates the instrument (the probe can detect a refusal), not the inference.

**Limits.** The `offline_access` addition rests on client A alone (B named it; C's default contains it), so read a registration response rather than assuming the shape. Nothing here is a claim about token contents. The 2026-02-21 sections place the refusal on the `/oauth/authorize` 302 while the probe found it at `/oauth/authorize/continue`; which hop produced the February redirect was not re-measured.

**Corroboration.** Clerk's 2026-07-22 changelog, which introduced the instance-level `default_scopes` setting, describes this failure as clients omitting `scope` at registration, and [anthropics/claude-code#67714](https://github.com/anthropics/claude-code/issues/67714) reproduces it independently against Clerk (a scope-less registration granted `email offline_access profile`, a registration naming `openid` authorised). Neither says anything about the `offline_access` addition.

### Why It Is Silent

Two layers compound to make this invisible:

1. **OAuth spec behaviour**: RFC 6749 Section 4.1.2.1 routes authorisation errors via redirect to `redirect_uri`, not via HTTP error responses. The MCP server is completely bypassed -- the error flows from Clerk to the browser to Cursor.

2. **Cursor does not surface callback errors**: When Cursor receives `error=invalid_scope` in its callback, it silently clears OAuth state and re-enters the authentication loop. No error toast, no log entry beyond `Clearing OAuth state (manual_or_external)`.

### How to Diagnose

The error is **only visible** in a HAR (HTTP Archive) capture of the network traffic between the browser and Clerk. Look for the `Location` header in Clerk's 302 redirect response -- it contains the `error=invalid_scope` query parameter on the `cursor://` callback URL.

Server-side logs will show nothing wrong. The flow appears to stop after the initial `/oauth/authorize` 302 redirect.

### Resolution

Three changes stop a client deriving an `openid` request from Oak's discovery documents (a client may still ask for it on its own, and the proxy forwards that request unchanged):

1. **Source of truth**: `openid` removed from `DEFAULT_AUTH_SCHEME.scopes` in `mcp-security-policy.ts`. Cascaded via `pnpm sdk-codegen` to all generated tool security metadata.
2. **PRM**: `scopes_supported` no longer advertises `openid`, so clients that derive their request from the PRM (RFC 9728) do not request it.
3. **AS metadata** (added 2026-09-08, MCP-345): the served `/.well-known/oauth-authorization-server` document states `scopes_supported` as the same set the PRM advertises, instead of passing Clerk's full list through. Until then a client that chose its scopes from the AS metadata rather than the PRM read `openid` there and requested it — ChatGPT's plugin portal does exactly this ("If your provider advertises OIDC scopes … in `scopes_supported` of its `.well-known/oauth-authorization-server` … ChatGPT requests those scopes by default", [OpenAI plugin auth docs, OIDC scopes](https://developers.openai.com/plugins/build/auth), fetched 2026-09-08) — and Clerk refused it with the `invalid_scope` error above, measured on the portal's test connection on 2026-09-08. Advertising a subset of what the upstream grants is within RFC 8414 §2, which says of `scopes_supported` that "servers MAY choose not to advertise some supported scope values even when this parameter is used"; a client that requests an unadvertised scope the upstream does grant still receives it, because the proxy forwards the requested `scope` unchanged (measured 2026-09-08: a ChatGPT connector's authorisation request carried `scope=email offline_access` while the PRM advertised only `email`, and Clerk accepted the client and redirect). The OpenAI page's other remedy — enabling every advertised scope on the client — would mean granting `openid` to the clients OpenAI registers. Clerk grants a dynamically registered client the scopes in its registration plus `offline_access`, or the instance default grant when it names none (Root Cause above; [Evidence: the DCR grant probe](#evidence-the-dcr-grant-probe-2026-08-19)); OpenAI's clients register without naming scopes, Oak's default grant carries no `openid`, and Oak's policy (`DEFAULT_AUTH_SCHEME`) keeps it out by decision, so the honest fix is to stop advertising it. This resource server checks token validity and audience, never scope content, so a token granted more than the advertised set is accepted identically to a minimal one; the advertised set governs what clients ask for, not what the server enforces.

The OAuth proxy forwards all request and response parameters (including `scope`) unchanged; it applies no filtering to forwarded messages. The AS metadata document is not a forwarded message: it is the proxy's own self-description, already rewritten field by field (`issuer` and the three endpoints), and resolution 3 makes its advertised scopes accurate for this resource in the same way. Both discovery documents now come from one constant, `SCOPES_SUPPORTED`, so they cannot disagree.

### Broader Lesson

OAuth authorisation errors routed via redirect are invisible to the resource server. When debugging OAuth flows that "silently stop" after the authorise redirect, capture the full redirect chain (browser DevTools HAR export) -- the error is in the callback URL, not in server logs.

## References

- **MCP Specification (2025-11-25)**: [Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- **OpenAI Apps Auth**: [Authentication](https://developers.openai.com/apps-sdk/build/auth)
- **OpenAI plugin auth, OIDC scopes**: [developers.openai.com/plugins/build/auth](https://developers.openai.com/plugins/build/auth) (fetched 2026-09-08; the "ChatGPT requests those scopes by default" clause quoted in resolution 3)
- **RFC 8414 §2** (`scopes_supported`: "Servers MAY choose not to advertise some supported scope values"): [datatracker.ietf.org/doc/html/rfc8414#section-2](https://datatracker.ietf.org/doc/html/rfc8414#section-2)
- **Implementation**:
  - `apps/oak-curriculum-mcp-streamable-http/src/mcp-router.ts`
  - `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts`
  - `packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts` (scope source of truth)
  - `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts` (proxy passthrough helpers; AS metadata self-description rewrite)
  - `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` (PRM and AS metadata endpoints)

## Related ADRs

- [ADR-052: OAuth 2.1 for MCP HTTP Server Authentication](052-oauth-2.1-for-mcp-http-authentication.md)
- [ADR-053: Clerk as Identity Provider](053-clerk-as-identity-provider.md)
- [ADR-054: Tool-Level Auth Error Interception](054-tool-level-auth-error-interception.md)
- [ADR-056: Conditional Clerk Middleware for Discovery](056-conditional-clerk-middleware-for-discovery.md) (SUPERSEDED by this ADR)
- [ADR-057: Selective Authentication for Public Resources](057-selective-auth-public-resources.md)
- [ADR-115: Proxy OAuth AS for Cursor](115-proxy-oauth-as-for-cursor.md)
