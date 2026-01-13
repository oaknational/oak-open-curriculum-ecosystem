/**
 * Precise-topic ground truth query for Secondary Citizenship.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const CITIZENSHIP_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'democracy voting elections UK',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for democracy units',
    expectedRelevance: {
      'why-is-registering-to-vote-so-important': 3,
      'how-do-local-elections-work': 3,
      'what-is-a-democratic-community': 2,
    },
  },
] as const;
