/**
 * PRIMARY Cooking & Nutrition hard ground truth queries.
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
 * PRIMARY Cooking & Nutrition hard queries (misspellings, synonyms, colloquial).
 */
export const COOKING_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'nutrision and helthy food',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspellings of "nutrition" and "healthy".',
    expectedRelevance: {
      'why-we-need-energy-and-nutrients': 3,
      'healthy-meals': 2,
    },
  },
  {
    query: 'making food yummy recipes',
    category: 'natural-expression',
    priority: 'high',
    description: 'Colloquial: "yummy" → tasty/delicious, child-friendly language.',
    expectedRelevance: {
      'making-curry-in-a-hurry': 3,
      'making-bruschetta': 2,
      'making-an-international-salad': 2,
    },
  },
  {
    query: 'learning to cook healthy lunches',
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for practical cooking skills.',
    expectedRelevance: {
      'making-a-healthy-wrap-for-lunch': 3,
      'healthy-meals': 2,
    },
  },
  {
    query: 'energy nutrients and healthy eating',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of nutritional science and practical cooking.',
    expectedRelevance: {
      'sources-of-energy-and-nutrients': 3,
      'why-we-need-energy-and-nutrients': 2,
    },
  },
] as const;
