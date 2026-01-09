/**
 * SECONDARY Music composition ground truth queries.
 *
 * Covers film music, minimalism, blues, and contemporary composition.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/music-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Music composition standard queries.
 */
export const MUSIC_SECONDARY_COMPOSITION_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'film music composition scoring movie scene mood',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for film music unit.',
    expectedRelevance: {
      'how-music-shapes-film': 3,
      'scoring-a-silent-movie': 3,
      'scoring-a-film-scene': 2,
    },
  },
  {
    query: 'blues music 12 bar scale origins rock',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for blues unit.',
    expectedRelevance: {
      'blues-music-and-the-12-bar-blues': 3,
      'the-blues-scale': 3,
      'the-origins-of-rock-blues-into-rock-n-roll': 2,
    },
  },
  {
    query: 'EDM electronic dance music drum beat bass line',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for EDM remixing.',
    expectedRelevance: {
      'creating-an-edm-drum-beat': 3,
      'creating-a-syncopated-edm-bass-line': 3,
      'developing-texture-and-timbre-in-edm': 2,
    },
  },
  {
    query: 'bass clef and ground bass together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of notation reading with composition technique.',
    expectedRelevance: {
      'understanding-ground-bass': 3,
      'understanding-bass-clef': 2,
    },
  },
] as const;
