import type { SlotObservation } from './gate-slot-policy.js';

/** The command that names a port's listener, for a slot that cannot say who holds it. */
function lookup(port: number): string {
  return `lsof -nP -iTCP:${port} -sTCP:LISTEN`;
}

/** One line naming what holds a slot, for the wait report and `status`. */
export function describeSlot(slot: SlotObservation): string {
  if (slot.state === 'free') {
    return `  port ${slot.port}: free`;
  }
  if (slot.state === 'held') {
    const { command, worktree, pid, acquired_at: since } = slot.holder;
    return `  port ${slot.port}: ${command} in ${worktree} (pid ${pid}, since ${since})`;
  }
  if (slot.state === 'unanswered') {
    return (
      `  port ${slot.port}: held, but the holder did not answer (a stopped or hung gate, ` +
      `counted as one in this tree); find it with: ${lookup(slot.port)}`
    );
  }

  return `  port ${slot.port}: held by a listener that is not a gate; find it with: ${lookup(slot.port)}`;
}

/** The mutex stays bound past the adapter's patience: name how to find its holder. */
export function describeMutexBusy(port: number): string {
  return (
    `the gate mutex on port ${port} stays busy; find its holder with: ${lookup(port)} ` +
    '(a stopped process resumes with kill -CONT <pid>)'
  );
}

/** The command-line usage, printed for `--help` and after a usage error. */
export const USAGE = [
  'Usage: pnpm agent-tools:gate-slot <command>',
  '',
  'Commands:',
  '  run pnpm <args>   Hold a gate slot while the pnpm command runs, and exit with its verdict.',
  '                    Waits while a gate runs in this working tree or the host runs its limit.',
  '  status            List the gate slots and their holders.',
].join('\n');
