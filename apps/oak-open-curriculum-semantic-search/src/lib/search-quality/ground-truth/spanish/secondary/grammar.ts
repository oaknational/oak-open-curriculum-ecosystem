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
      'a-school-play-ar-verbs-2nd-person-singular-information-questions': 2,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
      'homework-disaster-ar-infinitives-and-3rd-person-singular': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Spanish AR verbs content using curriculum terminology',
  },
  {
    query: 'Spanish verb conjugation',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Spanish verb conjugation content using curriculum terminology',
  },
  {
    query: 'Spanish questions information',
    expectedRelevance: {
      'a-school-play-ar-verbs-2nd-person-singular-information-questions': 3,
      'a-big-adventure-ar-verbs-3rd-person-singular': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Spanish questions content using curriculum terminology',
  },
  {
    query: 'Spanish preterite tense past',
    expectedRelevance: {
      'viaje-a-valencia-singular-ar-preterite-singular-subject-pronouns': 3,
      'una-autora-inmigrante-singular-er-ir-preterite': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests past tense verb retrieval in Spanish.',
  },
  {
    query: 'Spanish verbs and nouns together',
    expectedRelevance: {
      'un-estudiante-inmigrante-plural-nouns-indefinite-articles': 3,
      'las-fallas-de-valencia-alguno-meaning-some': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of verb conjugation with noun/article agreement.',
  },
] as const;
