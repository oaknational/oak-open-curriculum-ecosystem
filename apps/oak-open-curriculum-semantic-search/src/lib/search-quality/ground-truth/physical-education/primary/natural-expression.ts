/**
 * Natural-expression ground truth query for Primary Physical Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests question format */
export const PE_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'how to throw and catch',
    expectedRelevance: {
      'passing-and-receiving-skills': 3,
      'dribbling-and-sending-with-hands': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format for sending/receiving skills',
  },
] as const;
