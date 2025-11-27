# ChatGPT OAuth Requirements Speculation and Guessing

**STATUS: SUPERSEDED** - See [MCP OAuth Security Implementation Plan](../plans/schema-first-security-implementation.md)

This document contains useful analysis but is based on an incorrect assumption that MCP security metadata should be read from the Oak Curriculum OpenAPI schema. In reality:

1. Oak API auth is handled by the SDK (not our concern)
2. MCP OAuth 2.1 is a separate layer (our concern)
3. Security policy is defined in configuration, not read from upstream schema
4. Generator applies policy to all tools at type-gen time

Date: 2025-11-20  
Last Updated: 2025-11-20  
**Superseded**: 2024-11-20 by policy-driven implementation plan

## References

**Internal Documentation:**

- `.agent/reference-docs/openai-apps-auth.md` - OpenAI ChatGPT Apps SDK Authentication Guide
- `.agent/reference-docs/mcp-auth-spec.md` - MCP Authorization Specification (2025-06-18)
- `.agent/reference-docs/clerk-build-mcp-server.md` - Clerk MCP Server Integration Guide
- `.agent/reference-docs/clerk-express-sdk.md` - Clerk Express SDK Reference

**External Specifications:**

- [MCP Authorization Spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)
- [RFC 9728 - OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728)
- [RFC 8414 - OAuth 2.0 Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414)
- [RFC 7591 - OAuth 2.0 Dynamic Client Registration](https://datatracker.ietf.org/doc/html/rfc7591)
- [RFC 8707 - Resource Indicators for OAuth 2.0](https://www.rfc-editor.org/rfc/rfc8707.html)
- [OAuth 2.1 IETF Draft](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13)

## Executive Summary

This document analyzes our current MCP OAuth implementation against two distinct but overlapping specifications:

1. **MCP Authorization Specification** (RFC-based, transport-level)
2. **OpenAI ChatGPT Apps SDK** (application-level, per-tool metadata)

Our implementation uses Clerk as the authorization server and fully implements the MCP authorization spec. However, ChatGPT requires additional application-level features for proper OAuth UI integration.

**Status**: ⚠️ **MCP Spec Compliant / ChatGPT Partially Compatible**

⚠️ **CRITICAL ASSUMPTIONS IN THIS DOCUMENT**: This analysis contains assumptions that may be incorrect. See [Assumptions & Limitations](#assumptions--limitations) section below.

## Assumptions & Limitations

### Known Assumptions Made in This Analysis

1. **CORRECTED ASSUMPTION**: ~~Cursor uses STDIO transport~~
   - **Reality**: Cursor uses HTTP transport to the same streamable HTTP server
   - **Impact**: All MCP clients accessing our HTTP server need compatible auth
   - **Source**: User correction

2. **ASSUMPTION**: All tools in our system should have uniform authentication requirements
   - **Reality**: Unknown - OpenAI spec supports mixed auth (some tools `noauth`, others `oauth2`)
   - **Impact**: May be over-constraining our design
   - **Verification needed**: Review API design and business requirements

3. **ASSUMPTION**: ChatGPT will not work without per-tool `securitySchemes`
   - **Reality**: Partially verified - OpenAI docs state "both metadata and runtime errors" needed
   - **Impact**: Blocks initial tool discovery
   - **Verification needed**: Test with real ChatGPT instance

4. **ASSUMPTION**: The MCP spec's transport-level auth and OpenAI's application-level auth are compatible
   - **Reality**: They layer different concerns but the interaction is complex
   - **Impact**: May need method-level auth bypass for discovery
   - **Verification needed**: Review both specs in detail, test with multiple clients

5. **ASSUMPTION**: Clerk's `@clerk/mcp-tools` package is production-ready and secure
   - **Reality**: Package exists and is documented by Clerk
   - **Impact**: We're not using it; we built custom integration
   - **Verification needed**: Compare our approach vs Clerk's recommended approach

6. **ASSUMPTION**: Our current "all or nothing" transport-level auth is the correct interpretation of MCP spec
   - **Reality**: MCP spec says auth is OPTIONAL and primarily defines how to do it, not when
   - **Impact**: May be blocking legitimate discovery flows
   - **Source**: MCP spec line 20: "Authorization is **OPTIONAL** for MCP implementations"

### Limitations of This Analysis

- ❌ **No real ChatGPT testing performed** - Analysis based on documentation only
- ❌ **No real Cursor testing performed** - HTTP transport usage not verified
- ❌ **No Claude Desktop testing performed** - Behavior unknown
- ❌ **Clerk integration not compared to reference implementation** - Using custom code vs `@clerk/mcp-tools`
- ⚠️ **May have additional undiscovered assumptions** - This list is likely incomplete

### Critical Unknown: Client Diversity

**QUESTION**: Do all HTTP-based MCP clients expect the same auth flow?

| Client         | Transport         | Auth Expectations                   | Verified?         |
| -------------- | ----------------- | ----------------------------------- | ----------------- |
| ChatGPT        | HTTP (Streamable) | Per-tool metadata + OAuth discovery | ❌ No (docs only) |
| Cursor         | HTTP (Streamable) | **UNKNOWN**                         | ❌ No             |
| Claude Desktop | HTTP or STDIO     | **UNKNOWN**                         | ❌ No             |
| MCP Inspector  | HTTP (Streamable) | **UNKNOWN**                         | ❌ No             |
| Custom clients | HTTP (Streamable) | Varies                              | ❌ No             |

**This is a critical gap**: We may be designing for ChatGPT while breaking compatibility with other clients.

## Two Distinct Auth Models

### Model 1: MCP Authorization Specification (Transport-Level)

**Source**: [MCP Auth Spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization) (`.agent/reference-docs/mcp-auth-spec.md`)

**Key characteristics:**

- **Transport-level authentication** - OAuth happens before MCP protocol messages
- **All-or-nothing** - Either authenticated or not at HTTP level
- **WWW-Authenticate headers** - Server returns 401 with discovery metadata
- **RFC-based** - Built on OAuth 2.1, RFC 9728, RFC 8414, RFC 7591
- **Optional** - "Authorization is OPTIONAL for MCP implementations" (line 20)

**Flow:**

```text
1. Client → Server: MCP request (no token)
2. Server → Client: 401 + WWW-Authenticate header
3. Client discovers OAuth metadata
4. Client performs OAuth flow, gets token
5. Client → Server: All requests with Bearer token
```

**This is what we currently implement.**

### Model 2: OpenAI ChatGPT Apps SDK (Application-Level)

**Source**: [OpenAI Apps Auth](https://openai.com) (`.agent/reference-docs/openai-apps-auth.md`)

**Key characteristics:**

- **Application-level metadata** - Per-tool `securitySchemes` declarations
- **Mixed auth** - Some tools can be `noauth`, others `oauth2`
- **UI-driven** - `securitySchemes` trigger OAuth linking UI in ChatGPT
- **Discovery without auth** - Client must fetch `tools/list` without Bearer token
- **Tool-level challenges** - Tools can return `_meta["mcp/www_authenticate"]` for dynamic auth prompts

**Flow:**

```text
1. Client → Server: tools/list (NO auth!)
2. Server → Client: Tools with securitySchemes metadata
3. Client sees OAuth required, shows "Connect" button
4. Client performs OAuth flow, gets token
5. Client → Server: tools/call with Bearer token
```

**This is what ChatGPT expects but we don't implement.**

### Critical Difference: Discovery Phase

| Aspect                               | MCP Spec                              | OpenAI ChatGPT                  |
| ------------------------------------ | ------------------------------------- | ------------------------------- |
| Can fetch `tools/list` without auth? | Not specified (implementation choice) | **YES (required)**              |
| Per-tool auth metadata               | Not mentioned                         | **YES (required)**              |
| Where auth enforced                  | Transport (HTTP 401)                  | Method-level (per operation)    |
| Tool-level errors                    | Standard MCP errors                   | `_meta["mcp/www_authenticate"]` |

### Are They Compatible?

**YES - if you implement both layers:**

1. **Discovery layer** (OpenAI requirement):
   - Allow `initialize` and `tools/list` without Bearer token
   - Return tools with `securitySchemes` metadata
   - This is application-level logic

2. **Execution layer** (MCP spec):
   - Require Bearer token for `tools/call`
   - Return 401 with WWW-Authenticate if missing/invalid
   - This is transport-level logic

**Our current problem**: We enforce auth at transport level for ALL methods, blocking discovery.

### Per-Tool Auth ≠ Uniform Auth

**IMPORTANT CLARIFICATION**: OpenAI spec does NOT require all tools to have the same auth.

Valid configurations:

```typescript
// All tools require OAuth (our intended design)
tools: [
  { name: 'tool-1', securitySchemes: [{ type: 'oauth2', scopes: ['read'] }] },
  { name: 'tool-2', securitySchemes: [{ type: 'oauth2', scopes: ['read'] }] },
];

// Mixed auth (some public, some require OAuth)
tools: [
  { name: 'search-public', securitySchemes: [{ type: 'noauth' }] },
  { name: 'get-user-data', securitySchemes: [{ type: 'oauth2', scopes: ['profile'] }] },
];

// Optional auth (tool works without auth but provides more with auth)
tools: [
  {
    name: 'search',
    securitySchemes: [{ type: 'noauth' }, { type: 'oauth2', scopes: ['advanced'] }],
  },
];
```

**Our assumption**: All tools need same auth. **Reality**: Flexible, per-tool declarations supported.

## Requirements Comparison

### ✅ Requirement 1: Host Protected Resource Metadata on MCP Server

**Required**: HTTPS endpoint at `/.well-known/oauth-protected-resource` returning JSON with:

- `resource`: canonical HTTPS identifier for MCP server
- `authorization_servers`: array of issuer base URLs
- `scopes_supported`: optional list of permissions
- Optional extras from RFC 9728

**Our Implementation**:

```typescript
// File: apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts

app.get('/.well-known/oauth-protected-resource', (req, res) => {
  const publishableKey = runtimeConfig.env.CLERK_PUBLISHABLE_KEY;
  const host = req.get('host');

  // Use http for localhost development, https for all other hosts
  const protocol = host.startsWith('localhost:') || host === 'localhost' ? 'http' : 'https';
  const resourceUrl = `${protocol}://${host}/mcp`;

  const metadata = generateClerkProtectedResourceMetadata({
    publishableKey,
    resourceUrl,
    properties: {
      scopes_supported: ['openid', 'email'],
    },
  });

  res.json(metadata);
});
```

**Status**: ✅ **Compliant**

- Endpoint is publicly accessible (registered before auth middleware)
- Returns proper JSON structure via `generateClerkProtectedResourceMetadata` from Clerk
- `resource` field correctly identifies the `/mcp` endpoint
- Protocol determination is localhost-aware (http for localhost, https otherwise)
- Returns `authorization_servers` array pointing to Clerk

**Test Coverage**: Extensive

- Integration tests verify protocol handling
- E2E tests validate metadata structure
- Smoke tests confirm accessibility

### ✅ Requirement 2: Publish OAuth Metadata from Authorization Server

**Required**: Authorization server must expose discovery metadata at:

- `/.well-known/oauth-authorization-server` (OAuth 2.0)
- `/.well-known/openid-configuration` (OpenID Connect)

Must include:

- `authorization_endpoint`, `token_endpoint`, `jwks_uri`
- `registration_endpoint` for dynamic client registration (DCR)
- `code_challenge_methods_supported` must include `S256` (PKCE)

**Our Implementation**:

Handled entirely by **Clerk**. We use `generateClerkProtectedResourceMetadata()` which extracts the Clerk authorization server URL from the publishable key and includes it in the `authorization_servers` array.

**Status**: ✅ **Compliant**

- Clerk publishes complete OAuth metadata
- Supports dynamic client registration (DCR)
- Advertises PKCE support with `S256`
- Our server correctly does NOT proxy authorization server metadata (E2E test verifies 404 on `/.well-known/oauth-authorization-server`)

**Evidence**:

```typescript
// E2E test confirms we don't proxy AS metadata
it('does not proxy authorization server metadata', async () => {
  const res = await request(app).get('/.well-known/oauth-authorization-server');
  expect(res.status).toBe(404); // Correct behavior per MCP spec
});
```

### ✅ Requirement 3: Echo the `resource` Parameter Throughout OAuth Flow

**Required**:

- Expect `resource` query parameter in authorization and token requests
- Copy value into access token (commonly as `aud` claim)
- Verify token audience matches expected resource

**Our Implementation**:

Handled by **Clerk**. Our token verification uses `@clerk/express`:

```typescript
// File: apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts

const authData = getAuth(req, { acceptsToken: 'oauth_token' });
```

Clerk's `getAuth()` with `acceptsToken: 'oauth_token'` verifies:

- Token signature (JWKS validation)
- Issuer (`iss`)
- Audience (`aud`)
- Expiration (`exp`)
- Not-before (`nbf`)

**Status**: ✅ **Compliant**

- Clerk handles resource parameter echoing
- Token verification includes audience validation
- Our middleware correctly uses `oauth_token` type

**Code Path**:

1. Client sends `resource` parameter → Clerk authorization server
2. Clerk mints token with `aud` claim matching `resource`
3. Our middleware verifies token via `getAuth(req, { acceptsToken: 'oauth_token' })`
4. Clerk SDK validates `aud` claim automatically

### ✅ Requirement 4: Advertise PKCE Support for ChatGPT

**Required**: `code_challenge_methods_supported` must include `S256`

**Our Implementation**: Handled by **Clerk**'s authorization server metadata.

**Status**: ✅ **Compliant**

- Clerk advertises PKCE support
- ChatGPT can discover this from Clerk's metadata endpoint

### ✅ Requirement 5: Implement Token Verification

**Required**: Verify tokens on each request:

- Signature validation (JWKS)
- Issuer and audience matching
- Expiry (`exp`/`nbf`)
- Scope enforcement

**Our Implementation**:

```typescript
// File: apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.ts

export function verifyClerkToken(
  auth: MachineAuthObject<'oauth_token'>,
  token: string | undefined,
): AuthInfo | undefined {
  // Token verification is performed by Clerk SDK before this function

  if (!token || !auth.isAuthenticated) {
    return undefined;
  }

  // Verify required fields are present
  if (!auth.clientId || !auth.scopes || !auth.userId) {
    return undefined;
  }

  // Return MCP SDK AuthInfo format
  return {
    token,
    scopes: auth.scopes,
    clientId: auth.clientId,
    extra: { userId: auth.userId },
  };
}
```

**Status**: ✅ **Compliant**

- Clerk SDK performs comprehensive token verification
- We validate required fields are present
- Return 401 with WWW-Authenticate header on failure

### ✅ Requirement 6: WWW-Authenticate Challenge on 401

**Required**: When blocking unauthenticated requests, return:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://your-mcp.example.com/.well-known/oauth-protected-resource",
                         scope="files:read"
```

**Our Implementation**:

```typescript
// File: apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts

if (!req.headers.authorization) {
  res
    .status(401)
    .set({ 'WWW-Authenticate': `Bearer resource_metadata=${prmUrl}` })
    .send({ error: 'Unauthorized' });
  return;
}

// Invalid Bearer format
if (parts.length !== 2 || parts[0] !== 'Bearer') {
  res
    .status(401)
    .set({
      'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}", error="invalid_request", error_description="Invalid Authorization header format. Must be 'Bearer <token>'."`,
    })
    .send({ error: 'Unauthorized', message: 'Invalid Authorization header format.' });
  return;
}
```

**Status**: ✅ **Compliant**

- Returns proper WWW-Authenticate header with resource_metadata URL
- Includes error and error_description for invalid tokens
- Tested extensively (unit + integration + E2E)

---

## ❌ ChatGPT-Specific Requirements (Missing)

### ❌ Requirement 7: Per-Tool Security Schemes

**Required by ChatGPT**: Declare `securitySchemes` on **each tool** to control when OAuth UI is triggered:

```typescript
server.registerTool(
  'search',
  {
    title: 'Public Search',
    description: 'Search public documents.',
    inputSchema: {
      /* ... */
    },
    securitySchemes: [{ type: 'noauth' }, { type: 'oauth2', scopes: ['search.read'] }],
  },
  async ({ input }) => {
    /* ... */
  },
);
```

**Our Implementation**: ❌ **NOT IMPLEMENTED**

Our tool generation does not emit `securitySchemes`:

```typescript
// File: packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/get-key-stages.ts

