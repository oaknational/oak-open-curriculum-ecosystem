/**
 * SECONDARY History ground truth queries for Modern history.
 *
 * Covers Year 9 topics: Industrial Revolution, World Wars, Holocaust.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Modern history ground truth queries for SECONDARY.
 */
export const MODERN_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Industrial Revolution Britain',
    expectedRelevance: {
      'the-industrial-revolution-and-change-in-britain': 3,
      'inventions-of-the-industrial-revolution': 2,
      'the-agricultural-revolution': 1,
      'the-industrial-revolution-and-urban-migration': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Industrial Revolution content using curriculum terminology',
  },
  {
    query: 'Holocaust Nazi persecution',
    expectedRelevance: {
      'nazi-persecution-of-jewish-people': 3,
      'the-holocaust-in-context': 2,
      'ghettos-and-the-final-solution': 2,
      'victims-and-perpetrators': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Holocaust content using curriculum terminology',
  },
  {
    query: 'Jewish life World War 2',
    expectedRelevance: {
      'jewish-life-in-europe-before-ww2': 3,
      'nazi-persecution-of-jewish-people': 2,
      'jewish-resistance-to-the-holocaust': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Jewish WW2 content using curriculum terminology',
  },
  {
    query: 'Peterloo Massacre reform',
    expectedRelevance: {
      'political-radicals-and-the-peterloo-massacre': 3,
      'calls-for-reform-and-the-1832-great-reform-act': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Peterloo Massacre content using curriculum terminology',
  },
  {
    query: 'revolution and slavery abolition',
    expectedRelevance: {
      'the-role-of-the-haitian-revolution-in-the-abolition-of-the-slave-trade': 3,
      'the-causes-of-the-haitian-revolution': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of revolutionary history with abolition movement.',
  },
] as const;
