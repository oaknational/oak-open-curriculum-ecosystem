import { err, ok, type Result } from '@oaknational/result';

import { isValidReleaseName } from './release-name-validation.js';
import {
  RELEASE_ERROR_KINDS,
  RELEASE_SOURCES,
  type AppBuildIdentity,
  type ReleaseEnvironment,
  type ReleaseError,
  type ResolvedRelease,
} from './release-types.js';

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed;
}

/**
 * Project canonical app build identity into a Sentry release identifier.
 */
export function resolveBuildIdentityRelease(
  buildIdentity: AppBuildIdentity,
  environment: ReleaseEnvironment,
): Result<ResolvedRelease, ReleaseError> {
  const value = trimToUndefined(buildIdentity.value);

  if (!value || !isValidReleaseName(value)) {
    return err({
      kind: RELEASE_ERROR_KINDS.invalid_build_identity,
      message:
        `Cannot project app build identity "${buildIdentity.value}" to a ` +
        'Sentry release. Expected a Sentry-safe release name (no slash or ' +
        'backslash, no newlines or tabs, not "." / ".." / single space, ' +
        'length 1-200).',
    });
  }

  return ok({
    value,
    source: RELEASE_SOURCES.build_identity,
    environment,
  });
}
