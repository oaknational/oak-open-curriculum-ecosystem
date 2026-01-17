/**
 * Precise-topic ground truth query for Secondary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** Human Review: 2026-01-17 - Deep review: added empathy (human factors lesson) */
export const DT_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'ergonomics design human factors',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Direct curriculum term match for ergonomics/anthropometrics/human factors content',
    expectedRelevance: {
      ergonomics: 3,
      anthropometrics: 3,
      'anthropometrics-and-ergonomics': 3,
      empathy: 2,
      'ergonomic-testing-and-design-development': 2,
    },
  },
] as const;
