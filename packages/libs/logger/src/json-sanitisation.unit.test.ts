import { describe, it, expect } from 'vitest';
import { sanitiseForJson, isJsonValue, sanitiseObject } from './json-sanitisation';
import type { JsonObject, JsonValue } from './types';

function isJsonObjectValue(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function expectJsonObjectValue(value: JsonValue): JsonObject {
  if (!isJsonObjectValue(value)) {
    throw new Error('Expected sanitised value to be a JSON object');
  }
  return value;
}

describe('sanitiseForJson', () => {
  it('should pass through string values unchanged', () => {
    expect(sanitiseForJson('hello')).toBe('hello');
  });

  it('should pass through number values unchanged', () => {
    expect(sanitiseForJson(42)).toBe(42);
  });

  it('should pass through boolean values unchanged', () => {
    expect(sanitiseForJson(true)).toBe(true);
  });

  it('should pass through null unchanged', () => {
    expect(sanitiseForJson(null)).toBe(null);
  });

  it('should convert undefined to null', () => {
    expect(sanitiseForJson(undefined)).toBe(null);
  });

  it('should convert Date to ISO string', () => {
    const date = new Date('2025-01-01T00:00:00Z');
    expect(sanitiseForJson(date)).toBe('2025-01-01T00:00:00.000Z');
  });

  it('should convert Error to object with message and stack', () => {
    const error = new Error('test error');
    const output = expectJsonObjectValue(sanitiseForJson(error));
    expect(output).toMatchObject({
      message: 'test error',
      name: 'Error',
    });
    const stackValue = output.stack;
    expect(typeof stackValue === 'string').toBe(true);
  });

  it('should convert bigint values to strings', () => {
    expect(sanitiseForJson(12345678901234567890n)).toBe('12345678901234567890');
  });

  it('should sanitise arrays recursively', () => {
    const input = ['hello', undefined, 42, new Date('2025-01-01')];
    const expected = ['hello', null, 42, '2025-01-01T00:00:00.000Z'];
    expect(sanitiseForJson(input)).toEqual(expected);
  });

  it('should sanitise objects recursively', () => {
    const input = { a: 'hello', b: undefined, c: new Date('2025-01-01') };
    const expected = { a: 'hello', b: null, c: '2025-01-01T00:00:00.000Z' };
    expect(sanitiseForJson(input)).toEqual(expected);
  });

  it('should sanitise bigint entries inside objects', () => {
    const input = { id: 42n, nested: { code: 99n } };
    const result = sanitiseForJson(input);
    expect(result).toEqual({ id: '42', nested: { code: '99' } });
  });

  it('should handle nested structures', () => {
    const input = {
      users: [{ name: 'Alice', joined: new Date('2025-01-01'), meta: undefined }],
      active: true,
    };
    const expected = {
      users: [{ name: 'Alice', joined: '2025-01-01T00:00:00.000Z', meta: null }],
      active: true,
    };
    expect(sanitiseForJson(input)).toEqual(expected);
  });

  it('should handle circular references by returning placeholder', () => {
    const obj: { a: number; self?: unknown } = { a: 1 };
    obj.self = obj;
    const result = sanitiseForJson(obj);
    expect(result).toEqual({ a: 1, self: '[Circular]' });
  });

  it('should convert unserializable values to placeholder string', () => {
    const func = (): void => {
      // Test function
    };
    const result = sanitiseForJson(func);
    expect(result).toBe('[unserializable]');
  });
});

describe('isJsonValue', () => {
  it('should return true for valid JSON primitives', () => {
    expect(isJsonValue('hello')).toBe(true);
    expect(isJsonValue(42)).toBe(true);
    expect(isJsonValue(true)).toBe(true);
    expect(isJsonValue(null)).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isJsonValue(undefined)).toBe(false);
  });

  it('should return false for functions', () => {
    const sampleFunction = (): void => {
      return;
    };
    expect(isJsonValue(sampleFunction)).toBe(false);
  });

  it('should return true for valid JSON objects', () => {
    expect(isJsonValue({ a: 1, b: 'hello' })).toBe(true);
  });

  it('should return true for valid JSON arrays', () => {
    expect(isJsonValue([1, 'hello', true])).toBe(true);
  });

  it('should return false for objects containing undefined', () => {
    expect(isJsonValue({ a: undefined })).toBe(false);
  });

  it('should return true for nested valid structures', () => {
    expect(isJsonValue({ a: { b: [1, 2, 3] } })).toBe(true);
  });
});

describe('sanitiseObject', () => {
  it('should strip undefined values from objects', () => {
    const input = { a: 1, b: undefined, c: 'hello' };
    const result = sanitiseObject(input);
    expect(result).toEqual({ a: 1, c: 'hello' });
  });

  it('should sanitise nested values', () => {
    const input = { a: new Date('2025-01-01'), b: { c: undefined } };
    const result = sanitiseObject(input);
    expect(result).toEqual({ a: '2025-01-01T00:00:00.000Z', b: {} });
  });

  it('should convert bigint properties to strings', () => {
    const input = { bigintValue: 9007199254740995n };
    expect(sanitiseObject(input)).toEqual({ bigintValue: '9007199254740995' });
  });

  it('should handle empty objects', () => {
    expect(sanitiseObject({})).toEqual({});
  });

  it('should return null for non-object values', () => {
    expect(sanitiseObject('string')).toBeNull();
    expect(sanitiseObject(42)).toBeNull();
    expect(sanitiseObject(null)).toBeNull();
    expect(sanitiseObject(undefined)).toBeNull();
  });

  it('should handle arrays as objects', () => {
    // Arrays are objects, but should be handled by sanitiseForJson, not sanitiseObject
    const input = [1, 2, 3];
    const result = sanitiseObject(input);
    // Arrays are technically objects, but sanitiseObject should handle them appropriately
    expect(result).toBeNull();
  });
});
