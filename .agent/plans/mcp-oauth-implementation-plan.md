<!-- markdownlint-disable -->

# MCP OAuth 2.1 Implementation Plan (Clerk Integration)

**Status**: ACTIVE  
**Date**: 2024-10-16  
**Owner**: Engineering (Platform/Security)  
**Last Updated**: 2024-10-16

## Executive Summary

Implement production-ready OAuth 2.1 authentication for the Oak Curriculum MCP Streamable HTTP server using Clerk as the Authorization Server (AS). This approach unifies authentication across Oak applications (Aila, Semantic Search, and MCP Server), leverages battle-tested infrastructure, and maintains full MCP specification compliance.

## Decision Rationale

**Why Clerk over Custom AS:**

- **Simplicity**: Eliminates need to build/maintain custom OAuth infrastructure
- **Security**: Battle-tested, SOC 2 compliant, professionally maintained
- **Unified Auth**: Shares user base and policies with existing Aila application
- **MCP Compliance**: Full OAuth 2.1 support via OIDC discovery proxy
- **Maintenance**: Zero ongoing security patch burden for AS
- **Time to Market**: ~80% reduction in implementation time vs custom AS

## Core References

- [Clerk Unified Auth Research](../../research/clerk-unified-auth-mcp-nextjs.md) (Primary implementation guide)
- [AGENT.md](../../.agent/directives-and-memory/AGENT.md) (Development Practice, Testing Strategy)
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) (TDD/BDD approach)
- [MCP TypeScript SDK README](../../.agent/reference-docs/mcp-typescript-sdk-readme.md)
- `apps/oak-curriculum-mcp-streamable-http/src` (Current MCP server)

## Goals

### Primary Goals

- **Resource Server (RS)** implementation with Clerk token validation
- **MCP Discovery Compliance** via Clerk OIDC proxy
- **Unified Authentication** across Aila, Semantic Search, and MCP Server
- **Production Hardening** with CI smoke checks and security controls
- **Internal-First Access** with domain allowlist for `*.thenational.academy`

### Secondary Goals

- Remove static/dev token flows from production environments
- Document complete OAuth flow with examples
- Establish monitoring and observability for auth failures

## Non-Goals

- Building a custom Authorization Server (Clerk provides this)
- Changing MCP transport protocol (SSE remains deprecated)
- Altering SDK compile-time generation flows
- Supporting non-OAuth authentication methods in production
- Backwards compatibility with previous auth mechanisms

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Clerk Instance                          │
│                    (Shared across all apps)                     │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ User Store   │  │ Google SSO   │  │ Microsoft    │        │
│  │ & Sessions   │  │ Integration  │  │ Entra ID SSO │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │  OAuth 2.1 / OIDC Endpoints                      │         │
│  │  - /.well-known/openid-configuration             │         │
│  │  - /oauth/authorize                              │         │
│  │  - /oauth/token                                  │         │
│  │  - /.well-known/jwks.json                        │         │
│  └──────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴──────────┐
                    │                    │
           ┌────────▼────────┐  ┌────────▼────────┐
           │  Semantic       │  │  Aila           │
           │  Search App     │  │  (Existing)     │
           │  Next.js        │  │  Next.js        │
           │  @clerk/nextjs  │  │  @clerk/nextjs  │
           └────────┬────────┘  └─────────────────┘
                    │
                    │ Authorization: Bearer <token>
                    │
           ┌────────▼────────────────────────────────┐
           │  MCP Server (Resource Server)           │
           │  Express on Vercel                      │
           │  @clerk/express                         │
           │                                         │
           │  ┌───────────────────────────────────┐ │
           │  │ Token Validation                  │ │
           │  │ - Verify signature via JWKS       │ │
           │  │ - Check iss/aud/exp/iat           │ │
           │  │ - Enforce authorizedParties       │ │
           │  └───────────────────────────────────┘ │
           │                                         │
           │  ┌───────────────────────────────────┐ │
           │  │ Discovery Proxy                   │ │
           │  │ /.well-known/oauth-authorization- │ │
           │  │   server → Clerk OIDC discovery   │ │
           │  └───────────────────────────────────┘ │
           └─────────────────────────────────────────┘
