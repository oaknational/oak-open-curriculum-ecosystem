/**
 * SECONDARY Geography ground truth queries for Physical geography.
 *
 * Covers tectonics, rivers, weather, climate.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Physical geography ground truth queries for SECONDARY.
 */
export const PHYSICAL_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'earthquakes tectonic plates',
    expectedRelevance: {
      earthquakes: 3,
      'the-movement-of-tectonic-plates': 3,
      'plate-boundaries': 3,
      'the-effects-of-earthquakes': 2,
    },
  },
  {
    query: 'volcanoes eruptions',
    expectedRelevance: {
      'types-of-volcanoes': 3,
      'volcanic-hazards': 3,
      'the-eruption-of-mount-nyiragongo': 3,
      'living-close-to-volcanoes': 2,
    },
  },
  {
    query: 'rivers flooding',
    expectedRelevance: {
      'the-causes-of-flooding': 3,
      'the-effects-of-flooding': 3,
      'river-management': 3,
      'planning-river-management': 2,
    },
  },
  {
    query: 'climate change causes effects',
    expectedRelevance: {
      'causes-of-climate-change': 3,
      'impacts-of-climate-change-on-the-uk': 3,
      'actions-to-tackle-climate-change': 2,
      'past-climate-change': 2,
    },
  },
  {
    query: 'weather systems UK',
    expectedRelevance: {
      'the-uks-climate': 3,
      depressions: 3,
      anticyclones: 3,
      'weather-and-climate': 2,
    },
  },
] as const;
