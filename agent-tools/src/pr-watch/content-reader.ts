/**
 * The reader half of the content binding (`content-binding.ts`): each
 * commit's patch against the base, read from the compare endpoint's diff
 * (`compare/{base}...{commit}`, the patch of `merge-base(base, commit)..commit`)
 * and hashed by `git patch-id --verbatim` on stdin. No clone and no fetch:
 * the reader may be pointed at any repository. Every failure, an empty diff
 * (the commit's content is already on the base), and an output that is not
 * an id read as unproven, never as a match. GitHub returns a large compare
 * diff whole (a 181 MB diff of 11,707 files was served in full on
 * 2026-09-28); one past the gh seam's buffer fails the read, so it reads as
 * unproven too. So does a diff the hash cannot see whole: patch-id reads a
 * line only to its first NUL, the UTF-8 read turns lost bytes into U+FFFD,
 * and a binary file shows only abbreviated blob ids. An oid or base ref that
 * is not plainly one is refused before it reaches a command, and the base is
 * named as a branch (`refs/heads/…`), so a tag of the same name never
 * stands in for it.
 */

import { spawnSync } from 'node:child_process';

import { describeSpawnFailure } from '../core/spawn-failure.js';
import { resolveTrustedGit } from '../core/trusted-git.js';
import { isPatchId, type ContentId, type ContentLeg } from './content-binding.js';
import { GH_EXEC_OPTIONS, type GhCommandExecutor } from './gh.js';

/** Hashes a diff to its patch-id; the real one is {@link gitPatchIdOf}, tests inject a fake. */
export type PatchIdOf = (diff: string) => ContentId;

declare const commitOidBrand: unique symbol;
declare const plainBaseBrand: unique symbol;
/** A full commit oid, safe in an API path. */
type CommitOid = string & { readonly [commitOidBrand]: true };
/** A branch name as `pr view` reports `baseRefName`, safe in an API path. */
type PlainBaseRef = string & { readonly [plainBaseBrand]: true };

const FULL_OID = /^[0-9a-f]{40}$/u;
// Path segments of letters, digits, dot, underscore and hyphen: never a `..`
// or a leading hyphen that could read as a flag or a range.
const BASE_REF = /^[A-Za-z0-9_][A-Za-z0-9._-]*(?:\/[A-Za-z0-9_][A-Za-z0-9._-]*)*$/u;

function isCommitOid(value: string): value is CommitOid {
  return FULL_OID.test(value);
}

function isPlainBase(value: string): value is PlainBaseRef {
  return BASE_REF.test(value) && !value.includes('..');
}

function unproven(reason: string): ContentId {
  return { kind: 'unproven', reason };
}

interface ReadInput {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  /** `owner/repo`, or undefined for the repository gh infers. */
  readonly repo: string | undefined;
  readonly patchIdOf: PatchIdOf;
}

function compareArgs(input: ReadInput, base: PlainBaseRef, oid: CommitOid): string[] {
  const repository = input.repo === undefined ? 'repos/{owner}/{repo}' : `repos/${input.repo}`;
  return [
    'api',
    '-H',
    'Accept: application/vnd.github.diff',
    `${repository}/compare/refs/heads/${base}...${oid}`,
  ];
}

// A binary file's diff names only its abbreviated blob ids, so two different
// binaries could hash alike; such a diff is never hashed.
const BINARY_DIFF = /^(?:Binary files |GIT binary patch)/mu;

function hashable(diff: string): ContentId | undefined {
  if (diff.trim() === '') {
    return unproven('the compare diff is empty');
  }
  if (diff.includes('\u0000') || diff.includes('\uFFFD') || BINARY_DIFF.test(diff)) {
    return unproven('the compare diff holds bytes the hash cannot see');
  }
  return undefined;
}

function contentOf(input: ReadInput, base: PlainBaseRef, oid: string): ContentId {
  if (!isCommitOid(oid)) {
    return unproven('not a full commit oid');
  }
  let diff: string;
  try {
    diff = input.run(input.gh, compareArgs(input, base, oid), GH_EXEC_OPTIONS);
  } catch {
    return unproven('the compare diff could not be read');
  }
  return hashable(diff) ?? input.patchIdOf(diff);
}

