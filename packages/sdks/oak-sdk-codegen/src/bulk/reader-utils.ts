/**
 * Pure utility functions for bulk download filename and sequence-slug parsing.
 *
 * @remarks
 * Separated from {@link reader} to avoid transitive dependency on generated
 * types. Functions here operate on strings only.
 */

/**
 * Subject and phase extracted from a bulk download filename.
 */
import { err, ok, type Result } from '@oaknational/result';

export interface SubjectPhase {
  /** Subject slug (e.g., 'maths', 'design-technology') */
  readonly subject: string;
  /** Phase (primary or secondary) */
  readonly phase: 'primary' | 'secondary';
}

/**
 * Extracts subject and phase from a bulk download filename.
 *
 * @param filename - The filename (e.g., 'maths-primary.json')
 * @returns Subject and phase, or undefined if filename doesn't match pattern
 *
 * @example
 * ```ts
 * extractSubjectPhase('maths-primary.json')
 * // Returns: { subject: 'maths', phase: 'primary' }
 *
 * extractSubjectPhase('design-technology-secondary.json')
 * // Returns: { subject: 'design-technology', phase: 'secondary' }
 * ```
 */
export function extractSubjectPhase(filename: string): SubjectPhase | undefined {
  const match = /^(.+)-(primary|secondary)\.json$/.exec(filename);
  if (!match) {
    return undefined;
  }
  const subject = match[1];
  const phase = match[2];
  if (phase !== 'primary' && phase !== 'secondary') {
    return undefined;
  }
  return { subject, phase };
}

/**
 * The subject a bulk sequence slug names: the slug with its phase suffix
 * removed (`maths-primary` → `maths`). A slug carrying no phase suffix names
 * its subject as-is.
 *
 * @param sequenceSlug - The bulk file's sequence slug (e.g., 'french-primary')
 * @returns The subject slug
 */
export function sequenceSubject(sequenceSlug: string): string {
  return sequenceSlug.replace(/-(primary|secondary)$/, '');
}

/**
 * Bulk-directory files that are not subject-phase data and are skipped on
 * purpose: the download's own manifest and the upstream JSON Schema.
 */
export const NON_DATA_BULK_FILES: ReadonlySet<string> = new Set(['manifest.json', 'schema.json']);

/**
 * Classifies a `.json` file found in the bulk directory.
 *
 * @remarks
 * The reader used to skip any name that did not parse as
 * `<subject>-<phase>.json` without a word. A subject file with an unexpected
 * name would then vanish from the corpus silently, taking its authored order
 * with it. Only the two known non-data files may be skipped; anything else
 * that fails to parse is an error for the caller to raise.
 */
export function classifyBulkFilename(filename: string): 'data' | 'non-data' | 'unrecognised' {
  if (extractSubjectPhase(filename) !== undefined) {
    return 'data';
  }
  return NON_DATA_BULK_FILES.has(filename) ? 'non-data' : 'unrecognised';
}

/**
 * Returns the sequence slugs that more than one file carries, in first-seen
 * order; empty when the one-file-per-sequence invariant holds.
 *
 * @remarks
 * The thread extractor numbers each sequence's units with a counter keyed by
 * sequence slug that persists across the whole file walk, and file discovery
 * is an unsorted `readdir`. One sequence split across two files would
 * therefore be numbered in filesystem order — a different corpus order per
 * machine, with every determinism test green. The invariant is load-bearing,
 * so the reader refuses the walk rather than trusting it.
 */
export function duplicateSequenceSlugs(
  files: readonly { readonly filename: string; readonly sequenceSlug: string }[],
): readonly string[] {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const file of files) {
    const first = seen.get(file.sequenceSlug);
    if (first === undefined) {
      seen.set(file.sequenceSlug, file.filename);
    } else if (!duplicates.includes(file.sequenceSlug)) {
      duplicates.push(file.sequenceSlug);
    }
  }
  return duplicates;
}

/**
 * Checks the discovered bulk file set against the two invariants the corpus
 * order depends on, as a Result for the reader to raise at its boundary.
 */
export function checkBulkFileSet(
  files: readonly { readonly filename: string; readonly sequenceSlug: string | undefined }[],
): Result<void, Error> {
  const unrecognised = files
    .filter((file) => classifyBulkFilename(file.filename) === 'unrecognised')
    .map((file) => file.filename);
  if (unrecognised.length > 0) {
    return err(
      new Error(
        `bulk file(s) ${unrecognised.join(', ')} are neither <subject>-<phase>.json nor a known ` +
          'non-data file; a subject file under an unexpected name would otherwise drop out of the corpus silently',
      ),
    );
  }
  const duplicates = duplicateSequenceSlugs(
    files.flatMap((file) =>
      file.sequenceSlug === undefined
        ? []
        : [{ filename: file.filename, sequenceSlug: file.sequenceSlug }],
    ),
  );
  if (duplicates.length > 0) {
    return err(
      new Error(
        `bulk directory carries more than one file for sequence(s) ${duplicates.join(', ')}; the thread ` +
          'extractor numbers a sequence across the whole walk, so a split sequence would take filesystem order',
      ),
    );
  }
  return ok(undefined);
}
