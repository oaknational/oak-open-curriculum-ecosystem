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
import { renderLandingPageHtml } from './landing-page/index.js';
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
/**
 * Tags whose URL-bearing attributes the browser fetches to render the page.
 *
 * @remarks
 * `<a>` is absent deliberately: its `href` is a destination the user may
 * choose to visit, not something fetched to render this page. Everything a
 * browser retrieves on its own is in scope, which is wider than the
 * `link|img|script` this scrape started with — `<source>`, `<use>` and
 * `<iframe>` are all ways a first-party reference could otherwise opt out.
 *
 * Case-INSENSITIVE, and the flag is load-bearing rather than tidiness: HTML
 * tag and attribute names are case-insensitive, so a lower-case-only scrape
 * lets `<IMG SRC="/x.png">` opt out of this guard silently — the same
 * "reference escapes the check" failure MCP-509 exists to prevent. CodeQL
 * `js/bad-tag-filter` raises exactly this. Do not strip the `i` as noise.
 *
 * The `i` must travel on the ATTRIBUTE pattern too. With it here alone, an
 * upper-case tag would newly match, then find no attribute through a
 * case-sensitive extractor, and its reference would be dropped without a
 * failure — a wider hole than the one being closed.
 */
const SUBRESOURCE_TAG_PATTERN =
  /<(?:link|img|script|source|use|image|video|audio|track|iframe|embed|object)\b[^>]*>/gi;

/**
 * URL-bearing attributes, `data-*` lazy-loading mirrors included.
 *
 * @remarks
 * Matched repeatedly against each tag rather than once, because a tag can
 * carry several: `<img data-src="/lazy.png" src="/real.png">` has two, and a
 * scrape that stops at the first sees only the placeholder. `\b` matches
 * after the hyphen, so `data-src` is collected as well — which is intended,
 * since a lazy-loaded reference is fetched just the same.
 */
const URL_ATTRIBUTE_PATTERN = /\b(?:href|src|srcset|imagesrcset|poster|data)="([^"]+)"/gi;

/** Image references that live in `<meta content>` rather than in a fetchable tag. */
const META_IMAGE_PATTERN =
  /<meta\b[^>]*\b(?:property|name)="(?:og:image|twitter:image|msapplication-TileImage)"[^>]*\bcontent="([^"]+)"/gi;

/**
 * `rel` values the browser actually fetches.
 *
 * @remarks
 * `canonical` and `alternate` are metadata: they name a URL without
 * retrieving anything. Including them made the canonical link — whose href is
 * the page's own origin exactly — normalise to an empty path and register as
 * a subresource sitting outside the routed base. The failure message would
 * then have read "this subresource 404s on the canonical host" about a link
 * that fetches nothing, and the obvious fix under time pressure is to loosen
 * the assertion. Deciding by `rel` keeps the scrape strict and truthful.
 */
const FETCHED_LINK_RELS = new Set([
  'stylesheet',
  'icon',
  'apple-touch-icon',
  'mask-icon',
  'preload',
  'prefetch',
  'manifest',
]);

/** Whether a matched tag is one the browser retrieves, as opposed to metadata. */
function isFetchedTag(tag: string): boolean {
  if (!/^<link\b/i.test(tag)) {
    return true;
  }
  const rel = /\brel="([^"]+)"/i.exec(tag)?.[1]?.toLowerCase() ?? '';
  return rel.split(/\s+/).some((token) => FETCHED_LINK_RELS.has(token));
}

/** A `srcset` holds several candidates with descriptors; the URL is the first token. */
function splitCandidates(value: string): string[] {
  return value.split(',').flatMap((candidate) => {
    const url = candidate.trim().split(/\s+/)[0];
    return url === undefined || url === '' ? [] : [url];
  });
}

/**
 * Every first-party reference the rendered page fetches, as served paths.
 *
 * @remarks
 * Classification is by ORIGIN, which is what makes off-site links safe to
 * ignore without an exclusion list: a reference carrying the page's own
 * origin is normalised to its path and checked, one carrying any other origin
 * is somebody else's problem, and a root-relative one is ours by definition.
 * An earlier draft stripped every origin indiscriminately and so reported
 * GitHub's `/oaknational/...` as a first-party asset.
 *
 * A relative reference (no leading slash) is returned unchanged so the caller
 * fails on it: the page is served at `/mcp` with no trailing slash, so the
 * browser would resolve `oak-ds/styles.css` against the parent and request
 * `/oak-ds/styles.css` — outside the routed surface, which is the MCP-509
 * defect exactly.
 */
