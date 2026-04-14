import { describe, expect, it } from 'vitest';
import type { ObservabilityConfigError, SentryCloseError, SentryFlushError } from './types.js';
import { describeConfigError, mapCloseError, mapFlushError } from './runtime-error.js';

describe('describeConfigError', () => {
  it('describes invalid_sentry_mode', () => {
    const error: ObservabilityConfigError = { kind: 'invalid_sentry_mode', value: 'banana' };

    expect(describeConfigError(error)).toBe('Invalid SENTRY_MODE value: banana');
  });

  it('describes invalid_boolean_flag', () => {
    const error: ObservabilityConfigError = {
      kind: 'invalid_boolean_flag',
      name: 'SENTRY_ENABLE_LOGS',
      value: 'maybe',
    };

    expect(describeConfigError(error)).toBe('Invalid SENTRY_ENABLE_LOGS value: maybe');
  });

  it('describes missing_sentry_dsn', () => {
    const error: ObservabilityConfigError = { kind: 'missing_sentry_dsn' };

    expect(describeConfigError(error)).toBe('SENTRY_DSN is required when SENTRY_MODE=sentry');
  });

  it('describes invalid_sentry_dsn', () => {
    const error: ObservabilityConfigError = { kind: 'invalid_sentry_dsn', value: 'not-a-url' };

    expect(describeConfigError(error)).toBe('Invalid SENTRY_DSN value');
  });

  it('describes invalid_traces_sample_rate', () => {
    const error: ObservabilityConfigError = {
      kind: 'invalid_traces_sample_rate',
      value: '1.5',
    };

    expect(describeConfigError(error)).toBe('Invalid SENTRY_TRACES_SAMPLE_RATE value: 1.5');
  });

  it('describes send_default_pii_forbidden', () => {
    const error: ObservabilityConfigError = { kind: 'send_default_pii_forbidden' };

    expect(describeConfigError(error)).toBe('SENTRY_SEND_DEFAULT_PII=true is not allowed');
  });

  it('describes missing_release_for_live_mode', () => {
    const error: ObservabilityConfigError = { kind: 'missing_release_for_live_mode' };

    expect(describeConfigError(error)).toBe('A release value is required when SENTRY_MODE=sentry');
  });
});

describe('mapFlushError', () => {
  it('maps sentry_flush_timeout to observability_flush_timeout', () => {
    const sentryError: SentryFlushError = { kind: 'sentry_flush_timeout', timeoutMs: 3000 };
    const result = mapFlushError(sentryError);

    expect(result).toStrictEqual({ kind: 'observability_flush_timeout', timeoutMs: 3000 });
  });

  it('maps sentry_flush_failed to observability_flush_failed', () => {
    const sentryError: SentryFlushError = {
      kind: 'sentry_flush_failed',
      message: 'transport down',
    };
    const result = mapFlushError(sentryError);

    expect(result).toStrictEqual({
      kind: 'observability_flush_failed',
      message: 'transport down',
    });
  });
});

describe('mapCloseError', () => {
  it('maps sentry_close_timeout to observability_close_timeout', () => {
    const sentryError: SentryCloseError = { kind: 'sentry_close_timeout', timeoutMs: 5000 };
    const result = mapCloseError(sentryError);

    expect(result).toStrictEqual({ kind: 'observability_close_timeout', timeoutMs: 5000 });
  });

  it('maps sentry_close_failed to observability_close_failed', () => {
    const sentryError: SentryCloseError = {
      kind: 'sentry_close_failed',
      message: 'drain failed',
    };
    const result = mapCloseError(sentryError);

    expect(result).toStrictEqual({
      kind: 'observability_close_failed',
      message: 'drain failed',
    });
  });
});
