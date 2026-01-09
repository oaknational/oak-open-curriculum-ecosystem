/**
 * Secondary Science ground truth queries for Chemistry topics.
 *
 * Covers KS3-4 Chemistry: atoms, elements, compounds, reactions.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Chemistry ground truth queries for Secondary Science.
 */
export const CHEMISTRY_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'atoms elements compounds',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of atoms and elements content using curriculum terminology',
    expectedRelevance: {
      'atoms-and-elements': 3,
      'compounds-and-their-formation': 3,
      'common-elements': 2,
      'naming-compounds': 2,
    },
  },
  {
    query: 'chemical formulae equations',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of chemical formulae content using curriculum terminology',
    expectedRelevance: {
      'chemical-formulae': 3,
      'a-particle-model-of-chemical-reactions': 3,
      'naming-compounds': 2,
    },
  },
  {
    query: 'metals periodic table',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of metals content using curriculum terminology',
    expectedRelevance: {
      'metallic-elements': 3,
      'properties-of-elements': 3,
      'common-elements': 2,
    },
  },
  {
    query: 'molecular elements diatomic molecules',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of molecular elements content using curriculum terminology',
    expectedRelevance: {
      'molecular-elements': 3,
      'atoms-and-elements': 2,
      'properties-of-elements': 2,
    },
  },
] as const;
