/**
 * MCP-517: Clerk derives the origin it reports to its Frontend API from request
 * headers alone. Behind the edge those headers name the deployment hostname, so
 * Clerk minted session-refresh handshakes returning to a host its own Frontend
 * API rejects (422) — stranding signed-in browsers while signed-out traffic
 * sailed through.
 *
 * Two scales, because the fix has two separable claims:
 *
 * - What the headers become. Proven with the shim mounted ALONE behind a probe
 *   route, so a failure points at the shim rather than the composition root.
 * - That they have become it BY THE TIME CLERK RUNS. Proven only through the
 *   real `createApp` assembly, via the `clerkMiddlewareFactory` DI seam, because
 *   mount order is invisible at any smaller scale — and mount order is the part
 *   that actually breaks.
 *
 * Requests deliberately arrive carrying the forwarded headers Vercel's edge
 * supplies, which is the shape production sends.
 *
 * The second scale observes Clerk on the MCP PROTOCOL leg. It used a browser
 * document GET of `/mcp` until MCP-518 made that leg skip Clerk outright — the
 * page there is public by owner ruling, so a page view no longer touches the
 * auth path and cannot report on it. The protocol leg is where Clerk still
 * runs, and it is the leg whose perceived origin the handshake depends on, so
 * moving the vehicle strengthens the observation rather than weakening it. The
 * page's own behaviour under the shim is asserted separately, below.
 */

import express from 'express';
import type { IncomingHttpHeaders } from 'node:http';
import type { RequestHandler } from 'express';
import { describe, it, expect } from 'vitest';
import { createCanonicalForwardedHeaders } from './canonical-forwarded-headers.js';
import { request } from './test-helpers/loopback-request.js';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';

const CANONICAL_HOST = 'mcp.thenational.academy';

/**
 * What Vercel's edge has ALREADY written into `x-forwarded-host` by the time the
 * app runs — the deployment hostname the Cloudflare origin rule must present so
 * Vercel selects this project. The value the fix has to displace.
 */
const DEPLOYMENT_HOST = 'example-project.vercel.example';

/**
 * An allow-listed Host (`BASE_HOSTS`), so the DNS-rebinding guard is satisfied
 * and the assertion that Host survives untouched can be exact.
 */
const REQUEST_HOST = 'localhost';

/** The forwarded headers production arrives with, before the app touches them. */
const EDGE_SUPPLIED_HEADERS = {
  'x-forwarded-host': DEPLOYMENT_HOST,
  'x-forwarded-proto': 'http',
} as const;

/**
 * Runs one request through the shim alone and returns the headers the next
 * handler receives. The mount is expressed exactly as the app expresses it, so
 * an unconfigured canonical host results in no mounted middleware at all.
 *
 * @param canonicalHost - The configured canonical host, or `undefined`
 * @param sentHeaders - Headers the request arrives with
 */
async function headersAfterShim(
  canonicalHost: string | undefined,
  sentHeaders: Readonly<Record<string, string>>,
): Promise<IncomingHttpHeaders> {
  const app = express();
  const shim = createCanonicalForwardedHeaders(canonicalHost);
  if (shim) {
    app.use(shim);
  }

  const captured: { headers?: IncomingHttpHeaders } = {};
  app.get('/probe', (req, res) => {
    captured.headers = { ...req.headers };
    res.status(204).end();
  });

  const response = await request(app).get('/probe').set('Host', REQUEST_HOST).set(sentHeaders);

  expect(response.status).toBe(204);
  expect(captured.headers).toBeDefined();
  return captured.headers ?? {};
}

/** Assembles the real app with `clerkMiddleware` replaced by the given handler. */
async function assembleApp(
  env: Record<string, string>,
  clerkMiddleware: RequestHandler,
): Promise<Awaited<ReturnType<typeof createApp>>> {
  return await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig: createMockRuntimeConfig({ env }),
    observability: createFakeHttpObservability(),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    getLandingPageHtml: () =>
      '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
    upstreamMetadata: TEST_UPSTREAM_METADATA,
    clerkMiddlewareFactory: () => clerkMiddleware,
  });
}

/**
 * Runs a conformant MCP protocol request through the whole assembly and reports
 * the headers as Clerk sees them.
 *
 * The vehicle is a protocol POST rather than a browser page view because that is
 * the leg Clerk still runs on (MCP-518 — see the file header).
 *
 * @param env - Env overrides for the app under test
 * @param sentHeaders - Headers the request arrives with
 */
async function observeAtClerk(
  env: Record<string, string>,
  sentHeaders: Readonly<Record<string, string>>,
): Promise<IncomingHttpHeaders> {
  const captured: { headers?: IncomingHttpHeaders } = {};
  const captureClerk: RequestHandler = (req, _res, next) => {
    captured.headers = { ...req.headers };
    next();
  };

  const app = await assembleApp(env, captureClerk);

  await request(app)
    .post('/mcp')
    .set('Accept', 'application/json, text/event-stream')
    .set('Host', REQUEST_HOST)
    .set(sentHeaders)
    .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

  // A silent miss would make every header assertion vacuous, so the absence of
  // a capture fails in its own right.
  expect(
    captured.headers,
    'Clerk middleware never ran for the protocol POST — the assembly changed and these tests no longer observe the auth path',
  ).toBeDefined();
  return captured.headers ?? {};
}

