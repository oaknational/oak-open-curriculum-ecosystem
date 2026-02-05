/**
 * Citizenship Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Citizenship Secondary ground truth: Government vs Parliament.
 */
export const CITIZENSHIP_SECONDARY: MinimalGroundTruth = {
  subject: 'citizenship',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'UK government parliament difference roles',
  expectedRelevance: {
    'what-is-the-difference-between-the-government-and-parliament': 3,
    'what-are-the-differences-between-the-uk-and-us-political-systems': 2,
    'what-are-the-differences-between-local-regional-and-national-governance': 2,
  },
  description: 'Lesson teaches the key differences between parliament and government in the UK.',
} as const;
