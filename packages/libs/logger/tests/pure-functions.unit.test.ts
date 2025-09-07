import { describe, it, expect } from 'vitest';
import {
  convertLogLevel,
  toConsolaLevel,
  mergeLogContext,
  normalizeError,
  isLevelEnabled,
} from '../src/pure-functions';

describe('convertLogLevel', () => {
  it('should convert semantic levels to numeric', () => {
    expect(convertLogLevel('TRACE')).toBe(0);
    expect(convertLogLevel('DEBUG')).toBe(10);
    expect(convertLogLevel('INFO')).toBe(20);
    expect(convertLogLevel('WARN')).toBe(30);
    expect(convertLogLevel('ERROR')).toBe(40);
    expect(convertLogLevel('FATAL')).toBe(50);
  });

  it('should pass through numeric levels', () => {
    expect(convertLogLevel(0)).toBe(0);
    expect(convertLogLevel(25)).toBe(25);
    expect(convertLogLevel(50)).toBe(50);
  });

  it('should default to INFO for unknown levels', () => {
    // TypeScript prevents this but runtime might not
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    expect(convertLogLevel('UNKNOWN' as any)).toBe(20);
  });
});

describe('toConsolaLevel', () => {
  it('should convert 0-50 scale to 0-5 scale', () => {
    expect(toConsolaLevel(0)).toBe(0);
    expect(toConsolaLevel(10)).toBe(1);
    expect(toConsolaLevel(20)).toBe(2);
    expect(toConsolaLevel(30)).toBe(3);
    expect(toConsolaLevel(40)).toBe(4);
    expect(toConsolaLevel(50)).toBe(5);
  });

  it('should handle intermediate values', () => {
    expect(toConsolaLevel(5)).toBe(0);
    expect(toConsolaLevel(15)).toBe(1);
    expect(toConsolaLevel(25)).toBe(2);
    expect(toConsolaLevel(35)).toBe(3);
    expect(toConsolaLevel(45)).toBe(4);
  });
});

describe('mergeLogContext', () => {
  it('should return base context when no additional context', () => {
    const base = { app: 'test' };
    expect(mergeLogContext(base)).toEqual(base);
    expect(mergeLogContext(base, undefined)).toEqual(base);
  });

  it('should handle null as a value', () => {
    const base = { app: 'test' };
    expect(mergeLogContext(base, null)).toEqual({ app: 'test', value: null });
  });

  it('should merge object contexts', () => {
    const base = { app: 'test' };
    const additional = { user: 'alice' };
    expect(mergeLogContext(base, additional)).toEqual({
      app: 'test',
      user: 'alice',
    });
  });

  it('should override base properties with additional context', () => {
    const base = { app: 'test', env: 'dev' };
    const additional = { env: 'prod' };
    expect(mergeLogContext(base, additional)).toEqual({
      app: 'test',
      env: 'prod',
    });
  });

  it('should wrap non-object context in value property', () => {
    const base = { app: 'test' };

    expect(mergeLogContext(base, 'string')).toEqual({
      app: 'test',
      value: 'string',
    });

    expect(mergeLogContext(base, 123)).toEqual({
      app: 'test',
      value: 123,
    });

    expect(mergeLogContext(base, ['array'])).toEqual({
      app: 'test',
      value: ['array'],
    });
  });

  it('should handle empty base context', () => {
    expect(mergeLogContext({}, { key: 'value' })).toEqual({ key: 'value' });
    expect(mergeLogContext({}, 'string')).toEqual({ value: 'string' });
  });
});

describe('normalizeError', () => {
  it('should return Error objects unchanged', () => {
    const error = new Error('test error');
    expect(normalizeError(error)).toBe(error);
  });

  it('should convert strings to Error objects', () => {
    const result = normalizeError('string error');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('string error');
  });

  it('should convert numbers to Error objects', () => {
    const result = normalizeError(404);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('404');
  });

  it('should handle null and undefined', () => {
    const nullResult = normalizeError(null);
    expect(nullResult).toBeInstanceOf(Error);
    expect(nullResult.message).toBe('Unknown error');

    const undefinedResult = normalizeError(undefined);
    expect(undefinedResult).toBeInstanceOf(Error);
    expect(undefinedResult.message).toBe('Unknown error');
  });

  it('should convert objects to string representation', () => {
    const result = normalizeError({ code: 'ERROR_CODE' });
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('{"code":"ERROR_CODE"}');
  });

  it('should handle objects with toString', () => {
    const obj = {
      toString() {
        return 'Custom error';
      },
    };
    const result = normalizeError(obj);
    expect(result).toBeInstanceOf(Error);
    // JSON.stringify takes precedence over toString
    expect(result.message).toBe('{}');
  });
});

describe('isLevelEnabled', () => {
  it('should return true when current level is higher or equal', () => {
    expect(isLevelEnabled(30, 20)).toBe(true); // WARN enabled for INFO
    expect(isLevelEnabled(20, 20)).toBe(true); // INFO enabled for INFO
    expect(isLevelEnabled(50, 0)).toBe(true); // FATAL enabled for TRACE
  });

  it('should return false when current level is lower', () => {
    expect(isLevelEnabled(10, 20)).toBe(false); // DEBUG not enabled for INFO
    expect(isLevelEnabled(0, 10)).toBe(false); // TRACE not enabled for DEBUG
    expect(isLevelEnabled(30, 40)).toBe(false); // WARN not enabled for ERROR
  });

  it('should handle edge cases', () => {
    expect(isLevelEnabled(0, 0)).toBe(true);
    expect(isLevelEnabled(-10, 0)).toBe(false);
    expect(isLevelEnabled(100, 50)).toBe(true);
  });
});
