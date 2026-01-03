/**
 * KS3 Computing hard ground truth queries.
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
 * KS3 Computing hard queries (misspellings, synonyms, colloquial).
 */
export const COMPUTING_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'how the internat works',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspelling of "internet".',
    expectedRelevance: {
      'the-internet': 3,
      'an-introduction-to-computer-networks': 2,
    },
  },
  {
    query: 'coding for beginners',
    category: 'synonym',
    priority: 'high',
    description: 'Synonym: "coding" → programming, "beginners" → introduction.',
    expectedRelevance: {
      'introduction-to-python-programming': 3,
      'using-fundamental-programming-constructs-in-a-block-based-language': 2,
    },
  },
  {
    query: 'AI and machine learning',
    category: 'naturalistic',
    priority: 'high',
    description: 'Abbreviation "AI" + full term "machine learning".',
    expectedRelevance: {
      'machine-learning-and-artificial-intelligence': 3,
      'machine-learning-using-the-micro-bit': 2,
    },
  },
] as const;
