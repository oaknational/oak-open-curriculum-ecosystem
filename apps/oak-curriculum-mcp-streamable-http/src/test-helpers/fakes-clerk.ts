/**
 * Clerk authentication test fakes.
 *
 * Creates `MachineAuthObject<'oauth_token'>` fakes for Clerk token
 * verification tests. Satisfies the Clerk type contract structurally —
 * no type assertions.
 *
 * For "missing field" tests (null userId, null scopes, etc.), use the
 * unauthenticated variant or pass raw `unknown` objects to test boundary
 * validation — do not construct type-violating authenticated objects.
 */

import type { MachineAuthObject } from '@clerk/backend';

/**
 * Creates a MachineAuthObject fake for Clerk token verification tests.
 *
 * Returns an authenticated object with valid string fields, or an
 * unauthenticated object with null fields. For tests that need invalid
 * data (e.g. null clientId on an authenticated object), construct the
 * object directly as `unknown` and bypass the type system — that IS
 * what the test is proving (defence against runtime type violations).
 */
export function createFakeMachineAuthObject(
  overrides: Partial<{
    isAuthenticated: boolean;
    userId: string;
    clientId: string;
    scopes: readonly string[];
  }> = {},
): MachineAuthObject<'oauth_token'> {
  if (overrides.isAuthenticated === false) {
    return createUnauthenticatedFakeMachineAuthObject();
  }
  return createAuthenticatedFakeMachineAuthObject(overrides);
}

function createUnauthenticatedFakeMachineAuthObject(): MachineAuthObject<'oauth_token'> {
  return {
    tokenType: 'oauth_token',
    id: null,
    subject: null,
    scopes: null,
    userId: null,
    clientId: null,
    getToken: (): Promise<null> => Promise.resolve(null),
    has: () => false,
    debug: () => ({}),
    isAuthenticated: false,
  };
}

function createAuthenticatedFakeMachineAuthObject(
  overrides: Partial<{
    userId: string;
    clientId: string;
    scopes: readonly string[];
    tokenType: string;
  }>,
): MachineAuthObject<'oauth_token'> {
  const userId = overrides.userId ?? 'user';
  const clientId = overrides.clientId ?? 'client';
  const scopes = overrides.scopes ?? [];
  return {
    tokenType: 'oauth_token',
    id: 'auth_123',
    subject: userId,
    scopes: Array.from(scopes),
    userId,
    clientId,
    getToken: (): Promise<string> => Promise.resolve('token'),
    has: () => true,
    debug: () => ({ userId, clientId, scopes }),
    isAuthenticated: true,
  };
}
