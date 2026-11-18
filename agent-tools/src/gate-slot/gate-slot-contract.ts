/**
 * The host contract every full local gate shares: which ports hold the gate
 * slots, how many gates may run at once, and what a holder says about
 * itself. It binds every estate whose gates run on the same host: an estate
 * that adopts the gate slot uses these values unchanged, so every estate's
 * gates count toward one bound.
 *
 * Every party binds {@link GATE_SLOT_HOST} exactly, never the wildcard
 * address: on BSD a specific-address bind can coexist with a wildcard bind of
 * the same port, so only an identical address makes the bind exclusive. The
 * ports sit below 32768, outside both the macOS (49152–65535) and the Linux
 * (32768–60999) ephemeral ranges, so no port the system hands out, such as a
 * test server's, can land on a slot.
 *
 * @packageDocumentation
 */

/** The loopback address every party binds. */
export const GATE_SLOT_HOST = '127.0.0.1';

/** The mutex port, held only while one admission decision is made. */
export const GATE_SLOT_MUTEX_PORT = 23_917;

/** One port per slot. There are three, so the ceiling of three is structural. */
export const GATE_SLOT_PORTS: readonly [number, number, number] = [23_918, 23_919, 23_920];

/** How many gates may run at once; the type admits no value above the ceiling. */
export type GateSlotLimit = 1 | 2 | 3;

/**
 * The shipped limit (owner, 2026-09-07: "two, max three"). A raise is a
 * reviewed change to this line, never a flag or a variable a seat can set.
 */
export const GATE_SLOT_LIMIT: GateSlotLimit = 2;

/**
 * Set in a gate child's environment to the port its wrapper holds. A
 * `gate-slot run` that finds it refuses, because a gate never acquires
 * inside a gate. A forged value can only cause a refusal.
 */
export const GATE_SLOT_HELD_ENV = 'PRACTICE_GATE_SLOT_HELD';

/** What a holder serves, as one JSON line, to anyone who connects to its port. */
export interface GateHolderIdentity {
  /** The real path of the working tree the gate runs in. */
  readonly worktree: string;
  /** The wrapper's process id. */
  readonly pid: number;
  /** The gated command as typed, for the wait report. */
  readonly command: string;
  /** When the slot was taken, as an ISO 8601 instant. */
  readonly acquired_at: string;
}
