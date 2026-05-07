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

  lines.push(
    '/**',
    ` * Count of lessons in ${data.sequenceSlug}.`,
    ' *',
    ' * @generated - DO NOT EDIT',
    ' */',
    `export const ${countName} = ${data.lessonCount} as const;`,
    '',
    '/**',
    ` * Set of valid slugs for ${data.sequenceSlug} runtime validation.`,
    ' *',
    ` * Total slugs: ${data.lessonCount}`,
    ' *',
    ' * @generated - DO NOT EDIT',
    ' */',
    `export const ${setName}: ReadonlySet<string> = createLessonSlugSet('${escapeForSingleQuote(data.sequenceSlug)}');`,
  );

  return lines.join('\n');
}

/**
 * Generates types for the JSON-backed lesson slug dataset.
 */
export function emitLessonSlugDatasetTypes(): string {
  const lines: string[] = [];
  lines.push(
    '/**',
    ' * Types for the JSON-backed lesson slug dataset.',
    ' *',
    ' * @generated - DO NOT EDIT',
    ' */',
    '',
    'export interface LessonSlugDatasetSequenceData {',
    '  readonly subject: string;',
    "  readonly phase: 'primary' | 'secondary';",
    '  readonly sequenceSlug: string;',
    '  readonly lessonCount: number;',
    '  readonly lessonSlugs: readonly string[];',
    '}',
    '',
    'export interface LessonSlugDataset {',
    '  readonly generatedAt: string;',
    '  readonly totalLessonSlugCount: number;',
    '  readonly sequenceOrder: readonly string[];',
    '  readonly allLessonSlugs: readonly string[];',
    '  readonly sequences: Readonly<Record<string, LessonSlugDatasetSequenceData>>;',
    '}',
  );
  return lines.join('\n');
}

/**
 * Generates the loader module that reads the JSON-backed lesson slug dataset.
 */
export function emitAllLessonSlugTypes(allData: readonly ParsedBulkData[]): string {
  const lines: string[] = [];
  const totalCount = allData.reduce((sum, data) => sum + data.lessonCount, 0);

  lines.push(
    '/**',
    ' * Generated lesson slug validation data from bulk download files.',
    ' *',
    ' * Provides runtime validation Sets and type guards for ground truth lesson slugs.',
    ' * Uses a JSON-backed loader to avoid monolithic generated TypeScript data files.',
    ' *',
    ' * @generated - DO NOT EDIT',
    ` * Generated at: ${new Date().toISOString()}`,
    ' */',
    '',
    "import rawLessonSlugData from './lesson-slugs-by-subject.data.json';",
    "import { typeSafeEntries } from '@oaknational/type-helpers';",
    "import type { LessonSlugDataset, LessonSlugDatasetSequenceData } from './lesson-slugs-by-subject.types.js';",
    '',
    "function parseLessonSlugPhase(phase: string): LessonSlugDatasetSequenceData['phase'] {",
    "  if (phase === 'primary' || phase === 'secondary') {",
    '    return phase;',
    '  }',
    '  throw new Error(`Invalid lesson slug dataset phase: ${phase}`);',
    '}',
    '',
    'function loadLessonSlugData(): LessonSlugDataset {',
    '  const sequences: Record<string, LessonSlugDatasetSequenceData> = {};',

    '  for (const [sequenceSlug, sequenceData] of typeSafeEntries(rawLessonSlugData.sequences)) {',
    '    sequences[sequenceSlug] = {',
    '      subject: sequenceData.subject,',
    '      phase: parseLessonSlugPhase(sequenceData.phase),',
    '      sequenceSlug: sequenceData.sequenceSlug,',
    '      lessonCount: sequenceData.lessonCount,',
    '      lessonSlugs: sequenceData.lessonSlugs,',
    '    };',
    '  }',
    '',
    '  return {',
    '    generatedAt: rawLessonSlugData.generatedAt,',
    '    totalLessonSlugCount: rawLessonSlugData.totalLessonSlugCount,',
    '    sequenceOrder: rawLessonSlugData.sequenceOrder,',
    '    allLessonSlugs: rawLessonSlugData.allLessonSlugs,',
    '    sequences,',
    '  };',
    '}',
    '',
    'const lessonSlugData = loadLessonSlugData();',
    '',
    '',
    'function getSequenceData(sequenceSlug: string): LessonSlugDatasetSequenceData {',
    '  const sequenceData = lessonSlugData.sequences[sequenceSlug];',
    '  if (sequenceData === undefined) {',
    '    throw new Error(`Missing lesson slug data for sequence: ${sequenceSlug}`);',
    '  }',
    '  return sequenceData;',
    '}',
    '',
    '/**',
    ' * Combined Set of all valid lesson slugs for runtime validation.',
    ' *',
    ` * Total slugs: ${totalCount}`,
    ' *',
    ' * @generated',
    ' */',
    'export const ALL_LESSON_SLUGS: ReadonlySet<string> = new Set(lessonSlugData.allLessonSlugs);',
    '',
    '/** Total lessons across all subjects */',
    `export const TOTAL_LESSON_SLUG_COUNT = ${totalCount} as const;`,
    '',
    'function buildSlugToSubjectMap(): Map<string, string> {',
    '  const map = new Map<string, string>();',
    '  for (const sequenceSlug of lessonSlugData.sequenceOrder) {',
    '    const sequenceData = getSequenceData(sequenceSlug);',
    '    for (const lessonSlug of sequenceData.lessonSlugs) {',
    '      map.set(lessonSlug, sequenceData.subject);',
    '    }',
    '  }',
    '  return map;',
    '}',
    '',
    'const SLUG_TO_SUBJECT: ReadonlyMap<string, string> = buildSlugToSubjectMap();',
    '',
    '/**',
    ' * Get the subject for a given lesson slug.',
    ' *',
    ' * @param slug - Lesson slug to look up',
    ' * @returns Subject slug, or undefined if slug not found',
    ' *',
    ' * @example',
    ' * ```typescript',
    " * getSubjectForSlug('adding-fractions'); // 'maths'",
    " * getSubjectForSlug('photosynthesis'); // 'science'",
    ' * ```',
    ' */',
    'export function getSubjectForSlug(slug: string): string | undefined {',
    '  return SLUG_TO_SUBJECT.get(slug);',
    '}',
  );

  return lines.join('\n');
}
