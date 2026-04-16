import { describe, expect, it } from 'vitest';
import { createSentryConfig, resolveSentryEnvironment, resolveSentryRelease } from './config.js';

describe('createSentryConfig', () => {
  it('defaults to off with deterministic environment and application-version release', () => {
    const result = createSentryConfig({
      APP_VERSION: '1.5.0',
      APP_VERSION_SOURCE: 'root_package_json',
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value).toEqual({
      mode: 'off',
      environment: 'development',
      environmentSource: 'development',
      release: '1.5.0',
      releaseSource: 'root_package_json',
      enableLogs: false,
      sendDefaultPii: false,
      debug: false,
    });
  });

  it('uses explicit environment and release inputs when present', () => {
    const result = createSentryConfig({
      SENTRY_MODE: 'fixture',
      SENTRY_ENVIRONMENT_OVERRIDE: 'preview',
      SENTRY_RELEASE_OVERRIDE: 'abcdef123',
      APP_VERSION: '1.5.0',
      APP_VERSION_SOURCE: 'root_package_json',
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value.environment).toBe('preview');
    expect(result.value.environmentSource).toBe('SENTRY_ENVIRONMENT_OVERRIDE');
    expect(result.value.release).toBe('abcdef123');
    expect(result.value.releaseSource).toBe('SENTRY_RELEASE_OVERRIDE');
  });

  it('treats empty strings as absent inputs', () => {
    const environment = resolveSentryEnvironment({
      SENTRY_ENVIRONMENT_OVERRIDE: '   ',
      VERCEL_ENV: '',
    });
    const release = resolveSentryRelease({
      SENTRY_RELEASE_OVERRIDE: '',
      APP_VERSION: '1.5.0',
      APP_VERSION_SOURCE: 'root_package_json',
    });

    expect(environment).toEqual({
      value: 'development',
      source: 'development',
    });
    expect(release).toEqual({
      ok: true,
      value: {
        value: '1.5.0',
        source: 'root_package_json',
      },
    });
  });

  it('keeps off mode green even when live-only inputs are missing', () => {
    const result = createSentryConfig({
      SENTRY_MODE: 'off',
      SENTRY_DSN: '',
      SENTRY_TRACES_SAMPLE_RATE: '',
      APP_VERSION: '1.5.0',
      APP_VERSION_SOURCE: 'root_package_json',
    });

    expect(result.ok).toBe(true);
  });

  it('treats off mode as a kill switch even when live-only inputs are present', () => {
    const result = createSentryConfig({
      SENTRY_MODE: 'off',
      SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
      SENTRY_TRACES_SAMPLE_RATE: '0.5',
      APP_VERSION: '1.5.0',
      APP_VERSION_SOURCE: 'root_package_json',
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

  it('uses the application version in fixture mode when no release override is present', () => {
    const result = createSentryConfig({
      SENTRY_MODE: 'fixture',
      APP_VERSION: '1.5.0',
      APP_VERSION_SOURCE: 'root_package_json',
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value).toMatchObject({
      mode: 'fixture',
      environment: 'development',
      release: '1.5.0',
      enableLogs: true,
      sendDefaultPii: false,
      debug: false,
    });
  });

  it('rejects unknown modes', () => {
    expect(
      createSentryConfig({
        SENTRY_MODE: 'disabled',
        APP_VERSION: '1.5.0',
        APP_VERSION_SOURCE: 'root_package_json',
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
        SENTRY_RELEASE_OVERRIDE: 'release-123',
        APP_VERSION: '1.5.0',
        APP_VERSION_SOURCE: 'root_package_json',
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
        SENTRY_RELEASE_OVERRIDE: 'release-123',
        APP_VERSION: '1.5.0',
        APP_VERSION_SOURCE: 'root_package_json',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'invalid_traces_sample_rate',
        value: '2',
      },
    });
  });

  it('fails closed when no application version or release override is available', () => {
    expect(
      createSentryConfig({
        SENTRY_MODE: 'sentry',
        SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
        SENTRY_TRACES_SAMPLE_RATE: '0.5',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'missing_app_version',
      },
    });
  });

  it('forbids send_default_pii=true in every mode', () => {
    expect(
      createSentryConfig({
        SENTRY_SEND_DEFAULT_PII: 'true',
        APP_VERSION: '1.5.0',
        APP_VERSION_SOURCE: 'root_package_json',
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
        APP_VERSION: '1.5.0',
        APP_VERSION_SOURCE: 'root_package_json',
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

  it('fails closed for invalid git sha metadata', () => {
    expect(
      createSentryConfig({
        SENTRY_MODE: 'fixture',
        APP_VERSION: '1.5.0',
        APP_VERSION_SOURCE: 'root_package_json',
        GIT_SHA: 'not-a-sha',
        GIT_SHA_SOURCE: 'GIT_SHA_OVERRIDE',
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'invalid_git_sha',
        value: 'not-a-sha',
      },
    });
  });
});
