/**
 * Primary (KS1/KS2) English ground truth queries for writing.
 *
 * Covers Year 1-6 writing: narrative, non-fiction, grammar.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/english-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Writing ground truth queries for Primary English.
 */
export const WRITING_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'narrative writing Year 3 iron man BFG stories',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Year 3 narrative writing content using curriculum terminology',
    expectedRelevance: {
      'writing-the-opening-of-the-bfg-part-one': 3,
      'writing-the-opening-of-the-iron-man': 3,
      'planning-the-opening-of-the-iron-man': 2,
    },
  },
  {
    query: 'diary writing primary into the forest firework maker',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of diary writing content using curriculum terminology',
    expectedRelevance: {
      'planning-a-paragraph-of-a-diary-entry-based-on-into-the-forest': 3,
      'planning-the-first-diary-entry-based-on-the-firework-makers-daughter': 3,
      'writing-the-first-diary-entry-based-on-the-firework-makers-daughter': 2,
    },
  },
  {
    query: 'non-chronological report writing stone age portia spider',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of non-chronological report writing content using curriculum terminology',
    expectedRelevance: {
      'linguistic-features-of-a-non-chronological-report-about-the-stone-age': 3,
      'linguistic-features-of-a-non-chronological-report-about-portia-spiders': 3,
      'planning-a-section-on-portia-spiders-appearance-for-a-non-chronological-report': 2,
    },
  },
  {
    query: 'simple compound adverbial sentences Year 3 grammar',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of sentence structure content using curriculum terminology',
    expectedRelevance: {
      'adverbial-complex-sentences': 3,
      'compound-and-adverbial-complex-sentences-revision': 3,
      'a-new-sentence-structure-the-relative-complex-sentence': 2,
    },
  },
  {
    query: 'persuasive letter writing school uniform crayons quit',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of persuasive writing content using curriculum terminology',
    expectedRelevance: {
      'editing-a-persuasive-letter-about-school-uniform': 3,
      'engaging-with-the-plot-of-the-day-the-crayons-quit': 3,
      'generating-points-to-use-in-a-persuasive-letter-about-school-uniform': 2,
    },
  },
] as const;
