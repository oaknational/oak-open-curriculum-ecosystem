/**
 * @fileoverview Tests for Result<T,E> - proving functional composition
 * @module @oak-mcp-core/errors
 *
 * These tests prove that Result provides functional error handling
 * with proper type safety and composability.
 */

import { describe, it, expect } from 'vitest';
import { Result } from './result.js';

describe('Result<T,E>', () => {
  describe('creation', () => {
    it('should create success result with ok()', () => {
      const result = Result.ok(42);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('should create error result with err()', () => {
      const error = new Error('Something failed');
      const result = Result.err(error);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(error);
      }
    });

    it('should handle different value and error types', () => {
      // Success with object
      const successObj = Result.ok({ id: 1, name: 'test' });
      expect(successObj.ok).toBe(true);

      // Error with string
      const errorStr = Result.err('validation failed');
      expect(errorStr.ok).toBe(false);
      if (!errorStr.ok) {
        expect(errorStr.error).toBe('validation failed');
      }

      // Error with array of errors
      const errorArr = Result.err(['error1', 'error2']);
      expect(errorArr.ok).toBe(false);
      if (!errorArr.ok) {
        expect(errorArr.error).toEqual(['error1', 'error2']);
      }
    });
  });

  describe('map combinator', () => {
    it('should transform success value', () => {
      const result = Result.ok(5);
      const doubled = Result.map(result, (x) => x * 2);

      expect(doubled.ok).toBe(true);
      if (doubled.ok) {
        expect(doubled.value).toBe(10);
      }
    });

    it('should pass through error unchanged', () => {
      const error = new Error('Failed');
      const result = Result.err<Error>(error);
      const mapped = Result.map(result, (x: never) => x * 2);

      expect(mapped.ok).toBe(false);
      if (!mapped.ok) {
        expect(mapped.error).toBe(error);
      }
    });

    it('should allow type transformation', () => {
      const result = Result.ok('hello');
      const lengthResult = Result.map(result, (s) => s.length);

      expect(lengthResult.ok).toBe(true);
      if (lengthResult.ok) {
        expect(lengthResult.value).toBe(5);
      }
    });
  });

  describe('flatMap combinator', () => {
    it('should chain successful operations', () => {
      const divide = (a: number, b: number): Result<number, string> => {
        if (b === 0) {
          return Result.err('Division by zero');
        }
        return Result.ok(a / b);
      };

      const result = Result.ok(10);
      const chained = Result.flatMap(result, (x) => divide(x, 2));

      expect(chained.ok).toBe(true);
      if (chained.ok) {
        expect(chained.value).toBe(5);
      }
    });

    it('should short-circuit on first error', () => {
      const divide = (a: number, b: number): Result<number, string> => {
        if (b === 0) {
          return Result.err('Division by zero');
        }
        return Result.ok(a / b);
      };

      const result = Result.ok(10);
      const chained = Result.flatMap(result, (x) => divide(x, 0));

      expect(chained.ok).toBe(false);
      if (!chained.ok) {
        expect(chained.error).toBe('Division by zero');
      }
    });

    it('should not execute function on error input', () => {
      let executed = false;
      const result = Result.err<string>('Initial error');

      const chained = Result.flatMap(result, () => {
        executed = true;
        return Result.ok('Should not reach here');
      });

      expect(executed).toBe(false);
      expect(chained.ok).toBe(false);
      if (!chained.ok) {
        expect(chained.error).toBe('Initial error');
      }
    });
  });

  describe('match pattern matching', () => {
    it('should handle success case', () => {
      const result = Result.ok(42);

      const output = Result.match(result, {
        ok: (value) => `Success: ${value.toString()}`,
        err: (error) => error,
      });

      expect(output).toBe('Success: 42');
    });

    it('should handle error case', () => {
      const result = Result.err('Not found');

      const output = Result.match(result, {
        ok: (value) => value,
        err: (error) => `Error: ${error}`,
      });

      expect(output).toBe('Error: Not found');
    });

    it('should allow different return types', () => {
      const result = Result.ok(10);

      const component = Result.match(result, {
        ok: (value) => ({ type: 'success', data: value }),
        err: (error) => error,
      });

      expect(component).toEqual({ type: 'success', data: 10 });
    });
  });

  describe('utility methods', () => {
    it('should check if result is ok', () => {
      const success = Result.ok('value');
      const failure = Result.err('error');

      expect(Result.isOk(success)).toBe(true);
      expect(Result.isOk(failure)).toBe(false);
    });

    it('should check if result is error', () => {
      const success = Result.ok('value');
      const failure = Result.err('error');

      expect(Result.isErr(success)).toBe(false);
      expect(Result.isErr(failure)).toBe(true);
    });

    it('should unwrap value or throw', () => {
      const success = Result.ok(42);
      expect(Result.unwrap(success)).toBe(42);

      const failure = Result.err('Failed');
      expect(() => Result.unwrap(failure)).toThrow('Failed to unwrap Result: Failed');
    });

    it('should unwrap value or provide default', () => {
      const success = Result.ok(42);
      const failure = Result.err('error');

      expect(Result.unwrapOr(success, 0)).toBe(42);
      expect(Result.unwrapOr(failure, 0)).toBe(0);
    });
  });

  describe('conversion from ValidationResult', () => {
    it('should convert valid ValidationResult to ok Result', () => {
      const validation = {
        valid: true,
        data: { id: 1, name: 'test' },
      };

      const result = Result.fromValidation(validation);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({ id: 1, name: 'test' });
      }
    });

    it('should convert invalid ValidationResult to err Result', () => {
      const validation = {
        valid: false,
        errors: ['Field required', 'Invalid format'],
      };

      const result = Result.fromValidation(validation);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual(['Field required', 'Invalid format']);
      }
    });

    it('should handle missing errors array', () => {
      const validation = {
        valid: false,
      };

      const result = Result.fromValidation(validation);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual(['Unknown error']);
      }
    });
  });

  describe('async operations', () => {
    it('should wrap promises with fromPromise', async () => {
      const promise = Promise.resolve(42);
      const result = await Result.fromPromise(promise);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('should catch promise rejections', async () => {
      const promise = Promise.reject(new Error('Async failed'));
      const result = await Result.fromPromise(promise);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('Async failed');
      }
    });
  });

  describe('collect multiple results', () => {
    it('should collect all successes', () => {
      const results = [Result.ok(1), Result.ok(2), Result.ok(3)];

      const collected = Result.collect(results);

      expect(collected.ok).toBe(true);
      if (collected.ok) {
        expect(collected.value).toEqual([1, 2, 3]);
      }
    });

    it('should fail on first error', () => {
      const results = [Result.ok(1), Result.err('Error at 2'), Result.ok(3)];

      const collected = Result.collect(results);

      expect(collected.ok).toBe(false);
      if (!collected.ok) {
        expect(collected.error).toBe('Error at 2');
      }
    });
  });
});
