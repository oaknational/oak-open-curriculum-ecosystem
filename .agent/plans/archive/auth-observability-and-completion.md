# MCP OAuth Implementation - Completion Plan

**Status**: ✅ COMPLETE  
**Date**: 2025-11-25  
**Completed**: 2025-11-25

---

## Executive Summary

We have implemented a **dual-layer authentication model** for MCP OAuth, as required by both the MCP Authorization Spec and OpenAI Apps Authentication documentation.

### Completed Work

1. **HTTP-level auth** (401 responses): Working correctly
2. **Tool-level auth** (`_meta` responses): Fixed by wiring `setRequestContext()` in `createMcpHandler`
3. **Integration tests**: Added `handlers.integration.test.ts` to verify request context propagation
4. **All quality gates pass**: type-check, lint, test (276 tests), test:e2e (89 tests), build

### Resolution

The tool-level auth bug was fixed by adding a single wrapper in `handlers.ts`:

```typescript
await setRequestContext(req, async () => {
  await transport.handleRequest(mcpRequest, res, req.body);
});
```

This propagates the Express request (with Clerk auth context) to tool handlers via AsyncLocalStorage, allowing `getRequestContext()` to work correctly in `checkMcpClientAuth`.

### ADR Coverage

ADR-052 and ADR-054 together document the dual-layer auth architecture:

- ADR-052: OAuth 2.1 for HTTP-level auth (401 responses)
- ADR-054: Tool-level auth error interception (`_meta` responses)

---

## The Dual-Layer Auth Model (Architectural Decision)

Both MCP spec and OpenAI Apps docs require TWO complementary auth mechanisms:

| Layer          | HTTP Status   | Purpose                  | When Used                              |
| -------------- | ------------- | ------------------------ | -------------------------------------- |
| **HTTP-level** | 401           | OAuth discovery trigger  | No token, expired token, invalid token |
| **Tool-level** | 200 + `_meta` | Per-tool scope signaling | Token valid but missing required scope |

### Spec References

**MCP Authorization Spec**:

> "MCP servers **MUST** use the HTTP header `WWW-Authenticate` when returning a _401 Unauthorized_"
> "Invalid or expired tokens **MUST** receive a HTTP 401 response"

**OpenAI Apps Auth Documentation**:

> "If verification fails, respond with `401 Unauthorized` and a `WWW-Authenticate` header"
> "Triggering the tool-level OAuth flow requires **both** metadata (`securitySchemes`) **and** runtime errors that carry `_meta["mcp/www_authenticate"]`"

### ADR Required

An ADR should document this dual-layer decision. Check if ADR-052 or ADR-054 cover this; if not, create a new ADR or update existing ones. The decision:

- HTTP 401 for initial auth challenges (no token, invalid token)
- Tool-level `_meta` for scope-specific issues after token is valid

---

## Current Implementation State

### ✅ HTTP-Level Auth (Working)

| Component           | Status      | Location                                       |
| ------------------- | ----------- | ---------------------------------------------- |
| `mcp-auth.ts`       | ✅ Restored | `src/auth/mcp-auth/mcp-auth.ts`                |
| `mcp-auth-clerk.ts` | ✅ Restored | `src/auth/mcp-auth/mcp-auth-clerk.ts`          |
| `mcp-router.ts`     | ✅ Restored | `src/mcp-router.ts`                            |
| `auth-routes.ts`    | ✅ Wired    | Uses `createMcpRouter({ auth: mcpAuthClerk })` |

**Behavior**:

- Discovery methods (`initialize`, `tools/list`): Skip auth, return HTTP 200
- Protected tools without token: Return HTTP 401 + WWW-Authenticate
- Protected tools with invalid token: Return HTTP 401 + WWW-Authenticate
- Public tools (`get-changelog`, etc.): Skip auth, return HTTP 200

### ✅ Tool-Level Auth (FIXED)

| Component                  | Status     | Notes                                                      |
| -------------------------- | ---------- | ---------------------------------------------------------- |
| `check-mcp-client-auth.ts` | ✅ Working | `getRequestContext()` now returns Express request          |
| `request-context.ts`       | ✅ Working | `setRequestContext()` called in `createMcpHandler`         |
| `handlers.ts`              | ✅ Updated | Wraps `transport.handleRequest` with `setRequestContext()` |

**Resolution**: The `setRequestContext()` wrapper in `handlers.ts` propagates the Express request to tool handlers via AsyncLocalStorage. This allows `checkMcpClientAuth` to access the request and validate tokens.

### DANGEROUSLY_DISABLE_AUTH Wiring

| Layer      | When `true`                | When `false`               | Tested? |
| ---------- | -------------------------- | -------------------------- | ------- |
| HTTP-level | Skips `mcpRouter` entirely | Uses `mcpAuthClerk`        | ✅ Yes  |
| Tool-level | Returns early (bypass)     | Uses `getRequestContext()` | ✅ Yes  |

**Important**: `DANGEROUSLY_DISABLE_AUTH=true` works for production fallback scenarios, bypassing both auth layers.

---

## Quality Gate Status

### All Gates Passing ✅

| Gate       | Status  | Count/Notes    |
| ---------- | ------- | -------------- |
| type-check | ✅ Pass | All workspaces |
| lint       | ✅ Pass | All workspaces |
| test       | ✅ Pass | 276 unit tests |
| test:e2e   | ✅ Pass | 89 E2E tests   |
| build      | ✅ Pass | All workspaces |

