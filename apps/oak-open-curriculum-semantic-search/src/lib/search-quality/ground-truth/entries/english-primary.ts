/**
 * English Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * English Primary ground truth: Spelling plural nouns with suffix rules.
 */
export const ENGLISH_PRIMARY: LessonGroundTruth = {
  subject: 'english',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'plural nouns suffixes es ves',
  expectedRelevance: {
    'making-plurals-using-the-suffix-es-and-ves': 3,
    'forming-plural-nouns-using-the-suffix-es-and-ves': 3,
    'forming-plural-nouns-using-the-suffix-s-and-ies': 2,
  },
  description:
    'Lesson teaches spelling rules for forming plural nouns using -es, -ves, -s, and -ies suffixes.',
} as const;
