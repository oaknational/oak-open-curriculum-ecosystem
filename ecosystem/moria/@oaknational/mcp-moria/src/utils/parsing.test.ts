/**
 * @fileoverview Tests for parsing utilities
 * @module moria/utils/parsing.test
 */

import { describe, it, expect } from 'vitest';
import {
  parseJSON,
  parseNumber,
  parseBoolean,
  parseDate,
  parseArray,
  parseObject,
  parseEnum,
  parseURL,
  parseEmail,
  parseUUID,
  parseSemVer,
  parseCSV,
  parseKeyValue,
  parseTemplate,
  coerceToString,
  coerceToNumber,
  coerceToBoolean,
  coerceToArray,
  type ParseResult,
} from './parsing';

describe('JSON Parsing', () => {
  describe('parseJSON', () => {
    it('should parse valid JSON strings', () => {
      const result = parseJSON('{"name": "test", "value": 42}');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ name: 'test', value: 42 });
      }
    });

    it('should parse arrays', () => {
      const result = parseJSON('[1, 2, 3]');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual([1, 2, 3]);
      }
    });

    it('should handle invalid JSON', () => {
      const result = parseJSON('not valid json');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Invalid JSON');
      }
    });

    it('should handle empty strings', () => {
      const result = parseJSON('');
      expect(result.success).toBe(false);
    });
  });
});

describe('Primitive Parsing', () => {
  describe('parseNumber', () => {
    it('should parse valid numbers', () => {
      expect(parseNumber('42').success).toBe(true);
      expect(parseNumber('-3.14').success).toBe(true);
      expect(parseNumber('0').success).toBe(true);
      expect(parseNumber('1e10').success).toBe(true);
    });

    it('should reject invalid numbers', () => {
      expect(parseNumber('abc').success).toBe(false);
      expect(parseNumber('').success).toBe(false);
      expect(parseNumber('12.34.56').success).toBe(false);
      expect(parseNumber('NaN').success).toBe(false);
      expect(parseNumber('Infinity').success).toBe(false);
    });

    it('should preserve number precision', () => {
      const result = parseNumber('3.141592653589793');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(3.141592653589793);
      }
    });
  });

  describe('parseBoolean', () => {
    it('should parse true values', () => {
      expect(parseBoolean('true').success).toBe(true);
      expect(parseBoolean('TRUE').success).toBe(true);
      expect(parseBoolean('True').success).toBe(true);
      expect(parseBoolean('1').success).toBe(true);
      expect(parseBoolean('yes').success).toBe(true);
      expect(parseBoolean('on').success).toBe(true);
    });

    it('should parse false values', () => {
      const falsyValues = ['false', 'FALSE', 'False', '0', 'no', 'off'];
      for (const value of falsyValues) {
        const result = parseBoolean(value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(false);
        }
      }
    });

    it('should reject invalid boolean strings', () => {
      expect(parseBoolean('maybe').success).toBe(false);
      expect(parseBoolean('').success).toBe(false);
      expect(parseBoolean('2').success).toBe(false);
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date strings', () => {
      const result = parseDate('2024-01-15T10:30:00Z');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeInstanceOf(Date);
        expect(result.value.toISOString()).toBe('2024-01-15T10:30:00.000Z');
      }
    });

    it('should parse various date formats', () => {
      expect(parseDate('2024-01-15').success).toBe(true);
      expect(parseDate('01/15/2024').success).toBe(true);
      expect(parseDate('January 15, 2024').success).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(parseDate('not a date').success).toBe(false);
      expect(parseDate('2024-13-45').success).toBe(false); // Invalid month/day
      expect(parseDate('').success).toBe(false);
    });
  });
});

describe('Collection Parsing', () => {
  describe('parseArray', () => {
    it('should parse comma-separated values', () => {
      const result = parseArray('a,b,c');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual(['a', 'b', 'c']);
      }
    });

    it('should handle custom separators', () => {
      const result = parseArray('a|b|c', '|');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual(['a', 'b', 'c']);
      }
    });

    it('should trim whitespace', () => {
      const result = parseArray(' a , b , c ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual(['a', 'b', 'c']);
      }
    });

    it('should handle empty strings', () => {
      const result = parseArray('');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual(['']);
      }
    });
  });

  describe('parseObject', () => {
    it('should parse key-value pairs', () => {
      const result = parseObject('name=John,age=30,active=true');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({
          name: 'John',
          age: '30',
          active: 'true',
        });
      }
    });

    it('should handle custom separators', () => {
      const result = parseObject('a:1;b:2', ';', ':');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ a: '1', b: '2' });
      }
    });

    it('should handle missing values', () => {
      const result = parseObject('a=1,b=,c=3');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ a: '1', b: '', c: '3' });
      }
    });
  });
});