export const getKeyStages = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => { /* ... */ },
  toolZodSchema,
  toolInputJsonSchema,
  // ❌ Missing: securitySchemes
  toolOutputJsonSchema: primaryResponseDescriptor.json,
  zodOutputSchema: primaryResponseDescriptor.zod,
  describeToolArgs,
  inputSchema: toolInputJsonSchema,
  operationId,
  name,
  description: "This tool returns all the key stages...",
  path,
  method,
  documentedStatuses,
  validateOutput: (data: unknown) => { /* ... */ },
} as const satisfies ToolDescriptor<...>;
```

**Impact**:

- ChatGPT cannot determine which tools require authentication
- May default to requiring auth for all tools or none
- OAuth linking UI may not trigger correctly
- Cannot support mixed auth scenarios (some tools public, some require auth)

**Required Changes**:

1. Add `securitySchemes` to `ToolDescriptor` interface in generator
2. Read security requirements from OpenAPI schema `security` field
3. Emit `securitySchemes` array in generated tool descriptors
4. Map OpenAPI security schemes to MCP format:
   - OpenAPI `[]` (no security) → `{ type: 'noauth' }`
   - OpenAPI `[{ bearerAuth: [] }]` → `{ type: 'oauth2', scopes: [...] }`

### ❌ Requirement 8: Tool-Level `_meta["mcp/www_authenticate"]`

**Required by ChatGPT**: Tool handlers must emit `_meta["mcp/www_authenticate"]` in error responses:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [{ "type": "text", "text": "Authentication required: no access token provided." }],
    "_meta": {
      "mcp/www_authenticate": [
        "'Bearer resource_metadata=\"https://your-mcp.example.com/.well-known/oauth-protected-resource\", error=\"insufficient_scope\", error_description=\"You need to login to continue\"'"
      ]
    },
    "isError": true
  }
}
```

