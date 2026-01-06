/**
 * Primary Geography ground truth queries for search quality evaluation.
 *
 * Covers KS1-KS2: local area, UK, mapping, environment.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/geography-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary Geography.
 */
export const GEOGRAPHY_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'local area school',
    expectedRelevance: {
      'our-school': 3,
      'our-school-from-above': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'UK countries capitals',
    expectedRelevance: {
      'the-uk-and-its-surrounding-seas': 3,
      'the-countries-and-capital-cities-of-the-uk': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'land use human features',
    expectedRelevance: {
      'uk-human-and-physical-features': 3,
      'land-use-in-the-locality': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'trees forests environment',
    expectedRelevance: {
      'the-benefits-of-trees': 3,
      'mapping-trees-locally': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'regions counties UK',
    expectedRelevance: {
      'regions-and-counties-of-the-uk': 3,
      'images-of-the-uk': 2,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Primary Geography.
 */
export const GEOGRAPHY_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'where is our school ks1',
    expectedRelevance: {
      'our-school': 2,
      'our-school-from-above': 2,
    },
    category: 'colloquial',
    description: 'Question format with key stage reference',
  },
  {
    query: 'british ilands map',
    expectedRelevance: {
      'the-uk-and-its-surrounding-seas': 2,
    },
    category: 'misspelling',
    description: 'Misspelling of islands',
  },
] as const;

/**
 * All Primary Geography ground truth queries.
 *
 * Total: 7 queries.
 */
export const GEOGRAPHY_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...GEOGRAPHY_PRIMARY_STANDARD_QUERIES,
  ...GEOGRAPHY_PRIMARY_HARD_QUERIES,
] as const;
