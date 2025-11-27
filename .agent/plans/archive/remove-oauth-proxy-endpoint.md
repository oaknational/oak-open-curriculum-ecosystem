# Plan: Remove OAuth Authorization Server Metadata Proxy

**Status:** Ready for Implementation  
**Created:** 2024-11-16  
**Updated:** 2024-11-16 (Simplified with proper TDD and test boundaries)  
**Priority:** Medium  
**Effort:** ~50 minutes

---

## First Question

**Ask: Could it be simpler without compromising quality?**

**Answer:** Yes. Remove the endpoint. Validate assumption with one manual Inspector CLI call. Use TDD with pure functions where applicable. Update integration tests. Run quality gates. Done.

---

## Executive Summary

Remove the `/.well-known/oauth-authorization-server` proxy endpoint from our resource server. This endpoint:

1. **Not needed per spec** - MCP spec 2025-06-18 shows clients fetching AS metadata directly from authorization server
2. **Not needed per SDK** - `@modelcontextprotocol/sdk` client explicitly fetches from `authorization_servers` URL
3. **Warned against** - `@clerk/mcp-tools` README says "should not be necessary"
4. **Violates OAuth architecture** - Resource servers don't proxy AS metadata
5. **Simple deletion** - Just 15 lines of code to remove

**Validation:** One manual Inspector CLI call proves MCP clients work without the proxy.

**Scope:** Keep using `@clerk/mcp-tools` for protected resource metadata (correct usage). Remove only the proxy endpoint.

---

## Related Future Work

**MCP Testing Toolkit** (deferred to icebox):

- Reusable Inspector CLI harness
- Automated MCP server testing utilities
- Created when we have 2+ OAuth-enabled MCP servers to test

See: `.agent/plans/icebox/mcp-testing-toolkit.md`

---

## Problem Statement

### Current State

We use two functions from `@clerk/mcp-tools`:

1. ✅ `protectedResourceHandlerClerk` - **CORRECT** - Generates RFC 9728 protected resource metadata
2. ❌ `authServerMetadataHandlerClerk` - **INCORRECT** - Proxies Clerk's RFC 8414 AS metadata

### Why the Proxy is Wrong

1. **Package warns against it** - `@clerk/mcp-tools` README lines 77-82: "should not be necessary"
2. **For old MCP spec** - Implements 2025-03-26 spec, not current 2025-06-18 spec
3. **Violates OAuth architecture** - Resource server ≠ Authorization server
4. **Just a fetch wrapper** - 15 lines that call `fetch()` and return `json()`
5. **Creates failure point** - If Clerk is slow, our endpoint is slow

### Evidence

**From `@clerk/mcp-tools` source code** (`express/index.ts` lines 146-160):

```typescript
export async function authServerMetadataHandlerClerk(_: express.Request, res: express.Response) {
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('CLERK_PUBLISHABLE_KEY environment variable is required');
  }

  const metadata = await fetchClerkAuthorizationServerMetadata({
    publishableKey,
  });

  res.json(metadata);
}
```

It's literally just fetching from Clerk and returning the result. We don't need to proxy this.

**From MCP SDK** (`@modelcontextprotocol/sdk/dist/esm/client/auth.d.ts` line 180):

```typescript
/**
 * Discovers authorization server metadata...
 * @param authorizationServerUrl - The authorization server URL obtained from the MCP Server's
 *                                 protected resource metadata, or the MCP server's URL if the
 *                                 metadata was not found.
 */
export declare function discoverAuthorizationServerMetadata(
  authorizationServerUrl: string | URL, ...
): Promise<AuthorizationServerMetadata | undefined>;
```

SDK explicitly documents that it fetches AS metadata FROM THE URL in the `authorization_servers` array.

---

## Goals

### Primary Goals (Must Have)

1. **Manual validation FIRST** - Prove assumption with Inspector CLI before changing code
2. **Apply TDD** - Write/update tests FIRST (Red), then remove endpoint (Green)
3. **Remove proxy endpoint** - Delete `/.well-known/oauth-authorization-server` route
4. **Keep `@clerk/mcp-tools`** - Continue using for protected resource metadata
5. **Respect test boundaries** - NO network calls to external services in automated tests
6. **Quality gates** - All must pass

