import { describe, expect, it, vi } from 'vitest';

import { bootstrapApp } from './bootstrap-app.js';

describe('bootstrapApp', () => {
  it('returns the app when startApp succeeds', async () => {
    const fakeApp = { name: 'test-app' };
    const logger = { error: vi.fn() };
    const exit = vi.fn();

    const result = await bootstrapApp({
      startApp: () => Promise.resolve(fakeApp),
      logger,
      exit,
    });

    expect(result).toBe(fakeApp);
    expect(logger.error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
  });

  it('logs the error and calls exit(1) when startApp rejects', async () => {
    const startupError = new Error('OAuth metadata fetch failed');
    const logger = { error: vi.fn() };
    const exit = vi.fn();

    await expect(
      bootstrapApp({
        startApp: () => Promise.reject(startupError),
        logger,
        exit,
      }),
    ).rejects.toThrow(startupError);

    expect(logger.error).toHaveBeenCalledWith('Application startup failed', startupError);
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('calls exit before re-throwing so process terminates first', async () => {
    const callOrder: string[] = [];
    const startupError = new Error('bootstrap crash');

    const logger = {
      error: vi.fn(() => {
        callOrder.push('logger.error');
      }),
    };
    const exit = vi.fn(() => {
      callOrder.push('exit');
    });

    await expect(
      bootstrapApp({
        startApp: () => Promise.reject(startupError),
        logger,
        exit,
      }),
    ).rejects.toThrow(startupError);

    expect(callOrder).toStrictEqual(['logger.error', 'exit']);
  });
});
