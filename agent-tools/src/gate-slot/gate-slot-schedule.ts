import { constants } from 'node:os';

import type { InheritedProcessEnd } from '../repo-check/repo-check-runtime.js';

/** How long a blocked gate sleeps between attempts. */
export const GATE_SLOT_POLL_MS = 5000;

/**
 * The longest a gate child may run before it is stopped: six times the
 * five-minute full gate measured on this host, so a loaded host's gate
 * finishes and a hung one does not hold its slot for ever.
 */
export const GATE_CHILD_MAX_MINUTES = 30;

/** How long a stopped gate child has between SIGTERM and SIGKILL. */
export const GATE_CHILD_GRACE_MS = 30_000;

/** Report the blockers on the first blocked poll and then once a minute. */
const REPORT_EVERY_POLLS = 12;

/**
 * Give up after 720 blocked polls, an hour at the poll interval. A holder's
 * child is bounded at thirty minutes, so a wait that long means a queue of
 * full gates, a stopped holder, or a foreign listener on a gate port; the
 * report names which.
 */
export const GIVE_UP_AFTER_POLLS = 720;

/**
 * What to do on blocked poll `poll` (the first blocked attempt is poll 1).
 * Counting polls rather than reading a clock keeps the schedule a pure
 * function; real elapsed time stretches with each attempt's own duration
 * (seconds when the mutex stays busy), which only lengthens the wait.
 */
export function waitStep(poll: number): { readonly report: boolean; readonly giveUp: boolean } {
  return {
    report: (poll - 1) % REPORT_EVERY_POLLS === 0,
    giveUp: poll > GIVE_UP_AFTER_POLLS,
  };
}

/**
 * The wrapper's exit code for how its gate child ended: the child's status,
 * or 128 plus the signal's number when a signal ended it (the shell's
 * convention, so a hook's `if !` reads either as a failure). An end that
 * names neither reads as a plain failure.
 */
export function exitCodeFor(end: InheritedProcessEnd): number {
  if (end.status !== null) {
    return end.status;
  }
  if (end.signal !== null) {
    return 128 + constants.signals[end.signal];
  }

  return 1;
}
