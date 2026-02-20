---
name: OAuth Validation and Cursor Flow Debugging
overview: >
  The spec-compliant OAuth path is fully validated. The MCP server returns
  401 + WWW-Authenticate, serves PRM and AS metadata, and accepts Clerk
  OAuth tokens — all proven by pnpm smoke:oauth:spec against a live dev
  server. The remaining work is investigating why Cursor specifically
  does not complete the flow (cursor-investigate). A test email
  (CLERK_TEST_EMAIL in .env) is available for programmatic auth.
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
      DONE: Upgraded @clerk/backend 2.29.2 → 2.31.2 (exposes
      consentScreenEnabled). Rewrote PKCE flow to use proper Clerk
      Frontend API authentication: (1) create dev browser via FAPI
      POST /v1/dev_browser, (2) create sign-in token via Backend API,
      (3) sign in via FAPI ticket strategy to associate user with dev
      browser. The old approach incorrectly used a testing token as a
      dev browser token, causing an infinite sign-in redirect loop.
      Also handles HTTP 303 (See Other) in addition to 302 redirects.
    status: completed
  - id: spec-smoke-run
    content: >
      DONE: pnpm smoke:oauth:spec passes end-to-end against live dev
      server. All four phases validated: (1) Discovery chain — 401,
      PRM, AS metadata, (2) Programmatic PKCE — dev browser, FAPI
      sign-in, authorize, code exchange, (3) Authenticated tools/list
      — 35 tools returned, (4) MCP Inspector CLI — skipped (needs
      --method flag, non-blocking). The smoke test proves our server
      correctly implements the MCP spec-compliant OAuth flow. Phase 2
      is test infrastructure (token generation); phases 1 and 3 prove
      server behaviour. Quality gates pass (type-gen, build,
      type-check, lint, format, markdownlint, test, e2e, smoke:dev:stub).
      test:ui now passes (26 tests, widget KG fix applied).
    status: completed
  - id: cursor-investigate
    content: >
      INVESTIGATE: Spec-compliant path is validated (precondition met).
      The AS metadata endpoint is served and the smoke test passes, but
      Cursor still does not complete the OAuth flow. Possible causes:
      (a) Cursor caches the 404 from the old response, (b) the
      locally-derived AS metadata has incorrect URLs, (c) Cursor has
      additional requirements beyond AS metadata, (d) token verification
      fails for Cursor-obtained tokens. Use MCP Inspector UI to compare
      behaviour. Check dev server logs for any new requests from Cursor
      after the AS metadata fix.
    status: pending
  - id: quality-gates
    content: >
      DONE: Full quality gate chain passes — type-gen, build,
      type-check, lint:fix, format:root, markdownlint:root, test,
      test:e2e, test:ui (26 pass), smoke:dev:stub. All gates green.
    status: completed
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

**Plan**: Cursor plan deleted during consolidation (all todos
complete — absorbed into this plan)

### 3. Spec-Compliant Path (Validated)

The spec-compliant OAuth path is fully validated by
`pnpm smoke:oauth:spec`. The server correctly implements the
MCP authorization spec for any standards-compliant client:

1. POST /mcp → 401 + `WWW-Authenticate: Bearer resource_metadata="<PRM URL>"`
2. GET PRM URL → `authorization_servers[]` pointing to Clerk
3. Fetch AS metadata **directly from Clerk** (not from our server)
4. PKCE OAuth flow with Clerk → access token
5. POST /mcp with Bearer token → authenticated MCP response

This confirms the server is correct and the Cursor issue is
Cursor-specific.

### Manual Browser Validation (MCP Inspector)

In addition to the automated smoke test, the full human+browser OAuth
flow has been validated manually via MCP Inspector (interactive UI mode)
pointed at the live dev server on `localhost:3333/mcp`. The Clerk
consent screen was presented, the user authenticated in the browser,
and authenticated MCP calls succeeded. This confirms the flow works
for a real browser-based client, not just programmatic test
infrastructure.

## Current Priority: Cursor-Specific Investigation

### Smoke Test Status — PASSING

All files compile, lint, and the spec-compliant smoke test
(`pnpm smoke:oauth:spec`) passes end-to-end against a live dev server.

| File | Status |
|------|--------|
| `smoke-assertions/oauth-discovery.ts` | PASSES — validates discovery chain (steps 1-3) |
| `smoke-assertions/oauth-spec-e2e.ts` | PASSES — full PKCE flow and authenticated call |
| `smoke-tests/smoke-oauth-spec.ts` | PASSES — entry point for `pnpm smoke:oauth:spec` |
| `smoke-tests/auth/clerk-oauth-token.ts` | CLEAN — FAPI sign-in + PKCE-only |

**Key implementation decisions**:

1. Upgraded `@clerk/backend` 2.29.2 → 2.31.2 (exposes `consentScreenEnabled`)
2. Upgraded `@clerk/express` 1.7.7 → 1.7.72 (compatible with new backend)
3. PKCE flow uses Clerk Frontend API (FAPI) for programmatic auth:
   dev browser creation → sign-in token → ticket strategy sign-in
4. Handles both HTTP 302 and 303 redirects from Clerk authorize endpoint
5. Ephemeral OAuth app created with `consentScreenEnabled: false` and
   deleted after each run

### What the Smoke Test Proves vs What It Doesn't

The smoke test has three distinct phases with different roles:

| Phase | What it validates | Layer |
|-------|-------------------|-------|
| Phase 1: Discovery chain | POST /mcp → 401 + WWW-Authenticate; GET PRM → authorization_servers; AS metadata reachable | **Our server** |
| Phase 2: PKCE token acquisition | Dev browser, FAPI sign-in, authorize redirect, code exchange → access token | **Test infrastructure** |
| Phase 3: Authenticated MCP call | POST /mcp with Bearer token → 200 + tools/list | **Our server** |

**Phases 1 and 3 prove our server's behaviour.** Phase 2 is test
infrastructure — it generates a valid Clerk OAuth token so we can
exercise phase 3. This is analogous to creating test data to set up a
database test: the data setup isn't what we're testing.

**Key insight**: From our server's perspective, a Clerk OAuth token is a
Clerk OAuth token regardless of how it was obtained. `getAuth(request,
{ acceptsToken: 'oauth_token' })` does not distinguish between tokens
from consent-enabled apps, consent-disabled apps, or DCR-created apps.
Clerk's token verification is the same either way.

**What the test does NOT prove** (and does not claim to):

- That Cursor specifically can complete the flow (deferred to
  `cursor-investigate`)
- That the DCR-created OAuth app in the Clerk dashboard is correctly
  configured (that's Clerk dashboard config, not server code)
- That the consent screen works (disabled for programmatic testing)
- That any specific client's OAuth implementation is correct

**Invariant — consent screen in production**: All product-facing OAuth
applications (including the DCR-created app in the Clerk dashboard) MUST
always have `consentScreenEnabled: true`. Disabling consent is ONLY
permitted for ephemeral smoke-test OAuth apps created and destroyed by
`clerk-oauth-token.ts`. This is a security requirement: without the
consent screen, any logged-in user who visits an OAuth authorization URL
automatically grants access to any requested scopes. The product code
must never create OAuth apps with consent disabled.

### Next Steps: Cursor Investigation

The spec path passes. Investigate Cursor:

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
