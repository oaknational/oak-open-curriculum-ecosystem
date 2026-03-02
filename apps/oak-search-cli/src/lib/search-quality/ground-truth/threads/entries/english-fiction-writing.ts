/**
 * Thread ground truth: English — Developing Fiction Writing
 *
 * Ground truth for testing thread search quality using Known-Answer-First methodology.
 * Targets the "Developing fiction writing" thread in English.
 *
 * ## Source Data
 *
 * Explored: thread-progression-data.ts (164 threads, 16 subjects)
 * Target thread: `developing-fiction-writing` (English)
 *
 * ## Thread Content
 *
 * The "Developing fiction writing" thread covers fiction writing skills
 * progression from primary (story structure, characters) through secondary
 * (narrative voice, literary techniques, creative writing for GCSE).
 *
 * ## Query Design
 *
 * An English teacher looking for the fiction writing curriculum strand
 * would search for "fiction creative writing skills" to find the progression.
 */

import type { ThreadGroundTruth } from '../types';

/**
 * English thread ground truth: Fiction writing skills progression.
 */
export const ENGLISH_FICTION_WRITING: ThreadGroundTruth = {
  subject: 'english',
  query: 'fiction creative writing skills progression',
  expectedRelevance: {
    'developing-fiction-writing': 3,
    'developing-essay-writing': 1,
  },
  description:
    'Thread covering fiction writing from primary story structure through secondary narrative voice and literary techniques.',
} as const;
