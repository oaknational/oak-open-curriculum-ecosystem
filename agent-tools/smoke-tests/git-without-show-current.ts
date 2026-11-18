import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { shellSafePath } from './trusted-shell-directories';

/**
 * A `git` that fails any call carrying `--show-current`, as git 2.21 does
 * (`error: unknown option`, exit 129); every other call reaches the real
 * git at `realGit`. Returns the directory to put first on a child's `PATH`.
 *
 * @param root - The smoke's throwaway root; the shim lives in `shims/` under it.
 * @param realGit - The absolute path of the real git the shim forwards to.
 */
export function gitWithoutShowCurrent(root: string, realGit: string): string {
  const shims = join(root, 'shims');
  mkdirSync(shims);
  const shim = join(shims, 'git');
  writeFileSync(
    shim,
    [
      '#!/bin/sh',
      'for shim_arg in "$@"; do',
      '  if [ "$shim_arg" = "--show-current" ]; then',
      '    echo "error: unknown option \\`show-current\'" >&2',
      '    exit 129',
      '  fi',
      'done',
      // Quoted for the spaces a path can carry, forward-slashed for `sh`.
      `exec ${JSON.stringify(shellSafePath(realGit))} "$@"`,
      '',
    ].join('\n'),
  );
  chmodSync(shim, 0o755);
  return shims;
}
