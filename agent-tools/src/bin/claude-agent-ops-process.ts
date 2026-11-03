/**
 * The process-level helpers of `claude-agent-ops`: running one pnpm gate in
 * a repository, and waiting between dashboard refreshes. Split from the bin
 * at the file limit.
 *
 * @packageDocumentation
 */
import { spawnSync } from 'node:child_process';

import { writeErrorLine } from '../core/terminal-output.js';
import { resolvePnpm } from '../spawn/pnpm-path.js';

/** True when `pnpm <gate>` exits 0 in `root`; its output is discarded. */
export function runPnpmGate(gate: string, root: string): boolean {
  // Bare 'pnpm' never reaches spawn (the agent-tools invariant, and on
  // Windows a shell-less by-name spawn cannot resolve the .cmd shim).
  const pnpm = resolvePnpm(process.env);
  if (!pnpm.ok) {
    writeErrorLine(pnpm.error.message);
    return false;
  }
  return (
    spawnSync(pnpm.value.file, [...pnpm.value.leadingArgs, gate], {
      cwd: root,
      stdio: 'ignore',
      env: pnpm.value.env,
    }).status === 0
  );
}
/** A promise that settles after `milliseconds`. */
export function waitMs(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
