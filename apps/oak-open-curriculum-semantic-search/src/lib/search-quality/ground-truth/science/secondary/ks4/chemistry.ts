/**
 * KS4 Chemistry ground truth queries for search quality evaluation.
 *
 * Covers Year 10-11 GCSE Chemistry: atomic structure, periodic table, reactions.
 *
 * **Methodology (2026-01-06)**:
 * All lesson slugs verified from bulk-downloads/science-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 Chemistry ground truth queries.
 *
 * Topics: atomic structure, periodic table, reactions, electrolysis.
 */
export const CHEMISTRY_KS4_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'atomic structure GCSE periodic table',
    expectedRelevance: {
      'using-the-periodic-table-atomic-and-mass-number': 3,
      'atomic-number-and-mass-number': 3,
      'atomic-structure-very-small-electron-mass': 3,
      'atomic-structure-negligible-electron-mass': 2,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'isotopes relative atomic mass',
    expectedRelevance: { isotopes: 3, 'isotopes-and-relative-atomic-mass': 3 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'electrolysis fuel cells',
    expectedRelevance: { 'fuel-cells': 3, 'electric-cells-and-batteries': 2 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'extraction metals reduction',
    expectedRelevance: {
      'extraction-of-metals-by-reduction': 3,
      'redox-reactions': 3,
      'developing-a-reactivity-series-for-metals': 2,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'fractional distillation crude oil',
    expectedRelevance: {
      'fractional-distillation-of-crude-oil': 3,
      'cracking-fractions-of-crude-oil': 3,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
] as const;
