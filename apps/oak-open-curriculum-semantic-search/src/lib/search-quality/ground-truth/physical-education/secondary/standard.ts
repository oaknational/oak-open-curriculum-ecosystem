/**
 * SECONDARY Physical Education standard ground truth queries.
 *
 * Covers athletics, games, dance, gymnastics, and health/wellbeing.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/physical-education-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Physical Education standard queries.
 */
export const PE_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'athletics shot put javelin throwing technique officiating',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for athletics field events.',
    expectedRelevance: {
      'shot-put-technique': 3,
      'javelin-technique': 3,
      'officiating-your-own-throwing-challenges': 2,
    },
  },
  {
    query: 'dance choreography identity who I am character',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for dance unit.',
    expectedRelevance: {
      'who-i-am-my-name-and-character': 3,
      'what-i-like-my-hobbies-and-interests': 3,
      'where-im-from-my-home-and-family': 2,
    },
  },
  {
    query: 'fitness training FITT principle intensity programme design',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for fitness unit.',
    expectedRelevance: {
      'the-fitt-frequency-intensity-time-and-type-principle': 3,
      'training-with-intensity': 3,
      'design-your-programme': 2,
    },
  },
  {
    query: 'invasion games tactics football flag defensive strategies',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for invasion games.',
    expectedRelevance: {
      'defensive-strategies-and-tactics': 3,
      'flag-football-tactics-strategies-and-game-play': 3,
      'building-a-team-to-perform-tactics-and-strategies-together': 2,
    },
  },
  {
    query: 'badminton net wall games court movement assessment',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for net/wall games.',
    expectedRelevance: {
      'badminton-practical-assessment': 3,
      'effective-court-movement-and-strategic-thinking-through-throw-badminton': 2,
    },
  },
  {
    query: 'capoeira hip hop dance movement language improvisation',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for world dance styles.',
    expectedRelevance: {
      'capoeira-the-basic-movement-language': 3,
      'hip-hop-the-basic-movement-language': 3,
      'capoeira-improvised-duets': 2,
    },
  },
  {
    query: 'joints and movement in PE',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of anatomy with physical activity.',
    expectedRelevance: {
      'synovial-joint-structure-and-function': 3,
      'movements-possible-at-different-joints': 2,
    },
  },
] as const;
