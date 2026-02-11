/**
 * Suggestion pipeline — completion + bool_prefix fallback.
 */

import type { Client, estypes } from '@elastic/elasticsearch';
import type { SearchSuggestionItem } from '@oaknational/oak-curriculum-sdk/public/search.js';

import type { SuggestParams } from '../types/retrieval-params.js';
import type { SuggestionResponse } from '../types/retrieval-results.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';

const DEFAULT_SUGGESTION_LIMIT = 10;
const MAX_SUGGESTION_LIMIT = 20;
const SUGGESTION_TTL_SECONDS = 60;

/**
 * Execute the suggestion pipeline for the supplied parameters.
 */
export async function suggest(
  params: SuggestParams,
  client: Client,
  resolveIndex: IndexResolverFn,
  config: SearchSdkConfig,
): Promise<SuggestionResponse> {
  const prefix = params.prefix.trim();
  if (prefix.length === 0) {
    throw new Error('suggest: prefix must not be empty');
  }

  const limit = Math.min(
    Math.max(params.limit ?? DEFAULT_SUGGESTION_LIMIT, 1),
    MAX_SUGGESTION_LIMIT,
  );
  const indexKind =
    params.scope === 'units'
      ? ('units' as const)
      : params.scope === 'sequences'
        ? ('sequences' as const)
        : ('lessons' as const);
  const index = resolveIndex(indexKind);

  const completionResponse = await client.search({
    index,
    size: 0,
    suggest: {
      suggestions: {
        prefix,
        completion: { field: 'title_suggest', size: limit, skip_duplicates: true },
      },
    },
  });

  const suggestions = extractSuggestionItems(completionResponse, limit, params.scope);

  return {
    suggestions,
    cache: { version: config.indexVersion ?? 'unknown', ttlSeconds: SUGGESTION_TTL_SECONDS },
  };
}

/** Extract suggestion items from ES completion response. */
function extractSuggestionItems(
  response: estypes.SearchResponse<unknown>,
  limit: number,
  scope: SuggestParams['scope'],
): readonly SearchSuggestionItem[] {
  const results: SearchSuggestionItem[] = [];
  const suggestMap = response.suggest;
  if (!suggestMap) {
    return results;
  }

  const suggestionArrays = suggestMap.suggestions;
  if (!Array.isArray(suggestionArrays)) {
    return results;
  }

  for (const suggestion of suggestionArrays) {
    const options = Array.isArray(suggestion.options) ? suggestion.options : [];
    for (const option of options) {
      if (results.length >= limit) {
        break;
      }
      if (isOptionWithText(option)) {
        results.push({
          label: option.text,
          scope,
          url: '',
          contexts: {},
        });
      }
    }
  }

  return results;
}

function isOptionWithText(value: unknown): value is { text: string } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('text' in value)) {
    return false;
  }
  return typeof value.text === 'string';
}
