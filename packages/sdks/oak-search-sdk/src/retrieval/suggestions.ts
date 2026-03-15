/**
 * Suggestion pipeline — completion + bool_prefix dual-query.
 *
 * Runs ES completion suggest first. When completion returns fewer
 * results than the requested limit, a `bool_prefix` query on
 * `search_as_you_type` sub-fields fills the gap. Results are merged
 * and deduplicated by label.
 */

import type { SearchSuggestionItem } from '@oaknational/sdk-codegen/search';
import { ok, err, type Result } from '@oaknational/result';

import type { SuggestParams } from '../types/retrieval-params.js';
import type { SuggestionResponse, RetrievalError } from '../types/retrieval-results.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';

import type { BoolPrefixSearchFn, IndexKind } from './suggest-bool-prefix.js';
import { runBoolPrefix, mergeAndDedup } from './suggest-bool-prefix.js';
import type { SuggestClient } from './suggest-completion.js';
import { buildCompletionClause, extractSuggestionItems } from './suggest-completion.js';
import { toRetrievalError } from './retrieval-error.js';

export type { SuggestRawResponse, SuggestClient } from './suggest-completion.js';

const DEFAULT_SUGGESTION_LIMIT = 10;
const MAX_SUGGESTION_LIMIT = 20;
const SUGGESTION_TTL_SECONDS = 60;

/**
 * Execute the dual-query suggestion pipeline.
 *
 * 1. Runs completion suggest on `title_suggest`.
 * 2. When completion returns fewer than `limit` results, runs a
 *    `bool_prefix` query on `search_as_you_type` sub-fields.
 * 3. Merges and deduplicates results by label.
 */
export async function suggest(
  params: SuggestParams,
  client: SuggestClient,
  docSearch: BoolPrefixSearchFn,
  resolveIndex: IndexResolverFn,
  config: SearchSdkConfig,
): Promise<Result<SuggestionResponse, RetrievalError>> {
  const prefix = params.prefix.trim();
  if (prefix.length === 0) {
    return err({ type: 'validation_error', message: 'suggest: prefix must not be empty' });
  }

  if (!params.subject && !params.keyStage) {
    return err({
      type: 'validation_error',
      message:
        'suggest: at least one of subject or keyStage is required ' +
        '(the completion index has mandatory contexts)',
    });
  }

  try {
    const limit = clampLimit(params.limit);
    const scopeKind = resolveIndexKind(params.scope);
    const index = resolveIndex(scopeKind);
    const suggestions = await runDualQuery(
      prefix,
      limit,
      params,
      index,
      scopeKind,
      client,
      docSearch,
    );

    return ok({
      suggestions,
      cache: { version: config.indexVersion ?? 'unknown', ttlSeconds: SUGGESTION_TTL_SECONDS },
    });
  } catch (error: unknown) {
    return err(toRetrievalError(error));
  }
}

function clampLimit(raw: number | undefined): number {
  return Math.min(Math.max(raw ?? DEFAULT_SUGGESTION_LIMIT, 1), MAX_SUGGESTION_LIMIT);
}

function resolveIndexKind(scope: SuggestParams['scope']): IndexKind {
  if (scope === 'units') {
    return 'units';
  }
  if (scope === 'sequences') {
    return 'sequences';
  }
  return 'lessons';
}

async function runDualQuery(
  prefix: string,
  limit: number,
  params: SuggestParams,
  index: string,
  scopeKind: IndexKind,
  client: SuggestClient,
  docSearch: BoolPrefixSearchFn,
): Promise<readonly SearchSuggestionItem[]> {
  const completion = buildCompletionClause(prefix, limit, params.subject, params.keyStage);
  const completionResponse = await client.search({
    index,
    size: 0,
    suggest: { suggestions: completion },
  });
  const completionItems = extractSuggestionItems(completionResponse, limit, params.scope);

  if (completionItems.length >= limit) {
    return completionItems;
  }

  const remaining = limit - completionItems.length;
  const boolPrefixItems = await runBoolPrefix(
    prefix,
    remaining,
    params,
    index,
    scopeKind,
    docSearch,
  );
  return mergeAndDedup(completionItems, boolPrefixItems, limit);
}