**Our Implementation**: ❌ **NOT IMPLEMENTED**

Our tool handlers return standard MCP error responses without `_meta`:

```typescript
// Generated tool execution does not emit _meta
const response = await call(validation.data);
const status = response.response.status;
// ... validation ...
return payload as z.infer<typeof descriptorForStatus.zod>;
```

Our middleware returns HTTP 401 with WWW-Authenticate header, but this is at the **transport level**, not the **tool level**.

**Impact**:

- ChatGPT may not trigger OAuth linking UI when a tool requires elevated permissions
- Tool-level authentication requirements cannot be communicated dynamically
- Cannot prompt user to re-authenticate mid-session for privileged operations

**Required Changes**:

1. Modify tool invoke signature to accept `AuthInfo` (from request context)
2. Add logic to check scopes against tool requirements
3. Return `_meta["mcp/www_authenticate"]` in tool results when auth is insufficient
4. Format as MCP result with `isError: true`

---

## Clerk vs. Custom Authorization Server

**Current**: We use Clerk as our authorization server.

**Clerk Advantages**:

- ✅ Fully managed OAuth 2.1 implementation
- ✅ Supports dynamic client registration (DCR)
- ✅ Advertises PKCE with S256
- ✅ Publishes proper discovery metadata
- ✅ Handles resource parameter echoing
- ✅ Provides JWKS endpoint for token verification
- ✅ Production-ready security

