/**
 * The staleness pin for the MCP Registry entry.
 *
 * @remarks
 * A registry entry is a promise to clients that browse: they reach this app
 * at the address the entry names and have no other way to find it. So the
 * check here is not that the document is well formed — the unit suite does
 * that — but that the endpoint it advertises is the endpoint this app,
 * booted for real and asked over HTTP, says it serves.
 *
 * The measurement is the RFC 9728 protected-resource `resource` value,
 * because that is the app's own answer to *"what endpoint am I?"* and the
 * string a client binds its token audience to. Both sides trace back to
 * `resolveServedMcpUrl`, but they arrive by different routes: the document
 * through `resolveServerJsonInputs`, the served value through `createApp`,
 * the Express route and the composed metadata document. A future change to
 * how this app names its own address therefore fails here rather than
 * publishing a lie (MCP-637).
 *
 * Requests arrive with a NON-canonical Host, which is the edge-served shape
 * (`canonical-origin.ts`): a configured canonical origin must not consult the
 * arriving Host, and a publication built off the wrong one would be exactly
 * the drift this test exists to catch.
 */

import { describe, expect, it } from 'vitest';
import { unwrap, unwrapErr } from '@oaknational/result';

import { createApp } from '../application.js';
import { createMockRuntimeConfig } from '../test-helpers/auth-error-test-helpers.js';
import { createFakeHttpObservability } from '../test-helpers/observability-fakes.js';
import { getScratchStaticRoot } from '../test-helpers/static-root-fixture.js';
import { request } from '../test-helpers/loopback-request.js';
import { TEST_UPSTREAM_METADATA } from '../test-helpers/upstream-metadata-fixture.js';
import { readServedResource } from './registry-validation.js';
import { resolveServerJsonInputs } from './server-json-inputs.js';
import { assertRemoteMatchesServedResource, buildServerJsonDocument } from './server-json.js';

const CANONICAL_HOST = 'mcp.thenational.academy';

/** The Host the Cloudflare edge presents to the origin. */
const EDGE_ORIGIN_HOST = 'origin.example.com';

/** The namespace under test; the pin holds for either candidate. */
const NAMESPACE = 'io.github.oaknational';

/** The version branch that keeps the composition off the filesystem. */
const VERSION = '1.179.0';

/** The catalogue line a publication supplies; not what this test proves. */
const DESCRIPTION = 'Search, explore and download Oak curriculum resources for KS1 to KS4.';

/** Composes the document exactly as a publication for this host would. */
function composeEntryFor(canonicalHost: string) {
  return unwrap(
    buildServerJsonDocument(
      unwrap(
        resolveServerJsonInputs({
          MCP_REGISTRY_NAMESPACE: NAMESPACE,
          MCP_REGISTRY_DESCRIPTION: DESCRIPTION,
          CANONICAL_HOST: canonicalHost,
          APP_VERSION_OVERRIDE: VERSION,
        }),
      ),
    ),
  );
}

/** Reads the app's own answer to "what endpoint am I?" over HTTP. */
async function readAppsOwnResource(canonicalHost: string): Promise<string> {
  const app = await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig: createMockRuntimeConfig({ env: { CANONICAL_HOST: canonicalHost } }),
    observability: createFakeHttpObservability(),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    getLandingPageHtml: () =>
      '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
    upstreamMetadata: TEST_UPSTREAM_METADATA,
  });

  const res = await request(app)
    .get('/.well-known/oauth-protected-resource/mcp')
    .set('Host', EDGE_ORIGIN_HOST);

  expect(res.status).toBe(200);
  return unwrap(readServedResource(res.body));
}

describe('MCP Registry entry against the served app (MCP-637)', () => {
  it('advertises the endpoint the app serves as its protected resource', async () => {
    const servedResource = await readAppsOwnResource(CANONICAL_HOST);
    const document = composeEntryFor(CANONICAL_HOST);

    expect(unwrap(assertRemoteMatchesServedResource(document, servedResource))).toBe(document);
    expect(document.remotes[0]?.url).toBe(`https://${CANONICAL_HOST}/mcp`);
  });

  it('refuses an entry composed for a different host than the deployment serves', async () => {
    const servedResource = await readAppsOwnResource(CANONICAL_HOST);
    const staleDocument = composeEntryFor('www.thenational.academy');

    expect(unwrapErr(assertRemoteMatchesServedResource(staleDocument, servedResource))).toContain(
      'does not claim',
    );
  });
});
