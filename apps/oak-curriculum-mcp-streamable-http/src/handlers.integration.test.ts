import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SecurityScheme } from '@oaknational/oak-curriculum-sdk';
import { registerHandlers, type ToolRegistrationServer } from './handlers.js';
import { loadRuntimeConfig } from './runtime-config.js';
import { createHttpLogger } from './logging/index.js';

/**
 * Extended config type for testing - includes securitySchemes
 * which is passed to MCP runtime but not yet in SDK types.
 */
interface TestToolConfig {
  readonly title?: string;
  readonly description?: string;
  readonly inputSchema?: unknown;
  readonly securitySchemes?: readonly SecurityScheme[];
}

/**
 * Creates a test double for McpServer that only implements registerTool.
 * This is a minimal fake for testing - we only test tool registration behavior,
 * not the full McpServer implementation.
 *
 * @returns Test double that can be passed to registerHandlers
 */
function createTestServerDouble(): ToolRegistrationServer {
  // Test double: minimal implementation for testing purposes only
  return {
    registerTool: vi.fn(),
  } as unknown as ToolRegistrationServer;
}

/**
 * Integration tests for tool registration with security metadata.
 *
 * These tests prove that security metadata flows from generated tool descriptors
 * through the SDK's listUniversalTools() to the MCP server registration.
 *
 * @remarks
 * Tests are written to interfaces (registerHandlers, McpServer), not internals.
 * We mock only the MCP server to capture registration calls.
 */
describe('registerHandlers - security metadata integration', () => {
  beforeEach(() => {
    // Set minimal required environment variables for tests
    process.env.OAK_API_KEY = 'test-api-key-for-integration-tests';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_integration_test_key';
    process.env.CLERK_SECRET_KEY = 'sk_test_integration_test_secret';
  });

  it('passes oauth2 securitySchemes for protected generated tool', () => {
    const mockServer = createTestServerDouble();

    const runtimeConfig = loadRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig, { name: 'test' });

    registerHandlers(mockServer, { runtimeConfig, logger });

    // Find call for a protected tool (get-key-stages is in generated tools, NOT in PUBLIC_TOOLS)
    const calls = vi.mocked(mockServer.registerTool).mock.calls;
    const keyStagesCall = calls.find((call: readonly unknown[]) => call[0] === 'get-key-stages');

    expect(keyStagesCall).toBeDefined();
    const config = keyStagesCall?.[1] as TestToolConfig;
    expect(config).toMatchObject({
      securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    });
  });

  it('passes noauth securitySchemes for public generated tool', () => {
    const mockServer = createTestServerDouble();

    const runtimeConfig = loadRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig, { name: 'test' });

    registerHandlers(mockServer, { runtimeConfig, logger });

    // Find call for a public tool (get-changelog is in PUBLIC_TOOLS)
    const calls = vi.mocked(mockServer.registerTool).mock.calls;
    const changelogCall = calls.find((call: readonly unknown[]) => call[0] === 'get-changelog');

    expect(changelogCall).toBeDefined();
    const config = changelogCall?.[1] as TestToolConfig;
    expect(config).toMatchObject({
      securitySchemes: [{ type: 'noauth' }],
    });
  });

  it('passes oauth2 securitySchemes for aggregated search tool', () => {
    const mockServer = createTestServerDouble();

    const runtimeConfig = loadRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig, { name: 'test' });

    registerHandlers(mockServer, { runtimeConfig, logger });

    // Find call for aggregated search tool
    const calls = vi.mocked(mockServer.registerTool).mock.calls;
    const searchCall = calls.find((call: readonly unknown[]) => call[0] === 'search');

    expect(searchCall).toBeDefined();
    const config = searchCall?.[1] as TestToolConfig;
    expect(config).toMatchObject({
      securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    });
  });

  it('passes oauth2 securitySchemes for aggregated fetch tool', () => {
    const mockServer = createTestServerDouble();

    const runtimeConfig = loadRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig, { name: 'test' });

    registerHandlers(mockServer, { runtimeConfig, logger });

    // Find call for aggregated fetch tool
    const calls = vi.mocked(mockServer.registerTool).mock.calls;
    const fetchCall = calls.find((call: readonly unknown[]) => call[0] === 'fetch');

    expect(fetchCall).toBeDefined();
    const config = fetchCall?.[1] as TestToolConfig;
    expect(config).toMatchObject({
      securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    });
  });

  it('registers all tools with security metadata', () => {
    const mockServer = createTestServerDouble();

    const runtimeConfig = loadRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig, { name: 'test' });

    registerHandlers(mockServer, { runtimeConfig, logger });

    const calls = vi.mocked(mockServer.registerTool).mock.calls;

    // Verify all registered tools have securitySchemes
    expect(calls.length).toBeGreaterThan(0);

    calls.forEach((call: readonly unknown[]) => {
      const config = call[1] as TestToolConfig;

      expect(config).toHaveProperty('securitySchemes');
      expect(Array.isArray(config.securitySchemes)).toBe(true);
      if (config.securitySchemes) {
        expect(config.securitySchemes.length).toBeGreaterThan(0);

        const scheme = config.securitySchemes[0];
        expect(scheme).toHaveProperty('type');
        expect(['oauth2', 'noauth']).toContain(scheme.type);

        // Verify oauth2 schemes have scopes
        if (scheme.type === 'oauth2') {
          expect(scheme).toHaveProperty('scopes');
          expect(Array.isArray(scheme.scopes)).toBe(true);
        }
      }
    });
  });
});
