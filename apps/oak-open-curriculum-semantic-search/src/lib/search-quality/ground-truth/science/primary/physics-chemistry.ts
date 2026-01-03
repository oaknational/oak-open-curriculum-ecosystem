/**
 * Primary Science ground truth queries for Physics and Chemistry topics.
 *
 * Covers Year 3-6: forces, materials, electricity.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Physics and Chemistry ground truth queries for Primary Science.
 */
export const PHYSICS_CHEMISTRY_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'simple machines levers pulleys',
    expectedRelevance: {
      'simple-machines': 3,
      'how-levers-can-help-us': 3,
      'how-pulleys-can-help-us': 3,
      'how-gears-can-help-us': 2,
    },
  },
  {
    query: 'gravity forces primary',
    expectedRelevance: {
      'introduction-to-gravity': 3,
      'pushes-and-pulls': 2,
      'air-resistance-plan': 2,
    },
  },
  {
    query: 'friction air resistance',
    expectedRelevance: {
      'friction-plan': 3,
      'friction-do-and-review': 3,
      'air-resistance-plan': 3,
      'air-resistance-do-and-review': 2,
    },
  },
  {
    query: 'reversible irreversible changes',
    expectedRelevance: {
      'reversible-changes-of-state': 3,
      'more-reversible-changes': 3,
      'burning-an-irreversible-change': 3,
      'more-irreversible-changes': 2,
    },
  },
  {
    query: 'separating materials filtering',
    expectedRelevance: {
      'recovering-insoluble-solids': 3,
      'separating-soluble-solids-from-solutions': 3,
      'soluble-and-insoluble': 2,
    },
  },
  {
    query: 'properties of materials',
    expectedRelevance: {
      'properties-of-materials': 3,
      'uses-of-everyday-materials': 3,
      'thermal-insulators-plan': 2,
    },
  },
] as const;
