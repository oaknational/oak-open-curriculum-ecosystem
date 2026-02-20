import { describe, expect, it } from 'vitest';

import {
  buildAuthorizeRequestUrl,
  extractAuthorizationCode,
  type OAuthApplicationInfo,
} from './clerk-oauth-token.js';

describe('clerk-oauth-token helpers', () => {
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
