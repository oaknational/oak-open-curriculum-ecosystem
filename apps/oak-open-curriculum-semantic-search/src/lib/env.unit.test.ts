import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EnvironmentProvider } from '@oaknational/mcp-env';

interface LoadRootEnvOptions {
  startDir: string;
  requiredKeys?: readonly string[];
  env?: Record<string, string | undefined>;
  envFileOrder?: readonly string[];
}

interface LoadRootEnvResult {
  repoRoot: string;
  loaded: boolean;
  path?: string;
}

type ProviderRecord = Record<string, string | undefined>;

const REQUIRED: ProviderRecord = {
  ELASTICSEARCH_URL: 'https://example.com',
  ELASTICSEARCH_API_KEY: 'elastic-key-12345',
  OAK_API_KEY: 'oak-key-12345',
  SEARCH_API_KEY: 'search-key-12345',
  SEARCH_INDEX_VERSION: 'v2025-03-18',
};

let defaultProviderEnv: ProviderRecord = {};

const loadRootEnvMock = vi.fn((options: LoadRootEnvOptions): LoadRootEnvResult => {
  void options;
  return { repoRoot: '/repo', loaded: false };
});
const createAdaptiveEnvironmentMock = vi.fn(() => ({
  get: (key: string) => defaultProviderEnv[key],
  getAll: () => ({ ...defaultProviderEnv }),
  has: (key: string) => Object.prototype.hasOwnProperty.call(defaultProviderEnv, key),
}));

vi.mock('@oaknational/mcp-env', () => ({
  loadRootEnv: loadRootEnvMock,
  createAdaptiveEnvironment: createAdaptiveEnvironmentMock,
}));

function setDefaultProviderEnv(values: ProviderRecord): void {
  defaultProviderEnv = { ...values };
}

function createProvider(values: ProviderRecord): EnvironmentProvider {
  const env = { ...values };
  return {
    get: (key: string) => env[key],
    getAll: () => ({ ...env }),
    has: (key: string) => Object.prototype.hasOwnProperty.call(env, key),
  };
}

function withDefaults(overrides: ProviderRecord = {}): ProviderRecord {
  return {
    ...REQUIRED,
    AI_PROVIDER: 'none',
    ...overrides,
  };
}

async function loadEnvModule() {
  vi.resetModules();
  return await import('./env');
}

beforeEach(() => {
  setDefaultProviderEnv({});
  loadRootEnvMock.mockClear();
  createAdaptiveEnvironmentMock.mockClear();
});

afterEach(() => {
  vi.resetModules();
});

describe('env validation', () => {
  it('parses env via adaptive provider and applies defaults', async () => {
    setDefaultProviderEnv(withDefaults());
    const { env } = await loadEnvModule();
    const result = env();
    expect(result.SEARCH_INDEX_VERSION).toBe(REQUIRED.SEARCH_INDEX_VERSION);
    expect(result.ZERO_HIT_WEBHOOK_URL).toBe('none');
    expect(result.LOG_LEVEL).toBe('info');
    expect(result.SEARCH_INDEX_TARGET).toBe('primary');
    expect(result.ZERO_HIT_PERSISTENCE_ENABLED).toBe(false);
    expect(result.ZERO_HIT_INDEX_RETENTION_DAYS).toBe(30);
    expect(loadRootEnvMock).not.toHaveBeenCalled();
  });

  it('loads repo env when required keys are missing from the adaptive provider', async () => {
    loadRootEnvMock.mockImplementation((options) => {
      void options;
      setDefaultProviderEnv(withDefaults());
      return { repoRoot: '/repo', loaded: true, path: '/repo/.env.local' };
    });
    setDefaultProviderEnv({});
    const { env } = await loadEnvModule();
    const result = env();
    expect(loadRootEnvMock).toHaveBeenCalledTimes(1);
    const callOptions = loadRootEnvMock.mock.calls[0]?.[0];
    if (!callOptions) {
      throw new Error('loadRootEnv was not called with options.');
    }
    expect(callOptions.startDir).toBe(process.cwd());
    expect(callOptions.requiredKeys).toEqual(
      expect.arrayContaining([
        'ELASTICSEARCH_URL',
        'ELASTICSEARCH_API_KEY',
        'SEARCH_API_KEY',
        'SEARCH_INDEX_VERSION',
      ]),
    );
    expect(result.SEARCH_INDEX_VERSION).toBe(REQUIRED.SEARCH_INDEX_VERSION);
  });

  it('supports provider injection for deterministic tests', async () => {
    const provider = createProvider(
      withDefaults({
        LOG_LEVEL: 'debug',
        ZERO_HIT_WEBHOOK_URL: 'https://hooks.example.com/zero-hit',
      }),
    );
    const { env } = await loadEnvModule();
    const result = env({ provider });
    expect(result.LOG_LEVEL).toBe('debug');
    expect(result.ZERO_HIT_WEBHOOK_URL).toBe('https://hooks.example.com/zero-hit');
    expect(loadRootEnvMock).not.toHaveBeenCalled();
  });

  it('requires OAK_API_KEY even when a provider is supplied', async () => {
    const provider = createProvider(
      withDefaults({
        OAK_API_KEY: undefined,
      }),
    );
    const { env } = await loadEnvModule();
    expect(() => env({ provider })).toThrow('Set OAK_API_KEY.');
  });

  it('requires OPENAI_API_KEY when AI_PROVIDER=openai', async () => {
    const provider = createProvider(
      withDefaults({
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: undefined,
      }),
    );
    const { env } = await loadEnvModule();
    expect(() => env({ provider })).toThrow('OPENAI_API_KEY is required when AI_PROVIDER=openai.');
  });

  it('parses zero-hit persistence overrides from the provider', async () => {
    const provider = createProvider(
      withDefaults({
        ZERO_HIT_PERSISTENCE_ENABLED: 'true',
        ZERO_HIT_INDEX_RETENTION_DAYS: '45',
      }),
    );
    const { env } = await loadEnvModule();
    const result = env({ provider });
    expect(result.ZERO_HIT_PERSISTENCE_ENABLED).toBe(true);
    expect(result.ZERO_HIT_INDEX_RETENTION_DAYS).toBe(45);
  });

  it('accepts sandbox search index targets via provider overrides', async () => {
    const provider = createProvider(
      withDefaults({
        SEARCH_INDEX_TARGET: 'sandbox',
      }),
    );
    const { env } = await loadEnvModule();
    const result = env({ provider });
    expect(result.SEARCH_INDEX_TARGET).toBe('sandbox');
  });

  it('rejects invalid search index targets supplied by a provider', async () => {
    const provider = createProvider(
      withDefaults({
        SEARCH_INDEX_TARGET: 'staging',
      }),
    );
    const { env } = await loadEnvModule();
    expect(() => env({ provider })).toThrow();
  });

  it('returns null from optionalEnv when validation fails', async () => {
    setDefaultProviderEnv(withDefaults({ OAK_API_KEY: undefined }));
    const { optionalEnv } = await loadEnvModule();
    expect(optionalEnv()).toBeNull();
  });

  it('llmEnabled reflects adaptive provider values', async () => {
    setDefaultProviderEnv(
      withDefaults({
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: 'openai-key-12345',
      }),
    );
    const { llmEnabled } = await loadEnvModule();
    expect(llmEnabled()).toBe(true);
  });
});
