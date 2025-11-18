import { describe, expect, it } from 'vitest';

import {
  buildAuthorizeRequestUrl,
  createInitialCookieJar,
  extractAuthorizationCode,
  serialiseCookies,
  type OAuthApplicationInfo,
  type SmokeIdentity,
} from './clerk-oauth-token.js';

function createIdentity(overrides?: Partial<SmokeIdentity>): SmokeIdentity {
  return {
    userId: 'user_123',
    clientId: 'client_456',
    sessionId: 'sess_789',
    sessionJwt: 'session.jwt',
    devBrowserToken: 'testing-token',
    ...(overrides ?? {}),
  };
}

describe('clerk-oauth-token helpers', () => {
  it('serialises cookie jar entries in insertion order', () => {
    const jar = new Map<string, string>([
      ['first', 'alpha'],
      ['second', 'beta'],
      ['third', 'gamma'],
    ]);

    expect(serialiseCookies(jar)).toBe('first=alpha; second=beta; third=gamma');
  });

  it('builds a cookie jar seeded with Clerk dev-browser state', () => {
    const identity = createIdentity({
      devBrowserToken: 'db-token',
      clientId: 'client_X',
      sessionId: 'sess_Y',
      sessionJwt: 'jwt_Z',
    });

    const jar = createInitialCookieJar(identity);

    expect(jar.get('__clerk_db_jwt')).toBe('db-token');
    expect(jar.get('__client')).toBe('client_X');
    expect(jar.get('__session')).toBe('sess_Y');
    expect(jar.get('__session_jwt')).toBe('jwt_Z');
  });

  it('extracts authorisation code when state matches', () => {
    const redirect = 'https://example.com/callback?code=abc123&state=STATE';
    expect(extractAuthorizationCode(redirect, 'STATE')).toBe('abc123');
  });

  it('throws when the returned state does not match the expected value', () => {
    const redirect = 'https://example.com/callback?code=abc123&state=DIFFERENT';
    expect(() => extractAuthorizationCode(redirect, 'EXPECTED')).toThrowError(
      /OAuth state mismatch/i,
    );
  });

  it('constructs an authorise URL with PKCE parameters', () => {
    const app: OAuthApplicationInfo = {
      id: 'oa_123',
      clientId: 'client_abc',
      scopes: 'email profile',
      authorizeUrl: 'https://example.clerk.dev/oauth/authorize',
      tokenFetchUrl: 'https://example.clerk.dev/oauth/token',
    };

    const result = buildAuthorizeRequestUrl(app, 'https://callback', 'challenge', 'STATE');

    expect(result).toContain('client_id=client_abc');
    expect(result).toContain('redirect_uri=https%3A%2F%2Fcallback');
    expect(result).toContain('code_challenge=challenge');
    expect(result).toContain('state=STATE');
  });
});
