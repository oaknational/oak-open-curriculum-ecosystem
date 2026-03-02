# Cursor OAuth Investigation Report

**Date**: 2026-02-20
**Status**: Diagnosed — Confirmed Cursor client-side bug
**Cursor version**: 2.5.20 (Stable, darwin arm64)
**MCP SDK version**: @modelcontextprotocol/sdk (bundled in Cursor)
**MCP Protocol Version**: 2025-11-25

---

## Executive Summary

Cursor cannot complete the OAuth flow when the MCP resource server (RS) and OAuth authorization server (AS) are on different origins. This is a **confirmed Cursor client-side bug** where the `resource_metadata` URL discovered from the initial 401 `WWW-Authenticate` header is not persisted across the OAuth redirect flow, causing the token exchange to fail after browser authorization completes.

The bug affects **both development (localhost) and production (real domain)** configurations because the root cause is origin mismatch between RS and AS, not localhost-specific behaviour.

A server-side workaround exists: act as a **proxy OAuth AS** using the MCP SDK's `ProxyOAuthServerProvider`, so that Cursor sees RS and AS on the same origin.

---

## Evidence Summary

### Server-Side Request Log (3 identical attempts)

| # | Request | Response | Notes |
|---|---------|----------|-------|
| 1 | `GET /.well-known/oauth-authorization-server` | 200 | Pre-flight, user-agent: node |
| 2 | `POST /mcp` (no Authorization header) | 401 + `WWW-Authenticate` | No token attached |
| 3 | `GET /.well-known/oauth-protected-resource` | 200 | Follows resource_metadata URL |
| — | *Nothing further to our server* | — | Cursor stops |

After the browser OAuth flow completes and the user clicks the callback link, Cursor sends the **exact same 3-request sequence** — still without an Authorization header. The token is never attached.

### Cursor MCP OAuth Log (trace level)

```
17:24:44.236 — Clearing OAuth state (manual_or_external)      ← user clicks Connect
17:24:44.262 — Cleared
17:24:44.679 — needsAuth (oauth_provider_needs_auth_callback)  ← POST /mcp → 401
               ... browser OAuth flow at Clerk (~52 seconds) ...
17:25:36.854 — Clearing OAuth state (manual_or_external)       ← callback received
17:25:36.876 — Cleared
17:25:37.272 — needsAuth (oauth_provider_needs_auth_callback)  ← 401 AGAIN
```

No token exchange events appear at any point, even at trace level. The only events are state clearing and needsAuth transitions.

### What the User Sees

1. Click "Connect" → Cursor shows "waiting for callback" spinner
2. Browser opens to Clerk sign-in/authorization page
3. Clerk auto-approves (dev instance, `authorize-with-immediate-redirect`)
4. macOS dialog: "Allow native-hippo-15.clerk.accounts.dev to open the cursor link with Cursor?"
5. User clicks "Open Link"
6. Cursor briefly processes, then reverts to "Needs authentication"

### What Works

- Clerk DCR endpoint: tested directly, returns valid `client_id`
- Clerk AS metadata: serves correct `registration_endpoint`, `authorization_endpoint`, `token_endpoint`
- Clerk token endpoint: accepts `resource` parameter (ignores it gracefully)
- Our PRM: correct `resource`, `authorization_servers`, `scopes_supported`
- Our AS metadata: correct `issuer`, all endpoints point to Clerk
- MCP Inspector: connects and authenticates successfully (smoke tests pass)
- Programmatic PKCE flow: smoke tests pass end-to-end

---

## Root Cause Analysis

### The Bug

The MCP SDK's `StreamableHTTPClientTransport` stores `_resourceMetadataUrl` in memory when it receives a 401 response (line 320 of `client/streamableHttp.js`):

```javascript
const { resourceMetadataUrl, scope } = extractWWWAuthenticateParams(response);
this._resourceMetadataUrl = resourceMetadataUrl;
```

When `auth()` returns `REDIRECT` (browser authorization needed), the transport throws `UnauthorizedError`. The authorization flow persists `mcp_server_url`, `mcp_code_verifier`, and `mcp_client_information` — but **not** `resource_metadata` URL.

After the browser callback, the `finishAuth(authorizationCode)` method needs the `_resourceMetadataUrl` to re-discover PRM and locate the authorization server's token endpoint. Without it, PRM discovery falls back to well-known paths. If the AS URL discovered via fallback differs from the one used during authorization, the token exchange fails.

In our case:
- **PRM `authorization_servers`**: `["https://native-hippo-15.clerk.accounts.dev"]`
- **Fallback AS discovery**: Falls back to `http://localhost:3333` (the RS itself)
- **Result**: Token exchange targets the wrong server, or credentials don't match

### Confirmed by Cursor Forum

This exact bug was reported on **2026-02-09** (11 days before our investigation):

