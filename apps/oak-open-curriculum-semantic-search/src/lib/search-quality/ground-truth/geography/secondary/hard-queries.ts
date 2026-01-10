/**
 * Hard ground truth queries for SECONDARY Geography search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for SECONDARY Geography.
 */
export const HARD_QUERIES_SECONDARY_GEOGRAPHY: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach about volcanoes and earthquakes year 8',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request with year group.',
    expectedRelevance: {
      earthquakes: 3,
      'types-of-volcanoes': 3,
      'volcanic-hazards': 2,
    },
  },

  // MISSPELLING
  {
    query: 'tectonic plaits and earthqakes',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspellings.',
    expectedRelevance: {
      'the-movement-of-tectonic-plates': 3,
      earthquakes: 3,
      'plate-boundaries': 2,
    },
  },

  // SYNONYM
  {
    query: 'global warming effects',
    category: 'natural-expression',
    priority: 'high',
    description: 'Global warming = climate change.',
    expectedRelevance: {
      'causes-of-climate-change': 3,
      'impacts-of-climate-change-on-the-uk': 3,
      'actions-to-tackle-climate-change': 2,
    },
  },

  // MULTI-CONCEPT
  {
    query: 'river erosion and deposition landforms',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Cross-topic: processes + landforms.',
    expectedRelevance: {
      'river-processes': 3,
      'the-upper-course-of-a-river': 3,
      'the-middle-and-lower-course-of-a-river': 2,
    },
  },

  // PEDAGOGICAL-INTENT
  {
    query: 'fieldwork activity for case study',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for practical geography learning.',
    expectedRelevance: {
      'river-processes': 3,
      'the-upper-course-of-a-river': 2,
    },
  },
] as const;
