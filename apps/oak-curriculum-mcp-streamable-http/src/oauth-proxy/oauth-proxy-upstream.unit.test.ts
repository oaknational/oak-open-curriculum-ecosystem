import { describe, it, expect } from 'vitest';

import {
  deriveUpstreamOAuthBaseUrl,
  buildAuthorizeRedirectUrl,
  formatProxyErrorResponse,
  rewriteAuthServerMetadata,
  isUpstreamAuthServerMetadata,
  type UpstreamAuthServerMetadata,
} from './oauth-proxy-upstream.js';

/**
 * Test publishable key encoding: base64('test-instance.clerk.accounts.dev$')
 * = 'dGVzdC1pbnN0YW5jZS5jbGVyay5hY2NvdW50cy5kZXYk'
 */
const TEST_PUBLISHABLE_KEY = 'pk_test_dGVzdC1pbnN0YW5jZS5jbGVyay5hY2NvdW50cy5kZXYk';
const TEST_FAPI_BASE_URL = 'https://test-instance.clerk.accounts.dev';

const TEST_UPSTREAM_METADATA: UpstreamAuthServerMetadata = {
  issuer: TEST_FAPI_BASE_URL,
  authorization_endpoint: `${TEST_FAPI_BASE_URL}/oauth/authorize`,
  token_endpoint: `${TEST_FAPI_BASE_URL}/oauth/token`,
  registration_endpoint: `${TEST_FAPI_BASE_URL}/oauth/register`,
  token_endpoint_auth_methods_supported: ['client_secret_basic', 'none', 'client_secret_post'],
  scopes_supported: ['openid', 'profile', 'email'],
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code', 'refresh_token'],
  code_challenge_methods_supported: ['S256'],
};

describe('deriveUpstreamOAuthBaseUrl', () => {
  it('derives correct FAPI base URL from a valid publishable key', () => {
    const result = deriveUpstreamOAuthBaseUrl(TEST_PUBLISHABLE_KEY);
    expect(result).toBe(TEST_FAPI_BASE_URL);
  });

  it('throws for an empty publishable key', () => {
    expect(() => deriveUpstreamOAuthBaseUrl('')).toThrow();
  });
});

describe('buildAuthorizeRedirectUrl', () => {
  it('appends all query parameters to the upstream authorize URL', () => {
    const params = new URLSearchParams({
      client_id: 'abc123',
      redirect_uri: 'http://localhost/callback',
      response_type: 'code',
      state: 'xyz',
      code_challenge: 'challenge',
      code_challenge_method: 'S256',
      scope: 'openid email',
    });

    const result = buildAuthorizeRedirectUrl(`${TEST_FAPI_BASE_URL}/oauth/authorize`, params);

    expect(result).toContain(`${TEST_FAPI_BASE_URL}/oauth/authorize?`);
    expect(result).toContain('client_id=abc123');
    expect(result).toContain('response_type=code');
    expect(result).toContain('state=xyz');
    expect(result).toContain('code_challenge=challenge');
    expect(result).toContain('code_challenge_method=S256');
    expect(result).toContain('scope=openid+email');
  });

  it('returns the base URL unchanged when no parameters are provided', () => {
    const params = new URLSearchParams();
    const result = buildAuthorizeRedirectUrl(`${TEST_FAPI_BASE_URL}/oauth/authorize`, params);
    expect(result).toBe(`${TEST_FAPI_BASE_URL}/oauth/authorize`);
  });

  it('preserves special characters in parameter values via URL encoding', () => {
    const params = new URLSearchParams({
      redirect_uri: 'http://localhost:3333/callback?foo=bar&baz=qux',
    });

    const result = buildAuthorizeRedirectUrl(`${TEST_FAPI_BASE_URL}/oauth/authorize`, params);
    const parsed = new URL(result);
    expect(parsed.searchParams.get('redirect_uri')).toBe(
      'http://localhost:3333/callback?foo=bar&baz=qux',
    );
  });
});

describe('formatProxyErrorResponse', () => {
  it('creates an OAuth 2.0 error response with error and description', () => {
    const result = formatProxyErrorResponse('temporarily_unavailable', 'Upstream server timed out');
    expect(result).toStrictEqual({
      error: 'temporarily_unavailable',
      error_description: 'Upstream server timed out',
    });
  });

  it('creates an invalid_request error response', () => {
    const result = formatProxyErrorResponse('invalid_request', 'Missing grant_type parameter');
    expect(result).toStrictEqual({
      error: 'invalid_request',
      error_description: 'Missing grant_type parameter',
    });
  });
});

