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
 *
 * @packageDocumentation
 */

/* eslint-disable max-lines, max-lines-per-function, max-statements, complexity, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-restricted-types */
// Type assertions and Record<string, unknown> are required for safe JSON parsing from unknown
// This is the boundary where external data enters our system

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
  const obj = value as Partial<Record<string, unknown>>;
  return (
    typeof obj['lessonSlug'] === 'string' &&
    typeof obj['lessonTitle'] === 'string' &&
    typeof obj['subjectSlug'] === 'string' &&
    typeof obj['keyStageSlug'] === 'string' &&
    typeof obj['unitSlug'] === 'string'
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
  const obj = value as Partial<Record<string, unknown>>;
  return (
    Array.isArray(obj['lessons']) &&
    typeof obj['sequenceSlug'] === 'string' &&
    typeof obj['subjectTitle'] === 'string'
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
    const missingFields: string[] = [];
    if (typeof parsed !== 'object' || parsed === null) {
      return err({
        kind: 'validation_error',
        message: 'Expected an object with lessons array',
      });
    }
    const obj = parsed as Partial<Record<string, unknown>>;
    if (!Array.isArray(obj['lessons'])) {
      missingFields.push('lessons (array)');
    }
    if (typeof obj['sequenceSlug'] !== 'string') {
      missingFields.push('sequenceSlug');
    }
    if (typeof obj['subjectTitle'] !== 'string') {
      missingFields.push('subjectTitle');
    }
    return err({
      kind: 'validation_error',
      message: `Missing or invalid fields: ${missingFields.join(', ')}`,
    });
  }

  // Step 3: Validate each lesson
  const lessons: BulkLesson[] = [];
  for (let i = 0; i < parsed.lessons.length; i++) {
    const lesson = parsed.lessons[i];
    if (!isBulkLesson(lesson)) {
      const missingFields: string[] = [];
      if (typeof lesson !== 'object' || lesson === null) {
        return err({
          kind: 'validation_error',
          message: `Lesson at index ${i} is not an object`,
        });
      }
      const lessonObj = lesson as Partial<Record<string, unknown>>;
      if (typeof lessonObj['lessonSlug'] !== 'string') {
        missingFields.push('lessonSlug');
      }
      if (typeof lessonObj['lessonTitle'] !== 'string') {
        missingFields.push('lessonTitle');
      }
      if (typeof lessonObj['subjectSlug'] !== 'string') {
        missingFields.push('subjectSlug');
      }
      if (typeof lessonObj['keyStageSlug'] !== 'string') {
        missingFields.push('keyStageSlug');
      }
      if (typeof lessonObj['unitSlug'] !== 'string') {
        missingFields.push('unitSlug');
      }
      return err({
        kind: 'validation_error',
        message: `Lesson at index ${i} missing fields: ${missingFields.join(', ')}`,
      });
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
