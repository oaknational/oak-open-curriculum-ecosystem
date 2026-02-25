/* eslint max-lines: [error, 270] -- Generator with substantial JSDoc, subject data, and code generation logic */
/**
 * Generate subject hierarchy constants for search filtering.
 *
 * Creates `src/types/generated/search/subject-hierarchy.ts` with:
 * - SUBJECT_TO_PARENT lookup table (21 subjects → 17 parents)
 * - ALL_SUBJECTS array (21 subjects)
 * - KS4_SCIENCE_VARIANTS array (4 variants)
 * - Type guards and helper functions
 *
 * This is hardcoded domain knowledge because:
 * - The OpenAPI schema only includes 17 canonical subjects
 * - The bulk data contains 4 additional KS4 science variants (physics, chemistry, biology, combined-science)
 * - This hierarchy is required for correct search filtering per ADR-101
 *
 * @see docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const OUTPUT_PATH = resolve(
  import.meta.dirname,
  '../../../src/types/generated/search/subject-hierarchy.ts',
);

/**
 * The 17 canonical subjects from the OpenAPI schema.
 * These are the parent subjects that all subjects map to.
 */
const CANONICAL_SUBJECTS = [
  'art',
  'citizenship',
  'computing',
  'cooking-nutrition',
  'design-technology',
  'english',
  'french',
  'geography',
  'german',
  'history',
  'maths',
  'music',
  'physical-education',
  'religious-education',
  'rshe-pshe',
  'science',
  'spanish',
] as const;

/**
 * The 4 KS4 science variants that exist in bulk data but not in OpenAPI schema.
 */
const KS4_SCIENCE_VARIANTS = ['physics', 'chemistry', 'biology', 'combined-science'] as const;

/**
 * Build the SUBJECT_TO_PARENT mapping.
 * - Science variants map to 'science'
 * - All other subjects map to themselves
 */
function buildSubjectToParentMapping(): Record<string, string> {
  const mapping: Record<string, string> = {};

  // Science hierarchy: all variants and science itself map to 'science'
  mapping['science'] = 'science';
  for (const variant of KS4_SCIENCE_VARIANTS) {
    mapping[variant] = 'science';
  }

  // All other canonical subjects map to themselves
  for (const subject of CANONICAL_SUBJECTS) {
    if (subject !== 'science') {
      mapping[subject] = subject;
    }
  }

  return mapping;
}

/**
 * Build the PARENT_TO_SUBJECTS mapping.
 * - 'science' maps to ['science', 'physics', 'chemistry', 'biology', 'combined-science']
 * - All other parents map to arrays containing only themselves
 */
function buildParentToSubjectsMapping(): Record<string, readonly string[]> {
  const mapping: Record<string, readonly string[]> = {};

  for (const subject of CANONICAL_SUBJECTS) {
    if (subject === 'science') {
      mapping[subject] = ['science', ...KS4_SCIENCE_VARIANTS];
    } else {
      mapping[subject] = [subject];
    }
  }

  return mapping;
}

/**
 * Generate the TypeScript file content.
 */
function generateSubjectHierarchyFile(): string {
  const subjectToParent = buildSubjectToParentMapping();
  const parentToSubjects = buildParentToSubjectsMapping();

  // Build all subjects array (17 canonical + 4 variants, without duplicates)
  const allSubjects = [...CANONICAL_SUBJECTS, ...KS4_SCIENCE_VARIANTS];

  return `/**
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
 * \`\`\`typescript
 * SUBJECT_TO_PARENT['physics']    // → 'science'
 * SUBJECT_TO_PARENT['maths']      // → 'maths'
 * SUBJECT_TO_PARENT['science']    // → 'science'
 * \`\`\`
 */
export const SUBJECT_TO_PARENT = ${JSON.stringify(subjectToParent, null, 2)} as const;

/**
 * All valid subject values (21 total: 17 canonical + 4 KS4 science variants).
 *
 * Use this when you need to validate or enumerate all possible subject values
 * that may appear in bulk curriculum data.
 */
export const ALL_SUBJECTS = ${JSON.stringify(allSubjects, null, 2)} as const;

/**
 * KS4 science variant subjects (children of 'science').
 *
 * These subjects only exist at KS4 and are not in the OpenAPI schema.
 * When filtering at KS4, these can be used for specific subject filtering.
 * When filtering at other key stages, fall back to the parent 'science'.
 */
export const KS4_SCIENCE_VARIANTS = ${JSON.stringify(KS4_SCIENCE_VARIANTS, null, 2)} as const;

/**
 * Maps parent subjects to all their children (including themselves).
 *
 * Useful for understanding what subjects fall under a parent.
 * - 'science' → ['science', 'physics', 'chemistry', 'biology', 'combined-science']
 * - All other subjects → [self]
 *
 * @example
 * \`\`\`typescript
 * PARENT_TO_SUBJECTS['science']   // → ['science', 'physics', 'chemistry', 'biology', 'combined-science']
 * PARENT_TO_SUBJECTS['maths']     // → ['maths']
 * \`\`\`
 */
export const PARENT_TO_SUBJECTS = ${JSON.stringify(parentToSubjects, null, 2)} as const;

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
 * \`\`\`typescript
 * isKs4ScienceVariant('physics')   // → true
 * isKs4ScienceVariant('science')   // → false (it's the parent)
 * isKs4ScienceVariant('maths')     // → false
 * \`\`\`
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
 * \`\`\`typescript
 * getSubjectParent('physics')    // → 'science'
 * getSubjectParent('maths')      // → 'maths'
 * getSubjectParent('science')    // → 'science'
 * \`\`\`
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
 * \`\`\`typescript
 * isAllSubject('physics')    // → true (KS4 variant)
 * isAllSubject('maths')      // → true (canonical)
 * isAllSubject('invalid')    // → false
 * \`\`\`
 */
export function isAllSubject(value: string): value is AllSubjectSlug {
  const subjects: readonly string[] = ALL_SUBJECTS;
  return subjects.includes(value);
}
`;
}

/**
 * Generate the subject hierarchy file.
 *
 * Called from codegen.ts alongside other generators.
 */
export function generateSubjectHierarchy(): void {
  const outputDir = dirname(OUTPUT_PATH);
  mkdirSync(outputDir, { recursive: true });

  const content = generateSubjectHierarchyFile();
  writeFileSync(OUTPUT_PATH, content, 'utf-8');

  console.log(`✅ Generated subject hierarchy: ${OUTPUT_PATH}`);
}
