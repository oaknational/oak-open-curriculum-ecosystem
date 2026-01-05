/**
 * SECONDARY Music composition ground truth queries.
 *
 * Covers film music, minimalism, blues, and contemporary composition.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Music composition standard queries.
 */
export const MUSIC_SECONDARY_COMPOSITION_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'film music composition',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for film music unit.',
    expectedRelevance: {
      'how-music-shapes-film': 3,
      'scoring-a-silent-movie': 3,
      'representing-characters-through-music': 2,
    },
  },
  {
    query: 'blues music 12 bar',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for blues unit.',
    expectedRelevance: {
      'the-blues': 3,
      'understanding-ground-bass': 2,
    },
  },
  {
    query: 'EDM electronic dance music',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for EDM remixing.',
    expectedRelevance: {
      'creating-an-edm-drum-beat': 3,
      'creating-a-syncopated-edm-bass-line': 3,
      'developing-texture-and-timbre-in-edm': 2,
    },
  },
] as const;
