/**
 * Test Helpers: Auth Error Testing
 *
 * Shared test utilities for auth error interception testing.
 * Used by tool-handler-with-auth.unit.test.ts.
 */

import { vi, expect } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { AuthDisabledRuntimeConfig, AuthEnabledRuntimeConfig } from '../runtime-config.js';
import type { Env } from '../env.js';
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

interface MockRuntimeConfigOverrides {
  /**
   * Env overrides merged onto the mock env.
   *
   * @remarks Values override the hermetic defaults below. Do not read from
   * `process.env` to compose overrides — tests must pass literal values so
   * outcomes do not depend on the developer's local environment or shell
   * state.
   */
  readonly env?: Partial<Env>;
  /**
   * When true, returns an `AuthDisabledRuntimeConfig` (Clerk keys omitted).
   */
  readonly dangerouslyDisableAuth?: boolean;
}

const BASE_MOCK_ENV = {
  OAK_API_KEY: 'test-key',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key',
  SENTRY_MODE: 'off' as const,
};

const BASE_CLERK_KEYS = {
  CLERK_PUBLISHABLE_KEY: 'test-clerk-pub',
  CLERK_SECRET_KEY: 'test-clerk-secret',
};

const BASE_SHARED_FIELDS = {
  useStubTools: false,
  version: '0.0.0-test',
  versionSource: 'APP_VERSION_OVERRIDE',
  vercelHostnames: [],
} as const;

/**
 * Creates a mock runtime config for testing.
 *
 * @remarks Entirely hermetic: no filesystem reads, no `process.env` access,
 * no network. Callers pass all non-default values through `overrides`.
 * `SENTRY_MODE` is pinned to `'off'` so `initialiseSentry` returns the noop
 * runtime and real `Sentry.init()` is never reachable from tests
 * (prevents process-listener accumulation).
 */
export function createMockRuntimeConfig(
  overrides: MockRuntimeConfigOverrides & { dangerouslyDisableAuth: true },
): AuthDisabledRuntimeConfig;
export function createMockRuntimeConfig(
  overrides?: MockRuntimeConfigOverrides & { dangerouslyDisableAuth?: false },
): AuthEnabledRuntimeConfig;
export function createMockRuntimeConfig(
  overrides: MockRuntimeConfigOverrides = {},
): AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig {
  if (overrides.dangerouslyDisableAuth === true) {
    return {
      env: { ...BASE_MOCK_ENV, ...overrides.env },
      ...BASE_SHARED_FIELDS,
      dangerouslyDisableAuth: true,
    } satisfies AuthDisabledRuntimeConfig;
  }

  return {
    env: { ...BASE_MOCK_ENV, ...BASE_CLERK_KEYS, ...overrides.env },
    ...BASE_SHARED_FIELDS,
    dangerouslyDisableAuth: false,
  } satisfies AuthEnabledRuntimeConfig;
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
