import {
  buildEmptyFixture,
  buildEmptyMultiScopeFixture,
  buildFixtureForScope,
} from '../../lib/search-fixtures/builders';
import { MULTI_SCOPE, SEQUENCES_SCOPE } from '../../../src/lib/search-scopes';
import type {
  HybridSearchResult,
  MultiScopeHybridResult,
} from '../../../src/lib/run-hybrid-search';
import type {
  SearchStructuredRequest,
  SearchSuggestionItem,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { FixtureMode } from '../../lib/fixture-mode';

export type MultiScopeResponse = MultiScopeHybridResult & {
  suggestions?: SearchSuggestionItem[];
};

export type FixtureResponse = ReturnType<typeof buildFixtureForScope>;

export type SearchResponsePayload = HybridSearchResult | MultiScopeResponse | FixtureResponse;

export type FixturePayloadMode = Extract<FixtureMode, 'fixtures' | 'fixtures-empty'>;

export function buildFixtureResponse(
  body: SearchStructuredRequest,
  mode: FixturePayloadMode,
): SearchResponsePayload {
  return mode === 'fixtures-empty'
    ? buildEmptyFixtureForScope(body.scope)
    : buildFixtureForScope(body.scope);
}

export function buildEmptyFixtureForScope(
  scope: SearchStructuredRequest['scope'],
): SearchResponsePayload {
  switch (scope) {
    case MULTI_SCOPE:
      return buildEmptyMultiScopeFixture();
    case 'lessons':
    case 'units':
    case 'sequences':
      return buildEmptyFixture({ scope });
    default:
      return buildFixtureForScope(scope);
  }
}

export function isMultiScopePayload(value: SearchResponsePayload): value is MultiScopeResponse {
  return value.scope === MULTI_SCOPE && 'buckets' in value;
}

export function resolveSequencePhase(
  scope: SearchResponsePayload['scope'],
  phaseSlug: SearchStructuredRequest['phaseSlug'],
): SearchStructuredRequest['phaseSlug'] {
  return scope === SEQUENCES_SCOPE ? phaseSlug : undefined;
}
