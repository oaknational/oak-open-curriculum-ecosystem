/**
 * KS3 History ground truth queries for Modern history.
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
 * Modern history ground truth queries for KS3.
 */
export const MODERN_KS3_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Industrial Revolution Britain',
    expectedRelevance: {
      'the-industrial-revolution-and-change-in-britain': 3,
      'inventions-of-the-industrial-revolution': 3,
      'the-agricultural-revolution': 2,
      'the-industrial-revolution-and-urban-migration': 2,
    },
  },
  {
    query: 'Holocaust Nazi persecution',
    expectedRelevance: {
      'nazi-persecution-of-jewish-people': 3,
      'the-holocaust-in-context': 3,
      'ghettos-and-the-final-solution': 3,
      'victims-and-perpetrators': 2,
    },
  },
  {
    query: 'Jewish life World War 2',
    expectedRelevance: {
      'jewish-life-in-europe-before-ww2': 3,
      'nazi-persecution-of-jewish-people': 3,
      'jewish-resistance-to-the-holocaust': 2,
    },
  },
  {
    query: 'Peterloo Massacre reform',
    expectedRelevance: {
      'political-radicals-and-the-peterloo-massacre': 3,
      'calls-for-reform-and-the-1832-great-reform-act': 3,
    },
  },
] as const;
