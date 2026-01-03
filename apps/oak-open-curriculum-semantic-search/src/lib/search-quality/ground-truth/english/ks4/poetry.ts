/**
 * KS4 English ground truth queries for poetry.
 *
 * Covers GCSE poetry anthology: Power and Conflict, Love and Relationships.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools:
 * - `get-key-stages-subject-units` for unit structure
 * - `get-key-stages-subject-lessons` for lesson slugs
 * - `get-lessons-summary` for lesson details and keywords
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Poetry ground truth queries for KS4 English.
 *
 * Focus: Power and Conflict anthology, comparative poetry skills.
 */
export const POETRY_KS4_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Power and Conflict poetry Ozymandias',
    expectedRelevance: {
      'analysing-the-poem-ozymandias': 3,
      'comparing-the-presentation-of-power-in-my-last-duchess-and-ozymandias': 3,
      'comparing-romantic-poets-attitudes-to-nature': 2,
    },
  },
  {
    query: 'war poetry analysis Exposure',
    expectedRelevance: {
      'analysing-exposure': 3,
      'comparing-conflict-in-war-poems': 3,
      'comparing-power-and-conflict-war-poems': 2,
    },
  },
  {
    query: 'Bayonet Charge poem analysis',
    expectedRelevance: {
      'analysing-the-poem-bayonet-charge': 3,
      'comparing-conflict-in-war-poems': 2,
      'comparing-power-and-conflict-war-poems': 2,
    },
  },
  {
    query: 'comparing poetry Power and Conflict',
    expectedRelevance: {
      'comparing-conflict-in-war-poems': 3,
      'comparing-power-and-conflict-war-poems': 3,
      'comparing-poppies-and-war-photographer': 3,
      'comparing-the-presentation-of-power-in-my-last-duchess-and-ozymandias': 3,
      'developing-comparative-essay-writing-skills': 2,
    },
  },
  {
    query: 'Remains poem PTSD trauma',
    expectedRelevance: {
      'analysing-the-poem-remains': 3,
      'developing-interpretations-of-remains-with-simon-armitage': 3,
      'comparing-conflict-in-war-poems': 2,
    },
  },
  {
    query: 'poetry essay writing comparison',
    expectedRelevance: {
      'developing-comparative-essay-writing-skills': 3,
      'introductions-and-topic-sentences-for-poetry-comparison': 3,
      'comparing-conflict-in-war-poems': 2,
    },
  },
] as const;
