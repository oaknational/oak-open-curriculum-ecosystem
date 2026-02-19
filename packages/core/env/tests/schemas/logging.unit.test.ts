import { describe, it, expect } from 'vitest';
import { LoggingEnvSchema, LOG_LEVELS } from '../../src/schemas/logging';

describe('LoggingEnvSchema', () => {
  it('should accept valid log level values', () => {
    for (const level of LOG_LEVELS) {
      const result = LoggingEnvSchema.safeParse({ LOG_LEVEL: level });
      expect(result.success).toBe(true);
    }
  });

  it('should reject an invalid log level', () => {
    const result = LoggingEnvSchema.safeParse({ LOG_LEVEL: 'verbose' });
    expect(result.success).toBe(false);
  });

  it('should accept an empty object (all fields optional)', () => {
    const result = LoggingEnvSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should accept valid NODE_ENV values', () => {
    for (const env of ['development', 'production', 'test']) {
      const result = LoggingEnvSchema.safeParse({ NODE_ENV: env });
      expect(result.success).toBe(true);
    }
  });

  it('should reject an invalid NODE_ENV', () => {
    const result = LoggingEnvSchema.safeParse({ NODE_ENV: 'staging' });
    expect(result.success).toBe(false);
  });

  it('should accept ENVIRONMENT_OVERRIDE as freeform string', () => {
    const result = LoggingEnvSchema.safeParse({ ENVIRONMENT_OVERRIDE: 'my-custom-env' });
    expect(result.success).toBe(true);
  });
});
