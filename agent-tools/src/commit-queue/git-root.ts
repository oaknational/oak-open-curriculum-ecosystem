import { defaultRunGit, type GitRunner } from '../collaboration-state/coordination-home.js';
import { TrustedGitResolutionError } from '../core/trusted-git.js';

/**
 * Resolve the root of the git worktree the CLI was INVOKED from.
 *
 * This is deliberately NOT the coordination home (F-138). The commit-queue
 * spans two distinct roots: the registry lives at the coordination home (the
 * primary checkout, shared by every linked worktree — see
 * `resolveCoordinationHome`), while staged reads, verification, and the inner
 * `git commit` must operate against the index of the worktree the agent is
 * actually working in. Collapsing the two into one root made every worktree
 * invocation fingerprint the primary's (empty) index and auto-abandon valid
 * intents.
 *
 * `git rev-parse --show-toplevel` from `cwd` names the invoking worktree's
 * top level — the primary checkout is the degenerate case where both roots
 * coincide, preserving prior behaviour byte-for-byte there.
 *
 * The default runner is the trusted-git runner shared with
 * `resolveCoordinationHome` (absolute-path git, S4036 hardening) — one
 * canonical invocation shape for both root resolvers.
 *
 * @param cwd - the directory the CLI was invoked from.
 * @param runGit - git-runner seam; unit tests inject a fake, production
 *   omits it and the shared trusted-git runner runs.
 * @throws when `cwd` is not inside a git working tree — the F-138 fail-loud
 *   guard. There is no fallback to the coordination home: a fallback is
 *   exactly the silent two-root collapse this module exists to prevent.
 */
export function resolveInvokingGitRoot(cwd: string, runGit: GitRunner = defaultRunGit): string {
  let topLevel: string;
  try {
    topLevel = runGit(['rev-parse', '--show-toplevel'], cwd);
  } catch (cause) {
    // A resolver refusal is its own diagnosis — git never ran, so the
    // not-inside-a-working-tree translation below would be false (the
    // misleading-error class this repository has now hit three times).
    if (cause instanceof TrustedGitResolutionError) {
      throw cause;
    }
    throw new Error(
      `Unable to resolve the invoking git worktree root: '${cwd}' is not inside a git working tree. ` +
        `Commit-queue staged reads and the inner commit operate against the INVOKING worktree's index; ` +
        `there is no fallback to the coordination home. Run the command from inside the worktree that ` +
        `holds the staged files.`,
      { cause },
    );
  }

  const trimmed = topLevel.trim();
  if (trimmed.length === 0) {
    throw new Error(
      `Unable to resolve the invoking git worktree root: 'git rev-parse --show-toplevel' returned ` +
        `nothing for '${cwd}'. There is no fallback to the coordination home.`,
    );
  }
  return trimmed;
}
