/**
 * What an OAuth discovery document is, and the caching policy it is published
 * under (MCP-413).
 *
 * Split from `auth-routes.ts` to keep that module under the line limit — the
 * third such split, after `host-validation-error.ts` — and exposed as a sender
 * rather than a bare constant so the directive and its paired correlation-header
 * handling cannot be applied half-way by a future document.
 */

import type { Response } from 'express';
import { CORRELATION_ID_HEADER } from './correlation/middleware.js';
import type { UpstreamAuthServerMetadata } from './oauth-proxy/index.js';

/**
 * RFC 9728 protected resource metadata as this server publishes it — exactly
 * the three fields the PRM handler renders, and nothing more.
 */
interface ProtectedResourceMetadata {
  readonly resource: string;
  readonly authorization_servers: readonly string[];
  readonly scopes_supported: readonly string[];
}

/**
 * The two documents published under the discovery cache policy: RFC 9728
 * protected resource metadata, and the RFC 8414 authorization-server metadata
 * `rewriteAuthServerMetadata` produces.
 *
 * Declared here rather than in `auth-routes.ts` because the sender is the one
 * boundary both documents pass through, and `auth-routes.ts` imports this
 * module — so this is the side of the dependency the shared shape can live on.
 */
export type DiscoveryDocument = ProtectedResourceMetadata | UpstreamAuthServerMetadata;

/**
 * `Cache-Control` for the 2xx discovery documents, applied only where
 * {@link sendDiscoveryDocument} judges the response shareable.
 *
 * ChatGPT issues ~28 discovery requests on a single conversation refresh — the
 * measurement ADR-056 rests on — and every one reached the origin function
 * while these responses carried the platform default `max-age=0`. Five minutes
 * of shared caching absorbs that burst; a longer TTL buys almost nothing, since
 * a burst is concentrated by definition, and costs propagation delay on exactly
 * the corrections that matter — a `scopes_supported` change, or a host move.
 * RFC 9728 §7.10 asks for the directive explicitly. It is origin offload,
 * complementary to ADR-219's edge rate limiting rather than required by it.
 *
 * The directive says nothing about freshness and must not be read as a claim
 * about it: the AS document is Clerk's, snapshotted once per cold start and
 * held for the process lifetime (ADR-115), so a warm instance can already serve
 * something older than any TTL here.
 *
 * ## The shareability gate is the safety argument
 *
 * A shared response must be a function of its cache key and nothing else.
 * `deriveSelfOrigin` never reads a forwarded header — and
 * `createCanonicalForwardedHeaders` mounts from the Clerk install onward,
 * downstream of these routes — so it has exactly two inputs, which differ in a
 * way that decides this policy:
 *
 * - **Configured** (`CANONICAL_HOST` set, the canonical deployment): the origin
 *   is a constant, `Host` is never consulted, the document is identical for
 *   every requester. Shareable — and this is where the burst arrives.
 * - **Request-derived** (previews, local): the origin is built from the RAW
 *   `Host` bytes while every cache normalises the authority it keys on, case
 *   and default-port insensitively (RFC 3986 §6.2). So `EXAMPLE.com`,
 *   `example.com` and `example.com:443` are ONE key but THREE documents: one
 *   crafted request could store a document whose `resource` no longer matches
 *   the URL clients used, which RFC 9728 §3.3 says they MUST NOT use. Discovery
 *   would fail closed for every conformant client until the entry expired. Not
 *   shareable.
 *
 * Gating on the configured origin removes that primitive rather than
 * documenting it. The raw-`Host` echo underneath is a separate pre-existing
 * defect in `deriveSelfOrigin`, pinned by a passing assertion in
 * `host-validation-error.unit.test.ts`; curing it changes what the server
 * advertises and belongs to its own ticket.
 *
 * ## Not given the directive, deliberately
 *
 * The 403 host-validation rejection — set only after the origin check, so the
 * policy needs no middleware ordering to hold (`createNoCacheErrorMiddleware`
 * is mounted after these routes and never sees them). `/healthz` keeps
 * `no-store`: a stored 200 makes a liveness probe lie exactly when the process
 * dies. `/.well-known/mcp-stub-mode` is a stub-mode-only affordance absent from
 * production.
 *
 * ## One precondition on any future edge change
 *
 * The global CORS middleware reflects the request `Origin` and pairs it with
 * `Vary: Origin`; that posture is decided, not accidental (ADR-122), so nothing
 * here touches it. It does mean a shared cache must honour `Vary: Origin`.
 * Vercel's CDN, the only cache this directive reaches today, does. Cloudflare
 * is in the path but stores none of these responses (`cf-cache-status: DYNAMIC`;
 * its default eligibility keys on a file extension these paths lack), so
 * **whoever adds a Cloudflare Cache Rule here must settle `Vary: Origin` first**
 * — it honours only `Vary: Accept-Encoding` on most plans. That failure would
 * be a browser-client CORS denial, failing closed, not an exposure. Edge
 * configuration is owned outside this repo, which is why this header alone does
 * not finish MCP-413's benefit. `vercel cache purge --type cdn` is the escape
 * hatch inside a TTL.
 */
const DISCOVERY_METADATA_CACHE_CONTROL =
  'public, max-age=300, s-maxage=300, stale-while-revalidate=60';

/**
 * Sends one already-rendered discovery document, applying
 * {@link DISCOVERY_METADATA_CACHE_CONTROL} only when the served origin came
 * from configuration.
 *
 * The document is a parameter rather than a callback so the directive can only
 * land on a response whose body already exists: a sender that set headers first
 * and then evaluated the body would leave a cacheable directive on a 500 if
 * that evaluation threw.
 *
 * `X-Correlation-ID` is dropped from a directive-bearing response, and only
 * from one. `createCorrelationMiddleware` adopts and echoes a CLIENT-SUPPLIED
 * value, so on a storable response it would persist an attacker-chosen string
 * at the edge and hand it to every subsequent client — and it would name a
 * request that is not theirs, which is worse than useless for diagnosis
 * because a cache hit never reaches the origin and so appears in no log. On an
 * uncached response the header is the documented join key between our logs,
 * Sentry and the client's own trace, so it stays. Clearing it here, paired with
 * setting the directive, is what makes the two impossible to get half-right.
 *
 * @param res - The response to send on, after its origin check has succeeded.
 * @param canonicalOrigin - The configured canonical origin, or `undefined` when
 *   this deployment derives its origin per request.
 * @param document - The rendered metadata document.
 */
export function sendDiscoveryDocument(
  res: Response,
  canonicalOrigin: string | undefined,
  document: DiscoveryDocument,
): void {
  if (canonicalOrigin !== undefined && canonicalOrigin.length > 0) {
    res.set('Cache-Control', DISCOVERY_METADATA_CACHE_CONTROL);
    res.removeHeader(CORRELATION_ID_HEADER);
  }
  res.json(document);
}
