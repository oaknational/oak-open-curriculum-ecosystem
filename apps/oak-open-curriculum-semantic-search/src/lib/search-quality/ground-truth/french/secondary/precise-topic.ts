/**
 * Precise-topic ground truth query for Secondary French.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const FRENCH_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'French negation ne pas',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of French negation content using curriculum terminology',
    expectedRelevance: {
      'what-isnt-happening-ne-pas-negation': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 2,
      'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 2,
      'what-isnt-there-negation-before-a-noun-with-il-y-a': 1,
    },
  },
] as const;
