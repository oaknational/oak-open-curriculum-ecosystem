/**
 * SECONDARY French ground truth queries for grammar topics.
 *
 * Covers tenses, negation, verbs.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Grammar ground truth queries for SECONDARY French.
 */
export const GRAMMAR_SECONDARY_FRENCH: readonly GroundTruthQuery[] = [
  {
    query: 'French negation ne pas',
    expectedRelevance: {
      'what-isnt-happening-ne-pas-negation': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 3,
      'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 2,
      'what-isnt-there-negation-before-a-noun-with-il-y-a': 2,
    },
  },
  {
    query: 'French present tense verbs',
    expectedRelevance: {
      'what-people-do-and-dont-do-ne-pas-negation': 3,
      'what-isnt-happening-ne-pas-negation': 2,
    },
  },
  {
    query: 'French avoir être',
    expectedRelevance: {
      'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 3,
    },
  },
] as const;
