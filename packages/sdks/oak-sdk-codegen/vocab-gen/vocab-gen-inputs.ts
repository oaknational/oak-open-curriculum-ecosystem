/**
 * Bulk-data input preparation for the vocabulary mining pipeline.
 *
 * Applies the restricted-lesson exclusion policy (ADR-224) to read bulk
 * files and shapes them into pipeline inputs — a distinct responsibility
 * from the pipeline orchestration in `vocab-gen.ts`.
 */
import {
  excludeRestrictedLessons,
  type BulkFileResult,
  type RestrictedLessonExclusionOptions,
} from './lib/index.js';
import { type BulkDataInput } from './vocab-gen-core.js';

/** Result of preparing pipeline inputs from read bulk files */
export interface BulkDataInputsResult {
  /**
   * Pipeline inputs after the restricted-lesson exclusion policy is applied:
   * restricted lessons and their unit references removed by default, retained
   * when `includeRestricted` is set (ADR-224).
   */
  readonly inputs: readonly BulkDataInput[];
  /**
   * Number of restricted lesson records excluded (reported on every run;
   * zero when `includeRestricted` retains them).
   */
  readonly restrictedLessonsExcluded: number;
}

/**
 * Prepares pipeline inputs from read bulk files, applying the
 * restricted-lesson exclusion policy first — exclude by default, retain when
 * `options.includeRestricted` is set (ADR-224; provenance and revisit
 * condition live on `src/bulk/restricted-lesson-filter.ts`).
 */
export function toBulkDataInputs(
  files: readonly BulkFileResult[],
  options: RestrictedLessonExclusionOptions = {},
): BulkDataInputsResult {
  const filtered = excludeRestrictedLessons(files, options);
  const inputs = filtered.files.map((file) => ({
    sequenceSlug: file.data.sequenceSlug,
    lessons: file.data.lessons,
    units: file.data.sequence,
  }));
  return { inputs, restrictedLessonsExcluded: filtered.restrictedLessonsExcluded };
}
