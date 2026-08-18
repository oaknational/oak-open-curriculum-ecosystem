/**
 * Which request PATHS are public, and how a path is matched against them.
 *
 * ## Why This Exists
 *
 * The surface fork that keeps Clerk off the public page (MCP-518) has two
 * independent halves. `mcp-public-browser-leg.ts` answers "is this request
 * browser traffic or protocol traffic" from the negotiation headers. This
 * module answers the other half — "is this path one where only public content
 * lives" — and owns the matching semantics both halves are compared under.
 *
 * Kept apart from `conditional-clerk-middleware.ts` so the decision procedure
 * there reads as three ordered questions rather than as a pile of literals,
 * and so the matching rule below has one home instead of being restated at
 * each comparison.
 *
 * @see mcp-public-browser-leg.ts — the header half of the same fork
 * @see conditional-clerk-middleware.ts — the consumer that orders the two
 */

import { MCP_RESOURCE_PATH } from './served-origin.js';
import { HEALTH_PATHS } from './app/health-paths.js';
import {
  OAK_ASSETS_PUBLIC_DIRNAME,
  OAK_DS_PUBLIC_DIRNAME,
  ROUTED_ASSET_BASE,
} from './app/static-asset-paths.js';

/**
 * Paths that should always skip clerkMiddleware.
 * OAuth metadata endpoints must be publicly accessible per RFC 9728.
 *
 * @remarks
 * The health paths are spread from {@link HEALTH_PATHS} rather than listed,
 * because there are now two of them (MCP-580) and only the routed one is
 * reachable on the canonical host. Naming the root one alone would leave the
 * canonical probe — the only probe that measures the surface users actually
 * hit — running through the auth vendor on every poll: a needless dependency
 * inside a liveness check, and the handshake-redirect exposure the root path
 * was exempted from in the first place. Composing from the constant means a
 * change to the served health layout moves the skip with it instead of leaving
 * a stale literal behind.
 */
export const CLERK_SKIP_PATHS: ReadonlySet<string> = new Set([
  '/.well-known/oauth-protected-resource',
  '/.well-known/oauth-protected-resource/mcp',
  '/.well-known/oauth-authorization-server',
  '/.well-known/openid-configuration',
  ...HEALTH_PATHS,
  '/oauth/authorize',
  '/oauth/token',
  '/oauth/register',
]);

/**
 * Path prefixes that should skip clerkMiddleware.
 *
 * @remarks
 * Asset download routes are self-authenticating via HMAC signature (ADR-126).
 *
 * The design-system and brand trees are the public landing page's own
 * subresources (MCP-518). They are static files with no session-dependent
 * content, and they sit under the routed base only because the edge forwards
 * `/mcp*` and nothing else — a shared prefix, never a shared auth contract.
 * Composed from the same constants the static mount and the page's markup
 * use, so a change to the served layout moves the skip with it instead of
 * leaving a stale literal behind.
 *
 * Both trees appear twice because `static-content.ts` mounts one handler at
 * two prefixes: the routed base the canonical host reaches, and the app root
 * the alpha host serves from. Naming only the routed copy would leave the
 * alpha host's page fetching its own stylesheet through the auth vendor.
 */
export const CLERK_SKIP_PREFIXES: readonly string[] = [
  '/assets/download/',
  `${ROUTED_ASSET_BASE}/${OAK_DS_PUBLIC_DIRNAME}/`,
  `${ROUTED_ASSET_BASE}/${OAK_ASSETS_PUBLIC_DIRNAME}/`,
  `/${OAK_DS_PUBLIC_DIRNAME}/`,
  `/${OAK_ASSETS_PUBLIC_DIRNAME}/`,
];

/**
 * Paths at which the fully public baked page is served.
 *
 * @remarks
 * Two, not one: `static-content.ts` answers `GET /` with the same
 * `getLandingPageHtml()` artefact the `/mcp` negotiation serves. The owner
 * ruling is about the page, not about one of its URLs, so the fork has to
 * cover both or the defect simply moves to the other door — which for the
 * alpha host is its front one.
 */
const PUBLIC_PAGE_PATHS: ReadonlySet<string> = new Set(['/', MCP_RESOURCE_PATH]);

/**
 * Case-normalises a request path for skip matching.
 *
 * @remarks
 * Express's router and its `express.static` mounts both match
 * case-insensitively unless `case sensitive routing` is enabled, and nothing
 * in this app enables it. So `/MCP` reaches the same handlers as `/mcp`, and a
 * skip predicate spelled in lowercase literals would miss it: the page would
 * still be served, but through Clerk and still handshake-eligible — the exact
 * defect MCP-518 closes.
 *
 * Normalising here rather than flipping the global routing flag is deliberate.
 * The flag would change matching for every route and both static mounts at
 * once — turning today's case-insensitive hits into 404s — to cure a defect
 * that lives entirely in this module's comparisons. Widening the comparisons
 * to match what the router already does is the smaller, local change, and it
 * can only ever switch auth ON for fewer public requests, never OFF for a
 * request the router would not have served publicly anyway.
 *
 * Lowercasing the whole path is safe because the result is only ever compared,
 * never used to address anything: the prefix match on `/assets/download/`
 * still fires on a mixed-case signed slug, and the HMAC verification
 * downstream reads `req.params` and `req.query`, neither of which this
 * touches.
 *
 * Trailing slashes are the SAME class of mismatch — Express is non-strict by
 * default too, so `/healthz/` matches its route while missing
 * {@link CLERK_SKIP_PATHS} — and are deliberately NOT normalised here. That
 * class is already characterised and owner-held for a policy ADR
 * (`.agent/reports/engineering/mcp-app-trailing-slash-characterization-2026-08-06.md`
 * §(b)6), and normalising it piecemeal here would pre-empt that decision. It
 * does not touch the public page surface: `/mcp/` is matched by the `/mcp/`
 * prefix and `/` has no slash variant.
 */
export function normaliseSkipPath(path: string): string {
  return path.toLowerCase();
}

/**
 * The routed MCP surface: the endpoint itself and everything beneath it.
 *
 * @param path - A path already through {@link normaliseSkipPath}
 */
export function isMcpSurface(path: string): boolean {
  return path === MCP_RESOURCE_PATH || path.startsWith(`${MCP_RESOURCE_PATH}/`);
}

/**
 * True for a path beneath which only the public page and its own static
 * subresources are served, so a browser-shaped request there can be forked
 * away from auth.
 *
 * @param path - A path already through {@link normaliseSkipPath}
 */
export function isPublicPageSurface(path: string): boolean {
  return PUBLIC_PAGE_PATHS.has(path) || isMcpSurface(path);
}
