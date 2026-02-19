import type {
  AuthDisabledRuntimeConfig,
  AuthEnabledRuntimeConfig,
  RuntimeConfig,
} from '../../src/runtime-config.js';

/**
 * Creates a mock RuntimeConfig for E2E tests.
 *
 * When `dangerouslyDisableAuth` is true, Clerk keys are omitted.
 * When false (or not specified), Clerk keys are included.
 *
 * @param overrides - Optional partial config to override defaults
 * @returns A complete RuntimeConfig with test-appropriate values
 */
export function createMockRuntimeConfig(
  overrides?: Partial<RuntimeConfig>,
): AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig {
  const { env: envOverrides, dangerouslyDisableAuth, ...restOverrides } = overrides ?? {};

  const shared = {
    useStubTools: false,
    version: '0.0.0-test',
    vercelHostnames: [],
    ...restOverrides,
  };

  if (dangerouslyDisableAuth === true) {
    return {
      ...shared,
      dangerouslyDisableAuth: true,
      env: {
        OAK_API_KEY: 'mock-oak-key',
        ELASTICSEARCH_URL: 'http://fake-es:9200',
        ELASTICSEARCH_API_KEY: 'fake-api-key-for-mock-config',
        LOG_LEVEL: 'error' as const,
        NODE_ENV: 'test' as const,
        DANGEROUSLY_DISABLE_AUTH: 'true' as const,
        ...envOverrides,
      },
    } satisfies AuthDisabledRuntimeConfig;
  }

  return {
    ...shared,
    dangerouslyDisableAuth: false,
    env: {
      OAK_API_KEY: 'mock-oak-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_mock',
      CLERK_SECRET_KEY: 'sk_test_mock',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key-for-mock-config',
      LOG_LEVEL: 'error' as const,
      NODE_ENV: 'test' as const,
      ...envOverrides,
    },
  } satisfies AuthEnabledRuntimeConfig;
}
