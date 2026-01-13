/**
 * Natural-expression ground truth query for Secondary German.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests teacher request phrasing */
export const GERMAN_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach German verb endings year 7',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request for verb conjugation',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'school-activities-infinitives-present-tense-3rd-person-singular': 2,
    },
  },
] as const;
