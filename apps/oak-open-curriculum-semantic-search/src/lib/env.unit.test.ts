import { describe, expect, it } from 'vitest';
import { env, optionalEnv, parseEnv } from './env';

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

describe('env helpers', () => {
  it('parses environment variables and applies defaults', () => {
    const result = env(
      withBaseEnv({
        ZERO_HIT_WEBHOOK_URL: undefined,
        LOG_LEVEL: undefined,
        ZERO_HIT_PERSISTENCE_ENABLED: undefined,
        ZERO_HIT_INDEX_RETENTION_DAYS: undefined,
        SEARCH_INDEX_TARGET: undefined,
      }),
    );
    expect(result.SEARCH_INDEX_VERSION).toBe(REQUIRED_ENV.SEARCH_INDEX_VERSION);
    expect(result.ZERO_HIT_WEBHOOK_URL).toBe('none');
    expect(result.LOG_LEVEL).toBe('info');
    expect(result.SEARCH_INDEX_TARGET).toBe('primary');
    expect(result.ZERO_HIT_PERSISTENCE_ENABLED).toBe(false);
    expect(result.ZERO_HIT_INDEX_RETENTION_DAYS).toBe(30);
    expect(result.OAK_EFFECTIVE_KEY).toBe(REQUIRED_ENV.OAK_API_KEY);
  });

  it('parses zero-hit persistence overrides', () => {
    const result = env(
      withBaseEnv({
        ZERO_HIT_PERSISTENCE_ENABLED: 'true',
        ZERO_HIT_INDEX_RETENTION_DAYS: '45',
      }),
    );
    expect(result.ZERO_HIT_PERSISTENCE_ENABLED).toBe(true);
    expect(result.ZERO_HIT_INDEX_RETENTION_DAYS).toBe(45);
  });

  it('accepts sandbox search index targets', () => {
    const result = env(withBaseEnv({ SEARCH_INDEX_TARGET: 'sandbox' }));
    expect(result.SEARCH_INDEX_TARGET).toBe('sandbox');
  });

  it('rejects invalid search index targets', () => {
    expect(() => env(withBaseEnv({ SEARCH_INDEX_TARGET: 'staging' }))).toThrow();
  });

  it('throws when a required key is missing', () => {
    expect(() => env(withBaseEnv({ ELASTICSEARCH_URL: undefined }))).toThrow();
  });

  it('optionalEnv returns null when validation fails', () => {
    expect(optionalEnv(withBaseEnv({ OAK_API_KEY: undefined }))).toBeNull();
  });

  it('SDK cache defaults to disabled with 14-day TTL', () => {
    const result = env(
      withBaseEnv({
        SDK_CACHE_ENABLED: undefined,
        SDK_CACHE_REDIS_URL: undefined,
        SDK_CACHE_TTL_DAYS: undefined,
      }),
    );
    expect(result.SDK_CACHE_ENABLED).toBe(false);
    expect(result.SDK_CACHE_REDIS_URL).toBe('redis://localhost:6379');
    expect(result.SDK_CACHE_TTL_DAYS).toBe(14);
  });

  it('SDK cache can be enabled with custom settings', () => {
    const result = env(
      withBaseEnv({
        SDK_CACHE_ENABLED: 'true',
        SDK_CACHE_REDIS_URL: 'redis://custom:6380',
        SDK_CACHE_TTL_DAYS: '14',
      }),
    );
    expect(result.SDK_CACHE_ENABLED).toBe(true);
    expect(result.SDK_CACHE_REDIS_URL).toBe('redis://custom:6380');
    expect(result.SDK_CACHE_TTL_DAYS).toBe(14);
  });

  it('parseEnv validates a raw record directly', () => {
    const result = parseEnv(withBaseEnv());
    expect(result.ELASTICSEARCH_URL).toBe(REQUIRED_ENV.ELASTICSEARCH_URL);
    expect(result.ELASTICSEARCH_API_KEY).toBe(REQUIRED_ENV.ELASTICSEARCH_API_KEY);
  });
});
