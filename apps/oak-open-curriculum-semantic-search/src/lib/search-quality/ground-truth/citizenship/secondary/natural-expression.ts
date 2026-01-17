/**
 * Natural-expression ground truth query for Secondary Citizenship.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-14 - Reviewed: MRR 1.000, tests colloquial phrasing for fairness/rights */
export const CITIZENSHIP_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'being fair to everyone rights',
    category: 'natural-expression',
    priority: 'high',
    description:
      'Tests colloquial vocabulary bridging: "being fair" → equality/fairness, "rights" → legal protections',
    expectedRelevance: {
      'what-does-fairness-mean-in-society': 3,
      'why-do-we-need-laws-on-equality-in-the-uk': 2,
      'what-are-rights-and-where-do-they-come-from': 2,
    },
  },
] as const;
