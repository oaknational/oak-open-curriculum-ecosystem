/**
 * Rate limiter factory and types for application-layer defence-in-depth.
 *
 * Production callers use {@link createDefaultRateLimiterFactory} which wraps
 * `express-rate-limit`. Tests inject a no-op or recording factory via the
 * {@link RateLimiterFactory} function type, following ADR-078 (DI for
 * testability).
 *
 * **Vercel-aware key extraction (HARDENING).** When the runtime is Vercel
 * (`isVercelRuntime: true`), the limiter keys on `x-vercel-forwarded-for`,
 * the header Vercel writes server-side from the TCP connection. Vercel's
 * documented behaviour is to overwrite a client-supplied `x-forwarded-for`
 * to prevent IP spoofing (https://vercel.com/docs/headers/request-headers,
 * fetched 2026-04-28), so in practice `req.ip` is also correct on Vercel
 * when `app.set('trust proxy', 1)` is configured. Reading
 * `x-vercel-forwarded-for` directly removes the dependency on
 * `trust proxy` and is robust to a future customer-owned proxy being
 * placed upstream of Vercel — see the cluster-A pre-phase security review
 * at `.agent/plans/observability/active/pr-87-cluster-a-security-review.md`
 * (FIND-001/002, re-classified as HARDENING after Vercel-docs verification).
 *
 * On non-Vercel runtimes (`isVercelRuntime: false`), `x-vercel-forwarded-for`
 * is **not** trusted: any client could spoof it on a non-Vercel deployment.
 * The limiter falls back to `req.ip`, which is whatever the local proxy
 * topology provides.
 */
import type { Request, RequestHandler } from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

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
 * Configuration for the production rate limiter factory.
 *
 * Production callers derive `isVercelRuntime` from the validated env at the
 * resolution boundary (e.g. `runtimeConfig.env.VERCEL_ENV !== undefined`).
 */
export interface RateLimiterFactoryOptions {
  /**
   * Whether the runtime is Vercel.
   *
   * - `true` — read `x-vercel-forwarded-for` (Vercel-edge-written header)
   *   for the client IP. Trustworthy because Vercel writes it server-side
   *   from the TCP connection and a client cannot inject it through the
   *   public surface.
   * - `false` — ignore `x-vercel-forwarded-for` (a client could spoof it on
   *   non-Vercel deployments) and use `req.ip` directly. `req.ip` honours
   *   `app.set('trust proxy', n)` if configured.
   */
  readonly isVercelRuntime: boolean;
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
 * Pure key-extraction function used by the production limiter middleware.
 *
 * Exported for unit-test observability — the production limiter wires this
 * directly into `rateLimit({ keyGenerator })`. Always returns a value
 * pre-processed by `ipKeyGenerator(ip, 56)` for IPv6 subnet collapsing
 * (avoids the `ERR_ERL_KEY_GEN_IPV6` warning at
 * `node_modules/express-rate-limit/dist/index.mjs:612-616`).
 *
 * @param req - Subset of the Express request used for key extraction.
 * @param options - {@link RateLimiterFactoryOptions}.
 * @returns A stable rate-limit bucket key.
 *
 * @example
 * ```typescript
 * vercelAwareKeyGenerator(
 *   { headers: { 'x-vercel-forwarded-for': '203.0.113.5' }, ip: '127.0.0.1' },
 *   { isVercelRuntime: true },
 * );
 * // → '203.0.113.5' (post ipKeyGenerator, IPv4 unchanged)
 * ```
 */
export function vercelAwareKeyGenerator(
  req: Pick<Request, 'headers' | 'ip'>,
  options: RateLimiterFactoryOptions,
): string {
  const fromVercel = options.isVercelRuntime
    ? extractFirstClientIp(req.headers['x-vercel-forwarded-for'])
    : undefined;
  const ip = fromVercel ?? req.ip ?? '';
  // /56 collapses IPv6 addresses to a 256-prefix block. Mobile carriers
  // typically allocate /64 to a single device; /56 keeps fairness per
  // carrier-allocation while bounding MemoryStore growth. Matches
  // express-rate-limit's default at index.mjs:756-769.
  return ipKeyGenerator(ip, 56);
}

function extractFirstClientIp(rawHeader: string | string[] | undefined): string | undefined {
  const headerValue = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
  const firstEntry = headerValue?.split(',')[0]?.trim();
  return firstEntry !== undefined && firstEntry.length > 0 ? firstEntry : undefined;
}

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
 * @param factoryOptions - {@link RateLimiterFactoryOptions} controlling the
 *   key-extraction strategy. Required (no default) so call sites must make
 *   an explicit Vercel/non-Vercel choice; a silent default would be a
 *   refactor-time footgun on a security-relevant boundary.
 * @returns A {@link RateLimiterFactory} producing Express middleware.
 *
 * @example
 * ```typescript
 * const factory = createDefaultRateLimiterFactory({ isVercelRuntime: true });
 * const mcpLimiter = factory({ windowMs: 60_000, limit: 120, message: { error: '...' } });
 * app.post('/mcp', mcpLimiter, handler);
 * ```
 */
export function createDefaultRateLimiterFactory(
  factoryOptions: RateLimiterFactoryOptions,
): RateLimiterFactory {
  return (limiterOptions) =>
    rateLimit({
      windowMs: limiterOptions.windowMs,
      limit: limiterOptions.limit,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: limiterOptions.message,
      keyGenerator: (req) => vercelAwareKeyGenerator(req, factoryOptions),
    });
}
