/**
 * KS4 English ground truth queries for non-fiction and language skills.
 *
 * Covers GCSE Language Paper skills: persuasive writing, speeches, analysis.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools:
 * - `get-key-stages-subject-units` for unit structure
 * - `get-key-stages-subject-lessons` for lesson slugs
 * - `get-lessons-summary` for lesson details and keywords
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Non-fiction ground truth queries for KS4 English.
 *
 * Focus: Persuasive writing, speech writing, non-fiction analysis.
 */
export const NON_FICTION_KS4_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'persuasive writing techniques',
    expectedRelevance: {
      'crafting-a-clear-point-of-view-in-non-fiction-writing': 3,
      'persuasive-opinion-pieces': 3,
      'crafting-a-voice-in-nonfiction-writing': 2,
    },
  },
  {
    query: 'speech writing rhetorical devices',
    expectedRelevance: {
      'crafting-a-clear-point-of-view-in-non-fiction-writing': 3,
      'crafting-a-voice-in-nonfiction-writing': 3,
      'identifying-and-comparing-attitudes': 2,
    },
  },
  {
    query: 'analysing non-fiction language',
    expectedRelevance: {
      'analysing-language-devices-effectively': 3,
      'making-effective-inferences': 3,
      'aiming-high-in-a-comparative-summary': 2,
    },
  },
  {
    query: 'comparing non-fiction texts',
    expectedRelevance: {
      'analysing-evidence-to-support-a-comparison-of-attitudes': 3,
      'aiming-high-in-a-comparative-summary': 3,
      'analysing-language-devices-effectively': 2,
    },
  },
  {
    query: 'inference and summary skills',
    expectedRelevance: {
      'how-to-summarise': 3,
      'making-effective-inferences': 3,
      'aiming-high-in-a-comparative-summary': 2,
    },
  },
] as const;
