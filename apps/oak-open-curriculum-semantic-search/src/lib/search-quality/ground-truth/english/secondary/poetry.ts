/**
 * Secondary English ground truth queries for poetry.
 *
 * Covers KS3-4 poetry: Gothic poetry (SECONDARY), Power and Conflict anthology (KS4).
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Poetry ground truth queries for Secondary English (KS3-4).
 *
 * Merged from SECONDARY (Gothic poetry) and KS4 (Power and Conflict anthology).
 */
export const POETRY_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  // SECONDARY Gothic poetry
  {
    query: 'Gothic poetry The Raven',
    expectedRelevance: {
      'analysing-the-raven': 3,
      'understanding-the-raven': 3,
      'comparing-the-raven-and-the-haunted-palace': 2,
    },
  },
  {
    query: 'Gothic poetry analysis',
    expectedRelevance: {
      'analysing-the-raven': 3,
      'analysing-the-haunted-palace': 3,
      'comparing-the-raven-and-the-haunted-palace': 2,
    },
  },
  {
    query: 'poetry performance speaking',
    expectedRelevance: {
      'performing-your-chosen-gothic-poem': 3,
    },
  },
  // KS4 Power and Conflict anthology
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
