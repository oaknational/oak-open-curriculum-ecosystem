import { err, ok, type Result } from '@oaknational/result';
import { trimToUndefined } from './config-parsing.js';
import type {
  ObservabilityConfigError,
  ResolvedSentryEnvironment,
  ResolvedSentryRelease,
  SentryConfigEnvironment,
  SentryEnvironmentSource,
  SentryMode,
  SentryReleaseSource,
} from './types.js';

const ENVIRONMENT_PRECEDENCE = [
  'SENTRY_ENVIRONMENT',
  'VERCEL_ENV',
  'NODE_ENV',
] as const satisfies readonly SentryEnvironmentSource[];

const RELEASE_PRECEDENCE = [
  'SENTRY_RELEASE',
  'VERCEL_GIT_COMMIT_SHA',
  'GITHUB_SHA',
  'COMMIT_SHA',
  'SOURCE_VERSION',
  'npm_package_version',
] as const satisfies readonly Exclude<SentryReleaseSource, 'local-dev'>[];

function getReleaseValue(
  input: SentryConfigEnvironment,
  source: (typeof RELEASE_PRECEDENCE)[number],
): string | undefined {
  if (source === 'npm_package_version') {
    return trimToUndefined(input.npm_package_version);
  }

  return trimToUndefined(input[source]);
}

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

export function resolveSentryRelease(
  mode: SentryMode,
  input: SentryConfigEnvironment,
): Result<ResolvedSentryRelease, ObservabilityConfigError> {
  for (const source of RELEASE_PRECEDENCE) {
    const value = getReleaseValue(input, source);

    if (value) {
      return ok({
        value,
        source,
      });
    }
  }

  if (mode === 'sentry') {
    return err({
      kind: 'missing_release_for_live_mode',
    });
  }

  return ok({
    value: 'local-dev',
    source: 'local-dev',
  });
}
