/**
 * SECONDARY Religious Education ground truth queries for world religions.
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
 * World religions ground truth queries for SECONDARY RE.
 */
export const WORLD_RELIGIONS_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Buddhism beliefs practices',
    expectedRelevance: {
      'siddhartha-gautama-as-a-historical-figure': 3,
      'the-buddha-through-the-eyes-of-devotees': 2,
      'dhamma-moral-precepts': 2,
      'dhamma-skilful-actions': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Buddhism content using curriculum terminology',
  },
  {
    query: 'Buddhist sangha monks',
    expectedRelevance: {
      'sangha-monks-and-nuns': 3,
      'sangha-diverse-lay-buddhist-community': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Buddhist sangha content using curriculum terminology',
  },
  {
    query: 'ethics morality philosophy',
    expectedRelevance: {
      'the-nature-of-human-goodness': 3,
      'virtue-ethics': 2,
      'deontology-and-immanuel-kant': 2,
      'teleology-and-utilitarianism': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of ethics philosophy content using curriculum terminology',
  },
  {
    query: 'utilitarianism ethics philosophy moral',
    expectedRelevance: {
      'teleology-and-utilitarianism': 3,
      'deontology-and-immanuel-kant': 2,
      'situation-ethics': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of utilitarianism ethics content using curriculum terminology',
  },
  {
    query: 'Christian afterlife and salvation',
    expectedRelevance: {
      'the-afterlife-resurrection': 3,
      'sin-and-salvation': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of eschatology with soteriology in Christianity.',
  },
] as const;
