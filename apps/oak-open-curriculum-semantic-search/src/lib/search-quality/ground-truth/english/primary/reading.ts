/**
 * Primary (KS1/KS2) English ground truth queries for reading.
 *
 * Covers Year 1-6 reading: traditional tales, narrative texts, book clubs.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/english-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Reading ground truth queries for Primary English.
 */
export const READING_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'The BFG reading comprehension Roald Dahl Year 3',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of The BFG reading content using curriculum terminology',
    expectedRelevance: {
      'engaging-with-the-bfg': 3,
      'engaging-with-the-opening-chapter-of-the-bfg': 3,
      'writing-the-opening-of-the-bfg-part-one': 2,
    },
  },
  {
    query: 'traditional tales Year 1 billy goats gruff pigs',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of traditional tales content using curriculum terminology',
    expectedRelevance: {
      'introduction-to-traditional-tales': 3,
      'reading-and-responding-to-the-three-billy-goats-gruff': 3,
      'reading-and-responding-to-the-story-the-three-little-pigs': 2,
    },
  },
  {
    query: 'Three Billy Goats Gruff story characters sequencing',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Three Billy Goats Gruff content using curriculum terminology',
    expectedRelevance: {
      'reading-and-responding-to-the-three-billy-goats-gruff': 3,
      'describing-the-goats-in-the-three-billy-goats-gruff': 3,
      'sequencing-and-making-a-story-mountain-the-three-billy-goats-gruff': 2,
    },
  },
  {
    query: 'Iron Man reading Year 3 Ted Hughes themes',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of The Iron Man reading content using curriculum terminology',
    expectedRelevance: {
      'engaging-with-the-opening-chapter-of-the-iron-man': 3,
      'exploring-themes-in-the-iron-man': 3,
      'chapter-2-and-humanitys-response-to-the-iron-man': 2,
    },
  },
  {
    query: 'book club primary varjak paw discussion responses',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of book club discussion content using curriculum terminology',
    expectedRelevance: {
      'developing-an-understanding-of-varjak-paw-through-rich-discussions': 3,
      'developing-responses-to-varjak-paw-through-rich-discussions': 3,
      'developing-understanding-of-swallows-kiss-through-rich-discussions': 2,
    },
  },
] as const;
