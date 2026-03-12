/**
 * Pure functions for ingestion verification.
 *
 * Provides utilities to compare bulk download lesson data against
 * indexed lessons in Elasticsearch, identifying any gaps.
 */

/**
 * Minimal lesson structure from bulk download data.
 *
 * Only includes fields needed for verification.
 */
export interface BulkDownloadLesson {
  /** The unique lesson identifier. */
  readonly lessonSlug: string;
  /** The key stage slug (e.g., 'ks3', 'ks4'). */
  readonly keyStageSlug: string;
}

/**
 * Bulk download data structure.
 *
 * Represents the JSON structure of Oak bulk download files.
 */
export interface BulkDownloadData {
  /** Array of lessons in the bulk download. */
  readonly lessons: readonly BulkDownloadLesson[];
}

/**
 * Runtime type guard for bulk download payloads.
 */
export function isBulkDownloadData(data: unknown): data is BulkDownloadData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  if (!('lessons' in data)) {
    return false;
  }
  const lessons = data.lessons;
  if (!Array.isArray(lessons)) {
    return false;
  }
  return lessons.every(isBulkDownloadLesson);
}

/**
 * Runtime type guard for a single bulk lesson item.
 */
function isBulkDownloadLesson(lesson: unknown): lesson is BulkDownloadLesson {
  if (typeof lesson !== 'object' || lesson === null) {
    return false;
  }
  if (!('lessonSlug' in lesson) || !('keyStageSlug' in lesson)) {
    return false;
  }
  return typeof lesson.lessonSlug === 'string' && typeof lesson.keyStageSlug === 'string';
}

/**
 * Parameters for generating a verification report.
 */
export interface VerificationReportParams {
  /** Subject being verified (e.g., 'maths'). */
  readonly subject: string;
  /** Key stage being verified (e.g., 'ks4'). */
  readonly keyStage: string;
  /** Number of lessons expected from bulk download. */
  readonly expectedCount: number;
  /** Number of lessons found in Elasticsearch. */
  readonly indexedCount: number;
  /** Lesson slugs that are missing from Elasticsearch. */
  readonly missingLessons: readonly string[];
}

/**
 * Result of resolving the bulk download file path for verification.
 */
export type BulkDownloadPathResolution =
  | {
      readonly ok: true;
      readonly value: string;
    }
  | {
      readonly ok: false;
      readonly error: string;
    };

/**
 * Input required to resolve verification bulk download path.
 */
export interface VerificationBulkPathInput {
  /** Raw `--bulk-download` flag value, if supplied. */
  readonly bulkDownloadPathArg: string;
  /** Optional `BULK_DOWNLOAD_DIR` from environment. */
  readonly bulkDownloadDirFromEnv: string | undefined;
  /** Subject being verified. */
  readonly subject: string;
  /** Key stage being verified. */
  readonly keyStage: string;
}

/**
 * Extracts unique lesson slugs for a specific key stage from bulk download data.
 *
 * The bulk download may contain duplicate lesson entries (e.g., same lesson
 * appearing in both Foundation and Higher tiers). This function deduplicates
 * them and returns only unique slugs.
 *
 * @param data - The bulk download data structure
 * @param keyStage - The key stage to filter by (e.g., 'ks4')
 * @returns Array of unique lesson slugs matching the key stage
 */
export function extractLessonsFromBulkDownload(data: BulkDownloadData, keyStage: string): string[] {
  const slugs = data.lessons
    .filter((lesson) => lesson.keyStageSlug === keyStage)
    .map((lesson) => lesson.lessonSlug);
  // Return unique slugs
  return [...new Set(slugs)];
}

/**
 * Finds lessons that are expected but missing from the indexed set.
 *
 * @param expected - Array of expected lesson slugs (from bulk download)
 * @param indexed - Array of indexed lesson slugs (from Elasticsearch)
 * @returns Array of lesson slugs that are missing
 */
export function findMissingLessons(
  expected: readonly string[],
  indexed: readonly string[],
): string[] {
  const indexedSet = new Set(indexed);
  return expected.filter((slug) => !indexedSet.has(slug));
}

/**
 * Resolve the bulk download file path provided by CLI arguments.
 *
 * Verification must never silently fall back to an implicit fixture location.
 * Callers must provide an explicit file path so the verification dataset is
 * unambiguous and matches the ingest run under test.
 *
 * @param bulkDownloadPathArg - Raw `--bulk-download` argument value
 * @returns Resolution result with either the provided path or an error
 */
function resolveBulkFileName(subject: string, keyStage: string): string {
  if (subject === 'maths') {
    return keyStage === 'ks4' ? 'maths-secondary.json' : 'maths-primary.json';
  }
  return `${subject}.json`;
}

/**
 * Resolve the verification bulk download file path.
 *
 * Resolution precedence:
 * 1. `--bulk-download` exact file path (respected verbatim)
 * 2. `BULK_DOWNLOAD_DIR` + derived subject/key-stage file name
 *
 * There is intentionally no hidden hardcoded repository fallback.
 */
export function resolveBulkDownloadPath(
  input: VerificationBulkPathInput,
): BulkDownloadPathResolution {
  if (input.bulkDownloadPathArg.length > 0) {
    return {
      ok: true,
      value: input.bulkDownloadPathArg,
    };
  }
  if (!input.bulkDownloadDirFromEnv || input.bulkDownloadDirFromEnv.length === 0) {
    return {
      ok: false,
      error:
        'Missing bulk download source. Provide --bulk-download <file> or set BULK_DOWNLOAD_DIR in env.',
    };
  }
  const fileName = resolveBulkFileName(input.subject, input.keyStage);
  return {
    ok: true,
    value: `${input.bulkDownloadDirFromEnv}/${fileName}`,
  };
}

/**
 * Maximum number of missing lessons to display in the report.
 */
const MAX_MISSING_TO_DISPLAY = 20;

/**
 * Generates a human-readable verification report.
 *
 * @param params - Report parameters
 * @returns Formatted multi-line report string
 */
export function generateVerificationReport(params: VerificationReportParams): string {
  const { subject, keyStage, expectedCount, indexedCount, missingLessons } = params;
  const passed = missingLessons.length === 0;

  const lines: string[] = [
    '',
    '='.repeat(60),
    `Verification: ${passed ? 'PASSED ✓' : 'FAILED ✗'}`,
    '='.repeat(60),
    '',
    `Subject: ${subject}, Key Stage: ${keyStage}`,
    `Expected: ${expectedCount}, Indexed: ${indexedCount}, Missing: ${missingLessons.length}`,
    '',
  ];

  if (missingLessons.length > 0) {
    lines.push('Missing lessons:');

    const displayCount = Math.min(missingLessons.length, MAX_MISSING_TO_DISPLAY);
    for (let i = 0; i < displayCount; i++) {
      lines.push(`  - ${missingLessons[i]}`);
    }

    if (missingLessons.length > MAX_MISSING_TO_DISPLAY) {
      const remaining = missingLessons.length - MAX_MISSING_TO_DISPLAY;
      lines.push(`  ... and ${remaining} more`);
    }

    lines.push('');
  }

  return lines.join('\n');
}
