/**
 * KS4 Maths ground truth queries for tier variants.
 *
 * Covers Year 10-11 GCSE Maths: Foundation/Higher tier differentiation.
 *
 * **Methodology (2026-01-08)**:
 * All slugs verified against bulk-downloads/maths-secondary.json.
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
    query: 'GCSE maths quadratic equations factorising solving',
    expectedRelevance: {
      'solving-quadratic-equations-by-factorising': 3,
      'solving-quadratic-equations-by-using-the-formula': 3,
      'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 2,
    },
    category: 'precise-topic',
    description:
      'Tests retrieval of GCSE quadratic factorising content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'completing the square quadratic equations higher GCSE',
    expectedRelevance: {
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 3,
      'key-features-of-a-quadratic-graph': 2,
    },
    category: 'precise-topic',
    description: 'Higher tier algebraic manipulation',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'simultaneous equations solving GCSE elimination substitution',
    expectedRelevance: {
      'solving-algebraic-simultaneous-equations-by-elimination': 3,
      'solving-simultaneous-linear-equations-by-substitution': 3,
      'solving-simultaneous-equations-via-any-method': 2,
    },
    category: 'precise-topic',
    description:
      'Tests retrieval of GCSE simultaneous equations content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'trigonometry sin cos tan right angled triangles GCSE',
    expectedRelevance: {
      'problem-solving-with-right-angled-trigonometry': 3,
      'calculate-trigonometric-ratios-for-0-45-and-90': 3,
      'applying-trigonometric-ratios-in-context': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of GCSE trigonometry content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'circle theorems geometry GCSE higher problem solving',
    expectedRelevance: {
      'identifying-which-circle-theorem-to-use': 3,
      'problem-solving-with-circle-theorems': 3,
      'the-angle-at-the-centre-of-the-circle-is-twice-the-angle-at-any-point-on-the-circumference': 2,
    },
    category: 'precise-topic',
    description: 'Higher tier geometry',
    keyStage: 'ks4',
    priority: 'medium',
  },
] as const;
