/**
 * Type definitions for validation module
 * Pure types with no runtime behaviour
 */

import { z } from 'zod';

/**
 * Result type for validation operations
 * Discriminated union for type-safe error handling
 */
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; issues: ValidationIssue[] };

/**
 * Validation issue details
 */
export interface ValidationIssue {
  path: string[];
  message: string;
  code?: string;
}

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
): result is { ok: true; value: T } {
  return result.ok;
}

/**
 * Type predicate to check if a validation result is a failure
 * Enables type narrowing without type assertions
 */
export function isValidationFailure<T>(
  result: ValidationResult<T>,
): result is { ok: false; issues: ValidationIssue[] } {
  return !result.ok;
}

/**
 * Type predicate to safely check if a value is a record
 * Used after Zod validation to ensure type safety
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type-safe Zod parsing helper that eliminates need for type assertions
 * Returns a ValidationResult with proper type narrowing
 */
export function parseWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const validated = schema.parse(data);
    // After successful parse, we know the type is T
    return { ok: true, value: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        issues: error.issues.map((issue) => ({
          path: issue.path.map(String),
          message: issue.message,
          code: issue.code,
        })),
      };
    }
    return {
      ok: false,
      issues: [{ path: [], message: 'Validation failed', code: 'VALIDATION_ERROR' }],
    };
  }
}
