import { describe, it, expect } from 'vitest';
import { readEnv } from './env.js';

describe('Environment Schema', () => {
  it('requires CLERK_PUBLISHABLE_KEY', () => {
    const invalidEnv = { OAK_API_KEY: 'test-key' };
    expect(() => readEnv(invalidEnv)).toThrow(/Invalid environment/);
  });

  it('requires CLERK_SECRET_KEY', () => {
    const invalidEnv = {
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
    };
    expect(() => readEnv(invalidEnv)).toThrow(/Invalid environment/);
  });

  it('rejects old ENABLE_LOCAL_AS variable', () => {
    const invalidEnv = {
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ENABLE_LOCAL_AS: 'true', // Should be removed
    };
    // Should either throw or ignore (depending on schema strictness)
    const result = readEnv(invalidEnv);
    expect('ENABLE_LOCAL_AS' in result).toBe(false);
  });

  it('accepts valid Clerk configuration', () => {
    const validEnv = {
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
    };
    const result = readEnv(validEnv);
    expect(result.CLERK_PUBLISHABLE_KEY).toBe('pk_test_123');
    expect(result.CLERK_SECRET_KEY).toBe('sk_test_123');
  });
});
