/**
 * Validation helpers for search API responses generated from the Open Curriculum schema.
 */

/** @remarks Could and should these types and helpers be moved to generator code? */
import type { ValidationResult, SearchResponseForScope } from './types.js';
import { parseSearchResponse, parseSearchSuggestionResponse } from './types.js';

import type { SearchSuggestionResponse, SearchScopeWithAll } from '@oaknational/sdk-codegen/search';

export function validateSearchResponse<S extends SearchScopeWithAll>(
  scope: S,
  response: unknown,
): ValidationResult<SearchResponseForScope<S>> {
  return parseSearchResponse(scope, response);
}

export function validateSearchSuggestionResponse(
  response: unknown,
): ValidationResult<SearchSuggestionResponse> {
  return parseSearchSuggestionResponse(response);
}
