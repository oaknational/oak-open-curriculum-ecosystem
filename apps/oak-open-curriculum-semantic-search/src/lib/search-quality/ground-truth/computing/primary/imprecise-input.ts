/**
 * Imprecise-input ground truth query for Primary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: swapped scores - connecting-networks directly explains what internet IS */
export const COMPUTING_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'how does the internat work',
    expectedRelevance: {
      'connecting-networks': 3,
      'the-internet-and-world-wide-web': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description:
      'Tests typo recovery: "internat" → "internet". Score=3 explains internet as network of networks; score=2 covers services and WWW.',
  },
] as const;
