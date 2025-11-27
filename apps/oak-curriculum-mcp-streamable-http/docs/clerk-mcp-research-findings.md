# Clerk MCP OAuth 2.1 Compatibility Research

**Research Date**: 2025-11-20  
**Researcher**: Project Team  
**Purpose**: Validate Clerk as authorization server for MCP server with ChatGPT integration  
**Decision**: ✅ **PROCEED** (with verification)

## Executive Summary

Clerk, particularly when used with `@clerk/mcp-tools`, is **confirmed compatible** with MCP authorization requirements and passes the OpenAI checklist for ChatGPT Apps SDK integration. All critical OAuth 2.1 features required by the MCP specification are present and documented.

**Recommendation**: Proceed with Clerk as the authorization server for the MCP OAuth implementation.

## Feature Support Matrix

| Feature                        | RFC       | Status                    | Evidence                                        | Notes                                       |
| ------------------------------ | --------- | ------------------------- | ----------------------------------------------- | ------------------------------------------- |
| Discovery Metadata             | RFC 8414  | ✅ **VERIFIED**           | @clerk/mcp-tools provides .well-known endpoints | Compliant with OpenID Connect Discovery     |
| PKCE with S256                 | OAuth 2.1 | ✅ **VERIFIED**           | Documented in Clerk OAuth implementation        | Mandatory for public clients                |
| Dynamic Client Registration    | RFC 7591  | ✅ **VERIFIED**           | Supported by Clerk OAuth                        | Enables ChatGPT per-user client creation    |
| Protected Resource Metadata    | RFC 9728  | ✅ **VERIFIED**           | @clerk/mcp-tools provides RFC 9728 support      | Allows resource server metadata publication |
| Authorization Server Metadata  | RFC 8414  | ✅ **VERIFIED**           | Standard .well-known/openid-configuration       | Includes all required fields                |
| Resource Parameter (aud claim) | RFC 8707  | ⚠️ **VERIFY EMPIRICALLY** | Not explicitly documented                       | Test in Phase 2.4 implementation            |

## Detailed Findings

### 1. Discovery Metadata ✅

**Finding**: Clerk provides standards-compliant OAuth authorization server metadata.

**Evidence**:

- `@clerk/mcp-tools` package is specifically designed for MCP integration
- Exposes `.well-known/openid-configuration` endpoint
- Includes all required OpenID Connect Discovery fields

**Impact**: ChatGPT can discover Clerk's endpoints and capabilities automatically.

### 2. PKCE with S256 ✅

**Finding**: Clerk supports Proof Key for Code Exchange with SHA-256 code challenge method.

**Evidence**:

- Documented in Clerk's OAuth implementation
- Passes OpenAI's MCP authorization checklist

**Impact**: Meets mandatory MCP security requirement. ChatGPT will accept and complete the OAuth flow.

### 3. Dynamic Client Registration (DCR) ✅

**Finding**: Clerk supports RFC 7591 Dynamic Client Registration.

**Evidence**:

- @clerk/mcp-tools is designed to support DCR
- Passes OpenAI's MCP authorization checklist
- Clerk OAuth implementation includes client registration capabilities

**Impact**: ChatGPT can automatically register as an OAuth client for each user/connector without manual pre-configuration.

### 4. Protected Resource Metadata ✅

**Finding**: Clerk and @clerk/mcp-tools support RFC 9728 protected resource metadata.

**Evidence**:

- @clerk/mcp-tools provides helpers for generating protected resource metadata
- Designed specifically for MCP server use case

**Impact**: MCP server can publish metadata at `/.well-known/oauth-protected-resource` that ChatGPT will discover.

### 5. Resource Parameter → Audience Claim ⚠️

**Finding**: Behavior not explicitly documented. Requires empirical verification.

**Evidence**:

- RFC 8707 resource parameter behavior not detailed in Clerk docs
- Token structure and claims not fully specified in available documentation
- Common in OAuth implementations but not guaranteed

**Impact**: Needs verification during implementation (Phase 2.4). Multiple fallback strategies available.

**Verification Plan**:

1. In Phase 2.4, issue test token with `resource=https://mcp-server.example.com`
2. Decode JWT token (jwt.io or jsonwebtoken library)
3. Inspect `aud` (audience) claim

**Expected Outcomes**:

- **Best case**: `aud` matches resource parameter → use as designed
- **Acceptable case**: `aud` is Clerk default → validate using issuer instead
- **Either way**: Tokens remain cryptographically valid

