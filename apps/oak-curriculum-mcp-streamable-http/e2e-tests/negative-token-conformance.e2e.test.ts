/**
 * MCP-143 Guard 2 — negative-token conformance on the opaque OAuth path.
 *
 * Five rejection classes an unauthorised caller can present. This suite proves
 * the middleware's HTTP 401 + RFC 6750 `WWW-Authenticate` handling per class
 * through the injected `CreateMcpAuthClerkDeps` seam (AC-2, repo-safe). It is
 * deliberate about WHAT it proves, per the spec's R2 (no over-claim):
 *
 *   - FULLY repo-provable (1): token-in-query-param — the middleware reads the
 *     token only from the Authorization header, never a query string.
 *   - WIRING-only (4): session-token, wrong-issuer, expired, and
 *     wrong-resource-on-opaque. For these, the REJECTION is Clerk-enforced —
 *     `getAuth({ acceptsToken: 'oauth_token' })` returns `isAuthenticated:false`
 *     for a session/wrong-issuer/expired token, and for an opaque token the
 *     resource/audience binding rests solely on Clerk
 *     (`validateResourceParameter` returns `valid:true` unconditionally on the
 *     opaque path — resource-parameter-validator.ts). This suite proves only
 *     that the middleware returns a conformant 401 when Clerk/verification
 *     rejects; that Clerk actually rejects each case is owner-held live
 *     evidence (AC-4), NOT proven here. Each wiring-only case is annotated.
 *
 * Fixtures are non-JWT OPAQUE tokens (`oat_…`), matching the production token
 * format. This assumes the production OAuth application is pinned to opaque
 * token issuance — a Stage-2 owner-ceremony precondition (R4: Clerk now
 * defaults new OAuth apps to JWTs; the opaque pin does not inherit onto the
 * new dedicated production instance and must be set explicitly). If that pin
 * regresses to JWTs, the opaque path this suite exercises no longer applies.
 */
import { describe, it, expect } from 'vitest';
import type { Express } from 'express';
import { request } from '../src/test-helpers/loopback-request.js';
import { createApp } from '../src/application.js';
import type { CreateMcpAuthClerkDeps } from '../src/auth/mcp-auth/index.js';
import {
  createMockObservability,
  createMockRuntimeConfig,
  createNoOpClerkMiddleware,
  createUnauthenticatedMcpAuthClerkDeps,
  createVerifyRejectsMcpAuthClerkDeps,
} from './helpers/test-config.js';
import { TEST_UPSTREAM_METADATA } from '../src/test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from '../src/test-helpers/static-root-fixture.js';

// A non-JWT opaque access token (`oat_` prefix, no JWT dot-structure), so
// `isJwtFormat` is false and the opaque verification path is exercised.
const OPAQUE_TOKEN = 'oat_negativeTokenConformanceFixtureValueNotAJwt';

const INITIALIZE_BODY = {
  jsonrpc: '2.0',
  id: '1',
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0.0' },
  },
} as const;

async function createNegativeTokenApp(mcpAuthClerkDeps: CreateMcpAuthClerkDeps): Promise<Express> {
  const runtimeConfig = createMockRuntimeConfig({
    useStubTools: true,
    env: {
      OAK_API_KEY: 'test-api-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
    },
  });
  return await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig,
    observability: createMockObservability(runtimeConfig),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    getLandingPageHtml: () =>
      '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
    upstreamMetadata: TEST_UPSTREAM_METADATA,
    clerkMiddlewareFactory: createNoOpClerkMiddleware(),
    mcpAuthClerkDeps,
  });
}

function expectConformant401(res: {
  status: number;
  headers: Record<string, string | undefined>;
}): void {
  expect(res.status).toBe(401);
  const wwwAuth = res.headers['www-authenticate'];
  expect(wwwAuth).toBeDefined();
  expect(wwwAuth).toContain('Bearer');
  expect(wwwAuth).toContain('resource_metadata=');
}

describe('Negative-token conformance on the opaque path (MCP-143 Guard 2, AC-2)', () => {
  it('class 1 — token in query param is ignored (FULLY repo-provable): 401', async () => {
    // The middleware reads the token only from the Authorization header. A
    // token supplied as ?access_token=… is never consulted, so the request is
    // unauthenticated → 401. This is fully provable in-repo (no Clerk involved).
    const app = await createNegativeTokenApp(createUnauthenticatedMcpAuthClerkDeps());

    const res = await request(app)
      .post(`/mcp?access_token=${OPAQUE_TOKEN}`)
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .send(INITIALIZE_BODY);

    expectConformant401(res);
  });

  it('class 2 — session token, not an access token (WIRING-only): 401', async () => {
    // WIRING-ONLY: Clerk's getAuth({ acceptsToken: 'oauth_token' }) returns
    // isAuthenticated:false for a session token, so the rejection is
    // Clerk-enforced. This proves the middleware's conformant 401 on that
    // outcome, NOT that Clerk classifies session-vs-oauth (owner-held AC-4).
    const app = await createNegativeTokenApp(createUnauthenticatedMcpAuthClerkDeps());

    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .set('Authorization', `Bearer ${OPAQUE_TOKEN}`)
      .send(INITIALIZE_BODY);

    expectConformant401(res);
  });

  it('class 3 — wrong issuer (WIRING-only): 401', async () => {
    // WIRING-ONLY: a wrong-issuer token is rejected upstream by Clerk
    // (isAuthenticated:false). Repo proves only the 401 handling; that Clerk
    // rejects a foreign issuer is owner-held AC-4.
    const app = await createNegativeTokenApp(createUnauthenticatedMcpAuthClerkDeps());

    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .set('Authorization', `Bearer ${OPAQUE_TOKEN}`)
      .send(INITIALIZE_BODY);

    expectConformant401(res);
  });

  it('class 4 — expired token (WIRING-only): 401', async () => {
    // WIRING-ONLY: expiry is Clerk-enforced (isAuthenticated:false). Repo
    // proves only the 401 handling; that Clerk rejects an expired token is
    // owner-held AC-4.
    const app = await createNegativeTokenApp(createUnauthenticatedMcpAuthClerkDeps());

    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .set('Authorization', `Bearer ${OPAQUE_TOKEN}`)
      .send(INITIALIZE_BODY);

    expectConformant401(res);
  });

  it('class 5 — wrong resource/audience on the opaque path (WIRING-only): 401', async () => {
    // WIRING-ONLY (highest-severity, R1): for an OPAQUE token,
    // validateResourceParameter returns valid:true UNCONDITIONALLY
    // (resource-parameter-validator.ts), so cross-resource replay protection
    // rests SOLELY on Clerk binding the resource at issuance. Here verification
    // rejects (verifyClerkToken → undefined) → 401. Repo proves the 401
    // handling; that Clerk actually enforces the resource binding on opaque
    // tokens is owner-held AC-4 and unverified in-repo.
    const app = await createNegativeTokenApp(createVerifyRejectsMcpAuthClerkDeps());

    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .set('Authorization', `Bearer ${OPAQUE_TOKEN}`)
      .send(INITIALIZE_BODY);

    expectConformant401(res);
  });
});
