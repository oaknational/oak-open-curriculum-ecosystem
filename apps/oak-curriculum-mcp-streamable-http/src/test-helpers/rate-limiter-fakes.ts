/**
 * Test fakes for rate limiting, following ADR-078 (DI for testability).
 *
 * @example
 * ```typescript
 * const { factory, calls } = createFakeRateLimiterFactory();
 * const app = await createApp({ ...options, rateLimiterFactory: factory });
 * expect(calls).toHaveLength(3); // MCP, OAuth, Asset
 * ```
 */
import type { RequestHandler } from 'express';
import type {
  RateLimiterFactory,
  RateLimiterOptions,
} from '../rate-limiting/rate-limiter-factory.js';

/** A recorded invocation of the fake rate limiter factory. */
export interface RecordedRateLimiterCall {
  readonly options: RateLimiterOptions;
}

/**
 * Creates a fake {@link RateLimiterFactory} that records calls and returns
 * no-op middleware. Useful for verifying that the app wires the correct
 * profiles without actually enforcing rate limits.
 */
export function createFakeRateLimiterFactory(): {
  readonly factory: RateLimiterFactory;
  readonly calls: readonly RecordedRateLimiterCall[];
} {
  const calls: RecordedRateLimiterCall[] = [];

  const factory: RateLimiterFactory = (options: RateLimiterOptions): RequestHandler => {
    calls.push({ options });
    return (_req, _res, next) => {
      next();
    };
  };

  return { factory, calls };
}
