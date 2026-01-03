/**
 * KS3 English ground truth queries for poetry.
 *
 * Covers Year 7-9 poetry: Gothic poetry, war poetry, place and home.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Poetry ground truth queries for KS3 English.
 */
export const POETRY_KS3_QUERIES: readonly GroundTruthQuery[] = [
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
] as const;
