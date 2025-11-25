# MCP OAuth Implementation Status & Solution

**Status**: ✅ ROOT CAUSE IDENTIFIED - Ready for Implementation  
**Date**: 2025-11-25  
**Root Cause**: Tool callbacks ignore SDK's `extra` parameter containing auth context

---

## Executive Summary

The OAuth flow works correctly. Tool execution fails because we don't use the authentication context that the MCP SDK already provides. The fix is simple: accept the `extra` parameter in tool callbacks.

**No AsyncLocalStorage is needed.** The MCP SDK passes authentication context directly to tool callbacks.

---

## Root Cause Analysis

### The Actual Problem

Our tool callback signature is:

```typescript
// Current (broken)
server.registerTool(tool.name, config, async (params: unknown) => {
  return handleToolWithAuthInterception(tool, params, ...);
});
```

But the SDK provides TWO parameters:

```typescript
// SDK calls with
callback(params, extra); // <-- extra contains authInfo and requestInfo
```

We ignore `extra`, then try to retrieve request context via `getRequestContext()` which returns `undefined` because `setRequestContext()` is never called in production code.

### What the SDK Provides

From `@modelcontextprotocol/sdk`, the `extra` parameter contains:

```typescript
interface RequestHandlerExtra {
  authInfo?: AuthInfo;              // Token info from req.auth
  requestInfo?: { headers: ... };   // HTTP headers including Authorization
  signal: AbortSignal;              // Request cancellation
  sessionId?: string;               // MCP session
  // ... other fields
}
```

The SDK's `StreamableHTTPServerTransport`:

1. Reads `req.auth` from Express request (set by Clerk middleware)
2. Captures `req.headers` into `requestInfo`
3. Passes both to tool callbacks via `extra`

### Why Tests Passed But Implementation Failed

Tests mocked `getRequestContext()` to return a mock request. This verified that **IF** context was available, auth would work. But tests never verified:

1. `setRequestContext()` was called in production
2. The actual request flow worked end-to-end

This is a TDD violation: we tested implementation details (mock context returns mock request) instead of behaviour (tool receives auth from HTTP request).

---

## The Solution

### What Needs to Change

| Component                        | Current                     | Needed                         |
| -------------------------------- | --------------------------- | ------------------------------ |
| Tool callback                    | `async (params) => ...`     | `async (params, extra) => ...` |
| `handleToolWithAuthInterception` | Uses `getRequestContext()`  | Accept `extra` parameter       |
| `checkMcpClientAuth`             | Calls `getRequestContext()` | Accept headers/token directly  |
| `request-context.ts`             | Exists but never used       | **DELETE**                     |
| AsyncLocalStorage                | Never used                  | **DELETE**                     |

### Implementation Approach

1. **Accept `extra` in tool callback**:

   ```typescript
   server.registerTool(tool.name, config, async (params: unknown, extra) => {
     return handleToolWithAuthInterception(tool, params, extra, deps, ...);
   });
   ```

2. **Extract auth from `extra`** in `checkMcpClientAuth`:

   ```typescript
   // Get Authorization header from extra.requestInfo
   const authHeader = extra.requestInfo?.headers?.authorization;
   if (!authHeader?.startsWith('Bearer ')) {
     return createAuthErrorResponse(...);
   }
   const token = authHeader.substring('Bearer '.length);
   ```

3. **Verify with Clerk** using existing pure functions:

   ```typescript
   const verified = verifyClerkToken(..., token);
   ```

4. **Delete unused files**:
   - `request-context.ts` (AsyncLocalStorage - not needed)
   - Any code that calls `getRequestContext()` or `setRequestContext()`

---

## Auth Architecture: Two Separate Concerns

### MCP Client Auth (ChatGPT → Our Server)

- **What**: OAuth token from MCP client (ChatGPT, MCP Inspector)
- **Where**: Checked in tool handler via `extra.requestInfo.headers.authorization`
- **Error response**: HTTP 200 with `_meta["mcp/www_authenticate"]`
- **Triggers**: ChatGPT "Connect" button

### Upstream API Auth (Our Server → Oak API)

- **What**: API key for Oak Curriculum API (ADR-054)
- **Where**: Intercepted in `executeMcpTool` callback
- **Error response**: HTTP 200 with `_meta["mcp/www_authenticate"]`
- **Triggers**: ChatGPT re-auth if upstream rejects token

These are **separate auth flows** and both return tool-level errors (HTTP 200 + `_meta`).

---

## MCP Spec vs OpenAI Apps Compatibility

### Question: Are the two specs compatible?

**Yes - they address different scenarios:**

| Aspect       | MCP Spec                                   | OpenAI Apps                                |
| ------------ | ------------------------------------------ | ------------------------------------------ |
| Auth model   | HTTP 401 + WWW-Authenticate                | HTTP 200 + `_meta["mcp/www_authenticate"]` |
| Use case     | Blanket server auth (all requests blocked) | Per-tool auth decisions                    |
| Discovery    | May block if auth required first           | Always works without auth                  |
| Our use case | ❌ (we have mixed tool security)           | ✅ (supports public + protected tools)     |

### Why Tool-Level Auth is Correct for Us

We have tools with mixed security requirements:

- `get-changelog`, `get-rate-limit`: `noauth` (public)
- `get-lessons`, `search`, etc.: `oauth2` (protected)

