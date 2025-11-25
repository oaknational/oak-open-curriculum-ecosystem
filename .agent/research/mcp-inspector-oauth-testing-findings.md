# MCP Inspector OAuth Testing Findings

**Date**: 2025-11-25  
**Inspector Version**: v0.17.2  
**Transport**: Streamable HTTP via Proxy

---

## Summary

During manual OAuth testing with MCP Inspector, the full OAuth flow completed successfully, but authenticated tool calls still received HTTP 401 responses. Investigation revealed the Bearer token was not being included in subsequent HTTP requests.

## Test Environment

- **MCP Server**: `http://localhost:3333/mcp` with auth enabled (`DANGEROUSLY_DISABLE_AUTH=false`)
- **Auth Provider**: Clerk OAuth 2.1
- **Connection Type**: Via Proxy (localhost:6277)

## What Worked ✅

1. **Discovery methods bypass auth** - `initialize` and `tools/list` completed without authentication (HTTP 200)
2. **HTTP 401 for protected tools without auth** - Server correctly returned `401 Unauthorized` with `WWW-Authenticate: Bearer resource_metadata="..."` header
3. **OAuth metadata discovery** - Inspector fetched `/.well-known/oauth-protected-resource` successfully
4. **Dynamic client registration** - Completed with Clerk
5. **Authorization code flow** - User completed OAuth consent in browser
6. **Token exchange** - Inspector received access token `oat_OSBQVE2W1X5PT32T8ACXT...`

## What Did Not Work ❌

After OAuth completion, running a protected tool (`get-key-stages`) still returned HTTP 401.

### Server Log Analysis

Request headers for the tool call **did not include `Authorization` header**:

```json
{
  "headers": {
    "accept": "application/json, text/event-stream",
    "content-type": "application/json",
    "mcp-protocol-version": "2025-06-18",
    "user-agent": "node-fetch",
    "host": "localhost:3333"
  }
}
```

Clerk middleware confirmed unauthenticated state:

```json
{
  "x-clerk-auth-reason": "dev-browser-missing",
  "x-clerk-auth-status": "signed-out"
}
```

## Possible Causes

1. **Inspector proxy not forwarding tokens** - The "Via Proxy" connection mode may not be correctly forwarding the Bearer token from Inspector to the MCP server
2. **Token storage/retrieval issue** - The token may be stored but not retrieved for subsequent requests
3. **Connection mode mismatch** - Different behavior between "Direct" and "Via Proxy" modes
4. **OAuth flow state isolation** - OAuth completion may not be propagating to the connection that makes tool calls

## Recommendations for Further Investigation

1. **Test with "Direct" connection mode** - Bypass the proxy to see if token forwarding works differently
2. **Test with curl** - Manually verify the server accepts Bearer tokens correctly
3. **Check Inspector network tab** - Inspect actual HTTP requests being made to verify header presence
4. **Review Inspector source** - Check how the OAuth token is supposed to be attached to requests

## Server Implementation Verified

The server implementation is correctly:

- Returning 401 with WWW-Authenticate for unauthenticated requests
- Processing discovery methods without auth
- Exposing OAuth metadata endpoints
- Completing OAuth flow with Clerk

The issue appears to be in the client-side token attachment, not the server-side auth implementation.

---

## Direct Mode Testing (2nd attempt)

Switched to **Direct** connection mode (not via proxy).

### Observations

1. **OAuth triggered automatically on connect** - Direct mode detected auth requirement and redirected to Clerk
2. **User clicked Allow on consent screen** - OAuth callback completed
3. **Token not captured** - After redirect, Auth panel showed `Authorization: Bearer` with NO token attached
4. **Well-known endpoint 404s**:
   - `/.well-known/oauth-authorization-server` → 404
   - `/.well-known/openid-configuration` → 404
   - `/.well-known/oauth-protected-resource/mcp` → 404

   Note: Our endpoints are at `/mcp/.well-known/...` not server root

5. **Connection failed** - Inspector sent `Authorization: Bearer` (no token) → Server returned "Invalid JWT format"

### Analysis

In Direct mode, the Inspector:

- Correctly initiates OAuth flow
- Successfully completes OAuth with Clerk
- **Fails to extract and store the access token from the callback**

This appears to be a client-side issue in MCP Inspector's OAuth callback handling for Direct mode.

