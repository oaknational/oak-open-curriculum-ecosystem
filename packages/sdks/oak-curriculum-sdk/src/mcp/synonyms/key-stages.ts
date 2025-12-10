/**
 * Key stage synonyms.
 *
 * Maps canonical key stage slugs to alternative terms including year groups.
 *
 * @module synonyms/key-stages
 */

export const keyStageSynonyms = {
  ks1: [
    'key stage 1',
    'key-stage 1',
    'key stage one',
    'y1',
    'yr 1',
    'year 1',
    'y2',
    'yr 2',
    'year 2',
  ],
  ks2: [
    'key stage 2',
    'key-stage 2',
    'key stage two',
    'y3',
    'yr 3',
    'year 3',
    'y4',
    'yr 4',
    'year 4',
    'y5',
    'yr 5',
    'year 5',
    'y6',
    'yr 6',
    'year 6',
  ],
  ks3: [
    'key stage 3',
    'key-stage 3',
    'key stage three',
    'y7',
    'yr 7',
    'year 7',
    'y8',
    'yr 8',
    'year 8',
    'y9',
    'yr 9',
    'year 9',
  ],
  ks4: [
    'key stage 4',
    'key-stage 4',
    'key stage four',
    'gcse',
    'y10',
    'yr 10',
    'year 10',
    'y11',
    'yr 11',
    'year 11',
  ],
} as const;

export type KeyStageSynonyms = typeof keyStageSynonyms;
