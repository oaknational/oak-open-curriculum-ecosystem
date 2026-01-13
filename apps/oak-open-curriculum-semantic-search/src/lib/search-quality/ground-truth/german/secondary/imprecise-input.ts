/**
 * Imprecise-input ground truth query for Secondary German.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "grammer" and "tence" misspellings */
export const GERMAN_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'german grammer present tence',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspellings - tests fuzzy recovery',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 2,
    },
  },
] as const;
