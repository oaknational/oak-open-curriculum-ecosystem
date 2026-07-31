/**
 * Reviewed post-baseline semantic deltas — App auth-surface governed sources
 * (auth routes, the MCP auth middleware family, and public-resource sets).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_AUTH_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  // MCP-351: the published PRM resource composes the shared
  // MCP_RESOURCE_PATH constant; the served document is byte-identical.
  'apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts': reviewed(
    '374e6f7c8b3b173b4a00a2d475f4f6b0aa97f5bec4aec40cadd679657dd9dddb',
    ['C705', 'C706', 'C707', 'C708'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/get-mcp-resource-url.ts': excluded(
    '1bac2a8ec91a09fb51dce02ec3f943bd76c9c3c4ee0097cc9bd318e8b716d2b0',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/get-prm-url.ts': excluded(
    'bf56a81ce02610f788fd3ceee1518bc7b6bf9a711d272b6fad6a18fbc78e41b4',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts': excluded(
    '86cc00d1dea41e43cf51bba107b0505e4728e7498f28d7bdadf91dff44a42a72',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-351: the response senders relocated to mcp-auth-responses.ts (file
  // split at the line limit); C399's fallback string stays with the
  // validation branch that composes it. Every sender body is verbatim.
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-responses.ts': reviewed(
    '62a933c1e0d11be1831fda411f4ff32da49694e6ea49078b3d15a13c4394b7ec',
    ['C395', 'C396', 'C397', 'C398', 'C400'],
  ),
  // MCP-392: the Authorization header now parses once into a closed
  // missing/malformed/bearer result (dismissals withdrawn at owner word);
  // C399's fallback string is untouched by the change.
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts': reviewed(
    '4b7d0c6cd44d480b9e4a4679744c5d570bd1d37bb7cc1d1e31d3ff7565825d13',
    ['C399'],
  ),
  // MCP-242: canonical verified-userId derivation for analytics identity —
  // pure auth-context plumbing, serves no agent-facing content.
  'apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verified-user-id.ts': excluded(
    'cfdd95b3968921c4dabcb48248e40cd18028eb386535019f77fe2dd79c29a586',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-353: the under-the-hood allowlist row (C413) retired with the deleted
  // resource (MCP-242's re-review of the pre-deletion file is superseded by
  // that retirement); the file now composes SDK-owned URI sets only.
  'apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts': excluded(
    '75bbea61c4b91c53a1ec93133852f9841844f94eb448973f9bbecfd855239227',
    IMPLEMENTATION_ONLY,
  ),
};
