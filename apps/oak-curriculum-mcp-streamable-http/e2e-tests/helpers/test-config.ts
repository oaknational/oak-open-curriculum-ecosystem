import type { RequestHandler } from 'express';
import type {
  AuthDisabledRuntimeConfig,
  AuthEnabledRuntimeConfig,
  RuntimeConfig,
} from '../../src/runtime-config.js';
import type { Env } from '../../src/env.js';
import type { HttpObservability } from '../../src/observability/http-observability.js';
import type { RateLimiterFactory } from '../../src/rate-limiting/rate-limiter-factory.js';
import { createFakeHttpObservability } from '../../src/test-helpers/observability-fakes.js';
import { createFakeRateLimiterFactory } from '../../src/test-helpers/rate-limiter-fakes.js';
import { createFakeMachineAuthObject } from '../../src/test-helpers/fakes-clerk.js';
import type { CreateMcpAuthClerkDeps } from '../../src/auth/mcp-auth/index.js';

/**
 * Creates a no-op Clerk middleware factory for E2E tests.
 *
 * Replaces the real `clerkMiddleware` from `@clerk/express` via dependency
 * injection ({@link CreateAppOptions.clerkMiddlewareFactory}), avoiding
 * `vi.mock` and the ADR-078 violation it entails. It is a pure pass-through
 * that installs no `req.auth`: the auth outcome is controlled at the
 * verification seam via {@link createUnauthenticatedMcpAuthClerkDeps}, not by
 * forging Clerk's branded request handler. This keeps the test boundary off
 * Clerk's internal `req.auth` brand entirely (see ADR-193 — no reaching into
 * vendor internals).
 *
 * @see ADR-078 for the dependency injection rationale
 */
export function createNoOpClerkMiddleware(): () => RequestHandler {
  return () => (_req, _res, next) => {
    next();
  };
}

/**
 * Creates the Clerk auth dependencies for `createMcpAuthClerk` that report an
 * unauthenticated request, so the MCP auth middleware rejects it with HTTP 401.
 *
 * Injected via {@link CreateAppOptions.mcpAuthClerkDeps} (ADR-078). `getAuth`
 * returns the canonical unauthenticated `MachineAuthObject` from
 * {@link createFakeMachineAuthObject} (the one owner of the Clerk auth-object
 * shape); `verifyClerkToken` is never reached because the
 * `isAuthenticated: false` branch short-circuits first.
 */
export function createUnauthenticatedMcpAuthClerkDeps(): CreateMcpAuthClerkDeps {
  return {
    getAuth: () => createFakeMachineAuthObject({ isAuthenticated: false }),
    verifyClerkToken: () => undefined,
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
    // Mirror the production default: the EEF surface is live (kill-switch posture).
    eefEnabled: true,
    // Mirror the production default: user-search is opt-in, OFF. Tests that exercise
    // the user-search surface opt in explicitly (userSearchEnabled: true); the default
    // keeps the unbuilt tools off the surface, matching what a real client sees.
    userSearchEnabled: false,
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
 * @remarks **Interface-conformance retention.** The `runtimeConfig`
 * parameter is intentionally retained to mirror the production factory's
 * call signature so tests can swap factories without changing call sites,
 * even though the fake is independent of runtime config. The helper records
 * the auth-mode part of runtime config in fake observability context, keeping
 * the parameter as an explicit conformance input rather than a hidden unused
 * binding. Tests do not exercise
 * observability behaviour via this helper; if a test needs to assert on
 * observability interactions it should import {@link createFakeHttpObservability}
 * directly and spy on the returned object. The production factory
 * `createHttpObservabilityOrThrow` is deliberately NOT imported here so
 * tests do not pull in production observability wiring as incidental
 * infrastructure.
 */
export function createMockObservability(runtimeConfig?: RuntimeConfig): HttpObservability {
  const observability = createFakeHttpObservability();
  observability.setContext('mock_runtime_config', {
    authDisabled: runtimeConfig?.dangerouslyDisableAuth === true,
  });
  return observability;
}

/**
 * Returns a no-op {@link RateLimiterFactory} for E2E tests.
 *
 * Wraps {@link createFakeRateLimiterFactory} and discards the recording
 * channel for the common case where the test does not need to assert on
 * rate-limiter invocation. Tests that need to assert on calls should import
 * `createFakeRateLimiterFactory` directly.
 *
 * @remarks `rateLimiterFactory` is a required field on
 * {@link CreateAppOptions}. Without injection the production factory would
 * be reached, which instantiates `MemoryStore` per limiter with internal
 * `setInterval` cleanup — a real production object inside the test process.
 * This helper is the canonical test-boundary cure. (ADR-078)
 */
export function createNoOpRateLimiterFactory(): RateLimiterFactory {
  return createFakeRateLimiterFactory().factory;
}
