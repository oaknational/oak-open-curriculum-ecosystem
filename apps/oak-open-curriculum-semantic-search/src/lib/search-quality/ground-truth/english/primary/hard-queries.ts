/**
 * Hard ground truth queries for Primary English search.
 *
 * Tests the search system with challenging scenarios for Year 1-6 content.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/english-primary.json.
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
    query: 'teach phonics and reading Year 1 traditional tales',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request for early reading instruction.',
    expectedRelevance: {
      'reading-and-responding-to-the-three-billy-goats-gruff': 3,
      'introduction-to-traditional-tales': 3,
      'imagining-you-are-the-characters-the-three-billy-goats-gruff': 2,
    },
  },

  // MISSPELLING
  {
    query: 'narative writing storys iron man Year 3',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common primary teacher misspellings.',
    expectedRelevance: {
      'writing-the-opening-of-the-iron-man': 3,
      'writing-the-build-up-of-the-iron-man-part-one': 3,
      'planning-the-opening-of-the-iron-man': 2,
    },
  },

  // SYNONYM
  {
    query: 'fairy tales traditional stories pigs billy goats gruff',
    category: 'natural-expression',
    priority: 'high',
    description: 'Fairy tales = traditional tales synonym.',
    expectedRelevance: {
      'introduction-to-traditional-tales': 3,
      'reading-and-responding-to-the-three-billy-goats-gruff': 3,
      'reading-and-responding-to-the-story-the-three-little-pigs': 2,
    },
  },

  // COLLOQUIAL
  {
    query: 'that Roald Dahl book with the giant BFG reading',
    category: 'natural-expression',
    priority: 'medium',
    description: 'Informal reference to The BFG.',
    expectedRelevance: {
      'engaging-with-the-bfg': 3,
      'engaging-with-the-opening-chapter-of-the-bfg': 3,
      'writing-the-opening-of-the-bfg-part-one': 2,
    },
  },

  // CROSS-TOPIC
  {
    query: 'writing and grammar tenses together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of writing skills with grammar concepts.',
    expectedRelevance: {
      'writing-sentences-in-the-simple-present-past-and-future-tense': 3,
      'writing-sentences-in-the-progressive-present-past-and-future-tense': 2,
    },
  },
] as const;
