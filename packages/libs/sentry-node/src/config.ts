import { err, ok, type Result } from '@oaknational/result';
import {
  parseOptionalBooleanFlag,
  parseTracesSampleRate,
  trimToUndefined,
  validateDsn,
} from './config-parsing.js';
import { resolveSentryEnvironment, resolveSentryRelease } from './config-resolution.js';
import type {
  ObservabilityConfigError,
  ParsedSentryConfig,
  ResolvedSentryEnvironment,
  ResolvedSentryRelease,
  SentryConfigEnvironment,
  SentryFixtureConfig,
  SentryLiveConfig,
  SentryMode,
  SentryOffConfig,
} from './types.js';

export { resolveSentryEnvironment, resolveSentryRelease } from './config-resolution.js';

interface ParsedSentryBooleanFlags {
  readonly enableLogs: boolean | undefined;
  readonly debug: boolean | undefined;
}

function isSentryMode(value: string): value is SentryMode {
  return value === 'off' || value === 'fixture' || value === 'sentry';
}

function parseMode(input: SentryConfigEnvironment): Result<SentryMode, ObservabilityConfigError> {
  const rawMode = trimToUndefined(input.SENTRY_MODE);

  if (!rawMode) {
    return ok('off');
  }

  if (!isSentryMode(rawMode)) {
    return err({
      kind: 'invalid_sentry_mode',
      value: rawMode,
    });
  }

  return ok(rawMode);
}

function parseBooleanFlags(
  input: SentryConfigEnvironment,
): Result<ParsedSentryBooleanFlags, ObservabilityConfigError> {
  const sendDefaultPiiResult = parseOptionalBooleanFlag(
    'SENTRY_SEND_DEFAULT_PII',
    input.SENTRY_SEND_DEFAULT_PII,
  );

  if (!sendDefaultPiiResult.ok) {
    return sendDefaultPiiResult;
  }

  if (sendDefaultPiiResult.value === true) {
    return err({
      kind: 'send_default_pii_forbidden',
    });
  }

  const enableLogsResult = parseOptionalBooleanFlag('SENTRY_ENABLE_LOGS', input.SENTRY_ENABLE_LOGS);

  if (!enableLogsResult.ok) {
    return enableLogsResult;
  }

  const debugResult = parseOptionalBooleanFlag('SENTRY_DEBUG', input.SENTRY_DEBUG);

  if (!debugResult.ok) {
    return debugResult;
  }

  return ok({
    enableLogs: enableLogsResult.value,
    debug: debugResult.value,
  });
}

function createOffConfig(
  environment: ResolvedSentryEnvironment,
  release: ResolvedSentryRelease,
): SentryOffConfig {
  return {
    mode: 'off',
    environment: environment.value,
    environmentSource: environment.source,
    release: release.value,
    releaseSource: release.source,
    enableLogs: false,
    sendDefaultPii: false,
    debug: false,
  };
}

function createFixtureConfig(
  environment: ResolvedSentryEnvironment,
  release: ResolvedSentryRelease,
  flags: ParsedSentryBooleanFlags,
): SentryFixtureConfig {
  return {
    mode: 'fixture',
    environment: environment.value,
    environmentSource: environment.source,
    release: release.value,
    releaseSource: release.source,
    enableLogs: flags.enableLogs ?? true,
    sendDefaultPii: false,
    debug: flags.debug ?? false,
  };
}

function createLiveConfig(
  input: SentryConfigEnvironment,
  environment: ResolvedSentryEnvironment,
  release: ResolvedSentryRelease,
  flags: ParsedSentryBooleanFlags,
): Result<SentryLiveConfig, ObservabilityConfigError> {
  const dsnResult = validateDsn(input.SENTRY_DSN);

  if (!dsnResult.ok) {
    return dsnResult;
  }

  const tracesSampleRateResult = parseTracesSampleRate(input.SENTRY_TRACES_SAMPLE_RATE);

  if (!tracesSampleRateResult.ok) {
    return tracesSampleRateResult;
  }

  return ok({
    mode: 'sentry',
    dsn: dsnResult.value,
    environment: environment.value,
    environmentSource: environment.source,
    release: release.value,
    releaseSource: release.source,
    tracesSampleRate: tracesSampleRateResult.value,
    enableLogs: flags.enableLogs ?? true,
    sendDefaultPii: false,
    debug: flags.debug ?? false,
  });
}

export function createSentryConfig(
  input: SentryConfigEnvironment,
): Result<ParsedSentryConfig, ObservabilityConfigError> {
  const modeResult = parseMode(input);

  if (!modeResult.ok) {
    return modeResult;
  }

  const flagResult = parseBooleanFlags(input);

  if (!flagResult.ok) {
    return flagResult;
  }

  const mode = modeResult.value;
  const environment = resolveSentryEnvironment(input);
  const releaseResult = resolveSentryRelease(mode, input);

  if (!releaseResult.ok) {
    return releaseResult;
  }

  const release = releaseResult.value;

  if (mode === 'off') {
    return ok(createOffConfig(environment, release));
  }

  if (mode === 'fixture') {
    return ok(createFixtureConfig(environment, release, flagResult.value));
  }

  return createLiveConfig(input, environment, release, flagResult.value);
}
