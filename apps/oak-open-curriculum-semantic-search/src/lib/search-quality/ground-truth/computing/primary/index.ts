/**
 * Primary Computing ground truth queries for search quality evaluation.
 *
 * Covers KS1-KS2: digital skills, programming, internet safety, networks.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/computing-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary Computing.
 */
export const COMPUTING_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'digital painting Year 1',
    expectedRelevance: {
      'painting-using-computers': 3,
      'using-lines-and-shapes-to-create-digital-pictures': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests year-specific computing term matching for creative skills.',
  },
  {
    query: 'computer networks and devices',
    expectedRelevance: {
      'digital-devices': 3,
      'designing-a-digital-device': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests curriculum term matching for hardware and networking.',
  },
  {
    query: 'information technology school',
    expectedRelevance: {
      'introduction-to-information-technology': 3,
      'information-technology-in-school': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests direct curriculum term matching for IT concepts in primary computing.',
  },
  {
    query: 'internet world wide web',
    expectedRelevance: {
      'connecting-networks': 3,
      'the-internet-and-world-wide-web': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests curriculum term matching for networking concepts.',
  },
  {
    query: 'internet addresses data packets',
    expectedRelevance: {
      'internet-addresses': 3,
      'data-packets': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests technical computing terminology retrieval.',
  },
] as const;

/**
 * Hard ground truth queries for Primary Computing.
 */
export const COMPUTING_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'how does the internat work',
    expectedRelevance: {
      'the-internet-and-world-wide-web': 3,
      'connecting-networks': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of internet',
  },
  {
    query: 'coding for kids ks2',
    expectedRelevance: {
      'programming-in-a-block-based-environment': 3,
      'programming-sequences': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Uses informal "coding" and "kids"',
  },
  {
    query: 'staying safe on computers',
    expectedRelevance: {
      'using-information-technology-safely': 3,
      'introduction-to-information-technology': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for e-safety curriculum',
  },
  {
    query: 'programming and code sequences',
    expectedRelevance: {
      'combining-code-blocks-in-a-sequence': 3,
      'programming-sprites': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of programming concepts with sequence logic.',
  },
  {
    query: 'unplugged activity without computers',
    expectedRelevance: {
      'working-together': 3,
      'sharing-information': 2,
    },
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for resource-constrained computing lesson.',
  },
] as const;

/**
 * All Primary Computing ground truth queries.
 *
 * Total: 7 queries.
 */
export const COMPUTING_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COMPUTING_PRIMARY_STANDARD_QUERIES,
  ...COMPUTING_PRIMARY_HARD_QUERIES,
] as const;
