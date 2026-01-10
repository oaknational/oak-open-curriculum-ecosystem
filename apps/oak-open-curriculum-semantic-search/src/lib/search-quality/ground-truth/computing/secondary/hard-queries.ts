/**
 * SECONDARY Computing hard ground truth queries.
 *
 * Tests challenging scenarios: misspellings, synonyms, and colloquial terms.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/computing-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Computing hard queries (misspellings, synonyms, colloquial).
 */
export const COMPUTING_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'how the internat works fundamentals basics',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "internet".',
    expectedRelevance: {
      'the-internet': 3,
      'internet-fundamentals': 3,
      'an-introduction-to-computer-networks': 2,
    },
  },
  {
    query: 'coding for beginners programming basics introduction',
    category: 'natural-expression',
    priority: 'high',
    description: 'Synonym: "coding" → programming, "beginners" → introduction.',
    expectedRelevance: {
      'good-programming-practices': 3,
      'approaching-a-programming-project': 3,
      'problem-solving-using-programming-constructs': 2,
    },
  },
  {
    query: 'AI and machine learning artificial intelligence applications',
    category: 'precise-topic',
    priority: 'high',
    description: 'Abbreviation "AI" + full term "machine learning".',
    expectedRelevance: {
      'machine-learning-and-artificial-intelligence': 3,
      'introduction-to-ai': 3,
      'ai-and-machine-learning-applications': 2,
    },
  },
  {
    query: 'teach python to students ks3',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher-perspective phrasing for programming lessons.',
    expectedRelevance: {
      'data-structure-projects-in-python': 3,
      'iterating-through-data-structures': 2,
    },
  },
  {
    query: 'programming with data structures loops',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of programming and data structures concepts.',
    expectedRelevance: {
      'using-for-loops-to-iterate-data-structures': 3,
      'mathematical-operations-in-data-structures': 2,
    },
  },
  {
    query: 'unplugged activity without computers',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for resource-constrained computing lesson.',
    expectedRelevance: {
      'an-introduction-to-computer-networks': 3,
      'the-internet': 2,
    },
  },
] as const;
