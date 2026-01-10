/**
 * SECONDARY Citizenship hard ground truth queries.
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
 * SECONDARY Citizenship hard queries (misspellings, synonyms, colloquial).
 */
export const CITIZENSHIP_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'UK goverment parliament democracy',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "government".',
    expectedRelevance: {
      'how-is-the-uk-government-organised': 3,
      'what-is-the-difference-between-the-government-and-parliament': 3,
      'how-is-local-government-different-to-central-government': 2,
    },
  },
  {
    query: 'being fair to everyone rights',
    category: 'natural-expression',
    priority: 'high',
    description: 'Colloquial: "being fair" → equality, "rights" → legal protections.',
    expectedRelevance: {
      'what-does-fairness-mean-in-society': 3,
      'why-do-we-need-laws-on-equality-in-the-uk': 2,
      'what-can-we-do-to-create-a-fairer-society': 2,
    },
  },
  {
    query: 'how voting works in elections',
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal question about electoral processes.',
    expectedRelevance: {
      'what-is-democracy': 3,
      'is-direct-democracy-better-than-representative-democracy': 2,
    },
  },
  {
    query: 'democracy and laws together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of democratic systems with legal frameworks.',
    expectedRelevance: {
      'why-does-society-need-rules-and-laws': 3,
      'why-is-media-freedom-necessary-in-a-democracy': 2,
    },
  },
  {
    query: 'debate preparation resources',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for structured discussion activity.',
    expectedRelevance: {
      'is-direct-democracy-better-than-representative-democracy': 3,
      'does-the-uks-democracy-need-reform': 2,
    },
  },
] as const;
