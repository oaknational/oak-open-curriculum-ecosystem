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
} from './types.js';

// Function exports
export { validateRequest } from './request-validators.js';
export { validateResponse } from './response-validators.js';

// Type predicate exports for better type narrowing
export { isValidationSuccess, isValidationFailure, isRecord, parseWithSchema } from './types.js';
