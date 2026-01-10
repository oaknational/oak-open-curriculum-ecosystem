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
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "beginners" + teacher intent.',
    expectedRelevance: {
      'i-cant-draw-building-confidence-through-drawing-techniques': 3,
      'mark-making-using-different-tools': 2,
    },
  },
  {
    query: 'feelings in pictures',
    category: 'natural-expression',
    priority: 'high',
    description: 'Colloquial: "feelings" → emotions, "pictures" → art.',
    expectedRelevance: {
      'expressing-emotion-through-art': 3,
      'art-as-self-discovery': 2,
    },
  },
  {
    query: 'what is art year 7',
    category: 'natural-expression',
    priority: 'high',
    description: 'Conceptual question about art definition + year group.',
    expectedRelevance: {
      'thats-not-art': 3,
      'this-is-art-the-power-of-collaborative-making': 2,
      'defining-design': 1,
    },
  },
  {
    query: 'portraits and colour expression',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of portrait techniques with colour/expression concepts.',
    expectedRelevance: {
      'exploring-power-in-the-portrait': 3,
      'tone-hue-and-colour': 2,
    },
  },
  {
    query: 'observational drawing for beginners',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for skill-level appropriate art lesson.',
    expectedRelevance: {
      'recording-from-observation-and-first-hand-sources': 3,
      'drawing-for-different-purposes-and-needs': 2,
    },
  },
] as const;