describe('rewriteAuthServerMetadata', () => {
  it('rewrites issuer to local origin', () => {
    const result = rewriteAuthServerMetadata(TEST_UPSTREAM_METADATA, 'http://localhost:3333');
    expect(result.issuer).toBe('http://localhost:3333');
  });

  it('rewrites authorization_endpoint to local origin', () => {
    const result = rewriteAuthServerMetadata(TEST_UPSTREAM_METADATA, 'http://localhost:3333');
    expect(result.authorization_endpoint).toBe('http://localhost:3333/oauth/authorize');
  });

  it('rewrites token_endpoint to local origin', () => {
    const result = rewriteAuthServerMetadata(TEST_UPSTREAM_METADATA, 'http://localhost:3333');
    expect(result.token_endpoint).toBe('http://localhost:3333/oauth/token');
  });

  it('rewrites registration_endpoint to local origin', () => {
    const result = rewriteAuthServerMetadata(TEST_UPSTREAM_METADATA, 'http://localhost:3333');
    expect(result.registration_endpoint).toBe('http://localhost:3333/oauth/register');
  });

  it('preserves capability fields unchanged', () => {
    const result = rewriteAuthServerMetadata(TEST_UPSTREAM_METADATA, 'http://localhost:3333');
    expect(result.token_endpoint_auth_methods_supported).toStrictEqual([
      'client_secret_basic',
      'none',
      'client_secret_post',
    ]);
    expect(result.scopes_supported).toStrictEqual(['openid', 'profile', 'email']);
    expect(result.response_types_supported).toStrictEqual(['code']);
    expect(result.grant_types_supported).toStrictEqual(['authorization_code', 'refresh_token']);
    expect(result.code_challenge_methods_supported).toStrictEqual(['S256']);
  });

  it('works with a production HTTPS origin', () => {
    const result = rewriteAuthServerMetadata(
      TEST_UPSTREAM_METADATA,
      'https://curriculum-mcp.oaknational.dev',
    );
    expect(result.issuer).toBe('https://curriculum-mcp.oaknational.dev');
    expect(result.authorization_endpoint).toBe(
      'https://curriculum-mcp.oaknational.dev/oauth/authorize',
    );
    expect(result.token_endpoint).toBe('https://curriculum-mcp.oaknational.dev/oauth/token');
    expect(result.registration_endpoint).toBe(
      'https://curriculum-mcp.oaknational.dev/oauth/register',
    );
  });

  it('passes through non-proxied endpoint URLs unchanged', () => {
    const metadataWithExtras: UpstreamAuthServerMetadata = {
      ...TEST_UPSTREAM_METADATA,
      revocation_endpoint: `${TEST_FAPI_BASE_URL}/oauth/token/revoke`,
      introspection_endpoint: `${TEST_FAPI_BASE_URL}/oauth/token_info`,
      userinfo_endpoint: `${TEST_FAPI_BASE_URL}/oauth/userinfo`,
      jwks_uri: `${TEST_FAPI_BASE_URL}/.well-known/jwks.json`,
    };
    const result = rewriteAuthServerMetadata(metadataWithExtras, 'http://localhost:3333');
    expect(result.revocation_endpoint).toBe(`${TEST_FAPI_BASE_URL}/oauth/token/revoke`);
    expect(result.introspection_endpoint).toBe(`${TEST_FAPI_BASE_URL}/oauth/token_info`);
    expect(result.userinfo_endpoint).toBe(`${TEST_FAPI_BASE_URL}/oauth/userinfo`);
    expect(result.jwks_uri).toBe(`${TEST_FAPI_BASE_URL}/.well-known/jwks.json`);
  });

  it('omits non-proxied endpoints when not present in upstream', () => {
    const result = rewriteAuthServerMetadata(TEST_UPSTREAM_METADATA, 'http://localhost:3333');
    expect(result.revocation_endpoint).toBeUndefined();
    expect(result.introspection_endpoint).toBeUndefined();
    expect(result.userinfo_endpoint).toBeUndefined();
    expect(result.jwks_uri).toBeUndefined();
  });
});

describe('isUpstreamAuthServerMetadata', () => {
  it('returns true for valid upstream metadata', () => {
    expect(isUpstreamAuthServerMetadata(TEST_UPSTREAM_METADATA)).toBe(true);
  });

  it('returns true when optional endpoint fields are present', () => {
    const withOptionals = {
      ...TEST_UPSTREAM_METADATA,
      revocation_endpoint: `${TEST_FAPI_BASE_URL}/oauth/token/revoke`,
      jwks_uri: `${TEST_FAPI_BASE_URL}/.well-known/jwks.json`,
    };
    expect(isUpstreamAuthServerMetadata(withOptionals)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isUpstreamAuthServerMetadata(null)).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isUpstreamAuthServerMetadata('not-metadata')).toBe(false);
  });

  it('returns false when issuer is missing', () => {
    const { issuer, ...rest } = TEST_UPSTREAM_METADATA;
    void issuer;
    expect(isUpstreamAuthServerMetadata(rest)).toBe(false);
  });

  it('returns false when response_types_supported is not an array', () => {
    expect(
      isUpstreamAuthServerMetadata({
        ...TEST_UPSTREAM_METADATA,
        response_types_supported: 'code',
      }),
    ).toBe(false);
  });

  it('returns false when an array field contains non-strings', () => {
    expect(
      isUpstreamAuthServerMetadata({
        ...TEST_UPSTREAM_METADATA,
        scopes_supported: ['openid', 42],
      }),
    ).toBe(false);
  });
});