### Tests Added

| File                               | Purpose                                          |
| ---------------------------------- | ------------------------------------------------ |
| `src/handlers.integration.test.ts` | Verifies request context propagation to handlers |

---

## Completed Work

### Phase 1: Fixed Tool-Level Auth Bug ✅

**Solution**: Wired `setRequestContext()` in `createMcpHandler` to propagate Express request to tool handlers.

**Files modified**:

1. `src/handlers.ts` - Added import and wrapper for `setRequestContext()`

**Key change**:

```typescript
await setRequestContext(req, async () => {
  await transport.handleRequest(mcpRequest, res, req.body);
});
```

### Phase 2: Fixed Lint Issues ✅

Ran `pnpm lint -- --fix` to resolve trailing newline prettier errors.

### Phase 3: Added Integration Tests ✅

Created `src/handlers.integration.test.ts` to verify:

- Request context is propagated to tool handlers
- Tool execution works through the `setRequestContext` wrapper
- Public tools execute successfully

### Phase 4: All Quality Gates Pass ✅

Ran full gate sequence: `pnpm type-check && pnpm lint && pnpm test && pnpm test:e2e && pnpm build`

### ADR Coverage ✅

Dual-layer auth is documented by existing ADRs:

- ADR-052: OAuth 2.1 for HTTP-level auth
- ADR-054: Tool-level auth error interception

---

## Architecture Diagram

```
Request arrives
    ↓
clerkMiddleware (populates Clerk context for getAuth())
    ↓
mcpRouter (method-aware routing)
    ↓
    ├─ Discovery methods (initialize, tools/list)
    │  └─ Skip auth → MCP SDK → HTTP 200
    │
    ├─ Public tools (get-changelog, etc.)
    │  └─ Skip auth → MCP SDK → Tool handler → HTTP 200
    │
    └─ Protected tools (get-key-stages, etc.)
       └─ mcpAuthClerk
          ├─ No token? → HTTP 401 + WWW-Authenticate
          ├─ Invalid token? → HTTP 401 + WWW-Authenticate
          └─ Valid token? → MCP SDK
             └─ Tool handler (check scopes via extra.authInfo)
                ├─ Missing scope? → HTTP 200 + _meta["mcp/www_authenticate"]
                └─ All good? → Execute tool → HTTP 200

DANGEROUSLY_DISABLE_AUTH=true:
    └─ Skips mcpRouter entirely → MCP SDK → Tool handlers (no auth checks)
```

---

## Verification Checklist

All items verified:

- [x] `built-server.e2e.test.ts` passes
- [x] E2E: Discovery methods work without auth
- [x] E2E: Public tools work without auth
- [x] E2E: Protected tools return 401 without token
- [x] E2E: Protected tools return 401 with invalid token
- [x] Integration: Request context propagates to tool handlers
- [x] E2E: WWW-Authenticate header contains resource_metadata URL
- [x] `DANGEROUSLY_DISABLE_AUTH=true` bypasses all auth
- [x] All quality gates pass (`type-check`, `lint`, `test`, `test:e2e`, `build`)
- [x] ADR for dual-layer auth decision exists (ADR-052 + ADR-054)

---

## Key Files Reference

### HTTP-Level Auth (Working)

| File                                  | Purpose                                          |
| ------------------------------------- | ------------------------------------------------ |
| `src/mcp-router.ts`                   | Method-aware routing, conditionally applies auth |
| `src/auth/mcp-auth/mcp-auth.ts`       | Core HTTP 401 middleware                         |
| `src/auth/mcp-auth/mcp-auth-clerk.ts` | Clerk integration wrapper                        |
| `src/auth-routes.ts`                  | Wires router and auth into Express app           |

### Tool-Level Auth (FIXED)

| File                            | Purpose                                  | Status     |
| ------------------------------- | ---------------------------------------- | ---------- |
| `src/handlers.ts`               | Wraps transport with `setRequestContext` | ✅ Updated |
| `src/tool-handler-with-auth.ts` | Intercepts auth errors in tool execution | ✅ Working |
| `src/check-mcp-client-auth.ts`  | MCP client auth checking                 | ✅ Working |
| `src/request-context.ts`        | AsyncLocalStorage context                | ✅ Working |

### Tests

| File                                        | Purpose                            |
| ------------------------------------------- | ---------------------------------- |
| `e2e-tests/auth-enforcement.e2e.test.ts`    | E2E tests for HTTP 401 behavior    |
| `e2e-tests/application-routing.e2e.test.ts` | E2E tests for method-aware routing |
| `e2e-tests/built-server.e2e.test.ts`        | Production build verification      |

---

## Specification References

- [MCP Authorization Spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)
- [OpenAI Apps Authentication](https://platform.openai.com/docs/guides/apps-authentication)
- Local copies: `.agent/reference-docs/mcp-auth-spec.md`, `.agent/reference-docs/openai-apps-auth.md`

## Directive References

- [Rules](../directives-and-memory/rules.md) - TDD, no type shortcuts, fail fast
- [Testing Strategy](../directives-and-memory/testing-strategy.md) - TDD at all levels
- [Schema-First Execution](../directives-and-memory/schema-first-execution.md) - Generated artifacts drive runtime

## Archived Implementation

- `.agent/reference-docs/replaced-http-auth-model/` - Previously removed HTTP auth code (now restored)
