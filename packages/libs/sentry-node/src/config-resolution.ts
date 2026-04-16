import { err, ok, type Result } from '@oaknational/result';
import { trimToUndefined } from './config-parsing.js';
import type {
  GitShaSource,
  ObservabilityConfigError,
  ResolvedSentryEnvironment,
  ResolvedSentryRelease,
  SentryConfigEnvironment,
  SentryEnvironmentSource,
} from './types.js';

const ENVIRONMENT_PRECEDENCE = [
  'SENTRY_ENVIRONMENT_OVERRIDE',
  'VERCEL_ENV',
] as const satisfies readonly SentryEnvironmentSource[];

const RELEASE_PRECEDENCE = [
  'SENTRY_RELEASE_OVERRIDE',
] as const satisfies readonly 'SENTRY_RELEASE_OVERRIDE'[];

const GIT_SHA_PRECEDENCE = ['GIT_SHA', 'VERCEL_GIT_COMMIT_SHA'] as const;

function getEnvironmentValue(
  input: SentryConfigEnvironment,
  source: (typeof ENVIRONMENT_PRECEDENCE)[number],
): string | undefined {
  return trimToUndefined(input[source]);
}

export function resolveSentryEnvironment(
  input: SentryConfigEnvironment,
): ResolvedSentryEnvironment {
  for (const source of ENVIRONMENT_PRECEDENCE) {
    const value = getEnvironmentValue(input, source);

    if (value) {
      return {
        value,
        source,
      };
    }
  }

  return {
    value: 'development',
    source: 'development',
  };
}

function resolveAppVersion(
  input: SentryConfigEnvironment,
): Result<ResolvedSentryRelease, ObservabilityConfigError> {
  const version = trimToUndefined(input.APP_VERSION);

  if (!version) {
    return err({
      kind: 'missing_app_version',
    });
  }

  return ok({
    value: version,
    source: input.APP_VERSION_SOURCE ?? 'root_package_json',
  });
}

export function resolveSentryRelease(
  input: SentryConfigEnvironment,
): Result<ResolvedSentryRelease, ObservabilityConfigError> {
  for (const source of RELEASE_PRECEDENCE) {
    const value = trimToUndefined(input[source]);

    if (value) {
      return ok({
        value,
        source,
      });
    }
  }

  return resolveAppVersion(input);
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
