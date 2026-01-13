/**
 * Cross-topic ground truth query for Primary Religious Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const RE_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Sikh teachings and values together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of religious teachings with ethical values',
    expectedRelevance: {
      'guru-nanaks-teachings-on-equality-and-acceptance': 3,
      'guru-nanaks-teachings-on-serving-others': 2,
    },
  },
] as const;
