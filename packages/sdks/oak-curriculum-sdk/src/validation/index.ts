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
  SchemaOutput,
} from './types.js';

// Function exports
export { validateRequest } from './request-validators.js';
export { validateCurriculumResponse } from './curriculum-response-validators.js';
export { validateSearchResponse } from './search-response-validators.js';

// Type predicate exports for better type narrowing
export {
  isValidationSuccess,
  isValidationFailure,
  parseWithCurriculumSchema,
  parseWithCurriculumSchemaInstance,
  parseEndpointParameters,
  parseSearchResponse,
  parseSearchSuggestionResponse,
  getSearchResponseSchema,
} from './types.js';
