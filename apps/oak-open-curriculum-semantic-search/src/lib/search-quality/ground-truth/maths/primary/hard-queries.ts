/**
 * Hard ground truth queries for Primary Maths.
 *
 * Challenging queries that test edge cases: misspellings, colloquial terms,
 * multi-concept queries, and intent-based searches.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/maths-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard queries for Primary Maths.
 *
 * Tests misspellings, synonyms, multi-concept queries.
 */
export const MATHS_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'times tables year 3',
    expectedRelevance: {
      'represent-counting-in-threes-as-the-3-times-table': 3,
      'represent-counting-in-sixes-as-the-6-times-table': 3,
      'represent-counting-in-fives-as-the-5-times-table': 2,
    },
    category: 'multi-concept',
    description: 'Year group + topic combination',
  },
  {
    query: 'adding up primary',
    expectedRelevance: {
      'addition-and-subtraction-facts-within-10': 3,
      'add-two-digit-numbers-without-crossing-the-tens-boundary': 2,
      'add-by-bridging-a-multiple-of-ten': 2,
    },
    category: 'colloquial',
    description: 'Colloquial term for addition',
  },
  {
    query: 'takeaway sums',
    expectedRelevance: {
      'subtracting-to-and-from-10': 3,
      'subtracting-numbers-that-bridge-through-10': 3,
      'subtracting-small-numbers': 2,
    },
    category: 'colloquial',
    description: 'Colloquial term for subtraction',
  },
  {
    query: 'halfs and quarters',
    expectedRelevance: {
      'recognise-and-name-the-fraction-one-half': 3,
      'recognise-and-name-the-fraction-one-quarter': 3,
      'find-one-half-of-a-number': 2,
    },
    category: 'misspelling',
    description: 'Common misspelling of halves',
  },
  {
    query: 'counting in tens hundreds',
    expectedRelevance: {
      'represent-counting-in-tens-as-the-10-times-table': 3,
      'count-across-and-on-from-100': 3,
      'represent-a-3-digit-number-up-to-199-in-different-ways': 2,
    },
    category: 'multi-concept',
    description: 'Multi-concept query about place value',
  },
  {
    query: 'sharing equally division',
    expectedRelevance: {
      'describe-how-objects-have-been-grouped': 3,
      'explain-that-objects-can-be-grouped-in-different-ways': 2,
    },
    category: 'synonym',
    description: 'Sharing as synonym for division',
  },
  {
    query: 'pattern blocks tangrams',
    expectedRelevance: {
      'compose-tangram-images': 3,
      'composing-pattern-block-images': 3,
      'tetrominoes-and-pentominoes': 2,
    },
    category: 'multi-concept',
    description: 'Specific manipulative resources',
  },
] as const;
