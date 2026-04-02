/**
 * Conformance tests for `verifyClerkToken` from `@clerk/mcp-tools/server`.
 *
 * These tests guard the library function contract for the **entire app**, not
 * just the `mcp-auth/` module. Both `mcp-auth-clerk.ts` (inside this module)
 * and `check-mcp-client-auth.ts` (outside this module) depend on the same
 * library function. Any behavioural drift caught here protects both call sites.
 *
 * Tests for "missing field" edge cases (null clientId, null scopes, null userId)
 * construct raw objects to bypass Clerk's type contract intentionally. These
 * prove defence-in-depth: verifyClerkToken handles runtime type violations
 * gracefully even though Clerk's types say they cannot occur.
 *
 * **Version bump reminder**: When upgrading `@clerk/mcp-tools`, re-run these
 * tests and verify the `console.error` spy assertion still holds. See ADR-142.
 */

import { describe, it, expect } from 'vitest';
import type { MachineAuthObject } from '@clerk/backend';
import { verifyClerkToken } from '@clerk/mcp-tools/server';
import { createFakeMachineAuthObject } from '../../test-helpers/fakes.js';

function assertAuthenticatedAuthObject(
  auth: MachineAuthObject<'oauth_token'>,
): asserts auth is MachineAuthObject<'oauth_token'> & {
  isAuthenticated: true;
  subject: string;
  userId: string;
  clientId: string;
  scopes: string[];
} {
  if (!auth.isAuthenticated) {
    throw new Error('Expected authenticated machine auth object');
  }
}

/**
 * Creates a raw authenticated machine object with deliberate type violations.
 *
 * Bypasses `createFakeMachineAuthObject` because the typed fake cannot
 * produce null values or wrong tokenType on authenticated objects (Clerk's
 * type forbids it). These raw objects test verifyClerkToken's runtime
 * null handling and misconfiguration resilience.
 *
 * The helper mutates a correctly typed fake at runtime so the test can pass
 * invalid values without using type assertions.
 */
function getRuntimeScopes(
  overrides: readonly string[] | null | undefined,
  fallback: readonly string[],
): readonly string[] | null {
  if (overrides === undefined) {
    return fallback;
  }

  if (overrides === null) {
    return null;
  }

  return Array.from(overrides);
}

function getRuntimeStringValue(
  override: string | null | undefined,
  fallback: string,
): string | null {
  return override === undefined ? fallback : override;
}

function createRawAuthObjectWithViolations(
  overrides: Partial<{
    userId: string | null;
    clientId: string | null;
    scopes: readonly string[] | null;
    tokenType: string;
  }>,
): MachineAuthObject<'oauth_token'> {
  const auth = createFakeMachineAuthObject({
    userId: overrides.userId ?? 'user',
    clientId: overrides.clientId ?? 'client',
    scopes: Array.from(overrides.scopes ?? []),
  });
  assertAuthenticatedAuthObject(auth);

  Object.defineProperties(auth, {
    tokenType: {
      configurable: true,
      value: overrides.tokenType ?? 'oauth_token',
      writable: true,
    },
    subject: {
      configurable: true,
      value: getRuntimeStringValue(overrides.userId, auth.subject),
      writable: true,
    },
    userId: {
      configurable: true,
      value: getRuntimeStringValue(overrides.userId, auth.userId),
      writable: true,
    },
    clientId: {
      configurable: true,
      value: getRuntimeStringValue(overrides.clientId, auth.clientId),
      writable: true,
    },
    scopes: {
      configurable: true,
      value: getRuntimeScopes(overrides.scopes, auth.scopes),
      writable: true,
    },
  });

  return auth;
}

describe('verifyClerkToken', () => {
  it('should return undefined when auth is not authenticated', () => {
    const auth = createFakeMachineAuthObject({ isAuthenticated: false });

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when token is missing', () => {
    const auth = createFakeMachineAuthObject({
      userId: 'user-456',
      clientId: 'client-123',
      scopes: ['mcp:invoke', 'mcp:read'],
    });

    const result = verifyClerkToken(auth, undefined);

    expect(result).toBeUndefined();
  });

  it('should throw when tokenType is not oauth_token (runtime type violation)', () => {
    const auth = createRawAuthObjectWithViolations({ tokenType: 'session_token' });

    expect(() => {
      verifyClerkToken(auth, 'some-token');
    }).toThrow("the auth() function must be called with acceptsToken: 'oauth_token'");
  });

  it('should return undefined when clientId is null (runtime type violation)', () => {
    const auth = createRawAuthObjectWithViolations({ clientId: null });

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when scopes is null (runtime type violation)', () => {
    const auth = createRawAuthObjectWithViolations({ scopes: null });

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return undefined when userId is null (runtime type violation)', () => {
    const auth = createRawAuthObjectWithViolations({ userId: null });

    const result = verifyClerkToken(auth, 'some-token');

    expect(result).toBeUndefined();
  });

  it('should return AuthInfo when all required fields are present and valid', () => {
    const auth = createFakeMachineAuthObject({
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
