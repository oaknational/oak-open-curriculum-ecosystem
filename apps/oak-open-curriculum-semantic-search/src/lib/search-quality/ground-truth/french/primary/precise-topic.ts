/**
 * Precise-topic ground truth query for Primary French.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const FRENCH_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'French ER verbs singular',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests verb conjugation grammar topic matching',
    expectedRelevance: {
      'at-school-singular-er-verbs': 3,
      'family-activities-singular-regular-er-verbs': 3,
      'at-school-er-verbs-i-and-you': 2,
    },
  },
] as const;
