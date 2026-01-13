/**
 * Precise-topic ground truth query for Primary Religious Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const RE_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Guru Nanak Sikhs',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests Sikh religious figure and belief retrieval',
    expectedRelevance: {
      'guru-nanak': 3,
      'guru-nanaks-teachings-on-equality-and-acceptance': 2,
    },
  },
] as const;
