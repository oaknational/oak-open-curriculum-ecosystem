/**
 * Imprecise-input ground truth query for Secondary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "platics" misspelling */
export const DT_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'platics and polymers materials',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "plastics" - tests fuzzy recovery',
    expectedRelevance: {
      'polymers-properties-sources-and-stock-forms': 3,
      'physical-properties-of-materials': 2,
    },
  },
] as const;
