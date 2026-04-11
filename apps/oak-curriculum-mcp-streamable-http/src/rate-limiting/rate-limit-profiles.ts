/**
 * Rate limit profiles for the three route categories in the HTTP MCP server.
 *
 * Each profile defines a window, request limit, and 429 response body
 * tailored to the route's error format and expected usage pattern.
 * Application-layer rate limiting is defence-in-depth; the CDN edge
 * is the authoritative rate limiter.
 *
 * @see ADR-158 for the multi-layer security architecture.
 */
import type { RateLimiterOptions } from './rate-limiter-factory.js';

/**
 * MCP route rate limit: 120 requests per minute per IP.
 *
 * Covers POST /mcp and GET /mcp (both auth-enabled and auth-disabled modes).
 * 2 req/s sustained is generous for interactive MCP tool calls.
 */
export const MCP_RATE_LIMIT = {
  windowMs: 60_000,
  limit: 120,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Try again later.',
  },
} as const satisfies RateLimiterOptions;

/**
 * OAuth route rate limit: 30 requests per 15 minutes per IP.
 *
 * Covers POST /oauth/register, POST /oauth/token, and GET /oauth/authorize.
 * GET /oauth/authorize is an upstream amplification vector (each hit creates
 * a Clerk session). The message uses the OAuth error shape.
 */
export const OAUTH_RATE_LIMIT = {
  windowMs: 900_000,
  limit: 30,
  message: {
    error: 'too_many_requests',
    error_description: 'Rate limit exceeded. Try again later.',
  },
} as const satisfies RateLimiterOptions;

/**
 * Asset download route rate limit: 60 requests per minute per IP.
 *
 * Covers GET /assets/download/:lesson/:type. HMAC-signed URLs have expiry
 * but no single-use constraint; replay of a valid URL could exhaust the
 * upstream Oak API per-key rate limit.
 */
export const ASSET_RATE_LIMIT = {
  windowMs: 60_000,
  limit: 60,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Try again later.',
  },
} as const satisfies RateLimiterOptions;
