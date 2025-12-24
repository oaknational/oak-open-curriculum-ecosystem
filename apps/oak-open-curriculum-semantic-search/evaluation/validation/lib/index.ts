/**
 * Ground truth validation library.
 *
 * @packageDocumentation
 */

// Types (validation-specific only, API response types are Zod-derived in api-checkers)
export type { SlugEntry, ValidationResult, ValidationCategory } from './types';

// API helpers
export { getApiKey, API_BASE } from './api-helpers';

// API checkers
export { checkLessonExists, checkUnitExists, checkSequenceExists } from './api-checkers';

// Slug collectors
export { collectSlugsFromQueries } from './slug-collectors';

// Validation helpers
export { validateCategory, printResults, validateQueryStructure } from './validation-helpers';

// Validation runner
export { runValidation } from './validation-runner';