**Clerk Limitations**:

- ⚠️ Generates many short-lived clients (DCR creates one per session)
- ⚠️ Waiting for CMID (Client Metadata Documents) support to reduce client proliferation

**Recommendation**: Continue using Clerk. It meets all core OAuth requirements and is actively maintained for MCP use cases.

---

## Client Identification

**OpenAI Guidance**:

> Today the only reliable control is network-level filtering, such as allowlisting ChatGPT's published egress IP ranges. ChatGPT does not support machine-to-machine OAuth grants such as client credentials, service accounts, or JWT bearer assertions, nor can it present custom API keys or mTLS certificates.

**Our Implementation**: ❌ **NOT IMPLEMENTED**

We do not filter by IP address or implement client identification.

**Impact**:

- Any OAuth client (not just ChatGPT) can authenticate
- Cannot enforce ChatGPT-specific policies
- Cannot distinguish between ChatGPT and other MCP clients

**Future**: Wait for CMID (Client Metadata Documents) to identify ChatGPT via its signed metadata document.

---

## Summary Table

| Requirement                                   | Status | Implementation                            | ChatGPT-Specific? |
| --------------------------------------------- | ------ | ----------------------------------------- | ----------------- |
| Protected resource metadata endpoint          | ✅     | Implemented with localhost-aware protocol | No                |
| Authorization server discovery                | ✅     | Delegated to Clerk                        | No                |
| Resource parameter echoing                    | ✅     | Handled by Clerk                          | No                |
| PKCE support (S256)                           | ✅     | Advertised by Clerk                       | No                |
| Token verification (signature, iss, aud, exp) | ✅     | Via `@clerk/express`                      | No                |
| WWW-Authenticate challenge on 401             | ✅     | Implemented in `mcpAuth` middleware       | No                |
| Per-tool securitySchemes                      | ❌     | Not generated                             | **Yes**           |
| Tool-level \_meta["mcp/www_authenticate"]     | ❌     | Not implemented                           | **Yes**           |
| Client identification                         | ❌     | No IP filtering                           | **Yes**           |

