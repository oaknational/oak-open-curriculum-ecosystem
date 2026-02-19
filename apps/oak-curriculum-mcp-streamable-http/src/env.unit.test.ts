import { describe, it, expect } from 'vitest';
import { readEnv, HttpEnvSchema } from './env.js';

const baseEnv = {
  OAK_API_KEY: 'test-key',
  ELASTICSEARCH_URL: 'http://localhost:9200',
  ELASTICSEARCH_API_KEY: 'test-api-key',
};

const withClerkKeys = {
  ...baseEnv,
  CLERK_PUBLISHABLE_KEY: 'pk_test_123',
  CLERK_SECRET_KEY: 'sk_test_123',
};

describe('Environment Schema', () => {
  it('requires CLERK_PUBLISHABLE_KEY when auth enabled', () => {
    expect(() => readEnv(baseEnv)).toThrow(/Invalid environment/);
  });

  it('requires CLERK_SECRET_KEY when auth enabled', () => {
    const envWithoutSecret = {
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
    };
    expect(() => readEnv(envWithoutSecret)).toThrow(/Invalid environment/);
  });

  it('rejects old ENABLE_LOCAL_AS variable', () => {
    const result = readEnv({
      ...withClerkKeys,
      ENABLE_LOCAL_AS: 'true',
    });
    expect('ENABLE_LOCAL_AS' in result).toBe(false);
  });

  it('requires ELASTICSEARCH_URL', () => {
    const envWithoutEsUrl = {
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_API_KEY: 'test-api-key',
    };
    expect(() => readEnv(envWithoutEsUrl)).toThrow(/Invalid environment/);
  });

  it('requires ELASTICSEARCH_API_KEY', () => {
    const envWithoutEsApiKey = {
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_URL: 'http://localhost:9200',
    };
    expect(() => readEnv(envWithoutEsApiKey)).toThrow(/Invalid environment/);
  });

  it('accepts valid configuration with Clerk keys', () => {
    const result = readEnv({
      ...withClerkKeys,
      BASE_URL: 'http://localhost:3333',
      MCP_CANONICAL_URI: 'http://localhost:3333/mcp',
    });
    expect(result.CLERK_PUBLISHABLE_KEY).toBe('pk_test_123');
    expect(result.CLERK_SECRET_KEY).toBe('sk_test_123');
  });
});

describe('Conditional Clerk keys (DANGEROUSLY_DISABLE_AUTH)', () => {
  it('accepts missing Clerk keys when DANGEROUSLY_DISABLE_AUTH=true', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'true',
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing Clerk keys when auth enabled (no DANGEROUSLY_DISABLE_AUTH)', () => {
    const result = HttpEnvSchema.safeParse(baseEnv);
    expect(result.success).toBe(false);
  });

  it('rejects missing Clerk keys when DANGEROUSLY_DISABLE_AUTH=false', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'false',
    });

    expect(result.success).toBe(false);
  });

  it('accepts Clerk keys when auth enabled', () => {
    const result = HttpEnvSchema.safeParse(withClerkKeys);
    expect(result.success).toBe(true);
  });

  it('accepts Clerk keys even when DANGEROUSLY_DISABLE_AUTH=true', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      DANGEROUSLY_DISABLE_AUTH: 'true',
    });

    expect(result.success).toBe(true);
  });
});
