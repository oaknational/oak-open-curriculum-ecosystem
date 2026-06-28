import { execFileSync } from 'node:child_process';

import { err, ok, type Result } from '@oaknational/result';

import { resolveTrustedGit } from '../core/trusted-git.js';

/**
 * The real git runner: runs the trusted absolute `git` binary (resolved via
 * {@link resolveTrustedGit}, so a writable PATH entry cannot shadow it) from
 * `cwd` and returns its stdout, translating a non-zero exit into an `err`
 * Result at this single library boundary (ADR-088 / use-result-pattern) rather
 * than letting `execFileSync`'s throw escape.
 *
 * @remarks
 * Structurally a `SpawnGitRunner` (see `create.ts`); it is the composition-root
 * default injected by the spawn CLI. Unit tests inject a fake runner instead, so
 * this real runner is exercised only at the integration/CLI edge. The type is
 * not imported here to keep the `create.ts → git.ts` dependency one-directional.
 */
export const realGitRunner = (args: readonly string[], cwd: string): Result<string, Error> => {
  try {
    return ok(execFileSync(resolveTrustedGit(), [...args], { cwd, encoding: 'utf8' }));
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
};
