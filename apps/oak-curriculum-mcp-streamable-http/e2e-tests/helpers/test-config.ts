import type { RequestHandler } from 'express';
import type {
  AuthDisabledRuntimeConfig,
  AuthEnabledRuntimeConfig,
  RuntimeConfig,
} from '../../src/runtime-config.js';
import type { Env } from '../../src/env.js';
import type { HttpObservability } from '../../src/observability/http-observability.js';
import { createFakeHttpObservability } from '../../src/test-helpers/observability-fakes.js';

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
    // Simulate clerkMiddleware() which sets req.auth via Object.assign.
    // Uses the same mechanism Clerk uses at runtime — no type augmentation needed.
    Object.assign(req, {
      auth: () => ({
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
      }),
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
 * @remarks Fully hermetic: no filesystem reads, no `process.env` access, no
 * network. Callers pass all non-default values through `overrides`. Env
 * overrides are partial — hermetic defaults supply the rest.
 *
 * @param overrides - Optional partial config to override defaults
 * @returns A complete RuntimeConfig with test-appropriate values
 */
export function createMockRuntimeConfig(
  overrides?: Omit<Partial<RuntimeConfig>, 'env'> & { readonly env?: Partial<Env> },
): AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig {
  const { env: envOverrides, dangerouslyDisableAuth, ...restOverrides } = overrides ?? {};

  const shared = {
    useStubTools: false,
    version: '0.0.0-test',
    versionSource: 'APP_VERSION_OVERRIDE' as const,
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
      ...envOverrides,
    },
  } satisfies AuthEnabledRuntimeConfig;
}

/**
 * Returns a plain fake {@link HttpObservability} for tests.
 *
 * @remarks The `runtimeConfig` parameter is kept for call-site compatibility
 * with the previous factory-delegating signature, but is intentionally
 * ignored — the fake is independent of runtime config. Tests do not exercise
 * observability behaviour via this helper; if a test needs to assert on
 * observability interactions it should import {@link createFakeHttpObservability}
 * directly and spy on the returned object. The production factory
 * `createHttpObservabilityOrThrow` is deliberately NOT imported here because
 * tests must not pull in production observability wiring as incidental
 * infrastructure.
 */
export function createMockObservability(runtimeConfig?: RuntimeConfig): HttpObservability {
  void runtimeConfig;
  return createFakeHttpObservability();
}
