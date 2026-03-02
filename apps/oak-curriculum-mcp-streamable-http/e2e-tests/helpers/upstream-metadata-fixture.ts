import type { UpstreamAuthServerMetadata } from '../../src/oauth-proxy/index.js';

/**
 * Test fixture providing upstream AS metadata for E2E tests.
 *
 * Represents what Clerk's `/.well-known/oauth-authorization-server` returns.
 * E2E tests inject this via `CreateAppOptions.upstreamMetadata` so no network
 * calls to Clerk are needed. The endpoint URLs are Clerk-shaped but never
 * contacted — the proxy rewrites them to self-origin before serving.
 */
export const TEST_UPSTREAM_METADATA: UpstreamAuthServerMetadata = {
  issuer: 'https://test-instance.clerk.accounts.dev',
  authorization_endpoint: 'https://test-instance.clerk.accounts.dev/oauth/authorize',
  token_endpoint: 'https://test-instance.clerk.accounts.dev/oauth/token',
  registration_endpoint: 'https://test-instance.clerk.accounts.dev/oauth/register',
  token_endpoint_auth_methods_supported: ['client_secret_basic', 'none', 'client_secret_post'],
  scopes_supported: ['openid', 'profile', 'email'],
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code', 'refresh_token'],
  code_challenge_methods_supported: ['S256'],
};