### Non-Goals (Explicitly Out of Scope)

- ❌ Building Inspector CLI harness (deferred to icebox - YAGNI)
- ❌ Internalizing `@clerk/mcp-tools` (using it correctly)
- ❌ Testing Clerk infrastructure (not our responsibility)
- ❌ Automated Inspector integration (violates test boundaries)

---

## Architecture Design

### Current Architecture (WRONG)

```text
┌─────────┐                              ┌──────────────────┐
│  MCP    │  1. GET /.well-known/        │  Our Resource    │
│ Client  │──oauth-protected-resource──▶ │     Server       │
│         │                               │                  │
│         │  2. authorization_servers:    │                  │
│         │◀────["https://clerk..."]──────│                  │
└─────────┘                               └──────────────────┘
     │                                             │
     │  3. GET /.well-known/                      │
     │     oauth-authorization-server             │
     └────────────────────────────────────────────┘
                                                   │
                                                   │ 4. fetch()
                                                   ▼
                                          ┌──────────────────┐
                                          │  Clerk Auth      │
                                          │   Server         │
                                          └──────────────────┘
```

**Problem:** Steps 3-4 shouldn't exist on our server.

### Correct Architecture (Per MCP Spec 2025-06-18)

```text
┌─────────┐                              ┌──────────────────┐
│  MCP    │  1. GET /.well-known/        │  Our Resource    │
│ Client  │──oauth-protected-resource──▶ │     Server       │
│         │                               │                  │
│         │  2. authorization_servers:    │                  │
│         │◀────["https://clerk..."]──────│                  │
└─────────┘                               └──────────────────┘
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

**Correct:** Client goes directly to Clerk per MCP spec sequence diagram.

---

## Implementation Plan

### Phase 0: Cleanup - 5 minutes

Delete the broken smoke test that doesn't respect test boundaries:

```bash
# From repository root
rm apps/oak-curriculum-mcp-streamable-http/smoke-tests/smoke-oauth-discovery-spec-compliant.ts
```

**Edit package.json:**

File: `apps/oak-curriculum-mcp-streamable-http/package.json`

Remove the script:

```json
"smoke:oauth-discovery": "tsx smoke-tests/smoke-oauth-discovery-spec-compliant.ts"
```

**Why delete it:**

- Tests Clerk accessibility (external service) - violates test boundaries
- Doesn't prove what MCP clients actually do
- Inspector CLI is the right tool for manual validation

---

### Phase 1: Evidence Review - 5 minutes

**SDK Evidence** (already gathered):

From `@modelcontextprotocol/sdk/dist/esm/client/auth.d.ts` line 180:

- SDK takes AS URL from protected resource metadata's `authorization_servers` array
- SDK fetches AS metadata directly from that URL
- Proves clients don't need our proxy

**Package Evidence:**

From `@clerk/mcp-tools/express/index.ts` lines 146-160:

- `authServerMetadataHandlerClerk` is just `fetch()` → `json()`
- 15 lines of code
- Simple to remove

**Conclusion:** Proxy is unnecessary per spec, SDK, and package recommendation.

---

### Phase 2: Manual Validation - 5 minutes

**Validate assumption BEFORE making changes:**

```bash
# Terminal 1: Start dev server
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev

# Terminal 2: Test with Inspector CLI (manual, one-time)
npx @modelcontextprotocol/inspector --cli http://localhost:3333 \
  --transport http --method tools/list
```

**Expected:** Inspector connects successfully, performs OAuth discovery, lists tools.

**This proves:** MCP clients fetch AS metadata directly from `authorization_servers` URL (Clerk), not from our proxy.

**Note on Test Boundaries:**

Per @testing-strategy.md and [[memory:8343826]], this is **manual validation only**. We do NOT automate this in tests because:

- Requires network calls to Clerk (external service)
- Violates test boundaries for this repo
- One-time architectural validation, not ongoing regression test

**If validation FAILS:**

- STOP. Don't proceed with removal.
- Investigate why Inspector can't connect
- Check Clerk credentials, network connectivity
- Re-evaluate whether proxy is actually needed

---

### Phase 3: Update Tests FIRST (TDD Red) - 15 minutes

**Per @rules.md and @testing-strategy.md: Tests BEFORE implementation**

This is the RED phase of Red → Green → Refactor.

#### Step 3.1: Update E2E tests

File: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts`

