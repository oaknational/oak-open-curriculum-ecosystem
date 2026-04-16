/**
 * Test Helpers: Auth Error Testing
 *
 * Shared test utilities for auth error interception testing.
 * Used by tool-handler-with-auth.unit.test.ts.
 */

import { vi, expect } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { AuthEnabledRuntimeConfig } from '../runtime-config.js';
import { authLogContextSchema } from '../auth-log-context.js';
import { createFakeLogger } from './fakes.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import {
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { err } from '@oaknational/result';

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
    versionSource: 'APP_VERSION_OVERRIDE',
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
