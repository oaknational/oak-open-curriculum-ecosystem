import { typeSafeKeys } from '@oaknational/type-helpers';
import { describe, it, expect } from 'vitest';
import { buildNormalizedError, isNormalizedError, normalizeError } from './error-normalisation';

describe('normalizeError', () => {
  it('wraps native Error values in a branded package-owned error', () => {
    const error = Object.assign(new Error('test error'), { code: 500 });
    error.stack = 'Error: test error\n    at test.ts:1:1';

    const result = normalizeError(error);

    expect(result).not.toBe(error);
    expect(isNormalizedError(result)).toBe(true);
    expect(result).toMatchObject({
      name: 'Error',
      message: 'test error',
      stack: 'Error: test error\n    at test.ts:1:1',
      metadata: {
        code: 500,
      },
    });
  });

  it('keeps the Oak marker non-enumerable and out of serialised output', () => {
    const result = normalizeError(new Error('test error'));

    expect(typeSafeKeys(result)).not.toContain('__oakNormalizedError');
    expect(JSON.stringify(result)).not.toContain('__oakNormalizedError');
  });

  it('preserves cause chains and sanitised metadata', () => {
    const cause = new Error('inner failure');
    const error = Object.assign(new Error('outer failure'), {
      cause,
      context: {
        issuedAt: new Date('2025-01-01T00:00:00.000Z'),
      },
    });

    const result = normalizeError(error);

    expect(result.cause).toMatchObject({
      message: 'inner failure',
      name: 'Error',
    });
    expect(result.metadata).toEqual({
      issuedAt: '2025-01-01T00:00:00.000Z',
    });
  });

  it('converts primitive values to package-owned errors', () => {
    expect(normalizeError('string error')).toMatchObject({
      name: 'Error',
      message: 'string error',
    });
    expect(normalizeError(42)).toMatchObject({
      name: 'Error',
      message: '42',
    });
  });

  it('handles nullish values as Unknown error', () => {
    expect(normalizeError(null)).toMatchObject({
      name: 'Error',
      message: 'Unknown error',
    });
    expect(normalizeError(undefined)).toMatchObject({
      name: 'Error',
      message: 'Unknown error',
    });
  });

  it('normalises plain objects with explicit message and metadata', () => {
    const result = normalizeError({
      name: 'RemoteError',
      message: 'Internal error',
      status: 500,
      cause: {
        message: 'nested failure',
      },
    });

    expect(result).toMatchObject({
      name: 'RemoteError',
      message: 'Internal error',
      metadata: {
        status: 500,
      },
      cause: {
        name: 'Error',
        message: 'nested failure',
      },
    });
  });

  it('builds branded normalised errors explicitly', () => {
    const result = buildNormalizedError({
      name: 'OakError',
      message: 'manual normalisation',
      metadata: {
        subsystem: 'logger',
      },
    });

    expect(isNormalizedError(result)).toBe(true);
    expect(result.metadata).toEqual({
      subsystem: 'logger',
    });
  });
});
