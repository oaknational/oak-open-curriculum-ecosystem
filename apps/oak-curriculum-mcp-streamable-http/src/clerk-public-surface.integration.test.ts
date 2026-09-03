/**
 * The `/mcp` page is public before auth exists in the chain (MCP-518).
 *
 * The web page at `/mcp` is fully public by owner ruling — absolutely anyone
 * may see it — while the MCP server on the same URL follows the coded OAuth
 * flow. The auth contract is therefore per-surface, and the surface fork has
 * to be the FIRST auth-relevant act rather than something that happens after
 * Clerk has already inspected the request.
 *
 * These cases are assembled through `createApp` with a spy standing in for
 * global `clerkMiddleware` (the `clerkMiddlewareFactory` seam, ADR-078), so
 * they describe the property that actually matters: whether a request reaches
 * Clerk at all. A predicate that were correct in isolation but mounted after
 * something that answers first would pass a unit test and fail here.
 *
 * The complement of each browser case is asserted in the same suite: the
 * protocol leg must still reach Clerk and must still answer an anonymous
 * request with the 401 challenge. A change that made the page public by
 * making the endpoint public would pass the first half and fail the second.
 */

import { describe, it, expect, vi } from 'vitest';
import type { Express, RequestHandler } from 'express';

import { request } from './test-helpers/loopback-request.js';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';
import { OAK_ASSETS_MARKER, OAK_DS_MARKER, ROUTED_ASSET_BASE } from './app/static-asset-paths.js';

/** What a browser sends on a document navigation. */
const BROWSER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

/** What a conformant MCP client sends on a protocol POST. */
const PROTOCOL_ACCEPT = 'application/json, text/event-stream';

/** The allow-listed Host these requests arrive on. */
const SERVED_HOST = 'localhost';

const CANONICAL_HOST = 'mcp.thenational.academy';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

/**
 * Clerk cookie state of a signed-in browser.
 *
 * `__client_uat` above zero is what tells Clerk a session exists, and it is
 * the shape of the MCP-517 synthetic probe that produced the user-visible
 * handshake redirect. Present on every browser case here: the contract is
 * that the page renders regardless of cookie state, so the cases carry the
 * state that used to break it rather than the state that never did.
 */
const SIGNED_IN_COOKIES = '__client_uat=1758000000; __session=not-a-real-token';

const FAKE_LANDING_PAGE_HTML =
  '<!doctype html><html lang="en-GB"><body>test landing page</body></html>';

/**
 * The header the real `clerkMiddleware` stamps on every response it handles.
 *
 * The double sets it too, which is what makes the header assertions below
 * discriminating: a fake that recorded the call but left the response alone
 * would let "no `x-clerk-*` headers on the public page" pass even if Clerk
 * ran on every request.
 */
const CLERK_STATUS_HEADER = 'x-clerk-auth-status';

interface Harness {
  readonly app: Express;
  /** Records every request that reached global Clerk middleware. */
  readonly reachedClerk: ReturnType<typeof createReachedClerkSpy>;
}

function createReachedClerkSpy() {
  return vi.fn<(label: string) => void>();
}

async function createHarness(env: Record<string, string> = {}): Promise<Harness> {
  const reachedClerk = createReachedClerkSpy();
  const clerkMiddleware: RequestHandler = (req, res, next) => {
    reachedClerk(`${req.method} ${req.path}`);
    res.setHeader(CLERK_STATUS_HEADER, 'signed-out');
    next();
  };

  const app = await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig: createMockRuntimeConfig({ env }),
    observability: createFakeHttpObservability(),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    getLandingPageHtml: () => FAKE_LANDING_PAGE_HTML,
    upstreamMetadata: TEST_UPSTREAM_METADATA,
    clerkMiddlewareFactory: () => clerkMiddleware,
  });

  return { app, reachedClerk };
}

/** Response header names Clerk adds when its middleware has run. */
function clerkHeaderNames(headers: Record<string, unknown>): string[] {
  return Object.keys(headers).filter((name) => name.toLowerCase().startsWith('x-clerk-'));
}

