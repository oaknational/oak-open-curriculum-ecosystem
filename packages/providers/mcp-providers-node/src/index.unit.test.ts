import { describe, it, expect, vi } from 'vitest';
import { createConsoleLogger, createInMemoryStorage, createNodeClock } from './index';

describe('providers-node', () => {
  it('createNodeClock.now returns a number close to Date.now()', () => {
    const clock = createNodeClock();
    const before = Date.now();
    const value = clock.now();
    const after = Date.now();
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThanOrEqual(before);
    expect(value).toBeLessThanOrEqual(after);
  });

  it('createConsoleLogger forwards logs to console without throwing', () => {
    const spyDebug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const spyInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const spyError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const logger = createConsoleLogger('test');
    expect(() => {
      logger.debug('d', { a: 1 });
    }).not.toThrow();
    expect(() => {
      logger.info('i');
    }).not.toThrow();
    expect(() => {
      logger.warn('w');
    }).not.toThrow();
    expect(() => {
      logger.error('e');
    }).not.toThrow();

    expect(spyDebug).toHaveBeenCalled();
    expect(spyInfo).toHaveBeenCalled();
    expect(spyWarn).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();

    spyDebug.mockRestore();
    spyInfo.mockRestore();
    spyWarn.mockRestore();
    spyError.mockRestore();
  });

  it('createInMemoryStorage stores, retrieves, and deletes values', async () => {
    const storage = createInMemoryStorage();
    await storage.set('k', 123);
    expect(await storage.get('k')).toBe(123);
    await storage.delete('k');
    expect(await storage.get('k')).toBeUndefined();
  });
});
