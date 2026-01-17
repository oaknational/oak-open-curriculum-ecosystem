/**
 * Imprecise-input ground truth query for Secondary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: confirmed correct. Tests system resilience - both slugs found despite typo. */
export const ART_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'teach drawing skills beginers',
    category: 'imprecise-input',
    priority: 'critical',
    description:
      'Tests search resilience to typo "beginers". Score=3 slug is about building confidence for those who think they cannot draw (beginners).',
    expectedRelevance: {
      'i-cant-draw-building-confidence-through-drawing-techniques': 3,
      'drawing-for-different-purposes-and-needs': 2,
    },
  },
] as const;
