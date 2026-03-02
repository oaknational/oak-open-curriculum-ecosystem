import { describe, it, expect } from 'vitest';
import { OakApiKeyEnvSchema } from '../../src/schemas/oak-api';

describe('OakApiKeyEnvSchema', () => {
  it('should accept a valid OAK_API_KEY', () => {
    const result = OakApiKeyEnvSchema.safeParse({ OAK_API_KEY: 'my-api-key' });
    expect(result.success).toBe(true);
  });

  it('should reject an empty OAK_API_KEY', () => {
    const result = OakApiKeyEnvSchema.safeParse({ OAK_API_KEY: '' });
    expect(result.success).toBe(false);
  });

  it('should reject a missing OAK_API_KEY', () => {
    const result = OakApiKeyEnvSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
