/**
 * Bulk Data Parser
 *
 * Parses Oak curriculum bulk download JSON files and extracts lesson data
 * for ground truth type generation.
 *
 * The bulk data format is:
 * ```json
 * {
 *   "lessons": [
 *     {
 *       "lessonSlug": "adding-fractions",
 *       "lessonTitle": "Adding fractions",
 *       "subjectSlug": "maths",
 *       "keyStageSlug": "ks2",
 *       "unitSlug": "fractions-unit"
 *     }
 *   ],
 *   "sequenceSlug": "maths-primary",
 *   "subjectTitle": "Maths"
 * }
 * ```
 */

import { ok, err, type Result } from '@oaknational/result';

// ============================================================================
// Types
// ============================================================================

/**
 * A lesson entry from bulk download data.
 *
 * Contains only the fields required for ground truth validation.
 * Additional fields in the bulk data are ignored.
 */
export interface BulkLesson {
  /** Unique lesson identifier slug (e.g., "adding-fractions") */
  readonly lessonSlug: string;
  /** Human-readable lesson title */
  readonly lessonTitle: string;
  /** Subject slug (e.g., "maths", "science") */
  readonly subjectSlug: string;
  /** Key stage slug (e.g., "ks1", "ks2", "ks3", "ks4") */
  readonly keyStageSlug: string;
  /** Unit slug the lesson belongs to */
  readonly unitSlug: string;
}

/**
 * Parsed bulk data file structure.
 *
 * Represents the validated structure of a bulk download JSON file.
 */
export interface BulkDataFile {
  /** Array of lessons in this subject/phase */
  readonly lessons: readonly BulkLesson[];
  /** Sequence slug (e.g., "maths-primary", "science-secondary") */
  readonly sequenceSlug: string;
  /** Human-readable subject title */
  readonly subjectTitle: string;
}

/**
 * Error returned when parsing fails.
 */
export interface BulkDataParseError {
  /** Error classification */
  readonly kind: 'parse_error' | 'validation_error';
  /** Human-readable error message */
  readonly message: string;
  /** Original error if available */
  readonly cause?: unknown;
}

interface BulkValidationObject {
  readonly keyStageSlug?: unknown;
  readonly lessonSlug?: unknown;
  readonly lessonTitle?: unknown;
  readonly lessons?: unknown;
  readonly sequenceSlug?: unknown;
  readonly subjectSlug?: unknown;
  readonly subjectTitle?: unknown;
  readonly unitSlug?: unknown;
}

/**
 * Phase derived from bulk data filename.
 */
export type Phase = 'primary' | 'secondary';

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a value has the required BulkLesson fields.
 *
 * @param value - The value to check
 * @returns True if value has all required BulkLesson string fields
 */
function isBulkLesson(value: unknown): value is BulkLesson {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    'lessonSlug' in value &&
    typeof value.lessonSlug === 'string' &&
    'lessonTitle' in value &&
    typeof value.lessonTitle === 'string' &&
    'subjectSlug' in value &&
    typeof value.subjectSlug === 'string' &&
    'keyStageSlug' in value &&
    typeof value.keyStageSlug === 'string' &&
    'unitSlug' in value &&
    typeof value.unitSlug === 'string'
  );
}

/**
 * Type guard to check if a value is a valid bulk data structure.
 *
 * @param value - The value to check
 * @returns True if value has lessons array and required metadata
 */
function hasBulkDataStructure(
  value: unknown,
): value is { lessons: unknown[]; sequenceSlug: string; subjectTitle: string } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    'lessons' in value &&
    Array.isArray(value.lessons) &&
    'sequenceSlug' in value &&
    typeof value.sequenceSlug === 'string' &&
    'subjectTitle' in value &&
    typeof value.subjectTitle === 'string'
  );
}

// ============================================================================
// Parsing Functions
// ============================================================================

/**
 * Parses a bulk data JSON string into a validated BulkDataFile.
 *
 * Validates the structure and all required fields, returning an error
 * if the data doesn't match the expected format.
 *
 * @param json - Raw JSON string from bulk download file
 * @returns Result with parsed data or error
 *
 * @example
 * ```typescript
 * const json = fs.readFileSync('maths-primary.json', 'utf-8');
 * const result = parseBulkDataFile(json);
 * if (result.ok) {
 *   console.log(`Found ${result.value.lessons.length} lessons`);
 * } else {
 *   console.error(`Parse error: ${result.error.message}`);
 * }
 * ```
 */
