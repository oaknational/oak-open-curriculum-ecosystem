/**
 * Integration test verifying the app wires all three rate limiter profiles
 * via the injected {@link RateLimiterFactory}.
 */
import { describe, it, expect } from 'vitest';

import { createApp } from '../application.js';
import { createFakeRateLimiterFactory } from '../test-helpers/rate-limiter-fakes.js';
import { createFakeHttpObservability } from '../test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from '../test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from '../../e2e-tests/helpers/upstream-metadata-fixture.js';
import { MCP_RATE_LIMIT, OAUTH_RATE_LIMIT, ASSET_RATE_LIMIT } from './rate-limit-profiles.js';

function createTestRuntimeConfig() {
  return createMockRuntimeConfig({ env: { ALLOWED_HOSTS: 'localhost,127.0.0.1' } });
}

describe('rate limiter DI wiring', () => {
  it('calls the factory three times with the MCP, OAuth, and asset profiles', async () => {
    const { factory, calls } = createFakeRateLimiterFactory();
    const runtimeConfig = createTestRuntimeConfig();
    const observability = createFakeHttpObservability();

    await createApp({
      runtimeConfig,
      observability,
      upstreamMetadata: TEST_UPSTREAM_METADATA,
      rateLimiterFactory: factory,
      getWidgetHtml: () => '<html><body>test</body></html>',
    });

    expect(calls).toHaveLength(3);

    const optionsList = calls.map((c) => c.options);
    expect(optionsList).toContainEqual(MCP_RATE_LIMIT);
    expect(optionsList).toContainEqual(OAUTH_RATE_LIMIT);
    expect(optionsList).toContainEqual(ASSET_RATE_LIMIT);
  });
});
