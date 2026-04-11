/**
 * Shared test fakes for stdio app tests.
 * Use these instead of casting to McpServer, Logger, OakApiPathBasedClient, etc.
 */

import { vi } from 'vitest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import type { Logger } from '@oaknational/logger/node';
import type {
  OakApiPathBasedClient,
  ToolName,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { ToolExecutionSuccessEnvelope } from '../app/validation.js';

/**
 * Minimal OakApiPathBasedClient fake for tests that provide executeMcpTool (client not used).
 */
export function createFakeOakPathBasedClient(): OakApiPathBasedClient {
  const client = {};
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- SDK client type has many generated methods; unused when executeMcpTool is provided
  return client as OakApiPathBasedClient;
}

/**
 * Minimal ToolExecutionSuccessEnvelope for validation tests.
 */
export function createFakeToolExecutionSuccessEnvelope<TName extends ToolName>(
  status: number,
  data: unknown,
): ToolExecutionSuccessEnvelope<TName> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Test envelope with arbitrary status (e.g. 418, 599) for validation tests
  return { status, data } as ToolExecutionSuccessEnvelope<TName>;
}

/**
 * Minimal McpServer fake with registerTool for registration tests.
 */
export function createFakeMcpServer(): McpServer {
  const server = {
    registerTool: vi.fn(),
    registerResource: vi.fn(),
    registerPrompt: vi.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- MCP SDK McpServer has many members; minimal fake for registration tests
  return server as unknown as McpServer;
}

/**
 * Minimal Logger fake for tool response and error-enrichment tests.
 */
export function createFakeLogger(overrides?: Partial<Pick<Logger, 'info' | 'error'>>): Logger {
  const logger: Logger = {
    trace: vi.fn(),
    debug: vi.fn(),
    info: overrides?.info ?? vi.fn(),
    warn: vi.fn(),
    error: overrides?.error ?? vi.fn(),
    fatal: vi.fn(),
    child: () => logger,
  };
  return logger;
}
