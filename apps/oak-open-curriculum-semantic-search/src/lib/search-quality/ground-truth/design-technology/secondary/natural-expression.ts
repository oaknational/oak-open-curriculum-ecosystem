/**
 * Natural-expression ground truth query for Secondary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests synonym mapping */
export const DT_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'green design environment friendly',
    category: 'natural-expression',
    priority: 'high',
    description: 'Synonym: "green" + "environment friendly" → sustainable',
    expectedRelevance: {
      'linear-versus-circular-economy': 3,
      'life-cycle-assessment': 2,
      'sustainable-fabrics-for-wearable-technology': 2,
    },
  },
] as const;
