# OAuth Metadata Architecture Review

**Date:** 2024-11-16  
**Status:** Critical Finding  
**Priority:** High

---

## Executive Summary

We are **incorrectly proxying Clerk's authorization server metadata** through our resource server. This violates OAuth 2.0 architecture, adds unnecessary complexity, creates a failure point, and may be causing the caching issues you're experiencing.

**Recommendation:** Remove the proxy endpoint entirely. Clients should fetch auth server metadata directly from Clerk.

---

## Current Architecture (WRONG)

```
┌─────────┐                                ┌──────────────────┐
│  MCP    │  1. GET /.well-known/          │  Our Resource    │
│ Client  │────oauth-protected-resource───▶│     Server       │
│         │                                 │                  │
│         │  2. authorization_servers:      │                  │
│         │◀────["https://clerk..."]────────│                  │
└─────────┘                                 └──────────────────┘
     │                                               │
     │  3. GET /.well-known/                        │
     │     oauth-authorization-server               │
     └──────────────────────────────────────────────┘
                                                     │
                                                     │ 4. fetch()
                                                     ▼
                                            ┌──────────────────┐
                                            │  Clerk Auth      │
                                            │   Server         │
                                            └──────────────────┘
```

**Problems:**

1. ❌ Client asks US for Clerk's metadata (step 3)
2. ❌ We proxy the request to Clerk (step 4)
3. ❌ We become a failure point for Clerk's metadata
4. ❌ Direct `fetch()` calls bypass Clerk SDK
5. ❌ No error handling, no retry logic, no rate limiting
6. ❌ Creates caching complexity (who caches what?)

---

## Correct Architecture (RFC 8414 Compliant)

```
┌─────────┐                                ┌──────────────────┐
│  MCP    │  1. GET /.well-known/          │  Our Resource    │
│ Client  │────oauth-protected-resource───▶│     Server       │
│         │                                 │                  │
│         │  2. authorization_servers:      │                  │
│         │◀────["https://clerk..."]────────│                  │
└─────────┘                                 └──────────────────┘
     │
     │  3. GET /.well-known/
     │     oauth-authorization-server
     │
     ▼
┌──────────────────┐
│  Clerk Auth      │
│   Server         │
└──────────────────┘
```

**Benefits:**

1. ✅ Client fetches auth server metadata directly from Clerk
2. ✅ We don't proxy or cache Clerk's data
3. ✅ Clerk controls caching via their HTTP headers
4. ✅ Clerk handles their own rate limiting and reliability
5. ✅ Simpler architecture (one less endpoint)
6. ✅ No failure point in our system

---

## RFC 8414 Specification

From **RFC 8414 - OAuth 2.0 Authorization Server Metadata**:

> The authorization server's metadata is retrieved from a well-known location as a JSON document that describes the authorization server's configuration.

The spec describes how **authorization servers** expose their metadata. There is NO requirement or suggestion that **resource servers** should proxy this metadata.

From **RFC 9728 - OAuth 2.0 Protected Resource Metadata**:

> The protected resource's metadata lists the authorization servers it uses.

This is what we do correctly! We tell clients "here are the auth servers" via the `authorization_servers` array. **Clients should then go to those servers directly.**

---

## Why Is This Wrong?

### 1. Architectural Violation

**Separation of Concerns:**

- **Resource Server (us):** Protects resources, validates tokens, tells clients where to authenticate
- **Authorization Server (Clerk):** Handles authentication, issues tokens, provides auth metadata

**Current problem:** We're doing Clerk's job by serving their metadata.

### 2. Creates Unnecessary Failure Points

```typescript
// current code in @clerk/mcp-tools
export function fetchClerkAuthorizationServerMetadata({
  publishableKey,
}: {
  publishableKey: string;
}) {
  const fapiUrl = deriveFapiUrl(publishableKey);

  return fetch(`${fapiUrl}/.well-known/oauth-authorization-server`)
    .then((res) => res.json())
    .then((metadata) => {
      return metadata;
    });
}
```

**Issues:**

- ❌ No timeout (can hang indefinitely)
- ❌ No error handling (what if Clerk is down?)
- ❌ No retry logic
- ❌ No rate limiting
- ❌ Raw `fetch()` bypasses any Clerk SDK features

**If Clerk is down, our metadata endpoint fails.** This is wrong - our metadata should always work, clients should discover that CLERK is down when they try to talk to Clerk.

### 3. Caching Complexity

**Question:** Who should cache auth server metadata?

- **Clerk?** Yes - they control their cache headers
- **The Client?** Yes - they can cache per Clerk's headers
- **Us (proxy)?** **NO** - we add no value, just complexity

**Current problem:** We're disabling caching with `no-cache` headers, forcing fresh fetches every time. This means:

- Every metadata request hits Clerk
- We might trigger rate limits
- We add latency
- We create a coupling between our availability and Clerk's

### 4. Not Using Clerk's SDK

We're calling `fetch()` directly instead of using `@clerk/express` or `@clerk/backend`. This bypasses:

