/**
 * Validation helpers for search API responses generated from the Open Curriculum schema.
 */

import type { ValidationResult, SearchResponseForScope } from './types.js';
import { parseSearchResponse, parseSearchSuggestionResponse } from './types.js';
import { type SearchScopeWithAll } from '../types/generated/search/scopes.js';
import type { SearchSuggestionResponse } from '../types/generated/search/index.js';

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
