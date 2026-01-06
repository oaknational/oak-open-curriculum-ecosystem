/**
 * Primary Maths ground truth queries for Fractions topics.
 *
 * Covers KS1-KS2: unit fractions, comparing fractions, fraction operations.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/maths-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Fractions ground truth queries for Primary Maths.
 *
 * Topics: unit fractions, halves, quarters, thirds, comparing fractions.
 */
export const FRACTIONS_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'unit fractions',
    expectedRelevance: {
      'represent-unit-fractions-in-different-ways': 3,
      'compare-unit-fractions-by-looking-at-the-denominator': 3,
      'compare-and-order-unit-fractions-by-looking-at-the-denominator': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'one half fraction',
    expectedRelevance: {
      'recognise-and-name-the-fraction-one-half': 3,
      'find-one-half-of-a-number': 3,
      'recognise-the-equivalence-of-2-4-and-1-2': 3,
      'relate-finding-half-of-a-number-to-halving-and-doubling': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'one quarter fraction',
    expectedRelevance: {
      'recognise-and-name-the-fraction-one-quarter': 3,
      'find-one-third-or-one-quarter-of-a-number': 3,
      'find-three-quarters-of-an-object-shape-set-of-objects-or-quantity': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'one third fraction',
    expectedRelevance: {
      'recognise-and-name-the-fraction-one-third': 3,
      'find-one-third-or-one-quarter-of-a-number': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'equal parts whole',
    expectedRelevance: {
      'identify-how-many-equal-parts-a-whole-has-been-divided-into': 3,
      'equal-or-unequal-parts': 3,
      'identify-equal-parts-when-they-do-not-look-the-same': 3,
      'identify-the-number-of-equal-or-unequal-parts-in-a-whole': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'comparing fractions',
    expectedRelevance: {
      'compare-unit-fractions-by-looking-at-the-denominator': 3,
      'identify-when-unit-fractions-cannot-be-compared': 3,
      'solve-problems-involving-comparing-unit-fractions': 3,
      'solve-problems-involving-comparing-and-ordering-unit-fractions-in-a-range-of-contexts': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'fraction notation',
    expectedRelevance: {
      'read-write-and-understand-fraction-notation': 3,
      'use-fraction-notation-to-describe-an-equal-part-of-the-whole': 3,
    },
    category: 'naturalistic',
  },
] as const;
