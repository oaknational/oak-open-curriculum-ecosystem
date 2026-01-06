/**
 * KS4 Maths ground truth queries for tier variants.
 *
 * Covers Year 10-11 GCSE Maths: Foundation/Higher tier differentiation.
 *
 * **Methodology (2026-01-06)**:
 * Tests the search system's ability to distinguish Foundation vs Higher content.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 Maths tier variant queries.
 *
 * Tests Foundation vs Higher tier discrimination.
 */
export const MATHS_KS4_TIER_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'GCSE maths quadratic equations',
    expectedRelevance: {
      'solving-quadratic-equations-by-factorising': 3,
      'the-quadratic-formula': 3,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'completing the square higher',
    expectedRelevance: { 'completing-the-square': 3 },
    category: 'naturalistic',
    description: 'Higher tier algebraic manipulation',
    keyStage: 'ks4',
  },
  {
    query: 'simultaneous equations GCSE',
    expectedRelevance: {
      'solving-simultaneous-equations-algebraically': 3,
      'solving-simultaneous-equations-graphically': 3,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'trigonometry sin cos tan',
    expectedRelevance: { 'introducing-trigonometry': 3, 'exact-trigonometric-values': 3 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'circle theorems GCSE',
    expectedRelevance: { 'circle-theorems': 3 },
    category: 'naturalistic',
    description: 'Higher tier geometry',
    keyStage: 'ks4',
  },
] as const;
