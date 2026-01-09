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
      'running-in-a-game': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests fundamental movement skill retrieval by year.',
  },
  {
    query: 'dodging games PE ks1',
    expectedRelevance: {
      dodging: 3,
      'dodging-in-simple-games': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests specific PE skill with key stage context.',
  },
  {
    query: 'dribbling ball skills',
    expectedRelevance: {
      'dribbling-with-hands': 3,
      'dribbling-and-sending-with-hands': 3,
      'dribbling-and-keeping-possession-using-our-hands': 3,
      'dribbling-to-score-a-point-using-our-hands': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests ball handling skill retrieval across progression.',
  },
  {
    query: 'passing and receiving',
    expectedRelevance: {
      'passing-and-receiving-skills': 3,
      'passing-and-creating-space': 3,
      'combine-passing-and-receiving': 3,
      'passing-receiving-and-creating-space-in-games': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests core ball skill terminology across lessons.',
  },
  {
    query: 'invasion games tactics',
    expectedRelevance: {
      'possession-scenarios': 3,
      'defensive-scenarios': 3,
      'passing-and-moving-to-create-attacking-opportunities': 2,
      'defending-as-a-team': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests PE tactical concept vocabulary.',
  },
  {
    query: 'dance Year 1',
    expectedRelevance: {
      actions: 3,
      space: 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests year-specific dance curriculum retrieval.',
  },
  {
    query: 'traditional dances maypole',
    expectedRelevance: {
      'maypole-dancing-england': 3,
      'clog-dancing-england': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests cultural dance topic matching.',
  },
  {
    query: 'swimming water safety',
    expectedRelevance: {
      'getting-ready-to-swim': 3,
      'entry-and-exits-regaining-feet-balance-and-movement': 3,
      'entry-and-exits-travel-buoyancy-and-balance': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests swimming and safety curriculum matching.',
  },
  {
    query: 'orienteering maps navigation outdoor',
    expectedRelevance: {
      'introduce-maps-working-together': 3,
      'using-a-map-to-follow-a-route': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests outdoor adventurous activity vocabulary.',
  },
  {
    query: 'team challenges leadership',
    expectedRelevance: {
      'effective-leaders': 3,
      'communicating-as-a-leader': 3,
      leadership: 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests leadership and teamwork skill retrieval.',
  },
  {
    query: 'agility balance coordination',
    expectedRelevance: {
      agility: 3,
      balance: 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests fundamental movement vocabulary.',
  },
  {
    query: 'effects of exercise heart',
    expectedRelevance: {
      'movement-and-exercise': 3,
      'effect-of-exercise-on-our-heartbeat': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests health and fitness concept retrieval.',
  },
  {
    query: 'tennis forehand racket shots',
    expectedRelevance: {
      'forehand-underarm-shots-using-rackets': 3,
      'develop-forehand-underarm-shots-using-rackets': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests sport-specific technique terminology.',
  },
  {
    query: 'basketball dribbling hand skills',
    expectedRelevance: {
      'dribbling-hand': 3,
      'passing-receiving-and-creating-space': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests sport-specific skill retrieval.',
  },
] as const;
