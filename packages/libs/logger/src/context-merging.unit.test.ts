import { describe, it, expect } from 'vitest';
import { mergeLogContext } from './context-merging';
import type { LogContext } from './types';

describe('mergeLogContext', () => {
  it('should return base context when no additional context provided', () => {
    const base: LogContext = { app: 'test' };
    expect(mergeLogContext(base)).toEqual({ app: 'test' });
  });

  it('should merge plain objects into base context', () => {
    const base: LogContext = { app: 'test' };
    const context = { userId: '123' };
    expect(mergeLogContext(base, context)).toEqual({ app: 'test', userId: '123' });
  });

  it('should overwrite base keys with context keys', () => {
    const base: LogContext = { app: 'test', userId: '456' };
    const context = { userId: '123' };
    expect(mergeLogContext(base, context)).toEqual({ app: 'test', userId: '123' });
  });

  it('should sanitise Date objects in context', () => {
    const base: LogContext = { app: 'test' };
    const context = { timestamp: new Date('2025-01-01T00:00:00Z') };
    const result = mergeLogContext(base, context);
    expect(result.timestamp).toBe('2025-01-01T00:00:00.000Z');
  });

  it('should handle undefined context by converting to value property', () => {
    const base: LogContext = { app: 'test' };
    const context = undefined;
    expect(mergeLogContext(base, context)).toEqual({ app: 'test' });
  });

  it('should handle non-object context by converting to value property', () => {
    const base: LogContext = { app: 'test' };
    const context = 'string value';
    const result = mergeLogContext(base, context);
    expect(result.app).toBe('test');
    expect(result.value).toBe('string value');
  });

  it('should strip undefined values from context', () => {
    const base: LogContext = { app: 'test' };
    const context = { userId: '123', meta: undefined };
    const result = mergeLogContext(base, context);
    expect(result.meta).toBeUndefined();
    expect('meta' in result).toBe(false);
  });
});
