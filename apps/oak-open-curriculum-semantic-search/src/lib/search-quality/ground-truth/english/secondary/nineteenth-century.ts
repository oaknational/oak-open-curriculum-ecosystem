/**
 * Secondary English ground truth queries for nineteenth-century texts.
 *
 * Covers GCSE set texts: Jekyll and Hyde, A Christmas Carol.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Nineteenth-century text ground truth queries for Secondary English (KS4).
 *
 * Focus: Jekyll and Hyde, A Christmas Carol — themes, characters, context.
 */
export const NINETEENTH_CENTURY_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Jekyll and Hyde duality',
    expectedRelevance: {
      'chapter-10-henry-jekylls-full-statement-of-the-case': 3,
      'chapter-10-jekylls-confession': 3,
      'chapter-2-search-for-mr-hyde': 2,
    },
  },
  {
    query: 'Jekyll and Hyde Victorian society',
    expectedRelevance: {
      'chapter-1-the-story-of-the-door': 3,
      'chapter-1-mr-utterson': 3,
      'chapter-6-remarkable-incident-of-dr-lanyon': 2,
    },
  },
  {
    query: 'Jekyll and Hyde science and morality',
    expectedRelevance: {
      'chapter-10-henry-jekylls-full-statement-of-the-case': 3,
      'chapter-10-jekylls-confession': 3,
      'chapter-5-incident-of-the-letter': 2,
    },
  },
  {
    query: 'A Christmas Carol Scrooge redemption',
    expectedRelevance: {
      'scrooges-redemptive-journey': 3,
      'perfect-planning-for-an-essay-on-a-christmas-carol': 2,
      'improving-your-analytical-writing': 2,
    },
  },
  {
    query: 'A Christmas Carol Victorian values',
    expectedRelevance: {
      'scrooge-as-a-very-victorian-character': 3,
      'stave-1-scrooge-the-miser': 3,
      'planning-an-extended-argument': 2,
    },
  },
  {
    query: 'A Christmas Carol Marley ghost',
    expectedRelevance: {
      'stave-1-meeting-with-marleys-ghost': 3,
      'scrooges-redemptive-journey': 2,
    },
  },
] as const;
