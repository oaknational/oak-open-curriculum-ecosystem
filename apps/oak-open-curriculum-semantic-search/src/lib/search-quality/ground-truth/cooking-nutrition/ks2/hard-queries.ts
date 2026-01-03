/**
 * KS2 Cooking & Nutrition hard ground truth queries.
 *
 * Tests challenging scenarios: misspellings, synonyms, and colloquial terms.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * KS2 Cooking & Nutrition hard queries (misspellings, synonyms, colloquial).
 */
export const COOKING_KS2_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'nutrision and helthy food',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspellings of "nutrition" and "healthy".',
    expectedRelevance: {
      'why-we-need-energy-and-nutrients': 3,
      'healthy-meals': 3,
    },
  },
  {
    query: 'making food yummy recipes',
    category: 'colloquial',
    priority: 'high',
    description: 'Colloquial: "yummy" → tasty/delicious, child-friendly language.',
    expectedRelevance: {
      'making-curry-in-a-hurry': 3,
      'making-bruschetta': 2,
      'making-an-international-salad': 2,
    },
  },
] as const;