Tool-level auth allows:

- Discovery (`tools/list`, `initialize`): Works without auth
- Public tools: Work without auth
- Protected tools: Return `_meta` error, triggering OAuth

HTTP 401 at middleware level would require auth for ALL requests, breaking public tools.

---

## Multi-Client Support

### Client Compatibility

| Client             | Understands `_meta`? | OAuth Support    | Experience                   |
| ------------------ | -------------------- | ---------------- | ---------------------------- |
| ChatGPT (Apps SDK) | ✅ Yes               | ✅ Built-in      | "Connect" button appears     |
| MCP Inspector      | Likely               | ✅ Auth Settings | Can configure OAuth manually |
| Cursor             | Unknown              | Via settings     | Clear error message          |
| Other MCP Clients  | Varies               | Varies           | Clear error message          |

### Single Entry Point (`/mcp`)

All clients use the same `/mcp` endpoint. No need for separate endpoints because:

1. **Discovery works universally**: `initialize`, `tools/list` require no auth
2. **Error messages are clear**: "You need to login to continue"
3. **Sophisticated clients understand `_meta`**: ChatGPT, likely MCP Inspector
4. **Unsophisticated clients get actionable errors**: Can manually configure tokens

The only trade-off: clients that don't understand `_meta` won't see automatic OAuth prompts, but they'll see clear error messages and can authenticate manually if their client supports it.

---

## Implementation Plan

### Phase 1: Verification (First)

1. Write minimal test that registers tool logging `extra` parameter
2. Send HTTP request with Bearer token
3. Confirm `extra.requestInfo.headers.authorization` contains the token
4. Confirm `extra.authInfo` contains Clerk auth context (if middleware populates it)

### Phase 2: Implementation

1. **Update `handlers.ts`**: Accept `extra` in tool callback
2. **Update `handleToolWithAuthInterception`**: Accept and use `extra`
3. **Update `checkMcpClientAuth`**: Use headers from `extra.requestInfo`
4. **Delete `request-context.ts`**: Not needed
5. **Remove AsyncLocalStorage imports**: Clean up

### Phase 3: Testing

1. **Unit tests**: Pure functions (already exist, should still pass)
2. **Integration tests**: Verify real request flow
3. **E2E tests**: MCP Inspector with OAuth flow

### Phase 4: Validation

1. Test with MCP Inspector (OAuth flow)
2. Test discovery methods without auth
3. Test public tools without auth
4. Test protected tools with/without valid token

---

## Files to Modify

### Modify

- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` - Accept `extra` parameter
- `apps/oak-curriculum-mcp-streamable-http/src/tool-handler-with-auth.ts` - Use `extra`
- `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.ts` - Use headers from `extra`

### Delete

- `apps/oak-curriculum-mcp-streamable-http/src/request-context.ts` - Not needed
- `apps/oak-curriculum-mcp-streamable-http/src/request-context.unit.test.ts` - Not needed

### Keep Unchanged

- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.ts` - Pure function, works
- `apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts` - Pure function, works
- OAuth metadata endpoints - Work correctly

---

## Verified Facts

| Fact                                   | Status       | Evidence                                |
| -------------------------------------- | ------------ | --------------------------------------- |
| OAuth flow works                       | ✅ Confirmed | Authorization + token exchange complete |
| Bearer token reaches server            | ✅ Confirmed | Visible as `[REDACTED]` in logs         |
| `setRequestContext()` never called     | ✅ Confirmed | Grep shows only test usage              |
| SDK provides `extra.authInfo`          | ✅ Confirmed | SDK source code inspection              |
| SDK provides `extra.requestInfo`       | ✅ Confirmed | SDK source code inspection              |
| Tool callbacks ignore `extra`          | ✅ Confirmed | Code inspection                         |
| `clerkMiddleware` populates `req.auth` | ✅ Confirmed | Standard Clerk behaviour                |
| SDK reads `req.auth` as `authInfo`     | ✅ Confirmed | `streamableHttp.js` source              |

---

## Key Learnings

### What Went Right

1. OAuth flow implementation works perfectly
2. Pure functions (token verification, validation) are solid
3. Security metadata generation (securitySchemes) works
4. ADR-054 error interception works for upstream API errors

### What Went Wrong

1. **Ignored SDK's built-in mechanism**: `extra` parameter provides what we need
2. **Created unnecessary complexity**: AsyncLocalStorage when SDK provides context
3. **Tests passed but didn't catch issue**: Mocked what we should have verified
4. **Assumed problem location**: Thought AsyncLocalStorage failed when it was never used

### How to Do Better

1. **Read SDK documentation/source first**: The mechanism was there all along
2. **Test real flows, not mocks**: Integration tests should use real request paths
3. **Simpler first**: SDK provides context passing; don't build parallel mechanism
4. **Verify assumptions immediately**: Small test before building on assumptions

---

## Related Documentation

### Internal

- [ADR-054: Tool-Level Auth Error Interception](../../docs/architecture/architectural-decisions/054-tool-level-auth-error-interception.md)
- [Testing Strategy](../directives-and-memory/testing-strategy.md)
- [Schema-First Execution](../directives-and-memory/schema-first-execution.md)

### External

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Authorization Spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)
- [OpenAI Apps Authentication](https://platform.openai.com/docs/guides/apps-authentication)
