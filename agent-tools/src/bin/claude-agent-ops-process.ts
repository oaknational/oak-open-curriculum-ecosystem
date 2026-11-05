/**
 * The process-level helpers of `claude-agent-ops`: running one pnpm gate in
 * a repository, and waiting between dashboard refreshes. Split from the bin
 * at the file limit.
 *
 * @packageDocumentation
 */
import { spawnSync } from 'node:child_process';

/** True when `pnpm <gate>` exits 0 in `root`; its output is discarded. */
export function runPnpmGate(gate: string, root: string): boolean {
  return spawnSync('pnpm', [gate], { cwd: root, stdio: 'ignore' }).status === 0;
}
/** A promise that settles after `milliseconds`. */
export function waitMs(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
