import { describe, it, expect, vi } from 'vitest';
import { fetchUpstreamMetadata, type FetchFn } from './oauth-and-caching-setup.js';
import type { HttpObservability, HttpSpanHandle } from '../observability/http-observability.js';

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
const noopSpanHandle: HttpSpanHandle = {
  setAttribute(): void {
    // No-op in unit test.
  },
  setAttributes(): void {
    // No-op in unit test.
  },
};

describe('fetchUpstreamMetadata', () => {
  it('returns ok with validated metadata on successful response', async () => {
    const fakeFetch = createFakeFetch({ ok: true, status: 200, body: VALID_METADATA });
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.issuer).toBe('https://clerk.example.com');
    }
  });

  it('returns err with http_error on non-ok 5xx response after retries exhausted', async () => {
    const fakeFetch = createFakeFetch({ ok: false, status: 503, body: {} });
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
      retryDelayMs: 0,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('http_error');
      expect(result.error.message).toContain('HTTP 503');
    }
  });

  it('returns err with http_error on 404 response', async () => {
    const fakeFetch = createFakeFetch({ ok: false, status: 404, body: {} });
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('http_error');
      expect(result.error.message).toContain('HTTP 404');
    }
  });

  it('returns err with invalid_shape when metadata shape is invalid', async () => {
    const fakeFetch = createFakeFetch({ ok: true, status: 200, body: { unexpected: 'shape' } });
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('invalid_shape');
      expect(result.error.message).toContain('does not match expected shape');
    }
  });

  it('retries on transient failure then returns ok', async () => {
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.issuer).toBe('https://clerk.example.com');
    }
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });

  it('returns err with network_error after exhausting all retries', async () => {
    const networkError = new TypeError('fetch failed');
    const fakeFetch = vi.fn<FetchFn>().mockRejectedValue(networkError);
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
      maxRetries: 2,
      retryDelayMs: 0,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('network_error');
      expect(result.error.message).toContain('fetch failed');
    }
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });

  it('retries on 5xx then returns ok on subsequent attempt', async () => {
    const fakeFetch = vi
      .fn<FetchFn>()
      .mockResolvedValueOnce({ ok: false, status: 503, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(VALID_METADATA),
      });
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
      maxRetries: 2,
      retryDelayMs: 0,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.issuer).toBe('https://clerk.example.com');
    }
    expect(fakeFetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry on permanent 4xx errors', async () => {
    const fakeFetch = vi.fn(createFakeFetch({ ok: false, status: 404, body: {} }));
    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
      maxRetries: 3,
      retryDelayMs: 0,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('http_error');
    }
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it('returns err with timeout when fetch is aborted', async () => {
    const hangingFetch: FetchFn = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const abortError = new DOMException('The operation was aborted', 'AbortError');
          reject(abortError);
        });
      });
    const result = await fetchUpstreamMetadata('https://clerk.example.com', hangingFetch, {
      timeoutMs: 50,
      maxRetries: 1,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('timeout');
      expect(result.error.message).toContain('aborted');
    }
  });

  it('wraps metadata fetch in an observability span with safe attributes', async () => {
    const fakeFetch = createFakeFetch({ ok: true, status: 200, body: VALID_METADATA });
    const setAttribute = vi.fn<(name: string, value: unknown) => void>();
    const spanCalls: {
      readonly name: string;
      readonly attributes?: Record<string, unknown>;
    }[] = [];
    const withSpan: HttpObservability['withSpan'] = async ({ name, attributes, run }) => {
      spanCalls.push({ name, attributes });

      return await run({
        ...noopSpanHandle,
        setAttribute,
      });
    };

    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
      observability: { withSpan },
    });

    expect(result.ok).toBe(true);
    const expectedAttrs: unknown = expect.objectContaining({
      'oak.bootstrap.phase': 'fetchUpstreamMetadata',
      'oak.upstream.host': 'clerk.example.com',
    });
    expect(spanCalls).toEqual([
      expect.objectContaining({
        name: 'oak.http.bootstrap.upstream-metadata',
        attributes: expectedAttrs,
      }),
    ]);
    expect(setAttribute).toHaveBeenCalledWith('oak.upstream.status', 200);
  });

  it('records the upstream status on the metadata span when the upstream returns 5xx', async () => {
    const fakeFetch = createFakeFetch({ ok: false, status: 503, body: {} });
    const setAttribute = vi.fn();

    const result = await fetchUpstreamMetadata('https://clerk.example.com', fakeFetch, {
      retryDelayMs: 0,
      observability: {
        withSpan: async ({ run }) =>
          await run({
            ...noopSpanHandle,
            setAttribute,
          }),
      },
    });

    expect(result.ok).toBe(false);
    expect(setAttribute).toHaveBeenCalledWith('oak.upstream.status', 503);
  });
});
