/**
 * Cross-topic ground truth query for Secondary History.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - Perfect MRR (1.000), tests revolution + abolition intersection.
 */
export const HISTORY_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'revolution and slavery abolition',
    expectedRelevance: {
      'the-role-of-the-haitian-revolution-in-the-abolition-of-the-slave-trade': 3,
      'the-causes-of-the-haitian-revolution': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of revolutionary history with abolition movement',
  },
] as const;
