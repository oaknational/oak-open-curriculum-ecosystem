/**
 * Integration tests for the OpenAI domain-verification challenge (MCP-700).
 *
 * Contract source: https://developers.openai.com/plugins/deploy/submission,
 * section "Domain verification", read 2026-09-09. The portal fetches
 * `https://<mcp-host>/.well-known/openai-apps-challenge` and "the challenge
 * endpoint must return only that plugin's verification token. Do not return
 * JSON, a list of tokens, or multiple tokens from the same URL." The page
 * names no method, content type, status code or caching rule; this server
 * answers GET with 200, `text/plain`, and the bare token.
 */
import { describe, it, expect } from 'vitest';
import { request } from './test-helpers/loopback-request.js';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';

const CHALLENGE_PATH = '/.well-known/openai-apps-challenge';

/** The token the plugin submission portal issued, recorded on MCP-700. */
const EXPECTED_TOKEN = 'zc9V349cLHm9igIbhHavPlwHsEuWnBD7Hzbp0hTi75g';

describe('OpenAI domain-verification challenge (Integration)', () => {
  const createTestApp = async (dangerouslyDisableAuth = false) => {
    const runtimeConfig = dangerouslyDisableAuth
      ? createMockRuntimeConfig({ dangerouslyDisableAuth: true })
      : createMockRuntimeConfig();
    return await createApp({
      staticRoot: await getScratchStaticRoot(),
      runtimeConfig,
      observability: createFakeHttpObservability(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      getLandingPageHtml: () =>
        '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
      upstreamMetadata: TEST_UPSTREAM_METADATA,
    });
  };

  it('answers an unauthenticated GET with the bare token as text/plain', async () => {
    const app = await createTestApp();

    const res = await request(app).get(CHALLENGE_PATH);

    expect(res.status).toBe(200);
    expect(res.type).toBe('text/plain');
    expect(res.text).toBe(EXPECTED_TOKEN);
  });

  it('serves the token when auth is disabled, since it is not an OAuth surface', async () => {
    const app = await createTestApp(true);

    const res = await request(app).get(CHALLENGE_PATH);

    expect(res.status).toBe(200);
    expect(res.text).toBe(EXPECTED_TOKEN);
  });
});
