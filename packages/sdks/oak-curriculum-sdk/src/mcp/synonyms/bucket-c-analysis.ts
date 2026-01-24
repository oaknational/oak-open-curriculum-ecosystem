/**
 * Bucket C: Translation hints removed from synonym files.
 *
 * These entries were identified as providing no search value because:
 * - They map foreign language words to English meanings (translation, not synonyms)
 * - They are definitions rather than alternative terms
 * - Teachers search in English; these foreign words don't appear in queries
 *
 * This file is NOT exported to the synonym set. It exists for:
 * 1. Documentation of what was removed and why
 * 2. Future analysis of whether any entries should be recategorised
 * 3. Reference for the MFL synonym architecture refactoring
 *
 * @see mfl-synonym-architecture.md in .agent/plans/semantic-search/post-sdk/search-quality/
 * @packageDocumentation
 */

/**
 * French translation hints (removed from french.ts)
 *
 * These map French question words to their English meanings.
 * Not useful for search because teachers don't search for "comment" when
 * looking for "how" questions - they search in English.
 */
export const frenchBucketC = {
  /** Comment - how (TRANSLATION, not synonym) */
  comment: ['how question'],

  /** Quand - when (TRANSLATION, not synonym) */
  quand: ['when question'],

  /** Qui - who (TRANSLATION, not synonym) */
  qui: ['who question'],

  /** Quel/Quelle - which (Form variant + TRANSLATION) */
  quel: ['quelle', 'which question'],
} as const;

/**
 * German translation hints (removed from german.ts)
 *
 * These are DEFINITIONS of German pronouns, not synonyms.
 * "du" doesn't have an English synonym - "informal you singular" is a definition.
 */
export const germanBucketC = {
  /** Du - informal you singular (DEFINITION, not synonym) */
  du: ['informal you singular'],

  /** Ihr - informal you plural (DEFINITION, not synonym) */
  ihr: ['informal you plural'],

  /** Sie - formal you (DEFINITION, not synonym) */
  sie: ['formal you', 'polite form'],
} as const;

/**
 * Spanish translation hints (removed from spanish.ts)
 *
 * These map Spanish question words to English meanings.
 * The accent variants (cómo/como) might have value for ASCII folding,
 * but the English meanings are translations, not synonyms.
 */
export const spanishBucketC = {
  /** Cómo - how (Accent variant + TRANSLATION) */
  cómo: ['como', 'how question'],

  /** Quién - who (Accent variant + TRANSLATION) */
  quién: ['quien', 'who question'],
} as const;

/**
 * Analysis summary:
 *
 * FRENCH (4 entries removed):
 * - comment, quand, qui: Pure translation hints
 * - quel: Form variant (quelle) + translation
 *
 * GERMAN (3 entries removed):
 * - du, ihr, sie: These are definitions explaining German pronouns
 *   "informal you singular" explains what "du" means, it's not a synonym
 *
 * SPANISH (2 entries removed):
 * - cómo, quién: Accent variants might help, but "how question" is translation
 *
 * DECISION: All 9 entries removed. If accent variants prove valuable,
 * they should be added back as ONLY the accent variant, without the translation.
 *
 * Example of correct accent handling (if needed):
 *   cómo: ['como']  // Accent variant only - helps keyboard without accents
 *
 * Example of what we removed (wrong):
 *   cómo: ['como', 'how question']  // Translation mixed in
 */

export type FrenchBucketC = typeof frenchBucketC;
export type GermanBucketC = typeof germanBucketC;
export type SpanishBucketC = typeof spanishBucketC;
