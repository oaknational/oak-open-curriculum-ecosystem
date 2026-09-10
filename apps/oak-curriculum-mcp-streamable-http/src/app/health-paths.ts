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
 * Root-served deployments reach this app at their own root — the canonical
 * `mcp.` host does (verified 2026-09-01), and so do the legacy deployment
 * host, previews, and every local `curl`. This is the path their probes and
 * the preview-deploy gate already use, and it stays — `static-content.ts`
 * keeps its root asset mount for the same reason.
 *
 * Module-local: consumers want {@link HEALTH_PATHS} (every path the check
 * answers on) or {@link ROUTED_HEALTH_PATH} (the one inside the routed
 * surface). Nothing outside needs to single out the root path.
 */
const ROOT_HEALTH_PATH = '/healthz';

/**
 * The health path inside the routed surface — the canonical host's probe
 * target.
 *
 * @remarks
 * MCP-580. Under the release-era `www` edge rule, Cloudflare forwarded only
 * `/mcp` and `/mcp/*` without stripping the prefix, so a root-level
 * `/healthz` probe never arrived here — this path is what made a healthy
 * probe reachable through that edge at all. ADR-162 makes exposing a healthy
 * `/healthz` this repository's single monitoring obligation. The canonical
 * `mcp.` host serves both forms (verified 2026-09-01); the routed form stays
 * because a path-scoped edge may front this app again, and the obligation
 * must not depend on which edge shape is in force.
 *
 * **Derived, not a second spelling of `/mcp`.** Same reasoning as
 * `ROUTED_ASSET_BASE` in `static-asset-paths.ts`, which cures MCP-509 the same
 * way: the edge rule is scoped to the path this app publishes as its MCP
 * resource, so that constant — not a literal repeated here — is what the
 * health path has to sit beneath. An independent literal could drift to
 * somewhere the edge never forwards while the whole suite stayed green.
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
