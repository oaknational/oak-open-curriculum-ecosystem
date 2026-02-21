---
name: Proxy OAuth AS to Fix Cursor OAuth Flow
overview: >
  Cursor has a confirmed client-side bug (forum #151331) where the
  resource_metadata URL is not persisted across the OAuth redirect flow.
  When the MCP resource server and OAuth authorization server are on
  different origins, the token exchange fails after browser authorization.
  This affects both dev (localhost) and production (real domain) because
  the root cause is origin mismatch between RS and AS.

  The fix: act as a proxy OAuth AS so Cursor sees RS and AS on the same
  origin. Implementation is functionally complete — async createApp,
  metadata DI, proxy endpoints, self-origin metadata, all tests pass.
  Remaining: Cursor validation, fetch DI for proxy routes, error
  handling migration to Result<T, E>, documentation.
todos:
  - id: poc-tests-red
    content: >
      Phase 1 (RED): Write failing integration tests for proxy
      endpoints (fake upstream). Write failing unit tests for pure
      functions (URL construction, metadata rewriting, error formatting).
    status: completed
  - id: poc-implement-green
    content: >
      Phase 1 (GREEN): Implement proxy endpoints and pure functions.
      Tests pass. Register in Phase 2.5 of application.ts. Add paths
      to CLERK_SKIP_PATHS. Update PRM and AS metadata.
    status: completed
  - id: async-bootstrap
    content: >
      Make createApp async (returns Promise<ExpressWithAppId>).
      Added runAsyncBootstrapPhase (6 unit tests).
      Added 'fetchUpstreamMetadata' + 'registerOAuthProxy' to BootstrapPhaseName.
      Added upstreamMetadata to CreateAppOptions for DI.
      setupOAuthAndCaching properly awaited with metadata DI path.
      All ~30 call sites updated. Production entry uses top-level await.
      UpstreamAuthServerMetadata validated via Zod schema.
    status: completed
  - id: update-e2e-tests
    content: >
      auth-enforcement.e2e.test.ts completely rewritten (16 tests):
      PRM asserts self-origin authorization_servers (not Clerk),
      AS metadata asserts self-origin endpoints + upstream capabilities,
      proxy endpoint existence verified, RFC compliance tests.
      auth-routes.integration.test.ts updated (9 tests):
      self-origin authorization_servers, AS metadata with rewritten URLs.
      Test fixture: e2e-tests/helpers/upstream-metadata-fixture.ts.
      All auth-enabled E2E tests inject upstreamMetadata via CreateAppOptions.
    status: completed
  - id: quality-gates
    content: >
      Full quality gate chain passes: type-gen, build, type-check,
      lint:fix, format:root, markdownlint:root, test (634),
      test:e2e (185), smoke:dev:stub. All clean.
    status: completed
  - id: inject-fetch-di
    content: >
      Inject fetch into OAuthProxyConfig for testability. Integration
      tests currently use real HTTP calls via globalThis.fetch to a
      fake Express server, violating testing strategy. With DI,
      integration tests inject a simple fake fetch function. E2E tests
      (supertest, out-of-process) continue to use real HTTP.
      Separate TDD cycle — write tests first, then implement.
    status: pending
  - id: poc-validate-cursor
    content: >
      VALIDATE: Start dev server with proxy (real Clerk keys).
      Connect Cursor. Confirm full OAuth flow completes. Capture
      server logs showing Authorization header on POST /mcp.
      Monitor for Basic auth bug (GitHub #3734).
    status: pending
  - id: smoke-tests-update
    content: >
      Auth-enabled smoke tests may need assertion updates for
      self-origin URLs in AS metadata. Add proxy-specific smoke
      test validating DCR → authorise → token exchange through
      the proxy against real Clerk.
    status: pending
  - id: error-handling-debt
    content: >
      Migrate try/catch with unknown error types in
      oauth-proxy-routes.ts to Result<T, E> for explicit,
      traceable error paths. Currently conflates upstream JSON
      parse failures with network errors.
    status: pending
  - id: documentation
    content: >
      Update ADR-113, write proxy ADR, archive completed
      plans, update auth-routes and application TSDoc.
    status: pending
isProject: false
---

## Context

**Session entry point**: [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md)
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

## Security Model

The proxy is a transparent passthrough. It does NOT validate, filter,
or rate-limit anything. Clerk is the real authorisation server — Clerk
handles all security, all validation, all rate limiting. The proxy adds
nothing of its own.

### Open Redirect: Not a Risk

`/oauth/authorize` redirects to a URL derived at startup from
`CLERK_PUBLISHABLE_KEY` via `deriveUpstreamOAuthBaseUrl()`. The
redirect target is an immutable value set once at process start. Client
requests append query parameters to this known-good base URL — they
cannot control the redirect hostname.

### No Request Validation

The proxy does NOT validate `grant_type`, `code`, `code_verifier`, or
any other parameter. If a client sends garbage, Clerk rejects it and
returns an appropriate OAuth error. The proxy passes that error through
verbatim. This is by design: the proxy is a transparent pipe, not a
security layer. Any validation the proxy performs is something Clerk
also performs — it would be redundant at best and information-losing
at worst.

### No DCR Rate Limiting

Clerk already rate-limits its own DCR endpoint. Adding proxy-level rate
limiting would create a second, potentially conflicting enforcement
point. The proxy is not a service; it should not make policy decisions
that belong to the upstream AS.

---

## Error Handling Strategy (Implemented)

### Principle: Pass Through + Log

The proxy follows a simple error model (all implemented):

1. **Pass through** Clerk's error responses verbatim (status code +
   body) for all Clerk-originated errors (4xx, 5xx)
2. **Generate proxy-level errors** only for infrastructure failures
   (timeout, network error)
3. **Log all** upstream calls with structured logging (upstream URL,
   response status, duration)
4. **Never swallow errors** — every failure is visible in logs

### Upstream Error Handling (Implemented)

All HTTP calls to Clerk use `fetchWithTimeout()` with a 10-second
default timeout (configurable via `OAuthProxyConfig.timeoutMs`).

| Failure | Proxy Response | Implementation |
|---------|----------------|----------------|
| Clerk returns 4xx | Pass through Clerk's status + body | `res.status(upstream.status).json(body)` |
| Clerk returns 5xx | Pass through Clerk's status + body | Same |
| Clerk times out (>10s) | HTTP 504 + `{ "error": "temporarily_unavailable" }` | `AbortError` → 504 |
| Network error (DNS, connection refused) | HTTP 502 + `{ "error": "temporarily_unavailable" }` | Catch → 502 |
| Unhandled promise rejection | HTTP 500 + `{ "error": "server_error" }` | `asyncRoute` wrapper |

Error responses use the OAuth 2.0 error format (RFC 6749 Section 5.2)
via `formatProxyErrorResponse()`.

**Known debt**: Error handling uses `try/catch` with `unknown` error
types. Should migrate to `Result<T, E>` for explicit, traceable error
paths. Currently conflates upstream JSON parse failures with network
errors in the catch blocks. This is documented in TSDoc on
`oauth-proxy-routes.ts`.

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

### 3. Transparent Forwarding (Implemented)

The proxy forwards all parameters transparently. This is implemented:

- `/oauth/authorize`: All query parameters forwarded via
  `buildAuthorizeRedirectUrl()`. No filtering.
- `/oauth/token`: Raw `application/x-www-form-urlencoded` body
  forwarded as-is (parsed by `express.text()`, not `express.urlencoded()`).
  No field-level inspection.
- `/oauth/register`: JSON body forwarded via `JSON.stringify(req.body)`.
  No field-level inspection.

This makes the proxy resilient to upstream changes (e.g., Clerk adding
new parameters). Selective forwarding would be fragile.

### 4. AS Metadata: Fetch and Rewrite (Fully Implemented)

Strategy: fetch Clerk's live AS metadata at startup, cache it for
process lifetime, rewrite endpoint URLs per-request to the server's
own origin. All capability fields pass through unchanged.

**Implemented**:

- `rewriteAuthServerMetadata()` uses object spread to preserve all
  fields, then overrides `issuer`, `authorization_endpoint`,
  `token_endpoint`, and `registration_endpoint`
- `isUpstreamAuthServerMetadata()` type guard uses Zod schema
  (`upstreamAuthServerMetadataSchema`) for validation
- `registerPublicOAuthMetadataEndpoints()` accepts metadata via DI
- `setupOAuthAndCaching()` properly awaited by async `createApp()`
- When `upstreamMetadata` is injected (tests), uses it directly
- When not (production), fetches from Clerk via `runAsyncBootstrapPhase`
- All ~30 `createApp` call sites updated with `await`

---

## Testing Strategy

TDD applies at ALL levels. The PoC is not exempt.

### Unit Tests (pure functions, no I/O) — 22 tests, DONE

| Function | Test | Status |
|----------|------|--------|
| `deriveUpstreamOAuthBaseUrl` | Derives FAPI domain from publishable key; throws on empty/invalid | Done |
| `buildAuthorizeRedirectUrl` | Appends all query params to upstream URL; handles empty params; preserves URL encoding | Done |
| `formatProxyErrorResponse` | Creates OAuth 2.0 error response per RFC 6749 Section 5.2 | Done |
| `rewriteAuthServerMetadata` | Rewrites issuer + endpoints to local origin; preserves capabilities unchanged; passes through optional endpoint URLs; omits absent optional endpoints | Done |
| `isUpstreamAuthServerMetadata` | Validates required string and array fields; rejects null, string, missing fields, non-array fields, arrays with non-strings | Done |

File: `src/oauth-proxy/oauth-proxy-upstream.unit.test.ts`

### Integration Tests (in-process, with fake upstream) — 10 tests, DONE

| Scenario | Test | Status |
|----------|------|--------|
| `POST /oauth/register` | Forwards body to fake upstream, returns response | Done |
| `GET /oauth/authorize` | Constructs correct redirect URL with all params | Done |
| `POST /oauth/token` (auth_code) | Forwards authorisation code grant | Done |
| `POST /oauth/token` (refresh) | Forwards refresh token grant | Done |
| `POST /oauth/token` (unknown params) | Forwards unknown parameters transparently | Done |
| `POST /oauth/token` (any grant type) | Forwards any grant type without filtering | Done |
| Upstream 4xx | Passes through Clerk's error response verbatim | Done |
| Upstream 5xx | Passes through Clerk's error response verbatim | Done |
| Upstream timeout | Returns 504 with meaningful error | Done |
| Upstream unreachable | Returns 502 with meaningful error | Done |

File: `src/oauth-proxy/oauth-proxy-routes.integration.test.ts`

**KNOWN ISSUE**: Integration tests currently use real HTTP calls via
`globalThis.fetch` to a fake Express server running on `127.0.0.1`.
This violates the testing strategy: "Integration tests DO NOT trigger
IO." The architecturally correct fix is to inject `fetch` into
`OAuthProxyConfig` as a DI dependency. Integration tests then inject a
simple fake function. See todo `inject-fetch-di`.

### E2E Tests — DONE (16 tests)

`auth-enforcement.e2e.test.ts` completely rewritten. Now verifies:

| Test Group | Assertions |
|-----------|-----------|
| PRM (`/.well-known/oauth-protected-resource`) | `authorization_servers` is `[self-origin]`, `resource` is `self-origin/mcp` |
| AS Metadata (`/.well-known/oauth-authorization-server`) | `issuer`, `authorization_endpoint`, `token_endpoint`, `registration_endpoint` all self-origin; upstream capabilities preserved unchanged |
| Proxy Endpoints | `/oauth/register`, `/oauth/authorize`, `/oauth/token` all respond (not 404) |
| RFC Compliance | Issuer matches retrieval URL per RFC 8414 Section 3.3 |
| Unauthenticated MCP | 401 + `WWW-Authenticate` with `resource_metadata` pointing to self-origin |

All auth-enabled E2E tests inject `TEST_UPSTREAM_METADATA` from
`e2e-tests/helpers/upstream-metadata-fixture.ts` via `CreateAppOptions`.
No network calls to Clerk in tests.

### Smoke Tests (out-of-process, real Clerk)

- Existing `pnpm smoke:oauth:spec` must pass with proxy-rewritten
  metadata (update assertions from Clerk HTTPS URLs to self-origin)
- New: Proxy-specific smoke test validates DCR → authorise → token
  exchange through the proxy against real Clerk

### Naming Conventions

- Unit: `*.unit.test.ts` next to the pure function
- Integration: `*.integration.test.ts` next to the integration point
- E2E: `*.e2e.test.ts` in `e2e-tests/`
- Smoke: in `smoke-tests/` directory

---

## Phase 1: Proof of Concept — Implementation Status

### Completed (RED + GREEN)

All proxy route handlers, pure functions, unit tests, and integration
tests are implemented and passing. Four architectural reviews completed
(Barney, Betty, Fred, Wilma). Passthrough philosophy applied: all
validation removed, proxy does not gatekeep.

| Step | Status | Evidence |
|------|--------|----------|
| Unit tests (pure functions) | ✅ 22 tests pass | `oauth-proxy-upstream.unit.test.ts` |
| Integration tests (proxy routes + fake upstream) | ✅ 10 tests pass | `oauth-proxy-routes.integration.test.ts` |
| `POST /oauth/register` handler | ✅ Implemented | Forwards JSON body to Clerk, returns response verbatim |
| `GET /oauth/authorize` handler | ✅ Implemented | Redirects (302) to Clerk with all query params preserved |
| `POST /oauth/token` handler | ✅ Implemented | Forwards raw `application/x-www-form-urlencoded` body to Clerk |
| Pure functions (derive URL, build redirect, format error, rewrite metadata, type guard) | ✅ Implemented | `oauth-proxy-upstream.ts` |
| Proxy paths added to `CLERK_SKIP_PATHS` | ✅ Done | `conditional-clerk-middleware.ts` |
| PRM `authorization_servers` → self-origin | ✅ Done | `auth-routes.ts` |
| `registerPublicOAuthMetadataEndpoints` accepts `upstreamMetadata` via DI | ✅ Done | `auth-routes.ts` |
| `rewriteAuthServerMetadata` uses spread (no hardcoded capabilities) | ✅ Done | `oauth-proxy-upstream.ts` |
| `isUpstreamAuthServerMetadata` type guard | ✅ Done | `oauth-proxy-upstream.ts` |
| Structured logging (upstream URL, status, duration) | ✅ Done | All proxy handlers |
| TSDoc: passthrough philosophy, error handling debt, `req.url` vs `req.originalUrl` | ✅ Done | `oauth-proxy-routes.ts`, `oauth-proxy-upstream.ts` |
| Architectural review (Barney, Betty, Fred, Wilma) | ✅ All findings addressed | |
| Lint clean | ✅ | |

### RESOLVED — Async Bootstrap Fully Wired (2026-02-21)

The async bootstrap challenge has been resolved. Option A was
implemented: `createApp` is now async, all call sites updated.

**What was done:**

1. `createApp` returns `Promise<ExpressWithAppId>` — all ~30 call sites
   updated with `await`
2. `runAsyncBootstrapPhase` added to `bootstrap-helpers.ts` — measures
   async duration correctly (6 unit tests)
3. `'fetchUpstreamMetadata'` + `'registerOAuthProxy'` added to
   `BootstrapPhaseName`
4. `upstreamMetadata?: UpstreamAuthServerMetadata` added to
   `CreateAppOptions` — tests inject fixture, production fetches from Clerk
5. `setupOAuthAndCaching` properly awaited — when metadata is injected,
   uses it directly; when not, derives upstream URL from publishable key
   and fetches from Clerk via `runAsyncBootstrapPhase`
6. `UpstreamAuthServerMetadata` validated via Zod schema
   (`upstreamAuthServerMetadataSchema` in `oauth-proxy-upstream.ts`)
7. Test fixture: `e2e-tests/helpers/upstream-metadata-fixture.ts`
8. `auth-enforcement.e2e.test.ts` completely rewritten — 16 tests assert
   self-origin URLs in PRM and AS metadata, proxy endpoint existence,
   upstream capability preservation, RFC compliance
9. `auth-routes.integration.test.ts` updated — 9 tests including AS
   metadata endpoint with self-origin URLs + upstream capabilities
10. Production entry (`index.ts`) uses top-level `await`
11. All quality gates pass: 634 unit/integration + 185 E2E + smoke

### Remaining Steps

| Step | Status | Notes |
|------|--------|-------|
| Inject `fetch` into `OAuthProxyConfig` | Pending | Fix testing strategy violation (separate TDD cycle) |
| Validate with Cursor | **Pending — next priority** | Start dev server with real Clerk keys, connect Cursor, confirm full flow |
| Update auth-enabled smoke test assertions | Pending | Self-origin in AS metadata |
| Error handling → `Result<T, E>` | Pending | `try/catch` in proxy routes should use Result pattern |
| Documentation (ADR, TSDoc, archive plans) | Pending | |

### What Was NOT Changed

- The `/mcp` endpoint and auth middleware — unchanged
- Clerk token verification — unchanged (tokens are still Clerk tokens)
- The resource-parameter-validator — unchanged
- CORS configuration — unchanged (proxy endpoints inherit global CORS)

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

## Resolved Design Decisions (Phase 2 — Architecture)

Phase 2 (architecture design) is resolved. Custom Express routes were
chosen over the MCP SDK's `mcpAuthRouter`. Phases 2 and 3 from the
original plan have been merged into Phase 1 implementation.

### Decision: Custom Routes (not SDK `mcpAuthRouter`)

Custom Express routes using `Router()` preserve our existing middleware
chain, structured logging, CORS, and error handling. The SDK's
`mcpAuthRouter` would replace our middleware chain with its own
opinionated layout, create its own `/.well-known/*` endpoints (colliding
with ours), and provide no structured logging.

### Architecture Diagram

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
                    │  │    resource → points AS to self   │   │
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

### Key Architectural Invariants

1. **Tokens are still Clerk tokens.** The proxy does not issue its own
   tokens. It proxies the token exchange to Clerk. The `/mcp` endpoint
   still verifies tokens using Clerk's `getAuth()`.

2. **The proxy is transparent.** It holds no OAuth session or token
   state. It is a stateless passthrough for all OAuth operations. The
   only state: cached upstream AS metadata (fetched once at startup).

3. **The proxy does NOT validate.** Clerk handles all validation,
   security, and rate limiting. The proxy forwards everything verbatim.

4. **DCR clients are Clerk DCR clients.** The proxy forwards DCR to
   Clerk. Clerk manages the registered clients.

5. **PKCE is validated by Clerk, not by us.** The proxy passes through
   `code_challenge` and `code_verifier` to Clerk.

6. **The proxy is always-on.** One code path for all clients, all
   environments. No client detection, no conditional enablement. If
   Cursor fixes the bug, the proxy can be removed — but there is no
   urgency, as it adds no overhead.

7. **Other clients are unaffected.** MCP Inspector and programmatic
   clients follow the PRM `authorization_servers` to our server, which
   proxies to Clerk. The tokens are identical.

### Files (Current State)

| File | Role | Status |
|------|------|--------|
| `src/oauth-proxy/oauth-proxy-routes.ts` | Express route handlers (register, authorize, token) | Done |
| `src/oauth-proxy/oauth-proxy-upstream.ts` | Pure functions + Zod schema for `UpstreamAuthServerMetadata` | Done |
| `src/oauth-proxy/oauth-proxy-routes.integration.test.ts` | Integration tests with fake upstream (10 tests) | Done |
| `src/oauth-proxy/oauth-proxy-upstream.unit.test.ts` | Unit tests for pure functions (22 tests) | Done |
| `src/oauth-proxy/index.ts` | Public API boundary (barrel file) | Done |
| `src/auth-routes.ts` | PRM + AS metadata endpoints; accepts `upstreamMetadata` via DI | Done |
| `src/conditional-clerk-middleware.ts` | Proxy paths in `CLERK_SKIP_PATHS` | Done |
| `src/app/oauth-and-caching-setup.ts` | Wires OAuth metadata + proxy into bootstrap; DI or fetch | Done |
| `src/application.ts` | `createApp` async, `upstreamMetadata` in `CreateAppOptions` | Done |
| `src/app/bootstrap-helpers.ts` | `runAsyncBootstrapPhase`, `BootstrapPhaseName` complete | Done |
| `src/app/bootstrap-helpers.unit.test.ts` | Unit tests for `runAsyncBootstrapPhase` (6 tests) | Done |
| `e2e-tests/helpers/upstream-metadata-fixture.ts` | Test fixture for DI metadata injection | Done |
| `e2e-tests/auth-enforcement.e2e.test.ts` | Self-origin assertions, proxy endpoint tests (16 tests) | Done |
| `src/auth-routes.integration.test.ts` | Self-origin + AS metadata tests (9 tests) | Done |

---

## Resolved: Async Bootstrap (Option A Implemented — 2026-02-21)

Option A was implemented with full multi-level TDD:

1. **RED (Unit)**: 6 tests for `runAsyncBootstrapPhase` — all failed
   (function didn't exist)
2. **GREEN (Unit)**: Implemented `runAsyncBootstrapPhase` — all passed
3. **RED (E2E)**: Rewrote `auth-enforcement.e2e.test.ts` with
   self-origin assertions, async `createApp`, DI metadata — all failed
4. **RED (Integration)**: Updated `auth-routes.integration.test.ts`
   with AS metadata tests — all failed
5. **GREEN**: Made `createApp` async, wired `setupOAuthAndCaching`,
   updated all ~30 call sites — all tests passed
6. **REFACTOR**: Replaced manual type guard with Zod schema, fixed
   lint errors

**Key design decisions:**

- `runAsyncBootstrapPhase` is a separate function from
  `runBootstrapPhase` (simpler than overloads)
- When `upstreamMetadata` is injected (tests), `setupOAuthAndCaching`
  derives `upstreamBaseUrl` from `metadata.issuer` — no need for valid
  publishable key format in tests
- When not injected (production), derives URL from publishable key
  and fetches metadata via `runAsyncBootstrapPhase`
- Production entry (`index.ts`) uses top-level `await` (ESM)

---

## Phase 2: Documentation and Cleanup (After Proxy Works)

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
   environments. No client detection, no conditional enablement.

2. **No `/cursor` path.** Not needed with an always-on proxy.

3. **Custom Express routes, not SDK `mcpAuthRouter`.** Preserves our
   middleware chain, structured logging, and error handling.

4. **No validation in the proxy.** The proxy is a transparent
   passthrough. Clerk handles all validation, security, rate limiting.

5. **Token refresh is supported.** The proxy forwards any
   `grant_type` without filtering. It is architecturally ready for when
   Cursor fixes its refresh bug
   ([forum #149511](https://forum.cursor.com/t/cursor-does-not-refresh-oauth-tokens-for-mcp-servers/149511)).

6. **The proxy can be removed later.** If Cursor fixes the
   `resource_metadata` persistence bug, the proxy can be removed. But
   there is no urgency — it adds no overhead.

7. **Metadata fetched from Clerk, not hardcoded.** Capability arrays
   (`scopes_supported`, `grant_types_supported`, etc.) come from
   Clerk's live `/.well-known/oauth-authorization-server` endpoint,
   fetched once at startup. Only endpoint URLs are rewritten.

8. **DI for metadata in tests.** Tests inject an
   `UpstreamAuthServerMetadata` fixture via `CreateAppOptions`. No
   network calls in tests.

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

### Metadata Snapshots (Before and After Proxy)

**Our PRM** (`/.well-known/oauth-protected-resource`):

```json
// BEFORE (pointed to Clerk — Cursor breaks):
{
  "resource": "http://localhost:3333/mcp",
  "authorization_servers": ["https://native-hippo-15.clerk.accounts.dev"],
  "scopes_supported": ["email", "openid"]
}

// AFTER (points to self — Cursor works):
{
  "resource": "http://localhost:3333/mcp",
  "authorization_servers": ["http://localhost:3333"],
  "scopes_supported": ["email", "openid"]
}
```

**Our AS Metadata** (`/.well-known/oauth-authorization-server`):

```json
// BEFORE (hardcoded capabilities, pointed to Clerk):
{
  "issuer": "https://native-hippo-15.clerk.accounts.dev",
  "authorization_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/authorize",
  "token_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/token",
  "registration_endpoint": "https://native-hippo-15.clerk.accounts.dev/oauth/register",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256"]
}

// AFTER (fetched from Clerk, endpoints rewritten to self-origin):
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

The AFTER state exactly matches Clerk's own metadata except for the
four endpoint URLs, which are rewritten to self-origin by
`rewriteAuthServerMetadata()`. All capability arrays come from Clerk
and are passed through unchanged via object spread.

---

## Key Files

### OAuth Proxy

| File | Role | Status |
|------|------|--------|
| `src/oauth-proxy/oauth-proxy-routes.ts` | Route handlers: register, authorize, token | Done |
| `src/oauth-proxy/oauth-proxy-upstream.ts` | Pure functions: URL derivation, redirect, error, metadata rewrite, type guard | Done |
| `src/oauth-proxy/oauth-proxy-routes.integration.test.ts` | Integration tests with fake upstream (10 tests) | Done |
| `src/oauth-proxy/oauth-proxy-upstream.unit.test.ts` | Unit tests for pure functions (22 tests) | Done |
| `src/oauth-proxy/index.ts` | Barrel file | Done |

### Server-Side Auth Chain

| File | Role | Status |
|------|------|--------|
| `src/auth-routes.ts` | OAuth metadata endpoints (PRM + AS metadata); accepts `upstreamMetadata` via DI | Done |
| `src/app/oauth-and-caching-setup.ts` | Wires OAuth metadata + proxy; DI path or Clerk fetch | Done |
| `src/application.ts` | `createApp` async, `upstreamMetadata` in `CreateAppOptions` | Done |
| `src/app/bootstrap-helpers.ts` | `runAsyncBootstrapPhase`, complete `BootstrapPhaseName` | Done |
| `src/app/bootstrap-helpers.unit.test.ts` | Unit tests for `runAsyncBootstrapPhase` (6 tests) | Done |
| `src/conditional-clerk-middleware.ts` | Proxy paths in `CLERK_SKIP_PATHS` | Done |
| `src/auth/mcp-auth/mcp-auth.ts` | Generic auth middleware (401 + WWW-Authenticate) | Unchanged |
| `src/auth/mcp-auth/mcp-auth-clerk.ts` | Clerk-specific token verification | Unchanged |
| `src/resource-parameter-validator.ts` | JWT `aud` claim validation (RFC 8707) | Unchanged |
| `src/security.ts` | CORS middleware (exposes `WWW-Authenticate` header) | Unchanged |

### E2E Test Infrastructure

| File | Role | Status |
|------|------|--------|
| `e2e-tests/auth-enforcement.e2e.test.ts` | Self-origin metadata, proxy endpoints, RFC compliance (16 tests) | Done |
| `e2e-tests/helpers/upstream-metadata-fixture.ts` | `TEST_UPSTREAM_METADATA` fixture for DI | Done |
| `e2e-tests/helpers/create-stubbed-http-app.ts` | Async `createStubbedHttpApp` wrapper | Done |
| `e2e-tests/helpers/create-live-http-app.ts` | Async `createLiveHttpApp` wrapper | Done |
| `src/auth-routes.integration.test.ts` | AS metadata endpoint with self-origin assertions (9 tests) | Done |

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
