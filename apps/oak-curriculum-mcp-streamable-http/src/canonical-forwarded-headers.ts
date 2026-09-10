/**
 * Tells header-deriving middleware the public origin the app is actually
 * served at, by replacing the two forwarded headers such middleware reads.
 *
 * The app already answers "what is my public origin?" with `CANONICAL_HOST`
 * (see `canonical-origin.ts`) — but only for URLs it builds itself. Third-party
 * middleware does not read configuration; it reads request headers, the one
 * interface configuration never reached. This shim closes that gap.
 *
 * Why configuration must supply these headers here (MCP-517). Behind the
 * Cloudflare edge the app is served at `https://mcp.thenational.academy/mcp`,
 * but the edge MUST override the Host to the app's own Vercel hostname —
 * that is how Vercel selects the serving project. The honest proxy answer
 * (`trust proxy` plus forwarded headers arriving from the edge) is structurally
 * unavailable: Vercel's edge overwrites an inbound `x-forwarded-host` with the
 * Vercel hostname before the app sees it, and this app deliberately refuses
 * `trust proxy` (`bootstrap-helpers.ts`). So Clerk's `deriveUrlFromHeaders`
 * (`@clerk/backend`) perceived the deployment hostname, minted session-refresh
 * handshakes returning to it, and Clerk's Frontend API rejected them with a
 * 422 `form_param_value_invalid` — stranding every signed-in browser on raw
 * JSON while signed-out traffic sailed through. Clerk's own "deploy behind a
 * proxy" guidance asks for exactly these two headers; the app supplies them
 * from configuration because the proxy chain cannot.
 *
 * This REMOVES the influence of client- and edge-supplied forwarded headers
 * rather than adding trust in them, so it strengthens rather than weakens the
 * no-`trust proxy` stance.
 *
 * Its reach is exactly the middleware mounted from the Clerk install onward, and
 * it is absent altogether under `DANGEROUSLY_DISABLE_AUTH` (where Clerk is never
 * installed). Nothing mounted earlier — the request logger, the correlation
 * middleware, the OAuth-proxy and metadata routes — derives an origin from
 * forwarded headers today; those that name an origin read the app's own
 * `CANONICAL_HOST` or the raw `Host`. A future consumer that does read these
 * headers and mounts ahead of Clerk would need this moved, not copied.
 *
 * Two properties are load-bearing:
 *
 * 1. The values are REPLACED, never appended to. Consumers read only the first
 *    comma-separated value (`getFirstValueFromHeader` in `@clerk/backend`), and
 *    Vercel has already populated `x-forwarded-host` with the deployment
 *    hostname — so appending would silently change nothing.
 * 2. The `Host` header is never touched. `dnsRebindingProtection` validates the
 *    RAW Host against an allow-list that deliberately excludes the canonical
 *    address (the edge presents the deployment hostname), so rewriting Host
 *    would trip the app's own rebinding guard. Consumers prefer
 *    `x-forwarded-host` over Host, so replacing the forwarded pair suffices.
 *
 * Express's own proxy-aware getters (`req.hostname`, `req.protocol`) are
 * unaffected and stay Host-derived — correct and deliberate, because
 * `trust proxy` is off.
 */

import type { RequestHandler } from 'express';

/** The forwarded-host header origin-deriving consumers prefer over `Host`. */
const FORWARDED_HOST_HEADER = 'x-forwarded-host';

/** The forwarded-proto header those consumers pair with the host. */
const FORWARDED_PROTO_HEADER = 'x-forwarded-proto';

/**
 * Builds the middleware that states the canonical origin in forwarded headers.
 *
 * Returns `undefined` when no canonical host is configured, so the no-op is
 * structural — nothing is mounted, and the forwarded headers a preview or local
 * deployment receives are provably untouched. A configured-but-empty value is
 * treated as unset for the same reason: writing an unchecked value would put
 * the literal string `"undefined"` on every request in exactly the
 * environments where per-request derivation is already correct. That arm is
 * defence in depth — `env.ts` refines `CANONICAL_HOST` with `isValidHostHeader`,
 * which rejects an empty or blank value at startup, so the real boundary cannot
 * deliver one.
 *
 * The host is normalised to agree byte-for-byte with `resolveCanonicalOrigin`,
 * which lower-cases the same variable. That agreement is load-bearing rather
 * than tidy: Clerk relays the origin it perceives here to its backend as
 * `request_origin` when it attempts the silent token refresh, and the
 * server-side comparison against the session's authorised party is exact — so a
 * case difference between the two consumers of `CANONICAL_HOST` would refuse
 * the refresh and force the very redirect handshake this change exists to stop.
 *
 * The scheme is fixed to `https` rather than reflected. This is not merely
 * defensive: `@clerk/express` builds its Fetch `Request` against a dummy origin
 * whose scheme comes from whether the Node socket is TLS, which on a serverless
 * platform it is not — so absent this header Clerk would derive an `http`
 * origin for a host it requires to be `https`. Fixing the value also means no
 * request header can downgrade the perceived scheme.
 *
 * @param canonicalHost - `CANONICAL_HOST` as validated at the env boundary
 *   (a bare hostname), or `undefined` when the app derives per request
 * @returns The middleware, or `undefined` when there is nothing to state
 */
export function createCanonicalForwardedHeaders(
  canonicalHost: string | undefined,
): RequestHandler | undefined {
  if (typeof canonicalHost !== 'string') {
    return undefined;
  }

  // Normalise once and decide on the normalised value, so the header can never
  // carry surrounding whitespace that the decision silently ignored.
  const forwardedHost = canonicalHost.trim().toLowerCase();
  if (forwardedHost === '') {
    return undefined;
  }

  return function canonicalForwardedHeaders(req, _res, next) {
    req.headers[FORWARDED_HOST_HEADER] = forwardedHost;
    req.headers[FORWARDED_PROTO_HEADER] = 'https';
    next();
  };
}
