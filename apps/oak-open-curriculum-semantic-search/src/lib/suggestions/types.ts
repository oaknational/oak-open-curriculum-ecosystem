import type { KeyStage, SearchSubjectSlug, SearchScope } from '../../types/oak';

/** Available scopes for suggestion/type-ahead queries. */
export type SuggestScope = SearchScope;

/**
 * Request payload accepted by the suggestion runner.
 */
export interface SuggestQuery {
  prefix: string;
  scope: SuggestScope;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  phaseSlug?: string;
  limit?: number;
}

/**
 * Additional metadata returned alongside each suggestion.
 */
export interface SuggestionContext {
  sequenceId?: string;
  phaseSlug?: string;
}

/**
 * Structured suggestion surfaced by the API endpoint.
 */
export interface SuggestionItem {
  label: string;
  scope: SuggestScope;
  url: string;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  contexts: SuggestionContext;
}

/**
 * Standard suggestion response envelope shared by server routes.
 */
export interface SuggestionResponse {
  suggestions: SuggestionItem[];
  cache: { version: string; ttlSeconds: number };
}
