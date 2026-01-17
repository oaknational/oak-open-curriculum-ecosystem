/**
 * Imprecise-input ground truth query for Primary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** Human Review: 2026-01-17 - Added mechanisms-in-moving-cards, upgraded card-slider-mechanisms score */
export const DT_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'mecanisms ks1 moving',
    expectedRelevance: {
      'card-lever-mechanisms': 3,
      'card-slider-mechanisms': 3,
      'mechanisms-in-moving-cards': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of "mechanisms" - tests fuzzy recovery for KS1 mechanism content',
  },
] as const;