```

## Implementation Phases

### Phase 0: Prerequisites and Planning

**Duration**: 1 day  
**Owner**: Platform Team

#### Tasks

1. **Document Current State** (30 min)
   - [ ] Audit existing authentication code in `apps/oak-curriculum-mcp-streamable-http`
   - [ ] Identify all static token flows to be removed
   - [ ] Document current environment variables
   - **Acceptance**: Markdown document listing all auth-related code paths

2. **Gather Clerk Credentials** (30 min)
   - [ ] Access existing Aila Clerk Production instance
   - [ ] Document Frontend API URL
   - [ ] Document OIDC Discovery URL
   - [ ] Obtain Publishable Key (will be `CLERK_PUBLISHABLE_KEY`)
   - [ ] Obtain Secret Key (will be `CLERK_SECRET_KEY`)
   - [ ] Obtain JWT Key for networkless verification (will be `CLERK_JWT_KEY`)
   - **Acceptance**: All 5 credentials documented in secure notes

3. **Create Feature Branch** (5 min)
   - [ ] Create branch: `feature/clerk-oauth-integration`
   - [ ] Push empty commit to trigger CI baseline
   - **Acceptance**: Branch exists and CI runs successfully

4. **Set Up Local Environment** (15 min)
   - [ ] Create `.env.local` in `apps/oak-curriculum-mcp-streamable-http`
   - [ ] Add Clerk credentials for local development
   - [ ] Add `CLERK_OIDC_DISCOVERY_URL` for discovery proxy
   - [ ] Document expected environment variables in README
   - **Acceptance**: Local env file works, documented in README

**Phase 0 Definition of Done**:

- ✅ Current state documented
- ✅ All Clerk credentials obtained and secured
- ✅ Feature branch created with green CI
- ✅ Local environment configured

---

### Phase 1: Clerk Project Configuration

**Duration**: 2-3 hours  
**Owner**: Platform Team  
**Prerequisites**: Phase 0 complete

#### Tasks

1. **Configure Domain Allowlist** (15 min)
   - [ ] Navigate to Clerk Dashboard → Configuration → Restrictions
   - [ ] Enable **Allowlist** mode
   - [ ] Add domain: `thenational.academy`
   - [ ] Test: Attempt sign-up with non-thenational.academy email (should fail)
   - [ ] Test: Attempt sign-up with thenational.academy email (should succeed)
   - **Acceptance**: Only `*.thenational.academy` emails can sign in

2. **Configure Google Social Connection** (30 min)
   - [ ] Navigate to Clerk Dashboard → SSO Connections → Social
   - [ ] Add Google provider
   - [ ] Use Oak's production Google OAuth credentials
   - [ ] Ensure Google app status is "In production" (not "Testing")
   - [ ] Enable "Block email subaddresses" option
   - [ ] Test: Sign in with `user@thenational.academy` Google account
   - **Acceptance**: Google SSO works with thenational.academy accounts

3. **Configure Microsoft Social Connection** (45 min)
   - [ ] Navigate to Clerk Dashboard → SSO Connections → Social
   - [ ] Add Microsoft provider
   - [ ] Create Azure AD app registration (if not exists)
   - [ ] Configure redirect URI from Clerk to Azure app
   - [ ] Configure client ID and secret in Clerk
   - [ ] Test: Sign in with `user@thenational.academy` Microsoft account
   - **Acceptance**: Microsoft SSO works with thenational.academy accounts

4. **Create OAuth Application in Clerk** (30 min)
   - [ ] Navigate to Clerk Dashboard → OAuth Applications
   - [ ] Create new OAuth Application: "Oak Curriculum MCP Server"
   - [ ] Note the Discovery URL (OIDC configuration endpoint)
   - [ ] Note the Authorize URL
   - [ ] Note the Token URL
   - [ ] Note the JWKS URL
   - [ ] Configure redirect URIs for local, preview, and production
   - **Acceptance**: OAuth app configured with all endpoints documented

5. **Document Configuration** (30 min)
   - [ ] Create `docs/architecture/clerk-oauth-configuration.md`
   - [ ] Document all Clerk settings
   - [ ] Document environment variables required
   - [ ] Document testing procedures
   - [ ] Add architecture diagrams
   - **Acceptance**: Complete configuration documentation exists

**Phase 1 Definition of Done**:

- ✅ Domain allowlist active and tested
- ✅ Google SSO configured and tested
- ✅ Microsoft SSO configured and tested
- ✅ OAuth application created in Clerk
- ✅ Complete configuration documentation

---

### Phase 2: Resource Server Implementation (TDD)

**Duration**: 1-2 days  
**Owner**: Platform Team  
**Prerequisites**: Phase 1 complete

#### Tasks

1. **Install Dependencies** (5 min)
   - [ ] Add `@clerk/express` to `apps/oak-curriculum-mcp-streamable-http`
   - [ ] Add `@clerk/backend` for networkless verification
   - [ ] Add `cors` package if not present
   - [ ] Run `pnpm install`
   - [ ] Verify no dependency conflicts
   - **Acceptance**: `pnpm build` succeeds with new dependencies

2. **Create Auth Middleware (TDD)** (2 hours)
   - [ ] **RED**: Write test `src/middleware/auth.integration.test.ts`
     - Test: Valid Clerk token passes through
     - Test: Invalid token returns 401
     - Test: Missing token returns 401
     - Test: Expired token returns 401
     - Test: Token with wrong `azp` (authorized parties) returns 401
     - Test: `WWW-Authenticate: Bearer` header present on 401
   - [ ] **GREEN**: Implement `src/middleware/auth.ts`
     - Import `clerkMiddleware` from `@clerk/express`
     - Configure `authorizedParties` with allowed origins
     - Attach to Express app
   - [ ] **GREEN**: Implement `src/middleware/require-auth.ts`
     - Create guard that checks `getAuth(req).sessionId`
     - Return 401 with `WWW-Authenticate: Bearer` if missing
     - Pass through if valid
   - [ ] **REFACTOR**: Extract configuration to `src/config/clerk.ts`
   - [ ] Run tests: `pnpm test src/middleware/auth.integration.test.ts`
   - **Acceptance**: All 6 tests pass, 100% coverage on middleware

3. **Implement Networkless Verification (TDD)** (2 hours)
   - [ ] **RED**: Write test `src/middleware/verify-bearer.integration.test.ts`
     - Test: Valid JWT signature passes
     - Test: Invalid signature fails
     - Test: Expired JWT fails
     - Test: Missing required claims fails
     - Test: `authorizedParties` enforcement works
   - [ ] **GREEN**: Implement `src/middleware/verify-bearer.ts`
     - Import `createClerkClient` from `@clerk/backend`
     - Use `authenticateRequest()` with `jwtKey` option
     - Enforce `authorizedParties`
     - Attach `req.auth` with validated claims
   - [ ] **REFACTOR**: Share token validation logic
   - [ ] Run tests: `pnpm test src/middleware/verify-bearer.integration.test.ts`
   - **Acceptance**: All 5 tests pass, networkless verification works

4. **Configure CORS** (1 hour)
   - [ ] **RED**: Write test `src/middleware/cors.integration.test.ts`
     - Test: Allowed origins can make requests
     - Test: Disallowed origins are rejected
     - Test: Preflight requests work correctly
     - Test: `Authorization` header allowed
     - Test: `MCP-Protocol-Version` header allowed
   - [ ] **GREEN**: Implement `src/middleware/cors.ts`
     - Configure allowed origins (Semantic Search, Aila, localhost)
     - Add `Authorization` and `MCP-Protocol-Version` to allowed headers
     - Set `credentials: true`
   - [ ] **REFACTOR**: Extract origins to environment config
   - [ ] Run tests: `pnpm test src/middleware/cors.integration.test.ts`
   - **Acceptance**: All 5 tests pass, CORS properly configured

5. **Integrate into Express App** (1 hour)
   - [ ] Update `src/server.ts` to use new middleware
   - [ ] Apply CORS middleware first
   - [ ] Apply `clerkMiddleware()` second
   - [ ] Apply `requireAuth` to protected routes
   - [ ] Keep health endpoint public (`GET /`)
   - [ ] Protect MCP endpoint (`POST /mcp`)
   - [ ] Run `pnpm build`
   - **Acceptance**: Server starts successfully with all middleware

6. **Add Environment Variable Validation** (1 hour)
   - [ ] **RED**: Write test `src/config/env.unit.test.ts`
     - Test: Missing `CLERK_PUBLISHABLE_KEY` throws
     - Test: Missing `CLERK_SECRET_KEY` throws
     - Test: Missing `CLERK_JWT_KEY` throws
     - Test: Invalid key format throws
     - Test: Valid config returns typed object
   - [ ] **GREEN**: Implement `src/config/env.ts`
     - Use `@oaknational/mcp-env` for validation
     - Define Clerk-specific environment variables
     - Fail fast if missing/invalid
   - [ ] **REFACTOR**: Use typed config throughout
   - [ ] Run tests: `pnpm test src/config/env.unit.test.ts`
   - **Acceptance**: All 5 tests pass, env validation robust

**Phase 2 Definition of Done**:

- ✅ All dependencies installed successfully
- ✅ Auth middleware implemented with passing tests
- ✅ Networkless verification implemented with passing tests
- ✅ CORS configured with passing tests
- ✅ Middleware integrated into Express app
- ✅ Environment validation implemented
- ✅ `pnpm build` succeeds
- ✅ `pnpm test` shows 100% coverage on new middleware
- ✅ `pnpm lint` passes with no errors

---

### Phase 3: MCP Discovery Endpoint Implementation (TDD)

**Duration**: 4-6 hours  
**Owner**: Platform Team  
**Prerequisites**: Phase 2 complete

#### Tasks

1. **Create Discovery Proxy (TDD)** (2 hours)
   - [ ] **RED**: Write test `src/routes/discovery.integration.test.ts`
     - Test: GET `/.well-known/oauth-authorization-server` returns 200
     - Test: Response is valid JSON
     - Test: Response contains required OAuth 2.1 fields:
       - `issuer`
       - `authorization_endpoint`
       - `token_endpoint`
       - `jwks_uri`
     - Test: Response caching headers are appropriate
     - Test: Clerk discovery URL failure handled gracefully
   - [ ] **GREEN**: Implement `src/routes/discovery.ts`
     - Create route handler for `/.well-known/oauth-authorization-server`
     - Fetch from `process.env.CLERK_OIDC_DISCOVERY_URL`
     - Return proxied response
     - Add error handling for fetch failures
     - Set appropriate cache headers (e.g., `Cache-Control: max-age=3600`)
   - [ ] **REFACTOR**: Extract fetch logic to service layer
   - [ ] Run tests: `pnpm test src/routes/discovery.integration.test.ts`
   - **Acceptance**: All 5 tests pass, discovery endpoint works

2. **Add Discovery Service Layer (TDD)** (1 hour)
   - [ ] **RED**: Write test `src/services/discovery.unit.test.ts`
     - Test: `fetchClerkDiscovery()` returns parsed JSON
     - Test: Network errors are caught and logged
     - Test: Invalid JSON responses are handled
     - Test: Discovery result is cached in memory
     - Test: Cache expires after TTL
   - [ ] **GREEN**: Implement `src/services/discovery.ts`
     - Implement `fetchClerkDiscovery()` function
     - Add in-memory caching with TTL (1 hour)
     - Add retry logic with exponential backoff
     - Use `@oaknational/mcp-logger` for errors
   - [ ] **REFACTOR**: Use dependency injection for fetch
   - [ ] Run tests: `pnpm test src/services/discovery.unit.test.ts`
   - **Acceptance**: All 5 tests pass, service layer robust

3. **Validate MCP Spec Compliance** (1 hour)
   - [ ] **RED**: Write test `src/routes/discovery.spec.test.ts`
     - Test: Endpoint is at exact path `/.well-known/oauth-authorization-server`
     - Test: Response includes MCP-required fields
     - Test: `issuer` matches expected Clerk issuer
     - Test: All endpoint URLs are HTTPS
     - Test: JWKS URI is accessible
   - [ ] **GREEN**: Ensure implementation passes spec tests
   - [ ] Run tests: `pnpm test src/routes/discovery.spec.test.ts`
   - **Acceptance**: All MCP spec requirements validated

4. **Add Observability** (1 hour)
   - [ ] Add structured logging for discovery requests
   - [ ] Add metrics for discovery endpoint latency
   - [ ] Add alerts for discovery fetch failures
   - [ ] Log cache hit/miss rates
   - [ ] Use `@oaknational/mcp-logger` consistently
   - **Acceptance**: All discovery activity is observable

5. **Integration Test** (1 hour)
   - [ ] Start local server with real Clerk credentials
   - [ ] Test: `curl http://localhost:3000/.well-known/oauth-authorization-server`
   - [ ] Verify response matches Clerk's discovery document
   - [ ] Verify all URLs are absolute and correct
   - [ ] Document manual testing procedure
   - **Acceptance**: Manual curl test succeeds, documented

