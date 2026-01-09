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
      'the-movement-of-tectonic-plates': 2,
      'plate-boundaries': 2,
      'the-effects-of-earthquakes': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of earthquakes content using curriculum terminology',
  },
  {
    query: 'volcanoes eruptions hazards',
    expectedRelevance: {
      'types-of-volcanoes': 3,
      'volcanic-hazards': 2,
      'the-eruption-of-mount-nyiragongo': 2,
      'living-close-to-volcanoes': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of volcanoes content using curriculum terminology',
  },
  {
    query: 'rivers flooding management',
    expectedRelevance: {
      'the-causes-of-flooding': 3,
      'the-effects-of-flooding': 2,
      'river-management': 2,
      'planning-river-management': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of flooding and river management content using curriculum terminology',
  },
  {
    query: 'climate change causes effects',
    expectedRelevance: {
      'causes-of-climate-change': 3,
      'impacts-of-climate-change-on-the-uk': 2,
      'actions-to-tackle-climate-change': 2,
      'past-climate-change': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of climate change content using curriculum terminology',
  },
  {
    query: 'weather systems UK',
    expectedRelevance: {
      'the-uks-climate': 3,
      depressions: 2,
      anticyclones: 2,
      'weather-and-climate': 1,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of UK weather systems content using curriculum terminology',
  },
] as const;
