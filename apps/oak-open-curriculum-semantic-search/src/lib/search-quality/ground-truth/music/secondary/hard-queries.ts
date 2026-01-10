/**
 * SECONDARY Music hard ground truth queries.
 *
 * Tests challenging scenarios: misspellings, synonyms, and colloquial terms.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Music hard queries (misspellings, synonyms, colloquial).
 */
export const MUSIC_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'music for films scary scenes',
    category: 'natural-expression',
    priority: 'high',
    description: 'Colloquial description of film music for tension.',
    expectedRelevance: {
      'creating-scary-music': 3,
      'tension-in-early-movies': 2,
      'the-effect-of-timbre': 1,
    },
  },
  {
    query: 'teach folk songs sea shanty',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher intent + specific genre (sea shanties).',
    expectedRelevance: {
      'singing-sea-shanties': 3,
      'modes-and-sea-shanties': 3,
      'characteristics-of-folk-songs': 2,
    },
  },
  {
    query: 'rythm patterns drums',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "rhythm".',
    expectedRelevance: {
      'the-role-of-the-kick-and-snare-in-drum-grooves': 3,
      'creating-variation-to-a-fundamental-drum-groove': 2,
    },
  },
  {
    query: 'film music and composition together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of film music with composition skills.',
    expectedRelevance: {
      'creating-scary-music': 3,
      'tension-in-early-movies': 2,
    },
  },
  {
    query: 'introduction for non-musicians',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for beginner-friendly music lesson.',
    expectedRelevance: {
      'characteristics-of-folk-songs': 3,
      'singing-sea-shanties': 2,
    },
  },
] as const;