---

## Recommendations

### Priority 1: ChatGPT Compatibility (Required for OAuth Linking UI)

1. **Add `securitySchemes` to Tool Descriptors**
   - Generator change in `packages/sdks/oak-curriculum-sdk/type-gen`
   - Read from OpenAPI schema `security` field
   - Emit in tool descriptor interface
   - Map to MCP format (`noauth`, `oauth2`)

2. **Implement Tool-Level Auth Challenges**
   - Modify tool execution to accept `AuthInfo`
   - Check scopes against tool requirements
   - Return `_meta["mcp/www_authenticate"]` when insufficient
   - Format properly for ChatGPT parsing

### Priority 2: Enhanced Security (Optional)

1. **Client Identification**
   - Monitor OpenAI's CMID spec progress
   - Implement IP allowlisting for ChatGPT egress IPs (interim solution)
   - Add telemetry to track OAuth client types

2. **Scope Refinement**
   - Define granular scopes beyond `openid` and `email`
   - Map API operations to scopes (e.g., `curriculum:read`, `lessons:read`)
   - Update Clerk configuration with new scopes

### Priority 3: Developer Experience

1. **Local Testing with OAuth**
   - Document local OAuth flow testing
   - Provide test credentials for Clerk development tenant
   - Add smoke tests for OAuth flow

