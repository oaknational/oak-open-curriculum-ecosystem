/**
 * Precise-topic ground truth query for Secondary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const DT_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'ergonomics design human factors',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for ergonomics unit',
    expectedRelevance: {
      ergonomics: 3,
      anthropometrics: 3,
      'ergonomic-testing-and-design-development': 2,
    },
  },
] as const;
