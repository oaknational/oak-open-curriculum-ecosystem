/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Subject hierarchy constants for search filtering.
 * Generated from code-generation hardcoded domain knowledge.
 *
 * The OpenAPI schema defines 17 canonical subjects. The bulk curriculum data
 * contains 4 additional KS4 science variants (physics, chemistry, biology,
 * combined-science). This file provides the lookup tables and type guards
 * needed to handle both in search indexing and filtering.
 *
 * @see docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md
 * @see code-generation/typegen/search/generate-subject-hierarchy.ts - Generator source
 */

/**
 * Maps every valid subject (including KS4 variants) to its parent subject.
 *
 * For most subjects, parent === subject. Only science has children:
 * - physics → science
 * - chemistry → science
 * - biology → science
 * - combined-science → science
 * - science → science
 *
 * @example
 * ```typescript
 * SUBJECT_TO_PARENT['physics']    // → 'science'
 * SUBJECT_TO_PARENT['maths']      // → 'maths'
 * SUBJECT_TO_PARENT['science']    // → 'science'
 * ```
 */
export const SUBJECT_TO_PARENT = {
  "science": "science",
  "physics": "science",
  "chemistry": "science",
  "biology": "science",
  "combined-science": "science",
  "art": "art",
  "citizenship": "citizenship",
  "computing": "computing",
  "cooking-nutrition": "cooking-nutrition",
  "design-technology": "design-technology",
  "english": "english",
  "french": "french",
  "geography": "geography",
  "german": "german",
  "history": "history",
  "maths": "maths",
  "music": "music",
  "physical-education": "physical-education",
  "religious-education": "religious-education",
  "rshe-pshe": "rshe-pshe",
  "spanish": "spanish"
} as const;

/**
 * All valid subject values (21 total: 17 canonical + 4 KS4 science variants).
 *
 * Use this when you need to validate or enumerate all possible subject values
 * that may appear in bulk curriculum data.
 */
export const ALL_SUBJECTS = [
  "art",
  "citizenship",
  "computing",
  "cooking-nutrition",
  "design-technology",
  "english",
  "french",
  "geography",
  "german",
  "history",
  "maths",
  "music",
  "physical-education",
  "religious-education",
  "rshe-pshe",
  "science",
  "spanish",
  "physics",
  "chemistry",
  "biology",
  "combined-science"
] as const;

/**
 * KS4 science variant subjects (children of 'science').
 *
 * These subjects only exist at KS4 and are not in the OpenAPI schema.
 * When filtering at KS4, these can be used for specific subject filtering.
 * When filtering at other key stages, fall back to the parent 'science'.
 */
export const KS4_SCIENCE_VARIANTS = [
  "physics",
  "chemistry",
  "biology",
  "combined-science"
] as const;

/**
 * Maps parent subjects to all their children (including themselves).
 *
 * Useful for understanding what subjects fall under a parent.
 * - 'science' → ['science', 'physics', 'chemistry', 'biology', 'combined-science']
 * - All other subjects → [self]
 *
 * @example
 * ```typescript
 * PARENT_TO_SUBJECTS['science']   // → ['science', 'physics', 'chemistry', 'biology', 'combined-science']
 * PARENT_TO_SUBJECTS['maths']     // → ['maths']
 * ```
 */
export const PARENT_TO_SUBJECTS = {
  "art": [
    "art"
  ],
  "citizenship": [
    "citizenship"
  ],
  "computing": [
    "computing"
  ],
  "cooking-nutrition": [
    "cooking-nutrition"
  ],
  "design-technology": [
    "design-technology"
  ],
  "english": [
    "english"
  ],
  "french": [
    "french"
  ],
  "geography": [
    "geography"
  ],
  "german": [
    "german"
  ],
  "history": [
    "history"
  ],
  "maths": [
    "maths"
  ],
  "music": [
    "music"
  ],
  "physical-education": [
    "physical-education"
  ],
  "religious-education": [
    "religious-education"
  ],
  "rshe-pshe": [
    "rshe-pshe"
  ],
  "science": [
    "science",
    "physics",
    "chemistry",
    "biology",
    "combined-science"
  ],
  "spanish": [
    "spanish"
  ]
} as const;

/** Type for all valid subject slugs including KS4 variants (21 subjects) */
export type AllSubjectSlug = keyof typeof SUBJECT_TO_PARENT;

/** Type for parent/canonical subjects only (the 17 from OpenAPI) */
export type ParentSubjectSlug = (typeof SUBJECT_TO_PARENT)[AllSubjectSlug];

/** Type for KS4 science variant subjects (4 subjects) */
export type Ks4ScienceVariant = (typeof KS4_SCIENCE_VARIANTS)[number];

/**
 * Type guard: Check if a subject is a KS4 science variant.
 *
 * KS4 science variants are: physics, chemistry, biology, combined-science.
 * Note: 'science' itself is NOT a variant (it's the parent).
 *
 * @param subject - The subject string to check
 * @returns True if the subject is a KS4 science variant
 *
 * @example
 * ```typescript
 * isKs4ScienceVariant('physics')   // → true
 * isKs4ScienceVariant('science')   // → false (it's the parent)
 * isKs4ScienceVariant('maths')     // → false
 * ```
 */
export function isKs4ScienceVariant(subject: string): subject is Ks4ScienceVariant {
  const variants: readonly string[] = KS4_SCIENCE_VARIANTS;
  return variants.includes(subject);
}

/**
 * Get the parent subject for any subject.
 *
 * For science variants (physics, chemistry, biology, combined-science),
 * returns 'science'. For all other subjects, returns the subject itself.
 *
 * @param subject - A valid subject slug (AllSubjectSlug)
 * @returns The parent subject slug (ParentSubjectSlug)
 *
 * @example
 * ```typescript
 * getSubjectParent('physics')    // → 'science'
 * getSubjectParent('maths')      // → 'maths'
 * getSubjectParent('science')    // → 'science'
 * ```
 */
export function getSubjectParent(subject: AllSubjectSlug): ParentSubjectSlug {
  return SUBJECT_TO_PARENT[subject];
}

/**
 * Type guard: Check if a string is a valid subject (including KS4 variants).
 *
 * This validates against all 21 subjects (17 canonical + 4 KS4 variants).
 * Use this for validating bulk data subject values.
 *
 * @param value - The string to check
 * @returns True if the value is a valid AllSubjectSlug
 *
 * @example
 * ```typescript
 * isAllSubject('physics')    // → true (KS4 variant)
 * isAllSubject('maths')      // → true (canonical)
 * isAllSubject('invalid')    // → false
 * ```
 */
export function isAllSubject(value: string): value is AllSubjectSlug {
  const subjects: readonly string[] = ALL_SUBJECTS;
  return subjects.includes(value);
}
