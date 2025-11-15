# Analysis: @clerk/mcp-tools Bug Chain and Independence Options

## Executive Summary

The bug is in `getPRMUrl()` which incorrectly appends `req.originalUrl` to the OAuth metadata path. This causes the WWW-Authenticate header to point to `/.well-known/oauth-protected-resource/mcp` instead of `/.well-known/oauth-protected-resource`.

To avoid relying on this broken code, we have two options:

1. **Minimal Fix**: Bring in ~100 lines (just the auth middleware)
2. **Full Independence**: Bring in ~200 lines (all handlers and helpers)

---

## The Bug

**Location**: `reference/clerk-mcp-tools/express/index.ts`, lines 205-209

```typescript
function getPRMUrl(req: express.Request) {
  return `${req.protocol}://${req.get(
    'host',
  )}/.well-known/oauth-protected-resource${req.originalUrl}`;
  // ❌ BUG: Appends req.originalUrl
  // With req.originalUrl = "/mcp", this generates:
  // /.well-known/oauth-protected-resource/mcp
  // Should be:
  // /.well-known/oauth-protected-resource
}
```

**Correct Implementation**:

```typescript
function getPRMUrl(req: express.Request) {
  return `${req.protocol}://${req.get('host')}/.well-known/oauth-protected-resource`;
  // ✅ No req.originalUrl appended
}
```

---

## Function Call Chain Leading to Bug

```text
User Request: POST /mcp (no auth header)
    ↓
1. Express routes to: mcpAuthClerk middleware
    ↓
2. mcpAuthClerk() calls: mcpAuth(verifyClerkToken)
    ↓
3. mcpAuth() checks for auth header
    ↓
4. No auth header found, calls: getPRMUrl(req)  ⚠️ BUG HERE
    ↓
5. Returns 401 with WWW-Authenticate header pointing to broken URL
```

### Detailed Chain

**Step 1**: `mcpAuthClerk` (lines 94-108)

```typescript
export async function mcpAuthClerk(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  (
    await mcpAuth(async (token, req: express.Request) => {
      const authData = await getAuth(req, { acceptsToken: 'oauth_token' });
      if (!authData.isAuthenticated) return undefined;
      return verifyClerkToken(authData, token);
    })
  )(req, res, next);
}
```

**Step 2**: `mcpAuth` (lines 34-78)

```typescript
export async function mcpAuth(
  verifyToken: (token: string, req: express.Request) => Promise<AuthInfo | undefined>,
) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const prmUrl = getPRMUrl(req); // ⚠️ CALLS BUGGY FUNCTION

    if (!req.headers.authorization) {
      return res
        .status(401)
        .set({
          'WWW-Authenticate': `Bearer resource_metadata=${prmUrl}`, // ⚠️ USES BUGGY URL
        })
        .send({ error: 'Unauthorized' });
    }
    // ... token verification ...
  };
}
```

**Step 3**: `getPRMUrl` - **THE BUG** (lines 205-209)

```typescript
function getPRMUrl(req: express.Request) {
  return `${req.protocol}://${req.get(
    'host',
  )}/.well-known/oauth-protected-resource${req.originalUrl}`;
  // ❌ req.originalUrl = "/mcp" → generates broken URL
}
```

---

## What We Currently Use from @clerk/mcp-tools

### From `@clerk/mcp-tools/express`:

1. **`mcpAuthClerk`** - Used on `/mcp` routes for auth enforcement
   - **Where**: `auth-routes.ts:201`
   - **Purpose**: Middleware that enforces OAuth authentication on MCP endpoints
   - **Dependencies**: `mcpAuth()`, `getPRMUrl()` ⚠️, `verifyClerkToken()`, `getAuth()` from `@clerk/express`

2. **`protectedResourceHandlerClerk`** - OAuth Protected Resource Metadata endpoint
   - **Where**: `auth-routes.ts:81` (wrapped with no-cache)
   - **Purpose**: Returns RFC 9470 compliant metadata at `/.well-known/oauth-protected-resource`
   - **Dependencies**: `generateClerkProtectedResourceMetadata()`, `getResourceUrl()`, `CLERK_PUBLISHABLE_KEY`

3. **`authServerMetadataHandlerClerk`** - OAuth Authorization Server Metadata endpoint
   - **Where**: `auth-routes.ts:89, 92, 95` (wrapped with no-cache)
   - **Purpose**: Returns RFC 8414 compliant metadata at `/.well-known/oauth-authorization-server`
   - **Dependencies**: `fetchClerkAuthorizationServerMetadata()`, `CLERK_PUBLISHABLE_KEY`

---

## Dependency Tree

### mcpAuthClerk

```text
mcpAuthClerk (express/index.ts:94-108)
├── mcpAuth() (express/index.ts:34-78) ⚠️ Contains bug
│   ├── getPRMUrl() (express/index.ts:205-209) ❌ THE BUG
│   └── verifyToken callback (provided by mcpAuthClerk)
│       ├── getAuth() from @clerk/express (external)
│       └── verifyClerkToken() (server.ts:103-142)
│           └── MachineAuthObject type from @clerk/backend
└── AuthInfo type from @modelcontextprotocol/sdk (external)
```

### protectedResourceHandlerClerk

```text
protectedResourceHandlerClerk (express/index.ts:173-190)
├── generateClerkProtectedResourceMetadata() (server.ts:55-74)
│   ├── deriveFapiUrl() (server.ts:76-80)
│   └── generateProtectedResourceMetadata() (server.ts:13-44)
├── getResourceUrl() (express/index.ts:194-200)
└── CLERK_PUBLISHABLE_KEY env var
```

### authServerMetadataHandlerClerk

```text
authServerMetadataHandlerClerk (express/index.ts:146-160)
├── fetchClerkAuthorizationServerMetadata() (server.ts:82-94)
│   └── deriveFapiUrl() (server.ts:76-80)
└── CLERK_PUBLISHABLE_KEY env var
```

---

## Option 1: Minimal Fix (Just Fix the Bug)

**Goal**: Only bring in the auth middleware with the bug fixed.

### What to bring in-house:

1. `mcpAuth()` function (~45 lines, express/index.ts:34-78)
2. `getPRMUrl()` function **WITH FIX** (~5 lines, express/index.ts:205-209)
3. Create our own `mcpAuthClerkFixed` that uses the fixed version (~15 lines)

### Total code: ~65 lines

### Dependencies that remain:

- `@clerk/express` (for `getAuth()`) ✅ Already have
- `@clerk/mcp-tools/server` (for `verifyClerkToken()`) ⚠️ Still depends on Clerk package
- `@clerk/backend` (for types) ✅ Already have
- `@modelcontextprotocol/sdk` ✅ Already have
- Keep using `protectedResourceHandlerClerk` ✅ No bug there
- Keep using `authServerMetadataHandlerClerk` ✅ No bug there

### Implementation:

```typescript
// src/auth/fixed-mcp-auth.ts

