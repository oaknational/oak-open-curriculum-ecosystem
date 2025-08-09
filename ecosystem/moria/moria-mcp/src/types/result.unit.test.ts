/**
 * @fileoverview Tests for Result type utilities
 * @module moria/types/result.test
 */

import { describe, it, expect } from 'vitest';
import { Ok, Err, isOk, isErr, mapResult, flatMapResult, unwrapOr } from './result';
import type { Result } from './core';

describe('Result utilities', () => {
  describe('Ok function', () => {
    it('should create a success result', () => {
      const result = Ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('should work with complex types', () => {
      const user = { id: 1, name: 'Alice' };
      const result = Ok(user);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(user);
      }
    });
  });

  describe('Err function', () => {
    it('should create an error result', () => {
      const result = Err(new Error('Failed'));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('Failed');
      }
    });

    it('should work with custom error types', () => {
      class CustomError extends Error {
        public code: number;
        constructor(code: number, message: string) {
          super(message);
          this.code = code;
        }
      }

      const result = Err(new CustomError(404, 'Not found'));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(CustomError);
        expect(result.error.code).toBe(404);
      }
    });

    it('should work with string errors', () => {
      const result = Err('Something went wrong');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('Something went wrong');
      }
    });
  });

  describe('isOk function', () => {
    it('should return true for success results', () => {
      const result = Ok('success');
      expect(isOk(result)).toBe(true);
    });

    it('should return false for error results', () => {
      const result = Err('error');
      expect(isOk(result)).toBe(false);
    });

    it('should narrow types correctly', () => {
      const result: Result<number, string> = Ok(42);
      if (isOk(result)) {
        // TypeScript should know result.value is available
        expect(result.value).toBe(42);
      }
    });
  });

  describe('isErr function', () => {
    it('should return false for success results', () => {
      const result = Ok('success');
      expect(isErr(result)).toBe(false);
    });

    it('should return true for error results', () => {
      const result = Err('error');
      expect(isErr(result)).toBe(true);
    });

    it('should narrow types correctly', () => {
      const result: Result<number, string> = Err('error');
      if (isErr(result)) {
        // TypeScript should know result.error is available
        expect(result.error).toBe('error');
      }
    });
  });

  describe('mapResult function', () => {
    it('should map success values', () => {
      const result = Ok(5);
      const mapped = mapResult(result, (n) => n * 2);
      expect(isOk(mapped)).toBe(true);
      if (isOk(mapped)) {
        expect(mapped.value).toBe(10);
      }
    });

    it('should pass through errors', () => {
      const result = Err('error');
      const mapped = mapResult(result, (n: number) => n * 2);
      expect(isErr(mapped)).toBe(true);
      if (isErr(mapped)) {
        expect(mapped.error).toBe('error');
      }
    });

    it('should transform types', () => {
      const result = Ok('42');
      const mapped = mapResult(result, (s) => parseInt(s));
      expect(isOk(mapped)).toBe(true);
      if (isOk(mapped)) {
        expect(mapped.value).toBe(42);
      }
    });
  });

  describe('flatMapResult function', () => {
    it('should chain success results', () => {
      const result = Ok(5);
      const chained = flatMapResult(result, (n) => Ok(n * 2));
      expect(isOk(chained)).toBe(true);
      if (isOk(chained)) {
        expect(chained.value).toBe(10);
      }
    });

    it('should handle error in first result', () => {
      const result = Err('first error');
      const chained = flatMapResult(result, (n: number) => Ok(n * 2));
      expect(isErr(chained)).toBe(true);
      if (isErr(chained)) {
        expect(chained.error).toBe('first error');
      }
    });

    it('should handle error in second result', () => {
      const result = Ok(5);
      const chained = flatMapResult(result, () => Err('second error'));
      expect(isErr(chained)).toBe(true);
      if (isErr(chained)) {
        expect(chained.error).toBe('second error');
      }
    });

    it('should allow type transformations', () => {
      const parseNumber = (s: string): Result<number, string> => {
        const n = parseInt(s);
        return isNaN(n) ? Err('Not a number') : Ok(n);
      };

      const result = Ok('42');
      const chained = flatMapResult(result, parseNumber);
      expect(isOk(chained)).toBe(true);
      if (isOk(chained)) {
        expect(chained.value).toBe(42);
      }
    });
  });

  describe('unwrapOr function', () => {
    it('should return value for success results', () => {
      const result = Ok(42);
      expect(unwrapOr(result, 0)).toBe(42);
    });

    it('should return default for error results', () => {
      const result = Err('error');
      expect(unwrapOr(result, 0)).toBe(0);
    });

    it('should work with complex default values', () => {
      const defaultUser = { id: 0, name: 'Guest' };
      const result = Err('Not found');
      expect(unwrapOr(result, defaultUser)).toEqual(defaultUser);
    });
  });

  describe('Result pattern in practice', () => {
    it('should work in a realistic scenario', () => {
      // Simulating a function that might fail
      function divide(a: number, b: number): Result<number, string> {
        if (b === 0) {
          return Err('Division by zero');
        }
        return Ok(a / b);
      }

      // Success case
      const result1 = divide(10, 2);
      expect(isOk(result1)).toBe(true);
      if (isOk(result1)) {
        expect(result1.value).toBe(5);
      }

      // Error case
      const result2 = divide(10, 0);
      expect(isErr(result2)).toBe(true);
      if (isErr(result2)) {
        expect(result2.error).toBe('Division by zero');
      }

      // Using with map
      const result3 = mapResult(divide(20, 4), (n) => n * 2);
      expect(unwrapOr(result3, 0)).toBe(10);

      // Chaining operations
      const result4 = flatMapResult(divide(100, 5), (n) => divide(n, 2));
      expect(unwrapOr(result4, 0)).toBe(10);
    });
  });
});
