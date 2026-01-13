/**
 * Precise-topic ground truth query for Secondary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const COMPUTING_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Python programming lists data structures projects',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for Python programming unit',
    expectedRelevance: {
      'creating-lists-in-python': 3,
      'data-structure-projects-in-python': 3,
      'python-list-operations': 2,
    },
  },
] as const;