2. **Documentation**
   - Add ChatGPT-specific configuration guide
   - Document differences between Claude Desktop and ChatGPT OAuth flows
   - Provide troubleshooting guide for OAuth issues

---

## Open Questions

### Architecture Decisions

1. **Should we have separate MCP and OpenAI endpoints with different auth schemes?**
   - **Option A**: Separate endpoints
     - `/mcp` - Standard MCP transport-level auth (current behavior)
     - `/mcp/openai` - OpenAI-compatible with method-level auth bypass
     - Pros: Backward compatibility, clear separation of concerns
     - Cons: More maintenance, duplication, confusing for users
   - **Option B**: Single unified endpoint
     - `/mcp` - Hybrid auth (allow discovery, require for execution)
     - Pros: Simpler, single source of truth, follows OpenAI guidance
     - Cons: May break existing clients, more complex auth logic
   - **Option C**: Feature detection
     - `/mcp` - Detects client capabilities from initial request
     - Adjusts behavior based on client type
     - Pros: Most flexible
     - Cons: Most complex, may be fragile

   **Recommendation needed**: Test with real clients before deciding

2. **Should all tools require authentication, or do we need mixed auth?**
   - Current: All tools behind global auth middleware
   - OpenAI spec: Supports per-tool `securitySchemes` (can mix `noauth` and `oauth2`)
   - MCP spec: Auth is OPTIONAL at transport level
   - **Unknown**: Do we have any tools that should be public?
   - **Unknown**: What are the business requirements for access control?
   - **Action needed**: Review API operations and determine access requirements

