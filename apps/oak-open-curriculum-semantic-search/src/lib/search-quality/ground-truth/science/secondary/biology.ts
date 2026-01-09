/**
 * Secondary Science ground truth queries for Biology topics.
 *
 * Covers KS3-4 Biology: cells, ecosystems, respiration, photosynthesis.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Biology ground truth queries for Secondary Science.
 */
export const BIOLOGY_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'cell structure and function',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of cell structure content using curriculum terminology',
    expectedRelevance: {
      'animal-cell-structures-and-their-functions': 3,
      'plant-cell-structures-and-their-functions': 3,
      'specialised-cells-are-adapted-for-their-functions': 2,
      'multicellular-and-unicellular-organisms': 2,
    },
  },
  {
    query: 'photosynthesis plants light energy',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of photosynthesis content using curriculum terminology',
    expectedRelevance: {
      photosynthesis: 3,
      'plant-nutrition': 3,
      'adaptations-of-plants-for-photosynthesis-absorbing-light': 2,
      'adaptations-of-plants-for-photosynthesis-gas-exchange-and-stomata': 2,
    },
  },
  {
    query: 'food chains and food webs',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of food chains and webs content using curriculum terminology',
    expectedRelevance: {
      'food-chains': 3,
      'food-webs': 3,
      'ecosystems-and-habitats': 2,
      'predator-prey-relationships': 2,
    },
  },
  {
    query: 'ecosystems biodiversity habitats environment',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of ecosystems content using curriculum terminology',
    expectedRelevance: {
      'ecosystems-and-habitats': 3,
      'the-importance-of-biodiversity': 3,
      'predator-prey-relationships': 2,
    },
  },
  {
    query: 'respiration aerobic anaerobic',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of respiration content using curriculum terminology',
    expectedRelevance: {
      'aerobic-cellular-respiration': 3,
      'anaerobic-cellular-respiration-in-humans': 3,
      'anaerobic-cellular-respiration-and-fermentation-in-microorganisms': 3,
      'cellular-respiration': 2,
    },
  },
  {
    query: 'gas exchange lungs breathing',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of gas exchange content using curriculum terminology',
    expectedRelevance: {
      'adaptations-of-the-human-lungs-for-gas-exchange': 3,
      'the-human-gas-exchange-system-and-breathing': 3,
      'breathing-respiration-and-gas-exchange': 2,
    },
  },
  {
    query: 'using microscope cells',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of microscope practical content using curriculum terminology',
    expectedRelevance: {
      'observing-cells-with-a-light-microscope': 3,
      'preparing-and-observing-a-microscope-slide': 2,
    },
  },
] as const;
