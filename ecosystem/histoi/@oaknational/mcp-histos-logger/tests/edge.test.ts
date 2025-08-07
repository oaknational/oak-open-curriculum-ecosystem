import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EdgeLogger } from '../src/edge';

describe('EdgeLogger', () => {
  const noop = () => undefined;

  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(noop);
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(noop);
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(noop);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(noop);
  });

  it('should create logger with default level', () => {
    const logger = new EdgeLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.isLevelEnabled).toBe('function');
  });

  it('should create logger with custom options', () => {
    const logger = new EdgeLogger({
      level: 1,
      name: 'test-logger',
      context: { app: 'test' },
    });
    expect(logger).toBeDefined();
  });

  it('should log info messages when level allows', () => {
    const logger = new EdgeLogger({ level: 2 });
    logger.info('test message');
    expect(consoleInfoSpy).toHaveBeenCalledWith('test message');
  });

  it('should not log debug messages when level is higher', () => {
    const logger = new EdgeLogger({ level: 3 });
    logger.debug('debug message');
    expect(consoleDebugSpy).not.toHaveBeenCalled();
  });

  it('should include name prefix when provided', () => {
    const logger = new EdgeLogger({ name: 'MyApp' });
    logger.info('test message');
    expect(consoleInfoSpy).toHaveBeenCalledWith('[MyApp] test message');
  });

  it('should merge context data', () => {
    const logger = new EdgeLogger({ context: { app: 'test' } });
    logger.info('message', { user: 'john' });
    expect(consoleInfoSpy).toHaveBeenCalledWith('message', {
      app: 'test',
      user: 'john',
    });
  });

  it('should handle error logging', () => {
    const logger = new EdgeLogger();
    const error = new Error('test error');
    logger.error('error occurred', error);
    expect(consoleErrorSpy).toHaveBeenCalledWith('error occurred', error);
  });

  it('should handle fatal logging', () => {
    const logger = new EdgeLogger();
    const error = new Error('fatal error');
    logger.fatal('fatal error occurred', error);
    expect(consoleErrorSpy).toHaveBeenCalledWith('[FATAL] fatal error occurred', error);
  });

  it('should create child logger with merged context', () => {
    const logger = new EdgeLogger({ context: { app: 'test' } });
    const child = logger.child({ module: 'auth' });

    child.info('child message', { user: 'jane' });
    expect(consoleInfoSpy).toHaveBeenCalledWith('child message', {
      app: 'test',
      module: 'auth',
      user: 'jane',
    });
  });

  it('should check if level is enabled', () => {
    const logger = new EdgeLogger({ level: 2 });
    expect(logger.isLevelEnabled(1)).toBe(false); // debug (1 < 2)
    expect(logger.isLevelEnabled(2)).toBe(true); // info (2 >= 2)
    expect(logger.isLevelEnabled(3)).toBe(true); // warn (3 >= 2)
  });

  it('should handle non-object context', () => {
    const logger = new EdgeLogger();
    logger.info('message', 'string context');
    expect(consoleInfoSpy).toHaveBeenCalledWith('message', {
      value: 'string context',
    });
  });

  it('should handle all log levels', () => {
    const logger = new EdgeLogger({ level: 0 });

    logger.trace('trace msg');
    expect(consoleDebugSpy).toHaveBeenCalledWith('trace msg');

    logger.debug('debug msg');
    expect(consoleDebugSpy).toHaveBeenCalledWith('debug msg');

    logger.info('info msg');
    expect(consoleInfoSpy).toHaveBeenCalledWith('info msg');

    logger.warn('warn msg');
    expect(consoleWarnSpy).toHaveBeenCalledWith('warn msg');

    logger.error('error msg');
    expect(consoleErrorSpy).toHaveBeenCalledWith('error msg');
  });
});
