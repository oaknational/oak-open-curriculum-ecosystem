/**
 * Integration Test: Handler registration completeness
 *
 * Verifies that `registerHandlers` registers tools, resources, and prompts
 * with the MCP server. Native Sentry (`wrapMcpServerWithSentry`) handles
 * handler error capture and transport tracing at the server level — individual
 * handler wrapping is no longer needed.
 *
 * Uses DI and simple fakes — no `vi.mock`, no global state.
 */

import { describe, it, expect, vi } from 'vitest';
import { registerHandlers } from './handlers.js';
import {
  createFakeHttpObservability,
  createFakeLogger,
  createFakeSearchRetrieval,
} from './test-helpers/fakes.js';
import type { AuthDisabledRuntimeConfig } from './runtime-config.js';

/**
 * Minimal fake RuntimeConfig for integration tests.
 * Auth is disabled so Clerk keys are not required.
 */
function createFakeRuntimeConfig(): AuthDisabledRuntimeConfig {
  return {
    env: {
      OAK_API_KEY: 'test-key',
      ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
      ELASTICSEARCH_API_KEY: 'test-es-key',
      NODE_ENV: 'test',
      DANGEROUSLY_DISABLE_AUTH: 'true',
    },
    dangerouslyDisableAuth: true,
    useStubTools: false,
    version: '0.0.0-test',
    versionSource: 'APP_VERSION_OVERRIDE',
    vercelHostnames: [],
  };
}

/**
 * Creates a minimal recording server using bare `vi.fn()` spies.
 *
 * Each spy satisfies the structural interface expected by `registerHandlers`
 * (`Pick<McpServer, 'registerTool' | 'registerResource' | 'registerPrompt'>`)
 * without requiring the full `McpServer` type or type assertions.
 */
function createRecordingMcpServer() {
  return {
    registerTool: vi.fn(),
    registerResource: vi.fn(),
    registerPrompt: vi.fn(),
  };
}

describe('registerHandlers — registration completeness', () => {
  it('registers at least one tool with the MCP server', () => {
    const server = createRecordingMcpServer();

    registerHandlers(server, {
      runtimeConfig: createFakeRuntimeConfig(),
      logger: createFakeLogger(),
      observability: createFakeHttpObservability(),
      searchRetrieval: createFakeSearchRetrieval(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });

    expect(server.registerTool).toHaveBeenCalled();
  });

  it('registers resources and prompts alongside tools', () => {
    const server = createRecordingMcpServer();

    registerHandlers(server, {
      runtimeConfig: createFakeRuntimeConfig(),
      logger: createFakeLogger(),
      observability: createFakeHttpObservability(),
      searchRetrieval: createFakeSearchRetrieval(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });

    expect(server.registerResource).toHaveBeenCalled();
    expect(server.registerPrompt).toHaveBeenCalled();
  });
});
