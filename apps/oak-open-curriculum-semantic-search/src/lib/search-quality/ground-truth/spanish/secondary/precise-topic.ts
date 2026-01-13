/**
 * Precise-topic ground truth query for Secondary Spanish.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const SPANISH_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Spanish AR verbs present tense',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Spanish AR verbs content using curriculum terminology',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'a-school-play-ar-verbs-2nd-person-singular-information-questions': 2,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
      'homework-disaster-ar-infinitives-and-3rd-person-singular': 1,
    },
  },
] as const;
