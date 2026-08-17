import { request } from '../test-helpers/loopback-request.js';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Express } from 'express';

import { createApp } from '../application.js';
import { getScratchStaticRoot } from '../test-helpers/static-root-fixture.js';
import { createFakeHttpObservability } from '../test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from '../test-helpers/auth-error-test-helpers.js';

/**
 * The health endpoint has to be reachable on the surface that is actually
 * monitored (MCP-580).
 *
 * ADR-162 makes exposing a healthy `/healthz` this repository's ONE monitoring
 * obligation; everything else about uptime is operated outside it. On the
 * canonical host that obligation was unmet, and the two ways it failed are the
 * two things this suite pins:
 *
 * 1. Root `/healthz` never arrives. The Cloudflare origin rule forwards `/mcp`
 *    and `/mcp/*` and nothing else, so a root-level probe stays on the main
 *    website and collects that site's 404 HTML. The health path therefore has
 *    to live inside the routed surface — the same cure shape MCP-509 used for
 *    the landing page's assets, and it needs no edge change.
 * 2. `/mcp/healthz` DID arrive and still failed, twice over: without an SSE
 *    `Accept` header the `/mcp` accept gate answered 406 before routing, and
 *    with one Express answered its own 404 because no such route existed.
 *
 * Both of those gates are `app.use('/mcp', …)` mounts matching the whole
 * subtree, so the health route only wins by being registered ahead of them.
 * That ordering is not asserted directly — it is measured, by probing a SIBLING
 * path beneath `/mcp` for each gate's own answer. A reorder turns the health
 * case red while the sibling stays green, which is what makes these 200s
 * measurements rather than the absence of a gate.
 *
 * Paths are spelled as literals throughout, deliberately. What has to be true
 * is that the SERVED path is one the edge rule forwards; composing the probes
 * from the same constant the product code composes would keep this suite green
 * while the served path drifted somewhere Cloudflare never routes.
 */
describe('health endpoint inside the routed surface (MCP-580)', () => {
  let app: Express;

  /** The only health path the canonical host's monitor can reach. */
  const ROUTED_HEALTH = '/mcp/healthz';

  /** The alpha compatibility surface's path. */
  const ROOT_HEALTH = '/healthz';

  /** What an external uptime monitor sends; curl's default. */
  const MONITOR_ACCEPT = '*/*';

  /** What a browser sends on a document navigation. */
  const BROWSER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

  const HEALTH_BODY = {
    status: 'ok',
    mode: 'streamable-http',
    auth: 'required-for-post',
  };

  beforeAll(async () => {
    app = await createApp({
      staticRoot: await getScratchStaticRoot(),
      runtimeConfig: createMockRuntimeConfig({
        dangerouslyDisableAuth: true,
        env: { ALLOWED_HOSTS: 'localhost,127.0.0.1,::1' },
      }),
      observability: createFakeHttpObservability(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      getLandingPageHtml: () => '<!doctype html><html lang="en-GB"><body>page</body></html>',
    });
  });

  it('answers a monitor-shaped GET on the routed path with the health payload', async () => {
    const res = await request(app).get(ROUTED_HEALTH).set('Accept', MONITOR_ACCEPT);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual(HEALTH_BODY);
  });

  it('answers a monitor-shaped HEAD on the routed path', async () => {
    const res = await request(app).head(ROUTED_HEALTH).set('Accept', MONITOR_ACCEPT);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('forbids any intermediary from storing either health answer', async () => {
    // The routed path is served through Cloudflare, so a cache is in the path
    // by construction. A stored 200 is the one failure mode that makes a
    // liveness probe lie, and it lies most confidently at the moment the
    // process dies. HEAD as well as GET: a monitor configured for HEAD gets the
    // same guarantee, or the directive is decorative for half its callers.
    for (const path of [ROUTED_HEALTH, ROOT_HEALTH]) {
      const get = await request(app).get(path).set('Accept', MONITOR_ACCEPT);
      const head = await request(app).head(path).set('Accept', MONITOR_ACCEPT);

      expect(get.headers['cache-control'], `GET ${path} is storable`).toBe('no-store');
      expect(head.headers['cache-control'], `HEAD ${path} is storable`).toBe('no-store');
    }
  });

  it('is not captured by the /mcp accept gate that still answers a sibling path', async () => {
    const gated = await request(app).get('/mcp/not-a-health-path').set('Accept', MONITOR_ACCEPT);

    expect(gated.status).toBe(406);
    expect(gated.body).toEqual({ error: 'Accept header must include text/event-stream' });
  });

  it('is not captured by the /mcp landing-page negotiation that still answers its own path', async () => {
    // Some uptime services probe with a browser Accept, and the negotiation
    // would hand them the page: HTML satisfies a bare status-code check while
    // saying nothing at all about this process. The sibling `/mcp` proves the
    // negotiation is mounted and answering, so the JSON below is the health
    // route winning rather than the negotiation being absent.
    const negotiated = await request(app)
      .get('/mcp')
      .set('Host', 'localhost')
      .set('Accept', BROWSER_ACCEPT);
    const health = await request(app).get(ROUTED_HEALTH).set('Accept', BROWSER_ACCEPT);

    expect(negotiated.status).toBe(200);
    expect(negotiated.headers['content-type']).toMatch(/text\/html/);
    expect(health.status).toBe(200);
    expect(health.headers['content-type']).toMatch(/application\/json/);
    expect(health.body).toEqual(HEALTH_BODY);
  });

  it('keeps the root health path answering for the alpha compatibility surface', async () => {
    const res = await request(app).get(ROOT_HEALTH).set('Accept', MONITOR_ACCEPT);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(HEALTH_BODY);
  });
});
