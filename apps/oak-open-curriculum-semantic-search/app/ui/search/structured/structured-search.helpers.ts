import {
  DEFAULT_INCLUDE_FACETS,
  DEFAULT_SUGGESTION_CACHE,
  SearchSuggestionResponseSchema,
  type SearchStructuredRequest,
  type SearchSuggestionResponse,
} from '@oaknational/oak-curriculum-sdk';

const suggestionCacheSchema = SearchSuggestionResponseSchema.shape.cache;

/**
 * Normalises a structured search request ensuring optional fields align with SDK defaults.
 */
export function buildStructuredSearchBody(input: SearchStructuredRequest): SearchStructuredRequest {
  return {
    scope: input.scope,
    text: input.text,
    subject: input.subject ?? undefined,
    keyStage: input.keyStage ?? undefined,
    minLessons: input.minLessons,
    size: input.size,
    includeFacets: input.includeFacets ?? DEFAULT_INCLUDE_FACETS,
    phaseSlug: input.phaseSlug ?? undefined,
    from: input.from,
    highlight: input.highlight,
  } satisfies SearchStructuredRequest;
}

/**
 * Resolves the base URL for client-side requests, preferring explicit env overrides.
 */
export function resolveSearchBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
  if (fromEnv) {
    return fromEnv;
  }

  const fromVercel = process.env.VERCEL_URL;
  if (fromVercel) {
    return `https://${fromVercel}`;
  }

  return 'http://localhost:3000';
}

/**
 * Performs a defensive JSON.parse returning null on failure.
 */
export function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Ensures suggestion cache payloads fall back to SDK defaults when absent.
 */
export function normaliseSuggestionCache(
  value: SearchSuggestionResponse['cache'] | undefined,
): SearchSuggestionResponse['cache'] {
  return suggestionCacheSchema.parse(value ?? DEFAULT_SUGGESTION_CACHE);
}
