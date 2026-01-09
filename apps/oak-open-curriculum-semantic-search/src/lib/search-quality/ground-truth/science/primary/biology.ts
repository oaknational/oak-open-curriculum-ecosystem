/**
 * Primary Science ground truth queries for Biology topics.
 *
 * Covers Year 3-6 Biology: living things, evolution, human body.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Biology ground truth queries for Primary Science.
 */
export const BIOLOGY_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'evolution Darwin finches Year 6',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Darwin evolution content using curriculum terminology',
    expectedRelevance: {
      'charles-darwin-and-finches': 3,
      'evolution-evidence': 3,
      'the-survival-of-the-fittest': 2,
      'how-living-things-have-changed-over-time': 2,
    },
  },
  {
    query: 'animal adaptations survival environment',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of animal adaptations content using curriculum terminology',
    expectedRelevance: {
      'animal-adaptations': 3,
      'the-survival-of-the-fittest': 2,
      'more-about-plant-adaptations': 2,
    },
  },
  {
    query: 'inherited characteristics offspring parents',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of inheritance content using curriculum terminology',
    expectedRelevance: {
      'inherited-characteristics': 3,
      'offspring-similar-but-not-identical': 2,
    },
  },
  {
    query: 'heart circulatory system',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of circulatory system content using curriculum terminology',
    expectedRelevance: {
      'function-of-the-heart': 3,
      'function-of-blood': 3,
      'function-of-blood-vessels': 2,
      'how-nutrients-and-water-are-transported-within-humans': 2,
    },
  },
  {
    query: 'fossils evidence evolution past',
    category: 'precise-topic',
    priority: 'medium',
    description:
      'Tests retrieval of fossils and evolution evidence content using curriculum terminology',
    expectedRelevance: {
      'what-fossils-can-tell-us-about-the-past': 3,
      'evolution-evidence': 3,
      'where-fossils-are-found-non-statutory': 2,
    },
  },
  {
    query: 'animals and food together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of animal classification with nutrition/diet.',
    expectedRelevance: {
      'what-animals-eat': 3,
      'animal-structure': 2,
    },
  },
] as const;
