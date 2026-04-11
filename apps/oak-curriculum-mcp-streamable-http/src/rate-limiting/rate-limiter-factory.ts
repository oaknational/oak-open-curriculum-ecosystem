/**
 * Rate limiter factory and types for application-layer defence-in-depth.
 *
 * Production callers use {@link createDefaultRateLimiterFactory} which wraps
 * `express-rate-limit`. Tests inject a no-op or recording factory via the
 * {@link RateLimiterFactory} function type, following ADR-078 (DI for
 * testability).
 *
 * @module
 */
import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';

/**
 * Configuration for a single rate limiter instance.
 *
 * @example
 * ```typescript
 * const options: RateLimiterOptions = {
 *   windowMs: 60_000,
 *   limit: 120,
 *   message: { error: 'Too Many Requests', message: 'Rate limit exceeded.' },
 * };
 * ```
 */
export interface RateLimiterOptions {
  /** Time window in milliseconds during which {@link limit} requests are allowed. */
  readonly windowMs: number;
  /** Maximum number of requests per IP within the {@link windowMs} window. */
  readonly limit: number;
  /**
   * JSON body returned with the 429 response. Shape should match the route's
   * error format: `{ error, message }` for MCP/asset routes or
   * `{ error, error_description }` for OAuth routes.
   */
  readonly message: Readonly<Record<string, string>>;
}

/**
 * Factory function that creates Express middleware enforcing per-IP rate
 * limiting with the given options. Production uses `express-rate-limit`;
 * tests inject a fake.
 *
 * @see {@link createDefaultRateLimiterFactory} for the production implementation.
 */
export type RateLimiterFactory = (options: RateLimiterOptions) => RequestHandler;

/**
 * Creates the production rate limiter factory backed by `express-rate-limit`.
 *
 * Uses `draft-7` standard headers (`RateLimit-*`) and disables legacy
 * `X-RateLimit-*` headers. The default in-memory store is intentional:
 * on Vercel serverless each instance has its own counter, making
 * application-layer rate limiting probabilistic. The CDN edge is the
 * authoritative rate limiter.
 *
 * **Known limitations** (see ADR-158):
 * - Counters reset on cold start — brief unprotected window.
 * - Counter increment is not atomic under concurrent burst — observed
 *   limit may be slightly higher than configured.
 * - Store grows unbounded per unique IP — CDN-level DDoS protection
 *   prevents volumetric attacks from reaching the origin.
 *
 * @returns A {@link RateLimiterFactory} producing Express middleware.
 *
 * @example
 * ```typescript
 * const factory = createDefaultRateLimiterFactory();
 * const mcpLimiter = factory({ windowMs: 60_000, limit: 120, message: { error: '...' } });
 * app.post('/mcp', mcpLimiter, handler);
 * ```
 */
export function createDefaultRateLimiterFactory(): RateLimiterFactory {
  return (options: RateLimiterOptions): RequestHandler =>
    rateLimit({
      windowMs: options.windowMs,
      limit: options.limit,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: options.message,
    });
}