**REMOVE this test** (tests wrong architecture):

```typescript
// DELETE THIS:
it('exposes /.well-known/oauth-authorization-server with Clerk metadata', async () => {
  const res = await request(app).get('/.well-known/oauth-authorization-server');
  expect(res.status).toBe(200);
  // ... assumes proxy exists
});
```

**ADD this test** (tests correct architecture):

```typescript
// ADD THIS:
it('does not proxy authorization server metadata', async () => {
  // Per @testing-strategy.md: E2E tests in this repo do NOT make
  // network calls to external services [[memory:8343826]]
  // We only test that OUR server doesn't have the proxy endpoint

  const res = await request(app).get('/.well-known/oauth-authorization-server');

  // Expect 404 - we should NOT proxy AS metadata
  expect(res.status).toBe(404);
});

it('protected resource metadata contains valid authorization_servers array', async () => {
  const prRes = await request(app).get('/.well-known/oauth-protected-resource');
  expect(prRes.status).toBe(200);

  // Verify RFC 9728 structure
  expect(prRes.body).toHaveProperty('resource');
  expect(prRes.body).toHaveProperty('authorization_servers');
  expect(Array.isArray(prRes.body.authorization_servers)).toBe(true);
  expect(prRes.body.authorization_servers.length).toBeGreaterThan(0);

  // Verify Clerk URL format (structure validation only)
  const clerkAsUrl = prRes.body.authorization_servers[0];
  expect(clerkAsUrl).toContain('clerk');
  expect(clerkAsUrl).toMatch(/^https:\/\//);

  // CRITICAL: Do NOT fetch from this URL
  // Clerk accessibility is validated manually with Inspector CLI
  // Per @testing-strategy.md: NO network calls to external services
});
```

#### Step 3.2: Remove helper functions that tested proxy

Search for functions that test our proxy endpoint and DELETE them:

```typescript
// FIND AND DELETE:
async function validateASMetadataStep(app: Express, expectedIssuer: string): Promise<void> {
  const res = await request(app).get('/.well-known/oauth-authorization-server');
  // ... testing our proxy
}
```

**After Phase 3:** Tests will FAIL (Red state). This is correct TDD. The test expects 404, but proxy still exists, so it returns 200.

---

### Phase 4: Remove Endpoint (TDD Green) - 5 minutes

**Note:** Tests from Phase 3 are failing (Red). This phase makes them pass (Green).

#### Step 4.1: Update `auth-routes.ts`

File: `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`

**Remove the import:**

```typescript
// BEFORE:
import {
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk, // ← REMOVE THIS LINE
} from '@clerk/mcp-tools/express';

// AFTER:
import { protectedResourceHandlerClerk } from '@clerk/mcp-tools/express';
```

**Remove the route:**

```typescript
// DELETE THIS ENTIRE BLOCK:
app.get(
  '/.well-known/oauth-authorization-server',
  addNoCacheHeaders(authServerMetadataHandlerClerk),
);
```

**Keep this (correct usage):**

```typescript
// KEEP THIS - it's correct:
const metadataHandler = addNoCacheHeaders(
  protectedResourceHandlerClerk({
    scopes_supported: ['mcp:invoke', 'mcp:read'],
  }),
);

app.get('/.well-known/oauth-protected-resource', metadataHandler);
```

#### Step 4.2: Keep the dependency

**Do NOT remove from package.json:**

File: `apps/oak-curriculum-mcp-streamable-http/package.json`

```json
{
  "dependencies": {
    "@clerk/mcp-tools": "^0.3.1" // ← KEEP THIS
  }
}
```

We're still using it for `protectedResourceHandlerClerk`.

**After Phase 4:** Tests now PASS (Green state). Ready for refactor if needed.

---

### Phase 5: Quality Gates - 15 minutes

Run all quality gates per @rules.md [[memory:8755655]]:

