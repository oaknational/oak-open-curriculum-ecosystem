import { describe, expect, it } from 'vitest';

import type { GateHolderIdentity } from './gate-slot-contract.js';
import { encodeHolderIdentity, holderCommand, parseHolderIdentity } from './gate-slot-identity.js';

/**
 * The identity line a holder serves on its port. It crosses from another
 * process into a seat's terminal, so only a whole, well-formed identity reads
 * as a gate: anything else a listener sends reads as foreign, and never as a
 * holder in some tree or as extra lines in a report.
 */

const IDENTITY: GateHolderIdentity = {
  worktree: '/work/here',
  pid: 4242,
  command: 'pnpm check',
  acquired_at: '2026-09-24T07:00:00.000Z',
};

/** The line a holder serves for `identity`; a refusal fails the test. */
function served(identity: GateHolderIdentity): string {
  const line = encodeHolderIdentity(identity);
  if (!line.ok) {
    throw new Error(line.error);
  }
  return line.value;
}

describe('encodeHolderIdentity', () => {
  it.each([
    { name: 'a line break', worktree: '/work/line\nbreak' },
    { name: 'a relative path', worktree: 'work/here' },
    { name: 'more characters than a reader accepts', worktree: `/${'a'.repeat(1024)}` },
    // Each lone surrogate is escaped to six characters, so this path passes
    // the field bounds and still makes a line longer than a reader reads.
    { name: 'a line longer than a reader reads', worktree: `/${'\uD800'.repeat(1000)}` },
  ])(
    'refuses a working tree with $name, which no reader could match to its tree',
    ({ worktree }) => {
      expect(encodeHolderIdentity({ ...IDENTITY, worktree }).ok).toBe(false);
    },
  );
});

describe('parseHolderIdentity', () => {
  it('reads back what a holder encodes', () => {
    expect(parseHolderIdentity(served(IDENTITY))).toStrictEqual(IDENTITY);
  });

  it.each([
    { name: 'an empty answer', text: '' },
    { name: 'a truncated line', text: served(IDENTITY).slice(0, 20) },
    { name: 'a line longer than a reader reads', text: `${served(IDENTITY)}${' '.repeat(4096)}` },
    { name: 'a missing worktree', text: JSON.stringify({ ...IDENTITY, worktree: undefined }) },
    { name: 'a relative worktree', text: JSON.stringify({ ...IDENTITY, worktree: 'work/here' }) },
    { name: 'a pid given as text', text: JSON.stringify({ ...IDENTITY, pid: '4242' }) },
    { name: 'a fractional pid', text: JSON.stringify({ ...IDENTITY, pid: 4242.5 }) },
    { name: 'a negative pid', text: JSON.stringify({ ...IDENTITY, pid: -1 }) },
    {
      name: 'a command carrying a line break',
      text: JSON.stringify({ ...IDENTITY, command: 'pnpm check\ngate-slot: admitted' }),
    },
    {
      name: 'an oversize command',
      text: JSON.stringify({ ...IDENTITY, command: 'x'.repeat(257) }),
    },
    {
      name: 'a start time that is not an instant',
      text: JSON.stringify({ ...IDENTITY, acquired_at: 'soon' }),
    },
    { name: 'a foreign greeting', text: 'SSH-2.0-OpenSSH_9.6\r\n' },
  ])('reads $name as foreign', ({ text }) => {
    expect(parseHolderIdentity(text)).toBeUndefined();
  });
});

describe('holderCommand', () => {
  it('serves a command every reader accepts, however the arguments are shaped', () => {
    const command = holderCommand(['exec', 'node', '-e', `console.log('a\nb')`, 'y'.repeat(400)]);

    expect(parseHolderIdentity(served({ ...IDENTITY, command }))).toStrictEqual({
      ...IDENTITY,
      command,
    });
  });
});
