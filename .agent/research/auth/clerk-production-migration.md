# Clerk Production Migration: Research Report

**Date**: 2026-02-22
**Status**: 🔬 RESEARCH — Complete
**Purpose**: What is required to migrate the MCP server's Clerk
authentication from a development instance to a production instance
for public alpha?
**Related ADRs**: [ADR-052](../../../docs/architecture/architectural-decisions/052-oauth-2.1-for-mcp-http-authentication.md), [ADR-053](../../../docs/architecture/architectural-decisions/053-clerk-as-identity-provider.md) (amended 2026-02-21 — server now also acts as proxy OAuth AS), [ADR-113](../../../docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md), [ADR-115](../../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md)
**Milestone placement**: This research supports [Milestone 1: Public Alpha](../../plans/high-level-plan.md) and is referenced from the [semantic search roadmap](../../plans/semantic-search/roadmap.md).

---

## 0. Decision Prerequisite: Shared vs Independent Instance

**This question must be resolved before any other migration work.**

[ADR-053](../../../docs/architecture/architectural-decisions/053-clerk-as-identity-provider.md)
(accepted 2025-09-07) decided: *"Use Clerk as the Identity Provider
and Authorization Server for the MCP HTTP server, reusing the same
Clerk instance as Aila/Semantic Search."*

The rationale was: single user base, consistent authentication
policies, single allowlist management, unified audit trail, cost
savings.

However, the public alpha introduces a **fundamental conflict**:
Clerk allowlists, blocklists, and sign-up mode (public/restricted/
waitlist) are **instance-wide settings**. If the MCP server shares
Aila's production instance, removing the allowlist for public alpha
would simultaneously open Aila to public sign-up.

### Options

| Option | Description | Implications |
| ------ | ----------- | ------------ |
| **A: Shared instance** | MCP and Aila share Aila's existing production Clerk instance | Social providers, restrictions, and user base are inherited. Access control changes affect both services. Cannot have divergent sign-up policies. |
| **B: Independent instance** | MCP gets its own production Clerk instance | Full control over access policy, social providers, and sign-up mode. No shared identity pool. Requires ADR-053 amendment. Additional Clerk subscription cost. |
| **C: Shared instance with organisational separation** | Use Clerk Organisations to create separate access policies within one instance | Preserves shared user base while allowing different access controls per service. Requires Clerk Pro plan and organisational architecture work. |

### Recommendation

**Option B (Independent instance)** is recommended for public alpha,
with a view to **Option C** for general availability once the user
base and access patterns are understood. The MCP server's access
control requirements (public sign-up for external developers and
educators) are fundamentally different from Aila's (restricted to Oak
staff). An independent instance allows the MCP team to iterate on
access policy without affecting Aila.

**If Option A is chosen**: The access control strategy in Section 4
must be revised — the allowlist cannot be removed, and the MCP server
must use whatever sign-up mode Aila uses.

**ADR impact**: If the decision departs from ADR-053's shared-instance
mandate, a formal amendment to ADR-053 is required. A new ADR
(e.g. ADR-120: Clerk Production Access Control) should capture the
access control decision.

---

## 1. Current State

### Development Instance

- **Key prefixes**: `pk_test_` / `sk_test_`
- **SSO connections**: Google OAuth (shared credentials, enabled for
  sign-up and sign-in)
- **Email subaddresses**: Blocked for Google
- **Restrictions**: Allowlist enabled (Pro feature, free in
  development)
- **Dynamic client registration**: Enabled (required for MCP OAuth)
- **OAuth proxy**: Always-on transparent proxy to Clerk (ADR-115)
- **User cap**: Development instances are capped at 100 users

### Architecture Summary

```text
MCP Client → MCP Server (RS + Proxy AS) → Clerk (Real AS)
```

