import { describe, it, expect } from 'vitest';
import { HttpEnvSchema } from './env.js';

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
    const result = HttpEnvSchema.safeParse(baseEnv);
    expect(result.success).toBe(false);
  });

  it('requires CLERK_SECRET_KEY when auth enabled', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
    });
    expect(result.success).toBe(false);
  });

  it('strips unknown fields like ENABLE_LOCAL_AS', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      ENABLE_LOCAL_AS: 'true',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('ENABLE_LOCAL_AS' in result.data).toBe(false);
    }
  });

  it('requires ELASTICSEARCH_URL', () => {
    const result = HttpEnvSchema.safeParse({
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_API_KEY: 'test-api-key',
    });
    expect(result.success).toBe(false);
  });

  it('requires ELASTICSEARCH_API_KEY', () => {
    const result = HttpEnvSchema.safeParse({
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_URL: 'http://localhost:9200',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid configuration with Clerk keys', () => {
    const result = HttpEnvSchema.safeParse(withClerkKeys);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.CLERK_PUBLISHABLE_KEY).toBe('pk_test_123');
      expect(result.data.CLERK_SECRET_KEY).toBe('sk_test_123');
    }
  });

  it('does not include CORS_MODE or ALLOWED_ORIGINS in the schema', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      CORS_MODE: 'automatic',
      ALLOWED_ORIGINS: 'http://localhost:3000',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('CORS_MODE' in result.data).toBe(false);
      expect('ALLOWED_ORIGINS' in result.data).toBe(false);
    }
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

  it('rejects DANGEROUSLY_DISABLE_AUTH=true in production', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      DANGEROUSLY_DISABLE_AUTH: 'true',
      VERCEL_ENV: 'production',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('DANGEROUSLY_DISABLE_AUTH');
    }
  });

  it('allows DANGEROUSLY_DISABLE_AUTH=true in preview and development', () => {
    for (const env of ['preview', 'development'] as const) {
      const result = HttpEnvSchema.safeParse({
        ...baseEnv,
        DANGEROUSLY_DISABLE_AUTH: 'true',
        VERCEL_ENV: env,
      });
      expect(result.success).toBe(true);
    }
  });
});
