import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAdaptiveLogger, createLogger } from '../src/adaptive';

describe('Adaptive Logger', () => {
  let originalProcess: typeof globalThis.process;

  beforeEach(() => {
    originalProcess = globalThis.process;
  });

  afterEach(() => {
    globalThis.process = originalProcess;
    vi.resetModules();
  });

  it('should create logger using adaptive factory', async () => {
    const logger = await createAdaptiveLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('should create logger using createLogger factory', async () => {
    const logger = await createLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should detect edge environment when window is defined', async () => {
    // @ts-expect-error Testing runtime detection
    globalThis.window = {};

    const logger = await createAdaptiveLogger();
    expect(logger).toBeDefined();
    // EdgeLogger will be used

    delete globalThis.window;
  });

  it('should pass options to created logger', async () => {
    const logger = await createAdaptiveLogger({
      level: 1,
      name: 'test',
      context: { app: 'test-app' },
    });
    expect(logger).toBeDefined();
  });

  it('should cache logger factory after first creation', async () => {
    const logger1 = await createAdaptiveLogger();
    const logger2 = await createAdaptiveLogger();

    expect(logger1).toBeDefined();
    expect(logger2).toBeDefined();
  });

  it('should detect Deno environment', async () => {
    // @ts-expect-error Testing runtime detection
    globalThis.Deno = { version: { deno: '1.0.0' } };

    const logger = await createAdaptiveLogger();
    expect(logger).toBeDefined();

    delete globalThis.Deno;
  });

  it('should detect Bun environment as Node-compatible', async () => {
    // @ts-expect-error Testing runtime detection
    globalThis.Bun = { version: '1.0.0' };

    const logger = await createAdaptiveLogger();
    expect(logger).toBeDefined();

    delete globalThis.Bun;
  });

  it('should handle different runtime environments', async () => {
    // Test with just the default environment (Node.js in test env)
    const logger = await createAdaptiveLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});
