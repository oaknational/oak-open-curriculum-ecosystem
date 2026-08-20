import { request } from './test-helpers/loopback-request.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Express } from 'express';

import { createApp } from './application.js';
import {
  createEmptyStaticRoot,
  getScratchStaticRoot,
  removeStaticRoot,
} from './test-helpers/static-root-fixture.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { ROUTED_ASSET_BASE } from './app/static-asset-paths.js';

/**
 * The design system reaches the browser as ordinary static assets.
 *
 * The copy itself is proven in `build-scripts/copy-oak-ds.integration.test.ts`;
 * this suite proves the other half — that the copied tree is actually
 * reachable over HTTP from the running app, through the static mount that
 * already exists. Without this, a correct copy into a directory the server
 * does not serve would look identical to success.
 *
 * The suite serves from its own scratch root (the `staticRoot` seam), so it
 * neither reads nor writes the workspace's live `public/` tree and cannot
 * race the build's copy step.
 */
describe('Oak Open Curriculum Design System static serving', () => {
  let scratchRoot: string;
  let app: Express;

  beforeAll(async () => {
    scratchRoot = await getScratchStaticRoot();
    app = await createApp({
      runtimeConfig: createMockRuntimeConfig({
        dangerouslyDisableAuth: true,
        env: { ALLOWED_HOSTS: 'localhost,127.0.0.1,::1' },
      }),
      observability: createFakeHttpObservability(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      staticRoot: scratchRoot,
    });
  });

  afterAll(() => {
    // The shared scratch root outlives the suite by design (one copy per
    // worker, other suites boot from it); the OS temp dir owns cleanup.
  });

  it('serves the root stylesheet as CSS, revalidate-always', async () => {
    const res = await request(app).get('/oak-ds/styles.css').set('Host', 'localhost');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/css');
    // Mutable URLs: any positive freshness window pairs pre-deploy assets
    // with post-deploy HTML. ETag keeps the steady state a cheap 304.
    expect(res.headers['cache-control']).toBe('public, max-age=0');
    expect(res.headers['etag']).toBeDefined();
  });

  it('serves the stylesheets the root sheet imports', async () => {
    for (const sheet of ['colors_and_type.css', 'oak-icons.css', 'components.css', 'print.css']) {
      const res = await request(app).get(`/oak-ds/${sheet}`).set('Host', 'localhost');

      expect(res.status, `${sheet} is not reachable`).toBe(200);
    }
  });

  it('serves a font face and its licence notice', async () => {
    const font = await request(app)
      .get('/oak-ds/fonts/Lexend-VariableFont_wght.ttf')
      .set('Host', 'localhost');
    const licence = await request(app).get('/oak-ds/fonts/Lexend-OFL.txt').set('Host', 'localhost');

    expect(font.status).toBe(200);
    expect(licence.status).toBe(200);
  });

  it('serves a mask icon', async () => {
    const res = await request(app)
      .get('/oak-ds/assets/icons/chevron-down.svg')
      .set('Host', 'localhost');

    expect(res.status).toBe(200);
  });

  it('serves the routed asset paths ahead of the MCP accept-header gate', async () => {
    // `/mcp/*` also carries the MCP accept-header gate, which requires
    // `text/event-stream`. A browser asking for a stylesheet sends
    // `Accept: text/css,*/*;q=0.1` and would get a 406, so assets survive
    // only because the static mount is registered first. Reordering the two
    // would break the page while leaving every MCP request correct, and this
    // is what makes that visible.
    //
    // Clerk is deliberately NOT named here. An earlier version of this test
    // claimed to prove an unauthenticated asset GET is not a 401, which it
    // never did: the suite builds the app with `dangerouslyDisableAuth`, so
    // Clerk is not installed at all. Nor could any ordering produce that
    // 401 — Clerk's context middleware runs before this mount and only
    // attaches context, and its enforcement binds the exact `/mcp` routes,
    // which no asset path matches.
    const res = await request(app)
      .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
      .set('Host', 'localhost')
      .set('Accept', 'text/css,*/*;q=0.1');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/css');
  });

  it('still serves the unprefixed paths, so the alpha surface keeps rendering', async () => {
    // The alpha host serves this app at its own root and is a declared
    // compatibility surface (MCP-509 acceptance). Retiring the root mount
    // would break it silently.
    const res = await request(app).get('/oak-ds/styles.css').set('Host', 'localhost');

    expect(res.status).toBe(200);
  });

  it('refuses to construct the app when the static root lacks the copied assets', async () => {
    const emptyRoot = await createEmptyStaticRoot();
    try {
      await expect(
        createApp({
          runtimeConfig: createMockRuntimeConfig({
            dangerouslyDisableAuth: true,
            env: { ALLOWED_HOSTS: 'localhost,127.0.0.1,::1' },
          }),
          observability: createFakeHttpObservability(),
          getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
          staticRoot: emptyRoot,
        }),
      ).rejects.toThrow(/missing .*oak-ds/);
    } finally {
      await removeStaticRoot(emptyRoot);
    }
  });
});
