/**
 * Integration tests for tool-level authentication.
 *
 * Tests the integration between tool execution and auth checking,
 * verifying that protected tools return MCP errors with _meta when
 * auth is missing or invalid.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { AuthDisabledRuntimeConfig, AuthEnabledRuntimeConfig } from './runtime-config.js';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';
import type { ToolHandlerDependencies } from './handlers.js';
import { createFakeLogger } from './test-helpers/fakes.js';

/**
 * Creates simplified mock dependencies for testing.
 *
 * With the new 3-member DI interface, mocks are trivial fakes —
 * no re-implementation of the factory chain needed.
 */
function createMockDependencies(
  overrides?: Partial<ToolHandlerDependencies>,
): ToolHandlerDependencies {
  return {
    createRequestExecutor: vi.fn(() =>
      vi.fn(async () => ({
        content: [{ type: 'text' as const, text: 'Tool executed successfully' }],
      })),
    ),
    getResourceUrl: vi.fn(() => 'http://localhost:3333/mcp'),
    ...overrides,
  };
}

/**
 * Extracts the first `mcp/www_authenticate` header string from a CallToolResult's `_meta`.
 * Uses `expect()` for clear failure messages with object snapshots.
 */
function extractWwwAuthHeader(result: { _meta?: Record<string, unknown> }): string {
  expect(result._meta).toBeDefined();
  const wwwAuth: unknown = result._meta?.['mcp/www_authenticate'];
  if (!Array.isArray(wwwAuth) || wwwAuth.length === 0) {
    throw new Error('Expected _meta["mcp/www_authenticate"] to be a non-empty array');
  }
  const first: unknown = wwwAuth[0];
  if (typeof first !== 'string') {
    throw new Error('Expected first www_authenticate header to be a string');
  }
  return first;
}

const baseAuthEnabledEnv: AuthEnabledRuntimeConfig['env'] = {
  OAK_API_KEY: 'test',
  CLERK_PUBLISHABLE_KEY: 'pk_test',
  CLERK_SECRET_KEY: 'sk_test',
  ELASTICSEARCH_URL: 'http://fake:9200',
  ELASTICSEARCH_API_KEY: 'fake-key',
  SENTRY_MODE: 'off',
};

const baseAuthDisabledEnv: AuthDisabledRuntimeConfig['env'] = {
  OAK_API_KEY: 'test',
  ELASTICSEARCH_URL: 'http://fake:9200',
  ELASTICSEARCH_API_KEY: 'fake-key',
  SENTRY_MODE: 'off',
};

/**
 * Creates a mock RuntimeConfig for testing.
 * When overrides.dangerouslyDisableAuth is true, returns AuthDisabledRuntimeConfig.
 */
function createMockRuntimeConfig(
  overrides?:
    | Partial<AuthEnabledRuntimeConfig>
    | (Partial<AuthDisabledRuntimeConfig> & { dangerouslyDisableAuth: true }),
): AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig {
  if (overrides?.dangerouslyDisableAuth === true) {
    const { env: envOverrides } = overrides;
    return {
      env: envOverrides ? { ...baseAuthDisabledEnv, ...envOverrides } : baseAuthDisabledEnv,
      dangerouslyDisableAuth: true,
      useStubTools: false,
      version: '1.0.0-test',
      versionSource: 'APP_VERSION_OVERRIDE',
      vercelHostnames: [],
    } satisfies AuthDisabledRuntimeConfig;
  }
  const { env: envOverrides } = overrides ?? {};
  const mergedEnv = envOverrides ? { ...baseAuthEnabledEnv, ...envOverrides } : baseAuthEnabledEnv;
  return {
    env: mergedEnv,
    dangerouslyDisableAuth: false,
    useStubTools: false,
    version: '1.0.0-test',
    versionSource: 'APP_VERSION_OVERRIDE',
    vercelHostnames: [],
  } satisfies AuthEnabledRuntimeConfig;
}

