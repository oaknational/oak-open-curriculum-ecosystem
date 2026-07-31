import { APP_DELTA_REVIEWS } from './current-source-delta-reviews-app.js';
import { APP_AUTH_DELTA_REVIEWS } from './current-source-delta-reviews-app-auth.js';
import { APP_LANDING_DELTA_REVIEWS } from './current-source-delta-reviews-app-landing.js';
import { APP_RATE_LIMITING_DELTA_REVIEWS } from './current-source-delta-reviews-app-rate-limiting.js';
import { APP_REGISTRATION_DELTA_REVIEWS } from './current-source-delta-reviews-app-registration.js';
import { APP_TEST_HELPERS_DELTA_REVIEWS } from './current-source-delta-reviews-app-test-helpers.js';
import { SDK_DELTA_REVIEWS } from './current-source-delta-reviews-sdk.js';
import { SDK_CODEGEN_DELTA_REVIEWS } from './current-source-delta-reviews-sdk-codegen.js';
import { SDK_GUIDANCE_RESOURCES_DELTA_REVIEWS } from './current-source-delta-reviews-sdk-guidance-resources.js';
import { SDK_GENERATED_TOOLS_DELTA_REVIEWS } from './current-source-delta-reviews-sdk-generated-tools.js';
import type { CurrentSourceDeltaReview } from './current-source-delta-review-helpers.js';

export type { CurrentSourceDeltaReview } from './current-source-delta-review-helpers.js';

/**
 * Reviewed post-baseline semantic deltas.
 *
 * Updating a governed file invalidates its exact semantic hash. This source
 * ledger must then name the reviewed item IDs or an explicit exclusion; the
 * generated inventory cannot approve its own change.
 */
export const CURRENT_SOURCE_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  ...APP_DELTA_REVIEWS,
  ...APP_AUTH_DELTA_REVIEWS,
  ...APP_LANDING_DELTA_REVIEWS,
  ...APP_RATE_LIMITING_DELTA_REVIEWS,
  ...APP_REGISTRATION_DELTA_REVIEWS,
  ...APP_TEST_HELPERS_DELTA_REVIEWS,
  ...SDK_DELTA_REVIEWS,
  ...SDK_CODEGEN_DELTA_REVIEWS,
  ...SDK_GENERATED_TOOLS_DELTA_REVIEWS,
  ...SDK_GUIDANCE_RESOURCES_DELTA_REVIEWS,
};
