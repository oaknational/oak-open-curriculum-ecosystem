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
      'using-lines-and-shapes-to-create-digital-pictures': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'computer networks',
    expectedRelevance: {
      'digital-devices': 3,
      'designing-a-digital-device': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'information technology school',
    expectedRelevance: {
      'introduction-to-information-technology': 3,
      'information-technology-in-school': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'internet world wide web',
    expectedRelevance: {
      'connecting-networks': 3,
      'the-internet-and-world-wide-web': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'internet addresses data packets',
    expectedRelevance: {
      'internet-addresses': 3,
      'data-packets': 3,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Primary Computing.
 */
export const COMPUTING_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'how does the internat work',
    expectedRelevance: {
      'connecting-networks': 2,
      'the-internet-and-world-wide-web': 2,
    },
    category: 'misspelling',
    description: 'Misspelling of internet',
  },
  {
    query: 'coding for kids ks2',
    expectedRelevance: {
      'digital-devices': 2,
    },
    category: 'colloquial',
    description: 'Uses informal "coding" and "kids"',
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
