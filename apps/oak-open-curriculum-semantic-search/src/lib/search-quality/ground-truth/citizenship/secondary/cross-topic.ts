/**
 * Cross-topic ground truth query for Secondary Citizenship.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-14 - Reviewed: updated to lessons explicitly combining democracy + laws concepts */
export const CITIZENSHIP_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'democracy and laws together',
    category: 'cross-topic',
    priority: 'medium',
    description:
      'Tests multi-concept intersection: democracy + legal frameworks. Target lessons that explicitly connect democratic systems with rule of law.',
    expectedRelevance: {
      'what-does-it-mean-to-live-in-a-democracy': 3,
      'what-are-rights-and-where-do-they-come-from': 3,
      'what-is-the-right-to-protest-within-a-democracy-with-the-rule-of-law': 2,
    },
  },
] as const;
