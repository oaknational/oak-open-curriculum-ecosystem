import { afterEach, describe, expect, it, vi } from 'vitest';

const REQUIRED = {
  ELASTICSEARCH_URL: 'https://example.com',
  ELASTICSEARCH_API_KEY: 'elastic-key-12345',
  OAK_API_KEY: 'oak-key-12345',
  SEARCH_API_KEY: 'search-key-12345',
  SEARCH_INDEX_VERSION: 'v2025-03-18',
};

async function loadEnvModule() {
  vi.resetModules();
  return await import('./env');
}

function withRequiredEnv(overrides: Record<string, string | undefined> = {}): void {
  Object.entries(REQUIRED).forEach(([key, value]) => {
    process.env[key] = value;
  });
  Object.entries(overrides).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
      return;
    }
    process.env[key] = value;
  });
}

afterEach(() => {
  Object.keys(process.env)
    .filter(
      (key) =>
        key in REQUIRED ||
        key.startsWith('OPENAI') ||
        key.startsWith('ZERO_HIT') ||
        key === 'SEARCH_INDEX_TARGET' ||
        key === 'AI_PROVIDER' ||
        key === 'LOG_LEVEL',
    )
    .forEach((key) => {
      delete process.env[key];
    });
  vi.resetModules();
});

describe('env validation', () => {
  it('returns parsed env with defaults when optional fields omitted', async () => {
    withRequiredEnv({ AI_PROVIDER: 'none', ZERO_HIT_WEBHOOK_URL: undefined, LOG_LEVEL: undefined });
    const { env } = await loadEnvModule();
    const result = env();
    expect(result.SEARCH_INDEX_VERSION).toBe('v2025-03-18');
    expect(result.ZERO_HIT_WEBHOOK_URL).toBe('none');
    expect(result.LOG_LEVEL).toBe('info');
    expect(result.SEARCH_INDEX_TARGET).toBe('primary');
  });

  it('requires OAK_API_KEY to be present', async () => {
    withRequiredEnv({ OAK_API_KEY: undefined });
    const { env } = await loadEnvModule();
    expect(() => env()).toThrow('Set OAK_API_KEY');
  });

  it('requires OPENAI_API_KEY when AI_PROVIDER=openai', async () => {
    withRequiredEnv({ AI_PROVIDER: 'openai', OPENAI_API_KEY: undefined });
    const { env } = await loadEnvModule();
    expect(() => env()).toThrow('OPENAI_API_KEY is required when AI_PROVIDER=openai.');
  });

  it('accepts ZERO_HIT_WEBHOOK_URL as URL', async () => {
    withRequiredEnv({
      AI_PROVIDER: 'none',
      ZERO_HIT_WEBHOOK_URL: 'https://hooks.example.com/zero-hit',
    });
    const { env } = await loadEnvModule();
    const parsed = env();
    expect(parsed.ZERO_HIT_WEBHOOK_URL).toBe('https://hooks.example.com/zero-hit');
  });

  it('accepts SEARCH_INDEX_TARGET values primary and sandbox', async () => {
    withRequiredEnv({ AI_PROVIDER: 'none', SEARCH_INDEX_TARGET: 'sandbox' });
    const { env } = await loadEnvModule();
    const parsed = env();
    expect(parsed.SEARCH_INDEX_TARGET).toBe('sandbox');
  });

  it('rejects invalid SEARCH_INDEX_TARGET values', async () => {
    withRequiredEnv({ AI_PROVIDER: 'none', SEARCH_INDEX_TARGET: 'staging' });
    const { env } = await loadEnvModule();
    expect(() => env()).toThrow();
  });
});
