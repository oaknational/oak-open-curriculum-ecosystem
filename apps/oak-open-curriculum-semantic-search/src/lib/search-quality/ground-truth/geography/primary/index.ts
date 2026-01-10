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
      'our-school-from-above': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests local geography curriculum term matching.',
  },
  {
    query: 'UK countries capitals',
    expectedRelevance: {
      'the-uk-and-its-surrounding-seas': 3,
      'the-countries-and-capital-cities-of-the-uk': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests UK geography locational knowledge retrieval.',
  },
  {
    query: 'land use human features',
    expectedRelevance: {
      'uk-human-and-physical-features': 3,
      'land-use-in-the-locality': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests human geography vocabulary.',
  },
  {
    query: 'trees forests environment',
    expectedRelevance: {
      'the-benefits-of-trees': 3,
      'mapping-trees-locally': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests environmental geography topic retrieval.',
  },
  {
    query: 'regions counties UK',
    expectedRelevance: {
      'regions-and-counties-of-the-uk': 3,
      'images-of-the-uk': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests administrative geography terminology.',
  },
] as const;

/**
 * Hard ground truth queries for Primary Geography.
 */
export const GEOGRAPHY_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'where is our school ks1',
    expectedRelevance: {
      'our-school': 3,
      'our-school-from-above': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format with key stage reference',
  },
  {
    query: 'british ilands map',
    expectedRelevance: {
      'the-uk-and-its-surrounding-seas': 3,
      'the-countries-and-capital-cities-of-the-uk': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of islands',
  },
  {
    query: 'learning about places near school',
    expectedRelevance: {
      'our-school': 3,
      'mapping-our-journey-to-school': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for local area geography.',
  },
  {
    query: 'maps and forests together',
    expectedRelevance: {
      'mapping-trees-locally': 3,
      'mapping-changes-in-the-uks-forests': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of mapping skills with environmental topics.',
  },
  {
    query: 'outdoor fieldwork activity autumn',
    expectedRelevance: {
      'fieldwork-autumn-in-the-school-grounds': 3,
      'mapping-trees-locally': 2,
    },
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for outdoor practical learning.',
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
