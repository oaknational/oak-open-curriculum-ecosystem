import { basename } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import { isUrlSafeBranchName } from './branch-arg.js';

/**
 * The text parsers behind `merge-bot retire`: what git prints, turned into
 * typed readings. Pure, so every reading the command decides on is proven
 * here without a git process.
 *
 * Exactness is the point of each. `git ls-remote` matches any ref ENDING in
 * its pattern, and a case-insensitive filesystem lets `rev-parse` resolve
 * `refs/heads/Main` to `main`'s file, so the command never asks git "which
 * ref is this?": it lists refs and compares whole names itself.
 */

const SHA_PATTERN = /^[0-9a-f]{40}$/;

/** The remote's default branch and its tip, from one `ls-remote --symref origin HEAD`. */
export interface DefaultBranchReading {
  readonly name: string;
  readonly sha: string;
}

/**
 * Read `git ls-remote --symref origin HEAD`: a `ref: refs/heads/<name>\tHEAD`
 * line, then `<sha>\tHEAD`. The name is server-supplied and lands in a later
 * argv, so it must be a URL-safe name and must not read as a flag.
 */
export function parseSymrefHead(stdout: string): Result<DefaultBranchReading, Error> {
  const lines = stdout.split('\n');
  const name = symrefName(lines);
  const sha = headSha(lines);
  if (name === undefined || sha === undefined) {
    return err(
      new Error(`the remote's HEAD could not be read from: ${printable(JSON.stringify(stdout))}`),
    );
  }
  if (name.startsWith('-') || !isUrlSafeBranchName(name)) {
    return err(
      new Error(
        `the remote's default branch name "${printable(name)}" is outside the names this command handles`,
      ),
    );
  }
  return ok({ name, sha });
}

/** The branch name on the `ref: refs/heads/<name>\tHEAD` line. */
function symrefName(lines: readonly string[]): string | undefined {
  const line = lines.find((candidate) => candidate.startsWith('ref: ')) ?? '';
  return /^ref: refs\/heads\/(\S+)\tHEAD$/.exec(line)?.[1];
}

/** The sha on the `<sha>\tHEAD` line, when it is a full sha. */
function headSha(lines: readonly string[]): string | undefined {
  const line = lines.find(
    (candidate) => candidate.endsWith('\tHEAD') && !candidate.startsWith('ref: '),
  );
  const sha = line?.split('\t')[0];
  return sha !== undefined && SHA_PATTERN.test(sha) ? sha : undefined;
}

/** A remote branch as the probe read it. */
export type RemoteRefReading =
  { readonly kind: 'present'; readonly sha: string } | { readonly kind: 'absent' };

/**
 * Read `git ls-remote origin refs/heads/<branch>` taking ONLY the line whose
 * refname is exactly `refs/heads/<branch>`: git's pattern also matches a ref
 * such as `refs/heads/a/refs/heads/<branch>`, and proving that one would let a
 * delete land on the unproven exact ref.
 */
export function parseExactRemoteRef(stdout: string, branch: string): RemoteRefReading {
  const wanted = `refs/heads/${branch}`;
  for (const line of stdout.split('\n')) {
    const [sha, refname] = line.split('\t');
    if (refname === wanted && sha !== undefined && SHA_PATTERN.test(sha)) {
      return { kind: 'present', sha };
    }
  }
  return { kind: 'absent' };
}

/** One ref as `git for-each-ref` lists it. */
export interface ListedRef {
  readonly sha: string;
}

/** The `for-each-ref` format {@link parseRefListing} reads. */
export const REF_LISTING_FORMAT = '--format=%(refname) %(objectname)';

/**
 * Read `git for-each-ref` in {@link REF_LISTING_FORMAT} into a map from the
 * exact full refname to its object name. Lookups are case-sensitive by
 * construction, whatever the filesystem folds. The listing cannot say which
 * refs are symbolic: it lists a symbolic ref at its target's sha, and does
 * not list a dangling one at all, so that is read raw (`readSymbolicRefs`).
 */
export function parseRefListing(stdout: string): ReadonlyMap<string, ListedRef> {
  const refs = new Map<string, ListedRef>();
  for (const line of stdout.split('\n')) {
    const [refname, sha] = line.split(' ');
    if (refname !== undefined && refname !== '' && sha !== undefined && SHA_PATTERN.test(sha)) {
      refs.set(refname, { sha });
    }
  }
  return refs;
}

const BRANCH_REF_PREFIXES = ['refs/heads/', 'refs/remotes/origin/'] as const;

/**
 * Every listed local or tracking ref, other than the branch's own two, whose
 * branch part equals `branch` when case is ignored. On a case-insensitive
 * filesystem such a pair shares one loose-ref file, so a delete of either
 * could land on the other.
 */
export function caseCollisionsOf(
  listing: ReadonlyMap<string, ListedRef>,
  branch: string,
): readonly string[] {
  const folded = branch.toLowerCase();
  const collisions: string[] = [];
  for (const refname of listing.keys()) {
    const prefix = BRANCH_REF_PREFIXES.find((candidate) => refname.startsWith(candidate));
    const name = prefix === undefined ? undefined : refname.slice(prefix.length);
    if (name !== undefined && name !== branch && name.toLowerCase() === folded) {
      collisions.push(refname);
    }
  }
  return collisions;
}

/** One entry of `git worktree list --porcelain`. */
export interface WorktreeEntry {
  readonly path: string;
  /** The full refname checked out there; undefined when HEAD is detached. */
  readonly branch: string | undefined;
  /** Whether git marks it prunable: its directory is not where git recorded it. */
  readonly prunable: boolean;
}

/** Read `git worktree list --porcelain`: blank-line-separated records. */
export function parseWorktrees(porcelain: string): readonly WorktreeEntry[] {
  const entries: WorktreeEntry[] = [];
  for (const record of porcelain.split('\n\n')) {
    const lines = record.split('\n');
    const path = lines.find((line) => line.startsWith('worktree '))?.slice('worktree '.length);
    if (path !== undefined) {
      const branch = lines.find((line) => line.startsWith('branch '))?.slice('branch '.length);
      const prunable = lines.some((line) => line === 'prunable' || line.startsWith('prunable '));
      entries.push({ path, branch, prunable });
    }
  }
  return entries;
}

/** A local absolute path in git's words: after the line's start, a space or a quote. */
const LOCAL_PATH = /(^|[\s'"`])(\/[^\s'"`]+)/gu;

/**
 * git's own words for a failure, as the report carries them: its first
 * `fatal:` or `error:` line (a leading `warning:` can come before the cause),
 * else its first line that is not a `hint:`; each local absolute path cut to
 * its last part (a report can be pasted into a tracked record, and a path
 * names the machine); and no control or format characters (a remote's
 * `remote:` text reaches git's stderr).
 */
export function gitWords(stderr: string): string {
  const lines = stderr
    .split('\n')
    .map((text) => text.trim())
    .filter((text) => text !== '' && !text.startsWith('hint:'));
  const line = lines.find((text) => /^(?:fatal|error):/u.test(text)) ?? lines[0] ?? '';
  return printable(
    line.replaceAll(LOCAL_PATH, (_match, lead: string, path: string) => `${lead}${basename(path)}`),
  );
}
