/**
 * Unit tests for MCP client authentication checking.
 *
 * Tests the preventive authentication layer that checks MCP client auth
 * BEFORE SDK execution. This is separate from upstream API auth (ADR-054).
 */

/* eslint-disable max-lines-per-function -- comprehensive test coverage requires many test cases */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { UniversalToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { AuthDisabledRuntimeConfig, AuthEnabledRuntimeConfig } from './runtime-config.js';
import { checkMcpClientAuth } from './check-mcp-client-auth.js';

// Mock dependencies
vi.mock('./request-context.js');
vi.mock('./tool-auth-checker.js');
vi.mock('@clerk/mcp-tools/server');
vi.mock('./resource-parameter-validator.js');
vi.mock('@clerk/express');

import type { MachineAuthObject } from '@clerk/backend';
import { getRequestContext } from './request-context.js';
import { toolRequiresAuth } from './tool-auth-checker.js';
import { verifyClerkToken } from '@clerk/mcp-tools/server';
import { validateResourceParameter } from './resource-parameter-validator.js';
import { getAuth } from '@clerk/express';
import { createFakeMachineAuthObject, createFakeExpressRequest } from './test-helpers/fakes.js';

/**
 * Sets getAuth mock return value. Clerk's getAuth is overloaded and returns SessionAuthObject;
 * tests use MachineAuthObject fakes. This bridge is the single cast for Clerk/Vitest typing.
 */
function mockGetAuthReturnValue(authObject: MachineAuthObject<'oauth_token'>): void {
  vi.mocked(getAuth).mockReturnValue(authObject as unknown as ReturnType<typeof getAuth>);
}

describe('checkMcpClientAuth', () => {
  const mockLogger: Logger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  };

  const resourceUrl = 'https://example.com/mcp';
  const toolName: UniversalToolName = 'get-key-stages';

  const createMockConfig = (
    dangerouslyDisableAuth: boolean,
  ): AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig =>
    dangerouslyDisableAuth
      ? ({
          env: {
            OAK_API_KEY: 'test',
            ELASTICSEARCH_URL: 'http://fake:9200',
            ELASTICSEARCH_API_KEY: 'fake-key',
          },
          dangerouslyDisableAuth: true,
          useStubTools: false,
          version: '1.0.0',
          vercelHostnames: [],
        } satisfies AuthDisabledRuntimeConfig)
      : ({
          env: {
            OAK_API_KEY: 'test',
            CLERK_PUBLISHABLE_KEY: 'pk_test',
            CLERK_SECRET_KEY: 'sk_test',
            ELASTICSEARCH_URL: 'http://fake:9200',
            ELASTICSEARCH_API_KEY: 'fake-key',
          },
          dangerouslyDisableAuth: false,
          useStubTools: false,
          version: '1.0.0',
          vercelHostnames: [],
        } satisfies AuthEnabledRuntimeConfig);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DANGEROUSLY_DISABLE_AUTH bypass', () => {
    it('should return undefined when auth is disabled, even for protected tools', () => {
      const config = createMockConfig(true);
      vi.mocked(toolRequiresAuth).mockReturnValue(true);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeUndefined();
      expect(mockLogger.info).toHaveBeenCalledWith('Auth disabled via DANGEROUSLY_DISABLE_AUTH', {
        toolName,
      });
      // Should NOT call any auth checking functions
      expect(getRequestContext).not.toHaveBeenCalled();
      expect(verifyClerkToken).not.toHaveBeenCalled();
      expect(validateResourceParameter).not.toHaveBeenCalled();
    });

    it('should return undefined when auth is disabled for any tool', () => {
      const config = createMockConfig(true);
      vi.mocked(toolRequiresAuth).mockReturnValue(false);

      const result = checkMcpClientAuth('get-changelog-latest', resourceUrl, mockLogger, config);

      expect(result).toBeUndefined();
      expect(mockLogger.info).toHaveBeenCalledWith('Auth disabled via DANGEROUSLY_DISABLE_AUTH', {
        toolName: 'get-changelog-latest',
      });
    });

    it('should perform normal auth checks when auth is NOT disabled', () => {
      const config = createMockConfig(false);
      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(undefined);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      // Should have attempted to get request context
      expect(getRequestContext).toHaveBeenCalled();
      // Should return auth error when no context
      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
    });
  });

  describe('public tools', () => {
    it('should return undefined for tools that do not require auth', () => {
      const config = createMockConfig(false);
      vi.mocked(toolRequiresAuth).mockReturnValue(false);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeUndefined();
      // Should not log auth bypass when tool is public
      expect(mockLogger.info).not.toHaveBeenCalledWith(
        expect.stringContaining('Auth disabled'),
        expect.anything(),
      );
    });
  });

  describe('protected tools with auth checks enabled', () => {
    it('should return auth error when no request context', () => {
      const config = createMockConfig(false);
      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(undefined);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith('No request context available', { toolName });
    });

    it('should return auth error when token verification fails', () => {
      const config = createMockConfig(false);
      const mockReq = createFakeExpressRequest({
        headers: { authorization: 'Bearer invalid-token' },
      });

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq);
      mockGetAuthReturnValue(
        createFakeMachineAuthObject({
          isAuthenticated: false,
          userId: null,
          clientId: null,
          scopes: null,
        }),
      );
      vi.mocked(verifyClerkToken).mockReturnValue(undefined);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith('MCP client token verification failed', {
        toolName,
      });
    });

    it('should return auth error when resource validation fails', () => {
      const config = createMockConfig(false);
      const mockReq = createFakeExpressRequest({
        headers: { authorization: 'Bearer valid-token' },
      });

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq);
      mockGetAuthReturnValue(
        createFakeMachineAuthObject({
          isAuthenticated: true,
          userId: 'user_123',
          clientId: 'client_123',
          scopes: ['email'],
        }),
      );
      vi.mocked(verifyClerkToken).mockReturnValue({
        token: 'valid-token',
        clientId: 'client_123',
        scopes: ['email'],
        extra: { userId: 'user_123' },
      });
      vi.mocked(validateResourceParameter).mockReturnValue({
        valid: false,
        reason: 'Resource mismatch',
      });

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith('Resource parameter validation failed', {
        toolName,
        reason: 'Resource mismatch',
      });
    });

    it('should return undefined when all auth checks pass', () => {
      const config = createMockConfig(false);
      const mockReq = createFakeExpressRequest({
        headers: { authorization: 'Bearer valid-token' },
      });

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq);
      mockGetAuthReturnValue(
        createFakeMachineAuthObject({
          isAuthenticated: true,
          userId: 'user_123',
          clientId: 'client_123',
          scopes: ['email'],
        }),
      );
      vi.mocked(verifyClerkToken).mockReturnValue({
        token: 'valid-token',
        clientId: 'client_123',
        scopes: ['email'],
        extra: { userId: 'user_123' },
      });
      vi.mocked(validateResourceParameter).mockReturnValue({
        valid: true,
      });

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeUndefined();
      expect(mockLogger.info).toHaveBeenCalledWith('MCP client authentication successful', {
        toolName,
        userId: 'user_123',
      });
    });
  });

  describe('OAuth bearer token without req.auth', () => {
    it('should verify bearer token and extract userId from verified claims', () => {
      const config = createMockConfig(false);
      const mockReq = createFakeExpressRequest({
        headers: { authorization: 'Bearer valid-jwt-token' },
      });

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq);
      mockGetAuthReturnValue(
        createFakeMachineAuthObject({
          isAuthenticated: true,
          userId: 'user_from_jwt',
          clientId: 'client_123',
          scopes: ['mcp:invoke'],
        }),
      );
      vi.mocked(verifyClerkToken).mockReturnValue({
        token: 'valid-jwt-token',
        clientId: 'client_123',
        scopes: ['mcp:invoke'],
        extra: { userId: 'user_from_jwt' },
      });
      vi.mocked(validateResourceParameter).mockReturnValue({
        valid: true,
      });

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeUndefined(); // Auth passes
      expect(getAuth).toHaveBeenCalledWith(mockReq, { acceptsToken: 'oauth_token' });
      expect(mockLogger.info).toHaveBeenCalledWith('MCP client authentication successful', {
        toolName,
        userId: 'user_from_jwt',
      });
    });

    it('should return auth error when no Authorization header', () => {
      const config = createMockConfig(false);
      const mockReq = createFakeExpressRequest({ headers: {} });

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'MCP client auth required but no token provided',
        { toolName },
      );
      expect(getAuth).not.toHaveBeenCalled();
    });

    it('should return auth error when Authorization header is not Bearer', () => {
      const config = createMockConfig(false);
      const mockReq = createFakeExpressRequest({
        headers: { authorization: 'Basic credentials' },
      });

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'MCP client auth required but no token provided',
        { toolName },
      );
      expect(getAuth).not.toHaveBeenCalled();
    });

    it('should return auth error when bearer token verification fails', () => {
      const config = createMockConfig(false);
      const mockReq = createFakeExpressRequest({
        headers: { authorization: 'Bearer invalid-jwt-token' },
      });

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq);
      mockGetAuthReturnValue(
        createFakeMachineAuthObject({
          isAuthenticated: false,
          userId: null,
          clientId: null,
          scopes: null,
        }),
      );
      vi.mocked(verifyClerkToken).mockReturnValue(undefined);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
      expect(getAuth).toHaveBeenCalledWith(mockReq, { acceptsToken: 'oauth_token' });
      expect(mockLogger.warn).toHaveBeenCalledWith('MCP client token verification failed', {
        toolName,
      });
    });
  });
});
