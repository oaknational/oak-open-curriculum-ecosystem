/**
 * Precise-topic ground truth query for Secondary Citizenship.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-14 - Reviewed: updated expected slugs to better match query terms (UK democracy, elections, voting) */
export const CITIZENSHIP_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'democracy voting elections UK',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests direct term matching for UK democracy/elections/voting curriculum content',
    expectedRelevance: {
      'how-can-we-tell-if-the-uk-is-democratic': 3,
      'how-do-elections-in-the-uk-work': 3,
      'why-does-voting-matter': 2,
    },
  },
] as const;
