/**
 * Application-layer rate limiting for the HTTP MCP server.
 *
 * Provides a DI-friendly factory ({@link RateLimiterFactory}) and three
 * pre-configured profiles ({@link MCP_RATE_LIMIT}, {@link OAUTH_RATE_LIMIT},
 * {@link ASSET_RATE_LIMIT}) for defence-in-depth behind CDN edge protection.
 *
 * @see ADR-158 for the multi-layer security architecture.
 * @module
 */
export {
  type RateLimiterFactory,
  type RateLimiterOptions,
  createDefaultRateLimiterFactory,
} from './rate-limiter-factory.js';

export { MCP_RATE_LIMIT, OAUTH_RATE_LIMIT, ASSET_RATE_LIMIT } from './rate-limit-profiles.js';
