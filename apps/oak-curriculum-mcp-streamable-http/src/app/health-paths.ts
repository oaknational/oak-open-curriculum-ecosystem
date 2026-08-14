/**
 * Served-path layout of the health check.
 *
 * @remarks
 * Kept apart from `health-endpoints.ts` — which registers the routes — because
 * `clerk-skip-surfaces.ts` needs the same names to exempt the paths from auth,
 * and a consumer that only wants to know WHERE health lives should not have to
 * import the module that mounts it. Same boundary, same reason, as
 * `static-asset-paths.ts` beside `static-content.ts`.
 */
import { MCP_RESOURCE_PATH } from '../served-origin.js';

/**
 * The health path at the app root.
 *
 * @remarks
 * The alpha host serves this app at its own root, so this is the path its
 * probes, the preview-deploy gate, and every local `curl` already use. It is a
 * declared compatibility surface — `static-content.ts` keeps its root asset
 * mount for the same reason — and it stays.
 *
 * Module-local: consumers want {@link HEALTH_PATHS} (every path the check
 * answers on) or {@link ROUTED_HEALTH_PATH} (the one the canonical host
 * reaches). Nothing outside needs to single out the root path, and exporting it
 * would invite a caller to name the path that does not work on `www`.
 */
const ROOT_HEALTH_PATH = '/healthz';

/**
 * The health path inside the routed surface — the canonical host's probe
 * target.
 *
 * @remarks
 * MCP-580. The canonical deployment reaches this app through a Cloudflare
 * origin rule scoped to `/mcp` and `/mcp/*`, and the rule does not strip the
 * prefix. So a root-level `/healthz` probe on `www` never arrives here at
 * all — it stays on the main website and collects that site's 404 HTML —
 * while `/mcp/healthz` arrived intact and, until this path was served, met
 * Express's own 404. ADR-162 makes exposing a healthy `/healthz` this
 * repository's single monitoring obligation, and an obligation discharged only
 * on a non-canonical alias is not discharged.
 *
 * **Derived, not a second spelling of `/mcp`.** Same reasoning as
 * `ROUTED_ASSET_BASE` in `static-asset-paths.ts`, which cures MCP-509 the same
 * way: the edge rule is scoped to the path this app publishes as its MCP
 * resource, so that constant — not a literal repeated here — is what the
 * health path has to sit beneath. An independent literal could drift to
 * somewhere the edge never forwards while the whole suite stayed green.
 *
 * Widening the Cloudflare rule to claim root-level `/healthz` on `www` is the
 * alternative, and it is not this repository's to take: it would put this app
 * in the main website's namespace, a collision review nobody has done. Staying
 * inside the existing contained route needs no edge change at all.
 *
 * **Probe this path with no trailing slash.** Express is non-strict by
 * default, so `/mcp/healthz/` reaches the same handler — but it matches
 * neither `CLERK_SKIP_PATHS` nor any skip prefix, so the slashed form puts the
 * auth vendor inside the liveness path. That mismatch is a characterised,
 * owner-held class awaiting a policy ADR (see `normaliseSkipPath` in
 * `clerk-skip-surfaces.ts`), so it is deliberately not cured here; the
 * consequence for a monitor URL is recorded in `docs/manual-uat-guide.md`.
 */
export const ROUTED_HEALTH_PATH = `${MCP_RESOURCE_PATH}${ROOT_HEALTH_PATH}` as const;

/**
 * Every path the health check answers on.
 *
 * @remarks
 * One handler, two paths — the pattern `static-content.ts` already uses for
 * the asset mounts — so the routed and root answers cannot drift apart and
 * tell a monitor two different truths.
 */
export const HEALTH_PATHS = [ROOT_HEALTH_PATH, ROUTED_HEALTH_PATH] as const;