**Phase 3 Definition of Done**:

- ✅ Discovery endpoint implemented with passing tests
- ✅ Service layer with caching and error handling
- ✅ MCP specification compliance validated
- ✅ Observability added (logging, metrics)
- ✅ Manual integration test documented and passing
- ✅ `pnpm test` passes with 100% coverage on discovery code
- ✅ `pnpm lint` passes

---

### Phase 4: Semantic Search Integration

**Duration**: 1 day  
**Owner**: Frontend Team  
**Prerequisites**: Phase 3 complete, MCP server deployed to preview

#### Tasks

1. **Install Clerk in Semantic Search** (15 min)
   - [ ] Navigate to `apps/oak-open-curriculum-semantic-search`
   - [ ] Add `@clerk/nextjs` dependency
   - [ ] Run `pnpm install`
   - [ ] Verify build succeeds
   - **Acceptance**: Package installed, builds successfully

2. **Configure Clerk Provider** (30 min)
   - [ ] Update `app/layout.tsx` with `<ClerkProvider>`
   - [ ] Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env.local`
   - [ ] Add `CLERK_SECRET_KEY` to `.env.local`
   - [ ] Configure domain and paths as needed
   - [ ] Test: Start dev server, verify no errors
   - **Acceptance**: Clerk provider active, no console errors

3. **Add Sign-In Flow (TDD)** (2 hours)
   - [ ] **RED**: Write test `app/auth/signin/page.test.tsx`
     - Test: Sign-in page renders
     - Test: Google button present
     - Test: Microsoft button present
     - Test: Redirect to dashboard after sign-in
   - [ ] **GREEN**: Create `app/auth/signin/page.tsx`
     - Use `<SignIn />` component from Clerk
     - Configure redirect to `/`
     - Style according to Oak design system
   - [ ] **REFACTOR**: Extract auth layout
   - [ ] Run tests: `pnpm test app/auth/signin`
   - **Acceptance**: Sign-in page works, tests pass

4. **Protect Routes with Middleware** (1 hour)
   - [ ] Create `middleware.ts` at app root
   - [ ] Use `authMiddleware` from `@clerk/nextjs`
   - [ ] Define public routes (e.g., `/`, `/about`)
   - [ ] Protect all other routes by default
   - [ ] Test: Unauthenticated access redirects to sign-in
   - **Acceptance**: Route protection works as expected

5. **Create MCP Client Wrapper (TDD)** (2 hours)
   - [ ] **RED**: Write test `src/lib/mcp-client.test.ts`
     - Test: `useMcpFetch` hook attaches Bearer token
     - Test: Token refresh on 401 response
     - Test: Error handling for auth failures
     - Test: Request retries with new token
   - [ ] **GREEN**: Implement `src/lib/mcp-client.ts`
     - Create `useMcpFetch()` hook
     - Use `useAuth()` from `@clerk/nextjs`
     - Call `getToken()` and attach to `Authorization` header
     - Handle 401 responses with token refresh
   - [ ] **REFACTOR**: Extract to reusable hook
   - [ ] Run tests: `pnpm test src/lib/mcp-client.test.ts`
   - **Acceptance**: All tests pass, hook works correctly

6. **Update Existing MCP Calls** (2 hours)
   - [ ] Find all `fetch()` calls to MCP server
   - [ ] Replace with `useMcpFetch()` hook
   - [ ] Test each integration manually
   - [ ] Verify Bearer tokens are sent
   - [ ] Verify responses are correct
   - **Acceptance**: All MCP calls use authenticated fetch

7. **Integration Test** (1 hour)
   - [ ] Sign in with thenational.academy account
   - [ ] Make MCP request (e.g., search query)
   - [ ] Verify request succeeds
   - [ ] Open network inspector, verify `Authorization: Bearer` header
   - [ ] Sign out, verify protected routes redirect
   - **Acceptance**: End-to-end auth flow works

**Phase 4 Definition of Done**:

- ✅ Clerk installed in Semantic Search app
- ✅ Sign-in flow implemented and tested
- ✅ Routes protected with middleware
- ✅ MCP client wrapper implemented with tests
- ✅ All MCP calls updated to use authenticated fetch
- ✅ Manual integration test passing
- ✅ `pnpm test` passes in semantic-search app
- ✅ `pnpm build` succeeds

---

### Phase 5: Testing and CI Integration

**Duration**: 1-2 days  
**Owner**: Platform Team  
**Prerequisites**: Phases 2, 3, 4 complete

#### Tasks

1. **Create E2E Tests for MCP Server** (3 hours)
   - [ ] Create `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth.e2e.test.ts`
   - [ ] Test: Unauthenticated request to `/mcp` returns 401
   - [ ] Test: 401 includes `WWW-Authenticate: Bearer` header
   - [ ] Test: Valid Clerk token allows MCP request
   - [ ] Test: Expired token returns 401
   - [ ] Test: Token with wrong `azp` returns 401
   - [ ] Test: Discovery endpoint returns valid JSON
   - [ ] Configure test environment with real Clerk tokens
   - [ ] Run: `pnpm test:e2e`
   - **Acceptance**: All 6 E2E tests pass

2. **Create Smoke Tests for CI** (2 hours)
   - [ ] Create `apps/oak-curriculum-mcp-streamable-http/scripts/smoke-test.ts`
   - [ ] Test 1: `GET /` (health) returns 200
   - [ ] Test 2: `GET /.well-known/oauth-authorization-server` returns 200 with valid JSON
   - [ ] Test 3: `POST /mcp` without auth returns 401
   - [ ] Test 4: `POST /mcp` with valid token returns 200 (or appropriate MCP response)
   - [ ] Make script exit with code 1 on any failure
   - [ ] Add timeout handling (30s max)
   - **Acceptance**: Smoke test script runs successfully

3. **Integrate Smoke Tests into CI Pipeline** (1 hour)
   - [ ] Update `.github/workflows/deploy.yml` (or equivalent)
   - [ ] Add smoke test step after Vercel deployment
   - [ ] Pass deployment URL to smoke test script
   - [ ] Configure Clerk test credentials for CI
   - [ ] Test: Trigger deployment, verify smoke tests run
   - **Acceptance**: CI runs smoke tests on every deployment

4. **Add Monitoring Alerts** (1 hour)
   - [ ] Configure Sentry error tracking for auth failures
   - [ ] Add alert for high 401 rate (>5% of requests)
   - [ ] Add alert for discovery endpoint failures
   - [ ] Add alert for Clerk API failures
   - [ ] Test alerts by triggering failure conditions
   - **Acceptance**: Alerts configured and tested

5. **Load Testing** (2 hours)
   - [ ] Create load test script: `scripts/load-test-auth.ts`
   - [ ] Simulate 100 concurrent authenticated requests
   - [ ] Measure p50, p95, p99 latency
   - [ ] Measure error rate
   - [ ] Run against preview environment
   - [ ] Document results and acceptable thresholds
   - **Acceptance**: Load test passes with <500ms p95 latency

6. **Security Testing** (2 hours)
   - [ ] Test: Expired token is rejected
   - [ ] Test: Tampered token signature is rejected
   - [ ] Test: Token from different issuer is rejected
   - [ ] Test: Token with missing claims is rejected
   - [ ] Test: Token with wrong `azp` is rejected
   - [ ] Test: CORS violation is prevented
   - [ ] Document security test results
   - **Acceptance**: All security tests pass

**Phase 5 Definition of Done**:

- ✅ E2E tests implemented and passing
- ✅ Smoke test script created and working
- ✅ CI pipeline runs smoke tests on deployment
- ✅ Monitoring alerts configured
- ✅ Load testing completed with acceptable results
- ✅ Security testing completed, all tests pass
- ✅ All test results documented

---

### Phase 6: Production Hardening and Deployment

**Duration**: 1-2 days  
**Owner**: Platform Team  
**Prerequisites**: Phase 5 complete, all tests green

#### Tasks

1. **Remove Static Token Flows** (2 hours)
   - [ ] Audit codebase for static token authentication
   - [ ] Remove all static token validation code
   - [ ] Remove static token environment variables
   - [ ] Update documentation to remove static token references
   - [ ] Add migration guide for any existing users
   - [ ] Verify no static token code remains: `grep -r "STATIC_TOKEN"`
   - **Acceptance**: Zero static token references in production code

2. **Configure Vercel Environment Variables** (30 min)
   - [ ] Add `CLERK_PUBLISHABLE_KEY` to Vercel production
   - [ ] Add `CLERK_SECRET_KEY` to Vercel production
   - [ ] Add `CLERK_JWT_KEY` to Vercel production
   - [ ] Add `CLERK_OIDC_DISCOVERY_URL` to Vercel production
   - [ ] Configure allowed origins for CORS
   - [ ] Configure `authorizedParties` list
   - [ ] Test: Redeploy, verify environment variables load
   - **Acceptance**: All environment variables set correctly

3. **Deploy to Preview Environment** (1 hour)
   - [ ] Merge feature branch to `preview` branch
   - [ ] Trigger Vercel preview deployment
   - [ ] Monitor deployment logs for errors
   - [ ] Run smoke tests against preview URL
   - [ ] Test sign-in flow end-to-end
   - [ ] Test MCP request with authentication
   - [ ] Verify discovery endpoint works
   - **Acceptance**: Preview deployment successful, all tests pass

4. **Staged Rollout to Production** (2 hours)
   - [ ] Create release PR from `preview` to `main`
   - [ ] Request peer review from 2+ engineers
   - [ ] Address review feedback
   - [ ] Get approval from security team
   - [ ] Merge to `main` with squash commit
   - [ ] Monitor Vercel production deployment
   - [ ] Run smoke tests against production URL
   - **Acceptance**: Production deployment successful

5. **Monitor Initial Traffic** (4 hours)
   - [ ] Monitor Sentry for auth-related errors (first hour)
   - [ ] Monitor Vercel logs for 401 responses
   - [ ] Monitor Clerk dashboard for auth activity
   - [ ] Check discovery endpoint cache hit rates
   - [ ] Verify no unexpected error spikes
   - [ ] Document any issues and resolutions
   - **Acceptance**: No critical errors, <1% error rate

6. **Update Documentation** (2 hours)
   - [ ] Update `apps/oak-curriculum-mcp-streamable-http/README.md`
   - [ ] Document OAuth flow with diagrams
   - [ ] Document environment variables required
   - [ ] Document troubleshooting procedures
   - [ ] Add curl examples for testing
   - [ ] Document rate limits and quotas
   - [ ] Create `docs/architecture/clerk-oauth-implementation.md`
   - **Acceptance**: Complete, accurate documentation

7. **Create Runbook** (1 hour)
   - [ ] Document common auth failure scenarios
   - [ ] Document how to rotate Clerk credentials
   - [ ] Document how to investigate 401 errors
   - [ ] Document how to check Clerk service status
   - [ ] Document escalation procedures
   - [ ] Add troubleshooting flowcharts
   - **Acceptance**: Runbook created and reviewed

**Phase 6 Definition of Done**:

- ✅ Static token code completely removed
- ✅ Vercel environment variables configured
- ✅ Preview deployment successful with passing tests
- ✅ Production deployment successful
- ✅ Initial traffic monitored, no critical issues
- ✅ Documentation complete and accurate
- ✅ Runbook created for operational support
- ✅ Post-deployment retrospective completed

---

## Overall Acceptance Criteria

### Functional Requirements

- ✅ MCP server validates Clerk-issued JWT tokens
- ✅ Invalid/missing tokens return `401 Unauthorized` with `WWW-Authenticate: Bearer` header
- ✅ Discovery endpoint at `/.well-known/oauth-authorization-server` returns Clerk OIDC configuration
- ✅ Semantic Search app authenticates users via Clerk
- ✅ Semantic Search app attaches Bearer tokens to MCP requests
- ✅ Only `*.thenational.academy` users can sign in (initial rollout)
- ✅ Google and Microsoft SSO work correctly
- ✅ Authentication is unified with existing Aila application

### Non-Functional Requirements

- ✅ Auth middleware adds <10ms latency to requests (p95)
- ✅ Discovery endpoint cached, <100ms response time (p95)
- ✅ System handles 100 concurrent authenticated requests without errors
- ✅ Auth error rate <1% in production
- ✅ 100% test coverage on new auth code (unit + integration)
- ✅ All E2E tests passing
- ✅ CI smoke tests green on every deployment

### Security Requirements

- ✅ Tokens validated with signature verification
- ✅ `authorizedParties` enforcement prevents subdomain attacks
- ✅ CORS properly configured to prevent unauthorized origins
- ✅ Expired tokens rejected
- ✅ Tampered tokens rejected
- ✅ No static tokens accepted in production
- ✅ All secrets stored securely (Vercel environment variables)
- ✅ HTTPS enforced on all endpoints

### Documentation Requirements

- ✅ Architecture documentation complete
- ✅ Implementation documentation complete
- ✅ API documentation with curl examples
- ✅ Troubleshooting runbook created
- ✅ Code comments and TSDoc on all auth functions
- ✅ Migration guide for existing users (if applicable)

### Operational Requirements

- ✅ Monitoring and alerting configured
- ✅ Error tracking in Sentry
- ✅ Logs structured and queryable
- ✅ Runbook for common issues
- ✅ On-call team trained on new auth system

---

## Definition of Done

The OAuth 2.1 implementation is **DONE** when:

1. **All 6 implementation phases are complete** with their individual definitions of done met
2. **All acceptance criteria above are satisfied** (functional, non-functional, security, documentation, operational)
3. **All quality gates pass**:
   - `pnpm clean && pnpm check` succeeds across all workspaces
   - Zero TypeScript errors
   - Zero ESLint errors
   - 100% of unit tests passing
   - 100% of integration tests passing
   - 100% of E2E tests passing
   - CI smoke tests green on preview and production
4. **Production deployment successful** with no rollback needed
5. **Monitoring shows healthy metrics** for 24 hours post-deployment:
   - Error rate <1%
   - p95 latency <500ms
   - No critical Sentry alerts
6. **Documentation complete** and reviewed by 2+ team members
7. **Runbook tested** by on-call team
8. **Post-deployment retrospective completed** with lessons learned documented

---

## Rollout Plan

### Timeline

- **Phase 0**: Day 1 (1 day)
- **Phase 1**: Days 2-3 (1 day)
- **Phase 2**: Days 4-5 (2 days)
- **Phase 3**: Days 6-7 (2 days)
- **Phase 4**: Days 8-9 (2 days)
- **Phase 5**: Days 10-11 (2 days)
- **Phase 6**: Days 12-13 (2 days)
- **Total**: ~13 days (2.5 weeks)

### Risk Mitigation

- **Risk**: Clerk service outage
  - **Mitigation**: Implement circuit breaker, cache discovery, add retry logic
- **Risk**: Token validation performance issues
  - **Mitigation**: Use networkless verification with JWKS caching
- **Risk**: Breaking changes to existing users
  - **Mitigation**: Maintain backwards compatibility during transition, provide migration guide
- **Risk**: CORS misconfiguration
  - **Mitigation**: Comprehensive testing, explicit allowlist
- **Risk**: Discovery endpoint caching issues
  - **Mitigation**: Implement cache invalidation, monitor hit rates

### Rollback Plan

1. **Trigger**: Error rate >5% or critical functionality broken
2. **Action**: Revert to previous deployment via Vercel dashboard
3. **Duration**: <5 minutes
4. **Validation**: Run smoke tests against reverted deployment
5. **Communication**: Notify team via Slack, post-mortem within 24 hours

---

## Success Metrics

### Immediate (Day 1 Post-Launch)

- Zero production incidents related to auth
- Auth success rate >99%
- p95 latency <500ms
- Zero rollbacks needed

### Short-Term (Week 1)

- All Oak internal users successfully authenticated
- <5 support tickets related to auth
- Load tests passing with 200 concurrent users
- Monitoring dashboards showing healthy metrics

### Long-Term (Month 1)

- Auth system stable with <0.1% error rate
- No manual interventions required
- Documentation rated 4+/5 by team
- Ready for public rollout (Phase 2 initiative)

---

## Appendix: Useful Commands

### Local Development

```bash
# MCP Server
cd apps/oak-curriculum-mcp-streamable-http
pnpm dev

