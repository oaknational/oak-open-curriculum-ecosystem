/**
 * Unit tests for MCP client authentication checking.
 *
 * Tests the preventive authentication layer that checks MCP client auth
 * BEFORE SDK execution. This is separate from upstream API auth (ADR-054).
 *
 * @module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';
import type { UniversalToolName } from '@oaknational/oak-curriculum-sdk';
import type { RuntimeConfig } from './runtime-config.js';
import { checkMcpClientAuth } from './check-mcp-client-auth.js';

// Mock dependencies
vi.mock('./request-context.js');
vi.mock('./auth/tool-auth-context.js');
vi.mock('./tool-auth-checker.js');
vi.mock('./auth/mcp-auth/verify-clerk-token.js');
vi.mock('./resource-parameter-validator.js');

import { getRequestContext } from './request-context.js';
import { extractAuthContext } from './auth/tool-auth-context.js';
import { toolRequiresAuth } from './tool-auth-checker.js';
import { verifyClerkToken } from './auth/mcp-auth/verify-clerk-token.js';
import { validateResourceParameter } from './resource-parameter-validator.js';

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
      expect(extractAuthContext).not.toHaveBeenCalled();
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
    it('should return auth error when no auth context', () => {
      const config = createMockConfig(false);
      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(undefined);

      const result = checkMcpClientAuth(toolName, resourceUrl, mockLogger, config);

      expect(result).toBeDefined();
      expect(result?.isError).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'MCP client auth required but no token provided',
        { toolName },
      );
    });

    it('should return auth error when token verification fails', () => {
      const config = createMockConfig(false);
      const mockReq = {
        auth: {
          userId: null,
          clientId: null,
          isAuthenticated: false,
          tokenType: 'oauth_token' as const,
          id: null,
          subject: null,
          scopes: null,
          getToken: () => Promise.resolve(null),
          has: () => false,
          debug: () => ({}),
        },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);
      vi.mocked(extractAuthContext).mockReturnValue({
        userId: '123',
        token: 'invalid-token',
      });
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
        auth: {
          userId: 'user_123',
          clientId: 'client_123',
          isAuthenticated: true,
          tokenType: 'oauth_token' as const,
          id: 'auth_123',
          subject: 'user_123',
          scopes: null,
          getToken: () => Promise.resolve('valid-token'),
          has: () => true,
          debug: () => ({ userId: 'user_123' }),
        },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);
      vi.mocked(extractAuthContext).mockReturnValue({
        userId: 'user_123',
        token: 'valid-token',
      });
      vi.mocked(verifyClerkToken).mockReturnValue({
        token: 'valid-token',
        clientId: 'client_123',
        scopes: ['openid', 'email'],
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
        auth: {
          userId: 'user_123',
          clientId: 'client_123',
          isAuthenticated: true,
          tokenType: 'oauth_token' as const,
          id: 'auth_123',
          subject: 'user_123',
          scopes: null,
          getToken: () => Promise.resolve('valid-token'),
          has: () => true,
          debug: () => ({ userId: 'user_123' }),
        },
      };

      vi.mocked(toolRequiresAuth).mockReturnValue(true);
      vi.mocked(getRequestContext).mockReturnValue(mockReq as never);
      vi.mocked(extractAuthContext).mockReturnValue({
        userId: 'user_123',
        token: 'valid-token',
      });
      vi.mocked(verifyClerkToken).mockReturnValue({
        token: 'valid-token',
        clientId: 'client_123',
        scopes: ['openid', 'email'],
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
});
