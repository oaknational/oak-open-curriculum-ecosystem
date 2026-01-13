/**
 * Imprecise-input ground truth query for Secondary Physical Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "runing" misspelling */
export const PE_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'PE athletics runing and jumping',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "running" - tests fuzzy recovery',
    expectedRelevance: {
      'running-for-speed-and-the-relationship-between-distance-and-time': 3,
      'jumping-for-distance': 3,
      'jumping-for-height': 2,
    },
  },
] as const;
