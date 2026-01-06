/**
 * Primary Spanish ground truth queries for search quality evaluation.
 *
 * Covers KS2: vocabulary, grammar, verbs, everyday topics.
 *
 * **IMPORTANT**: Spanish lessons lack transcripts. These ground truths
 * test structural fields only (lesson_structure, lesson_structure_semantic).
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/spanish-primary.json.
 *
 * @see DATA-VARIANCES.md for MFL transcript limitations
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary Spanish.
 *
 * Note: Queries focus on structural content (titles, learning objectives)
 * as Spanish lessons have no transcripts.
 */
export const SPANISH_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Spanish estar states Year 5',
    expectedRelevance: {
      'how-are-you-today-today-estoy-and-estas-for-states': 3,
      'how-are-you-today-and-usually-estar-for-states-and-ser-for-traits': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'Spanish classroom instructions',
    expectedRelevance: {
      'the-vowels-a-e-i-o-u-classroom-instructions': 3,
      'who-is-in-class-estoy-estas-and-esta-to-answer-the-register': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'Spanish verb ser',
    expectedRelevance: {
      'i-am-happy-the-verb-ser-soy-and-es': 3,
      'what-someone-else-is-like-soy-and-es': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'Spanish greetings',
    expectedRelevance: {
      'greetings-the-verb-estar': 3,
      'in-class-estoy-and-esta-for-location': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'Spanish ir tener Year 6',
    expectedRelevance: {
      'back-to-school-classroom-instructions': 2,
      'my-room-mi-mis-and-tu-tus': 2,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Primary Spanish.
 */
export const SPANISH_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'learning spanish ks2',
    expectedRelevance: {
      'greetings-the-verb-estar': 2,
      'i-am-happy-the-verb-ser-soy-and-es': 2,
    },
    category: 'colloquial',
    description: 'Informal phrasing with key stage reference',
  },
] as const;

/**
 * All Primary Spanish ground truth queries.
 *
 * Total: 6 queries.
 */
export const SPANISH_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...SPANISH_PRIMARY_STANDARD_QUERIES,
  ...SPANISH_PRIMARY_HARD_QUERIES,
] as const;
