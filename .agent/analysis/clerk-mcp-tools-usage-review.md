# @clerk/mcp-tools Usage Review

**Date:** 2024-11-16  
**Status:** Critical Decision Point  
**Question:** Should we remove @clerk/mcp-tools or use it as intended?

---

## Executive Summary

**@clerk/mcp-tools itself documents that the authorization server metadata proxy is:**

1. "Not yet fully implemented"
2. For an "older version of the MCP spec" (2025-03-26)
3. "Should not be necessary" when using Clerk
4. Only needed for "outdated implementations"

**Recommendation:** Remove the dependency AND the proxy endpoint. Create a smoke test to validate the decision.

---

## What @clerk/mcp-tools Actually Says

From `README.md` lines 77-82:

> #### Authorization server metadata
>
> **NOTE:** This is not yet fully implemented
>
> There is [an older version of the MCP spec](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization#2-5-authorization-flow-steps) that specified that the MCP server should be responsible for authentication on its own and instead it should implement a different static metadata file called "authorization server metadata", defined by [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414). **While it should not be necessary as long as you have implemented protected resource metadata and are using an authorization service that has properly implemented a authorization server metadata route**, there are some scenarios where this might be necessary if you are building your own authorization server, if your authorization server is part of your app directly, or **if you are interfacing with a client that has an outdated implementation**. This library also provides utilities for this use case.

## Key Insights

### 1. The Package Itself Warns Against This

**Direct quote:** "should not be necessary"

The library maintainers acknowledge this is a compatibility workaround, not the correct architecture.

### 2. It's For An Older Spec

**Old spec:** 2025-03-26  
**Current spec:** 2025-06-18 (the one we're following)

The current MCP spec (which we have attached) explicitly shows clients fetching AS metadata directly from the authorization server, not from the resource server.

### 3. Clerk Already Has The Endpoint

Clerk implements RFC 8414 properly at:

```
https://{clerk-fapi-url}/.well-known/oauth-authorization-server
```

We don't need to proxy it because it already exists.

### 4. Only Three Reasons To Use It

Per the README, you only need `authServerMetadataHandlerClerk` if:

| Scenario                                 | Applies to us?            |
| ---------------------------------------- | ------------------------- |
| Building your own authorization server   | ❌ No - Clerk is our AS   |
| Authorization server is part of your app | ❌ No - Clerk is separate |
| Interfacing with outdated clients        | ❓ Need to verify         |

---

## What We're Currently Using From @clerk/mcp-tools

### From Express Package

```typescript
import {
  protectedResourceHandlerClerk, // ✅ CORRECT - we need this
  authServerMetadataHandlerClerk, // ❌ QUESTIONABLE - proxy for old spec
} from '@clerk/mcp-tools/express';
```

### Usage Analysis

**`protectedResourceHandlerClerk`** - **KEEP THIS** ✅

- Generates RFC 9728 protected resource metadata
- Tells clients where authorization server is (Clerk)
- This is our responsibility as the resource server
- **This is correct per current MCP spec**

**`authServerMetadataHandlerClerk`** - **REMOVE THIS** ❌

- Proxies Clerk's RFC 8414 authorization server metadata
- For older MCP spec (2025-03-26)
- Package itself says "not yet fully implemented"
- Package itself says "should not be necessary"
- **This is NOT needed per current MCP spec**

---

## The Decision Matrix

### Option 1: Remove @clerk/mcp-tools Entirely ❌

**Don't do this** - we're using `protectedResourceHandlerClerk` correctly and it provides value.

### Option 2: Keep Using It As-Is ❌

**Don't do this** - we're using the part the package itself warns against.

### Option 3: Use It As Intended ✅ **RECOMMENDED**

**Do this:**

1. Keep using `protectedResourceHandlerClerk` (correct)
2. Remove `authServerMetadataHandlerClerk` (deprecated/unnecessary)
3. Implement the removed functionality ourselves IF needed (after testing)
4. Keep the dependency for the correct usage

---

## Recommended Approach

### Phase 1: Validate Assumption (Smoke Test)

Create smoke test that proves clients can fetch AS metadata directly from Clerk:

```typescript
// smoke-tests/smoke-oauth-discovery-spec-compliant.ts

/**
 * Validates that MCP OAuth discovery works per 2025-06-18 spec
 * WITHOUT the authorization server metadata proxy endpoint.
 *
 * This proves:
 * 1. Clerk's AS metadata is publicly accessible
 * 2. Spec-compliant clients can complete discovery
 * 3. We can safely remove the proxy endpoint
 */
```

**What it tests:**

1. Fetch our protected resource metadata → get Clerk's AS URL
2. Fetch Clerk's AS metadata DIRECTLY from Clerk
3. Verify all required OAuth endpoints are discoverable
4. Validate JWKS is accessible for token validation

**If this passes:** Clients following the current spec (2025-06-18) don't need our proxy.

### Phase 2: Implementation

**Step 1: Remove the proxy endpoint**

```typescript
// auth-routes.ts - DELETE THIS:
app.get(
  '/.well-known/oauth-authorization-server',
  addNoCacheHeaders(authServerMetadataHandlerClerk),
);
```

**Step 2: Update imports**

```typescript
// auth-routes.ts - KEEP ONLY THIS:
import { protectedResourceHandlerClerk } from '@clerk/mcp-tools/express';

// Remove this import:
// import { authServerMetadataHandlerClerk } from '@clerk/mcp-tools/express';
```

**Step 3: Keep the dependency**

```json
// package.json - KEEP THIS:
{
  "dependencies": {
    "@clerk/mcp-tools": "^0.3.1" // Still needed for protectedResourceHandlerClerk
  }
}
```

**Step 4: Update tests**

Tests should validate that AS metadata is fetched from Clerk, not from us:

```typescript
// E2E tests should NOT test our proxy endpoint
// REMOVE:
it('exposes /.well-known/oauth-authorization-server with Clerk metadata', async () => {
  const res = await request(app).get('/.well-known/oauth-authorization-server');
  // This test assumes proxy exists - remove it
});

// KEEP/ADD:
it('protected resource metadata points to Clerk AS', async () => {
  const res = await request(app).get('/.well-known/oauth-protected-resource');
  const clerkUrl = res.body.authorization_servers[0];

  // Verify Clerk's AS metadata is accessible directly from Clerk
  const clerkAS = await fetch(`${clerkUrl}/.well-known/oauth-authorization-server`);
  expect(clerkAS.status).toBe(200);
});
```

### Phase 3: If Clients Are Broken

**Only if smoke test fails OR real clients have issues:**

Then we have two sub-options:

**Option 3A: Implement minimal proxy ourselves**

- Keep it minimal
- Add prominent documentation that it's a compatibility workaround
- Plan to remove when clients update

**Option 3B: Keep using @clerk/mcp-tools for the proxy**

- Document that we're using the "outdated client support" feature
- Add note that it's a temporary workaround
- Monitor for package updates

---

## Why This Is The Right Approach

### 1. Follows Package Intent

The package maintainers explicitly say the proxy "should not be necessary" when using Clerk. We're using Clerk correctly, so we shouldn't need it.

### 2. Follows Current MCP Spec

The 2025-06-18 MCP spec (lines 118 in sequence diagram) shows `C->A` (client to auth server), not `C->M->A` (client to resource server to auth server).

### 3. Simplifies Architecture

- Removes proxy complexity
- Eliminates caching confusion
- Removes failure point
- Follows OAuth 2.0 separation of concerns

### 4. Maintainability

We keep the dependency for the parts that work correctly (`protectedResourceHandlerClerk`), rather than:

- Reimplementing everything (maintenance burden)
- Keeping unused/incorrect features (confusion)

### 5. Empirical Validation

The smoke test gives us confidence before making changes. If it passes, we know we're right. If it fails, we learn something important about client behavior or Clerk's setup.

---

## What We're Actually Internalizing

**Previously (in original plan):** Internalize both metadata handlers

**Now (revised understanding):**

- Keep using `protectedResourceHandlerClerk` from package ✅
- Remove/internalize only the proxy if needed after testing ⚠️
- Likely don't need to internalize anything ✅

---

## Updated Recommendation

### Do NOT Proceed With Original Internalization Plan

The original plan assumed we should remove @clerk/mcp-tools entirely. **This was wrong.**

### Instead: Use @clerk/mcp-tools As Intended

**What to keep from @clerk/mcp-tools:**

- `protectedResourceHandlerClerk` - Correct per spec
- Optional: `mcpAuthClerk` if we're using it (need to check)

**What to remove:**

- `authServerMetadataHandlerClerk` - For old spec, not needed

**What to internalize:**

- Probably nothing! Just remove the proxy endpoint

---

## Action Items

1. ✅ **Create smoke test** - Validate spec-compliant discovery works
2. ✅ **Run smoke test** - Against dev/staging environment
3. ✅ **Decision made** - Proxy endpoint RESTORED for backward compatibility
   - Cursor v2.5.17 fetches `/.well-known/oauth-authorization-server` from the resource
     server and cannot complete OAuth without it
   - Endpoint derives metadata locally using `generateClerkProtectedResourceMetadata`
     (from `@clerk/mcp-tools/server`) -- no `authServerMetadataHandlerClerk`, no network call
   - See ADR-113 amendment (2026-02-20) for full rationale
4. ✅ **Update tests** - E2E test now asserts 200 with valid AS metadata structure
5. ✅ **Update documentation** - ADR-113 amended, curl tests updated

---

## Conclusion

**Should we remove @clerk/mcp-tools?**
**NO** - We use `generateClerkProtectedResourceMetadata` for both PRM and AS metadata derivation.

**Do we use `authServerMetadataHandlerClerk`?**
**NO** - It reads `process.env` directly. Instead, we use `generateClerkProtectedResourceMetadata`
to derive the FAPI URL from the publishable key (DI-clean, no network call), then construct
standard OIDC endpoint URLs locally.

**Do we serve `/.well-known/oauth-authorization-server`?**
**YES** - Restored for backward compatibility with clients implementing the older MCP spec
(2025-03-26), including Cursor v2.5.17. See ADR-113 amendment.

**Current usage from `@clerk/mcp-tools/server`:**

- `generateClerkProtectedResourceMetadata` -- PRM endpoint and AS metadata derivation
