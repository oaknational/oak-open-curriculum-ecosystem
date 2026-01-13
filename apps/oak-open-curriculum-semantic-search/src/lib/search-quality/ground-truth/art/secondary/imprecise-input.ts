/**
 * Imprecise-input ground truth query for Secondary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "beginers" misspelling */
export const ART_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'teach drawing skills beginers',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "beginners" + teacher intent',
    expectedRelevance: {
      'i-cant-draw-building-confidence-through-drawing-techniques': 3,
      'mark-making-using-different-tools': 2,
    },
  },
] as const;
