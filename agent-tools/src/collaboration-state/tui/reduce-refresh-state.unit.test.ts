import { describe, expect, it } from 'vitest';

import {
  initialRefreshState,
  reduceRefreshState,
  type RefreshEvent,
  type RefreshState,
} from './reduce-refresh-state.js';
import { type CollaborationTuiSnapshot } from './snapshot.js';

describe('reduceRefreshState', () => {
  it('reports status "ready" and no in-flight attempts in its initial state', () => {
    const state = initialRefreshState(snapshotAt('2026-05-13T17:00:00Z', 'Initial'));

    expect(state.status).toBe('ready');
    expect(state.snapshot.main[0]?.body).toBe('Initial');
    expect(state.latestAttemptId).toBe(0);
  });

  it('moves to "refreshing" and records the new attempt when a refresh starts', () => {
    const initial = initialRefreshState(snapshotAt('2026-05-13T17:00:00Z', 'Initial'));

    const next = reduceRefreshState(initial, { kind: 'refresh-started', attemptId: 1 });

    expect(next.status).toBe('refreshing');
    expect(next.latestAttemptId).toBe(1);
    expect(next.snapshot).toBe(initial.snapshot);
  });

  it('adopts the new snapshot and a "refreshed" status when the latest attempt succeeds', () => {
    const settled = apply(initialRefreshState(snapshotAt('2026-05-13T17:00:00Z', 'Initial')), [
      { kind: 'refresh-started', attemptId: 1 },
      {
        kind: 'refresh-succeeded',
        attemptId: 1,
        snapshot: snapshotAt('2026-05-13T17:01:00Z', 'Refreshed'),
      },
    ]);

    expect(settled.snapshot.main[0]?.body).toBe('Refreshed');
    expect(settled.status).toBe('refreshed 2026-05-13T17:01:00Z');
    expect(settled.latestAttemptId).toBe(1);
  });

  it('keeps the latest snapshot when an older attempt resolves successfully after a newer one', () => {
    const settled = apply(initialRefreshState(snapshotAt('2026-05-13T17:00:00Z', 'Initial')), [
      { kind: 'refresh-started', attemptId: 1 },
      { kind: 'refresh-started', attemptId: 2 },
      {
        kind: 'refresh-succeeded',
        attemptId: 2,
        snapshot: snapshotAt('2026-05-13T17:02:00Z', 'Second refresh'),
      },
      {
        kind: 'refresh-succeeded',
        attemptId: 1,
        snapshot: snapshotAt('2026-05-13T17:01:00Z', 'Stale first refresh'),
      },
    ]);

    expect(settled.snapshot.main[0]?.body).toBe('Second refresh');
    expect(settled.status).toBe('refreshed 2026-05-13T17:02:00Z');
  });

  it('surfaces the error message as status when the latest attempt fails', () => {
    const settled = apply(initialRefreshState(snapshotAt('2026-05-13T17:00:00Z', 'Initial')), [
      { kind: 'refresh-started', attemptId: 1 },
      {
        kind: 'refresh-failed',
        attemptId: 1,
        error: new Error('refresh source unavailable'),
      },
    ]);

    expect(settled.status).toBe('refresh source unavailable');
    expect(settled.snapshot.main[0]?.body).toBe('Initial');
  });

  it('ignores a stale refresh failure when a newer attempt has already succeeded', () => {
    const settled = apply(initialRefreshState(snapshotAt('2026-05-13T17:00:00Z', 'Initial')), [
      { kind: 'refresh-started', attemptId: 1 },
      { kind: 'refresh-started', attemptId: 2 },
      {
        kind: 'refresh-succeeded',
        attemptId: 2,
        snapshot: snapshotAt('2026-05-13T17:02:00Z', 'Second refresh'),
      },
      { kind: 'refresh-failed', attemptId: 1, error: new Error('stale refresh failed') },
    ]);

    expect(settled.snapshot.main[0]?.body).toBe('Second refresh');
    expect(settled.status).toBe('refreshed 2026-05-13T17:02:00Z');
  });

  it('ignores a stale refresh failure when a newer attempt is still in flight', () => {
    const settled = apply(initialRefreshState(snapshotAt('2026-05-13T17:00:00Z', 'Initial')), [
      { kind: 'refresh-started', attemptId: 1 },
      { kind: 'refresh-started', attemptId: 2 },
      { kind: 'refresh-failed', attemptId: 1, error: new Error('stale refresh failed') },
    ]);

    expect(settled.status).toBe('refreshing');
    expect(settled.snapshot.main[0]?.body).toBe('Initial');
  });

  it('ignores a stale refresh success when a newer attempt is still in flight', () => {
    const settled = apply(initialRefreshState(snapshotAt('2026-05-13T17:00:00Z', 'Initial')), [
      { kind: 'refresh-started', attemptId: 1 },
      { kind: 'refresh-started', attemptId: 2 },
      {
        kind: 'refresh-succeeded',
        attemptId: 1,
        snapshot: snapshotAt('2026-05-13T17:01:00Z', 'Stale first refresh'),
      },
    ]);

    expect(settled.status).toBe('refreshing');
    expect(settled.snapshot.main[0]?.body).toBe('Initial');
  });
});

function apply(state: RefreshState, events: readonly RefreshEvent[]): RefreshState {
  // S7727 false-positive: reduceRefreshState is a free (state, event) => state
  // function, correctly used as Array.reduce callback; no this-binding risk.
  return events.reduce(reduceRefreshState, state); // NOSONAR typescript:S7727
}

function snapshotAt(generatedAt: string, body: string): CollaborationTuiSnapshot {
  return {
    generated_at: generatedAt,
    main: [
      {
        id: `${generatedAt}-0`,
        created_at: generatedAt,
        kind: 'narrative',
        title: 'Live collaboration note',
        body,
        author: 'Test fixture / cursor / claude-4.6-sonnet / 46a73d',
      },
    ],
    directed: [],
    agents: [],
    queue: [],
  };
}
