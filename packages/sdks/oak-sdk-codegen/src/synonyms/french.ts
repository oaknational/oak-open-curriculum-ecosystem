/**
 * French (MFL) concept synonyms.
 *
 * Maps canonical French language learning concepts to alternative terms.
 * Focus: Grammar terms and language learning vocabulary (not French words).
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from french bulk data (primary + secondary).
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 *
 * These synonyms were compiled with care to ensure accuracy. If you identify
 * any inaccuracies, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 */

export const frenchSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // LANGUAGE IDENTITY
  // Subject name synonyms are defined in subjects.ts (single source of truth)
  // ═══════════════════════════════════════════════════════════════════════════

  /** France - the country */
  france: ['french culture', 'la france'],

  // ═══════════════════════════════════════════════════════════════════════════
  // GRAMMAR TERMS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Verb - action word */
  verb: ['verbs', 'verb conjugation'],

  /** Noun - naming word */
  noun: ['nouns', 'naming word'],

  /** Adjective - describing word */
  adjective: ['adjectives', 'describing word'],

  /** Adverb - modifies verb */
  adverb: ['adverbs'],

  /** Pronoun - replaces noun */
  pronoun: ['pronouns'],

  /** Preposition - relationship word */
  preposition: ['prepositions'],

  /** Article - definite/indefinite */
  article: ['articles', 'definite article', 'indefinite article'],

  /** Conjunction - joining word */
  conjunction: ['conjunctions', 'joining word'],

  // ═══════════════════════════════════════════════════════════════════════════
  // FRENCH-SPECIFIC GRAMMAR
  // ═══════════════════════════════════════════════════════════════════════════

  /** Negation - making sentences negative with ne...pas */
  negation: ['negative', 'making negative', 'ne pas', 'ne ... pas', "don't", 'not'],

  /** Gender - masculine/feminine */
  'grammatical-gender': ['gender', 'masculine', 'feminine', 'noun gender'],

  /** Adjective agreement */
  'adjective-agreement': ['agreement', 'agreeing adjectives'],

  /** SFC - silent final consonant */
  sfc: ['silent final consonant'],

  /** Liaison - pronunciation linking */
  liaison: ['linking sounds', 'elision'],

  /** Être - to be */
  être: ['etre', 'to be verb'],

  /** Avoir - to have */
  avoir: ['to have verb'],

  // ═══════════════════════════════════════════════════════════════════════════
  // TENSES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Present tense */
  'present-tense': ['present', 'present tense verbs'],

  /** Past tense */
  'past-tense': ['past', 'perfect tense', 'imperfect tense', 'passé composé'],

  /** Future tense */
  'future-tense': ['future', 'future tense'],

  // ═══════════════════════════════════════════════════════════════════════════
  // LANGUAGE SKILLS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Speaking - oral skills */
  speaking: ['oral', 'spoken', 'pronunciation'],

  /** Listening - aural skills */
  listening: ['comprehension', 'aural', 'listening comprehension'],

  /** Reading - written comprehension */
  reading: ['written comprehension', 'reading comprehension'],

  /** Writing - composition */
  writing: ['written', 'composition', 'writing skills'],

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTION WORDS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Question words - interrogatives */
  'question-words': ['interrogatives', 'wh-words'],

  // NOTE: French question words (comment, quand, qui, quel) removed.
  // They were translation hints, not synonyms. See bucket-c-analysis.ts.
} as const;

export type FrenchSynonyms = typeof frenchSynonyms;
