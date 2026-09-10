/**
 * Integration tests for the MCP host's `robots.txt` (MCP-703).
 *
 * The served text is pinned verbatim in ONE case rather than compared against
 * the module's own constant — the module deliberately does not export it —
 * because what a reviewer needs to be able to read is the body a crawler
 * receives, and a test asserting `body === BODY` would ratify any future edit
 * silently. The other cases assert their own property and nothing more, so a
 * body edit produces one failure naming the criterion rather than three
 * naming none.
 *
 * Two properties are then asserted separately, over parsed directives rather
 * than raw bytes, because they are the ticket's acceptance conditions and the
 * verbatim block alone would not say which of its lines are load-bearing:
 * `/.well-known/` stays fetchable, and no Content Signals value is encoded.
 * The second is the one with forward value — it fires when a future author
 * adds a value *and* refreshes the pin.
 *
 * ## What the Clerk-spy case does and does not measure
 *
 * It measures that the request never reaches the auth vendor: a spy stands in
 * for global `clerkMiddleware` through the `clerkMiddlewareFactory` seam
 * (ADR-078) and must not be called, with an in-band control probe so the
 * negative cannot pass vacuously. That is worth pinning — the live 404 at this
 * path today is answered by Clerk.
 *
 * It does NOT measure registration order, and it cannot attribute the result
 * to either mechanism, because TWO independent things keep the auth vendor out
 * of this path and either alone is sufficient: the route is registered before
 * `clerkMiddleware` (so the handler responds and never calls `next()`), and
 * `/robots.txt` is in `CLERK_SKIP_PATHS` (so the conditional wrapper returns
 * before calling the injected handler). Measured on review (MCP-703), each
 * varied on its own from the shipped configuration:
 *
 * - registration moved after the global auth phase, skip entry kept — all six
 *   cases pass;
 * - skip entry removed, registration kept before Clerk — all six cases pass;
 * - both removed together — three cases fail.
 *
 * So this case pins the property "the request never reaches the auth vendor",
 * which is the one worth pinning: the live 404 here today is answered by
 * Clerk. It is not a mount-order assertion, and reading it as one would be
 * reading a conjunction as one of its terms. Order is a product-code invariant
 * asserted by the module docblock and `docs/middleware-chain.md`; the
 * falsifiable check on it is the production `curl` for absent
 * `x-clerk-auth-*` headers, recorded on the PR.
 */
import { describe, it, expect, vi } from 'vitest';
import type { RequestHandler } from 'express';
import { request } from './test-helpers/loopback-request.js';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';

const ROBOTS_PATH = '/robots.txt';

/**
 * The directive lines only, comments and blanks dropped.
 *
 * Written because the first draft of the no-sitemap assertion matched the
 * file's own explanatory comment: under RFC 9309 §2.2 a line beginning `#` is
 * a comment and no parser reads a directive out of it, so a raw-substring
 * assertion measures the wrong artefact. What the ticket's acceptance
 * conditions are about is the rules a crawler obeys.
 */
const directivesOf = (body: string): readonly string[] =>
  body
    .split('\n')
    .map((line) => line.split('#')[0]?.trim() ?? '')
    .filter((line) => line.length > 0);

/** The body a crawler receives, as reviewed on MCP-703. */
const EXPECTED_BODY = `# Oak National Academy Model Context Protocol server. A machine surface:
# the MCP endpoint, its OAuth authorisation proxy, the discovery documents,
# and one landing page describing them with its own assets. Oak curriculum
# pages written for people are on https://www.thenational.academy.
#
# No Sitemap: this host publishes no crawlable page set. The /.well-known/
# documents are allowed explicitly because that is how clients discover
# this server and authorise against it.

User-agent: *
Allow: /.well-known/
Disallow: /oauth/
Disallow: /assets/download/
Disallow: /healthz
Disallow: /mcp/healthz
`;

interface HarnessOptions {
  readonly dangerouslyDisableAuth?: boolean;
  readonly clerkMiddlewareFactory?: () => RequestHandler;
}

