/**
 * Integration test verifying the app wires all three rate limiter profiles
 * via the injected {@link RateLimiterFactory}.
 */
import { describe, it, expect } from 'vitest';
import { unwrap } from '@oaknational/result';

import { createApp } from '../application.js';
import { createFakeRateLimiterFactory } from '../test-helpers/rate-limiter-fakes.js';
import { createHttpObservabilityOrThrow } from '../observability/http-observability.js';
import { loadRuntimeConfig } from '../runtime-config.js';
import { TEST_UPSTREAM_METADATA } from '../../e2e-tests/helpers/upstream-metadata-fixture.js';
import { MCP_RATE_LIMIT, OAUTH_RATE_LIMIT, ASSET_RATE_LIMIT } from './rate-limit-profiles.js';

function createTestRuntimeConfig() {
  const result = loadRuntimeConfig({
    processEnv: {
      NODE_ENV: 'test',
      OAK_API_KEY: 'test-api-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_dGVzdC1pbnN0YW5jZS5jbGVyay5hY2NvdW50cy5kZXYk',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key',
      ALLOWED_HOSTS: 'localhost,127.0.0.1',
    },
    startDir: process.cwd(),
  });
  return unwrap(result);
}

describe('rate limiter DI wiring', () => {
  it('calls the factory three times with the MCP, OAuth, and asset profiles', async () => {
    const { factory, calls } = createFakeRateLimiterFactory();
    const runtimeConfig = createTestRuntimeConfig();
    const observability = createHttpObservabilityOrThrow(runtimeConfig);

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
