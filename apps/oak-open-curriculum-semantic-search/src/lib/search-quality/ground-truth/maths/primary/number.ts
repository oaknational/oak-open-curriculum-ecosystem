/**
 * Primary Maths ground truth queries for Number and Place Value.
 *
 * Covers KS1-KS2: counting, place value, addition, subtraction.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/maths-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Number and Place Value ground truth queries for Primary Maths.
 *
 * Topics: counting, place value, number bonds, addition, subtraction.
 */
export const NUMBER_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'counting to 10 Year 1',
    expectedRelevance: {
      'counting-forwards-and-backwards-within-10': 3,
      'counting-objects-within-ten': 3,
      'counting-different-groups': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'counting to 100',
    expectedRelevance: {
      'explore-the-counting-sequence-for-counting-to-100-and-beyond': 3,
      'counting-forwards-and-backwards-in-10s-to-100': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'place value tens ones',
    expectedRelevance: {
      'partition-two-digit-numbers-into-tens-and-ones-using-place-value-resources': 3,
      'partition-two-digit-numbers-into-tens-and-ones': 3,
      'explain-that-one-ten-is-equivalent-to-ten-ones': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'column addition regrouping',
    expectedRelevance: {
      'review-column-addition-and-identify-the-addends-and-sum': 3,
      'review-and-use-knowledge-of-place-value-to-correctly-lay-out-column-addition': 3,
      'add-up-to-3-four-digit-numbers-using-column-addition': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'number bonds to 10',
    expectedRelevance: {
      'represent-addition-and-subtraction-facts-within-10': 3,
      'recall-one-and-two-more-or-less-than-numbers-to-ten': 2,
      'add-three-addends-by-finding-pairs-that-total-10': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'bridging through 10',
    expectedRelevance: {
      'addition-by-bridging-through-10': 3,
      'subtracting-numbers-that-bridge-through-10': 3,
      'bridge-100-by-adding-or-subtracting-a-single-digit-number': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'rounding 4 digit numbers',
    expectedRelevance: {
      'explain-what-rounding-is-and-round-a-4-digit-number-to-the-nearest-thousand': 3,
      'compare-and-order-4-digit-numbers': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'part whole addition subtraction',
    expectedRelevance: {
      'explain-how-a-combination-of-different-parts-can-be-equivalent-to-the-same-whole': 3,
      'identify-the-missing-part-using-knowledge-of-relationships-and-structures': 3,
    },
    category: 'naturalistic',
  },
] as const;
