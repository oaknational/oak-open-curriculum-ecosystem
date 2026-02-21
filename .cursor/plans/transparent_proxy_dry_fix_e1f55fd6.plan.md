---
name: Transparent proxy DRY fix
overview: Remove all defensive `openid` filtering from the proxy (restoring true transparent passthrough), fix the DRY violation in aggregated tool definitions, and audit all remaining `openid` references.
todos:
  - id: remove-filtering-red
    content: "RED: Update/delete tests for stripUnsupportedScopes and rewriteAuthServerMetadata scope filtering; add transparent passthrough assertion to authorize integration test"
    status: completed
  - id: remove-filtering-green
    content: "GREEN: Delete CLERK_UNSUPPORTED_DYNAMIC_CLIENT_SCOPES, stripUnsupportedScopes, scope filter in rewriteAuthServerMetadata, and stripUnsupportedScopes call in handleAuthorize"
    status: completed
  - id: update-tsdoc-proxy
    content: Update TSDoc in mcp-security-policy.ts to remove proxy filtering mention; verify proxy module TSDoc is now truthful
    status: completed
  - id: fix-dry-aggregated
    content: "Fix DRY violation: 9 aggregated tool definitions import SCOPES_SUPPORTED instead of hardcoding scopes"
    status: completed
  - id: update-plan-doc
    content: Update proxy-oauth-as-for-cursor.plan.md to reflect transparent proxy restoration
    status: completed
  - id: quality-gates-final
    content: Run full quality gate chain and invoke reviewers
    status: completed
isProject: false
---

# Transparent Proxy and DRY Fix

## Rationale

The proxy's documented contract says "MUST NOT alter, filter, or lose information." The `stripUnsupportedScopes` and `scopes_supported` filtering contradict this. Since `openid` is no longer in our PRM (`SCOPES_SUPPORTED`), clients will not request it. The AS metadata should pass through Clerk's scopes verbatim -- a client that reads AS metadata scopes and requests `openid` is behaving non-standardly (RFC 9728 says clients should use PRM `scopes_supported` for resource access).

## Occurrence Audit (30 `openid` in *.ts files)

### KEEP as-is (14 occurrences)

- `conditional-clerk-middleware.ts:38` and `conditional-clerk-middleware.unit.test.ts:23` -- `/.well-known/openid-configuration` URL path, not the scope
- `oauth-discovery.ts:150,157` -- same OIDC discovery URL path
- [upstream-metadata-fixture.ts:17](apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/upstream-metadata-fixture.ts) -- `scopes_supported: ['openid', 'profile', 'email']` -- represents real Clerk upstream data
- `auth-error-detector.unit.test.ts:141` -- `'Required scope: openid'` as test error message
- `mcp-security-policy.unit.test.ts:41-42` -- negative assertion `not.toContain('openid')`
- `auth-routes.integration.test.ts:155,170` -- negative assertion on PRM scopes
- `auth-enforcement.e2e.test.ts:377` -- negative assertion on PRM scopes
- `oauth-proxy-upstream.unit.test.ts:26` -- `TEST_UPSTREAM_METADATA` fixture (upstream data)
- `oauth-proxy-upstream.unit.test.ts:52,63` -- `buildAuthorizeRedirectUrl` test (tests URL construction, not filtering)
- `oauth-proxy-upstream.unit.test.ts:249` -- `isUpstreamAuthServerMetadata` validation test

### REMOVE (9 occurrences -- defensive filtering)

All in `oauth-proxy-upstream.ts` and its test file:

