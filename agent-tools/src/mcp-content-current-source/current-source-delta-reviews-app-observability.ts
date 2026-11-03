import {
  excluded,
  IMPLEMENTATION_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

/**
 * Reviewed post-baseline semantic deltas under the HTTP app's observability
 * composition (`src/observability/`): the Sentry runtime initialiser and the
 * pure configuration parse it shares with the build-time deploy-config gate.
 */
export const APP_OBSERVABILITY_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  'apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts': excluded(
    '693382049ffc860fea742247d64989d89cb34c9dcca0421f71d1eaf9cf6f4dae',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/observability/http-sentry-config.ts': excluded(
    'eaf3732eae1b1a2d1ee6d20ef5c55e793d0cdb3c0f23e7aed37850bf9819bd14',
    IMPLEMENTATION_ONLY,
  ),
};
