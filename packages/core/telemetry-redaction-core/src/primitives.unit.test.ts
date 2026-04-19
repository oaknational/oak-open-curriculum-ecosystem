import { REDACTED_VALUE } from '@oaknational/observability';
import { describe, expect, it } from 'vitest';

import {
  describeUnknownError,
  redactJsonObject,
  redactStringRecord,
  redactText,
  redactUnknownValue,
} from './primitives.js';

describe('redactText', () => {
  it('passes a safe string through unchanged', () => {
    expect(redactText('hello world')).toBe('hello world');
  });

  it('redacts a bearer token embedded in a string', () => {
    const output = redactText('Authorization: Bearer abcdef.ghijkl');
    expect(output).toContain(REDACTED_VALUE);
    expect(output).not.toContain('abcdef.ghijkl');
  });

  it('fully redacts a value under a sensitive key', () => {
    const output = redactText('s3cret-val-do-not-leak', 'password');
    expect(output).toBe(REDACTED_VALUE);
  });
});

describe('redactUnknownValue', () => {
  it('redacts a bearer token inside a nested object via sanitisation', () => {
    const input = { auth: 'Bearer abcdef.ghijkl' };
    const output = redactUnknownValue(input);
    expect(JSON.stringify(output)).toContain(REDACTED_VALUE);
    expect(JSON.stringify(output)).not.toContain('abcdef.ghijkl');
  });

  it('preserves a plain object structure', () => {
    const input = { safe: 'value', nested: { count: 5 } };
    const output = redactUnknownValue(input);
    expect(output).toEqual(input);
  });
});

describe('redactJsonObject', () => {
  it('returns undefined for a null input', () => {
    expect(redactJsonObject(null)).toBeUndefined();
  });

  it('returns undefined for an undefined input', () => {
    expect(redactJsonObject(undefined)).toBeUndefined();
  });

  it('redacts secret keys inside an object', () => {
    const input = { token: 'secret-token-abcdef', safe: 'value' };
    const output = redactJsonObject(input);
    expect(output).toBeDefined();
    expect(output?.['token']).toBe(REDACTED_VALUE);
    expect(output?.['safe']).toBe('value');
  });
});

describe('redactStringRecord', () => {
  it('returns undefined for an undefined input', () => {
    expect(redactStringRecord(undefined)).toBeUndefined();
  });

  it('redacts the value of a sensitive header key', () => {
    const output = redactStringRecord({
      authorization: 'Bearer xyz',
      'content-type': 'application/json',
    });
    expect(output?.['authorization']).toBe(REDACTED_VALUE);
    expect(output?.['content-type']).toBe('application/json');
  });
});

describe('describeUnknownError', () => {
  it('returns the message of an Error instance', () => {
    expect(describeUnknownError(new Error('boom'))).toBe('boom');
  });

  it('returns the stringified form of a non-Error value', () => {
    expect(describeUnknownError('plain string')).toBe('plain string');
    expect(describeUnknownError(42)).toBe('42');
    expect(describeUnknownError({ toString: () => 'custom' })).toBe('custom');
  });
});