# Semantic Search
cd apps/oak-open-curriculum-semantic-search
pnpm dev

# Test with auth
curl -H "Authorization: Bearer <token>" http://localhost:3000/mcp
```

### Testing

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run smoke tests
pnpm dev:smoke

# Load testing
pnpm run load-test-auth
```

### Debugging

```bash
# Check Clerk token locally
node -e "console.log(JSON.parse(Buffer.from('TOKEN_PAYLOAD', 'base64').toString()))"

# Verify JWKS
curl https://<clerk-frontend-api>/.well-known/jwks.json

# Check discovery
curl https://mcp.oaknational.academy/.well-known/oauth-authorization-server
```

---

## References

- [Clerk Unified Auth Research](../../research/clerk-unified-auth-mcp-nextjs.md)
- [MCP Authorization Specification](https://spec.modelcontextprotocol.io/specification/architecture/authorization/)
- [RFC 8414: OAuth 2.0 Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414)
- [RFC 9068: JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens](https://datatracker.ietf.org/doc/html/rfc9068)
- [Clerk Express Documentation](https://clerk.com/docs/references/express)
- [Clerk Next.js Documentation](https://clerk.com/docs/references/nextjs)

---

## Appendix A: Pre-Implementation Data Gathering Checklist

> **Security Note**: Do NOT add actual secrets to this file. Document locations where secrets are stored (e.g., "Stored in 1Password vault 'Oak Production'") and verify access.

Complete this checklist **before starting Phase 0** to accelerate implementation. Gathering this data in advance will reduce Phase 0 from 1 day to ~2 hours.

### 1. Clerk Instance Information

- [ ] **Clerk instance name**: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] **Environment**: [ ] Production [ ] Development
- [ ] **Clerk Dashboard URL**: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] **Frontend API URL**: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\*** (e.g., `clerk.oak.example.com` or `clerk-xyz.clerk.accounts.dev`)
- [ ] **Current usage**: Used by Aila? [ ] Yes [ ] No

**Quick Test**:

```bash
# Verify discovery endpoint is accessible
curl https://<frontend-api>/.well-known/openid-configuration | jq
```

### 2. Clerk Credentials Location

Document **where** credentials are stored (do not paste actual values):

- [ ] **CLERK_PUBLISHABLE_KEY** location: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - Format: `pk_test_...` or `pk_live_...`
  - Stored in: (e.g., "1Password vault 'Oak Secrets' → 'Clerk Production Keys'")
- [ ] **CLERK_SECRET_KEY** location: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - Format: `sk_test_...` or `sk_live_...`
  - Stored in: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] **CLERK_JWT_KEY** location: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - Format: PEM public key for networkless verification
  - Stored in: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - Note: Can be obtained from Clerk Dashboard → API Keys → Show JWT public key

**Verification**:

- [ ] All three keys accessible by implementation team
- [ ] Keys confirmed to work with existing Aila deployment
- [ ] Access documented for on-call team

### 3. OAuth Endpoints (from Clerk)

Gather these URLs from Clerk Dashboard or by testing discovery endpoint:

- [ ] **OIDC Discovery URL**: `https://<frontend-api>/.well-known/openid-configuration`
- [ ] **Authorization endpoint**: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] **Token endpoint**: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] **JWKS URI**: `https://<frontend-api>/.well-known/jwks.json`
- [ ] **Issuer**: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\*** (usually matches Frontend API)

