---
name: OAuth Validation and Cursor Flow Debugging
overview: >
  The MCP server returns 401 + WWW-Authenticate on initial requests (spec
  compliance done, ADR-113) and serves AS metadata at
  /.well-known/oauth-authorization-server for backward-compatible clients.
  Despite both being in place, Cursor still does not complete the OAuth flow.
  Before investigating the Cursor-specific path further, we must first
  validate that the SPEC-COMPLIANT path works end-to-end with automated
  smoke tests. A test email (CLERK_TEST_EMAIL in .env) is available for
  programmatic auth.
todos:
  - id: diagnose-server-logs
    content: >
      DIAGNOSE (DONE): Server-side OAuth metadata chain validated via logs.
      PRM returns 200 with correct authorization_servers. POST /mcp returns
      401 with correct WWW-Authenticate header. Cursor fetches
      /.well-known/oauth-authorization-server from our server and gets 404.
      No authenticated request ever arrives after the browser callback.
    status: completed
  - id: diagnose-clerk-dashboard
    content: >
      DIAGNOSE (DONE): Clerk dashboard inspected. DCR working, redirect URI
      correct, PKCE enabled, consent ON. All Clerk configuration correct.
    status: completed
  - id: diagnose-no-auth-prompt
    content: >
      DIAGNOSE (DONE): Clerk dev mode auto-approves — expected behaviour.
    status: completed
  - id: as-metadata-endpoint
    content: >
      DONE: Added /.well-known/oauth-authorization-server endpoint using
      local derivation from CLERK_PUBLISHABLE_KEY (deriveAuthServerMetadata
      in auth-routes.ts). Added to CLERK_SKIP_PATHS. E2E test updated to
      assert 200. OAUTH-CURL-TESTS.sh updated. ADR-113 amended. Quality
      gates passed. Cursor still does not complete the flow.
    status: completed
  - id: spec-smoke-discovery
    content: >
      DONE: Discovery chain smoke test compiles, lints, and PASSES.
      All three steps validated against a live dev server:
      (1) POST /mcp → 401 + WWW-Authenticate with resource_metadata URL,
      (2) GET PRM → 200 with authorization_servers pointing to Clerk,
      (3) Fetch AS metadata directly from Clerk via OIDC discovery → 200.
    status: completed
  - id: spec-smoke-e2e
    content: >
      READY: Discovery chain passes. SessionJwt fallback removed (server
      rejects non-oauth_token types). PKCE flow code is clean: creates
      identity, creates ephemeral OAuth app, runs PKCE, exchanges code
      for token. One blocker remains: the Clerk Backend API supports
      consent_screen_enabled on create, but @clerk/backend v2.29.2 types
      do not expose it. Options: (a) use fetch() directly against the
      Clerk REST API to create the app with consent_screen_enabled:false,
      (b) upgrade @clerk/backend to a version that includes the property,
      (c) create the app via SDK then PATCH consent off via REST API.
      Consent-disabled apps are approved for smoke tests ONLY — product
      apps MUST always have consent enabled.
    status: pending
  - id: spec-smoke-run
    content: >
      RUN: Start dev server (pnpm dev), run smoke:oauth:spec. This is the
      definitive test of the spec-compliant path. If it passes, the server
      works correctly for any standards-compliant client and the Cursor
      issue is Cursor-specific. If it fails, the server has bugs that need
      fixing before investigating Cursor.
    status: pending
  - id: cursor-investigate
    content: >
      INVESTIGATE: Only after the spec-compliant path is validated. The AS
      metadata endpoint is now served but Cursor still fails. Possible
      causes: (a) Cursor caches the 404 from the old response, (b) the
      locally-derived AS metadata has incorrect URLs, (c) Cursor has
      additional requirements beyond AS metadata, (d) token verification
      fails for Cursor-obtained tokens. Use MCP Inspector UI to compare
      behaviour. Check dev server logs for any new requests from Cursor
      after the AS metadata fix.
    status: pending
  - id: quality-gates
    content: >
      Run full quality gate chain after all smoke test work is complete.
    status: pending
