/**
 * Test Helpers: Auth Error Integration Tests
 *
 * Shared test utilities for auth error interception testing.
 */

import { vi, expect } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { AuthEnabledRuntimeConfig } from '../runtime-config.js';
import { authLogContextSchema } from '../auth-log-context.js';
import type { ToolHandlerDependencies } from '../handlers.js';
import { createFakeLogger } from './fakes.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import type { CallToolResult, Notification, ServerRequest } from '@modelcontextprotocol/sdk/types';
import {
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { err } from '@oaknational/result';

/**
 * Creates mock dependencies for auth error testing.
 *
 * Wraps the provided `executeMcpTool` function into a `createRequestExecutor`
 * factory that invokes the `onToolExecution` callback (for auth error capture).
 */
export function createMockDeps(
  executeMcpTool: (name: unknown, args: unknown, client: unknown) => Promise<ToolExecutionResult>,
): Partial<ToolHandlerDependencies> {
  return {
    createRequestExecutor: vi.fn((config) => {
      return vi.fn(async (name, args) => {
        const execution = await executeMcpTool(name, args, {});
        config.onToolExecution?.(name, execution);
        if (execution.ok) {
          return { content: [{ type: 'text' as const, text: JSON.stringify(execution.value) }] };
        }
        return {
          content: [{ type: 'text' as const, text: execution.error.message }],
          isError: true,
        };
      });
    }),
    getResourceUrl: () => 'https://test.example.com/mcp',
  };
}

interface Params {
  readonly signal: AbortSignal;
  readonly requestId: string;
  readonly sendNotification: (notification: Notification) => Promise<void>;
  readonly sendRequest: (request: ServerRequest) => Promise<unknown>;
}

/**
 * Creates a real MCP server with `registerTool` replaced to capture handlers.
 *
 * @remarks
 * Uses a real `McpServer` instance — the SDK object naturally satisfies its
 * own types. Replaces `registerTool` with a handler-capturing function.
 *
 * The `as McpServer['registerTool']` assertion is irreducible: the MCP
 * SDK's `registerTool` has overloaded generics that TypeScript cannot
 * satisfy with any plain function. This was confirmed by type-reviewer
 * analysis. The eslint config for this file allows `as`-style assertions
 * (see eslint.config.ts).
 */
export function createMockServer(
  capturedHandlers: Map<string, (params: Params) => Promise<CallToolResult>>,
): McpServer {
  const server = new McpServer({ name: 'test-server', version: '0.0.0' });

  function capturingRegisterTool(
    name: string,
    configOrCb: unknown,
    handlerOrUndefined?: (params: unknown, extra: unknown) => Promise<CallToolResult>,
  ): void {
    void configOrCb;
    if (handlerOrUndefined) {
      const wrappedHandler = (params: Params) => handlerOrUndefined(params, {});
      capturedHandlers.set(name, wrappedHandler);
    }
  }

  // Irreducible assertion: McpServer.registerTool has overloaded generics
  // that no plain function can satisfy. Confirmed by type-reviewer analysis.
  server.registerTool = capturingRegisterTool as McpServer['registerTool'];

  return server;
}

/** Creates a mock logger for testing. Delegates to the canonical fake. */
export function createMockLogger(): Logger {
  return createFakeLogger();
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
      SENTRY_MODE: 'off',
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
