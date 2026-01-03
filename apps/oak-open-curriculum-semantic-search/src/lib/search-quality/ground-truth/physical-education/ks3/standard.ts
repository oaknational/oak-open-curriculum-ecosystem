/**
 * KS3 Physical Education standard ground truth queries.
 *
 * Covers athletics, games, dance, gymnastics, and health/wellbeing.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * KS3 Physical Education standard queries.
 */
export const PE_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'athletics shot put javelin',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for athletics field events.',
    expectedRelevance: {
      'shot-put-technique': 3,
      'javelin-technique': 3,
      'officiating-your-own-throwing-challenges': 2,
    },
  },
  {
    query: 'dance choreography identity',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for dance unit.',
    expectedRelevance: {
      'who-i-am-my-name-and-character': 3,
      'what-i-like-my-hobbies-and-interests': 3,
      'where-im-from-my-home-and-family': 2,
    },
  },
  {
    query: 'fitness training FITT principle',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for fitness unit.',
    expectedRelevance: {
      'the-fitt-frequency-intensity-time-and-type-principle': 3,
      'training-with-intensity': 2,
      'design-your-programme': 2,
    },
  },
  {
    query: 'invasion games tactics football',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for invasion games.',
    expectedRelevance: {
      'invasion-games-tactics-and-strategies-to-outwit-opponents-through-football': 3,
      'invasion-games-basic-tactics-to-overcome-opponents-through-futsal': 2,
    },
  },
  {
    query: 'badminton net wall games',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for net/wall games.',
    expectedRelevance: {
      'net-and-wall-games-technical-proficiency-and-problem-solving-through-badminton': 3,
      'net-and-wall-games-understand-effective-performance-in-badminton': 2,
    },
  },
  {
    query: 'capoeira hip hop dance',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for world dance styles.',
    expectedRelevance: {
      'capoeira-the-basic-movement-language': 3,
      'hip-hop-the-basic-movement-language': 3,
      'capoeira-improvised-duets': 2,
    },
  },
] as const;
