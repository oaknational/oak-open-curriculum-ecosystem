/**
 * KS4 Geography ground truth queries for fieldwork and options.
 *
 * Covers Year 10-11 GCSE Geography fieldwork and option topics.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 Geography fieldwork queries.
 */
export const GEOGRAPHY_KS4_FIELDWORK_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'GCSE geography fieldwork investigation',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Fieldwork methodology for GCSE',
    keyStage: 'ks4',
  },
  {
    query: 'coastal management strategies GCSE',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Coastal landscapes option',
    keyStage: 'ks4',
  },
  {
    query: 'urban regeneration case study',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Urban geography GCSE',
    keyStage: 'ks4',
  },
  {
    query: 'river processes erosion deposition',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Physical geography rivers',
    keyStage: 'ks4',
  },
  {
    query: 'globalisation development gaps',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Human geography development',
    keyStage: 'ks4',
  },
] as const;
