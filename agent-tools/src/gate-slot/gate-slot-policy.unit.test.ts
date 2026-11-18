import { describe, expect, it } from 'vitest';

import type { GateHolderIdentity } from './gate-slot-contract.js';
import { decideAdmission, type SlotObservation } from './gate-slot-policy.js';

/**
 * The admission verdict for one gate: admitted into a free slot only when no
 * holder may be working in the same tree and the host holds fewer gates than
 * the limit. A holder that did not answer may be a stopped gate in this very
 * tree, so it blocks as a same-tree holder does; a listener that answered as
 * no gate only counts. The limit is a parameter here; the fixtures use three
 * so a verdict that ignores it in favour of the shipped two fails.
 */

const HERE = '/work/here';

function holder(worktree: string, pid: number): GateHolderIdentity {
  return { worktree, pid, command: 'pnpm check', acquired_at: '2026-09-24T07:00:00.000Z' };
}

function held(port: number, identity: GateHolderIdentity): SlotObservation {
  return { port, state: 'held', holder: identity };
}

function free(port: number): SlotObservation {
  return { port, state: 'free' };
}

describe('decideAdmission', () => {
  it('admits into the first free slot when other trees hold fewer gates than the limit', () => {
    const slots = [held(1, holder('/work/a', 11)), held(2, holder('/work/b', 12)), free(3)];

    expect(decideAdmission(slots, HERE, 3)).toStrictEqual({ kind: 'admit', port: 3 });
  });

  it('refuses a second gate in the same tree below the limit, naming the holder', () => {
    const mine = held(1, holder(HERE, 21));
    const slots = [mine, free(2), free(3)];

    expect(decideAdmission(slots, HERE, 3)).toStrictEqual({ kind: 'wait', blockers: [mine] });
  });

  it('refuses at the limit while a slot is still free, naming every holder', () => {
    const a = held(1, holder('/work/a', 31));
    const b = held(2, holder('/work/b', 32));

    expect(decideAdmission([a, b, free(3)], HERE, 2)).toStrictEqual({
      kind: 'wait',
      blockers: [a, b],
    });
  });

  it('counts a listener that answered as no gate against the limit', () => {
    const foreign: SlotObservation = { port: 1, state: 'foreign' };
    const other = held(2, holder('/work/b', 42));

    expect(decideAdmission([foreign, other, free(3)], HERE, 2)).toStrictEqual({
      kind: 'wait',
      blockers: [foreign, other],
    });
  });

  it('admits beside a listener that answered as no gate while below the limit', () => {
    const slots: SlotObservation[] = [{ port: 1, state: 'foreign' }, free(2), free(3)];

    expect(decideAdmission(slots, HERE, 3)).toStrictEqual({ kind: 'admit', port: 2 });
  });

  it('refuses beside a holder that did not answer, as it may be a stopped gate in this tree', () => {
    const silent: SlotObservation = { port: 1, state: 'unanswered' };

    expect(decideAdmission([silent, free(2), free(3)], HERE, 3)).toStrictEqual({
      kind: 'wait',
      blockers: [silent],
    });
  });

  it('names the holders that may share this tree before the others', () => {
    const other = held(1, holder('/work/a', 51));
    const silent: SlotObservation = { port: 2, state: 'unanswered' };
    const mine = held(3, holder(HERE, 52));
    const decision = decideAdmission([other, silent, mine], HERE, 3);

    expect(decision).toStrictEqual({ kind: 'wait', blockers: [silent, mine, other] });
  });
});
