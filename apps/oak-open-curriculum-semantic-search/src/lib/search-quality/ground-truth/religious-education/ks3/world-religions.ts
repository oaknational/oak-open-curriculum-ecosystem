/**
 * KS3 Religious Education ground truth queries for world religions.
 *
 * Covers Buddhism, Christianity, Islam, Sikhism, Judaism.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * World religions ground truth queries for KS3 RE.
 */
export const WORLD_RELIGIONS_KS3_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Buddhism beliefs practices',
    expectedRelevance: {
      'siddhartha-gautama-as-a-historical-figure': 3,
      'the-buddha-through-the-eyes-of-devotees': 3,
      'dhamma-moral-precepts': 2,
      'dhamma-skilful-actions': 2,
    },
  },
  {
    query: 'Buddhist sangha monks',
    expectedRelevance: {
      'sangha-monks-and-nuns': 3,
      'sangha-diverse-lay-buddhist-community': 3,
    },
  },
  {
    query: 'ethics morality philosophy',
    expectedRelevance: {
      'the-nature-of-human-goodness': 3,
      'virtue-ethics': 3,
      'deontology-and-immanuel-kant': 2,
      'teleology-and-utilitarianism': 2,
    },
  },
  {
    query: 'utilitarianism ethics',
    expectedRelevance: {
      'teleology-and-utilitarianism': 3,
      'deontology-and-immanuel-kant': 2,
      'situation-ethics': 2,
    },
  },
] as const;
