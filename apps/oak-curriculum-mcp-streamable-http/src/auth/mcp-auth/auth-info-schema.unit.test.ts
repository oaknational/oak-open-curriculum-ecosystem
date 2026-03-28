/**
 * Unit tests for the shared authInfoSchema.
 *
 * Proves .strict() boundary validation behaviour:
 * - Accepts valid AuthInfo shapes
 * - Rejects unknown fields (strict mode)
 * - Rejects malformed data
 */

import { describe, it, expect } from 'vitest';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { Request } from 'express';
import { authInfoSchema } from './auth-info-schema.js';

describe('authInfoSchema', () => {
  const validAuthInfo = {
    token: 'tok_test_123',
    clientId: 'client_abc',
    scopes: ['email', 'profile'],
  };

  it('accepts a valid AuthInfo with required fields only', () => {
    const result = authInfoSchema.safeParse(validAuthInfo);
    expect(result.success).toBe(true);
  });

  it('accepts a valid AuthInfo with all optional fields', () => {
    const result = authInfoSchema.safeParse({
      ...validAuthInfo,
      expiresAt: 1234567890,
      resource: new URL('https://example.com/mcp'),
      extra: { userId: 'user_123' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown fields in strict mode', () => {
    const result = authInfoSchema.safeParse({
      ...validAuthInfo,
      unexpectedField: 'should fail',
    });
    expect(result.success).toBe(false);
  });

  it('rejects malformed token (not a string)', () => {
    const result = authInfoSchema.safeParse({
      ...validAuthInfo,
      token: 123,
    });
    expect(result.success).toBe(false);
  });

  it('rejects malformed scopes (not an array)', () => {
    const result = authInfoSchema.safeParse({
      ...validAuthInfo,
      scopes: 'not-array',
    });
    expect(result.success).toBe(false);
  });

  it('local Request.auth augmentation is compatible with SDK AuthInfo', () => {
    // Compile-time check: if the SDK changes AuthInfo shape, this will
    // fail type-check — catching drift between our local declare module
    // augmentation in mcp-auth.ts and the SDK's actual type.
    const authInfo: AuthInfo = {
      token: 'test',
      clientId: 'c',
      scopes: ['s'],
      extra: { userId: 'u' },
    };
    // Express Request.auth (from our local augmentation) accepts AuthInfo
    const reqAuth: Request['auth'] = authInfo;
    expect(reqAuth).toBe(authInfo);
  });
});
