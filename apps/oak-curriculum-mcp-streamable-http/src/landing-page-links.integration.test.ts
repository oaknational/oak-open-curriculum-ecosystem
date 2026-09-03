import { request } from './test-helpers/loopback-request.js';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Express } from 'express';

import { createApp } from './application.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';
import { renderLandingPageHtml } from './landing-page/index.js';
import { MCP_RESOURCE_PATH, PROTECTED_RESOURCE_METADATA_PREFIX } from './served-origin.js';

/**
 * Destinations the landing page sends a reader to must actually resolve.
 *
 * @remarks
 * MCP-511. The MCP-509 subresource scrape deliberately excludes `<a href>` —
 * a destination is not something the browser fetches to render the page, and
 * that exclusion is right. The consequence was that no guard covered
 * first-party destinations at all, and one of them was broken in production:
 * the page linked to the unqualified `/.well-known/oauth-protected-resource`,
 * which returns the main website's 404 HTML on the canonical host because the
 * Cloudflare origin rule forwards only `/mcp` and `/mcp/*`.
 *
 * Scoped to the metadata link rather than generalised to every own-origin
 * `<a href>`, and that is a deliberate limit. The page also links to the main
 * Oak site — `/teachers` and similar — which share the page's origin on the
 * canonical deployment but are served by the main website, not by this app.
 * A blanket "fetch every own-origin link" assertion would fail on those and
 * would have to be loosened until it proved nothing. This asserts the one
 * destination this app is responsible for serving.
 */
describe('landing-page first-party destinations', () => {
  let app: Express;
  const html = renderLandingPageHtml();

  beforeAll(async () => {
    // Auth ENABLED, with upstream metadata supplied. The protected-resource
    // routes exist only in that configuration, so a `dangerouslyDisableAuth`
    // app 404s them — an earlier draft of this suite did exactly that and the
    // servability assertion failed for the harness's reasons rather than the
    // app's. Matches how `auth-routes.integration.test.ts` builds its app.
    app = await createApp({
      runtimeConfig: createMockRuntimeConfig({
        env: { ALLOWED_HOSTS: 'localhost,127.0.0.1,::1' },
      }),
      observability: createFakeHttpObservability(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      getLandingPageHtml: () => html,
      staticRoot: await getScratchStaticRoot(),
      upstreamMetadata: TEST_UPSTREAM_METADATA,
    });
  });

  /** The metadata link as the page actually emits it. */
  function metadataHref(): string {
    const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1] ?? '');
    const found = hrefs.filter((href) => href.includes(PROTECTED_RESOURCE_METADATA_PREFIX));
    // One link, not "at least one": two links to the same metadata under
    // different paths is the drift this guard exists to catch.
    expect(
      found,
      'the page should carry exactly one protected-resource metadata link',
    ).toHaveLength(1);
    return found[0] ?? '';
  }

  /**
   * The metadata link's path, whether the page emits it absolute or relative.
   *
   * @remarks
   * Resolved against a base so a RELATIVE href yields a readable path rather
   * than throwing. That matters because the pre-fix markup was relative: a
   * bare `new URL()` would have failed this suite with a URL parse error
   * instead of naming the wrong path, which is the diagnosis, not the symptom.
   */
  function metadataPath(): string {
    return new URL(metadataHref(), 'http://localhost').pathname;
  }

  it('links to the path-qualified metadata URL, not the unqualified one', () => {
    // RFC 9728 §3.1: a resource at `/mcp` publishes its metadata at
    // `/.well-known/oauth-protected-resource/mcp`. The app answers the
    // unqualified path too, and both forms serve on the canonical host
    // (verified 2026-09-01) — but only the path-qualified one is this
    // resource's metadata URL, and only it survives a path-scoped edge.
    expect(metadataPath()).toBe(`${PROTECTED_RESOURCE_METADATA_PREFIX}${MCP_RESOURCE_PATH}`);
  });

  it('serves whatever metadata URL the page links to', async () => {
    // The half MCP-511 was missing: the path is not merely well-formed, the
    // app answers it. Asserted over the link the page emits rather than over
    // a path spelled here, so the two cannot drift apart.
    const res = await request(app).get(metadataPath()).set('Host', 'localhost');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
    // It must describe THIS resource — a 200 carrying someone else's metadata
    // would satisfy a bare status check.
    expect(new URL(String(res.body.resource)).pathname).toBe(MCP_RESOURCE_PATH);
  });
});
