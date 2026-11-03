import { writeErrorLine, writeLine } from '../core/terminal-output.js';

import { createGateChildRunner } from './gate-slot-child.js';
import type { GateSlotLimit } from './gate-slot-contract.js';
import { createPortRegistry, type GateSlotPorts } from './gate-slot-ports.js';
import type { GateSlotIo } from './gate-slot-types.js';

/** Where the composed gate-slot runs: its ports, its tree, its child and its bounds. */
export interface GateSlotHost {
  readonly ports: GateSlotPorts;
  readonly worktree: string;
  readonly limit: GateSlotLimit;
  /** The enclosing gate's slot, read from the environment by the entry point. */
  readonly heldMarker: string | undefined;
  /** The program a gate child runs: `pnpm` in production. */
  readonly childCommand: string;
  readonly childMaxMs: number;
  readonly childGraceMs: number;
  /** The host's platform: a negative pid names a process group only on POSIX, never on win32. */
  readonly platform: NodeJS.Platform;
}

/**
 * Compose the real gate-slot ports: loopback listeners for the slots, a
 * bounded child runner, and the sanitising terminal writers (a holder's
 * identity comes from another process and reaches the operator's terminal).
 */
export function createGateSlotIo(host: GateSlotHost): GateSlotIo {
  const registry = createPortRegistry(host.ports);

  return {
    limit: host.limit,
    worktree: host.worktree,
    processGroups: host.platform !== 'win32',
    pid: process.pid,
    heldMarker: host.heldMarker,
    now: () => new Date().toISOString(),
    transact: registry.transact,
    observe: registry.observe,
    runChild: createGateChildRunner({
      command: host.childCommand,
      cwd: host.worktree,
      maxMs: host.childMaxMs,
      graceMs: host.childGraceMs,
    }),
    sleep: async (milliseconds) =>
      new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
      }),
    stdout: writeLine,
    stderr: writeErrorLine,
  };
}
