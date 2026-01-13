/**
 * Precise-topic ground truth query for Secondary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const ART_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'abstract painting techniques',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for abstract painting',
    expectedRelevance: {
      'abstract-art-painting-using-different-stimuli': 3,
      'abstract-art-dry-materials-in-response-to-stimuli': 3,
      'abstract-marks-respond-to-stimuli-by-painting': 2,
    },
  },
] as const;
