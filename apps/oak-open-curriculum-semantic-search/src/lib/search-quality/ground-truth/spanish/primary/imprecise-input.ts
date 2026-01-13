/**
 * Imprecise-input ground truth query for Primary Spanish.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "spansh" misspelling */
export const SPANISH_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'spansh vocabulary primary',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of Spanish - tests fuzzy recovery',
    expectedRelevance: {
      'greetings-the-verb-estar': 3,
      'today-vs-in-general-somos-and-estamos': 2,
    },
  },
] as const;
