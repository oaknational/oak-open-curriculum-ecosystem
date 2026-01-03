/**
 * Hard ground truth queries for Primary English search.
 *
 * Tests the search system with challenging scenarios for Year 1-6 content.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for Primary English.
 */
export const HARD_QUERIES_PRIMARY_ENGLISH: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach phonics and reading Year 1',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher request for early reading instruction.',
    expectedRelevance: {
      'reading-and-responding-to-the-three-billy-goats-gruff': 3,
      'introduction-to-traditional-tales': 2,
    },
  },

  // MISSPELLING
  {
    query: 'narative writing storys',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common primary teacher misspellings.',
    expectedRelevance: {
      'the-iron-man-narrative-writing': 3,
      'the-bfg-reading-and-narrative-writing': 3,
      'the-man-on-the-moon-narrative-writing': 2,
    },
  },

  // SYNONYM
  {
    query: 'fairy tales traditional stories',
    category: 'synonym',
    priority: 'high',
    description: 'Fairy tales = traditional tales synonym.',
    expectedRelevance: {
      'introduction-to-traditional-tales': 3,
      'reading-and-responding-to-the-three-billy-goats-gruff': 3,
      'the-three-little-pigs-reading-and-writing': 2,
    },
  },

  // COLLOQUIAL
  {
    query: 'that Roald Dahl book with the giant',
    category: 'colloquial',
    priority: 'medium',
    description: 'Informal reference to The BFG.',
    expectedRelevance: {
      'engaging-with-the-bfg': 3,
      'engaging-with-the-opening-chapter-of-the-bfg': 3,
      'writing-the-opening-of-the-bfg-part-one': 2,
    },
  },
] as const;
