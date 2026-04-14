import { describe, expect, it } from 'vitest';
import type { SentryCloseError, SentryFlushError } from './types.js';
import { mapCloseError, mapFlushError } from './runtime-error.js';

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
