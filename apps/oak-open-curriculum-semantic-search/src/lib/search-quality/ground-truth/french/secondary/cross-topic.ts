/**
 * Cross-topic ground truth query for Secondary French.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests verbs + adjectives intersection */
export const FRENCH_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'verbs and adjectives in French grammar',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of verb conjugation with adjective agreement',
    expectedRelevance: {
      'two-musicians-singular-etre-singular-adjectives': 3,
      'dieppe-festival-plural-er-verbs-est-ce-que-questions': 2,
    },
  },
] as const;
