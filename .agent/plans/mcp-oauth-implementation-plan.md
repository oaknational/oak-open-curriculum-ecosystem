<!-- markdownlint-disable -->

# MCP OAuth 2.1 Implementation Plan (Clerk Integration)

**Status**: ACTIVE  
**Date**: 2024-10-16  
**Owner**: Engineering (Platform/Security)  
**Last Updated**: 2024-10-16

## Executive Summary

Replace the existing custom OAuth 2.1 demo implementation in the Oak Curriculum MCP Streamable HTTP server with production-ready Clerk authentication. The server already has a complete OAuth 2.1 Resource Server implementation with JWT verification, Protected Resource Metadata endpoints, and proper WWW-Authenticate headers. We're replacing the local demo Authorization Server with Clerk as the production AS, using Clerk's official `@clerk/mcp-tools` package.

## Current State Analysis

### ✅ What Already Exists (No Changes Needed)

The MCP server at `apps/oak-curriculum-mcp-streamable-http` already has:

1. **OAuth 2.1 Resource Server** - Complete implementation
2. **Protected Resource Metadata** - `/.well-known/oauth-protected-resource` endpoint (RFC 9728)
3. **Bearer Auth Middleware** - `bearerAuth` in `src/auth.ts`
4. **WWW-Authenticate Headers** - Proper RFC 9728 format with `resource` and `authorization_uri`
5. **JWT Verification** - Using `jose` library with audience and issuer validation
6. **CORS & Security** - DNS rebinding protection, allowlist support
7. **Test Infrastructure** - Unit and E2E tests in place
8. **Environment Validation** - Zod schemas in `src/env.ts`
9. **Logging** - Structured logging with `@oaknational/mcp-logger`
10. **MCP Server** - Fully functional with SDK-generated tools

### ❌ What Needs Replacing

Per `README.md` line 133:

> "Production OAuth is MANDATORY next step... there is no production Authorization Server yet."

1. **Local Demo AS** (`src/oauth-metadata.ts` lines 18-56) → Clerk production AS
2. **Custom Bearer Auth** (`src/auth.ts`) → `@clerk/mcp-tools` helpers
3. **Custom JWT Verification** (`src/auth-jwt.ts`) → Clerk's token verification
4. **Static dev/CI tokens** → OAuth-only in production
5. **Manual JWKS management** → Clerk's automatic JWKS rotation

## Decision Rationale

**Why Clerk with `@clerk/mcp-tools`:**

- **Official MCP Support**: Clerk provides purpose-built MCP helpers
- **Zero Custom Auth Code**: Replace ~200 lines with 3 helper functions
- **Production Ready**: SOC 2 compliant, battle-tested
- **Time Savings**: ~80% reduction in implementation time vs maintaining custom auth
- **Client Compatibility**: Full MCP spec compliance, Dynamic Client Registration support
- **Maintenance**: Zero ongoing security patches for AS infrastructure

## Core References

- [Clerk Build MCP Server Guide](../../.agent/reference-docs/clerk-build-mcp-server.md) (**PRIMARY** - Official implementation)
- [Clerk Express SDK](../../.agent/reference-docs/clerk-express-sdk.md) (Background on Express integration)
- [MCP Authorization Specification](../../.agent/reference-docs/mcp-auth-spec.md) (OAuth 2.1 requirements)
- [Understanding Authorization in MCP](../../.agent/reference-docs/mcp-understanding-auth-in-mcp.md) (OAuth flow tutorial)
- Current codebase: `apps/oak-curriculum-mcp-streamable-http/src/`

## Goals

### Primary Goals

- Replace local demo AS with Clerk production AS
- Use `@clerk/mcp-tools` helpers for MCP-compliant auth
- Configure Google SSO for `@thenational.academy` only
- Enable Dynamic Client Registration in Clerk
- Remove static token auth flows from production
- Maintain all existing functionality and tests

### Secondary Goals

- Improve token refresh and error handling
- Document Clerk integration patterns
- Establish monitoring for Clerk auth failures
- Create runbook for common Clerk issues

## Non-Goals

- Building custom OAuth infrastructure (Clerk provides this)
- Changing MCP transport, tools, or server logic
- Altering SDK compile-time generation flows
- Supporting Microsoft SSO (future phase if needed)
- Public access (internal `@thenational.academy` only for this phase)

## Architecture Overview

### Before (Current State)

