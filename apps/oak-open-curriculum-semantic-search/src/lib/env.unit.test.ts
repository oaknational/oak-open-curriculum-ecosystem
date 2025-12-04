import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const REQUIRED_ENV = {
  ELASTICSEARCH_URL: 'https://example.com',
  ELASTICSEARCH_API_KEY: 'elastic-key-12345',
  OAK_API_KEY: 'oak-key-12345',
  SEARCH_API_KEY: 'search-key-12345',
  SEARCH_INDEX_VERSION: 'v2025-03-18',
} satisfies Record<string, string>;

type EnvOverrides = Partial<Record<string, string | undefined>>;

const originalProcessEnv = { ...process.env };
let previousProcessEnv: NodeJS.ProcessEnv;

function withBaseEnv(overrides: EnvOverrides = {}): Record<string, string> {
  const merged: Record<string, string> = {
    ...REQUIRED_ENV,
    AI_PROVIDER: 'none',
    ...overrides,
  };
  return Object.fromEntries(
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    Object.entries(merged).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
}

function setProcessEnv(overrides: EnvOverrides = {}): void {
  process.env = {
    ...withBaseEnv(overrides),
  } as NodeJS.ProcessEnv;
}

async function loadEnvModule() {
  vi.resetModules();
  return await import('./env');
}

beforeEach(() => {
  previousProcessEnv = process.env;
  setProcessEnv();
});

afterEach(() => {
  process.env = previousProcessEnv;
  vi.resetModules();
});

describe('env helpers', () => {
  it('parses environment variables and applies defaults', async () => {
    setProcessEnv({
      ZERO_HIT_WEBHOOK_URL: undefined,
      LOG_LEVEL: undefined,
      ZERO_HIT_PERSISTENCE_ENABLED: undefined,
      ZERO_HIT_INDEX_RETENTION_DAYS: undefined,
      SEARCH_INDEX_TARGET: undefined,
    });
    const { env } = await loadEnvModule();
    const result = env();
    expect(result.SEARCH_INDEX_VERSION).toBe(REQUIRED_ENV.SEARCH_INDEX_VERSION);
    expect(result.ZERO_HIT_WEBHOOK_URL).toBe('none');
    expect(result.LOG_LEVEL).toBe('info');
    expect(result.SEARCH_INDEX_TARGET).toBe('primary');
    expect(result.ZERO_HIT_PERSISTENCE_ENABLED).toBe(false);
    expect(result.ZERO_HIT_INDEX_RETENTION_DAYS).toBe(30);
    expect(result.OAK_EFFECTIVE_KEY).toBe(REQUIRED_ENV.OAK_API_KEY);
  });

  it('parses zero-hit persistence overrides from strings', async () => {
    setProcessEnv({
      ZERO_HIT_PERSISTENCE_ENABLED: 'true',
      ZERO_HIT_INDEX_RETENTION_DAYS: '45',
    });
    const { env } = await loadEnvModule();
    const result = env();
    expect(result.ZERO_HIT_PERSISTENCE_ENABLED).toBe(true);
    expect(result.ZERO_HIT_INDEX_RETENTION_DAYS).toBe(45);
  });

  it('accepts sandbox search index targets', async () => {
    setProcessEnv({ SEARCH_INDEX_TARGET: 'sandbox' });
    const { env } = await loadEnvModule();
    const result = env();
    expect(result.SEARCH_INDEX_TARGET).toBe('sandbox');
  });

  it('rejects invalid search index targets', async () => {
    setProcessEnv({ SEARCH_INDEX_TARGET: 'staging' });
    const { env } = await loadEnvModule();
    expect(() => env()).toThrow();
  });

  it('throws when a required key is missing', async () => {
    setProcessEnv({ ELASTICSEARCH_URL: undefined });
    const { env } = await loadEnvModule();
    expect(() => env()).toThrow();
  });

  it('requires OPENAI_API_KEY when AI_PROVIDER=openai', async () => {
    setProcessEnv({
      AI_PROVIDER: 'openai',
      OPENAI_API_KEY: undefined,
    });
    const { env } = await loadEnvModule();
    expect(() => env()).toThrow('OPENAI_API_KEY is required when AI_PROVIDER=openai.');
  });

  it('optionalEnv returns null when validation fails', async () => {
    setProcessEnv({
      OAK_API_KEY: undefined,
    });
    const { optionalEnv } = await loadEnvModule();
    expect(optionalEnv()).toBeNull();
  });

  it('llmEnabled reflects environment values', async () => {
    setProcessEnv({
      AI_PROVIDER: 'openai',
      OPENAI_API_KEY: 'openai-key-12345',
    });
    const { llmEnabled } = await loadEnvModule();
    expect(llmEnabled()).toBe(true);
    setProcessEnv({
      AI_PROVIDER: 'none',
      OPENAI_API_KEY: undefined,
    });
    const { llmEnabled: llmDisabled } = await loadEnvModule();
    expect(llmDisabled()).toBe(false);
  });
});

afterAll(() => {
  process.env = {
    ...originalProcessEnv,
  };
});
