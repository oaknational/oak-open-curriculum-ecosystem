import type { RuntimeConfig } from '../../src/runtime-config.js';

/**
 * Creates a mock RuntimeConfig for E2E tests.
 *
 * @param overrides - Optional partial config to override defaults
 * @returns A complete RuntimeConfig with test-appropriate values
 */
export function createMockRuntimeConfig(overrides?: Partial<RuntimeConfig>): RuntimeConfig {
  // Destructure env separately to avoid it being overwritten by the spread
  const { env: envOverrides, ...restOverrides } = overrides ?? {};

  return {
    dangerouslyDisableAuth: false,
    useStubTools: false,
    version: '0.0.0-test',
    vercelHostnames: [],
    ...restOverrides,
    env: {
      OAK_API_KEY: 'mock-oak-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_mock',
      CLERK_SECRET_KEY: 'sk_test_mock',
      LOG_LEVEL: 'error',
      NODE_ENV: 'test',
      ...envOverrides,
    },
  };
}