- [oauth-proxy-upstream.ts:122-152](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts) -- `CLERK_UNSUPPORTED_DYNAMIC_CLIENT_SCOPES`, `stripUnsupportedScopes()` function, and all TSDoc
- [oauth-proxy-upstream.ts:159,176-178](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts) -- `scopes_supported` filter in `rewriteAuthServerMetadata()` + its TSDoc line
- [oauth-proxy-routes.ts:156](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts) -- `stripUnsupportedScopes(queryParams)` call + import
- [oauth-proxy-upstream.unit.test.ts:136-141](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.unit.test.ts) -- `'filters openid from scopes_supported'` test
- [oauth-proxy-upstream.unit.test.ts:182-205](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.unit.test.ts) -- entire `describe('stripUnsupportedScopes')` block (4 tests)

### UPDATE (7 occurrences -- TSDoc and tests)

- [mcp-security-policy.ts:46-47](packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.ts) -- remove mention of "proxy layer additionally strips" since we are removing that
- [oauth-proxy-routes.integration.test.ts:102](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.integration.test.ts) -- test sends `scope: 'openid email'`; add assertion that `openid` IS forwarded in the redirect URL (proving transparent passthrough)

## Step 1: Remove Defensive Filtering (TDD)

### RED -- Update tests first

In [oauth-proxy-upstream.unit.test.ts](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.unit.test.ts):

- **Replace** the `'filters openid from scopes_supported'` test (line 136) with a test asserting `scopes_supported` is passed through unchanged (including `openid`)
- **Delete** entire `describe('stripUnsupportedScopes')` block (lines 182-205, 4 tests) -- function will no longer exist

In [oauth-proxy-routes.integration.test.ts](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.integration.test.ts):

- **Add assertion** to the `/oauth/authorize` test (line 108-114) that the redirect URL contains `scope=openid` -- proving transparent passthrough

### GREEN -- Remove filtering code

In [oauth-proxy-upstream.ts](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts):

- **Delete** `CLERK_UNSUPPORTED_DYNAMIC_CLIENT_SCOPES` constant (lines 122-129)
- **Delete** `stripUnsupportedScopes()` function (lines 131-152)
- **Remove** the `scopes_supported` filter from `rewriteAuthServerMetadata()` -- change the spread to pass through `scopes_supported` unchanged (remove lines 176-178, just let the spread handle it)
- **Update** `rewriteAuthServerMetadata()` TSDoc to remove mention of scope filtering

In [oauth-proxy-routes.ts](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts):

- **Remove** `stripUnsupportedScopes(queryParams)` call (line 156)
- **Remove** `stripUnsupportedScopes` from the import

### REFACTOR -- Update TSDoc

- [mcp-security-policy.ts](packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.ts) lines 46-47: remove the paragraph about proxy filtering
- The module-level TSDoc in `oauth-proxy-routes.ts` (lines 9-12) and `oauth-proxy-upstream.ts` (lines 4-6) already say "transparent passthrough" -- they are now truthful again

## Step 2: Fix DRY Violation

The 9 hand-written aggregated tool definitions hardcode `scopes: ['email']`. They should derive from the generated `SCOPES_SUPPORTED` constant.

Each file gets:

- An import: `import { SCOPES_SUPPORTED } from '../types/generated/api-schema/mcp-tools/generated/data/scopes-supported.js';` (path varies by depth)
- Change: `scopes: ['email']` to `scopes: [...SCOPES_SUPPORTED]`

Files (all in `packages/sdks/oak-curriculum-sdk/src/mcp/`):

- [aggregated-thread-progressions.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts)
- [aggregated-ontology.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts)
- [aggregated-prerequisite-graph.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts)
- [aggregated-fetch.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts)
- [aggregated-explore/tool-definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts)
- [aggregated-browse/tool-definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts)
- [aggregated-search-sdk/tool-definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/tool-definition.ts)
- [aggregated-search/tool-definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts)
- [aggregated-help/definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts)

## Step 3: Update Plan and Documentation

- [proxy-oauth-as-for-cursor.plan.md](/.agent/plans/semantic-search/archive/completed/proxy-oauth-as-for-cursor.plan.md): Updated and archived. ADR-115 written.

## Step 4: Quality Gates

Full chain: `pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e`
