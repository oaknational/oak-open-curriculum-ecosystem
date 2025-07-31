import { describe, it, expect } from 'vitest';
import { formatLogMessage, shouldLog, LogLevel } from './logger.js';

describe('formatLogMessage', () => {
  it('should format message with level and text', () => {
    const result = formatLogMessage('info', 'Server started');

    expect(result).toContain('[INFO]');
    expect(result).toContain('Server started');
  });

  it('should include timestamp in ISO format', () => {
    const result = formatLogMessage('error', 'Connection failed');

    // Check for ISO timestamp pattern
    expect(result).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
  });

  it('should uppercase the log level', () => {
    expect(formatLogMessage('debug', 'test')).toContain('[DEBUG]');
    expect(formatLogMessage('info', 'test')).toContain('[INFO]');
    expect(formatLogMessage('warn', 'test')).toContain('[WARN]');
    expect(formatLogMessage('error', 'test')).toContain('[ERROR]');
  });

  it('should stringify context object when provided', () => {
    const context = { userId: '123', action: 'login' };
    const result = formatLogMessage('info', 'User action', context);

    expect(result).toContain('{"userId":"123","action":"login"}');
  });

  it('should handle context with circular references', () => {
    interface CircularContext {
      name: string;
      self?: CircularContext;
    }
    const context: CircularContext = { name: 'test' };
    context.self = context; // circular reference

    const result = formatLogMessage('warn', 'Circular ref', context);

    expect(result).toContain('Circular ref');
    expect(result).toContain('[Circular Reference]');
  });

  it('should handle undefined context', () => {
    const result = formatLogMessage('info', 'No context', undefined);

    expect(result).toContain('[INFO]');
    expect(result).toContain('No context');
    expect(result).not.toContain('undefined');
  });

  it('should scrub email addresses in context', () => {
    const context = { email: 'user@example.com', name: 'John' };
    const result = formatLogMessage('info', 'User data', context);

    expect(result).toContain('"email":"use...@example.com"');
    expect(result).not.toContain('user@example.com');
  });

  it('should scrub nested email addresses', () => {
    const context = {
      users: [{ email: 'alice@example.com' }, { email: 'bob@test.org' }],
    };
    const result = formatLogMessage('debug', 'User list', context);

    expect(result).toContain('ali...@example.com');
    expect(result).toContain('bob...@test.org');
    expect(result).not.toContain('alice@example.com');
    expect(result).not.toContain('bob@test.org');
  });
});

describe('shouldLog', () => {
  it('should log when message level is higher than current level', () => {
    expect(shouldLog('info', 'error')).toBe(true);
    expect(shouldLog('debug', 'warn')).toBe(true);
    expect(shouldLog('info', 'warn')).toBe(true);
  });

  it('should log when message level equals current level', () => {
    expect(shouldLog('info', 'info')).toBe(true);
    expect(shouldLog('error', 'error')).toBe(true);
    expect(shouldLog('debug', 'debug')).toBe(true);
  });

  it('should not log when message level is lower than current level', () => {
    expect(shouldLog('error', 'warn')).toBe(false);
    expect(shouldLog('warn', 'info')).toBe(false);
    expect(shouldLog('info', 'debug')).toBe(false);
  });

  it('should follow correct hierarchy: debug < info < warn < error', () => {
    // With current level 'info'
    const currentLevel: LogLevel = 'info';

    expect(shouldLog(currentLevel, 'debug')).toBe(false);
    expect(shouldLog(currentLevel, 'info')).toBe(true);
    expect(shouldLog(currentLevel, 'warn')).toBe(true);
    expect(shouldLog(currentLevel, 'error')).toBe(true);
  });

  it('should log everything when current level is debug', () => {
    expect(shouldLog('debug', 'debug')).toBe(true);
    expect(shouldLog('debug', 'info')).toBe(true);
    expect(shouldLog('debug', 'warn')).toBe(true);
    expect(shouldLog('debug', 'error')).toBe(true);
  });

  it('should only log errors when current level is error', () => {
    expect(shouldLog('error', 'debug')).toBe(false);
    expect(shouldLog('error', 'info')).toBe(false);
    expect(shouldLog('error', 'warn')).toBe(false);
    expect(shouldLog('error', 'error')).toBe(true);
  });
});