**Quick Gather**:

```bash
# Run this and document all relevant URLs
curl https://<frontend-api>/.well-known/openid-configuration | jq '{
  issuer,
  authorization_endpoint,
  token_endpoint,
  jwks_uri
}'
```

### 4. Domain and Origin Configuration

Document all domains that need CORS and authorizedParties access:

**Local Development**:

- [ ] MCP Server local: `http://localhost:3000` (or different port?)
- [ ] Semantic Search local: `http://localhost:3001` (or different port?)

**Preview/Staging**:

- [ ] MCP Server preview pattern: `https://mcp-*-<team>.vercel.app`
- [ ] Semantic Search preview pattern: `https://search-*-<team>.vercel.app`
- [ ] Aila preview pattern (if applicable): \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Production**:

- [ ] MCP Server production: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Semantic Search production: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Aila production: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Summary for Configuration**:

```bash
# CORS allowed origins (comma-separated list to document)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,...

# Authorized parties (for token validation)
AUTHORIZED_PARTIES=https://search.oaknational.academy,...
```

### 5. Current Authentication State Audit

Document existing auth implementation to understand what will change:

**In MCP Server** (`apps/oak-curriculum-mcp-streamable-http`):

- [ ] Current auth method: [ ] Static tokens [ ] API keys [ ] None [ ] Other: **\_\_\_**
- [ ] Environment variables currently used for auth: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Files containing auth logic (list): \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Auth middleware files to be modified: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Quick Audit**:

