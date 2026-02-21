---
name: Purge openid scope
overview: Remove `openid` from the MCP server's own scope definitions (source of truth, generated code, hand-written tool defs, tests), add ADR troubleshooting documentation, and add TSDoc explaining the DCR incompatibility. Keep `openid` only where it explains the issue or defends against upstream metadata.
todos:
  - id: adr-troubleshooting
    content: Add troubleshooting section to ADR-113 documenting openid/DCR silent failure, diagnosis via HAR, and resolution
    status: completed
  - id: tsdoc-security-policy
    content: Add TSDoc to DEFAULT_AUTH_SCHEME in mcp-security-policy.ts explaining why openid is excluded (Clerk DCR incompatibility)
    status: completed
  - id: source-of-truth
    content: Remove openid from DEFAULT_AUTH_SCHEME.scopes in mcp-security-policy.ts, run pnpm type-gen to cascade
    status: completed
  - id: aggregated-tools
    content: Update 9 hand-written aggregated tool definitions to remove openid from securitySchemes scopes
    status: completed
  - id: update-tests
    content: Update 7 test files that assert openid is a supported scope
    status: completed
  - id: simplify-runtime
    content: Remove .filter openid from auth-routes.ts PRM handler (no longer needed)
    status: completed
  - id: update-tsdoc-examples
    content: Update TSDoc examples in security-types.ts and apply-security-policy.ts
    status: completed
  - id: quality-gates
    content: "Run full quality gate chain: type-gen, build, type-check, lint, format, tests, e2e"
    status: completed
isProject: false
---

# Purge `openid` Scope and Document the Issue

## 1. ADR-113: Add Troubleshooting Section

Add a new section to [ADR-113](docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md) after the existing Amendment, documenting the `openid` silent failure:

- **What happened**: Clerk rejects `openid` for DCR clients with `error=invalid_scope`
- **Why it was silent**: OAuth spec routes auth errors via redirect to `redirect_uri`, bypassing the server entirely. Cursor receives the error callback but doesn't surface it -- just loops `needsAuth -> cleared -> needsAuth`
- **How to diagnose**: Only visible in HAR capture of the Clerk redirect `Location` header
- **Resolution**: `openid` removed from scope definitions; defensive stripping in the proxy for upstream metadata

## 2. TSDoc at Scope Definition Point

Update [mcp-security-policy.ts](packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.ts) `DEFAULT_AUTH_SCHEME` TSDoc to explain:

- Why `openid` is excluded (Clerk DCR incompatibility)
- That MCP only needs an access token, not an OIDC ID token
- That the defensive proxy filtering in `oauth-proxy-upstream.ts` still guards against upstream metadata

## 3. Remove `openid` from Source of Truth

Change `DEFAULT_AUTH_SCHEME.scopes` in [mcp-security-policy.ts](packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.ts) from `['openid', 'email']` to `['email']`.

Run `pnpm type-gen` to cascade through all generated files:

- [scopes-supported.ts](packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/scopes-supported.ts) -- `SCOPES_SUPPORTED` becomes `['email']`
- All 23 generated tool files -- `securitySchemes` scopes become `['email']`

## 4. Update Hand-Written Aggregated Tool Definitions (9 files)

These hardcode `securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }]` and must be updated manually to `scopes: ['email']`:

- [aggregated-thread-progressions.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts)
- [aggregated-ontology.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts)
- [aggregated-prerequisite-graph.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts)
- [aggregated-fetch.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts)
- [aggregated-explore/tool-definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts)
- [aggregated-browse/tool-definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts)
- [aggregated-search-sdk/tool-definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/tool-definition.ts)
- [aggregated-search/tool-definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts)
- [aggregated-help/definition.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts)

## 5. Update Tests That Assert `openid` Exists

These tests assert `openid` is a supported scope and must be updated:

- [mcp-security-policy.unit.test.ts](packages/sdks/oak-curriculum-sdk/type-gen/mcp-security-policy.unit.test.ts) -- remove `'includes required openid scope'` test; update `getScopesSupported` assertion from `['email', 'openid']` to `['email']`
- [generate-scopes-supported-file.unit.test.ts](packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-scopes-supported-file.unit.test.ts) -- update assertion
- [emit-index.invoke.unit.test.ts](packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.invoke.unit.test.ts) -- update assertion
- [mcp-tool-generator.unit.test.ts](packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.unit.test.ts) -- update assertion
- [check-mcp-client-auth.unit.test.ts](apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.unit.test.ts) -- update test fixtures from `['openid', 'email']` to `['email']`
- [auth-enforcement.e2e.test.ts](apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts) line 376 -- currently asserts `openid` is present in PRM scopes; update to `['email']`
- [auth-error-response.unit.test.ts](apps/oak-curriculum-mcp-streamable-http/src/auth-error-response.unit.test.ts) -- update error message from `'Required scopes: openid, email'` to `'Required scopes: email'`

## 6. Simplify Runtime Filtering

In [auth-routes.ts](apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts) line 84, remove the now-unnecessary filter:

```typescript
// BEFORE:
scopes_supported: SCOPES_SUPPORTED.filter((s) => s !== 'openid'),

// AFTER:
scopes_supported: SCOPES_SUPPORTED,
```

## 7. Update TSDoc Examples

- [security-types.ts](packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/security-types.ts) -- example `scopes: ['openid', 'email']` -> `scopes: ['email']`
- [apply-security-policy.ts](packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/apply-security-policy.ts) -- example comment -> `scopes: ['email']`

## What to KEEP (intentionally retaining `openid`)

- **Upstream metadata fixtures** ([upstream-metadata-fixture.ts](apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/upstream-metadata-fixture.ts), `TEST_UPSTREAM_METADATA` in oauth-proxy unit tests) -- these correctly represent what Clerk returns and test that our filtering works
- **Defensive proxy filtering** (`CLERK_UNSUPPORTED_DYNAMIC_CLIENT_SCOPES`, `stripUnsupportedScopes`, `rewriteAuthServerMetadata` scope filter in [oauth-proxy-upstream.ts](apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts)) -- guards against upstream AS metadata still advertising `openid`
- **Tests for the filtering** (proxy unit tests for `stripUnsupportedScopes` and `rewriteAuthServerMetadata`)
- **OIDC discovery path** (`/.well-known/openid-configuration` in [conditional-clerk-middleware.ts](apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.ts) and [oauth-discovery.ts](apps/oak-curriculum-mcp-streamable-http/smoke-tests/smoke-assertions/oauth-discovery.ts)) -- this is a URL path, not the scope
- **Archive/research docs** -- historical record
- **Plan file** -- already updated with full diagnosis
- **ADR-113 troubleshooting section** (new) -- documents the issue

## TDD Order

1. RED: Update tests first (steps 5, 7) to assert `openid` is absent
2. GREEN: Change source of truth (step 3), run `type-gen` (step 3), update hand-written defs (step 4), simplify runtime (step 6)
3. Documentation: ADR (step 1), TSDoc (step 2)
4. Quality gates: full suite
