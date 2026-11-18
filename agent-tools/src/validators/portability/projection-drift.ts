/**
 * Compare the projections a set of declarations renders with what the projection surfaces
 * hold, and apply the difference. Written for the rule leg (`rule-projection-validation.ts`)
 * with the subject as a parameter, so a second projection leg shares it unchanged.
 *
 * A projection that is absent is missing, one whose bytes differ is drifted, and a file on a
 * projection surface that no declaration renders is stale. The comparison is byte-exact on
 * purpose: the surfaces are outputs, and any difference means a hand edit or a stale
 * generation, never a second source of truth (`validators-must-recompute-not-just-record`).
 *
 * @packageDocumentation
 */

import type { Result } from '@oaknational/result';
import { compareRuleNames } from '../../rule-declarations/rule-name.js';

/** One rendered projection: its repo-relative path and its full text. */
export interface Projection {
  readonly path: string;
  readonly text: string;
}

/** What the surfaces hold against what the declarations render. */
export interface ProjectionDrift {
  /** Expected paths with no file. */
  readonly missing: readonly string[];
  /** Expected paths whose file text differs. */
  readonly drifted: readonly string[];
  /** Files on the surfaces that no declaration renders, in path order. */
  readonly stale: readonly string[];
}

/**
 * Diff the expected projections against the actual surface files.
 *
 * @param expected - The projections rendered from the declarations.
 * @param actual - Every file currently on the projection surfaces, keyed by repo-relative
 * path.
 * @returns The missing, drifted and stale paths.
 */
export function diffProjections(
  expected: readonly Projection[],
  actual: ReadonlyMap<string, string>,
): ProjectionDrift {
  const expectedPaths = new Set(expected.map((projection) => projection.path));
  const missing = expected
    .filter((projection) => !actual.has(projection.path))
    .map((projection) => projection.path);
  const drifted = expected
    .filter(
      (projection) =>
        actual.has(projection.path) && actual.get(projection.path) !== projection.text,
    )
    .map((projection) => projection.path);
  const stale = [...actual.keys()]
    .filter((file) => !expectedPaths.has(file))
    .sort((left, right) => compareRuleNames(left, right));
  return { missing, drifted, stale };
}

/** The mutations a projection leg applies, each a typed outcome. */
export interface ProjectionMutations {
  writeText: (relPath: string, text: string) => Promise<Result<undefined, string>>;
  removeFile: (relPath: string) => Promise<Result<undefined, string>>;
}

/** What a fix run did: the issue that ended it, if one did, and the paths it changed first. */
export interface AppliedDrift {
  readonly issues: readonly string[];
  readonly written: readonly string[];
  readonly removed: readonly string[];
}

/**
 * Apply the drift mutation by mutation: the missing and drifted projections written, the
 * stale files removed; a refused mutation ends the run as the one issue, with what was
 * written and removed before it on record.
 */
export async function applyProjectionDrift(
  expected: readonly Projection[],
  drift: ProjectionDrift,
  mutations: ProjectionMutations,
): Promise<AppliedDrift> {
  const written: string[] = [];
  const removed: string[] = [];
  const toWrite = new Set([...drift.missing, ...drift.drifted]);
  for (const projection of expected.filter((candidate) => toWrite.has(candidate.path))) {
    const outcome = await mutations.writeText(projection.path, projection.text);
    if (!outcome.ok) {
      return { issues: [outcome.error], written, removed };
    }
    written.push(projection.path);
  }
  for (const stalePath of drift.stale) {
    const outcome = await mutations.removeFile(stalePath);
    if (!outcome.ok) {
      return { issues: [outcome.error], written, removed };
    }
    removed.push(stalePath);
  }
  return { issues: [], written, removed };
}
