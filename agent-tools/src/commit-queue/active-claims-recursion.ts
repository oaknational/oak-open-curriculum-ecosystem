import { normalizeFileList } from './path-list.js';

const ACTIVE_CLAIMS_PATH = '.agent/state/collaboration/active-claims.json';

/**
 * Return the operator warning for the intentional active-claims split state.
 * The claims registry is coordination state (claim open, heartbeat, close),
 * never part of an authorial bundle: since registry schema 1.4.0 the queue
 * and its fingerprint live in the machine-local per-intent store, so the
 * registry has no place in the staged set of a queued commit.
 */
export function activeClaimsSplitWarning(input: {
  readonly intentFiles: readonly string[];
  readonly worktreeShortStatus?: string;
}): string | undefined {
  if (
    stagesActiveClaimsRegistry(input.intentFiles) &&
    input.worktreeShortStatus !== undefined &&
    hasStagedAndUnstagedActiveClaims(input.worktreeShortStatus)
  ) {
    return (
      `${ACTIVE_CLAIMS_PATH} is staged with further unstaged changes after ` +
      'record-staged; the claims registry is coordination state, not part of ' +
      'this authorial bundle — do not re-stage it.'
    );
  }

  return undefined;
}

/**
 * Return the corrective error when active-claims was re-staged after recording.
 */
export function activeClaimsRestagedReason(files: readonly string[]): string | undefined {
  if (!stagesActiveClaimsRegistry(files)) {
    return undefined;
  }

  return (
    'active-claims.json was re-staged after record-staged; the claims registry ' +
    'is coordination state written by claim open, heartbeat and close, never ' +
    'part of the authorial bundle. Unstage it and rerun verify-staged.'
  );
}

function stagesActiveClaimsRegistry(files: readonly string[]): boolean {
  return normalizeFileList(files.join('\n')).includes(ACTIVE_CLAIMS_PATH);
}

function hasStagedAndUnstagedActiveClaims(shortStatus: string): boolean {
  return shortStatus
    .split(/\r?\n/u)
    .some((line) => line.slice(0, 2).trim().length === 2 && line.slice(3) === ACTIVE_CLAIMS_PATH);
}
