/**
 * Internal helpers for {@link ./release.js#resolveRelease}.
 *
 * @remarks Extracted from the public-API module to keep `release.ts`
 * under the workspace `max-lines: 250` budget. Each function is pure
 * and takes the same {@link ReleaseInput} the public dispatcher
 * accepts; behaviour is exhaustively covered by
 * `tests/release.unit.test.ts` via the public dispatcher.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import { prerelease as semverPrerelease, valid as semverValid } from 'semver';

import { parseBranchUrlLabel } from './release-branch-url.js';
import { isValidReleaseName } from './release-name-validation.js';
import {
  BUILD_IDENTITY_BRANCHES,
  RELEASE_ENVIRONMENTS,
  RELEASE_ERROR_KINDS,
  RELEASE_SOURCES,
  type ReleaseEnvironment,
  type ReleaseError,
  type ReleaseInput,
  type ResolvedRelease,
} from './release-types.js';

const SHORT_SHA_LENGTH = 7;

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed;
}

/**
 * Derive the effective deployment environment for release naming.
 *
 * @remarks Mirrors the production-downgrade rule from
 * `resolveSentryEnvironment` in `oaknational/sentry-node`:
 * `VERCEL_ENV=production` from a non-`main` branch is treated as
 * `preview` so non-main branches cannot pollute the production
 * release bucket in Sentry.
 */
export function deriveEnvironment(input: ReleaseInput): ReleaseEnvironment {
  const vercelEnv = trimToUndefined(input.VERCEL_ENV);
  const branch = trimToUndefined(input.VERCEL_GIT_COMMIT_REF);

  if (vercelEnv === RELEASE_ENVIRONMENTS.production && branch === BUILD_IDENTITY_BRANCHES.main) {
    return RELEASE_ENVIRONMENTS.production;
  }

  if (vercelEnv === RELEASE_ENVIRONMENTS.production || vercelEnv === RELEASE_ENVIRONMENTS.preview) {
    return RELEASE_ENVIRONMENTS.preview;
  }

  return RELEASE_ENVIRONMENTS.development;
}

/**
 * Honour a `SENTRY_RELEASE_OVERRIDE` if present.
 *
 * @returns `undefined` when no override is set; a `Result` with the
 * resolved release (or a validation error) otherwise.
 */
export function resolveOverride(
  input: ReleaseInput,
  environment: ReleaseEnvironment,
): Result<ResolvedRelease, ReleaseError> | undefined {
  const override = trimToUndefined(input.SENTRY_RELEASE_OVERRIDE);

  if (!override) {
    return undefined;
  }

  if (!isValidReleaseName(override)) {
    return err({
      kind: RELEASE_ERROR_KINDS.invalid_release_override,
      message:
        `Invalid SENTRY_RELEASE_OVERRIDE value "${override}". ` +
        'Expected a Sentry-safe release name (no slash or backslash, no ' +
        'newlines or tabs, not "." / ".." / single space, length 1-200).',
    });
  }

  return ok({
    value: override,
    source: RELEASE_SOURCES.sentry_release_override,
    environment,
  });
}

/**
 * Resolve the production release identifier as the validated root
 * `package.json` semver supplied via `APP_VERSION`.
 *
 * @remarks Pre-release semver on `main` is rejected per the Truth
 * Tables note — Oak's release pipeline does not publish pre-releases
 * to `main`, so receiving one here indicates a misconfigured
 * composition root.
 */
export function resolveProductionRelease(
  input: ReleaseInput,
): Result<ResolvedRelease, ReleaseError> {
  const version = trimToUndefined(input.APP_VERSION);

  if (!version) {
    return err({
      kind: RELEASE_ERROR_KINDS.missing_application_version,
      message:
        'Cannot resolve release on production: APP_VERSION is not set. ' +
        'The composition root must resolve APP_VERSION (from root ' +
        'package.json or APP_VERSION_OVERRIDE via resolveApplicationVersion) ' +
        'before calling resolveRelease.',
    });
  }

  if (semverValid(version) === null) {
    return err({
      kind: RELEASE_ERROR_KINDS.invalid_application_version,
      message:
        `Cannot resolve release on production: APP_VERSION "${version}" is ` +
        'not a valid semver. Ensure semantic-release ran successfully before ' +
        'this build, or set APP_VERSION_OVERRIDE to a valid semver.',
    });
  }

  if (semverPrerelease(version) !== null) {
    return err({
      kind: RELEASE_ERROR_KINDS.invalid_application_version,
      message:
        `Cannot resolve release on production: APP_VERSION "${version}" is a ` +
        'pre-release identifier. Oak does not publish pre-releases to main.',
    });
  }

  return ok({
    value: version,
    source: RELEASE_SOURCES.application_version,
    environment: RELEASE_ENVIRONMENTS.production,
  });
}

/**
 * Resolve the preview release identifier as the leftmost label of
 * `VERCEL_BRANCH_URL`'s hostname.
 */
export function resolvePreviewRelease(input: ReleaseInput): Result<ResolvedRelease, ReleaseError> {
  const branchUrl = trimToUndefined(input.VERCEL_BRANCH_URL);

  if (!branchUrl) {
    return err({
      kind: RELEASE_ERROR_KINDS.missing_branch_url_in_preview,
      message:
        'Cannot resolve preview release: VERCEL_BRANCH_URL is not set. ' +
        'Vercel preview builds always populate this; set it manually for ' +
        'local rehearsals.',
    });
  }

  const label = parseBranchUrlLabel(branchUrl, isValidReleaseName);

  if (typeof label !== 'string') {
    return err(label);
  }

  return ok({
    value: label,
    source: RELEASE_SOURCES.vercel_branch_url,
    environment: RELEASE_ENVIRONMENTS.preview,
  });
}

/**
 * Resolve the development release identifier.
 *
 * @remarks Prefers a `VERCEL_BRANCH_URL` host label when set (covers
 * `vercel dev` with a Vercel-emulated environment); otherwise falls
 * back to `dev-<shortSha>` from `VERCEL_GIT_COMMIT_SHA`.
 */
export function resolveDevelopmentRelease(
  input: ReleaseInput,
): Result<ResolvedRelease, ReleaseError> {
  const branchUrl = trimToUndefined(input.VERCEL_BRANCH_URL);

  if (branchUrl) {
    const label = parseBranchUrlLabel(branchUrl, isValidReleaseName);
    if (typeof label === 'string') {
      return ok({
        value: label,
        source: RELEASE_SOURCES.vercel_branch_url,
        environment: RELEASE_ENVIRONMENTS.development,
      });
    }
    // Fall through to SHA-based path: a malformed local VERCEL_BRANCH_URL
    // must not block `dev-<shortSha>` resolution.
  }

  const sha = trimToUndefined(input.VERCEL_GIT_COMMIT_SHA);

  if (!sha) {
    return err({
      kind: RELEASE_ERROR_KINDS.missing_git_sha,
      message:
        'Cannot resolve development release: VERCEL_GIT_COMMIT_SHA is not ' +
        'set and no usable VERCEL_BRANCH_URL. Set VERCEL_GIT_COMMIT_SHA or ' +
        'use SENTRY_RELEASE_OVERRIDE for ad-hoc rehearsals.',
    });
  }

  return ok({
    value: `dev-${sha.slice(0, SHORT_SHA_LENGTH)}`,
    source: RELEASE_SOURCES.development_short_sha,
    environment: RELEASE_ENVIRONMENTS.development,
  });
}
