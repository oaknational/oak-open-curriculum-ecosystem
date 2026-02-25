/**
 * Type Emitter
 *
 * Generates TypeScript source code for lesson slug union types from parsed bulk data.
 *
 * Output includes:
 * - Union types for valid lesson slugs per subject/phase
 * - Const count values for each subject/phase
 * - Set constants for runtime slug validation
 * - Type guards for narrowing
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Aggregated bulk data ready for type generation.
 */
export interface ParsedBulkData {
  /** Subject slug (e.g., "maths", "science") */
  readonly subject: string;
  /** Education phase */
  readonly phase: 'primary' | 'secondary';
  /** Sequence slug (e.g., "maths-primary") */
  readonly sequenceSlug: string;
  /** Unique lesson slugs in this subject/phase */
  readonly lessonSlugs: readonly string[];
  /** Total lesson count */
  readonly lessonCount: number;
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Converts a hyphenated string to PascalCase.
 *
 * @param str - Hyphenated string (e.g., "maths-primary")
 * @returns PascalCase string (e.g., "MathsPrimary")
 *
 * @example
 * ```typescript
 * toPascalCase('maths-primary'); // 'MathsPrimary'
 * toPascalCase('design-technology-secondary'); // 'DesignTechnologySecondary'
 * ```
 */
export function toPascalCase(str: string): string {
  if (str === '') {
    return '';
  }
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Converts a hyphenated string to SCREAMING_SNAKE_CASE.
 *
 * @param str - Hyphenated string (e.g., "maths-primary")
 * @returns SCREAMING_SNAKE_CASE string (e.g., "MATHS_PRIMARY")
 */
function toScreamingSnakeCase(str: string): string {
  return str.toUpperCase().replace(/-/g, '_');
}

/**
 * Escapes a string for use in a single-quoted TypeScript string literal.
 *
 * @param str - String to escape
 * @returns Escaped string safe for single quotes
 */
function escapeForSingleQuote(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ============================================================================
// Code Generation
// ============================================================================

/**
 * Generates TypeScript type definition for a single subject/phase.
 *
 * Produces:
 * - Const for lesson count
 * - Set for runtime validation (slugs stored in Set, not union type)
 *
 * Note: Union types with thousands of members crash TypeScript, so we use
 * Sets for runtime validation and branded string types for compile-time safety.
 *
 * @param data - Parsed bulk data for one subject/phase
 * @returns TypeScript source code string
 */
export function emitLessonSlugType(data: ParsedBulkData): string {
  const constName = `${toScreamingSnakeCase(data.sequenceSlug)}_LESSON_COUNT`;
  const setName = `${toScreamingSnakeCase(data.sequenceSlug)}_LESSON_SLUGS`;

  const lines: string[] = [];

  // Count constant
  lines.push('/**');
  lines.push(` * Count of lessons in ${data.sequenceSlug}.`);
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(' */');
  lines.push(`export const ${constName} = ${data.lessonCount} as const;`);

  lines.push('');

  // Set for runtime validation
  lines.push('/**');
  lines.push(` * Set of valid slugs for ${data.sequenceSlug} runtime validation.`);
  lines.push(' *');
  lines.push(` * Total slugs: ${data.lessonCount}`);
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(' */');
  if (data.lessonSlugs.length === 0) {
    lines.push(`export const ${setName}: ReadonlySet<string> = new Set();`);
  } else {
    lines.push(`export const ${setName}: ReadonlySet<string> = new Set([`);
    for (const slug of data.lessonSlugs) {
      lines.push(`  '${escapeForSingleQuote(slug)}',`);
    }
    lines.push(']);');
  }

  return lines.join('\n');
}

/**
 * Generates complete TypeScript file with all lesson slug constants.
 *
 * Produces:
 * - File header with generation metadata
 * - Per-subject/phase Sets and counts
 * - Combined Set of all slugs
 * - Type guard function
 * - Branded type for validated slugs
 *
 * Note: We use Sets for runtime validation rather than massive union types
 * which would crash TypeScript compiler.
 *
 * @param allData - Parsed bulk data for all subjects/phases
 * @returns Complete TypeScript source file content
 */
export function emitAllLessonSlugTypes(allData: readonly ParsedBulkData[]): string {
  const lines: string[] = [];

  // File header
  lines.push('/**');
  lines.push(' * Generated lesson slug validation data from bulk download files.');
  lines.push(' *');
  lines.push(' * Provides runtime validation Sets and type guards for ground truth lesson slugs.');
  lines.push(' * Uses branded string types instead of massive unions (which crash TypeScript).');
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(` * Generated at: ${new Date().toISOString()}`);
  lines.push(' */');
  lines.push('');
  lines.push('/* eslint-disable max-lines, max-statements, complexity */');
  lines.push('// Generated file with 12,000+ lesson slugs');
  lines.push('');

  // Generate each subject/phase constants
  for (const data of allData) {
    lines.push(emitLessonSlugType(data));
    lines.push('');
  }

  // Generate combined section
  lines.push('// ============================================================================');
  lines.push('// Combined Validation');
  lines.push('// ============================================================================');
  lines.push('');

  // Branded type
  lines.push('/**');
  lines.push(' * Branded string type for validated lesson slugs.');
  lines.push(' *');
  lines.push(' * Use isValidLessonSlug() to validate and narrow strings to this type.');
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push("export type AnyLessonSlug = string & { readonly __brand: 'LessonSlug' };");
  lines.push('');

  // Generate combined Set
  lines.push('/**');
  lines.push(' * Combined Set of all valid lesson slugs for runtime validation.');
  lines.push(' *');
  const totalCount = allData.reduce((sum, d) => sum + d.lessonCount, 0);
  lines.push(` * Total slugs: ${totalCount}`);
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');

  if (allData.length === 0) {
    lines.push('export const ALL_LESSON_SLUGS: ReadonlySet<string> = new Set();');
  } else {
    // Combine all slugs - collect into function to avoid type assertion
    lines.push('function collectAllSlugs(): string[] {');
    lines.push('  const all: string[] = [];');
    for (const data of allData) {
      const setName = `${toScreamingSnakeCase(data.sequenceSlug)}_LESSON_SLUGS`;
      lines.push(`  for (const s of ${setName}) all.push(s);`);
    }
    lines.push('  return all;');
    lines.push('}');
    lines.push('export const ALL_LESSON_SLUGS: ReadonlySet<string> = new Set(collectAllSlugs());');
  }

  lines.push('');

  // Generate type guard
  lines.push('/**');
  lines.push(' * Type guard to check if a string is a valid lesson slug.');
  lines.push(' *');
  lines.push(' * @param value - String to check');
  lines.push(' * @returns True if value is a valid lesson slug');
  lines.push(' *');
  lines.push(' * @example');
  lines.push(' * ```typescript');
  lines.push(" * if (isValidLessonSlug('adding-fractions')) {");
  lines.push(' *   // value is narrowed to AnyLessonSlug');
  lines.push(' * }');
  lines.push(' * ```');
  lines.push(' */');
  lines.push('export function isValidLessonSlug(value: string): value is AnyLessonSlug {');
  lines.push('  return ALL_LESSON_SLUGS.has(value);');
  lines.push('}');
  lines.push('');

  // Total count
  lines.push(`/** Total lessons across all subjects */`);
  lines.push(`export const TOTAL_LESSON_SLUG_COUNT = ${totalCount} as const;`);
  lines.push('');

  // Generate slug-to-subject Map for cross-subject validation
  lines.push('// ============================================================================');
  lines.push('// Slug to Subject Mapping (for cross-subject contamination checks)');
  lines.push('// ============================================================================');
  lines.push('');
  lines.push('/**');
  lines.push(' * Map from lesson slug to subject slug for cross-subject validation.');
  lines.push(' *');
  lines.push(' * Used to detect when a ground truth file references lessons from');
  lines.push(' * the wrong subject (e.g., maths ground truth containing science slugs).');
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('function buildSlugToSubjectMap(): Map<string, string> {');
  lines.push('  const map = new Map<string, string>();');
  for (const data of allData) {
    const setName = `${toScreamingSnakeCase(data.sequenceSlug)}_LESSON_SLUGS`;
    lines.push(
      `  for (const s of ${setName}) map.set(s, '${escapeForSingleQuote(data.subject)}');`,
    );
  }
  lines.push('  return map;');
  lines.push('}');
  lines.push(
    'export const SLUG_TO_SUBJECT: ReadonlyMap<string, string> = buildSlugToSubjectMap();',
  );
  lines.push('');

  // Generate getSubjectForSlug helper
  lines.push('/**');
  lines.push(' * Get the subject for a given lesson slug.');
  lines.push(' *');
  lines.push(' * @param slug - Lesson slug to look up');
  lines.push(' * @returns Subject slug, or undefined if slug not found');
  lines.push(' *');
  lines.push(' * @example');
  lines.push(' * ```typescript');
  lines.push(" * getSubjectForSlug('adding-fractions'); // 'maths'");
  lines.push(" * getSubjectForSlug('photosynthesis'); // 'science'");
  lines.push(' * ```');
  lines.push(' */');
  lines.push('export function getSubjectForSlug(slug: string): string | undefined {');
  lines.push('  return SLUG_TO_SUBJECT.get(slug);');
  lines.push('}');

  return lines.join('\n');
}
