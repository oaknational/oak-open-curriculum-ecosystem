/**
 * Hard queries for Primary Physical Education ground truth.
 *
 * Tests challenging scenarios: misspellings, colloquial terms, synonyms.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/physical-education-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for Primary PE.
 */
export const PE_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'footbal skills primary',
    expectedRelevance: {
      'dribbling-and-keeping-control': 3,
      'passing-and-receiving-skills': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of football',
  },
  {
    query: 'PE games ks1',
    expectedRelevance: {
      'running-in-a-game': 3,
      'dodging-in-simple-games': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Uses PE abbreviation and key stage reference',
  },
  {
    query: 'sporty movement warm up',
    expectedRelevance: {
      'movement-and-exercise': 3,
      agility: 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Uses informal "sporty" for physical activity',
  },
  {
    query: 'how to throw and catch',
    expectedRelevance: {
      'passing-and-receiving-skills': 3,
      'dribbling-and-sending-with-hands': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format for sending/receiving skills',
  },
  {
    query: 'maps and teamwork outdoor activities',
    expectedRelevance: {
      'orientating-a-map-to-locate-points': 3,
      'collaborate-effectively-to-complete-a-timed-course': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of navigation skills with teamwork in OAA.',
  },
] as const;
