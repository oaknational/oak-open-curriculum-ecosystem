/**
 * Natural-expression ground truth query for Secondary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Selected TRUE beginner lessons (Lessons 1-3 in unit), not end-of-unit capstone lessons (5-6) */
export const COMPUTING_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'coding for beginners programming basics introduction',
    category: 'natural-expression',
    priority: 'high',
    description:
      'Tests vocabulary bridging from "coding for beginners" to KS3 Introduction to Python lessons. Expected slugs are the first 3 lessons in the unit (true beginner content), not later lessons that assume prior knowledge.',
    expectedRelevance: {
      'writing-a-text-based-program': 3,
      'working-with-numerical-inputs': 2,
      'using-selection': 2,
    },
  },
] as const;