describe('Format Validators', () => {
  describe('parseURL', () => {
    it('should parse valid URLs', () => {
      expect(parseURL('https://example.com').success).toBe(true);
      expect(parseURL('http://localhost:3000/path').success).toBe(true);
      expect(parseURL('ftp://files.example.com').success).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(parseURL('not a url').success).toBe(false);
      expect(parseURL('example.com').success).toBe(false); // Missing protocol
      expect(parseURL('').success).toBe(false);
    });

    it('should return parsed URL components', () => {
      const result = parseURL('https://example.com/path?query=1');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.hostname).toBe('example.com');
        expect(result.value.pathname).toBe('/path');
        expect(result.value.protocol).toBe('https:');
        expect(result.value.search).toBe('?query=1');
      }
    });
  });

  describe('parseEmail', () => {
    it('should parse valid emails', () => {
      expect(parseEmail('user@example.com').success).toBe(true);
      expect(parseEmail('test.name+tag@example.co.uk').success).toBe(true);
      expect(parseEmail('user_123@test-domain.org').success).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(parseEmail('not-an-email').success).toBe(false);
      expect(parseEmail('@example.com').success).toBe(false);
      expect(parseEmail('user@').success).toBe(false);
      expect(parseEmail('user @example.com').success).toBe(false);
    });
  });

  describe('parseUUID', () => {
    it('should parse valid UUIDs', () => {
      expect(parseUUID('550e8400-e29b-41d4-a716-446655440000').success).toBe(
        true
      );
      expect(parseUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8').success).toBe(
        true
      );
    });

    it('should handle case insensitive UUIDs', () => {
      expect(parseUUID('550E8400-E29B-41D4-A716-446655440000').success).toBe(
        true
      );
    });

    it('should reject invalid UUIDs', () => {
      expect(parseUUID('not-a-uuid').success).toBe(false);
      expect(parseUUID('550e8400-e29b-41d4-a716').success).toBe(false); // Too short
      expect(parseUUID('550e8400e29b41d4a716446655440000').success).toBe(false); // No hyphens
    });
  });

  describe('parseSemVer', () => {
    it('should parse valid semantic versions', () => {
      expect(parseSemVer('1.0.0').success).toBe(true);
      expect(parseSemVer('2.1.3').success).toBe(true);
      expect(parseSemVer('0.0.1').success).toBe(true);
    });

    it('should parse versions with pre-release and metadata', () => {
      const result = parseSemVer('1.0.0-alpha.1+build.123');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.major).toBe(1);
        expect(result.value.minor).toBe(0);
        expect(result.value.patch).toBe(0);
        expect(result.value.prerelease).toBe('alpha.1');
        expect(result.value.metadata).toBe('build.123');
      }
    });

    it('should reject invalid versions', () => {
      expect(parseSemVer('1.0').success).toBe(false);
      expect(parseSemVer('v1.0.0').success).toBe(false);
      expect(parseSemVer('1.0.0.0').success).toBe(false);
    });
  });
});