```bash
# From repository root
pnpm i                             # Clean install
pnpm type-gen                      # Regenerate types
pnpm build                         # Build succeeds
pnpm type-check                    # No type errors
pnpm lint -- --fix                 # No lint errors
pnpm format                        # Format code
pnpm markdownlint                  # Markdown lint
pnpm test                          # All tests pass
pnpm test:e2e                      # E2E tests pass
```

**All must pass before considering done.**

Per [[memory:8755641]], run the FULL quality gate sequence, don't skip any steps.

---

## Note on Pure Functions and TDD

### Where Pure Functions Apply

**In `@clerk/mcp-tools` (already done correctly):**

- `generateClerkProtectedResourceMetadata()` - pure function
- Takes publishable key, resource URL
- Returns metadata object
- Unit testable (though tested in their repo, not ours)

**In our code:**

- We're just deleting a route registration
- No new pure functions to write
- The pure function work is done by `@clerk/mcp-tools`

### Where TDD Applies (We Follow It)

Per @rules.md lines 19, 27, 32, 56, 89:

> **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to _prove it fails_), Green (run the test to prove it passes, _because product code exists now_), Refactor

**Our TDD flow:**

1. **Red** (Phase 3): Write test expecting 404 from proxy endpoint → TEST FAILS
2. **Green** (Phase 4): Remove proxy endpoint → TEST PASSES
3. **Refactor** (Phase 5): Quality gates catch any issues

**Why no unit tests for this change:**

- We're deleting code, not adding pure functions
- Route registration is integration-level (Express app)
- E2E tests prove behavior at appropriate level
- Pure functions (`generateClerkProtectedResourceMetadata`) already tested in library

### Future TDD Opportunities

If we were to extract route configuration to pure functions (not in this plan):

```typescript
// Pure function returning route configuration
export function getAuthRoutes(): RouteConfig[] {
  return [
    {
      method: 'GET',
      path: '/.well-known/oauth-protected-resource',
      handler: 'protectedResourceHandlerClerk',
    },
    // No AS proxy route - removed
  ];
}
```

This would enable:

- Unit tests of route configuration (pure function)
- TDD for route changes
- But it's YAGNI for this one-time deletion

---

## Validation Strategy

### Test Boundaries (Per @testing-strategy.md and Project Rules)

**CRITICAL:** In this repo, ALL tests (unit, integration, E2E) do NOT make network calls to external services [[memory:8343826]].

### What We Test in Automated Tests

**E2E Tests:**

- ✅ Our server returns 404 for removed proxy endpoint
- ✅ Our server returns 200 for protected resource metadata
- ✅ Protected resource metadata has correct structure
- ✅ `authorization_servers` array points to Clerk (URL validation only)

**What We Do NOT Test:**

- ❌ Clerk accessibility (external service)
- ❌ Clerk's AS metadata validity (not our responsibility)
- ❌ Full OAuth flow with real Clerk (requires external calls)

### Manual Validation Only

**One-time architectural validation:**

- MCP Inspector CLI proves clients work without proxy
- Direct curl to Clerk verifies AS metadata exists there
- Not automated because it requires external network calls

**Why this is sufficient:**

1. SDK code inspection proves client behavior
2. Manual Inspector validation confirms empirically
3. E2E tests prove our server hasn't regressed
4. We don't need to continuously test Clerk's infrastructure

---

## Acceptance Criteria

### Functional Requirements

- [ ] Manual Inspector CLI validation passes BEFORE code changes
- [ ] Tests updated FIRST (Phase 3) - RED state achieved
- [ ] Proxy endpoint removed (Phase 4) - GREEN state achieved
- [ ] `/.well-known/oauth-protected-resource` still works (200)
- [ ] `/.well-known/oauth-protected-resource` returns correct `authorization_servers` array
- [ ] `/.well-known/oauth-authorization-server` returns 404
- [ ] `@clerk/mcp-tools` dependency kept in package.json
- [ ] `protectedResourceHandlerClerk` still imported and used
- [ ] `authServerMetadataHandlerClerk` import removed

### Non-Functional Requirements

