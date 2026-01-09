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
    query: '2 times table Year 2',
    expectedRelevance: {
      'represent-the-2-times-table-in-different-ways': 3,
      'use-knowledge-of-the-2-times-table-to-solve-problems': 2,
      'explain-the-relationship-between-adjacent-multiples-of-2': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Year 2 2 times table content using curriculum terminology',
  },
  {
    query: '5 times table Year 2',
    expectedRelevance: {
      'represent-counting-in-fives-as-the-5-times-table': 3,
      'represent-the-5-times-table-in-different-ways': 2,
      'explain-the-relationship-between-adjacent-multiples-of-5': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Year 2 5 times table content using curriculum terminology',
  },
  {
    query: '10 times table Year 2',
    expectedRelevance: {
      'represent-counting-in-tens-as-the-10-times-table': 3,
      'represent-the-10-times-table-in-different-ways': 2,
      'explain-the-relationship-between-adjacent-multiples-of-10': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Year 2 10 times table content using curriculum terminology',
  },
  {
    query: '3 times table Year 3',
    expectedRelevance: {
      'represent-counting-in-threes-as-the-3-times-table': 3,
      'explain-the-relationship-between-adjacent-multiples-of-three': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Year 3 3 times table content using curriculum terminology',
  },
  {
    query: '6 times table Year 3',
    expectedRelevance: {
      'represent-counting-in-sixes-as-the-6-times-table': 3,
      'explain-the-relationship-between-adjacent-multiples-of-six': 2,
      'solve-problems-involving-multiples-of-6': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Year 3 6 times table content using curriculum terminology',
  },
  {
    query: 'equal groups multiplication Year 2',
    expectedRelevance: {
      'represent-equal-groups-as-multiplication': 3,
      'represent-equal-groups-as-repeated-addition-and-multiplication': 2,
      'represent-equal-groups-as-repeated-addition': 2,
      'describe-how-objects-have-been-grouped': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Year 2 equal groups content for multiplication foundations',
  },
  {
    query: 'short multiplication method Year 4',
    expectedRelevance: {
      'multiply-a-2-digit-number-by-a-1-digit-number-using-short-multiplication-no-regroups': 3,
      'multiply-a-2-digit-number-by-a-1-digit-number-using-short-multiplication-regrouping-1s-to-10s': 2,
      'estimate-and-multiply-a-2-digit-by-a-1-digit-number-using-expanded-and-short-multiplication': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description:
      'Tests retrieval of Year 4 short multiplication method using curriculum terminology',
  },
  {
    query: 'expanded multiplication method Year 4',
    expectedRelevance: {
      'multiply-a-2-digit-number-by-a-1-digit-number-using-expanded-multiplication-no-regroups': 3,
      'multiply-a-2-digit-number-by-a-1-digit-number-using-expanded-multiplication-regrouping-10s-to-100s': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description:
      'Tests retrieval of Year 4 expanded multiplication method using curriculum terminology',
  },
] as const;
