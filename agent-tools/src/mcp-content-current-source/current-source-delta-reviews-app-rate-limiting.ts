/**
 * Reviewed post-baseline semantic deltas — the MCP-411 rate-limiter
 * removal (ADR-219: rate limiting is an edge concern).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 * Split from `current-source-delta-reviews-app.ts` when the MCP-411 entries
 * took that map over the file-size gate (the same split the MCP-243
 * test-helpers entries made).
 *
 * The four limiter sources are deleted (their governed 429 rows C409-C412
 * retired via post-baseline lineage); the wiring files below entered the
 * delta set by losing their limiter parameters and re-truing their
 * threat-model docblocks; none adds governed content.
 */
import {
  DELETED_SOURCE,
  excluded,
  IMPLEMENTATION_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_RATE_LIMITING_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  'apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/create-rate-limiters.ts': excluded(
    'c4805f3c926a05e89cb97de26c526c34c60a4776f79c56a5ca4b74aef6af71d8',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/index.ts': excluded(
    '7204e6032134b47d6cb3d2677db4323407d4cfd6a5c854f531c5dfd0379d5e60',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts': excluded(
    '227beb53e5c4ed1862042c7186c67686b42da4d323ae6af0e6b6ce759cffe2d4',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limiter-factory.ts': excluded(
    '8d253a807330e0151ae1195feaed62dca64033b8248acdbb3d7452c8fe575008',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts': excluded(
    'c822d0405b9787892cc1b42dcc1cbdf92d426a9eb65863fcaaafeb79cfb13e27',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts': excluded(
    '636da7a7ccc0ccc7726aef04f872fd78b955bd373734c4d0e71364ccd65fcf96',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts': excluded(
    'ebd0f673547d88cc57a006a125628c4653f2df74c58007d5789b66345103cef4',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/test-error/register-diagnostic-routes.ts': excluded(
    'b67fdd88e58a0b94f5ddba93094da7cabe4e6077fbfe1fab2c31baab004cd333',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/test-error/test-error-route.ts': excluded(
    '0f338b45ddf4d911f0573b19fd10ac6a0d708a81975d7e9edab98e710f0bb069',
    IMPLEMENTATION_ONLY,
  ),
};
