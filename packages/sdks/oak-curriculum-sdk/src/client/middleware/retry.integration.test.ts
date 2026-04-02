/**
 * Integration tests for retry middleware with exponential backoff.
 *
 * Tests how the middleware works with the openapi-fetch pattern.
 * NO network IO, simple mock fetch injected as argument.
 */

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

function createJsonResponse(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('retry middleware integration', () => {
  let mockFetch: ReturnType<typeof vi.fn<FetchFn>>;

  beforeEach(() => {
    // Use fake timers to avoid real delays in tests
    vi.useFakeTimers();
    mockFetch = vi.fn<FetchFn>();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it('should not retry on successful response', async () => {
    const config = createRetryConfig({ maxRetries: 3 });

    mockFetch.mockImplementation(() =>
      Promise.resolve(createJsonResponse({ message: 'success' }, 200)),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch, config);
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
      .mockResolvedValueOnce(createJsonResponse({ error: 'rate limited' }, 429))
      .mockResolvedValueOnce(createJsonResponse({ error: 'rate limited' }, 429))
      .mockResolvedValueOnce(createJsonResponse({ message: 'success' }, 200));

    const wrappedFetch = createFetchWithRetry(mockFetch, config);
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
      .mockResolvedValueOnce(createJsonResponse({ error: 'service unavailable' }, 503))
      .mockResolvedValueOnce(createJsonResponse({ message: 'success' }, 200));

    const wrappedFetch = createFetchWithRetry(mockFetch, config);
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
      Promise.resolve(createJsonResponse({ error: 'rate limited' }, 429)),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch, config);
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
      Promise.resolve(createJsonResponse({ error: 'not found' }, 404)),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const result = await client.GET('/test', { fetch: wrappedFetch });

    expect(result.response.status).toBe(404);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should not retry when disabled', async () => {
    const config = createRetryConfig({ enabled: false, maxRetries: 3 });

    mockFetch.mockImplementation(() =>
      Promise.resolve(createJsonResponse({ error: 'rate limited' }, 429)),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch, config);
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
      Promise.resolve(createJsonResponse({ error: 'rate limited' }, 429)),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch, config);
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
      Promise.resolve(createJsonResponse({ error: 'rate limited' }, 429)),
    );

    const wrappedFetch = createFetchWithRetry(mockFetch, config);
    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });

    const result = await client.GET('/test', { fetch: wrappedFetch });

    // Should not retry 429 since it's not in retryableStatusCodes
    expect(result.response.status).toBe(429);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  describe('network exception handling', () => {
    it('should retry on network exception and eventually succeed', async () => {
      const config = createRetryConfig({
        maxRetries: 2,
        initialDelayMs: 10,
      });

      // First two calls throw network error, third succeeds
      mockFetch
        .mockRejectedValueOnce(new TypeError('fetch failed'))
        .mockRejectedValueOnce(new TypeError('fetch failed'))
        .mockResolvedValueOnce(createJsonResponse({ message: 'success' }, 200));

      const wrappedFetch = createFetchWithRetry(mockFetch, config);

      const resultPromise = wrappedFetch('http://test.local/test');

      // Advance through retry delays: 10ms (first retry) + 20ms (second retry)
      await vi.advanceTimersByTimeAsync(10);
      await vi.advanceTimersByTimeAsync(20);

      const result = await resultPromise;

      expect(result.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should throw network exception after all retries exhausted', async () => {
      const config = createRetryConfig({
        maxRetries: 2,
        initialDelayMs: 5,
      });

      // All calls throw network error
      mockFetch.mockRejectedValue(new TypeError('fetch failed'));

      const wrappedFetch = createFetchWithRetry(mockFetch, config);

      // Create promise and immediately capture any rejection
      let caughtError: Error | null = null;
      const resultPromise = wrappedFetch('http://test.local/test').catch((e: Error) => {
        caughtError = e;
      });

      // Run all timers to completion
      await vi.runAllTimersAsync();
      await resultPromise;

      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError).toHaveProperty('message', 'fetch failed');
      // Initial request + 2 retries = 3 total
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry network exception when disabled', async () => {
      const config = createRetryConfig({ enabled: false, maxRetries: 3 });

      mockFetch.mockRejectedValue(new TypeError('fetch failed'));

      const wrappedFetch = createFetchWithRetry(mockFetch, config);

      await expect(wrappedFetch('http://test.local/test')).rejects.toThrow('fetch failed');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should use exponential backoff for network exceptions', async () => {
      const config = createRetryConfig({
        maxRetries: 3,
        initialDelayMs: 50,
        backoffMultiplier: 2,
      });

      // All calls throw network error
      mockFetch.mockRejectedValue(new TypeError('fetch failed'));

      const wrappedFetch = createFetchWithRetry(mockFetch, config);

      // Create promise and immediately capture any rejection
      let caughtError: Error | null = null;
      const resultPromise = wrappedFetch('http://test.local/test').catch((e: Error) => {
        caughtError = e;
      });

      // Run all timers to completion
      await vi.runAllTimersAsync();
      await resultPromise;

      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError).toHaveProperty('message', 'fetch failed');
      expect(mockFetch).toHaveBeenCalledTimes(4); // initial + 3 retries
    });

    it('should handle mixed network exceptions and HTTP errors', async () => {
      const config = createRetryConfig({
        maxRetries: 3,
        initialDelayMs: 10,
      });

      // First: network error, second: 503, third: network error, fourth: success
      mockFetch
        .mockRejectedValueOnce(new TypeError('fetch failed'))
        .mockResolvedValueOnce(createJsonResponse({ error: 'service unavailable' }, 503))
        .mockRejectedValueOnce(new TypeError('fetch failed again'))
        .mockResolvedValueOnce(createJsonResponse({ message: 'success' }, 200));

      const wrappedFetch = createFetchWithRetry(mockFetch, config);

      const resultPromise = wrappedFetch('http://test.local/test');

      // Advance through retry delays
      await vi.advanceTimersByTimeAsync(10);
      await vi.advanceTimersByTimeAsync(20);
      await vi.advanceTimersByTimeAsync(40);

      const result = await resultPromise;

      expect(result.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });
  });
});
