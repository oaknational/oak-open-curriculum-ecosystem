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
      'learning-about-beat': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests year-specific singing activity retrieval.',
  },
  {
    query: 'percussion instruments primary music',
    expectedRelevance: {
      'chanting-and-singing-in-time': 3,
      'adding-simple-instrumental-parts-to-songs-and-chants': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests instrument type and phase matching.',
  },
  {
    query: 'major minor songs',
    expectedRelevance: {
      'major-and-minor-tonality-folk-songs': 3,
      'folk-songs-and-the-major-pentachord': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests music theory terminology retrieval.',
  },
  {
    query: 'syncopation rhythm music ks2',
    expectedRelevance: {
      'syncopation-in-songs': 3,
      'syncopated-rhythms': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests rhythm concept vocabulary with key stage.',
  },
  {
    query: 'part singing rounds',
    expectedRelevance: {
      'part-singing-rounds-and-partner-songs': 3,
      'two-part-singing-rounds-and-partner-songs': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests singing technique terminology.',
  },
] as const;

/**
 * Hard ground truth queries for Primary Music.
 */
export const MUSIC_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'singing in tune for children',
    expectedRelevance: {
      'singing-and-moving-together': 3,
      'chanting-and-singing-in-time': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for singing lessons',
  },
  {
    query: 'rythm beat ks1',
    expectedRelevance: {
      'learning-about-beat': 3,
      'syncopated-rhythms': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of rhythm',
  },
  {
    query: 'teaching music to young kids',
    expectedRelevance: {
      'singing-and-moving-together': 3,
      'singing-with-pitch-accuracy': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal teacher intent for early years music.',
  },
  {
    query: 'singing and beat together',
    expectedRelevance: {
      'singing-and-moving-together': 3,
      'learning-about-beat': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of singing skills with rhythm concepts.',
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
