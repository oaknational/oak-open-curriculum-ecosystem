/**
 * Pathspec narrowing for the commit-queue workflow primitives.
 *
 * The commit-queue intent's `files` field is declared as `readonly string[]`
 * at the schema layer because JSON-parsed registry data carries that shape;
 * non-empty-ness is a workflow precondition, not a schema invariant. Every
 * dep boundary that touches scoped git state (the staged-bundle read and
 * the inner git commit invocation) consumes a non-empty tuple so that the
 * boundary cannot be reached with an empty pathspec — an empty value
 * passed to git's pathspec terminator would silently degrade to
 * whole-index behaviour, which is the failure mode this surface exists
 * to cure.
 *
 * The narrowing happens at a single site: `runCommitWorkflow` entry for
 * the workflow path, and the CLI handlers' first read for the
 * `record-staged` / `verify-staged` paths. Downstream callers receive the
 * narrowed tuple as a compile-time guarantee.
 */

import { type CommitIntent } from './types.js';

/**
 * Non-empty pathspec carried by the workflow once the loaded intent has
 * been narrowed at entry. Both staged-bundle reads and the inner git
 * commit invocation consume this shape.
 */
export type CommitWorkflowPathspec = readonly [string, ...string[]];

/**
 * Narrowing outcome for a `CommitIntent.files` value. On `ok: true` the
 * caller receives a compile-time non-empty pathspec; on `ok: false` the
 * caller is expected to surface `reason` and short-circuit before any
 * dep call that touches scoped git state.
 */
export type PathspecNarrowingResult =
  | { readonly ok: true; readonly pathspec: CommitWorkflowPathspec }
  | { readonly ok: false; readonly reason: string };

/**
 * Narrow an intent's declared file list to a compile-time non-empty
 * pathspec, or return a structured failure when the list is empty.
 */
export function narrowIntentPathspec(intent: CommitIntent): PathspecNarrowingResult {
  const [first, ...rest] = intent.files;
  if (first === undefined) {
    return {
      ok: false,
      reason: 'empty intent.files — commit workflow refuses to delegate an empty pathspec to git',
    };
  }
  return { ok: true, pathspec: [first, ...rest] };
}
