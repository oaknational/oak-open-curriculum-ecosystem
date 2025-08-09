import { describe, it, expect } from 'vitest';
import { createAdaptiveLogger } from '../src/adaptive';

describe('Adaptive Logger', () => {
  it('should create logger using adaptive factory', () => {
    const logger = createAdaptiveLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('should pass options to created logger', () => {
    const logger = createAdaptiveLogger({
      level: 1,
      name: 'test',
      context: { app: 'test-app' },
    });
    expect(logger).toBeDefined();
  });
});
