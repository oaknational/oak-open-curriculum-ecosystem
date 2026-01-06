/**
 * Primary Design & Technology ground truth queries for search quality evaluation.
 *
 * Covers KS1-KS2: structures, mechanisms, materials, CAD.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/design-technology-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary D&T.
 */
export const DT_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'sustainable housing CAD',
    expectedRelevance: {
      'sustainable-housing': 3,
      'the-tinkercad-user-interface': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'cam mechanisms automata',
    expectedRelevance: {
      'cam-mechanisms': 3,
      'cams-in-a-product': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'levers linkages Year 4',
    expectedRelevance: {
      'reverse-motion-levers-and-linkages': 3,
      'parallel-and-push-pull-linkages': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'card slider mechanisms',
    expectedRelevance: {
      'card-lever-mechanisms': 3,
      'card-slider-mechanisms': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'bridges structures',
    expectedRelevance: {
      bridges: 3,
      'creating-bridge-collages': 2,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Primary D&T.
 */
export const DT_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'DT making things move',
    expectedRelevance: {
      'cam-mechanisms': 2,
      'card-lever-mechanisms': 2,
    },
    category: 'colloquial',
    description: 'Uses DT abbreviation and informal phrasing',
  },
  {
    query: 'mecanisms ks1',
    expectedRelevance: {
      'card-lever-mechanisms': 2,
      'card-slider-mechanisms': 2,
    },
    category: 'misspelling',
    description: 'Misspelling of mechanisms',
  },
] as const;

/**
 * All Primary D&T ground truth queries.
 *
 * Total: 7 queries.
 */
export const DT_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...DT_PRIMARY_STANDARD_QUERIES,
  ...DT_PRIMARY_HARD_QUERIES,
] as const;
