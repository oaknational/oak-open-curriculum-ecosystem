/**
 * Precise-topic ground truth query for Primary Physical Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const PE_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'dribbling ball skills',
    expectedRelevance: {
      'dribbling-with-hands': 3,
      'dribbling-and-sending-with-hands': 3,
      'dribbling-and-keeping-possession-using-our-hands': 3,
      'dribbling-to-score-a-point-using-our-hands': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests ball handling skill retrieval across progression',
  },
] as const;
