/**
 * Operator profile — the sync leg of a root read: findings only for a
 * repository with a remote, information for the other first-class states
 * (PDR decision 16); a git read that fails is an operational error, never a
 * clean state.
 */

import { err, ok, type Result } from '@oaknational/result';

import { type ProfileFileSystem } from './operator-profile-fs.js';
import { createGitRunner, readSyncState } from './operator-profile-git.js';
import { assessSyncState, type SyncStateInput } from './operator-profile-sync-state.js';

/** The relPath the sync leg's findings are reported under. */
export const SYNC_REL_PATH = '(sync)';

export interface SyncReport {
  readonly failures: readonly { readonly relPath: string; readonly messages: readonly string[] }[];
  readonly info: readonly string[];
}

const NOT_A_REPOSITORY: SyncStateInput = {
  isRepository: false,
  hasRemote: false,
  hasUpstream: false,
  porcelain: '',
  ahead: 0,
  behind: 0,
};

/**
 * The sync leg for a present root.
 *
 * @param root - the profile root
 * @param fs - the filesystem the repository probe goes through
 * @returns the sync findings and information, or the operational error
 */
export async function syncReport(
  root: string,
  fs: ProfileFileSystem,
): Promise<Result<SyncReport, string>> {
  const repository = await fs.isGitRepository(root);
  if (!repository.ok) {
    return err(`the sync state of ${root} is unreadable — ${repository.error}`);
  }
  const state = repository.value ? readSyncState(createGitRunner(root)) : ok(NOT_A_REPOSITORY);
  if (!state.ok) {
    return err(`the sync state of ${root} is unreadable — ${state.error}`);
  }
  const assessment = assessSyncState(state.value);
  const failures =
    assessment.findings.length === 0
      ? []
      : [{ relPath: SYNC_REL_PATH, messages: assessment.findings }];
  return ok({ failures, info: assessment.info });
}
