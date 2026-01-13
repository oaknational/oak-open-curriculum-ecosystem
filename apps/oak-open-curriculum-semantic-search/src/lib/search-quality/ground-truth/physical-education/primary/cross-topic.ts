/**
 * Cross-topic ground truth query for Primary Physical Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests navigation + teamwork intersection */
export const PE_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'maps and teamwork outdoor activities',
    expectedRelevance: {
      'orientating-a-map-to-locate-points': 3,
      'collaborate-effectively-to-complete-a-timed-course': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of navigation skills with teamwork in OAA',
  },
] as const;