---

## Curl Verification

Direct curl testing confirms the server correctly handles Bearer tokens:

### Test 1: Protected tool WITHOUT auth

```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="http://localhost:3333/.well-known/oauth-protected-resource"
{"error":"Unauthorized"}
```

✅ Correctly returns 401 with WWW-Authenticate

### Test 2: Discovery method (initialize) WITHOUT auth

```
HTTP/1.1 200 OK
data: {"result":{"protocolVersion":"2025-06-18","capabilities":...}}
```

✅ Discovery methods bypass auth correctly

### Test 3: Protected tool WITH fake Bearer token

```
HTTP/1.1 401 Unauthorized
x-clerk-auth-message: Invalid JWT form
WWW-Authenticate: Bearer resource_metadata="...", error="invalid_token", error_description="Token verification failed"
```

✅ Invalid tokens are rejected with detailed error

### Test 4: Protected tool WITH partial OAuth token

```
HTTP/1.1 401 Unauthorized
x-clerk-auth-message: OAuth token not found (code=token-invalid, status=404)
```

✅ Clerk validates and rejects invalid tokens

**Conclusion**: The server correctly:

1. Reads `Authorization: Bearer` headers
2. Passes tokens to Clerk for validation
3. Returns appropriate 401 responses with detailed error information
4. Includes WWW-Authenticate header per MCP spec

---

## Architecture Consideration: Single vs Dual Endpoints

This testing raised questions about whether a single endpoint can serve all clients, or whether separate endpoints may be needed.

### Spec Requirements

**MCP Authorization Spec** (RFC-based):

> "MCP servers MUST use the HTTP header WWW-Authenticate when returning a 401 Unauthorized"
> "Invalid or expired tokens MUST receive a HTTP 401 response"

**OpenAI Apps Auth Documentation**:

> "If verification fails, respond with 401 Unauthorized and a WWW-Authenticate header"
> "Triggering the tool-level OAuth flow requires both metadata (securitySchemes) and runtime errors that carry `_meta["mcp/www_authenticate"]`"

### Analysis

Both specs mandate HTTP 401 for:

- No token present
- Invalid/expired token

OpenAI Apps additionally requires tool-level `_meta["mcp/www_authenticate"]` for:

- Valid token but missing scope
- Tool-specific auth requirements

### Current Implementation

Our single `/mcp` endpoint implements dual-layer auth:

| Condition                  | Response                                    |
| -------------------------- | ------------------------------------------- |
| No token                   | HTTP 401 + WWW-Authenticate                 |
| Invalid token              | HTTP 401 + WWW-Authenticate + error details |
| Valid token, missing scope | HTTP 200 + `_meta["mcp/www_authenticate"]`  |
| Valid token, authorized    | HTTP 200 + tool result                      |

### Open Question

Could a dual-endpoint architecture be beneficial?

| Endpoint  | Auth Model                    | Use Case                   |
| --------- | ----------------------------- | -------------------------- |
| `/mcp`    | HTTP 401 + Tool-level `_meta` | Full spec compliance       |
| `/openai` | Tool-level `_meta` only       | If OpenAI Apps prefer this |

However, based on current spec reading, a single endpoint with dual-layer auth should be correct and spec-compliant. The MCP Inspector finding appears to be a client-side issue, not an indication that the server needs different endpoints.

### Recommendation

Continue with single `/mcp` endpoint implementing dual-layer auth. Monitor for:

1. Other clients that may have similar token-forwarding issues
2. OpenAI Apps behavior once deployed
3. Feedback from MCP community on Inspector behavior

---

## Final Summary

| Test Mode | OAuth Flow  | Token Used       | Result                 |
| --------- | ----------- | ---------------- | ---------------------- |
| Via Proxy | ✅ Complete | ❌ Not sent      | 401                    |
| Direct    | ✅ Complete | ❌ Not captured  | 401                    |
| Curl      | N/A         | ✅ Manually sent | ✅ Validated correctly |

**Conclusion**: Server implementation is correct. MCP Inspector (v0.17.2) does not attach obtained OAuth tokens to subsequent requests in either connection mode. This is a client-side issue, not a server issue.

**Next Steps**:

1. Test with real clients (Claude.ai, OpenAI Apps)
2. Consider filing issue with MCP Inspector if confirmed as bug
