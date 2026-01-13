/**
 * Imprecise-input ground truth query for Secondary Religious Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "buddism" and "dhama" misspellings */
export const RE_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'buddism and the dhama',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common Buddhism/Dhamma misspellings - tests fuzzy recovery',
    expectedRelevance: {
      'dhamma-moral-precepts': 3,
      'dhamma-skilful-actions': 3,
      'siddhartha-gautama-as-a-historical-figure': 2,
    },
  },
] as const;
