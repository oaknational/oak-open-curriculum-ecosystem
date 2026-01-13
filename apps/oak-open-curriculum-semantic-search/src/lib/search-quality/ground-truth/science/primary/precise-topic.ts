/**
 * Precise-topic ground truth query for Primary Science.
 *
 * Tests basic retrieval using curriculum-aligned terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Precise-topic query for Primary Science.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000), core Year 6 evolution topic (Darwin's finches),
 * expected slugs directly match lesson titles.
 */
export const SCIENCE_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'evolution Darwin finches Year 6',
    expectedRelevance: {
      'charles-darwin-and-finches': 3,
      'evolution-evidence': 3,
      'the-survival-of-the-fittest': 2,
      'how-living-things-have-changed-over-time': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Darwin evolution content using curriculum terminology',
  },
] as const;
