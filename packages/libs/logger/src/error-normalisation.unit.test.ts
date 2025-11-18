import { describe, it, expect } from 'vitest';
import { normalizeError } from './error-normalisation';

describe('normalizeError', () => {
  it('returns original Error instance', () => {
    const error = new Error('test error');
    const result = normalizeError(error);
    expect(result).toBe(error);
  });

  it('converts string to Error', () => {
    const result = normalizeError('string error');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('string error');
  });

  it('converts number to Error', () => {
    const result = normalizeError(42);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('42');
  });

  it('handles null by returning Unknown error', () => {
    const result = normalizeError(null);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Unknown error');
  });

  it('handles undefined by returning Unknown error', () => {
    const result = normalizeError(undefined);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Unknown error');
  });

  it('stringifies plain objects', () => {
    const obj = { code: 500, message: 'Internal error' };
    const result = normalizeError(obj);
    expect(result.message).toBe(JSON.stringify(obj));
  });

  it('falls back to toString() when JSON.stringify fails', () => {
    const obj: { toString(): string } = {
      toString() {
        return 'custom error';
      },
    };
    const result = normalizeError(obj);
    expect(result.message).toBe('"custom error"');
  });
});
