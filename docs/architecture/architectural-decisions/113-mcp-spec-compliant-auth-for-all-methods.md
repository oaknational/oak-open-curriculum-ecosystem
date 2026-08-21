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

## Troubleshooting: `invalid_scope` on `openid` for Dynamic Clients (2026-02-21, root cause CORRECTED 2026-08-20)

> **The symptom below is real and was reproduced. The mechanism this section
> originally asserted -- that Clerk rejects `openid` at authorisation as a
> platform rule -- is DISPROVEN.** Clerk enforces a requested scope against the
> client's own registered grant. See [Correction (2026-08-20)](#correction-2026-08-20-what-clerk-actually-does)
> before acting on anything in this section, and do not cite the original
> mechanism: seats have treated it as a platform constraint, and an owner-facing
> recommendation was made on the strength of it.

### Symptom

The Cursor OAuth flow silently fails. Server logs show a perfect discovery and authorise sequence (PRM, AS metadata, DCR, 302 redirect to Clerk) but no `POST /oauth/token` ever arrives. Cursor loops between `needsAuth` and `Clearing OAuth state (manual_or_external)` with no error message.

### The Error As Observed

Clerk's authorisation endpoint returned `error=invalid_scope` when the dynamically registered client (created via RFC 7591 DCR) requested the `openid` scope. This is what was seen, not why it happened -- the mechanism is in [Correction (2026-08-20)](#correction-2026-08-20-what-clerk-actually-does):

```text
error=invalid_scope
error_description=The requested scope is invalid, unknown, or malformed.
  The OAuth 2.0 Client is not allowed to request scope 'openid'.
```

The error is returned as query parameters on the `cursor://` callback redirect -- it never reaches the MCP server.