describe('Structured Data Parsing', () => {
  describe('parseCSV', () => {
    it('should parse CSV with headers', () => {
      const csv = 'name,age,city\nJohn,30,NYC\nJane,25,LA';
      const result = parseCSV(csv);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual([
          { name: 'John', age: '30', city: 'NYC' },
          { name: 'Jane', age: '25', city: 'LA' },
        ]);
      }
    });

    it('should handle quoted values', () => {
      const csv = 'name,description\n"John Doe","A, B, C"';
      const result = parseCSV(csv);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value[0].description).toBe('A, B, C');
      }
    });

    it('should handle empty cells', () => {
      const csv = 'a,b,c\n1,,3';
      const result = parseCSV(csv);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value[0]).toEqual({ a: '1', b: '', c: '3' });
      }
    });
  });

  describe('parseKeyValue', () => {
    it('should parse key-value pairs', () => {
      const text = 'KEY1=value1\nKEY2=value2\nKEY3=value3';
      const result = parseKeyValue(text);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({
          KEY1: 'value1',
          KEY2: 'value2',
          KEY3: 'value3',
        });
      }
    });

    it('should handle custom separators', () => {
      const text = 'a: 1\nb: 2';
      const result = parseKeyValue(text, ':');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ a: '1', b: '2' });
      }
    });

    it('should ignore empty lines and comments', () => {
      const text = '# Comment\nKEY1=value1\n\nKEY2=value2\n# Another comment';
      const result = parseKeyValue(text);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({
          KEY1: 'value1',
          KEY2: 'value2',
        });
      }
    });
  });

  describe('parseTemplate', () => {
    it('should parse template strings', () => {
      const template = 'Hello, {{name}}! You are {{age}} years old.';
      const result = parseTemplate(template, { name: 'John', age: '30' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('Hello, John! You are 30 years old.');
      }
    });

    it('should handle custom delimiters', () => {
      const template = 'Hello, ${name}!';
      const result = parseTemplate(template, { name: 'John' }, '${', '}');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('Hello, John!');
      }
    });

    it('should handle missing variables', () => {
      const template = 'Hello, {{name}}!';
      const result = parseTemplate(template, {});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('Hello, !');
      }
    });
  });
});

describe('Type Coercion', () => {
  describe('coerceToString', () => {
    it('should convert various types to string', () => {
      expect(coerceToString('hello')).toBe('hello');
      expect(coerceToString(123)).toBe('123');
      expect(coerceToString(true)).toBe('true');
      expect(coerceToString(null)).toBe('');
      expect(coerceToString(undefined)).toBe('');
      expect(coerceToString({ a: 1 })).toBe('[object Object]');
      expect(coerceToString([1, 2, 3])).toBe('1,2,3');
    });
  });

  describe('coerceToNumber', () => {
    it('should convert various types to number', () => {
      expect(coerceToNumber(123)).toBe(123);
      expect(coerceToNumber('456')).toBe(456);
      expect(coerceToNumber('3.14')).toBe(3.14);
      expect(coerceToNumber(true)).toBe(1);
      expect(coerceToNumber(false)).toBe(0);
      expect(coerceToNumber(null)).toBe(0);
      expect(coerceToNumber(undefined)).toBe(0);
    });

    it('should return 0 for non-numeric strings', () => {
      expect(coerceToNumber('abc')).toBe(0);
      expect(coerceToNumber('')).toBe(0);
    });
  });

  describe('coerceToBoolean', () => {
    it('should convert various types to boolean', () => {
      expect(coerceToBoolean(true)).toBe(true);
      expect(coerceToBoolean('true')).toBe(true);
      expect(coerceToBoolean('yes')).toBe(true);
      expect(coerceToBoolean('1')).toBe(true);
      expect(coerceToBoolean(1)).toBe(true);

      expect(coerceToBoolean(false)).toBe(false);
      expect(coerceToBoolean('false')).toBe(false);
      expect(coerceToBoolean('no')).toBe(false);
      expect(coerceToBoolean('0')).toBe(false);
      expect(coerceToBoolean(0)).toBe(false);
      expect(coerceToBoolean(null)).toBe(false);
      expect(coerceToBoolean(undefined)).toBe(false);
      expect(coerceToBoolean('')).toBe(false);
    });
  });

  describe('coerceToArray', () => {
    it('should convert various types to array', () => {
      expect(coerceToArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(coerceToArray('a,b,c')).toEqual(['a', 'b', 'c']);
      expect(coerceToArray('single')).toEqual(['single']);
      expect(coerceToArray(123)).toEqual([123]);
      expect(coerceToArray(null)).toEqual([]);
      expect(coerceToArray(undefined)).toEqual([]);
    });
  });
});

describe('Enum Parsing', () => {
  describe('parseEnum', () => {
    it('should parse valid enum values', () => {
      const colors = ['red', 'green', 'blue'] as const;
      expect(parseEnum('red', colors).success).toBe(true);
      expect(parseEnum('green', colors).success).toBe(true);
      expect(parseEnum('blue', colors).success).toBe(true);
    });

    it('should reject invalid enum values', () => {
      const colors = ['red', 'green', 'blue'] as const;
      const result = parseEnum('yellow', colors);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('must be one of');
      }
    });

    it('should be case sensitive by default', () => {
      const colors = ['Red', 'Green', 'Blue'] as const;
      expect(parseEnum('red', colors).success).toBe(false);
      expect(parseEnum('Red', colors).success).toBe(true);
    });
  });
});
