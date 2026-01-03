/**
 * Primary (KS1/KS2) English ground truth queries for reading.
 *
 * Covers Year 1-6 reading: traditional tales, narrative texts, book clubs.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Reading ground truth queries for Primary English.
 */
export const READING_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'The BFG reading comprehension',
    expectedRelevance: {
      'engaging-with-the-bfg': 3,
      'engaging-with-the-opening-chapter-of-the-bfg': 3,
      'writing-the-opening-of-the-bfg-part-one': 2,
    },
  },
  {
    query: 'traditional tales Year 1',
    expectedRelevance: {
      'introduction-to-traditional-tales': 3,
      'reading-and-responding-to-the-three-billy-goats-gruff': 3,
      'the-three-little-pigs-reading-and-writing': 2,
    },
  },
  {
    query: 'Three Billy Goats Gruff story',
    expectedRelevance: {
      'reading-and-responding-to-the-three-billy-goats-gruff': 3,
      'describing-the-goats-in-the-three-billy-goats-gruff': 3,
      'describing-the-troll-in-the-three-billy-goats-gruff': 2,
      'sequencing-and-making-a-story-mountain-the-three-billy-goats-gruff': 2,
    },
  },
  {
    query: 'Iron Man reading Year 3',
    expectedRelevance: {
      'the-iron-man-reading': 3,
      'the-iron-man-narrative-writing': 2,
    },
  },
  {
    query: 'book club primary',
    expectedRelevance: {
      'varjak-paw-book-club': 3,
      'swallows-kiss-book-club': 3,
      'marcy-and-the-riddle-of-the-sphinx-book-club': 2,
    },
  },
] as const;