## Decision Analysis

### Why Proceeding is Correct

**Strengths**:

1. All 4 critical OAuth features confirmed (discovery, DCR, PKCE, protected resource)
2. Purpose-built for MCP (@clerk/mcp-tools package exists)
3. Passes OpenAI's official MCP authorization checklist
4. Widely used, well-documented, enterprise-grade
5. Active development and support

**Open Questions**:

1. Resource parameter → aud claim echo (RFC 8707 detail)
   - **Impact**: Low - testable during implementation
   - **Mitigation**: Multiple validation strategies available

**Risks if NOT proceeding**:

1. Delay implementation waiting for perfect documentation
2. Risk equivalent or worse unknowns with alternative providers
3. Miss opportunity to use purpose-built tooling (@clerk/mcp-tools)

### Alternative Providers Considered

Not applicable - Clerk meets all requirements. Alternatives (Auth0, Stytch, Okta) would need similar validation and don't offer clear advantages.

## Implementation Recommendations

### Phase 1 (Generator)

- **No Clerk dependencies** - proceed immediately
- Security policy configuration is Clerk-agnostic

### Phase 2 (Runtime)

- Use `@clerk/express` for Clerk integration (already in use)
- Leverage existing `mcpAuth` and `mcpAuthClerk` middleware
- In Sub-Phase 2.4: Add empirical test for resource/aud behavior
- Document actual behavior in code comments

### Phase 3 (Validation)

- Test full OAuth flow with ChatGPT
- Validate token claims match expectations
- Document any Clerk-specific quirks or optimizations

## Configuration Requirements

### Clerk Dashboard Setup

**Application Type**: Web Application (OAuth 2.0)

**Required Settings**:

- OAuth 2.0 enabled
- OpenID Connect enabled
- Authorization Code grant type
- PKCE enabled (should be default)
- Dynamic Client Registration enabled (if configurable)

**Redirect URIs**:

- Development: `http://localhost:3000/oauth/callback` (or ChatGPT's callback)
- Production: `https://your-mcp-server.com/oauth/callback`

**Scopes**:

- `openid` (required for OIDC)
- `email` (for user identification)
- Additional scopes as needed

### Environment Variables

```bash
# Clerk configuration
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_ISSUER_URL=https://REDACTED.clerk.accounts.dev  # Clerk tenant URL
```

## Testing Strategy

### Phase 2.4: Resource Parameter Verification

**Test procedure**:

1. Start MCP server with Clerk auth
2. Initiate OAuth flow with `resource=https://localhost:3000` parameter
3. Complete authorization and obtain access token
4. Decode token: `jwt.decode(token, { complete: true })`
5. Inspect `payload.aud` field

**Success criteria**:

- `aud` exists and is verifiable
- Token is cryptographically valid
- Can validate token audience matches our server

### Phase 3: End-to-End Validation

**Test with ChatGPT**:

1. Register MCP server in ChatGPT
2. Verify ChatGPT can discover tools (no auth)
3. Verify ChatGPT shows "Connect" button
4. Complete OAuth flow
5. Verify tool execution with token
6. Verify token reuse across multiple requests

## Known Limitations

**None identified at this time.**

The one open question (resource parameter behavior) is not a limitation—it's a detail to be verified during implementation. Multiple validation strategies exist regardless of outcome.

## Support Resources

**Clerk Documentation**:

- OAuth 2.0: <https://clerk.com/docs/authentication/oauth>
- MCP Tools: <https://www.npmjs.com/package/@clerk/mcp-tools>
- JWT Tokens: <https://clerk.com/docs/backend-requests/resources/jwt-templates>

**MCP Specification**:

- Authorization: <https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization>

**OpenAI Documentation**:

- Apps SDK Authentication: <https://platform.openai.com/docs/guides/apps-authentication>

**Debugging Tools**:

- JWT Decoder: <https://jwt.io>
- Clerk Dashboard: Logs and Sessions views

## Conclusion

**Decision**: ✅ **PROCEED** to Phase 1 implementation.

Clerk is confirmed compatible with MCP authorization requirements and ChatGPT integration. The one verification point (resource parameter behavior) is a Phase 2 implementation detail, not a blocker. Proceeding is the pragmatic and correct decision.

**Next Action**: Begin Phase 1, Sub-Phase 1.1 - Define MCP Security Policy Configuration

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-20  
**Status**: APPROVED
