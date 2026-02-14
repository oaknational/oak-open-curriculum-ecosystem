/**
 * Suggestion pipeline — completion + bool_prefix fallback.
 */

import type { Client, estypes } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type { SearchSuggestionItem } from '@oaknational/curriculum-sdk/public/search.js';

import type { SuggestParams } from '../types/retrieval-params.js';
import type { SuggestionResponse, RetrievalError } from '../types/retrieval-results.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';
import { extractStatusCode } from '../admin/es-error-guards.js';

/** Default number of suggestions when limit is not specified. */
const DEFAULT_SUGGESTION_LIMIT = 10;
/** Maximum allowed suggestion limit. */
const MAX_SUGGESTION_LIMIT = 20;
/** Cache TTL in seconds for suggestion responses. */
const SUGGESTION_TTL_SECONDS = 60;

/**
 * Execute the suggestion pipeline for the supplied parameters.
 *
 * Uses completion suggest on title_suggest field. Returns validation error
 * when prefix is empty.
 *
 * @param params - Suggest parameters (prefix, scope, limit)
 * @param client - Elasticsearch client
 * @param resolveIndex - Index name resolver
 * @param config - SDK config (indexVersion for cache)
 * @returns Result with suggestions and cache metadata, or retrieval error
 *
 * @example
 * ```typescript
 * const result = await sdk.retrieval.suggest({ prefix: 'photo', scope: 'lessons' });
 * ```
 */
export async function suggest(
  params: SuggestParams,
  client: Client,
  resolveIndex: IndexResolverFn,
  config: SearchSdkConfig,
): Promise<Result<SuggestionResponse, RetrievalError>> {
  const prefix = params.prefix.trim();
  if (prefix.length === 0) {
    return err({ type: 'validation_error', message: 'suggest: prefix must not be empty' });
  }

  try {
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

    return ok({
      suggestions,
      cache: { version: config.indexVersion ?? 'unknown', ttlSeconds: SUGGESTION_TTL_SECONDS },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message, statusCode: extractStatusCode(error) });
  }
}

/**
 * Extract suggestion items from ES completion response.
 *
 * @param response - Raw ES search response with suggest
 * @param limit - Maximum number of items to return
 * @param scope - Search scope (lessons, units, sequences)
 * @returns Array of SearchSuggestionItem
 */
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

/** Type guard for completion option with text field. */
function isOptionWithText(value: unknown): value is { text: string } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('text' in value)) {
    return false;
  }
  return typeof value.text === 'string';
}
