/**
 * Primary (KS1/KS2) English ground truth queries for writing.
 *
 * Covers Year 1-6 writing: narrative, non-fiction, grammar.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Writing ground truth queries for Primary English.
 */
export const WRITING_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'narrative writing Year 3',
    expectedRelevance: {
      'the-bfg-reading-and-narrative-writing': 3,
      'the-iron-man-narrative-writing': 3,
      'the-man-on-the-moon-narrative-writing': 2,
    },
  },
  {
    query: 'diary writing primary',
    expectedRelevance: {
      'the-journey-diary-writing': 3,
      'the-firework-makers-daughter-reading-and-diary-writing': 3,
      'into-the-forest-diary-writing': 2,
    },
  },
  {
    query: 'non-chronological report writing',
    expectedRelevance: {
      'the-stone-age-non-chronological-report': 3,
      'the-portia-spider-non-chronological-report': 3,
      'king-tut-or-healthy-lifestyle-non-chronological-report-629': 2,
    },
  },
  {
    query: 'simple compound sentences Year 3',
    expectedRelevance: {
      'simple-compound-and-adverbial-complex-sentences': 3,
    },
  },
  {
    query: 'persuasive letter writing',
    expectedRelevance: {
      'the-day-the-crayons-quit-reading-and-writing-persuasive-letters': 3,
      'front-desk-persuasive-letter-writing': 3,
      'school-uniform-persuasive-letter-writing': 2,
    },
  },
] as const;
