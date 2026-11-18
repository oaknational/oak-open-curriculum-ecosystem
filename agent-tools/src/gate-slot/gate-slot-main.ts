import { err, ok, type Result } from '@oaknational/result';

import { parseGateSlotArgv } from './gate-slot-argv.js';
import { GATE_SLOT_HELD_ENV } from './gate-slot-contract.js';
import { encodeHolderIdentity, holderCommand } from './gate-slot-identity.js';
import {
  decideAdmission,
  type AdmissionDecision,
  type SlotObservation,
} from './gate-slot-policy.js';
import { describeMutexBusy, describeSlot, USAGE } from './gate-slot-report.js';
import {
  exitCodeFor,
  GATE_SLOT_POLL_MS,
  GIVE_UP_AFTER_POLLS,
  waitStep,
} from './gate-slot-schedule.js';
import type { GateChildEnd, GateSlotIo, TransactOutcome } from './gate-slot-types.js';

/** The exit code for a command-line mistake; a gate child's own code may also be 2. */
const USAGE_EXIT = 2;

/**
 * The gate-slot command: `run` holds one host gate slot for the life of a
 * pnpm command and exits with its verdict; `status` lists the slots.
 *
 * @returns The process exit code.
 */
export async function main(argv: readonly string[], io: GateSlotIo): Promise<number> {
  const command = parseGateSlotArgv(argv);
  if (command.kind === 'help') {
    io.stdout(USAGE);
    return 0;
  }
  if (command.kind === 'usage-error') {
    io.stderr(`gate-slot: ${command.message}`);
    io.stderr(USAGE);
    return USAGE_EXIT;
  }
  if (command.kind === 'status') {
    return status(io);
  }

  return run(command.pnpmArgs, io);
}

async function status(io: GateSlotIo): Promise<number> {
  io.stdout(`This working tree: ${io.worktree}`);
  const outcome = await io.observe();
  if (outcome.kind === 'failed') {
    io.stderr(`gate-slot: cannot read the gate slots: ${outcome.message}`);
    return 1;
  }
  if (outcome.kind === 'mutex-busy') {
    io.stderr(`gate-slot: cannot read the gate slots: ${describeMutexBusy(outcome.port)}`);
    return 1;
  }
  for (const slot of outcome.slots) {
    io.stdout(describeSlot(slot));
  }

  return 0;
}

async function run(pnpmArgs: readonly string[], io: GateSlotIo): Promise<number> {
  const command = holderCommand(pnpmArgs);
  const refusal = refusalFor(io);
  const admitted = refusal === undefined ? await acquire(command, io) : err(refusal);
  if (!admitted.ok) {
    io.stderr(`gate-slot: ${admitted.error}`);
    io.stderr(`gate-slot: ${command} did not run.`);
    return 1;
  }
  try {
    const child = await io.runChild({
      args: pnpmArgs,
      extraEnv: { [GATE_SLOT_HELD_ENV]: String(admitted.value.port) },
    });
    return verdict(child, io);
  } catch (error: unknown) {
    io.stderr(`gate-slot: ${command} could not run: ${describeError(error)}`);
    return 1;
  } finally {
    await releaseReporting(admitted.value, io);
  }
}

/**
 * The exit code for how the gate ended. A gate stopped at its bound, or one
 * whose process group the sweep could not clear, never passes, even if its
 * child exited 0.
 */
function verdict(child: GateChildEnd, io: GateSlotIo): number {
  const faults = [
    child.stoppedAtBoundMs === undefined
      ? undefined
      : `the gate ran past its ${child.stoppedAtBoundMs / 60_000}-minute bound and was stopped.`,
    child.groupNotCleared
      ? "the gate's process group was not cleared by repeated SIGKILLs: it holds a member " +
        'this user may not signal, one that will not die, or a dead one its parent has not reaped.'
      : undefined,
  ].filter((fault) => fault !== undefined);
  for (const fault of faults) {
    io.stderr(`gate-slot: ${fault}`);
  }

  return faults.length === 0 ? exitCodeFor(child.end) : Math.max(exitCodeFor(child.end), 1);
}

/** Why this process may not take a slot at all, or `undefined` when it may try. */
function refusalFor(io: GateSlotIo): string | undefined {
  if (io.heldMarker !== undefined) {
    return (
      `refused: this command already runs inside the gate holding port ${io.heldMarker}, ` +
      'and a gate never acquires inside a gate.'
    );
  }
  if (!io.processGroups) {
    return (
      'refused: a gate runs in its own process group so that every signal and the final sweep ' +
      'reach all of it, and this host has no process group to signal; run it from a POSIX host, ' +
      'such as WSL.'
    );
  }

  return undefined;
}

interface AdmittedSlot {
  readonly port: number;
  readonly release: () => Promise<void>;
}

async function releaseReporting(admitted: AdmittedSlot, io: GateSlotIo): Promise<void> {
  try {
    await admitted.release();
  } catch (error: unknown) {
    io.stderr(`gate-slot: releasing port ${admitted.port} failed: ${describeError(error)}`);
  }
}

/**
 * Take a slot, polling while the verdict is to wait. Each attempt stamps the
 * identity afresh, so a holder's start time is when it took its slot, and
 * refuses before binding when no reader could match that identity to its tree.
 */
async function acquire(command: string, io: GateSlotIo): Promise<Result<AdmittedSlot, string>> {
  const decide = (slots: readonly SlotObservation[]): AdmissionDecision =>
    decideAdmission(slots, io.worktree, io.limit);
  for (let poll = 1; ; poll += 1) {
    const identityLine = encodeHolderIdentity({
      worktree: io.worktree,
      pid: io.pid,
      command,
      acquired_at: io.now(),
    });
    if (!identityLine.ok) {
      return err(`refused: ${identityLine.error}`);
    }
    const outcome = await io.transact({ identityLine: identityLine.value, decide });
    if (outcome.kind === 'failed') {
      return err(`cannot read the gate slots: ${outcome.message}`);
    }
    if (outcome.kind === 'decided' && outcome.decision.kind === 'admit') {
      return ok({ port: outcome.decision.port, release: outcome.release });
    }
    const step = waitStep(poll);
    if (step.giveUp) {
      return err(
        `gave up after ${GIVE_UP_AFTER_POLLS} blocked attempts (an hour or more); the holders are named above.`,
      );
    }
    if (step.report) {
      reportWait(outcome, io);
    }
    await io.sleep(GATE_SLOT_POLL_MS);
  }
}

function reportWait(outcome: TransactOutcome, io: GateSlotIo): void {
  if (outcome.kind === 'decided' && outcome.decision.kind === 'wait') {
    io.stderr(
      `gate-slot: waiting: a gate may run in this working tree, or the host runs its limit of ${io.limit}:`,
    );
    for (const slot of outcome.decision.blockers) {
      io.stderr(describeSlot(slot));
    }
    return;
  }
  if (outcome.kind === 'mutex-busy') {
    io.stderr(`gate-slot: waiting: ${describeMutexBusy(outcome.port)}`);
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