isProject: false
---

## Context

**Session entry point**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
**Prerequisite (complete)**: OAuth spec compliance — ADR-113, all MCP methods require auth
**Prerequisite (complete)**: AS metadata endpoint — backward-compatible `/.well-known/oauth-authorization-server`
**Dev server**: `apps/oak-curriculum-mcp-streamable-http/`
**Start dev server**: `pnpm dev` (from HTTP server directory)
**Test email**: `CLERK_TEST_EMAIL` in root `.env` (do NOT record in version-controlled files)

## Completed Work

### 1. OAuth Spec Compliance (ADR-113)

All MCP methods now require HTTP-level authentication. Two spec-violating
bypasses removed:

1. Discovery method bypass in `conditional-clerk-middleware.ts` and `mcp-router.ts`
2. Noauth tool HTTP bypass in `mcp-router.ts`

Dead code deleted: `mcp-method-classifier.ts`, `discovery-methods-sync.unit.test.ts`.
ADR-056 superseded by ADR-113. Full TDD cycle completed at all levels.

**Plan**: [oauth-spec-compliance.md](../archive/completed/oauth-spec-compliance.md) (all todos
complete except `cursor-e2e-verify` — absorbed into this plan)

### 2. AS Metadata Endpoint (Backward Compatibility)

`/.well-known/oauth-authorization-server` restored using local derivation
from `CLERK_PUBLISHABLE_KEY` via `deriveAuthServerMetadata()` in
`auth-routes.ts`. No network call — mirrors the PRM approach. Path added
to `CLERK_SKIP_PATHS`. E2E test asserts 200 + valid metadata structure.

Implementation detail: uses `generateClerkProtectedResourceMetadata` to
extract the FAPI URL, then constructs standard OIDC endpoint URLs locally.
This avoids the `fetchClerkAuthorizationServerMetadata` network call that
failed in E2E tests with fake credentials.

**Plan**: `.cursor/plans/oauth_as_metadata_fix_139c4ac3.plan.md` (all
todos complete — absorbed into this plan)

### 3. Current State

Despite both fixes, Cursor still does not complete the OAuth flow. The
problem persists. Rather than continuing to investigate the Cursor-specific
path, the priority is to validate the **spec-compliant path** first.

## Current Priority: Spec-Compliant Path Validation

### Why This Order

A standards-compliant MCP client follows this discovery path:

1. POST /mcp → 401 + `WWW-Authenticate: Bearer resource_metadata="<PRM URL>"`
2. GET PRM URL → `authorization_servers[]` pointing to Clerk
3. Fetch AS metadata **directly from Clerk** (not from our server)
4. PKCE OAuth flow with Clerk → access token
5. POST /mcp with Bearer token → authenticated MCP response

If this path works, our server is correct and the Cursor issue is
Cursor-specific. If this path fails, we have a server bug that must be
fixed regardless of Cursor.

### Smoke Test Status

Three files created. Discovery passes. Full E2E needs one fix
before it can run (disable consent on ephemeral smoke-test OAuth app).

| File | Status |
|------|--------|
| `smoke-assertions/oauth-discovery.ts` | PASSES — validates discovery chain (steps 1-3) |
| `smoke-assertions/oauth-spec-e2e.ts` | READY — PKCE flow clean, needs consent-disabled app |
| `smoke-tests/smoke-oauth-spec.ts` | Compiles, lints. Entry point for `pnpm smoke:oauth:spec` |
| `smoke-tests/auth/clerk-oauth-token.ts` | CLEAN — sessionJwt fallback removed, PKCE-only |

**Completed**:

1. Fixed `createRootLogger` call (expects `SmokeSuiteMode`)
2. Fixed env loading (uses dotenv directly)
3. Added `smoke:oauth:spec` script to `package.json`
4. `@clerk/backend` added as explicit dependency in `package.json`
5. Code compiles and passes lint

