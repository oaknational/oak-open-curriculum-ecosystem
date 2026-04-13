import { describe, it, expect } from 'vitest';

import { createDefaultRateLimiterFactory } from './rate-limiter-factory.js';

describe('createDefaultRateLimiterFactory', () => {
  it('returns a factory that produces middleware functions', () => {
    const factory = createDefaultRateLimiterFactory();
    const middleware = factory({
      windowMs: 60_000,
      limit: 10,
      message: { error: 'Too Many Requests', message: 'Rate limit exceeded.' },
    });

    expect(typeof middleware).toBe('function');
  });
});
