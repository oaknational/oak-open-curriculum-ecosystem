---
name: Proxy OAuth AS to Fix Cursor OAuth Flow
overview: >
  Cursor has a confirmed client-side bug (forum #151331) where the
  resource_metadata URL is not persisted across the OAuth redirect flow.
  When the MCP resource server and OAuth authorization server are on
  different origins, the token exchange fails after browser authorization.
  This affects both dev (localhost) and production (real domain) because
  the root cause is origin mismatch between RS and AS.

  The fix is to act as a proxy OAuth AS so that Cursor sees the RS and
  AS on the same origin. The MCP SDK provides ProxyOAuthServerProvider
  for this exact pattern. A community-validated workaround for Microsoft
  Entra ID confirms the approach works.

  This plan includes an early proof of concept (Phase 1) to validate
  the approach before any architectural changes.
todos:
  - id: poc-tests-red
    content: >
      Phase 1 (RED): Write failing integration tests for proxy
      endpoints (fake upstream). Write failing unit tests for pure
      functions (URL construction, validation, error formatting).
    status: pending
  - id: poc-implement-green
    content: >
      Phase 1 (GREEN): Implement proxy endpoints and pure functions.
      Tests pass. Register in Phase 2.5 of application.ts. Add paths
      to CLERK_SKIP_PATHS. Update PRM and AS metadata.
    status: pending
  - id: poc-validate-cursor
    content: >
      Phase 1 (VALIDATE): Start dev server with proxy. Enable Cursor.
      Confirm full OAuth flow completes. Capture server logs showing
      Authorization header on POST /mcp. Monitor for Basic auth bug.
    status: pending
  - id: design-architecture
    content: >
      Phase 2: Design production architecture. Decide SDK mcpAuthRouter
      vs custom routes. Define boundary between proxy auth and Clerk
      token verification. Write ADR documenting opaque token assumption.
    status: pending
  - id: implement-production
    content: >
      Phase 3: Production implementation with TDD. Unit tests for pure
      functions. Integration tests with fake upstream. Error handling,
      timeouts, structured logging, DCR rate limiting.
    status: pending
  - id: smoke-tests-update
    content: >
      Phase 3: Update smoke test assertions (self-origin instead of
      Clerk HTTPS URLs). Add proxy-specific smoke test.
    status: pending
  - id: quality-gates
    content: >
      Phase 4: Run full quality gate chain. Fix any issues.
    status: pending
  - id: documentation
    content: >
      Phase 4: Update ADR-113, write proxy ADR, archive completed
      plans, update auth-routes and application TSDoc.
    status: pending
isProject: false
---

## Context

**Session entry point**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
**Prerequisite (complete)**: OAuth spec compliance — ADR-113, all MCP methods require auth
**Prerequisite (complete)**: AS metadata endpoint — backward-compatible `/.well-known/oauth-authorization-server`
**Prerequisite (complete)**: Cursor investigation — root cause diagnosed as client-side bug
**Dev server**: `apps/oak-curriculum-mcp-streamable-http/`
**Start dev server**: `pnpm dev` (from HTTP server directory)
**Test email**: `CLERK_TEST_EMAIL` in root `.env` (do NOT record in version-controlled files)

---

## Problem Statement

Cursor (latest stable, 2.5.20) cannot complete the OAuth flow when the
MCP resource server (RS) and authorisation server (AS) are on different
origins. This is a [confirmed Cursor bug](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331)
where the `resource_metadata` URL from the initial 401 `WWW-Authenticate`
header is not persisted across the browser redirect. After the user
authorises at Clerk, the token exchange fails because Cursor cannot
re-discover the correct AS.

**This affects both localhost and production** because the root cause is
origin mismatch (e.g., `https://curriculum-mcp.oaknational.dev` vs
`https://native-hippo-15.clerk.accounts.dev`), not anything specific to
localhost.

### A Second Cursor Bug: Token Refresh

A separate but compounding bug ([forum #149511](https://forum.cursor.com/t/cursor-does-not-refresh-oauth-tokens-for-mcp-servers/149511)):
Cursor never sends `grant_type=refresh_token` to the token endpoint.
Access tokens expire (Clerk opaque tokens `oat_...` have a configurable
but typically brief lifetime), and the MCP connection silently fails.
Users report connections dying approximately 15 minutes after
authentication.

Additionally, when Cursor performs DCR with
`"token_endpoint_auth_method": "none"` (public client), it still sends
`Authorization: Basic` when calling the token endpoint
([GitHub #3734](https://github.com/cursor/cursor/issues/3734)). OAuth
servers reject this because a public client should send no
authentication header.

The proxy approach addresses the first bug (cannot authenticate at all)
and is architecturally ready for the second (refresh endpoint exists and
works). The second bug is purely a Cursor client limitation — no
server-side fix is possible. When Cursor fixes it, our proxy will handle
the refresh correctly.

---

## Diagnosis Evidence

### Server-Side Request Log (3 identical attempts)

| # | Request | Response | Notes |
|---|---------|----------|-------|
| 1 | `GET /.well-known/oauth-authorization-server` | 200 | Pre-flight, user-agent: node |
| 2 | `POST /mcp` (no Authorization header) | 401 + `WWW-Authenticate` | No token attached |
| 3 | `GET /.well-known/oauth-protected-resource` | 200 | Follows resource_metadata URL |
| — | *Nothing further to our server* | — | Cursor stops |

After the browser OAuth flow completes and the user clicks the callback
link, Cursor sends the **exact same 3-request sequence** — still without
an Authorization header. The token is never attached.

### Cursor MCP OAuth Log (trace level)

```text
17:24:44.236 — Clearing OAuth state (manual_or_external)      ← user clicks Connect
17:24:44.262 — Cleared
17:24:44.679 — needsAuth (oauth_provider_needs_auth_callback)  ← POST /mcp → 401
               ... browser OAuth flow at Clerk (~52 seconds) ...
17:25:36.854 — Clearing OAuth state (manual_or_external)       ← callback received
17:25:36.876 — Cleared
17:25:37.272 — needsAuth (oauth_provider_needs_auth_callback)  ← 401 AGAIN
```

No token exchange events appear at any point, even at trace level. The
only events are state clearing and `needsAuth` transitions.

### What the User Sees

1. Click "Connect" — Cursor shows "waiting for callback" spinner
2. Browser opens to Clerk sign-in/authorisation page
3. Clerk auto-approves (dev instance, `authorize-with-immediate-redirect`)
4. macOS dialog: "Allow native-hippo-15.clerk.accounts.dev to open the
   cursor link with Cursor?"
5. User clicks "Open Link"
6. Cursor briefly processes, then reverts to "Needs authentication"

### Root Cause in the MCP SDK

The MCP SDK's `StreamableHTTPClientTransport` stores
`_resourceMetadataUrl` in memory when it receives a 401 response
(line 320 of `client/streamableHttp.js`):

```javascript
const { resourceMetadataUrl, scope } = extractWWWAuthenticateParams(response);
this._resourceMetadataUrl = resourceMetadataUrl;
```

When `auth()` returns `REDIRECT` (browser authorisation needed), the
transport throws `UnauthorizedError`. The authorisation flow persists
`mcp_server_url`, `mcp_code_verifier`, and `mcp_client_information` —
but **not** the `resource_metadata` URL.

After the browser callback, `finishAuth(authorizationCode)` needs
`_resourceMetadataUrl` to re-discover PRM and locate the AS token
endpoint. Without it, PRM discovery falls back to well-known paths. If
the AS URL discovered via fallback differs from the one used during
authorisation, the token exchange fails.

In our case:

- **PRM `authorization_servers`**: `["https://native-hippo-15.clerk.accounts.dev"]`
- **Fallback AS discovery**: Falls back to `http://localhost:3333` (the RS itself)
- **Result**: Token exchange targets the wrong server, or credentials
  don't match

### Confirmed by Cursor Forum

This exact bug was reported on **2026-02-09** (11 days before our
investigation):

> **[MCP OAuth callback loses authorization server URL discovered from
> resource_metadata, causing token exchange failure](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331)**
>
> "The `resource_metadata` URL extracted from the initial 401
> `WWW-Authenticate` header is not persisted across the OAuth redirect
> flow."
>
> — Nannan, Cursor Forum, Bug Reports

### All Known Cursor OAuth Bugs

| Bug | Link | Status |
|-----|------|--------|
| resource_metadata URL loss during callback | [forum #151331](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331) | Open |
| OAuth token refresh not working | [forum #149511](https://forum.cursor.com/t/cursor-does-not-refresh-oauth-tokens-for-mcp-servers/149511) | Open |
| Browser not opening for OAuth | [forum #150862](https://forum.cursor.com/t/mcp-servers-with-auth-do-not-open-browser-anymore/150862) | Open |
| RFC 8414 non-compliance (path discovery) | [forum #116203](https://forum.cursor.com/t/cursors-mcp-implementation-is-not-following-rfc-8414-strictly/116203) | Open |
| Connect button produces zero network requests | [forum #150962](https://forum.cursor.com/t/remote-mcp-server-connect-button-produces-zero-network-requests-oauth-flow-never-starts/150962) | Open |
| client_credentials grant ignored | [forum #152307](https://forum.cursor.com/t/mcp-oauth-client-credentials-grant-ignored-when-client-secret-is-present/152307) | Open |
| DCR public client sends Basic auth | [GitHub #3734](https://github.com/cursor/cursor/issues/3734) | Open |

### Impact Assessment

| Configuration | Affected? | Reason |
|--------------|-----------|--------|
| localhost dev server + Clerk AS | **Yes** | Different origins (<http://localhost> vs <https://clerk.accounts.dev>) |
| Production server + Clerk AS | **Yes** | Different origins (<https://our-domain> vs <https://clerk.accounts.dev>) |
| Any RS + third-party AS | **Yes** | The bug triggers whenever RS != AS origin |
| RS that is its own AS (same origin) | **No** | No origin mismatch |

### What Works (Confirming Our Server Is Correct)

- Clerk DCR endpoint: tested directly, returns valid `client_id`
- Clerk AS metadata: serves correct `registration_endpoint`,
  `authorization_endpoint`, `token_endpoint`
- Clerk token endpoint: accepts `resource` parameter (ignores it
  gracefully)
- Our PRM: correct `resource`, `authorization_servers`,
  `scopes_supported`
- Our AS metadata: correct `issuer`, all endpoints point to Clerk
- MCP Inspector: connects and authenticates successfully (manual
  browser validation + smoke tests)
- Programmatic PKCE flow: smoke tests pass end-to-end
  (`pnpm smoke:oauth:spec`)

---

## Completed Prerequisites

### 1. OAuth Spec Compliance (ADR-113)

All MCP methods now require HTTP-level authentication. Two spec-violating
bypasses removed:

1. Discovery method bypass in `conditional-clerk-middleware.ts` and
   `mcp-router.ts`
2. Noauth tool HTTP bypass in `mcp-router.ts`

Dead code deleted: `mcp-method-classifier.ts`,
`discovery-methods-sync.unit.test.ts`. ADR-056 superseded by ADR-113.
Full TDD cycle completed at all levels.

**Plan**: [oauth-spec-compliance.md](../archive/completed/oauth-spec-compliance.md)

### 2. AS Metadata Endpoint (Backward Compatibility)

`/.well-known/oauth-authorization-server` restored using local
derivation from `CLERK_PUBLISHABLE_KEY` via `deriveAuthServerMetadata()`
in `auth-routes.ts`. No network call — mirrors the PRM approach. Path
added to `CLERK_SKIP_PATHS`. E2E test asserts 200 + valid metadata
structure.

Implementation detail: uses `generateClerkProtectedResourceMetadata` to
extract the FAPI URL, then constructs standard OIDC endpoint URLs
locally. This avoids the `fetchClerkAuthorizationServerMetadata` network
call that failed in E2E tests with fake credentials.

### 3. Spec-Compliant Path (Validated)

The spec-compliant OAuth path is fully validated by
`pnpm smoke:oauth:spec`. The server correctly implements the MCP
authorisation spec for any standards-compliant client:

1. POST /mcp → 401 + `WWW-Authenticate: Bearer resource_metadata="<PRM URL>"`
2. GET PRM URL → `authorization_servers[]` pointing to Clerk
3. Fetch AS metadata **directly from Clerk** (not from our server)
4. PKCE OAuth flow with Clerk → access token
5. POST /mcp with Bearer token → authenticated MCP response

Manual browser validation via MCP Inspector (interactive UI mode) also
confirmed: Clerk consent screen presented, user authenticated, and
authenticated MCP calls succeeded.

### Smoke Test Infrastructure

| File | Status |
|------|--------|
| `smoke-assertions/oauth-discovery.ts` | PASSES — validates discovery chain |
| `smoke-assertions/oauth-spec-e2e.ts` | PASSES — full PKCE flow |
| `smoke-tests/smoke-oauth-spec.ts` | PASSES — entry point |
| `smoke-tests/auth/clerk-oauth-token.ts` | CLEAN — FAPI sign-in + PKCE |

Key implementation decisions:

1. Upgraded `@clerk/backend` 2.29.2 → 2.31.2 (exposes `consentScreenEnabled`)
2. Upgraded `@clerk/express` 1.7.7 → 1.7.72 (compatible with new backend)
3. PKCE flow uses Clerk Frontend API (FAPI) for programmatic auth
4. Handles both HTTP 302 and 303 redirects from Clerk authorise endpoint
5. Ephemeral OAuth app created with `consentScreenEnabled: false` and
   deleted after each run

### Consent Screen Invariant (Security)

All product-facing OAuth applications (including DCR-created apps) MUST
always have `consentScreenEnabled: true`. Disabling consent is ONLY
permitted for ephemeral smoke-test OAuth apps created and destroyed by
`clerk-oauth-token.ts`. Without the consent screen, any logged-in user
who visits an OAuth authorisation URL automatically grants access to any
requested scopes.

---

## Solution: Proxy OAuth AS

Act as our own OAuth Authorisation Server, proxying all OAuth operations
to Clerk. This makes the RS and AS the same origin, bypassing the Cursor
bug entirely.

### How It Works

**Before (broken with Cursor):**

```text
Cursor → POST /mcp → 401
         ↓
         PRM → authorization_servers: ["https://clerk.accounts.dev"]  ← DIFFERENT ORIGIN
         ↓
         DCR, Authorize, Token Exchange → all at clerk.accounts.dev
         ↓
         Callback → Cursor loses resource_metadata URL → FAILS
```

**After (proxy fix):**

```text
Cursor → POST /mcp → 401
         ↓
         PRM → authorization_servers: ["http://localhost:3333"]  ← SAME ORIGIN
         ↓
         DCR → /oauth/register → proxied to Clerk
         Authorize → /oauth/authorize → redirect to Clerk
         Token Exchange → /oauth/token → proxied to Clerk
         ↓
         Callback → Cursor finds AS on same origin → WORKS
```

### Precedent

A community member published a [working solution using this exact pattern
with Microsoft Entra ID](https://forum.cursor.com/t/working-solution-mcp-server-oauth-with-microsoft-entra-id-on-azure-container-apps/151813).
The MCP SDK provides `ProxyOAuthServerProvider` as an official pattern.

### Workaround Options Considered

| Option | Description | Verdict |
|--------|-------------|---------|
| **A: Proxy OAuth AS** | Act as our own AS, proxy to Clerk | **Recommended** — fixes the root cause for all configurations |
| B: Wait for Cursor fix | Bug is reported, fix is straightforward | Rejected — unpredictable release cadence |
| C: Dedicated `/cursor` endpoint | Cursor-specific metadata | Rejected — does not fix root cause (resource_metadata URL still lost) |

---

## Security Validations

The proxy is a transparent pass-through, which limits the attack surface.
However, three specific risks must be addressed at implementation time.

### 1. Open Redirect Prevention on `/oauth/authorize`

The `/oauth/authorize` endpoint constructs a redirect to Clerk. The
redirect target MUST be validated against the known Clerk FAPI domain
derived at startup from `CLERK_PUBLISHABLE_KEY`. Never accept the
upstream URL as a request parameter. Never redirect to a domain other
than the derived FAPI domain.

**Implementation**: Derive the upstream Clerk authorisation URL once at
startup (as `deriveAuthServerMetadata` already does). Store it as an
immutable value. Construct the redirect by appending query parameters to
this known-good base URL.

### 2. Request Validation on `/oauth/token`

The `/oauth/token` proxy forwards request bodies to Clerk's token
endpoint. Minimal validation must ensure:

- `grant_type` is one of `authorization_code` or `refresh_token`
- `code` is present for `authorization_code` grants
- `code_verifier` is present (PKCE is mandatory per OAuth 2.1)

Without this, the proxy could be used to send arbitrary POST bodies to
Clerk's token endpoint. Reject invalid requests with a 400 before
forwarding.

### 3. DCR Rate Limiting

The `/oauth/register` proxy creates an additional entry point for Clerk
DCR. Clerk's own rate limiting applies, but we should add rate limiting
at the proxy level too. A reasonable default: 20 registrations per hour
per IP address.

---

## Error Handling Strategy

### Principle: Pass Through + Log

The proxy follows a simple error model:

1. **Pass through** Clerk's error responses verbatim (status code +
   body) for all Clerk-originated errors (4xx, 5xx)
2. **Generate proxy-level errors** for infrastructure failures
   (timeout, network error, DNS failure, malformed request)
3. **Log all** upstream calls with structured logging (request URL,
   response status, duration, correlation ID)
4. **Never swallow errors** — every failure must be visible in logs

### Upstream Timeout Handling

All HTTP calls to Clerk MUST have an explicit timeout (10 seconds).
When Clerk is unreachable or slow:

| Failure | Proxy Response |
|---------|----------------|
| Clerk returns 4xx | Pass through Clerk's status + body |
| Clerk returns 5xx | Pass through Clerk's status + body |
| Clerk times out (>10s) | HTTP 504 + `{ "error": "temporarily_unavailable" }` |
| Network error (DNS, connection refused) | HTTP 502 + `{ "error": "temporarily_unavailable" }` |
| Malformed request to proxy | HTTP 400 + `{ "error": "invalid_request", "error_description": "..." }` |

Error responses MUST use the OAuth 2.0 error format (RFC 6749 Section
5.2) where applicable.

### `/oauth/authorize` Is Special

The authorise endpoint is a browser redirect (302), not an API call.
The proxy constructs a redirect URL and sends a 302. The browser follows
the redirect to Clerk. If Clerk is down, the browser shows Clerk's
error page — this is correct and expected. The proxy does not need to
handle this case.

---

## Architectural Assumptions

### 1. Opaque Tokens (Critical Assumption)

The proxy works because Clerk issues opaque tokens (`oat_...`), not
JWTs. This means:

- There is no `iss` claim to validate against the AS metadata `issuer`
- Token verification happens via Clerk's API (`getAuth()`), which does
  not check where the client found the AS metadata
- The `resource-parameter-validator.ts` already correctly skips audience
  validation for opaque tokens

**Risk**: If Clerk offers JWT access tokens in the future, the issuer
mismatch (`issuer: "http://localhost:3333"` vs Clerk's actual issuer)
will break clients that validate `iss` claims against AS metadata. This
must be documented in the ADR.

### 2. RFC 8414 Issuer Compliance

RFC 8414 Section 3.3 requires the `issuer` in AS metadata to be
identical to the URL used to retrieve the metadata. Setting
`issuer: "http://localhost:3333"` is correct for our AS metadata served
at `http://localhost:3333/.well-known/oauth-authorization-server`.

The fact that the tokens originate from Clerk is an implementation
detail — the proxy IS the authorisation server from the client's
perspective, per the same pattern used by `ProxyOAuthServerProvider`.

### 3. Transparent Forwarding

The proxy MUST forward all parameters transparently:

- `/oauth/authorize`: Forward all query parameters to the upstream
  redirect URL. Do not filter, transform, or omit any parameters.
- `/oauth/token`: Forward the complete request body to the upstream
  token endpoint. Do not filter or transform.
- `/oauth/register`: Forward the complete request body to the upstream
  registration endpoint. Do not filter or transform.

This makes the proxy resilient to upstream changes (e.g., Clerk adding
new parameters). Selective forwarding would be fragile.

### 4. AS Metadata Capability Parity

The proxy's AS metadata MUST advertise only capabilities that the proxy
actually serves. Strategy: mirror the upstream Clerk metadata's
structure, but rewrite all endpoint URLs to point to our proxy. This
ensures clients see the full set of supported capabilities while all
traffic flows through the proxy.

Specifically, fetch and cache Clerk's AS metadata at startup, then
rewrite `issuer`, `authorization_endpoint`, `token_endpoint`,
`registration_endpoint` to our origin. Fields like
`token_endpoint_auth_methods_supported`, `scopes_supported`,
`grant_types_supported`, and `code_challenge_methods_supported` are
passed through unchanged from Clerk.

---

## Testing Strategy

TDD applies at ALL levels. The PoC is not exempt.

### Unit Tests (pure functions, no I/O)

| Function | Test |
|----------|------|
| Upstream URL derivation from publishable key | Given a publishable key, returns correct FAPI domain and OAuth endpoints |
| Authorise redirect URL construction | Given query params, returns correct upstream URL with all params appended |
| Grant type validation | Rejects unknown grant types; accepts `authorization_code` and `refresh_token` |
| Token request validation | Rejects missing `code` or `code_verifier` for auth_code grants |
| Proxy error response construction | Given a timeout/network error, returns correct OAuth error format |
| AS metadata rewriting | Given upstream metadata and local origin, returns correctly rewritten metadata |

### Integration Tests (in-process, with simple fakes)

| Scenario | Test |
|----------|------|
| `POST /oauth/register` | Forwards body to fake upstream, returns response |
| `GET /oauth/authorize` | Constructs correct redirect URL with all params |
| `POST /oauth/token` (auth_code) | Forwards authorisation code grant to fake upstream |
| `POST /oauth/token` (refresh) | Forwards refresh token grant to fake upstream |
| `POST /oauth/token` (invalid grant) | Rejects unknown grant type with 400 |
| Upstream 4xx | Passes through Clerk's error response |
| Upstream 5xx | Passes through Clerk's error response |
| Upstream timeout | Returns 504 with meaningful error |
| AS metadata endpoint | Advertises correct proxy endpoints |
| PRM endpoint | `authorization_servers` points to self |

### Smoke Tests (out-of-process, real Clerk)

- Existing `pnpm smoke:oauth:spec` must pass with proxy-rewritten
  metadata (update assertions from Clerk HTTPS URLs to self-origin)
- New: Proxy-specific smoke test validates DCR → authorise → token
  exchange through the proxy against real Clerk

### Naming Conventions

- Unit: `*.unit.test.ts` next to the pure function
- Integration: `*.integration.test.ts` next to the integration point
- Smoke: in `smoke-tests/` directory

---

## Phase 1: Proof of Concept (Validate Approach with TDD)

**Goal**: Prove the proxy approach fixes Cursor with the smallest
possible change, using TDD. Write failing tests first, implement
minimally, validate with Cursor.

### TDD Cycle

1. **RED**: Write integration tests for each proxy endpoint (fake
   upstream). Run them — they fail (endpoints do not exist).
2. **GREEN**: Implement the proxy endpoints. Run tests — they pass.
3. **VALIDATE**: Start the dev server. Enable Cursor. Observe the flow.
4. **REFACTOR**: Improve implementation. Tests remain green.

### What to Build

Add three proxy endpoints to the existing Express app. Derive the
upstream Clerk URL from `CLERK_PUBLISHABLE_KEY` at startup — do not
hardcode the FAPI domain.

#### 1. `POST /oauth/register` — Dynamic Client Registration proxy

```text
Receives: DCR request from Cursor
Does: Forwards complete request body to Clerk /oauth/register
Returns: Clerk's DCR response (client_id, etc.)
```

#### 2. `GET /oauth/authorize` — Authorisation redirect proxy

```text
Receives: Authorisation request from Cursor (client_id, redirect_uri,
          code_challenge, state, scope, resource, etc.)
Does: Validates redirect target is the known Clerk FAPI domain.
      Redirects (302) to Clerk's authorisation endpoint with ALL
      query parameters forwarded transparently.
```

#### 3. `POST /oauth/token` — Token exchange proxy

```text
Receives: Token exchange request from Cursor (grant_type, code,
          code_verifier, redirect_uri, client_id, resource, etc.)
Does: Validates grant_type is authorization_code or refresh_token.
      Forwards complete request body to Clerk /oauth/token.
Returns: Clerk's token response (access_token, etc.)
Timeout: 10 seconds to Clerk, 504 on timeout.
```

#### 4. Update PRM `authorization_servers`

Change `authorization_servers` to point to the server's own origin
(dynamically derived from runtime config, not hardcoded):

```json
{ "authorization_servers": ["http://localhost:3333"] }
```

#### 5. Update AS metadata `/.well-known/oauth-authorization-server`

Fetch Clerk's AS metadata at startup, cache it, and rewrite endpoint
URLs to point to our proxy. Pass through capability fields unchanged:

```json
{
  "issuer": "http://localhost:3333",
  "authorization_endpoint": "http://localhost:3333/oauth/authorize",
  "token_endpoint": "http://localhost:3333/oauth/token",
  "registration_endpoint": "http://localhost:3333/oauth/register",
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "none", "client_secret_post"],
  "scopes_supported": ["openid", "profile", "email", "public_metadata", "private_metadata", "offline_access"],
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256"]
}
```

#### 6. Register proxy endpoints in the pre-auth public phase

Proxy endpoints MUST be registered in the same middleware phase as
`registerPublicOAuthMetadataEndpoints` (Phase 2.5 in `application.ts`),
before the global Clerk middleware. They are public OAuth infrastructure,
not protected routes.

Add `/oauth/authorize`, `/oauth/token`, `/oauth/register` to
`CLERK_SKIP_PATHS` in `conditional-clerk-middleware.ts`.

#### 7. Structured logging

Every proxy call MUST log: upstream URL, response status, duration, and
correlation ID. Use the existing structured logger.

### What NOT to Change

- The `/mcp` endpoint and auth middleware — unchanged
- Clerk token verification — unchanged (tokens are still Clerk tokens)
- The resource-parameter-validator — unchanged
- CORS configuration — unchanged (proxy endpoints inherit global CORS)

### Acceptance Criteria

1. Integration tests pass (proxy routes with fake upstream)
2. Cursor completes the OAuth flow end-to-end
3. Server logs show `Authorization: Bearer oat_...` on `POST /mcp`
4. Cursor shows green "Connected" with tools listed
5. Existing `pnpm smoke:oauth:spec` passes (with updated assertions:
   `authorization_servers` now points to self-origin, not Clerk HTTPS)
6. Server logs show structured logging for all proxy calls

### Monitoring for Cursor's `Basic` Auth Bug

During PoC validation, explicitly log incoming `Authorization` headers
on the `/oauth/token` endpoint. If Cursor sends `Authorization: Basic`
despite registering with `token_endpoint_auth_method: "none"`, this is a
known Cursor bug ([GitHub #3734](https://github.com/cursor/cursor/issues/3734)).
Clerk's dev-mode token endpoint tolerates this — but log it so we can
confirm whether it affects us. If it causes failures, the token proxy
must strip the `Authorization` header before forwarding.

### Risks

- Clerk may send `cursor://` redirect URIs that need special handling
  in the proxy authorise endpoint
- Token exchange may require matching the redirect_uri exactly
  (the redirect goes through Clerk's authorisation endpoint, not ours)
- CORS preflight on proxy endpoints may need attention
- Cursor's `Basic` auth bug may require header stripping at the proxy

---

## Phase 2: Architecture Design (After PoC Validates)

Only proceed if Phase 1 succeeds.

### Decision: SDK `mcpAuthRouter` vs Custom Routes

| Aspect | SDK `mcpAuthRouter` | Custom Routes |
|--------|---------------------|---------------|
| Endpoint paths | Fixed at root (`/authorize`, `/token`, etc.) | Flexible (`/oauth/authorize`, etc.) |
| Metadata endpoints | Creates its own `/.well-known/*` | Use our existing endpoints |
| Rate limiting | Built-in | Must implement |
| CORS | Built-in | Use our existing CORS |
| Middleware chain | Replaces ours | Integrates with ours |
| Error handling | SDK standard | Our patterns |
| Observability | None built-in | Our structured logging |

**Likely choice: Custom routes using `ProxyOAuthServerProvider`
internally.** This preserves our existing middleware chain, logging,
CORS, and error handling. We use the provider's proxy logic without
adopting the router's opinionated layout.

### Boundary Definition

```text
                    ┌─────────────────────────────────────────┐
                    │           Our MCP Server                │
                    │                                         │
                    │  ┌──────────────────────────────────┐   │
                    │  │  OAuth Proxy Layer (NEW)          │   │
                    │  │  /oauth/authorize  → Clerk        │   │
                    │  │  /oauth/token      → Clerk        │   │
                    │  │  /oauth/register   → Clerk        │   │
                    │  └──────────────────────────────────┘   │
                    │                                         │
                    │  ┌──────────────────────────────────┐   │
                    │  │  OAuth Metadata (UPDATED)         │   │
                    │  │  /.well-known/oauth-protected-    │   │
                    │  │    resource → points AS to self   │   │
                    │  │  /.well-known/oauth-authorization-│   │
                    │  │    server → advertises proxy      │   │
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

### Key Architectural Invariants

1. **Tokens are still Clerk tokens.** The proxy does not issue its own
   tokens. It proxies the token exchange to Clerk. The `/mcp` endpoint
   still verifies tokens using Clerk's `getAuth()`.

2. **The proxy is transparent.** It holds no OAuth session or token
   state. It is a stateless pass-through for all OAuth operations.
   Bounded operational state is permitted: cached upstream AS metadata
   (fetched once at startup) and rate-limit counters for DCR.

3. **DCR clients are Clerk DCR clients.** The proxy forwards DCR to
   Clerk. Clerk manages the registered clients.

4. **PKCE is validated by Clerk, not by us.** The proxy passes through
   `code_challenge` and `code_verifier` to Clerk.

5. **The proxy is always-on.** One code path for all clients, all
   environments. No client detection, no conditional enablement, no
   toggle management. This simplifies testing (one path to validate),
   operations (no environment-specific config), and architecture
   (consistent metadata for all clients). If Cursor fixes the bug, the
   proxy can be removed — but there is no urgency, as it adds no
   overhead.

6. **Other clients are unaffected.** MCP Inspector and programmatic
   clients follow the PRM `authorization_servers` to our server, which
   proxies to Clerk. The tokens are identical. Existing smoke tests
   should continue to pass.

### Files Affected

| File | Change |
|------|--------|
| `src/oauth-proxy/` (NEW directory) | Proxy route handlers, pure functions, types |
| `src/oauth-proxy/oauth-proxy-routes.ts` (NEW) | Express route handlers |
| `src/oauth-proxy/oauth-proxy-upstream.ts` (NEW) | Pure functions for URL construction, validation |
| `src/oauth-proxy/oauth-proxy-routes.integration.test.ts` (NEW) | Integration tests with fake upstream |
| `src/oauth-proxy/oauth-proxy-upstream.unit.test.ts` (NEW) | Unit tests for pure functions |
| `src/oauth-proxy/index.ts` (NEW) | Public API boundary |
| `src/auth-routes.ts` | Update PRM and AS metadata generation |
| `src/application.ts` | Register proxy routes in Phase 2.5 (pre-auth) |
| `src/conditional-clerk-middleware.ts` | Add proxy paths to `CLERK_SKIP_PATHS` |
| `src/auth/mcp-auth/mcp-auth.ts` | No change |
| `src/security.ts` | No change (global CORS covers proxy endpoints) |

---

## Phase 3: Production Implementation (After Architecture Design)

TDD at all levels. Write tests first, then implement.

1. **Unit tests (RED)**: Write failing unit tests for pure functions
   (URL construction, validation, error formatting, metadata rewriting)
2. **Unit implementation (GREEN)**: Implement pure functions. Tests pass.
3. **Integration tests (RED)**: Write failing integration tests for
   proxy route handlers with fake upstream
4. **Route implementation (GREEN)**: Implement proxy routes with error
   handling, timeouts, structured logging. Tests pass.
5. **Wire into middleware chain**: Register proxy routes in Phase 2.5
   of `application.ts`. Add paths to `CLERK_SKIP_PATHS`.
6. **Update metadata generation**: Update
   `generateClerkProtectedResourceMetadata` to use server origin.
   Update `deriveAuthServerMetadata` (or replace with cached upstream
   rewriting) to advertise proxy endpoints.
7. **Smoke test updates**: Update existing `pnpm smoke:oauth:spec`
   assertions (self-origin instead of Clerk HTTPS URLs). Add
   proxy-specific smoke test.
8. **Rate limiting**: Add DCR rate limiting (20 per hour per IP)
9. **Quality gates**: Run full gate chain

---

## Phase 4: Documentation and Cleanup

1. Update ADR-113 with proxy OAuth AS approach
2. Consider writing a dedicated ADR for the proxy decision
3. Archive completed plans
4. Update auth-routes and application TSDoc

---

## Impact on Other Workstreams

### Semantic Search Deployment

The proxy OAuth AS is a prerequisite for Cursor users to authenticate
with the MCP server. Without it, Cursor users cannot access any MCP
tools, including semantic search. This is blocking for the
`oak-curriculum-http-local-200226` MCP server in Cursor.

### Production Deployment

The same bug will affect the production MCP server
(`curriculum-mcp-alpha.oaknational.dev`) once it requires auth.
The proxy should be included in the production deployment.

### Other MCP Clients

The proxy is transparent to other clients. MCP Inspector, Claude,
and programmatic clients will work identically — they just go through
the proxy instead of directly to Clerk. The tokens are the same.

---

## Resolved Design Decisions

1. **The proxy is always-on.** One code path for all clients, all
   environments. No client detection, no conditional enablement. This
   simplifies testing, operations, and architecture.

2. **No `/cursor` path.** Not needed with an always-on proxy.

3. **Token refresh is supported.** The proxy handles
   `grant_type=refresh_token`. It is architecturally ready for when
   Cursor fixes its refresh bug
   ([forum #149511](https://forum.cursor.com/t/cursor-does-not-refresh-oauth-tokens-for-mcp-servers/149511)).

4. **The proxy can be removed later.** If Cursor fixes the
   `resource_metadata` persistence bug, the proxy can be removed. But
   there is no urgency — it adds no overhead and simplifies the metadata
   chain (clients never need to know about Clerk's domain).

## Known Limitations

1. **Token expiry with Cursor**: Cursor does not refresh tokens.
   Connections will drop when the access token expires. Users must
   reconnect. No server-side fix is possible for this Cursor bug.

2. **Opaque token dependency**: The proxy relies on Clerk issuing
   opaque tokens. If Clerk switches to JWT access tokens, the issuer
   mismatch will need addressing (see Architectural Assumptions).

---

## Known Clerk Configuration

- **FAPI domain**: `native-hippo-15.clerk.accounts.dev`
- **Authorise URL**: `https://native-hippo-15.clerk.accounts.dev/oauth/authorize`
- **Token URL**: `https://native-hippo-15.clerk.accounts.dev/oauth/token`
- **Registration URL**: `https://native-hippo-15.clerk.accounts.dev/oauth/register`

### Current Metadata Snapshots

**Our PRM** (`/.well-known/oauth-protected-resource`):

```json
{
  "resource": "http://localhost:3333/mcp",
  "authorization_servers": ["https://native-hippo-15.clerk.accounts.dev"],
  "token_types_supported": ["urn:ietf:params:oauth:token-type:access_token"],
  "scopes_supported": ["email", "openid"]
}
```

**Our AS Metadata** (`/.well-known/oauth-authorization-server`):

```json
{
  "issuer": "https://native-hippo-15.clerk.accounts.dev",
  "authorization_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/authorize",
  "token_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/token",
  "registration_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/register",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256"]
}
```

**Clerk's Own AS Metadata** (`https://native-hippo-15.clerk.accounts.dev/.well-known/oauth-authorization-server`):

```json
{
  "issuer": "https://native-hippo-15.clerk.accounts.dev",
  "authorization_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/authorize",
  "token_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/token",
  "registration_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/register",
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "none", "client_secret_post"],
  "scopes_supported": ["openid", "profile", "email", "public_metadata", "private_metadata", "offline_access"],
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256"]
}
```

---

## Key Files

### Server-Side Auth Chain

| File | Role |
|------|------|
| `src/auth-routes.ts` | OAuth metadata endpoints (PRM + AS metadata) + `deriveAuthServerMetadata()` |
| `src/auth/mcp-auth/mcp-auth.ts` | Generic auth middleware (401 + WWW-Authenticate) |
| `src/auth/mcp-auth/mcp-auth-clerk.ts` | Clerk-specific token verification |
| `src/conditional-clerk-middleware.ts` | Path-based Clerk bypass |
| `src/resource-parameter-validator.ts` | JWT `aud` claim validation (RFC 8707) |
| `src/security.ts` | CORS middleware (exposes `WWW-Authenticate` header) |
| `src/application.ts` | Middleware chain wiring |

### Smoke Test Infrastructure

| File | Role |
|------|------|
| `smoke-tests/auth/clerk-oauth-token.ts` | Programmatic PKCE flow |
| `smoke-assertions/oauth-discovery.ts` | Discovery chain validation |
| `smoke-assertions/oauth-spec-e2e.ts` | Full spec-compliant flow |
| `smoke-tests/smoke-oauth-spec.ts` | Entry point for `pnpm smoke:oauth:spec` |
| `smoke-assertions/authenticated.ts` | Authenticated call assertion |
| `smoke-tests/OAUTH-CURL-TESTS.sh` | Discovery endpoint validation |

---

## References

### Specifications and Standards

- [MCP Authorisation Spec (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [RFC 9728 — OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728)
- [RFC 8414 — OAuth 2.0 Authorisation Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414)
- [RFC 7591 — OAuth 2.0 Dynamic Client Registration](https://datatracker.ietf.org/doc/html/rfc7591)
- [RFC 8707 — Resource Indicators for OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc8707)

### Cursor Bug Reports

- [Forum #151331: resource_metadata URL loss](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331)
- [Forum #149511: Token refresh not working](https://forum.cursor.com/t/cursor-does-not-refresh-oauth-tokens-for-mcp-servers/149511)
- [GitHub #3734: DCR public client sends Basic auth](https://github.com/cursor/cursor/issues/3734)
- [Forum #150862: Browser not opening for OAuth](https://forum.cursor.com/t/mcp-servers-with-auth-do-not-open-browser-anymore/150862)

### Solutions and Guides

- [Working Solution: Entra ID Proxy](https://forum.cursor.com/t/working-solution-mcp-server-oauth-with-microsoft-entra-id-on-azure-container-apps/151813)
- [MCP SDK ProxyOAuthServerProvider](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/server/auth/providers/proxyProvider.ts)
- [Clerk MCP Connect Client](https://clerk.com/docs/guides/development/mcp/connect-mcp-client)
- [Clerk Build MCP Server Guide](https://clerk.com/docs/expressjs/guides/development/mcp/build-mcp-server)
- [OpenAI Apps SDK Authentication](https://developers.openai.com/apps-sdk/build/auth)
- [MCPJam OAuth Checklist](https://www.mcpjam.com/blog/mcp-oauth-guide)
- [Make MCP Cursor Guide](https://developers.make.com/mcp-server/connect-using-oauth/usage-with-cursor)

### Internal

- [ADR-113: All MCP Requests Require HTTP Auth](/docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md)
- [OAuth Spec Compliance Plan (archived)](../archive/completed/oauth-spec-compliance.md)
- [OAuth Validation Plan (archived)](../archive/completed/oauth-validation-and-cursor-flows.plan.md)
- [Cursor Investigation Report (archived)](../archive/completed/cursor-oauth-investigation-report.md)
