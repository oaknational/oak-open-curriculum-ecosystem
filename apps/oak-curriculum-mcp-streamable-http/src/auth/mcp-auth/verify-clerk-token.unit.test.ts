/**
 * Unit tests for verifyClerkToken function.
 *
 * These tests verify that Clerk OAuth token verification works correctly,
 * returning AuthInfo for valid tokens and undefined for invalid ones.
 *
 * This is a pure function with no side effects, making it ideal for unit testing.
 *
 */

import { describe, it, expect } from 'vitest';
import type { MachineAuthObject } from '@clerk/backend';
import { verifyClerkToken } from './verify-clerk-token.js';
import { createFakeMachineAuthObject } from '../../test-helpers/fakes.js';

describe('verifyClerkToken', () => {
  it('should return undefined when auth is not authenticated', () => {
    const auth = createFakeMachineAuthObject({
      isAuthenticated: false,
      userId: null,
      clientId: null,
      scopes: null,
    });

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when token is missing', () => {
    const auth = createFakeMachineAuthObject({
      isAuthenticated: true,
      userId: 'user-456',
      clientId: 'client-123',
      scopes: ['mcp:invoke', 'mcp:read'],
    });

    const result = verifyClerkToken(auth, undefined);

    expect(result).toBeUndefined();
  });

  it('should return undefined when tokenType is not oauth_token', () => {
    // Deliberately wrong tokenType at runtime; TypeScript would reject at compile time.
    const auth = {
      ...createFakeMachineAuthObject({
        isAuthenticated: true,
        userId: 'user-456',
        clientId: 'client-123',
        scopes: ['mcp:invoke', 'mcp:read'],
      }),
      tokenType: 'session_token',
    } as unknown as MachineAuthObject<'oauth_token'>;

    expect(() => {
      verifyClerkToken(auth, 'some-token');
    }).toThrow("the auth() function must be called with acceptsToken: 'oauth_token'");
  });

  it('should return undefined when clientId is missing', () => {
    const auth = createFakeMachineAuthObject({
      isAuthenticated: true,
      userId: 'user-456',
      clientId: null,
      scopes: ['mcp:invoke', 'mcp:read'],
    });

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when scopes is missing', () => {
    const auth = createFakeMachineAuthObject({
      isAuthenticated: true,
      userId: 'user-456',
      clientId: 'client-123',
      scopes: null,
    });

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when userId is missing', () => {
    const auth = createFakeMachineAuthObject({
      isAuthenticated: true,
      userId: null,
      clientId: 'client-123',
      scopes: ['mcp:invoke', 'mcp:read'],
    });

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return AuthInfo when all required fields are present and valid', () => {
    const auth = createFakeMachineAuthObject({
      isAuthenticated: true,
      userId: 'user-456',
      clientId: 'client-123',
      scopes: ['mcp:invoke', 'mcp:read'],
    });

    const token = 'valid-oauth-token-xyz';
    const result = verifyClerkToken(auth, token);

    expect(result).toBeDefined();
    expect(result).toEqual({
      token: 'valid-oauth-token-xyz',
      scopes: ['mcp:invoke', 'mcp:read'],
      clientId: 'client-123',
      extra: { userId: 'user-456' },
    });
  });

  it('should preserve exact token and scope values', () => {
    const auth = createFakeMachineAuthObject({
      isAuthenticated: true,
      userId: 'test-user',
      clientId: 'test-client',
      scopes: ['custom:scope', 'another:scope'],
    });

    const token = 'specific-token-value';
    const result = verifyClerkToken(auth, token);

    expect(result?.token).toBe('specific-token-value');
    expect(result?.scopes).toEqual(['custom:scope', 'another:scope']);
    expect(result?.clientId).toBe('test-client');
    expect(result?.extra?.userId).toBe('test-user');
  });
});
