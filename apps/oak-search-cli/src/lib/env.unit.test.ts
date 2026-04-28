import { describe, expect, it } from 'vitest';
import { parseEnv } from './env';

const REQUIRED_ENV = {
  ELASTICSEARCH_URL: 'https://example.com',
  ELASTICSEARCH_API_KEY: 'elastic-key-12345',
  OAK_API_KEY: 'oak-key-12345',
  SEARCH_API_KEY: 'search-key-12345',
  SEARCH_INDEX_VERSION: 'v2025-03-18',
} satisfies Record<string, string>;

function withBaseEnv(
  overrides: Record<string, string | undefined> = {},
): Record<string, string | undefined> {
  return { ...REQUIRED_ENV, ...overrides };
}

describe('parseEnv', () => {
  it('parses environment variables and applies defaults', () => {
    const result = parseEnv(
      withBaseEnv({
        ZERO_HIT_WEBHOOK_URL: undefined,
        LOG_LEVEL: undefined,
        ZERO_HIT_PERSISTENCE_ENABLED: undefined,
        ZERO_HIT_INDEX_RETENTION_DAYS: undefined,
        SEARCH_INDEX_TARGET: undefined,
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.SEARCH_INDEX_VERSION).toBe(REQUIRED_ENV.SEARCH_INDEX_VERSION);
    expect(result.value.ZERO_HIT_WEBHOOK_URL).toBe('none');
    expect(result.value.LOG_LEVEL).toBe('info');
    expect(result.value.SEARCH_INDEX_TARGET).toBe('primary');
    expect(result.value.ZERO_HIT_PERSISTENCE_ENABLED).toBe(false);
    expect(result.value.ZERO_HIT_INDEX_RETENTION_DAYS).toBe(30);
    expect(result.value.OAK_EFFECTIVE_KEY).toBe(REQUIRED_ENV.OAK_API_KEY);
  });

  it('parses zero-hit persistence overrides', () => {
    const result = parseEnv(
      withBaseEnv({
        ZERO_HIT_PERSISTENCE_ENABLED: 'true',
        ZERO_HIT_INDEX_RETENTION_DAYS: '45',
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.ZERO_HIT_PERSISTENCE_ENABLED).toBe(true);
    expect(result.value.ZERO_HIT_INDEX_RETENTION_DAYS).toBe(45);
  });

  it('accepts sandbox search index targets', () => {
    const result = parseEnv(withBaseEnv({ SEARCH_INDEX_TARGET: 'sandbox' }));
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.SEARCH_INDEX_TARGET).toBe('sandbox');
  });

  it('rejects invalid search index targets', () => {
    const result = parseEnv(withBaseEnv({ SEARCH_INDEX_TARGET: 'staging' }));
    expect(result.ok).toBe(false);
  });

  it('returns error when a required key is missing', () => {
    const result = parseEnv(withBaseEnv({ ELASTICSEARCH_URL: undefined }));
    expect(result.ok).toBe(false);
  });

  it('returns error when OAK_API_KEY is absent', () => {
    const result = parseEnv(withBaseEnv({ OAK_API_KEY: undefined }));
    expect(result.ok).toBe(false);
  });

  it('SDK cache defaults to disabled with 14-day TTL', () => {
    const result = parseEnv(
      withBaseEnv({
        SDK_CACHE_ENABLED: undefined,
        SDK_CACHE_REDIS_URL: undefined,
        SDK_CACHE_TTL_DAYS: undefined,
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.SDK_CACHE_ENABLED).toBe(false);
    expect(result.value.SDK_CACHE_REDIS_URL).toBe('redis://localhost:6379');
    expect(result.value.SDK_CACHE_TTL_DAYS).toBe(14);
  });

  it('SDK cache can be enabled with custom settings', () => {
    const result = parseEnv(
      withBaseEnv({
        SDK_CACHE_ENABLED: 'true',
        SDK_CACHE_REDIS_URL: 'redis://custom:6380',
        SDK_CACHE_TTL_DAYS: '14',
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.SDK_CACHE_ENABLED).toBe(true);
    expect(result.value.SDK_CACHE_REDIS_URL).toBe('redis://custom:6380');
    expect(result.value.SDK_CACHE_TTL_DAYS).toBe(14);
  });

  it('defaults SENTRY_MODE to off when not provided', () => {
    const result = parseEnv(withBaseEnv({}));
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.SENTRY_MODE).toBe('off');
  });

  it('accepts SENTRY_MODE=fixture', () => {
    const result = parseEnv(withBaseEnv({ SENTRY_MODE: 'fixture' }));
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.SENTRY_MODE).toBe('fixture');
  });

  it('accepts SENTRY_MODE=sentry with DSN and release', () => {
    const result = parseEnv(
      withBaseEnv({
        SENTRY_MODE: 'sentry',
        SENTRY_DSN: 'https://public@example.ingest.sentry.io/123456',
        SENTRY_RELEASE_OVERRIDE: 'release-123',
        SENTRY_TRACES_SAMPLE_RATE: '1.0',
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.SENTRY_MODE).toBe('sentry');
    expect(result.value.SENTRY_DSN).toBe('https://public@example.ingest.sentry.io/123456');
  });

  it('rejects invalid SENTRY_MODE', () => {
    const result = parseEnv(withBaseEnv({ SENTRY_MODE: 'bogus' }));
    expect(result.ok).toBe(false);
  });
});
