/**
 * Imprecise-input ground truth query for Secondary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** Human Review: 2026-01-17 - Updated with polymer-specific lessons (not general materials) */
export const DT_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'platics and polymers materials',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of "plastics" - tests fuzzy recovery for polymer content',
    expectedRelevance: {
      'polymers-properties-sources-and-stock-forms': 3,
      'polymer-properties-and-processes': 3,
      'materials-and-manufacturing-processes-polymers-and-timbers': 2,
    },
  },
] as const;
