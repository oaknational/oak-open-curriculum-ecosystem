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
    query: 'footbal skills',
    expectedRelevance: {
      'dribbling-and-keeping-control': 2,
      'passing-and-receiving-skills': 2,
    },
    category: 'misspelling',
    description: 'Common misspelling of football',
  },
  {
    query: 'PE games ks1',
    expectedRelevance: {
      'running-in-a-game': 2,
      'dodging-in-simple-games': 2,
    },
    category: 'colloquial',
    description: 'Uses PE abbreviation and key stage reference',
  },
  {
    query: 'sporty movement warm up',
    expectedRelevance: {
      'movement-and-exercise': 2,
      agility: 2,
    },
    category: 'synonym',
    description: 'Uses informal "sporty" for physical activity',
  },
  {
    query: 'how to throw and catch',
    expectedRelevance: {
      'dribbling-and-sending-with-hands': 2,
      'passing-and-receiving-skills': 2,
    },
    category: 'colloquial',
    description: 'Question format for sending/receiving skills',
  },
] as const;
