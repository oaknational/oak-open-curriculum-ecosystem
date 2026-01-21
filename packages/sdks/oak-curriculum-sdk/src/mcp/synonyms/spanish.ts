/**
 * Spanish (MFL) concept synonyms.
 *
 * Maps canonical Spanish language learning concepts to alternative terms.
 * Focus: Grammar terms and language learning vocabulary (not Spanish words).
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from spanish bulk data (primary + secondary).
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 *
 * These synonyms were compiled with care to ensure accuracy. If you identify
 * any inaccuracies, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 */

export const spanishSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // LANGUAGE IDENTITY
  // Subject name synonyms are defined in subjects.ts (single source of truth)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Spain - the country */
  spain: ['spanish culture', 'españa'],

  /** Latin America - Hispanic culture */
  'latin-america': ['latin american', 'hispanic', 'latinoamericano'],

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

  // ═══════════════════════════════════════════════════════════════════════════
  // SPANISH-SPECIFIC GRAMMAR
  // ═══════════════════════════════════════════════════════════════════════════

  /** Gender - masculine/feminine */
  'grammatical-gender': ['gender', 'masculine', 'feminine', 'noun gender'],

  /** Ser vs Estar - two 'to be' verbs */
  ser: ['to be permanent', 'permanent state'],

  /** Estar - temporary state */
  estar: ['to be temporary', 'temporary state', 'location verb'],

  /** Ir - to go */
  ir: ['to go verb', 'going'],

  /** Tener - to have */
  tener: ['to have verb', 'having'],

  /** Possessive adjectives */
  'possessive-adjective': ['possessive adjectives', 'mi', 'tu', 'su'],

  // ═══════════════════════════════════════════════════════════════════════════
  // TENSES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Present tense */
  'present-tense': ['present', 'present tense verbs'],

  /** Past tense */
  'past-tense': ['past', 'preterite', 'imperfect', 'pretérito'],

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
  // PRONUNCIATION
  // ═══════════════════════════════════════════════════════════════════════════

  /** Vowels - Spanish vowel sounds */
  vowels: ['vowel sounds', 'a e i o u'],

  /** Syllable - word parts */
  syllable: ['syllables', 'word stress'],

  /** SSC - sound-symbol correspondence */
  ssc: ['sound-symbol correspondence', 'phonics'],

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTION WORDS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Question words - interrogatives */
  'question-words': ['interrogatives', 'wh-words'],

  /** Cómo - how */
  cómo: ['como', 'how question'],

  /** Quién - who */
  quién: ['quien', 'who question'],

  // ═══════════════════════════════════════════════════════════════════════════
  // STRUCTURES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Hay - there is/there are */
  hay: ['there is', 'there are'],

  /** Negation - making negative */
  negation: ['negative', 'no', 'not'],

  /** First person plural - we */
  '1st-person-plural': ['first person plural', 'we', 'nosotros'],
} as const;

export type SpanishSynonyms = typeof spanishSynonyms;
