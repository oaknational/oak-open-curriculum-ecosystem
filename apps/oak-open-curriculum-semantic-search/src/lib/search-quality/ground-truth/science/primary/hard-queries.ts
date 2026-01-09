/**
 * Hard ground truth queries for Primary Science search.
 *
 * Tests the search system with challenging scenarios.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for Primary Science.
 */
export const HARD_QUERIES_PRIMARY_SCIENCE: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach year 5 about forces',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request with year group specification.',
    expectedRelevance: {
      'simple-machines': 3,
      'introduction-to-gravity': 3,
      'pushes-and-pulls': 2,
    },
  },

  // MISSPELLING
  {
    query: 'evoloution and adaptashun',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common primary-level spelling errors.',
    expectedRelevance: {
      'evolution-evidence': 3,
      'animal-adaptations': 3,
      'charles-darwin-and-finches': 2,
    },
  },

  // SYNONYM
  {
    query: 'mixing and unmixing substances',
    category: 'natural-expression',
    priority: 'high',
    description: 'Mixing = dissolving/separating. Tests vocabulary bridging.',
    expectedRelevance: {
      'soluble-and-insoluble': 3,
      'separating-soluble-solids-from-solutions': 3,
      'recovering-insoluble-solids': 2,
    },
  },

  // COLLOQUIAL
  {
    query: 'that Darwin bird lesson',
    category: 'natural-expression',
    priority: 'medium',
    description: 'Informal reference to Darwin finches lesson.',
    expectedRelevance: {
      'charles-darwin-and-finches': 3,
      'evolution-evidence': 2,
    },
  },
] as const;
