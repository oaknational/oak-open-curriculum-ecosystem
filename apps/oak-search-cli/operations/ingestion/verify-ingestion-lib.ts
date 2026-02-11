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
 * Extracts unique lesson slugs for a specific key stage from bulk download data.
 *
 * The bulk download may contain duplicate lesson entries (e.g., same lesson
 * appearing in both Foundation and Higher tiers). This function deduplicates
 * them and returns only unique slugs.
 *
 * @param data - The bulk download data structure
 * @param keyStage - The key stage to filter by (e.g., 'ks4')
 * @returns Array of unique lesson slugs matching the key stage
 *
 * @example
 * ```typescript
 * const data = { lessons: [{ lessonSlug: 'lesson-1', keyStageSlug: 'ks4' }] };
 * const lessons = extractLessonsFromBulkDownload(data, 'ks4');
 * // ['lesson-1']
 * ```
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
 *
 * @example
 * ```typescript
 * const missing = findMissingLessons(['a', 'b', 'c'], ['a', 'c']);
 * // ['b']
 * ```
 */
export function findMissingLessons(
  expected: readonly string[],
  indexed: readonly string[],
): string[] {
  const indexedSet = new Set(indexed);
  return expected.filter((slug) => !indexedSet.has(slug));
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
 *
 * @example
 * ```typescript
 * const report = generateVerificationReport({
 *   subject: 'maths',
 *   keyStage: 'ks4',
 *   expectedCount: 100,
 *   indexedCount: 98,
 *   missingLessons: ['lesson-1', 'lesson-2'],
 * });
 * console.log(report);
 * // Verification: FAILED
 * // Subject: maths, Key Stage: ks4
 * // Expected: 100, Indexed: 98, Missing: 2
 * // ...
 * ```
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
