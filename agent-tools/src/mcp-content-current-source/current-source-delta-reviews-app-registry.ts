/**
 * Reviewed post-baseline semantic deltas — App MCP Registry publication
 * sources (`src/mcp-registry/`, MCP-637).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 *
 * A family of its own rather than more rows in
 * `current-source-delta-reviews-app.ts`, which the auth family had already
 * outgrown for the same reason.
 *
 * These files compose Oak's entry in the official MCP Registry at
 * publication time, from the deployment's own configuration and this app's
 * existing served branding. None of them authors agent-facing content — the
 * catalogue description is supplied by the publisher through
 * `MCP_REGISTRY_DESCRIPTION`, precisely so that shortening a description to
 * fit the registry's 100-character cap stays an editorial decision with its
 * own review, rather than arriving as a silent addition here.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  TYPE_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_REGISTRY_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-registry/server-json.ts': excluded(
    '9b2398719cfb824a44e0e720111bca6a24e9fb4911fa94a7becad87d8ff95b6d',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-registry/server-json-types.ts': excluded(
    '8f14ea8e36bfdb60866b8ddaee35ebc9b7c3eadfb62e04ba4ef3cd90f49cc31f',
    TYPE_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-registry/server-json-constraints.ts': excluded(
    '747ba10b8d80b98165d28dc9a23efc5a41e8275f20d2bf5099925333c2cb9fe7',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-registry/server-json-inputs.ts': excluded(
    '3eb7825c72f2b4274335a5ae2fcc4382764b49c30bdb31976021fdca95ce66df',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-registry/registry-validation.ts': excluded(
    '89bf91fd133a1f1fb35f6b20abc31d39460e0e6b6529049a95ab80b145a4cebb',
    IMPLEMENTATION_ONLY,
  ),
};