3. **How do we verify our implementation works with actual clients?**
   - ChatGPT: Need to test with real ChatGPT Apps SDK instance
   - Cursor: Need to verify HTTP transport usage and auth expectations
   - Claude Desktop: Need to test behavior
   - MCP Inspector: Need to test OAuth flow
   - **Critical gap**: No real-world testing performed yet

4. **Should we use Clerk's `@clerk/mcp-tools` package or keep custom integration?**
   - **Current**: Custom integration using `@clerk/express` directly
   - **Clerk recommends**: Using `@clerk/mcp-tools` (see `.agent/reference-docs/clerk-build-mcp-server.md`)
   - Comparison needed:
     - What does `@clerk/mcp-tools` provide that we don't have?
     - Does it handle per-tool `securitySchemes`?
     - Does it implement method-level auth bypass?
     - Is it more or less flexible than our approach?
   - **Action needed**: Review `@clerk/mcp-tools` source code and compare

### Implementation Details

5. **What scopes should we request beyond `openid` and `email`?**
   - Current: Only requesting `openid` and `email`
   - Need to map curriculum API operations to OAuth scopes
   - Considerations:
     - `curriculum:read` - Read-only access to curriculum data
     - `lessons:read` - Read lesson content
     - `planning:read` - Read planning resources
     - `search:read` - Search functionality
   - **Question**: Are all operations read-only, or do we need write scopes?
   - **Question**: Should scopes be granular per resource type, or broad?

6. **When should we trigger tool-level auth prompts?**
   - Only for write operations?
   - For user-specific data?
   - For rate-limited endpoints?
   - For premium features?
   - **Current**: No tool-level auth prompts implemented
   - **OpenAI spec**: Requires `_meta["mcp/www_authenticate"]` in tool responses
   - **Use case unclear**: When would we want mid-session auth escalation?

7. **How do we handle token expiration gracefully?**
   - **Option A**: Transport-level 401 responses (current)
     - Simple, follows HTTP standards
     - May not trigger proper UI in all clients
   - **Option B**: Tool-level `_meta` challenges
     - Follows OpenAI recommendation
     - More complex to implement
     - Allows per-tool error messages
   - **Option C**: Hybrid approach
     - 401 for missing tokens
     - Tool-level `_meta` for expired/insufficient scope
   - **Unknown**: What do other MCP servers do?

