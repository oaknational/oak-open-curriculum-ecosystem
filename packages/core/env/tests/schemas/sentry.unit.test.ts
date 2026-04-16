import { describe, expect, it } from 'vitest';
import { SentryEnvSchema } from '../../src/schemas/sentry.js';

describe('SentryEnvSchema', () => {
  it('defaults SENTRY_MODE to off', () => {
    expect(SentryEnvSchema.parse({})).toStrictEqual({
      SENTRY_MODE: 'off',
    });
  });

  it('accepts off, fixture, and sentry modes', () => {
    expect(SentryEnvSchema.parse({ SENTRY_MODE: 'off' }).SENTRY_MODE).toBe('off');
    expect(SentryEnvSchema.parse({ SENTRY_MODE: 'fixture' }).SENTRY_MODE).toBe('fixture');
    expect(SentryEnvSchema.parse({ SENTRY_MODE: 'sentry' }).SENTRY_MODE).toBe('sentry');
  });

  it('accepts the shared optional Sentry configuration keys', () => {
    expect(
      SentryEnvSchema.parse({
        SENTRY_MODE: 'sentry',
        SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
        SENTRY_ENVIRONMENT_OVERRIDE: 'preview',
        SENTRY_RELEASE_OVERRIDE: 'abcdef123',
        SENTRY_TRACES_SAMPLE_RATE: '0.5',
        SENTRY_ENABLE_LOGS: 'true',
        SENTRY_SEND_DEFAULT_PII: 'false',
        SENTRY_DEBUG: 'false',
      }),
    ).toStrictEqual({
      SENTRY_MODE: 'sentry',
      SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
      SENTRY_ENVIRONMENT_OVERRIDE: 'preview',
      SENTRY_RELEASE_OVERRIDE: 'abcdef123',
      SENTRY_TRACES_SAMPLE_RATE: '0.5',
      SENTRY_ENABLE_LOGS: 'true',
      SENTRY_SEND_DEFAULT_PII: 'false',
      SENTRY_DEBUG: 'false',
    });
  });

  it('preserves empty strings for optional raw env values', () => {
    expect(
      SentryEnvSchema.parse({
        SENTRY_MODE: 'off',
        SENTRY_DSN: '',
        SENTRY_ENVIRONMENT_OVERRIDE: '',
        SENTRY_RELEASE_OVERRIDE: '',
        SENTRY_TRACES_SAMPLE_RATE: '',
      }),
    ).toStrictEqual({
      SENTRY_MODE: 'off',
      SENTRY_DSN: '',
      SENTRY_ENVIRONMENT_OVERRIDE: '',
      SENTRY_RELEASE_OVERRIDE: '',
      SENTRY_TRACES_SAMPLE_RATE: '',
    });
  });

  it('rejects unknown SENTRY_MODE values', () => {
    expect(() => SentryEnvSchema.parse({ SENTRY_MODE: 'disabled' })).toThrow(
      'Invalid option: expected one of',
    );
  });
});
