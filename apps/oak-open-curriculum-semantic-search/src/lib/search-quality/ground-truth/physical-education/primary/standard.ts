/**
 * Primary Physical Education ground truth queries.
 *
 * Covers KS1-KS2: locomotion, ball skills, dance, games, swimming, OAA.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/physical-education-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary PE.
 *
 * Topics: locomotion, ball skills, dance, invasion games, swimming, OAA.
 */
export const PE_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'running and jumping Year 1',
    expectedRelevance: {
      running: 3,
      'running-in-a-game': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'dodging games',
    expectedRelevance: {
      dodging: 3,
      'dodging-in-simple-games': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'dribbling ball skills',
    expectedRelevance: {
      'dribbling-with-hands': 3,
      'dribbling-and-sending-with-hands': 3,
      'dribbling-and-keeping-possession-using-our-hands': 3,
      'dribbling-to-score-a-point-using-our-hands': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'passing and receiving',
    expectedRelevance: {
      'passing-and-receiving-skills': 3,
      'passing-and-creating-space': 3,
      'combine-passing-and-receiving': 3,
      'passing-receiving-and-creating-space-in-games': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'invasion games tactics',
    expectedRelevance: {
      'possession-scenarios': 3,
      'defensive-scenarios': 3,
      'passing-and-moving-to-create-attacking-opportunities': 2,
      'defending-as-a-team': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'dance Year 1',
    expectedRelevance: {
      actions: 3,
      space: 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'traditional dances maypole',
    expectedRelevance: {
      'maypole-dancing-england': 3,
      'clog-dancing-england': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'swimming water safety',
    expectedRelevance: {
      'getting-ready-to-swim': 3,
      'entry-and-exits-regaining-feet-balance-and-movement': 3,
      'entry-and-exits-travel-buoyancy-and-balance': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'orienteering maps',
    expectedRelevance: {
      'introduce-maps-working-together': 3,
      'using-a-map-to-follow-a-route': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'team challenges leadership',
    expectedRelevance: {
      'effective-leaders': 3,
      'communicating-as-a-leader': 3,
      leadership: 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'agility balance coordination',
    expectedRelevance: {
      agility: 3,
      balance: 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'effects of exercise heart',
    expectedRelevance: {
      'movement-and-exercise': 3,
      'effect-of-exercise-on-our-heartbeat': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'tennis forehand',
    expectedRelevance: {
      'forehand-underarm-shots-using-rackets': 3,
      'develop-forehand-underarm-shots-using-rackets': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'basketball dribbling',
    expectedRelevance: {
      'dribbling-hand': 3,
      'passing-receiving-and-creating-space': 2,
    },
    category: 'naturalistic',
  },
] as const;
