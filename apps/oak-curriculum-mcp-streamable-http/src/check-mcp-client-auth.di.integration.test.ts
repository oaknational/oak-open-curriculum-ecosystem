/**
 * DI-based integration tests for checkMcpClientAuth.
 *
 * checkMcpClientAuth receives explicit AuthInfo and injected dependencies
 * (CheckMcpClientAuthDeps) instead of reaching into ambient state. Zero
 * vi.mock calls — all dependencies are injected directly.
 */

import { describe, it, expect, vi } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { UniversalToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { ResourceValidationResult } from './resource-parameter-validator.js';
import { checkMcpClientAuth, type CheckMcpClientAuthDeps } from './check-mcp-client-auth.js';
import { createFakeAuthInfo, createFakeLogger } from './test-helpers/fakes.js';
import type { AuthDisabledRuntimeConfig } from './runtime-config.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';

/**
 * Creates fake CheckMcpClientAuthDeps for DI-based tests.
 * No vi.mock needed — dependencies are injected directly.
 */
function createFakeDeps(overrides?: Partial<CheckMcpClientAuthDeps>): CheckMcpClientAuthDeps {
  return {
    toolRequiresAuth: overrides?.toolRequiresAuth ?? (() => true),
    validateResourceParameter:
      overrides?.validateResourceParameter ?? ((): ResourceValidationResult => ({ valid: true })),
  };
}

describe('checkMcpClientAuth (DI contract)', () => {
  const toolName: UniversalToolName = 'get-key-stages';
  const resourceUrl = 'https://example.com/mcp';

  function callWithDI(
    authInfo: AuthInfo | undefined,
    deps: CheckMcpClientAuthDeps,
    overrides?: {
      logger?: Logger;
      dangerouslyDisableAuth?: boolean;
    },
  ): ReturnType<typeof checkMcpClientAuth> {
    const logger = overrides?.logger ?? createFakeLogger();
    const runtimeConfig =
      overrides?.dangerouslyDisableAuth === true
        ? ({
            ...createMockRuntimeConfig(),
            dangerouslyDisableAuth: true,
          } satisfies AuthDisabledRuntimeConfig)
        : createMockRuntimeConfig();

    return checkMcpClientAuth(toolName, resourceUrl, logger, runtimeConfig, authInfo, deps);
  }

  describe('auth bypass', () => {
    it('returns undefined when dangerouslyDisableAuth is true', () => {
      const deps = createFakeDeps();
      const authInfo = createFakeAuthInfo();

      const result = callWithDI(authInfo, deps, { dangerouslyDisableAuth: true });

      expect(result).toBeUndefined();
    });
  });

  describe('public tools', () => {
    it('returns undefined when tool does not require auth', () => {
      const deps = createFakeDeps({
        toolRequiresAuth: () => false,
      });

      const result = callWithDI(undefined, deps);

      expect(result).toBeUndefined();
    });
  });

  describe('protected tools', () => {
    it('returns auth error when authInfo is undefined for protected tool', () => {
      const deps = createFakeDeps({
        toolRequiresAuth: () => true,
      });

      const result = callWithDI(undefined, deps);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
    });

    it('returns auth error when resource validation fails', () => {
      const deps = createFakeDeps({
        toolRequiresAuth: () => true,
        validateResourceParameter: (): ResourceValidationResult => ({
          valid: false,
          reason: 'Resource mismatch',
        }),
      });
      const authInfo = createFakeAuthInfo();

      const result = callWithDI(authInfo, deps);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
    });

    it('returns undefined when all auth checks pass', () => {
      const deps = createFakeDeps({
        toolRequiresAuth: () => true,
        validateResourceParameter: (): ResourceValidationResult => ({
          valid: true,
        }),
      });
      const authInfo = createFakeAuthInfo();

      const result = callWithDI(authInfo, deps);

      expect(result).toBeUndefined();
    });

    it('passes authInfo.token to validateResourceParameter', () => {
      const validateSpy = vi.fn((): ResourceValidationResult => ({ valid: true }));
      const deps = createFakeDeps({
        toolRequiresAuth: () => true,
        validateResourceParameter: validateSpy,
      });
      const authInfo = createFakeAuthInfo({ token: 'specific-test-token' });
      const logger = createFakeLogger();

      callWithDI(authInfo, deps, { logger });

      expect(validateSpy).toHaveBeenCalledWith('specific-test-token', resourceUrl, logger);
    });
  });
});