- Any built-in retry logic
- Connection pooling
- Rate limiting
- Error handling
- Future SDK improvements

**User's question:** "Why aren't those calls going through @clerk/express or some other Clerk SDK?"

**Answer:** They should be! Or better yet, they shouldn't exist at all on our server.

---

## What Should We Do?

### Option A: Remove the Proxy Endpoint (RECOMMENDED)

**Changes:**

1. Remove `/.well-known/oauth-authorization-server` endpoint from our server
2. Keep `/.well-known/oauth-protected-resource` (this is correct)
3. Clients fetch auth server metadata directly from Clerk

**Implementation:**

```typescript
// auth-routes.ts - REMOVE THIS:
app.get(
  '/.well-known/oauth-authorization-server',
  addNoCacheHeaders(authServerMetadataHandlerClerk),
);
```

**Update tests:**

```typescript
// E2E tests should verify protected resource metadata points to Clerk
const protectedResource = await request(app).get('/.well-known/oauth-protected-resource');
const clerkUrl = protectedResource.body.authorization_servers[0];

// Client should fetch auth server metadata from CLERK, not from us
const authServerMetadata = await fetch(`${clerkUrl}/.well-known/oauth-authorization-server`);
```

**Benefits:**

- ✅ Correct architecture per RFC 8414
- ✅ No proxy complexity
- ✅ No caching issues on our server
- ✅ No failure point
- ✅ Simpler code

**Risks:**

- ❓ Need to verify MCP clients support this flow
- ❓ May need to update client configurations

### Option B: Keep Proxy But Use Clerk SDK (NOT RECOMMENDED)

If we MUST keep the proxy:

**Better implementation:**

```typescript
// Check if @clerk/backend has a method for this
import { clerkClient } from '@clerk/express';

export async function authServerMetadataHandler(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> {
  try {
    // Check if Clerk SDK has a method for fetching this
    // If not, at least use better HTTP client with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${CLERK_FAPI_URL}/.well-known/oauth-authorization-server`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'oak-curriculum-mcp-streamable-http',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Clerk metadata fetch failed: ${response.status}`);
    }

    const metadata = await response.json();
    res.json(metadata);
  } catch (error) {
    next(error); // Proper Express error handling
  }
}
```

**Still has problems:**

- ❌ Still a proxy (architectural issue remains)
- ❌ Still a failure point
- ❌ Still adds complexity

---

## Investigation Needed

### 1. Check MCP Client Behavior

**Question:** Do MCP clients (like Claude Desktop) expect to find auth server metadata at the resource server?

**How to check:**

- Review MCP OAuth specification
- Test with Claude Desktop
- Check MCP client source code if available

### 2. Check Clerk SDK Capabilities

**Question:** Does `@clerk/express` or `@clerk/backend` provide methods for fetching auth server metadata?

**How to check:**

```bash
# Search Clerk SDK for metadata methods
grep -r "oauth-authorization-server\|getMetadata\|fetchMetadata" node_modules/@clerk/
```

### 3. Review Caching Issues

**Question:** What are the actual caching problems you're experiencing?

**Possibilities:**

1. Clerk's metadata is cached when it shouldn't be
2. Our proxy is caching when it shouldn't
3. CDN (Vercel) is caching inappropriately
4. Client is caching stale metadata

**If we remove the proxy:** Caching becomes Clerk's responsibility (correct!)

---

## Recommendation

**Phase 1: Investigation (30 minutes)**

1. Check MCP client expectations for auth server metadata location
2. Verify if `@clerk/backend` has metadata fetching methods
3. Understand your actual caching issues

**Phase 2: Implementation (based on findings)**

**If MCP clients support direct Clerk metadata fetching:**

- Remove proxy endpoint entirely (15 minutes)
- Update tests (15 minutes)
- Deploy and verify (15 minutes)

**If MCP clients require proxy (unlikely):**

- Keep endpoint but improve implementation
- Use Clerk SDK if available
- Add proper error handling and timeout
- Add intelligent caching (1-hour TTL)

---

## Conclusion

**You asked:** "Why aren't those calls going through @clerk/express or some other Clerk SDK?"

**Answer:** Because `@clerk/mcp-tools` uses raw `fetch()` calls, which is architecturally wrong. The better question is: **Why are we proxying Clerk's metadata at all?**

**The root issue isn't about internalizing the dependency.** The root issue is that **we shouldn't be proxying Clerk's auth server metadata in the first place.**

**System-level thinking:** This proxy endpoint adds complexity without delivering value. It creates a failure point, complicates caching, and violates OAuth architecture. The simplest solution is to remove it entirely.

---

## Next Steps

Before proceeding with the internalization plan, I recommend:

1. **Investigate:** Do MCP clients actually need this proxy endpoint?
2. **Test:** Can we remove it without breaking OAuth flow?
3. **Decide:** Should we remove the endpoint or improve its implementation?

Only after answering these questions should we proceed with any implementation.

**The First Question:** Could it be simpler?  
**Answer:** Yes - don't proxy Clerk's metadata at all.
