import type { GateHolderIdentity, GateSlotLimit } from './gate-slot-contract.js';

/** A slot port whose bind succeeded under the mutex: no live holder. */
interface FreeSlot {
  readonly port: number;
  readonly state: 'free';
}

/** A slot held by a gate that answered with its identity. */
interface HeldSlot {
  readonly port: number;
  readonly state: 'held';
  readonly holder: GateHolderIdentity;
}

/**
 * A slot whose listener accepted the connection but sent no whole line in
 * time, or refused it: a stopped or hung gate, possibly in the requesting
 * tree, or one that released between the bind and the connection.
 */
interface UnansweredSlot {
  readonly port: number;
  readonly state: 'unanswered';
}

/** A slot whose listener answered with something that is not a gate identity. */
interface ForeignSlot {
  readonly port: number;
  readonly state: 'foreign';
}

/** A slot that is not free, however its listener answered. */
export type OccupiedSlot = HeldSlot | UnansweredSlot | ForeignSlot;

/** What one probe of a slot port found under the mutex. */
export type SlotObservation = FreeSlot | OccupiedSlot;

/** A gate's verdict: admitted into a named free slot, or waiting on the named blockers. */
export type AdmissionDecision =
  | { readonly kind: 'admit'; readonly port: number }
  | { readonly kind: 'wait'; readonly blockers: readonly OccupiedSlot[] };

/**
 * Whether an occupied slot may belong to a gate in `worktree`. An unanswered
 * holder may, so it blocks as a same-tree holder does: the identity read's
 * timeout then bounds only how long a probe takes, never who is admitted.
 */
function mayShareTree(slot: OccupiedSlot, worktree: string): boolean {
  return (
    slot.state === 'unanswered' || (slot.state === 'held' && slot.holder.worktree === worktree)
  );
}

/**
 * Decide one gate's admission from every slot observed under the mutex.
 *
 * A holder that may work in the requesting tree blocks at any count, because
 * gates inside one tree run one at a time; otherwise the gate is admitted into
 * the first free slot while the host holds fewer gates than `limit`. The
 * blockers name the possible same-tree holders first, since they are the ones
 * to wait for.
 *
 * @param slots - Every slot port's observed state.
 * @param worktree - The real path of the requesting gate's working tree.
 * @param limit - How many gates may run at once.
 */
export function decideAdmission(
  slots: readonly SlotObservation[],
  worktree: string,
  limit: GateSlotLimit,
): AdmissionDecision {
  const occupied = slots.filter((slot): slot is OccupiedSlot => slot.state !== 'free');
  const sameTree = occupied.filter((slot) => mayShareTree(slot, worktree));
  const otherTrees = occupied.filter((slot) => !mayShareTree(slot, worktree));
  const firstFree = slots.find((slot) => slot.state === 'free');

  if (sameTree.length > 0 || occupied.length >= limit || firstFree === undefined) {
    return { kind: 'wait', blockers: [...sameTree, ...otherTrees] };
  }

  return { kind: 'admit', port: firstFree.port };
}
