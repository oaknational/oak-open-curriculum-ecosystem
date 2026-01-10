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
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests verb and topic concept matching in MFL without transcripts.',
  },
  {
    query: 'French plural adjectives Year 5',
    expectedRelevance: {
      'teachers-nous-sommes-and-plural-adjective-agreement': 3,
      'cousins-vous-etes-and-plural-adjective-agreement': 3,
      'description-ils-elles-sont-and-plural-adjective-agreement': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests year-specific grammar topic matching.',
  },
  {
    query: 'French school instructions',
    expectedRelevance: {
      'school-instructions-in-class': 3,
      'numbers-1-31-il-ny-a-pas-de': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests classroom vocabulary topic retrieval.',
  },
  {
    query: 'French celebrations Christmas Haiti',
    expectedRelevance: {
      'christmas-in-haiti-and-france-er-verbs-nous-and-vous': 3,
      'new-years-traditions-vous-meaning-formal-you': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests cultural topic with geographic specificity.',
  },
  {
    query: 'French ER verbs singular',
    expectedRelevance: {
      'at-school-singular-er-verbs': 3,
      'family-activities-singular-regular-er-verbs': 3,
      'at-school-er-verbs-i-and-you': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests verb conjugation grammar topic matching.',
  },
] as const;

/**
 * Hard ground truth queries for Primary French.
 */
export const FRENCH_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'learning french ks2',
    expectedRelevance: {
      'introductions-voici-je-suis-and-il-elle-est': 3,
      'school-instructions-in-class': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing with key stage reference',
  },
  {
    query: 'teach french greetings to children',
    expectedRelevance: {
      'introductions-voici-je-suis-and-il-elle-est': 3,
      'new-friends-mon-ma-ton-ta': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher intent phrasing for basic French vocabulary.',
  },
  {
    query: 'fench vocabulary primary',
    expectedRelevance: {
      'introductions-voici-je-suis-and-il-elle-est': 3,
      'my-birthday-quand': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of French with context.',
  },
  {
    query: 'French verbs and vocabulary together',
    expectedRelevance: {
      'age-avoir-meaning-be': 3,
      'my-monster-il-y-a-and-il-a': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of grammar with vocabulary topics.',
  },
  {
    query: 'confidence building speaking practice',
    expectedRelevance: {
      'introductions-voici-je-suis-and-il-elle-est': 3,
      'new-friends-mon-ma-ton-ta': 2,
    },
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for oral skill development.',
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
