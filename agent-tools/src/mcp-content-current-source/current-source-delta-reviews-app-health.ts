/**
 * Reviewed post-baseline semantic deltas — the health-check governed sources.
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 *
 * A family of its own rather than two more rows in
 * `current-source-delta-reviews-app.ts`, which sits at its `max-lines` ceiling.
 * The split is also the honest one: the health endpoint is operational surface
 * for an external uptime monitor, not a tool, resource, prompt, or page that
 * any MCP consumer reads.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_HEALTH_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  // MCP-580: the health check now answers inside the routed `/mcp` surface as
  // well as at the root, and pins `no-store`. An operational liveness endpoint
  // for an external uptime monitor — its `status`/`mode`/`auth` body reaches no
  // MCP consumer through any tool, resource, or prompt, and the served text is
  // unchanged in any case.
  'apps/oak-curriculum-mcp-streamable-http/src/app/health-endpoints.ts': excluded(
    '8861cf8030757030655cb462cce6282fa3041e990960b153cad47d47ac66ab84',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-580: the health check's served-path layout, extracted so the auth-skip
  // set can name the paths without importing the module that mounts them. Path
  // constants only; authors no content.
  'apps/oak-curriculum-mcp-streamable-http/src/app/health-paths.ts': excluded(
    '0574e655b9f5d634c9d364b288c88346dea0f66ef95fedaef5728d1cbb2cd21c',
    IMPLEMENTATION_ONLY,
  ),
};
