/**
 * Precise-topic ground truth query for Secondary Physical Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const PE_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'fitness training FITT principle intensity programme design',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for fitness unit',
    expectedRelevance: {
      'the-fitt-frequency-intensity-time-and-type-principle': 3,
      'training-with-intensity': 3,
      'design-your-programme': 2,
    },
  },
] as const;
