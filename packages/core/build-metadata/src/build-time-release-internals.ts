/**
 * Internal helpers for {@link ./build-time-release.js#resolveBuildTimeRelease}.
 *
 * @remarks Extracted from the public-API module to keep
 * `build-time-release.ts` under the workspace `max-lines: 250` budget.
 * Each function is pure and takes the same
 * {@link BuildTimeReleaseEnvironmentInput} the public dispatcher
 * accepts; behaviour is exhaustively covered by
 * `tests/build-time-release.unit.test.ts` via the public dispatcher
 * (no separate test file — these are implementation detail).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import type {
  BuildTimeReleaseEnvironment,
  BuildTimeReleaseEnvironmentInput,
  BuildTimeReleaseError,
  ResolvedBuildTimeRelease,
} from './build-time-release-types.js';
import { resolveApplicationVersion } from './runtime-metadata.js';

const SENTRY_RELEASE_NAME_PATTERN = /^[\w.\-+/=:@~]{1,200}$/u;
const PREVIEW_BRANCH_SLUG_MAX_LENGTH = 60;
const SHORT_SHA_LENGTH = 7;
const MAIN_BRANCH = 'main';

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isValidReleaseName(value: string): boolean {
  if (value === '.' || value === '..' || value === 'latest') {
    return false;
  }

  return SENTRY_RELEASE_NAME_PATTERN.test(value);
}

/**
 * Slugify a branch ref for inclusion in a Sentry release name.
 *
 * @remarks Lowercase, non-`[a-z0-9-]` collapsed to `-`, runs of `-`
 * collapsed, leading/trailing `-` trimmed, length-capped to keep the
 * full release name (`preview-<slug>-<shortSha>`) under Sentry's
 * 200-character limit and human-scannable in the UI.
 */
function slugifyBranch(branch: string): string {
  const slug = branch
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/-+/gu, '-')
    .replace(/^-+|-+$/gu, '');

  if (slug.length === 0) {
    return 'unknown';
  }

  return slug.slice(0, PREVIEW_BRANCH_SLUG_MAX_LENGTH).replace(/-+$/u, '');
}

/**
 * Derive the effective deployment environment for release naming.
 *
 * @remarks Mirrors the production-downgrade rule from
 * `resolveSentryEnvironment` in `@oaknational/sentry-node`:
 * `VERCEL_ENV=production` from a non-`main` branch is treated as
 * `preview` so non-main branches cannot pollute the production
 * release bucket.
 */
export function deriveEnvironment(
  env: BuildTimeReleaseEnvironmentInput,
): BuildTimeReleaseEnvironment {
  const vercelEnv = trimToUndefined(env.VERCEL_ENV);
  const branch = trimToUndefined(env.VERCEL_GIT_COMMIT_REF);

  if (vercelEnv === 'production' && branch === MAIN_BRANCH) {
    return 'production';
  }

  if (vercelEnv === 'production' || vercelEnv === 'preview') {
    return 'preview';
  }

  return 'development';
}

export function resolveOverride(
  env: BuildTimeReleaseEnvironmentInput,
  environment: BuildTimeReleaseEnvironment,
  gitSha: string | undefined,
): Result<ResolvedBuildTimeRelease, BuildTimeReleaseError> | undefined {
  const override = trimToUndefined(env.SENTRY_RELEASE_OVERRIDE);

  if (!override) {
    return undefined;
  }

  if (!isValidReleaseName(override)) {
    return err({
      kind: 'invalid_release_override',
      message:
        `Invalid SENTRY_RELEASE_OVERRIDE value "${override}". ` +
        'Expected a Sentry-safe release name (no whitespace, no "*", not "latest"/"."/"..", \u2264200 chars).',
    });
  }

  return ok({
    value: override,
    source: 'SENTRY_RELEASE_OVERRIDE',
    environment,
    gitSha,
  });
}

export function resolveProductionRelease(
  env: BuildTimeReleaseEnvironmentInput,
  gitSha: string | undefined,
): Result<ResolvedBuildTimeRelease, BuildTimeReleaseError> {
  const versionResult = resolveApplicationVersion(env);

  if (!versionResult.ok) {
    return err({
      kind: versionResult.error.message.includes('Invalid')
        ? 'invalid_application_version'
        : 'missing_application_version',
      message:
        `Cannot resolve release name on production: ${versionResult.error.message} ` +
        'Ensure semantic-release ran successfully before this build, or set APP_VERSION_OVERRIDE.',
    });
  }

  return ok({
    value: versionResult.value.value,
    source: 'application_version',
    environment: 'production',
    gitSha,
  });
}

export function resolvePreviewRelease(
  env: BuildTimeReleaseEnvironmentInput,
  gitSha: string | undefined,
): Result<ResolvedBuildTimeRelease, BuildTimeReleaseError> {
  const branch = trimToUndefined(env.VERCEL_GIT_COMMIT_REF);

  if (!branch) {
    return err({
      kind: 'missing_branch_in_preview',
      message:
        'Cannot resolve preview release name: VERCEL_GIT_COMMIT_REF is not set. ' +
        'Vercel preview builds always populate this; set it manually for local rehearsals.',
    });
  }

  if (!gitSha) {
    return err({
      kind: 'missing_git_sha',
      message:
        'Cannot resolve preview release name: no git SHA available. ' +
        'Set VERCEL_GIT_COMMIT_SHA or GIT_SHA_OVERRIDE.',
    });
  }

  const slug = slugifyBranch(branch);
  const shortSha = gitSha.slice(0, SHORT_SHA_LENGTH);

  return ok({
    value: `preview-${slug}-${shortSha}`,
    source: 'preview_branch_sha',
    environment: 'preview',
    gitSha,
  });
}

export function resolveDevelopmentRelease(
  gitSha: string | undefined,
): Result<ResolvedBuildTimeRelease, BuildTimeReleaseError> {
  if (!gitSha) {
    return err({
      kind: 'missing_git_sha',
      message:
        'Cannot resolve development release name: no git SHA available. ' +
        'Set VERCEL_GIT_COMMIT_SHA or GIT_SHA_OVERRIDE, or use SENTRY_RELEASE_OVERRIDE for ad-hoc rehearsals.',
    });
  }

  return ok({
    value: `dev-${gitSha.slice(0, SHORT_SHA_LENGTH)}`,
    source: 'development_short_sha',
    environment: 'development',
    gitSha,
  });
}
