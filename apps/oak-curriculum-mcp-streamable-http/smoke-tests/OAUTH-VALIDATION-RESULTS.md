# OAuth Proxy Removal - Validation Results

## Summary

✅ **All curl tests PASSED** - The OAuth discovery chain works correctly without the proxy endpoint.

## Test Results

### Test 1: Proxy Endpoint Removed (✅ PASS)

```bash
curl -i http://localhost:3333/.well-known/oauth-authorization-server
```

**Result**: `HTTP/1.1 404 Not Found`

✅ **Proves**: The unnecessary proxy endpoint has been successfully removed.

---

### Test 2: Protected Resource Metadata Works (✅ PASS)

```bash
curl -s http://localhost:3333/.well-known/oauth-protected-resource | jq .
```

**Result**: `HTTP/1.1 200 OK`

```json
{
  "resource": "http://localhost:3333/",
  "authorization_servers": [
    "https://REDACTED.clerk.accounts.dev"
  ],
  "token_types_supported": [
    "urn:ietf:params:oauth:token-type:access_token"
  ],
  "scopes_supported": [
    "mcp:invoke",
    "mcp:read"
  ],
  ...
}
```

✅ **Proves**: Our server correctly advertises the Clerk authorization server URL per RFC 9728.

---

### Test 3: Clerk AS Metadata Directly Accessible (✅ PASS)

```bash
curl -s https://REDACTED.clerk.accounts.dev/.well-known/oauth-authorization-server | jq .
```

**Result**: `HTTP/1.1 200 OK`

```json
{
  "issuer": "https://REDACTED.clerk.accounts.dev",
  "authorization_endpoint": "https://REDACTED.clerk.accounts.dev/oauth/authorize",
  "token_endpoint": "https://REDACTED.clerk.accounts.dev/oauth/token",
  "jwks_uri": "https://REDACTED.clerk.accounts.dev/.well-known/jwks.json",
  ...
}
```

✅ **Proves**: MCP clients can fetch authorization server metadata directly from Clerk. **No proxy needed!**

---

### Test 4: OAuth Metadata Accessible (✅ PASS)

```bash
curl -I http://localhost:3333/.well-known/oauth-protected-resource
```

**Result**: `HTTP/1.1 200 OK`

✅ **Proves**: OAuth metadata endpoint is publicly accessible without authentication.

**Note**: We previously added no-cache headers without evidence or RFC requirement. Removed in favor of standard HTTP caching semantics. RFC 9728 and RFC 9470 have no caching requirements. Error responses still use no-cache (see README.md for documented rationale).

---

## MCP Inspector (UI) Validation

```bash
# Terminal 1 (auth enabled, stub tools)
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev:auth:stub

# Terminal 2 (launch Inspector UI)
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http inspect:oauth
```

✅ **Expected behaviour**: the Inspector can complete OAuth (browser interaction) and then call a protected tool successfully (for example `get-key-stages`), without requiring live Oak API calls.

---

## Server Logs Verification

The server logs confirm correct OAuth flow:

1. ✅ Inspector makes unauthenticated request → Server responds with 401
2. ✅ `WWW-Authenticate` header includes `resource_metadata=http://localhost:3333/.well-known/oauth-protected-resource`
3. ✅ curl fetches protected resource metadata → Server responds with 200
4. ✅ Protected resource metadata includes Clerk AS URL
5. ✅ curl fetches proxy endpoint → Server responds with 404 (removed!)
6. ✅ curl fetches Clerk AS metadata directly → Clerk responds with 200

---

## Conclusion

🎉 **All validation tests PASSED**

The OAuth discovery chain works correctly without the Authorization Server Metadata proxy:

1. ✅ Resource server advertises Clerk AS URL via protected resource metadata
2. ✅ Clerk AS metadata is directly accessible (no proxy)
3. ✅ Proxy endpoint correctly returns 404 (removed)
4. ✅ OAuth enforcement works (401 challenges)
5. ✅ OAuth metadata endpoint publicly accessible

**The proxy endpoint was unnecessary and has been successfully removed.**

---

## Related Documentation

- Implementation Plan: `.agent/plans/archive/completed/remove-oauth-proxy-endpoint.md`
- E2E Tests: `e2e-tests/auth-enforcement.e2e.test.ts`
- MCP Spec: <https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization>
- RFC 9728 (Protected Resource Metadata): <https://datatracker.ietf.org/doc/html/rfc9728>
- RFC 8414 (AS Metadata): <https://datatracker.ietf.org/doc/html/rfc8414>

---

**Last Validated**: 2025-11-16
**Server**: oak-curriculum-mcp-streamable-http
**Clerk Instance**: REDACTED.clerk.accounts.dev
