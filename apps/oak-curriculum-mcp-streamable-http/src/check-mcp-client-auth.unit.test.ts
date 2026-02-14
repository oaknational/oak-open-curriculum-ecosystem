/**
 * Unit tests for MCP client authentication checking.
 *
 * Tests the preventive authentication layer that checks MCP client auth
 * BEFORE SDK execution. This is separate from upstream API auth (ADR-054).
 */

/* eslint-disable max-lines-per-function -- comprehensive test coverage requires many test cases */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';
import type { UniversalToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { RuntimeConfig } from './runtime-config.js';
import { checkMcpClientAuth } from './check-mcp-client-auth.js';

// Mock dependencies
vi.mock('./request-context.js');
vi.mock('./tool-auth-checker.js');
vi.mock('./auth/mcp-auth/verify-clerk-token.js');
vi.mock('./resource-parameter-validator.js');
vi.mock('@clerk/express');

import type { MachineAuthObject } from '@clerk/backend';
import { getRequestContext } from './request-context.js';
import { toolRequiresAuth } from './tool-auth-checker.js';
import { verifyClerkToken } from './auth/mcp-auth/verify-clerk-token.js';
import { validateResourceParameter } from './resource-parameter-validator.js';
import { getAuth } from '@clerk/express';

/**
 * Creates a mock MachineAuthObject for testing.
 * Uses explicit typing to avoid Vitest/Clerk type inference conflicts.
 */
function createMockAuthObject(
  overrides: Partial<{
    isAuthenticated: boolean;
    userId: string | null;
    clientId: string | null;
    scopes: readonly string[] | null;
  }>,
): MachineAuthObject<'oauth_token'> {
  const base = {
    tokenType: 'oauth_token' as const,
    id: overrides.isAuthenticated ? 'auth_123' : null,
    subject: overrides.userId ?? null,
    getToken: () => Promise.resolve(overrides.isAuthenticated ? 'token' : null),
    has: () => overrides.isAuthenticated ?? false,
    debug: () => (overrides.isAuthenticated ? { userId: overrides.userId } : {}),
    ...overrides,
  };
  return base as MachineAuthObject<'oauth_token'>;
}

/**
 * Type-safe mock setter for getAuth.
 * Works around Vitest/Clerk overload inference issues by using unknown intermediate.
 */
function mockGetAuthReturnValue(authObject: MachineAuthObject<'oauth_token'>): void {
  // Use unknown as intermediate to avoid SessionAuthObject inference
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

  const createMockConfig = (dangerouslyDisableAuth: boolean): RuntimeConfig => ({
    env: {} as RuntimeConfig['env'],
    dangerouslyDisableAuth,
    useStubTools: false,
    version: '1.0.0',
    vercelHostnames: [],
  });

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
      const mockReq = {
        headers: { authorization: 'Bearer invalid-token' },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);
      mockGetAuthReturnValue(
        createMockAuthObject({
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
      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);
      mockGetAuthReturnValue(
        createMockAuthObject({
          isAuthenticated: true,
          userId: 'user_123',
          clientId: 'client_123',
          scopes: ['openid', 'email'],
        }),
      );
      vi.mocked(verifyClerkToken).mockReturnValue({
        token: 'valid-token',
        clientId: 'client_123',
        scopes: ['openid', 'email'],
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
      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);
      mockGetAuthReturnValue(
        createMockAuthObject({
          isAuthenticated: true,
          userId: 'user_123',
          clientId: 'client_123',
          scopes: ['openid', 'email'],
        }),
      );
      vi.mocked(verifyClerkToken).mockReturnValue({
        token: 'valid-token',
        clientId: 'client_123',
        scopes: ['openid', 'email'],
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
      const mockReq = {
        headers: { authorization: 'Bearer valid-jwt-token' },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);
      mockGetAuthReturnValue(
        createMockAuthObject({
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
      const mockReq = {
        headers: {}, // No Authorization header
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);

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
      const mockReq = {
        headers: { authorization: 'Basic credentials' },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);

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
      const mockReq = {
        headers: { authorization: 'Bearer invalid-jwt-token' },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);
      mockGetAuthReturnValue(
        createMockAuthObject({
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