> **[MCP OAuth callback loses authorization server URL discovered from resource_metadata, causing token exchange failure](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331)**
>
> "The `resource_metadata` URL extracted from the initial 401 `WWW-Authenticate` header is not persisted across the OAuth redirect flow."
>
> — Nannan, Cursor Forum, Bug Reports

The suggested fix from the reporter: store `authorization_server_url` alongside `mcp_code_verifier` and `mcp_client_information` when initiating the redirect.

### Related Cursor OAuth Bugs

| Bug | Link | Status |
|-----|------|--------|
| resource_metadata URL loss during callback | [forum #151331](https://forum.cursor.com/t/mcp-oauth-callback-loses-authorization-server-url-discovered-from-resource-metadata-causing-token-exchange-failure/151331) | Open |
| Browser not opening for OAuth | [forum #150862](https://forum.cursor.com/t/mcp-servers-with-auth-do-not-open-browser-anymore/150862) | Open |
| OAuth token refresh not working | [forum #149511](https://forum.cursor.com/t/cursor-does-not-refresh-oauth-tokens-for-mcp-servers/149511) | Open |
| RFC 8414 non-compliance (path discovery) | [forum #116203](https://forum.cursor.com/t/cursors-mcp-implementation-is-not-following-rfc-8414-strictly/116203) | Open |
| Connect button produces zero network requests | [forum #150962](https://forum.cursor.com/t/remote-mcp-server-connect-button-produces-zero-network-requests-oauth-flow-never-starts/150962) | Open |
| client_credentials grant ignored | [forum #152307](https://forum.cursor.com/t/mcp-oauth-client-credentials-grant-ignored-when-client-secret-is-present/152307) | Open |

---

## Impact Assessment

### Affected Configurations

| Configuration | Affected? | Reason |
|--------------|-----------|--------|
| localhost dev server + Clerk AS | **Yes** | Different origins (http://localhost vs https://clerk.accounts.dev) |
| Production server + Clerk AS | **Yes** | Different origins (https://our-domain vs https://clerk.accounts.dev) |
| Any RS + third-party AS | **Yes** | The bug triggers whenever RS ≠ AS origin |
| RS that is its own AS (same origin) | **No** | No origin mismatch |

### Unaffected Clients

- MCP Inspector: uses the MCP SDK's OAuth client correctly
- Programmatic smoke tests: bypass browser redirect entirely
- Any client that persists `resource_metadata` URL across redirects

---

## Workaround Options

### Option A: Proxy OAuth AS (Recommended)

Act as our own OAuth Authorization Server, proxying all OAuth operations to Clerk. The MCP SDK provides `ProxyOAuthServerProvider` for exactly this pattern.

**How it works:**
1. Our server hosts all OAuth endpoints (`/oauth/authorize`, `/oauth/token`, `/oauth/register`, etc.)
2. These endpoints proxy requests to Clerk's corresponding endpoints
3. PRM `authorization_servers` points to **our own server** (same origin as RS)
4. Cursor sees RS and AS on the same origin → the bug doesn't trigger

**Precedent:** A community member published a [working solution using this approach with Microsoft Entra ID](https://forum.cursor.com/t/working-solution-mcp-server-oauth-with-microsoft-entra-id-on-azure-container-apps/151813), confirming the pattern works.

**Pros:**
- Fixes the issue for all Cursor versions with this bug
- Uses official MCP SDK component (`ProxyOAuthServerProvider`)
- Works for both dev and production
- Does not break other clients (MCP Inspector, etc.)

**Cons:**
- Additional server-side complexity
- Must keep proxy endpoints in sync with Clerk's OAuth implementation
- Token verification still needs Clerk (opaque tokens require Clerk's introspection)

### Option B: Wait for Cursor Fix

The bug is reported and the fix is straightforward (persist one additional URL). However, Cursor's release cadence for bug fixes is unpredictable.

### Option C: Dedicated `/cursor` Endpoint

Create a separate endpoint with Cursor-specific metadata. This does NOT fix the root cause (the resource_metadata URL is still lost during the redirect), so it would need to be combined with Option A.

---

## Recommended Path Forward

1. **Implement Option A (Proxy OAuth AS)** using `ProxyOAuthServerProvider` from the MCP SDK
2. **Retain the existing direct-to-Clerk flow** as a fallback for clients that handle the flow correctly
3. **Monitor Cursor releases** for a fix to the resource_metadata persistence bug
4. **File our own bug report** or upvote the existing one on the Cursor forum

---

## Metadata Snapshots (for reference)

### Our PRM (`/.well-known/oauth-protected-resource`)

```json
{
  "resource": "http://localhost:3333/mcp",
  "authorization_servers": ["https://native-hippo-15.clerk.accounts.dev"],
  "token_types_supported": ["urn:ietf:params:oauth:token-type:access_token"],
  "scopes_supported": ["email", "openid"]
}
```

### Our AS Metadata (`/.well-known/oauth-authorization-server`)

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

### Clerk's Own AS Metadata (`https://native-hippo-15.clerk.accounts.dev/.well-known/oauth-authorization-server`)

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
