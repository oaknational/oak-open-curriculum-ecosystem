/**
 * Test Helpers: Auth Error Integration Tests
 *
 * Shared test utilities for auth error interception testing.
 */

import { vi, expect } from 'vitest';
import { z } from 'zod';
import type { Logger } from '@oaknational/logger';
import type { AuthEnabledRuntimeConfig } from '../runtime-config.js';
import type { ToolHandlerDependencies } from '../handlers.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type {
  CallToolResult,
  Notification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types.js';
import {
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { err } from '@oaknational/result';

/** Creates mock dependencies for tool handler testing. */
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
 * Bridges MCP SDK's complex registerTool generics to a simple test
 * parameter type. The outer cast to McpServer is unavoidable because
 * the SDK type has complex overloaded generics with no test-double interface.
 */
export function createMockServer(
  capturedHandlers: Map<string, (params: Params) => Promise<CallToolResult>>,
): McpServer {
  function mockRegisterToolImpl<TInput = unknown>(
    name: string,
    config: unknown,
    handler: (params: TInput, extra: unknown) => Promise<CallToolResult>,
  ): unknown {
    // config is required by the registerTool overload signature but unused in the mock
    void config;
    // Capture the handler with our test parameter type
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Bridge between MCP SDK generics and test types
    const wrappedHandler = (params: Params) => handler(params as TInput, {});
    capturedHandlers.set(name, wrappedHandler);
    return undefined;
  }

  const mockServer = {
    registerTool: vi.fn(mockRegisterToolImpl),
    registerResource: vi.fn(),
    registerPrompt: vi.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- MCP SDK McpServer has complex overloaded generics; minimal test double
  return mockServer as unknown as McpServer;
}

/** Creates a mock logger for testing. */
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

/** Creates a mock runtime config for testing. */
export function createMockRuntimeConfig(): AuthEnabledRuntimeConfig {
  return {
    env: {
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'test-clerk-pub',
      CLERK_SECRET_KEY: 'test-clerk-secret',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key',
    },
    useStubTools: false,
    dangerouslyDisableAuth: false,
    version: '0.0.0-test',
    vercelHostnames: [],
  };
}

/** Creates a ToolExecutionResult with an auth error. */
export function createAuthErrorResult(status: number, message: string): ToolExecutionResult {
  const error = createStatusError(status, message);
  return err(
    new McpToolError(`Execution failed: ${message}`, 'test-tool', {
      cause: error,
    }),
  );
}

/** Creates a ToolExecutionResult with a Clerk auth error. */
export function createClerkErrorResult(message: string): ToolExecutionResult {
  const clerkError = new Error(message);
  return err(
    new McpToolError('Execution failed', 'test-tool', {
      cause: clerkError,
    }),
  );
}

/** Creates a ToolExecutionResult with a non-auth error. */
export function createNonAuthErrorResult(message: string): ToolExecutionResult {
  const error = new Error(message);
  return err(
    new McpToolError('Execution failed', 'test-tool', {
      cause: error,
    }),
  );
}

class StatusError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function createStatusError(status: number, message: string): Error {
  return new StatusError(status, message);
}

/** Gets a registered handler from the captured handlers map. */
export function getHandler(
  capturedHandlers: Map<string, (params: unknown) => Promise<CallToolResult>>,
  toolName: string,
): (params: unknown) => Promise<CallToolResult> {
  const handler = capturedHandlers.get(toolName);
  if (!handler) {
    throw new Error(`${toolName} handler not registered`);
  }
  return handler;
}

/**
 * Assert authentication error response structure.
 *
 * Validates that a tool result has the expected MCP-compliant auth error shape:
 * isError: true, content array with user-friendly message, and _meta with
 * RFC 6750 WWW-Authenticate header.
 */
export function assertAuthErrorResponse(
  result: CallToolResult,
  expectedErrorPattern: RegExp,
): void {
  expect(result.isError).toBe(true);
  expect(result.content.length).toBeGreaterThan(0);
  const firstContent = result.content[0];
  expect(firstContent).toBeDefined();
  expect(firstContent?.type).toBe('text');
  // CallToolResult content is a union — assert 'text' type then access .text
  expect(firstContent && 'text' in firstContent ? firstContent.text : undefined).toContain(
    'Authentication Error',
  );
  const meta = result._meta;
  expect(meta).toBeDefined();
  const wwwAuth = meta?.['mcp/www_authenticate'];
  expect(wwwAuth).toBeDefined();
  expect(Array.isArray(wwwAuth)).toBe(true);
  expect(Array.isArray(wwwAuth) && wwwAuth.length).toBeGreaterThan(0);
  expect(Array.isArray(wwwAuth) && wwwAuth[0]).toMatch(expectedErrorPattern);
}

/** Zod schema for validating auth error log context. */
const authLogContextSchema = z.object({
  toolName: z.string(),
  errorType: z.string(),
  description: z.string(),
});

/**
 * Assert logger was called with auth error context.
 *
 * Validates the log context shape with Zod rather than type assertions,
 * consistent with the boundary-validation pattern used in production code.
 */
export function assertAuthErrorLogged(
  logger: Pick<Logger, 'warn'>,
  expectedToolName: string,
  expectedErrorType: string,
  descriptionContains?: string,
): void {
  expect(logger.warn).toHaveBeenCalled();
  const warnCalls = vi.mocked(logger.warn).mock.calls;
  expect(warnCalls.length).toBeGreaterThan(0);
  const [message, context] = warnCalls[0];
  expect(message).toBe('Tool execution auth error');
  const logContext = authLogContextSchema.parse(context);
  expect(logContext.toolName).toBe(expectedToolName);
  expect(logContext.errorType).toBe(expectedErrorType);
  if (descriptionContains) {
    expect(logContext.description).toContain(descriptionContains);
  }
}
