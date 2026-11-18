/** How a process is signalled: `process.kill` in production. */
type Kill = (pid: number, signal: NodeJS.Signals) => true;

/**
 * What the kernel answered a group signal: delivered to at least one member
 * of the group; no such group (ESRCH); or no member it was permitted to
 * signal (EPERM). EPERM does not prove a group has ended: macOS gives it for
 * a group whose members have all exited and are not yet reaped, and for one
 * holding a live process this user may not signal.
 */
export type SignalOutcome = 'signalled' | 'ended' | 'not-permitted';

/** Whether a swept group has gone, or still answers after the sweep's last SIGKILL. */
type GroupSweep = 'cleared' | 'not-cleared';

/** How many SIGKILLs a sweep sends, and how long it waits between them. */
interface SweepPatience {
  readonly attempts: number;
  readonly intervalMs: number;
  readonly sleep: (milliseconds: number) => Promise<void>;
}

/**
 * Signal every process in the group `leader` leads and report the kernel's
 * answer. A launch that never got a pid has no group.
 */
export function signalProcessGroup(
  leader: number | undefined,
  signal: NodeJS.Signals,
  kill: Kill = process.kill.bind(process),
): SignalOutcome {
  return leader === undefined ? 'ended' : signalTarget(-leader, signal, kill);
}

/**
 * SIGKILL a group until the kernel reports it gone. Only ESRCH proves that:
 * after a group SIGKILL, macOS answers EPERM for about half a millisecond
 * (measured) while the dead members wait to be reaped, so the sweep sends
 * again after each interval, which also catches a member forked since the
 * last. A group still answering after `attempts` SIGKILLs is reported as not
 * cleared: it holds a member this user may not signal, one that will not
 * die, or a dead one whose parent has not reaped it. Signalling the group
 * after its leader has ended reaches only the gate's own members: POSIX
 * reuses no process id while a process group with that id exists, and once
 * the group is empty the first ESRCH ends the sweep.
 */
export async function sweepProcessGroup(
  signal: (signal: NodeJS.Signals) => SignalOutcome,
  patience: SweepPatience,
): Promise<GroupSweep> {
  for (let attempt = 1; ; attempt += 1) {
    const step = sweepStep(signal('SIGKILL'), attempt, patience.attempts);
    if (step !== 'again') {
      return step;
    }
    await patience.sleep(patience.intervalMs);
  }
}

/**
 * The sweep's decision on the kernel's answer to SIGKILL number `attempt`
 * of `attempts`: the group is cleared once the kernel reports it gone; it
 * is not cleared if it still answers after the last SIGKILL; otherwise the
 * sweep waits and sends again.
 */
export function sweepStep(
  answer: SignalOutcome,
  attempt: number,
  attempts: number,
): GroupSweep | 'again' {
  if (answer === 'ended') {
    return 'cleared';
  }

  return attempt < attempts ? 'again' : 'not-cleared';
}

/** Signal `target`, a negated leader naming its group; any failure but ESRCH or EPERM is thrown. */
function signalTarget(target: number, signal: NodeJS.Signals, kill: Kill): SignalOutcome {
  try {
    kill(target, signal);
    return 'signalled';
  } catch (error: unknown) {
    const code = error instanceof Error && 'code' in error ? error.code : undefined;
    if (code === 'ESRCH') {
      return 'ended';
    }
    if (code === 'EPERM') {
      return 'not-permitted';
    }
    throw error;
  }
}
