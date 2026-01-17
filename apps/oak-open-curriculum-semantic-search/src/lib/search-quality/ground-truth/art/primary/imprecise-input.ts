/**
 * Imprecise-input ground truth query for Primary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-13
 * Fixed: Removed redundant "primary" (already filtering by phase).
 * Fixed: Replaced expressive-mark-making with mixing-secondary-colours-autumn-oranges
 *        (mark-making is not about painting techniques).
 * Tests "techneeques" typo recovery for painting techniques content.
 */
export const ART_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'brush painting techneeques',
    expectedRelevance: {
      'explore-a-variety-of-painting-techniques': 3,
      'mixing-secondary-colours-autumn-oranges': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of techniques - tests fuzzy recovery for brushwork and painting',
  },
] as const;
