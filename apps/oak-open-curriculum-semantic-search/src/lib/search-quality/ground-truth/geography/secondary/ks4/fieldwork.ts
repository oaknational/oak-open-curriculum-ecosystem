/**
 * KS4 Geography ground truth queries for fieldwork and options.
 *
 * Covers Year 10-11 GCSE Geography fieldwork and option topics.
 *
 * **Methodology (2026-01-08)**:
 * All slugs verified against bulk-downloads/geography-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 Geography fieldwork queries.
 */
export const GEOGRAPHY_KS4_FIELDWORK_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'GCSE geography fieldwork planning investigation methods',
    expectedRelevance: {
      'formulating-an-enquiry-question': 3,
      'collecting-physical-geographical-data': 3,
      'fieldwork-planning-a-river-enquiry-and-collecting-data': 2,
    },
    category: 'precise-topic',
    description: 'Fieldwork methodology for GCSE',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'coastal management strategies sea defences GCSE',
    expectedRelevance: {
      'coastal-management': 3,
      'costs-and-benefits-of-coastal-management-strategies': 3,
      'example-of-a-coastal-management-scheme': 2,
    },
    category: 'precise-topic',
    description: 'Coastal landscapes option',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'urban regeneration case study planning development',
    expectedRelevance: {
      'an-example-of-an-urban-regeneration-project': 3,
      'opportunities-created-by-urban-change-people': 2,
      'challenges-created-by-urban-change-social-and-economic': 2,
    },
    category: 'precise-topic',
    description: 'Urban geography GCSE',
    keyStage: 'ks4',
    priority: 'medium',
  },
  {
    query: 'river processes erosion transportation deposition landforms',
    expectedRelevance: {
      'river-processes': 3,
      'river-processes-of-erosion-transportation-and-deposition': 3,
      'river-landforms-caused-by-erosion-and-deposition': 2,
    },
    category: 'precise-topic',
    description: 'Physical geography rivers',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'globalisation development global inequality causes consequences',
    expectedRelevance: {
      'globalisation-an-introduction': 3,
      'causes-of-global-inequalities': 3,
      'consequences-of-global-inequalities': 2,
    },
    category: 'precise-topic',
    description: 'Human geography development',
    keyStage: 'ks4',
    priority: 'medium',
  },
] as const;
