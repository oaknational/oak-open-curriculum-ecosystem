/**
 * Compute the gitleaks `--log-opts` ranges to scan for a git push.
 *
 * A git `pre-push` hook receives, on stdin, one line per pushed ref in the form
 * `<local_ref> <local_sha> <remote_ref> <remote_sha>`, and the destination
 * remote name as its first argument. This module turns that input into the set
 * of rev ranges gitleaks should scan — only the commits actually being pushed,
 * never the whole history (which grew to minutes as large blobs accumulated).
 *
 * It is a pure function (string input → range strings, no IO) so the range
 * logic is unit-tested directly; the thin `run-push-secret-scan.ts` CLI reads
 * the real inputs and runs gitleaks over the ranges it returns.
 */

/**
 * An all-zero object id marks an absent ref end: a zero `local_sha` is a ref
 * deletion, a zero `remote_sha` is a ref that does not yet exist on the remote.
 * Matched by shape (any length) so it holds for SHA-1 and SHA-256 repositories.
 */
const isZeroObjectId = (objectId: string): boolean => /^0+$/.test(objectId);

/**
 * The UNSCOPED exclusion set — "not reachable from any remote-tracking ref".
 * Every incremental range is scoped to one destination remote
 * (`--not --remotes=<name>`); this bare form is the fallback, and it walks a
 * superset of history whose size is bounded by nothing.
 */
const UNSCOPED_EXCLUSION = '--not --remotes';

export interface ComputePushScanRangesInput {
  /**
   * Raw `pre-push` stdin: newline-separated
   * `<local_ref> <local_sha> <remote_ref> <remote_sha>` lines. Empty when the
   * hook is invoked manually with no ref lines supplied by git.
   */
  refsText: string;
  /**
   * The push destination exactly as git names it in the hook's first argument
   * (githooks(5)): a remote NAME when the push went to a configured remote,
   * and otherwise the destination itself — a URL or a filesystem path, passed
   * through verbatim. It is empty only when nothing invoked this as a hook.
   */
  remoteName: string;
  /**
   * The repository's configured remote names (`git remote`). The destination
   * is scopable only if it appears here: `--remotes=<glob>` is matched against
   * `refs/remotes/*`, so a destination that names no remote produces a glob
   * matching nothing — an exclusion set that excludes nothing.
   */
  configuredRemotes: readonly string[];
}

/**
 * Whether the destination can scope the exclusion — i.e. whether it names a
 * remote that HAS remote-tracking refs. Decided by membership, never by the
 * destination's spelling: a filesystem-path destination carries neither
 * `://` nor `@`, so any URL-shaped heuristic would wave it through.
 */
function isScopableRemote({ remoteName, configuredRemotes }: ComputePushScanRangesInput): boolean {
  return remoteName !== '' && configuredRemotes.includes(remoteName);
}

/**
 * @returns one gitleaks `--log-opts` range string per scan to run. An empty
 * array means "scan nothing" — e.g. a push that only deletes refs.
 */
export function computePushScanRanges(input: ComputePushScanRangesInput): string[] {
  const refLines = input.refsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // No ref lines at all: a manual/unusual invocation git supplied nothing for.
  // Fall back to scanning local commits not yet on any remote. A push that
  // supplies ref lines but scans nothing (all deletions) must NOT reach here.
  if (refLines.length === 0) {
    return [`HEAD ${UNSCOPED_EXCLUSION}`];
  }

  // Exclude commits already on the DESTINATION remote, scoped by its name, so a
  // first push of existing commits to a *second* remote still scans them. A
  // destination that names no configured remote cannot scope anything, so it
  // falls back to the unscoped set rather than building a glob that silently
  // matches nothing.
  const notAlreadyPushed = isScopableRemote(input)
    ? `--not --remotes=${input.remoteName}`
    : UNSCOPED_EXCLUSION;

  const ranges: string[] = [];
  for (const refLine of refLines) {
    const [, localSha, , remoteSha] = refLine.split(/\s+/);
    if (localSha === undefined || remoteSha === undefined) {
      // Not a well-formed ref line; skip rather than fabricate a scan range.
      continue;
    }
    if (isZeroObjectId(localSha)) {
      // Ref deletion: nothing is being pushed for this ref.
      continue;
    }
    ranges.push(
      isZeroObjectId(remoteSha)
        ? `${localSha} ${notAlreadyPushed}` // new ref on this remote
        : `${remoteSha}..${localSha}`, // ref update — only the new commits
    );
  }
  return ranges;
}

/**
 * The loud half of the degradation (R6): this scan exists to walk only the
 * commits being pushed, and two inputs cost it that guarantee — a run git
 * supplied no ref lines for, and a destination that names no configured
 * remote. Either way the exclusion stops being scoped to where the commits
 * are going, and with no remote-tracking refs at all it is the whole history.
 *
 * Derived from the ranges the caller is ACTUALLY about to scan, never from a
 * second reading of the inputs: a parallel re-derivation is free to drift out
 * of agreement with the thing it describes.
 *
 * @returns the warning to surface, or undefined when every range stayed
 * scoped to its destination.
 */
export function degradedScanWarning(
  ranges: readonly string[],
  input: ComputePushScanRangesInput,
): string | undefined {
  if (!ranges.some((range) => range.endsWith(UNSCOPED_EXCLUSION))) {
    return undefined;
  }
  // Which degradation this is follows from the inputs that distinguish them:
  // a run with no ref lines has no pushed range at all, and a run with ref
  // lines got here because its destination could not scope the exclusion.
  const cause =
    input.refsText.trim() === ''
      ? 'git supplied no ref lines, so there is no pushed range to scan and the whole local history stands in for one'
      : `the push destination "${input.remoteName}" is not a configured remote, so it has no remote-tracking refs to scope the exclusion against`;
  return (
    `secret scan: DEGRADED — the scan is no longer scoped to the push destination.\n` +
    `  Cause: ${cause}.\n` +
    `  Effect: commits are excluded if they are on ANY remote rather than on the ` +
    `destination, so commits already pushed elsewhere go unscanned; with no ` +
    `remote-tracking refs at all this walks the entire history. Findings stay correct.\n` +
    `  Fix: push to a NAMED remote (git remote add <name> <url>, then git push <name>) ` +
    `to restore the destination-scoped range.\n`
  );
}