### Security & Compliance

8. **Do we need client identification (distinguish ChatGPT from others)?**
   - OpenAI guidance: "only reliable control is network-level filtering"
   - Currently: No IP filtering or client identification
   - Options:
     - IP allowlisting for ChatGPT egress ranges
     - User-Agent parsing (unreliable)
     - Wait for CMID (Client Metadata Documents)
   - **Question**: Is there a business reason to restrict to ChatGPT only?
   - **Question**: Should different clients have different access levels?

9. **How do we handle the token audience (`aud`) claim?**
   - MCP spec requires: Token `aud` must match resource server
   - Our implementation: Clerk validates `aud` automatically via `getAuth()`
   - Question: What is the actual `aud` value in tokens issued by Clerk?
   - Question: Does it match our `resource` URL (`https://example.com/mcp`)?
   - **Action needed**: Inspect actual JWT tokens from Clerk to verify

10. **What happens if Clerk changes their OAuth implementation?**
    - Risk: We depend on Clerk's OAuth server behavior
    - Mitigation: MCP spec compliance should protect us
    - **Question**: Do we need a migration path to different OAuth provider?
    - **Question**: Should we abstract the OAuth provider dependency?

### Testing & Validation

11. **How do we test OAuth flows end-to-end?**
    - Current testing: Unit tests with mocked Clerk responses
    - Missing: Real OAuth flow testing with actual tokens
    - Tools available:
      - MCP Inspector (CLI tool for testing MCP servers)
      - Manual testing with ChatGPT
      - Manual testing with Cursor
    - **Action needed**: Create smoke test suite for OAuth flows

12. **What are the acceptance criteria for "working with ChatGPT"?**
    - User can add server to ChatGPT without errors?
    - OAuth linking UI appears correctly?
    - User can authenticate successfully?
    - All tools are callable after auth?
    - Tokens are reused across tool calls?
    - **Need**: Clear definition of success

### Compatibility & Migration

13. **If we change auth behavior, how do we migrate existing users?**
    - **Scenario**: Cursor users currently working (assumed)
    - **Risk**: Changes for ChatGPT compatibility might break Cursor
    - **Question**: Can we detect breaking changes before deploying?
    - **Question**: Do we need a staged rollout?

14. **Do we need to support multiple MCP spec versions?**
    - Current: Implementing MCP spec 2025-06-18
    - **Unknown**: What spec version does Cursor support?
    - **Unknown**: What spec version does Claude Desktop support?
    - **Unknown**: Do we need backward compatibility?

---

## Testing Gaps

| Test Type                   | Current Coverage         | Needed                        |
| --------------------------- | ------------------------ | ----------------------------- |
| Protected resource metadata | ✅ Excellent             | -                             |
| WWW-Authenticate headers    | ✅ Excellent             | -                             |
| Token verification          | ✅ Good (via Clerk mock) | -                             |
| Per-tool securitySchemes    | ❌ None                  | Add generator tests           |
| Tool-level auth challenges  | ❌ None                  | Add integration tests         |
| ChatGPT OAuth flow (E2E)    | ❌ None                  | Manual testing with Inspector |

---

## References

- OpenAI Apps SDK Auth Docs: `.agent/reference-docs/openai-apps-auth.md`
- MCP Authorization Spec: <https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization>
- RFC 9728 (OAuth Protected Resource Metadata): <https://datatracker.ietf.org/doc/html/rfc9728>
- RFC 8414 (OAuth Authorization Server Metadata): <https://datatracker.ietf.org/doc/html/rfc8414>
- Clerk MCP Guide: <https://clerk.com/docs/expressjs/guides/development/mcp/build-mcp-server>

---

**Next Steps**: Discuss findings with team and prioritize implementation of missing ChatGPT-specific features.
