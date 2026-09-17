/**
 * Restricted-lesson exclusion at the bulk-data boundary.
 *
 * @remarks
 * Removes lessons flagged `restricted: true` by upstream, and prunes the
 * matching `unitLessons` references on every unit, before bulk data enters
 * a downstream generator. Pruning the unit references matters as much as
 * removing the lesson documents — restricted lesson slugs and titles would
 * otherwise survive into unit `lesson_ids`, semantic summary text, and
 * sequence facet counts.
 *
 * Applied call sites: the vocab-gen pipeline (`toBulkDataInputs`) in this
 * package; the Elasticsearch ingest boundary (`prepareBulkIngestion`) and
 * the ingestion verifier's expected-set land with the search-cli change of
 * this two-PR train.
 *
 * This is a deliberate product decision, not a technical constraint. The
 * MCP-204 ruling (owner-directed, 2026-07-27) excludes restricted lessons
 * from generated and served surfaces at generation time — "we filter what
 * goes in" — to support on-time submission. The decision is revisited
 * post-submission if a higher-value approach exists (e.g. index-all +
 * filter-at-query); the revisit, and its honest pricing, live on MCP-204.
 *
 * The exclusion is now a documented, configurable switch (owner ruling
 * 2026-08-12: keep restricted out by default, but make the choice a switch,
 * not a hardcoded filter — see {@link RestrictedLessonExclusionOptions}). It
 * defaults to exclude, so the standing behaviour is unchanged; the choice is a
 * parameter each consumer passes, not a code edit.
 *
 * Units that lose every lesson are KEPT with truthfully empty lesson
 * lists (owner ruling, 2026-07-27): their descriptions, threads,
 * prior-knowledge and national-curriculum content are legitimate
 * unrestricted curriculum data.
 *
 * Apply this filter explicitly at each consumer. It is deliberately NOT
 * folded into `readAllBulkFiles`, so the policy stays visible at every
 * call site, and every consumer reports the excluded count on each run.
 */
import type { BulkDownloadFile } from '../types/generated/bulk/index.js';
import type { BulkFileResult } from './reader.js';

/** Result of filtering a single parsed bulk file */
export interface RestrictedLessonFileResult {
  /**
   * The file data with restricted lessons and their unit references removed —
   * the per-file filter always excludes; the `includeRestricted` policy
   * switch exists only on the collection-level entry point (ADR-224).
   */
  readonly data: BulkDownloadFile;
  /**
   * Number of restricted lesson RECORDS removed from this file. A lesson
   * appearing in multiple tiers/programmes counts once per record, so the
   * distinct restricted slug count may be lower.
   */
  readonly restrictedLessonsExcluded: number;
}

/** Result of filtering a collection of read bulk files */
export interface RestrictedLessonFilesResult {
  /**
   * The files after the exclusion policy is applied: restricted lessons and
   * their unit references removed by default, unchanged when
   * `includeRestricted` retains them (ADR-224).
   */
  readonly files: readonly BulkFileResult[];
  /**
   * Total number of restricted lesson RECORDS removed across all files
   * (per-record, not per-distinct-slug — see
   * {@link RestrictedLessonFileResult.restrictedLessonsExcluded}).
   */
  readonly restrictedLessonsExcluded: number;
}

/** Options controlling {@link excludeRestrictedLessons}. */
export interface RestrictedLessonExclusionOptions {
  /**
   * When `true`, restricted lessons are RETAINED instead of excluded — the
   * documented, configurable form of the exclusion policy (owner ruling
   * 2026-08-12: keep restricted out by default, but make the choice a switch,
   * not a hardcoded filter). Default `false`: restricted lessons are excluded,
   * reproducing the standing MCP-204 behaviour exactly.
   *
   * Including restricted lessons only removes the exclusion at this boundary;
   * it does NOT mark the retained lessons as restricted in downstream
   * documents. Threading the `restricted` flag into the lesson-document builder
   * so included lessons are labelled in results is a named follow-on, out of
   * scope here.
   */
  readonly includeRestricted?: boolean;
}

/**
 * Removes `restricted: true` lessons from a parsed bulk file and prunes
 * their `unitLessons` references from every unit in the sequence. The
 * restricted-slug set is scoped to this file: the same slug appearing
 * unrestricted in another file is untouched there.
 *
 * The input is never mutated. A file with no restricted lessons is
 * returned as-is with a zero count.
 */
export function excludeRestrictedLessonsFromFile(
  data: BulkDownloadFile,
): RestrictedLessonFileResult {
  const restrictedSlugs = new Set(
    data.lessons.filter((lesson) => lesson.restricted === true).map((lesson) => lesson.lessonSlug),
  );
  if (restrictedSlugs.size === 0) {
    return { data, restrictedLessonsExcluded: 0 };
  }

  const lessons = data.lessons.filter((lesson) => lesson.restricted !== true);
  const sequence = data.sequence.map((unit) => ({
    ...unit,
    unitLessons: unit.unitLessons.filter((ref) => !restrictedSlugs.has(ref.lessonSlug)),
  }));

  return {
    data: { ...data, sequence, lessons },
    restrictedLessonsExcluded: data.lessons.length - lessons.length,
  };
}

/**
 * Applies {@link excludeRestrictedLessonsFromFile} to every read bulk file,
 * preserving reader metadata and summing the excluded-record count for
 * run-level reporting.
 *
 * With `options.includeRestricted === true` the files are returned unchanged
 * and the excluded count is zero (see {@link RestrictedLessonExclusionOptions}).
 * The default excludes, reproducing the standing behaviour.
 */
export function excludeRestrictedLessons(
  files: readonly BulkFileResult[],
  options: RestrictedLessonExclusionOptions = {},
): RestrictedLessonFilesResult {
  if (options.includeRestricted === true) {
    return { files, restrictedLessonsExcluded: 0 };
  }
  const perFile = files.map((file) => ({
    file,
    result: excludeRestrictedLessonsFromFile(file.data),
  }));
  return {
    files: perFile.map(({ file, result }) => ({ ...file, data: result.data })),
    restrictedLessonsExcluded: perFile.reduce(
      (total, { result }) => total + result.restrictedLessonsExcluded,
      0,
    ),
  };
}

/**
 * ADR-224 boundary predicate — the canonical owner of the restricted-inclusion
 * bar (consolidate-at-second-consumer). `true` means the caller sits at an
 * artefact-producing boundary (search index or committed vocab corpus) and
 * must reject the run: restricted-lesson output awaits the labelled-serving
 * follow-on. Each boundary maps the bar into its local error shape
 * (`enforceRestrictedInclusionBoundary` in oak-search-sdk;
 * `enforceRestrictedInclusionCorpusBoundary` in vocab-gen). Removal condition:
 * retiring THIS predicate at the labelled-serving follow-on plus the owner's
 * word opens every boundary together — index families and the committed
 * corpus stay consistent by construction (ADR-224).
 */
export function isRestrictedInclusionBarred(options: RestrictedLessonExclusionOptions): boolean {
  return options.includeRestricted === true;
}
