import { describe, it, expect, vi } from 'vitest';
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

  it('throws with HTTP status on non-ok 5xx response', async () => {
    const fakeFetch = createFakeFetch({ ok: false, status: 503, body: {} });
    await expect(
      fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, { retryDelayMs: 0 }),
    ).rejects.toThrow('HTTP 503');
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

  it('retries on transient failure then succeeds', async () => {
    const fakeFetch = vi
      .fn<FetchFn>()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(VALID_METADATA),
      });
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
      maxRetries: 2,
      retryDelayMs: 0,
    });
    expect(result.issuer).toBe('https://clerk.example.com');
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting all retries on transient errors', async () => {
    const networkError = new TypeError('fetch failed');
    const fakeFetch = vi.fn<FetchFn>().mockRejectedValue(networkError);
    await expect(
      fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
        maxRetries: 2,
        retryDelayMs: 0,
      }),
    ).rejects.toThrow('fetch failed');
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry on permanent 4xx errors', async () => {
    const fakeFetch = vi.fn(createFakeFetch({ ok: false, status: 404, body: {} }));
    await expect(
      fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
        maxRetries: 3,
        retryDelayMs: 0,
      }),
    ).rejects.toThrow('HTTP 404');
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('aborts fetch when timeout expires', async () => {
    const hangingFetch: FetchFn = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      });
    await expect(
      fetchUpstreamMetadata('https://clerk.example.com', hangingFetch, {
        timeoutMs: 50,
        maxRetries: 1,
      }),
    ).rejects.toThrow(/abort/i);
  });
});
