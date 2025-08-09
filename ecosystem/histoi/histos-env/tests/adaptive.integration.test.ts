import { describe, it, expect } from 'vitest';
import { createAdaptiveEnvironment } from '../src/adaptive';

describe('createAdaptiveEnvironment', () => {
  it('should detect process.env when available', () => {
    // Ensure process.env exists
    const gThis = {
      process: {
        env: {
          TEST_VAR: 'test-value',
          NODE_ENV: 'test',
        },
      },
    };

    const env = createAdaptiveEnvironment(gThis);

    expect(env.get('TEST_VAR')).toBe('test-value');
    expect(env.get('NODE_ENV')).toBe('test');
    expect(env.has('TEST_VAR')).toBe(true);
  });

  it('should detect globalThis.env when process.env is not available', () => {
    const gThis = {
      env: {
        TEST_VAR: 'edge-value',
        NODE_ENV: 'production',
      },
    };

    const env = createAdaptiveEnvironment(gThis);

    expect(env.get('TEST_VAR')).toBe('edge-value');
    expect(env.get('NODE_ENV')).toBe('production');
    expect(env.has('TEST_VAR')).toBe(true);
  });

  it('should throw when no environment variables are available', () => {
    expect(() => createAdaptiveEnvironment({})).toThrow('No environment variables available');
  });
});
