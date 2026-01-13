/**
 * Natural-expression ground truth query for Primary Religious Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests question format */
export const RE_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'what do Sikhs believe',
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format for Sikh beliefs',
    expectedRelevance: {
      'guru-nanak': 3,
      'guru-nanaks-teachings-on-equality-and-acceptance': 2,
    },
  },
] as const;
