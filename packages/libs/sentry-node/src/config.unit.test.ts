import { describe, expect, it } from 'vitest';
import { createSentryConfig, resolveSentryEnvironment, resolveSentryRelease } from './config.js';

describe('createSentryConfig', () => {
  it('defaults to off with deterministic environment and release fallbacks', () => {
    const result = createSentryConfig({});

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value).toEqual({
      mode: 'off',
      environment: 'development',
      environmentSource: 'development',
      release: 'local-dev',
      releaseSource: 'local-dev',
      enableLogs: false,
      sendDefaultPii: false,
      debug: false,
    });
  });

  it('uses explicit environment and release inputs when present', () => {
    const result = createSentryConfig({
      SENTRY_MODE: 'fixture',
      SENTRY_ENVIRONMENT: 'preview',
      SENTRY_RELEASE: 'abcdef123',
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value.environment).toBe('preview');
    expect(result.value.environmentSource).toBe('SENTRY_ENVIRONMENT');
    expect(result.value.release).toBe('abcdef123');
    expect(result.value.releaseSource).toBe('SENTRY_RELEASE');
  });

  it('treats empty strings as absent inputs', () => {
    const environment = resolveSentryEnvironment({
      SENTRY_ENVIRONMENT: '   ',
      VERCEL_ENV: '',
      NODE_ENV: 'test',
    });
    const release = resolveSentryRelease('fixture', {
      SENTRY_RELEASE: '',
      VERCEL_GIT_COMMIT_SHA: '   ',
      GITHUB_SHA: 'github-sha',
    });

    expect(environment).toEqual({
      value: 'test',
      source: 'NODE_ENV',
    });
    expect(release).toEqual({
      ok: true,
      value: {
        value: 'github-sha',
        source: 'GITHUB_SHA',
      },
    });
  });

  it('keeps off mode green even when live-only inputs are missing', () => {
    const result = createSentryConfig({
      SENTRY_MODE: 'off',
      SENTRY_DSN: '',
      SENTRY_TRACES_SAMPLE_RATE: '',
    });

    expect(result.ok).toBe(true);
  });

  it('treats off mode as a kill switch even when live-only inputs are present', () => {
    const result = createSentryConfig({
      SENTRY_MODE: 'off',
      SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
      SENTRY_TRACES_SAMPLE_RATE: '0.5',
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value).toMatchObject({
      mode: 'off',
      enableLogs: false,
      debug: false,
    });
  });

  it('defaults fixture mode to local capture with logs enabled', () => {
    const result = createSentryConfig({
      SENTRY_MODE: 'fixture',
      NODE_ENV: 'development',
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value).toMatchObject({
      mode: 'fixture',
      environment: 'development',
      release: 'local-dev',
      enableLogs: true,
      sendDefaultPii: false,
      debug: false,
    });
  });

  it('rejects unknown modes', () => {
    expect(
      createSentryConfig({
        SENTRY_MODE: 'disabled',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'invalid_sentry_mode',
        value: 'disabled',
      },
    });
  });

  it('fails closed for invalid live dsn and sample rate', () => {
    expect(
      createSentryConfig({
        SENTRY_MODE: 'sentry',
        SENTRY_DSN: 'not-a-dsn',
        SENTRY_TRACES_SAMPLE_RATE: '0.5',
        SENTRY_RELEASE: 'release-123',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'invalid_sentry_dsn',
        value: 'not-a-dsn',
      },
    });

    expect(
      createSentryConfig({
        SENTRY_MODE: 'sentry',
        SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
        SENTRY_TRACES_SAMPLE_RATE: '2',
        SENTRY_RELEASE: 'release-123',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'invalid_traces_sample_rate',
        value: '2',
      },
    });
  });

  it('requires a release in live mode', () => {
    expect(
      createSentryConfig({
        SENTRY_MODE: 'sentry',
        SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
        SENTRY_TRACES_SAMPLE_RATE: '0.5',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'missing_release_for_live_mode',
      },
    });
  });

  it('forbids send_default_pii=true in every mode', () => {
    expect(
      createSentryConfig({
        SENTRY_SEND_DEFAULT_PII: 'true',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'send_default_pii_forbidden',
      },
    });
  });

  it('fails closed for invalid boolean flags', () => {
    expect(
      createSentryConfig({
        SENTRY_MODE: 'fixture',
        SENTRY_ENABLE_LOGS: 'flase',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'invalid_boolean_flag',
        name: 'SENTRY_ENABLE_LOGS',
        value: 'flase',
      },
    });
  });
});
