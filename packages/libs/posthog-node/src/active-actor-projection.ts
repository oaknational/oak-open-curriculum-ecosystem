import type { ResolvedRelease } from '@oaknational/build-metadata';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import { isActorPseudonym, reportSafely } from './event-policy-helpers.js';
import type { PostHogOperationalErrorKind } from './product-analytics-runtime-contract.js';

export interface ActiveActorProjectionPolicy {
  readonly environment: ResolvedRelease['environment'];
  readonly activeActorProjector: ActivePostHogActorProjector;
  readonly reportOperationalError: (kind: PostHogOperationalErrorKind) => void;
}

export function projectActiveActor(
  policy: ActiveActorProjectionPolicy,
  actorId: string,
): string | null {
  try {
    const projection = policy.activeActorProjector.project(actorId);
    if (
      !projection.ok ||
      projection.value.environment !== policy.environment ||
      !isActorPseudonym(projection.value.distinctId)
    ) {
      reportSafely(policy.reportOperationalError, 'posthog_identity_projection_failed');
      return null;
    }
    return projection.value.distinctId;
  } catch {
    reportSafely(policy.reportOperationalError, 'posthog_identity_projection_failed');
    return null;
  }
}
