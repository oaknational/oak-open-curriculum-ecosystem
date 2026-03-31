import { describe, it, expect } from 'vitest';

import { createDefaultRateLimiterFactory } from './rate-limiter-factory.js';

describe('createDefaultRateLimiterFactory', () => {
  it('produces middleware that can be called without throwing', () => {
    const factory = createDefaultRateLimiterFactory();
    const middleware = factory({
      windowMs: 60_000,
      limit: 10,
      message: { error: 'Too Many Requests', message: 'Rate limit exceeded.' },
    });

    // The middleware should be a callable function — prove it by invoking
    // with minimal fakes rather than asserting on typeof or arity.
    expect(() => {
      middleware(
        { ip: '127.0.0.1', method: 'GET', url: '/test' } as never,
        {
          status: () => ({ json: () => undefined }),
          setHeader: () => undefined,
          getHeader: () => undefined,
          headersSent: false,
        } as never,
        () => undefined,
      );
    }).not.toThrow();
  });
});
