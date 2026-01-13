/**
 * Precise-topic ground truth query for Primary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const ART_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'drawing marks Year 1',
    expectedRelevance: {
      'how-artists-make-marks': 3,
      'expressive-mark-making': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests year-specific mark-making curriculum retrieval',
  },
] as const;
