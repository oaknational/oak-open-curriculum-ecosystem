/**
 * Cross-topic ground truth query for Primary Geography.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - Perfect MRR (1.000), tests mapping + environmental intersection.
 */
export const GEOGRAPHY_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'maps and forests together',
    expectedRelevance: {
      'mapping-trees-locally': 3,
      'mapping-changes-in-the-uks-forests': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of mapping skills with environmental topics',
  },
] as const;