- [ ] All E2E tests pass
- [ ] No network calls to external services in automated tests
- [ ] All quality gates pass
- [ ] Follows TDD: tests first, then implementation
- [ ] Respects @rules.md and @testing-strategy.md

---

## Definition of Done

### Code Complete When:

1. ✅ Broken smoke test deleted
2. ✅ Evidence reviewed
3. ✅ Manual Inspector validation successful
4. ✅ Tests updated FIRST (TDD Red)
5. ✅ Proxy endpoint removed (TDD Green)
6. ✅ Import of `authServerMetadataHandlerClerk` removed
7. ✅ All quality gates pass

### Functionality Proven When:

```bash
# Start server
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev

# Verify proxy removed
curl http://localhost:3333/.well-known/oauth-authorization-server
# Expected: 404

# Verify protected resource metadata works
curl http://localhost:3333/.well-known/oauth-protected-resource | jq
# Expected: 200 with authorization_servers pointing to Clerk

# Manual validation (NOT in automated tests)
npx @modelcontextprotocol/inspector --cli http://localhost:3333 \
  --transport http --method tools/list
# Expected: SUCCESS - Inspector connects and works
```

---

## Timeline Estimate

- **Phase 0** (Cleanup): 5 minutes
  - Delete broken smoke test
- **Phase 1** (Evidence Review): 5 minutes
  - SDK evidence already gathered
  - Source code confirms it's simple
- **Phase 2** (Manual Validation): 5 minutes
  - Run Inspector CLI once to prove assumption
- **Phase 3** (Update Tests FIRST - TDD Red): 15 minutes
  - Remove proxy test
  - Add 404 expectation test
  - Add metadata structure test
  - Tests FAIL (Red state)
- **Phase 4** (Remove Endpoint - TDD Green): 5 minutes
  - Remove import and route
  - Tests PASS (Green state)
- **Phase 5** (Quality Gates): 15 minutes
  - Run all gates

**Total: 50 minutes** (down from original 105 minutes)

---

## Risk Assessment

### Risks: MINIMAL ⭐

| Risk                 | Probability | Impact | Mitigation                                 |
| -------------------- | ----------- | ------ | ------------------------------------------ |
| Breaking OAuth flow  | Very Low    | High   | Manual Inspector validation BEFORE changes |
| Clients expect proxy | Very Low    | Medium | MCP spec and SDK prove otherwise           |
| Clerk unreachable    | Very Low    | High   | Manual validation catches this             |
| Test failures        | Very Low    | Low    | TDD approach ensures tests guide changes   |

### Why Very Low Risk?

1. ✅ **Manual validation first** - Prove assumption before changes
2. ✅ **Simple change** - Delete 15 lines, one import, one route
3. ✅ **Spec-compliant** - Following MCP spec 2025-06-18
4. ✅ **TDD approach** - Tests first, implementation second
5. ✅ **Easy rollback** - Single git revert

---

## References

### Standards

- [MCP Auth Spec 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)
- [RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728) - OAuth 2.0 Protected Resource Metadata
- [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414) - OAuth 2.0 Authorization Server Metadata

### Project Standards

- `.agent/directives-and-memory/rules.md` - Code quality, TDD, testing
- `.agent/directives-and-memory/testing-strategy.md` - Test types and boundaries

### Tools

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - Manual validation
- `@clerk/mcp-tools` - Package we use correctly for protected resource metadata

---

## Key Takeaways

### Architectural

1. **Resource server ≠ Authorization server** - Don't proxy AS metadata
2. **MCP spec is clear** - Clients fetch from `authorization_servers` URL
3. **SDK implements spec correctly** - No proxy needed
4. **Library warns against proxy** - Use tools as intended

### Testing

1. **Respect test boundaries** - No external network calls in automated tests
2. **Manual validation has a place** - One-time architectural proofs
3. **Test what we control** - Our server, not Clerk's infrastructure
4. **TDD guides changes** - Tests first, then implementation

### Process

1. **Apply "could it be simpler?"** - Ruthlessly
2. **YAGNI** - Don't build infrastructure for hypothetical futures
3. **TDD** - Red → Green → Refactor
4. **Quality gates** - All must pass

---

**END OF PLAN**
