import { resolveApplicationVersion, type RuntimeMetadataError } from '@oaknational/build-metadata';
import { err, ok, type Result } from '@oaknational/result';
import type { SentryBuildEnvironment } from './sentry-build-plugin.js';

/**
 * Project ambient build env into the Sentry build-plugin environment.
 *
 * @remarks `APP_VERSION` is not owned by the process environment. It is
 * resolved from the app build identity seam (`APP_VERSION_OVERRIDE`, then the
 * repo package version fallback) and then projected into the Sentry-specific
 * release surface consumed by `createSentryBuildPlugin`.
 */
export function createSentryBuildEnvironment(
  processEnv: Readonly<Record<string, string | undefined>>,
): Result<SentryBuildEnvironment, RuntimeMetadataError> {
  const versionResult = resolveApplicationVersion(processEnv);

  if (!versionResult.ok) {
    return err(versionResult.error);
  }

  return ok({
    SENTRY_MODE: processEnv.SENTRY_MODE,
    SENTRY_DSN: processEnv.SENTRY_DSN,
    SENTRY_ENVIRONMENT_OVERRIDE: processEnv.SENTRY_ENVIRONMENT_OVERRIDE,
    SENTRY_RELEASE_OVERRIDE: processEnv.SENTRY_RELEASE_OVERRIDE,
    SENTRY_RELEASE_REGISTRATION_OVERRIDE: processEnv.SENTRY_RELEASE_REGISTRATION_OVERRIDE,
    SENTRY_TRACES_SAMPLE_RATE: processEnv.SENTRY_TRACES_SAMPLE_RATE,
    SENTRY_ENABLE_LOGS: processEnv.SENTRY_ENABLE_LOGS,
    SENTRY_SEND_DEFAULT_PII: processEnv.SENTRY_SEND_DEFAULT_PII,
    SENTRY_DEBUG: processEnv.SENTRY_DEBUG,
    SENTRY_AUTH_TOKEN: processEnv.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: processEnv.SENTRY_ORG,
    SENTRY_PROJECT: processEnv.SENTRY_PROJECT,
    SENTRY_REPO_SLUG: processEnv.SENTRY_REPO_SLUG,
    VERCEL_ENV: processEnv.VERCEL_ENV,
    VERCEL_BRANCH_URL: processEnv.VERCEL_BRANCH_URL,
    VERCEL_GIT_COMMIT_REF: processEnv.VERCEL_GIT_COMMIT_REF,
    VERCEL_GIT_COMMIT_SHA: processEnv.VERCEL_GIT_COMMIT_SHA,
    VERCEL_GIT_REPO_OWNER: processEnv.VERCEL_GIT_REPO_OWNER,
    VERCEL_GIT_REPO_SLUG: processEnv.VERCEL_GIT_REPO_SLUG,
    APP_VERSION: versionResult.value.value,
    APP_VERSION_SOURCE: versionResult.value.source,
    GIT_SHA: processEnv.GIT_SHA,
    GIT_SHA_SOURCE: undefined,
  });
}
