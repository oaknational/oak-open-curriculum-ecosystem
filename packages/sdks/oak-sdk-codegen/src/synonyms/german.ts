/**
 * German (MFL) concept synonyms.
 *
 * Maps canonical German language learning concepts to alternative terms.
 * Focus: Grammar terms and language learning vocabulary (not German words).
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from german bulk data (secondary only).
 * [REVIEWED-2026-01-16] Accuracy and sensitivity review completed.
 *
 * These synonyms were compiled with care to ensure accuracy. If you identify
 * any inaccuracies, please contact us:
 * https://github.com/oaknational/oak-ai-lesson-assistant/issues
 */

export const germanSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // LANGUAGE IDENTITY
  // Subject name synonyms are defined in subjects.ts (single source of truth)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Germany - the country */
  germany: ['german culture', 'deutschland'],

  // ═══════════════════════════════════════════════════════════════════════════
  // GRAMMAR TERMS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Verb - action word */
  verb: ['verbs', 'verb conjugation'],

  /** Noun - naming word (capitalised in German) */
  noun: ['nouns', 'naming word'],

  /** Adjective - describing word */
  adjective: ['adjectives', 'describing word'],

  /** Adverb - modifies verb */
  adverb: ['adverbs'],

  /** Pronoun - replaces noun */
  pronoun: ['pronouns', 'subject pronoun', 'object pronoun'],

  /** Preposition - relationship word */
  preposition: ['prepositions'],

  // ═══════════════════════════════════════════════════════════════════════════
  // GERMAN-SPECIFIC GRAMMAR
  // ═══════════════════════════════════════════════════════════════════════════

  /** Case - nominative, accusative, dative, genitive */
  case: ['cases', 'nominative', 'accusative', 'dative', 'genitive'],

  /** Accusative case */
  accusative: ['accusative case', 'direct object case'],

  /** Dative case */
  dative: ['dative case', 'indirect object case'],

  /** Word order - German sentence structure */
  'word-order': ['word order', 'sentence structure', 'wo2'],

  /** Inversion - verb-subject swap */
  inversion: ['inverted word order', 'verb second'],

  /** Separable verbs - trennbare Verben */
  'separable-verb': ['separable verbs', 'trennbare verben'],

  /** Strong verb - irregular pattern */
  'strong-verb': ['strong verbs', 'irregular verb'],

  /** Weak verb - regular pattern */
  'weak-verb': ['weak verbs', 'regular verb'],

  /** Reflexive verbs */
  reflexive: ['reflexive verb', 'reflexive verbs', 'reflexive pronoun'],

  // ═══════════════════════════════════════════════════════════════════════════
  // TENSES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Present tense */
  'present-tense': ['present', 'simple present'],

  /** Perfect tense - past with haben/sein */
  'perfect-tense': ['perfect', 'past participle'],

  /** Past participle */
  'past-participle': ['past participle', 'partizip ii'],

  /** Future tense */
  'future-tense': ['future', 'future tense'],

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTION AND MOOD TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Open question - wh-question */
  'open-question': ['open question', 'wh-question', 'w-frage'],

  /** Closed question - yes/no question */
  'closed-question': ['closed question', 'yes no question'],

  /** Imperative - commands */
  imperative: ['command', 'commands', 'instructions'],

  /** Comparative - comparing */
  comparative: ['comparison', 'comparing adjectives'],

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

  /** Role-play - speaking task */
  'role-play': ['role play', 'roleplay', 'conversation practice'],

  // ═══════════════════════════════════════════════════════════════════════════
  // PRONOUNS
  // ═══════════════════════════════════════════════════════════════════════════

  // NOTE: German pronouns (du, ihr, sie) removed.
  // They were definitions, not synonyms. See bucket-c-analysis.ts.

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATION
  // ═══════════════════════════════════════════════════════════════════════════

  /** Negation - making sentences negative */
  negation: ['negative', 'making negative', 'not'],
} as const;

export type GermanSynonyms = typeof germanSynonyms;
