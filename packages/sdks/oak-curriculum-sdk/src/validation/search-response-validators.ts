/**
 * Validation helpers for search API responses generated from the Open Curriculum schema.
 */

import type { ValidationResult, SearchResponseForScope } from './types';
import { parseSearchResponse, parseSearchSuggestionResponse } from './types';
import { type SearchScopeWithAll } from '../types/generated/search/scopes';
import type { SearchSuggestionResponse } from '../types/generated/search/index';

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
