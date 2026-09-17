import { execFileSync } from 'node:child_process';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { resolveTrustedGit } from '../core/trusted-git.js';

/** Runs git with the given arguments from `cwd` and returns its stdout. */
type GitRunner = (args: readonly string[], cwd: string) => Result<string, Error>;

/**
 * The real git runner: executes the trusted absolute `git` binary (resolved
 * via {@link resolveTrustedGit}, so a writable PATH entry cannot shadow it)
 * and translates a non-zero exit into an `err` Result at this single library
 * boundary. Unit tests inject a fake runner; this default is exercised only
 * at the composition edge.
 */
const realGitRunner: GitRunner = (args, cwd) => {
  try {
    return ok(
      execFileSync(resolveTrustedGit(), [...args], {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
    );
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause), { cause }));
  }
};

const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/u;

export interface ResolveRefToCommitShaInput {
  /** The ref to resolve (e.g. `origin/main`, a tag, or a sha prefix). */
  readonly ref: string;
  /** Directory inside the repository to resolve against. */
  readonly cwd: string;
  /** Git seam (defaults to {@link realGitRunner}). */
  readonly runGit?: GitRunner;
}

/**
 * Resolve a ref to the FULL sha of the commit it points at.
 *
 * @remarks
 * Uses `rev-parse --verify` with a `^{commit}` peel so annotated tags resolve
 * to their commit, and never `--short` — the abbreviation length grows with
 * ambiguity, while the coordination branch suffix is defined as the first six
 * characters of the full sha. `--end-of-options` keeps a ref that begins with
 * a dash from being read as a flag.
 */
export function resolveRefToCommitSha(input: ResolveRefToCommitShaInput): Result<string, Error> {
  const runGit = input.runGit ?? realGitRunner;
  const resolved = runGit(
    ['rev-parse', '--verify', '--end-of-options', `${input.ref}^{commit}`],
    input.cwd,
  );
  if (isErr(resolved)) {
    return err(
      new Error(
        `coordination: cannot resolve ref '${input.ref}' to a commit — ` +
          'fetch it first (git fetch origin) or pass a --base <ref> that exists in this repository',
        { cause: resolved.error },
      ),
    );
  }

  const sha = resolved.value.trim();
  if (!FULL_SHA_PATTERN.test(sha)) {
    return err(
      new Error(
        `coordination: git rev-parse returned '${sha}' for ref '${input.ref}' — ` +
          'expected a full 40-hex commit sha',
      ),
    );
  }
  return ok(sha);
}
