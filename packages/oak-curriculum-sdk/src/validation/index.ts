/**
 * Validation module public API
 * Explicit exports for tree-shaking optimisation
 */

// Type exports
export type {
  ValidationResult,
  ValidationIssue,
  ValidatedClientOptions,
  HttpMethod,
} from './types';

// Function exports
export { validateRequest } from './request-validators';
export { validateResponse } from './response-validators';

// Type predicate exports for better type narrowing
export { isValidationSuccess, isValidationFailure, isRecord, parseWithSchema } from './types';
