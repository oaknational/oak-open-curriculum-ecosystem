/**
 * The projection legs' issue wording: what a listing or an entry read yields, or the one
 * issue that refuses a leg; and the drift issues that name the cure. Each leg names its
 * subject (the rule projections, the sub-agent adapters), so the wording reads in one place
 * and each leg stays within the line cap.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import type { DirectoryListing, EntryRead } from './directory-listing.js';
import type { ProjectionDrift } from './projection-drift.js';
import { compareRuleNames } from '../../rule-declarations/rule-name.js';

const FIX_HINT = 'run `pnpm portability:fix`';

/** The nouns one projection leg's wording turns on. */
export interface ProjectionSubject {
  /** The outputs, plural ("rule projections"). */
  readonly outputs: string;
  /** One output ("rule projection"). */
  readonly output: string;
  /** The outputs' bare noun in the drift wording ("projections"). */
  readonly outputsBare: string;
  /** One canonical source ("rule"). */
  readonly canonical: string;
  /** The canonical directory as the wording names it ("the canonical rules directory"). */
  readonly canonicalDir: string;
  /** The surfaces as the wording names them ("the rule surfaces"). */
  readonly surfaces: string;
  /** The declaration's owner, possessive ("rule's"). */
  readonly owner: string;
  /** What renders an output ("canonical rule"). */
  readonly renderer: string;
}

export const RULE_SUBJECT: ProjectionSubject = {
  outputs: 'rule projections',
  output: 'rule projection',
  outputsBare: 'projections',
  canonical: 'rule',
  canonicalDir: 'the canonical rules directory',
  surfaces: 'the rule surfaces',
  owner: "rule's",
  renderer: 'canonical rule',
};

export const SUBAGENT_SUBJECT: ProjectionSubject = {
  outputs: 'sub-agent adapters',
  output: 'sub-agent adapter',
  outputsBare: 'adapters',
  canonical: 'template',
  canonicalDir: 'the templates directory',
  surfaces: 'the sub-agent surfaces',
  owner: "template's",
  renderer: 'template',
};

/** The refusal clause a leg appends when it will not regenerate its outputs. */
export function refusing(subject: ProjectionSubject): string {
  return `refusing to regenerate the ${subject.outputs}`;
}

/**
 * The files a listing yields, or the one issue that refuses the leg. An absent projection
 * surface is empty (a fresh host has none yet) and a stray regular file on it is listed so
 * the drift reads it as stale; the absent canonical directory and a stray on it are refusals.
 */
export function filesOf(
  relDir: string,
  listing: DirectoryListing,
  surface: 'projection' | 'canonical',
  subject: ProjectionSubject,
): Result<readonly string[], string> {
  if (listing.kind === 'files') {
    if (surface === 'projection' || listing.stray.length === 0) {
      return ok([...listing.files, ...listing.stray].sort((a, b) => compareRuleNames(a, b)));
    }
    const strays = listing.stray.join(', ');
    return err(
      `${strays}: not a ${subject.canonical}; ${subject.canonicalDir} admits .md ${subject.canonical}s only`,
    );
  }
  if (listing.kind === 'absent') {
    return surface === 'projection'
      ? ok([])
      : err(`${relDir}: no such directory; ${refusing(subject)}`);
  }
  if (listing.kind === 'unreadable') {
    return err(`${relDir}: unreadable (${listing.cause}); ${refusing(subject)}`);
  }
  return err(`${listing.entry}: not a regular file; ${subject.surfaces} admit regular files only`);
}

/** The text an entry read yields, or the one issue that refuses the leg, naming the path. */
export function textOf(
  relPath: string,
  read: EntryRead,
  subject: ProjectionSubject,
): Result<string, string> {
  if (read.kind === 'text') {
    return ok(read.text);
  }
  if (read.kind === 'absent') {
    return err(`${relPath}: vanished between listing and read; ${refusing(subject)}`);
  }
  if (read.kind === 'unreadable') {
    return err(`${relPath}: unreadable (${read.cause}); ${refusing(subject)}`);
  }
  return err(`${relPath}: not a regular file; ${subject.surfaces} admit regular files only`);
}

/** One issue per missing, drifted or stale projection, each naming the cure. */
export function driftIssues(drift: ProjectionDrift, subject: ProjectionSubject): string[] {
  return [
    ...drift.missing.map((file) => `${file}: missing ${subject.output} (${FIX_HINT})`),
    ...drift.drifted.map(
      (file) =>
        `${file}: drifted from the ${subject.owner} declaration; ${subject.outputsBare} are never hand-edited (${FIX_HINT})`,
    ),
    ...drift.stale.map(
      (file) => `${file}: no ${subject.renderer} renders it (${FIX_HINT} to remove it)`,
    ),
  ];
}
