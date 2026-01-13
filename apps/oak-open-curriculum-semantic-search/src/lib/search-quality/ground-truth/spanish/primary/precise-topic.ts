/**
 * Precise-topic ground truth query for Primary Spanish.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const SPANISH_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Spanish verb ser',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests core verb concept retrieval in MFL',
    expectedRelevance: {
      'i-am-happy-the-verb-ser-soy-and-es': 3,
      'what-someone-else-is-like-soy-and-es': 2,
    },
  },
] as const;
