/**
 * Precise-topic ground truth query for Secondary Religious Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const RE_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Buddhism beliefs practices',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Buddhism content using curriculum terminology',
    expectedRelevance: {
      'siddhartha-gautama-as-a-historical-figure': 3,
      'the-buddha-through-the-eyes-of-devotees': 2,
      'dhamma-moral-precepts': 2,
      'dhamma-skilful-actions': 1,
    },
  },
] as const;
