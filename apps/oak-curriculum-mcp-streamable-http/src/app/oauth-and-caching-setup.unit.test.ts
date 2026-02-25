import { describe, it, expect } from 'vitest';
import { fetchUpstreamMetadata, type FetchFn } from './oauth-and-caching-setup.js';

function createFakeFetch(response: { ok: boolean; status: number; body: unknown }): FetchFn {
  return () =>
    Promise.resolve({
      ok: response.ok,
      status: response.status,
      json: () => Promise.resolve(response.body),
    });
}

const VALID_METADATA = {
  issuer: 'https://clerk.example.com',
  authorization_endpoint: 'https://clerk.example.com/oauth/authorize',
  token_endpoint: 'https://clerk.example.com/oauth/token',
  registration_endpoint: 'https://clerk.example.com/oauth/register',
  token_endpoint_auth_methods_supported: ['none'],
  scopes_supported: ['openid'],
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code'],
  code_challenge_methods_supported: ['S256'],
};

describe('fetchUpstreamMetadata', () => {
  it('returns validated metadata on successful response', async () => {
    const fakeFetch = createFakeFetch({ ok: true, status: 200, body: VALID_METADATA });
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch);
    expect(result.issuer).toBe('https://clerk.example.com');
  });

  it('throws with HTTP status on non-ok response', async () => {
    const fakeFetch = createFakeFetch({ ok: false, status: 503, body: {} });
    await expect(fetchUpstreamMetadata('https://clerk.example.com', fakeFetch)).rejects.toThrow(
      'HTTP 503',
    );
  });

  it('throws on 404 response', async () => {
    const fakeFetch = createFakeFetch({ ok: false, status: 404, body: {} });
    await expect(fetchUpstreamMetadata('https://clerk.example.com', fakeFetch)).rejects.toThrow(
      'HTTP 404',
    );
  });

  it('throws when metadata shape is invalid', async () => {
    const fakeFetch = createFakeFetch({ ok: true, status: 200, body: { unexpected: 'shape' } });
    await expect(fetchUpstreamMetadata('https://clerk.example.com', fakeFetch)).rejects.toThrow(
      'does not match expected shape',
    );
  });
});
