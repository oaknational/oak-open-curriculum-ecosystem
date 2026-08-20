/**
 * End-to-end proof that a configured `CANONICAL_HOST` reaches every
 * self-description surface the app serves.
 *
 * Behind the Cloudflare edge (MCP-172) the Host header names the app's own
 * Vercel hostname, so these documents would otherwise advertise the origin
 * hostname rather than the canonical address a client connected to.
 *
 * Requests here deliberately arrive with a NON-canonical Host — that is
 * exactly the edge-served shape.
 */

import { describe, it, expect } from 'vitest';
import { request } from './test-helpers/loopback-request.js';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';
import { mcpAuth } from './auth/mcp-auth/mcp-auth.js';
import {
  createFakeLogger,
  createMockExpressRequest,
  createMockExpressResponse,
} from './test-helpers/fakes.js';

const CANONICAL_HOST = 'www.thenational.academy';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

/**
 * The Host the edge presents to the origin. Deliberately NOT added to the
 * allow-list: a configured canonical origin must not consult it, so leaving
 * it out proves the canonical path is independent of allow-list state.
 */
const EDGE_ORIGIN_HOST = 'origin.example.com';

/** In the allow-list by default (`BASE_HOSTS`), for the per-request cases. */
const LOOPBACK_HOST = 'localhost:3333';

async function createTestApp(env: Record<string, string>) {
  const runtimeConfig = createMockRuntimeConfig({ env });
  return await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig,
    observability: createFakeHttpObservability(),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    upstreamMetadata: TEST_UPSTREAM_METADATA,
  });
}

describe('canonical origin (MCP-269)', () => {
  describe('with CANONICAL_HOST configured', () => {
    it('protected-resource metadata names the canonical resource and authorization server', async () => {
      const app = await createTestApp({ CANONICAL_HOST });

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource/mcp')
        .set('Host', EDGE_ORIGIN_HOST);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('resource', `${CANONICAL_ORIGIN}/mcp`);
      expect(res.body).toHaveProperty('authorization_servers', [CANONICAL_ORIGIN]);
    });

    it('authorization-server metadata rewrites issuer and endpoints onto the canonical origin', async () => {
      const app = await createTestApp({ CANONICAL_HOST });

      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', EDGE_ORIGIN_HOST);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('issuer', CANONICAL_ORIGIN);
      for (const endpoint of [
        'authorization_endpoint',
        'token_endpoint',
        'registration_endpoint',
      ]) {
        expect(String(res.body[endpoint]).startsWith(`${CANONICAL_ORIGIN}/`)).toBe(true);
      }
    });

    it('the unauthenticated /mcp challenge points at the canonical metadata URL', async () => {
      const middleware = mcpAuth(
        () => Promise.resolve(undefined),
        createFakeLogger(),
        [],
        CANONICAL_ORIGIN,
      );
      const req = createMockExpressRequest({ host: EDGE_ORIGIN_HOST });
      const res = createMockExpressResponse();

      await middleware(req, res, () => undefined);

      expect(res.statusCode).toBe(401);
      expect(res.getHeader('WWW-Authenticate')).toContain(
        `resource_metadata="${CANONICAL_ORIGIN}/.well-known/oauth-protected-resource/mcp"`,
      );
    });

    it('challenge and metadata agree on the origin, so the RFC 8707 audience matches', async () => {
      const app = await createTestApp({ CANONICAL_HOST });
      const metadata = await request(app)
        .get('/.well-known/oauth-protected-resource/mcp')
        .set('Host', EDGE_ORIGIN_HOST);

      const middleware = mcpAuth(
        () => Promise.resolve(undefined),
        createFakeLogger(),
        [],
        CANONICAL_ORIGIN,
      );
      const req = createMockExpressRequest({ host: EDGE_ORIGIN_HOST });
      const res = createMockExpressResponse();
      await middleware(req, res, () => undefined);

      const challengeUrl = /resource_metadata="([^"]+)"/.exec(
        String(res.getHeader('WWW-Authenticate') ?? ''),
      )?.[1];

      expect(challengeUrl).toBeDefined();
      expect(new URL(challengeUrl ?? '').origin).toBe(
        new URL(String(metadata.body.resource)).origin,
      );
    });

    it('describes itself identically however it is reached — the origin hostname never leaks', async () => {
      const app = await createTestApp({ CANONICAL_HOST });

      const [viaEdge, direct] = await Promise.all([
        request(app).get('/.well-known/oauth-protected-resource/mcp').set('Host', EDGE_ORIGIN_HOST),
        request(app).get('/.well-known/oauth-protected-resource/mcp').set('Host', LOOPBACK_HOST),
      ]);

      expect(viaEdge.body).toStrictEqual(direct.body);
      expect(JSON.stringify(viaEdge.body)).not.toContain(EDGE_ORIGIN_HOST);
    });
  });

  describe('without CANONICAL_HOST', () => {
    it('keeps per-request derivation so direct deployments are unchanged', async () => {
      const app = await createTestApp({});

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource/mcp')
        .set('Host', LOOPBACK_HOST);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('resource', `http://${LOOPBACK_HOST}/mcp`);
    });
  });
});
