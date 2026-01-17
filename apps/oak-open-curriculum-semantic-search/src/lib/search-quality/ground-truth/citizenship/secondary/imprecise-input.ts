/**
 * Imprecise-input ground truth query for Secondary Citizenship.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: replaced score=2 slug (procedures/traditions) with roles-focused slug */
export const CITIZENSHIP_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'parliment functions and roles',
    category: 'imprecise-input',
    priority: 'critical',
    description:
      'Tests typo recovery: "parliment" → "parliament". System should remain resilient despite typo and return functions/roles lessons.',
    expectedRelevance: {
      'what-is-parliament-and-what-are-its-functions': 3,
      'what-is-the-difference-between-the-government-and-parliament': 2,
    },
  },
] as const;
