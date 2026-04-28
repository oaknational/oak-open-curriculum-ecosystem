# ADR-053: Clerk as Identity Provider and Authorization Server

## Status

Accepted (2025-09-07)

**Related**: ADR-052 (OAuth 2.1 for MCP), ADR-040 (Neutral Architecture)

## Context

Per ADR-052, we've decided to use OAuth 2.1 for MCP HTTP server authentication. This requires an external **Authorization Server** (Identity Provider) to:

1. Manage user authentication (login, logout, MFA)
2. Issue OAuth 2.1 access tokens (JWT)
3. Provide OAuth discovery endpoints (RFC 8414)
4. Manage user sessions and refresh tokens
5. Integrate with social identity providers (Google, Microsoft)

### Requirements

**Functional**:

- OAuth 2.1 / OpenID Connect compliance
- Social login (Google, Microsoft for `@thenational.academy`)
- Email domain allowlist (`.thenational.academy` initially)
- Multi-factor authentication (MFA)
- Session management with refresh tokens
- JWKS endpoint for token verification

**Operational**:

- Production-grade reliability and security
- Minimal operational burden (managed service preferred)
- Fast initial implementation (demo-ready quickly)
- Compatible with Vercel deployment
- Cost-effective for educational non-profit

**Integration**:

- Existing Oak services already use identity management
- Semantic Search app needs same user base as MCP server
- Single sign-on across Oak services desired
- Shared user allowlist and access policies

### Existing Oak Infrastructure

**Aila (Semantic Search) uses Clerk** with:

- Google and Microsoft social connections
- Production user base (educators from `@thenational.academy`)
- Email domain allowlist
- Session management and MFA policies
- SSO configuration

## Decision

Use **Clerk** as the Identity Provider and Authorization Server for the MCP HTTP server, **reusing the same Clerk instance** as Aila/Semantic Search.

### Architecture

```text
┌────────────────────────────────────────────────┐
│           Shared Clerk Instance                │
│  (clerk.thenational.academy)                   │
│                                                │
│  - User Database (educators)                   │
│  - Social Connections (Google, Microsoft)      │
│  - Email Allowlist (@thenational.academy)      │
│  - MFA Policies                                │
│  - Session Management                          │
│  - OAuth 2.1 / OIDC Endpoints                  │
└────────────┬───────────────────────┬───────────┘
             │                       │
             │                       │
    ┌────────▼────────┐    ┌────────▼────────┐
    │  Semantic       │    │  MCP HTTP       │
    │  Search         │    │  Server         │
    │  (Next.js)      │    │  (Express)      │
    │                 │    │                 │
    │  - Clerk SDK    │    │  - Clerk SDK    │
    │  - Frontend     │    │  - Token        │
    │    auth         │    │    validation   │
    └─────────────────┘    └─────────────────┘
```

**Key Point**: Single Clerk instance means:

- Same users across all Oak services
- Consistent authentication policies
- Single allowlist management
- Unified audit trail

### Integration Approach

**MCP Server Role**: Resource Server only

- Validates Clerk-issued JWT tokens
- Proxies Clerk's OAuth discovery to `/.well-known/oauth-authorization-server`
- Uses Clerk's JWKS for signature verification
- Does NOT handle user login/signup flows

**Token Flow**:

1. User authenticates via Clerk (in client application or browser)
2. Client receives Clerk session token (JWT)
3. Client sends `Authorization: Bearer <token>` to MCP server
4. MCP server validates token against Clerk's JWKS
5. MCP server extracts user identity from validated token

## Rationale

### Why Clerk?

**1. Reuse Existing Infrastructure**

- Aila already uses Clerk in production
- User base already exists (`@thenational.academy` educators)
- Authentication policies already configured
- Avoid duplicate user management

**2. OAuth 2.1 / OIDC Compliance**

- Full OAuth 2.1 and OpenID Connect support
- RFC 8414 Authorization Server Metadata
- Standard JWKS endpoint for token verification
- Battle-tested OAuth implementation

**3. Developer Experience**

- Excellent TypeScript SDK and middleware
- Express middleware for token validation
- Clear documentation and examples
- Fast to implement (demo-ready quickly)

**4. Security Features**

- Email domain allowlist built-in
- MFA support (TOTP, SMS, etc.)
- Session management with refresh tokens
- Security updates handled by Clerk
- SOC 2 Type II compliant

**5. Enterprise Features**