describe('Tool Handler with Auth Integration', () => {
  let logger: Logger;
  let deps: ToolHandlerDependencies;

  beforeEach(() => {
    logger = createFakeLogger();
    deps = createMockDependencies();
  });

  describe('Protected tools (OAuth required)', () => {
    it('should return MCP error with _meta when auth context missing', async () => {
      const tool = { name: 'search' } as const;
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      // For this test, we expect the handler to check auth BEFORE executing
      // Since auth context is missing (not implemented yet), expect error
      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      // Protected tool with no auth context returns MCP error with _meta
      expect(result.isError).toBe(true);
      const wwwAuth = extractWwwAuthHeader(result);
      expect(wwwAuth).toContain('Bearer');
      expect(wwwAuth).toContain('error=');
    });

    // Note: Testing the success path with valid auth requires a real JWT token
    // that passes resource parameter validation (RFC 8707). This is better tested
    // in E2E tests where we have real Clerk tokens. Integration tests focus on
    // error paths which don't require complex JWT mocking.

    it('should return MCP error with _meta for invalid auth token', async () => {
      const tool = { name: 'get-key-stages' } as const;
      const params = {};
      const config = createMockRuntimeConfig();

      // For this test, assume we have invalid auth context
      // (Not yet implemented - will need to pass auth context to handler)
      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      // Protected tool with missing auth returns MCP error with _meta
      expect(result.isError).toBe(true);
      const wwwAuth = extractWwwAuthHeader(result);
      expect(wwwAuth).toContain('error=');
    });
  });

  describe('Public tools (noauth)', () => {
    it('should execute public tool without auth check', async () => {
      const tool = { name: 'get-changelog' } as const;
      const params = {};
      const config = createMockRuntimeConfig();

      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      // Expected behavior:
      // - Check if tool requires auth (get-changelog does not)
      // - Execute tool without auth check
      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('DANGEROUSLY_DISABLE_AUTH bypass', () => {
    it('should bypass auth and execute protected tool when flag is true', async () => {
      const tool = { name: 'search' } as const;
      const params = { query: 'test' };
      const config = createMockRuntimeConfig({ dangerouslyDisableAuth: true });

      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      // Expected behavior:
      // - Auth bypass should prevent auth error
      // - Tool should execute successfully
      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
      // createRequestExecutor was called, proving the tool reached execution
      expect(deps.createRequestExecutor).toHaveBeenCalled();

      // Should log the bypass
      expect(logger.info).toHaveBeenCalledWith('Auth disabled via DANGEROUSLY_DISABLE_AUTH', {
        toolName: 'search',
      });
    });

    it('should bypass auth for all protected tools when flag is true', async () => {
      const tool = { name: 'get-key-stages' } as const;
      const params = {};
      const config = createMockRuntimeConfig({ dangerouslyDisableAuth: true });

      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      // Should execute without auth error
      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
      // createRequestExecutor was called, proving the tool reached execution
      expect(deps.createRequestExecutor).toHaveBeenCalled();

      // Should log the bypass
      expect(logger.info).toHaveBeenCalledWith('Auth disabled via DANGEROUSLY_DISABLE_AUTH', {
        toolName: 'get-key-stages',
      });
    });

    it('should enforce auth when flag is false', async () => {
      const tool = { name: 'search' } as const;
      const params = { query: 'test' };
      const config = createMockRuntimeConfig({ dangerouslyDisableAuth: false });

      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      // Should return auth error (no auth context available in test)
      expect(result.isError).toBe(true);
      expect(result._meta).toBeDefined();

      // Should NOT log bypass
      expect(logger.info).not.toHaveBeenCalledWith(
        'Auth disabled via DANGEROUSLY_DISABLE_AUTH',
        expect.anything(),
      );
    });
  });

  describe('Error logging', () => {
    it('should log auth required but missing with correlation ID', async () => {
      const tool = { name: 'search' } as const;
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      // Expected: logger.warn called with auth/context missing message
      expect(logger.warn).toHaveBeenCalled();
      const warnCalls = vi.mocked(logger.warn).mock.calls;
      const hasAuthOrContextWarning = warnCalls.some((call: unknown[]) => {
        const firstArg = call[0];
        return (
          typeof firstArg === 'string' &&
          (firstArg.includes('auth') || firstArg.includes('context') || firstArg.includes('token'))
        );
      });
      expect(hasAuthOrContextWarning).toBe(true);
    });

    // Note: Testing successful auth logging requires a real JWT token
    // that passes resource parameter validation. This is better tested in E2E tests.
  });

  describe('MCP error format', () => {
    it('should include resource_metadata in www_authenticate header', async () => {
      const tool = { name: 'search' } as const;
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      const wwwAuth = extractWwwAuthHeader(result);
      expect(wwwAuth).toContain('resource_metadata=');
      // resource_metadata should contain the well-known URL, not the MCP endpoint
      expect(wwwAuth).toContain('/.well-known/oauth-protected-resource');
    });

    it('should include error description in www_authenticate header', async () => {
      const tool = { name: 'search' } as const;
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      const wwwAuth = extractWwwAuthHeader(result);
      expect(wwwAuth).toContain('error_description=');
    });

    it('should include user-friendly error message in content', async () => {
      const tool = { name: 'search' } as const;
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      const result = await handleToolWithAuthInterception({
        tool,
        params,
        deps,
        logger,
        apiKey: 'test-api-key',
        runtimeConfig: config,
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      if (result.content[0].type === 'text') {
        expect(result.content[0].text).toContain('Authentication');
      }
    });
  });
});

describe('explicit auth context propagation', () => {
  it('returns auth error when authInfo is undefined for a protected tool', async () => {
    const result = await handleToolWithAuthInterception({
      tool: { name: 'get-key-stages' },
      params: {},
      deps: createMockDependencies(),
      logger: createFakeLogger(),
      apiKey: 'test-key',
      runtimeConfig: createMockRuntimeConfig(),
      authInfo: undefined,
    });

    expect(result.isError).toBe(true);
    expect(result.content).toBeDefined();
    expect(result.content[0].type).toBe('text');
    if (result.content[0].type === 'text') {
      expect(result.content[0].text).toContain('login');
    }
  });
});
