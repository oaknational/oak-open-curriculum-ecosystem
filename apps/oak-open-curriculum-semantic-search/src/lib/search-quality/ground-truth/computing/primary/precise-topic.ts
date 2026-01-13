/**
 * Precise-topic ground truth query for Primary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const COMPUTING_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'digital painting Year 1',
    expectedRelevance: {
      'painting-using-computers': 3,
      'using-lines-and-shapes-to-create-digital-pictures': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests year-specific computing term matching for creative skills',
  },
] as const;
