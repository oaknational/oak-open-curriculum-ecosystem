import { describe, expect, it } from 'vitest';

import { parseEntry, type Entry } from './entry.js';
import { createOwnerMessageCounter, type OwnerMessageTally } from './owner-messages.js';

const HUMAN = { kind: 'human' };
const TYPED = { promptSource: 'typed', origin: HUMAN };

function entryOf(record: Record<string, unknown>): Entry {
  const entry = parseEntry(JSON.stringify(record));
  if (entry === undefined) {
    throw new Error('fixture did not parse');
  }
  return entry;
}

function turn(at: string, text: string, attribution: Record<string, unknown> = TYPED): Entry {
  return entryOf({ type: 'user', timestamp: at, ...attribution, message: { content: text } });
}

function absorbed(
  at: string,
  text: string,
  origin: Record<string, unknown> = HUMAN,
  commandMode = 'prompt',
): Entry {
  return entryOf({
    type: 'attachment',
    timestamp: at,
    attachment: { type: 'queued_command', commandMode, prompt: text, origin },
  });
}

function queue(at: string, operation: string, content?: string): Entry {
  return entryOf({ type: 'queue-operation', timestamp: at, operation, content });
}

function tallyOf(...entries: readonly Entry[]): OwnerMessageTally {
  const counter = createOwnerMessageCounter();
  for (const entry of entries) {
    counter.absorb(entry);
  }
  return counter.tally();
}

describe('createOwnerMessageCounter', () => {
  it('counts two identical short messages sent in the same minute as two', () => {
    const tally = tallyOf(turn('2026-09-16T10:00:05Z', 'go'), turn('2026-09-16T10:00:40Z', 'go'));

    expect(tally.messages).toBe(2);
  });

  it('counts a queued message once, as the mid-turn message its delivered turn records', () => {
    const tally = tallyOf(
      queue('2026-09-16T10:05:50Z', 'enqueue', 'go'),
      queue('2026-09-16T10:07:30Z', 'dequeue'),
      turn('2026-09-16T10:07:30Z', 'go', { promptSource: 'queued', origin: HUMAN }),
    );

    expect(tally).toStrictEqual({ messages: 1, midTurn: 1, filtered: 0 });
  });

  it('counts a message absorbed mid-turn, and the same words typed again after it', () => {
    const tally = tallyOf(
      queue('2026-09-16T10:00:05Z', 'enqueue', 'go'),
      queue('2026-09-16T10:00:06Z', 'remove', 'go'),
      absorbed('2026-09-16T10:00:06Z', 'go'),
      turn('2026-09-16T10:00:40Z', 'go'),
    );

    expect(tally).toStrictEqual({ messages: 2, midTurn: 1, filtered: 0 });
  });

  it('never counts a peer message absorbed mid-turn, however its text reads', () => {
    const tally = tallyOf(
      queue('2026-09-16T10:00:05Z', 'enqueue', 'please rebase onto main'),
      queue('2026-09-16T10:00:06Z', 'remove', 'please rebase onto main'),
      absorbed('2026-09-16T10:00:06Z', 'please rebase onto main', { kind: 'peer' }),
    );

    expect(tally).toStrictEqual({ messages: 0, midTurn: 0, filtered: 1 });
  });

  it('never counts a shell escape absorbed mid-turn, though the owner typed it', () => {
    const tally = tallyOf(absorbed('2026-09-16T10:00:06Z', 'git status', HUMAN, 'bash'));

    expect(tally).toStrictEqual({ messages: 0, midTurn: 0, filtered: 1 });
  });

  it('never counts a scheduled prompt delivered as a system turn', () => {
    const tally = tallyOf(
      queue('2026-09-16T10:00:00Z', 'enqueue', 'check the open pull requests'),
      queue('2026-09-16T10:00:00Z', 'dequeue'),
      turn('2026-09-16T10:00:00Z', 'check the open pull requests', {
        promptSource: 'system',
        isMeta: true,
      }),
    );

    expect(tally).toStrictEqual({ messages: 0, midTurn: 0, filtered: 1 });
  });

  it('never counts a turn the transcript attributes to no one, and counts it as excluded', () => {
    const tally = tallyOf(
      turn(
        '2026-09-16T10:00:00Z',
        '<teammate-message teammate_id="lead">status?</teammate-message>',
        {},
      ),
      turn('2026-09-16T10:01:00Z', '<bash-input>git status</bash-input>', {}),
      turn('2026-09-16T10:02:00Z', '[Request interrupted by user]', {}),
    );

    expect(tally).toStrictEqual({ messages: 0, midTurn: 0, filtered: 3 });
  });

  it('counts a compaction summary as excluded by its marker, whatever its text or attribution', () => {
    const tally = tallyOf(
      entryOf({ type: 'user', timestamp: '2026-09-16T10:00:00Z', isCompactSummary: true }),
      entryOf({
        type: 'user',
        timestamp: '2026-09-16T10:01:00Z',
        isCompactSummary: true,
        ...TYPED,
        message: { content: 'This session is being continued from a previous conversation.' },
      }),
    );

    expect(tally).toStrictEqual({ messages: 0, midTurn: 0, filtered: 2 });
  });

  it('counts an owner slash command as an action, not a message', () => {
    const tally = tallyOf(
      turn('2026-09-16T10:00:00Z', '<command-message>wrap</command-message>', { origin: HUMAN }),
    );

    expect(tally).toStrictEqual({ messages: 0, midTurn: 0, filtered: 1 });
  });

  it('reads only an absorbed prompt as a message, never another attachment that carries text', () => {
    const tally = tallyOf(
      entryOf({
        type: 'attachment',
        timestamp: '2026-09-16T10:00:00Z',
        attachment: { type: 'hook_additional_context', prompt: 'context text', origin: HUMAN },
      }),
    );

    expect(tally).toStrictEqual({ messages: 0, midTurn: 0, filtered: 0 });
  });

  it('reads a tool result as no prompt at all: neither a message nor an exclusion', () => {
    const tally = tallyOf(
      entryOf({
        type: 'user',
        timestamp: '2026-09-16T10:00:00Z',
        message: { content: [{ type: 'tool_result', tool_use_id: 'toolu_1', content: 'ok' }] },
      }),
    );

    expect(tally).toStrictEqual({ messages: 0, midTurn: 0, filtered: 0 });
  });
});
