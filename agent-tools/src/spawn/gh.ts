import { execFileSync } from 'node:child_process';

import { err, ok } from '@oaknational/result';

import { type CommandRunner } from '../core/command-runner.js';

/**
 * The real gh runner: runs `gh` from `cwd` and returns its stdout (e.g. the draft
 * PR's URL), translating a non-zero exit into an `err` Result at this single
 * library boundary (ADR-088 / use-result-pattern) rather than letting
 * `execFileSync`'s throw escape.
 *
 * @remarks
 * Structurally a {@link CommandRunner}<string> (the gh seam); the composition-root
 * default injected by the spawn flow. Unit tests inject a fake runner instead, so
 * this real runner is exercised only at the integration/CLI edge.
 */
export const realGhRunner: CommandRunner<string> = (args, cwd) => {
  try {
    return ok(execFileSync('gh', [...args], { cwd, encoding: 'utf8' }));
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
};