const createTestApp = async (options: HarnessOptions = {}) =>
  await createApp({
    staticRoot: await getScratchStaticRoot(),
    // Branched rather than ternary: the two overloads of
    // `createMockRuntimeConfig` discriminate on the literal `true`, and a
    // union-typed argument matches neither.
    runtimeConfig:
      options.dangerouslyDisableAuth === true
        ? createMockRuntimeConfig({ dangerouslyDisableAuth: true })
        : createMockRuntimeConfig(),
    observability: createFakeHttpObservability(),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    getLandingPageHtml: () =>
      '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
    upstreamMetadata: TEST_UPSTREAM_METADATA,
    ...(options.clerkMiddlewareFactory === undefined
      ? {}
      : { clerkMiddlewareFactory: options.clerkMiddlewareFactory }),
  });

describe('robots.txt (Integration)', () => {
  it('answers an unauthenticated GET with the reviewed body as text/plain', async () => {
    const app = await createTestApp();

    const res = await request(app).get(ROBOTS_PATH);

    expect(res.status).toBe(200);
    expect(res.type).toBe('text/plain');
    expect(
      res.text,
      'the crawler-facing body is reviewed text (MCP-703): an edit to it must be restated here, so it is read again rather than ratified silently',
    ).toBe(EXPECTED_BODY);
  });

  it('carries nosniff, so it cannot be moved ahead of the security headers unnoticed', async () => {
    const app = await createTestApp();

    const res = await request(app).get(ROBOTS_PATH);

    // This is now the earliest public handler on the host. The shared
    // pre-auth phase this lane sketches would register it earlier still, and
    // registering it ahead of helmet would strip the security headers from a
    // public response with nothing else here to notice.
    expect(
      res.headers['x-content-type-options'],
      'robots.txt must still be served through the helmet security-headers middleware',
    ).toBe('nosniff');
  });

  it('keeps the discovery documents fetchable and names no sitemap', async () => {
    const app = await createTestApp();

    const res = await request(app).get(ROBOTS_PATH);

    // Under RFC 9309 §2.2.2 the longest matching rule wins, so this Allow
    // survives any later Disallow that would otherwise swallow /.well-known/.
    const directives = directivesOf(res.text);
    expect(directives).toContain('Allow: /.well-known/');
    expect(directives.filter((line) => line.startsWith('Disallow: /.well-known'))).toEqual([]);
    expect(directives).not.toContain('Disallow: /');
    // No sitemap, because this host publishes no crawlable page set.
    expect(directives.filter((line) => line.startsWith('Sitemap'))).toEqual([]);
  });

  it('encodes no Content Signals values, which are AR-A7 and undecided here', async () => {
    const app = await createTestApp();

    const res = await request(app).get(ROBOTS_PATH);

    // The values are an editorial and legal decision for this host, and
    // `open-api` already publishes its own set — cross-host consistency is
    // part of that decision, not something this baseline file settles.
    const directives = directivesOf(res.text).join('\n');
    expect(directives).not.toContain('Content-Signal');
    expect(directives).not.toContain('ai-train');
    expect(directives).not.toContain('ai-input');
    expect(directives).not.toContain('search=');
  });

  it('serves the file when auth is disabled, since it is not an OAuth surface', async () => {
    const app = await createTestApp({ dangerouslyDisableAuth: true });

    const res = await request(app).get(ROBOTS_PATH);

    // The property is that the route exists in this mode at all — it is
    // registered outside the auth-enabled branch of `setupOAuthAndCaching`.
    // The body itself is pinned once, above.
    expect(res.status).toBe(200);
    expect(res.type).toBe('text/plain');
    expect(directivesOf(res.text)).toContain('User-agent: *');
  });

  it('answers without the request ever reaching the auth vendor', async () => {
    const reachedClerk = vi.fn<(label: string) => void>();
    const app = await createTestApp({
      clerkMiddlewareFactory: (): RequestHandler => (req, _res, next) => {
        reachedClerk(`${req.method} ${req.path}`);
        next();
      },
    });

    const res = await request(app).get(ROBOTS_PATH);

    expect(res.status).toBe(200);
    expect(
      reachedClerk,
      'a crawler carries no credentials, so this response must be produced without the auth vendor in the path',
    ).not.toHaveBeenCalled();

    // Control probe: the spy must be capable of firing, or the assertion
    // above would pass against a middleware that never runs for any path and
    // would prove nothing about this one.
    await request(app).get('/not-an-exempt-path');
    expect(reachedClerk).toHaveBeenCalledWith('GET /not-an-exempt-path');
  });
});