The MCP server acts as both a Resource Server and a proxy OAuth
Authorisation Server (ADR-115, amending ADR-053's original "Resource
Server only" role). It transparently forwards DCR, authorise, and
token exchange requests to Clerk. The proxy exists to work around a
Cursor bug where the `resource_metadata` URL is lost across origins.
The proxy derives the upstream Clerk URL from `CLERK_PUBLISHABLE_KEY`
via `deriveUpstreamOAuthBaseUrl()`.

**Critical assumption**: The proxy relies on Clerk issuing opaque
tokens (`oat_...`), not JWTs. There is no `iss` claim to validate
against AS metadata. See [Section 7: Risk Assessment](#7-risk-assessment)
for implications.

### What Does NOT Carry Over

When creating a new production instance, Clerk explicitly does
**not** copy:

- SSO connections (social providers)
- Integrations
- Paths

These must be reconfigured manually in the production instance.
(If sharing Aila's existing instance, these are already configured.)

---

## 2. Migration Checklist

### 2.1 Create or Join the Production Instance

Depends on [Section 0](#0-decision-prerequisite-shared-vs-independent-instance):

- **Option A (shared)**: Request access to Aila's production Clerk
  instance. Obtain `pk_live_` and `sk_live_` keys.
- **Option B (independent)**: In the Clerk Dashboard, toggle from
  "Development" to create a production instance. Choose to clone
  development settings or start fresh (SSO connections will not carry
  over regardless). Note the new keys.

### 2.2 Domain and DNS

A custom domain is **required** for production.

| Task | Detail |
| ---- | ------ |
| Choose domain | e.g. `mcp.oaknational.academy` (dedicated subdomain recommended — see rationale below) |
| Add DNS records | Clerk provides specific CNAME/TXT records in the Dashboard Domains page |
| Email DNS | SPF and DKIM records for verified email delivery |
| Domain verification | TXT record to prove domain ownership |
| Wait for propagation | Up to 48 hours |
| Deploy certificates | Button in Clerk Dashboard after DNS is verified |
| **Verify canonical host enforcement** | Confirm that Vercel (or ingress layer) enforces a canonical `Host` header. The OAuth proxy derives self-origin from the `Host` header (ADR-115 deployment precondition). Without canonical enforcement, malicious `Host` headers could manipulate discovered OAuth endpoints. |

**Domain selection rationale**: A dedicated subdomain
(e.g. `mcp.oaknational.academy`) isolates the auth blast radius and
cookie scope compared to a shared root domain. Changing domains later
requires updating all social provider OAuth redirect URIs — a high
change-cost operation. Settle on the production domain early.

**Subdomain authentication**: Setting a root domain
(e.g. `oaknational.academy`) enables authentication across all
subdomains with shared sessions.

### 2.3 API Keys

| Environment | Publishable Key | Secret Key |
| ----------- | --------------- | ---------- |
| Development | `pk_test_...` | `sk_test_...` |
| Production | `pk_live_...` | `sk_live_...` |

**Files requiring update**:

- `.env` / `.env.local` (local development continues using
  `pk_test_`)
- Vercel environment variables (production deployment)
- Any CI/CD pipeline secrets
- Smoke test configuration
  (`apps/oak-curriculum-mcp-streamable-http/smoke-tests/`)

**Code impact**: The `deriveUpstreamOAuthBaseUrl()` function in the
OAuth proxy derives the Clerk URL from the publishable key. Switching
to a `pk_live_` key will change the derived URL from
`*.clerk.accounts.dev` to the production Clerk domain. The derivation
is dynamic — no code changes to the proxy are required.

### 2.4 OAuth Credentials for Social Providers

Each social provider needs custom credentials in production. Clerk's
shared development credentials are not secure for production use.

See [Section 3: Social Provider Recommendations](#3-social-provider-recommendations)
for detailed provider-by-provider guidance, including a per-provider
hardening checklist.

### 2.5 Restrictions and Access Control

The current allowlist restricts sign-ups to `@thenational.academy`
emails. For public alpha, this must change (subject to the
[shared-instance decision](#0-decision-prerequisite-shared-vs-independent-instance)).

See [Section 4: Access Control Strategy](#4-access-control-strategy)
for options.

### 2.6 Dynamic Client Registration

DCR must be enabled in the production instance's OAuth application
settings. This is required for MCP clients (Cursor, Claude) to
register dynamically.

**Security model**: DCR creates a public, unauthenticated endpoint
that anyone can use to register OAuth clients. The actual OAuth
security comes from standard mechanisms:

- **PKCE** (Proof Key for Code Exchange) prevents authorisation code
  interception
- **`state` parameter** prevents CSRF during the authorisation flow
- **Redirect URI validation** prevents open redirect attacks
- **Consent screen** (automatically enforced when DCR is enabled)
  ensures user awareness of the requesting application

**Production controls needed**:

- Edge/WAF rate limiting on `/oauth/register` to prevent registration
  floods (see [Section 8](#8-operational-security-controls))
- Monitor DCR registration velocity via Clerk Dashboard
- Consider periodic cleanup of unused dynamic clients

### 2.7 Content Security Policy

If the production deployment uses CSP headers, they must allow Clerk's
domains. See
[Clerk CSP guide](https://clerk.com/docs/guides/secure/best-practices/csp-headers).

### 2.8 `authorizedParties` Configuration

For production, add `authorizedParties` to protect against subdomain
cookie leaking attacks. This must be configured via an **environment
variable** to avoid hardcoding the production domain (which would
break preview and staging deployments).

**Required changes**:

1. Add `CLERK_AUTHORIZED_PARTIES` environment variable (comma-separated
   list of allowed origins)
2. Read the variable in the env schema and pass it to
   `setupGlobalAuthContext()` in `src/auth-routes.ts`, where
   `clerkMiddleware()` is configured
3. Set the variable per environment:
   - Production: `https://curriculum-mcp.oaknational.dev`
   - Staging: `https://staging-curriculum-mcp.oaknational.dev`
   - Preview: Vercel preview URL pattern

**Note**: `authorizedParties` is one layer of protection. It must be
paired with canonical host enforcement at the ingress layer (Vercel)
and correct `Host` header handling in the OAuth proxy. See
[Section 8](#8-operational-security-controls).

### 2.9 Webhooks

If webhooks are configured (for user sync, audit events, etc.), the
endpoints must be updated to use the production instance's URL and
signing secret.

### 2.10 Smoke Tests

The smoke test suite has its own auth infrastructure
(`smoke-tests/auth/`) that creates testing tokens, OAuth applications,
and sign-in tokens via the Clerk Backend API.

**Testing strategy for production**:

| Test type | Environment | Keys | What it proves |
| --------- | ----------- | ---- | -------------- |
| **Non-mutating verification** | Production | Production keys (read-only operations) | PRM endpoint, AS metadata, 401 on unauthenticated request, correct `WWW-Authenticate` header |
| **Mutating OAuth flow tests** | Development instance | Development keys only | Full DCR, authorise, token exchange, user creation/deletion |
| **Smoke suite** (`pnpm smoke:oauth:spec`) | Development instance | Development keys only | End-to-end OAuth spec compliance |

**Rule**: Production credentials must never be used in automated tests
that create or delete users, OAuth applications, or tokens. Production
verification is limited to non-mutating HTTP assertions (status codes,
response headers, metadata endpoints).

---

## 3. Social Provider Recommendations

### Context

The MCP server is a developer tool for accessing the Oak Open
Curriculum API. Users are primarily:

- **Tier 1**: Oak staff (education organisation)
- **Tier 2**: Educators and curriculum developers at other
  organisations
- **Tier 3**: Developers building tools that consume the Oak
  curriculum

For public alpha, the provider selection should balance broad
accessibility with manageable configuration effort.

### Phased Provider Rollout

#### Phase 1: Public Alpha Launch

| Provider | Rationale | Production Setup Effort | Notes |
| -------- | --------- | ----------------------- | ----- |
| **Google** | Universal adoption. Education sector heavily uses Google Workspace. Already configured in development. | Medium — requires Google Cloud Console project, OAuth consent screen, custom credentials. Must set publishing status to "In production" (requires Google verification of app name, logo, and scopes). | [Block email subaddresses](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google#block-email-subaddresses) to prevent [known Google OAuth vulnerability](https://trufflesecurity.com/blog/google-oauth-is-broken-sort-of/). |
| **Microsoft** | Many schools and MATs use Microsoft 365. Already planned in ADR-053. Enterprise SSO pathway. | Medium-High — requires Microsoft Azure Entra ID app registration, client secret (expires, max 24 months), nOAuth vulnerability mitigation (`xms_edov` claim). | [Entra ID tenant type](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/microsoft#limitations): Clerk currently supports only `common` tenant (both org members and personal Microsoft accounts). SAML is available for tenant-specific control. |
| **GitHub** | Developers building curriculum tools are likely GitHub users. MCP ecosystem is developer-centric. | Low — simple OAuth app registration in GitHub Developer Settings. | Fastest to configure. Good signal that MCP is a developer tool. |

#### Phase 2: Extended Provider Support

| Provider | Rationale | Production Setup Effort | Notes |
| -------- | --------- | ----------------------- | ----- |
| **Apple** | Broadens access for macOS/iOS users. Required by Apple App Store policy if a native iOS client is ever built that offers third-party sign-in. | Medium-High — requires Apple Developer account, Services ID, private key, Team ID, Key ID. Must configure email relay for Apple Private Email. | Apple hides user email by default (Private Email Relay). Clerk handles this but the relay domain must be registered. |
| **LinkedIn** | Professional network popular with education leaders, curriculum designers, and CPD professionals. Microsoft-owned (shared Entra infrastructure). | Medium — requires LinkedIn Developer app, OAuth 2.0 credentials, approved product (Sign In with LinkedIn using OpenID Connect). | LinkedIn restricts API access — the app must be approved for the "Sign In with LinkedIn using OpenID Connect" product. |
| **GitLab** | Extends developer audience beyond GitHub. Some education-adjacent open-source communities prefer GitLab. | Low — simple OAuth app registration in GitLab settings. | Straightforward setup, similar to GitHub. |

#### Not Recommended

| Provider | Reason |
| -------- | ------ |
| Discord, Slack, Twitch, TikTok, etc. | Too niche for an education curriculum API. Adds configuration overhead without meaningful user reach. |
| Facebook | Privacy concerns in education sector. Low adoption among target audience. |
| Custom OIDC | Unnecessary complexity when Clerk supports 50+ providers natively. |

### Provider Setup Summary

#### Google (Production)

1. Create a Google Cloud Console project
2. Configure OAuth consent screen (External user type)
3. Create OAuth 2.0 credentials (Web application type)
4. Add authorised JavaScript origins (production domain)
5. Add authorised redirect URI from Clerk Dashboard
6. Paste Client ID and Client Secret into Clerk
7. **Set publishing status to "In production"** — this requires
   Google verification (app name, logo, requested scopes). While in
   "Testing" status, the app is limited to 100 test users and may
   require explicit addition to a trusted user list.
8. Enable "Block email subaddresses" in Clerk

#### Microsoft (Production)

1. Create a Microsoft Entra ID app registration in Azure Portal
2. Set supported account types to "Multitenant + personal Microsoft
   accounts"
3. Add redirect URI from Clerk Dashboard
4. Generate client secret (set reminder before expiration)
5. Enable OpenID (implicit grant: access tokens + ID tokens)
6. Configure `xms_edov` claim for nOAuth vulnerability mitigation
7. Paste Client ID and Client Secret into Clerk

**Operational concern**: Microsoft client secrets expire (max 24
months). Set a calendar reminder to rotate the secret before
expiration, or the social connection will stop working.

#### GitHub (Production)

1. Register a new OAuth app in GitHub Developer Settings
2. Set authorisation callback URL from Clerk Dashboard
3. Generate a client secret
4. Paste Client ID and Client Secret into Clerk

GitHub is the simplest provider to configure.

### Phase 2 Provider Setup Summary

#### Apple (Production)

1. Create an App ID in Apple Developer account
2. Create a Services ID (this becomes the OAuth Client ID)
3. Configure the Services ID with the redirect URI from Clerk
4. Create a private key for Sign in with Apple
5. Register the email relay domain for Apple Private Email Relay
6. Paste Apple Services ID, Private Key, Team ID, and Key ID into
   Clerk

**Operational concern**: Apple Private Email Relay hides the user's
real email address. Clerk handles relay emails, but the relay source
domain must be registered and verified with Apple.

#### LinkedIn (Production)

1. Create a LinkedIn Developer app at
   [linkedin.com/developers](https://www.linkedin.com/developers/)
2. Request access to "Sign In with LinkedIn using OpenID Connect"
   product (requires LinkedIn approval)
3. Add authorised redirect URI from Clerk Dashboard
4. Paste Client ID and Client Secret into Clerk

**Operational concern**: LinkedIn restricts API products. The "Sign In
with LinkedIn using OpenID Connect" product must be explicitly
requested and approved before credentials work.

#### GitLab (Production)

1. Create a new application in GitLab User Settings > Applications
2. Set redirect URI from Clerk Dashboard
3. Select `read_user` and `openid` scopes
4. Paste Application ID and Secret into Clerk

GitLab is straightforward, comparable to GitHub in setup effort.

### Provider Hardening Checklist

Before enabling each provider in production, verify:

| Check | Google | Microsoft | GitHub | Apple | LinkedIn | GitLab |
| ----- | ------ | --------- | ------ | ----- | -------- | ------ |
| Email verified by provider? | Yes (Google accounts) | Yes (`xms_edov` claim) | Yes (primary verified email) | Yes (but may be relay address) | Yes (LinkedIn verified) | Yes (GitLab verified) |
| Block email subaddresses? | Yes (enable in Clerk) | N/A | N/A | N/A | N/A | N/A |
| nOAuth vulnerability mitigated? | N/A | Yes (`xms_edov` claim) | N/A | N/A | N/A | N/A |
| Account linking policy? | Clerk default (email match) | Clerk default (email match) | Clerk default (email match) | Relay email may not match — verify Clerk handles linking | Clerk default (email match) | Clerk default (email match) |
| Expiring credentials? | No | Yes (24 months max) | No | No | No | No |
| Publishing/approval required? | Yes (Google verification) | No | No | No | Yes (LinkedIn product approval) | No |
| Private email relay? | No | No | No | Yes (must register domain) | No | No |

---

## 4. Access Control Strategy

### Current State

- Allowlist enabled with `@thenational.academy` domain wildcard
- Only Oak staff can sign up
- Allowlist is a **Pro feature** — free in development, requires a
  paid Clerk plan in production

### Dependency on Instance Decision

If sharing Aila's instance (Section 0, Option A), the access control
strategy is constrained by Aila's requirements. The options below
assume an **independent instance** (Option B).

### Options for Public Alpha

| Option | Description | Pros | Cons |
| ------ | ----------- | ---- | ---- |
| **A: Public sign-up** | Remove allowlist, allow anyone to sign up via enabled social providers | Simplest. Maximum reach. No admin overhead for user access. | No control over who accesses the API. Potential for abuse. |
| **B: Waitlist** | Users register interest, admins approve access | Controlled rollout. Generates interest list. Users see a clear "join waitlist" flow. | Admin overhead to approve users. Slower onboarding. |
| **C: Invite-only (Restricted mode)** | Users can only sign up via invitation link, enterprise connection, or manual creation | Tightest control. Good for small alpha with known participants. | Highest admin overhead. Poor self-service experience. |
| **D: Public + blocklist** | Public sign-up with blocklist for known-bad domains (disposable email providers, etc.) | Open access with basic abuse prevention. | Reactive rather than proactive. Disposable email blocking is built into Clerk separately. |
| **E: Public + domain allowlist** | Keep allowlist but expand to include partner organisation domains alongside `thenational.academy` | Controlled expansion. Clear boundary. | Doesn't scale to unknown external users. Requires knowing partner domains in advance. |

### Recommendation

**Option A (Public sign-up) with safety rails** is recommended for
public alpha, contingent on the operational controls in
[Section 8](#8-operational-security-controls) being in place before
launch:

1. Remove the `@thenational.academy` allowlist restriction
2. Enable **"Block disposable email addresses"** (Clerk built-in
   feature) to prevent throwaway account spam
3. Keep **"Block email subaddresses"** enabled on Google OAuth
4. Enable all three Phase 1 social providers (Google, Microsoft,
   GitHub)
5. Implement edge rate limiting on unauthenticated endpoints
   (see [Section 8](#8-operational-security-controls))
6. Set up monitoring and alerting for sign-up velocity and abuse
   patterns
7. Define rollback criteria — conditions under which the allowlist
   is re-enabled or sign-up mode switches to waitlist
8. Retain the ability to enable allowlist/blocklist reactively

**Rationale**: The MCP server is an API access tool, not a
user-facing application with sensitive data. The upstream Oak Open
Curriculum API already has its own rate limiting and API key
requirements. Adding friction to sign-up (waitlist, invitations) would
slow adoption without proportional security benefit. The social
provider requirement itself acts as a natural filter — users must have
a Google, Microsoft, or GitHub account.

**Rollback plan**: If abuse is detected (anomalous sign-up velocity,
bot patterns, quota exhaustion), the response ladder is:

1. Enable blocklist for offending domains/emails
2. Switch to waitlist mode (requires no code changes — Clerk Dashboard
   toggle)
3. Re-enable allowlist with expanded domain set

If tighter control is desired from the start, **Option B (Waitlist)**
is the next-best choice. It provides a clear onboarding path without
the administrative burden of individual invitations.

---

## 5. Pricing Considerations

### Clerk Plans

| Feature | Free | Pro |
| ------- | ---- | --- |
| MAU limit | 10,000 | Unlimited |
| Allowlist/Blocklist | Development only | Production |
| Social connections | Yes | Yes |
| Dynamic client registration | Yes | Yes |
| Custom domain | No | Yes |
| Remove Clerk branding | No | Yes |

**Key insight**: A **paid plan is required** for production because:

- Custom domain is required for production deployment
- Allowlist/blocklist features are paid in production (even if we
  switch to public sign-up, the blocklist for disposable emails is
  useful)
- Clerk branding removal is desirable for a professional experience

### Cost Estimate

Clerk Pro starts at $25/month (as of 2026) for the first 1,000 MAU,
then $0.02/MAU beyond that. For a public alpha with expected
hundreds of users, the cost is minimal. If using an independent
instance (Section 0, Option B), this is a separate subscription from
Aila's.

---

## 6. Code and Configuration Changes

### Code Changes Required

Despite the codebase being largely provider-agnostic, the following
code change is needed:

| Change | Location | Detail |
| ------ | -------- | ------ |
| `CLERK_AUTHORIZED_PARTIES` env var | `src/env.ts` (Zod schema), `src/auth-routes.ts` (`setupGlobalAuthContext`) | Add environment variable for `authorizedParties`, parsed as comma-separated list. Pass to `clerkMiddleware()` config. Required so preview/staging/production deployments each have their own allowed origins. |

### Configuration-Only Changes

| Change | Location | Detail |
| ------ | -------- | ------ |
| Production API keys | Vercel env vars | `CLERK_PUBLISHABLE_KEY=pk_live_...`, `CLERK_SECRET_KEY=sk_live_...` |
| Authorised parties | Vercel env vars | `CLERK_AUTHORIZED_PARTIES=https://curriculum-mcp.oaknational.dev` (per environment) |
| Edge rate limiting | Vercel / WAF config | Rate limits on `/oauth/register`, `/oauth/authorize`, `/oauth/token` (see [Section 8](#8-operational-security-controls)) |
| Smoke test config | `smoke-tests/environment.ts`, `smoke-tests/auth/` | Development keys only for mutating tests |
| Documentation | READMEs, onboarding docs | Update references to production URLs |

### What Does NOT Need Code Changes

- `deriveUpstreamOAuthBaseUrl()` — dynamically derives the Clerk URL
  from the publishable key
- OAuth proxy — transparent and stateless, works with any Clerk
  instance
- Token verification — uses `getAuth()` with
  `acceptsToken: 'oauth_token'`
- No hardcoded Clerk instance URLs in production code

### Verification Steps

**Non-mutating production verification** (safe with production keys):

1. Deploy with production keys to staging/preview environment
2. Verify PRM endpoint returns correct metadata
   (`/.well-known/oauth-protected-resource`)
3. Verify AS metadata endpoint returns rewritten self-origin URLs
   (`/.well-known/oauth-authorization-server`)
4. Verify unauthenticated `/mcp` returns 401 with correct
   `WWW-Authenticate` header
5. Verify DCR endpoint responds (`/oauth/register`) — POST with test
   client metadata
6. Verify each social provider sign-in flow manually (browser-based)
7. Verify full OAuth flow in Cursor (DCR, authorise, token exchange,
   authenticated MCP call)
8. Verify full OAuth flow in MCP Inspector

**Mutating tests** (development keys only):

9. Run `pnpm smoke:oauth:spec` against development instance
10. Run full smoke suite against development instance

---

## 7. Risk Assessment

| Risk | Severity | Mitigation |
| ---- | -------- | ---------- |
| **Shared-instance access control conflict** | **Critical** | Resolve Section 0 decision before proceeding. If shared, access control is constrained by Aila's requirements. |
| **Unauthenticated proxy endpoint abuse** | **High** | Edge/WAF rate limiting on `/oauth/register`, `/oauth/authorize`, `/oauth/token` is a go-live gate (ADR-115 deployment precondition). Without it, volumetric attacks risk upstream Clerk API quota exhaustion and Vercel egress costs. |
| **Host header manipulation** | **High** | Verify Vercel enforces canonical host/protocol. The OAuth proxy derives self-origin from the `Host` header to rewrite AS metadata (ADR-115). Malicious `Host` headers could cause metadata to advertise incorrect OAuth endpoints. |
| **Allowlist removal without abuse controls** | **High** | Implement monitoring, alerting, and rollback criteria before removing the allowlist. See [Section 8](#8-operational-security-controls). |
| Google OAuth verification delay | Medium | Submit verification early. While in "Testing", limited to 100 test users — acceptable for early alpha with manual test user addition. |
| Microsoft client secret expiry | Medium | Set calendar reminder. Document rotation procedure. Microsoft secrets expire after max 24 months. |
| **Opaque token assumption** | Medium | The OAuth proxy (ADR-115) relies on Clerk issuing opaque tokens (`oat_...`). If Clerk switches to JWT access tokens, the issuer mismatch (`issuer: "https://mcp.oaknational.academy"` vs Clerk's actual issuer) will break clients that validate `iss` claims. Monitor Clerk changelog for token format changes. |
| Clerk pricing changes | Low | Pro plan cost is minimal. Lock in pricing if possible. |
| DNS propagation delay | Low | Submit DNS records early. Allow 48-hour buffer before launch. |
| Cursor `resource_metadata` bug persists | Low | Proxy (ADR-115) already handles this. No additional work needed. |

---

## 8. Operational Security Controls

These controls are **go-live gates** — they must be in place before
the production instance is exposed to public traffic.

### Edge Rate Limiting

The OAuth proxy endpoints are unauthenticated and forward requests to
Clerk. Without rate limiting, they are vulnerable to volumetric
attacks.

| Endpoint | Type | Recommended Limit | Rationale |
| -------- | ---- | ----------------- | --------- |
| `POST /oauth/register` | DCR | 10 req/min per IP | Client registration is infrequent. Legitimate clients register once. |
| `GET /oauth/authorize` | Redirect | 30 req/min per IP | Users may retry failed auth. Higher limit than DCR. |
| `POST /oauth/token` | Token exchange | 30 req/min per IP | Token exchange happens once per auth flow. Refresh adds volume. |
| `GET /.well-known/*` | Metadata | 60 req/min per IP | Discovery endpoints are cacheable. Higher limit acceptable. |

**Implementation**: Vercel Edge Middleware, Vercel WAF rules, or
Cloudflare rate limiting if fronted. Application-layer rate limiting
is not sufficient for unauthenticated endpoints — it must be at the
edge.

### Monitoring and Alerting

| Signal | Threshold | Action |
| ------ | --------- | ------ |
| Sign-up velocity | > 50 new accounts/hour | Alert. Investigate for bot patterns. |
| DCR registration velocity | > 20 new clients/hour | Alert. Possible registration flood. |
| Failed auth rate (401/403) | > 100/hour from single IP | Block IP at edge. |
| Clerk API quota usage | > 80% of plan limit | Alert. Upgrade plan or throttle. |
| Unusual social provider distribution | > 90% from single provider | Investigate. May indicate targeted abuse. |

### Incident Response

| Severity | Condition | Response |
| -------- | --------- | -------- |
| **P1** | Clerk API quota exhausted or proxy DDoS | Enable Clerk allowlist (restrict to `@thenational.academy`). Block offending IPs at edge. |
| **P2** | Bot sign-up pattern detected | Enable blocklist for offending domains. Switch to waitlist mode. |
| **P3** | Unusual but non-harmful traffic pattern | Monitor. Adjust rate limits if needed. |

### Canonical Host Enforcement

The OAuth proxy derives self-origin from the request `Host` header.
Verify that the production ingress layer enforces a canonical host:

- **Vercel**: Automatically enforces the configured domain. Verify
  with `curl -H "Host: evil.com"` — should redirect to canonical
  domain or reject.
- **Cloudflare** (if fronted): Ensure "Host Header Override" is not
  configured.

---

## 9. Recommended Execution Order

### Track A: Independent Instance (Recommended)

1. **Resolve Section 0 decision** — confirm independent instance
2. **Amend ADR-053** if departing from shared-instance mandate
3. **Create production Clerk instance** (Clerk Dashboard)
4. **Activate Clerk Pro plan**
5. **Configure domain and DNS** (Clerk Dashboard + DNS provider)
6. **Verify canonical host enforcement** on Vercel
7. **Configure edge rate limiting** on OAuth proxy endpoints
8. **Set up Google OAuth credentials** (Google Cloud Console + Clerk
   Dashboard) — start verification process early
9. **Set up GitHub OAuth credentials** (GitHub Developer Settings +
   Clerk Dashboard)
10. **Set up Microsoft OAuth credentials** (Azure Portal + Clerk
    Dashboard)
11. **Run provider hardening checklist** (Section 3)
12. **Configure access control** (remove allowlist, enable disposable
    email blocking)
13. **Enable DCR** in production OAuth application settings
14. **Implement `CLERK_AUTHORIZED_PARTIES`** env var in codebase
15. **Set up monitoring and alerting** (Section 8)
16. **Define rollback criteria** for access control
17. **Deploy with production keys** to staging/preview environment
18. **Run non-mutating verification** (Section 6)
19. **Run mutating smoke tests** against development instance
20. **Deploy certificates** (Clerk Dashboard)
21. **Go live**

### Track B: Shared Instance (If Chosen)

1. **Resolve Section 0 decision** — confirm shared instance
2. **Request access to Aila's production Clerk instance**
3. **Verify existing social provider configuration** meets MCP
   requirements
4. **Verify canonical host enforcement** on Vercel
5. **Configure edge rate limiting** on OAuth proxy endpoints
6. **Accept Aila's access control constraints** (no allowlist
   changes)
7. **Enable DCR** in Aila's production OAuth application settings
   (coordinate with Aila team)
8. **Implement `CLERK_AUTHORIZED_PARTIES`** env var in codebase
9. **Set up monitoring and alerting** (Section 8)
10. **Deploy with production keys** to staging/preview environment
11. **Run non-mutating verification** (Section 6)
12. **Run mutating smoke tests** against development instance
13. **Deploy certificates** (if not already deployed for Aila)
14. **Go live**

---

## 10. Open Questions

1. **Which domain to use?** A dedicated subdomain
   (e.g. `mcp.oaknational.academy`) is recommended for isolation.
   This affects DNS setup, cookie scope, and social provider redirect
   URIs.
2. **Paid plan timing**: When should the Clerk Pro plan be activated?
   Before or after creating the production instance?
3. **Google OAuth verification**: How long does Google's app
   verification take? Should we start the process immediately?
4. **Access control preference**: Public sign-up (recommended) or
   controlled access (waitlist/invite)?

---

## References

- [Deploy your Clerk app to production](https://clerk.com/docs/guides/development/deployment/production)
- [How to take your Clerk application to production](https://clerk.com/blog/how-to-take-your-clerk-app-to-prod)
- [Managing Clerk environments](https://clerk.com/docs/guides/development/managing-environments)
- [Social connections overview](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/overview)
- [Google OAuth setup](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google)
- [Microsoft setup](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/microsoft)
- [GitHub setup](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/github)
- [Apple setup](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/apple)
- [LinkedIn setup](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/linkedin-oidc)
- [GitLab setup](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/gitlab)
- [Clerk restrictions](https://clerk.com/docs/authentication/configuration/restrictions)
- [Connect MCP clients](https://clerk.com/docs/mcp/connect-mcp-client)
- [Clerk MCP server guide](https://clerk.com/docs/mcp/build-mcp-server)
- [Clerk CSP guide](https://clerk.com/docs/guides/secure/best-practices/csp-headers)