function collectFirstPartyRefs(html: string, pageOrigin: string): string[] {
  const rawValues = [
    ...[...html.matchAll(SUBRESOURCE_TAG_PATTERN)]
      .map((match) => match[0] ?? '')
      .filter(isFetchedTag)
      .flatMap((tag) =>
        [...tag.matchAll(URL_ATTRIBUTE_PATTERN)].flatMap((attribute) =>
          splitCandidates(attribute[1] ?? ''),
        ),
      ),
    ...[...html.matchAll(META_IMAGE_PATTERN)].flatMap((match) => splitCandidates(match[1] ?? '')),
  ];

  const firstParty = rawValues.flatMap((value) => {
    if (value.startsWith('#') || value.startsWith('data:') || value.startsWith('mailto:')) {
      return [];
    }
    const ownPath = value.startsWith(pageOrigin) ? value.slice(pageOrigin.length) : value;
    if (/^(?:https?:)?\/\//.test(ownPath)) {
      return [];
    }
    // An own-origin reference to the site root normalises to '' — nothing is
    // fetched, so there is nothing to check.
    return ownPath === '' ? [] : [ownPath];
  });

  return [...new Set(firstParty)];
}

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
      getLandingPageHtml: () =>
        '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
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

  it('references every first-party subresource inside the routed surface, and serves each', async () => {
    // MCP-509. Under a path-scoped edge (the release-era `www` rule forwarded
    // only `/mcp` and `/mcp/*`) a root-relative reference never arrives here
    // at all — it stays on the fronting site and returns its 404 HTML, so the
    // page renders unstyled with no logo and no favicon while every request
    // this app *does* receive is healthy. The canonical `mcp.` host serves the
    // root too, but the page must render behind either edge shape.
    //
    // ONE test asserts both halves on ONE set, and that is the point. This
    // suite previously had two scrapes: one proved references resolve over
    // HTTP but was prefix-scoped to `/oak-ds/` and `/oak-assets/`, the other
    // checked the routed prefix across all subresources but never issued a
    // request. So `/favicons/*` and `/landing-page.css` — the exact two
    // families that 404'd in production — were prefix-checked and never
    // fetched. A singular-typo `/mcp/favicon/favicon.ico`, or dropping
    // `public/favicons/` from the deploy, passed both. Splitting the
    // invariant across two differently-scoped sets is what let the original
    // defect through; the fix is a single set carrying both assertions.
    const html = renderLandingPageHtml();

    // The page states its own origin, so the scrape classifies by origin
    // rather than by an exclusion list: see `collectFirstPartyRefs`.
    const pageOrigin = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    expect(pageOrigin, 'no canonical link — the scrape cannot classify references').toMatch(
      /^https?:\/\/\S+$/,
    );

    const refs = collectFirstPartyRefs(html, pageOrigin ?? '');

    // Per-KIND guard, not a bare count. `length > 0` only fires if every
    // subresource vanishes at once, so deleting the four favicon links while
    // two stylesheets remain would have kept this green — nothing anywhere in
    // the suite asserted a favicon is referenced at all. These counts are the
    // tripwire; a deliberate change to the page's asset set updates them.
    expect(
      refs.filter((ref) => ref.includes('/favicons/')),
      'the page stopped referencing its favicons',
    ).toHaveLength(4);
    expect(
      refs.filter((ref) => ref.endsWith('.css')).length,
      'the page stopped referencing a stylesheet',
    ).toBeGreaterThanOrEqual(2);
    expect(
      refs.filter((ref) => /\.(?:svg|png)$/.test(ref)).length,
      'the page stopped referencing its artwork',
    ).toBeGreaterThanOrEqual(3);

    const escaped = refs.filter((ref) => !ref.startsWith(`${ROUTED_ASSET_BASE}/`));
    expect(
      escaped,
      `these references sit outside ${ROUTED_ASSET_BASE}/ and 404 on the canonical host`,
    ).toEqual([]);

    for (const ref of refs) {
      const res = await request(app).get(ref).set('Host', 'localhost');
      expect(res.status, `${ref} is referenced but not served`).toBe(200);
    }
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

  it('still serves the unprefixed paths, so root-served deployments keep rendering', async () => {
    // Root-served deployments reach this app at `/` — the canonical host
    // does (verified 2026-09-01), and the legacy deployment host is a
    // declared compatibility surface (MCP-509 acceptance). Retiring the root
    // mount would break those pages silently.
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
          getLandingPageHtml: () =>
            '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
          staticRoot: emptyRoot,
        }),
      ).rejects.toThrow(/missing .*oak-ds/);
    } finally {
      await removeStaticRoot(emptyRoot);
    }
  });
});