**Resolved**: The PKCE flow can be completed programmatically.
The server requires `oauth_token` type tokens (session JWTs rejected).
The smoke test must create its own temporary OAuth app with consent
disabled so the authorize endpoint redirects directly instead of
rendering an interactive HTML consent page. The Clerk REST API supports
`consent_screen_enabled: false` on the create endpoint, but the
`@clerk/backend` v2.29.2 SDK types don't expose this property. The
next step is to bypass the SDK types for this one call (direct REST,
SDK upgrade, or post-create PATCH). The smoke test app is deleted
after each run.

**Invariant — consent screen in production**: All product-facing OAuth
applications (including the DCR-created app in the Clerk dashboard) MUST
always have `consentScreenEnabled: true`. Disabling consent is ONLY
permitted for ephemeral smoke-test OAuth apps created and destroyed by
`clerk-oauth-token.ts`. This is a security requirement: without the
consent screen, any logged-in user who visits an OAuth authorization URL
automatically grants access to any requested scopes. The product code
must never create OAuth apps with consent disabled.

### After Spec-Compliant Validation

Only after the spec path passes, investigate Cursor:

- Check if Cursor caches the old 404 response
- Compare MCP Inspector behaviour with Cursor behaviour
- Check dev server logs for new Cursor request patterns
- Verify locally-derived AS metadata URLs are correct

## Known Clerk Configuration

- **FAPI domain**: `native-hippo-15.clerk.accounts.dev`
- **DCR-created OAuth App**: `oa_39uMWepCVeuKMXDZPZZczyCgGUR`
- **Authorize URL**: `https://native-hippo-15.clerk.accounts.dev/oauth/authorize`
- **Token URL**: `https://native-hippo-15.clerk.accounts.dev/oauth/token`

## Key Files

### Server-Side Auth Chain

| File | Role |
|------|------|
| `src/auth-routes.ts` | OAuth metadata endpoints (PRM + AS metadata) |
| `src/auth/mcp-auth/mcp-auth.ts` | Generic auth middleware (401 + WWW-Authenticate) |
| `src/auth/mcp-auth/mcp-auth-clerk.ts` | Clerk-specific token verification |
| `src/conditional-clerk-middleware.ts` | Path-based Clerk bypass |

### Smoke Test Infrastructure

| File | Role |
|------|------|
| `smoke-tests/auth/clerk-oauth-token.ts` | Programmatic PKCE flow |
| `smoke-tests/smoke-assertions/oauth-discovery.ts` | Discovery chain validation (NEW) |
| `smoke-tests/smoke-assertions/oauth-spec-e2e.ts` | Full spec-compliant flow (NEW) |
| `smoke-tests/smoke-oauth-spec.ts` | Entry point for spec smoke (NEW) |
| `smoke-tests/smoke-assertions/authenticated.ts` | Existing authenticated call assertion |
| `smoke-tests/OAUTH-CURL-TESTS.sh` | Discovery endpoint validation |

## References

- [MCP Authorization Spec (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [OpenAI Apps SDK Authentication](https://developers.openai.com/apps-sdk/build/auth)
- [Clerk MCP Connect Client](https://clerk.com/docs/guides/development/mcp/connect-mcp-client)
- [Clerk Build MCP Server Guide](https://clerk.com/docs/expressjs/guides/development/mcp/build-mcp-server)
- [Make MCP Cursor Guide](https://developers.make.com/mcp-server/connect-using-oauth/usage-with-cursor)
- [MCPJam OAuth Checklist](https://www.mcpjam.com/blog/mcp-oauth-guide)
- [RFC 9728 — OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728)
- [MCP Inspector CLI Mode](https://github.com/modelcontextprotocol/inspector#cli-mode)
- [ADR-113: All MCP Requests Require HTTP Auth](/docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md)
- [OAuth Spec Compliance Plan (archived)](../archive/completed/oauth-spec-compliance.md)
