/**
 * Hard ground truth queries for Secondary Science search.
 *
 * Tests the search system with challenging scenarios.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for Secondary Science.
 */
export const HARD_QUERIES_SECONDARY_SCIENCE: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach my year 7 class about cells',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request with year group specification.',
    expectedRelevance: {
      'animal-cell-structures-and-their-functions': 3,
      'plant-cell-structures-and-their-functions': 3,
      'observing-cells-with-a-light-microscope': 2,
    },
  },

  // MISSPELLING
  {
    query: 'fotosynthesis plants energy',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common photosynthesis misspelling.',
    expectedRelevance: {
      photosynthesis: 3,
      'plant-nutrition': 3,
      'adaptations-of-plants-for-photosynthesis-absorbing-light': 2,
    },
  },
  {
    query: 'resperation in humans',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common respiration misspelling.',
    expectedRelevance: {
      'aerobic-cellular-respiration': 3,
      'anaerobic-cellular-respiration-in-humans': 3,
      'cellular-respiration': 2,
    },
  },

  // SYNONYM
  {
    query: 'living organism processes',
    category: 'natural-expression',
    priority: 'high',
    description: 'Living organism = life processes. Tests vocabulary bridging.',
    expectedRelevance: {
      'the-common-processes-of-all-living-organisms': 3,
      'cellular-respiration': 2,
    },
  },

  // MULTI-CONCEPT
  {
    query: 'predator and prey ecosystem relationships',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Cross-topic intersection: ecology + behaviour.',
    expectedRelevance: {
      'predator-prey-relationships': 3,
      'adaptations-of-predators-and-prey': 3,
      'food-webs': 2,
    },
  },

  // PEDAGOGICAL-INTENT
  {
    query: 'hands-on experiment for reluctant learners',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for engagement-focused practical science.',
    expectedRelevance: {
      'observing-cells-with-a-light-microscope': 3,
      'the-common-processes-of-all-living-organisms': 2,
    },
  },
] as const;
