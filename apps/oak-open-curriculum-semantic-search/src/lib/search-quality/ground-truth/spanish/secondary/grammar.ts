/**
 * SECONDARY Spanish ground truth queries for grammar topics.
 *
 * Covers AR verbs, ser/estar, present tense.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Grammar ground truth queries for SECONDARY Spanish.
 */
export const GRAMMAR_SECONDARY_SPANISH: readonly GroundTruthQuery[] = [
  {
    query: 'Spanish AR verbs present tense',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'a-school-play-ar-verbs-2nd-person-singular-information-questions': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 3,
      'homework-disaster-ar-infinitives-and-3rd-person-singular': 2,
    },
  },
  {
    query: 'Spanish verb conjugation',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 3,
    },
  },
  {
    query: 'Spanish questions information',
    expectedRelevance: {
      'a-school-play-ar-verbs-2nd-person-singular-information-questions': 3,
    },
  },
] as const;
