/**
 * Precise-topic ground truth query for Secondary German.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const GERMAN_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'German present tense weak verbs',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of German present tense content using curriculum terminology',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 2,
      'school-activities-infinitives-present-tense-3rd-person-singular': 2,
      'what-i-do-at-school-infinitives-present-tense-3rd-person-singular': 1,
    },
  },
] as const;
