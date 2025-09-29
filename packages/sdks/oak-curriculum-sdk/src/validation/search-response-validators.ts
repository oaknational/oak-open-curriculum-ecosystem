/**
 * Validation helpers for search API responses generated from the Open Curriculum schema.
 */

import type { ZodTypeAny } from 'zod';
import type { ValidationResult, SchemaOutput } from './types.js';
import { parseWithSchema } from './types.js';
import {
  SearchLessonsResponseSchema,
  SearchUnitsResponseSchema,
  SearchSequencesResponseSchema,
  SearchMultiScopeResponseSchema,
  SearchSuggestionResponseSchema,
} from '../types/generated/search/index.js';
import type { SearchSuggestionResponse } from '../types/generated/search/index.js';
import { type SearchScopeWithAll } from '../types/generated/search/scopes.js';

const SEARCH_RESPONSE_SCHEMAS = {
  all: SearchMultiScopeResponseSchema,
  lessons: SearchLessonsResponseSchema,
  units: SearchUnitsResponseSchema,
  sequences: SearchSequencesResponseSchema,
} as const satisfies Record<SearchScopeWithAll, ZodTypeAny>;

type SearchResponseSchemaMap = typeof SEARCH_RESPONSE_SCHEMAS;
type SearchScope = keyof SearchResponseSchemaMap;
type SearchResponseFor<Scope extends SearchScope> = SchemaOutput<SearchResponseSchemaMap[Scope]>;

export function validateSearchResponse<S extends SearchScope>(
  scope: S,
  response: unknown,
): ValidationResult<SearchResponseFor<S>> {
  const schema = SEARCH_RESPONSE_SCHEMAS[scope];
  return parseWithSchema(schema, response);
}

export function validateSearchSuggestionResponse(
  response: unknown,
): ValidationResult<SearchSuggestionResponse> {
  return parseWithSchema(SearchSuggestionResponseSchema, response);
}
