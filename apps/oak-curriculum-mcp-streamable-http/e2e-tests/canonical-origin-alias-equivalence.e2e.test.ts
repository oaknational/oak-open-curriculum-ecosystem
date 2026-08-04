/**
 * MCP-143 Guard 3 (AC-3, repo-safe): deployment aliases cannot mint a second
 * OAuth resource identifier.
 *
 * With CANONICAL_HOST configured, `deriveSelfOrigin` short-circuits to the
 * canonical origin regardless of the incoming Host (host-validation-error.ts),
 * so every self-description surface — RFC 9728 protected-resource metadata,
 * RFC 8414 authorization-server metadata, and the RFC 6750 `WWW-Authenticate`
 * `resource_metadata` pointer — names the canonical origin identically no
 * matter which alias reaches the app. This proves the repo wiring; that the
 * production deployment actually carries CANONICAL_HOST is the owner-held
 * live-curl evidence (AC-3 owner-held), not provable here.
 */
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import type { Express } from 'express';
import { request } from '../src/test-helpers/loopback-request.js';
import { createApp } from '../src/application.js';
import {
  createMockObservability,
  createMockRuntimeConfig,
  createNoOpClerkMiddleware,
  createUnauthenticatedMcpAuthClerkDeps,
} from './helpers/test-config.js';
import { TEST_UPSTREAM_METADATA } from '../src/test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from '../src/test-helpers/static-root-fixture.js';

const CANONICAL_HOST = 'www.thenational.academy';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

// Two distinct hosts that both reach the app: the canonical address and a
// per-deployment Vercel alias. With CANONICAL_HOST set, both must yield the
// same self-description.
const HOSTS = [CANONICAL_HOST, 'poc-oak-open-curriculum-mcp.vercel.app'] as const;

const PrmBody = z.object({ resource: z.string() });
const AsBody = z.object({ issuer: z.string() });

async function createCanonicalHostApp(): Promise<Express> {
  const runtimeConfig = createMockRuntimeConfig({
    useStubTools: true,
    env: {
      OAK_API_KEY: 'test-api-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
      CANONICAL_HOST,
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
    mcpAuthClerkDeps: createUnauthenticatedMcpAuthClerkDeps(),
  });
}

function unique(values: readonly unknown[]): number {
  return new Set(values.map((v) => JSON.stringify(v))).size;
}

describe('Canonical-origin alias equivalence (MCP-143 Guard 3, AC-3 repo-safe)', () => {
  it('PRM resource is identical across Host headers and names the canonical origin', async () => {
    const app = await createCanonicalHostApp();

    const resources: unknown[] = [];
    for (const host of HOSTS) {
      const res = await request(app).get('/.well-known/oauth-protected-resource').set('Host', host);
      expect(res.status).toBe(200);
      resources.push(PrmBody.parse(res.body).resource);
    }

    expect(unique(resources)).toBe(1);
    expect(String(resources[0])).toContain(CANONICAL_ORIGIN);
    expect(String(resources[0])).not.toContain('vercel.app');
  });

  it('AS issuer is identical across Host headers and names the canonical origin', async () => {
    const app = await createCanonicalHostApp();

    const issuers: unknown[] = [];
    for (const host of HOSTS) {
      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', host);
      expect(res.status).toBe(200);
      issuers.push(AsBody.parse(res.body).issuer);
    }

    expect(unique(issuers)).toBe(1);
    expect(String(issuers[0])).toContain(CANONICAL_ORIGIN);
    expect(String(issuers[0])).not.toContain('vercel.app');
  });

  it('401 WWW-Authenticate resource_metadata is identical across Host headers and names the canonical origin', async () => {
    const app = await createCanonicalHostApp();

    const challenges: (string | undefined)[] = [];
    for (const host of HOSTS) {
      const res = await request(app)
        .post('/mcp')
        .set('Host', host)
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0.0' },
          },
        });
      expect(res.status).toBe(401);
      challenges.push(res.headers['www-authenticate']);
    }

    expect(challenges[0]).toBeDefined();
    expect(unique(challenges)).toBe(1);
    expect(challenges[0]).toContain('resource_metadata=');
    expect(challenges[0]).toContain(CANONICAL_ORIGIN);
    expect(challenges[0]).not.toContain('vercel.app');
  });
});
