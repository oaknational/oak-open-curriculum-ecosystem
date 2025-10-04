import type { SequenceFacet } from '../../../../src/lib/hybrid-search/types';
import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk';

export interface BuildFacetFollowUpInputArgs {
  base: SearchStructuredRequest | null;
  facet: SequenceFacet;
}

export function buildFacetFollowUpInput({
  base,
  facet,
}: BuildFacetFollowUpInputArgs): SearchStructuredRequest | null {
  if (!base) {
    return null;
  }

  return {
    ...base,
    scope: 'sequences',
    subject: facet.subjectSlug ?? base.subject,
    phaseSlug: facet.phaseSlug,
  } satisfies SearchStructuredRequest;
}
