# ADR-052: OAuth 2.1 for MCP HTTP Server Authentication

## Status

Accepted (2025-09-07). Amended 2026-05-10 to mark the
resource-server-only/JWT/JWKS implementation details as superseded by the
Clerk proxy-AS and opaque-token decisions in ADR-053, ADR-115, and ADR-142.

**Related**: ADR-053 (Clerk as IdP), ADR-040 (Neutral Architecture)

## Context

The Oak Curriculum MCP HTTP server exposes curriculum data and tools over HTTP (SSE transport) to remote clients. This data includes:

- Internal curriculum content and planning materials
- User-specific lesson plans and resources
- Operational analytics and usage data
- Administrative functions

### Security Requirements

1. **User Authentication**: Verify the identity of users accessing the system
2. **Authorization**: Control which users can access which resources
3. **Audit Trail**: Track who accessed what and when
4. **Enterprise Compliance**: Meet security requirements for educational institutions
5. **Standards Compliance**: Follow MCP specification requirements

### MCP Specification Requirements

From the [MCP Authorization Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization):

> Authorization is **OPTIONAL** for MCP implementations. When supported:
>
> - Implementations using an HTTP-based transport **SHOULD** conform to this specification.
> - Implementations using an STDIO transport **SHOULD NOT** follow this specification.

The MCP specification mandates OAuth 2.1 for HTTP-based transports:

- **OAuth 2.1 compliance** (draft-ietf-oauth-v2-1-13)
- **Authorization Server Metadata** (RFC 8414)
- **Protected Resource Metadata** (RFC 9728)
- **Bearer token authentication** via `Authorization` header
- **Discovery endpoints** at `/.well-known/oauth-authorization-server`

### Authentication Options Considered

1. **API Keys**
   - Simple to implement
   - No user identity (just service-to-service)
   - No built-in expiration or rotation
   - Difficult to audit per-user
   - ❌ Doesn't meet MCP spec requirements

2. **Basic Authentication**
   - Simple username/password
   - Credentials sent with every request
   - No standard refresh mechanism
   - Poor security posture
   - ❌ Not recommended for production systems

3. **Custom JWT System**
   - Complete control over token format
   - Requires building entire OAuth infrastructure
   - Requires maintaining security best practices
   - ❌ Significant development and maintenance burden

4. **OAuth 2.1 with Standard Provider** ✅
   - Industry-standard protocol
   - Mature ecosystem and tooling
   - Built-in token expiration and refresh
   - Discovery mechanism for clients
   - **Required by MCP specification**
   - Leverages existing identity providers

## Decision

Implement **OAuth 2.1** for HTTP server authentication, with the MCP server acting as a **Resource Server** that verifies tokens issued by an external **Authorization Server**.

### Current Runtime Shape (2026-05-10)

The original Resource Server architecture remains the conceptual security
boundary — MCP requests carry `Authorization: Bearer <token>` and the MCP
server authenticates the caller before protected methods run. The
implementation details below are historical where they describe direct JWT
signature validation through Clerk JWKS.

The current runtime shape is:

- Clerk remains the canonical identity provider through public alpha (ADR-053).
- The MCP server also presents a same-origin proxy Authorisation Server for
  client compatibility (ADR-115).
- Clerk OAuth access tokens are opaque `oat_...` tokens rather than JWT access
  tokens for this flow (ADR-142).
- Runtime token verification uses Clerk-supported verification rather than
  local JWT/JWKS claim validation.

If Clerk later moves this OAuth flow to JWT access tokens, this ADR must be
revisited with ADR-115 because issuer/audience validation would become
load-bearing again.

### Historical 2025 Architecture

The diagram below records the original token-validation shape. It is not the
current binding implementation posture after the 2026 proxy-AS and Clerk
opaque-token amendments.

```text
┌─────────────────┐
│   MCP Client    │
│ (Claude, IDE)   │
└────────┬────────┘
         │ 1. Request without token
         ▼
┌─────────────────┐
│   MCP Server    │ ──── 401 + WWW-Authenticate header
│ (Resource       │      Points to Authorization Server
│  Server)        │
└────────┬────────┘
         │ Discovery: /.well-known/oauth-authorization-server
         │
         │ 2. Client performs OAuth flow
         ▼
┌─────────────────┐
│ Authorization   │
│    Server       │ ──── Issues access tokens (JWT)
│ (External IdP)  │      Manages user sessions
└─────────────────┘
         │
         │ 3. Client sends request with token
         ▼
┌─────────────────┐
│   MCP Server    │
│ Validates JWT   │ ──── Verifies signature via JWKS
│ Checks claims   │      Enforces authorization rules
│ Returns data    │
└─────────────────┘
```

### Current Binding Principles

1. **MCP Server = Resource Server Only**
   - Does NOT manage user sessions
   - Does NOT handle login/logout flows
   - Does NOT store passwords or credentials
   - Validates bearer access tokens through Clerk-supported verification

