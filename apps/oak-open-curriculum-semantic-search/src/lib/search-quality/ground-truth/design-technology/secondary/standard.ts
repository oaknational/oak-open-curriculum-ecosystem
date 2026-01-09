/**
 * SECONDARY Design & Technology standard ground truth queries.
 *
 * Covers materials, manufacturing, ergonomics, and sustainable design.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Design & Technology standard queries.
 */
export const DT_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'materials properties DT',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for materials unit.',
    expectedRelevance: {
      'physical-properties-of-materials': 3,
      'working-properties-of-materials': 3,
      'timbers-properties-sources-and-stock-forms': 2,
    },
  },
  {
    query: 'ergonomics design human factors',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for ergonomics unit.',
    expectedRelevance: {
      ergonomics: 3,
      anthropometrics: 3,
      'ergonomic-testing-and-design-development': 2,
    },
  },
  {
    query: 'sustainable design circular economy',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for sustainability unit.',
    expectedRelevance: {
      'linear-versus-circular-economy': 3,
      'redesign-and-rethink': 3,
      'life-cycle-assessment': 2,
    },
  },
  {
    query: 'batch production manufacturing',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for manufacturing.',
    expectedRelevance: {
      'batch-production': 3,
      'scales-of-production': 3,
      'collaborative-design-for-batch-production': 2,
    },
  },
  {
    query: 'wearable technology micro:bit',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for wearables unit.',
    expectedRelevance: {
      'integrate-a-micro-bit-into-a-wearable-product': 3,
      'manufacture-a-wearable-product': 3,
      'micro-bits-in-tinkercad': 2,
    },
  },
  {
    query: 'technical drawing orthographic',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for communication unit.',
    expectedRelevance: {
      'draw-orthographic-projections': 3,
      'interpret-orthographic-projections': 3,
      'one-point-perspective': 2,
    },
  },
] as const;
