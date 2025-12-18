/**
 * Key stage synonyms.
 *
 * Maps canonical key stage slugs to alternative terms including year groups.
 *
 * Sources:
 * - OWA: reference/Oak-Web-Application/src/context/Search/suggestions/oakCurriculumData.ts
 * - OALA: reference/oak-ai-lesson-assistant/packages/core/src/data/parseKeyStage.ts
 */

export const keyStageSynonyms = {
  // Early Years Foundation Stage (from OALA)
  eyfs: ['early years foundation stage', 'early years', 'foundation stage', 'reception', 'nursery'],

  // Key Stage 1 - Years 1-2
  ks1: [
    'key stage 1',
    'key-stage 1',
    'key stage one',
    'keystage 1',
    'keystage1',
    'key-stage-1',
    // Year 1 variants (with and without space from OWA)
    'y1',
    'yr1',
    'yr 1',
    'year1',
    'year 1',
    // Year 2 variants
    'y2',
    'yr2',
    'yr 2',
    'year2',
    'year 2',
  ],

  // Key Stage 2 - Years 3-6
  ks2: [
    'key stage 2',
    'key-stage 2',
    'key stage two',
    'keystage 2',
    'keystage2',
    'key-stage-2',
    // Year 3 variants
    'y3',
    'yr3',
    'yr 3',
    'year3',
    'year 3',
    // Year 4 variants
    'y4',
    'yr4',
    'yr 4',
    'year4',
    'year 4',
    // Year 5 variants
    'y5',
    'yr5',
    'yr 5',
    'year5',
    'year 5',
    // Year 6 variants
    'y6',
    'yr6',
    'yr 6',
    'year6',
    'year 6',
  ],

  // Key Stage 3 - Years 7-9
  ks3: [
    'key stage 3',
    'key-stage 3',
    'key stage three',
    'keystage 3',
    'keystage3',
    'key-stage-3',
    // Year 7 variants
    'y7',
    'yr7',
    'yr 7',
    'year7',
    'year 7',
    // Year 8 variants
    'y8',
    'yr8',
    'yr 8',
    'year8',
    'year 8',
    // Year 9 variants
    'y9',
    'yr9',
    'yr 9',
    'year9',
    'year 9',
  ],

  // Key Stage 4 - Years 10-11 (GCSE)
  ks4: [
    'key stage 4',
    'key-stage 4',
    'key stage four',
    'keystage 4',
    'keystage4',
    'key-stage-4',
    'gcse',
    'gcses',
    // Year 10 variants
    'y10',
    'yr10',
    'yr 10',
    'year10',
    'year 10',
    // Year 11 variants
    'y11',
    'yr11',
    'yr 11',
    'year11',
    'year 11',
  ],

  // Key Stage 5 - Years 12-13 (A-Level) - NEW from OALA
  ks5: [
    'key stage 5',
    'key-stage 5',
    'key stage five',
    'keystage 5',
    'keystage5',
    'key-stage-5',
    'a level',
    'a-level',
    'alevel',
    'a levels',
    'a-levels',
    'sixth form',
    'sixth-form',
    'post-16',
    'post 16',
    // Year 12 variants
    'y12',
    'yr12',
    'yr 12',
    'year12',
    'year 12',
    // Year 13 variants
    'y13',
    'yr13',
    'yr 13',
    'year13',
    'year 13',
  ],
} as const;

export type KeyStageSynonyms = typeof keyStageSynonyms;
