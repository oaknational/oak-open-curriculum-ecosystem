/**
 * Integration tests for retry middleware with exponential backoff.
 *
 * Tests how the middleware works with the openapi-fetch pattern.
 * NO network IO, simple mock fetch injected as argument.
 */

/* eslint-disable @typescript-eslint/no-misused-promises */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import createClient from 'openapi-fetch';
import { createFetchWithRetry } from './retry';
import { createRetryConfig } from '../../config/retry-config';

/**
 * Test client type - minimal interface for testing.
 */
interface TestPaths {
  '/test': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': { message: string };
          };
        };
        429: {
          content: {
            'application/json': { error: string };
          };
        };
        503: {
          content: {
            'application/json': { error: string };
          };
        };
      };
    };
  };
}

type FetchFn = (input: Request | string | URL, init?: RequestInit) => Promise<Response>;

describe('retry middleware integration', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Use fake timers to avoid real delays in tests
    vi.useFakeTimers();
    mockFetch = vi.fn();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it('should not retry on successful response', async () => {
    const config = createRetryConfig({ maxRetries: 3 });

    mockFetch.mockImplementation(async () => {
      return new Response(JSON.stringify({ message: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const wrappedFetch = createFetchWithRetry(mockFetch as FetchFn, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const result = await client.GET('/test', { fetch: wrappedFetch });

    expect(result.response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on 429 response and eventually succeed', async () => {
    const config = createRetryConfig({
      maxRetries: 2,
      initialDelayMs: 10,
    });

    // First call returns 429, second call returns 429, third succeeds
    mockFetch
      .mockImplementationOnce(async () => {
        return new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      })
      .mockImplementationOnce(async () => {
        return new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      })
      .mockImplementationOnce(async () => {
        return new Response(JSON.stringify({ message: 'success' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

    const wrappedFetch = createFetchWithRetry(mockFetch as FetchFn, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const resultPromise = client.GET('/test', { fetch: wrappedFetch });

    // Advance through retry delays: 10ms (first retry) + 20ms (second retry)
    await vi.advanceTimersByTimeAsync(10);
    await vi.advanceTimersByTimeAsync(20);

    const result = await resultPromise;

    expect(result.response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should retry on 503 response', async () => {
    const config = createRetryConfig({
      maxRetries: 1,
      initialDelayMs: 10,
    });

    mockFetch
      .mockImplementationOnce(async () => {
        return new Response(JSON.stringify({ error: 'service unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
      .mockImplementationOnce(async () => {
        return new Response(JSON.stringify({ message: 'success' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

    const wrappedFetch = createFetchWithRetry(mockFetch as FetchFn, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const resultPromise = client.GET('/test', { fetch: wrappedFetch });

    // Advance through retry delay: 10ms
    await vi.advanceTimersByTimeAsync(10);

    const result = await resultPromise;

    expect(result.response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should stop retrying after maxRetries exhausted', async () => {
    const config = createRetryConfig({
      maxRetries: 2,
      initialDelayMs: 5,
    });

    // All calls return 429
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch as FetchFn, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const resultPromise = client.GET('/test', { fetch: wrappedFetch });

    // Advance through all retry delays: 5ms + 10ms
    await vi.advanceTimersByTimeAsync(5);
    await vi.advanceTimersByTimeAsync(10);

    const result = await resultPromise;

    // Should return the last 429 response
    expect(result.response.status).toBe(429);
    // Initial request + 2 retries = 3 total
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should not retry on 404 response', async () => {
    const config = createRetryConfig({ maxRetries: 3 });

    mockFetch.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: 'not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch as FetchFn, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const result = await client.GET('/test', { fetch: wrappedFetch });

    expect(result.response.status).toBe(404);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should not retry when disabled', async () => {
    const config = createRetryConfig({ enabled: false, maxRetries: 3 });

    mockFetch.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch as FetchFn, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const result = await client.GET('/test', { fetch: wrappedFetch });

    expect(result.response.status).toBe(429);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should use exponential backoff delays', async () => {
    const config = createRetryConfig({
      maxRetries: 3,
      initialDelayMs: 50,
      backoffMultiplier: 2,
    });

    // All calls return 429
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch as FetchFn, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const resultPromise = client.GET('/test', { fetch: wrappedFetch });

    // Advance through all retry delays: 50ms + 100ms + 200ms
    await vi.advanceTimersByTimeAsync(50);
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(200);

    await resultPromise;

    expect(mockFetch).toHaveBeenCalledTimes(4); // initial + 3 retries
  });

  it('should respect custom retryableStatusCodes', async () => {
    const config = createRetryConfig({
      maxRetries: 1,
      initialDelayMs: 10,
      retryableStatusCodes: [503], // Only retry 503, not 429
    });

    mockFetch.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch as FetchFn, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const result = await client.GET('/test', { fetch: wrappedFetch });

    // Should not retry 429 since it's not in retryableStatusCodes
    expect(result.response.status).toBe(429);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
