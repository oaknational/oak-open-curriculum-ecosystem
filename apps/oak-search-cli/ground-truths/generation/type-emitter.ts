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

export interface LessonSlugDatasetSequenceData {
  readonly subject: string;
  readonly phase: 'primary' | 'secondary';
  readonly sequenceSlug: string;
  readonly lessonCount: number;
  readonly lessonSlugs: readonly string[];
}

export interface LessonSlugDataset {
  readonly generatedAt: string;
  readonly totalLessonSlugCount: number;
  readonly sequenceOrder: readonly string[];
  readonly allLessonSlugs: readonly string[];
  readonly sequences: Readonly<Record<string, LessonSlugDatasetSequenceData>>;
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

function getLessonSlugConstantNames(sequenceSlug: string): {
  countName: string;
  setName: string;
} {
  const screamingSnakeCase = toScreamingSnakeCase(sequenceSlug);
  return {
    countName: `${screamingSnakeCase}_LESSON_COUNT`,
    setName: `${screamingSnakeCase}_LESSON_SLUGS`,
  };
}

// ============================================================================
// Code Generation
// ============================================================================

export function buildLessonSlugDataset(allData: readonly ParsedBulkData[]): LessonSlugDataset {
  const sequences: Record<string, LessonSlugDatasetSequenceData> = {};
  const allLessonSlugs: string[] = [];

  for (const data of allData) {
    sequences[data.sequenceSlug] = {
      subject: data.subject,
      phase: data.phase,
      sequenceSlug: data.sequenceSlug,
      lessonCount: data.lessonCount,
      lessonSlugs: [...data.lessonSlugs],
    };
    allLessonSlugs.push(...data.lessonSlugs);
  }

  return {
    generatedAt: new Date().toISOString(),
    totalLessonSlugCount: allLessonSlugs.length,
    sequenceOrder: allData.map((data) => data.sequenceSlug),
    allLessonSlugs,
    sequences,
  };
}

export function emitLessonSlugType(data: ParsedBulkData): string {
  const { countName, setName } = getLessonSlugConstantNames(data.sequenceSlug);

  const lines: string[] = [];

  lines.push('/**');
  lines.push(` * Count of lessons in ${data.sequenceSlug}.`);
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(' */');
  lines.push(`export const ${countName} = ${data.lessonCount} as const;`);
  lines.push('');
  lines.push('/**');
  lines.push(` * Set of valid slugs for ${data.sequenceSlug} runtime validation.`);
  lines.push(' *');
  lines.push(` * Total slugs: ${data.lessonCount}`);
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(' */');
  lines.push(
    `export const ${setName}: ReadonlySet<string> = createLessonSlugSet('${escapeForSingleQuote(data.sequenceSlug)}');`,
  );

  return lines.join('\n');
}

/**
 * Generates types for the JSON-backed lesson slug dataset.
 */
export function emitLessonSlugDatasetTypes(): string {
  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * Types for the JSON-backed lesson slug dataset.');
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(' */');
  lines.push('');
  lines.push('export interface LessonSlugDatasetSequenceData {');
  lines.push('  readonly subject: string;');
  lines.push("  readonly phase: 'primary' | 'secondary';");
  lines.push('  readonly sequenceSlug: string;');
  lines.push('  readonly lessonCount: number;');
  lines.push('  readonly lessonSlugs: readonly string[];');
  lines.push('}');
  lines.push('');
  lines.push('export interface LessonSlugDataset {');
  lines.push('  readonly generatedAt: string;');
  lines.push('  readonly totalLessonSlugCount: number;');
  lines.push('  readonly sequenceOrder: readonly string[];');
  lines.push('  readonly allLessonSlugs: readonly string[];');
  lines.push('  readonly sequences: Readonly<Record<string, LessonSlugDatasetSequenceData>>;');
  lines.push('}');
  return lines.join('\n');
}

/**
 * Generates the loader module that reads the JSON-backed lesson slug dataset.
 */
export function emitAllLessonSlugTypes(allData: readonly ParsedBulkData[]): string {
  const lines: string[] = [];
  const totalCount = allData.reduce((sum, data) => sum + data.lessonCount, 0);

  lines.push('/**');
  lines.push(' * Generated lesson slug validation data from bulk download files.');
  lines.push(' *');
  lines.push(' * Provides runtime validation Sets and type guards for ground truth lesson slugs.');
  lines.push(' * Uses a JSON-backed loader to avoid monolithic generated TypeScript data files.');
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(` * Generated at: ${new Date().toISOString()}`);
  lines.push(' */');
  lines.push('');
  lines.push("import rawLessonSlugData from './lesson-slugs-by-subject.data.json';");
  lines.push("import { typeSafeEntries } from '@oaknational/type-helpers';");
  lines.push(
    "import type { LessonSlugDataset, LessonSlugDatasetSequenceData } from './lesson-slugs-by-subject.types.js';",
  );
  lines.push('');
  lines.push(
    "function parseLessonSlugPhase(phase: string): LessonSlugDatasetSequenceData['phase'] {",
  );
  lines.push("  if (phase === 'primary' || phase === 'secondary') {");
  lines.push('    return phase;');
  lines.push('  }');
  lines.push('  throw new Error(`Invalid lesson slug dataset phase: ${phase}`);');
  lines.push('}');
  lines.push('');
  lines.push('function loadLessonSlugData(): LessonSlugDataset {');
  lines.push('  const sequences: Record<string, LessonSlugDatasetSequenceData> = {};');
  lines.push(
    '  for (const [sequenceSlug, sequenceData] of typeSafeEntries(rawLessonSlugData.sequences)) {',
  );
  lines.push('    sequences[sequenceSlug] = {');
  lines.push('      subject: sequenceData.subject,');
  lines.push('      phase: parseLessonSlugPhase(sequenceData.phase),');
  lines.push('      sequenceSlug: sequenceData.sequenceSlug,');
  lines.push('      lessonCount: sequenceData.lessonCount,');
  lines.push('      lessonSlugs: sequenceData.lessonSlugs,');
  lines.push('    };');
  lines.push('  }');
  lines.push('');
  lines.push('  return {');
  lines.push('    generatedAt: rawLessonSlugData.generatedAt,');
  lines.push('    totalLessonSlugCount: rawLessonSlugData.totalLessonSlugCount,');
  lines.push('    sequenceOrder: rawLessonSlugData.sequenceOrder,');
  lines.push('    allLessonSlugs: rawLessonSlugData.allLessonSlugs,');
  lines.push('    sequences,');
  lines.push('  };');
  lines.push('}');
  lines.push('');
  lines.push('const lessonSlugData = loadLessonSlugData();');
  lines.push('');
  lines.push('');
  lines.push('function getSequenceData(sequenceSlug: string): LessonSlugDatasetSequenceData {');
  lines.push('  const sequenceData = lessonSlugData.sequences[sequenceSlug];');
  lines.push('  if (sequenceData === undefined) {');
  lines.push('    throw new Error(`Missing lesson slug data for sequence: ${sequenceSlug}`);');
  lines.push('  }');
  lines.push('  return sequenceData;');
  lines.push('}');
  lines.push('');

  lines.push('/**');
  lines.push(' * Combined Set of all valid lesson slugs for runtime validation.');
  lines.push(' *');
  lines.push(` * Total slugs: ${totalCount}`);
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push(
    'export const ALL_LESSON_SLUGS: ReadonlySet<string> = new Set(lessonSlugData.allLessonSlugs);',
  );
  lines.push('');
  lines.push('/** Total lessons across all subjects */');
  lines.push(`export const TOTAL_LESSON_SLUG_COUNT = ${totalCount} as const;`);
  lines.push('');
  lines.push('function buildSlugToSubjectMap(): Map<string, string> {');
  lines.push('  const map = new Map<string, string>();');
  lines.push('  for (const sequenceSlug of lessonSlugData.sequenceOrder) {');
  lines.push('    const sequenceData = getSequenceData(sequenceSlug);');
  lines.push('    for (const lessonSlug of sequenceData.lessonSlugs) {');
  lines.push('      map.set(lessonSlug, sequenceData.subject);');
  lines.push('    }');
  lines.push('  }');
  lines.push('  return map;');
  lines.push('}');
  lines.push('');
  lines.push('const SLUG_TO_SUBJECT: ReadonlyMap<string, string> = buildSlugToSubjectMap();');
  lines.push('');
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
