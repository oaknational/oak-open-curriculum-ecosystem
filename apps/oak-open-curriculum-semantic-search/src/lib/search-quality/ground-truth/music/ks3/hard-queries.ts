/**
 * KS3 Music hard ground truth queries.
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
 * KS3 Music hard queries (misspellings, synonyms, colloquial).
 */
export const MUSIC_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'music for films scary scenes',
    category: 'colloquial',
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
    category: 'naturalistic',
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
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspelling of "rhythm".',
    expectedRelevance: {
      'the-role-of-the-kick-and-snare-in-drum-grooves': 3,
      'creating-variation-to-a-fundamental-drum-groove': 2,
    },
  },
] as const;