```
┌──────────────────┐
│ MCP Client       │
│ (Claude Desktop) │
└────────┬─────────┘
         │
         │ Authorization: Bearer <token>
         │
         ▼
┌────────────────────────────────────┐
│ MCP Server (Resource Server)      │
│ Express on Vercel                  │
│                                    │
│ ┌────────────────────────────────┐│
│ │ Custom bearerAuth middleware   ││
│ │ Custom JWT verification (jose) ││
│ │ Local demo AS (dev only)       ││
│ │ Static dev/CI tokens           ││
│ └────────────────────────────────┘│
└────────────────────────────────────┘
```

### After (With Clerk)

```
                              ┌─────────────────────────────┐
                              │ Clerk (Authorization Server)│
                              │ @thenational.academy only   │
                              │                             │
                              │ ┌─────────────────────────┐ │
                              │ │ Google SSO Integration  │ │
                              │ │ Dynamic Client Reg (DCR)│ │
                              │ │ JWKS (auto-rotation)    │ │
                              │ └─────────────────────────┘ │
                              └─────────────────────────────┘
                                           ▲
                                           │
                              OAuth Flow   │
                              (via browser)│
                                           │
┌──────────────────┐                      │
│ MCP Client       │◄─────────────────────┘
│ (Claude Desktop) │
│                  │
│ 1. GET /mcp → 401│     (1) MCP Request (no token)
│ 2. Fetch metadata│────────────────────────────────►
│ 3. OAuth via     │                                 │
│    Clerk         │     (2) 401 + WWW-Authenticate  │
│ 4. Get token     │◄────────────────────────────────┤
│ 5. Use token     │                                 │
└────────┬─────────┘     (3) GET /.well-known/      │
         │                   oauth-protected-resource│
         │               ────────────────────────────►│
         │                                            │
         │               (4) Metadata (points to      │
         │                   Clerk AS)                │
         │               ◄────────────────────────────┤
         │                                            │
         │               (5) MCP Request + Bearer     │
         └───────────────────────────────────────────►│
                                                      │
                         (6) MCP Response             │
                       ◄─────────────────────────────┤
                                                      │
                       ┌──────────────────────────────┐
                       │ MCP Server (Resource Server) │
                       │ Express on Vercel            │
                       │                              │
                       │ ┌──────────────────────────┐ │
                       │ │ @clerk/mcp-tools         │ │
                       │ │ - mcpAuthClerk           │ │
                       │ │ - protectedResourceHandler│ │
                       │ │ - authServerMetadataHandler│ │
                       │ └──────────────────────────┘ │
                       └──────────────────────────────┘
```

## Implementation Phases

### Phase 0: Clerk Configuration & Credentials (2-3 hours)

**Prerequisites**: Access to Clerk Dashboard

#### Tasks

1. **Configure Clerk Project** (45 min)
   - [ ] Navigate to Clerk Dashboard (existing instance from Appendix A)
   - [ ] Configuration → Restrictions → Enable **Allowlist**
   - [ ] Add domain: `thenational.academy`
   - [ ] Test: Sign-up with non-thenational.academy email should fail
   - [ ] Test: Sign-up with thenational.academy email should succeed
   - **Acceptance**: Only `@thenational.academy` emails allowed

2. **Configure Google SSO** (30 min)
   - [ ] SSO Connections → Social → Add/verify Google
   - [ ] Use Oak's production Google OAuth credentials
   - [ ] Ensure status is "In production" (not "Testing")
   - [ ] Enable "Block email subaddresses" option
   - [ ] Test: Sign in with `user@thenational.academy` Google account
   - **Acceptance**: Google SSO works, domain restricted

3. **Enable Dynamic Client Registration** (15 min)
   - [ ] Navigate to OAuth Applications page
   - [ ] Toggle ON **Dynamic client registration**
   - [ ] Verify toggle is enabled and saved
   - **Acceptance**: DCR enabled (required for MCP clients)

4. **Gather Credentials** (30 min)
   - [ ] Copy Frontend API URL (from Appendix A: `https://native-hippo-15.clerk.accounts.dev`)
   - [ ] Copy `CLERK_PUBLISHABLE_KEY` (from Appendix A)
   - [ ] Copy `CLERK_SECRET_KEY` (secure storage)
   - [ ] Note JWKS URL: `<frontend-api>/.well-known/jwks.json`
   - [ ] Create `.env.local` in `apps/oak-curriculum-mcp-streamable-http`:
     ```bash
     CLERK_PUBLISHABLE_KEY=pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ
     CLERK_SECRET_KEY=<actual_secret_key>
     BASE_URL=http://localhost:3333
     MCP_CANONICAL_URI=http://localhost:3333/mcp
     OAK_API_KEY=<your_oak_api_key>
     ```
   - **Acceptance**: All credentials documented, `.env.local` created

