/**
 * Primary Music ground truth queries for search quality evaluation.
 *
 * Covers KS1-KS2: singing, rhythm, instruments, performance.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/music-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary Music.
 */
export const MUSIC_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'singing games Year 2',
    expectedRelevance: {
      'singing-and-moving-together': 3,
      'learning-about-beat': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'percussion instruments',
    expectedRelevance: {
      'chanting-and-singing-in-time': 3,
      'adding-simple-instrumental-parts-to-songs-and-chants': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'major minor songs',
    expectedRelevance: {
      'major-and-minor-tonality-folk-songs': 3,
      'folk-songs-and-the-major-pentachord': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'syncopation rhythm',
    expectedRelevance: {
      'syncopation-in-songs': 3,
      'syncopated-rhythms': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'part singing rounds',
    expectedRelevance: {
      'part-singing-rounds-and-partner-songs': 3,
      'two-part-singing-rounds-and-partner-songs': 3,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Primary Music.
 */
export const MUSIC_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'singing in tune for children',
    expectedRelevance: {
      'singing-and-moving-together': 2,
      'chanting-and-singing-in-time': 2,
    },
    category: 'colloquial',
    description: 'Informal phrasing for singing lessons',
  },
  {
    query: 'rythm beat ks1',
    expectedRelevance: {
      'learning-about-beat': 2,
    },
    category: 'misspelling',
    description: 'Misspelling of rhythm',
  },
] as const;

/**
 * All Primary Music ground truth queries.
 *
 * Total: 7 queries.
 */
export const MUSIC_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MUSIC_PRIMARY_STANDARD_QUERIES,
  ...MUSIC_PRIMARY_HARD_QUERIES,
] as const;