```bash
# Find current auth-related code
cd apps/oak-curriculum-mcp-streamable-http
grep -r "auth\|token\|API_KEY\|SECRET" src/ | grep -v node_modules
```

**In Semantic Search** (`apps/oak-open-curriculum-semantic-search`):

- [ ] Current auth status: [ ] No auth [ ] Basic auth [ ] Other: **\_\_\_**
- [ ] How does it call MCP server currently?: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Any existing Clerk integration?: [ ] Yes [ ] No

### 6. Clerk Dashboard Current Configuration

**Check and document current settings** (screenshots recommended):

**Restrictions** (Configuration → Restrictions):

- [ ] Current mode: [ ] Allowlist [ ] Blocklist [ ] None
- [ ] If Allowlist, current domains: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Needs modification?: [ ] Yes [ ] No

**Social Connections** (SSO Connections → Social):

- [ ] Google: [ ] Enabled [ ] Disabled
  - [ ] Status: [ ] Testing [ ] Production
  - [ ] Using custom credentials?: [ ] Yes [ ] No
  - [ ] Email subaddress blocking enabled?: [ ] Yes [ ] No
- [ ] Microsoft: [ ] Enabled [ ] Disabled
  - [ ] Status: [ ] Testing [ ] Production
  - [ ] Azure AD app configured?: [ ] Yes [ ] No

