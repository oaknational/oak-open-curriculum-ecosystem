/**
 * Integration tests for the MCP host's `robots.txt` (MCP-703).
 *
 * The served text is pinned verbatim rather than compared against the module's
 * own constant — the module deliberately does not export it — because what a
 * reviewer needs to be able to read is the body a crawler receives, and a test
 * asserting `body === BODY` would ratify any future edit silently.
 *
 * Two properties are then asserted separately, over parsed directives rather
 * than raw bytes, because they are the ticket's acceptance conditions and the
 * verbatim block alone would not say which of its lines are load-bearing:
 * `/.well-known/` stays fetchable, and no Content Signals value is encoded.
 * The second is the one with forward value — it fires when a future author
 * adds a value *and* refreshes the pin.
 *
 * The last case is the one the pin cannot reach: whether the route is mounted
 * before Clerk. A predicate correct in isolation but registered after the auth
 * vendor would pass every assertion above and still 404 in production, which
 * is exactly what this path does today. It is described the way
 * `clerk-public-surface.integration.test.ts` describes the same property — a
 * spy standing in for global `clerkMiddleware` through the
 * `clerkMiddlewareFactory` seam (ADR-078).
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
    expect(res.text).toBe(EXPECTED_BODY);
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

    expect(res.status).toBe(200);
    expect(res.text).toBe(EXPECTED_BODY);
  });

  it('answers without the request ever reaching Clerk', async () => {
    const reachedClerk = vi.fn<(label: string) => void>();
    const app = await createTestApp({
      clerkMiddlewareFactory: (): RequestHandler => (req, _res, next) => {
        reachedClerk(`${req.method} ${req.path}`);
        next();
      },
    });

    const res = await request(app).get(ROBOTS_PATH);

    expect(res.status).toBe(200);
    expect(res.text).toBe(EXPECTED_BODY);
    expect(reachedClerk).not.toHaveBeenCalled();

    // Control probe: the spy must be capable of firing, or the assertion
    // above would pass against a middleware that never runs for any path and
    // would prove nothing about this one.
    await request(app).get('/not-an-exempt-path');
    expect(reachedClerk).toHaveBeenCalledWith('GET /not-an-exempt-path');
  });
});
