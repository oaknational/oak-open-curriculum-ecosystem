import type {
  SearchScopeWithAll,
  SearchUnitsResponse,
  SearchSequencesResponse,
  SearchMultiScopeResponse,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { SingleScopeFixture } from './single-scope';
import { buildSingleScopeFixture } from './single-scope';
import { buildUnitFixture, buildSequenceFixture, buildMultiScopeFixture } from './multi-scope';

/**
 * Build a deterministic fixture response for the requested scope using SDK-generated helpers.
 */
export function buildFixtureForScope(
  scope: SearchScopeWithAll,
): SingleScopeFixture | SearchUnitsResponse | SearchSequencesResponse | SearchMultiScopeResponse {
  switch (scope) {
    case 'all':
      return buildMultiScopeFixture();
    case 'lessons':
      return buildSingleScopeFixture();
    case 'units':
      return buildUnitFixture('ks4-maths');
    case 'sequences':
      return buildSequenceFixture('ks3-history');
    default: {
      const exhaustiveCheck: never = scope;
      void exhaustiveCheck;
      throw new Error('Unsupported fixture scope');
    }
  }
}
