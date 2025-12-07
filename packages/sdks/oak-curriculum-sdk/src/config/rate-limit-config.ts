/**
 * @module rate-limit-config
 * @description Configuration for SDK request rate limiting.
 * Pure functions for testability - no side effects.
 * @public
 */

/**
 * Configuration for SDK request rate limiting.
 * Prevents overwhelming the API with too many requests.
 * @public
 */
export interface RateLimitConfig {
  /** Enable/disable rate limiting. Default: true */
  readonly enabled: boolean;
  /** Minimum milliseconds between requests. Default: 100ms (10 req/sec) */
  readonly minRequestInterval: number;
  /** Maximum requests per second. Default: 10 */
  readonly maxRequestsPerSecond: number;
}

/**
 * Default rate limit configuration.
 * Conservative defaults to avoid 429 errors from the Oak API.
 * 10 requests per second = 100ms minimum interval.
 * @public
 */
export const DEFAULT_RATE_LIMIT_CONFIG: Readonly<RateLimitConfig> = Object.freeze({
  enabled: true,
  minRequestInterval: 100, // 100ms = 10 req/sec
  maxRequestsPerSecond: 10,
});

/**
 * Create rate limit config with overrides.
 * Pure function - no side effects, does not mutate defaults.
 *
 * @param overrides - Partial config to override defaults
 * @returns New rate limit configuration
 * @public
 */
export function createRateLimitConfig(overrides?: Partial<RateLimitConfig>): RateLimitConfig {
  return { ...DEFAULT_RATE_LIMIT_CONFIG, ...overrides };
}

/**
 * Calculate delay needed before next request.
 * Pure function for testability - no side effects.
 *
 * @param lastRequestTime - Timestamp of last request (milliseconds since epoch)
 * @param config - Rate limit configuration
 * @returns Delay in milliseconds (0 if no delay needed)
 * @public
 */
export function calculateDelay(lastRequestTime: number, config: RateLimitConfig): number {
  if (!config.enabled) {
    return 0;
  }

  const elapsed = Date.now() - lastRequestTime;
  const required = config.minRequestInterval;
  const delay = required - elapsed;

  return Math.max(0, delay);
}
