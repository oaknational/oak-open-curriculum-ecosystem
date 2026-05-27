/**
 * Citation construction for `eef-explore-evidence-for-context`.
 *
 * Each strand becomes one {@link Citation} carrying a non-empty tuple of
 * caveats. The caveats operationalise the R1 guidance structurally
 * (`../../eef-evidence-guidance.ts`): evidence strength alongside impact, the
 * population-average caveat, and implementation quality as the strongest
 * moderator — grounded in the strand's own headline rather than asserted as
 * free prose.
 */

import { type EefStrand } from '@oaknational/graph-corpus-sdk/eef-strands';

import type { Caveats, Citation } from '../../citation-shape.js';

/** Build the non-empty caveat tuple for a single strand. */
function buildCaveats(strand: EefStrand): Caveats {
  const { evidence_strength_label, evidence_strength_rating, impact_months } = strand.headline;
  const impactCaveat =
    impact_months === null
      ? 'Impact could not be estimated (insufficient evidence); treat this approach with particular caution.'
      : `The ${String(impact_months)}-month impact estimate is a population average from research conditions, not a guaranteed outcome for any classroom.`;
  return [
    `Evidence strength: ${evidence_strength_label} (${String(evidence_strength_rating)}/5).`,
    impactCaveat,
    'Implementation quality is the strongest moderator — a high-impact approach delivered poorly can underperform a moderate approach delivered well.',
  ];
}

/**
 * Build one citation per strand, stamping the corpus `data_version` and
 * `last_updated` from the manifest onto each.
 */
export function buildCitations(
  strands: readonly EefStrand[],
  dataVersion: string,
  lastUpdated: string,
): Citation[] {
  return strands.map((strand) => ({
    strand_id: strand.id,
    strand_name: strand.name,
    data_version: dataVersion,
    last_updated: lastUpdated,
    eef_url: strand.eef_url,
    caveats: buildCaveats(strand),
  }));
}
