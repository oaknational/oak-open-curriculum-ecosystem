/**
 * Generic educational terms and UK education acronyms.
 *
 * Maps common educational terminology and abbreviations.
 */

/** Generic educational terms */
export const genericSynonyms = {
  assessment: ['quiz', 'test', 'exam'],
} as const;

/** Common UK educational acronyms and abbreviations */
export const educationalAcronymSynonyms = {
  sen: ['special educational needs', 'send'],
  send: ['special educational needs and disabilities'],
  eal: ['english as an additional language'],
  eyfs: ['early years foundation stage', 'early years'],
  sat: ['standard assessment test', 'sats'],
  gcse: ['general certificate of secondary education'],
  'a-level': ['a level', 'advanced level'],
  ofsted: ['office for standards in education'],
  dfe: ['department for education'],
  nc: ['national curriculum'],
  afl: ['assessment for learning'],
  cpd: ['continuing professional development'],
  qts: ['qualified teacher status'],
  nqt: ['newly qualified teacher', 'ect'],
  ect: ['early career teacher', 'nqt'],
  hlta: ['higher level teaching assistant'],
  ta: ['teaching assistant'],
  semh: ['social emotional mental health'],
  asd: ['autism spectrum disorder'],
  adhd: ['attention deficit hyperactivity disorder'],
  spld: ['specific learning difficulty', 'specific learning difficulties'],
  mld: ['moderate learning difficulty', 'moderate learning difficulties'],
} as const;

export type GenericSynonyms = typeof genericSynonyms;
export type EducationalAcronymSynonyms = typeof educationalAcronymSynonyms;