2. **Token Verification**
   - Clerk opaque OAuth access tokens are verified through Clerk-supported
     verification
   - JWT/JWKS local claim validation is historical for this flow unless Clerk
     changes the OAuth token format

3. **Standards Compliance**
   - Expose `/.well-known/oauth-authorization-server` (RFC 8414)
   - Return `401 Unauthorized` with `WWW-Authenticate` header
   - Accept tokens via `Authorization: Bearer` header only
   - Never accept tokens in URL parameters (security risk)

4. **Token Format**
   - The runtime must not assume JWT access-token structure for Clerk OAuth
     access tokens in this flow
   - If JWT access tokens become load-bearing later, this ADR and ADR-115 must
     be revisited together

## Rationale

### Why OAuth 2.1?

1. **MCP Specification Compliance**: Required for HTTP-based MCP servers
2. **Industry Standard**: Mature, well-understood, extensive tooling
3. **Security Best Practices**: Built-in token expiration, refresh, secure flows
4. **User Experience**: Standard OAuth flows familiar to users
5. **Enterprise Ready**: Supports SSO, MFA, identity federation

### Why Resource Server Pattern?

Separating the Authorization Server from the MCP server:

- **Reduces Complexity**: Don't build/maintain OAuth infrastructure
- **Leverages Expertise**: Use battle-tested identity providers
- **Enables SSO**: Share authentication with other Oak services
- **Improves Security**: Identity management is a specialized domain
- **Easier Updates**: IdP handles security patches and OAuth updates

### Why NOT Alternative Approaches?

**API Keys**:

- No per-user identity (fails audit requirements)
- No standard expiration mechanism
- Doesn't meet MCP spec requirements for HTTP transport

**Basic Auth**:

- Credentials sent with every request (higher risk)
- No standard token refresh
- Poor user experience (store credentials in client)
- Not compatible with SSO or MFA

**Custom JWT without OAuth**:

- Need to build authorization server from scratch
- Need to implement discovery endpoints
- Need to maintain security best practices
- Significant development burden
- Why reinvent when standard exists?

## Consequences

### Positive

1. **Standards Compliant**: Meets MCP specification for HTTP transport
2. **Enterprise Ready**: Supports SSO, MFA, audit trails
3. **User Identity**: Clear per-user authentication and authorization
4. **Secure by Default**: Industry-standard security practices
5. **Future Proof**: Compatible with emerging MCP client tooling
6. **Flexible**: Can integrate with any OAuth 2.1 provider
7. **Audit Trail**: Clear user attribution for all actions

### Negative

1. **Complexity**: More complex than simple API keys
2. **External Dependency**: Requires external Authorization Server
3. **Token Management**: Clients need to handle token refresh
4. **Initial Setup**: OAuth configuration required

### Mitigations

- Use well-established OAuth provider (see ADR-053 for Clerk decision)
- Provide clear client documentation and examples
- Implement standard OAuth discovery endpoints
- Use standard libraries (Clerk SDK) for token verification

## Implementation

### MCP Server Responsibilities

1. **Discovery Endpoint**: `/.well-known/oauth-authorization-server`
   - Proxies Authorization Server metadata
   - Provides `authorization_endpoint`, `token_endpoint`, `jwks_uri`

2. **Token Validation Middleware**:
   - Extract token from `Authorization: Bearer` header
   - Verify JWT signature using JWKS
   - Check standard claims (iss, aud, exp)
   - Reject expired or invalid tokens

3. **401 Responses**:
   - Return `WWW-Authenticate: Bearer realm="mcp-server"`
   - Include error details for debugging

4. **Authorization Logic**:
   - Extract user claims from validated token (email, org, roles)
   - Enforce access control rules
   - Log user actions for audit trail

### What MCP Server Does NOT Do

- Does not handle user login/logout
- Does not manage user sessions
- Does not store passwords
- Does not implement OAuth flows
- Does not issue tokens

## Related Decisions

- **ADR-053**: Clerk as Identity Provider - Specific OAuth provider choice
- **ADR-040**: Neutral Architecture - Overall system architecture
- **ADR-033**: Centralised Log Level Configuration - Logging strategy

## References

- [MCP Authorization Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)
- [OAuth 2.1 Draft](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13)
- [RFC 8414: Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414)
- [RFC 9728: Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728)
- Research: `research/mcp-demo-auth-approach.md`
- Research: `research/clerk-unified-auth-mcp-nextjs.md`
- Reference: `.agent/reference/mcp-understanding-auth-in-mcp.md`
- Reference: `.agent/reference/mcp-auth-spec.md`

## Timeline

- **Decided**: 2025-09-07
- **Implemented**: Branch `feat/oauth_support` (in progress)
- **Production**: Pending Phase 3 deployment

---

**Note**: This ADR documents the decision to use OAuth 2.1. The specific choice of Clerk as the OAuth provider is documented in ADR-053.
