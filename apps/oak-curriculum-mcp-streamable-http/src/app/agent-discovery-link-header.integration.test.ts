/**
 * Integration tests for the agent-discovery `Link` response header (MCP-734).
 *
 * The subject is the **served response**, not the constant: an agent learns
 * what this host offers by reading a header off the wire, so that is what
 * these cases describe. The second case is the one that matters most — it
 * follows the advertised target and requires a 200, so the suite fails if the
 * header ever names a document this app does not serve.
 *
 * The first two cases run the **auth-enabled** configuration, because that is
 * the one that serves the advertised document and the one production runs:
 * `registerUnauthenticatedRoutes` mounts `/mcp` alone and registers no OAuth
 * metadata, so an auth-disabled app would have proved the link against a
 * surface no deployment has. The third case uses the auth-disabled app
 * deliberately — its subject is route-independence, and disabling auth keeps
 * Clerk off a path that is on no skip list.
 *
 * Contract source: RFC 8288 (Web Linking). The agent-readiness scanner at
 * `isitagentready.com` fetches `GET /` and parses this header; its accepted
 * relations are `api-catalog`, `service-desc`, `service-doc` and
 * `describedby` (read 2026-09-14 from its published link-headers skill).
 */
import { describe, it, expect } from 'vitest';

import { request } from '../test-helpers/loopback-request.js';
import { createApp } from '../application.js';
import { createFakeHttpObservability } from '../test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from '../test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from '../test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from '../test-helpers/static-root-fixture.js';

/** What the readiness scanner sends when it fetches the root. */
const SCANNER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

const ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';

const EXPECTED_LINK =
  '</.well-known/oauth-protected-resource>; rel="describedby"; ' +
  'type="application/json"; title="OAuth 2.0 protected resource metadata"';

/**
 * Pulls the angle-bracketed target out of an RFC 8288 field-value, so the
 * suite follows the link the header actually publishes rather than a path
 * restated here.
 *
 * @remarks
 * Total rather than throwing (ADR-088 bans `throw`): an unparsable header
 * yields a path nothing serves, so the caller's 200 expectation fails and
 * names the unparsable value in its diff — the same diagnosis, without an
 * error invisible to the type system.
 */
function linkTarget(headerValue: unknown): string {
  const match = typeof headerValue === 'string' ? /^<([^>]+)>/.exec(headerValue) : null;
  return match?.[1] ?? `/link-header-had-no-parsable-target:${String(headerValue)}`;
}

const baseOptions = async () => ({
  staticRoot: await getScratchStaticRoot(),
  observability: createFakeHttpObservability(),
  getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
  upstreamMetadata: TEST_UPSTREAM_METADATA,
});

describe('agent-discovery Link header (Integration)', () => {
  /** The production shape: auth enabled, so the OAuth metadata is mounted. */
  const createAuthEnabledApp = async () =>
    await createApp({
      ...(await baseOptions()),
      runtimeConfig: createMockRuntimeConfig({ env: { ALLOWED_HOSTS } }),
    });

  const createAuthDisabledApp = async () =>
    await createApp({
      ...(await baseOptions()),
      runtimeConfig: createMockRuntimeConfig({
        dangerouslyDisableAuth: true,
        env: { ALLOWED_HOSTS },
      }),
    });

  it('advertises the protected-resource metadata with a describedby relation on the root', async () => {
    const app = await createAuthEnabledApp();

    const res = await request(app).get('/').set('Host', 'localhost').accept(SCANNER_ACCEPT);

    expect(res.headers.link).toBe(EXPECTED_LINK);
  });

  it('advertises a target this app actually serves, so the link never points at a 404', async () => {
    const app = await createAuthEnabledApp();

    const advertised = await request(app).get('/').set('Host', 'localhost').accept(SCANNER_ACCEPT);
    const followed = await request(app)
      .get(linkTarget(advertised.headers.link))
      .set('Host', 'localhost');

    expect(followed.status).toBe(200);
    expect(followed.type).toBe('application/json');
    expect(followed.body.resource).toBe('http://localhost/mcp');
  });

  it('carries the header on a path with no route, so it does not depend on the root', async () => {
    const app = await createAuthDisabledApp();

    const res = await request(app).get('/no-route-is-mounted-here').set('Host', 'localhost');

    expect(res.status).toBe(404);
    expect(res.headers.link).toBe(EXPECTED_LINK);
  });
});
