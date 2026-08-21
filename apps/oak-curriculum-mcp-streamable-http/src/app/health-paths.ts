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
 * Every host this app is served at serves it from that host's own root — the
 * canonical host, the alpha host, preview deployments and local development
 * alike — so this is the path their probes, the preview-deploy gate, and every
 * local `curl` use. `static-content.ts` mounts its assets at the root for the
 * same reason.
 *
 * Module-local: consumers want {@link HEALTH_PATHS} (every path the check
 * answers on) or {@link ROUTED_HEALTH_PATH}. One exported pair is enough, and
 * nothing outside needs to single out the root path.
 */
const ROOT_HEALTH_PATH = '/healthz';

/**
 * The health path inside the routed surface.
 *
 * @remarks
 * MCP-580. ADR-162 makes exposing a healthy `/healthz` this repository's single
 * monitoring obligation, and this path discharges it on the routed surface: it
 * answers wherever the app is served, so a monitor holding it needs no
 * per-host knowledge. Measured 2026-08-21, both this path and the root path
 * return 200 with `no-store` on the canonical host.
 *
 * **Derived, not a second spelling of `/mcp`.** Same reasoning as
 * `ROUTED_ASSET_BASE` in `static-asset-paths.ts`: an independent literal
 * repeated here could drift from the resource path while the whole suite stayed
 * green.
 *
 * Why the routed form exists at all is a history record, and it lives once, in
 * `static-asset-paths.ts` — the withdrawn `www` origin rule and the five path
 * families it covered. In short: while the app was served under
 * `www.thenational.academy/mcp`, a root `/healthz` was outside the rule's scope
 * and reached the main website's 404 instead of this app, so the health path
 * had to sit inside the routed surface. That rule was withdrawn 2026-08-20.
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
