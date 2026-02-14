/**
 * Test Helpers: Auth Error Integration Tests
 *
 * Shared test utilities for auth error interception testing.
 */

import { vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';
import type { RuntimeConfig } from '../runtime-config.js';
import type { ToolHandlerDependencies, ToolRegistrationServer } from '../handlers.js';
import {
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { Notification, ServerRequest } from '@modelcontextprotocol/sdk/types.js';

/**
 * Creates mock dependencies for tool handler testing.
 *
 * @param executeMcpTool - Mock executeMcpTool implementation
 * @returns Partial tool handler dependencies
 */
export function createMockDeps(
  executeMcpTool: (name: unknown, args: unknown, client: unknown) => Promise<ToolExecutionResult>,
): Partial<ToolHandlerDependencies> {
  return {
    executeMcpTool,
    getResourceUrl: () => 'https://test.example.com/mcp',
  };
}

interface Params {
  [key: string]: unknown;
  signal: AbortSignal;
  requestId: string;
  sendNotification: (notification: Notification) => Promise<void>;
  sendRequest: (request: ServerRequest) => Promise<unknown>;
}

/**
 * Creates a mock MCP server that captures registered tool handlers.
 *
 * Creates a type-safe mock with a generic registerTool method that matches
 * the MCP SDK's signature while capturing handlers for test assertions.
 *
 * Type Safety Note:
 * - The MCP SDK's registerTool has complex generics: <InputArgs extends ZodRawShape, OutputArgs extends ZodRawShape>
 * - Our mock needs to capture handlers as (params: Params) => Promise<unknown> for test assertions
 * - We bridge this gap by:
 *   1. Creating a generic implementation that accepts any handler signature
 *   2. Internally wrapping to our test Params type
 *   3. Type assertion to satisfy ToolRegistrationServer (library type from MCP SDK)
 *
 * This is test infrastructure code that enables DI-based integration testing per rules.md.
 * Alternative approaches (replicating MCP SDK's entire type system) are disproportionate effort.
 *
 * @param capturedHandlers - Map to store handlers by tool name
 * @returns Mock server satisfying ToolRegistrationServer interface
 */
export function createMockServer(
  capturedHandlers: Map<string, (params: Params) => Promise<unknown>>,
): ToolRegistrationServer {
  // Create a generic mock function matching MCP SDK's signature

  function mockRegisterToolImpl<TInput = unknown>(
    name: string,
    _config: unknown,
    handler: (params: TInput, _extra: unknown) => Promise<unknown>,
  ): unknown {
    // Capture the handler with our test parameter type
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Bridge between MCP SDK generics and test types
    const wrappedHandler = (params: Params) => handler(params as TInput, {});
    capturedHandlers.set(name, wrappedHandler);
    return undefined; // MCP SDK returns RegisteredTool, but we don't need it in tests
  }

  // Create mock using vi.fn() for call tracking
  const mockRegisterTool = vi.fn(mockRegisterToolImpl);

  // Mock registerResource as no-op - tests focus on tool handler behaviour, not widget registration
  const mockRegisterResource = vi.fn();

  // Mock registerPrompt as no-op - tests focus on tool handler behaviour, not prompt registration
  const mockRegisterPrompt = vi.fn();

  // Return a properly typed mock server (test double)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Test double with minimal implementation for testing
  const mockServer = {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Cast vi.fn mock to MCP SDK library type for test double
    registerTool: mockRegisterTool as ToolRegistrationServer['registerTool'],
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Cast vi.fn mock to MCP SDK library type for test double
    registerResource: mockRegisterResource as ToolRegistrationServer['registerResource'],
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Cast vi.fn mock to MCP SDK library type for test double
    registerPrompt: mockRegisterPrompt as ToolRegistrationServer['registerPrompt'],
  } as unknown as ToolRegistrationServer;
  return mockServer;
}

/**
 * Creates a mock logger for testing.
 *
 * @returns Partial mock Logger with all required methods
 */
export function createMockLogger(): Pick<
  Logger,
  'warn' | 'error' | 'info' | 'debug' | 'trace' | 'fatal'
> {
  return {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  };
}

/**
 * Creates a mock runtime config for testing.
 *
 * @returns Partial runtime config with required fields
 */
export function createMockRuntimeConfig(): Pick<
  RuntimeConfig,
  'env' | 'useStubTools' | 'dangerouslyDisableAuth' | 'version' | 'vercelHostnames'
> {
  return {
    env: {
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'test-clerk-pub',
      CLERK_SECRET_KEY: 'test-clerk-secret',
    },
    useStubTools: false,
    dangerouslyDisableAuth: false,
    version: '0.0.0-test',
    vercelHostnames: [],
  };
}

/**
 * Creates a ToolExecutionResult with an auth error.
 *
 * @param status - HTTP status code (401 or 403)
 * @param message - Error message
 * @returns ToolExecutionResult with error
 */
export function createAuthErrorResult(status: number, message: string): ToolExecutionResult {
  const error = Object.assign(new Error(message), { status });
  const result: ToolExecutionResult = {
    error: new McpToolError(`Execution failed: ${message}`, 'test-tool', {
      cause: error,
    }),
  };
  return result;
}

/**
 * Creates a ToolExecutionResult with a Clerk auth error.
 *
 * @param message - Clerk error message
 * @returns ToolExecutionResult with error
 */
export function createClerkErrorResult(message: string): ToolExecutionResult {
  const clerkError = new Error(message);
  const result: ToolExecutionResult = {
    error: new McpToolError('Execution failed', 'test-tool', {
      cause: clerkError,
    }),
  };
  return result;
}

/**
 * Creates a ToolExecutionResult with a non-auth error.
 *
 * @param message - Error message
 * @returns ToolExecutionResult with error
 */
export function createNonAuthErrorResult(message: string): ToolExecutionResult {
  const error = new Error(message);
  const result: ToolExecutionResult = {
    error: new McpToolError('Execution failed', 'test-tool', {
      cause: error,
    }),
  };
  return result;
}

/**
 * Gets a registered handler from the captured handlers map.
 *
 * @param capturedHandlers - Map of captured handlers
 * @param toolName - Tool name to retrieve
 * @returns Handler function
 * @throws Error if handler not found
 */
export function getHandler(
  capturedHandlers: Map<string, (params: unknown) => Promise<unknown>>,
  toolName: string,
): (params: unknown) => Promise<unknown> {
  const handler = capturedHandlers.get(toolName);
  if (!handler) {
    throw new Error(`${toolName} handler not registered`);
  }
  return handler;
}