5. **Create Feature Branch** (5 min)
   - [ ] Create branch: `feature/clerk-production-auth`
   - [ ] Push empty commit to trigger CI
   - **Acceptance**: Branch exists, CI green

**Phase 0 Definition of Done**:

- ✅ Clerk domain allowlist active for `@thenational.academy`
- ✅ Google SSO configured and tested
- ✅ Dynamic Client Registration enabled
- ✅ All credentials gathered and secured
- ✅ Feature branch created with baseline CI passing

---

### Phase 1: Replace Custom Auth with Clerk (1 day)

**Prerequisites**: Phase 0 complete

#### Tasks

1. **Install Clerk Dependencies** (5 min)
   - [ ] Add `@clerk/mcp-tools` to `package.json`
   - [ ] Add `@clerk/express` to `package.json`
   - [ ] Remove `jose` dependency (no longer needed)
   - [ ] Run `pnpm install`
   - [ ] Verify `pnpm build` succeeds
   - **Acceptance**: New dependencies installed, builds successfully

2. **Update Environment Schema** (15 min)
   - [ ] Open `src/env.ts`
   - [ ] Add Clerk env vars to `EnvSchema`:
     ```typescript
     CLERK_PUBLISHABLE_KEY: z.string().min(1, 'CLERK_PUBLISHABLE_KEY required'),
     CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY required'),
     ```
   - [ ] Remove: `ENABLE_LOCAL_AS`, `LOCAL_AS_JWK`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`
   - [ ] Keep: `BASE_URL`, `MCP_CANONICAL_URI`, `OAK_API_KEY`
   - [ ] Run `pnpm type-check`
   - **Acceptance**: Schema updated, type-checks pass

3. **Replace Bearer Auth Middleware** (1 hour)
   - [ ] Open `src/index.ts`
   - [ ] Add imports:
     ```typescript
     import { clerkMiddleware } from '@clerk/express';
     import {
       mcpAuthClerk,
       protectedResourceHandlerClerk,
       authServerMetadataHandlerClerk,
     } from '@clerk/mcp-tools/express';
     ```
   - [ ] In `createApp()`, replace:

     ```typescript
     // OLD:
     app.use(bearerAuth);

     // NEW:
     app.use(clerkMiddleware());
     ```

   - [ ] Update MCP endpoint:

     ```typescript
     // OLD:
     app.post('/mcp', createMcpHandler(coreTransport));

     // NEW:
     app.post('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
     ```

   - [ ] Same for `/openai_connector`
   - [ ] Run `pnpm build`
   - **Acceptance**: Builds successfully, `bearerAuth` replaced

4. **Replace OAuth Metadata Endpoints** (1 hour)
   - [ ] In `src/index.ts`, replace `setupOAuthMetadata(app, corsMw)` with:

     ```typescript
     // Protected Resource Metadata (RFC 9728)
     app.get(
       '/.well-known/oauth-protected-resource',
       protectedResourceHandlerClerk({
         scopes_supported: ['mcp:invoke', 'mcp:read'],
       }),
     );

     // Authorization Server Metadata (for older MCP clients)
     app.get('/.well-known/oauth-authorization-server', authServerMetadataHandlerClerk);
     ```

   - [ ] Remove call to `setupLocalAuthorizationServer()` and its `asReady` promise
   - [ ] Simplify `initializeCoreEndpoints` to only wait for `serverReady`
   - [ ] Run `pnpm build`
   - **Acceptance**: Builds successfully, endpoints replaced

5. **Remove Custom Auth Files** (30 min)
   - [ ] Delete `src/auth.ts` (replaced by `mcpAuthClerk`)
   - [ ] Delete `src/auth-jwt.ts` (replaced by Clerk's verification)
   - [ ] Delete `src/oauth-metadata.ts` (replaced by Clerk helpers)
   - [ ] Delete `src/oauth-metadata.unit.test.ts` (will rewrite)
   - [ ] Remove any imports of deleted files
   - [ ] Run `pnpm type-check` to find remaining references
   - [ ] Fix any remaining references
   - **Acceptance**: No orphaned imports, type-check passes

6. **Update Environment Variables** (15 min)
   - [ ] Update `.env.local` to remove old vars:
     ```bash
     # Remove these:
     REMOTE_MCP_DEV_TOKEN
     REMOTE_MCP_CI_TOKEN
     ENABLE_LOCAL_AS
     LOCAL_AS_JWK
     ```
   - [ ] Ensure these exist:
     ```bash
     CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_...
     BASE_URL=http://localhost:3333
     MCP_CANONICAL_URI=http://localhost:3333/mcp
     OAK_API_KEY=<your_key>
     ALLOWED_HOSTS=localhost,127.0.0.1,::1
     ```
   - [ ] Run `pnpm dev`
   - [ ] Verify server starts without errors
   - **Acceptance**: Server runs with new env vars

7. **Test Locally** (1 hour)
   - [ ] Start server: `pnpm dev`
   - [ ] Test metadata endpoint:
     ```bash
     curl http://localhost:3333/.well-known/oauth-protected-resource
     ```
   - [ ] Verify response points to Clerk:
     ```json
     {
       "resource": "http://localhost:3333/mcp",
       "authorization_servers": ["https://native-hippo-15.clerk.accounts.dev"],
       "scopes_supported": ["mcp:invoke", "mcp:read"]
     }
     ```
   - [ ] Test unauthorized request:
     ```bash
     curl -X POST http://localhost:3333/mcp \
       -H "Accept: application/json, text/event-stream" \
       -H "Content-Type: application/json" \
       -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
     ```
   - [ ] Verify 401 with `WWW-Authenticate` header
   - [ ] Document findings
   - **Acceptance**: All endpoints respond correctly

**Phase 1 Definition of Done**:

- ✅ `@clerk/mcp-tools` and `@clerk/express` installed
- ✅ Custom auth files deleted (auth.ts, auth-jwt.ts, oauth-metadata.ts)
- ✅ `mcpAuthClerk` middleware protecting MCP endpoints
- ✅ Clerk metadata helpers serving discovery endpoints
- ✅ Environment schema updated for Clerk
- ✅ Server runs locally with Clerk integration
- ✅ `pnpm build` and `pnpm type-check` pass
- ✅ Static tokens removed from codebase

---

### Phase 2: Update Tests (4-6 hours)

**Prerequisites**: Phase 1 complete

#### Tasks

1. **Update Unit Tests** (2 hours)
   - [ ] Create `src/clerk-integration.unit.test.ts`:

     ```typescript
     import { describe, it, expect } from 'vitest';
     import request from 'supertest';
     import { createApp } from './index.js';

     describe('Clerk OAuth Integration', () => {
       it('serves protected resource metadata', async () => {
         const app = createApp();
         const res = await request(app).get('/.well-known/oauth-protected-resource');

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty('resource');
         expect(res.body).toHaveProperty('authorization_servers');
         expect(Array.isArray(res.body.authorization_servers)).toBe(true);
       });

       it('rejects unauthenticated MCP requests', async () => {
         const app = createApp();
         const res = await request(app)
           .post('/mcp')
           .set('Accept', 'application/json, text/event-stream')
           .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

         expect(res.status).toBe(401);
         expect(res.headers['www-authenticate']).toBeDefined();
       });
     });
     ```

   - [ ] Run `pnpm test`
   - [ ] Fix any failing tests
   - **Acceptance**: Unit tests pass

2. **Update E2E Tests** (2 hours)
   - [ ] Review existing E2E tests in `e2e-tests/`
   - [ ] Update tests that use static tokens (if any)
   - [ ] Add note about requiring real Clerk tokens for E2E
   - [ ] Document how to generate test tokens from Clerk
   - [ ] Skip E2E tests that require real tokens (for now)
   - [ ] Run `pnpm test` (unit tests only)
   - **Acceptance**: Unit tests pass, E2E tests documented

3. **Update Smoke Tests** (1 hour)
   - [ ] Open `smoke-tests/smoke-suite.ts`
   - [ ] Update to work with Clerk auth (may need real token)
   - [ ] Add fallback for local dev without token
   - [ ] Document smoke test requirements
   - [ ] Test: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`
   - **Acceptance**: Smoke tests documented, run without errors

4. **Update README** (1 hour)
   - [ ] Open `README.md`
   - [ ] Remove references to:
     - `REMOTE_MCP_DEV_TOKEN`
     - `ENABLE_LOCAL_AS`
     - `LOCAL_AS_JWK`
   - [ ] Add Clerk configuration section:

     ```markdown
     ## Authentication

     Production authentication uses Clerk OAuth 2.1.

     ### Required Environment Variables

     - `CLERK_PUBLISHABLE_KEY` - Clerk publishable key
     - `CLERK_SECRET_KEY` - Clerk secret key
     - `BASE_URL` - Server base URL (e.g., `https://mcp.oaknational.academy`)
     - `MCP_CANONICAL_URI` - MCP endpoint URI (e.g., `https://mcp.oaknational.academy/mcp`)

     ### MCP Client Connection

     1. Client attempts to connect to MCP server
     2. Server returns 401 with OAuth discovery metadata
     3. Client fetches `/.well-known/oauth-protected-resource`
     4. Client discovers Clerk as Authorization Server
     5. Client opens browser for Google SSO via Clerk
     6. User authenticates with `@thenational.academy` Google account
     7. Clerk issues access token
     8. Client uses token to access MCP server

     ### Google SSO

     Only `@thenational.academy` email addresses are allowed via Google SSO.
     Clerk is configured with domain allowlist enforcement.
     ```

   - [ ] Update troubleshooting section
   - [ ] Remove "Authentication status and next steps" section (now complete!)
   - **Acceptance**: README updated with Clerk docs

**Phase 2 Definition of Done**:

- ✅ Unit tests updated and passing
- ✅ E2E test strategy documented
- ✅ Smoke tests updated
- ✅ README reflects Clerk integration
- ✅ `pnpm test` passes
- ✅ All old auth references removed from docs

---

### Phase 3: Deployment & Monitoring (1 day)

**Prerequisites**: Phase 2 complete, all tests passing

#### Tasks

1. **Configure Vercel Environment Variables** (30 min)
   - [ ] Navigate to Vercel project settings
   - [ ] Add to Production environment:
     ```
     CLERK_PUBLISHABLE_KEY=pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ
     CLERK_SECRET_KEY=<actual_secret>
     BASE_URL=https://mcp.oaknational.academy
     MCP_CANONICAL_URI=https://mcp.oaknational.academy/mcp
     OAK_API_KEY=<production_key>
     ALLOWED_HOSTS=mcp.oaknational.academy,*.vercel.app
     ```
   - [ ] Add to Preview environment (same values but preview URLs)
   - [ ] Remove old env vars:
     - `REMOTE_MCP_DEV_TOKEN`
     - `REMOTE_MCP_CI_TOKEN`
     - `ENABLE_LOCAL_AS`
     - `LOCAL_AS_JWK`
   - [ ] Save and trigger redeploy
   - **Acceptance**: Environment variables configured

2. **Deploy to Preview** (1 hour)
   - [ ] Create PR from `feature/clerk-production-auth` to `preview`
   - [ ] Request review from 2+ engineers
   - [ ] Address review feedback
   - [ ] Merge to `preview`
   - [ ] Wait for Vercel deployment
   - [ ] Note preview URL
   - [ ] Test metadata endpoint:
     ```bash
     curl https://mcp-<hash>.vercel.app/.well-known/oauth-protected-resource
     ```
   - [ ] Verify points to Clerk
   - [ ] Test unauthorized request returns 401
   - [ ] Document any issues
   - **Acceptance**: Preview deployment successful, endpoints working

3. **Test with Real MCP Client** (2 hours)
   - [ ] Configure Claude Desktop to use preview URL
   - [ ] Attempt to connect (should trigger OAuth flow)
   - [ ] Verify browser opens to Clerk
   - [ ] Sign in with `@thenational.academy` Google account
   - [ ] Verify redirect back to Claude Desktop
   - [ ] Test MCP tool invocation
   - [ ] Verify tools execute successfully
   - [ ] Document the flow with screenshots
   - **Acceptance**: Full OAuth flow works with real client

4. **Deploy to Production** (2 hours)
   - [ ] Create release PR from `preview` to `main`
   - [ ] Request security team review
   - [ ] Address any feedback
   - [ ] Get approvals (2+ engineers + security)
   - [ ] Merge to `main` with squash commit
   - [ ] Monitor Vercel production deployment
   - [ ] Test production endpoints
   - [ ] Test with MCP client on production URL
   - **Acceptance**: Production deployment successful

5. **Monitor Initial Traffic** (4 hours)
   - [ ] Watch Vercel logs for 401 responses
   - [ ] Monitor Clerk dashboard for auth activity
   - [ ] Check for any error spikes
   - [ ] Verify successful authentications
   - [ ] Monitor MCP tool invocations
   - [ ] Document any issues and resolutions
   - **Acceptance**: No critical errors, <1% auth error rate

6. **Create Runbook** (1 hour)
   - [ ] Create `docs/runbooks/clerk-oauth-troubleshooting.md`
   - [ ] Document common scenarios:
     - User can't sign in → Check domain allowlist
     - 401 errors → Check token expiry, Clerk service status
     - No auth flow triggered → Check metadata endpoints
     - Wrong domain → Check Clerk allowlist configuration
   - [ ] Add troubleshooting flowchart
   - [ ] Document how to check Clerk service status
   - [ ] Document escalation procedures
   - [ ] Add Clerk dashboard URLs
   - **Acceptance**: Runbook created and reviewed

7. **Update Documentation** (1 hour)
   - [ ] Create `docs/architecture/clerk-oauth-implementation.md`
   - [ ] Document architecture decisions
   - [ ] Add sequence diagrams
   - [ ] Document Clerk configuration
   - [ ] Add curl examples for testing
   - [ ] Document MCP client setup
   - [ ] List all environment variables
   - **Acceptance**: Complete architecture documentation

**Phase 3 Definition of Done**:

- ✅ Vercel environment variables configured
- ✅ Preview deployment successful and tested
- ✅ Production deployment successful
- ✅ Full OAuth flow tested with real MCP client
- ✅ Initial traffic monitored, no critical issues
- ✅ Runbook created for troubleshooting
- ✅ Architecture documentation complete
- ✅ Post-deployment retrospective completed

---

## Overall Acceptance Criteria

### Functional Requirements

- ✅ MCP server uses `@clerk/mcp-tools` for OAuth
- ✅ Protected Resource Metadata points to Clerk AS
- ✅ MCP clients can complete OAuth flow via Clerk
- ✅ Only `@thenational.academy` users can authenticate (Google SSO)
- ✅ Dynamic Client Registration works for MCP clients
- ✅ Tokens validated with Clerk's JWKS
- ✅ 401 responses include proper `WWW-Authenticate` headers
- ✅ All static token flows removed from production

### Non-Functional Requirements

- ✅ Auth adds <10ms latency (p95)
- ✅ System handles 100 concurrent authenticated requests
- ✅ Auth error rate <1% in production
- ✅ All unit tests passing
- ✅ E2E test strategy documented

### Security Requirements (Per MCP Auth Spec)

- ✅ Tokens validated with signature verification (Clerk JWKS)
- ✅ Audience binding enforced by Clerk
- ✅ `iss`, `aud`, `exp`, `iat` claims validated by Clerk
- ✅ No static tokens in production
- ✅ HTTPS enforced on all production endpoints
- ✅ Dynamic Client Registration available

### Documentation Requirements

- ✅ Architecture documentation complete
- ✅ README updated with Clerk instructions
- ✅ Runbook for troubleshooting
- ✅ Code comments on integration points

### Operational Requirements

- ✅ Monitoring via Vercel logs
- ✅ Clerk dashboard for auth metrics
- ✅ Runbook for common issues
- ✅ Team trained on Clerk integration

---

## Definition of Done

The Clerk OAuth 2.1 integration is **DONE** when:

1. **All 3 implementation phases complete** with their definitions of done met
2. **All acceptance criteria satisfied** (functional, non-functional, security, documentation, operational)
3. **All quality gates pass**:
   - `pnpm build` succeeds
   - `pnpm type-check` passes
   - `pnpm lint` passes
   - `pnpm test` passes (unit tests)
   - Zero TypeScript errors
   - Zero ESLint errors
4. **Production deployment successful** with no rollback
5. **MCP client can authenticate** via Clerk (tested with Claude Desktop)
6. **Monitoring shows healthy metrics** for 24 hours:
   - Error rate <1%
   - p95 latency <500ms
   - Successful OAuth flows
7. **Documentation complete** and reviewed
8. **Runbook tested** by team
9. **Post-deployment retrospective** completed

---

## Timeline & Rollout

### Timeline

- **Phase 0**: Day 1 (2-3 hours - Clerk config & credentials)
- **Phase 1**: Days 1-2 (1 day - Replace custom auth with Clerk)
- **Phase 2**: Day 2 (4-6 hours - Update tests & docs)
- **Phase 3**: Day 3 (1 day - Deploy & monitor)
- **Total**: **~3 days** (24 hours of work)

### Risk Mitigation

- **Risk**: Clerk service outage
  - **Mitigation**: Monitor Clerk status page, have rollback ready
- **Risk**: OAuth flow confusion for users
  - **Mitigation**: Document flow with screenshots, provide support channel
- **Risk**: Token validation issues
  - **Mitigation**: Clerk handles this automatically, test thoroughly in preview
- **Risk**: Breaking existing users
  - **Mitigation**: No existing production OAuth users yet (currently demo AS only)

### Rollback Plan

1. **Trigger**: Error rate >5% or OAuth flow broken
2. **Action**: Revert to previous deployment via Vercel dashboard
3. **Duration**: <5 minutes
4. **Validation**: Confirm previous version running
5. **Communication**: Notify team via Slack, schedule post-mortem

---

## Success Metrics

### Immediate (Day 1 Post-Launch)

- Zero production incidents
- OAuth success rate >95%
- p95 latency <500ms
- Zero rollbacks needed

### Short-Term (Week 1)

- All Oak internal users authenticated successfully
- <3 support tickets
- OAuth flow documented with screenshots
- Team comfortable with Clerk dashboard

### Long-Term (Month 1)

- Auth system stable with <0.1% error rate
- No manual interventions required
- Ready to expand to other identity providers if needed

---

## Appendix A: Clerk Data

**Clerk Frontend API**: `https://native-hippo-15.clerk.accounts.dev`
**Clerk Backend API**: `https://api.clerk.com`
**JWKS URL**: `https://native-hippo-15.clerk.accounts.dev/.well-known/jwks.json`

**JWKS Public Key**:

```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzQCNgGV9fOZ2U33phijU
s4RypLbtcpRe/g6irmTxlpFvppOA5WW5x8qHFsHXw0wkoVFBJx5Cu1V9qa3nDfL4
ZB+eSfF5rQv0L3qyuRZuUGcVtV8YmOosfN+pu4nBnnFYl3Enad+O6y2QKoydTBuV
5WFLblMT+Q6Cb+dAQiHJG9Xnc5BnMhtNvF7zz6ltzUsclaw+38+bQ4biytHhOKNA
JjuaPovgQ9AJaLgrnBs2oMmaF+IWhqGbCzgg7rQbse45H4wo/EHPCIksxv0r0Ny2
lZS6CwDSZxC+vUKNX/C7mdFhvbH9LimH+e1V1awBWTKIRuzQ+bXVg5KOOoVWCojB
swIDAQAB
-----END PUBLIC KEY-----
```

**Publishable Key**: `pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ`

⚠️ **Secret Key**: Not stored in version control - obtain from secure storage

---

## Appendix B: Useful Commands

### Local Development

```bash
# Start server
cd apps/oak-curriculum-mcp-streamable-http
pnpm dev

# Test metadata endpoint
curl http://localhost:3333/.well-known/oauth-protected-resource | jq

# Test unauthorized request (should return 401)
curl -X POST http://localhost:3333/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list"}'
```

### Testing

```bash
# Run unit tests
pnpm test

# Run with watch mode
pnpm test:watch

# Type check
pnpm type-check

# Lint
pnpm lint

# Build
pnpm build
```

### Debugging

```bash
# Check Clerk JWKS
curl https://native-hippo-15.clerk.accounts.dev/.well-known/jwks.json | jq

# Check Clerk OIDC discovery
curl https://native-hippo-15.clerk.accounts.dev/.well-known/openid-configuration | jq

# Check production metadata
curl https://mcp.oaknational.academy/.well-known/oauth-protected-resource | jq
```

---

## References

- [Clerk Build MCP Server Guide](https://clerk.com/docs/expressjs/guides/development/mcp/build-mcp-server)
- [Clerk Express SDK Reference](https://clerk.com/docs/reference/express/overview)
- [@clerk/mcp-tools Documentation](https://github.com/clerk/mcp-tools)
- [MCP Authorization Specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)
- [RFC 9728: OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728)

---

**Last Updated**: 2024-10-16  
**Status**: ACTIVE  
**Next Review**: After Phase 1 completion
