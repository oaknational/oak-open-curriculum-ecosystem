import { describe, expect, it } from 'vitest';

import {
  seedSeenStateIfNeeded,
  type AutoSeedIo,
} from '../../src/collaboration-state/comms-watch-auto-seed';
import { type CommsEvent } from '../../src/collaboration-state/types';

interface FakeIoState {
  readonly seenIds: Set<string>;
  readonly events: readonly CommsEvent[];
  readSeenIdsCalls: number;
  readCommsEventsCalls: number;
  appendCalls: (readonly string[])[];
}

function makeNarrativeEvent(eventId: string, createdAt: string): CommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: eventId,
    created_at: createdAt,
    kind: 'narrative',
    author: {
      agent_name: 'Test Agent',
      platform: 'claude',
      model: 'test',
      session_id_prefix: 'abc123',
    },
    title: `event ${eventId}`,
    body: 'test body',
  };
}

function makeFakeIo(state: FakeIoState): AutoSeedIo {
  return {
    readSeenIds: async () => {
      state.readSeenIdsCalls += 1;
      return new Set(state.seenIds);
    },
    readCommsEvents: async () => {
      state.readCommsEventsCalls += 1;
      return state.events;
    },
    appendSeenMessageIds: async (_seenFile, eventIds) => {
      state.appendCalls.push(eventIds);
    },
  };
}

function makeFakeIoState(input: {
  readonly seenIds?: readonly string[];
  readonly events?: readonly CommsEvent[];
}): FakeIoState {
  return {
    seenIds: new Set(input.seenIds ?? []),
    events: input.events ?? [],
    readSeenIdsCalls: 0,
    readCommsEventsCalls: 0,
    appendCalls: [],
  };
}

describe('seedSeenStateIfNeeded — cycle 9 WS1 auto-seed contract', () => {
  it('seeds current event IDs when the seen-file is empty (auto-seed branch a)', async () => {
    const state = makeFakeIoState({
      events: [
        makeNarrativeEvent('evt-1', '2026-05-25T06:00:00Z'),
        makeNarrativeEvent('evt-2', '2026-05-25T06:01:00Z'),
      ],
    });

    const decision = await seedSeenStateIfNeeded({
      io: makeFakeIo(state),
      commsDir: '/test/comms',
      seenFile: '/test/seen.json',
      seedFromNow: false,
      noAutoSeed: false,
    });

    expect(decision).toStrictEqual({
      outcome: 'seeded',
      reason: 'auto-seed-empty-or-missing',
      eventIds: ['evt-1', 'evt-2'],
    });
    expect(state.appendCalls).toStrictEqual([['evt-1', 'evt-2']]);
  });

  it('seeds current events when the seen-file has no existing entries', async () => {
    const state = makeFakeIoState({
      events: [makeNarrativeEvent('evt-1', '2026-05-25T06:00:00Z')],
    });

    const decision = await seedSeenStateIfNeeded({
      io: makeFakeIo(state),
      commsDir: '/test/comms',
      seenFile: '/nonexistent/seen.json',
      seedFromNow: false,
      noAutoSeed: false,
    });

    expect(decision).toStrictEqual({
      outcome: 'seeded',
      reason: 'auto-seed-empty-or-missing',
      eventIds: ['evt-1'],
    });
  });

  it('seeds when --seed-from-now is set even if the seen-file already has content (branch c)', async () => {
    const state = makeFakeIoState({
      seenIds: ['evt-existing'],
      events: [makeNarrativeEvent('evt-1', '2026-05-25T06:00:00Z')],
    });

    const decision = await seedSeenStateIfNeeded({
      io: makeFakeIo(state),
      commsDir: '/test/comms',
      seenFile: '/test/seen.json',
      seedFromNow: true,
      noAutoSeed: false,
    });

    expect(decision).toStrictEqual({
      outcome: 'seeded',
      reason: 'seed-from-now',
      eventIds: ['evt-1'],
    });
    expect(state.appendCalls).toStrictEqual([['evt-1']]);
  });

  it('skips auto-seed entirely when --no-auto-seed is set (legacy replay preserved, branch d)', async () => {
    const state = makeFakeIoState({
      events: [makeNarrativeEvent('evt-1', '2026-05-25T06:00:00Z')],
    });

    const decision = await seedSeenStateIfNeeded({
      io: makeFakeIo(state),
      commsDir: '/test/comms',
      seenFile: '/test/seen.json',
      seedFromNow: false,
      noAutoSeed: true,
    });

    expect(decision).toStrictEqual({
      outcome: 'skipped',
      reason: 'no-auto-seed',
    });
    expect(state.readSeenIdsCalls).toBe(0);
    expect(state.readCommsEventsCalls).toBe(0);
    expect(state.appendCalls).toStrictEqual([]);
  });

  it('does not re-seed when the seen-file already has content (idempotent on restart)', async () => {
    const state = makeFakeIoState({
      seenIds: ['evt-prior-a', 'evt-prior-b'],
      events: [makeNarrativeEvent('evt-1', '2026-05-25T06:00:00Z')],
    });

    const decision = await seedSeenStateIfNeeded({
      io: makeFakeIo(state),
      commsDir: '/test/comms',
      seenFile: '/test/seen.json',
      seedFromNow: false,
      noAutoSeed: false,
    });

    expect(decision).toStrictEqual({
      outcome: 'skipped',
      reason: 'existing-seen-content',
    });
    expect(state.appendCalls).toStrictEqual([]);
  });

  it('--no-auto-seed has precedence over --seed-from-now when both flags are set', async () => {
    const state = makeFakeIoState({
      events: [makeNarrativeEvent('evt-1', '2026-05-25T06:00:00Z')],
    });

    const decision = await seedSeenStateIfNeeded({
      io: makeFakeIo(state),
      commsDir: '/test/comms',
      seenFile: '/test/seen.json',
      seedFromNow: true,
      noAutoSeed: true,
    });

    expect(decision).toStrictEqual({
      outcome: 'skipped',
      reason: 'no-auto-seed',
    });
    expect(state.appendCalls).toStrictEqual([]);
  });

  it('does not write to seen-file when the comms directory is empty (no spurious newline growth)', async () => {
    const state = makeFakeIoState({
      events: [],
    });

    const decision = await seedSeenStateIfNeeded({
      io: makeFakeIo(state),
      commsDir: '/test/comms',
      seenFile: '/test/seen.json',
      seedFromNow: false,
      noAutoSeed: false,
    });

    expect(decision).toStrictEqual({
      outcome: 'seeded',
      reason: 'auto-seed-empty-or-missing',
      eventIds: [],
    });
    expect(state.appendCalls).toStrictEqual([]);
  });
});