/**
 * The status a browser document GET of the public page receives through the
 * whole assembly, with the shim mounted ahead of everything.
 *
 * @param env - Env overrides for the app under test
 * @param sentHeaders - Headers the request arrives with
 */
async function pageStatus(
  env: Record<string, string>,
  sentHeaders: Readonly<Record<string, string>>,
): Promise<number> {
  const app = await assembleApp(env, (_req, _res, next) => next());

  const response = await request(app)
    .get('/mcp')
    .set('Accept', 'text/html')
    .set('Host', REQUEST_HOST)
    .set(sentHeaders);

  return response.status;
}

describe('canonical origin in forwarded headers (MCP-517)', () => {
  describe('what the headers become', () => {
    it('displaces the deployment host the edge supplied', async () => {
      const headers = await headersAfterShim(CANONICAL_HOST, EDGE_SUPPLIED_HEADERS);

      // An exact match is the assertion that matters: consumers read only the
      // first comma-separated value, so an APPENDED canonical host would leave
      // the defect fully intact while looking like a fix.
      expect(headers['x-forwarded-host']).toBe(CANONICAL_HOST);
    });

    it('states the canonical host even when the request carried no forwarded headers', async () => {
      const headers = await headersAfterShim(CANONICAL_HOST, {});

      expect(headers['x-forwarded-host']).toBe(CANONICAL_HOST);
      expect(headers['x-forwarded-proto']).toBe('https');
    });

    it('states https, so the perceived origin cannot be downgraded by a request header', async () => {
      const headers = await headersAfterShim(CANONICAL_HOST, EDGE_SUPPLIED_HEADERS);

      expect(headers['x-forwarded-proto']).toBe('https');
    });

    it('lower-cases the configured host so perceived and advertised origins compare equal', async () => {
      // Clerk relays the origin it perceives here to its backend when it
      // attempts the silent token refresh, and the server-side comparison
      // against the session's authorised party is exact — so a case difference
      // between this header and `resolveCanonicalOrigin`'s output would refuse
      // the refresh.
      const headers = await headersAfterShim('MCP.Thenational.Academy', EDGE_SUPPLIED_HEADERS);

      expect(headers['x-forwarded-host']).toBe(CANONICAL_HOST);
    });

    it('never modifies Host, which the DNS-rebinding guard judges', async () => {
      // This test's allow-list deliberately excludes the canonical address
      // (production names it via ALLOWED_HOSTS since MCP-634) — the edge
      // never presents it as Host — so rewriting Host here would trip the
      // app's own guard.
      const headers = await headersAfterShim(CANONICAL_HOST, EDGE_SUPPLIED_HEADERS);

      expect(headers.host).toBe(REQUEST_HOST);
    });

    it.each([
      ['unconfigured', undefined],
      ['configured empty', ''],
      ['configured blank', '   '],
    ])('leaves the edge-supplied headers byte-identical when %s', async (_label, canonicalHost) => {
      const headers = await headersAfterShim(canonicalHost, EDGE_SUPPLIED_HEADERS);

      expect(headers['x-forwarded-host']).toBe(DEPLOYMENT_HOST);
      expect(headers['x-forwarded-proto']).toBe('http');
    });

    it.each([
      ['unconfigured', undefined],
      ['configured empty', ''],
      ['configured blank', '   '],
    ])(
      'adds no forwarded header at all when %s and the request carried none',
      async (_label, canonicalHost) => {
        const headers = await headersAfterShim(canonicalHost, {});

        // An ungated write would put the configured value — or the literal string
        // "undefined" — on every request in preview and local development.
        expect(headers).not.toHaveProperty('x-forwarded-host');
        expect(headers).not.toHaveProperty('x-forwarded-proto');
      },
    );
  });

  describe('when the headers become it', () => {
    it('Clerk already perceives the canonical origin by the time it runs', async () => {
      const headers = await observeAtClerk({ CANONICAL_HOST }, EDGE_SUPPLIED_HEADERS);

      expect(headers['x-forwarded-host']).toBe(CANONICAL_HOST);
      expect(headers['x-forwarded-proto']).toBe('https');
    });

    it('serves the page as normal, so the rebinding guard downstream still passes', async () => {
      expect(await pageStatus({ CANONICAL_HOST }, EDGE_SUPPLIED_HEADERS)).toBe(200);
    });

    it('mounts nothing without CANONICAL_HOST, so Clerk keeps per-request derivation', async () => {
      const headers = await observeAtClerk({}, EDGE_SUPPLIED_HEADERS);

      expect(headers['x-forwarded-host']).toBe(DEPLOYMENT_HOST);
      expect(headers['x-forwarded-proto']).toBe('http');
    });
  });
});
