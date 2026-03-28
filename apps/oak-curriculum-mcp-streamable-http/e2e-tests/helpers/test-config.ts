import type { RequestHandler } from 'express';
import type {
  AuthDisabledRuntimeConfig,
  AuthEnabledRuntimeConfig,
  RuntimeConfig,
} from '../../src/runtime-config.js';
import {
  createHttpObservabilityOrThrow,
  type HttpObservability,
} from '../../src/observability/http-observability.js';

/**
 * Creates a no-op Clerk middleware factory for E2E tests.
 *
 * Replaces the real `clerkMiddleware` from `@clerk/express` via dependency
 * injection ({@link CreateAppOptions.clerkMiddlewareFactory}), avoiding
 * `vi.mock` and the ADR-078 violation it entails.
 *
 * The returned middleware sets `req.auth` as a callable function matching
 * Clerk's runtime contract: `getAuth(req)` checks `"auth" in req` then
 * calls `req.auth(options)`. Setting `isAuthenticated: false` ensures
 * auth-enforcement middleware correctly rejects unauthenticated requests.
 *
 * @see ADR-078 for the dependency injection rationale
 */
export function createNoOpClerkMiddleware(): () => RequestHandler {
  return () => (req, res, next) => {
    void res;
    req.auth = () => ({
      id: null,
      subject: null,
      scopes: null,
      userId: null,
      clientId: null,
      getToken: async () => null,
      has: () => false,
      debug: () => ({}),
      tokenType: 'oauth_token',
      isAuthenticated: false,
    });
    next();
  };
}

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
        SENTRY_MODE: 'off' as const,
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
      SENTRY_MODE: 'off' as const,
      LOG_LEVEL: 'error' as const,
      NODE_ENV: 'test' as const,
      ...envOverrides,
    },
  } satisfies AuthEnabledRuntimeConfig;
}

export function createMockObservability(runtimeConfig: RuntimeConfig): HttpObservability {
  return createHttpObservabilityOrThrow(runtimeConfig);
}