/**
 * Read the head's content id and each earlier reviewed commit's. With no
 * review of an earlier commit there is nothing to bind by content, and with
 * the head unproven no earlier review can bind, so in either case nothing
 * more is read.
 *
 * @param input - the gh seam, the repository, the base, the head, the reviewed commits and the hasher
 * @returns the content the binding reads
 */
export function readContentLeg(
  input: ReadInput & {
    readonly base: string;
    readonly headRefOid: string;
    readonly reviewedOids: readonly string[];
  },
): ContentLeg {
  const earlier = [...new Set(input.reviewedOids)].filter(
    (oid) => oid !== '' && oid !== input.headRefOid,
  );
  if (earlier.length === 0) {
    return { kind: 'unread', reason: 'no review of an earlier commit' };
  }
  if (!isPlainBase(input.base)) {
    return { kind: 'unread', reason: 'the base ref is not a plain branch name' };
  }
  const head = contentOf(input, input.base, input.headRefOid);
  if (head.kind === 'unproven') {
    return { kind: 'unread', reason: head.reason };
  }
  const base = input.base;
  return {
    kind: 'read',
    head: head.id,
    reviewed: earlier.map((oid) => ({ oid, content: contentOf(input, base, oid) })),
  };
}

/**
 * The content leg of one tip: each reviewed commit's patch against the
 * view's base, hashed by the given hasher. A pull request that is not open is
 * past settlement, so nothing is read for it.
 *
 * @param input - the gh seam, the repository, the view and the hasher
 * @returns the reader of the content for a set of reviewed commits
 */
export function contentReaderFor(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly repo: string | undefined;
  readonly view: {
    readonly state: string;
    readonly baseRefName: string;
    readonly headRefOid: string;
  };
  readonly patchIdOf: PatchIdOf;
}): (reviewedOids: readonly string[]) => ContentLeg {
  if (input.view.state !== 'OPEN') {
    return () => ({ kind: 'unread', reason: 'the pull request is not open' });
  }
  return (reviewedOids) =>
    readContentLeg({
      run: input.run,
      gh: input.gh,
      repo: input.repo,
      base: input.view.baseRefName,
      headRefOid: input.view.headRefOid,
      reviewedOids,
      patchIdOf: input.patchIdOf,
    });
}

/** The hang backstop for one `git patch-id` run. */
const PATCH_ID_BACKSTOP_MS = 30_000;
const PATCH_ID_LINE = /^([0-9a-f]{40}) 0{40}$/u;

/**
 * The real hasher: the trusted git's `patch-id --verbatim` with the diff on
 * stdin, which needs no repository. Its first field is the id. A git that
 * cannot be found, fails to start, hangs past the backstop, exits non-zero
 * or prints no id reads as unproven, never as a failure of the reading.
 */
export const gitPatchIdOf: PatchIdOf = (diff) => {
  let git: string;
  try {
    git = resolveTrustedGit();
  } catch {
    return unproven('no trusted git binary');
  }
  const result = spawnSync(git, ['patch-id', '--verbatim'], {
    input: diff,
    encoding: 'utf8',
    maxBuffer: GH_EXEC_OPTIONS.maxBuffer,
    timeout: PATCH_ID_BACKSTOP_MS,
  });
  if (result.error !== undefined) {
    const error: { code?: string | undefined; message: string } = result.error;
    return unproven(describeSpawnFailure('git patch-id', error, PATCH_ID_BACKSTOP_MS));
  }
  return result.status === 0
    ? idFromOutput(result.stdout)
    : unproven(exitReason(result.status, result.stderr));
};

function exitReason(status: number | null, stderr: string): string {
  const detail = stderr.trim().split('\n')[0] ?? '';
  return `git patch-id exited ${String(status)}${detail === '' ? '' : `: ${detail}`}`;
}

// One diff hashes to one line, the id and forty zeros for the missing
// commit; more lines mean patch-id split the input, and reading only the
// first would leave the rest unhashed.
function idFromOutput(stdout: string): ContentId {
  const lines = stdout.split('\n').filter((line) => line !== '');
  const [only = ''] = lines;
  const id = lines.length === 1 ? (PATCH_ID_LINE.exec(only)?.[1] ?? '') : '';
  if (isPatchId(id)) {
    return { kind: 'id', id };
  }
  return unproven(lines.length > 1 ? 'git patch-id split the diff' : 'git patch-id gave no id');
}
