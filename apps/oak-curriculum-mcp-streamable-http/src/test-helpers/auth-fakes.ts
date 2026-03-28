import type { MachineAuthObject } from '@clerk/backend';

export function createFakeMachineAuthObject(
  overrides: Partial<{
    isAuthenticated: boolean;
    userId: string | null;
    clientId: string | null;
    scopes: readonly string[] | null;
  }> = {},
): MachineAuthObject<'oauth_token'> {
  const isAuthenticated = overrides.isAuthenticated ?? true;
  const userId = overrides.userId;
  const clientId = overrides.clientId;
  const scopes = overrides.scopes;

  if (isAuthenticated) {
    const resolvedUserId = userId !== undefined ? userId : 'user';
    const resolvedClientId = clientId !== undefined ? clientId : 'client';
    const resolvedScopes = scopes !== undefined ? scopes : [];
    const out = {
      tokenType: 'oauth_token' as const,
      id: 'auth_123',
      subject: resolvedUserId,
      scopes: resolvedScopes === null ? null : Array.from(resolvedScopes),
      userId: resolvedUserId,
      clientId: resolvedClientId,
      getToken: (): Promise<string> => Promise.resolve('token'),
      has: () => true,
      debug: () => ({ userId, clientId, scopes }),
      isAuthenticated: true as const,
    };

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Clerk type does not allow nulls but tests need to simulate missing fields
    return out as MachineAuthObject<'oauth_token'>;
  }

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