- SSO integration (Google, Microsoft, SAML)
- User management dashboard
- Audit logs
- Role-based access control (RBAC)
- Organization management

**6. Operational Benefits**

- Managed service (no servers to maintain)
- 99.99% uptime SLA
- Built-in monitoring and alerting
- Automatic security patching
- Edge network for global performance

**7. Cost Effective**

- Free tier: 10,000 MAU (Monthly Active Users)
- Affordable paid tier for education non-profit
- No infrastructure costs
- No operational overhead

### Why NOT Alternatives?

**Auth0**:

- More expensive at scale
- More complex configuration
- Not used elsewhere in Oak ecosystem
- Would create user fragmentation

**Firebase Auth**:

- Ties us to Google Cloud Platform
- Less flexible for enterprise SSO
- Not used elsewhere in Oak ecosystem
- Migration path unclear

**Supabase Auth**:

- Requires managing Supabase infrastructure
- Less mature OAuth implementation
- Not used elsewhere in Oak ecosystem
- Additional services we don't need

**Self-Hosted Solutions** (Keycloak, Ory, etc.):

- Operational burden (servers, updates, backups)
- Security responsibility (patches, monitoring)
- Development time (configuration, customization)
- No benefit vs. managed solution for our scale

**Why Reuse Aila's Clerk Instance?**:

- Single user base (educator logs in once, accesses both services)
- Consistent authentication policies
- Single allowlist to manage
- Unified audit trail
- Cost savings (one Clerk subscription)

## Consequences

### Positive

1. **Fast Implementation**: Working OAuth in days, not weeks
2. **Reuse Investment**: Leverage existing Aila/Clerk setup
3. **Single User Base**: Same educators across all Oak services
4. **Production Ready**: Battle-tested at scale
5. **Secure by Default**: SOC 2 compliant, MFA, security updates
6. **No Ops Burden**: Managed service, no servers
7. **Cost Effective**: Free tier sufficient for initial rollout
8. **Future Proof**: Supports SSO, SAML for enterprise expansion

### Negative

1. **Vendor Lock-In**: Migrating away from Clerk would require work
2. **External Dependency**: Service availability depends on Clerk
3. **Cost at Scale**: May need paid tier as user base grows
4. **Customization Limits**: Some advanced flows may be constrained

### Mitigations

**Vendor Lock-In**:

- Use standard OAuth/OIDC (portable to other providers)
- Validate tokens via JWKS (standard approach)
- Keep MCP server code provider-agnostic
- Document migration strategy if needed

**External Dependency**:

- Clerk has 99.99% SLA
- Implement graceful degradation (fail open for debugging)
- Add `DANGEROUSLY_DISABLE_AUTH` for local development
- Monitor Clerk status page

**Cost at Scale**:

- Free tier: 10,000 MAU sufficient for 1-2 years
- Paid tier cost reasonable for non-profit
- Can optimize with tiered access if needed

## Implementation

### Clerk Configuration

**Environment Variables**:

```bash
# Public (safe for client-side)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Secret (server-side only)
CLERK_SECRET_KEY=your_clerk_secret_key_here

# OAuth Discovery
CLERK_OIDC_DISCOVERY_URL=https://....clerk.accounts.dev/.well-known/openid-configuration
```

**Allowlist** (Clerk Dashboard):

- Enable allowlist
- Add domain: `thenational.academy`
- Blocks sign-ups from other domains

**Social Connections**:

- Google OAuth (already configured for Aila)
- Microsoft OAuth (planned for enterprise SSO)

### MCP Server Integration

**Token Validation**:

```typescript
import { clerkClient, clerkMiddleware } from '@clerk/express';

// Middleware validates tokens automatically
app.use(clerkMiddleware());

// Access validated user in handlers
app.post('/mcp', (req, res) => {
  const { userId, email, orgId } = req.auth;
  // userId will be null if token invalid
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Use user identity for authorization and audit
});
```

**Discovery Proxy**:

```typescript
app.get('/.well-known/oauth-authorization-server', async (req, res) => {
  const discovery = await fetch(process.env.CLERK_OIDC_DISCOVERY_URL);
  const metadata = await discovery.json();
  res.json(metadata);
});
```

### Authorization Strategy

Extract user claims from validated token:

- `email` → User identity
- `orgId` → Organization (future multi-tenant)
- `role` → Access level (future RBAC)

Implement access control:

- All `@thenational.academy` emails get access (via allowlist)
- Log all operations with `userId` for audit trail
- Future: Add role-based restrictions

