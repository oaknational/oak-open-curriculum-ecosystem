/**
 * SECONDARY Art hard ground truth queries.
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
 * SECONDARY Art hard queries (misspellings, synonyms, colloquial).
 */
export const ART_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'teach drawing skills beginers',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspelling of "beginners" + teacher intent.',
    expectedRelevance: {
      'i-cant-draw-building-confidence-through-drawing-techniques': 3,
      'mark-making-using-different-tools': 2,
    },
  },
  {
    query: 'feelings in pictures',
    category: 'synonym',
    priority: 'high',
    description: 'Colloquial: "feelings" → emotions, "pictures" → art.',
    expectedRelevance: {
      'expressing-emotion-through-art': 3,
      'art-as-self-discovery': 2,
    },
  },
  {
    query: 'what is art year 7',
    category: 'naturalistic',
    priority: 'high',
    description: 'Conceptual question about art definition + year group.',
    expectedRelevance: {
      'thats-not-art': 3,
      'this-is-art-the-power-of-collaborative-making': 2,
      'defining-design': 1,
    },
  },
] as const;