/**
 * FIXED version of getPRMUrl from @clerk/mcp-tools
 * Bug in original: incorrectly appends req.originalUrl
 */
function getPRMUrlFixed(req: express.Request): string {
  return `${req.protocol}://${req.get('host')}/.well-known/oauth-protected-resource`;
  // ✅ No req.originalUrl - always returns canonical URL
}

/**
 * FIXED version of mcpAuth from @clerk/mcp-tools
 * Uses getPRMUrlFixed instead of buggy getPRMUrl
 */
export async function mcpAuthFixed(
  verifyToken: (token: string, req: express.Request) => Promise<AuthInfo | undefined>,
) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const prmUrl = getPRMUrlFixed(req); // ✅ Use fixed version

    if (!req.headers.authorization) {
      return res
        .status(401)
        .set({ 'WWW-Authenticate': `Bearer resource_metadata=${prmUrl}` })
        .send({ error: 'Unauthorized' });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new Error(
        `Invalid authorization header value, expected Bearer <token>, received ${authHeader}`,
      );
    }

    const authData = await verifyToken(token, req);

    if (!authData) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // @ts-expect-error - monkey patching auth onto request
    req.auth = authData;

    next();
  };
}

/**
 * FIXED version of mcpAuthClerk
 * Uses mcpAuthFixed instead of buggy mcpAuth
 */
