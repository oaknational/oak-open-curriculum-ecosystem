/**
 * Primary Maths ground truth queries for Multiplication topics.
 *
 * Covers KS1-KS2: times tables, equal groups, multiplication strategies.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/maths-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Multiplication ground truth queries for Primary Maths.
 *
 * Topics: times tables (2, 3, 5, 6, 10), equal groups, multiplication strategies.
 */
export const MULTIPLICATION_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: '2 times table',
    expectedRelevance: {
      'represent-the-2-times-table-in-different-ways': 3,
      'use-knowledge-of-the-2-times-table-to-solve-problems': 3,
      'explain-the-relationship-between-adjacent-multiples-of-2': 3,
    },
    category: 'naturalistic',
  },
  {
    query: '5 times table',
    expectedRelevance: {
      'represent-counting-in-fives-as-the-5-times-table': 3,
      'represent-the-5-times-table-in-different-ways': 3,
      'explain-the-relationship-between-adjacent-multiples-of-5': 3,
    },
    category: 'naturalistic',
  },
  {
    query: '10 times table',
    expectedRelevance: {
      'represent-counting-in-tens-as-the-10-times-table': 3,
      'represent-the-10-times-table-in-different-ways': 3,
      'explain-the-relationship-between-adjacent-multiples-of-10': 3,
    },
    category: 'naturalistic',
  },
  {
    query: '3 times table',
    expectedRelevance: {
      'represent-counting-in-threes-as-the-3-times-table': 3,
      'explain-the-relationship-between-adjacent-multiples-of-three': 3,
    },
    category: 'naturalistic',
  },
  {
    query: '6 times table',
    expectedRelevance: {
      'represent-counting-in-sixes-as-the-6-times-table': 3,
      'explain-the-relationship-between-adjacent-multiples-of-six': 3,
      'solve-problems-involving-multiples-of-6': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'equal groups multiplication',
    expectedRelevance: {
      'represent-equal-groups-as-multiplication': 3,
      'represent-equal-groups-as-repeated-addition-and-multiplication': 3,
      'represent-equal-groups-as-repeated-addition': 3,
      'describe-how-objects-have-been-grouped': 2,
    },
    category: 'naturalistic',
  },
  {
    query: 'short multiplication method',
    expectedRelevance: {
      'multiply-a-2-digit-number-by-a-1-digit-number-using-short-multiplication-no-regroups': 3,
      'multiply-a-2-digit-number-by-a-1-digit-number-using-short-multiplication-regrouping-1s-to-10s': 3,
      'estimate-and-multiply-a-2-digit-by-a-1-digit-number-using-expanded-and-short-multiplication': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'expanded multiplication',
    expectedRelevance: {
      'multiply-a-2-digit-number-by-a-1-digit-number-using-expanded-multiplication-no-regroups': 3,
      'multiply-a-2-digit-number-by-a-1-digit-number-using-expanded-multiplication-regrouping-10s-to-100s': 3,
    },
    category: 'naturalistic',
  },
] as const;
