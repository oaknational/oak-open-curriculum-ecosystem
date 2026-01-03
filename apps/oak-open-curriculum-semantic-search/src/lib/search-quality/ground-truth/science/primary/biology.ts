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
    query: 'evolution Darwin',
    expectedRelevance: {
      'charles-darwin-and-finches': 3,
      'evolution-evidence': 3,
      'the-survival-of-the-fittest': 2,
      'how-living-things-have-changed-over-time': 2,
    },
  },
  {
    query: 'animal adaptations',
    expectedRelevance: {
      'animal-adaptations': 3,
      'the-survival-of-the-fittest': 2,
      'more-about-plant-adaptations': 2,
    },
  },
  {
    query: 'inherited characteristics',
    expectedRelevance: {
      'inherited-characteristics': 3,
      'offspring-similar-but-not-identical': 3,
    },
  },
  {
    query: 'heart circulatory system',
    expectedRelevance: {
      'function-of-the-heart': 3,
      'function-of-blood': 3,
      'function-of-blood-vessels': 2,
      'how-nutrients-and-water-are-transported-within-humans': 2,
    },
  },
  {
    query: 'fossils evidence',
    expectedRelevance: {
      'what-fossils-can-tell-us-about-the-past': 3,
      'evolution-evidence': 3,
      'where-fossils-are-found-non-statutory': 2,
    },
  },
] as const;
