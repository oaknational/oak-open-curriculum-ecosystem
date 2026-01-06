/**
 * Primary French ground truth queries for search quality evaluation.
 *
 * Covers KS2: vocabulary, grammar, verbs, everyday topics.
 *
 * **IMPORTANT**: French lessons lack transcripts. These ground truths
 * test structural fields only (lesson_structure, lesson_structure_semantic).
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/french-primary.json.
 *
 * @see DATA-VARIANCES.md for MFL transcript limitations
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary French.
 *
 * Note: Queries focus on structural content (titles, learning objectives)
 * as French lessons have no transcripts.
 */
export const FRENCH_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'French introductions être avoir',
    expectedRelevance: {
      'introductions-voici-je-suis-and-il-elle-est': 3,
      'new-friends-mon-ma-ton-ta': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'French plural adjectives Year 5',
    expectedRelevance: {
      'back-to-school-information-questions-with-qui-and-comment': 3,
      'story-soura-la-souris': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'French school instructions',
    expectedRelevance: {
      'school-instructions-in-class': 3,
      'numbers-1-31-il-ny-a-pas-de': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'French celebrations Christmas Haiti',
    expectedRelevance: {
      'christmas-in-haiti-and-france-er-verbs-nous-and-vous': 3,
      'new-years-traditions-vous-meaning-formal-you': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'French ER verbs singular',
    expectedRelevance: {
      'menton-carnival-uses-of-de': 3,
      'menton-carnival-singular-adjective-agreement': 3,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Primary French.
 */
export const FRENCH_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'learning french ks2',
    expectedRelevance: {
      'introductions-voici-je-suis-and-il-elle-est': 2,
      'school-instructions-in-class': 2,
    },
    category: 'colloquial',
    description: 'Informal phrasing with key stage reference',
  },
] as const;

/**
 * All Primary French ground truth queries.
 *
 * Total: 6 queries.
 */
export const FRENCH_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...FRENCH_PRIMARY_STANDARD_QUERIES,
  ...FRENCH_PRIMARY_HARD_QUERIES,
] as const;
