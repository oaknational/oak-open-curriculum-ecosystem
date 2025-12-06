/**
 * @module index.unit.test
 * @description Unit tests for Result<T, E> type and helper functions.
 */

import { describe, it, expect } from 'vitest';
import {
  ok,
  err,
  isOk,
  isErr,
  unwrap,
  map,
  flatMap,
  mapErr,
  unwrapOr,
  unwrapOrElse,
  type Result,
} from './index.js';

describe('ok', () => {
  it('creates an Ok result with a value', () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(42);
  });

  it('works with different types', () => {
    const stringResult = ok('hello');
    const objectResult = ok({ foo: 'bar' });
    const arrayResult = ok([1, 2, 3]);

    expect(stringResult.ok).toBe(true);
    expect(objectResult.ok).toBe(true);
    expect(arrayResult.ok).toBe(true);
  });
});

describe('err', () => {
  it('creates an Err result with an error', () => {
    const result = err('something went wrong');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('something went wrong');
  });

  it('works with different error types', () => {
    const stringErr = err('error message');
    const objectErr = err({ code: 404, message: 'Not found' });
    const numberErr = err(500);

    expect(stringErr.ok).toBe(false);
    expect(objectErr.ok).toBe(false);
    expect(numberErr.ok).toBe(false);
  });
});

describe('isOk', () => {
  it('returns true for Ok results', () => {
    const result = ok(42);
    expect(isOk(result)).toBe(true);
  });

  it('returns false for Err results', () => {
    const result = err('error');
    expect(isOk(result)).toBe(false);
  });

  it('narrows type correctly', () => {
    const result: Result<number, string> = ok(42);
    if (isOk(result)) {
      // TypeScript should know result.value is number
      const value: number = result.value;
      expect(value).toBe(42);
    }
  });
});

describe('isErr', () => {
  it('returns true for Err results', () => {
    const result = err('error');
    expect(isErr(result)).toBe(true);
  });

  it('returns false for Ok results', () => {
    const result = ok(42);
    expect(isErr(result)).toBe(false);
  });

  it('narrows type correctly', () => {
    const result: Result<number, string> = err('failed');
    if (isErr(result)) {
      // TypeScript should know result.error is string
      const error: string = result.error;
      expect(error).toBe('failed');
    }
  });
});

describe('unwrap', () => {
  it('returns the value for Ok results', () => {
    const result = ok(42);
    expect(unwrap(result)).toBe(42);
  });

  it('throws for Err results', () => {
    const result = err('failed');
    expect(() => unwrap(result)).toThrow('Called unwrap on Err: failed');
  });
});

describe('map', () => {
  it('transforms Ok values', () => {
    const result = ok(5);
    const mapped = map(result, (x) => x * 2);

    expect(isOk(mapped)).toBe(true);
    if (isOk(mapped)) {
      expect(mapped.value).toBe(10);
    }
  });

  it('passes through Err values unchanged', () => {
    const result: Result<number, string> = err('failed');
    const mapped = map(result, (x: number) => x * 2);

    expect(isErr(mapped)).toBe(true);
    if (isErr(mapped)) {
      expect(mapped.error).toBe('failed');
    }
  });

  it('can change the value type', () => {
    const result = ok(42);
    const mapped = map(result, (x: number) => `The answer is ${String(x)}`);

    expect(isOk(mapped)).toBe(true);
    if (isOk(mapped)) {
      expect(mapped.value).toBe('The answer is 42');
    }
  });
});

describe('flatMap', () => {
  it('chains Ok results', () => {
    const result = ok(5);
    const chained = flatMap(result, (x) => ok(x * 2));

    expect(isOk(chained)).toBe(true);
    if (isOk(chained)) {
      expect(chained.value).toBe(10);
    }
  });

  it('can return Err from the chain function', () => {
    const result = ok(-5);
    const chained = flatMap(result, (x) => (x >= 0 ? ok(x * 2) : err('negative value')));

    expect(isErr(chained)).toBe(true);
    if (isErr(chained)) {
      expect(chained.error).toBe('negative value');
    }
  });

  it('passes through Err values unchanged', () => {
    const result: Result<number, string> = err('failed');
    const chained = flatMap(result, (x: number) => ok(x * 2));

    expect(isErr(chained)).toBe(true);
    if (isErr(chained)) {
      expect(chained.error).toBe('failed');
    }
  });
});

describe('mapErr', () => {
  it('transforms Err values', () => {
    const result: Result<number, string> = err('not found');
    const mapped = mapErr(result, (msg) => `Error: ${msg}`);

    expect(isErr(mapped)).toBe(true);
    if (isErr(mapped)) {
      expect(mapped.error).toBe('Error: not found');
    }
  });

  it('passes through Ok values unchanged', () => {
    const result: Result<number, string> = ok(42);
    const mapped = mapErr(result, (msg: string) => `Error: ${msg}`);

    expect(isOk(mapped)).toBe(true);
    if (isOk(mapped)) {
      expect(mapped.value).toBe(42);
    }
  });

  it('can change the error type', () => {
    const result: Result<number, string> = err('404');
    const mapped = mapErr(result, (code) => parseInt(code, 10));

    expect(isErr(mapped)).toBe(true);
    if (isErr(mapped)) {
      expect(mapped.error).toBe(404);
    }
  });
});

describe('unwrapOr', () => {
  it('returns the value for Ok results', () => {
    const result = ok(42);
    expect(unwrapOr(result, 0)).toBe(42);
  });

  it('returns the default for Err results', () => {
    const result: Result<number, string> = err('failed');
    expect(unwrapOr(result, 0)).toBe(0);
  });
});

describe('unwrapOrElse', () => {
  it('returns the value for Ok results', () => {
    const result = ok(42);
    expect(unwrapOrElse(result, () => 0)).toBe(42);
  });

  it('computes default from error for Err results', () => {
    const result: Result<number, string> = err('failed');
    expect(unwrapOrElse(result, (msg) => msg.length)).toBe(6);
  });
});

describe('Result type integration', () => {
  it('works in real-world divide function', () => {
    function divide(a: number, b: number): Result<number, string> {
      if (b === 0) {
        return err('Division by zero');
      }
      return ok(a / b);
    }

    const success = divide(10, 2);
    expect(isOk(success)).toBe(true);
    if (isOk(success)) {
      expect(success.value).toBe(5);
    }

    const failure = divide(10, 0);
    expect(isErr(failure)).toBe(true);
    if (isErr(failure)) {
      expect(failure.error).toBe('Division by zero');
    }
  });

  it('forces exhaustive error handling', () => {
    const result: Result<number, string> = ok(42);

    expect(result.value).toBe(42);
  });
});
