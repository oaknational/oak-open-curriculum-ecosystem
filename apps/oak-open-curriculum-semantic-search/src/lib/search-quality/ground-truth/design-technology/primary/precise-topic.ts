/**
 * Precise-topic ground truth query for Primary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const DT_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'cam mechanisms automata',
    expectedRelevance: {
      'cam-mechanisms': 3,
      'cams-in-a-product': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests DT mechanism vocabulary retrieval',
  },
] as const;