**OAuth Applications**:

- [ ] Existing OAuth applications in Clerk: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Need to create new OAuth app for MCP?: [ ] Yes [ ] No

### 7. Deployment Infrastructure

**Vercel Projects**:

- [ ] MCP Server project name: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - [ ] Project URL: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - [ ] Team/organization: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Semantic Search project name: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - [ ] Project URL: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - [ ] Team/organization: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Environment Variable Access**:

- [ ] Who can modify Vercel production env vars?: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Process for env var changes: [ ] Direct [ ] PR required [ ] Other: **\_\_\_**
- [ ] Where to document env var changes: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Deployment Process**:

- [ ] Deployment trigger: [ ] Git push [ ] Manual [ ] CI/CD pipeline
- [ ] Branch → environment mapping:
  - `main` → \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - `preview` → \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
  - PRs → \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

### 8. Access and Permissions Audit

**Clerk Dashboard**:

- [ ] Team members with Clerk admin access: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Who can modify production settings?: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Who can create OAuth applications?: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Vercel**:

- [ ] Team members with Vercel admin access: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Who can deploy to production?: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Who can modify env vars?: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Approval Process**:

- [ ] Who must approve production auth changes?: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Security team review required?: [ ] Yes [ ] No
- [ ] Change management process: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

### 9. User Base and Testing Accounts

