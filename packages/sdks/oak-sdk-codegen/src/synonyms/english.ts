/**
 * English language concept synonyms.
 *
 * Maps canonical English concepts to alternative terms.
 *
 * @remarks
 * Foundational grammar terms added 2025-12-27 during synonym quality audit.
 * These high-value KS1/KS2 terms have plain English synonyms validated
 * against curriculum definitions in vocabulary-graph-data.ts.
 */

export const englishSynonyms = {
  // ============================================================================
  // EXISTING SYNONYMS
  // ============================================================================

  grammar: ['syntax'],
  punctuation: ['commas', 'apostrophes', 'full stops', 'periods'],
  spelling: ['spellings'],
  poetry: ['poem', 'poems'],
  'figurative-language': ['metaphor', 'simile', 'personification', 'literary devices'],
  shakespeare: ['william shakespeare'],

  // ============================================================================
  // FOUNDATIONAL GRAMMAR TERMS (Added 2025-12-27)
  // Value-scored from vocabulary analysis; validated against definitions
  // ============================================================================

  /**
   * Adjective — "a word that describes a noun".
   * Value score: 678 (highest in vocabulary analysis)
   */
  adjective: ['describing word', 'descriptive word'],

  /**
   * Noun — "a naming word for people, places or things".
   * Value score: 579
   */
  noun: ['naming word', 'name word'],

  /**
   * Verb — "a being, doing or having word".
   * Value score: 304
   */
  verb: ['action word', 'doing word'],

  /**
   * Adverb — "a word that describes a verb".
   * Value score: 240
   */
  adverb: ['describing verb word'],

  /**
   * Suffix — "a letter or group of letters at the end of a word".
   * Value score: 378
   */
  suffix: ['word ending', 'end of word'],

  /**
   * Prefix — "a letter or group added to the start of a word".
   * Value score: 94
   */
  prefix: ['word beginning', 'start of word'],

  /**
   * Root word — "the base word from which other words are formed".
   * Value score: 216
   */
  'root word': ['base word', 'stem word'],

  /**
   * Fronted adverbial — "a sentence starter followed by a comma".
   * Value score: 140
   */
  'fronted adverbial': ['sentence starter', 'adverbial phrase'],
} as const;

export type EnglishSynonyms = typeof englishSynonyms;
