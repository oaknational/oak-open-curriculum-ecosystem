/**
 * @fileoverview Tests for validation utilities
 * @module moria/utils/validation.test
 */

import { describe, it, expect } from 'vitest';
import {
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isNull,
  isUndefined,
  isDefined,
  isNonNullable,
  hasProperty,
  validateShape,
  validateEnum,
  validateRange,
  validatePattern,
  validateLength,
  ValidationError,
  type Validator,
  combine,
  optional,
  required,
} from './validation';

describe('Type Guards', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
      expect(isString(String('test'))).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(-456)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(Number.MAX_VALUE)).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(NaN)).toBe(false); // NaN is not a valid number
      expect(isNumber(Infinity)).toBe(false); // Infinity is not a valid number
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(Boolean(1))).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array(5))).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray('[]')).toBe(false);
      expect(isArray({ length: 0 })).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(new Date())).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject('object')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject([])).toBe(false); // Arrays are not plain objects
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(Date)).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction('function')).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(false)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(void 0)).toBe(true);
    });

    it('should return false for defined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined(false)).toBe(false);
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined(null)).toBe(true);
    });

    it('should return false for undefined', () => {
      expect(isDefined(undefined)).toBe(false);
      expect(isDefined(void 0)).toBe(false);
    });
  });

  describe('isNonNullable', () => {
    it('should return true for non-nullable values', () => {
      expect(isNonNullable(0)).toBe(true);
      expect(isNonNullable('')).toBe(true);
      expect(isNonNullable(false)).toBe(true);
      expect(isNonNullable({})).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isNonNullable(null)).toBe(false);
      expect(isNonNullable(undefined)).toBe(false);
    });
  });

  describe('hasProperty', () => {
    it('should return true when object has property', () => {
      expect(hasProperty({ a: 1 }, 'a')).toBe(true);
      expect(hasProperty({ name: 'test' }, 'name')).toBe(true);
    });

    it('should return false when object lacks property', () => {
      expect(hasProperty({}, 'a')).toBe(false);
      expect(hasProperty({ b: 1 }, 'a')).toBe(false);
    });

    it('should handle null and undefined', () => {
      expect(hasProperty(null, 'a')).toBe(false);
      expect(hasProperty(undefined, 'a')).toBe(false);
    });
  });
});

describe('Validation Functions', () => {
  describe('validateShape', () => {
    it('should validate object shape', () => {
      const shape = {
        name: isString,
        age: isNumber,
        active: isBoolean,
      };

      const valid = { name: 'Alice', age: 30, active: true };
      const result = validateShape(valid, shape);
      expect(result.valid).toBe(true);
    });

    it('should return errors for invalid shape', () => {
      const shape = {
        name: isString,
        age: isNumber,
      };

      const invalid = { name: 'Alice', age: 'thirty' };
      const result = validateShape(invalid, shape);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors).toContain('age: validation failed');
      }
    });

    it('should handle missing properties', () => {
      const shape = {
        required: isString,
      };

      const invalid = {};
      const result = validateShape(invalid, shape);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors).toContain('required: validation failed');
      }
    });
  });

  describe('validateEnum', () => {
    it('should validate enum values', () => {
      const colors = ['red', 'green', 'blue'] as const;

      expect(validateEnum('red', colors).valid).toBe(true);
      expect(validateEnum('green', colors).valid).toBe(true);
      expect(validateEnum('blue', colors).valid).toBe(true);
    });

    it('should reject non-enum values', () => {
      const colors = ['red', 'green', 'blue'] as const;

      const result = validateEnum('yellow', colors);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0]).toContain('must be one of');
      }
    });
  });

  describe('validateRange', () => {
    it('should validate numbers in range', () => {
      expect(validateRange(5, 0, 10).valid).toBe(true);
      expect(validateRange(0, 0, 10).valid).toBe(true);
      expect(validateRange(10, 0, 10).valid).toBe(true);
    });

    it('should reject numbers out of range', () => {
      const result = validateRange(15, 0, 10);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0]).toContain('must be between');
      }
    });

    it('should reject non-numbers', () => {
      const result = validateRange('5' as any, 0, 10);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0]).toContain('must be a number');
      }
    });
  });

  describe('validatePattern', () => {
    it('should validate string patterns', () => {
      const emailPattern = /^[^@]+@[^@]+$/;

      expect(validatePattern('test@example.com', emailPattern).valid).toBe(
        true
      );
    });

    it('should reject non-matching patterns', () => {
      const emailPattern = /^[^@]+@[^@]+$/;

      const result = validatePattern('not-an-email', emailPattern);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0]).toContain('does not match pattern');
      }
    });

    it('should reject non-strings', () => {
      const result = validatePattern(123 as any, /\d+/);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0]).toContain('must be a string');
      }
    });
  });

  describe('validateLength', () => {
    it('should validate string length', () => {
      expect(validateLength('hello', 0, 10).valid).toBe(true);
      expect(validateLength('', 0, 10).valid).toBe(true);
      expect(validateLength('1234567890', 0, 10).valid).toBe(true);
    });

    it('should validate array length', () => {
      expect(validateLength([1, 2, 3], 0, 5).valid).toBe(true);
      expect(validateLength([], 0, 5).valid).toBe(true);
    });

    it('should reject invalid lengths', () => {
      const result = validateLength('too long string', 0, 5);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0]).toContain('length must be between');
      }
    });

    it('should reject non-string/array values', () => {
      const result = validateLength(123 as any, 0, 10);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0]).toContain('must be a string or array');
      }
    });
  });
});

