/* eslint-disable max-lines -- REFACTOR */
import type { estypes } from '@elastic/elasticsearch';
import { esClient } from '../es-client';
import { suggestLogger } from '../logger';
import { getScopeConfig, type ScopeConfig, type SuggestionHit } from './scope-config';
import type { SuggestQuery, SuggestionResponse } from './types';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;
const TTL_SECONDS = 60;

/**
 * Execute the suggestion pipeline for the supplied query.
 *
 * @param query - suggestion query parameters
 * @param searchIndexVersion - index version string for cache headers
 */
export async function runSuggestions(
  query: SuggestQuery,
  searchIndexVersion: string,
): Promise<SuggestionResponse> {
  const config = getConfigForScope(query.scope);
  const limit = normaliseLimit(query.limit);
  const prefix = query.prefix.trim();
  if (prefix.length === 0) {
    throw new Error('prefix must not be empty');
  }

  const client = esClient();
  const completionRequest = buildCompletionRequest(prefix, limit, config, query);

  let suggestions = await requestCompletion(client, completionRequest, config);
  if (suggestions.length < limit) {
    const fallbackRequest = buildFallbackRequest(prefix, limit, config, query);
    const extras = await requestFallback(client, fallbackRequest, config);
    suggestions = mergeSuggestions(suggestions, extras, limit);
  } else {
    suggestions = suggestions.slice(0, limit);
  }

  return {
    suggestions: suggestions.map((entry) => entry.item),
    cache: { version: searchIndexVersion, ttlSeconds: TTL_SECONDS },
  };
}

function getConfigForScope(scope: SuggestQuery['scope']): ScopeConfig<unknown> {
  if (scope === 'lessons') {
    return getScopeConfig('lessons');
  }
  if (scope === 'units') {
    return getScopeConfig('units');
  }
  return getScopeConfig('sequences');
}

function normaliseLimit(limit: number | undefined): number {
  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    return DEFAULT_LIMIT;
  }
  return Math.min(Math.max(limit, 1), MAX_LIMIT);
}

function buildCompletionRequest(
  prefix: string,
  limit: number,
  config: ScopeConfig<unknown>,
  query: SuggestQuery,
): estypes.SearchRequest {
  const completion: {
    field: string;
    size: number;
    skip_duplicates: boolean;
    contexts?: Record<string, string[]>;
  } = {
    field: config.completionField,
    size: limit,
    skip_duplicates: true,
  };
  const contexts = config.buildCompletionContexts(query);
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  if (contexts && Object.keys(contexts).length > 0) {
    completion.contexts = contexts;
  }

  return {
    index: config.index,
    size: 0,
    _source: [...config.sourceFields],
    suggest: {
      suggestions: {
        prefix,
        completion,
      },
    },
  };
}

function buildFallbackRequest(
  prefix: string,
  limit: number,
  config: ScopeConfig<unknown>,
  query: SuggestQuery,
): estypes.SearchRequest {
  const filters = config.buildFilters(query);
  const boolQuery: estypes.QueryDslBoolQuery = {
    must: {
      multi_match: {
        query: prefix,
        type: 'bool_prefix',
        fields: [...config.boolPrefixFields],
      },
    },
  };
  if (filters.length > 0) {
    boolQuery.filter = filters;
  }

  return {
    index: config.index,
    size: limit,
    _source: [...config.sourceFields],
    query: { bool: boolQuery },
  };
}

async function requestCompletion(
  client: ReturnType<typeof esClient>,
  request: estypes.SearchRequest,
  config: ScopeConfig<unknown>,
): Promise<SuggestionHit[]> {
  try {
    const response = await client.search<unknown, Record<string, estypes.AggregationsAggregate>>(
      request,
    );
    return extractCompletionHits(response, config);
  } catch (error: unknown) {
    suggestLogger.error('Suggestion completion request failed', error, {
      index: config.index,
    });
    throw error;
  }
}

async function requestFallback(
  client: ReturnType<typeof esClient>,
  request: estypes.SearchRequest,
  config: ScopeConfig<unknown>,
): Promise<SuggestionHit[]> {
  try {
    const response = await client.search<unknown, Record<string, estypes.AggregationsAggregate>>(
      request,
    );
    return extractFallbackHits(response, config);
  } catch (error: unknown) {
    suggestLogger.error('Suggestion fallback request failed', error, {
      index: config.index,
    });
    throw error;
  }
}

function extractCompletionHits(
  response: estypes.SearchResponse<unknown, Record<string, estypes.AggregationsAggregate>>,
  config: ScopeConfig<unknown>,
): SuggestionHit[] {
  const entries: SuggestionHit[] = [];
  const suggestions = response.suggest?.suggestions ?? [];
  for (const suggestion of suggestions) {
    const options = normalizeOptions(suggestion.options);
    for (const option of options) {
      if (!isCompletionOption(option)) {
        continue;
      }
      const source: unknown = option._source;
      if (!config.isDoc(source)) {
        continue;
      }
      const hit = config.toSuggestion(source, option._id);
      if (hit) {
        entries.push(hit);
      }
    }
  }
  return entries;
}

function extractFallbackHits(
  response: estypes.SearchResponse<unknown, Record<string, estypes.AggregationsAggregate>>,
  config: ScopeConfig<unknown>,
): SuggestionHit[] {
  const hits = response.hits.hits ?? [];
  const results: SuggestionHit[] = [];
  for (const hit of hits) {
    if (!hit || typeof hit._id !== 'string') {
      continue;
    }
    const source = hit._source;
    if (!config.isDoc(source)) {
      continue;
    }
    const suggestion = config.toSuggestion(source, hit._id);
    if (suggestion) {
      results.push(suggestion);
    }
  }
  return results;
}

function mergeSuggestions(
  primary: SuggestionHit[],
  secondary: SuggestionHit[],
  limit: number,
): SuggestionHit[] {
  const seen = new Set<string>();
  const ordered = [...primary, ...secondary];
  const deduped: SuggestionHit[] = [];
  for (const entry of ordered) {
    if (seen.has(entry.id)) {
      continue;
    }
    seen.add(entry.id);
    deduped.push(entry);
    if (deduped.length >= limit) {
      break;
    }
  }
  return deduped;
}

function normalizeOptions(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined) {
    return [];
  }
  return [value];
}

interface CompletionOptionBase {
  _id: string;
  _source: unknown;
}

function isCompletionOption(value: unknown): value is CompletionOptionBase {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('_id' in value) || typeof value._id !== 'string') {
    return false;
  }
  return '_source' in value;
}
