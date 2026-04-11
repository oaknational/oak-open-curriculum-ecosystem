/**
 * Integration tests for rate limiting middleware.
 *
 * Tests how the middleware works with the openapi-fetch pattern.
 * NO network IO, simple mock fetch injected as argument.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import createClient, { type Middleware } from 'openapi-fetch';
import { createRateLimitMiddleware } from './rate-limit';
import { createRateLimitConfig } from '../../config/rate-limit-config';

/**
 * Test client type - minimal interface for testing.
 * We don't need the full API schema here.
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
      };
    };
  };
}

type FetchFn = (input: Request | string | URL, init?: RequestInit) => Promise<Response>;

function createSuccessResponse(): Response {
  return new Response(JSON.stringify({ message: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getRequestInput(fetchMock: ReturnType<typeof vi.fn<FetchFn>>, callIndex = 0): Request {
  const [request] = fetchMock.mock.calls[callIndex] ?? [];
  if (!(request instanceof Request)) {
    throw new Error('Expected middleware to invoke fetch with a Request');
  }
  return request;
}

describe('rate-limit middleware integration', () => {
  let mockFetch: ReturnType<typeof vi.fn<FetchFn>>;

  beforeEach(() => {
    // Use fake timers to avoid real delays in tests
    vi.useFakeTimers();
    // Reset mock before each test
    mockFetch = vi.fn<FetchFn>();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it('should not delay first request', async () => {
    const config = createRateLimitConfig({ minRequestInterval: 100 });
    const middleware = createRateLimitMiddleware(config);

    // Mock successful response
    mockFetch.mockResolvedValueOnce(createSuccessResponse());

    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });
    client.use(middleware);

    // First request should not be delayed
    const promise = client.GET('/test', { fetch: mockFetch });
    await vi.runAllTimersAsync();
    await promise;

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should enforce minimum interval between requests', async () => {
    const config = createRateLimitConfig({ minRequestInterval: 100 });
    const middleware = createRateLimitMiddleware(config);

    // Mock successful responses - create new Response for each call
    mockFetch.mockImplementation(() => Promise.resolve(createSuccessResponse()));

    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });
    client.use(middleware);

    // Make first request
    const firstPromise = client.GET('/test', { fetch: mockFetch });
    await vi.runAllTimersAsync(); // Let any timers complete
    await firstPromise;
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Make second request immediately - should be delayed
    const secondPromise = client.GET('/test', { fetch: mockFetch });

    // The middleware should delay by 100ms
    await vi.advanceTimersByTimeAsync(100);
    await secondPromise;

    // Both requests should have been made
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should enforce interval across multiple requests', async () => {
    const config = createRateLimitConfig({ minRequestInterval: 50 });
    const middleware = createRateLimitMiddleware(config);

    mockFetch.mockImplementation(() => Promise.resolve(createSuccessResponse()));

    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });
    client.use(middleware);

    // Make 3 requests - each needs 50ms interval
    const promise1 = client.GET('/test', { fetch: mockFetch });
    await vi.runAllTimersAsync();
    await promise1;

    const promise2 = client.GET('/test', { fetch: mockFetch });
    await vi.advanceTimersByTimeAsync(50);
    await promise2;

    const promise3 = client.GET('/test', { fetch: mockFetch });
    await vi.advanceTimersByTimeAsync(50);
    await promise3;

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should not delay when rate limiting is disabled', async () => {
    const config = createRateLimitConfig({ enabled: false, minRequestInterval: 100 });
    const middleware = createRateLimitMiddleware(config);

    mockFetch.mockImplementation(() => Promise.resolve(createSuccessResponse()));

    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });
    client.use(middleware);

    // Make 3 requests quickly - should not be delayed
    await Promise.all([
      client.GET('/test', { fetch: mockFetch }),
      client.GET('/test', { fetch: mockFetch }),
      client.GET('/test', { fetch: mockFetch }),
    ]);
    await vi.runAllTimersAsync();

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should not delay if enough time has naturally elapsed', async () => {
    const config = createRateLimitConfig({ minRequestInterval: 50 });
    const middleware = createRateLimitMiddleware(config);

    mockFetch.mockImplementation(() => Promise.resolve(createSuccessResponse()));

    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });
    client.use(middleware);

    // Make first request
    const promise1 = client.GET('/test', { fetch: mockFetch });
    await vi.runAllTimersAsync();
    await promise1;

    // Advance time longer than minimum interval
    await vi.advanceTimersByTimeAsync(60);

    // Second request should not be delayed since enough time has passed
    const promise2 = client.GET('/test', { fetch: mockFetch });
    await vi.runAllTimersAsync();
    await promise2;

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should handle different minRequestInterval values', async () => {
    const config = createRateLimitConfig({ minRequestInterval: 200 });
    const middleware = createRateLimitMiddleware(config);

    mockFetch.mockImplementation(() => Promise.resolve(createSuccessResponse()));

    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });
    client.use(middleware);

    // First request
    const promise1 = client.GET('/test', { fetch: mockFetch });
    await vi.runAllTimersAsync();
    await promise1;

    // Second request should wait 200ms
    const promise2 = client.GET('/test', { fetch: mockFetch });
    await vi.advanceTimersByTimeAsync(200);
    await promise2;

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should work with other middleware', async () => {
    const config = createRateLimitConfig({ minRequestInterval: 100 });
    const rateLimitMiddleware = createRateLimitMiddleware(config);

    // Create a simple auth-like middleware for testing
    const authMiddleware: Middleware = {
      onRequest({ request }) {
        request.headers.set('X-Test-Auth', 'test-token');
        return request;
      },
    };

    mockFetch.mockImplementation(() => Promise.resolve(createSuccessResponse()));

    const client = createClient<TestPaths>({ baseUrl: 'http://test.local' });
    client.use(authMiddleware);
    client.use(rateLimitMiddleware);

    // First request
    const promise1 = client.GET('/test', { fetch: mockFetch });
    await vi.runAllTimersAsync();
    await promise1;

    // Second request should wait 100ms
    const promise2 = client.GET('/test', { fetch: mockFetch });
    await vi.advanceTimersByTimeAsync(100);
    await promise2;

    // Auth header should be set
    const firstRequest = getRequestInput(mockFetch);
    expect(firstRequest.headers.get('X-Test-Auth')).toBe('test-token');

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
