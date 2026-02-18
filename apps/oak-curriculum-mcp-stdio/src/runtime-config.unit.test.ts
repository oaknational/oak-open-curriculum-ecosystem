import { describe, it, expect } from 'vitest';
import { loadRuntimeConfig } from './runtime-config.js';

describe('loadRuntimeConfig', () => {
  const baseEnv = { OAK_API_KEY: 'test-key' };

  it('throws when ELASTICSEARCH_URL is missing', () => {
    const env = { ...baseEnv, ELASTICSEARCH_API_KEY: 'test-key' };
    expect(() => loadRuntimeConfig(env)).toThrow(/ELASTICSEARCH_URL/);
  });

  it('throws when ELASTICSEARCH_API_KEY is missing', () => {
    const env = { ...baseEnv, ELASTICSEARCH_URL: 'http://localhost:9200' };
    expect(() => loadRuntimeConfig(env)).toThrow(/ELASTICSEARCH_API_KEY/);
  });

  it('succeeds when both ES credentials are present', () => {
    const env = {
      ...baseEnv,
      ELASTICSEARCH_URL: 'http://localhost:9200',
      ELASTICSEARCH_API_KEY: 'test-key',
    };
    const config = loadRuntimeConfig(env);
    expect(config.env.ELASTICSEARCH_URL).toBe('http://localhost:9200');
    expect(config.env.ELASTICSEARCH_API_KEY).toBe('test-key');
  });
});
