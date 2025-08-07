/**
 * @fileoverview Validation utilities without external dependencies
 * @module moria/utils/validation
 *
 * Provides pure validation functions and type guards.
 * No external dependencies, suitable for any environment.
 */

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; errors: string[] };

/**
 * Validator function type
 */
export type Validator<T> = (value: unknown) => ValidationResult<T>;

/**
 * Type predicate function
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * Custom validation error
 */
export class ValidationError extends Error {
  constructor(public readonly errors: string | string[]) {
    const errorList = Array.isArray(errors) ? errors : [errors];
    super(`Validation failed: ${errorList.join(', ')}`);
    this.name = 'ValidationError';
    this.errors = errorList;
  }
}

// Basic type guards

/**
 * Check if value is a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Check if value is a number (excluding NaN and Infinity)
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Check if value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * Check if value is an array
 */
export const isArray = <T = unknown>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

/**
 * Check if value is an object (excluding null and arrays)
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Check if value is a function
 */
export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};

/**
 * Check if value is null
 */
export const isNull = (value: unknown): value is null => {
  return value === null;
};

/**
 * Check if value is undefined
 */
export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

/**
 * Check if value is defined (not undefined)
 */
export const isDefined = <T>(value: T | undefined): value is T => {
  return value !== undefined;
};

/**
 * Check if value is non-nullable (not null or undefined)
 */
export const isNonNullable = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Check if object has a property
 */
export const hasProperty = <K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> => {
  return isObject(obj) && key in obj;
};

// Validation functions

/**
 * Validate object shape
 */
export const validateShape = <T extends Record<string, unknown>>(
  value: unknown,
  shape: Record<keyof T, TypeGuard<unknown>>
): ValidationResult<T> => {
  if (!isObject(value)) {
    return { valid: false, errors: ['Value must be an object'] };
  }

  const errors: string[] = [];

  for (const [key, guard] of Object.entries(shape)) {
    const propValue = (value as any)[key];
    if (!guard(propValue)) {
      errors.push(`${key}: validation failed`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, value: value as T };
};

/**
 * Validate enum value
 */
export const validateEnum = <T extends readonly unknown[]>(
  value: unknown,
  values: T
): ValidationResult<T[number]> => {
  if (values.includes(value)) {
    return { valid: true, value: value as T[number] };
  }

  return {
    valid: false,
    errors: [`Value must be one of: ${values.join(', ')}`],
  };
};

/**
 * Validate number range
 */
export const validateRange = (
  value: unknown,
  min: number,
  max: number
): ValidationResult<number> => {
  if (!isNumber(value)) {
    return { valid: false, errors: ['Value must be a number'] };
  }

  if (value < min || value > max) {
    return {
      valid: false,
      errors: [`Value must be between ${min} and ${max}`],
    };
  }

  return { valid: true, value };
};

/**
 * Validate string pattern
 */
export const validatePattern = (
  value: unknown,
  pattern: RegExp
): ValidationResult<string> => {
  if (!isString(value)) {
    return { valid: false, errors: ['Value must be a string'] };
  }

  if (!pattern.test(value)) {
    return {
      valid: false,
      errors: [`Value does not match pattern: ${pattern}`],
    };
  }

  return { valid: true, value };
};

/**
 * Validate string or array length
 */
export const validateLength = (
  value: unknown,
  min: number,
  max: number
): ValidationResult<string | unknown[]> => {
  if (!isString(value) && !isArray(value)) {
    return { valid: false, errors: ['Value must be a string or array'] };
  }

  const length = value.length;
  if (length < min || length > max) {
    return {
      valid: false,
      errors: [`Value length must be between ${min} and ${max}`],
    };
  }

  return { valid: true, value };
};

// Validator combinators

/**
 * Combine multiple validators
 */
export const combine = <T>(validators: Validator<T>[]): Validator<T> => {
  return (value: unknown): ValidationResult<T> => {
    const errors: string[] = [];

    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        errors.push(...result.errors);
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, value: value as T };
  };
};

/**
 * Make a validator optional (accepts null/undefined)
 */
export const optional = <T>(
  validator: Validator<T>
): Validator<T | null | undefined> => {
  return (value: unknown): ValidationResult<T | null | undefined> => {
    if (value === null || value === undefined) {
      return { valid: true, value };
    }
    return validator(value);
  };
};

/**
 * Make a validator required (rejects null/undefined)
 */
export const required = <T>(validator: Validator<T>): Validator<T> => {
  return (value: unknown): ValidationResult<T> => {
    if (value === null || value === undefined) {
      return { valid: false, errors: ['value is required'] };
    }
    return validator(value);
  };
};

/**
 * Create validator from type guard
 */
export const fromGuard = <T>(
  guard: TypeGuard<T>,
  errorMessage = 'Validation failed'
): Validator<T> => {
  return (value: unknown): ValidationResult<T> => {
    if (guard(value)) {
      return { valid: true, value };
    }
    return { valid: false, errors: [errorMessage] };
  };
};

/**
 * Map validator result
 */
export const mapValidator = <T, U>(
  validator: Validator<T>,
  fn: (value: T) => U
): Validator<U> => {
  return (value: unknown): ValidationResult<U> => {
    const result = validator(value);
    if (result.valid) {
      return { valid: true, value: fn(result.value) };
    }
    return result;
  };
};

/**
 * Chain validators
 */
export const chainValidators = <T, U>(
  first: Validator<T>,
  second: (value: T) => Validator<U>
): Validator<U> => {
  return (value: unknown): ValidationResult<U> => {
    const firstResult = first(value);
    if (!firstResult.valid) {
      return firstResult;
    }
    return second(firstResult.value)(firstResult.value);
  };
};
