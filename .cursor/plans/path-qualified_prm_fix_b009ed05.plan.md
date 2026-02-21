---
name: Path-Qualified PRM Fix
overview: Fix the blocking path-qualified PRM URL issue (RFC 9728 Section 3.1) so Cursor can complete the OAuth flow, then validate with Cursor and write documentation.
todos:
  - id: red-unit-prm
    content: "RED: Update get-prm-url.unit.test.ts -- all 5 tests expect path-qualified URL with /mcp suffix"
    status: completed
  - id: red-unit-auth-error
    content: "RED: Update auth-error-response.unit.test.ts -- 4 tests expect path-qualified metadata URL"
    status: completed
  - id: red-e2e
    content: "RED: Add E2E test for path-qualified PRM route; update WWW-Authenticate assertions"
    status: completed
  - id: red-integration
    content: "RED: Add integration test for path-qualified PRM route"
    status: completed
  - id: red-confirm
    content: "RED: Run tests to confirm all new/changed assertions fail"
    status: completed
  - id: green-fix-getprmurl
    content: "GREEN: Fix getPRMUrl() to append /mcp suffix (get-prm-url.ts line 43)"
    status: completed
  - id: green-fix-generatemetadata
    content: "GREEN: Fix generateMetadataUrl() to include url.pathname (auth-error-response.ts line 109)"
    status: completed
  - id: green-register-route
    content: "GREEN: Register PRM at /.well-known/oauth-protected-resource/mcp (auth-routes.ts)"
    status: completed
  - id: green-skip-paths
    content: "GREEN: Add path-qualified PRM to CLERK_SKIP_PATHS (conditional-clerk-middleware.ts)"
    status: completed
  - id: green-confirm
    content: "GREEN: Run tests to confirm all pass"
    status: completed
  - id: refactor-tsdoc
    content: "REFACTOR: Fix TSDoc (RFC 9728, remove bug-fix framing), update README"
    status: completed
  - id: quality-gates
    content: Run full quality gate chain
    status: completed
  - id: cursor-validation
    content: Start dev server, validate Cursor OAuth flow end-to-end
    status: completed
  - id: documentation
    content: Update ADR-113, archive plan, update prompt
    status: completed
  - id: reviews
    content: Invoke code-reviewer, security-reviewer, test-reviewer
    status: completed
isProject: false
---

# Fix Path-Qualified PRM URL for Cursor OAuth

## Context

The proxy OAuth AS is functionally complete but Cursor fails because our server does not serve the **path-qualified** PRM URL. RFC 9728 Section 3.1 specifies that for resource `http://host/mcp`, the PRM URL is `http://host/.well-known/oauth-protected-resource/mcp`. Our code explicitly strips the `/mcp` suffix (calling it a "bug in @clerk/mcp-tools"). RFC 9728 says the Clerk library was right; our "fix" was wrong.

After the OAuth redirect, Cursor falls back to RFC 9728 path construction, gets 404 on `/.well-known/oauth-protected-resource/mcp`, and cannot re-discover the AS token endpoint.

## Scope

Four source files need fixing, four test files need updating, plus new test cases. All within `apps/oak-curriculum-mcp-streamable-http/`.

## Phase 1: RED -- Write Failing Tests

### 1a. Unit tests for `getPRMUrl` -- [get-prm-url.unit.test.ts](apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/get-prm-url.unit.test.ts)

All 5 existing tests assert the URL **without** `/mcp`. Update all expected values to include `/mcp`:

- `'https://example.com/.well-known/oauth-protected-resource'` becomes `'https://example.com/.well-known/oauth-protected-resource/mcp'`
- Remove the `expect(result).not.toContain('/mcp')` assertions (lines 37, 91, 111)
- Update test descriptions and TSDoc: RFC 9728 (not RFC 9470), remove "bug fix" framing

### 1b. Unit tests for `generateMetadataUrl` -- [auth-error-response.unit.test.ts](apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.unit.test.ts)

Three tests assert the metadata URL without the path suffix. Update:

- Line 67: `'https://example.com/.well-known/oauth-protected-resource'` becomes `'https://example.com/.well-known/oauth-protected-resource/mcp'`
- Lines 168-169: `'http://localhost:3000/.well-known/oauth-protected-resource'` becomes `'http://localhost:3000/.well-known/oauth-protected-resource/mcp'`
- Lines 181-182: `'https://api.example.com/.well-known/oauth-protected-resource'` becomes `'https://api.example.com/.well-known/oauth-protected-resource/mcp'`
- Lines 194-198: both http and https variants gain `/mcp` suffix

### 1c. E2E test for path-qualified PRM -- [auth-enforcement.e2e.test.ts](apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts)

Add a new test inside `describe('OAuth Metadata Endpoints')`:

```typescript
it('serves path-qualified PRM at /.well-known/oauth-protected-resource/mcp', async () => {
  // RFC 9728 Section 3.1: path-qualified PRM for resource at /mcp
  const res = await request(await createAuthApp())
    .get('/.well-known/oauth-protected-resource/mcp');
  expect(res.status).toBe(200);
  // Same response as unqualified PRM
  // ... assert resource, authorization_servers, scopes_supported
});
```

Also update WWW-Authenticate assertions to expect the path-qualified `resource_metadata` URL.