export function parseBulkDataFile(json: string): Result<BulkDataFile, BulkDataParseError> {
  // Step 1: Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return err({
      kind: 'parse_error',
      message: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}`,
      cause: e,
    });
  }

  // Step 2: Validate top-level structure
  if (!hasBulkDataStructure(parsed)) {
    return err(describeBulkDataStructureError(parsed));
  }

  // Step 3: Validate each lesson
  const lessons: BulkLesson[] = [];
  for (let i = 0; i < parsed.lessons.length; i++) {
    const lesson = parsed.lessons[i];
    if (!isBulkLesson(lesson)) {
      return err(describeBulkLessonError(lesson, i));
    }
    lessons.push({
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      subjectSlug: lesson.subjectSlug,
      keyStageSlug: lesson.keyStageSlug,
      unitSlug: lesson.unitSlug,
    });
  }

  return ok({
    lessons,
    sequenceSlug: parsed.sequenceSlug,
    subjectTitle: parsed.subjectTitle,
  });
}

function describeBulkDataStructureError(parsed: unknown): BulkDataParseError {
  if (typeof parsed !== 'object' || parsed === null) {
    return {
      kind: 'validation_error',
      message: 'Expected an object with lessons array',
    };
  }
  const missingFields = collectMissingStringFields(parsed, ['sequenceSlug', 'subjectTitle']);
  if (!('lessons' in parsed) || !Array.isArray(parsed.lessons)) {
    missingFields.unshift('lessons (array)');
  }
  return {
    kind: 'validation_error',
    message: `Missing or invalid fields: ${missingFields.join(', ')}`,
  };
}

function describeBulkLessonError(lesson: unknown, index: number): BulkDataParseError {
  if (typeof lesson !== 'object' || lesson === null) {
    return {
      kind: 'validation_error',
      message: `Lesson at index ${index} is not an object`,
    };
  }
  return {
    kind: 'validation_error',
    message: `Lesson at index ${index} missing fields: ${collectMissingStringFields(lesson, [
      'lessonSlug',
      'lessonTitle',
      'subjectSlug',
      'keyStageSlug',
      'unitSlug',
    ]).join(', ')}`,
  };
}

function hasStringField(value: BulkValidationObject, field: string): boolean {
  switch (field) {
    case 'keyStageSlug':
      return 'keyStageSlug' in value && typeof value.keyStageSlug === 'string';
    case 'lessonSlug':
      return 'lessonSlug' in value && typeof value.lessonSlug === 'string';
    case 'lessonTitle':
      return 'lessonTitle' in value && typeof value.lessonTitle === 'string';
    case 'sequenceSlug':
      return 'sequenceSlug' in value && typeof value.sequenceSlug === 'string';
    case 'subjectSlug':
      return 'subjectSlug' in value && typeof value.subjectSlug === 'string';
    case 'subjectTitle':
      return 'subjectTitle' in value && typeof value.subjectTitle === 'string';
    case 'unitSlug':
      return 'unitSlug' in value && typeof value.unitSlug === 'string';
    default:
      return false;
  }
}

function collectMissingStringFields(
  value: BulkValidationObject,
  fieldNames: readonly string[],
): string[] {
  return fieldNames.filter((field) => !hasStringField(value, field));
}

/**
 * Extracts unique lesson slugs from parsed bulk data.
 *
 * Preserves the order of first occurrence while removing duplicates.
 *
 * @param data - Parsed bulk data file
 * @returns Array of unique lesson slugs in order of first occurrence
 *
 * @example
 * ```typescript
 * const slugs = extractLessonSlugs(bulkData);
 * // ['adding-fractions', 'subtracting-fractions', ...]
 * ```
 */
export function extractLessonSlugs(data: BulkDataFile): readonly string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];

  for (const lesson of data.lessons) {
    if (!seen.has(lesson.lessonSlug)) {
      seen.add(lesson.lessonSlug);
      slugs.push(lesson.lessonSlug);
    }
  }

  return slugs;
}

/**
 * Parses the phase (primary/secondary) from a bulk data filename.
 *
 * @param filename - Bulk data filename (e.g., "maths-primary.json")
 * @returns 'primary' or 'secondary', or null if not a valid bulk data filename
 *
 * @example
 * ```typescript
 * parsePhaseFromFilename('maths-primary.json'); // 'primary'
 * parsePhaseFromFilename('science-secondary.json'); // 'secondary'
 * parsePhaseFromFilename('manifest.json'); // null
 * ```
 */
export function parsePhaseFromFilename(filename: string): Phase | null {
  if (filename.endsWith('-primary.json')) {
    return 'primary';
  }
  if (filename.endsWith('-secondary.json')) {
    return 'secondary';
  }
  return null;
}
