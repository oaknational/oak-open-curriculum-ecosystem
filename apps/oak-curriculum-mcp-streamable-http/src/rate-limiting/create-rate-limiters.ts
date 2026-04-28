/**
 * Creates rate limiter middleware instances for the four route profiles.
 *
 * Extracted from the composition root (`application.ts`) to keep that file
 * under the 250-line threshold. The factory is injectable for tests (ADR-078);
 * production callers omit it to get the default `express-rate-limit` factory.
 *
 * @see ADR-158 for the multi-layer security architecture.
 */
import type { RequestHandler } from 'express';

import {
  type RateLimiterFactory,
  type RateLimiterFactoryOptions,
  createDefaultRateLimiterFactory,
  MCP_RATE_LIMIT,
  OAUTH_RATE_LIMIT,
  METADATA_RATE_LIMIT,
  ASSET_RATE_LIMIT,
} from './index.js';

/** Rate limiter middleware instances for all four route profiles. */
interface RateLimiters {
  readonly mcpRateLimiter: RequestHandler;
  readonly oauthRateLimiter: RequestHandler;
  readonly metadataRateLimiter: RequestHandler;
  readonly assetRateLimiter: RequestHandler;
}

/**
 * Creates rate limiter middleware for MCP, OAuth flow, OAuth metadata
 * discovery, and asset download routes.
 *
 * @param factoryOptions - Configuration for the production factory. Ignored
 *   when `factoryOverride` is supplied. The composition root derives
 *   `isVercelRuntime` from the validated env (`runtimeConfig.env.VERCEL_ENV`).
 * @param factoryOverride - Optional factory for test injection. Defaults to
 *   {@link createDefaultRateLimiterFactory} (production `express-rate-limit`).
 * @returns An object containing all four rate limiter middleware instances.
 *
 * @example
 * ```typescript
 * // Production
 * const limiters = createRateLimiters({ isVercelRuntime: true });
 *
 * // Test injection (factoryOptions is ignored when factoryOverride is set)
 * const fakeLimiter: RequestHandler = (_req, _res, next) => { next(); };
 * const limiters = createRateLimiters({ isVercelRuntime: false }, () => fakeLimiter);
 * ```
 */
export function createRateLimiters(
  factoryOptions: RateLimiterFactoryOptions,
  factoryOverride?: RateLimiterFactory,
): RateLimiters {
  const factory = factoryOverride ?? createDefaultRateLimiterFactory(factoryOptions);
  return {
    mcpRateLimiter: factory(MCP_RATE_LIMIT),
    oauthRateLimiter: factory(OAUTH_RATE_LIMIT),
    metadataRateLimiter: factory(METADATA_RATE_LIMIT),
    assetRateLimiter: factory(ASSET_RATE_LIMIT),
  };
}
