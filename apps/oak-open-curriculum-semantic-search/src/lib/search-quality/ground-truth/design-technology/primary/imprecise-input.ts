/**
 * Imprecise-input ground truth query for Primary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests "mecanisms" misspelling */
export const DT_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'mecanisms ks1 moving',
    expectedRelevance: {
      'card-lever-mechanisms': 3,
      'card-slider-mechanisms': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of mechanisms - tests fuzzy recovery',
  },
] as const;