describe('Validator Combinators', () => {
  describe('combine', () => {
    it('should combine multiple validators', () => {
      const validator = combine<string>([
        (value) =>
          isString(value)
            ? { valid: true as const, value }
            : { valid: false as const, errors: ['must be string'] },
        (value) =>
          value.length > 0
            ? { valid: true as const, value }
            : { valid: false as const, errors: ['must not be empty'] },
      ]);

      expect(validator('hello').valid).toBe(true);

      const emptyResult = validator('');
      expect(emptyResult.valid).toBe(false);
      if (!emptyResult.valid) {
        expect(emptyResult.errors).toContain('must not be empty');
      }
    });
  });

  describe('optional', () => {
    it('should make validator optional', () => {
      const stringValidator: Validator<string> = (value) =>
        isString(value)
          ? { valid: true, value }
          : { valid: false, errors: ['must be string'] };

      const optionalString = optional(stringValidator);

      expect(optionalString('hello').valid).toBe(true);
      expect(optionalString(undefined).valid).toBe(true);
      expect(optionalString(null).valid).toBe(true);
      expect(optionalString(123).valid).toBe(false);
    });
  });

  describe('required', () => {
    it('should make validator required', () => {
      const stringValidator: Validator<string> = (value) =>
        isString(value)
          ? { valid: true, value }
          : { valid: false, errors: ['must be string'] };

      const requiredString = required(stringValidator);

      expect(requiredString('hello').valid).toBe(true);

      const nullResult = requiredString(null);
      expect(nullResult.valid).toBe(false);
      if (!nullResult.valid) {
        expect(nullResult.errors).toContain('value is required');
      }

      const undefinedResult = requiredString(undefined);
      expect(undefinedResult.valid).toBe(false);
      if (!undefinedResult.valid) {
        expect(undefinedResult.errors).toContain('value is required');
      }
    });
  });
});

describe('ValidationError', () => {
  it('should create error with single message', () => {
    const error = new ValidationError('Invalid value');
    expect(error.message).toBe('Validation failed: Invalid value');
    expect(error.errors).toEqual(['Invalid value']);
  });

  it('should create error with multiple messages', () => {
    const error = new ValidationError(['Error 1', 'Error 2']);
    expect(error.message).toContain('Error 1');
    expect(error.message).toContain('Error 2');
    expect(error.errors).toEqual(['Error 1', 'Error 2']);
  });
});
