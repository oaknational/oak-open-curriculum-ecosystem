/**
 * Secondary English ground truth queries for non-fiction and language skills.
 *
 * Covers GCSE Language Paper skills: persuasive writing, speeches, analysis.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Non-fiction ground truth queries for Secondary English (KS4).
 *
 * Focus: Persuasive writing, speech writing, non-fiction analysis.
 */
export const NON_FICTION_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'persuasive writing techniques',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of persuasive writing content using curriculum terminology',
    expectedRelevance: {
      'crafting-a-clear-point-of-view-in-non-fiction-writing': 3,
      'persuasive-opinion-pieces': 3,
      'crafting-a-voice-in-nonfiction-writing': 2,
    },
  },
  {
    query: 'speech writing rhetorical devices',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of speech writing content using curriculum terminology',
    expectedRelevance: {
      'crafting-a-clear-point-of-view-in-non-fiction-writing': 3,
      'crafting-a-voice-in-nonfiction-writing': 3,
      'identifying-and-comparing-attitudes': 2,
    },
  },
  {
    query: 'analysing non-fiction language',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of non-fiction analysis content using curriculum terminology',
    expectedRelevance: {
      'analysing-language-devices-effectively': 3,
      'making-effective-inferences': 3,
      'aiming-high-in-a-comparative-summary': 2,
    },
  },
  {
    query: 'comparing non-fiction texts',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of text comparison content using curriculum terminology',
    expectedRelevance: {
      'analysing-evidence-to-support-a-comparison-of-attitudes': 3,
      'aiming-high-in-a-comparative-summary': 3,
      'analysing-language-devices-effectively': 2,
    },
  },
  {
    query: 'inference and summary skills',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of inference and summary content using curriculum terminology',
    expectedRelevance: {
      'how-to-summarise': 3,
      'making-effective-inferences': 3,
      'aiming-high-in-a-comparative-summary': 2,
    },
  },
] as const;
