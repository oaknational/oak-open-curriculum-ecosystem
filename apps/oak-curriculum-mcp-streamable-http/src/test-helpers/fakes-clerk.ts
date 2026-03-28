/**
 * Clerk authentication test fakes.
 *
 * Creates `MachineAuthObject<'oauth_token'>` fakes for Clerk token
 * verification tests. Supports both authenticated and unauthenticated
 * states, and nullable field overrides for edge-case testing.
 */

import type { MachineAuthObject } from '@clerk/backend';

/**
 * Creates a MachineAuthObject fake for Clerk token verification tests.
 * For "missing field" tests we return authenticated shape with nulls; Clerk type requires string.
 */
export function createFakeMachineAuthObject(
  overrides: Partial<{
    isAuthenticated: boolean;
    userId: string | null;
    clientId: string | null;
    scopes: readonly string[] | null;
    /** Override tokenType for conformance tests that need wrong values at runtime. */
    tokenType: string;
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
    userId: string | null;
    clientId: string | null;
    scopes: readonly string[] | null;
    tokenType: string;
  }>,
): MachineAuthObject<'oauth_token'> {
  const resolvedUserId = overrides.userId !== undefined ? overrides.userId : 'user';
  const resolvedClientId = overrides.clientId !== undefined ? overrides.clientId : 'client';
  const resolvedScopes = overrides.scopes !== undefined ? overrides.scopes : [];
  const tokenType = overrides.tokenType ?? 'oauth_token';
  const out = {
    tokenType,
    id: 'auth_123',
    subject: resolvedUserId,
    scopes: resolvedScopes === null ? null : Array.from(resolvedScopes),
    userId: resolvedUserId,
    clientId: resolvedClientId,
    getToken: (): Promise<string> => Promise.resolve('token'),
    has: () => true,
    debug: () => ({
      userId: overrides.userId,
      clientId: overrides.clientId,
      scopes: overrides.scopes,
    }),
    isAuthenticated: true as const,
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Authenticated shape with nulls for "missing field" tests; Clerk type does not allow null
  return out as MachineAuthObject<'oauth_token'>;
}
