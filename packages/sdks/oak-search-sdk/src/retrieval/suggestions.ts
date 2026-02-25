/**
 * Suggestion pipeline — completion + bool_prefix fallback.
 */

import type { estypes } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type { SearchSuggestionItem } from '@oaknational/sdk-codegen/search';

import type { SuggestParams } from '../types/retrieval-params.js';
import type { SuggestionResponse, RetrievalError } from '../types/retrieval-results.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';
import { extractStatusCode } from '../admin/es-error-guards.js';

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
 * Minimal search-client interface for the suggest pipeline.
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
  client: SuggestClient,
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
    const index = resolveIndex(resolveIndexKind(params.scope));
    const completion = buildCompletionClause(prefix, limit, params.subject, params.keyStage);

    const completionResponse = await client.search({
      index,
      size: 0,
      suggest: { suggestions: completion },
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

function clampLimit(raw: number | undefined): number {
  return Math.min(Math.max(raw ?? DEFAULT_SUGGESTION_LIMIT, 1), MAX_SUGGESTION_LIMIT);
}

function resolveIndexKind(scope: SuggestParams['scope']): 'lessons' | 'units' | 'sequences' {
  if (scope === 'units') {
    return 'units';
  }
  if (scope === 'sequences') {
    return 'sequences';
  }
  return 'lessons';
}

/**
 * Builds the full completion suggest clause including prefix, field, size,
 * and optional category contexts.
 */
function buildCompletionClause(
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
 * Extract suggestion items from ES completion response.
 *
 * @param response - Raw ES search response with suggest
 * @param limit - Maximum number of items to return
 * @param scope - Search scope (lessons, units, sequences)
 * @returns Array of SearchSuggestionItem
 */
function extractSuggestionItems(
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

/**
 * Type guard that narrows the ES suggest options union to its array form.
 *
 * Wraps `Array.isArray` with an explicit predicate because the ESLint
 * type resolver narrows `Array.isArray` on union types to `any[]`.
 */
function isOptionsArray(
  options: readonly SuggestOptionSlice[] | SuggestOptionSlice | undefined,
): options is readonly SuggestOptionSlice[] {
  return Array.isArray(options);
}

/**
 * Builds completion contexts from optional subject and keyStage filters.
 *
 * Returns `undefined` when no filters are provided (no contexts to constrain).
 * Follows the same pattern as the CLI's `buildSubjectContexts`.
 */
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
