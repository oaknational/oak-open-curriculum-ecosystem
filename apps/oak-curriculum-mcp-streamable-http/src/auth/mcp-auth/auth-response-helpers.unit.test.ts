import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import {
  createFakeAuthInfo,
  createFakeLogger,
  createMockExpressRequest,
  createMockExpressResponse,
} from '../../test-helpers/fakes.js';
import { handleAuthSuccess } from './auth-response-helpers.js';

function createAuthSuccessMocks(options?: {
  readonly correlationId?: string;
  readonly method?: string;
  readonly path?: string;
}): { readonly req: Request; readonly res: Response } {
  const req = createMockExpressRequest({
    method: options?.method === 'GET' ? 'GET' : 'POST',
    path: options?.path ?? '/mcp',
  });
  const res = createMockExpressResponse();
  res.locals = {
    correlationId: options?.correlationId ?? 'corr-123',
  };

  return {
    req,
    res,
  };
}

describe('handleAuthSuccess', () => {
  it('logs only non-PII auth success metadata when user context is present', () => {
    const logger = createFakeLogger();
    const authInfo = createFakeAuthInfo({
      clientId: 'client_abc',
      scopes: ['openid', 'email', 'profile'],
      extra: { userId: 'user_123' },
    });
    const { req, res } = createAuthSuccessMocks();

    handleAuthSuccess(req, res, logger, authInfo);

    expect(logger.debug).toHaveBeenCalledWith('Authentication successful', {
      method: 'POST',
      path: '/mcp',
      correlationId: 'corr-123',
      clientId: 'client_abc',
      scopeCount: 3,
      hasUserContext: true,
    });
    const debugCalls = vi.mocked(logger.debug).mock.calls;
    expect(debugCalls[0]?.[1]).not.toHaveProperty('userId');
  });

  it('does not emit userId when the auth context has no user information', () => {
    const logger = createFakeLogger();
    const authInfo = createFakeAuthInfo({
      clientId: 'client_xyz',
      scopes: ['openid'],
      extra: {},
    });
    const { req, res } = createAuthSuccessMocks({
      correlationId: 'corr-999',
      method: 'GET',
      path: '/oauth/callback',
    });

    handleAuthSuccess(req, res, logger, authInfo);

    expect(logger.debug).toHaveBeenCalledWith('Authentication successful', {
      method: 'GET',
      path: '/oauth/callback',
      correlationId: 'corr-999',
      clientId: 'client_xyz',
      scopeCount: 1,
      hasUserContext: false,
    });
    const debugCalls = vi.mocked(logger.debug).mock.calls;
    expect(debugCalls[0]?.[1]).not.toHaveProperty('userId');
  });
});
