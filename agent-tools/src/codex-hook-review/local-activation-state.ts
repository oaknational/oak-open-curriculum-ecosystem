import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { inspectGuardedDirectory, removeGuardedRegularFile } from './guarded-local-io.js';

export const LOCAL_ACTIVATION_MANIFEST = '.claude/codex-review.local.json';

/** Remove any prior activation evidence so an interrupted replacement cannot remain enabled. */
export async function clearLocalActivationManifest(
  projectRoot: string,
): Promise<Result<void, { readonly kind: 'write-failed' }>> {
  const directory = await inspectGuardedDirectory(projectRoot, ['.claude']);
  if (!directory.ok) {
    return directory.error.kind === 'directory-missing'
      ? ok(undefined)
      : err({ kind: 'write-failed' });
  }
  const removed = await removeGuardedRegularFile(join(projectRoot, LOCAL_ACTIVATION_MANIFEST));
  return removed.ok ? ok(undefined) : err({ kind: 'write-failed' });
}
