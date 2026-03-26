/**
 * Conformance tests for `verifyClerkToken` from `@clerk/mcp-tools/server`.
 *
 * These tests guard the library function contract for the **entire app**, not
 * just the `mcp-auth/` module. Both `mcp-auth-clerk.ts` (inside this module)
 * and `check-mcp-client-auth.ts` (outside this module) depend on the same
 * library function. Any behavioural drift caught here protects both call sites.
 *
 * Originally written for the hand-rolled implementation, now retained as
 * conformance tests per ADR-142 to detect library behaviour changes.
 *
 * **Version bump reminder**: When upgrading `@clerk/mcp-tools`, re-run these
 * tests and verify the `console.error` spy assertion still holds. See ADR-142
 * for the full re-evaluation checklist.
 *
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MachineAuthObject } from '@clerk/backend';
import { verifyClerkToken } from '@clerk/mcp-tools/server';
import { createFakeMachineAuthObject } from '../../test-helpers/fakes.js';

describe('verifyClerkToken', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

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

  it('should not produce unexpected console.error output on the happy path', () => {
    const auth = createFakeMachineAuthObject({
      isAuthenticated: true,
      userId: 'user-456',
      clientId: 'client-123',
      scopes: ['mcp:invoke'],
    });

    verifyClerkToken(auth, 'valid-token');

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
