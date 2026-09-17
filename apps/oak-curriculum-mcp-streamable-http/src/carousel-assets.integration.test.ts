import { request } from './test-helpers/loopback-request.js';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Express } from 'express';

import { createApp } from './application.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';

/**
 * The submission carousel images are served at stable, permanent `/mcp` URLs.
 *
 * @remarks
 * MCP-595. The Claude submission portal will not accept image uploads, so the
 * listing holds these URLs and fetches them itself, indefinitely. That makes
 * them an EXTERNAL contract rather than an internal asset path: nothing in this
 * repository references them, so no scrape-based guard can notice them, and a
 * rename or a move would break Anthropic's rendered directory listing — a
 * surface we never see — while every check here stayed green.
 *
 * This suite is therefore the only thing standing between a tidy-up and a
 * broken public listing. It asserts POSITIVELY and per file: HTTP 200 AND a
 * `image/png` content type.
 *
 * The positive form is load-bearing, not pedantry. A non-existent path under
 * `/mcp/` does NOT return 404 — the MCP transport's accept-header gate answers
 * first with `406 application/json`. So a check written as "confirm it is not a
 * 404" passes against a completely broken URL, and would have certified an
 * empty directory. Do not weaken these assertions to a negative one.
 */
/**
 * The complete published URL paths, spelled out as literals.
 *
 * @remarks
 * These are deliberately NOT composed from `ROUTED_ASSET_BASE` (MCP-606, at
 * review). Production mounts the carousel under that same constant, so a test
 * that shares it moves whenever the mount moves: change the constant and both
 * sides shift together, this suite stays green, and Anthropic's stored literal
 * `/mcp/carousel/...` URLs break silently. A sentinel that follows the thing it
 * guards is not a sentinel. Pinning the whole path — prefix included — is what
 * makes this suite able to fail.
 *
 * Spelled out rather than enumerated from disk for the same reason: reading the
 * directory would make any rename self-fulfilling.
 *
 * The filenames are deliberately generic (MCP-606, adopting Aakesh's review
 * suggestion). Because the URLs are permanent but the images may yet be
 * re-exported, a content-descriptive name could become wrong and uncorrectable;
 * a generic one cannot. The ordinal is the carousel's running order and pairs
 * each image with its example prompt on the submission form — that pairing has
 * no home in the filename any more, so it lives on MCP-458.
 */
const CAROUSEL_IMAGE_PATHS = [
  '/mcp/carousel/carousel_image_1.png',
  '/mcp/carousel/carousel_image_2.png',
  '/mcp/carousel/carousel_image_3.png',
] as const;

/**
 * What a future editor should do when this suite goes red.
 *
 * @remarks
 * The correct response to a red sentinel here is to STOP, not to update the
 * fixture. These paths are an external contract held by a third party; making
 * the test match the code reverses the direction of authority and lands the
 * break in public instead of in CI.
 */
const EXTERNAL_CONTRACT_NOTICE =
  'This path is a PUBLISHED URL that Anthropic stores in the Oak directory listing. ' +
  'Do NOT update this expected path to match the code. Re-adjudicate the external-contract ' +
  'decision first (MCP-595 / MCP-606): if the served path has genuinely moved, the listing ' +
  'itself must be updated with Anthropic, and that is an owner decision, not a test edit.';

describe('submission carousel image serving', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createApp({
      runtimeConfig: createMockRuntimeConfig({
        dangerouslyDisableAuth: true,
        env: { ALLOWED_HOSTS: 'localhost,127.0.0.1,::1' },
      }),
      observability: createFakeHttpObservability(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      staticRoot: await getScratchStaticRoot(),
    });
  });

  it.each(CAROUSEL_IMAGE_PATHS)('serves %s as a PNG inside the routed surface', async (path) => {
    // The `Accept` header is the point of this request, not scaffolding. These
    // URLs sit under `/mcp/`, which also carries the MCP accept-header gate,
    // and an image fetch never sends `text/event-stream` — it sends this. The
    // images survive only because the static mount is registered ahead of that
    // gate (`application.ts` ordering). Reordering the two would answer every
    // carousel fetch with a 406 while leaving all MCP traffic correct.
    const res = await request(app)
      .get(path)
      .set('Host', 'localhost')
      .set('Accept', 'image/avif,image/webp,image/png,*/*;q=0.8');

    expect(
      res.status,
      `${path} is not served — the submitted listing would show a gap. ${EXTERNAL_CONTRACT_NOTICE}`,
    ).toBe(200);
    expect(
      res.headers['content-type'],
      `${path} is served with the wrong type. ${EXTERNAL_CONTRACT_NOTICE}`,
    ).toContain('image/png');
  });
});
