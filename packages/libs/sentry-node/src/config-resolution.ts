import {
  resolveRelease,
  type ReleaseError,
  type ResolvedRelease,
} from '@oaknational/build-metadata';
import { err, ok, type Result } from '@oaknational/result';
import { trimToUndefined } from './config-parsing.js';
import type {
  GitShaSource,
  ObservabilityConfigError,
  ResolvedSentryEnvironment,
  ResolvedSentryRegistrationPolicy,
  ResolvedSentryRelease,
  SentryConfigEnvironment,
  SentryEnvironmentSource,
  SentryEnvironmentWarning,
} from './types.js';

const ENVIRONMENT_PRECEDENCE = [
  'SENTRY_ENVIRONMENT_OVERRIDE',
  'VERCEL_ENV',
] as const satisfies readonly SentryEnvironmentSource[];

const GIT_SHA_PRECEDENCE = ['GIT_SHA', 'VERCEL_GIT_COMMIT_SHA'] as const;

const MAIN_BRANCH = 'main';
const REGISTRATION_OVERRIDE_ENABLED = '1';

function getEnvironmentValue(
  input: SentryConfigEnvironment,
  source: (typeof ENVIRONMENT_PRECEDENCE)[number],
): string | undefined {
  return trimToUndefined(input[source]);
}

/**
 * Resolve the Sentry environment identity (ADR-163 §3).
 *
 * @remarks Narrow contract: environment identity only. Registration
 * policy and branch-shape warnings are the responsibility of
 * {@link resolveSentryRegistrationPolicy}. When `VERCEL_ENV=production`
 * and the commit ref is NOT `main`, the environment is downgraded to
 * `preview` so non-main branches cannot pollute the production
 * environment bucket in Sentry.
 */
export function resolveSentryEnvironment(
  input: SentryConfigEnvironment,
): ResolvedSentryEnvironment {
  for (const source of ENVIRONMENT_PRECEDENCE) {
    const value = getEnvironmentValue(input, source);

    if (!value) {
      continue;
    }

    if (source === 'VERCEL_ENV' && value === 'production' && !isOnMainBranch(input)) {
      return { value: 'preview', source };
    }

    return { value, source };
  }

  return { value: 'development', source: 'development' };
}

function isOnMainBranch(input: SentryConfigEnvironment): boolean {
  return trimToUndefined(input.VERCEL_GIT_COMMIT_REF) === MAIN_BRANCH;
}

function isRegistrationOverrideEnabled(input: SentryConfigEnvironment): boolean {
  return (
    trimToUndefined(input.SENTRY_RELEASE_REGISTRATION_OVERRIDE) === REGISTRATION_OVERRIDE_ENABLED
  );
}

function hasReleaseOverrideValue(input: SentryConfigEnvironment): boolean {
  return trimToUndefined(input.SENTRY_RELEASE_OVERRIDE) !== undefined;
}

function derivePolicyFromEnv(input: SentryConfigEnvironment): ResolvedSentryRegistrationPolicy {
  const vercelEnv = trimToUndefined(input.VERCEL_ENV);
  const ref = trimToUndefined(input.VERCEL_GIT_COMMIT_REF);

  if (vercelEnv === 'production') {
    if (ref === MAIN_BRANCH) {
      return { registerRelease: true };
    }

    const warning: SentryEnvironmentWarning = ref
      ? 'production_env_with_non_main_branch'
      : 'production_env_with_missing_branch';
    return { registerRelease: true, warning };
  }

  if (vercelEnv === 'preview') {
    return { registerRelease: true };
  }

  return { registerRelease: false };
}

