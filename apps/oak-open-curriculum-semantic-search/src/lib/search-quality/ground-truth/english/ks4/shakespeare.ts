/**
 * KS4 English ground truth queries for Shakespeare texts.
 *
 * Covers GCSE set texts: Macbeth, Romeo and Juliet.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools:
 * - `get-key-stages-subject-units` for unit structure
 * - `get-key-stages-subject-lessons` for lesson slugs
 * - `get-lessons-summary` for lesson details and keywords
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Shakespeare ground truth queries for KS4 English.
 *
 * Focus: Macbeth and Romeo and Juliet analysis, character study, themes.
 */
export const SHAKESPEARE_KS4_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Macbeth Lady Macbeth character analysis',
    expectedRelevance: {
      'a-critical-analysis-of-lady-macbeth': 3,
      'assessing-an-argument-about-lady-macbeth': 3,
      'an-exploration-of-act-1-scenes-5-to-7': 2,
      'an-exploration-of-act-5-scenes-1-to-5': 2,
    },
  },
  {
    query: 'Macbeth Act 1 Scene 5',
    expectedRelevance: {
      'an-exploration-of-act-1-scenes-5-to-7': 3,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
  },
  {
    query: 'Macbeth guilt and conscience',
    expectedRelevance: {
      'an-exploration-of-act-2-scenes-1-and-2': 3,
      'an-exploration-of-act-5-scenes-1-to-5': 3,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
  },
  {
    query: 'Macbeth tragic hero',
    expectedRelevance: {
      'an-exploration-of-act-5-scenes-6-to-9': 3,
      'an-exploration-of-act-3-scenes-1-to-3': 2,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
  },
  {
    query: 'Macbeth witches supernatural',
    expectedRelevance: {
      'an-exploration-of-act-1-scenes-1-4': 3,
      'an-exploration-of-act-4-scenes-1-to-3': 3,
      'an-exploration-of-act-3-scenes-4-to-6': 2,
    },
  },
] as const;
