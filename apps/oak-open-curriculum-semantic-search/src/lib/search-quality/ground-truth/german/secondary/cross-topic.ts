/**
 * Cross-topic ground truth query for Secondary German.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests verbs + questions intersection */
export const GERMAN_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'verbs and questions in German',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of verb conjugation with question formation',
    expectedRelevance: {
      'wer-ist-bella-was-macht-sie-present-tense-verbs-yes-no-questions': 3,
      'kultur-in-deutschland-wh-question-words': 2,
    },
  },
] as const;
