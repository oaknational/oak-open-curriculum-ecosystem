/**
 * Type definitions for validation module
 * Pure types with no runtime behaviour
 */

import type { ZodIssue, ZodType } from 'zod';

/**
 * Result type for validation operations
 * Discriminated union for type-safe error handling
 */
export interface ValidationSuccess<T> {
  ok: true;
  value: T;
}
export interface ValidationIssue {
  path: readonly (string | number)[];
  message?: string;
  code?: ZodIssue['code'] | 'VALIDATION_ERROR' | 'UNKNOWN_OPERATION' | 'NO_SCHEMA_FOR_STATUS';
  details?: {
    expected?: string;
    received?: string;
  };
}

/**
 * Traceability information to help locate where validation occurred
 */
export interface ValidationTrace {
  when: string;
  context?: {
    path?: string;
    method?: string;
    statusCode?: number;
    operationId?: string;
  };
}

export interface ValidationFailure {
  ok: false;
  issues: readonly ValidationIssue[];
  firstMessage?: string;
  trace?: ValidationTrace;
  zod?: {
    issues: readonly ZodIssue[];
  };
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Validation issue details
 */

/**
 * Options for the validated client wrapper
 */
export interface ValidatedClientOptions {
  /** Whether to validate requests before sending */
  validateRequest?: boolean;
  /** Whether to validate responses after receiving */
  validateResponse?: boolean;
  /** Whether to throw on validation failure (vs returning result) */
  strict?: boolean;
}

/**
 * HTTP methods supported by validation
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * Type predicate to check if a validation result is successful
 * Enables type narrowing without type assertions
 */
export function isValidationSuccess<T>(
  result: ValidationResult<T>,
): result is ValidationSuccess<T> {
  return result.ok;
}

/**
 * Type predicate to check if a validation result is a failure
 * Enables type narrowing without type assertions
 */
export function isValidationFailure<T>(result: ValidationResult<T>): result is ValidationFailure {
  return !result.ok;
}

/**
 * Type-safe Zod parsing helper that eliminates need for type assertions
 * Returns a ValidationResult with proper type narrowing
 */
export function parseWithSchema<T>(schema: ZodType<T>, data: unknown): ValidationResult<T> {
  const parsed = schema.safeParse(data);
  if (parsed.success) {
    const success: ValidationSuccess<T> = {
      ok: true,
      value: parsed.data,
    };
    return success;
  }

  const zodIssues = parsed.error.issues;
  const isInvalidTypeIssue = (
    issue: ZodIssue,
  ): issue is ZodIssue & { expected: unknown; received: unknown } =>
    issue.code === 'invalid_type' && 'expected' in issue && 'received' in issue;

  const coerceString = (value: unknown): string =>
    typeof value === 'string' ? value : JSON.stringify(value);

  const issues: readonly ValidationIssue[] = zodIssues.map((issue) => {
    const base: ValidationIssue = {
      path: issue.path,
      // message can be optional in downstream handling
      message: issue.message,
      code: issue.code,
    };

    if (isInvalidTypeIssue(issue)) {
      const details = {
        expected: coerceString(issue.expected),
        received: coerceString(issue.received),
      };
      return { ...base, details };
    }
    return base;
  });

  const failure: ValidationFailure = {
    ok: false,
    issues,
    firstMessage: issues[0]?.message,
    trace: { when: new Date().toISOString() },
    zod: { issues: zodIssues },
  };
  return failure;
}
