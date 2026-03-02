/**
 * Completion-suggest types and helpers for the suggest pipeline.
 *
 * Handles ES completion-suggest query building and response extraction.
 * Used by the main `suggest()` orchestrator in `suggestions.ts`.
 */

import type { estypes } from '@elastic/elasticsearch';
import type { SearchSuggestionItem } from '@oaknational/sdk-codegen/search';

import type { SuggestParams } from '../types/retrieval-params.js';

/**
 * The subset of {@link estypes.SearchCompletionSuggestOption} the
 * suggest pipeline actually reads. Derived via `Pick` to exclude
 * the `any`-contaminated `fields` property in the ES client types.
 */
type SuggestOptionSlice = Pick<estypes.SearchCompletionSuggestOption, 'text'>;

/**
 * Narrow response shape for the suggest pipeline.
 *
 * Names the `suggestions` key directly rather than using a string-
 * indexed Record, so that ESLint can narrow the inner arrays
 * without `Array.isArray` producing `any[]`.
 *
 * The full ES `SearchResponse` satisfies this structurally because
 * its `suggest` is `Record<string, SearchSuggest[]>` — a string-
 * indexed record is assignable to a type with a named optional key.
 */
export interface SuggestRawResponse {
  readonly suggest?: {
    readonly suggestions?: readonly {
      readonly options?: readonly SuggestOptionSlice[] | SuggestOptionSlice;
    }[];
  };
}

/**
 * Minimal search-client interface for the completion-suggest leg.
 *
 * Only the completion-search call is needed. The full
 * `@elastic/elasticsearch` `Client` satisfies this structurally,
 * so the production call-site passes the real client unchanged.
 *
 * @see ADR-078 Dependency Injection for Testability
 */
export interface SuggestClient {
  search(params: {
    readonly index: string;
    readonly size: number;
    readonly suggest: {
      readonly suggestions: {
        readonly prefix: string;
        readonly completion: CompletionDescriptor;
      };
    };
  }): Promise<SuggestRawResponse>;
}

/**
 * ES completion suggest category contexts.
 *
 * Keys are ES context category names (`subject`, `key_stage`).
 * Uses Record to satisfy the ES client's SearchFieldSuggester type.
 * Construction-time safety is provided by `buildCompletionContexts`.
 */
type CompletionContexts = Record<'subject' | 'key_stage', string[]>;

interface CompletionDescriptor {
  field: string;
  size: number;
  skip_duplicates: boolean;
  contexts?: Partial<CompletionContexts>;
}

/**
 * Builds the full completion suggest clause including prefix, field, size,
 * and optional category contexts.
 */
export function buildCompletionClause(
  prefix: string,
  limit: number,
  subject: SuggestParams['subject'],
  keyStage: SuggestParams['keyStage'],
): { prefix: string; completion: CompletionDescriptor } {
  const contexts = buildCompletionContexts(subject, keyStage);
  const completion: CompletionDescriptor = {
    field: 'title_suggest',
    size: limit,
    skip_duplicates: true,
  };
  if (contexts) {
    completion.contexts = contexts;
  }
  return { prefix, completion };
}

/**
 * Extract suggestion items from ES completion response.
 */
export function extractSuggestionItems(
  response: SuggestRawResponse,
  limit: number,
  scope: SuggestParams['scope'],
): readonly SearchSuggestionItem[] {
  const results: SearchSuggestionItem[] = [];
  const suggestions = response.suggest?.suggestions;
  if (!suggestions) {
    return results;
  }

  for (const suggestion of suggestions) {
    if (!isOptionsArray(suggestion.options)) {
      continue;
    }
    for (const option of suggestion.options) {
      if (results.length >= limit) {
        break;
      }
      results.push({ label: option.text, scope, url: '', contexts: {} });
    }
  }

  return results;
}

function isOptionsArray(
  options: readonly SuggestOptionSlice[] | SuggestOptionSlice | undefined,
): options is readonly SuggestOptionSlice[] {
  return Array.isArray(options);
}

function buildCompletionContexts(
  subject: SuggestParams['subject'],
  keyStage: SuggestParams['keyStage'],
): Partial<CompletionContexts> | undefined {
  if (!subject && !keyStage) {
    return undefined;
  }
  const contexts: Partial<CompletionContexts> = {};
  if (subject) {
    contexts.subject = [subject];
  }
  if (keyStage) {
    contexts.key_stage = [keyStage];
  }
  return contexts;
}
