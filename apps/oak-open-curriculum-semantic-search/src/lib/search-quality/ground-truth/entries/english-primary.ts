/**
 * English Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * English Primary ground truth: Spelling plural nouns with suffix rules.
 */
export const ENGLISH_PRIMARY: MinimalGroundTruth = {
  subject: 'english',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'spelling plural nouns suffix rules',
  expectedRelevance: {
    'practise-changing-nouns-from-singular-to-plural-using-alternative-rules': 2,
    'forming-plural-nouns-using-the-suffix-es-and-ves': 3,
    'forming-plural-nouns-using-the-suffix-s-and-ies': 2,
  },
  description:
    'Lesson teaches spelling rules for forming plural nouns using -es, -ves, -s, and -ies suffixes.',
} as const;