/**
 * Resolve the Sentry release-registration policy (ADR-163 §3 + §4).
 *
 * @remarks Sibling of {@link resolveSentryEnvironment} with a narrow
 * single responsibility: "should this build register a release with
 * Sentry?" plus an optional branch-shape warning. The local-dev
 * override pair (`SENTRY_RELEASE_REGISTRATION_OVERRIDE=1` with
 * `SENTRY_RELEASE_OVERRIDE=<version>`) is validated at parse time —
 * setting one without the other is a configuration error. The pair
 * only enables registration in environments where it would otherwise
 * be skipped (development / unset); in production / preview the
 * policy is unchanged because registration is already enabled.
 */
export function resolveSentryRegistrationPolicy(
  input: SentryConfigEnvironment,
): Result<ResolvedSentryRegistrationPolicy, ObservabilityConfigError> {
  const overrideEnabled = isRegistrationOverrideEnabled(input);
  const overrideValuePresent = hasReleaseOverrideValue(input);
  const basePolicy = derivePolicyFromEnv(input);

  if (overrideEnabled && !overrideValuePresent) {
    return err({ kind: 'invalid_release_registration_override' });
  }

  if (!overrideEnabled && overrideValuePresent && !basePolicy.registerRelease) {
    return err({ kind: 'invalid_release_registration_override' });
  }

  if (overrideEnabled && !basePolicy.registerRelease) {
    return ok({ registerRelease: true });
  }

  return ok(basePolicy);
}

/**
 * Resolve the Sentry release identifier by delegating to the canonical
 * {@link resolveRelease} in `@oaknational/build-metadata`.
 *
 * @remarks Thin adapter. The collapsed `resolveRelease` is the single
 * source of truth for release resolution across build-time and runtime;
 * this function adapts its {@link ResolvedRelease} / {@link ReleaseError}
 * shape to the sentry-node-local
 * {@link ResolvedSentryRelease} / {@link ObservabilityConfigError}
 * shape. Since `SentryConfigEnvironment extends ReleaseInput`, no
 * runtime re-projection of fields is needed.
 */
export function resolveSentryRelease(
  input: SentryConfigEnvironment,
): Result<ResolvedSentryRelease, ObservabilityConfigError> {
  const result = resolveRelease(input);

  if (!result.ok) {
    return err(toObservabilityConfigError(result.error));
  }

  return ok(toResolvedSentryRelease(result.value));
}

function toResolvedSentryRelease(release: ResolvedRelease): ResolvedSentryRelease {
  return {
    value: release.value,
    source: release.source,
  };
}

function toObservabilityConfigError(error: ReleaseError): ObservabilityConfigError {
  switch (error.kind) {
    case 'invalid_release_override':
      return { kind: 'invalid_release_override', value: error.message };
    case 'missing_application_version':
      return { kind: 'missing_app_version' };
    case 'invalid_application_version':
      return { kind: 'invalid_app_version', value: error.message };
    case 'missing_branch_url_in_preview':
      return { kind: 'missing_branch_url_in_preview' };
    case 'missing_git_sha':
      return { kind: 'missing_git_sha' };
    default: {
      const exhaustive: never = error.kind;
      throw new Error(`Unhandled ReleaseError kind: ${String(exhaustive)}`);
    }
  }
}

function isValidGitSha(value: string): boolean {
  return /^[0-9a-f]{7,40}$/iu.test(value);
}

export function resolveGitSha(
  input: SentryConfigEnvironment,
): Result<
  { readonly value: string; readonly source: GitShaSource } | undefined,
  ObservabilityConfigError
> {
  for (const source of GIT_SHA_PRECEDENCE) {
    const value = trimToUndefined(
      source === 'GIT_SHA' ? input.GIT_SHA : input.VERCEL_GIT_COMMIT_SHA,
    );

    if (!value) {
      continue;
    }

    if (!isValidGitSha(value)) {
      return err({
        kind: 'invalid_git_sha',
        value,
      });
    }

    return ok({
      value,
      source:
        source === 'GIT_SHA'
          ? (input.GIT_SHA_SOURCE ?? 'GIT_SHA_OVERRIDE')
          : 'VERCEL_GIT_COMMIT_SHA',
    });
  }

  return ok(undefined);
}
