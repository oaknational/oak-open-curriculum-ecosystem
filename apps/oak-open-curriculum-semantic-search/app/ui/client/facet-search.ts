import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import type { StructuredBody } from '../structured-search.shared';

export interface BuildFacetFollowUpInputArgs {
  base: StructuredBody | null;
  facet: SequenceFacet;
}

export function buildFacetFollowUpInput({
  base,
  facet,
}: BuildFacetFollowUpInputArgs): StructuredBody | null {
  if (!base) {
    return null;
  }

  return {
    ...base,
    scope: 'sequences',
    subject: facet.subjectSlug ?? base.subject,
    phaseSlug: facet.phaseSlug,
  } satisfies StructuredBody;
}