### 1d. Integration test for path-qualified PRM -- [auth-routes.integration.test.ts](apps/oak-curriculum-mcp-streamable-http/src/auth-routes.integration.test.ts)

Add test for `GET /.well-known/oauth-protected-resource/mcp` returning valid PRM with self-origin `authorization_servers`.

### Run tests -- all new/changed assertions MUST fail (RED confirmed)

## Phase 2: GREEN -- Minimal Implementation

### 2a. Fix `getPRMUrl()` -- [get-prm-url.ts](apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/get-prm-url.ts)

Change line 43 from:

```typescript
return `${req.protocol}://${host}/.well-known/oauth-protected-resource`;
```

To:

```typescript
return `${req.protocol}://${host}/.well-known/oauth-protected-resource/mcp`;
```

The `/mcp` suffix is the resource path per RFC 9728 Section 3.1. This middleware only runs for `/mcp` requests, so hardcoding is correct and simple.

### 2b. Fix `generateMetadataUrl()` -- [auth-error-response.ts](apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.ts)

Change line 109 from:

```typescript
return `${protocol}//${host}/.well-known/oauth-protected-resource`;
```

To:

```typescript
return `${protocol}//${host}/.well-known/oauth-protected-resource${url.pathname}`;
```

This derives the path suffix from the resource URL (e.g., `/mcp` from `https://example.com/mcp`), making it generic.

### 2c. Register path-qualified PRM route -- [auth-routes.ts](apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts)

After the existing `app.get('/.well-known/oauth-protected-resource', ...)` handler (line 75), add an identical handler for the path-qualified URL:

```typescript
app.get('/.well-known/oauth-protected-resource/mcp', (req, res) => {
  const selfOrigin = deriveSelfOrigin(req);
  res.json({
    resource: `${selfOrigin}/mcp`,
    authorization_servers: [selfOrigin],
    scopes_supported: [...SCOPES_SUPPORTED],
  });
});
```

Keep both routes -- the unqualified route provides backwards compatibility; the path-qualified route is what RFC 9728 specifies and what Cursor requests.

### 2d. Add path to CLERK_SKIP_PATHS -- [conditional-clerk-middleware.ts](apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts)

Add `'/.well-known/oauth-protected-resource/mcp'` to the `CLERK_SKIP_PATHS` Set (line 36).

### Run tests -- all MUST pass (GREEN confirmed)

## Phase 3: REFACTOR -- TSDoc and Narrative Correction

### 3a. Fix TSDoc in `get-prm-url.ts`

- Remove "bug fix" framing -- RFC 9728 says the path suffix IS correct
- Update RFC reference: RFC 9728 (Protected Resource Metadata), not RFC 9470
- Update `@example` to show the path-qualified URL

### 3b. Fix TSDoc in `auth-error-response.ts`

- Update `@returns` example to include `/mcp` suffix

### 3c. Fix TSDoc in `auth-routes.ts`

- Document that both PRM routes serve the same response (unqualified for backwards compat, path-qualified per RFC 9728)

### 3d. Fix README references

The README at lines 1207, 1241-1248, 1273 describes the `/mcp` suffix as a "bug in @clerk/mcp-tools". Update to reflect that RFC 9728 requires the path suffix and our original "fix" was incorrect.

## Phase 4: Quality Gates

Run the full chain from repo root:

```
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

Note: the smoke test `assertOAuthDiscoveryChain` in [oauth-discovery.ts](apps/oak-curriculum-mcp-streamable-http/smoke-tests/smoke-assertions/oauth-discovery.ts) extracts `prmUrl` from the `WWW-Authenticate` header and fetches it. Since `getPRMUrl()` now returns the path-qualified URL, the header will contain the path-qualified URL, and `assertPrmReturnsAuthServers` will fetch from that URL. The newly registered route ensures this succeeds. No smoke test code changes should be needed -- verify during quality gates.

## Phase 5: Cursor Validation

1. Start dev server: `pnpm dev` from `apps/oak-curriculum-mcp-streamable-http/`
2. Open Cursor, connect to the MCP server
3. Expected: Cursor requests `/.well-known/oauth-protected-resource/mcp`, gets 200, discovers AS on self-origin, completes OAuth flow
4. Capture server logs to confirm the path-qualified PRM is requested and served
5. Monitor for the `Basic` auth bug (GitHub #3734) -- log incoming `Authorization` headers on `/oauth/token`
6. If Cursor still fails, capture full request log and diagnose

## Phase 6: Documentation

1. Update [ADR-113](docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) with proxy OAuth AS approach
2. Consider writing a dedicated proxy ADR
3. ✅ Archived [proxy-oauth-as-for-cursor.plan.md](/.agent/plans/semantic-search/archive/completed/proxy-oauth-as-for-cursor.plan.md)
4. Update TSDoc in `auth-routes.ts`, `application.ts`
5. Update [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) to mark OAuth workstream complete

## Phase 7: Sub-agent Reviews

After implementation, invoke:

- `code-reviewer` (gateway)
- `security-reviewer` (auth/OAuth changes)
- `test-reviewer` (test changes)
- `docs-adr-reviewer` (if ADR/docs updated)

Architecture reviewers: N/A (no boundary/structural changes -- same files, same routes, same pattern).