describe('the public /mcp surface never reaches Clerk (MCP-518)', () => {
  it('serves the page to a signed-in browser without Clerk seeing the request', async () => {
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get('/mcp')
      .set('Host', SERVED_HOST)
      .set('Accept', BROWSER_ACCEPT)
      .set('Sec-Fetch-Dest', 'document')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toBe(FAKE_LANDING_PAGE_HTML);
    expect(reachedClerk).not.toHaveBeenCalled();
  });

  it('answers the page with no auth-vendor headers and no cookie of its own', async () => {
    const { app } = await createHarness();

    const res = await request(app)
      .get('/mcp')
      .set('Host', SERVED_HOST)
      .set('Accept', BROWSER_ACCEPT)
      .set('Sec-Fetch-Dest', 'document')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(clerkHeaderNames(res.headers)).toStrictEqual([]);
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('serves the page rather than a redirect, whatever the cookie state', async () => {
    const { app, reachedClerk } = await createHarness();

    const cookieStates = ['', SIGNED_IN_COOKIES, '__client_uat=1; __session=malformed.jwt'];
    for (const cookie of cookieStates) {
      const res = await request(app)
        .get('/mcp')
        .set('Host', SERVED_HOST)
        .set('Accept', BROWSER_ACCEPT)
        .set('Sec-Fetch-Dest', 'document')
        .set('Cookie', cookie);

      expect(res.status, `cookie state ${JSON.stringify(cookie)} did not get the page`).toBe(200);
    }
    expect(reachedClerk).not.toHaveBeenCalled();
  });

  it('keeps Clerk off a document navigation whose Accept names no HTML type', async () => {
    // Handshake-eligible at the vendor on Sec-Fetch-Dest alone. The
    // negotiation does not serve it — the protocol gate refuses it — but it
    // must not be redirected into an auth handshake on the way there.
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get('/mcp')
      .set('Host', SERVED_HOST)
      .set('Accept', '*/*')
      .set('Sec-Fetch-Dest', 'document')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status).toBe(406);
    expect(reachedClerk).not.toHaveBeenCalled();
  });

  it("keeps Clerk off the page's own static assets under the routed base", async () => {
    const { app, reachedClerk } = await createHarness();

    for (const marker of [OAK_DS_MARKER, OAK_ASSETS_MARKER]) {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/${marker}`)
        .set('Host', SERVED_HOST)
        .set('Cookie', SIGNED_IN_COOKIES);

      expect(res.status, `${marker} was not served`).toBe(200);
      expect(clerkHeaderNames(res.headers)).toStrictEqual([]);
    }
    expect(reachedClerk).not.toHaveBeenCalled();
  });
});

/**
 * The same surface reached by a case variant of its path (MCP-518 review).
 *
 * Express matches routes and mounts case-insensitively by default, so `/MCP`
 * is served by the same handlers as `/mcp`. These cases probe the assembled
 * app rather than the predicate: the question is not "would the predicate
 * skip" but "did the built app answer without the auth vendor ever running",
 * which is the only form in which the bypass was observable.
 */
describe('case variants of the public /mcp surface never reach Clerk (MCP-518)', () => {
  const PAGE_VARIANTS = ['/MCP', '/Mcp', '/MCP/'];

  it.each(PAGE_VARIANTS)('serves %s as the page with no auth vendor involved', async (path) => {
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get(path)
      .set('Host', SERVED_HOST)
      .set('Accept', BROWSER_ACCEPT)
      .set('Sec-Fetch-Dest', 'document')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status, `${path} did not serve the page`).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toBe(FAKE_LANDING_PAGE_HTML);
    // The three observable faces of the defect: the redirect, the vendor's
    // headers, and the vendor having run at all.
    expect(res.status).not.toBe(307);
    expect(clerkHeaderNames(res.headers)).toStrictEqual([]);
    expect(reachedClerk).not.toHaveBeenCalled();
  });

  it('keeps Clerk on protocol traffic addressed to a case variant', async () => {
    // The complement: normalising the skip comparisons must not hand the
    // protocol leg a way to arrive without auth context.
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .post('/MCP')
      .set('Host', SERVED_HOST)
      .set('Accept', PROTOCOL_ACCEPT)
      .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

    expect(res.status).toBe(401);
    expect(reachedClerk).toHaveBeenCalledWith('POST /MCP');
  });

  it('refuses to skip an upper-cased stream media type, and the gate still refuses it', async () => {
    // The safety hinge of the whole fork, and the one place the two
    // case rules deliberately disagree. The skip predicate matches
    // `text/event-stream` case-INsensitively while the accept gate matches it
    // case-sensitively, so an upper-cased Accept is refused by both: Clerk
    // stays on, and the gate answers 406 rather than letting it through.
    // Erring wide in the predicate can only ever leave auth switched on.
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get('/mcp')
      .set('Host', SERVED_HOST)
      .set('Accept', 'TEXT/EVENT-STREAM')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status).toBe(406);
    expect(reachedClerk).toHaveBeenCalledWith('GET /mcp');
  });

  it("keeps Clerk off a mixed-case fetch of the page's own stylesheet", async () => {
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get(`${ROUTED_ASSET_BASE}/${OAK_DS_MARKER}`.toUpperCase())
      .set('Host', SERVED_HOST)
      .set('Accept', 'text/css,*/*;q=0.1')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(clerkHeaderNames(res.headers)).toStrictEqual([]);
    expect(reachedClerk).not.toHaveBeenCalled();
  });
});

/**
 * The root landing page (MCP-518 review).
 *
 * `GET /` serves the identical baked artefact. The owner ruling is about the
 * page, not about one of its URLs, so the fork covers both doors — and on a
 * root-served deployment, the canonical host included, `/` is the front one.
 */
describe('the root landing page never reaches Clerk (MCP-518)', () => {
  it('serves / to a signed-in browser without Clerk seeing the request', async () => {
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get('/')
      .set('Host', SERVED_HOST)
      .set('Accept', BROWSER_ACCEPT)
      .set('Sec-Fetch-Dest', 'document')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status).toBe(200);
    expect(res.text).toBe(FAKE_LANDING_PAGE_HTML);
    expect(res.status).not.toBe(307);
    expect(clerkHeaderNames(res.headers)).toStrictEqual([]);
    expect(res.headers['set-cookie']).toBeUndefined();
    expect(reachedClerk).not.toHaveBeenCalled();
  });

  it('tells intermediaries that / now varies by Accept and may not be stored', async () => {
    // Whether the auth vendor runs on this URL — and so whether the response
    // carries its headers — became Accept-dependent when the fork reached `/`.
    // The same two directives its `/mcp` twin sets are what stop a cache from
    // pairing one request's answer with another's.
    const { app } = await createHarness();

    const res = await request(app)
      .get('/')
      .set('Host', SERVED_HOST)
      .set('Accept', BROWSER_ACCEPT)
      .set('Sec-Fetch-Dest', 'document');

    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.headers['vary']).toMatch(/Accept/i);
  });

  it("keeps Clerk off the root-mounted copy of the page's static assets", async () => {
    const { app, reachedClerk } = await createHarness();

    for (const marker of [OAK_DS_MARKER, OAK_ASSETS_MARKER]) {
      const res = await request(app)
        .get(`/${marker}`)
        .set('Host', SERVED_HOST)
        .set('Cookie', SIGNED_IN_COOKIES);

      expect(res.status, `/${marker} was not served`).toBe(200);
      expect(clerkHeaderNames(res.headers)).toStrictEqual([]);
    }
    expect(reachedClerk).not.toHaveBeenCalled();
  });
});

/**
 * The routed health path is public too (MCP-580).
 *
 * It shares the `/mcp` prefix and nothing else: it is the only health path the
 * canonical host can reach, so it is the sole probe that measures the surface
 * users actually hit. Clerk must not be in that path — a liveness check that
 * depends on the auth vendor reports the vendor, and a browser-shaped GET that
 * Clerk observes is handshake-eligible at the vendor (MCP-517/MCP-518).
 *
 * Asserted through the assembled app rather than the skip predicate, for the
 * reason this file's header gives. It has to be here specifically: drop the
 * routed entry from `CLERK_SKIP_PATHS` and the in-process health suite stays
 * green, because that suite boots with auth disabled and no Clerk at all. Only
 * this harness can see the vendor run.
 */
describe('the routed health path never reaches Clerk (MCP-580)', () => {
  const ROUTED_HEALTH = '/mcp/healthz';

  it('answers a monitor-shaped poll without Clerk seeing the request', async () => {
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get(ROUTED_HEALTH)
      .set('Host', SERVED_HOST)
      .set('Accept', '*/*')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(clerkHeaderNames(res.headers)).toStrictEqual([]);
    expect(reachedClerk).not.toHaveBeenCalled();
  });

  it('keeps Clerk off a browser-shaped poll, which is the handshake-eligible shape', async () => {
    // Belt and braces, and the two are worth distinguishing: this shape is also
    // covered by the public-page-surface fork (any `/mcp/*` path plus browser
    // headers), so removing the routed entry from `CLERK_SKIP_PATHS` leaves this
    // case green while the two either side of it go red. Kept because a monitor
    // configured with a browser Accept must get JSON and no redirect regardless
    // of which of the two mechanisms is carrying it.
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get(ROUTED_HEALTH)
      .set('Host', SERVED_HOST)
      .set('Accept', BROWSER_ACCEPT)
      .set('Sec-Fetch-Dest', 'document')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status).toBe(200);
    expect(res.status).not.toBe(307);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(reachedClerk).not.toHaveBeenCalled();
  });

  it('keeps Clerk off the HEAD verb a monitor may be configured for', async () => {
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .head(ROUTED_HEALTH)
      .set('Host', SERVED_HOST)
      .set('Accept', '*/*')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status).toBe(200);
    expect(reachedClerk).not.toHaveBeenCalled();
  });
});

describe('the MCP protocol leg still reaches Clerk (MCP-518)', () => {
  it('routes a conformant protocol POST through Clerk', async () => {
    const { app, reachedClerk } = await createHarness();

    await request(app)
      .post('/mcp')
      .set('Host', SERVED_HOST)
      .set('Accept', PROTOCOL_ACCEPT)
      .set('Cookie', SIGNED_IN_COOKIES)
      .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

    expect(reachedClerk).toHaveBeenCalledWith('POST /mcp');
  });

  it('still answers an unauthenticated protocol POST with the 401 challenge', async () => {
    const { app } = await createHarness({ CANONICAL_HOST });

    const res = await request(app)
      .post('/mcp')
      .set('Host', SERVED_HOST)
      .set('Accept', PROTOCOL_ACCEPT)
      .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

    expect(res.status).toBe(401);
    expect(res.headers['www-authenticate']).toContain(
      `resource_metadata="${CANONICAL_ORIGIN}/.well-known/oauth-protected-resource/mcp"`,
    );
    // The same response proves Clerk was in the chain, so the challenge is
    // the auth-enabled one rather than a bypass that happens to 401.
    expect(res.headers[CLERK_STATUS_HEADER]).toBe('signed-out');
  });

  it('classifies a protocol GET as protocol (Clerk observes) and refuses it 405', async () => {
    // The one shape that is browser-ish and protocol-ish at once. The
    // protocol leg wins — the global surface fork still routes it through
    // Clerk, so the browser skip is not a classification escape — and the
    // protocol leg's terminal answer is the 405 stream refusal (MCP-545):
    // no GET reaches the MCP handler at all. The refusal contract is
    // identity-invariant at the ROUTE level (status, Allow, body); Clerk's
    // global observation still stamps its own response headers per the
    // MCP-518 fork, so whole-response identity-independence is NOT claimed.
    const { app, reachedClerk } = await createHarness();

    const res = await request(app)
      .get('/mcp')
      .set('Host', SERVED_HOST)
      .set('Accept', 'text/html, text/event-stream')
      .set('Sec-Fetch-Dest', 'document')
      .set('Cookie', SIGNED_IN_COOKIES);

    expect(res.status).toBe(405);
    expect(res.headers['allow']).toBe('POST');
    expect(reachedClerk).toHaveBeenCalledWith('GET /mcp');
  });

  it('answers an unauthenticated protocol GET with the 405 refusal, not the 401 challenge', async () => {
    // Deliberate posture (MCP-545): the route-level auth leg is gone from
    // the GET mount, so an anonymous GET draws the same terminal 405
    // (status, Allow, body) as a signed-in one — a 401 on a method that
    // can never succeed would only invite a token retry into the same
    // refusal. The global surface fork still observes the request and may
    // stamp its own headers (MCP-518); what must be absent is the
    // challenge.
    const { app } = await createHarness();

    const res = await request(app)
      .get('/mcp')
      .set('Host', SERVED_HOST)
      .set('Accept', PROTOCOL_ACCEPT);

    expect(res.status).toBe(405);
    expect(res.headers['allow']).toBe('POST');
    expect(res.headers['www-authenticate']).toBeUndefined();
    // Body pinned in the auth-ENABLED variant too: the two registration
    // modes mount the refusal at separate call sites, and only a shared
    // envelope pin catches one of them drifting to a different handler.
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toStrictEqual({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed.' },
      id: null,
    });
  });
});