export async function mcpAuthClerkFixed(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  (
    await mcpAuthFixed(async (token, req: express.Request) => {
      const authData = await getAuth(req, { acceptsToken: 'oauth_token' });
      if (!authData.isAuthenticated) return undefined;
      return verifyClerkToken(authData, token);
    })
  )(req, res, next);
}
```

### Changes needed:

- Import from `@clerk/mcp-tools/server` (for `verifyClerkToken`)
- Import from `@clerk/express` (for `getAuth`)
- Import our `mcpAuthClerkFixed` instead of `mcpAuthClerk`
- Still use `protectedResourceHandlerClerk` and `authServerMetadataHandlerClerk`

---

## Option 2: Full Independence

**Goal**: Remove all dependencies on `@clerk/mcp-tools` package.

### What to bring in-house:

1. `mcpAuth()` + fixed `getPRMUrl()` (~50 lines)
2. `mcpAuthClerk` wrapper (~15 lines)
3. `verifyClerkToken()` (~40 lines, server.ts:103-142)
4. `generateClerkProtectedResourceMetadata()` (~20 lines, server.ts:55-74)
5. `generateProtectedResourceMetadata()` (~35 lines, server.ts:13-44)
6. `fetchClerkAuthorizationServerMetadata()` (~15 lines, server.ts:82-94)
7. `deriveFapiUrl()` helper (~5 lines, server.ts:76-80)
8. `protectedResourceHandlerClerk` wrapper (~15 lines)
9. `authServerMetadataHandlerClerk` wrapper (~15 lines)

### Total code: ~210 lines

### Dependencies that remain:

- `@clerk/express` (for `getAuth()`) ✅ Core Clerk SDK, well-maintained
- `@clerk/backend` (for types) ✅ Core Clerk SDK
- `@modelcontextprotocol/sdk` ✅ Already have

### Benefits:

- ✅ Zero dependency on `@clerk/mcp-tools`
- ✅ Full control over auth flow
- ✅ Can add custom logging, instrumentation
- ✅ No future surprises from upstream bugs
- ✅ Easier to test and mock

### Drawbacks:

- ❌ ~210 lines of code to maintain
- ❌ Need to track OAuth spec changes ourselves
- ❌ Miss out on upstream improvements
- ❌ More code to review and understand

---

## Recommendation

### Short-term (NOW): Option 1 (Minimal Fix)

- **Why**: Quick fix, minimal code duplication (~65 lines)
- **Effort**: 1-2 hours
- **Risk**: Low (small surface area)
- **Benefit**: Fixes the bug immediately

### Long-term (CONSIDER): Option 2 (Full Independence)

- **When**: If we find more bugs or need customization
- **Why**: Full control, no surprises
- **Effort**: 4-6 hours (includes tests, docs)
- **Risk**: Medium (more code to maintain)
- **Benefit**: Complete independence from buggy package

---

## Impact of Bug on Our System

### Current State (with workaround removed):

1. ✅ OAuth metadata endpoints work (moved before clerkMiddleware)
2. ⚠️ WWW-Authenticate header points to **broken URL** (has `/mcp` suffix)
3. ⚠️ Clients following RFC 8693 will try to fetch metadata from broken URL
4. ❌ Broken URL returns 404 (we removed the workaround)

### If we implement Option 1:

1. ✅ OAuth metadata endpoints work
2. ✅ WWW-Authenticate header points to **correct URL**
3. ✅ Clients can fetch metadata from canonical path
4. ✅ Full RFC compliance

---

## External Dependencies (Would Remain Even with Full Independence)

### Required for Clerk Integration:

- `@clerk/express` - Core Clerk Express SDK
  - **Why needed**: Provides `getAuth()` for extracting auth context
  - **Status**: Well-maintained, core Clerk package
  - **Alternative**: None (unless we switch auth providers)

- `@clerk/backend` - Clerk backend types
  - **Why needed**: TypeScript types for `MachineAuthObject`
  - **Status**: Well-maintained, core Clerk package
  - **Alternative**: Could define our own types (but would diverge)

### Required for MCP:

- `@modelcontextprotocol/sdk` - MCP Protocol SDK
  - **Why needed**: Core MCP types and transport
  - **Status**: Required for MCP implementation
  - **Alternative**: None (this IS the protocol)

---

## Testing Strategy (If We Bring Code In-House)

### Unit Tests Needed:

1. `getPRMUrlFixed()` - Verify correct URL generation (no suffix)
2. `mcpAuthFixed()` - Test 401 response with correct WWW-Authenticate header
3. `mcpAuthClerkFixed()` - Integration with Clerk auth context

### Integration Tests Needed:

1. Full auth flow with fixed middleware
2. WWW-Authenticate header validation (ensure no `/mcp` suffix)
3. Metadata endpoint discovery flow

### Regression Tests:

1. Ensure existing tests still pass
2. Add test specifically for the bug (URL must not have suffix)

---

## Code Locations Reference

### In @clerk/mcp-tools repo (reference/clerk-mcp-tools/):

**express/index.ts**:

- Line 34-78: `mcpAuth()` - Generic auth middleware
- Line 94-108: `mcpAuthClerk()` - Clerk-specific wrapper
- Line 173-190: `protectedResourceHandlerClerk()` - RFC 9470 metadata
- Line 146-160: `authServerMetadataHandlerClerk()` - RFC 8414 metadata
- Line 194-200: `getResourceUrl()` - Helper for resource URL
- Line 205-209: `getPRMUrl()` - **THE BUG** ❌

**server.ts**:

- Line 13-44: `generateProtectedResourceMetadata()` - Generic metadata
- Line 55-74: `generateClerkProtectedResourceMetadata()` - Clerk-specific
- Line 76-80: `deriveFapiUrl()` - Parse publishable key
- Line 82-94: `fetchClerkAuthorizationServerMetadata()` - Fetch from Clerk
- Line 103-142: `verifyClerkToken()` - Token verification

### In our codebase:

**apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts**:

- Line 5-8: Imports from `@clerk/mcp-tools/express`
- Line 81: Usage of `protectedResourceHandlerClerk`
- Line 89, 92, 95: Usage of `authServerMetadataHandlerClerk`
- Line 201: Usage of `mcpAuthClerk` (wrapped with instrumentation)

---

## Conclusion

The bug is a simple string concatenation error in `getPRMUrl()` that appends the wrong path. We can fix it with minimal code (~65 lines) or go fully independent (~210 lines).

**Recommended approach**: Start with Option 1 (Minimal Fix) to unblock immediately, then evaluate Option 2 (Full Independence) if we encounter more issues or need deeper customization.

The bug affects RFC compliance but is easily fixable. The root cause is the library assuming all MCP handlers are at the root path, not considering that they might be mounted at `/mcp` or other paths.
