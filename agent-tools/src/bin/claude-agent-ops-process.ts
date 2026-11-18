/**
 * The process-level helpers of `claude-agent-ops`: running one pnpm gate in
 * a repository, and waiting between dashboard refreshes. Split from the bin
 * at the file limit.
 *
 * @packageDocumentation
 */
import { sync as crossSpawnSync } from 'cross-spawn';

/**
 * True when `pnpm <gate>` exits 0 in `root`; its output is discarded. pnpm
 * runs by name through `cross-spawn`, which launches a Windows `pnpm.cmd`
 * shim that a shell-less Node spawn cannot.
 */
export function runPnpmGate(gate: string, root: string): boolean {
  return crossSpawnSync('pnpm', [gate], { cwd: root, stdio: 'ignore' }).status === 0;
}
/** A promise that settles after `milliseconds`. */
export function waitMs(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