**The original reading of this error was wrong.** It said Clerk accepts `openid` at
registration but rejects it at authorisation, as a property of the platform. What
actually happened is narrower and is described in
[Correction (2026-08-20)](#correction-2026-08-20-what-clerk-actually-does): the client
requesting `openid` here did not hold `openid` in its own registered grant, so the
request fell outside its grant. A client registered _with_ `openid` has the scope
accepted at authorisation instead of refused.

### Why It Is Silent

Two layers compound to make this invisible:

1. **OAuth spec behaviour**: RFC 6749 Section 4.1.2.1 routes authorisation errors via redirect to `redirect_uri`, not via HTTP error responses. The MCP server is completely bypassed -- the error flows from Clerk to the browser to Cursor.

2. **Cursor does not surface callback errors**: When Cursor receives `error=invalid_scope` in its callback, it silently clears OAuth state and re-enters the authentication loop. No error toast, no log entry beyond `Clearing OAuth state (manual_or_external)`.

### How to Diagnose

The error is **only visible** in a HAR (HTTP Archive) capture of the network traffic between the browser and Clerk. Look for the `Location` header in Clerk's 302 redirect response -- it contains the `error=invalid_scope` query parameter on the `cursor://` callback URL.

Server-side logs will show nothing wrong. The flow appears to stop after the initial `/oauth/authorize` 302 redirect.

### Resolution

Two changes prevent compliant clients from requesting the `openid` scope:

1. **Source of truth**: `openid` removed from `DEFAULT_AUTH_SCHEME.scopes` in `mcp-security-policy.ts`. Cascaded via `pnpm sdk-codegen` to all generated tool security metadata.
2. **PRM**: `scopes_supported` no longer advertises `openid`, so compliant clients (RFC 9728) do not request it.

The OAuth proxy is fully transparent -- it forwards all parameters (including `scope`) and all upstream AS metadata fields (including `scopes_supported`) unchanged. No filtering is applied at the proxy layer. If a client reads `openid` from the AS metadata and requests it **without having
registered for it**, Clerk returns `error=invalid_scope` -- because the scope is outside
that client's grant, not because Clerk refuses `openid` as such.

### Correction (2026-08-20): what Clerk actually does

**Measured 2026-08-19** by an RFC 7591 DCR probe run with a discriminating control,
recorded under MCP-636 by an Implementer seat on `mcp-submission-drive`. Clerk's
2026-07-22 changelog corroborates the registered-grant mechanism; it says nothing
about the `offline_access` addition below.

> **Clerk grants a dynamically registered client the scopes named in its
> registration -- and, in the one case measured, `offline_access` on top of them,
> which that client had not registered for. Where a registration names no scopes,
> the instance default grant applies instead. A client registered with `openid` has
> `openid` accepted at authorisation rather than refused.**

The probe registered three throwaway clients through Oak's own public DCR endpoint
and probed each at Clerk's authorisation endpoint. The `Granted` column is the
`scope` value in each registration's **response body** -- the authoritative field,
not the HTTP status:

| Client | Registered with                       | Granted                        | `openid` at authorisation |
| ------ | ------------------------------------- | ------------------------------ | ------------------------- |
| A      | `openid email`                        | `email offline_access openid`  | accepted                  |
| B      | `openid email profile offline_access` | all four                       | accepted                  |
| C      | _(no `scope` field)_                  | `email offline_access profile` | REJECTED                  |

**Client A carries the mechanism.** It received `offline_access` without having
registered for it, and was refused `profile`, `public_metadata`, `private_metadata`
and `user:org:read` -- every _other_ advertised scope it had not registered.
Client C received Oak's instance default grant, `email offline_access profile` --
**no `openid`**. So a client that registered without naming scopes held no
`openid`, and requesting it at authorisation was a request outside its own grant.

**What the probe does not settle. Stated as inference and as absence, not as
measurement.** Two limits bound everything above:

1. **The `offline_access` addition rests on one discriminating row.** Client B named
   the scope itself and client C took a default that already contains it, so only
   client A separates "Clerk always adds it" from "this instance happens to grant
   it". Expect the shape `registered scopes + offline_access`, and read the
   registration response body rather than assuming either reading.
2. **No sign-in was completed and no token was ever issued.** The probe stopped at
   the authorisation endpoint's accept-or-refuse decision, so nothing here is a
   claim about token contents. That a token carrying `openid` is actually granted,
   and what Clerk's userinfo returns for it, are both unproven -- MCP-636 records
   them as such.

**Why the probe is trustworthy: it carries a control that must fail.** Its first
stage was discarded as an invalid instrument, because Clerk's `/oauth/authorize`
forwards a deliberately fake scope onward unchanged -- so "`openid` was accepted"
there measured nothing. Validation happens one hop later, at
`/oauth/authorize/continue`, where a scope that cannot exist reliably produces:

```text
error=invalid_scope
error_description=The requested scope is invalid, unknown, or malformed.
  The OAuth 2.0 Client is not allowed to request scope 'definitely_not_a_real_scope_636'.
```

That is the same error string this section records above, fired on demand -- and
`openid` does not fire it for a client that registered with `openid`. The control
validates the instrument only: it establishes that the probe can detect a refusal,
which is what makes the accepted rows meaningful.

**How the original conclusion went wrong, because the shape recurs.** The
registration call _succeeds_ when a client asks for `openid` -- HTTP 201 -- which is
what "Clerk accepts `openid` during client registration" was read off. But the
authoritative field is the **`scope` value in the registration response body**, which
states the scopes the client actually holds. Reading the status line rather than the
body produced a true observation (`invalid_scope` at authorisation, reproducible) with
a false mechanism welded to it, and the mechanism travelled onward as if it had been
measured.

**This reconciles the symptom rather than contradicting it.** Every observation in the
sections above still holds: the flow did stop, the error was `invalid_scope`, it was
delivered by redirect, and Cursor did swallow it silently. Only the _reason_ changes --
from "Clerk cannot do `openid`" to "these clients were not registered for `openid`".

**One detail is unreconciled and is left open rather than inferred.** The 2026-02-21
sections place the refusal on Clerk's 302 from `/oauth/authorize`; the 2026-08-19
probe found that endpoint forwarding even an impossible scope onward, with the
refusal emitted one hop later at `/oauth/authorize/continue`. Which hop produced the
2026-02-21 redirect error was not re-measured, and the two records may describe
either a changed endpoint or an imprecise original note. The refusal itself is not
in doubt; its emitting hop is.

**What still stands:**

- The resolution below remains correct and remains in force. Removing `openid` from
  `DEFAULT_AUTH_SCHEME.scopes` and from the PRM's `scopes_supported` does prevent this
  failure, and it is a reasonable posture regardless of the mechanism: we do not need
  OIDC identity claims for this resource server.
- The silence analysis, the HAR diagnosis method, and the Broader Lesson below are
  unaffected -- they are about how redirect-borne errors hide, not about scope grants.

**What changes in consequence:**

- **`openid` is available if it is ever wanted, by two routes with different reach.**
  A client that names `openid` in its own registration holds it -- that is the route
  wherever the registration is ours to shape. Third-party clients self-register via
  DCR, so for those the lever is Clerk's instance-level `default_scopes` setting,
  shipped 2026-07-22 for exactly this failure. Its documented limit is that Clerk
  does not override a `scope` value a client supplies, so `default_scopes` reaches
  only clients that omit `scope` entirely -- a partial scope list is not helped. It
  is a write to shared Oak auth infrastructure and therefore an owner decision.
  A separate owner-facing recommendation was made on the strength of the disproven
  claim and has been withdrawn.
- **`offline_access` was never a blocker** -- in the one case measured, Clerk added
  it to a DCR client's grant without the registration naming it (client A above).
- **`profile` was never a blocker either, but it is not free** -- it is in the
  instance default grant (client C above), so a scope-less registration holds it,
  while a client that names its own scopes is refused it unless it names `profile`
  too (client A above). `profile` needs no Clerk change, only a registration that
  names it.

**Live advertised state, measured 2026-08-20 (this correction's author, first-hand):**

```text
PRM        /.well-known/oauth-protected-resource/mcp   scopes_supported = ["email"]
ours       /.well-known/oauth-authorization-server      scopes_supported = [openid, profile, email,
                                                         public_metadata, private_metadata,
                                                         offline_access, user:org:read]
Clerk      clerk.thenational.academy/.well-known/…      identical list
```

So the PRM advertises `email` alone, while the AS metadata -- ours and Clerk's, forwarded
unchanged per the transparent-proxy property above -- still advertises `openid`. A client
that discovers scopes from the AS metadata rather than the PRM therefore sees a scope it
will not be granted unless it registers for it. **Whether that breaks any specific client
is an open question tracked on MCP-345 (`advertise only what we grant`), not a claim this
ADR should settle** -- and it is deliberately left open here rather than resolved by
inference, which is the error this correction exists to undo.

### Broader Lesson

OAuth authorisation errors routed via redirect are invisible to the resource server. When debugging OAuth flows that "silently stop" after the authorise redirect, capture the full redirect chain (browser DevTools HAR export) -- the error is in the callback URL, not in server logs.

## References

- **MCP Specification (2025-11-25)**: [Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- **OpenAI Apps Auth**: [Authentication](https://developers.openai.com/apps-sdk/build/auth)
- **Implementation**:
  - `apps/oak-curriculum-mcp-streamable-http/src/mcp-router.ts`
  - `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts`
  - `packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts` (scope source of truth)
  - `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts` (transparent proxy passthrough)
  - `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` (PRM endpoint)

## Related ADRs

- [ADR-052: OAuth 2.1 for MCP HTTP Server Authentication](052-oauth-2.1-for-mcp-http-authentication.md)
- [ADR-053: Clerk as Identity Provider](053-clerk-as-identity-provider.md)
- [ADR-054: Tool-Level Auth Error Interception](054-tool-level-auth-error-interception.md)
- [ADR-056: Conditional Clerk Middleware for Discovery](056-conditional-clerk-middleware-for-discovery.md) (SUPERSEDED by this ADR)
- [ADR-057: Selective Authentication for Public Resources](057-selective-auth-public-resources.md)
- [ADR-115: Proxy OAuth AS for Cursor](115-proxy-oauth-as-for-cursor.md)
