/**
 * Unit tests for verifyClerkToken function.
 *
 * These tests verify that Clerk OAuth token verification works correctly,
 * returning AuthInfo for valid tokens and undefined for invalid ones.
 *
 * This is a pure function with no side effects, making it ideal for unit testing.
 *
 * @module auth/mcp-auth/verify-clerk-token.unit.test
 */

import { describe, it, expect } from 'vitest';
import type { MachineAuthObject } from '@clerk/backend';
import { verifyClerkToken } from './verify-clerk-token.js';

describe('verifyClerkToken', () => {
  it('should return undefined when auth is not authenticated', () => {
    const auth = {
      isAuthenticated: false,
      tokenType: 'oauth_token',
      clientId: null,
      scopes: null,
      userId: null,
    } as unknown as MachineAuthObject<'oauth_token'>;

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when token is missing', () => {
    const auth = {
      isAuthenticated: true,
      tokenType: 'oauth_token',
      clientId: 'client-123',
      scopes: ['mcp:invoke', 'mcp:read'],
      userId: 'user-456',
    } as unknown as MachineAuthObject<'oauth_token'>;

    const result = verifyClerkToken(auth, undefined);

    expect(result).toBeUndefined();
  });

  it('should return undefined when tokenType is not oauth_token', () => {
    // Note: TypeScript prevents this at compile time, but we test runtime behavior
    const auth = {
      isAuthenticated: true,
      tokenType: 'session_token', // Wrong type
      clientId: 'client-123',
      scopes: ['mcp:invoke', 'mcp:read'],
      userId: 'user-456',
    } as unknown as MachineAuthObject<'oauth_token'>;

    expect(() => {
      verifyClerkToken(auth, 'some-token');
    }).toThrow("the auth() function must be called with acceptsToken: 'oauth_token'");
  });

  it('should return undefined when clientId is missing', () => {
    const auth = {
      isAuthenticated: true,
      tokenType: 'oauth_token',
      clientId: null,
      scopes: ['mcp:invoke', 'mcp:read'],
      userId: 'user-456',
    } as unknown as MachineAuthObject<'oauth_token'>;

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when scopes is missing', () => {
    const auth = {
      isAuthenticated: true,
      tokenType: 'oauth_token',
      clientId: 'client-123',
      scopes: null,
      userId: 'user-456',
    } as unknown as MachineAuthObject<'oauth_token'>;

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when userId is missing', () => {
    const auth = {
      isAuthenticated: true,
      tokenType: 'oauth_token',
      clientId: 'client-123',
      scopes: ['mcp:invoke', 'mcp:read'],
      userId: null,
    } as unknown as MachineAuthObject<'oauth_token'>;

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return AuthInfo when all required fields are present and valid', () => {
    const auth = {
      isAuthenticated: true,
      tokenType: 'oauth_token',
      clientId: 'client-123',
      scopes: ['mcp:invoke', 'mcp:read'],
      userId: 'user-456',
    } as unknown as MachineAuthObject<'oauth_token'>;

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
    const auth = {
      isAuthenticated: true,
      tokenType: 'oauth_token',
      clientId: 'test-client',
      scopes: ['custom:scope', 'another:scope'],
      userId: 'test-user',
    } as unknown as MachineAuthObject<'oauth_token'>;

    const token = 'specific-token-value';
    const result = verifyClerkToken(auth, token);

    expect(result?.token).toBe('specific-token-value');
    expect(result?.scopes).toEqual(['custom:scope', 'another:scope']);
    expect(result?.clientId).toBe('test-client');
    expect(result?.extra?.userId).toBe('test-user');
  });
});
