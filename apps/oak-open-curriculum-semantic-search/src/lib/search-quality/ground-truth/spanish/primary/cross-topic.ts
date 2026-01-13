/**
 * Cross-topic ground truth query for Primary Spanish.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const SPANISH_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Spanish verbs ser and estar together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of two key Spanish verb concepts',
    expectedRelevance: {
      'how-are-you-today-and-usually-estar-for-states-and-ser-for-traits': 3,
      'how-is-she-es-and-esta': 2,
    },
  },
] as const;