**Current Users**:

- [ ] Approximate user count in Clerk: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Are these internal or external users?: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Do they need to re-authenticate after changes?: [ ] Yes [ ] No

**Test Accounts**:

- [ ] Test account with `@thenational.academy` (Google): \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Test account with `@thenational.academy` (Microsoft): \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Test account stored in: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Can test accounts be used in development?: [ ] Yes [ ] No

### 10. Monitoring and Observability

**Current Setup**:

- [ ] Error tracking tool: [ ] Sentry [ ] Other: **\_\_\_**
- [ ] Logging infrastructure: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Metrics/dashboards: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] On-call team: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Access Required**:

- [ ] Implementation team has Sentry access: [ ] Yes [ ] No
- [ ] Implementation team can create alerts: [ ] Yes [ ] No
- [ ] Implementation team can view production logs: [ ] Yes [ ] No

### 11. Documentation and Communication

**Documentation Locations**:

- [ ] Where to document environment variables: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Where to store runbooks: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Where to document architecture: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

**Communication Channels**:

- [ ] Team Slack channel: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Incident channel: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***
- [ ] Deployment notifications: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

### Pre-Implementation Checklist Complete

When all items above are checked and documented, you are ready to begin **Phase 0** with significantly reduced friction. Estimated time savings: **~4-6 hours** during implementation.

**Final Verification**:

- [ ] All credentials accessible (locations documented)
- [ ] All URLs and endpoints verified
- [ ] All permissions and access confirmed
- [ ] Test accounts ready
- [ ] Team aligned on timeline and approach

---

**Last Updated**: 2024-10-16  
**Status**: ACTIVE  
**Next Review**: After Phase 2 completion
