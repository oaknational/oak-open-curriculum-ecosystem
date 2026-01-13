/**
 * Imprecise-input ground truth query for Primary English.
 *
 * Tests error recovery when teachers make typing mistakes.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Imprecise-input query for Primary English.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.167 reflects challenge of multiple misspellings
 * ("narative" for narrative, "storys" for stories). Tests fuzzy matching
 * for common primary teacher typing errors.
 */
export const ENGLISH_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'narative writing storys iron man Year 3',
    expectedRelevance: {
      'writing-the-opening-of-the-iron-man': 3,
      'writing-the-build-up-of-the-iron-man-part-one': 3,
      'planning-the-opening-of-the-iron-man': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common primary teacher misspellings - tests fuzzy recovery',
  },
] as const;
