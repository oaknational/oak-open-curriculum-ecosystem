import { unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { Env } from './env.js';
import { createRuntimeConfigFromValidatedEnv } from './runtime-config-from-validated-env.js';
import { buildClerkMiddlewareOptions } from './global-auth-context.js';

const authEnabledBase = {
  OAK_API_KEY: 'test-api-key',
  ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
  ELASTICSEARCH_API_KEY: 'test-es-key',
  CLERK_PUBLISHABLE_KEY: 'pk_test_123',
  CLERK_SECRET_KEY: 'sk_test_123',
  LOG_LEVEL: 'info',
  SENTRY_MODE: 'off',
  APP_VERSION_OVERRIDE: '1.2.3-test',
} satisfies Env;

describe('buildClerkMiddlewareOptions (Guard 1c)', () => {
  it('carries the Clerk keys from runtime config', () => {
    const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(authEnabledBase));

    const options = buildClerkMiddlewareOptions(runtimeConfig);

    expect(options.publishableKey).toBe('pk_test_123');
    expect(options.secretKey).toBe('sk_test_123');
  });

  it('omits authorizedParties entirely when no origins are configured', () => {
    const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(authEnabledBase));

    const options = buildClerkMiddlewareOptions(runtimeConfig);

    // Absent — not an empty array. Both are allow-all at Clerk's boundary, but
    // omitting reads as "not configured" rather than an intentional empty
    // allowlist, and keeps the seam a true no-op until the owner sets a value.
    expect('authorizedParties' in options).toBe(false);
  });

  it('includes the configured origins as authorizedParties when set', () => {
    const runtimeConfig = unwrap(
      createRuntimeConfigFromValidatedEnv({
        ...authEnabledBase,
        CLERK_AUTHORIZED_PARTIES:
          'https://www.thenational.academy, https://labs.thenational.academy',
      }),
    );

    const options = buildClerkMiddlewareOptions(runtimeConfig);

    expect(options.authorizedParties).toEqual([
      'https://www.thenational.academy',
      'https://labs.thenational.academy',
    ]);
  });
});
