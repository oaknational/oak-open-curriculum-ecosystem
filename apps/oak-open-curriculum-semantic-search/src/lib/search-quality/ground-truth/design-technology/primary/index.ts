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
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests CAD and sustainability topic intersection.',
  },
  {
    query: 'cam mechanisms automata',
    expectedRelevance: {
      'cam-mechanisms': 3,
      'cams-in-a-product': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests DT mechanism vocabulary retrieval.',
  },
  {
    query: 'levers linkages Year 4',
    expectedRelevance: {
      'reverse-motion-levers-and-linkages': 3,
      'parallel-and-push-pull-linkages': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests year-specific mechanism concepts.',
  },
  {
    query: 'card slider mechanisms',
    expectedRelevance: {
      'card-lever-mechanisms': 3,
      'card-slider-mechanisms': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests paper engineering terminology.',
  },
  {
    query: 'bridges structures building',
    expectedRelevance: {
      bridges: 3,
      'creating-bridge-collages': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests structures topic matching.',
  },
] as const;

/**
 * Hard ground truth queries for Primary D&T.
 */
export const DT_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'DT making things move',
    expectedRelevance: {
      'cam-mechanisms': 3,
      'card-lever-mechanisms': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Uses DT abbreviation and informal phrasing',
  },
  {
    query: 'mecanisms ks1 moving',
    expectedRelevance: {
      'card-lever-mechanisms': 3,
      'card-slider-mechanisms': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of mechanisms with context',
  },
  {
    query: 'building with different materials',
    expectedRelevance: {
      'joining-materials-in-moving-cards': 3,
      'feedback-and-evaluation-about-materials-and-systems': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for materials and construction.',
  },
  {
    query: 'structures and materials testing',
    expectedRelevance: {
      'testing-bridge-structures': 3,
      'feedback-and-evaluation-about-materials-and-systems': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of structures with materials evaluation.',
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
