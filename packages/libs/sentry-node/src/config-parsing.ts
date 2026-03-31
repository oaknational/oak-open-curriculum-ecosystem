import { err, ok, type Result } from '@oaknational/result';
import type { ObservabilityConfigError, SentryBooleanFlagName } from './types.js';

export function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function parseOptionalBooleanFlag(
  name: SentryBooleanFlagName,
  value: string | undefined,
): Result<boolean | undefined, ObservabilityConfigError> {
  const trimmed = trimToUndefined(value);

  if (!trimmed) {
    return ok(undefined);
  }

  if (trimmed === 'true') {
    return ok(true);
  }

  if (trimmed === 'false') {
    return ok(false);
  }

  return err({
    kind: 'invalid_boolean_flag',
    name,
    value: trimmed,
  });
}

export function parseTracesSampleRate(
  value: string | undefined,
): Result<number, ObservabilityConfigError> {
  const trimmed = trimToUndefined(value);

  if (!trimmed) {
    return err({
      kind: 'invalid_traces_sample_rate',
      value: '',
    });
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return err({
      kind: 'invalid_traces_sample_rate',
      value: trimmed,
    });
  }

  return ok(parsed);
}

export function validateDsn(value: string | undefined): Result<string, ObservabilityConfigError> {
  const dsn = trimToUndefined(value);

  if (!dsn) {
    return err({
      kind: 'missing_sentry_dsn',
    });
  }

  try {
    const parsed = new URL(dsn);

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return err({
        kind: 'invalid_sentry_dsn',
        value: dsn,
      });
    }

    return ok(dsn);
  } catch {
    return err({
      kind: 'invalid_sentry_dsn',
      value: dsn,
    });
  }
}
