import { execFileSync } from 'node:child_process';

import { err, isErr, ok } from '@oaknational/result';

import { type CommandRunner } from '../core/command-runner.js';
import { resolveTrustedGh } from '../core/trusted-gh.js';

/**
 * The real gh runner: runs the trusted absolute `gh` binary (resolved via
 * {@link resolveTrustedGh}, so a writable PATH entry cannot shadow it) from `cwd`
 * and returns its stdout (e.g. the draft PR's URL), translating a non-zero exit
 * into an `err` Result at this single library boundary (ADR-088 / use-result-pattern)
 * rather than letting `execFileSync`'s throw escape.
 *
 * @remarks
 * Structurally a {@link CommandRunner}<string> (the gh seam); the composition-root
 * default injected by the spawn flow. Unit tests inject a fake runner instead, so
 * this real runner is exercised only at the integration/CLI edge.
 */
export const realGhRunner: CommandRunner<string> = (args, cwd) => {
  const gh = resolveTrustedGh();
  if (isErr(gh)) {
    return gh;
  }
  try {
    return ok(execFileSync(gh.value, [...args], { cwd, encoding: 'utf8' }));
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
};
