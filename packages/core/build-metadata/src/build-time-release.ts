import { err, type Result } from '@oaknational/result';

import {
  deriveEnvironment,
  resolveDevelopmentRelease,
  resolveOverride,
  resolvePreviewRelease,
  resolveProductionRelease,
} from './build-time-release-internals.js';
import type {
  BuildTimeReleaseEnvironmentInput,
  BuildTimeReleaseError,
  ResolvedBuildTimeRelease,
} from './build-time-release-types.js';
import { resolveGitSha } from './runtime-metadata.js';

export type {
  BuildTimeReleaseEnvironment,
  BuildTimeReleaseEnvironmentInput,
  BuildTimeReleaseError,
  BuildTimeReleaseSource,
  ResolvedBuildTimeRelease,
} from './build-time-release-types.js';

/**
 * Resolve the canonical Sentry release name from build-time inputs.
 *
 * @remarks Single source of truth for the L-8 Correction
 * version-resolution strategy. Pure: composes
 * {@link ./runtime-metadata.js#resolveApplicationVersion |
 * runtime-metadata}'s primitives; no other direct boundary reads.
 *
 * Precedence:
 *
 * 1. `SENTRY_RELEASE_OVERRIDE` — honoured first in every context so
 *    local-dev rehearsals and one-off probes can pin the release name.
 * 2. Effective environment selects one of three derivation rules:
 *      - `production` (`VERCEL_ENV=production` AND
 *        `VERCEL_GIT_COMMIT_REF=main`): root `package.json` version.
 *      - `preview` (any other `VERCEL_ENV=production`/`preview`):
 *        `preview-<branch-slug>-<shortSha>`.
 *      - `development` (everything else): `dev-<shortSha>`.
 *
 * Errors are vital-identity failures per the L-8 Correction
 * `Corrected fail-policy` table; the composition root MUST throw on
 * any err result.
 */
export function resolveBuildTimeRelease(
  env: BuildTimeReleaseEnvironmentInput,
): Result<ResolvedBuildTimeRelease, BuildTimeReleaseError> {
  const shaResult = resolveGitSha(env);

  if (!shaResult.ok) {
    return err({
      kind: 'invalid_git_sha',
      message: shaResult.error.message,
    });
  }

  const gitSha = shaResult.value?.value;
  const environment = deriveEnvironment(env);

  const overrideResult = resolveOverride(env, environment, gitSha);

  if (overrideResult) {
    return overrideResult;
  }

  if (environment === 'production') {
    return resolveProductionRelease(env, gitSha);
  }

  if (environment === 'preview') {
    return resolvePreviewRelease(env, gitSha);
  }

  return resolveDevelopmentRelease(gitSha);
}
