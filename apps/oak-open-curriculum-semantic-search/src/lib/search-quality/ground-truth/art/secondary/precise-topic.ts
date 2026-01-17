/**
 * Precise-topic ground truth query for Secondary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: dry-materials slug changed from 3→2 (lesson is about pencils/pastels, not paint) */
export const ART_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'abstract painting techniques',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Direct curriculum term match for abstract painting. Tests whether search returns lessons specifically about painting techniques in abstract art.',
    expectedRelevance: {
      'abstract-art-painting-using-different-stimuli': 3,
      'abstract-marks-respond-to-stimuli-by-painting': 2,
      'abstract-art-dry-materials-in-response-to-stimuli': 2,
    },
  },
] as const;