## Amendment: Proxy OAuth AS Role (2026-02-21)

The MCP server now also acts as a **proxy OAuth Authorisation Server**, transparently forwarding DCR, authorise, and token exchange requests to Clerk. This was introduced to work around a confirmed Cursor client-side bug ([ADR-115](115-proxy-oauth-as-for-cursor.md)).

Key changes from the original decision:

1. **Server role**: No longer "Resource Server only". The server presents itself as its own AS via rewritten metadata, while Clerk remains the real AS behind the proxy.
2. **Token type**: Clerk issues opaque tokens (`oat_...`) for OAuth access tokens, not JWTs. The proxy relies on this — there is no `iss` claim to validate against AS metadata.
3. **DCR**: MCP clients (Cursor, Claude) register dynamically with Clerk via the proxy's `/oauth/register` endpoint. This was not anticipated in the original decision.
4. **Discovery**: AS metadata is fetched from Clerk at startup, validated via Zod, and served with endpoint URLs rewritten to self-origin. The simple `fetch(CLERK_OIDC_DISCOVERY_URL)` pattern in the original Implementation section is superseded.

The proxy is always-on, transparent, and stateless. See [ADR-115](115-proxy-oauth-as-for-cursor.md) for the full decision.

## Amendment: Canonical User-ID Provider Through Public Alpha (2026-04-21)

Clerk is the **canonical user-ID provider for the Oak Open Curriculum ecosystem through the public alpha period**. During this scope, all Oak services that need a user-identity boundary (MCP HTTP server, Aila/Semantic Search, and any new alpha-scope service) MUST use the same shared Clerk instance and treat the Clerk-issued user identifier (`userId` claim from validated tokens) as the canonical user-identity primitive.

**Scope of the temporal commitment**:

- **Through public alpha** = until the public alpha period ends. The end of public alpha is a discrete milestone (named by Oak product leadership); not a fixed date.
- **At alpha end**, this decision is **revisited**, not auto-renewed. The revisit may reaffirm Clerk as the permanent IdP, may switch providers, may federate, or may introduce a multi-provider strategy. The revisit is itself a new ADR.
- **No mid-alpha provider swaps**: the cost of fragmenting user-IDs across services mid-alpha (broken sessions, audit gaps, allowlist drift) outweighs any provider-comparison benefit during this window. Provider concerns surfaced during alpha are captured for the alpha-end revisit, not acted on mid-window.

**What this constrains**:

- New alpha-scope services adopt the shared Clerk instance, not a parallel one.
- User-identity primitives in code, schemas, and audit logs are typed against the Clerk `userId` shape (per ADR-024 dependency injection patterns).
- Vendor-lock mitigations from the original §Mitigations section remain active — token validation via standard OIDC/JWKS, provider-agnostic MCP code paths — so the alpha-end revisit is not foreclosed.

**Why named explicitly now**: prior to this amendment, the temporal scope of the Clerk decision was implicit. The retracted standing-decisions register entry `Clerk canonical user-ID provider through public alpha` captured the owner's explicit decision that the canonical-IdP commitment is bounded to alpha. Graduated to this amendment in 2026-04-21 Session 5 per the standing-decisions decomposition arc.

## Related Decisions

- **ADR-052**: OAuth 2.1 for MCP HTTP Authentication - Why OAuth (not Clerk-specific)
- **ADR-040**: Neutral Architecture - Overall system architecture
- **ADR-024**: Dependency Injection Pattern - How Clerk SDK is injected
- **ADR-113**: MCP Spec-Compliant Auth - All MCP methods require HTTP auth
- **ADR-115**: Proxy OAuth AS for Cursor - Transparent proxy to Clerk

## References

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Express SDK](https://clerk.com/docs/references/express/overview)
- [Clerk OIDC Discovery](https://clerk.com/docs/integrations/oauth)
- Research: `research/clerk-unified-auth-mcp-nextjs.md`
- Research: `research/mcp-demo-auth-approach.md`
- Aila Semantic Search: Already using Clerk in production

## Timeline

- **Decided**: 2025-09-07
- **Implemented**: Branch `feat/oauth_support` (in progress)
- **Production**: Pending Phase 3 deployment
- **Existing Use**: Aila/Semantic Search already in production with Clerk

---

**Note**: This ADR documents the choice of Clerk as the specific OAuth provider. The broader decision to use OAuth 2.1 is documented in ADR-052.
